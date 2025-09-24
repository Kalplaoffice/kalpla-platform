const AWS = require("aws-sdk");

// Initialize SES
const ses = new AWS.SES({ 
  region: process.env.AWS_REGION || "us-east-1" 
});

// Email templates
const EMAIL_TEMPLATES = {
  SUSPENDED: {
    subject: "🚫 Your Kalpla Account Has Been Suspended",
    body: `
Dear User,

Your Kalpla account has been suspended due to policy violations or pending review.

This means you will not be able to:
- Access your dashboard
- Enroll in courses
- Participate in live sessions
- Submit assignments

Please contact our support team at support@kalpla.com to resolve this issue and restore your account access.

We're here to help you get back on track with your learning journey.

Best regards,
The Kalpla Team

---
Kalpla Platform
Email: support@kalpla.com
Website: https://kalpla.com
    `.trim()
  },
  REACTIVATED: {
    subject: "✅ Your Kalpla Account Has Been Reactivated",
    body: `
Dear User,

Great news! Your Kalpla account has been reactivated and you now have full access to the platform.

You can now:
- Log in to your dashboard
- Continue your courses
- Participate in live sessions
- Submit assignments
- Access all platform features

Welcome back to your learning journey!

Best regards,
The Kalpla Team

---
Kalpla Platform
Email: support@kalpla.com
Website: https://kalpla.com
    `.trim()
  }
};

exports.handler = async (event) => {
  console.log("📧 Email notification Lambda triggered:", JSON.stringify(event, null, 2));

  try {
    // Handle DynamoDB Stream events
    if (event.Records) {
      await handleDynamoDBStreamEvent(event);
    }
    
    // Handle direct API calls
    if (event.email && event.status) {
      await handleDirectNotification(event);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email notification sent successfully" })
    };

  } catch (error) {
    console.error("❌ Error sending email notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to send email notification",
        details: error.message 
      })
    };
  }
};

async function handleDynamoDBStreamEvent(event) {
  for (const record of event.Records) {
    if (record.eventName === "MODIFY") {
      const oldImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
      const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
      
      const oldStatus = oldImage.status;
      const newStatus = newImage.status;
      const email = newImage.email;
      const firstName = newImage.firstName || "User";

      if (oldStatus !== newStatus && email) {
        await sendStatusChangeEmail(email, firstName, newStatus);
      }
    }
  }
}

async function handleDirectNotification(event) {
  const { email, firstName = "User", status } = event;
  await sendStatusChangeEmail(email, firstName, status);
}

async function sendStatusChangeEmail(email, firstName, status) {
  let template;
  
  if (status === "Suspended") {
    template = EMAIL_TEMPLATES.SUSPENDED;
  } else if (status === "Active") {
    template = EMAIL_TEMPLATES.REACTIVATED;
  } else {
    console.log(`⚠️ Unknown status: ${status}, skipping email notification`);
    return;
  }

  // Personalize the email
  const personalizedBody = template.body.replace(/Dear User,/g, `Dear ${firstName},`);

  const params = {
    Destination: { 
      ToAddresses: [email] 
    },
    Message: {
      Body: { 
        Text: { 
          Data: personalizedBody,
          Charset: "UTF-8"
        },
        Html: {
          Data: convertToHtml(personalizedBody),
          Charset: "UTF-8"
        }
      },
      Subject: { 
        Data: template.subject,
        Charset: "UTF-8"
      },
    },
    Source: process.env.SES_FROM_EMAIL || "support@kalpla.com",
    ReplyToAddresses: [process.env.SES_REPLY_TO_EMAIL || "support@kalpla.com"],
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(`✅ Email sent successfully to ${email} (${status}):`, result.MessageId);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
    throw error;
  }
}

function convertToHtml(text) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kalpla Account Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎓 Kalpla Platform</h1>
        <p>Your Learning Journey Continues</p>
      </div>
      <div class="content">
        ${text.replace(/\n/g, '<br>').replace(/Dear User,/g, '<strong>Dear User,</strong>')}
      </div>
      <div class="footer">
        <p>This is an automated message from Kalpla Platform. Please do not reply to this email.</p>
        <p>If you have any questions, contact us at support@kalpla.com</p>
      </div>
    </body>
    </html>
  `;
}

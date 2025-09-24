const AWS = require('aws-sdk');
const crypto = require('crypto');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });

// Environment variables
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYMENTS_TABLE = process.env.PAYMENTS_TABLE || 'Payments';
const ENROLLMENTS_TABLE = process.env.ENROLLMENTS_TABLE || 'Enrollments';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@kalpla.edu';

/**
 * PayU Webhook Handler
 * Handles PayU payment webhooks and processes payment confirmations
 */
exports.handler = async (event) => {
    console.log('PayU Webhook Event:', JSON.stringify(event, null, 2));
    
    try {
        // Parse the webhook payload
        const webhookData = parseWebhookPayload(event);
        
        // Validate the webhook signature
        if (!validateWebhookSignature(webhookData)) {
            console.error('Invalid webhook signature');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid signature' })
            };
        }
        
        // Process the payment
        const result = await processPayment(webhookData);
        
        // Send confirmation email
        if (result.success && result.payment.status === 'success') {
            await sendConfirmationEmail(result.payment, result.enrollment);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Webhook processed successfully',
                transactionId: webhookData.txnid
            })
        };
        
    } catch (error) {
        console.error('Error processing PayU webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

/**
 * Parse webhook payload from different sources
 */
function parseWebhookPayload(event) {
    let payload;
    
    // Handle API Gateway event
    if (event.body) {
        payload = JSON.parse(event.body);
    }
    // Handle direct Lambda invocation
    else if (event.txnid) {
        payload = event;
    }
    // Handle query parameters (PayU sometimes sends as query params)
    else if (event.queryStringParameters) {
        payload = event.queryStringParameters;
    }
    else {
        throw new Error('Invalid webhook payload format');
    }
    
    console.log('Parsed payload:', payload);
    return payload;
}

/**
 * Validate PayU webhook signature
 */
function validateWebhookSignature(data) {
    try {
        const { txnid, amount, productinfo, firstname, email, status, hash } = data;
        
        // Create hash string for validation
        const hashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
        
        // Generate hash
        const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        console.log('Generated hash:', generatedHash);
        console.log('Received hash:', hash);
        
        return generatedHash === hash;
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

/**
 * Process payment webhook data
 */
async function processPayment(webhookData) {
    const {
        txnid,
        amount,
        productinfo,
        firstname,
        lastname,
        email,
        phone,
        status,
        hash,
        mihpayid,
        net_amount_debit,
        payment_source,
        PG_TYPE,
        bank_ref_num,
        bankcode,
        error,
        error_Message
    } = webhookData;
    
    console.log('Processing payment:', txnid);
    
    // Get existing payment record
    const existingPayment = await getPaymentByTransactionId(txnid);
    
    if (!existingPayment) {
        throw new Error(`Payment record not found for transaction: ${txnid}`);
    }
    
    // Update payment record
    const updatedPayment = {
        ...existingPayment,
        transactionId: txnid,
        payuTransactionId: mihpayid,
        status: mapPayUStatus(status),
        amount: parseFloat(amount),
        netAmount: parseFloat(net_amount_debit || amount),
        paymentSource: payment_source,
        paymentGateway: PG_TYPE,
        bankReference: bank_ref_num,
        bankCode: bankcode,
        errorCode: error,
        errorMessage: error_Message,
        processedAt: new Date().toISOString(),
        webhookData: webhookData
    };
    
    // Save to DynamoDB
    await savePayment(updatedPayment);
    
    // Update enrollment status if payment is successful
    let enrollment = null;
    if (updatedPayment.status === 'success') {
        enrollment = await updateEnrollmentStatus(updatedPayment.enrollmentId, 'paid');
    } else if (updatedPayment.status === 'failed') {
        enrollment = await updateEnrollmentStatus(updatedPayment.enrollmentId, 'payment_failed');
    }
    
    return {
        success: true,
        payment: updatedPayment,
        enrollment: enrollment
    };
}

/**
 * Map PayU status to internal status
 */
function mapPayUStatus(payuStatus) {
    const statusMap = {
        'success': 'success',
        'failure': 'failed',
        'pending': 'pending',
        'cancelled': 'cancelled',
        'timeout': 'timeout'
    };
    
    return statusMap[payuStatus] || 'unknown';
}

/**
 * Get payment by transaction ID
 */
async function getPaymentByTransactionId(transactionId) {
    try {
        const params = {
            TableName: PAYMENTS_TABLE,
            IndexName: 'TransactionIdIndex',
            KeyConditionExpression: 'transactionId = :txnid',
            ExpressionAttributeValues: {
                ':txnid': transactionId
            }
        };
        
        const result = await dynamodb.query(params).promise();
        return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error('Error getting payment by transaction ID:', error);
        throw error;
    }
}

/**
 * Save payment to DynamoDB
 */
async function savePayment(payment) {
    try {
        const params = {
            TableName: PAYMENTS_TABLE,
            Item: {
                ...payment,
                updatedAt: new Date().toISOString()
            }
        };
        
        await dynamodb.put(params).promise();
        console.log('Payment saved successfully:', payment.transactionId);
    } catch (error) {
        console.error('Error saving payment:', error);
        throw error;
    }
}

/**
 * Update enrollment status
 */
async function updateEnrollmentStatus(enrollmentId, status) {
    try {
        const params = {
            TableName: ENROLLMENTS_TABLE,
            Key: {
                id: enrollmentId
            },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        };
        
        const result = await dynamodb.update(params).promise();
        console.log('Enrollment status updated:', enrollmentId, status);
        return result.Attributes;
    } catch (error) {
        console.error('Error updating enrollment status:', error);
        throw error;
    }
}

/**
 * Send confirmation email
 */
async function sendConfirmationEmail(payment, enrollment) {
    try {
        const emailParams = {
            Source: FROM_EMAIL,
            Destination: {
                ToAddresses: [payment.studentEmail]
            },
            Message: {
                Subject: {
                    Data: 'Payment Confirmation - Kalpla Education',
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: generateConfirmationEmailHTML(payment, enrollment),
                        Charset: 'UTF-8'
                    },
                    Text: {
                        Data: generateConfirmationEmailText(payment, enrollment),
                        Charset: 'UTF-8'
                    }
                }
            }
        };
        
        await ses.sendEmail(emailParams).promise();
        console.log('Confirmation email sent successfully to:', payment.studentEmail);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't throw error to avoid failing the webhook
    }
}

/**
 * Generate confirmation email HTML
 */
function generateConfirmationEmailHTML(payment, enrollment) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Confirmation - Kalpla Education</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .payment-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .success { color: #059669; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Payment Confirmation</h1>
                <p>Kalpla Education</p>
            </div>
            
            <div class="content">
                <h2>Dear ${payment.studentName},</h2>
                
                <p>We are pleased to confirm that your payment has been processed successfully!</p>
                
                <div class="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                    <p><strong>Amount:</strong> ₹${payment.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Program:</strong> ${enrollment?.programName || 'KSMP Program'}</p>
                    <p><strong>Payment Date:</strong> ${new Date(payment.processedAt).toLocaleDateString('en-IN')}</p>
                    <p><strong>Status:</strong> <span class="success">✅ Successfully Processed</span></p>
                </div>
                
                <p>Your enrollment is now confirmed and you can access your program materials and resources.</p>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br>
                The Kalpla Education Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
                <p>© 2024 Kalpla Education. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Generate confirmation email text
 */
function generateConfirmationEmailText(payment, enrollment) {
    return `
Payment Confirmation - Kalpla Education

Dear ${payment.studentName},

We are pleased to confirm that your payment has been processed successfully!

Payment Details:
- Transaction ID: ${payment.transactionId}
- Amount: ₹${payment.amount.toLocaleString('en-IN')}
- Program: ${enrollment?.programName || 'KSMP Program'}
- Payment Date: ${new Date(payment.processedAt).toLocaleDateString('en-IN')}
- Status: Successfully Processed

Your enrollment is now confirmed and you can access your program materials and resources.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The Kalpla Education Team

---
This is an automated email. Please do not reply to this email.
© 2024 Kalpla Education. All rights reserved.
    `;
}

/**
 * Test function for local development
 */
exports.testHandler = async (event) => {
    console.log('Test PayU Webhook Handler');
    
    // Mock webhook data for testing
    const mockWebhookData = {
        txnid: 'test_txn_123',
        amount: '50000',
        productinfo: 'KSMP Enrollment',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@student.kalpla.edu',
        phone: '9876543210',
        status: 'success',
        hash: 'test_hash',
        mihpayid: 'payu_123',
        net_amount_debit: '50000',
        payment_source: 'payu',
        PG_TYPE: 'CC',
        bank_ref_num: 'bank_123',
        bankcode: 'HDFC'
    };
    
    try {
        const result = await processPayment(mockWebhookData);
        console.log('Test result:', result);
        return result;
    } catch (error) {
        console.error('Test error:', error);
        throw error;
    }
};

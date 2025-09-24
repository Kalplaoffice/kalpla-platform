import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'us-east-1' });

export interface PaymentConfirmationData {
  studentName: string;
  studentEmail: string;
  transactionId: string;
  amount: number;
  currency: string;
  programName: string;
  paymentDate: string;
  status: 'success' | 'failed' | 'pending';
}

export interface EnrollmentData {
  id: string;
  programName: string;
  enrollmentDate: string;
  status: string;
}

class PaymentConfirmationEmailService {
  private fromEmail: string;
  private supportEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@kalpla.edu';
    this.supportEmail = process.env.SUPPORT_EMAIL || 'support@kalpla.edu';
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(paymentData: PaymentConfirmationData, enrollmentData?: EnrollmentData): Promise<boolean> {
    try {
      const emailParams = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [paymentData.studentEmail]
        },
        Message: {
          Subject: {
            Data: this.getEmailSubject(paymentData.status),
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: this.generateConfirmationEmailHTML(paymentData, enrollmentData),
              Charset: 'UTF-8'
            },
            Text: {
              Data: this.generateConfirmationEmailText(paymentData, enrollmentData),
              Charset: 'UTF-8'
            }
          }
        }
      };

      const command = new SendEmailCommand(emailParams);
      await sesClient.send(command);
      
      console.log('Payment confirmation email sent successfully to:', paymentData.studentEmail);
      return true;
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      return false;
    }
  }

  /**
   * Send payment failure notification
   */
  async sendPaymentFailureNotification(paymentData: PaymentConfirmationData): Promise<boolean> {
    try {
      const emailParams = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [paymentData.studentEmail]
        },
        Message: {
          Subject: {
            Data: 'Payment Failed - Kalpla Education',
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: this.generateFailureEmailHTML(paymentData),
              Charset: 'UTF-8'
            },
            Text: {
              Data: this.generateFailureEmailText(paymentData),
              Charset: 'UTF-8'
            }
          }
        }
      };

      const command = new SendEmailCommand(emailParams);
      await sesClient.send(command);
      
      console.log('Payment failure notification sent successfully to:', paymentData.studentEmail);
      return true;
    } catch (error) {
      console.error('Error sending payment failure notification:', error);
      return false;
    }
  }

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmation(enrollmentData: EnrollmentData, paymentData: PaymentConfirmationData): Promise<boolean> {
    try {
      const emailParams = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [paymentData.studentEmail]
        },
        Message: {
          Subject: {
            Data: 'Enrollment Confirmed - Welcome to Kalpla Education!',
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: this.generateEnrollmentConfirmationHTML(enrollmentData, paymentData),
              Charset: 'UTF-8'
            },
            Text: {
              Data: this.generateEnrollmentConfirmationText(enrollmentData, paymentData),
              Charset: 'UTF-8'
            }
          }
        }
      };

      const command = new SendEmailCommand(emailParams);
      await sesClient.send(command);
      
      console.log('Enrollment confirmation email sent successfully to:', paymentData.studentEmail);
      return true;
    } catch (error) {
      console.error('Error sending enrollment confirmation email:', error);
      return false;
    }
  }

  /**
   * Get email subject based on payment status
   */
  private getEmailSubject(status: string): string {
    switch (status) {
      case 'success':
        return '🎉 Payment Confirmation - Kalpla Education';
      case 'failed':
        return '❌ Payment Failed - Kalpla Education';
      case 'pending':
        return '⏳ Payment Pending - Kalpla Education';
      default:
        return 'Payment Update - Kalpla Education';
    }
  }

  /**
   * Generate confirmation email HTML
   */
  private generateConfirmationEmailHTML(paymentData: PaymentConfirmationData, enrollmentData?: EnrollmentData): string {
    const isSuccess = paymentData.status === 'success';
    const statusIcon = isSuccess ? '🎉' : '❌';
    const statusText = isSuccess ? 'Successfully Processed' : 'Failed';
    const statusColor = isSuccess ? '#059669' : '#dc2626';
    const statusBg = isSuccess ? '#d1fae5' : '#fee2e2';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Confirmation - Kalpla Education</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background-color: #f9fafb; }
            .payment-details { background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .success { background-color: ${statusBg}; color: ${statusColor}; }
            .failure { background-color: #fee2e2; color: #dc2626; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background-color: white; border-radius: 0 0 8px 8px; }
            .cta-button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .support-info { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${statusIcon} Payment ${isSuccess ? 'Confirmation' : 'Update'}</h1>
                <p>Kalpla Education</p>
            </div>
            
            <div class="content">
                <h2>Dear ${paymentData.studentName},</h2>
                
                ${isSuccess ? 
                  '<p>We are pleased to confirm that your payment has been processed successfully!</p>' :
                  '<p>We regret to inform you that your payment could not be processed at this time.</p>'
                }
                
                <div class="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
                    <p><strong>Amount:</strong> ₹${paymentData.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Program:</strong> ${paymentData.programName}</p>
                    <p><strong>Payment Date:</strong> ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${isSuccess ? 'success' : 'failure'}">${statusText}</span></p>
                </div>
                
                ${isSuccess ? 
                  '<p>Your enrollment is now confirmed and you can access your program materials and resources.</p>' :
                  '<p>Please try again or contact our support team for assistance with your payment.</p>'
                }
                
                ${isSuccess && enrollmentData ? `
                <div class="support-info">
                    <h3>Next Steps</h3>
                    <p>• Access your program dashboard</p>
                    <p>• Review the program curriculum</p>
                    <p>• Connect with your mentors</p>
                    <p>• Start your learning journey!</p>
                </div>
                ` : ''}
                
                <div class="support-info">
                    <h3>Need Help?</h3>
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team:</p>
                    <p>📧 Email: ${this.supportEmail}</p>
                    <p>📞 Phone: +91-9876543210</p>
                    <p>💬 Live Chat: Available on our website</p>
                </div>
                
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
  private generateConfirmationEmailText(paymentData: PaymentConfirmationData, enrollmentData?: EnrollmentData): string {
    const isSuccess = paymentData.status === 'success';
    const statusText = isSuccess ? 'Successfully Processed' : 'Failed';

    return `
Payment ${isSuccess ? 'Confirmation' : 'Update'} - Kalpla Education

Dear ${paymentData.studentName},

${isSuccess ? 
  'We are pleased to confirm that your payment has been processed successfully!' :
  'We regret to inform you that your payment could not be processed at this time.'
}

Payment Details:
- Transaction ID: ${paymentData.transactionId}
- Amount: ₹${paymentData.amount.toLocaleString('en-IN')}
- Program: ${paymentData.programName}
- Payment Date: ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}
- Status: ${statusText}

${isSuccess ? 
  'Your enrollment is now confirmed and you can access your program materials and resources.' :
  'Please try again or contact our support team for assistance with your payment.'
}

${isSuccess && enrollmentData ? `
Next Steps:
• Access your program dashboard
• Review the program curriculum
• Connect with your mentors
• Start your learning journey!
` : ''}

Need Help?
If you have any questions or need assistance, please don't hesitate to contact our support team:
📧 Email: ${this.supportEmail}
📞 Phone: +91-9876543210
💬 Live Chat: Available on our website

Best regards,
The Kalpla Education Team

---
This is an automated email. Please do not reply to this email.
© 2024 Kalpla Education. All rights reserved.
    `;
  }

  /**
   * Generate failure email HTML
   */
  private generateFailureEmailHTML(paymentData: PaymentConfirmationData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Failed - Kalpla Education</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background-color: #f9fafb; }
            .payment-details { background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .failure { background-color: #fee2e2; color: #dc2626; display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background-color: white; border-radius: 0 0 8px 8px; }
            .cta-button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .support-info { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ Payment Failed</h1>
                <p>Kalpla Education</p>
            </div>
            
            <div class="content">
                <h2>Dear ${paymentData.studentName},</h2>
                
                <p>We regret to inform you that your payment could not be processed at this time.</p>
                
                <div class="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
                    <p><strong>Amount:</strong> ₹${paymentData.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Program:</strong> ${paymentData.programName}</p>
                    <p><strong>Payment Date:</strong> ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}</p>
                    <p><strong>Status:</strong> <span class="failure">Failed</span></p>
                </div>
                
                <div class="support-info">
                    <h3>What to do next?</h3>
                    <p>• Check your payment method and try again</p>
                    <p>• Contact your bank if the issue persists</p>
                    <p>• Use a different payment method</p>
                    <p>• Contact our support team for assistance</p>
                </div>
                
                <div class="support-info">
                    <h3>Need Help?</h3>
                    <p>Our support team is here to help you complete your enrollment:</p>
                    <p>📧 Email: ${this.supportEmail}</p>
                    <p>📞 Phone: +91-9876543210</p>
                    <p>💬 Live Chat: Available on our website</p>
                </div>
                
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
   * Generate failure email text
   */
  private generateFailureEmailText(paymentData: PaymentConfirmationData): string {
    return `
Payment Failed - Kalpla Education

Dear ${paymentData.studentName},

We regret to inform you that your payment could not be processed at this time.

Payment Details:
- Transaction ID: ${paymentData.transactionId}
- Amount: ₹${paymentData.amount.toLocaleString('en-IN')}
- Program: ${paymentData.programName}
- Payment Date: ${new Date(paymentData.paymentDate).toLocaleDateString('en-IN')}
- Status: Failed

What to do next?
• Check your payment method and try again
• Contact your bank if the issue persists
• Use a different payment method
• Contact our support team for assistance

Need Help?
Our support team is here to help you complete your enrollment:
📧 Email: ${this.supportEmail}
📞 Phone: +91-9876543210
💬 Live Chat: Available on our website

Best regards,
The Kalpla Education Team

---
This is an automated email. Please do not reply to this email.
© 2024 Kalpla Education. All rights reserved.
    `;
  }

  /**
   * Generate enrollment confirmation HTML
   */
  private generateEnrollmentConfirmationHTML(enrollmentData: EnrollmentData, paymentData: PaymentConfirmationData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Enrollment Confirmed - Kalpla Education</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background-color: #f9fafb; }
            .enrollment-details { background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .success { background-color: #d1fae5; color: #059669; display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background-color: white; border-radius: 0 0 8px 8px; }
            .cta-button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .next-steps { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 Welcome to Kalpla Education!</h1>
                <p>Your enrollment has been confirmed</p>
            </div>
            
            <div class="content">
                <h2>Dear ${paymentData.studentName},</h2>
                
                <p>Congratulations! Your enrollment in <strong>${enrollmentData.programName}</strong> has been confirmed.</p>
                
                <div class="enrollment-details">
                    <h3>Enrollment Details</h3>
                    <p><strong>Program:</strong> ${enrollmentData.programName}</p>
                    <p><strong>Enrollment Date:</strong> ${new Date(enrollmentData.enrollmentDate).toLocaleDateString('en-IN')}</p>
                    <p><strong>Status:</strong> <span class="success">Confirmed</span></p>
                    <p><strong>Payment:</strong> ₹${paymentData.amount.toLocaleString('en-IN')} - Processed Successfully</p>
                </div>
                
                <div class="next-steps">
                    <h3>🎯 Your Learning Journey Starts Now!</h3>
                    <p>• <strong>Access Your Dashboard:</strong> Log in to your student portal</p>
                    <p>• <strong>Review Curriculum:</strong> Explore your program structure</p>
                    <p>• <strong>Meet Your Mentors:</strong> Connect with industry experts</p>
                    <p>• <strong>Join Community:</strong> Engage with fellow students</p>
                    <p>• <strong>Start Learning:</strong> Begin your first module</p>
                </div>
                
                <p>We're excited to be part of your educational journey. If you have any questions, our support team is always here to help!</p>
                
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
   * Generate enrollment confirmation text
   */
  private generateEnrollmentConfirmationText(enrollmentData: EnrollmentData, paymentData: PaymentConfirmationData): string {
    return `
Welcome to Kalpla Education!

Dear ${paymentData.studentName},

Congratulations! Your enrollment in ${enrollmentData.programName} has been confirmed.

Enrollment Details:
- Program: ${enrollmentData.programName}
- Enrollment Date: ${new Date(enrollmentData.enrollmentDate).toLocaleDateString('en-IN')}
- Status: Confirmed
- Payment: ₹${paymentData.amount.toLocaleString('en-IN')} - Processed Successfully

Your Learning Journey Starts Now!
• Access Your Dashboard: Log in to your student portal
• Review Curriculum: Explore your program structure
• Meet Your Mentors: Connect with industry experts
• Join Community: Engage with fellow students
• Start Learning: Begin your first module

We're excited to be part of your educational journey. If you have any questions, our support team is always here to help!

Best regards,
The Kalpla Education Team

---
This is an automated email. Please do not reply to this email.
© 2024 Kalpla Education. All rights reserved.
    `;
  }
}

export const paymentConfirmationEmailService = new PaymentConfirmationEmailService();

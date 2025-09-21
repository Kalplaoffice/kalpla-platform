const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// PayU configuration
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;

exports.handler = async (event) => {
    console.log('Payment webhook triggered:', JSON.stringify(event, null, 2));
    
    try {
        // Parse PayU webhook data
        const webhookData = parseWebhookData(event.body);
        
        if (!webhookData) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid webhook data'
                })
            };
        }
        
        const { txnid, status, amount, hash } = webhookData;
        
        // Verify hash
        if (!verifyPayUHash(webhookData)) {
            console.error('Invalid hash verification');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid hash'
                })
            };
        }
        
        // Get payment record
        const payment = await dynamodb.get({
            TableName: process.env.PAYMENTS_TABLE,
            Key: { id: txnid }
        }).promise();
        
        if (!payment.Item) {
            console.error('Payment record not found:', txnid);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Payment record not found'
                })
            };
        }
        
        // Update payment status
        const paymentStatus = status === 'success' ? 'SUCCESS' : 'FAILED';
        
        await dynamodb.update({
            TableName: process.env.PAYMENTS_TABLE,
            Key: { id: txnid },
            UpdateExpression: 'SET #status = :status, payuResponse = :response, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': paymentStatus,
                ':response': webhookData,
                ':updatedAt': new Date().toISOString()
            }
        }).promise();
        
        // If payment successful, enroll student in course
        if (paymentStatus === 'SUCCESS') {
            await enrollStudentInCourse(payment.Item.userId, payment.Item.courseId, txnid);
            await sendNotification(payment.Item.userId, 'payment_success', {
                courseId: payment.Item.courseId,
                amount: payment.Item.amount,
                transactionId: txnid
            });
        } else {
            await sendNotification(payment.Item.userId, 'payment_failed', {
                courseId: payment.Item.courseId,
                amount: payment.Item.amount,
                transactionId: txnid
            });
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Webhook processed successfully',
                status: paymentStatus
            })
        };
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process webhook',
                message: error.message
            })
        };
    }
};

function parseWebhookData(body) {
    try {
        // PayU sends data as form-encoded
        const params = new URLSearchParams(body);
        return {
            txnid: params.get('txnid'),
            status: params.get('status'),
            amount: params.get('amount'),
            hash: params.get('hash'),
            productinfo: params.get('productinfo'),
            firstname: params.get('firstname'),
            email: params.get('email'),
            phone: params.get('phone')
        };
    } catch (error) {
        console.error('Error parsing webhook data:', error);
        return null;
    }
}

function verifyPayUHash(webhookData) {
    try {
        const { txnid, status, amount, hash } = webhookData;
        
        // Generate hash string for verification
        const hashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${txnid}|${amount}`;
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        console.error('Error verifying hash:', error);
        return false;
    }
}

async function enrollStudentInCourse(userId, courseId, transactionId) {
    try {
        // Check if already enrolled
        const existingEnrollment = await dynamodb.query({
            TableName: process.env.COURSE_ENROLLMENTS_TABLE,
            IndexName: 'byUser',
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'courseId = :courseId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':courseId': courseId
            }
        }).promise();
        
        if (existingEnrollment.Items.length > 0) {
            console.log('Student already enrolled in course');
            return;
        }
        
        // Create enrollment
        const enrollment = {
            id: `enrollment_${userId}_${courseId}_${Date.now()}`,
            userId: userId,
            courseId: courseId,
            enrolledAt: new Date().toISOString(),
            status: 'ACTIVE',
            progress: 0,
            paymentId: transactionId,
            amount: 0, // Will be updated from payment record
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await dynamodb.put({
            TableName: process.env.COURSE_ENROLLMENTS_TABLE,
            Item: enrollment
        }).promise();
        
        console.log('Student enrolled in course successfully');
        
    } catch (error) {
        console.error('Error enrolling student in course:', error);
        throw error;
    }
}

async function sendNotification(userId, type, data) {
    try {
        const message = {
            userId: userId,
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        await sns.publish({
            TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
            Message: JSON.stringify(message),
            Subject: `Payment ${type === 'payment_success' ? 'Success' : 'Failed'}`
        }).promise();
        
        console.log('Notification sent successfully');
        
    } catch (error) {
        console.error('Error sending notification:', error);
        // Don't throw error as this is not critical
    }
}

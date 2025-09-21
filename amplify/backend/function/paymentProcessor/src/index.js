const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// PayU configuration
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID;
const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in';

exports.handler = async (event) => {
    console.log('Payment processor triggered:', JSON.stringify(event, null, 2));
    
    try {
        const { studentId, courseId, amount, currency = 'INR' } = JSON.parse(event.body);
        
        // Validate input
        if (!studentId || !courseId || !amount) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Missing required parameters',
                    message: 'studentId, courseId, and amount are required'
                })
            };
        }
        
        // Get course details
        const course = await dynamodb.get({
            TableName: process.env.COURSES_TABLE,
            Key: { id: courseId }
        }).promise();
        
        if (!course.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Course not found'
                })
            };
        }
        
        // Generate transaction ID
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create payment record
        const paymentRecord = {
            id: transactionId,
            userId: studentId,
            courseId: courseId,
            amount: amount,
            currency: currency,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await dynamodb.put({
            TableName: process.env.PAYMENTS_TABLE,
            Item: paymentRecord
        }).promise();
        
        // Generate PayU payment request
        const paymentRequest = generatePayURequest(transactionId, amount, currency, course.Item.title, studentId);
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                transactionId: transactionId,
                paymentRequest: paymentRequest,
                redirectUrl: `${PAYU_BASE_URL}/_payment`
            })
        };
        
    } catch (error) {
        console.error('Error processing payment:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to process payment',
                message: error.message
            })
        };
    }
};

function generatePayURequest(transactionId, amount, currency, productName, studentId) {
    const hashString = `${PAYU_MERCHANT_KEY}|${transactionId}|${amount}|${productName}|${studentId}|${PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    return {
        key: PAYU_MERCHANT_KEY,
        txnid: transactionId,
        amount: amount,
        productinfo: productName,
        firstname: studentId, // This should be replaced with actual student name
        email: 'student@example.com', // This should be replaced with actual student email
        phone: '9999999999', // This should be replaced with actual student phone
        surl: `${process.env.APP_URL}/payment/success`,
        furl: `${process.env.APP_URL}/payment/failure`,
        hash: hash,
        service_provider: 'payu_paisa'
    };
}

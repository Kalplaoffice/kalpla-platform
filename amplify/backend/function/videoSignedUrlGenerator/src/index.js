const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// CloudFront signing configuration
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY;

exports.handler = async (event) => {
    console.log('Video signed URL generator triggered:', JSON.stringify(event, null, 2));
    
    try {
        const { lessonId, userId, userRole } = JSON.parse(event.body);
        
        // Verify user has access to the lesson
        const hasAccess = await verifyUserAccess(lessonId, userId, userRole);
        if (!hasAccess) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: 'Access denied',
                    message: 'User does not have access to this lesson'
                })
            };
        }
        
        // Get lesson details
        const lesson = await dynamodb.get({
            TableName: process.env.LESSONS_TABLE,
            Key: { id: lessonId }
        }).promise();
        
        if (!lesson.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Lesson not found'
                })
            };
        }
        
        // Check if video is processed and ready
        if (lesson.Item.processingStatus !== 'COMPLETED') {
            return {
                statusCode: 202,
                body: JSON.stringify({
                    message: 'Video is still processing',
                    status: lesson.Item.processingStatus
                })
            };
        }
        
        // Generate signed URLs for different quality levels
        const signedUrls = {};
        const qualities = ['1080p', '720p', '480p'];
        
        for (const quality of qualities) {
            const playlistUrl = `https://${CLOUDFRONT_DOMAIN}/processed/${lessonId}/playlist_${quality}.m3u8`;
            const signedUrl = generateSignedUrl(playlistUrl, 3600); // 1 hour expiry
            signedUrls[quality] = signedUrl;
        }
        
        // Log access for analytics
        await logVideoAccess(lessonId, userId, 'playlist_requested');
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                lessonId: lessonId,
                signedUrls: signedUrls,
                expiresIn: 3600,
                duration: lesson.Item.duration
            })
        };
        
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to generate signed URL',
                message: error.message
            })
        };
    }
};

async function verifyUserAccess(lessonId, userId, userRole) {
    try {
        // Admin and instructors have access to all lessons
        if (userRole === 'Admin' || userRole === 'Instructor') {
            return true;
        }
        
        // Get lesson's course
        const lesson = await dynamodb.get({
            TableName: process.env.LESSONS_TABLE,
            Key: { id: lessonId }
        }).promise();
        
        if (!lesson.Item) {
            return false;
        }
        
        const courseId = lesson.Item.sectionId; // Assuming section has courseId
        
        // Check if user is enrolled in the course
        const enrollment = await dynamodb.query({
            TableName: process.env.COURSE_ENROLLMENTS_TABLE,
            IndexName: 'byUser',
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'courseId = :courseId AND status = :status',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':courseId': courseId,
                ':status': 'ACTIVE'
            }
        }).promise();
        
        return enrollment.Items.length > 0;
        
    } catch (error) {
        console.error('Error verifying user access:', error);
        return false;
    }
}

function generateSignedUrl(url, expiresInSeconds) {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const policy = {
        Statement: [{
            Resource: url,
            Condition: {
                DateLessThan: {
                    'AWS:EpochTime': expires
                }
            }
        }]
    };
    
    const policyString = JSON.stringify(policy);
    const signature = crypto
        .createSign('RSA-SHA1')
        .update(policyString)
        .sign(CLOUDFRONT_PRIVATE_KEY, 'base64');
    
    const queryParams = new URLSearchParams({
        'Key-Pair-Id': CLOUDFRONT_KEY_PAIR_ID,
        'Policy': Buffer.from(policyString).toString('base64'),
        'Signature': signature
    });
    
    return `${url}?${queryParams.toString()}`;
}

async function logVideoAccess(lessonId, userId, action) {
    try {
        await dynamodb.put({
            TableName: process.env.VIDEO_ACCESS_LOGS_TABLE,
            Item: {
                id: `${lessonId}_${userId}_${Date.now()}`,
                lessonId: lessonId,
                userId: userId,
                action: action,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString()
            }
        }).promise();
    } catch (error) {
        console.error('Error logging video access:', error);
    }
}

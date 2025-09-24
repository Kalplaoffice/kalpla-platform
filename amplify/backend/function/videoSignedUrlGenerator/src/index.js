const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const secretsManager = new AWS.SecretsManager();

// CloudFront signing configuration
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const CLOUDFRONT_PRIVATE_KEY_SECRET_ARN = process.env.CLOUDFRONT_PRIVATE_KEY_SECRET_ARN;

// Cache for private key to avoid repeated Secrets Manager calls
let privateKeyCache = null;
let privateKeyCacheExpiry = 0;

exports.handler = async (event) => {
    console.log('Video signed URL generator triggered:', JSON.stringify(event, null, 2));
    
    try {
        const { lessonId, userId, userRole, quality = 'auto', duration = 3600 } = JSON.parse(event.body);
        
        // Validate input parameters
        if (!lessonId || !userId || !userRole) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Missing required parameters',
                    message: 'lessonId, userId, and userRole are required'
                })
            };
        }
        
        // Verify user has access to the lesson
        const hasAccess = await verifyUserAccess(lessonId, userId, userRole);
        if (!hasAccess) {
            return {
                statusCode: 403,
                headers: getCorsHeaders(),
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
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Lesson not found'
                })
            };
        }
        
        // Check if video is processed and ready
        if (lesson.Item.processingStatus !== 'COMPLETED') {
            return {
                statusCode: 202,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    message: 'Video is still processing',
                    status: lesson.Item.processingStatus,
                    estimatedCompletionTime: lesson.Item.estimatedCompletionTime
                })
            };
        }
        
        // Get CloudFront private key
        const privateKey = await getCloudFrontPrivateKey();
        if (!privateKey) {
            throw new Error('Failed to retrieve CloudFront private key');
        }
        
        // Generate signed URLs for different quality levels
        const signedUrls = {};
        const availableQualities = ['2160p', '1080p', '720p', '480p', '360p'];
        
        for (const qualityLevel of availableQualities) {
            try {
                // Generate URLs for both manifest and segments
                const manifestUrl = `https://${CLOUDFRONT_DOMAIN}/processed/${lessonId}/${qualityLevel}/playlist.m3u8`;
                const signedManifestUrl = generateSignedUrl(manifestUrl, duration, privateKey);
                
                signedUrls[qualityLevel] = {
                    manifest: signedManifestUrl,
                    quality: qualityLevel,
                    bitrate: getBitrateForQuality(qualityLevel),
                    resolution: getResolutionForQuality(qualityLevel)
                };
            } catch (error) {
                console.warn(`Failed to generate signed URL for quality ${qualityLevel}:`, error);
                // Continue with other qualities
            }
        }
        
        // Generate thumbnail URL if available
        let thumbnailUrl = null;
        if (lesson.Item.thumbnailKey) {
            try {
                const thumbnailPath = `https://${CLOUDFRONT_DOMAIN}/thumbnails/${lessonId}/thumbnail.jpg`;
                thumbnailUrl = generateSignedUrl(thumbnailPath, duration, privateKey);
            } catch (error) {
                console.warn('Failed to generate thumbnail URL:', error);
            }
        }
        
        // Generate captions URLs if available
        const captionsUrls = {};
        if (lesson.Item.captions) {
            for (const [language, captionKey] of Object.entries(lesson.Item.captions)) {
                try {
                    const captionPath = `https://${CLOUDFRONT_DOMAIN}/captions/${lessonId}/${language}.vtt`;
                    captionsUrls[language] = generateSignedUrl(captionPath, duration, privateKey);
                } catch (error) {
                    console.warn(`Failed to generate caption URL for ${language}:`, error);
                }
            }
        }
        
        // Log access for analytics
        await logVideoAccess(lessonId, userId, 'signed_url_generated', {
            quality,
            duration,
            timestamp: new Date().toISOString()
        });
        
        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                lessonId: lessonId,
                signedUrls: signedUrls,
                thumbnailUrl: thumbnailUrl,
                captionsUrls: captionsUrls,
                expiresIn: duration,
                expiresAt: new Date(Date.now() + duration * 1000).toISOString(),
                duration: lesson.Item.duration,
                title: lesson.Item.title,
                description: lesson.Item.description,
                chapters: lesson.Item.chapters || [],
                metadata: {
                    totalQualities: Object.keys(signedUrls).length,
                    recommendedQuality: getRecommendedQuality(userRole),
                    adaptiveStreaming: true
                }
            })
        };
        
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Failed to generate signed URL',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
}

async function getCloudFrontPrivateKey() {
    // Check cache first
    if (privateKeyCache && Date.now() < privateKeyCacheExpiry) {
        return privateKeyCache;
    }
    
    try {
        const secret = await secretsManager.getSecretValue({
            SecretId: CLOUDFRONT_PRIVATE_KEY_SECRET_ARN
        }).promise();
        
        privateKeyCache = secret.SecretString;
        privateKeyCacheExpiry = Date.now() + (5 * 60 * 1000); // Cache for 5 minutes
        
        return privateKeyCache;
    } catch (error) {
        console.error('Error retrieving CloudFront private key:', error);
        return null;
    }
}

function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };
}

function getBitrateForQuality(quality) {
    const bitrates = {
        '2160p': 15000000,
        '1080p': 5000000,
        '720p': 3000000,
        '480p': 1500000,
        '360p': 800000
    };
    return bitrates[quality] || 1500000;
}

function getResolutionForQuality(quality) {
    const resolutions = {
        '2160p': '3840x2160',
        '1080p': '1920x1080',
        '720p': '1280x720',
        '480p': '854x480',
        '360p': '640x360'
    };
    return resolutions[quality] || '854x480';
}

function getRecommendedQuality(userRole) {
    // Recommend higher quality for instructors and admins
    if (userRole === 'instructor' || userRole === 'admin') {
        return '1080p';
    }
    return '720p';
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

function generateSignedUrl(url, expiresInSeconds, privateKey) {
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
        .sign(privateKey, 'base64');
    
    const queryParams = new URLSearchParams({
        'Key-Pair-Id': CLOUDFRONT_KEY_PAIR_ID,
        'Policy': Buffer.from(policyString).toString('base64'),
        'Signature': signature
    });
    
    return `${url}?${queryParams.toString()}`;
}

async function logVideoAccess(lessonId, userId, action, metadata = {}) {
    try {
        await dynamodb.put({
            TableName: process.env.VIDEO_ACCESS_LOGS_TABLE,
            Item: {
                id: `${lessonId}_${userId}_${Date.now()}`,
                lessonId: lessonId,
                userId: userId,
                action: action,
                metadata: metadata,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
            }
        }).promise();
    } catch (error) {
        console.error('Error logging video access:', error);
        // Don't throw error as this is not critical
    }
}

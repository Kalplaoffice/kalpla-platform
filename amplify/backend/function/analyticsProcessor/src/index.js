const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Analytics processor triggered:', JSON.stringify(event, null, 2));
    
    try {
        // Process different types of analytics events
        for (const record of event.Records) {
            const eventData = JSON.parse(record.body);
            
            switch (eventData.eventType) {
                case 'video_progress':
                    await processVideoProgress(eventData);
                    break;
                case 'video_event':
                    await processVideoEvent(eventData);
                    break;
                case 'video_session':
                    await processVideoSession(eventData);
                    break;
                case 'video_engagement':
                    await processVideoEngagement(eventData);
                    break;
                case 'assignment_submission':
                    await processAssignmentSubmission(eventData);
                    break;
                case 'course_enrollment':
                    await processCourseEnrollment(eventData);
                    break;
                case 'payment_completed':
                    await processPaymentCompleted(eventData);
                    break;
                default:
                    console.log('Unknown event type:', eventData.eventType);
            }
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Analytics processed successfully'
            })
        };
        
    } catch (error) {
        console.error('Error processing analytics:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process analytics',
                message: error.message
            })
        };
    }
};

async function processVideoProgress(eventData) {
    const { userId, courseId, lessonId, progressData } = eventData;
    
    try {
        // Update student progress
        await dynamodb.update({
            TableName: process.env.STUDENT_PROGRESS_TABLE,
            Key: { id: `${userId}_${lessonId}` },
            UpdateExpression: 'SET #progress = :progress, lastWatchedAt = :timestamp, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#progress': 'progress'
            },
            ExpressionAttributeValues: {
                ':progress': progressData,
                ':timestamp': new Date().toISOString(),
                ':updatedAt': new Date().toISOString()
            }
        }).promise();
        
        // Update course metrics
        await updateCourseMetrics(courseId, 'video_progress', progressData);
        
        // Update student analytics
        await updateStudentAnalytics(userId, 'video_progress', progressData);
        
        console.log('Video progress processed successfully');
        
    } catch (error) {
        console.error('Error processing video progress:', error);
        throw error;
    }
}

async function processVideoEvent(eventData) {
    const { userId, courseId, lessonId, eventType, eventDetails } = eventData;
    
    try {
        const timestamp = new Date().toISOString();
        const eventId = `${userId}_${lessonId}_${Date.now()}`;
        
        // Store detailed video event
        await dynamodb.put({
            TableName: process.env.VIDEO_EVENTS_TABLE,
            Item: {
                id: eventId,
                userId: userId,
                courseId: courseId,
                lessonId: lessonId,
                eventType: eventType, // PLAY, PAUSE, SEEK, COMPLETE, QUALITY_CHANGE, etc.
                eventDetails: eventDetails,
                timestamp: timestamp,
                createdAt: timestamp,
                ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
            }
        }).promise();
        
        // Update lesson analytics
        await updateLessonAnalytics(lessonId, eventType, eventDetails);
        
        // Update course metrics
        await updateCourseMetrics(courseId, 'video_event', { eventType, ...eventDetails });
        
        // Update student analytics
        await updateStudentAnalytics(userId, 'video_event', { eventType, ...eventDetails });
        
        console.log(`Video event ${eventType} processed successfully`);
        
    } catch (error) {
        console.error('Error processing video event:', error);
        throw error;
    }
}

async function processVideoSession(eventData) {
    const { userId, courseId, lessonId, sessionData } = eventData;
    
    try {
        const timestamp = new Date().toISOString();
        const sessionId = sessionData.sessionId || `${userId}_${lessonId}_${Date.now()}`;
        
        // Store video session data
        await dynamodb.put({
            TableName: process.env.VIDEO_SESSIONS_TABLE,
            Item: {
                id: sessionId,
                userId: userId,
                courseId: courseId,
                lessonId: lessonId,
                sessionData: sessionData,
                timestamp: timestamp,
                createdAt: timestamp,
                ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
            }
        }).promise();
        
        // Update session analytics
        await updateSessionAnalytics(sessionId, sessionData);
        
        console.log('Video session processed successfully');
        
    } catch (error) {
        console.error('Error processing video session:', error);
        throw error;
    }
}

async function processVideoEngagement(eventData) {
    const { userId, courseId, lessonId, engagementData } = eventData;
    
    try {
        const timestamp = new Date().toISOString();
        
        // Calculate engagement metrics
        const engagementMetrics = calculateEngagementMetrics(engagementData);
        
        // Store engagement data
        await dynamodb.put({
            TableName: process.env.VIDEO_ENGAGEMENT_TABLE,
            Item: {
                id: `${userId}_${lessonId}_${Date.now()}`,
                userId: userId,
                courseId: courseId,
                lessonId: lessonId,
                engagementData: engagementData,
                engagementMetrics: engagementMetrics,
                timestamp: timestamp,
                createdAt: timestamp,
                ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
            }
        }).promise();
        
        // Update aggregated engagement metrics
        await updateEngagementMetrics(userId, lessonId, engagementMetrics);
        
        console.log('Video engagement processed successfully');
        
    } catch (error) {
        console.error('Error processing video engagement:', error);
        throw error;
    }
}

async function processAssignmentSubmission(eventData) {
    const { studentId, courseId, assignmentId, submissionData } = eventData;
    
    try {
        // Update course metrics
        await updateCourseMetrics(courseId, 'assignment_submission', submissionData);
        
        // Update student analytics
        await updateStudentAnalytics(studentId, 'assignment_submission', submissionData);
        
        console.log('Assignment submission processed successfully');
        
    } catch (error) {
        console.error('Error processing assignment submission:', error);
        throw error;
    }
}

async function processCourseEnrollment(eventData) {
    const { studentId, courseId, enrollmentData } = eventData;
    
    try {
        // Update course metrics
        await updateCourseMetrics(courseId, 'enrollment', enrollmentData);
        
        // Update student analytics
        await updateStudentAnalytics(studentId, 'enrollment', enrollmentData);
        
        console.log('Course enrollment processed successfully');
        
    } catch (error) {
        console.error('Error processing course enrollment:', error);
        throw error;
    }
}

async function processPaymentCompleted(eventData) {
    const { studentId, courseId, paymentData } = eventData;
    
    try {
        // Update revenue analytics
        await updateRevenueAnalytics(paymentData);
        
        // Update course metrics
        await updateCourseMetrics(courseId, 'payment', paymentData);
        
        console.log('Payment completed processed successfully');
        
    } catch (error) {
        console.error('Error processing payment completed:', error);
        throw error;
    }
}

async function updateCourseMetrics(courseId, eventType, data) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const metricsId = `${courseId}_${today}`;
        
        const updateExpression = getUpdateExpression(eventType, data);
        const expressionValues = getExpressionValues(eventType, data);
        
        await dynamodb.update({
            TableName: process.env.COURSE_METRICS_TABLE,
            Key: { id: metricsId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionValues,
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating course metrics:', error);
        throw error;
    }
}

async function updateStudentAnalytics(studentId, eventType, data) {
    try {
        const updateExpression = getStudentUpdateExpression(eventType, data);
        const expressionValues = getStudentExpressionValues(eventType, data);
        
        await dynamodb.update({
            TableName: process.env.STUDENT_ANALYTICS_TABLE,
            Key: { id: studentId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionValues,
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating student analytics:', error);
        throw error;
    }
}

async function updateRevenueAnalytics(paymentData) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const revenueId = `revenue_${today}`;
        
        await dynamodb.update({
            TableName: process.env.REVENUE_ANALYTICS_TABLE,
            Key: { id: revenueId },
            UpdateExpression: 'ADD totalRevenue :amount, totalTransactions :count, successfulTransactions :successCount SET lastUpdated = :timestamp, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':amount': paymentData.amount,
                ':count': 1,
                ':successCount': 1,
                ':timestamp': new Date().toISOString(),
                ':updatedAt': new Date().toISOString()
            },
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating revenue analytics:', error);
        throw error;
    }
}

function getUpdateExpression(eventType, data) {
    switch (eventType) {
        case 'video_progress':
            return 'ADD totalVideoViews :count SET lastUpdated = :timestamp, updatedAt = :updatedAt';
        case 'assignment_submission':
            return 'ADD totalAssignmentsSubmitted :count SET lastUpdated = :timestamp, updatedAt = :updatedAt';
        case 'enrollment':
            return 'ADD enrolledCount :count SET lastUpdated = :timestamp, updatedAt = :updatedAt';
        case 'payment':
            return 'ADD totalRevenue :amount SET lastUpdated = :timestamp, updatedAt = :updatedAt';
        default:
            return 'SET lastUpdated = :timestamp, updatedAt = :updatedAt';
    }
}

function getExpressionValues(eventType, data) {
    const baseValues = {
        ':timestamp': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
    };
    
    switch (eventType) {
        case 'video_progress':
            return { ...baseValues, ':count': 1 };
        case 'assignment_submission':
            return { ...baseValues, ':count': 1 };
        case 'enrollment':
            return { ...baseValues, ':count': 1 };
        case 'payment':
            return { ...baseValues, ':amount': data.amount };
        default:
            return baseValues;
    }
}

function getStudentUpdateExpression(eventType, data) {
    switch (eventType) {
        case 'video_progress':
            return 'ADD totalVideoViews :count, totalTimeSpent :time SET lastActivityAt = :timestamp, updatedAt = :updatedAt';
        case 'assignment_submission':
            return 'ADD totalAssignmentsSubmitted :count SET lastActivityAt = :timestamp, updatedAt = :updatedAt';
        case 'enrollment':
            return 'ADD totalCoursesEnrolled :count SET lastActivityAt = :timestamp, updatedAt = :updatedAt';
        default:
            return 'SET lastActivityAt = :timestamp, updatedAt = :updatedAt';
    }
}

function getStudentExpressionValues(eventType, data) {
    const baseValues = {
        ':timestamp': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
    };
    
    switch (eventType) {
        case 'video_progress':
            return { ...baseValues, ':count': 1, ':time': data.timeSpent || 0 };
        case 'video_event':
            return { ...baseValues, ':count': 1 };
        case 'assignment_submission':
            return { ...baseValues, ':count': 1 };
        case 'enrollment':
            return { ...baseValues, ':count': 1 };
        default:
            return baseValues;
    }
}

// New helper functions for video analytics

async function updateLessonAnalytics(lessonId, eventType, eventDetails) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const metricsId = `${lessonId}_${today}`;
        
        let updateExpression = 'SET lastUpdated = :timestamp, updatedAt = :updatedAt';
        let expressionValues = {
            ':timestamp': new Date().toISOString(),
            ':updatedAt': new Date().toISOString()
        };
        
        switch (eventType) {
            case 'PLAY':
                updateExpression += ' ADD totalPlays :count';
                expressionValues[':count'] = 1;
                break;
            case 'PAUSE':
                updateExpression += ' ADD totalPauses :count';
                expressionValues[':count'] = 1;
                break;
            case 'COMPLETE':
                updateExpression += ' ADD totalCompletions :count';
                expressionValues[':count'] = 1;
                break;
            case 'SEEK':
                updateExpression += ' ADD totalSeeks :count';
                expressionValues[':count'] = 1;
                break;
            case 'QUALITY_CHANGE':
                updateExpression += ' ADD totalQualityChanges :count';
                expressionValues[':count'] = 1;
                break;
        }
        
        await dynamodb.update({
            TableName: process.env.LESSON_ANALYTICS_TABLE,
            Key: { id: metricsId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionValues,
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating lesson analytics:', error);
        throw error;
    }
}

async function updateSessionAnalytics(sessionId, sessionData) {
    try {
        await dynamodb.update({
            TableName: process.env.SESSION_ANALYTICS_TABLE,
            Key: { id: sessionId },
            UpdateExpression: 'SET sessionData = :sessionData, lastUpdated = :timestamp, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':sessionData': sessionData,
                ':timestamp': new Date().toISOString(),
                ':updatedAt': new Date().toISOString()
            },
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating session analytics:', error);
        throw error;
    }
}

async function updateEngagementMetrics(userId, lessonId, engagementMetrics) {
    try {
        const metricsId = `${userId}_${lessonId}`;
        
        await dynamodb.update({
            TableName: process.env.USER_ENGAGEMENT_TABLE,
            Key: { id: metricsId },
            UpdateExpression: 'SET engagementScore = :score, totalSessions = :sessions, averageWatchTime = :watchTime, completionRate = :completion, lastUpdated = :timestamp, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':score': engagementMetrics.engagementScore,
                ':sessions': engagementMetrics.totalSessions,
                ':watchTime': engagementMetrics.averageWatchTime,
                ':completion': engagementMetrics.completionRate,
                ':timestamp': new Date().toISOString(),
                ':updatedAt': new Date().toISOString()
            },
            Upsert: true
        }).promise();
        
    } catch (error) {
        console.error('Error updating engagement metrics:', error);
        throw error;
    }
}

function calculateEngagementMetrics(engagementData) {
    const {
        totalWatchTime = 0,
        totalDuration = 0,
        playCount = 0,
        pauseCount = 0,
        seekCount = 0,
        completionCount = 0,
        sessionCount = 1
    } = engagementData;
    
    // Calculate engagement score (0-100)
    const watchTimeRatio = totalDuration > 0 ? totalWatchTime / totalDuration : 0;
    const completionRate = totalDuration > 0 ? completionCount / sessionCount : 0;
    const interactionScore = Math.min(100, (playCount + pauseCount + seekCount) * 2);
    
    const engagementScore = Math.round(
        (watchTimeRatio * 40) + 
        (completionRate * 40) + 
        (interactionScore * 0.2)
    );
    
    return {
        engagementScore: Math.min(100, Math.max(0, engagementScore)),
        totalSessions: sessionCount,
        averageWatchTime: totalWatchTime / sessionCount,
        completionRate: completionRate,
        watchTimeRatio: watchTimeRatio,
        interactionScore: interactionScore,
        playCount: playCount,
        pauseCount: pauseCount,
        seekCount: seekCount
    };
}

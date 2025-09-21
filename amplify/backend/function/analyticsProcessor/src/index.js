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
    const { studentId, courseId, lessonId, progressData } = eventData;
    
    try {
        // Update student progress
        await dynamodb.update({
            TableName: process.env.STUDENT_PROGRESS_TABLE,
            Key: { id: `${studentId}_${lessonId}` },
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
        await updateStudentAnalytics(studentId, 'video_progress', progressData);
        
        console.log('Video progress processed successfully');
        
    } catch (error) {
        console.error('Error processing video progress:', error);
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
        case 'assignment_submission':
            return { ...baseValues, ':count': 1 };
        case 'enrollment':
            return { ...baseValues, ':count': 1 };
        default:
            return baseValues;
    }
}

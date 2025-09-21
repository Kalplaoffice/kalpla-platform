const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Pre token generation trigger:', JSON.stringify(event, null, 2));
    
    try {
        const { userSub } = event.request;
        
        // Get user details from DynamoDB
        const user = await dynamodb.get({
            TableName: process.env.USERS_TABLE,
            Key: { id: userSub }
        }).promise();
        
        if (!user.Item) {
            console.log('User not found in DynamoDB:', userSub);
            return event;
        }
        
        // Add custom claims to the token
        event.response.claimsToAddOrOverride = {
            'custom:user_id': userSub,
            'custom:role': user.Item.role,
            'custom:email': user.Item.email,
            'custom:first_name': user.Item.firstName,
            'custom:last_name': user.Item.lastName,
            'custom:is_active': user.Item.isActive.toString()
        };
        
        // Add role-specific claims
        if (user.Item.role === 'Instructor') {
            const instructorProfile = await dynamodb.get({
                TableName: process.env.INSTRUCTOR_PROFILES_TABLE,
                Key: { id: `instructor_${userSub}` }
            }).promise();
            
            if (instructorProfile.Item) {
                event.response.claimsToAddOrOverride['custom:instructor_status'] = instructorProfile.Item.status;
            }
        } else if (user.Item.role === 'Mentor') {
            const mentorProfile = await dynamodb.get({
                TableName: process.env.MENTOR_PROFILES_TABLE,
                Key: { id: `mentor_${userSub}` }
            }).promise();
            
            if (mentorProfile.Item) {
                event.response.claimsToAddOrOverride['custom:mentor_status'] = mentorProfile.Item.status;
            }
        }
        
        console.log('Token claims updated for user:', userSub);
        
        return event;
        
    } catch (error) {
        console.error('Error in pre token generation:', error);
        // Don't throw error to avoid blocking authentication
        return event;
    }
};

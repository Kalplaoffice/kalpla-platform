const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    console.log('Post confirmation trigger:', JSON.stringify(event, null, 2));
    
    try {
        const { userAttributes, userSub } = event.request;
        
        // Extract user details
        const email = userAttributes.email;
        const firstName = userAttributes.given_name || userAttributes.name?.split(' ')[0] || '';
        const lastName = userAttributes.family_name || userAttributes.name?.split(' ').slice(1).join(' ') || '';
        const phoneNumber = userAttributes.phone_number;
        const role = userAttributes['custom:role'] || 'Student';
        
        // Create user record in DynamoDB
        const userRecord = {
            id: userSub,
            email: email,
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName,
            role: role,
            profilePicture: userAttributes.picture || null,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await dynamodb.put({
            TableName: process.env.USERS_TABLE,
            Item: userRecord
        }).promise();
        
        // Create role-specific profile
        await createRoleSpecificProfile(userSub, role, userAttributes);
        
        // Add user to appropriate Cognito group
        await addUserToGroup(userSub, role);
        
        console.log('User created successfully:', userSub);
        
        return event;
        
    } catch (error) {
        console.error('Error in post confirmation:', error);
        throw error;
    }
};

async function createRoleSpecificProfile(userId, role, userAttributes) {
    const baseProfile = {
        id: `${role.toLowerCase()}_${userId}`,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    switch (role) {
        case 'Student':
            await dynamodb.put({
                TableName: process.env.STUDENT_PROFILES_TABLE,
                Item: {
                    ...baseProfile,
                    bio: '',
                    interests: [],
                    goals: '',
                    currentPhase: null,
                    education: '',
                    experience: '',
                    skills: [],
                    totalCoursesCompleted: 0,
                    totalHoursWatched: 0,
                    averageGrade: 0
                }
            }).promise();
            break;
            
        case 'Instructor':
            await dynamodb.put({
                TableName: process.env.INSTRUCTOR_PROFILES_TABLE,
                Item: {
                    ...baseProfile,
                    bio: '',
                    expertise: [],
                    experience: '',
                    education: '',
                    certifications: [],
                    portfolio: '',
                    linkedinProfile: '',
                    website: '',
                    status: 'PENDING'
                }
            }).promise();
            break;
            
        case 'Mentor':
            await dynamodb.put({
                TableName: process.env.MENTOR_PROFILES_TABLE,
                Item: {
                    ...baseProfile,
                    bio: '',
                    expertise: [],
                    experience: '',
                    education: '',
                    certifications: [],
                    portfolio: '',
                    linkedinProfile: '',
                    website: '',
                    assignedPhases: [],
                    maxStudentsPerPhase: 10,
                    status: 'PENDING'
                }
            }).promise();
            break;
            
        case 'Investor':
            await dynamodb.put({
                TableName: process.env.INVESTOR_PROFILES_TABLE,
                Item: {
                    ...baseProfile,
                    company: '',
                    position: '',
                    investmentFocus: [],
                    portfolioSize: '',
                    website: '',
                    linkedinProfile: '',
                    status: 'PENDING'
                }
            }).promise();
            break;
    }
}

async function addUserToGroup(userId, role) {
    try {
        const groupName = role === 'Instructor' ? 'Instructor' : 
                         role === 'Mentor' ? 'Mentor' : 
                         role === 'Admin' ? 'Admin' : 
                         role === 'Investor' ? 'Investor' : 'Student';
        
        await cognito.adminAddUserToGroup({
            UserPoolId: process.env.USER_POOL_ID,
            Username: userId,
            GroupName: groupName
        }).promise();
        
        console.log(`User ${userId} added to group ${groupName}`);
        
    } catch (error) {
        console.error('Error adding user to group:', error);
        // Don't throw error as this is not critical
    }
}

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Pre token generation trigger:', JSON.stringify(event, null, 2));
    
    try {
        const { userSub } = event.request;
        const { userAttributes } = event.request;
        
        // Extract email from user attributes
        const email = userAttributes.email || userAttributes['cognito:email'] || '';
        
        // Determine user role based on email or userSub
        let userRole = 'Student'; // Default role
        let roleSpecificClaims = {};
        
        // Role determination logic
        if (email === 'learncapacademy@gmail.com') {
            userRole = 'Admin';
        } else if (email.includes('mentor') || email.includes('instructor')) {
            userRole = 'Mentor';
        } else if (email.includes('investor') || email.includes('vc')) {
            userRole = 'Investor';
        } else if (email.includes('ksmp')) {
            userRole = 'StudentKSMP';
        }
        
        // Try to get user details from DynamoDB (if exists)
        let userDetails = null;
        try {
            const userResult = await dynamodb.get({
                TableName: process.env.USERS_TABLE || 'User-kalplaplatform-dev',
                Key: { id: userSub }
            }).promise();
            userDetails = userResult.Item;
        } catch (dbError) {
            console.log('User table not found or error accessing:', dbError.message);
        }
        
        // Base claims for all users
        const baseClaims = {
            'custom:user_id': userSub,
            'custom:role': userRole,
            'custom:email': email,
            'custom:login_method': userAttributes['cognito:user_status'] || 'email',
            'custom:is_verified': userAttributes.email_verified === 'true' ? 'true' : 'false',
            'custom:created_at': new Date().toISOString()
        };
        
        // Add user details if available from DynamoDB
        if (userDetails) {
            baseClaims['custom:first_name'] = userDetails.firstName || userDetails.name || '';
            baseClaims['custom:last_name'] = userDetails.lastName || '';
            baseClaims['custom:is_active'] = userDetails.isActive ? 'true' : 'false';
            baseClaims['custom:profile_complete'] = userDetails.profileComplete ? 'true' : 'false';
        }
        
        // Role-specific claims
        switch (userRole) {
            case 'Admin':
                roleSpecificClaims = {
                    'custom:admin_level': 'super',
                    'custom:permissions': 'all',
                    'custom:can_manage_users': 'true',
                    'custom:can_manage_courses': 'true',
                    'custom:can_manage_programs': 'true',
                    'custom:can_view_analytics': 'true',
                    'custom:can_manage_payments': 'true'
                };
                break;
                
            case 'Mentor':
                roleSpecificClaims = {
                    'custom:mentor_status': 'active',
                    'custom:can_create_courses': 'true',
                    'custom:can_grade_assignments': 'true',
                    'custom:can_manage_students': 'true',
                    'custom:can_view_mentor_dashboard': 'true',
                    'custom:specialization': userDetails?.specialization || '',
                    'custom:experience_years': userDetails?.experience || '0'
                };
                break;
                
            case 'Investor':
                roleSpecificClaims = {
                    'custom:investor_type': userDetails?.investorType || 'individual',
                    'custom:investment_range': userDetails?.investmentRange || '',
                    'custom:can_view_startups': 'true',
                    'custom:can_invest': 'true',
                    'custom:can_access_pitch_decks': 'true',
                    'custom:portfolio_size': userDetails?.portfolioSize || '0'
                };
                break;
                
            case 'StudentKSMP':
                roleSpecificClaims = {
                    'custom:student_type': 'ksmp',
                    'custom:can_access_ksmp': 'true',
                    'custom:can_apply_programs': 'true',
                    'custom:can_submit_assignments': 'true',
                    'custom:cohort_id': userDetails?.cohortId || '',
                    'custom:program_status': userDetails?.programStatus || 'active'
                };
                break;
                
            case 'Student':
            default:
                roleSpecificClaims = {
                    'custom:student_type': 'regular',
                    'custom:can_enroll_courses': 'true',
                    'custom:can_submit_assignments': 'true',
                    'custom:can_access_forum': 'true',
                    'custom:enrollment_count': userDetails?.enrollmentCount || '0',
                    'custom:completion_rate': userDetails?.completionRate || '0'
                };
                break;
        }
        
        // Combine all claims
        const allClaims = {
            ...baseClaims,
            ...roleSpecificClaims
        };
        
        // Add claims to token
        event.response.claimsToAddOrOverride = allClaims;
        
        // Add groups for Cognito authorization
        event.response.groupOverrideDetails = {
            groupsToOverride: [userRole],
            iamRolesToOverride: [],
            preferredRole: null
        };
        
        console.log('Token claims updated for user:', userSub, 'with role:', userRole);
        console.log('Claims added:', JSON.stringify(allClaims, null, 2));
        
        return event;
        
    } catch (error) {
        console.error('Error in pre token generation:', error);
        
        // Fallback: Add basic claims even if there's an error
        event.response.claimsToAddOrOverride = {
            'custom:user_id': event.request.userSub,
            'custom:role': 'Student',
            'custom:email': event.request.userAttributes.email || '',
            'custom:is_verified': 'false',
            'custom:error': 'fallback_mode'
        };
        
        return event;
    }
};

# Kalpla Authentication Setup Guide

This guide provides step-by-step instructions for setting up AWS Cognito authentication with multi-option login and role-based access control.

## Overview

The Kalpla platform implements:
- **Multi-option login**: Email, Phone Number, or Google OAuth
- **Role-based access control**: Student, Instructor, Mentor, Admin, Investor
- **Lambda triggers**: Auto-assignment and custom claims
- **Admin workflows**: Application approval and role management

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Amplify CLI installed and configured
3. Google Cloud Console project for OAuth
4. Node.js 18+ installed

## Step 1: Initialize Amplify Auth

```bash
# Navigate to your project directory
cd kalpla-platform

# Initialize Amplify (if not already done)
amplify init

# Add authentication
amplify add auth
```

### Recommended Configuration Options:

- **Default configuration with Social Provider**
- **Allow unauthenticated logins?** → No
- **Which social providers?** → Google
- **Sign-in options** → Email and Phone number
- **Auto-verified attributes** → Email and Phone Number
- **MFA** → Optional
- **User pool groups** → No (we'll create them manually)
- **Finish and push**

```bash
amplify push
```

## Step 2: Configure Google OAuth

### 2.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Application type: Web application
6. Add authorized redirect URIs:
   ```
   https://your-cognito-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
7. Note down Client ID and Client Secret

### 2.2 Configure Cognito Identity Provider

1. Go to AWS Console → Cognito → User Pools → Your Pool
2. Go to Identity providers → Add Google
3. Enter Client ID and Client Secret
4. Set scopes: `email`, `profile`, `openid`
5. Save

### 2.3 Configure App Client Settings

1. Go to App client settings
2. Enable Google provider
3. Set callback URLs:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```
4. Set sign-out URLs:
   ```
   http://localhost:3000/auth/signin
   https://yourdomain.com/auth/signin
   ```
5. Choose OAuth flow: Authorization code grant
6. Set scopes: `email`, `openid`, `profile`

## Step 3: Create Cognito Groups

Create the following groups in your User Pool:

```bash
# Using AWS CLI
aws cognito-idp create-group --user-pool-id <YOUR_USER_POOL_ID> --group-name Student --description "Students enrolled in courses"

aws cognito-idp create-group --user-pool-id <YOUR_USER_POOL_ID> --group-name Instructor --description "Course instructors"

aws cognito-idp create-group --user-pool-id <YOUR_USER_POOL_ID> --group-name Mentor --description "KSMP mentors"

aws cognito-idp create-group --user-pool-id <YOUR_USER_POOL_ID> --group-name Admin --description "Platform administrators"

aws cognito-idp create-group --user-pool-id <YOUR_USER_POOL_ID> --group-name Investor --description "Approved investors"
```

Or create them in the AWS Console:
1. Go to Cognito → User Pools → Your Pool → Groups
2. Create each group with appropriate descriptions

## Step 4: Deploy Lambda Triggers

The Lambda triggers are already configured in the project. Deploy them:

```bash
# Deploy the functions
amplify push

# Or deploy specific functions
amplify function build kalplaAuthPostConfirmation
amplify function build kalplaAuthPreTokenGeneration
amplify push
```

### 4.1 Post Confirmation Trigger

This trigger automatically:
- Adds new users to the Student group
- Creates user profile in DynamoDB
- Creates application records for non-Student roles

### 4.2 Pre Token Generation Trigger

This trigger:
- Adds custom claims to JWT tokens
- Determines primary role from group membership
- Adds role-specific attributes

## Step 5: Configure SMS (Optional)

If using phone number authentication:

1. Go to Cognito → User Pools → Your Pool → SMS and verifications
2. Set IAM role for SNS usage (Amplify can create this)
3. Optionally set origination number or Sender ID
4. **Note**: SMS usage will bill your AWS account

## Step 6: Frontend Integration

### 6.1 Install Dependencies

```bash
npm install aws-amplify @aws-amplify/ui-react
```

### 6.2 Configure Amplify

The configuration is already set up in `src/lib/amplify.ts` and `src/components/providers/AmplifyProvider.tsx`.

### 6.3 Use Authentication Components

The project includes:
- `MultiOptionSignIn` - Sign in with email/phone/Google
- `MultiOptionSignUp` - Sign up with role selection
- `UserContext` - Authentication state management
- `useRoleBasedAccess` - Role-based permissions hook

## Step 7: Test Authentication Flows

### 7.1 Test Email Sign Up

1. Go to `/auth/signup`
2. Select "Email" option
3. Fill in form and select role
4. Check email for verification code
5. Enter code to confirm account
6. Sign in and verify role assignment

### 7.2 Test Phone Sign Up

1. Go to `/auth/signup`
2. Select "Phone" option
3. Fill in form with phone number
4. Check SMS for verification code
5. Enter code to confirm account
6. Sign in and verify role assignment

### 7.3 Test Google Sign In

1. Go to `/auth/signin`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Verify account creation and role assignment

### 7.4 Test Role-Based Access

1. Sign in with different roles
2. Verify dashboard redirection
3. Check navigation items
4. Test permission-based UI elements

## Step 8: Admin Workflows

### 8.1 Approve Instructor Application

1. Admin signs in
2. Go to Admin Dashboard → Applications
3. Review instructor application
4. Click "Approve" or "Reject"
5. User receives notification
6. User's role is updated in Cognito

### 8.2 Manage User Roles

1. Admin goes to User Management
2. Select user
3. Change role (promote/demote)
4. User's Cognito groups are updated
5. User receives notification

## Step 9: Security Configuration

### 9.1 Password Policy

Configured in Cognito:
- Minimum 8 characters
- Requires uppercase, lowercase, numbers, symbols
- No password reuse

### 9.2 MFA (Optional)

Enable MFA for sensitive accounts:
1. Go to Cognito → User Pools → Your Pool → MFA
2. Enable SMS or TOTP
3. Configure MFA for Admin users

### 9.3 Account Security

- Email and phone verification required
- Account lockout after failed attempts
- Password reset via email/SMS
- Session management

## Step 10: Monitoring and Logging

### 10.1 CloudWatch Logs

Monitor Lambda triggers:
- Post Confirmation logs
- Pre Token Generation logs
- Error tracking

### 10.2 Cognito Analytics

Enable Cognito analytics:
1. Go to Cognito → User Pools → Your Pool → Analytics
2. Enable analytics
3. Monitor sign-ups, sign-ins, failures

## Troubleshooting

### Common Issues

#### 1. Google OAuth Not Working
- Check redirect URI in Google Console
- Verify Client ID/Secret in Cognito
- Ensure Google+ API is enabled

#### 2. SMS Not Sending
- Check SNS permissions
- Verify phone number format (E.164)
- Check AWS billing for SMS charges

#### 3. Lambda Triggers Failing
- Check CloudWatch logs
- Verify IAM permissions
- Check DynamoDB table names

#### 4. Role Assignment Issues
- Verify Cognito groups exist
- Check Lambda trigger logs
- Verify user pool configuration

### Debug Commands

```bash
# Check Amplify status
amplify status

# View logs
amplify logs

# Check Cognito configuration
aws cognito-idp describe-user-pool --user-pool-id <POOL_ID>

# List user groups
aws cognito-idp list-groups --user-pool-id <POOL_ID>
```

## Production Considerations

### 1. Domain Configuration
- Set up custom domain for Cognito Hosted UI
- Configure SSL certificates
- Update redirect URLs for production

### 2. Rate Limiting
- Configure Cognito rate limits
- Implement application-level rate limiting
- Monitor for abuse

### 3. Backup and Recovery
- Enable Cognito backup
- Document recovery procedures
- Test disaster recovery

### 4. Compliance
- GDPR compliance for EU users
- Data retention policies
- Audit logging

## Security Best Practices

1. **Never expose secrets** in frontend code
2. **Use HTTPS** everywhere
3. **Implement proper CORS** policies
4. **Monitor for suspicious activity**
5. **Regular security audits**
6. **Keep dependencies updated**
7. **Use least privilege** IAM policies
8. **Enable CloudTrail** for audit logging

## Support and Maintenance

### Regular Tasks
- Monitor authentication metrics
- Review failed login attempts
- Update security policies
- Test authentication flows
- Review user feedback

### Updates
- Keep Amplify CLI updated
- Update Lambda runtime versions
- Review and update dependencies
- Security patches

## Conclusion

The Kalpla authentication system provides:
- ✅ Multi-option login (Email, Phone, Google)
- ✅ Role-based access control
- ✅ Automatic user management
- ✅ Admin approval workflows
- ✅ Security best practices
- ✅ Comprehensive monitoring

The system is production-ready and can scale with your platform's growth.
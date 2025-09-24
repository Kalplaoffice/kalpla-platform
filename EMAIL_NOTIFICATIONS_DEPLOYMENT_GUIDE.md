# Email Notifications for User Suspension/Reactivation - Deployment Guide

## Overview
This guide covers the complete implementation of email notifications using AWS SES for user suspension/reactivation actions in the Kalpla platform.

## Architecture

```
Admin Dashboard → AdminService → API Route → Lambda Function → AWS SES → User Email
```

## Components Implemented

### 1. Lambda Function (`notifyUserStatusChange`)
**Location:** `amplify/backend/function/notifyUserStatusChange/`
- Handles email notifications via AWS SES
- Supports both DynamoDB Stream events and direct API calls
- Professional HTML email templates
- Error handling and logging

### 2. API Route (`/api/notifyUserStatus`)
**Location:** `src/pages/api/notifyUserStatus.ts`
- Next.js API route for Lambda invocation
- Handles direct calls from adminService
- AWS SDK integration

### 3. Updated AdminService
**Location:** `src/lib/adminService.ts`
- Enhanced `suspendUser()` and `reactivateUser()` functions
- Automatic email notification triggering
- User email and name parameters

### 4. Enhanced Admin Dashboard
**Location:** `src/app/admin/users/page.tsx`
- Notification status display
- Processing states
- Success/error feedback
- Email confirmation messages

## Deployment Steps

### Step 1: Setup AWS SES

1. **Go to AWS Console → SES**
2. **Verify your sender email/domain:**
   - Add `support@kalpla.com` (or your domain)
   - Verify the email address
3. **Move out of sandbox mode:**
   - Request production access
   - This allows sending to any email address

### Step 2: Deploy Lambda Function

```bash
cd kalpla-platform

# Add the Lambda function to Amplify
amplify add function
# Select: notifyUserStatusChange
# Choose: Node.js 18.x
# Choose: No for advanced settings

# Deploy the function
amplify push
```

### Step 3: Configure Environment Variables

Add these environment variables to your Lambda function:

```bash
# In AWS Console → Lambda → notifyUserStatusChange → Configuration → Environment variables
SES_FROM_EMAIL=support@kalpla.com
SES_REPLY_TO_EMAIL=support@kalpla.com
```

### Step 4: Update Next.js Environment Variables

Add to your `.env.local` file:

```bash
# AWS Configuration for Lambda invocation
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
NOTIFY_USER_STATUS_LAMBDA_FUNCTION_NAME=notifyUserStatusChange
```

### Step 5: Deploy Frontend Changes

```bash
# Deploy the updated admin dashboard and API routes
npm run build
npm run deploy
```

## Testing the Email Flow

### Test 1: Direct Lambda Test
1. Go to AWS Console → Lambda → notifyUserStatusChange
2. Create a test event:
```json
{
  "email": "test@example.com",
  "firstName": "Test User",
  "status": "Suspended"
}
```
3. Execute the test
4. Check SES for sent emails

### Test 2: Admin Dashboard Test
1. Login as admin
2. Navigate to Admin → Users
3. Suspend a user
4. Verify:
   - User status changes to "suspended"
   - Success notification appears
   - Email is sent to user
5. Reactivate the user
6. Verify:
   - User status changes to "active"
   - Success notification appears
   - Email is sent to user

### Test 3: Email Templates
Check that emails include:
- Professional HTML formatting
- Kalpla branding
- Clear status message
- Contact information
- Proper subject lines

## Email Templates

### Suspension Email
- **Subject:** 🚫 Your Kalpla Account Has Been Suspended
- **Content:** Professional explanation of suspension
- **CTA:** Contact support for resolution

### Reactivation Email
- **Subject:** ✅ Your Kalpla Account Has Been Reactivated
- **Content:** Welcome back message
- **CTA:** Resume learning journey

## Security Considerations

### Current Implementation
- ✅ SES verified sender emails
- ✅ Lambda function permissions
- ✅ API route authentication
- ✅ Error handling prevents data leaks

### Recommended Enhancements
1. **Rate Limiting:** Prevent email spam
2. **Email Templates:** Store in DynamoDB for easy updates
3. **Audit Logging:** Track all email notifications
4. **Bounce Handling:** Process bounced emails

## Monitoring and Troubleshooting

### CloudWatch Logs
Monitor Lambda function logs:
```bash
aws logs tail /aws/lambda/notifyUserStatusChange --follow
```

### SES Metrics
Check SES dashboard for:
- Send rate
- Bounce rate
- Complaint rate
- Delivery rate

### Common Issues

1. **SES Sandbox Mode**
   - Error: "Email address not verified"
   - Solution: Move SES out of sandbox mode

2. **Lambda Permissions**
   - Error: "Access denied"
   - Solution: Check IAM permissions for SES

3. **Email Not Sending**
   - Check Lambda logs
   - Verify SES configuration
   - Test with verified email addresses

## Production Checklist

- [ ] SES moved out of sandbox mode
- [ ] Lambda function deployed successfully
- [ ] Environment variables configured
- [ ] Email templates tested
- [ ] Admin dashboard notifications working
- [ ] Error handling tested
- [ ] Monitoring setup
- [ ] Backup email addresses configured

## Rollback Plan

If issues occur:
1. Disable email notifications in adminService
2. Revert to previous version
3. Keep user status changes working
4. Fix email issues separately

## Future Enhancements

1. **Email Preferences**
   - User-controlled notification settings
   - Different templates per user type

2. **Advanced Templates**
   - Dynamic content based on user data
   - Multi-language support

3. **Delivery Tracking**
   - Email open tracking
   - Click tracking
   - Delivery confirmations

4. **Bulk Operations**
   - Mass suspension notifications
   - Scheduled notifications

## Support

For issues:
1. Check CloudWatch logs
2. Verify SES configuration
3. Test Lambda function directly
4. Check admin dashboard console
5. Verify environment variables

## Cost Considerations

- **SES:** $0.10 per 1,000 emails
- **Lambda:** Minimal cost for email processing
- **API Gateway:** If using API Gateway (optional)

Total estimated cost: <$1/month for typical usage

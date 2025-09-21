# 🚀 Kalpla AWS Setup Guide

This guide provides step-by-step instructions for setting up all AWS services required for the Kalpla EdTech platform.

## 📋 Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- AWS Account with billing enabled

## 🏗️ AWS Services Overview

### Core Services
- **AWS Cognito** - Authentication & User Management
- **AWS AppSync** - GraphQL API
- **AWS DynamoDB** - NoSQL Database
- **AWS S3** - File Storage (Videos, Documents, Resources)
- **AWS Lambda** - Serverless Functions
- **AWS CloudFront** - CDN for Video Streaming
- **AWS MediaConvert** - Video Processing

### Additional Services
- **AWS SNS** - Notifications
- **AWS Secrets Manager** - Secure Configuration
- **AWS IAM** - Access Control
- **AWS CloudFormation** - Infrastructure as Code

## 🔧 Step-by-Step Setup

### 1. Initialize Amplify Project

```bash
cd kalpla-platform
amplify init
```

Follow the prompts:
- Project name: `kalpla-platform`
- Environment: `dev`
- Default editor: `Visual Studio Code`
- Type of app: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `out`
- Build command: `npm run build`
- Start command: `npm run start`

### 2. Add Authentication (Cognito)

```bash
amplify add auth
```

Select:
- Default configuration: `Yes`
- How do you want users to sign in: `Email` and `Phone Number`
- Do you want to configure advanced settings: `Yes`
- What attributes are required for signing up: `Email`, `Name`
- Do you want to enable any of the following capabilities: `MFA`, `Google OAuth`
- MFA: `Optional`
- MFA methods: `SMS`, `TOTP`
- Google OAuth: `Yes`
- Google Client ID: `YOUR_GOOGLE_CLIENT_ID`
- Google Client Secret: `YOUR_GOOGLE_CLIENT_SECRET`

### 3. Add API (AppSync)

```bash
amplify add api
```

Select:
- Service: `GraphQL`
- API name: `kalpla`
- Authorization: `Amazon Cognito User Pool`
- Additional authorization types: `API Key`
- Conflict resolution: `Auto Merge`

### 4. Add Storage (S3)

```bash
amplify add storage
```

Select:
- Service: `S3`
- Resource name: `kalplaStorage`
- Bucket name: `kalpla-storage-dev`
- Access: `Auth users only`
- Actions: `Create`, `Read`, `Update`, `Delete`

Repeat for additional buckets:
```bash
amplify add storage
# kalplaVideos - for video files
# kalplaDocuments - for mentor documents
```

### 5. Add Functions (Lambda)

```bash
amplify add function
```

Add each function:
- `videoUploadProcessor` - Video processing with MediaConvert
- `videoSignedUrlGenerator` - Generate signed URLs for video streaming
- `analyticsProcessor` - Process analytics events
- `kalplaAuthPostConfirmation` - Cognito post-confirmation trigger
- `kalplaAuthPreTokenGeneration` - Cognito pre-token generation trigger
- `paymentProcessor` - PayU payment processing
- `paymentWebhook` - PayU webhook handler

### 6. Configure Cognito Groups

```bash
aws cognito-idp create-group \
  --group-name "Admin" \
  --user-pool-id YOUR_USER_POOL_ID \
  --description "Administrator group"

aws cognito-idp create-group \
  --group-name "Student" \
  --user-pool-id YOUR_USER_POOL_ID \
  --description "Student group"

aws cognito-idp create-group \
  --group-name "Instructor" \
  --user-pool-id YOUR_USER_POOL_ID \
  --description "Instructor group"

aws cognito-idp create-group \
  --group-name "Mentor" \
  --user-pool-id YOUR_USER_POOL_ID \
  --description "Mentor group"

aws cognito-idp create-group \
  --group-name "Investor" \
  --user-pool-id YOUR_USER_POOL_ID \
  --description "Investor group"
```

### 7. Set up CloudFront Distribution

```bash
aws cloudformation create-stack \
  --stack-name kalpla-cloudfront \
  --template-body file://amplify/backend/cloudfront/cloudfront-distribution.json \
  --parameters ParameterKey=env,ParameterValue=dev \
               ParameterKey=S3BucketName,ParameterValue=kalpla-videos-dev \
               ParameterKey=CloudFrontKeyPairId,ParameterValue=YOUR_KEY_PAIR_ID
```

### 8. Configure MediaConvert

```bash
aws mediaconvert describe-endpoints
```

Note the endpoint URL and configure it in the Lambda function environment variables.

### 9. Set up PayU Integration

1. Create PayU merchant account
2. Get merchant key and salt
3. Store credentials in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name "kalpla/payu/merchant-key" \
  --secret-string "YOUR_PAYU_MERCHANT_KEY"

aws secretsmanager create-secret \
  --name "kalpla/payu/merchant-salt" \
  --secret-string "YOUR_PAYU_MERCHANT_SALT"
```

### 10. Deploy Backend

```bash
amplify push
```

This will deploy all configured services to AWS.

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=YOUR_USER_POOL_ID
NEXT_PUBLIC_USER_POOL_CLIENT_ID=YOUR_USER_POOL_CLIENT_ID
NEXT_PUBLIC_IDENTITY_POOL_ID=YOUR_IDENTITY_POOL_ID
NEXT_PUBLIC_GRAPHQL_ENDPOINT=YOUR_GRAPHQL_ENDPOINT
NEXT_PUBLIC_S3_BUCKET=kalpla-storage-dev
NEXT_PUBLIC_VIDEO_BUCKET=kalpla-videos-dev
NEXT_PUBLIC_DOCUMENTS_BUCKET=kalpla-documents-dev
NEXT_PUBLIC_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PayU Configuration
NEXT_PUBLIC_PAYU_MERCHANT_KEY=YOUR_PAYU_MERCHANT_KEY
NEXT_PUBLIC_PAYU_MERCHANT_SALT=YOUR_PAYU_MERCHANT_SALT
NEXT_PUBLIC_PAYU_BASE_URL=https://test.payu.in

# CloudFront Configuration
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=YOUR_CLOUDFRONT_DOMAIN
NEXT_PUBLIC_CLOUDFRONT_KEY_PAIR_ID=YOUR_CLOUDFRONT_KEY_PAIR_ID

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## 📊 Database Schema

The platform uses DynamoDB with the following main tables:

- **Users** - User profiles and authentication
- **Courses** - Course information and metadata
- **Lessons** - Individual lesson content
- **CourseSections** - Course structure organization
- **Assignments** - Assignment definitions
- **AssignmentSubmissions** - Student submissions
- **StudentProgress** - Learning progress tracking
- **CourseEnrollments** - Student enrollments
- **Payments** - Payment transactions
- **LiveSessions** - Live class sessions
- **Analytics** - Various analytics data

## 🎥 Video Processing Pipeline

1. **Upload** - Videos uploaded to S3
2. **Trigger** - S3 event triggers Lambda
3. **Process** - MediaConvert creates HLS streams
4. **Store** - Processed videos stored in S3
5. **Serve** - CloudFront serves with signed URLs

## 💳 Payment Integration

1. **Initiate** - Student clicks enroll
2. **Process** - Lambda generates PayU request
3. **Redirect** - Student redirected to PayU
4. **Complete** - PayU webhook updates enrollment
5. **Notify** - SNS sends confirmation

## 🔍 Monitoring & Analytics

- **CloudWatch** - Lambda function logs
- **DynamoDB** - Database metrics
- **CloudFront** - CDN analytics
- **Custom Analytics** - Learning progress tracking

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
amplify publish
```

## 🛠️ Troubleshooting

### Common Issues

1. **Cognito Groups Not Working**
   - Ensure groups are created in the correct User Pool
   - Check Lambda trigger permissions

2. **Video Processing Fails**
   - Verify MediaConvert endpoint
   - Check S3 bucket permissions
   - Ensure Lambda has correct IAM roles

3. **Payment Webhook Issues**
   - Verify PayU webhook URL
   - Check Lambda function logs
   - Ensure hash verification is working

4. **GraphQL Schema Errors**
   - Check schema syntax
   - Verify field types and relationships
   - Ensure proper authorization rules

### Debug Commands

```bash
# Check Amplify status
amplify status

# View function logs
amplify function logs videoUploadProcessor

# Check API schema
amplify api gql-compile

# View storage configuration
amplify storage console
```

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [PayU Integration Guide](https://payu.in/docs/)

## 🎯 Next Steps

1. **Test Authentication** - Verify sign-up/sign-in flows
2. **Test Video Upload** - Upload and process a test video
3. **Test Payment Flow** - Complete a test payment
4. **Monitor Performance** - Set up CloudWatch alarms
5. **Scale Testing** - Load test with multiple users

---

**Note**: This setup creates a development environment. For production, ensure proper security configurations, monitoring, and backup strategies are in place.

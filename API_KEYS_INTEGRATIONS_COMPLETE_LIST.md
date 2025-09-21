# 🔑 Kalpla Platform - Complete API Keys & Integrations List

## Overview

This document provides a comprehensive list of all API keys, credentials, and external service integrations required for the Kalpla EdTech platform. Each integration is categorized by service type and includes setup instructions.

## 🏗️ AWS Services & Credentials

### 1. AWS Account Configuration
```bash
# AWS CLI Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_SESSION_TOKEN=your-session-token (if using temporary credentials)
```

### 2. AWS Amplify Configuration
```bash
# Amplify Project Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AMPLIFY_PROJECT_ID=your-amplify-project-id
NEXT_PUBLIC_AMPLIFY_APP_ID=your-amplify-app-id
```

### 3. AWS Cognito Configuration
```bash
# Cognito User Pool
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_USER_POOL_CLIENT_ID=your-client-id
COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
COGNITO_REGION=us-east-1
```

### 4. AWS AppSync Configuration
```bash
# GraphQL API
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_REGION=us-east-1
NEXT_PUBLIC_APPSYNC_AUTHENTICATION_TYPE=AMAZON_COGNITO_USER_POOLS
```

### 5. AWS S3 Configuration
```bash
# S3 Buckets
NEXT_PUBLIC_S3_BUCKET=kalpla-storage-us-east-1-xxxxxxxxxx
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_ACCESS_LEVEL=private
```

### 6. AWS CloudFront Configuration
```bash
# CloudFront Distribution
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
NEXT_PUBLIC_CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
```

### 7. AWS Lambda Configuration
```bash
# Lambda Functions
LAMBDA_PAYMENT_PROCESSOR_ARN=arn:aws:lambda:us-east-1:123456789012:function:paymentProcessor
LAMBDA_PAYMENT_WEBHOOK_ARN=arn:aws:lambda:us-east-1:123456789012:function:paymentWebhook
LAMBDA_ANALYTICS_PROCESSOR_ARN=arn:aws:lambda:us-east-1:123456789012:function:analyticsProcessor
LAMBDA_VIDEO_PROCESSOR_ARN=arn:aws:lambda:us-east-1:123456789012:function:videoProcessor
```

### 8. AWS SES Configuration
```bash
# Email Service
SES_REGION=us-east-1
SES_FROM_EMAIL=noreply@kalpla.com
SES_FROM_NAME=Kalpla Platform
```

### 9. AWS SNS Configuration
```bash
# Push Notifications
SNS_REGION=us-east-1
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:kalpla-notifications
```

### 10. AWS MediaConvert Configuration
```bash
# Video Processing
MEDIACONVERT_ENDPOINT=https://xxxxxxxxx.mediaconvert.us-east-1.amazonaws.com
MEDIACONVERT_ROLE_ARN=arn:aws:iam::123456789012:role/MediaConvertRole
```

### 11. Amazon IVS Configuration
```bash
# Live Streaming
IVS_REGION=us-east-1
IVS_CHANNEL_ARN=arn:aws:ivs:us-east-1:123456789012:channel/xxxxxxxxx
IVS_STREAM_KEY=sk_us-east-1_xxxxxxxxx
IVS_PLAYBACK_URL=https://xxxxxxxxx.us-east-1.playback.live-video.net/api/video/v1/us-east-1.123456789012.channel.xxxxxxxxx.m3u8
```

## 💳 Payment Gateway Integration

### 1. PayU Payment Gateway
```bash
# PayU Merchant Configuration
PAYU_MERCHANT_ID=your-merchant-id
PAYU_MERCHANT_KEY=your-merchant-key
PAYU_MERCHANT_SALT=your-merchant-salt
PAYU_BASE_URL=https://secure.payu.in/_payment
PAYU_SUCCESS_URL=https://yourdomain.com/payment/success
PAYU_FAILURE_URL=https://yourdomain.com/payment/failure
PAYU_WEBHOOK_URL=https://yourdomain.com/api/payment/webhook
PAYU_REFUND_URL=https://info.payu.in/merchant/postservice.php
```

### 2. PayU Test Environment
```bash
# PayU Test Configuration
PAYU_TEST_MERCHANT_ID=your-test-merchant-id
PAYU_TEST_MERCHANT_KEY=your-test-merchant-key
PAYU_TEST_MERCHANT_SALT=your-test-merchant-salt
PAYU_TEST_BASE_URL=https://test.payu.in/_payment
```

## 🔐 Authentication & Social Login

### 1. Google OAuth Integration
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
GOOGLE_SCOPE=email profile openid
```

### 2. JWT Configuration
```bash
# JWT Secret for Video Access
JWT_SECRET=your-jwt-secret-key-for-video-access
JWT_EXPIRES_IN=1h
```

## 📧 Communication Services

### 1. Email Service (AWS SES)
```bash
# Email Templates
SES_WELCOME_TEMPLATE=kalpla-welcome-email
SES_PAYMENT_SUCCESS_TEMPLATE=kalpla-payment-success
SES_PAYMENT_FAILURE_TEMPLATE=kalpla-payment-failure
SES_COURSE_ENROLLMENT_TEMPLATE=kalpla-course-enrollment
SES_ASSIGNMENT_GRADED_TEMPLATE=kalpla-assignment-graded
```

### 2. SMS Service (AWS SNS)
```bash
# SMS Configuration
SNS_SMS_SENDER_ID=KALPLA
SNS_SMS_REGION=us-east-1
```

## 🎥 Video & Media Services

### 1. Video Processing Pipeline
```bash
# MediaConvert Configuration
MEDIACONVERT_OUTPUT_BUCKET=kalpla-video-output-us-east-1-xxxxxxxxxx
MEDIACONVERT_THUMBNAIL_BUCKET=kalpla-thumbnails-us-east-1-xxxxxxxxxx
MEDIACONVERT_CAPTIONS_BUCKET=kalpla-captions-us-east-1-xxxxxxxxxx
```

### 2. Video Storage Configuration
```bash
# S3 Video Buckets
VIDEO_UPLOAD_BUCKET=kalpla-video-uploads-us-east-1-xxxxxxxxxx
VIDEO_HLS_BUCKET=kalpla-hls-output-us-east-1-xxxxxxxxxx
VIDEO_THUMBNAIL_BUCKET=kalpla-thumbnails-us-east-1-xxxxxxxxxx
```

## 📊 Analytics & Monitoring

### 1. CloudWatch Configuration
```bash
# CloudWatch Logs
CLOUDWATCH_LOG_GROUP=/aws/lambda/kalpla-functions
CLOUDWATCH_LOG_RETENTION_DAYS=14
```

### 2. Analytics Processing
```bash
# Analytics Configuration
ANALYTICS_PROCESSOR_SCHEDULE_DAILY=cron(0 2 * * ? *)
ANALYTICS_PROCESSOR_SCHEDULE_WEEKLY=cron(0 3 ? * SUN *)
ANALYTICS_PROCESSOR_SCHEDULE_MONTHLY=cron(0 4 1 * ? *)
```

## 🌐 Domain & SSL Configuration

### 1. Domain Configuration
```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://kalpla.com
NEXT_PUBLIC_API_URL=https://api.kalpla.com
NEXT_PUBLIC_CDN_URL=https://cdn.kalpla.com
```

### 2. SSL Certificates
```bash
# SSL Certificate ARNs
SSL_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SSL_CERTIFICATE_DOMAIN=kalpla.com
SSL_CERTIFICATE_WILDCARD=*.kalpla.com
```

## 🔒 Security & Encryption

### 1. Encryption Keys
```bash
# KMS Configuration
KMS_KEY_ID=arn:aws:kms:us-east-1:123456789012:key/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
KMS_KEY_ALIAS=kalpla-encryption-key
```

### 2. Secrets Management
```bash
# AWS Secrets Manager
SECRETS_MANAGER_SECRET_NAME=kalpla/production/secrets
SECRETS_MANAGER_REGION=us-east-1
```

## 📱 Mobile & Push Notifications

### 1. Firebase Configuration (if using)
```bash
# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=kalpla.firebaseapp.com
FIREBASE_PROJECT_ID=kalpla-project-id
FIREBASE_STORAGE_BUCKET=kalpla.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxx
```

### 2. Push Notification Service
```bash
# Push Notification Configuration
PUSH_NOTIFICATION_VAPID_PUBLIC_KEY=your-vapid-public-key
PUSH_NOTIFICATION_VAPID_PRIVATE_KEY=your-vapid-private-key
PUSH_NOTIFICATION_VAPID_SUBJECT=mailto:admin@kalpla.com
```

## 🗄️ Database Configuration

### 1. DynamoDB Configuration
```bash
# DynamoDB Tables
DYNAMODB_USER_TABLE=User
DYNAMODB_COURSE_TABLE=Course
DYNAMODB_ENROLLMENT_TABLE=CourseEnrollment
DYNAMODB_PAYMENT_TABLE=Payment
DYNAMODB_ANALYTICS_TABLE=StudentProgress
DYNAMODB_METRICS_TABLE=CourseMetrics
```

### 2. Database Indexes
```bash
# Global Secondary Indexes
GSI_USER_EMAIL=byEmail
GSI_USER_ROLE=byRole
GSI_COURSE_INSTRUCTOR=byInstructor
GSI_ENROLLMENT_STUDENT=byStudent
GSI_ENROLLMENT_COURSE=byCourse
```

## 🔧 Development & Testing

### 1. Development Environment
```bash
# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=dev
DEBUG=true
LOG_LEVEL=debug
```

### 2. Testing Configuration
```bash
# Test Environment
TEST_DATABASE_URL=your-test-database-url
TEST_AWS_REGION=us-east-1
TEST_PAYU_MERCHANT_ID=test-merchant-id
TEST_GOOGLE_CLIENT_ID=test-google-client-id
```

## 📋 Setup Instructions

### 1. AWS Account Setup
1. Create AWS Account
2. Set up IAM user with appropriate permissions
3. Configure AWS CLI with credentials
4. Enable required AWS services

### 2. PayU Account Setup
1. Register for PayU merchant account
2. Complete KYC verification
3. Get merchant credentials
4. Configure webhook URLs
5. Test payment flow

### 3. Google OAuth Setup
1. Create Google Cloud Project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs
5. Add domain verification

### 4. Domain & SSL Setup
1. Purchase domain
2. Configure DNS records
3. Request SSL certificate from AWS ACM
4. Configure CloudFront distribution
5. Set up custom domain

### 5. Environment Variables Setup
1. Create `.env.local` file
2. Add all required environment variables
3. Set up AWS Secrets Manager
4. Configure CI/CD environment variables
5. Test all integrations

## 🚨 Security Checklist

### 1. Credential Security
- [ ] Store sensitive credentials in AWS Secrets Manager
- [ ] Use IAM roles instead of access keys where possible
- [ ] Enable MFA for all AWS accounts
- [ ] Rotate credentials regularly
- [ ] Use least privilege principle

### 2. API Security
- [ ] Enable API Gateway authentication
- [ ] Use HTTPS for all API calls
- [ ] Implement rate limiting
- [ ] Validate all input parameters
- [ ] Log all API access

### 3. Data Security
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit
- [ ] Use secure headers
- [ ] Implement CORS properly
- [ ] Regular security audits

## 📞 Support & Troubleshooting

### 1. Common Issues
- **AWS Credentials**: Check IAM permissions and region
- **PayU Integration**: Verify merchant credentials and webhook URLs
- **Google OAuth**: Check redirect URIs and client configuration
- **SSL Certificates**: Ensure domain verification and DNS configuration

### 2. Debugging Tools
- **AWS CloudWatch**: Monitor Lambda functions and API calls
- **PayU Dashboard**: Check transaction status and webhook logs
- **Google Cloud Console**: Monitor OAuth usage and errors
- **Browser DevTools**: Debug frontend API calls

### 3. Contact Information
- **AWS Support**: Enterprise support plan recommended
- **PayU Support**: Merchant support portal
- **Google Support**: Cloud support for OAuth issues
- **Domain Registrar**: For DNS and SSL issues

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [PayU Integration Guide](https://payu.in/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)
- [SSL Certificate Setup](https://docs.aws.amazon.com/acm/latest/userguide/)

---

This comprehensive list covers all API keys, credentials, and integrations required for the Kalpla platform. Ensure all credentials are properly secured and stored using AWS Secrets Manager or similar secure storage solutions.

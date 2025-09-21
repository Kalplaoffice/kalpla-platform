# 🎬 Video Player Deployment Guide

This guide covers the complete deployment of the Kalpla Video Player system to AWS, including Lambda functions, CloudFront distribution, S3 storage, and DynamoDB tables.

## 📋 Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS Amplify CLI installed
- Access to AWS Console

## 🚀 Deployment Steps

### 1. Initialize AWS Amplify

```bash
# Initialize Amplify project
amplify init

# Follow the prompts:
# - Project name: kalpla-platform
# - Environment: dev
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: out
# - Build command: npm run build
# - Start command: npm run start
```

### 2. Add Authentication

```bash
# Add Cognito authentication
amplify add auth

# Select configuration:
# - Default configuration with Social Provider (Federated)
# - User Pool name: KalplaUserPool
# - Identity Pool name: KalplaIdentityPool
# - Username attributes: Email
# - Required attributes: Email, Name
# - Password requirements: 8+ characters, uppercase, lowercase, numbers, symbols
# - MFA: Optional (SMS and TOTP)
# - Social providers: Google
```

### 3. Add API (GraphQL)

```bash
# Add GraphQL API
amplify add api

# Select configuration:
# - GraphQL
# - API name: kalpla
# - Authorization: Amazon Cognito User Pool
# - Additional auth types: IAM
# - Conflict resolution: Auto Merge
```

### 4. Add Storage (S3)

```bash
# Add S3 storage for videos
amplify add storage

# Select configuration:
# - Content (Images, audio, video, etc.)
# - Bucket name: kalpla-videos
# - Access: Auth users only
# - Auth permissions: Create/Update, Read, Delete
```

### 5. Add Lambda Functions

```bash
# Add video access manager function
amplify add function

# Function configuration:
# - Function name: videoAccessManager
# - Runtime: Node.js 18.x
# - Template: Hello World
# - Advanced settings: Yes
# - Lambda layers: None
# - Environment variables: 
#   - CLOUDFRONT_DOMAIN: d1234567890.cloudfront.net
#   - CLOUDFRONT_KEY_PAIR_ID: K2JCJMDEHXQW6F
#   - JWT_SECRET: your-secret-key
```

### 6. Deploy to AWS

```bash
# Push all changes to AWS
amplify push

# This will:
# - Create Cognito User Pool
# - Create GraphQL API
# - Create S3 bucket
# - Deploy Lambda functions
# - Set up IAM roles and policies
```

## 🔧 AWS Infrastructure Setup

### CloudFront Distribution

1. **Create CloudFront Distribution:**
   - Origin Domain: S3 bucket (kalpla-videos)
   - Origin Path: /videos
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized
   - Origin Request Policy: CORS-S3Origin

2. **Configure Signed URLs:**
   - Create CloudFront Key Pair
   - Generate private key
   - Configure Lambda function with key pair ID and private key

### DynamoDB Tables

Create the following DynamoDB tables:

```bash
# Video Progress Table
aws dynamodb create-table \
  --table-name VideoProgress \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=lessonId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Lesson Completion Table
aws dynamodb create-table \
  --table-name LessonCompletion \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=lessonId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Video Notes Table
aws dynamodb create-table \
  --table-name VideoNotes \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=LessonIdIndex,KeySchema=[{AttributeName=lessonId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Video Questions Table
aws dynamodb create-table \
  --table-name VideoQuestions \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=LessonIdIndex,KeySchema=[{AttributeName=lessonId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Video Discussions Table
aws dynamodb create-table \
  --table-name VideoDiscussions \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=LessonIdIndex,KeySchema=[{AttributeName=lessonId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Course Enrollments Table
aws dynamodb create-table \
  --table-name CourseEnrollments \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=courseId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=courseId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Lessons Table
aws dynamodb create-table \
  --table-name Lessons \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=courseId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=CourseIdIndex,KeySchema=[{AttributeName=courseId,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST
```

## 🔐 Security Configuration

### IAM Roles and Policies

The Lambda function needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/VideoProgress",
        "arn:aws:dynamodb:*:*:table/LessonCompletion",
        "arn:aws:dynamodb:*:*:table/VideoNotes",
        "arn:aws:dynamodb:*:*:table/VideoQuestions",
        "arn:aws:dynamodb:*:*:table/VideoDiscussions",
        "arn:aws:dynamodb:*:*:table/CourseEnrollments",
        "arn:aws:dynamodb:*:*:table/Lessons",
        "arn:aws:dynamodb:*:*:table/VideoAccessLogs",
        "arn:aws:dynamodb:*:*:table/VideoProgress/index/*",
        "arn:aws:dynamodb:*:*:table/VideoNotes/index/*",
        "arn:aws:dynamodb:*:*:table/VideoQuestions/index/*",
        "arn:aws:dynamodb:*:*:table/VideoDiscussions/index/*",
        "arn:aws:dynamodb:*:*:table/Lessons/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::kalpla-videos/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
```

### CloudFront Signed URLs

1. **Create CloudFront Key Pair:**
   - Go to AWS CloudFront Console
   - Navigate to "Public Keys"
   - Create new key pair
   - Download private key

2. **Configure Lambda Environment Variables:**
   - CLOUDFRONT_DOMAIN: Your CloudFront distribution domain
   - CLOUDFRONT_KEY_PAIR_ID: Key pair ID from CloudFront
   - CLOUDFRONT_PRIVATE_KEY: Private key content

## 📊 Video Analytics Setup

### CloudWatch Metrics

Enable CloudWatch metrics for:
- Lambda function invocations
- DynamoDB read/write capacity
- CloudFront cache hit ratio
- S3 storage usage

### Custom Metrics

Create custom CloudWatch metrics for:
- Video completion rates
- Average watch time
- User engagement scores
- Course progress tracking

## 🚀 Testing the Deployment

### 1. Test Video Access

```bash
# Test signed URL generation
curl -X POST https://your-api-gateway-url/video/access \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"courseId": "course1", "lessonId": "lesson1"}'
```

### 2. Test Progress Tracking

```bash
# Test progress tracking
curl -X POST https://your-api-gateway-url/video/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"lessonId": "lesson1", "currentTime": 120, "totalTime": 600}'
```

### 3. Test Notes System

```bash
# Test note saving
curl -X POST https://your-api-gateway-url/video/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"lessonId": "lesson1", "content": "Great explanation!", "timestamp": 120}'
```

## 🔧 Environment Variables

Set the following environment variables in your Lambda function:

```bash
# CloudFront Configuration
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=K2JCJMDEHXQW6F
CLOUDFRONT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...

# JWT Configuration
JWT_SECRET=your-secret-key

# DynamoDB Table Names
VIDEO_PROGRESS_TABLE=VideoProgress
LESSON_COMPLETION_TABLE=LessonCompletion
VIDEO_NOTES_TABLE=VideoNotes
VIDEO_QUESTIONS_TABLE=VideoQuestions
VIDEO_DISCUSSIONS_TABLE=VideoDiscussions
COURSE_ENROLLMENTS_TABLE=CourseEnrollments
LESSONS_TABLE=Lessons
```

## 📱 Frontend Configuration

Update your frontend environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api-gateway-url
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
NEXT_PUBLIC_AMPLIFY_CONFIG=./aws-exports.js
```

## 🎯 Next Steps

1. **Deploy Lambda Functions** - Push to AWS
2. **Set up CloudFront** - Configure distribution
3. **Configure Signed URLs** - Set up key pairs
4. **Integrate Course Data** - Connect to actual course data
5. **Add Analytics Dashboard** - Implement video analytics
6. **Implement Adaptive Bitrate** - Add HLS/DASH streaming

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure API Gateway has CORS enabled
   - Check CloudFront CORS configuration

2. **Signed URL Issues:**
   - Verify CloudFront key pair configuration
   - Check private key format

3. **DynamoDB Access:**
   - Verify IAM permissions
   - Check table names and indexes

4. **Lambda Timeouts:**
   - Increase timeout to 30 seconds
   - Optimize database queries

## 📚 Additional Resources

- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)

---

**Note:** This deployment guide provides a comprehensive setup for the Kalpla Video Player system. Follow each step carefully and test thoroughly before production deployment.

# Kalpla Platform Deployment Guide

This guide covers the complete deployment process for the Kalpla EdTech platform on AWS.

## Prerequisites

### 1. AWS Account Setup
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ installed
- Git installed

### 2. Required AWS Services
- AWS Amplify
- AWS Cognito
- AWS DynamoDB
- AWS S3
- AWS CloudFront
- AWS Lambda
- AWS API Gateway
- AWS AppSync
- AWS SES
- AWS SNS

### 3. External Services
- PayU payment gateway account
- Google OAuth credentials (for social login)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd kalpla-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` file:
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# PayU Configuration
PAYU_MERCHANT_ID=your-merchant-id
PAYU_MERCHANT_KEY=your-merchant-key
PAYU_SALT=your-salt

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://your-api-gateway-url
```

## AWS Amplify Setup

### 1. Initialize Amplify
```bash
amplify init
```

### 2. Add Authentication
```bash
amplify add auth
```

### 3. Add API (GraphQL)
```bash
amplify add api
```

### 4. Add Storage
```bash
amplify add storage
```

### 5. Add Functions
```bash
amplify add function
```

### 6. Deploy Backend
```bash
amplify push
```

## Manual AWS Resource Setup

### 1. Deploy CloudFormation Stack
```bash
aws cloudformation create-stack \
  --stack-name kalpla-infrastructure \
  --template-body file://amplify/backend/kalpla-infrastructure.yaml \
  --parameters ParameterKey=Environment,ParameterValue=prod \
               ParameterKey=DomainName,ParameterValue=kalpla.com \
               ParameterKey=PayUMerchantId,ParameterValue=your-merchant-id \
               ParameterKey=PayUMerchantKey,ParameterValue=your-merchant-key \
               ParameterKey=PayUSalt,ParameterValue=your-salt \
  --capabilities CAPABILITY_IAM
```

### 2. Create DynamoDB Tables
```bash
# Create User table
aws dynamodb create-table \
  --table-name User-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=email,AttributeType=S \
    AttributeName=role,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=byEmail,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL} \
    IndexName=byRole,KeySchema=[{AttributeName=role,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST

# Create Course table
aws dynamodb create-table \
  --table-name Course-prod \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=instructorId,AttributeType=S \
    AttributeName=category,AttributeType=S \
    AttributeName=status,AttributeType=S \
    AttributeName=publishedDate,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=byInstructor,KeySchema=[{AttributeName=instructorId,KeyType=HASH},{AttributeName=publishedDate,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    IndexName=byCategory,KeySchema=[{AttributeName=category,KeyType=HASH},{AttributeName=publishedDate,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    IndexName=byStatus,KeySchema=[{AttributeName=status,KeyType=HASH},{AttributeName=publishedDate,KeyType=RANGE}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST
```

### 3. Configure Cognito User Pool
```bash
# Create user pool groups
aws cognito-idp create-group \
  --group-name Admin \
  --user-pool-id <user-pool-id> \
  --description "Administrators with full access"

aws cognito-idp create-group \
  --group-name Student \
  --user-pool-id <user-pool-id> \
  --description "Students enrolled in courses"

aws cognito-idp create-group \
  --group-name Instructor \
  --user-pool-id <user-pool-id> \
  --description "Course instructors"

aws cognito-idp create-group \
  --group-name Mentor \
  --user-pool-id <user-pool-id> \
  --description "KSMP mentors"

aws cognito-idp create-group \
  --group-name Investor \
  --user-pool-id <user-pool-id> \
  --description "Approved investors"
```

### 4. Set up S3 Buckets
```bash
# Create course content bucket
aws s3 mb s3://kalpla-course-content-prod-<account-id>

# Create assignment submissions bucket
aws s3 mb s3://kalpla-assignments-prod-<account-id>

# Configure bucket policies
aws s3api put-bucket-policy \
  --bucket kalpla-course-content-prod-<account-id> \
  --policy file://bucket-policy.json
```

### 5. Configure CloudFront
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Frontend Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Deploy to AWS Amplify Hosting
```bash
amplify publish
```

### 3. Configure Custom Domain
```bash
amplify add hosting
```

## PayU Integration Setup

### 1. Configure PayU Webhook
- Set webhook URL in PayU dashboard: `https://your-api-gateway-url/payment/webhook`
- Configure webhook events: payment success, payment failure

### 2. Test Payment Flow
```bash
# Test payment processor
curl -X POST https://your-api-gateway-url/payment \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "test-student",
    "courseId": "test-course",
    "amount": 1000,
    "currency": "INR"
  }'
```

## Google OAuth Setup

### 1. Create Google OAuth App
- Go to Google Cloud Console
- Create new project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URIs:
  - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`

### 2. Configure Cognito Identity Provider
```bash
aws cognito-idp create-identity-provider \
  --user-pool-id <user-pool-id> \
  --provider-name Google \
  --provider-type Google \
  --provider-details \
    client_id=your-google-client-id,client_secret=your-google-client-secret,authorize_scopes=email openid profile
```

## Monitoring and Logging

### 1. CloudWatch Logs
- Lambda function logs
- API Gateway logs
- AppSync logs

### 2. CloudWatch Metrics
- Lambda invocations
- DynamoDB read/write capacity
- CloudFront requests

### 3. CloudWatch Alarms
```bash
# Create alarm for Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name "Kalpla-Lambda-Errors" \
  --alarm-description "Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=kalpla-payment-processor-prod
```

## Security Configuration

### 1. IAM Roles and Policies
- Least privilege access
- Resource-based policies
- Cross-service permissions

### 2. VPC Configuration
- Private subnets for Lambda functions
- NAT Gateway for outbound access
- Security groups

### 3. Encryption
- S3 bucket encryption
- DynamoDB encryption at rest
- Lambda environment variables encryption

## Backup and Recovery

### 1. DynamoDB Backups
```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name User-prod \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

### 2. S3 Cross-Region Replication
```bash
# Configure replication
aws s3api put-bucket-replication \
  --bucket kalpla-course-content-prod-<account-id> \
  --replication-configuration file://replication-config.json
```

## Performance Optimization

### 1. CloudFront Caching
- Configure cache behaviors
- Set appropriate TTL values
- Enable compression

### 2. DynamoDB Optimization
- Use appropriate partition keys
- Implement efficient queries
- Monitor read/write capacity

### 3. Lambda Optimization
- Set appropriate memory allocation
- Use provisioned concurrency for critical functions
- Optimize cold start times

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
- Check Cognito configuration
- Verify JWT tokens
- Check user pool groups

#### 2. Payment Integration Issues
- Verify PayU credentials
- Check webhook configuration
- Monitor Lambda logs

#### 3. Database Connection Issues
- Check DynamoDB permissions
- Verify table names
- Check IAM roles

### Debug Commands
```bash
# Check Amplify status
amplify status

# View logs
amplify logs

# Check AWS resources
aws cloudformation describe-stacks --stack-name kalpla-infrastructure

# Test API endpoints
curl -X POST https://your-api-gateway-url/payment \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Production Checklist

- [ ] All AWS resources deployed
- [ ] Cognito user pool configured
- [ ] DynamoDB tables created
- [ ] S3 buckets configured
- [ ] CloudFront distribution active
- [ ] PayU integration tested
- [ ] Google OAuth configured
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Documentation updated

## Maintenance

### Regular Tasks
- Monitor CloudWatch metrics
- Review and rotate access keys
- Update dependencies
- Backup data
- Security patches

### Scaling Considerations
- DynamoDB auto-scaling
- Lambda concurrency limits
- CloudFront cache optimization
- Database sharding strategies

## Support and Documentation

- AWS Support plans
- Community forums
- Documentation updates
- Training materials
- Incident response procedures

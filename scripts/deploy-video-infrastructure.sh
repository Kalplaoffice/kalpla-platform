#!/bin/bash

# Kalpla Video Player Infrastructure Deployment Script
# This script deploys the complete video infrastructure to AWS

set -e

# Configuration
STACK_NAME="kalpla-video-infrastructure"
ENVIRONMENT="dev"
REGION="us-east-1"
CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
CLOUDFRONT_KEY_PAIR_ID="K2JCJMDEHXQW6F"
JWT_SECRET="your-secret-key-$(date +%s)"
ALLOWED_ORIGINS="http://localhost:3000,https://kalpla.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is configured
check_aws_cli() {
    print_status "Checking AWS CLI configuration..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "AWS CLI is configured"
}

# Function to check if CloudFormation template exists
check_template() {
    print_status "Checking CloudFormation template..."
    
    if [ ! -f "cloudformation/video-infrastructure.yaml" ]; then
        print_error "CloudFormation template not found at cloudformation/video-infrastructure.yaml"
        exit 1
    fi
    
    print_success "CloudFormation template found"
}

# Function to validate CloudFormation template
validate_template() {
    print_status "Validating CloudFormation template..."
    
    aws cloudformation validate-template \
        --template-body file://cloudformation/video-infrastructure.yaml \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        print_success "CloudFormation template is valid"
    else
        print_error "CloudFormation template validation failed"
        exit 1
    fi
}

# Function to deploy CloudFormation stack
deploy_stack() {
    print_status "Deploying CloudFormation stack: $STACK_NAME"
    
    aws cloudformation deploy \
        --template-file cloudformation/video-infrastructure.yaml \
        --stack-name $STACK_NAME \
        --parameter-overrides \
            Environment=$ENVIRONMENT \
            CloudFrontDomain=$CLOUDFRONT_DOMAIN \
            CloudFrontKeyPairId=$CLOUDFRONT_KEY_PAIR_ID \
            JWTSecret=$JWT_SECRET \
            AllowedOrigins=$ALLOWED_ORIGINS \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        print_success "CloudFormation stack deployed successfully"
    else
        print_error "CloudFormation stack deployment failed"
        exit 1
    fi
}

# Function to get stack outputs
get_outputs() {
    print_status "Getting stack outputs..."
    
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs' \
        --output table
}

# Function to update Lambda function code
update_lambda_code() {
    print_status "Updating Lambda function code..."
    
    # Create deployment package
    cd amplify/backend/function/videoAccessManager/src
    npm install
    zip -r ../../../video-access-manager.zip .
    cd ../../../../..
    
    # Update Lambda function
    aws lambda update-function-code \
        --function-name VideoAccessManager-$ENVIRONMENT \
        --zip-file fileb://amplify/backend/function/videoAccessManager/video-access-manager.zip \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        print_success "Lambda function code updated successfully"
    else
        print_error "Lambda function code update failed"
        exit 1
    fi
}

# Function to create sample data
create_sample_data() {
    print_status "Creating sample data..."
    
    # Create sample course enrollment
    aws dynamodb put-item \
        --table-name CourseEnrollments-$ENVIRONMENT \
        --item '{
            "userId": {"S": "sample-user-123"},
            "courseId": {"S": "course-1"},
            "enrolledAt": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
            "status": {"S": "active"}
        }' \
        --region $REGION
    
    # Create sample lesson
    aws dynamodb put-item \
        --table-name Lessons-$ENVIRONMENT \
        --item '{
            "id": {"S": "lesson-1"},
            "courseId": {"S": "course-1"},
            "title": {"S": "Introduction to Business Model Canvas"},
            "description": {"S": "Understanding the nine building blocks of a business model"},
            "type": {"S": "video"},
            "duration": {"N": "1200"},
            "videoPath": {"S": "/videos/intro-bmc.mp4"},
            "order": {"N": "1"},
            "isLocked": {"BOOL": false}
        }' \
        --region $REGION
    
    print_success "Sample data created successfully"
}

# Function to test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get API Gateway URL
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`VideoAccessManagerAPIUrl`].OutputValue' \
        --output text)
    
    if [ -z "$API_URL" ]; then
        print_error "Could not get API Gateway URL"
        exit 1
    fi
    
    print_status "API Gateway URL: $API_URL"
    
    # Test API endpoint
    print_status "Testing API endpoint..."
    
    # Note: This test will fail without proper authentication
    # In a real scenario, you would need to provide a valid JWT token
    curl -X GET "$API_URL/access-check/course-1/lesson-1" \
        -H "Content-Type: application/json" \
        -w "\nHTTP Status: %{http_code}\n" \
        --max-time 10
    
    print_success "Deployment test completed"
}

# Function to display deployment summary
display_summary() {
    print_status "Deployment Summary"
    echo "=================="
    echo "Stack Name: $STACK_NAME"
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
    echo "JWT Secret: $JWT_SECRET"
    echo ""
    
    print_status "Next Steps:"
    echo "1. Update your frontend environment variables with the API Gateway URL"
    echo "2. Configure CloudFront key pair for signed URLs"
    echo "3. Upload sample videos to the S3 bucket"
    echo "4. Test the video player functionality"
    echo ""
    
    print_status "Useful Commands:"
    echo "aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION"
    echo "aws dynamodb list-tables --region $REGION"
    echo "aws s3 ls s3://kalpla-videos-$ENVIRONMENT-$AWS_ACCOUNT_ID --region $REGION"
}

# Main execution
main() {
    print_status "Starting Kalpla Video Player Infrastructure Deployment"
    echo "=========================================================="
    
    # Check prerequisites
    check_aws_cli
    check_template
    
    # Deploy infrastructure
    validate_template
    deploy_stack
    
    # Update Lambda code
    update_lambda_code
    
    # Create sample data
    create_sample_data
    
    # Test deployment
    test_deployment
    
    # Display summary
    display_summary
    
    print_success "Video Player Infrastructure Deployment Completed Successfully!"
}

# Run main function
main "$@"

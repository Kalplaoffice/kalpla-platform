#!/bin/bash

# Kalpla Video Infrastructure Deployment Script
# This script deploys the video infrastructure including S3, CloudFront, MediaConvert, and Lambda functions

set -e

# Configuration
STACK_NAME="kalpla-video-infrastructure"
ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}
TEMPLATE_FILE="cloudformation/video-infrastructure.yaml"

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

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
}

# Check if template file exists
check_template() {
    if [ ! -f "$TEMPLATE_FILE" ]; then
        print_error "Template file $TEMPLATE_FILE not found."
        exit 1
    fi
}

# Validate CloudFormation template
validate_template() {
    print_status "Validating CloudFormation template..."
    if aws cloudformation validate-template --template-body file://$TEMPLATE_FILE --region $REGION; then
        print_success "Template validation successful"
    else
        print_error "Template validation failed"
        exit 1
    fi
}

# Deploy CloudFormation stack
deploy_stack() {
    print_status "Deploying CloudFormation stack: $STACK_NAME-$ENVIRONMENT"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name "$STACK_NAME-$ENVIRONMENT" --region $REGION &> /dev/null; then
        print_status "Stack exists, updating..."
        aws cloudformation update-stack \
            --stack-name "$STACK_NAME-$ENVIRONMENT" \
            --template-body file://$TEMPLATE_FILE \
            --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                       ParameterKey=CloudFrontDomain,ParameterValue="d1234567890.cloudfront.net" \
                       ParameterKey=CloudFrontKeyPairId,ParameterValue="K2JCJMDEHXQW6F" \
                       ParameterKey=JWTSecret,ParameterValue="your-secret-key" \
                       ParameterKey=AllowedOrigins,ParameterValue="http://localhost:3000,https://kalpla.com" \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region $REGION
    else
        print_status "Creating new stack..."
        aws cloudformation create-stack \
            --stack-name "$STACK_NAME-$ENVIRONMENT" \
            --template-body file://$TEMPLATE_FILE \
            --parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                       ParameterKey=CloudFrontDomain,ParameterValue="d1234567890.cloudfront.net" \
                       ParameterKey=CloudFrontKeyPairId,ParameterValue="K2JCJMDEHXQW6F" \
                       ParameterKey=JWTSecret,ParameterValue="your-secret-key" \
                       ParameterKey=AllowedOrigins,ParameterValue="http://localhost:3000,https://kalpla.com" \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region $REGION
    fi
    
    print_status "Waiting for stack deployment to complete..."
    aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME-$ENVIRONMENT" --region $REGION || \
    aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME-$ENVIRONMENT" --region $REGION
    
    print_success "Stack deployment completed successfully"
}

# Get stack outputs
get_outputs() {
    print_status "Retrieving stack outputs..."
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --region $REGION \
        --query 'Stacks[0].Outputs' \
        --output table
}

# Deploy Lambda functions
deploy_lambda_functions() {
    print_status "Deploying Lambda functions..."
    
    # Deploy video upload processor
    if [ -d "amplify/backend/function/videoUploadProcessor" ]; then
        print_status "Deploying video upload processor..."
        cd amplify/backend/function/videoUploadProcessor
        npm install
        zip -r ../../../../video-upload-processor.zip .
        cd ../../../../
        
        # Update Lambda function code
        aws lambda update-function-code \
            --function-name "videoUploadProcessor-$ENVIRONMENT" \
            --zip-file fileb://video-upload-processor.zip \
            --region $REGION
        
        rm video-upload-processor.zip
        print_success "Video upload processor deployed"
    fi
    
    # Deploy video signed URL generator
    if [ -d "amplify/backend/function/videoSignedUrlGenerator" ]; then
        print_status "Deploying video signed URL generator..."
        cd amplify/backend/function/videoSignedUrlGenerator
        npm install
        zip -r ../../../../video-signed-url-generator.zip .
        cd ../../../../
        
        # Update Lambda function code
        aws lambda update-function-code \
            --function-name "videoSignedUrlGenerator-$ENVIRONMENT" \
            --zip-file fileb://video-signed-url-generator.zip \
            --region $REGION
        
        rm video-signed-url-generator.zip
        print_success "Video signed URL generator deployed"
    fi
}

# Test video infrastructure
test_infrastructure() {
    print_status "Testing video infrastructure..."
    
    # Test S3 bucket access
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`VideoStorageBucketName`].OutputValue' \
        --output text)
    
    if [ -n "$BUCKET_NAME" ]; then
        print_success "S3 bucket created: $BUCKET_NAME"
        
        # Test bucket permissions
        if aws s3 ls "s3://$BUCKET_NAME" --region $REGION &> /dev/null; then
            print_success "S3 bucket access confirmed"
        else
            print_warning "S3 bucket access test failed"
        fi
    else
        print_error "Failed to get S3 bucket name"
    fi
    
    # Test MediaConvert
    MEDIACONVERT_ROLE=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`MediaConvertRoleArn`].OutputValue' \
        --output text)
    
    if [ -n "$MEDIACONVERT_ROLE" ]; then
        print_success "MediaConvert role created: $MEDIACONVERT_ROLE"
    else
        print_error "Failed to get MediaConvert role"
    fi
}

# Main execution
main() {
    print_status "Starting Kalpla Video Infrastructure Deployment"
    print_status "Environment: $ENVIRONMENT"
    print_status "Region: $REGION"
    print_status "Stack Name: $STACK_NAME-$ENVIRONMENT"
    
    check_aws_cli
    check_template
    validate_template
    deploy_stack
    deploy_lambda_functions
    test_infrastructure
    get_outputs
    
    print_success "Video infrastructure deployment completed successfully!"
    print_status "Next steps:"
    print_status "1. Update your application configuration with the stack outputs"
    print_status "2. Configure CloudFront distribution settings"
    print_status "3. Set up MediaConvert job templates"
    print_status "4. Test video upload and processing workflow"
}

# Run main function
main "$@"
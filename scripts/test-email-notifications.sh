#!/bin/bash

# Email Notification Test Script
# This script tests the email notification system

echo "🧪 Testing Email Notification System"
echo "====================================="

# Test 1: Test Lambda function directly
echo "📧 Test 1: Testing Lambda function directly..."
aws lambda invoke \
  --function-name notifyUserStatusChange \
  --payload '{"email":"test@example.com","firstName":"Test User","status":"Suspended"}' \
  --region us-east-1 \
  response.json

if [ $? -eq 0 ]; then
    echo "✅ Lambda function test successful"
    cat response.json
else
    echo "❌ Lambda function test failed"
fi

echo ""

# Test 2: Test API endpoint
echo "🌐 Test 2: Testing API endpoint..."
curl -X POST http://localhost:3000/api/notifyUserStatus \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test User","status":"Active"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""

# Test 3: Check SES configuration
echo "📬 Test 3: Checking SES configuration..."
aws ses get-send-quota --region us-east-1

echo ""

# Test 4: List verified email addresses
echo "✉️ Test 4: Checking verified email addresses..."
aws ses list-verified-email-addresses --region us-east-1

echo ""
echo "🎯 Test Summary:"
echo "- Lambda function: Check response.json for results"
echo "- API endpoint: Check HTTP status code"
echo "- SES quota: Check if you have sending capacity"
echo "- Verified emails: Ensure support@kalpla.com is verified"
echo ""
echo "📋 Next Steps:"
echo "1. Verify support@kalpla.com in SES console"
echo "2. Move SES out of sandbox mode"
echo "3. Test with real email addresses"
echo "4. Check CloudWatch logs for detailed results"

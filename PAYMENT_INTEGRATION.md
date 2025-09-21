# PayU Payment Integration - Kalpla Platform

This document outlines the complete PayU payment integration implementation for the Kalpla edtech platform using AWS Lambda webhooks.

## 🏗️ Architecture Overview

```
[Frontend: Next.js] 
       |
       v
[API Request] --> [AWS Lambda: paymentProcessor] --> [DynamoDB / Aurora]
       | 
       v
[PayU Payment Page] --> [Webhook URL -> AWS API Gateway -> Lambda: paymentWebhook]
       |
       v
[Lambda verifies payment] --> [Update Enrollment, Trigger Notification]
```

## 📁 File Structure

```
amplify/backend/function/
├── paymentProcessor/
│   ├── src/
│   │   ├── index.js              # Payment request generation
│   │   └── package.json          # Dependencies
│   └── paymentProcessor-cloudformation-template.json
└── paymentWebhook/
    ├── src/
    │   ├── index.js              # Webhook handler
    │   └── package.json          # Dependencies
    └── paymentWebhook-cloudformation-template.json

src/
├── lib/
│   └── paymentService.ts         # Frontend payment service
├── components/payment/
│   └── PaymentModal.tsx          # Payment modal component
└── app/payment/
    ├── success/page.tsx          # Payment success page
    ├── failure/page.tsx          # Payment failure page
    └── history/page.tsx          # Payment history page
```

## 🔄 Payment Flow

### 1. Payment Initiation

**Frontend Flow:**
1. Student clicks "Enroll" or "Pay Now" button
2. `PaymentModal` component opens with course details
3. Student confirms payment details
4. Frontend calls `paymentService.initiatePayment()`
5. API request sent to `paymentProcessor` Lambda function

**Backend Flow:**
1. Lambda receives payment request with:
   - `studentId`, `courseId`, `amount`
   - `studentInfo` (name, email, phone)
   - `courseInfo` (title, type, description)
2. Generate unique transaction ID (`TXN_${timestamp}_${random}`)
3. Create PayU payment parameters:
   ```javascript
   {
     key: PAYU_MERCHANT_KEY,
     txnid: "TXN_1234567890_abc123",
     amount: "1000",
     productinfo: "Kalpla Course: React Fundamentals",
     firstname: "John",
     email: "john@email.com",
     phone: "9999999999",
     surl: "https://yourdomain.com/payment/success",
     furl: "https://yourdomain.com/payment/failure",
     hash: "generated_sha512_hash",
     udf1: "studentId",
     udf2: "courseId",
     udf3: "course",
     udf4: "metadata_json"
   }
   ```
4. Generate SHA512 hash using PayU formula
5. Store payment record in DynamoDB
6. Return payment parameters to frontend

### 2. Payment Processing

**PayU Integration:**
1. Frontend creates form with payment parameters
2. Form submits to PayU payment gateway
3. Student completes payment on PayU page
4. PayU processes payment and calls webhook

### 3. Webhook Handling

**PayU Webhook Call:**
1. PayU sends POST request to webhook URL
2. `paymentWebhook` Lambda function receives payload
3. Lambda validates hash using PayU verification formula
4. Extract payment details from payload
5. Update enrollment status in DynamoDB
6. Grant course access (Cognito groups/AppSync permissions)
7. Send notification (SES/SNS)
8. Return success response to PayU

## 🔧 Implementation Details

### Lambda Functions

#### paymentProcessor Lambda

**Purpose:** Generate PayU payment requests

**Input:**
```json
{
  "studentId": "student123",
  "courseId": "course456",
  "amount": 1000,
  "studentInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "phone": "9999999999"
  },
  "courseInfo": {
    "title": "React Fundamentals",
    "type": "course",
    "description": "Learn React from scratch"
  }
}
```

**Output:**
```json
{
  "success": true,
  "transactionId": "TXN_1234567890_abc123",
  "paymentUrl": "https://secure.payu.in/_payment",
  "paymentParams": {
    "key": "merchant_key",
    "txnid": "TXN_1234567890_abc123",
    "amount": "1000",
    "productinfo": "Kalpla Course: React Fundamentals",
    "firstname": "John",
    "email": "john@email.com",
    "phone": "9999999999",
    "surl": "https://yourdomain.com/payment/success",
    "furl": "https://yourdomain.com/payment/failure",
    "hash": "sha512_hash"
  }
}
```

#### paymentWebhook Lambda

**Purpose:** Handle PayU payment callbacks

**Input (PayU Webhook):**
```json
{
  "status": "success",
  "txnid": "TXN_1234567890_abc123",
  "amount": "1000",
  "productinfo": "Kalpla Course: React Fundamentals",
  "firstname": "John",
  "email": "john@email.com",
  "phone": "9999999999",
  "hash": "verified_hash",
  "udf1": "studentId",
  "udf2": "courseId",
  "udf3": "course",
  "udf4": "metadata_json"
}
```

**Actions:**
1. Verify hash using PayU formula
2. Update enrollment status in DynamoDB
3. Grant course access
4. Send notification
5. Return success response

### Frontend Components

#### PaymentModal Component

**Features:**
- Course details display
- Payment summary
- Secure payment notice
- Loading states
- Error handling
- PayU redirect

**Usage:**
```tsx
<PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  courseId="course123"
  courseTitle="React Fundamentals"
  courseType="course"
  amount={1000}
  currency="INR"
  onPaymentSuccess={() => {
    // Handle success
  }}
  onPaymentFailure={() => {
    // Handle failure
  }}
/>
```

#### PaymentService

**Methods:**
- `initiatePayment()` - Start payment process
- `checkPaymentStatus()` - Check payment status
- `getPaymentHistory()` - Get student payment history
- `redirectToPayU()` - Redirect to PayU gateway
- `handlePaymentSuccess()` - Handle success callback
- `handlePaymentFailure()` - Handle failure callback

### Database Schema Updates

**Payment Table:**
```graphql
type Payment @model @auth(rules: [
  { allow: owner, operations: [read] },
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] }
]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  user: User! @belongsTo(fields: ["userId"])
  
  # Payment details
  amount: Float!
  currency: String!
  razorpayPaymentId: String!
  razorpayOrderId: String!
  status: String! # PENDING, SUCCESS, FAILED
  
  # Related entities
  courseId: ID
  programId: ID
  cohortId: ID
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

## 🔐 Security Implementation

### Hash Generation

**Payment Request Hash:**
```javascript
const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;
const hash = crypto.createHash('sha512').update(hashString).digest('hex');
```

**Webhook Verification Hash:**
```javascript
const hashString = `${MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${MERCHANT_KEY}`;
const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex');
```

### Environment Variables

**Required Environment Variables:**
```env
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_merchant_salt
PAYU_BASE_URL=https://secure.payu.in/_payment
PAYU_SUCCESS_URL=https://yourdomain.com/payment/success
PAYU_FAILURE_URL=https://yourdomain.com/payment/failure
PAYU_WEBHOOK_URL=https://yourdomain.com/api/payment/webhook
```

## 🚀 Deployment Steps

### 1. AWS Amplify Setup

```bash
# Add Lambda functions
npx @aws-amplify/cli@latest add function
# Select: paymentProcessor
# Runtime: Node.js 18.x
# Template: Hello World
# Advanced: Yes
# Lambda trigger: API Gateway

npx @aws-amplify/cli@latest add function
# Select: paymentWebhook
# Runtime: Node.js 18.x
# Template: Hello World
# Advanced: Yes
# Lambda trigger: API Gateway
```

### 2. Environment Configuration

```bash
# Set environment variables
npx @aws-amplify/cli@latest env add
# Add PayU configuration variables
```

### 3. Deploy Backend

```bash
npx @aws-amplify/cli@latest push
```

### 4. Configure PayU Webhook

1. Login to PayU merchant dashboard
2. Go to Integration → Webhook Configuration
3. Set webhook URL: `https://your-api-gateway-url/payment/webhook`
4. Enable webhook for payment events

## 🧪 Testing

### Test Payment Flow

1. **Initiate Payment:**
   ```bash
   curl -X POST https://your-api-gateway-url/payment/initiate \
     -H "Content-Type: application/json" \
     -d '{
       "studentId": "test123",
       "courseId": "course456",
       "amount": 100,
       "studentInfo": {
         "firstName": "Test",
         "lastName": "User",
         "email": "test@example.com"
       },
       "courseInfo": {
         "title": "Test Course",
         "type": "course"
       }
     }'
   ```

2. **Test Webhook:**
   ```bash
   curl -X POST https://your-api-gateway-url/payment/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "status": "success",
       "txnid": "TXN_test123",
       "amount": "100",
       "productinfo": "Test Course",
       "firstname": "Test",
       "email": "test@example.com",
       "hash": "test_hash"
     }'
   ```

## 📊 Monitoring & Logging

### CloudWatch Logs

**paymentProcessor Logs:**
- Payment request generation
- Hash generation
- DynamoDB operations
- Error handling

**paymentWebhook Logs:**
- Webhook payload validation
- Hash verification
- Enrollment updates
- Notification sending

### Metrics to Monitor

- Payment success rate
- Webhook response time
- Failed payment attempts
- Enrollment completion rate

## 🔧 Troubleshooting

### Common Issues

1. **Hash Verification Failed**
   - Check merchant key and salt
   - Verify hash generation formula
   - Ensure parameter order matches PayU documentation

2. **Webhook Not Receiving Calls**
   - Verify webhook URL configuration
   - Check API Gateway CORS settings
   - Ensure Lambda function is deployed

3. **Payment Not Updating Enrollment**
   - Check DynamoDB permissions
   - Verify enrollment table structure
   - Check Lambda execution logs

### Debug Steps

1. Check CloudWatch logs for errors
2. Verify environment variables
3. Test webhook with Postman/curl
4. Check PayU merchant dashboard for transaction status

## 🚀 Future Enhancements

### Planned Features

1. **Refund Handling**
   - Automatic refund processing
   - Refund status tracking
   - Refund notifications

2. **Payment Analytics**
   - Revenue tracking
   - Payment method analytics
   - Conversion rate monitoring

3. **Advanced Notifications**
   - SMS notifications via SNS
   - Push notifications
   - Email templates

4. **Multi-Currency Support**
   - Dynamic currency conversion
   - Regional payment methods
   - Tax calculation

---

## 📞 Support

For payment integration support:
- Check AWS CloudWatch logs
- Review PayU documentation
- Contact development team
- Create issue in repository

**PayU Documentation:** https://payu.in/docs/
**AWS Lambda Documentation:** https://docs.aws.amazon.com/lambda/

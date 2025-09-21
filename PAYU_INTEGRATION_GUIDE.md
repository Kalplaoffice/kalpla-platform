# 💳 PayU Integration Guide for Kalpla

## 🔑 **Your PayU Credentials**

Based on your PayU developer portal, here are your credentials:

- **Merchant Key**: `J7JOvh`
- **Merchant Salt**: `a2bo9K3otgyaleULdXEQC8LWMCK04BP2`
- **Client ID**: `ac17125563d136da911f51375dcaccf37adca06f69ffcfbde88f12459316eda2`
- **Client Secret**: `6a8c63830d7dbe019f40ba33d0572c7ad0a58fb21638ea91d167b0cd492fddcc`

## 🏗️ **Integration Architecture**

```
Student → Frontend → Lambda (Payment Processor) → PayU Gateway → Webhook → Lambda (Webhook Handler) → Database
```

## 📋 **Step-by-Step Integration**

### 1. **Payment Flow**

1. **Student clicks "Enroll"** on a course
2. **Frontend calls** `/api/payment/initiate` endpoint
3. **Lambda generates** PayU payment request with hash
4. **Student redirected** to PayU payment page
5. **PayU processes** payment and calls webhook
6. **Webhook Lambda** validates payment and updates enrollment
7. **Student gets** access to course content

### 2. **Hash Generation**

The payment hash is generated using:
```javascript
const hashString = `${MERCHANT_KEY}|${TXN_ID}|${AMOUNT}|${PRODUCT_INFO}|${FIRSTNAME}|${SALT}`;
const hash = crypto.createHash('sha512').update(hashString).digest('hex');
```

### 3. **Webhook Verification**

PayU webhook hash verification:
```javascript
const hashString = `${SALT}|${STATUS}|||||||||||${TXN_ID}|${AMOUNT}`;
const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
```

## 🔧 **Configuration**

### **Environment Variables**

The following environment variables are configured in AWS Secrets Manager:

```bash
# PayU Credentials
/kalpla/dev/payu/merchant-key = "J7JOvh"
/kalpla/dev/payu/merchant-salt = "a2bo9K3otgyaleULdXEQC8LWMCK04BP2"
/kalpla/dev/payu/client-id = "ac17125563d136da911f51375dcaccf37adca06f69ffcfbde88f12459316eda2"
/kalpla/dev/payu/client-secret = "6a8c63830d7dbe019f40ba33d0572c7ad0a58fb21638ea91d167b0cd492fddcc"
```

### **Lambda Functions**

1. **Payment Processor** (`paymentProcessor`)
   - Generates PayU payment requests
   - Creates payment records in DynamoDB
   - Returns payment URL for redirection

2. **Payment Webhook** (`paymentWebhook`)
   - Handles PayU payment callbacks
   - Verifies payment hash
   - Updates enrollment status
   - Sends notifications

## 🎯 **API Endpoints**

### **Initiate Payment**
```http
POST /api/payment/initiate
Content-Type: application/json

{
  "studentId": "user123",
  "courseId": "course456",
  "amount": 999.00,
  "currency": "INR"
}
```

**Response:**
```json
{
  "transactionId": "TXN_1234567890_abc123",
  "paymentRequest": {
    "key": "J7JOvh",
    "txnid": "TXN_1234567890_abc123",
    "amount": "999.00",
    "productinfo": "Course Title",
    "firstname": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "surl": "https://yourdomain.com/payment/success",
    "furl": "https://yourdomain.com/payment/failure",
    "hash": "generated_hash_here",
    "service_provider": "payu_paisa"
  },
  "redirectUrl": "https://test.payu.in/_payment"
}
```

### **Webhook Endpoint**
```http
POST /api/payment/webhook
Content-Type: application/x-www-form-urlencoded

txnid=TXN_1234567890_abc123&status=success&amount=999.00&hash=webhook_hash_here&...
```

## 🔐 **Security Features**

### **Hash Verification**
- All payment requests include SHA-512 hash
- Webhook responses are verified using salt
- Prevents tampering and ensures authenticity

### **Secure Storage**
- Credentials stored in AWS Secrets Manager
- Encrypted at rest and in transit
- IAM role-based access control

### **Webhook Security**
- PayU webhook URL is HTTPS only
- Hash verification for all webhook calls
- Idempotency handling for duplicate calls

## 📊 **Payment Analytics**

### **Tracked Metrics**
- Payment success/failure rates
- Transaction volumes by course
- Revenue analytics
- Geographic distribution
- Payment method breakdown

### **Database Tables**
- `Payments` - Payment transaction records
- `CourseEnrollments` - Student enrollments
- `RevenueAnalytics` - Aggregated revenue data

## 🚀 **Testing**

### **Test Environment**
- PayU Test URL: `https://test.payu.in`
- Test credentials are already configured
- Use test card numbers for payment testing

### **Test Card Numbers**
```
Card Number: 5123456789012346
Expiry: 05/25
CVV: 123
```

### **Webhook Testing**
Use PayU's webhook testing tool or ngrok for local testing:
```bash
ngrok http 3000
# Use the ngrok URL as webhook endpoint
```

## 🔄 **Payment Status Flow**

```
PENDING → SUCCESS/FAILED → ENROLLMENT_UPDATED → NOTIFICATION_SENT
```

### **Status Codes**
- `PENDING` - Payment initiated, awaiting completion
- `SUCCESS` - Payment completed successfully
- `FAILED` - Payment failed or cancelled
- `REFUNDED` - Payment refunded

## 📱 **Frontend Integration**

### **Payment Modal Component**
```jsx
const PaymentModal = ({ course, onSuccess, onFailure }) => {
  const initiatePayment = async () => {
    const response = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        courseId: course.id,
        amount: course.price,
        currency: 'INR'
      })
    });
    
    const data = await response.json();
    // Redirect to PayU
    window.location.href = data.redirectUrl;
  };
  
  return (
    <div className="payment-modal">
      <h3>Complete Payment</h3>
      <p>Course: {course.title}</p>
      <p>Amount: ₹{course.price}</p>
      <button onClick={initiatePayment}>Pay Now</button>
    </div>
  );
};
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Hash Mismatch**
   - Verify salt and key are correct
   - Check hash generation algorithm
   - Ensure proper string concatenation

2. **Webhook Not Received**
   - Verify webhook URL is accessible
   - Check PayU webhook configuration
   - Ensure HTTPS endpoint

3. **Payment Not Processing**
   - Check PayU account status
   - Verify test/production environment
   - Review PayU logs

### **Debug Commands**
```bash
# Check Lambda logs
amplify function logs paymentProcessor
amplify function logs paymentWebhook

# Test payment endpoint
curl -X POST https://your-api-url/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{"studentId":"test","courseId":"test","amount":100,"currency":"INR"}'
```

## 📈 **Monitoring**

### **CloudWatch Metrics**
- Lambda function invocations
- Payment success/failure rates
- Webhook response times
- Error rates and exceptions

### **Alerts**
- Payment failure rate > 5%
- Webhook timeout > 30 seconds
- Lambda function errors
- Database connection issues

## 🎉 **Ready for Production!**

Your PayU integration is now configured with:
- ✅ Real PayU credentials
- ✅ Secure hash generation
- ✅ Webhook handling
- ✅ Payment analytics
- ✅ Error handling
- ✅ Security measures

**Next Steps:**
1. Deploy the backend: `amplify push`
2. Test payment flow with test cards
3. Configure production webhook URL
4. Monitor payment metrics
5. Go live with real payments!

---

**Note**: Keep your PayU credentials secure and never commit them to version control. They are stored securely in AWS Secrets Manager.

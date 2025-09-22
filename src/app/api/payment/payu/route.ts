import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PayU Configuration - Using real PayU credentials
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'J7JOvh';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'a2bo9K3otgyaleULdXEQC8LWMCK04BP2';
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://secure.payu.in';

interface PayUPaymentData {
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  studentInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  courseInfo: {
    title: string;
    type: 'course' | 'program' | 'ksmp';
    description: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const paymentData: PayUPaymentData = await request.json();
    
    console.log('PayU payment request:', paymentData);
    
    // Validate input data
    if (!paymentData.studentId || !paymentData.courseId || !paymentData.amount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required payment data'
      }, { status: 400 });
    }
    
    // Generate unique transaction ID (ensure uniqueness)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const transactionId = `TXN_${timestamp}_${randomString}`;
    
    // Prepare PayU payment parameters (ensure no special characters)
    const productInfo = `${paymentData.courseInfo.title} - ${paymentData.courseInfo.type}`.replace(/[&?]/g, '');
    const firstName = paymentData.studentInfo.firstName.trim();
    const email = paymentData.studentInfo.email.trim();
    const phone = paymentData.studentInfo.phone || '9999999999';
    const amount = paymentData.amount.toString();
    
    // Generate PayU hash using correct formula
    // sha512(key|txnid|amount|productinfo|firstname|email|||||||||||SALT)
    const hashString = `${PAYU_MERCHANT_KEY}|${transactionId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
    
    // Generate hash in PayU's expected format with v1 and v2
    const hash1 = crypto.createHash('sha512').update(hashString).digest('hex');
    const hash2 = crypto.createHash('sha512').update(hashString + '|' + PAYU_MERCHANT_SALT).digest('hex');
    
    const hash = JSON.stringify({
      v1: hash1,
      v2: hash2
    });
    
    // Prepare PayU payment parameters
    const payuParams = {
      key: PAYU_MERCHANT_KEY,
      txnid: transactionId,
      amount: amount,
      productinfo: productInfo,
      firstname: firstName,
      email: email,
      phone: phone,
      surl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
      furl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/failure`,
      hash: hash,
      service_provider: 'payu_paisa',
      currency: paymentData.currency,
      udf1: paymentData.studentId,
      udf2: paymentData.courseId,
      udf3: paymentData.courseInfo.type,
      udf4: JSON.stringify({
        studentName: `${paymentData.studentInfo.firstName} ${paymentData.studentInfo.lastName}`,
        courseTitle: paymentData.courseInfo.title,
        timestamp: new Date().toISOString()
      }),
      udf5: '' // Add missing UDF5 field
    };
    
    // Create PayU payment URL
    const paymentUrl = `${PAYU_BASE_URL}/_payment`;
    
    console.log('PayU payment parameters:', payuParams);
    console.log('PayU payment URL:', paymentUrl);
    
    return NextResponse.json({
      success: true,
      message: 'PayU payment initiated successfully',
      transactionId: transactionId,
      paymentUrl: paymentUrl,
      paymentParams: payuParams,
      payuConfig: {
        merchantKey: PAYU_MERCHANT_KEY,
        baseUrl: PAYU_BASE_URL,
        hashString: hashString,
        generatedHash: hash
      }
    });
    
  } catch (error) {
    console.error('PayU payment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

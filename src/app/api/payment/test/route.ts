import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Mock PayU configuration for testing
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'test_merchant_key';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'test_merchant_salt';
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in';

interface PaymentTestData {
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
    const testData: PaymentTestData = await request.json();
    
    console.log('Payment test request:', testData);
    
    // Validate input data
    const validationResult = validatePaymentData(testData);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validationResult.errors.join(', ')
      }, { status: 400 });
    }
    
    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate PayU payment parameters
    const paymentParams = generatePayUParams(transactionId, testData);
    
    // Simulate different test scenarios
    const testResult = simulatePaymentTest(testData, transactionId, paymentParams);
    
    return NextResponse.json(testResult);
    
  } catch (error) {
    console.error('Payment test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function validatePaymentData(data: PaymentTestData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.studentId || data.studentId.trim() === '') {
    errors.push('Student ID is required');
  }
  
  if (!data.courseId || data.courseId.trim() === '') {
    errors.push('Course ID is required');
  }
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!data.studentInfo.email || !isValidEmail(data.studentInfo.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.studentInfo.firstName || data.studentInfo.firstName.trim() === '') {
    errors.push('Student first name is required');
  }
  
  if (!data.courseInfo.title || data.courseInfo.title.trim() === '') {
    errors.push('Course title is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generatePayUParams(transactionId: string, data: PaymentTestData) {
  const productInfo = `${data.courseInfo.title} - ${data.courseInfo.type}`;
  const firstName = data.studentInfo.firstName;
  const email = data.studentInfo.email;
  const phone = data.studentInfo.phone || '9999999999';
  
  // Generate hash using PayU formula
  const hashString = `${PAYU_MERCHANT_KEY}|${transactionId}|${data.amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  
  return {
    key: PAYU_MERCHANT_KEY,
    txnid: transactionId,
    amount: data.amount.toString(),
    productinfo: productInfo,
    firstname: firstName,
    email: email,
    phone: phone,
    surl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
    furl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/failure`,
    hash: hash,
    service_provider: 'payu_paisa',
    currency: data.currency,
    udf1: data.studentId,
    udf2: data.courseId,
    udf3: data.courseInfo.type,
    udf4: JSON.stringify({
      studentName: `${data.studentInfo.firstName} ${data.studentInfo.lastName}`,
      courseTitle: data.courseInfo.title,
      timestamp: new Date().toISOString()
    })
  };
}

function simulatePaymentTest(data: PaymentTestData, transactionId: string, paymentParams: any) {
  // Simulate different test scenarios based on the data
  const isHighAmount = data.amount > 10000;
  const isInvalidData = !data.studentId || !data.courseId || data.amount <= 0;
  const isEdgeCase = data.studentInfo.firstName.length > 50 || data.studentInfo.lastName.length > 50;
  
  if (isInvalidData) {
    return {
      success: false,
      message: 'Payment test failed due to invalid data',
      error: 'Missing or invalid required fields',
      transactionId: null,
      paymentUrl: null,
      paymentParams: null
    };
  }
  
  if (isEdgeCase) {
    return {
      success: false,
      message: 'Payment test failed due to edge case data',
      error: 'Name fields exceed maximum length',
      transactionId: null,
      paymentUrl: null,
      paymentParams: null
    };
  }
  
  // Simulate successful payment generation
  const paymentUrl = `${PAYU_BASE_URL}/_payment`;
  
  return {
    success: true,
    message: `Payment test successful for ${data.courseInfo.title}`,
    transactionId: transactionId,
    paymentUrl: paymentUrl,
    paymentParams: paymentParams,
    testScenario: {
      isHighAmount,
      currency: data.currency,
      courseType: data.courseInfo.type,
      amount: data.amount
    }
  };
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

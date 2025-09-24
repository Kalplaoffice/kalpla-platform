import crypto from 'crypto';

// PayU Configuration
const PAYU_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID || 'your_merchant_id',
  merchantKey: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || 'your_merchant_key',
  salt: process.env.PAYU_SALT || 'your_salt',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://secure.payu.in' 
    : 'https://test.payu.in',
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
  failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
};

export interface PaymentRequest {
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  curl: string;
  hash: string;
  key: string;
  salt: string;
  service_provider: string;
}

export interface PaymentResponse {
  status: 'success' | 'failure' | 'pending';
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  error: string;
  error_Message: string;
}

export interface EnrollmentPayment {
  id: string;
  enrollmentId: string;
  programId: string;
  studentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  txnid: string;
  payuTxnid?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  paymentUrl?: string;
  errorMessage?: string;
}

class PayUService {
  /**
   * Generate unique transaction ID
   */
  generateTxnId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate PayU hash for payment request
   */
  generateHash(params: {
    key: string;
    txnid: string;
    amount: number;
    productinfo: string;
    firstname: string;
    email: string;
    salt: string;
  }): string {
    const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${params.salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  /**
   * Generate PayU hash for payment response verification
   */
  generateResponseHash(params: {
    salt: string;
    status: string;
    txnid: string;
    amount: number;
    productinfo: string;
    firstname: string;
    email: string;
    payuMoneyId?: string;
  }): string {
    const hashString = `${params.salt}|${params.status}|||||||||||${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${PAYU_CONFIG.merchantKey}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  /**
   * Create payment request for enrollment
   */
  async createPaymentRequest(data: {
    enrollmentId: string;
    programId: string;
    studentId: string;
    amount: number;
    currency: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    programTitle: string;
  }): Promise<{ paymentRequest: PaymentRequest; enrollmentPayment: EnrollmentPayment }> {
    try {
      const txnid = this.generateTxnId();
      const amount = Math.round(data.amount * 100) / 100; // Round to 2 decimal places

      // Create enrollment payment record
      const enrollmentPayment: EnrollmentPayment = {
        id: `payment_${Date.now()}`,
        enrollmentId: data.enrollmentId,
        programId: data.programId,
        studentId: data.studentId,
        amount: amount,
        currency: data.currency,
        status: 'pending',
        txnid: txnid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Generate hash for payment request
      const hash = this.generateHash({
        key: PAYU_CONFIG.merchantKey,
        txnid: txnid,
        amount: amount,
        productinfo: data.programTitle,
        firstname: data.studentName,
        email: data.studentEmail,
        salt: PAYU_CONFIG.salt
      });

      // Create PayU payment request
      const paymentRequest: PaymentRequest = {
        txnid: txnid,
        amount: amount,
        productinfo: data.programTitle,
        firstname: data.studentName,
        email: data.studentEmail,
        phone: data.studentPhone,
        surl: PAYU_CONFIG.successUrl,
        furl: PAYU_CONFIG.failureUrl,
        curl: PAYU_CONFIG.cancelUrl,
        hash: hash,
        key: PAYU_CONFIG.merchantKey,
        salt: PAYU_CONFIG.salt,
        service_provider: 'payu_paisa'
      };

      // In a real implementation, you would save the enrollment payment to your database
      console.log('Creating payment request:', { paymentRequest, enrollmentPayment });

      return { paymentRequest, enrollmentPayment };
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw new Error('Failed to create payment request');
    }
  }

  /**
   * Verify payment response from PayU
   */
  async verifyPaymentResponse(response: PaymentResponse): Promise<{
    isValid: boolean;
    enrollmentPayment: Partial<EnrollmentPayment>;
  }> {
    try {
      // Generate hash for verification
      const generatedHash = this.generateResponseHash({
        salt: PAYU_CONFIG.salt,
        status: response.status,
        txnid: response.txnid,
        amount: response.amount,
        productinfo: response.productinfo,
        firstname: response.firstname,
        email: response.email,
        payuMoneyId: response.hash // PayU transaction ID
      });

      const isValid = generatedHash === response.hash;

      const enrollmentPayment: Partial<EnrollmentPayment> = {
        txnid: response.txnid,
        payuTxnid: response.hash,
        status: response.status === 'success' ? 'success' : 'failed',
        updatedAt: new Date().toISOString(),
        errorMessage: response.error || response.error_Message
      };

      return { isValid, enrollmentPayment };
    } catch (error) {
      console.error('Error verifying payment response:', error);
      throw new Error('Failed to verify payment response');
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(txnid: string): Promise<{
    status: string;
    amount: number;
    payuTxnid?: string;
    errorMessage?: string;
  }> {
    try {
      // In a real implementation, you would query PayU API or your database
      // For now, return mock data
      return {
        status: 'success',
        amount: 0,
        payuTxnid: 'PAYU_' + txnid
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error('Failed to get payment status');
    }
  }

  /**
   * Process refund
   */
  async processRefund(data: {
    txnid: string;
    amount: number;
    reason: string;
  }): Promise<{
    success: boolean;
    refundId?: string;
    errorMessage?: string;
  }> {
    try {
      // In a real implementation, you would call PayU refund API
      console.log('Processing refund:', data);
      
      return {
        success: true,
        refundId: `REFUND_${Date.now()}`
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        errorMessage: 'Failed to process refund'
      };
    }
  }

  /**
   * Get payment methods
   */
  getPaymentMethods(): Array<{
    id: string;
    name: string;
    type: 'card' | 'netbanking' | 'upi' | 'wallet' | 'emi';
    icon: string;
    description: string;
  }> {
    return [
      {
        id: 'credit_card',
        name: 'Credit Card',
        type: 'card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express'
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        type: 'card',
        icon: '💳',
        description: 'All major bank debit cards'
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        type: 'netbanking',
        icon: '🏦',
        description: 'Direct bank transfer'
      },
      {
        id: 'upi',
        name: 'UPI',
        type: 'upi',
        icon: '📱',
        description: 'PhonePe, Google Pay, Paytm'
      },
      {
        id: 'wallet',
        name: 'Digital Wallet',
        type: 'wallet',
        icon: '👛',
        description: 'Paytm, Mobikwik, Freecharge'
      },
      {
        id: 'emi',
        name: 'EMI',
        type: 'emi',
        icon: '📅',
        description: 'Easy monthly installments'
      }
    ];
  }

  /**
   * Validate payment data
   */
  validatePaymentData(data: {
    amount: number;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    programTitle: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.studentName?.trim()) {
      errors.push('Student name is required');
    }

    if (!data.studentEmail?.trim()) {
      errors.push('Student email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.studentEmail)) {
      errors.push('Invalid email format');
    }

    if (!data.studentPhone?.trim()) {
      errors.push('Student phone is required');
    } else if (!/^[6-9]\d{9}$/.test(data.studentPhone.replace(/\D/g, ''))) {
      errors.push('Invalid phone number format');
    }

    if (!data.programTitle?.trim()) {
      errors.push('Program title is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  }

  /**
   * Get PayU configuration
   */
  getConfig() {
    return {
      merchantId: PAYU_CONFIG.merchantId,
      baseUrl: PAYU_CONFIG.baseUrl,
      successUrl: PAYU_CONFIG.successUrl,
      failureUrl: PAYU_CONFIG.failureUrl,
      cancelUrl: PAYU_CONFIG.cancelUrl
    };
  }
}

export const payuService = new PayUService();

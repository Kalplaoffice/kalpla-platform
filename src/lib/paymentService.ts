// PayU Payment Service
export interface PaymentRequest {
  studentId: string;
  courseId: string;
  amount: number;
  studentInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  courseInfo: {
    title: string;
    type: 'course' | 'program' | 'ksmp';
    description?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentUrl: string;
  paymentParams: any;
  message: string;
  error?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  amount: number;
  courseId: string;
  studentId: string;
  paymentDate?: string;
  failureReason?: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Initiate payment process
   */
  async initiatePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(paymentRequest)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      return data;
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check payment status');
      }

      return data;
    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  /**
   * Get payment history for a student
   */
  async getPaymentHistory(studentId: string): Promise<PaymentStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/history/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment history');
      }

      return data;
    } catch (error) {
      console.error('Payment history fetch error:', error);
      throw error;
    }
  }

  /**
   * Redirect to PayU payment page
   */
  redirectToPayU(paymentParams: any): void {
    // Create a form and submit it to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentParams.paymentUrl || 'https://secure.payu.in/_payment';
    form.target = '_blank';

    // Add all payment parameters as hidden inputs
    Object.keys(paymentParams).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentParams[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  /**
   * Handle payment success callback
   */
  async handlePaymentSuccess(transactionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ transactionId })
      });

      if (!response.ok) {
        throw new Error('Payment success handling failed');
      }
    } catch (error) {
      console.error('Payment success handling error:', error);
      throw error;
    }
  }

  /**
   * Handle payment failure callback
   */
  async handlePaymentFailure(transactionId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/failure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ transactionId, reason })
      });

      if (!response.ok) {
        throw new Error('Payment failure handling failed');
      }
    } catch (error) {
      console.error('Payment failure handling error:', error);
      throw error;
    }
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string {
    // Get token from localStorage or context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'INR'): string {
    // Use Indian locale for INR formatting with ₹ symbol
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Validate payment request
   */
  validatePaymentRequest(request: PaymentRequest): string[] {
    const errors: string[] = [];

    if (!request.studentId) {
      errors.push('Student ID is required');
    }

    if (!request.courseId) {
      errors.push('Course ID is required');
    }

    if (!request.amount || request.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!request.studentInfo?.firstName) {
      errors.push('Student first name is required');
    }

    if (!request.studentInfo?.email) {
      errors.push('Student email is required');
    }

    if (!request.courseInfo?.title) {
      errors.push('Course title is required');
    }

    return errors;
  }
}

export const paymentService = new PaymentService();
export default paymentService;

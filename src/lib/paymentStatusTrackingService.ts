import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface PaymentStatusUpdate {
  id: string;
  transactionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'timeout';
  amount: number;
  currency: string;
  gateway: string;
  payuTransactionId?: string;
  bankReference?: string;
  errorCode?: string;
  errorMessage?: string;
  processedAt: string;
  webhookData?: any;
}

export interface EnrollmentStatusUpdate {
  id: string;
  status: 'pending' | 'enrolled' | 'paid' | 'payment_failed' | 'completed' | 'dropped' | 'suspended';
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled' | 'timeout';
  updatedAt: string;
}

export interface PaymentTrackingData {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  studentName: string;
  studentEmail: string;
  programName: string;
  enrollmentId: string;
  paymentDate: string;
  gateway: string;
  payuTransactionId?: string;
  bankReference?: string;
  errorCode?: string;
  errorMessage?: string;
}

class PaymentStatusTrackingService {
  /**
   * Update payment status in DynamoDB
   */
  async updatePaymentStatus(paymentUpdate: PaymentStatusUpdate): Promise<boolean> {
    try {
      const result = await client.models.Payment.update({
        id: paymentUpdate.id,
        status: paymentUpdate.status,
        amount: paymentUpdate.amount,
        currency: paymentUpdate.currency,
        gateway: paymentUpdate.gateway,
        payuTransactionId: paymentUpdate.payuTransactionId,
        bankReference: paymentUpdate.bankReference,
        errorCode: paymentUpdate.errorCode,
        errorMessage: paymentUpdate.errorMessage,
        processedAt: paymentUpdate.processedAt,
        webhookData: paymentUpdate.webhookData ? JSON.stringify(paymentUpdate.webhookData) : null,
        updatedAt: new Date().toISOString()
      });

      console.log('Payment status updated successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  /**
   * Update enrollment status based on payment
   */
  async updateEnrollmentStatus(enrollmentUpdate: EnrollmentStatusUpdate): Promise<boolean> {
    try {
      const result = await client.models.Enrollment.update({
        id: enrollmentUpdate.id,
        status: enrollmentUpdate.status,
        paymentStatus: enrollmentUpdate.paymentStatus,
        updatedAt: enrollmentUpdate.updatedAt
      });

      console.log('Enrollment status updated successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      return false;
    }
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(transactionId: string): Promise<any> {
    try {
      const result = await client.models.Payment.list({
        filter: {
          transactionId: { eq: transactionId }
        }
      });

      return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
      console.error('Error getting payment by transaction ID:', error);
      return null;
    }
  }

  /**
   * Get enrollment by ID
   */
  async getEnrollmentById(enrollmentId: string): Promise<any> {
    try {
      const result = await client.models.Enrollment.get({ id: enrollmentId });
      return result.data;
    } catch (error) {
      console.error('Error getting enrollment by ID:', error);
      return null;
    }
  }

  /**
   * Create payment record
   */
  async createPaymentRecord(paymentData: {
    enrollmentId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    gateway: string;
  }): Promise<any> {
    try {
      const result = await client.models.Payment.create({
        enrollmentId: paymentData.enrollmentId,
        studentId: paymentData.studentId,
        studentName: paymentData.studentName,
        studentEmail: paymentData.studentEmail,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        status: 'pending',
        gateway: paymentData.gateway,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Payment record created successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error creating payment record:', error);
      throw error;
    }
  }

  /**
   * Get payment tracking data for webhook processing
   */
  async getPaymentTrackingData(transactionId: string): Promise<PaymentTrackingData | null> {
    try {
      const payment = await this.getPaymentByTransactionId(transactionId);
      if (!payment) return null;

      const enrollment = await this.getEnrollmentById(payment.enrollmentId);
      if (!enrollment) return null;

      return {
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        studentName: payment.studentName,
        studentEmail: payment.studentEmail,
        programName: enrollment.programName,
        enrollmentId: payment.enrollmentId,
        paymentDate: payment.createdAt,
        gateway: payment.gateway,
        payuTransactionId: payment.payuTransactionId,
        bankReference: payment.bankReference,
        errorCode: payment.errorCode,
        errorMessage: payment.errorMessage
      };
    } catch (error) {
      console.error('Error getting payment tracking data:', error);
      return null;
    }
  }

  /**
   * Process webhook payment update
   */
  async processWebhookPaymentUpdate(webhookData: any): Promise<{
    success: boolean;
    payment?: any;
    enrollment?: any;
    error?: string;
  }> {
    try {
      const { txnid, status, amount, mihpayid, bank_ref_num, error, error_Message } = webhookData;

      // Get existing payment record
      const existingPayment = await this.getPaymentByTransactionId(txnid);
      if (!existingPayment) {
        return {
          success: false,
          error: `Payment record not found for transaction: ${txnid}`
        };
      }

      // Update payment status
      const paymentUpdate: PaymentStatusUpdate = {
        id: existingPayment.id,
        transactionId: txnid,
        status: this.mapPayUStatus(status),
        amount: parseFloat(amount),
        currency: existingPayment.currency,
        gateway: existingPayment.gateway,
        payuTransactionId: mihpayid,
        bankReference: bank_ref_num,
        errorCode: error,
        errorMessage: error_Message,
        processedAt: new Date().toISOString(),
        webhookData: webhookData
      };

      const paymentUpdated = await this.updatePaymentStatus(paymentUpdate);
      if (!paymentUpdated) {
        return {
          success: false,
          error: 'Failed to update payment status'
        };
      }

      // Update enrollment status
      let enrollment = null;
      if (paymentUpdate.status === 'success') {
        const enrollmentUpdate: EnrollmentStatusUpdate = {
          id: existingPayment.enrollmentId,
          status: 'paid',
          paymentStatus: 'success',
          updatedAt: new Date().toISOString()
        };
        
        const enrollmentUpdated = await this.updateEnrollmentStatus(enrollmentUpdate);
        if (enrollmentUpdated) {
          enrollment = await this.getEnrollmentById(existingPayment.enrollmentId);
        }
      } else if (paymentUpdate.status === 'failed') {
        const enrollmentUpdate: EnrollmentStatusUpdate = {
          id: existingPayment.enrollmentId,
          status: 'payment_failed',
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString()
        };
        
        const enrollmentUpdated = await this.updateEnrollmentStatus(enrollmentUpdate);
        if (enrollmentUpdated) {
          enrollment = await this.getEnrollmentById(existingPayment.enrollmentId);
        }
      }

      return {
        success: true,
        payment: { ...existingPayment, ...paymentUpdate },
        enrollment: enrollment
      };
    } catch (error) {
      console.error('Error processing webhook payment update:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Map PayU status to internal status
   */
  private mapPayUStatus(payuStatus: string): 'pending' | 'success' | 'failed' | 'cancelled' | 'timeout' {
    const statusMap = {
      'success': 'success',
      'failure': 'failed',
      'pending': 'pending',
      'cancelled': 'cancelled',
      'timeout': 'timeout'
    };
    
    return statusMap[payuStatus] || 'pending';
  }

  /**
   * Get payment history for a student
   */
  async getStudentPaymentHistory(studentId: string): Promise<any[]> {
    try {
      const result = await client.models.Payment.list({
        filter: {
          studentId: { eq: studentId }
        }
      });

      return result.data || [];
    } catch (error) {
      console.error('Error getting student payment history:', error);
      return [];
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics(): Promise<{
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    totalAmount: number;
    successRate: number;
  }> {
    try {
      const result = await client.models.Payment.list();
      const payments = result.data || [];

      const stats = {
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'success').length,
        failedPayments: payments.filter(p => p.status === 'failed').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        successRate: 0
      };

      stats.successRate = stats.totalPayments > 0 ? (stats.successfulPayments / stats.totalPayments) * 100 : 0;

      return stats;
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      return {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        totalAmount: 0,
        successRate: 0
      };
    }
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format time
   */
  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'timeout':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const paymentStatusTrackingService = new PaymentStatusTrackingService();

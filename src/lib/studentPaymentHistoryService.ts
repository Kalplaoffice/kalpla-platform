import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface StudentPaymentHistory {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  subscriptionId?: string;
  planName?: string;
  planType?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
  gateway: string;
  gatewayTransactionId?: string;
  description: string;
  invoiceNumber?: string;
  paymentDate: string;
  dueDate?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  webhookData?: any;
  receiptData?: {
    receiptNumber: string;
    generatedAt: string;
    downloadUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  transactionId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  description: string;
  invoiceNumber?: string;
  planName?: string;
  planType?: string;
  status: string;
  gateway: string;
  generatedAt: string;
  downloadUrl?: string;
  qrCode?: string;
  signature?: string;
}

export interface PaymentSummary {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  refundedPayments: number;
  totalAmount: number;
  totalRefunded: number;
  netAmount: number;
  averagePaymentAmount: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
  activeSubscriptions: number;
  expiredSubscriptions: number;
}

export interface PaymentFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  paymentMethod?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  planType?: string[];
  searchTerm?: string;
}

class StudentPaymentHistoryService {
  /**
   * Get payment history for a student
   */
  async getPaymentHistory(studentId: string, filters?: PaymentFilters): Promise<StudentPaymentHistory[]> {
    try {
      let filter: any = {
        studentId: { eq: studentId }
      };
      
      if (filters?.status && filters.status.length > 0) {
        filter.status = { in: filters.status };
      }
      
      if (filters?.paymentMethod && filters.paymentMethod.length > 0) {
        filter.paymentMethod = { in: filters.paymentMethod };
      }

      const result = await client.models.PaymentTransaction.list({
        filter: filter
      });

      let payments = result.data as StudentPaymentHistory[] || [];

      // Apply additional filters
      if (filters?.dateRange) {
        payments = payments.filter(p => 
          new Date(p.paymentDate) >= new Date(filters.dateRange!.start) &&
          new Date(p.paymentDate) <= new Date(filters.dateRange!.end)
        );
      }

      if (filters?.amountRange) {
        payments = payments.filter(p => 
          p.amount >= filters.amountRange!.min &&
          p.amount <= filters.amountRange!.max
        );
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        payments = payments.filter(p => 
          p.description.toLowerCase().includes(searchLower) ||
          p.transactionId.toLowerCase().includes(searchLower) ||
          p.invoiceNumber?.toLowerCase().includes(searchLower) ||
          p.planName?.toLowerCase().includes(searchLower)
        );
      }

      // Sort by payment date (newest first)
      payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

      return payments;
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  /**
   * Get payment summary for a student
   */
  async getPaymentSummary(studentId: string): Promise<PaymentSummary> {
    try {
      const payments = await this.getPaymentHistory(studentId);
      
      const summary: PaymentSummary = {
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'success').length,
        failedPayments: payments.filter(p => p.status === 'failed').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        refundedPayments: payments.filter(p => p.status === 'refunded').length,
        totalAmount: payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0),
        totalRefunded: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0),
        netAmount: 0,
        averagePaymentAmount: 0,
        lastPaymentDate: undefined,
        nextDueDate: undefined,
        activeSubscriptions: 0,
        expiredSubscriptions: 0
      };

      summary.netAmount = summary.totalAmount - summary.totalRefunded;
      summary.averagePaymentAmount = summary.successfulPayments > 0 
        ? summary.totalAmount / summary.successfulPayments 
        : 0;

      if (payments.length > 0) {
        summary.lastPaymentDate = payments[0].paymentDate;
      }

      // Get subscription data for next due date
      const subscriptions = await this.getActiveSubscriptions(studentId);
      summary.activeSubscriptions = subscriptions.length;
      
      if (subscriptions.length > 0) {
        const nextDue = subscriptions
          .map(s => s.nextBillingDate)
          .filter(date => date && new Date(date) > new Date())
          .sort()[0];
        summary.nextDueDate = nextDue;
      }

      return summary;
    } catch (error) {
      console.error('Error getting payment summary:', error);
      return {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        refundedPayments: 0,
        totalAmount: 0,
        totalRefunded: 0,
        netAmount: 0,
        averagePaymentAmount: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0
      };
    }
  }

  /**
   * Get active subscriptions for a student
   */
  private async getActiveSubscriptions(studentId: string): Promise<any[]> {
    try {
      const result = await client.models.StudentSubscription.list({
        filter: {
          studentId: { eq: studentId },
          status: { eq: 'active' }
        }
      });
      return result.data || [];
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      return [];
    }
  }

  /**
   * Generate payment receipt
   */
  async generatePaymentReceipt(transactionId: string): Promise<PaymentReceipt> {
    try {
      const payments = await this.getPaymentHistory('current_student');
      const payment = payments.find(p => p.transactionId === transactionId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      const receiptNumber = `RCP-${Date.now()}`;
      const generatedAt = new Date().toISOString();

      const receipt: PaymentReceipt = {
        receiptNumber,
        transactionId: payment.transactionId,
        studentName: payment.studentName,
        studentEmail: payment.studentEmail,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        description: payment.description,
        invoiceNumber: payment.invoiceNumber,
        planName: payment.planName,
        planType: payment.planType,
        status: payment.status,
        gateway: payment.gateway,
        generatedAt,
        downloadUrl: this.generateReceiptDownloadUrl(receiptNumber),
        qrCode: this.generateQRCode(transactionId),
        signature: this.generateReceiptSignature(payment)
      };

      // Update payment with receipt data
      await this.updatePaymentReceiptData(transactionId, {
        receiptNumber,
        generatedAt,
        downloadUrl: receipt.downloadUrl
      });

      return receipt;
    } catch (error) {
      console.error('Error generating payment receipt:', error);
      throw error;
    }
  }

  /**
   * Update payment with receipt data
   */
  private async updatePaymentReceiptData(transactionId: string, receiptData: any): Promise<void> {
    try {
      const payments = await this.getPaymentHistory('current_student');
      const payment = payments.find(p => p.transactionId === transactionId);
      
      if (payment) {
        await client.models.PaymentTransaction.update({
          id: payment.id,
          receiptData: JSON.stringify(receiptData),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating payment receipt data:', error);
    }
  }

  /**
   * Generate receipt download URL
   */
  private generateReceiptDownloadUrl(receiptNumber: string): string {
    return `/api/receipts/${receiptNumber}/download`;
  }

  /**
   * Generate QR code for receipt
   */
  private generateQRCode(transactionId: string): string {
    // In a real implementation, this would generate a QR code
    // For now, return a placeholder
    return `QR-${transactionId}`;
  }

  /**
   * Generate receipt signature
   */
  private generateReceiptSignature(payment: StudentPaymentHistory): string {
    // In a real implementation, this would generate a digital signature
    // For now, return a placeholder
    return `SIG-${payment.transactionId}`;
  }

  /**
   * Download receipt as PDF
   */
  async downloadReceiptAsPDF(receiptNumber: string): Promise<Blob> {
    try {
      const receipt = await this.getReceiptByNumber(receiptNumber);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      // In a real implementation, this would generate a PDF
      // For now, return a mock PDF blob
      const pdfContent = this.generateReceiptPDF(receipt);
      return new Blob([pdfContent], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error downloading receipt as PDF:', error);
      throw error;
    }
  }

  /**
   * Get receipt by receipt number
   */
  private async getReceiptByNumber(receiptNumber: string): Promise<PaymentReceipt | null> {
    try {
      const payments = await this.getPaymentHistory('current_student');
      const payment = payments.find(p => 
        p.receiptData && JSON.parse(p.receiptData as any).receiptNumber === receiptNumber
      );
      
      if (!payment) {
        return null;
      }

      return {
        receiptNumber,
        transactionId: payment.transactionId,
        studentName: payment.studentName,
        studentEmail: payment.studentEmail,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        description: payment.description,
        invoiceNumber: payment.invoiceNumber,
        planName: payment.planName,
        planType: payment.planType,
        status: payment.status,
        gateway: payment.gateway,
        generatedAt: payment.receiptData ? JSON.parse(payment.receiptData as any).generatedAt : new Date().toISOString(),
        downloadUrl: payment.receiptData ? JSON.parse(payment.receiptData as any).downloadUrl : undefined,
        qrCode: this.generateQRCode(payment.transactionId),
        signature: this.generateReceiptSignature(payment)
      };
    } catch (error) {
      console.error('Error getting receipt by number:', error);
      return null;
    }
  }

  /**
   * Generate receipt PDF content
   */
  private generateReceiptPDF(receipt: PaymentReceipt): string {
    // In a real implementation, this would generate proper PDF content
    // For now, return a simple text representation
    return `
      RECEIPT
      Receipt Number: ${receipt.receiptNumber}
      Transaction ID: ${receipt.transactionId}
      Student: ${receipt.studentName}
      Email: ${receipt.studentEmail}
      Amount: ₹${receipt.amount.toLocaleString('en-IN')}
      Payment Method: ${receipt.paymentMethod}
      Payment Date: ${this.formatDate(receipt.paymentDate)}
      Description: ${receipt.description}
      Status: ${receipt.status}
      Generated At: ${this.formatDate(receipt.generatedAt)}
    `;
  }

  /**
   * Request refund for a payment
   */
  async requestRefund(transactionId: string, reason: string, attachments?: File[]): Promise<boolean> {
    try {
      const payments = await this.getPaymentHistory('current_student');
      const payment = payments.find(p => p.transactionId === transactionId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'success') {
        throw new Error('Only successful payments can be refunded');
      }

      const refundRequest = {
        transactionId: payment.transactionId,
        studentId: payment.studentId,
        studentName: payment.studentName,
        studentEmail: payment.studentEmail,
        amount: payment.amount,
        currency: payment.currency,
        reason: reason,
        status: 'pending',
        requestedBy: payment.studentId,
        requestedAt: new Date().toISOString(),
        attachments: attachments ? attachments.map(file => ({
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        })) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await client.models.RefundRequest.create(refundRequest);
      console.log('Refund request created successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error requesting refund:', error);
      return false;
    }
  }

  /**
   * Get refund status for a payment
   */
  async getRefundStatus(transactionId: string): Promise<any> {
    try {
      const result = await client.models.RefundRequest.list({
        filter: {
          transactionId: { eq: transactionId }
        }
      });

      return result.data?.[0] || null;
    } catch (error) {
      console.error('Error getting refund status:', error);
      return null;
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '🚫';
      case 'refunded':
        return '↩️';
      default:
        return '❓';
    }
  }
}

export const studentPaymentHistoryService = new StudentPaymentHistoryService();

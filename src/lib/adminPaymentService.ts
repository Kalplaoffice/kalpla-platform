import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  subscriptionId?: string;
  planName?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  processedBy?: string;
  processedAt?: string;
  refundTransactionId?: string;
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
}

export interface MentorPayout {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  amount: number;
  currency: string;
  period: string; // e.g., "2024-03"
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  upiId?: string;
  walletAddress?: string;
  processedAt?: string;
  transactionId?: string;
  fees: {
    platformFee: number;
    mentorEarnings: number;
    taxAmount: number;
    netAmount: number;
  };
  courses: {
    courseId: string;
    courseName: string;
    earnings: number;
    students: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAnalytics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  averageTransactionValue: number;
  transactionVolume: {
    period: string;
    transactions: number;
    revenue: number;
    refunds: number;
  }[];
  paymentMethodDistribution: {
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }[];
  gatewayPerformance: {
    gateway: string;
    transactions: number;
    successRate: number;
    averageProcessingTime: number;
    totalAmount: number;
  }[];
  refundAnalytics: {
    totalRefunds: number;
    refundRate: number;
    averageRefundAmount: number;
    refundReasons: {
      reason: string;
      count: number;
      amount: number;
    }[];
  };
  mentorPayouts: {
    totalPayouts: number;
    totalAmount: number;
    averagePayout: number;
    pendingPayouts: number;
    completedPayouts: number;
  };
}

export interface PaymentFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  paymentMethod?: string[];
  gateway?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  studentId?: string;
  mentorId?: string;
}

class AdminPaymentService {
  /**
   * Get all payment transactions with filters
   */
  async getPaymentTransactions(filters?: PaymentFilters): Promise<PaymentTransaction[]> {
    try {
      let filter: any = {};
      
      if (filters?.status && filters.status.length > 0) {
        filter.status = { in: filters.status };
      }
      
      if (filters?.paymentMethod && filters.paymentMethod.length > 0) {
        filter.paymentMethod = { in: filters.paymentMethod };
      }
      
      if (filters?.gateway && filters.gateway.length > 0) {
        filter.gateway = { in: filters.gateway };
      }
      
      if (filters?.studentId) {
        filter.studentId = { eq: filters.studentId };
      }

      const result = await client.models.PaymentTransaction.list({
        filter: filter
      });

      let transactions = result.data as PaymentTransaction[] || [];

      // Apply additional filters
      if (filters?.dateRange) {
        transactions = transactions.filter(t => 
          new Date(t.paymentDate) >= new Date(filters.dateRange!.start) &&
          new Date(t.paymentDate) <= new Date(filters.dateRange!.end)
        );
      }

      if (filters?.amountRange) {
        transactions = transactions.filter(t => 
          t.amount >= filters.amountRange!.min &&
          t.amount <= filters.amountRange!.max
        );
      }

      return transactions;
    } catch (error) {
      console.error('Error getting payment transactions:', error);
      return [];
    }
  }

  /**
   * Get refund requests
   */
  async getRefundRequests(): Promise<RefundRequest[]> {
    try {
      const result = await client.models.RefundRequest.list();
      return result.data as RefundRequest[] || [];
    } catch (error) {
      console.error('Error getting refund requests:', error);
      return [];
    }
  }

  /**
   * Process refund request
   */
  async processRefundRequest(refundId: string, action: 'approve' | 'reject', processedBy: string, notes?: string): Promise<boolean> {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const processedAt = new Date().toISOString();

      const result = await client.models.RefundRequest.update({
        id: refundId,
        status: status,
        processedBy: processedBy,
        processedAt: processedAt,
        notes: notes,
        updatedAt: processedAt
      });

      console.log('Refund request processed successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error processing refund request:', error);
      return false;
    }
  }

  /**
   * Get mentor payouts
   */
  async getMentorPayouts(mentorId?: string): Promise<MentorPayout[]> {
    try {
      let filter: any = {};
      
      if (mentorId) {
        filter.mentorId = { eq: mentorId };
      }

      const result = await client.models.MentorPayout.list({
        filter: filter
      });

      return result.data as MentorPayout[] || [];
    } catch (error) {
      console.error('Error getting mentor payouts:', error);
      return [];
    }
  }

  /**
   * Create mentor payout
   */
  async createMentorPayout(payoutData: Omit<MentorPayout, 'id' | 'createdAt' | 'updatedAt'>): Promise<MentorPayout> {
    try {
      const result = await client.models.MentorPayout.create({
        mentorId: payoutData.mentorId,
        mentorName: payoutData.mentorName,
        mentorEmail: payoutData.mentorEmail,
        amount: payoutData.amount,
        currency: payoutData.currency,
        period: payoutData.period,
        status: payoutData.status,
        paymentMethod: payoutData.paymentMethod,
        bankAccount: payoutData.bankAccount ? JSON.stringify(payoutData.bankAccount) : null,
        upiId: payoutData.upiId,
        walletAddress: payoutData.walletAddress,
        processedAt: payoutData.processedAt,
        transactionId: payoutData.transactionId,
        fees: JSON.stringify(payoutData.fees),
        courses: JSON.stringify(payoutData.courses),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Mentor payout created successfully:', result.data);
      return result.data as MentorPayout;
    } catch (error) {
      console.error('Error creating mentor payout:', error);
      throw error;
    }
  }

  /**
   * Process mentor payout
   */
  async processMentorPayout(payoutId: string, transactionId: string, processedBy: string): Promise<boolean> {
    try {
      const processedAt = new Date().toISOString();

      const result = await client.models.MentorPayout.update({
        id: payoutId,
        status: 'completed',
        transactionId: transactionId,
        processedAt: processedAt,
        updatedAt: processedAt
      });

      console.log('Mentor payout processed successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error processing mentor payout:', error);
      return false;
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(): Promise<PaymentAnalytics> {
    try {
      const [transactions, refunds, payouts] = await Promise.all([
        this.getPaymentTransactions(),
        this.getRefundRequests(),
        this.getMentorPayouts()
      ]);

      const analytics: PaymentAnalytics = {
        totalTransactions: transactions.length,
        successfulTransactions: transactions.filter(t => t.status === 'success').length,
        failedTransactions: transactions.filter(t => t.status === 'failed').length,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length,
        totalRevenue: transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0),
        totalRefunds: refunds.filter(r => r.status === 'processed').reduce((sum, r) => sum + r.amount, 0),
        netRevenue: 0,
        averageTransactionValue: 0,
        transactionVolume: this.calculateTransactionVolume(transactions),
        paymentMethodDistribution: this.calculatePaymentMethodDistribution(transactions),
        gatewayPerformance: this.calculateGatewayPerformance(transactions),
        refundAnalytics: this.calculateRefundAnalytics(refunds),
        mentorPayouts: this.calculateMentorPayoutAnalytics(payouts)
      };

      analytics.netRevenue = analytics.totalRevenue - analytics.totalRefunds;
      analytics.averageTransactionValue = analytics.successfulTransactions > 0 
        ? analytics.totalRevenue / analytics.successfulTransactions 
        : 0;

      return analytics;
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      return {
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        pendingTransactions: 0,
        totalRevenue: 0,
        totalRefunds: 0,
        netRevenue: 0,
        averageTransactionValue: 0,
        transactionVolume: [],
        paymentMethodDistribution: [],
        gatewayPerformance: [],
        refundAnalytics: {
          totalRefunds: 0,
          refundRate: 0,
          averageRefundAmount: 0,
          refundReasons: []
        },
        mentorPayouts: {
          totalPayouts: 0,
          totalAmount: 0,
          averagePayout: 0,
          pendingPayouts: 0,
          completedPayouts: 0
        }
      };
    }
  }

  /**
   * Calculate transaction volume over time
   */
  private calculateTransactionVolume(transactions: PaymentTransaction[]): any[] {
    const monthlyData: { [key: string]: { transactions: number; revenue: number; refunds: number } } = {};
    
    transactions.forEach(transaction => {
      const month = new Date(transaction.paymentDate).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { transactions: 0, revenue: 0, refunds: 0 };
      }
      monthlyData[month].transactions++;
      if (transaction.status === 'success') {
        monthlyData[month].revenue += transaction.amount;
      }
      if (transaction.status === 'refunded') {
        monthlyData[month].refunds += transaction.refundAmount || 0;
      }
    });

    return Object.entries(monthlyData).map(([period, data]) => ({
      period,
      transactions: data.transactions,
      revenue: data.revenue,
      refunds: data.refunds
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Calculate payment method distribution
   */
  private calculatePaymentMethodDistribution(transactions: PaymentTransaction[]): any[] {
    const methodData: { [key: string]: { count: number; amount: number } } = {};
    
    transactions.filter(t => t.status === 'success').forEach(transaction => {
      if (!methodData[transaction.paymentMethod]) {
        methodData[transaction.paymentMethod] = { count: 0, amount: 0 };
      }
      methodData[transaction.paymentMethod].count++;
      methodData[transaction.paymentMethod].amount += transaction.amount;
    });

    const totalAmount = Object.values(methodData).reduce((sum, data) => sum + data.amount, 0);

    return Object.entries(methodData).map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
    }));
  }

  /**
   * Calculate gateway performance
   */
  private calculateGatewayPerformance(transactions: PaymentTransaction[]): any[] {
    const gatewayData: { [key: string]: { transactions: number; successful: number; totalAmount: number } } = {};
    
    transactions.forEach(transaction => {
      if (!gatewayData[transaction.gateway]) {
        gatewayData[transaction.gateway] = { transactions: 0, successful: 0, totalAmount: 0 };
      }
      gatewayData[transaction.gateway].transactions++;
      if (transaction.status === 'success') {
        gatewayData[transaction.gateway].successful++;
        gatewayData[transaction.gateway].totalAmount += transaction.amount;
      }
    });

    return Object.entries(gatewayData).map(([gateway, data]) => ({
      gateway,
      transactions: data.transactions,
      successRate: data.transactions > 0 ? (data.successful / data.transactions) * 100 : 0,
      averageProcessingTime: 2.5, // Mock data
      totalAmount: data.totalAmount
    }));
  }

  /**
   * Calculate refund analytics
   */
  private calculateRefundAnalytics(refunds: RefundRequest[]): any {
    const processedRefunds = refunds.filter(r => r.status === 'processed');
    const totalRefunds = processedRefunds.reduce((sum, r) => sum + r.amount, 0);
    const averageRefundAmount = processedRefunds.length > 0 ? totalRefunds / processedRefunds.length : 0;

    const reasonData: { [key: string]: { count: number; amount: number } } = {};
    processedRefunds.forEach(refund => {
      if (!reasonData[refund.reason]) {
        reasonData[refund.reason] = { count: 0, amount: 0 };
      }
      reasonData[refund.reason].count++;
      reasonData[refund.reason].amount += refund.amount;
    });

    return {
      totalRefunds: processedRefunds.length,
      refundRate: refunds.length > 0 ? (processedRefunds.length / refunds.length) * 100 : 0,
      averageRefundAmount,
      refundReasons: Object.entries(reasonData).map(([reason, data]) => ({
        reason,
        count: data.count,
        amount: data.amount
      }))
    };
  }

  /**
   * Calculate mentor payout analytics
   */
  private calculateMentorPayoutAnalytics(payouts: MentorPayout[]): any {
    const completedPayouts = payouts.filter(p => p.status === 'completed');
    const totalAmount = completedPayouts.reduce((sum, p) => sum + p.amount, 0);
    const averagePayout = completedPayouts.length > 0 ? totalAmount / completedPayouts.length : 0;

    return {
      totalPayouts: payouts.length,
      totalAmount,
      averagePayout,
      pendingPayouts: payouts.filter(p => p.status === 'pending').length,
      completedPayouts: completedPayouts.length
    };
  }

  /**
   * Export payment data
   */
  async exportPaymentData(filters?: PaymentFilters, format: 'csv' | 'excel' = 'csv'): Promise<string> {
    try {
      const transactions = await this.getPaymentTransactions(filters);
      
      if (format === 'csv') {
        const csvData = this.generateCSV(transactions);
        return csvData;
      } else {
        // Excel export would require additional library
        return 'Excel export not implemented yet';
      }
    } catch (error) {
      console.error('Error exporting payment data:', error);
      throw error;
    }
  }

  /**
   * Generate CSV data
   */
  private generateCSV(transactions: PaymentTransaction[]): string {
    const headers = [
      'Transaction ID',
      'Student Name',
      'Student Email',
      'Amount',
      'Currency',
      'Payment Method',
      'Status',
      'Gateway',
      'Payment Date',
      'Description'
    ];

    const rows = transactions.map(transaction => [
      transaction.transactionId,
      transaction.studentName,
      transaction.studentEmail,
      transaction.amount.toString(),
      transaction.currency,
      transaction.paymentMethod,
      transaction.status,
      transaction.gateway,
      transaction.paymentDate,
      transaction.description
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
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
      day: 'numeric'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'success':
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const adminPaymentService = new AdminPaymentService();

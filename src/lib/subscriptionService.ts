import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'degree' | 'ksmp' | 'platform';
  targetId: string; // courseId, degreeId, or ksmpId
  targetName: string;
  pricingModel: 'one_time' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  price: number;
  currency: string;
  duration: number; // in days for one_time, months for recurring
  features: string[];
  isActive: boolean;
  maxStudents?: number;
  discountPercentage?: number;
  earlyBirdDiscount?: number;
  groupDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubscription {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'suspended' | 'pending';
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  paymentMethod: string;
  totalPaid: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  lastPaymentDate?: string;
  nextPaymentAmount?: number;
  cancellationDate?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: 'none' | 'requested' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
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
  webhookData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface BillingInfo {
  studentId: string;
  studentName: string;
  studentEmail: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
  companyName?: string;
  paymentMethods: {
    id: string;
    type: 'card' | 'upi' | 'netbanking' | 'wallet';
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }[];
  invoices: {
    id: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    dueDate: string;
    paidDate?: string;
    downloadUrl?: string;
  }[];
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  conversionRate: number;
  subscriptionGrowth: {
    period: string;
    newSubscriptions: number;
    cancellations: number;
    netGrowth: number;
  }[];
  revenueByPlan: {
    planId: string;
    planName: string;
    revenue: number;
    subscribers: number;
  }[];
}

class SubscriptionService {
  /**
   * Create a subscription plan
   */
  async createSubscriptionPlan(planData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlan> {
    try {
      const result = await client.models.SubscriptionPlan.create({
        name: planData.name,
        description: planData.description,
        type: planData.type,
        targetId: planData.targetId,
        targetName: planData.targetName,
        pricingModel: planData.pricingModel,
        price: planData.price,
        currency: planData.currency,
        duration: planData.duration,
        features: planData.features,
        isActive: planData.isActive,
        maxStudents: planData.maxStudents,
        discountPercentage: planData.discountPercentage,
        earlyBirdDiscount: planData.earlyBirdDiscount,
        groupDiscount: planData.groupDiscount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Subscription plan created successfully:', result.data);
      return result.data as SubscriptionPlan;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  }

  /**
   * Get subscription plans by type
   */
  async getSubscriptionPlans(type?: string, targetId?: string): Promise<SubscriptionPlan[]> {
    try {
      let filter: any = {};
      
      if (type) {
        filter.type = { eq: type };
      }
      
      if (targetId) {
        filter.targetId = { eq: targetId };
      }

      const result = await client.models.SubscriptionPlan.list({
        filter: filter
      });

      return result.data as SubscriptionPlan[] || [];
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      return [];
    }
  }

  /**
   * Create student subscription
   */
  async createStudentSubscription(subscriptionData: Omit<StudentSubscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentSubscription> {
    try {
      const result = await client.models.StudentSubscription.create({
        studentId: subscriptionData.studentId,
        studentName: subscriptionData.studentName,
        studentEmail: subscriptionData.studentEmail,
        planId: subscriptionData.planId,
        planName: subscriptionData.planName,
        status: subscriptionData.status,
        startDate: subscriptionData.startDate,
        endDate: subscriptionData.endDate,
        nextBillingDate: subscriptionData.nextBillingDate,
        autoRenew: subscriptionData.autoRenew,
        paymentMethod: subscriptionData.paymentMethod,
        totalPaid: subscriptionData.totalPaid,
        currency: subscriptionData.currency,
        billingCycle: subscriptionData.billingCycle,
        lastPaymentDate: subscriptionData.lastPaymentDate,
        nextPaymentAmount: subscriptionData.nextPaymentAmount,
        cancellationDate: subscriptionData.cancellationDate,
        cancellationReason: subscriptionData.cancellationReason,
        refundAmount: subscriptionData.refundAmount,
        refundStatus: subscriptionData.refundStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Student subscription created successfully:', result.data);
      return result.data as StudentSubscription;
    } catch (error) {
      console.error('Error creating student subscription:', error);
      throw error;
    }
  }

  /**
   * Get student subscriptions
   */
  async getStudentSubscriptions(studentId: string): Promise<StudentSubscription[]> {
    try {
      const result = await client.models.StudentSubscription.list({
        filter: {
          studentId: { eq: studentId }
        }
      });

      return result.data as StudentSubscription[] || [];
    } catch (error) {
      console.error('Error getting student subscriptions:', error);
      return [];
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(subscriptionId: string, status: string, reason?: string): Promise<boolean> {
    try {
      const updateData: any = {
        id: subscriptionId,
        status: status,
        updatedAt: new Date().toISOString()
      };

      if (status === 'cancelled' && reason) {
        updateData.cancellationDate = new Date().toISOString();
        updateData.cancellationReason = reason;
      }

      const result = await client.models.StudentSubscription.update(updateData);

      console.log('Subscription status updated successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }
  }

  /**
   * Process payment for subscription
   */
  async processSubscriptionPayment(paymentData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentTransaction> {
    try {
      const result = await client.models.PaymentTransaction.create({
        subscriptionId: paymentData.subscriptionId,
        studentId: paymentData.studentId,
        studentName: paymentData.studentName,
        studentEmail: paymentData.studentEmail,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        status: paymentData.status,
        gateway: paymentData.gateway,
        gatewayTransactionId: paymentData.gatewayTransactionId,
        description: paymentData.description,
        invoiceNumber: paymentData.invoiceNumber,
        paymentDate: paymentData.paymentDate,
        dueDate: paymentData.dueDate,
        refundAmount: paymentData.refundAmount,
        refundDate: paymentData.refundDate,
        webhookData: paymentData.webhookData ? JSON.stringify(paymentData.webhookData) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Payment transaction created successfully:', result.data);
      return result.data as PaymentTransaction;
    } catch (error) {
      console.error('Error processing subscription payment:', error);
      throw error;
    }
  }

  /**
   * Get payment history for student
   */
  async getStudentPaymentHistory(studentId: string): Promise<PaymentTransaction[]> {
    try {
      const result = await client.models.PaymentTransaction.list({
        filter: {
          studentId: { eq: studentId }
        }
      });

      return result.data as PaymentTransaction[] || [];
    } catch (error) {
      console.error('Error getting student payment history:', error);
      return [];
    }
  }

  /**
   * Calculate subscription pricing
   */
  calculateSubscriptionPricing(plan: SubscriptionPlan, studentId: string, options?: {
    earlyBird?: boolean;
    groupDiscount?: boolean;
    customDiscount?: number;
  }): {
    basePrice: number;
    discountAmount: number;
    finalPrice: number;
    currency: string;
    billingCycle: string;
    nextBillingDate?: string;
  } {
    let finalPrice = plan.price;
    let discountAmount = 0;

    // Apply early bird discount
    if (options?.earlyBird && plan.earlyBirdDiscount) {
      discountAmount += (plan.price * plan.earlyBirdDiscount) / 100;
    }

    // Apply group discount
    if (options?.groupDiscount && plan.groupDiscount) {
      discountAmount += (plan.price * plan.groupDiscount) / 100;
    }

    // Apply custom discount
    if (options?.customDiscount) {
      discountAmount += (plan.price * options.customDiscount) / 100;
    }

    // Apply general discount
    if (plan.discountPercentage) {
      discountAmount += (plan.price * plan.discountPercentage) / 100;
    }

    finalPrice = Math.max(0, plan.price - discountAmount);

    // Calculate next billing date for recurring subscriptions
    let nextBillingDate: string | undefined;
    if (plan.pricingModel !== 'one_time' && plan.pricingModel !== 'lifetime') {
      const now = new Date();
      const monthsToAdd = plan.pricingModel === 'monthly' ? 1 : 
                         plan.pricingModel === 'quarterly' ? 3 : 12;
      nextBillingDate = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, now.getDate()).toISOString();
    }

    return {
      basePrice: plan.price,
      discountAmount,
      finalPrice,
      currency: plan.currency,
      billingCycle: plan.pricingModel,
      nextBillingDate
    };
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics(): Promise<SubscriptionAnalytics> {
    try {
      const [subscriptions, payments] = await Promise.all([
        client.models.StudentSubscription.list(),
        client.models.PaymentTransaction.list()
      ]);

      const subscriptionData = subscriptions.data as StudentSubscription[] || [];
      const paymentData = payments.data as PaymentTransaction[] || [];

      const analytics: SubscriptionAnalytics = {
        totalSubscriptions: subscriptionData.length,
        activeSubscriptions: subscriptionData.filter(s => s.status === 'active').length,
        cancelledSubscriptions: subscriptionData.filter(s => s.status === 'cancelled').length,
        expiredSubscriptions: subscriptionData.filter(s => s.status === 'expired').length,
        monthlyRecurringRevenue: this.calculateMRR(subscriptionData),
        annualRecurringRevenue: this.calculateARR(subscriptionData),
        averageRevenuePerUser: this.calculateARPU(paymentData),
        churnRate: this.calculateChurnRate(subscriptionData),
        conversionRate: this.calculateConversionRate(subscriptionData),
        subscriptionGrowth: this.calculateSubscriptionGrowth(subscriptionData),
        revenueByPlan: this.calculateRevenueByPlan(subscriptionData, paymentData)
      };

      return analytics;
    } catch (error) {
      console.error('Error getting subscription analytics:', error);
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        cancelledSubscriptions: 0,
        expiredSubscriptions: 0,
        monthlyRecurringRevenue: 0,
        annualRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        churnRate: 0,
        conversionRate: 0,
        subscriptionGrowth: [],
        revenueByPlan: []
      };
    }
  }

  /**
   * Calculate Monthly Recurring Revenue (MRR)
   */
  private calculateMRR(subscriptions: StudentSubscription[]): number {
    return subscriptions
      .filter(s => s.status === 'active' && s.billingCycle !== 'one_time')
      .reduce((total, s) => {
        const monthlyAmount = s.billingCycle === 'monthly' ? s.nextPaymentAmount || 0 :
                            s.billingCycle === 'quarterly' ? (s.nextPaymentAmount || 0) / 3 :
                            s.billingCycle === 'yearly' ? (s.nextPaymentAmount || 0) / 12 : 0;
        return total + monthlyAmount;
      }, 0);
  }

  /**
   * Calculate Annual Recurring Revenue (ARR)
   */
  private calculateARR(subscriptions: StudentSubscription[]): number {
    return subscriptions
      .filter(s => s.status === 'active' && s.billingCycle !== 'one_time')
      .reduce((total, s) => {
        const annualAmount = s.billingCycle === 'monthly' ? (s.nextPaymentAmount || 0) * 12 :
                           s.billingCycle === 'quarterly' ? (s.nextPaymentAmount || 0) * 4 :
                           s.billingCycle === 'yearly' ? s.nextPaymentAmount || 0 : 0;
        return total + annualAmount;
      }, 0);
  }

  /**
   * Calculate Average Revenue Per User (ARPU)
   */
  private calculateARPU(payments: PaymentTransaction[]): number {
    const successfulPayments = payments.filter(p => p.status === 'success');
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const uniqueUsers = new Set(successfulPayments.map(p => p.studentId)).size;
    return uniqueUsers > 0 ? totalRevenue / uniqueUsers : 0;
  }

  /**
   * Calculate churn rate
   */
  private calculateChurnRate(subscriptions: StudentSubscription[]): number {
    const totalSubscriptions = subscriptions.length;
    const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled').length;
    return totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0;
  }

  /**
   * Calculate conversion rate
   */
  private calculateConversionRate(subscriptions: StudentSubscription[]): number {
    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    return totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions) * 100 : 0;
  }

  /**
   * Calculate subscription growth
   */
  private calculateSubscriptionGrowth(subscriptions: StudentSubscription[]): any[] {
    const monthlyData: { [key: string]: { new: number; cancelled: number } } = {};
    
    subscriptions.forEach(sub => {
      const month = new Date(sub.createdAt).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { new: 0, cancelled: 0 };
      }
      monthlyData[month].new++;
      
      if (sub.cancellationDate) {
        const cancelMonth = new Date(sub.cancellationDate).toISOString().substring(0, 7);
        if (!monthlyData[cancelMonth]) {
          monthlyData[cancelMonth] = { new: 0, cancelled: 0 };
        }
        monthlyData[cancelMonth].cancelled++;
      }
    });

    return Object.entries(monthlyData).map(([period, data]) => ({
      period,
      newSubscriptions: data.new,
      cancellations: data.cancelled,
      netGrowth: data.new - data.cancelled
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Calculate revenue by plan
   */
  private calculateRevenueByPlan(subscriptions: StudentSubscription[], payments: PaymentTransaction[]): any[] {
    const planRevenue: { [key: string]: { revenue: number; subscribers: number; planName: string } } = {};
    
    subscriptions.forEach(sub => {
      if (!planRevenue[sub.planId]) {
        planRevenue[sub.planId] = { revenue: 0, subscribers: 0, planName: sub.planName };
      }
      planRevenue[sub.planId].subscribers++;
    });

    payments.filter(p => p.status === 'success').forEach(payment => {
      const subscription = subscriptions.find(s => s.id === payment.subscriptionId);
      if (subscription && planRevenue[subscription.planId]) {
        planRevenue[subscription.planId].revenue += payment.amount;
      }
    });

    return Object.entries(planRevenue).map(([planId, data]) => ({
      planId,
      planName: data.planName,
      revenue: data.revenue,
      subscribers: data.subscribers
    }));
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const subscriptionService = new SubscriptionService();

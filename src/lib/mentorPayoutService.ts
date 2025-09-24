import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

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
    revenueShare: number;
  }[];
  revenueData: {
    totalRevenue: number;
    platformRevenue: number;
    mentorRevenue: number;
    revenueSharePercentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RevenueShareCalculation {
  mentorId: string;
  mentorName: string;
  period: string;
  courses: {
    courseId: string;
    courseName: string;
    totalRevenue: number;
    studentCount: number;
    revenueSharePercentage: number;
    mentorEarnings: number;
  }[];
  totalRevenue: number;
  platformFee: number;
  mentorEarnings: number;
  taxAmount: number;
  netAmount: number;
  revenueSharePercentage: number;
}

export interface PayoutBatch {
  id: string;
  batchName: string;
  period: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  totalAmount: number;
  mentorCount: number;
  processedCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
  processedAt?: string;
  payouts: MentorPayout[];
}

export interface PayoutSettings {
  platformFeePercentage: number;
  minimumPayoutAmount: number;
  taxPercentage: number;
  paymentMethods: string[];
  processingDays: number;
  autoProcessingEnabled: boolean;
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookNotifications: boolean;
  };
}

export interface PayoutAnalytics {
  totalPayouts: number;
  totalAmount: number;
  averagePayout: number;
  pendingPayouts: number;
  completedPayouts: number;
  failedPayouts: number;
  payoutTrends: {
    period: string;
    payouts: number;
    amount: number;
  }[];
  mentorEarnings: {
    mentorId: string;
    mentorName: string;
    totalEarnings: number;
    payoutCount: number;
  }[];
  revenueShareAnalysis: {
    totalRevenue: number;
    platformRevenue: number;
    mentorRevenue: number;
    averageRevenueShare: number;
  };
}

class MentorPayoutService {
  /**
   * Calculate revenue share for a mentor
   */
  async calculateRevenueShare(mentorId: string, period: string): Promise<RevenueShareCalculation> {
    try {
      // Get mentor's courses and their revenue for the period
      const courses = await this.getMentorCourses(mentorId);
      const mentor = await this.getMentorDetails(mentorId);
      
      let totalRevenue = 0;
      let totalStudents = 0;
      const courseCalculations = [];

      for (const course of courses) {
        const courseRevenue = await this.getCourseRevenue(course.id, period);
        const studentCount = await this.getCourseStudentCount(course.id, period);
        
        const revenueSharePercentage = this.getRevenueSharePercentage(course.id);
        const mentorEarnings = courseRevenue * (revenueSharePercentage / 100);
        
        courseCalculations.push({
          courseId: course.id,
          courseName: course.name,
          totalRevenue: courseRevenue,
          studentCount: studentCount,
          revenueSharePercentage: revenueSharePercentage,
          mentorEarnings: mentorEarnings
        });

        totalRevenue += courseRevenue;
        totalStudents += studentCount;
      }

      const platformFeePercentage = await this.getPlatformFeePercentage();
      const platformFee = totalRevenue * (platformFeePercentage / 100);
      const mentorEarnings = totalRevenue - platformFee;
      const taxPercentage = await this.getTaxPercentage();
      const taxAmount = mentorEarnings * (taxPercentage / 100);
      const netAmount = mentorEarnings - taxAmount;

      return {
        mentorId: mentorId,
        mentorName: mentor.name,
        period: period,
        courses: courseCalculations,
        totalRevenue: totalRevenue,
        platformFee: platformFee,
        mentorEarnings: mentorEarnings,
        taxAmount: taxAmount,
        netAmount: netAmount,
        revenueSharePercentage: ((mentorEarnings / totalRevenue) * 100)
      };
    } catch (error) {
      console.error('Error calculating revenue share:', error);
      throw error;
    }
  }

  /**
   * Create mentor payout
   */
  async createMentorPayout(calculation: RevenueShareCalculation, paymentMethod: string, paymentDetails: any): Promise<MentorPayout> {
    try {
      const payout: Omit<MentorPayout, 'id' | 'createdAt' | 'updatedAt'> = {
        mentorId: calculation.mentorId,
        mentorName: calculation.mentorName,
        mentorEmail: await this.getMentorEmail(calculation.mentorId),
        amount: calculation.netAmount,
        currency: 'INR',
        period: calculation.period,
        status: 'pending',
        paymentMethod: paymentMethod,
        bankAccount: paymentDetails.bankAccount,
        upiId: paymentDetails.upiId,
        walletAddress: paymentDetails.walletAddress,
        fees: {
          platformFee: calculation.platformFee,
          mentorEarnings: calculation.mentorEarnings,
          taxAmount: calculation.taxAmount,
          netAmount: calculation.netAmount
        },
        courses: calculation.courses.map(course => ({
          courseId: course.courseId,
          courseName: course.courseName,
          earnings: course.mentorEarnings,
          students: course.studentCount,
          revenueShare: course.revenueSharePercentage
        })),
        revenueData: {
          totalRevenue: calculation.totalRevenue,
          platformRevenue: calculation.platformFee,
          mentorRevenue: calculation.mentorEarnings,
          revenueSharePercentage: calculation.revenueSharePercentage
        }
      };

      const result = await client.models.MentorPayout.create({
        mentorId: payout.mentorId,
        mentorName: payout.mentorName,
        mentorEmail: payout.mentorEmail,
        amount: payout.amount,
        currency: payout.currency,
        period: payout.period,
        status: payout.status,
        paymentMethod: payout.paymentMethod,
        bankAccount: payout.bankAccount ? JSON.stringify(payout.bankAccount) : null,
        upiId: payout.upiId,
        walletAddress: payout.walletAddress,
        processedAt: payout.processedAt,
        transactionId: payout.transactionId,
        fees: JSON.stringify(payout.fees),
        courses: JSON.stringify(payout.courses),
        revenueData: JSON.stringify(payout.revenueData),
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
      
      // Send notification to mentor
      await this.sendPayoutNotification(payoutId, 'completed');
      
      return true;
    } catch (error) {
      console.error('Error processing mentor payout:', error);
      
      // Update status to failed
      await client.models.MentorPayout.update({
        id: payoutId,
        status: 'failed',
        updatedAt: new Date().toISOString()
      });
      
      return false;
    }
  }

  /**
   * Create payout batch
   */
  async createPayoutBatch(period: string, mentorIds: string[], createdBy: string): Promise<PayoutBatch> {
    try {
      const batchName = `Payout Batch - ${period}`;
      let totalAmount = 0;
      const payouts = [];

      for (const mentorId of mentorIds) {
        const calculation = await this.calculateRevenueShare(mentorId, period);
        
        if (calculation.netAmount > 0) {
          const mentor = await this.getMentorDetails(mentorId);
          const paymentDetails = await this.getMentorPaymentDetails(mentorId);
          
          const payout = await this.createMentorPayout(calculation, paymentDetails.method, paymentDetails.details);
          payouts.push(payout);
          totalAmount += payout.amount;
        }
      }

      const batch: Omit<PayoutBatch, 'id'> = {
        batchName: batchName,
        period: period,
        status: 'pending',
        totalAmount: totalAmount,
        mentorCount: mentorIds.length,
        processedCount: 0,
        failedCount: 0,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        payouts: payouts
      };

      // Store batch in database (would need a PayoutBatch model)
      console.log('Payout batch created successfully:', batch);
      return batch as PayoutBatch;
    } catch (error) {
      console.error('Error creating payout batch:', error);
      throw error;
    }
  }

  /**
   * Process payout batch
   */
  async processPayoutBatch(batchId: string, processedBy: string): Promise<boolean> {
    try {
      const batch = await this.getPayoutBatch(batchId);
      if (!batch) {
        throw new Error('Payout batch not found');
      }

      let processedCount = 0;
      let failedCount = 0;

      for (const payout of batch.payouts) {
        try {
          const transactionId = await this.processPayment(payout);
          await this.processMentorPayout(payout.id, transactionId, processedBy);
          processedCount++;
        } catch (error) {
          console.error(`Error processing payout ${payout.id}:`, error);
          failedCount++;
        }
      }

      // Update batch status
      const status = failedCount === 0 ? 'completed' : (processedCount > 0 ? 'processing' : 'failed');
      await this.updatePayoutBatch(batchId, {
        status: status,
        processedCount: processedCount,
        failedCount: failedCount,
        processedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error processing payout batch:', error);
      return false;
    }
  }

  /**
   * Get mentor payouts
   */
  async getMentorPayouts(mentorId?: string, period?: string): Promise<MentorPayout[]> {
    try {
      let filter: any = {};
      
      if (mentorId) {
        filter.mentorId = { eq: mentorId };
      }
      
      if (period) {
        filter.period = { eq: period };
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
   * Get payout analytics
   */
  async getPayoutAnalytics(): Promise<PayoutAnalytics> {
    try {
      const payouts = await this.getMentorPayouts();
      
      const analytics: PayoutAnalytics = {
        totalPayouts: payouts.length,
        totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
        averagePayout: 0,
        pendingPayouts: payouts.filter(p => p.status === 'pending').length,
        completedPayouts: payouts.filter(p => p.status === 'completed').length,
        failedPayouts: payouts.filter(p => p.status === 'failed').length,
        payoutTrends: this.calculatePayoutTrends(payouts),
        mentorEarnings: this.calculateMentorEarnings(payouts),
        revenueShareAnalysis: this.calculateRevenueShareAnalysis(payouts)
      };

      analytics.averagePayout = analytics.totalPayouts > 0 
        ? analytics.totalAmount / analytics.totalPayouts 
        : 0;

      return analytics;
    } catch (error) {
      console.error('Error getting payout analytics:', error);
      return {
        totalPayouts: 0,
        totalAmount: 0,
        averagePayout: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
        failedPayouts: 0,
        payoutTrends: [],
        mentorEarnings: [],
        revenueShareAnalysis: {
          totalRevenue: 0,
          platformRevenue: 0,
          mentorRevenue: 0,
          averageRevenueShare: 0
        }
      };
    }
  }

  /**
   * Get payout settings
   */
  async getPayoutSettings(): Promise<PayoutSettings> {
    try {
      // In a real implementation, this would fetch from a settings table
      return {
        platformFeePercentage: 20, // 20% platform fee
        minimumPayoutAmount: 1000, // Minimum ₹1000 payout
        taxPercentage: 10, // 10% tax
        paymentMethods: ['bank_transfer', 'upi', 'wallet'],
        processingDays: 3, // 3 business days processing
        autoProcessingEnabled: false,
        notificationSettings: {
          emailNotifications: true,
          smsNotifications: true,
          webhookNotifications: false
        }
      };
    } catch (error) {
      console.error('Error getting payout settings:', error);
      throw error;
    }
  }

  /**
   * Update payout settings
   */
  async updatePayoutSettings(settings: PayoutSettings): Promise<boolean> {
    try {
      // In a real implementation, this would update a settings table
      console.log('Payout settings updated:', settings);
      return true;
    } catch (error) {
      console.error('Error updating payout settings:', error);
      return false;
    }
  }

  // Helper methods
  private async getMentorCourses(mentorId: string): Promise<any[]> {
    try {
      // Mock data - in real implementation, fetch from database
      return [
        { id: 'course_1', name: 'Web Development Fundamentals' },
        { id: 'course_2', name: 'React Advanced Concepts' }
      ];
    } catch (error) {
      console.error('Error getting mentor courses:', error);
      return [];
    }
  }

  private async getMentorDetails(mentorId: string): Promise<any> {
    try {
      // Mock data - in real implementation, fetch from database
      return {
        id: mentorId,
        name: 'John Doe',
        email: 'john.doe@example.com'
      };
    } catch (error) {
      console.error('Error getting mentor details:', error);
      throw error;
    }
  }

  private async getCourseRevenue(courseId: string, period: string): Promise<number> {
    try {
      // Mock data - in real implementation, calculate from actual revenue
      return Math.random() * 10000 + 5000; // Random revenue between 5000-15000
    } catch (error) {
      console.error('Error getting course revenue:', error);
      return 0;
    }
  }

  private async getCourseStudentCount(courseId: string, period: string): Promise<number> {
    try {
      // Mock data - in real implementation, fetch from database
      return Math.floor(Math.random() * 100) + 10; // Random count between 10-110
    } catch (error) {
      console.error('Error getting course student count:', error);
      return 0;
    }
  }

  private getRevenueSharePercentage(courseId: string): number {
    // Mock data - in real implementation, fetch from course settings
    return 70; // 70% revenue share for mentors
  }

  private async getPlatformFeePercentage(): Promise<number> {
    return 20; // 20% platform fee
  }

  private async getTaxPercentage(): Promise<number> {
    return 10; // 10% tax
  }

  private async getMentorEmail(mentorId: string): Promise<string> {
    const mentor = await this.getMentorDetails(mentorId);
    return mentor.email;
  }

  private async getMentorPaymentDetails(mentorId: string): Promise<any> {
    try {
      // Mock data - in real implementation, fetch from mentor profile
      return {
        method: 'bank_transfer',
        details: {
          bankAccount: {
            accountNumber: '1234567890',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
            accountHolderName: 'John Doe'
          }
        }
      };
    } catch (error) {
      console.error('Error getting mentor payment details:', error);
      throw error;
    }
  }

  private async getPayoutBatch(batchId: string): Promise<PayoutBatch | null> {
    try {
      // Mock data - in real implementation, fetch from database
      return null;
    } catch (error) {
      console.error('Error getting payout batch:', error);
      return null;
    }
  }

  private async updatePayoutBatch(batchId: string, updates: any): Promise<void> {
    try {
      // Mock data - in real implementation, update database
      console.log('Payout batch updated:', batchId, updates);
    } catch (error) {
      console.error('Error updating payout batch:', error);
    }
  }

  private async processPayment(payout: MentorPayout): Promise<string> {
    try {
      // Mock payment processing - in real implementation, integrate with payment gateway
      return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  private async sendPayoutNotification(payoutId: string, status: string): Promise<void> {
    try {
      // Mock notification - in real implementation, send email/SMS
      console.log(`Payout notification sent for ${payoutId}: ${status}`);
    } catch (error) {
      console.error('Error sending payout notification:', error);
    }
  }

  private calculatePayoutTrends(payouts: MentorPayout[]): any[] {
    const monthlyData: { [key: string]: { payouts: number; amount: number } } = {};
    
    payouts.forEach(payout => {
      const month = payout.period;
      if (!monthlyData[month]) {
        monthlyData[month] = { payouts: 0, amount: 0 };
      }
      monthlyData[month].payouts++;
      monthlyData[month].amount += payout.amount;
    });

    return Object.entries(monthlyData).map(([period, data]) => ({
      period,
      payouts: data.payouts,
      amount: data.amount
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  private calculateMentorEarnings(payouts: MentorPayout[]): any[] {
    const mentorData: { [key: string]: { mentorName: string; totalEarnings: number; payoutCount: number } } = {};
    
    payouts.forEach(payout => {
      if (!mentorData[payout.mentorId]) {
        mentorData[payout.mentorId] = {
          mentorName: payout.mentorName,
          totalEarnings: 0,
          payoutCount: 0
        };
      }
      mentorData[payout.mentorId].totalEarnings += payout.amount;
      mentorData[payout.mentorId].payoutCount++;
    });

    return Object.entries(mentorData).map(([mentorId, data]) => ({
      mentorId,
      mentorName: data.mentorName,
      totalEarnings: data.totalEarnings,
      payoutCount: data.payoutCount
    }));
  }

  private calculateRevenueShareAnalysis(payouts: MentorPayout[]): any {
    let totalRevenue = 0;
    let platformRevenue = 0;
    let mentorRevenue = 0;

    payouts.forEach(payout => {
      if (payout.revenueData) {
        const revenueData = JSON.parse(payout.revenueData as any);
        totalRevenue += revenueData.totalRevenue;
        platformRevenue += revenueData.platformRevenue;
        mentorRevenue += revenueData.mentorRevenue;
      }
    });

    return {
      totalRevenue,
      platformRevenue,
      mentorRevenue,
      averageRevenueShare: totalRevenue > 0 ? (mentorRevenue / totalRevenue) * 100 : 0
    };
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const mentorPayoutService = new MentorPayoutService();

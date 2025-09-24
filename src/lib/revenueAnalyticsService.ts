import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_REVENUE_ANALYTICS,
  UPDATE_REVENUE_ANALYTICS,
  CREATE_COURSE_REVENUE,
  UPDATE_COURSE_REVENUE,
  CREATE_DEGREE_REVENUE,
  UPDATE_DEGREE_REVENUE,
  CREATE_REVENUE_TRANSACTION,
  UPDATE_REVENUE_TRANSACTION
} from '../graphql/mutations';
import {
  GET_REVENUE_ANALYTICS,
  GET_COURSE_REVENUE,
  GET_DEGREE_REVENUE,
  GET_REVENUE_TRANSACTIONS,
  GET_REVENUE_GROWTH,
  GET_REVENUE_FORECAST
} from '../graphql/queries';

const client = generateClient();

export interface RevenueAnalytics {
  id: string;
  period: AnalyticsPeriod;
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  refunds: number;
  discounts: number;
  taxes: number;
  currency: string;
  revenueBySource: RevenueBySource;
  revenueByCourse: CourseRevenueSummary[];
  revenueByDegree: DegreeRevenueSummary[];
  revenueByRegion: RegionRevenueSummary[];
  revenueByChannel: ChannelRevenueSummary[];
  growthMetrics: GrowthMetrics;
  forecastMetrics: ForecastMetrics;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsPeriod = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly';

export interface RevenueBySource {
  courseSales: number;
  degreeEnrollments: number;
  subscriptions: number;
  certifications: number;
  consulting: number;
  partnerships: number;
  other: number;
}

export interface CourseRevenueSummary {
  courseId: string;
  courseName: string;
  totalRevenue: number;
  enrollments: number;
  averagePrice: number;
  refunds: number;
  netRevenue: number;
  growthRate: number;
  revenuePerStudent: number;
  conversionRate: number;
}

export interface DegreeRevenueSummary {
  degreeId: string;
  degreeName: string;
  totalRevenue: number;
  enrollments: number;
  averagePrice: number;
  refunds: number;
  netRevenue: number;
  growthRate: number;
  revenuePerStudent: number;
  completionRate: number;
}

export interface RegionRevenueSummary {
  region: string;
  totalRevenue: number;
  enrollments: number;
  averagePrice: number;
  growthRate: number;
  marketShare: number;
}

export interface ChannelRevenueSummary {
  channel: string;
  totalRevenue: number;
  enrollments: number;
  averagePrice: number;
  growthRate: number;
  conversionRate: number;
  costPerAcquisition: number;
}

export interface GrowthMetrics {
  revenueGrowthRate: number;
  enrollmentGrowthRate: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  churnRate: number;
  retentionRate: number;
  expansionRevenue: number;
  newCustomerRevenue: number;
}

export interface ForecastMetrics {
  nextMonthRevenue: number;
  nextQuarterRevenue: number;
  nextYearRevenue: number;
  confidenceLevel: number;
  growthTrend: 'increasing' | 'decreasing' | 'stable';
  seasonalFactors: SeasonalFactor[];
}

export interface SeasonalFactor {
  month: string;
  factor: number;
  description: string;
}

export interface RevenueTransaction {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  courseId?: string;
  courseName?: string;
  degreeId?: string;
  degreeName?: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  region: string;
  channel: string;
  discountApplied: number;
  taxAmount: number;
  netAmount: number;
  refundAmount?: number;
  refundDate?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 
  | 'course_purchase' 
  | 'degree_enrollment' 
  | 'subscription' 
  | 'certification' 
  | 'consulting' 
  | 'partnership' 
  | 'refund' 
  | 'discount';

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'crypto' 
  | 'installment' 
  | 'scholarship' 
  | 'other';

export type TransactionStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled';

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  refunds: number;
  discounts: number;
  taxes: number;
  enrollments: number;
  averageRevenuePerUser: number;
  topPerformingCourses: CourseRevenueSummary[];
  topPerformingDegrees: DegreeRevenueSummary[];
  revenueByRegion: RegionRevenueSummary[];
  revenueByChannel: ChannelRevenueSummary[];
  growthTrends: GrowthTrend[];
  recommendations: string[];
}

export interface GrowthTrend {
  period: string;
  revenue: number;
  enrollments: number;
  growthRate: number;
  averageRevenuePerUser: number;
}

export interface RevenueForecast {
  period: string;
  forecastedRevenue: number;
  confidenceLevel: number;
  factors: ForecastFactor[];
  scenarios: ForecastScenario[];
}

export interface ForecastFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface ForecastScenario {
  scenario: string;
  probability: number;
  revenue: number;
  description: string;
}

class RevenueAnalyticsService {
  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(period: AnalyticsPeriod): Promise<RevenueAnalytics | null> {
    try {
      const result = await client.graphql({
        query: GET_REVENUE_ANALYTICS,
        variables: { period }
      });

      return result.data.getRevenueAnalytics;
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      return null;
    }
  }

  /**
   * Get course revenue
   */
  async getCourseRevenue(courseId: string): Promise<CourseRevenueSummary | null> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_REVENUE,
        variables: { courseId }
      });

      return result.data.getCourseRevenue;
    } catch (error) {
      console.error('Error getting course revenue:', error);
      return null;
    }
  }

  /**
   * Get degree revenue
   */
  async getDegreeRevenue(degreeId: string): Promise<DegreeRevenueSummary | null> {
    try {
      const result = await client.graphql({
        query: GET_DEGREE_REVENUE,
        variables: { degreeId }
      });

      return result.data.getDegreeRevenue;
    } catch (error) {
      console.error('Error getting degree revenue:', error);
      return null;
    }
  }

  /**
   * Get revenue transactions
   */
  async getRevenueTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    courseId?: string;
    degreeId?: string;
    region?: string;
    channel?: string;
  }): Promise<RevenueTransaction[]> {
    try {
      const result = await client.graphql({
        query: GET_REVENUE_TRANSACTIONS,
        variables: { filters }
      });

      return result.data.getRevenueTransactions || [];
    } catch (error) {
      console.error('Error getting revenue transactions:', error);
      return [];
    }
  }

  /**
   * Get revenue growth
   */
  async getRevenueGrowth(period: AnalyticsPeriod): Promise<GrowthTrend[]> {
    try {
      const result = await client.graphql({
        query: GET_REVENUE_GROWTH,
        variables: { period }
      });

      return result.data.getRevenueGrowth || [];
    } catch (error) {
      console.error('Error getting revenue growth:', error);
      return [];
    }
  }

  /**
   * Get revenue forecast
   */
  async getRevenueForecast(period: AnalyticsPeriod): Promise<RevenueForecast> {
    try {
      const result = await client.graphql({
        query: GET_REVENUE_FORECAST,
        variables: { period }
      });

      return result.data.getRevenueForecast;
    } catch (error) {
      console.error('Error getting revenue forecast:', error);
      throw new Error('Failed to get revenue forecast');
    }
  }

  /**
   * Update revenue analytics
   */
  async updateRevenueAnalytics(period: AnalyticsPeriod, updates: Partial<RevenueAnalytics>): Promise<RevenueAnalytics> {
    try {
      const result = await client.graphql({
        query: UPDATE_REVENUE_ANALYTICS,
        variables: {
          input: {
            id: period,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateRevenueAnalytics;
    } catch (error) {
      console.error('Error updating revenue analytics:', error);
      throw new Error('Failed to update revenue analytics');
    }
  }

  /**
   * Create revenue transaction
   */
  async createRevenueTransaction(transaction: Omit<RevenueTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevenueTransaction> {
    try {
      const result = await client.graphql({
        query: CREATE_REVENUE_TRANSACTION,
        variables: {
          input: {
            ...transaction,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createRevenueTransaction;
    } catch (error) {
      console.error('Error creating revenue transaction:', error);
      throw new Error('Failed to create revenue transaction');
    }
  }

  /**
   * Calculate revenue growth rate
   */
  calculateRevenueGrowthRate(currentRevenue: number, previousRevenue: number): number {
    if (previousRevenue === 0) return 0;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }

  /**
   * Calculate average revenue per user
   */
  calculateAverageRevenuePerUser(totalRevenue: number, totalUsers: number): number {
    if (totalUsers === 0) return 0;
    return totalRevenue / totalUsers;
  }

  /**
   * Calculate customer lifetime value
   */
  calculateCustomerLifetimeValue(
    averageRevenuePerUser: number,
    retentionRate: number,
    churnRate: number
  ): number {
    if (churnRate === 0) return 0;
    return averageRevenuePerUser / churnRate;
  }

  /**
   * Calculate monthly recurring revenue
   */
  calculateMonthlyRecurringRevenue(subscriptions: RevenueTransaction[]): number {
    return subscriptions
      .filter(t => t.transactionType === 'subscription' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Calculate annual recurring revenue
   */
  calculateAnnualRecurringRevenue(monthlyRecurringRevenue: number): number {
    return monthlyRecurringRevenue * 12;
  }

  /**
   * Calculate churn rate
   */
  calculateChurnRate(totalCustomers: number, churnedCustomers: number): number {
    if (totalCustomers === 0) return 0;
    return (churnedCustomers / totalCustomers) * 100;
  }

  /**
   * Calculate retention rate
   */
  calculateRetentionRate(totalCustomers: number, retainedCustomers: number): number {
    if (totalCustomers === 0) return 0;
    return (retainedCustomers / totalCustomers) * 100;
  }

  /**
   * Generate revenue report
   */
  async generateRevenueReport(
    startDate: string,
    endDate: string,
    period: AnalyticsPeriod
  ): Promise<RevenueReport> {
    try {
      const [transactions, growthTrends] = await Promise.all([
        this.getRevenueTransactions({ startDate, endDate }),
        this.getRevenueGrowth(period)
      ]);

      const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const refunds = transactions
        .filter(t => t.status === 'refunded')
        .reduce((sum, t) => sum + (t.refundAmount || 0), 0);

      const discounts = transactions
        .reduce((sum, t) => sum + t.discountApplied, 0);

      const taxes = transactions
        .reduce((sum, t) => sum + t.taxAmount, 0);

      const netRevenue = totalRevenue - refunds - discounts + taxes;

      const enrollments = transactions
        .filter(t => t.status === 'completed')
        .length;

      const averageRevenuePerUser = this.calculateAverageRevenuePerUser(totalRevenue, enrollments);

      // Group by course
      const courseRevenue = this.groupTransactionsByCourse(transactions);
      const topPerformingCourses = courseRevenue
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

      // Group by degree
      const degreeRevenue = this.groupTransactionsByDegree(transactions);
      const topPerformingDegrees = degreeRevenue
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

      // Group by region
      const regionRevenue = this.groupTransactionsByRegion(transactions);

      // Group by channel
      const channelRevenue = this.groupTransactionsByChannel(transactions);

      // Generate recommendations
      const recommendations = this.generateRevenueRecommendations(
        totalRevenue,
        netRevenue,
        refunds,
        discounts,
        growthTrends
      );

      return {
        period: `${startDate} to ${endDate}`,
        totalRevenue,
        grossRevenue: totalRevenue,
        netRevenue,
        refunds,
        discounts,
        taxes,
        enrollments,
        averageRevenuePerUser,
        topPerformingCourses,
        topPerformingDegrees,
        revenueByRegion: regionRevenue,
        revenueByChannel: channelRevenue,
        growthTrends,
        recommendations
      };
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw new Error('Failed to generate revenue report');
    }
  }

  /**
   * Group transactions by course
   */
  private groupTransactionsByCourse(transactions: RevenueTransaction[]): CourseRevenueSummary[] {
    const courseMap = new Map<string, CourseRevenueSummary>();

    transactions
      .filter(t => t.courseId && t.status === 'completed')
      .forEach(transaction => {
        const courseId = transaction.courseId!;
        
        if (!courseMap.has(courseId)) {
          courseMap.set(courseId, {
            courseId,
            courseName: transaction.courseName || 'Unknown Course',
            totalRevenue: 0,
            enrollments: 0,
            averagePrice: 0,
            refunds: 0,
            netRevenue: 0,
            growthRate: 0,
            revenuePerStudent: 0,
            conversionRate: 0
          });
        }

        const course = courseMap.get(courseId)!;
        course.totalRevenue += transaction.amount;
        course.enrollments += 1;
        course.refunds += transaction.refundAmount || 0;
      });

    // Calculate derived metrics
    courseMap.forEach(course => {
      course.averagePrice = course.totalRevenue / course.enrollments;
      course.netRevenue = course.totalRevenue - course.refunds;
      course.revenuePerStudent = course.netRevenue / course.enrollments;
    });

    return Array.from(courseMap.values());
  }

  /**
   * Group transactions by degree
   */
  private groupTransactionsByDegree(transactions: RevenueTransaction[]): DegreeRevenueSummary[] {
    const degreeMap = new Map<string, DegreeRevenueSummary>();

    transactions
      .filter(t => t.degreeId && t.status === 'completed')
      .forEach(transaction => {
        const degreeId = transaction.degreeId!;
        
        if (!degreeMap.has(degreeId)) {
          degreeMap.set(degreeId, {
            degreeId,
            degreeName: transaction.degreeName || 'Unknown Degree',
            totalRevenue: 0,
            enrollments: 0,
            averagePrice: 0,
            refunds: 0,
            netRevenue: 0,
            growthRate: 0,
            revenuePerStudent: 0,
            completionRate: 0
          });
        }

        const degree = degreeMap.get(degreeId)!;
        degree.totalRevenue += transaction.amount;
        degree.enrollments += 1;
        degree.refunds += transaction.refundAmount || 0;
      });

    // Calculate derived metrics
    degreeMap.forEach(degree => {
      degree.averagePrice = degree.totalRevenue / degree.enrollments;
      degree.netRevenue = degree.totalRevenue - degree.refunds;
      degree.revenuePerStudent = degree.netRevenue / degree.enrollments;
    });

    return Array.from(degreeMap.values());
  }

  /**
   * Group transactions by region
   */
  private groupTransactionsByRegion(transactions: RevenueTransaction[]): RegionRevenueSummary[] {
    const regionMap = new Map<string, RegionRevenueSummary>();

    transactions
      .filter(t => t.status === 'completed')
      .forEach(transaction => {
        const region = transaction.region;
        
        if (!regionMap.has(region)) {
          regionMap.set(region, {
            region,
            totalRevenue: 0,
            enrollments: 0,
            averagePrice: 0,
            growthRate: 0,
            marketShare: 0
          });
        }

        const regionData = regionMap.get(region)!;
        regionData.totalRevenue += transaction.amount;
        regionData.enrollments += 1;
      });

    // Calculate derived metrics
    const totalRevenue = Array.from(regionMap.values())
      .reduce((sum, r) => sum + r.totalRevenue, 0);

    regionMap.forEach(region => {
      region.averagePrice = region.totalRevenue / region.enrollments;
      region.marketShare = (region.totalRevenue / totalRevenue) * 100;
    });

    return Array.from(regionMap.values());
  }

  /**
   * Group transactions by channel
   */
  private groupTransactionsByChannel(transactions: RevenueTransaction[]): ChannelRevenueSummary[] {
    const channelMap = new Map<string, ChannelRevenueSummary>();

    transactions
      .filter(t => t.status === 'completed')
      .forEach(transaction => {
        const channel = transaction.channel;
        
        if (!channelMap.has(channel)) {
          channelMap.set(channel, {
            channel,
            totalRevenue: 0,
            enrollments: 0,
            averagePrice: 0,
            growthRate: 0,
            conversionRate: 0,
            costPerAcquisition: 0
          });
        }

        const channelData = channelMap.get(channel)!;
        channelData.totalRevenue += transaction.amount;
        channelData.enrollments += 1;
      });

    // Calculate derived metrics
    channelMap.forEach(channel => {
      channel.averagePrice = channel.totalRevenue / channel.enrollments;
    });

    return Array.from(channelMap.values());
  }

  /**
   * Generate revenue recommendations
   */
  private generateRevenueRecommendations(
    totalRevenue: number,
    netRevenue: number,
    refunds: number,
    discounts: number,
    growthTrends: GrowthTrend[]
  ): string[] {
    const recommendations: string[] = [];

    // Refund rate recommendations
    const refundRate = (refunds / totalRevenue) * 100;
    if (refundRate > 10) {
      recommendations.push('High refund rate detected. Review course quality and student satisfaction');
      recommendations.push('Implement better course previews and refund policies');
    }

    // Discount recommendations
    const discountRate = (discounts / totalRevenue) * 100;
    if (discountRate > 20) {
      recommendations.push('High discount rate. Consider optimizing pricing strategy');
      recommendations.push('Implement targeted discounts instead of blanket discounts');
    }

    // Growth recommendations
    if (growthTrends.length > 1) {
      const recentGrowth = growthTrends[growthTrends.length - 1].growthRate;
      if (recentGrowth < 0) {
        recommendations.push('Negative growth detected. Review marketing and product strategy');
        recommendations.push('Consider launching new courses or improving existing ones');
      } else if (recentGrowth < 5) {
        recommendations.push('Low growth rate. Implement growth strategies');
        recommendations.push('Consider expanding to new markets or channels');
      }
    }

    // Revenue optimization recommendations
    if (netRevenue < totalRevenue * 0.8) {
      recommendations.push('Low net revenue margin. Optimize operational costs');
      recommendations.push('Review pricing strategy and cost structure');
    }

    return recommendations;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Format number with commas
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  /**
   * Get growth trend direction
   */
  getGrowthTrendDirection(growthRate: number): { direction: string; color: string } {
    if (growthRate > 10) return { direction: 'Strong Growth', color: 'green' };
    if (growthRate > 5) return { direction: 'Moderate Growth', color: 'blue' };
    if (growthRate > 0) return { direction: 'Slow Growth', color: 'yellow' };
    if (growthRate > -5) return { direction: 'Decline', color: 'orange' };
    return { direction: 'Sharp Decline', color: 'red' };
  }

  /**
   * Calculate revenue forecast
   */
  calculateRevenueForecast(
    historicalData: GrowthTrend[],
    seasonalFactors: SeasonalFactor[]
  ): RevenueForecast {
    if (historicalData.length < 3) {
      return {
        period: 'Next Month',
        forecastedRevenue: 0,
        confidenceLevel: 0,
        factors: [],
        scenarios: []
      };
    }

    // Simple linear regression for trend
    const n = historicalData.length;
    const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
    const sumY = historicalData.reduce((sum, d) => sum + d.revenue, 0);
    const sumXY = historicalData.reduce((sum, d, i) => sum + i * d.revenue, 0);
    const sumXX = historicalData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextPeriodRevenue = intercept + slope * n;

    // Calculate confidence level based on historical variance
    const variance = historicalData.reduce((sum, d) => {
      const predicted = intercept + slope * historicalData.indexOf(d);
      return sum + Math.pow(d.revenue - predicted, 2);
    }, 0) / n;

    const confidenceLevel = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) / nextPeriodRevenue * 100));

    return {
      period: 'Next Month',
      forecastedRevenue: Math.max(0, nextPeriodRevenue),
      confidenceLevel,
      factors: [
        {
          factor: 'Historical Trend',
          impact: slope > 0 ? 1 : -1,
          description: slope > 0 ? 'Positive growth trend' : 'Negative growth trend'
        },
        {
          factor: 'Seasonal Factors',
          impact: 0.5,
          description: 'Seasonal variations in revenue'
        }
      ],
      scenarios: [
        {
          scenario: 'Optimistic',
          probability: 25,
          revenue: nextPeriodRevenue * 1.2,
          description: 'Best case scenario with 20% growth'
        },
        {
          scenario: 'Realistic',
          probability: 50,
          revenue: nextPeriodRevenue,
          description: 'Most likely scenario based on trends'
        },
        {
          scenario: 'Pessimistic',
          probability: 25,
          revenue: nextPeriodRevenue * 0.8,
          description: 'Worst case scenario with 20% decline'
        }
      ]
    };
  }
}

export const revenueAnalyticsService = new RevenueAnalyticsService();

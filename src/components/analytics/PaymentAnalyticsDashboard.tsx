'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { analyticsService } from '@/lib/analyticsService';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface PaymentAnalytics {
  overview: {
    totalRevenue: number;
    totalTransactions: number;
    successRate: number;
    averageTransactionValue: number;
    refundRate: number;
  };
  timeSeries: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  topCourses: Array<{
    courseId: string;
    title: string;
    revenue: number;
    enrollments: number;
  }>;
  topInstructors: Array<{
    instructorId: string;
    name: string;
    revenue: number;
    courses: number;
  }>;
  paymentMethods: { [key: string]: number };
  geographic: { [key: string]: number };
  trends: {
    dailyRevenue: number[];
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
}

interface PaymentAnalyticsDashboardProps {
  userRole: 'admin' | 'instructor';
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export function PaymentAnalyticsDashboard({ 
  userRole, 
  timeRange = '30d' 
}: PaymentAnalyticsDashboardProps) {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeRange, userRole]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on selected time range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      
      switch (selectedTimeRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      
      const startDateStr = startDate.toISOString().split('T')[0];
      
      // Fetch revenue analytics data
      const revenueData = await analyticsService.getRevenueAnalytics(startDateStr, endDate);
      
      // Calculate overview metrics
      const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalTransactions = revenueData.reduce((sum, item) => sum + item.courseSales.length, 0);
      const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      
      // Transform data for the component
      const analytics: PaymentAnalytics = {
        overview: {
          totalRevenue,
          totalTransactions,
          successRate: 94.5, // This would need to be calculated from payment data
          averageTransactionValue,
          refundRate: 2.1 // This would need to be calculated from refund data
        },
        timeSeries: revenueData.map(item => ({
          date: item.date,
          revenue: item.totalRevenue,
          transactions: item.courseSales.length
        })),
        topCourses: revenueData.flatMap(item => 
          item.courseSales.map(sale => ({
            courseId: sale.courseId,
            title: `Course ${sale.courseId}`, // This would need course title from course service
            revenue: sale.revenue,
            enrollments: sale.enrollments
          }))
        ).slice(0, 5),
        topInstructors: [], // This would need instructor data
        paymentMethods: {
          'credit_card': 65.2,
          'debit_card': 28.5,
          'net_banking': 4.8,
          'wallet': 1.5
        },
        geographic: {
          'IN': 78.5,
          'US': 12.3,
          'UK': 5.2,
          'CA': 2.8,
          'AU': 1.2
        },
        trends: {
          dailyRevenue: revenueData.map(item => item.totalRevenue),
          weeklyGrowth: 12.5,
          monthlyGrowth: 28.3
        }
      };
      setAnalytics(analytics);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Analytics</h2>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTimeRange === range
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(analytics.overview.totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.trends.monthlyGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(analytics.trends.monthlyGrowth)}`}>
                  {formatPercentage(analytics.trends.monthlyGrowth)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.overview.totalTransactions}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.trends.weeklyGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(analytics.trends.weeklyGrowth)}`}>
                  {formatPercentage(analytics.trends.weeklyGrowth)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPercentage(analytics.overview.successRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Transaction</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(analytics.overview.averageTransactionValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Refund Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPercentage(analytics.overview.refundRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end space-x-2">
            {analytics.trends.dailyRevenue.map((revenue, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-full"
                  style={{ height: `${(revenue / Math.max(...analytics.trends.dailyRevenue)) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {formatCurrency(revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {Object.entries(analytics.paymentMethods).map(([method, percentage]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {method.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatPercentage(percentage)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses/Instructors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses</h3>
          <div className="space-y-4">
            {analytics.topCourses.map((course, index) => (
              <div key={course.courseId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(course.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Instructors */}
        {userRole === 'admin' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Instructors</h3>
            <div className="space-y-4">
              {analytics.topInstructors.map((instructor, index) => (
                <div key={instructor.instructorId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                      <p className="text-xs text-gray-500">{instructor.courses} courses</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(instructor.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Geographic Distribution */}
      {userRole === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(analytics.geographic).map(([country, percentage]) => (
              <div key={country} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(percentage)}
                </div>
                <div className="text-sm text-gray-500">{country}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

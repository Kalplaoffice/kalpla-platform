'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  AcademicCapIcon,
  GraduationCapIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  EyeIcon,
  DocumentTextIcon,
  FireIcon,
  StarIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  revenueAnalyticsService, 
  RevenueAnalytics, 
  RevenueReport, 
  CourseRevenueSummary, 
  DegreeRevenueSummary,
  RevenueForecast,
  GrowthTrend
} from '@/lib/revenueAnalyticsService';

interface RevenueAnalyticsDashboardProps {
  organizationId: string;
  organizationName: string;
  adminId: string;
}

export function RevenueAnalyticsDashboard({
  organizationId,
  organizationName,
  adminId
}: RevenueAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [revenueForecast, setRevenueForecast] = useState<RevenueForecast | null>(null);
  const [growthTrends, setGrowthTrends] = useState<GrowthTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'degrees' | 'growth' | 'forecast'>('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, reportData, forecastData, trendsData] = await Promise.all([
        revenueAnalyticsService.getRevenueAnalytics(selectedPeriod),
        revenueAnalyticsService.generateRevenueReport(dateRange.startDate, dateRange.endDate, selectedPeriod),
        revenueAnalyticsService.getRevenueForecast(selectedPeriod),
        revenueAnalyticsService.getRevenueGrowth(selectedPeriod)
      ]);

      setAnalytics(analyticsData);
      setRevenueReport(reportData);
      setRevenueForecast(forecastData);
      setGrowthTrends(trendsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 10) return 'text-green-600';
    if (rate > 5) return 'text-blue-600';
    if (rate > 0) return 'text-yellow-600';
    if (rate > -5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGrowthBg = (rate: number) => {
    if (rate > 10) return 'bg-green-100';
    if (rate > 5) return 'bg-blue-100';
    if (rate > 0) return 'bg-yellow-100';
    if (rate > -5) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <ArrowUpIcon className="h-4 w-4" />;
    return <ArrowDownIcon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics || !revenueReport) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
            <p className="text-gray-600">{organizationName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {revenueAnalyticsService.formatCurrency(revenueReport.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500">
                {revenueAnalyticsService.formatCurrency(revenueReport.netRevenue)} net
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">
                {revenueAnalyticsService.formatNumber(revenueReport.enrollments)}
              </p>
              <p className="text-xs text-gray-500">
                {revenueAnalyticsService.formatCurrency(revenueReport.averageRevenuePerUser)} avg per user
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className={`text-2xl font-bold ${getGrowthColor(growthTrends[growthTrends.length - 1]?.growthRate || 0)}`}>
                {revenueAnalyticsService.formatPercentage(growthTrends[growthTrends.length - 1]?.growthRate || 0)}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                {getGrowthIcon(growthTrends[growthTrends.length - 1]?.growthRate || 0)}
                <span className="ml-1">vs previous period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refunds</p>
              <p className="text-2xl font-bold text-gray-900">
                {revenueAnalyticsService.formatCurrency(revenueReport.refunds)}
              </p>
              <p className="text-xs text-gray-500">
                {revenueAnalyticsService.formatPercentage((revenueReport.refunds / revenueReport.totalRevenue) * 100)} of total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'courses', label: 'Courses', icon: AcademicCapIcon },
              { id: 'degrees', label: 'Degrees', icon: GraduationCapIcon },
              { id: 'growth', label: 'Growth', icon: ArrowTrendingUpIcon },
              { id: 'forecast', label: 'Forecast', icon: EyeIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Revenue Sources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Course Sales</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.revenueBySource.courseSales)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Degree Enrollments</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.revenueBySource.degreeEnrollments)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subscriptions</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.revenueBySource.subscriptions)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certifications</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.revenueBySource.certifications)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Courses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollments
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Growth Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenueReport.topPerformingCourses.slice(0, 10).map((course) => (
                          <tr key={course.courseId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {course.courseName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {revenueAnalyticsService.formatCurrency(course.totalRevenue)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatNumber(course.enrollments)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatCurrency(course.averagePrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGrowthBg(course.growthRate)} ${getGrowthColor(course.growthRate)}`}>
                                {revenueAnalyticsService.formatPercentage(course.growthRate)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {revenueReport.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Course Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AcademicCapIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Total Course Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {revenueAnalyticsService.formatCurrency(
                      revenueReport.topPerformingCourses.reduce((sum, course) => sum + course.totalRevenue, 0)
                    )}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Total Enrollments</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {revenueAnalyticsService.formatNumber(
                      revenueReport.topPerformingCourses.reduce((sum, course) => sum + course.enrollments, 0)
                    )}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Average Price</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {revenueAnalyticsService.formatCurrency(
                      revenueReport.topPerformingCourses.reduce((sum, course) => sum + course.averagePrice, 0) / 
                      revenueReport.topPerformingCourses.length
                    )}
                  </p>
                </div>
              </div>

              {/* Course Performance Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollments
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Growth Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenueReport.topPerformingCourses.map((course) => (
                          <tr key={course.courseId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {course.courseName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {revenueAnalyticsService.formatCurrency(course.totalRevenue)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatNumber(course.enrollments)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatCurrency(course.averagePrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatCurrency(course.netRevenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGrowthBg(course.growthRate)} ${getGrowthColor(course.growthRate)}`}>
                                {revenueAnalyticsService.formatPercentage(course.growthRate)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Degrees Tab */}
          {activeTab === 'degrees' && (
            <div className="space-y-6">
              {/* Degree Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCapIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Total Degree Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {revenueAnalyticsService.formatCurrency(
                      revenueReport.topPerformingDegrees.reduce((sum, degree) => sum + degree.totalRevenue, 0)
                    )}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Total Enrollments</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {revenueAnalyticsService.formatNumber(
                      revenueReport.topPerformingDegrees.reduce((sum, degree) => sum + degree.enrollments, 0)
                    )}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <StarIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Completion Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {revenueAnalyticsService.formatPercentage(
                      revenueReport.topPerformingDegrees.reduce((sum, degree) => sum + degree.completionRate, 0) / 
                      revenueReport.topPerformingDegrees.length
                    )}
                  </p>
                </div>
              </div>

              {/* Degree Performance Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Degree Performance</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Degree
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollments
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Completion Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Growth Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenueReport.topPerformingDegrees.map((degree) => (
                          <tr key={degree.degreeId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {degree.degreeName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {revenueAnalyticsService.formatCurrency(degree.totalRevenue)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatNumber(degree.enrollments)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {revenueAnalyticsService.formatCurrency(degree.averagePrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {revenueAnalyticsService.formatPercentage(degree.completionRate)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGrowthBg(degree.growthRate)} ${getGrowthColor(degree.growthRate)}`}>
                                {revenueAnalyticsService.formatPercentage(degree.growthRate)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Growth Tab */}
          {activeTab === 'growth' && (
            <div className="space-y-6">
              {/* Growth Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Growth trends chart</p>
                      <p className="text-sm text-gray-400">Chart implementation pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue Growth Rate</span>
                      <span className={`text-sm font-medium ${getGrowthColor(analytics.growthMetrics.revenueGrowthRate)}`}>
                        {revenueAnalyticsService.formatPercentage(analytics.growthMetrics.revenueGrowthRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Enrollment Growth Rate</span>
                      <span className={`text-sm font-medium ${getGrowthColor(analytics.growthMetrics.enrollmentGrowthRate)}`}>
                        {revenueAnalyticsService.formatPercentage(analytics.growthMetrics.enrollmentGrowthRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.growthMetrics.customerLifetimeValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Recurring Revenue</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.growthMetrics.monthlyRecurringRevenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatPercentage(analytics.growthMetrics.churnRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatPercentage(analytics.growthMetrics.retentionRate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expansion Revenue</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.growthMetrics.expansionRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Customer Revenue</span>
                      <span className="text-sm font-medium text-gray-900">
                        {revenueAnalyticsService.formatCurrency(analytics.growthMetrics.newCustomerRevenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && revenueForecast && (
            <div className="space-y-6">
              {/* Forecast Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <EyeIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Forecasted Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {revenueAnalyticsService.formatCurrency(revenueForecast.forecastedRevenue)}
                  </p>
                  <p className="text-sm text-green-700">{revenueForecast.period}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <StarIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Confidence Level</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {revenueAnalyticsService.formatPercentage(revenueForecast.confidenceLevel)}
                  </p>
                  <p className="text-sm text-blue-700">Prediction accuracy</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Growth Trend</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 capitalize">
                    {revenueForecast.growthTrend}
                  </p>
                  <p className="text-sm text-purple-700">Expected direction</p>
                </div>
              </div>

              {/* Forecast Scenarios */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {revenueForecast.scenarios.map((scenario, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{scenario.scenario}</h4>
                        <span className="text-sm text-gray-500">{scenario.probability}%</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {revenueAnalyticsService.formatCurrency(scenario.revenue)}
                      </p>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forecast Factors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Factors</h3>
                <div className="space-y-3">
                  {revenueForecast.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{factor.factor}</span>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        factor.impact > 0 ? 'text-green-600' : 
                        factor.impact < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {factor.impact > 0 ? '+' : ''}{factor.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1250,
      totalCourses: 15,
      totalRevenue: 2500000,
      avgCompletionRate: 78
    },
    trends: {
      userGrowth: 12.5,
      revenueGrowth: 8.3,
      courseEnrollmentGrowth: 15.2,
      completionRateGrowth: -2.1
    },
    topCourses: [
      { name: 'Complete Web Development Bootcamp', enrollments: 245, revenue: 3675000, rating: 4.8 },
      { name: 'Data Science with Python', enrollments: 189, revenue: 3780000, rating: 4.9 },
      { name: 'Digital Marketing Mastery', enrollments: 156, revenue: 1248000, rating: 4.6 },
      { name: 'UI/UX Design Fundamentals', enrollments: 98, revenue: 1176000, rating: 4.7 },
      { name: 'Mobile App Development', enrollments: 67, revenue: 1206000, rating: 4.5 }
    ],
    userEngagement: {
      dailyActiveUsers: 450,
      weeklyActiveUsers: 890,
      monthlyActiveUsers: 1250,
      avgSessionDuration: '32 minutes',
      pageViews: 15600
    },
    revenueBreakdown: {
      courseSales: 8500000,
      subscriptions: 1200000,
      certifications: 450000,
      total: 10150000
    },
    completionRates: [
      { course: 'Complete Web Development Bootcamp', rate: 78 },
      { course: 'Data Science with Python', rate: 82 },
      { course: 'Digital Marketing Mastery', rate: 71 },
      { course: 'UI/UX Design Fundamentals', rate: 75 },
      { course: 'Mobile App Development', rate: 68 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600 mt-1">Comprehensive insights into platform performance and user behavior</p>
                </div>
              </div>
              
              {/* Period Selector */}
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(analyticsData.trends.userGrowth)}
                      <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.trends.userGrowth)}`}>
                        {Math.abs(analyticsData.trends.userGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserGroupIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(analyticsData.trends.revenueGrowth)}
                      <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.trends.revenueGrowth)}`}>
                        {Math.abs(analyticsData.trends.revenueGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalCourses}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(analyticsData.trends.courseEnrollmentGrowth)}
                      <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.trends.courseEnrollmentGrowth)}`}>
                        {Math.abs(analyticsData.trends.courseEnrollmentGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">enrollment growth</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <AcademicCapIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.avgCompletionRate}%</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(analyticsData.trends.completionRateGrowth)}
                      <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.trends.completionRateGrowth)}`}>
                        {Math.abs(analyticsData.trends.completionRateGrowth)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ChartBarIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>Revenue Chart Placeholder</p>
                  <p className="text-sm">Chart.js or Recharts integration needed</p>
                </div>
              </div>
            </div>

            {/* User Engagement Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>Engagement Chart Placeholder</p>
                  <p className="text-sm">Chart.js or Recharts integration needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Course</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Enrollments</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Revenue</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topCourses.map((course, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{course.name}</td>
                        <td className="py-3 text-sm text-gray-900">{course.enrollments}</td>
                        <td className="py-3 text-sm text-gray-900">{formatCurrency(course.revenue)}</td>
                        <td className="py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{course.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Completion Rates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Completion Rates</h3>
              <div className="space-y-4">
                {analyticsData.completionRates.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.course}</p>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${course.rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">
                      {course.rate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analyticsData.userEngagement.dailyActiveUsers}</div>
                <div className="text-sm text-gray-600">Daily Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analyticsData.userEngagement.weeklyActiveUsers}</div>
                <div className="text-sm text-gray-600">Weekly Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analyticsData.userEngagement.monthlyActiveUsers}</div>
                <div className="text-sm text-gray-600">Monthly Active Users</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analyticsData.userEngagement.avgSessionDuration}</div>
                <div className="text-sm text-gray-600">Average Session Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{analyticsData.userEngagement.pageViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Page Views</div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(analyticsData.revenueBreakdown.courseSales)}</div>
                <div className="text-sm text-gray-600">Course Sales</div>
                <div className="text-xs text-gray-500 mt-1">83.7% of total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.revenueBreakdown.subscriptions)}</div>
                <div className="text-sm text-gray-600">Subscriptions</div>
                <div className="text-xs text-gray-500 mt-1">11.8% of total</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(analyticsData.revenueBreakdown.certifications)}</div>
                <div className="text-sm text-gray-600">Certifications</div>
                <div className="text-xs text-gray-500 mt-1">4.4% of total</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{formatCurrency(analyticsData.revenueBreakdown.total)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-xs text-gray-500 mt-1">All sources</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
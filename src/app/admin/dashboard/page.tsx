'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface DashboardStats {
  activeStudents: number;
  activeInstructors: number;
  activeMentors: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalCourses: number;
  totalPrograms: number;
  ksmpCohorts: number;
  recentActivity: Array<{
    id: string;
    type: 'instructor_application' | 'course_submission' | 'payment' | 'user_registration';
    title: string;
    description: string;
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
  }>;
}

function AdminDashboardContent() {
  const { hasRole } = useRoleBasedAccess();
  
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats: DashboardStats = {
      activeStudents: 1247,
      activeInstructors: 89,
      activeMentors: 23,
      pendingApprovals: 12,
      totalRevenue: 125000,
      monthlyRevenue: 18500,
      revenueGrowth: 12.5,
      totalCourses: 156,
      totalPrograms: 8,
      ksmpCohorts: 4,
      recentActivity: [
        {
          id: '1',
          type: 'instructor_application',
          title: 'New Instructor Application',
          description: 'Rahul Sharma applied to become an instructor',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'pending'
        },
        {
          id: '2',
          type: 'course_submission',
          title: 'Course Submitted for Review',
          description: 'Python for Data Science course submitted by Jane Smith',
          timestamp: '2024-01-15T09:15:00Z',
          status: 'pending'
        },
        {
          id: '3',
          type: 'payment',
          title: 'Payment Received',
          description: 'Student enrollment payment: ₹2,500',
          timestamp: '2024-01-15T08:45:00Z',
          status: 'completed'
        },
        {
          id: '4',
          type: 'user_registration',
          title: 'New Student Registration',
          description: 'Priya Patel registered as a student',
          timestamp: '2024-01-15T08:20:00Z',
          status: 'completed'
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'instructor_application':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'course_submission':
        return <ChartBarIcon className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />;
      case 'user_registration':
        return <UsersIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform activity and key metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeStudents}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+5.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Instructors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeInstructors}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+2.1%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Mentors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeMentors}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+1.8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingApprovals}</p>
                <div className="flex items-center mt-1">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">Needs attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth</span>
                <div className="flex items-center">
                  {stats?.revenueGrowth && stats.revenueGrowth > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stats?.revenueGrowth && stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats?.revenueGrowth}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Courses</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.totalCourses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Degree Programs</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.totalPrograms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">KSMP Cohorts</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.ksmpCohorts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/approvals"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Review Approvals</p>
                <p className="text-sm text-gray-600">{stats?.pendingApprovals} pending</p>
              </div>
            </Link>

            <Link
              href="/admin/programs"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AcademicCapIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Programs</p>
                <p className="text-sm text-gray-600">{stats?.totalPrograms} programs</p>
              </div>
            </Link>

            <Link
              href="/admin/ksmp"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">KSMP Management</p>
                <p className="text-sm text-gray-600">{stats?.ksmpCohorts} cohorts</p>
              </div>
            </Link>

            <Link
              href="/admin/payments"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Payments</p>
                <p className="text-sm text-gray-600">Recent transactions</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/admin/activity"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all activity →
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}

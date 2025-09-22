'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  StarIcon,
  BellIcon,
  CogIcon,
  EyeIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BookOpenIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  ComputerDesktopIcon,
  ServerIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
  HeartIcon,
  CpuChipIcon,
  CloudIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  const { role } = useRoleBasedAccess();
  const { user, loading } = useAuthRedirect('/admin/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // KPI Overview Cards Data
  const kpiCards = [
    {
      title: 'Active Users Today',
      value: '1,240',
      subtitle: 'Students: 1,100 | Mentors: 95 | Investors: 45',
      icon: UsersIcon,
      color: 'blue',
      trend: '+12%',
      trendType: 'positive'
    },
    {
      title: 'Ongoing Courses',
      value: '45',
      subtitle: 'Active courses running',
      icon: BookOpenIcon,
      color: 'green',
      trend: '+3',
      trendType: 'positive'
    },
    {
      title: 'Revenue This Month',
      value: '₹1.2M',
      subtitle: 'vs ₹980K last month',
      icon: BanknotesIcon,
      color: 'purple',
      trend: '+22%',
      trendType: 'positive'
    },
    {
      title: 'Pending Applications',
      value: '32',
      subtitle: 'KSMP: 18 | Mentor: 14',
      icon: ClipboardDocumentCheckIcon,
      color: 'orange',
      trend: '+5',
      trendType: 'neutral'
    }
  ];

  // Mock data for charts and tables
  const engagementData = [
    { day: 'Mon', logins: 120, progress: 85 },
    { day: 'Tue', logins: 150, progress: 92 },
    { day: 'Wed', logins: 180, progress: 88 },
    { day: 'Thu', logins: 160, progress: 95 },
    { day: 'Fri', logins: 200, progress: 90 },
    { day: 'Sat', logins: 140, progress: 87 },
    { day: 'Sun', logins: 110, progress: 82 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850000 },
    { month: 'Feb', revenue: 920000 },
    { month: 'Mar', revenue: 980000 },
    { month: 'Apr', revenue: 1100000 },
    { month: 'May', revenue: 1200000 },
    { month: 'Jun', revenue: 1200000 }
  ];

  const pendingMentors = [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@example.com', experience: '15+ years', status: 'pending', date: '2024-01-15' },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael@example.com', experience: '12+ years', status: 'pending', date: '2024-01-14' },
    { id: 3, name: 'Dr. Emily Rodriguez', email: 'emily@example.com', experience: '10+ years', status: 'pending', date: '2024-01-13' },
    { id: 4, name: 'Mr. David Kumar', email: 'david@example.com', experience: '8+ years', status: 'pending', date: '2024-01-12' }
  ];

  const pendingKSMP = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', cohort: 'Cohort 2024-A', status: 'pending', date: '2024-01-15' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', cohort: 'Cohort 2024-A', status: 'pending', date: '2024-01-14' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', cohort: 'Cohort 2024-B', status: 'pending', date: '2024-01-13' },
    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', cohort: 'Cohort 2024-B', status: 'pending', date: '2024-01-12' }
  ];

  const topCourses = [
    { name: 'React Development Mastery', students: 320, completion: 78 },
    { name: 'Advanced JavaScript', students: 280, completion: 82 },
    { name: 'Node.js Backend Development', students: 250, completion: 75 },
    { name: 'Python for Data Science', students: 200, completion: 85 },
    { name: 'Machine Learning Basics', students: 180, completion: 70 }
  ];

  const recentTransactions = [
    { id: 1, student: 'Rahul Sharma', amount: '₹5,000', status: 'success', course: 'React Development', date: '2024-01-15' },
    { id: 2, student: 'Sneha Gupta', amount: '₹3,500', status: 'failed', course: 'JavaScript Basics', date: '2024-01-14' },
    { id: 3, student: 'Amit Singh', amount: '₹7,200', status: 'success', course: 'Node.js Backend', date: '2024-01-13' },
    { id: 4, student: 'Priya Patel', amount: '₹4,800', status: 'success', course: 'Python Data Science', date: '2024-01-12' },
    { id: 5, student: 'Vikram Kumar', amount: '₹6,000', status: 'pending', course: 'Machine Learning', date: '2024-01-11' }
  ];

  const systemHealth = [
    { name: 'API Health', status: 'healthy', value: '99.9%', icon: ServerIcon, color: 'green' },
    { name: 'Storage Usage', status: 'warning', value: '75%', icon: CloudIcon, color: 'yellow' },
    { name: 'Security Alerts', status: 'alert', value: '2', icon: LockClosedIcon, color: 'red' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'alert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed': return <XMarkIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      default: return <ExclamationCircleIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Sidebar Toggle Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
            <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
                </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Course
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckBadgeIcon className="h-5 w-5 mr-2" />
                Approve Mentors
              </button>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <EyeIcon className="h-5 w-5 mr-2" />
                View Payments
              </button>
          </div>
        </div>
      </div>

        {/* KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${
                  card.trendType === 'positive' ? 'text-green-600' : 
                  card.trendType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {card.trendType === 'positive' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : card.trendType === 'negative' ? (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  ) : null}
                  {card.trend}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm font-medium text-gray-600 mt-1">{card.title}</p>
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Engagement Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Engagement Chart</h3>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-12">{item.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.logins / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.logins}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-3">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-16">{item.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(item.revenue / 1200000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">₹{(item.revenue / 100000).toFixed(1)}L</span>
                </div>
              ))}
            </div>
          </div>
              </div>

        {/* Applications & Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Pending Mentor Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Mentor Applications</h3>
              <span className="text-sm text-gray-500">{pendingMentors.length} pending</span>
                      </div>
            <div className="space-y-3">
              {pendingMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.experience}</p>
                      </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200">
                          Approve
                        </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200">
                      Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

          {/* Pending KSMP Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending KSMP Applications</h3>
              <span className="text-sm text-gray-500">{pendingKSMP.length} pending</span>
            </div>
            <div className="space-y-3">
              {pendingKSMP.map((applicant) => (
                <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{applicant.name}</p>
                    <p className="text-sm text-gray-500">{applicant.cohort}</p>
          </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200">
                      Reject
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Courses & Learning Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Top Courses by Enrollment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Courses by Enrollment</h3>
              <BookOpenIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.completion}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Student Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
              <ChartPieIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{course.name}</span>
                    <span className="text-gray-900">{course.completion}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${course.completion}%` }}
                    ></div>
                  </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Payments Snapshot */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link href="/admin/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Transactions →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{transaction.student}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{transaction.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{transaction.course}</td>
                    <td className="py-3 px-4 text-gray-500">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemHealth.map((health, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg bg-${health.color}-100 mr-3`}>
                  <health.icon className={`h-5 w-5 text-${health.color}-600`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{health.name}</p>
                  <p className={`text-sm ${getStatusColor(health.status)}`}>
                    {health.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
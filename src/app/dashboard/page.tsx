'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import AuthDebug from '@/components/debug/AuthDebug';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  CogIcon,
  BookOpenIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { role } = useRoleBasedAccess();
  const { user, loading } = useAuthRedirect();
  const router = useRouter();

  const handleRoleRedirect = () => {
    switch (role) {
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'mentor':
        router.push('/mentor/dashboard');
        break;
      case 'instructor':
        router.push('/instructor/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'investor':
        router.push('/investor/dashboard');
        break;
      default:
        router.push('/');
        break;
    }
  };


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { name: 'Active Courses', value: '3', icon: BookOpenIcon, color: 'blue' },
    { name: 'Completed Assignments', value: '12', icon: CheckCircleIcon, color: 'green' },
    { name: 'Upcoming Deadlines', value: '2', icon: CalendarIcon, color: 'yellow' },
    { name: 'Achievements', value: '5', icon: TrophyIcon, color: 'purple' }
  ];

  const recentActivity = [
    { id: 1, action: 'Completed assignment', course: 'React Development', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'New course enrolled', course: 'Advanced JavaScript', time: '1 day ago', type: 'info' },
    { id: 3, action: 'Assignment due', course: 'Node.js Backend', time: '2 days ago', type: 'warning' },
    { id: 4, action: 'Certificate earned', course: 'Web Development Basics', time: '3 days ago', type: 'success' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Live Coding Session', time: 'Today, 2:00 PM', type: 'live' },
    { id: 2, title: 'Assignment Deadline', time: 'Tomorrow, 11:59 PM', type: 'deadline' },
    { id: 3, title: 'Mentor Meeting', time: 'Friday, 3:00 PM', type: 'meeting' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthDebug />
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name || user.email}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your {role.toLowerCase()} account.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-based Dashboard Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Access Your Dashboard</h2>
          <p className="text-gray-600 mb-4">
            You're currently logged in as a <span className="font-medium text-blue-600">{role}</span>. 
            Click below to access your role-specific dashboard.
          </p>
          <button
            onClick={handleRoleRedirect}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to {role} Dashboard
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`bg-${stat.color}-100 rounded-lg p-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.course}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                      event.type === 'live' ? 'bg-red-500' :
                      event.type === 'deadline' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Browse Courses</span>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Find Mentors</span>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Progress</span>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Schedule Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
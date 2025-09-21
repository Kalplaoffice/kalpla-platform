'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { StudentProgressTracker } from '@/components/analytics/StudentProgressTracker';
import {
  ChartBarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'revenue'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">You must be logged in to access analytics.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only administrators can access the analytics dashboard.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'students', name: 'Student Progress', icon: UsersIcon },
    { id: 'courses', name: 'Course Analytics', icon: EyeIcon },
    { id: 'revenue', name: 'Revenue Analytics', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Comprehensive analytics and insights for platform performance, student progress, and revenue metrics.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <AnalyticsDashboard userRole="Admin" />
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Progress Tracking</h3>
                <p className="text-gray-600 mb-6">
                  Monitor individual student progress across courses and identify students who may need additional support.
                </p>
                
                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Student
                    </label>
                    <input
                      type="text"
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      placeholder="Enter student ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course
                    </label>
                    <input
                      type="text"
                      value={selectedCourse || ''}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      placeholder="Enter course ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {selectedStudent && selectedCourse ? (
                  <StudentProgressTracker
                    studentId={selectedStudent}
                    courseId={selectedCourse}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a student and course to view progress details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Course Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Detailed analytics for individual courses including completion rates, drop-off points, and engagement metrics.
                </p>
                
                {/* Course Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <input
                    type="text"
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    placeholder="Enter course ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {selectedCourse ? (
                  <div className="space-y-6">
                    {/* Course-specific analytics would go here */}
                    <div className="text-center py-12 text-gray-500">
                      <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Course-specific analytics will be displayed here</p>
                      <p className="text-sm">Course ID: {selectedCourse}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a course to view detailed analytics</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive revenue tracking including transaction trends, payment method analysis, and revenue forecasting.
                </p>
                
                {/* Revenue-specific analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Revenue Trends</h4>
                    <div className="text-center py-8 text-gray-500">
                      <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Revenue trend charts will be displayed here</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Payment Methods</h4>
                    <div className="text-center py-8 text-gray-500">
                      <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Payment method breakdown will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
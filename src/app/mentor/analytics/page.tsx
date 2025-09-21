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

export default function MentorAnalyticsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'ksmp'>('overview');
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

  if (user.role !== 'MENTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only mentors can access the mentor analytics dashboard.</p>
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
    { id: 'ksmp', name: 'KSMP Analytics', icon: EyeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/mentor/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Analytics</h1>
          </div>
          <p className="text-gray-600">
            Track student progress, KSMP phase completion, and mentoring effectiveness.
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
            <AnalyticsDashboard userRole="Mentor" userId={user.id} />
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Progress Tracking</h3>
                <p className="text-gray-600 mb-6">
                  Monitor your mentees' progress across courses and KSMP phases to provide targeted support.
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

          {activeTab === 'ksmp' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">KSMP Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Track KSMP cohort progress, phase completion rates, and startup development milestones.
                </p>
                
                {/* KSMP-specific analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-blue-900 mb-2">Active Cohorts</h4>
                    <div className="text-2xl font-bold text-blue-900 mb-1">3</div>
                    <p className="text-sm text-blue-700">Currently mentoring</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-medium text-green-900 mb-2">Phase Completion</h4>
                    <div className="text-2xl font-bold text-green-900 mb-1">78%</div>
                    <p className="text-sm text-green-700">Average completion rate</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-medium text-purple-900 mb-2">Startups Funded</h4>
                    <div className="text-2xl font-bold text-purple-900 mb-1">12</div>
                    <p className="text-sm text-purple-700">From your cohorts</p>
                  </div>
                </div>

                {/* Phase Progress */}
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Phase Progress Overview</h4>
                  <div className="space-y-4">
                    {[
                      { phase: 'Phase 1: Idea Validation', progress: 95, students: 45 },
                      { phase: 'Phase 2: Market Research', progress: 87, students: 42 },
                      { phase: 'Phase 3: Business Model', progress: 78, students: 38 },
                      { phase: 'Phase 4: MVP Development', progress: 65, students: 32 },
                      { phase: 'Phase 5: User Testing', progress: 52, students: 25 },
                      { phase: 'Phase 6: Funding Strategy', progress: 43, students: 21 },
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{item.phase}</span>
                          <span className="text-sm text-gray-600">{item.students} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm font-medium text-gray-600">{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Startup "TechCorp" completed Phase 3', time: '2 hours ago', type: 'success' },
                      { action: 'New student joined Cohort 2024-2', time: '4 hours ago', type: 'info' },
                      { action: 'Demo day scheduled for Cohort 2024-1', time: '1 day ago', type: 'info' },
                      { action: 'Startup "EcoTech" received funding', time: '2 days ago', type: 'success' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.action}</p>
                          <p className="text-xs text-gray-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
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

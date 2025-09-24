'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { courseAnalyticsService, CourseAnalytics, CourseCompletionReport, StudentCourseAnalytics, EngagementMetrics, PerformanceMetrics } from '@/lib/courseAnalyticsService';

interface CourseAnalyticsDashboardProps {
  courseId: string;
  courseName: string;
  instructorId: string;
}

export function CourseAnalyticsDashboard({
  courseId,
  courseName,
  instructorId
}: CourseAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [completionReport, setCompletionReport] = useState<CourseCompletionReport | null>(null);
  const [studentAnalytics, setStudentAnalytics] = useState<StudentCourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'engagement' | 'performance' | 'demographics'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [courseId, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, completionReportData, studentAnalyticsData] = await Promise.all([
        courseAnalyticsService.getCourseAnalytics(courseId),
        courseAnalyticsService.generateCompletionReport(courseId),
        courseAnalyticsService.getStudentCourseAnalytics(courseId)
      ]);

      setAnalytics(analyticsData);
      setCompletionReport(completionReportData);
      setStudentAnalytics(studentAnalyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionStatusColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 70) return 'text-blue-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletionStatusBg = (rate: number) => {
    if (rate >= 80) return 'bg-green-100';
    if (rate >= 70) return 'bg-blue-100';
    if (rate >= 60) return 'bg-yellow-100';
    if (rate >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
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

  if (!analytics || !completionReport) {
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
            <h1 className="text-2xl font-bold text-gray-900">Course Analytics</h1>
            <p className="text-gray-600">{courseName}</p>
          </div>
          <div className="flex items-center space-x-4">
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalEnrollments}</p>
              <p className="text-xs text-gray-500">
                {analytics.activeEnrollments} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className={`text-2xl font-bold ${getCompletionStatusColor(analytics.completionRate)}`}>
                {analytics.completionRate}%
              </p>
              <p className="text-xs text-gray-500">
                {analytics.completedEnrollments} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">
                {analytics.totalRatings} ratings
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageCompletionTime}</p>
              <p className="text-xs text-gray-500">days</p>
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
              { id: 'students', label: 'Students', icon: UsersIcon },
              { id: 'engagement', label: 'Engagement', icon: HeartIcon },
              { id: 'performance', label: 'Performance', icon: AcademicCapIcon },
              { id: 'demographics', label: 'Demographics', icon: EyeIcon }
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
              {/* Completion Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Completion trends chart</p>
                      <p className="text-sm text-gray-400">Chart implementation pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {completionReport.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Student Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Top Performers</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {completionReport.topPerformingStudents.length}
                  </p>
                  <p className="text-sm text-green-700">Students with highest scores</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Struggling Students</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">
                    {completionReport.strugglingStudents.length}
                  </p>
                  <p className="text-sm text-yellow-700">Students needing support</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Active Students</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {studentAnalytics.filter(s => s.status === 'active').length}
                  </p>
                  <p className="text-sm text-blue-700">Currently enrolled</p>
                </div>
              </div>

              {/* Top Performing Students */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Completion Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completionReport.topPerformingStudents.slice(0, 10).map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {student.studentId.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    Student {student.studentId.slice(-4)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(student.enrollmentDate)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${student.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{student.progressPercentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceGrade(student.averageScore).bg} ${getPerformanceGrade(student.averageScore).color}`}>
                                {student.averageScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.completionDate ? formatDate(student.completionDate) : 'In Progress'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Struggling Students */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Students Needing Support</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Accessed
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completionReport.strugglingStudents.slice(0, 10).map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {student.studentId.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    Student {student.studentId.slice(-4)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(student.enrollmentDate)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${student.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{student.progressPercentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceGrade(student.averageScore).bg} ${getPerformanceGrade(student.averageScore).color}`}>
                                {student.averageScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(student.lastAccessedDate)}
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

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Avg. Session Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {courseAnalyticsService.formatDuration(analytics.engagement.averageSessionDuration)}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpenIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Avg. Sessions per Student</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.engagement.averageSessionsPerStudent.toFixed(1)}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ChatBubbleLeftIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Discussion Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.engagement.discussionPosts}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Assignment Submissions</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.engagement.assignmentSubmissions}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShareIcon className="h-5 w-5 text-pink-600" />
                    <span className="font-medium text-gray-900">Social Shares</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.engagement.socialShares}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Retention Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.engagement.retentionRate}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { grade: 'A (90-100)', count: analytics.performance.gradeDistribution.a, color: 'bg-green-500' },
                      { grade: 'B (80-89)', count: analytics.performance.gradeDistribution.b, color: 'bg-blue-500' },
                      { grade: 'C (70-79)', count: analytics.performance.gradeDistribution.c, color: 'bg-yellow-500' },
                      { grade: 'D (60-69)', count: analytics.performance.gradeDistribution.d, color: 'bg-orange-500' },
                      { grade: 'F (0-59)', count: analytics.performance.gradeDistribution.f, color: 'bg-red-500' }
                    ].map((item) => (
                      <div key={item.grade} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.grade}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${(item.count / analytics.performance.gradeDistribution.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Assignments</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.performance.assignmentPerformance.totalAssignments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Submitted</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.performance.assignmentPerformance.submittedAssignments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.performance.assignmentPerformance.averageScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Late Submissions</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.performance.assignmentPerformance.lateSubmissions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.demographics.ageDistribution).map(([age, count]) => (
                      <div key={age} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{age}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / analytics.demographics.ageDistribution.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.demographics.deviceDistribution).map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{device}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(count / analytics.demographics.deviceDistribution.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
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

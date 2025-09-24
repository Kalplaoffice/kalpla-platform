'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { 
  ksmpCohortAnalyticsService, 
  CohortAnalytics, 
  CohortPerformanceReport, 
  MentorPerformance, 
  StudentSuccessMetrics,
  MentorEffectivenessReport
} from '@/lib/ksmpCohortAnalyticsService';

interface KSMPCohortAnalyticsDashboardProps {
  cohortId: string;
  cohortName: string;
  programManagerId: string;
}

export function KSMPCohortAnalyticsDashboard({
  cohortId,
  cohortName,
  programManagerId
}: KSMPCohortAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<CohortAnalytics | null>(null);
  const [performanceReport, setPerformanceReport] = useState<CohortPerformanceReport | null>(null);
  const [mentorPerformance, setMentorPerformance] = useState<MentorPerformance[]>([]);
  const [studentSuccess, setStudentSuccess] = useState<StudentSuccessMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'students' | 'performance' | 'trends'>('overview');
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [mentorEffectiveness, setMentorEffectiveness] = useState<MentorEffectivenessReport | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [cohortId, selectedPeriod]);

  useEffect(() => {
    if (selectedMentor) {
      loadMentorEffectiveness(selectedMentor);
    }
  }, [selectedMentor]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, performanceReportData] = await Promise.all([
        ksmpCohortAnalyticsService.getCohortAnalytics(cohortId),
        ksmpCohortAnalyticsService.generateCohortPerformanceReport(cohortId)
      ]);

      setAnalytics(analyticsData);
      setPerformanceReport(performanceReportData);
      
      if (analyticsData) {
        setMentorPerformance(analyticsData.mentorPerformance);
        setStudentSuccess(analyticsData.studentSuccess);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadMentorEffectiveness = async (mentorId: string) => {
    try {
      const effectiveness = await ksmpCohortAnalyticsService.generateMentorEffectivenessReport(mentorId);
      setMentorEffectiveness(effectiveness);
    } catch (error) {
      console.error('Error loading mentor effectiveness:', error);
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEffectivenessBg = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 70) return 'text-blue-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSuccessBg = (rate: number) => {
    if (rate >= 80) return 'bg-green-100';
    if (rate >= 70) return 'bg-blue-100';
    if (rate >= 60) return 'bg-yellow-100';
    if (rate >= 50) return 'bg-orange-100';
    return 'bg-red-100';
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

  if (!analytics || !performanceReport) {
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
            <h1 className="text-2xl font-bold text-gray-900">KSMP Cohort Analytics</h1>
            <p className="text-gray-600">{cohortName}</p>
            <p className="text-sm text-gray-500">
              {formatDate(analytics.startDate)} - {formatDate(analytics.endDate)}
            </p>
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
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
              <p className="text-xs text-gray-500">
                {analytics.activeMentorships} active mentorships
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
              <p className="text-sm font-medium text-gray-600">Student Success Rate</p>
              <p className={`text-2xl font-bold ${getSuccessColor(analytics.studentSuccessRate)}`}>
                {analytics.studentSuccessRate}%
              </p>
              <p className="text-xs text-gray-500">
                {analytics.completedMentorships} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mentor Effectiveness</p>
              <p className={`text-2xl font-bold ${getEffectivenessColor(performanceReport.mentorEffectivenessScore)}`}>
                {performanceReport.mentorEffectivenessScore}%
              </p>
              <p className="text-xs text-gray-500">
                {analytics.totalMentors} mentors
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
              <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.satisfactionScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">
                {analytics.averageMentorRating.toFixed(1)} avg mentor rating
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
              { id: 'mentors', label: 'Mentors', icon: UserGroupIcon },
              { id: 'students', label: 'Students', icon: UsersIcon },
              { id: 'performance', label: 'Performance', icon: AcademicCapIcon },
              { id: 'trends', label: 'Trends', icon: ArrowTrendingUpIcon }
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
              {/* Cohort Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Top Performing Mentors</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {performanceReport.topPerformingMentors.length}
                  </p>
                  <p className="text-sm text-green-700">Mentors with high ratings</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Mentors Needing Support</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">
                    {performanceReport.strugglingMentors.length}
                  </p>
                  <p className="text-sm text-yellow-700">Mentors requiring improvement</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Active Students</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {studentSuccess.filter(s => s.status === 'active').length}
                  </p>
                  <p className="text-sm text-blue-700">Currently in program</p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {performanceReport.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div className="space-y-6">
              {/* Mentor Performance Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Performance</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mentor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Students
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Success Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sessions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mentorPerformance.map((mentor) => (
                          <tr key={mentor.mentorId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {mentor.mentorName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {mentor.mentorName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {mentor.mentorEmail}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {mentor.activeStudents}/{mentor.totalStudents}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mentor.completedStudents} completed
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSuccessBg(mentor.studentSuccessRate)} ${getSuccessColor(mentor.studentSuccessRate)}`}>
                                {mentor.studentSuccessRate}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-900">
                                  {mentor.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mentor.totalSessions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedMentor(mentor.mentorId)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mentor Effectiveness Modal */}
              {selectedMentor && mentorEffectiveness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Mentor Effectiveness Report: {mentorEffectiveness.mentorName}
                      </h3>
                      <button
                        onClick={() => setSelectedMentor(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Effectiveness Score</h4>
                        <p className={`text-3xl font-bold ${getEffectivenessColor(mentorEffectiveness.effectivenessScore)}`}>
                          {mentorEffectiveness.effectivenessScore}%
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Student Success Rate</h4>
                        <p className="text-3xl font-bold text-gray-900">
                          {mentorEffectiveness.studentSuccessRate}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Strengths</h4>
                        <div className="space-y-2">
                          {mentorEffectiveness.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-700">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                        <div className="space-y-2">
                          {mentorEffectiveness.areasForImprovement.map((area, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-700">{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {mentorEffectiveness.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <LightBulbIcon className="h-4 w-4 text-blue-500 mt-0.5" />
                            <span className="text-sm text-gray-700">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Student Success Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Success Metrics</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mentor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sessions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentSuccess.map((student) => (
                          <tr key={student.studentId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {student.studentName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.studentName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {student.studentEmail}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {student.mentorName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      student.progressPercentage >= 80 ? 'bg-green-500' :
                                      student.progressPercentage >= 60 ? 'bg-blue-500' :
                                      student.progressPercentage >= 40 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${student.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{student.progressPercentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'completed' ? 'bg-green-100 text-green-800' :
                                student.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                student.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.totalSessions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-900">
                                  {student.averageSessionRating.toFixed(1)}
                                </span>
                              </div>
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

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Student Success Rate</span>
                      <span className={`text-sm font-medium ${getSuccessColor(analytics.studentSuccessRate)}`}>
                        {analytics.studentSuccessRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Student Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.averageStudentProgress}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.retentionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Satisfaction Score</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.satisfactionScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Mentor Rating</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.averageMentorRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Mentorships</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.activeMentorships + analytics.completedMentorships}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Mentorships</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.activeMentorships}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed Mentorships</span>
                      <span className="text-sm font-medium text-gray-900">
                        {analytics.completedMentorships}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance trends chart</p>
                      <p className="text-sm text-gray-400">Chart implementation pending</p>
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

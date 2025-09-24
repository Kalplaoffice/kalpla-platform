'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  UserIcon,
  ChevronRightIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { studentProgressService, StudentProgress, ProgressAnalytics, AssignmentSubmission, LessonProgress } from '@/lib/studentProgressService';

interface StudentProgressDashboardProps {
  studentId: string;
  studentName: string;
  onCourseSelect?: (courseId: string) => void;
}

export function StudentProgressDashboard({
  studentId,
  studentName,
  onCourseSelect
}: StudentProgressDashboardProps) {
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);
  const [courseProgress, setCourseProgress] = useState<StudentProgress[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<AssignmentSubmission[]>([]);
  const [recentLessons, setRecentLessons] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadProgressData();
  }, [studentId, selectedTimeframe]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, courseProgressData, submissionsData] = await Promise.all([
        studentProgressService.getStudentAnalytics(studentId),
        studentProgressService.getCourseProgress(studentId),
        studentProgressService.getAssignmentSubmissions(studentId)
      ]);

      setAnalytics(analyticsData);
      setCourseProgress(courseProgressData);
      setRecentSubmissions(submissionsData.slice(0, 5)); // Show recent 5 submissions
      
      // Get recent lessons (this would typically come from a separate query)
      setRecentLessons([]);
    } catch (err: any) {
      setError(err.message || 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'submitted': return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'graded': return <StarIcon className="h-5 w-5 text-yellow-500" />;
      case 'in_progress': return <PlayIcon className="h-5 w-5 text-orange-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
          onClick={loadProgressData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No progress data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
            <p className="text-gray-600">Welcome back, {studentName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <FireIcon className="h-4 w-4 text-orange-500" />
              <span>{analytics.currentStreak} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.completedCourses}/{analytics.totalCourses}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lessons</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.completedLessons}/{analytics.totalLessons}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.submittedAssignments}/{analytics.totalAssignments}
              </p>
              <p className="text-xs text-gray-500">Submitted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {studentProgressService.formatTimeSpent(analytics.totalTimeSpent)}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Overall:</span>
            <span className={`text-lg font-bold ${getProgressColor(analytics.completionRate)}`}>
              {analytics.completionRate}%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {courseProgress.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onCourseSelect?.(course.courseId)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-500">
                      Enrolled {formatDate(course.enrollmentDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getProgressColor(course.completionPercentage)}`}>
                    {course.completionPercentage}%
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(course.completionPercentage)}`}
                    style={{ width: `${course.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>{course.completedLessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>{course.submittedAssignments} assignments</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{studentProgressService.formatTimeSpent(course.totalTimeSpent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {submission.assignmentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {submission.score !== undefined ? `${submission.score}/${submission.maxScore}` : 'Pending'} • {formatDate(submission.submissionDate)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                      submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent submissions</p>
            )}
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Lessons</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentLessons.length > 0 ? (
              recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(lesson.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {lesson.lessonName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {lesson.percentWatched}% watched • {studentProgressService.formatTimeSpent(lesson.timeSpent)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                      lesson.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lesson.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent lessons</p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">{analytics.achievements}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample achievements - in a real app, these would come from the data */}
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl">🎓</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Course Completion</p>
              <p className="text-xs text-gray-500">Complete your first course</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl">🔥</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Week Warrior</p>
              <p className="text-xs text-gray-500">7-day learning streak</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl">⭐</div>
            <div>
              <p className="text-sm font-medium text-gray-900">High Achiever</p>
              <p className="text-xs text-gray-500">Score 90% or higher</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Progress chart will be displayed here</p>
            <p className="text-sm text-gray-400">Chart implementation pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}

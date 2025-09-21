'use client';

import { useState, useEffect } from 'react';
import { analyticsService, StudentProgress } from '@/lib/analyticsService';
import {
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface StudentProgressTrackerProps {
  studentId: string;
  courseId: string;
  onProgressUpdate?: (progress: StudentProgress[]) => void;
}

export function StudentProgressTracker({ 
  studentId, 
  courseId, 
  onProgressUpdate 
}: StudentProgressTrackerProps) {
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    loadStudentProgress();
  }, [studentId, courseId]);

  const loadStudentProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const progressData = await analyticsService.getStudentProgress(studentId, courseId);
      setProgress(progressData);
      onProgressUpdate?.(progressData);
    } catch (err: any) {
      setError(err.message || 'Failed to load student progress');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 70) return 'bg-yellow-500';
    if (percent >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressIcon = (completed: boolean, percent: number) => {
    if (completed || percent >= 90) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else if (percent >= 50) {
      return <PlayIcon className="h-5 w-5 text-yellow-500" />;
    } else {
      return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getOverallProgress = () => {
    if (progress.length === 0) return 0;
    
    const totalPercent = progress.reduce((sum, item) => sum + item.percentWatched, 0);
    return totalPercent / progress.length;
  };

  const getCompletedLessons = () => {
    return progress.filter(item => item.completed || item.percentWatched >= 90).length;
  };

  const getTotalTimeSpent = () => {
    return progress.reduce((sum, item) => sum + item.timeSpent, 0);
  };

  const getLastWatchedLesson = () => {
    if (progress.length === 0) return null;
    
    return progress.reduce((latest, item) => {
      return new Date(item.lastWatchedAt) > new Date(latest.lastWatchedAt) ? item : latest;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Progress</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadStudentProgress}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (progress.length === 0) {
    return (
      <div className="text-center py-8">
        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
        <p className="text-gray-600">Student hasn't started this course yet.</p>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const completedLessons = getCompletedLessons();
  const totalTimeSpent = getTotalTimeSpent();
  const lastWatchedLesson = getLastWatchedLesson();

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatPercentage(overallProgress)}
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {completedLessons}/{progress.length}
            </div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatDuration(totalTimeSpent)}
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {lastWatchedLesson ? new Date(lastWatchedLesson.lastWatchedAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Last Activity</div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900">Course Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {formatPercentage(overallProgress)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Lesson Progress Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lesson Progress</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {progress.map((item, index) => (
            <div
              key={item.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer ${
                selectedLesson === item.lessonId ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedLesson(
                selectedLesson === item.lessonId ? null : item.lessonId
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getProgressIcon(item.completed, item.percentWatched)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Lesson {index + 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.lessonId.substring(0, 12)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPercentage(item.percentWatched)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDuration(item.timeSpent)}
                    </p>
                  </div>
                  <div className="w-16">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(item.percentWatched)}`}
                        style={{ width: `${item.percentWatched}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedLesson === item.lessonId && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Last Position:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDuration(item.lastPosition)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDuration(item.duration)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Device:</span>
                      <span className="ml-2 text-gray-600">
                        {item.device || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Watched:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(item.lastWatchedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {item.sessionId && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Session ID:</span>
                      <span className="ml-2 text-gray-600 font-mono text-xs">
                        {item.sessionId}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Insights</h3>
        <div className="space-y-4">
          {overallProgress >= 90 && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Excellent Progress!</p>
                <p className="text-sm text-green-700">
                  Student is on track to complete the course successfully.
                </p>
              </div>
            </div>
          )}
          
          {overallProgress >= 50 && overallProgress < 90 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <PlayIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Good Progress</p>
                <p className="text-sm text-yellow-700">
                  Student is making steady progress through the course.
                </p>
              </div>
            </div>
          )}
          
          {overallProgress < 50 && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Needs Attention</p>
                <p className="text-sm text-red-700">
                  Student may need additional support or motivation to continue.
                </p>
              </div>
            </div>
          )}

          {lastWatchedLesson && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <EyeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Recent Activity</p>
                <p className="text-sm text-blue-700">
                  Last watched lesson {progress.indexOf(lastWatchedLesson) + 1} on{' '}
                  {new Date(lastWatchedLesson.lastWatchedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

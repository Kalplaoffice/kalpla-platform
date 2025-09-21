'use client';

import { useState, useEffect } from 'react';
import { videoService } from '@/lib/videoService';
import {
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface VideoAnalyticsProps {
  lessonId: string;
  startDate?: string;
  endDate?: string;
}

interface VideoAnalyticsData {
  lessonId: string;
  totalViews: number;
  averageWatchTime: number;
  completionRate: number;
  dropOffPoints: number[];
  engagementScore: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  timeRange: string;
}

export function VideoAnalyticsDashboard({ lessonId, startDate, endDate }: VideoAnalyticsProps) {
  const [analytics, setAnalytics] = useState<VideoAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [lessonId, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const end = endDate || new Date().toISOString().split('T')[0];
      const start = startDate || getStartDate(selectedPeriod);
      
      const data = await videoService.getVideoAnalytics(lessonId, start, end);
      setAnalytics(data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (period: string) => {
    const now = new Date();
    switch (period) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">No video analytics data available for this lesson.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Video Analytics</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Watch Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.averageWatchTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.completionRate)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engagement Score</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.engagementScore)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatPercentage(analytics.deviceBreakdown.desktop)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatPercentage(analytics.deviceBreakdown.mobile)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Tablet</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatPercentage(analytics.deviceBreakdown.tablet)}
              </span>
            </div>
          </div>
        </div>

        {/* Drop-off Points */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Drop-off Points</h3>
          <div className="space-y-2">
            {analytics.dropOffPoints.length > 0 ? (
              analytics.dropOffPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {formatDuration(point)} into video
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.min(point / 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No significant drop-off points detected</p>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Watch Time</p>
            <p className="text-lg font-bold text-blue-900">{formatDuration(analytics.averageWatchTime)}</p>
            <p className="text-xs text-blue-600">Average per view</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Completion</p>
            <p className="text-lg font-bold text-green-900">{formatPercentage(analytics.completionRate)}</p>
            <p className="text-xs text-green-600">Of total views</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Engagement</p>
            <p className="text-lg font-bold text-purple-900">{formatPercentage(analytics.engagementScore)}</p>
            <p className="text-xs text-purple-600">Overall score</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-900 mb-4">Recommendations</h3>
        <div className="space-y-2 text-sm text-yellow-800">
          {analytics.completionRate < 0.7 && (
            <p>• Consider shortening the video or adding more interactive elements to improve completion rates</p>
          )}
          {analytics.averageWatchTime < 300 && (
            <p>• Video may be too long - consider breaking into shorter segments</p>
          )}
          {analytics.deviceBreakdown.mobile > 0.6 && (
            <p>• High mobile usage - ensure video is optimized for mobile viewing</p>
          )}
          {analytics.dropOffPoints.length > 3 && (
            <p>• Multiple drop-off points detected - review content at these timestamps</p>
          )}
        </div>
      </div>
    </div>
  );
}
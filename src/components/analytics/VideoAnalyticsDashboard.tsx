'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { videoAnalyticsService, VideoAnalytics, VideoEvent, EngagementMetrics } from '@/lib/videoAnalyticsService';

interface AnalyticsDashboardProps {
  lessonId: string;
  courseId: string;
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface AnalyticsData {
  videoAnalytics: VideoAnalytics | null;
  recentEvents: VideoEvent[];
  engagementMetrics: EngagementMetrics | null;
  loading: boolean;
  error: string | null;
}

export function VideoAnalyticsDashboard({ 
  lessonId, 
  courseId, 
  userId, 
  dateRange 
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    videoAnalytics: null,
    recentEvents: [],
    engagementMetrics: null,
    loading: true,
    error: null
  });

  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'engagement' | 'devices'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [lessonId, userId, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

      const [videoAnalytics, recentEvents, engagementMetrics] = await Promise.all([
        videoAnalyticsService.getVideoAnalytics(lessonId),
        videoAnalyticsService.getVideoEvents(lessonId, userId, undefined, 50),
        userId ? videoAnalyticsService.getUserEngagement(userId, lessonId) : null
      ]);

      setAnalyticsData({
        videoAnalytics,
        recentEvents,
        engagementMetrics,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setAnalyticsData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load analytics data'
      }));
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'PLAY': return <PlayIcon className="h-4 w-4 text-green-500" />;
      case 'PAUSE': return <PauseIcon className="h-4 w-4 text-yellow-500" />;
      case 'COMPLETE': return <ChartBarIcon className="h-4 w-4 text-blue-500" />;
      case 'SEEK': return <ArrowUpIcon className="h-4 w-4 text-purple-500" />;
      case 'QUALITY_CHANGE': return <ArrowTrendingUpIcon className="h-4 w-4 text-indigo-500" />;
      case 'ERROR': return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEngagementColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEngagementLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (analyticsData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (analyticsData.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{analyticsData.error}</p>
        <button
          onClick={loadAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { videoAnalytics, recentEvents, engagementMetrics } = analyticsData;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Video Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: ChartBarIcon },
          { id: 'events', label: 'Events', icon: ClockIcon },
          { id: 'engagement', label: 'Engagement', icon: ArrowTrendingUpIcon },
          { id: 'devices', label: 'Devices', icon: DevicePhoneMobileIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && videoAnalytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(videoAnalytics.totalViews)}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <PlayIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Plays</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(videoAnalytics.totalPlays)}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completions</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(videoAnalytics.totalCompletions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg Watch Time</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(videoAnalytics.averageWatchTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Score */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Score</h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold text-blue-600">{videoAnalytics.engagementScore}</div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPercentage(videoAnalytics.completionRate)}</p>
              </div>
            </div>
          </div>

          {/* Quality Distribution */}
          {videoAnalytics.qualityDistribution && videoAnalytics.qualityDistribution.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Distribution</h3>
              <div className="space-y-3">
                {videoAnalytics.qualityDistribution.map((quality, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{quality.quality}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${quality.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{formatPercentage(quality.percentage)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {selectedTab === 'events' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getEventIcon(event.eventType)}
                          <span className="ml-2 text-sm font-medium text-gray-900">{event.eventType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.eventDetails.currentTime && (
                          <span>Time: {formatDuration(event.eventDetails.currentTime)}</span>
                        )}
                        {event.eventDetails.quality && (
                          <span className="ml-2">Quality: {event.eventDetails.quality}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.eventDetails.deviceInfo?.platform || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Tab */}
      {selectedTab === 'engagement' && engagementMetrics && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getEngagementColor(engagementMetrics.engagementScore)}`}>
                  {engagementMetrics.engagementScore}
                </div>
                <p className="text-sm text-gray-600">Engagement Score</p>
                <p className="text-xs text-gray-500">{getEngagementLabel(engagementMetrics.engagementScore)}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{formatDuration(engagementMetrics.averageWatchTime)}</div>
                <p className="text-sm text-gray-600">Avg Watch Time</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{formatPercentage(engagementMetrics.completionRate)}</div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Interaction Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Play Count</span>
                  <span className="text-sm font-medium text-gray-900">{engagementMetrics.playCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pause Count</span>
                  <span className="text-sm font-medium text-gray-900">{engagementMetrics.pauseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Seek Count</span>
                  <span className="text-sm font-medium text-gray-900">{engagementMetrics.seekCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <span className="text-sm font-medium text-gray-900">{engagementMetrics.totalSessions}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Performance Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Watch Time Ratio</span>
                  <span className="text-sm font-medium text-gray-900">{formatPercentage(engagementMetrics.watchTimeRatio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interaction Score</span>
                  <span className="text-sm font-medium text-gray-900">{engagementMetrics.interactionScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Devices Tab */}
      {selectedTab === 'devices' && videoAnalytics && videoAnalytics.deviceDistribution && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
            <div className="space-y-4">
              {videoAnalytics.deviceDistribution.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.device === 'mobile' ? (
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ComputerDesktopIcon className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700 capitalize">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{formatPercentage(device.percentage)}</span>
                    <span className="text-sm text-gray-500 w-16 text-right">({device.userCount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
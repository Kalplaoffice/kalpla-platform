'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

import { 
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  EyeIcon,
  ArrowRightIcon,
  UsersIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';


interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'user' | 'course' | 'payment' | 'system' | 'security' | 'ksmp';
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  courseId?: string;
  courseTitle?: string;
  amount?: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export default function AdminActivityPage() {
  const { hasRole, checkAccess } = useRoleBasedAccess();
  
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockActivities: ActivityLog[] = [
      {
        id: 'a1',
        timestamp: '2024-01-21T10:30:00Z',
        type: 'user',
        level: 'info',
        action: 'User Registration',
        description: 'New user registered with email john.doe@example.com',
        userId: 'u1',
        userName: 'John Doe',
        userRole: 'Student',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 'a2',
        timestamp: '2024-01-21T10:25:00Z',
        type: 'payment',
        level: 'success',
        action: 'Payment Completed',
        description: 'Payment of ₹2,500 completed for course enrollment',
        userId: 'u2',
        userName: 'Jane Smith',
        userRole: 'Student',
        courseId: 'c1',
        courseTitle: 'React Development Fundamentals',
        amount: 2500,
        ipAddress: '192.168.1.101'
      },
      {
        id: 'a3',
        timestamp: '2024-01-21T10:20:00Z',
        type: 'course',
        level: 'info',
        action: 'Course Published',
        description: 'Course "Python for Data Science" was published by instructor',
        userId: 'u3',
        userName: 'Mike Johnson',
        userRole: 'Instructor',
        courseId: 'c2',
        courseTitle: 'Python for Data Science',
        ipAddress: '192.168.1.102'
      },
      {
        id: 'a4',
        timestamp: '2024-01-21T10:15:00Z',
        type: 'security',
        level: 'warning',
        action: 'Failed Login Attempt',
        description: 'Multiple failed login attempts detected for user account',
        userId: 'u4',
        userName: 'Unknown User',
        ipAddress: '192.168.1.103',
        metadata: { attempts: 5, blocked: true }
      },
      {
        id: 'a5',
        timestamp: '2024-01-21T10:10:00Z',
        type: 'ksmp',
        level: 'success',
        action: 'KSMP Phase Completion',
        description: 'Student completed Phase 3 of KSMP program',
        userId: 'u5',
        userName: 'Sarah Wilson',
        userRole: 'Student',
        ipAddress: '192.168.1.104',
        metadata: { phase: 3, grade: 92 }
      },
      {
        id: 'a6',
        timestamp: '2024-01-21T10:05:00Z',
        type: 'system',
        level: 'info',
        action: 'System Backup',
        description: 'Automated system backup completed successfully',
        ipAddress: '10.0.0.1',
        metadata: { size: '2.5GB', duration: '15 minutes' }
      },
      {
        id: 'a7',
        timestamp: '2024-01-21T10:00:00Z',
        type: 'user',
        level: 'error',
        action: 'Account Suspension',
        description: 'User account suspended due to policy violation',
        userId: 'u6',
        userName: 'Alex Brown',
        userRole: 'Student',
        ipAddress: '192.168.1.105',
        metadata: { reason: 'Spam content', duration: '7 days' }
      },
      {
        id: 'a8',
        timestamp: '2024-01-21T09:55:00Z',
        type: 'payment',
        level: 'warning',
        action: 'Payment Failed',
        description: 'Payment attempt failed due to insufficient funds',
        userId: 'u7',
        userName: 'David Lee',
        userRole: 'Student',
        courseId: 'c3',
        courseTitle: 'AWS Cloud Architecture',
        amount: 4000,
        ipAddress: '192.168.1.106'
      },
      {
        id: 'a9',
        timestamp: '2024-01-21T09:50:00Z',
        type: 'course',
        level: 'info',
        action: 'Assignment Submission',
        description: 'Student submitted assignment for grading',
        userId: 'u8',
        userName: 'Emma Davis',
        userRole: 'Student',
        courseId: 'c1',
        courseTitle: 'React Development Fundamentals',
        ipAddress: '192.168.1.107',
        metadata: { assignmentId: 'a123', fileName: 'project.zip' }
      },
      {
        id: 'a10',
        timestamp: '2024-01-21T09:45:00Z',
        type: 'ksmp',
        level: 'info',
        action: 'Live Session Started',
        description: 'Live mentoring session started for KSMP cohort',
        userId: 'u9',
        userName: 'Dr. Rajesh Kumar',
        userRole: 'Mentor',
        ipAddress: '192.168.1.108',
        metadata: { sessionId: 's123', attendees: 25, platform: 'Zoom' }
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, [dateFilter]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.userName && activity.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesLevel = levelFilter === 'all' || activity.level === levelFilter;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'error':
        return <ExclamationCircleIcon className="h-4 w-4" />;
      case 'info':
        return <InformationCircleIcon className="h-4 w-4" />;
      default:
        return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case 'course':
        return <AcademicCapIcon className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
      case 'security':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'ksmp':
        return <DocumentTextIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin activity page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-gray-600">Monitor platform activity and system events</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Export Log
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Activities</p>
                <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Events</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activities.filter(a => a.level === 'success').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Warnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activities.filter(a => a.level === 'warning').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Errors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activities.filter(a => a.level === 'error').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="course">Course</option>
                <option value="payment">Payment</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="ksmp">KSMP</option>
              </select>
              
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{activity.action}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(activity.level)}`}>
                            {getLevelIcon(activity.level)}
                            <span className="ml-1">{activity.level}</span>
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(activity.timestamp)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {formatTime(activity.timestamp)}
                          </div>
                          {activity.userName && (
                            <div className="flex items-center">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {activity.userName}
                            </div>
                          )}
                          {activity.ipAddress && (
                            <div className="flex items-center">
                              <span className="mr-1">IP:</span>
                              {activity.ipAddress}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(activity)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' || levelFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No activities recorded for the selected time period.'}
            </p>
          </div>
        )}

        {/* Activity Detail Modal */}
        {showDetailModal && selectedActivity && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedActivity.action}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Timestamp</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedActivity.timestamp)} at {formatTime(selectedActivity.timestamp)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Level</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedActivity.level)}`}>
                          {getLevelIcon(selectedActivity.level)}
                          <span className="ml-1">{selectedActivity.level}</span>
                        </span>
                      </div>
                    </div>

                    {selectedActivity.userName && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">User Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>Name: {selectedActivity.userName}</div>
                          <div>Role: {selectedActivity.userRole}</div>
                          <div>User ID: {selectedActivity.userId}</div>
                        </div>
                      </div>
                    )}

                    {selectedActivity.courseTitle && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Course Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>Title: {selectedActivity.courseTitle}</div>
                          <div>Course ID: {selectedActivity.courseId}</div>
                        </div>
                      </div>
                    )}

                    {selectedActivity.amount && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                        <div className="text-sm text-gray-600">
                          Amount: ₹{selectedActivity.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}

                    {selectedActivity.ipAddress && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Technical Details</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>IP Address: {selectedActivity.ipAddress}</div>
                          {selectedActivity.userAgent && (
                            <div>User Agent: {selectedActivity.userAgent}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Data</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <pre className="text-xs text-gray-600">
                            {JSON.stringify(selectedActivity.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  CheckIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'course' | 'assignment' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  category: 'course' | 'assignment' | 'payment' | 'system' | 'general';
  actionUrl?: string;
  actionLabel?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'course',
        title: 'New Course Available',
        message: 'Python for Data Science course is now available for enrollment. Start your data science journey today!',
        isRead: false,
        timestamp: '2024-01-20T10:30:00Z',
        category: 'course',
        actionUrl: '/courses/python-data-science',
        actionLabel: 'View Course'
      },
      {
        id: '2',
        type: 'assignment',
        title: 'Assignment Due Soon',
        message: 'Your Business Model Canvas assignment is due in 2 days. Don\'t forget to submit your work!',
        isRead: false,
        timestamp: '2024-01-19T14:15:00Z',
        category: 'assignment',
        actionUrl: '/assignments',
        actionLabel: 'View Assignment'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment of ₹2,500 for React Development course has been processed successfully.',
        isRead: true,
        timestamp: '2024-01-18T16:45:00Z',
        category: 'payment',
        actionUrl: '/payments/history',
        actionLabel: 'View Payment'
      },
      {
        id: '4',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Sunday, January 21st from 2:00 AM to 4:00 AM IST.',
        isRead: true,
        timestamp: '2024-01-17T09:00:00Z',
        category: 'system'
      },
      {
        id: '5',
        type: 'assignment',
        title: 'Grade Available',
        message: 'Your Financial Model assignment has been graded. You received 85/100 marks.',
        isRead: false,
        timestamp: '2024-01-16T11:20:00Z',
        category: 'assignment',
        actionUrl: '/grades',
        actionLabel: 'View Grade'
      },
      {
        id: '6',
        type: 'course',
        title: 'Live Session Reminder',
        message: 'Financial Modeling Workshop live session starts in 30 minutes. Join now!',
        isRead: true,
        timestamp: '2024-01-15T15:30:00Z',
        category: 'course',
        actionUrl: '/live-sessions',
        actionLabel: 'Join Session'
      },
      {
        id: '7',
        type: 'system',
        title: 'Profile Update Required',
        message: 'Please update your profile information to continue using all platform features.',
        isRead: false,
        timestamp: '2024-01-14T08:15:00Z',
        category: 'system',
        actionUrl: '/profile',
        actionLabel: 'Update Profile'
      },
      {
        id: '8',
        type: 'payment',
        title: 'Refund Processed',
        message: 'Your refund of ₹1,800 for Digital Marketing course has been processed and will reflect in your account within 5-7 business days.',
        isRead: true,
        timestamp: '2024-01-13T12:00:00Z',
        category: 'payment',
        actionUrl: '/payments/history',
        actionLabel: 'View Refund'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) || 
      (filter === 'read' && notification.isRead);
    
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'course':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
      case 'assignment':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
      case 'system':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
      case 'course':
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
      case 'assignment':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
      case 'system':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-6 mb-4 sm:mb-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
                <p className="text-sm text-gray-600">Read</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="course">Courses</option>
                <option value="assignment">Assignments</option>
                <option value="payment">Payments</option>
                <option value="system">System</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'You\'re all caught up! No new notifications.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.category)}`}>
                              {notification.category}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                          } mb-3`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatDate(notification.timestamp)}</span>
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {notification.actionLabel || 'View Details'}
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Mark as read"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete notification"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

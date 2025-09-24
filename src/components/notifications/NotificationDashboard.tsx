'use client';

import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  BellAlertIcon,
  CheckIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { 
  notificationService, 
  Notification, 
  NotificationTemplate, 
  NotificationPreference, 
  NotificationSchedule,
  NotificationStats,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  AssignmentReminder,
  ClassScheduleNotification,
  PaymentNotification
} from '@/lib/notificationService';

interface NotificationDashboardProps {
  userId: string;
  userRole: 'admin' | 'instructor' | 'student';
}

export function NotificationDashboard({
  userId,
  userRole
}: NotificationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'preferences' | 'schedules' | 'create'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    priority: '',
    isRead: '',
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, filters, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'notifications':
          const notificationData = await notificationService.getUserNotifications(userId, {
            type: filters.type as NotificationType,
            category: filters.category as NotificationCategory,
            status: filters.status as NotificationStatus,
            isRead: filters.isRead ? filters.isRead === 'true' : undefined
          });
          setNotifications(notificationData);
          break;
        case 'templates':
          const templateData = await notificationService.getNotificationTemplates();
          setTemplates(templateData);
          break;
        case 'preferences':
          const preferenceData = await notificationService.getNotificationPreferences(userId);
          setPreferences(preferenceData);
          break;
        case 'schedules':
          const scheduleData = await notificationService.getNotificationSchedules();
          setSchedules(scheduleData);
          break;
      }

      // Load stats for admin users
      if (userRole === 'admin') {
        const statsData = await notificationService.getNotificationStats();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to mark as read');
    }
  };

  const handleMarkAsArchived = async (id: string) => {
    try {
      await notificationService.markAsArchived(id);
      setNotifications(prev => prev.map(notification => 
        notification.id === id 
          ? { ...notification, isArchived: true, archivedAt: new Date().toISOString() }
          : notification
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to mark as archived');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true,
        readAt: new Date().toISOString()
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete notification');
    }
  };

  const handleCreateAssignmentReminder = async (reminder: AssignmentReminder) => {
    try {
      const newNotifications = await notificationService.createAssignmentDueReminder(reminder);
      setNotifications(prev => [...newNotifications, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment reminder');
    }
  };

  const handleCreateClassScheduleNotification = async (schedule: ClassScheduleNotification) => {
    try {
      const newNotifications = await notificationService.createClassScheduleNotification(schedule);
      setNotifications(prev => [...newNotifications, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create class schedule notification');
    }
  };

  const handleCreatePaymentNotification = async (payment: PaymentNotification) => {
    try {
      const newNotification = await notificationService.createPaymentUpdateNotification(payment);
      setNotifications(prev => [newNotification, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create payment notification');
    }
  };

  const handleSendNotification = async (notification: Notification) => {
    try {
      await notificationService.sendNotification(notification);
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'sent', sentAt: new Date().toISOString() }
          : n
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to send notification');
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    const priorityInfo = notificationService.formatPriority(priority);
    return priorityInfo.color;
  };

  const getStatusColor = (status: NotificationStatus) => {
    const statusInfo = notificationService.formatStatus(status);
    return statusInfo.color;
  };

  const getNotificationTypeIcon = (type: NotificationType) => {
    return notificationService.getNotificationTypeIcon(type);
  };

  const formatDate = (date: string) => {
    return notificationService.formatDate(date);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return notification.title.toLowerCase().includes(query) ||
             notification.message.toLowerCase().includes(query);
    }
    return true;
  });

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
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Manage assignment reminders, class schedules, and payment updates</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats (Admin only) */}
      {stats && userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BellAlertIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadNotifications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveryRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.readRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'notifications', label: 'Notifications', icon: BellIcon },
              { id: 'templates', label: 'Templates', icon: CogIcon },
              { id: 'preferences', label: 'Preferences', icon: CogIcon },
              { id: 'schedules', label: 'Schedules', icon: ClockIcon },
              { id: 'create', label: 'Create', icon: PlusIcon }
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
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="assignment_due">Assignment Due</option>
                  <option value="assignment_submitted">Assignment Submitted</option>
                  <option value="assignment_graded">Assignment Graded</option>
                  <option value="class_schedule">Class Schedule</option>
                  <option value="class_reminder">Class Reminder</option>
                  <option value="class_cancelled">Class Cancelled</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="payment_received">Payment Received</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="course_enrolled">Course Enrolled</option>
                  <option value="course_completed">Course Completed</option>
                  <option value="certificate_ready">Certificate Ready</option>
                  <option value="mentor_assigned">Mentor Assigned</option>
                  <option value="mentor_message">Mentor Message</option>
                  <option value="system_update">System Update</option>
                  <option value="general">General</option>
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="schedule">Schedule</option>
                  <option value="financial">Financial</option>
                  <option value="system">System</option>
                  <option value="social">Social</option>
                  <option value="reminder">Reminder</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={filters.isRead}
                  onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="false">Unread</option>
                  <option value="true">Read</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAscendingIcon className="h-4 w-4" /> : <SortDescendingIcon className="h-4 w-4" />}
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedNotifications.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          selectedNotifications.forEach(id => handleMarkAsRead(id));
                          setSelectedNotifications([]);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => {
                          selectedNotifications.forEach(id => handleMarkAsArchived(id));
                          setSelectedNotifications([]);
                        }}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => {
                          selectedNotifications.forEach(id => handleDeleteNotification(id));
                          setSelectedNotifications([]);
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`bg-white border rounded-lg p-6 ${
                    notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{getNotificationTypeIcon(notification.type)}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                            {!notification.isRead && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Unread
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-4">{notification.message}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Type: {notification.type.replace('_', ' ')}</span>
                            <span>Category: {notification.category}</span>
                            <span>Created: {formatDate(notification.createdAt)}</span>
                            {notification.scheduledFor && (
                              <span>Scheduled: {formatDate(notification.scheduledFor)}</span>
                            )}
                            {notification.sentAt && (
                              <span>Sent: {formatDate(notification.sentAt)}</span>
                            )}
                            {notification.readAt && (
                              <span>Read: {formatDate(notification.readAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotifications(prev => [...prev, notification.id]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {!notification.isArchived && (
                          <button
                            onClick={() => handleMarkAsArchived(notification.id)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Archive"
                          >
                            <ArchiveBoxIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {notification.status === 'pending' && (
                          <button
                            onClick={() => handleSendNotification(notification)}
                            className="text-green-600 hover:text-green-800"
                            title="Send now"
                          >
                            <PaperAirplaneIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-8">
                  <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or create a new notification</p>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getNotificationTypeIcon(template.type)}</span>
                        <span className="text-sm font-medium text-gray-900">{template.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm text-gray-900">{template.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm text-gray-900">{template.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-sm font-semibold ${
                          template.isActive ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Default:</span>
                        <span className={`text-sm font-semibold ${
                          template.isDefault ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {template.isDefault ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Title:</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.title}</p>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Message:</h4>
                      <p className="text-sm text-gray-600">{template.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Preference</span>
                </button>
              </div>

              <div className="space-y-4">
                {preferences.map((preference) => (
                  <div key={preference.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getNotificationTypeIcon(preference.type)}</span>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {preference.type.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">{preference.category}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className={`text-sm font-semibold ${
                          preference.emailEnabled ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {preference.emailEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Push:</span>
                        <span className={`text-sm font-semibold ${
                          preference.pushEnabled ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {preference.pushEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">SMS:</span>
                        <span className={`text-sm font-semibold ${
                          preference.smsEnabled ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {preference.smsEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ComputerDesktopIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">In-App:</span>
                        <span className={`text-sm font-semibold ${
                          preference.inAppEnabled ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {preference.inAppEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Frequency:</span>
                        <span className="text-sm font-semibold text-gray-900">{preference.frequency}</span>
                      </div>
                      {preference.quietHours.enabled && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Quiet Hours:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {preference.quietHours.startTime} - {preference.quietHours.endTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Schedules</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Schedule</span>
                </button>
              </div>

              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getNotificationTypeIcon(schedule.type)}</span>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{schedule.name}</h4>
                          <p className="text-sm text-gray-600">
                            {schedule.type.replace('_', ' ')} - {schedule.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Trigger:</span>
                        <span className="text-sm font-semibold text-gray-900">{schedule.triggerType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Template:</span>
                        <span className="text-sm font-semibold text-gray-900">{schedule.templateId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Last Triggered:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {schedule.lastTriggered ? formatDate(schedule.lastTriggered) : 'Never'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Next Trigger:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {schedule.nextTrigger ? formatDate(schedule.nextTrigger) : 'Not scheduled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Notification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assignment Reminder */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">Assignment Reminder</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create reminders for assignment due dates
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Assignment Reminder
                  </button>
                </div>

                {/* Class Schedule */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">Class Schedule</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create notifications for class schedules
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Create Class Schedule
                  </button>
                </div>

                {/* Payment Update */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-900">Payment Update</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create notifications for payment updates
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Create Payment Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

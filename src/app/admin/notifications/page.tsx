'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock data for notifications
  const notifications = [
    {
      id: 'NOTIF_001',
      title: 'New Student Registration',
      message: 'Alice Johnson has registered for the Complete Web Development Bootcamp',
      type: 'user_registration',
      status: 'sent',
      channel: 'email',
      recipient: 'admin@kalpla.com',
      recipientType: 'admin',
      priority: 'medium',
      category: 'User Management',
      tags: ['registration', 'student', 'web-development'],
      scheduledAt: '2024-01-20T10:30:00Z',
      sentAt: '2024-01-20T10:30:15Z',
      readAt: '2024-01-20T10:35:22Z',
      clickCount: 1,
      deliveryStatus: 'delivered',
      template: 'student_registration',
      metadata: {
        userId: 'USER_123',
        courseId: 'COURSE_001',
        studentName: 'Alice Johnson',
        courseName: 'Complete Web Development Bootcamp'
      }
    },
    {
      id: 'NOTIF_002',
      title: 'Payment Received',
      message: 'Payment of ₹12,000 received from Bob Williams for Data Science Course',
      type: 'payment',
      status: 'sent',
      channel: 'email',
      recipient: 'admin@kalpla.com',
      recipientType: 'admin',
      priority: 'high',
      category: 'Financial',
      tags: ['payment', 'revenue', 'data-science'],
      scheduledAt: '2024-01-20T14:15:00Z',
      sentAt: '2024-01-20T14:15:08Z',
      readAt: '2024-01-20T14:20:15Z',
      clickCount: 1,
      deliveryStatus: 'delivered',
      template: 'payment_received',
      metadata: {
        transactionId: 'TXN_456',
        amount: 12000,
        studentName: 'Bob Williams',
        courseName: 'Data Science Course',
        paymentMethod: 'Credit Card'
      }
    },
    {
      id: 'NOTIF_003',
      title: 'Course Completion Alert',
      message: 'Charlie Brown has completed the Digital Marketing Masterclass',
      type: 'course_completion',
      status: 'sent',
      channel: 'push',
      recipient: 'charlie.brown@email.com',
      recipientType: 'student',
      priority: 'medium',
      category: 'Learning Progress',
      tags: ['completion', 'achievement', 'digital-marketing'],
      scheduledAt: '2024-01-20T16:45:00Z',
      sentAt: '2024-01-20T16:45:12Z',
      readAt: '2024-01-20T16:50:30Z',
      clickCount: 1,
      deliveryStatus: 'delivered',
      template: 'course_completion',
      metadata: {
        userId: 'USER_789',
        courseId: 'COURSE_003',
        studentName: 'Charlie Brown',
        courseName: 'Digital Marketing Masterclass',
        completionDate: '2024-01-20T16:45:00Z'
      }
    },
    {
      id: 'NOTIF_004',
      title: 'Mentor Application Received',
      message: 'Dr. Sarah Wilson has applied to become a mentor for Business Strategy',
      type: 'mentor_application',
      status: 'pending',
      channel: 'email',
      recipient: 'admin@kalpla.com',
      recipientType: 'admin',
      priority: 'high',
      category: 'User Management',
      tags: ['mentor', 'application', 'business-strategy'],
      scheduledAt: '2024-01-21T09:00:00Z',
      sentAt: null,
      readAt: null,
      clickCount: 0,
      deliveryStatus: 'pending',
      template: 'mentor_application',
      metadata: {
        applicationId: 'APP_101',
        mentorName: 'Dr. Sarah Wilson',
        specialization: 'Business Strategy',
        experience: '15 years',
        applicationDate: '2024-01-21T08:45:00Z'
      }
    },
    {
      id: 'NOTIF_005',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur on Sunday, January 28th from 2:00 AM to 4:00 AM IST',
      type: 'system',
      status: 'sent',
      channel: 'email',
      recipient: 'all_users',
      recipientType: 'all',
      priority: 'medium',
      category: 'System',
      tags: ['maintenance', 'system', 'announcement'],
      scheduledAt: '2024-01-22T10:00:00Z',
      sentAt: '2024-01-22T10:00:05Z',
      readAt: null,
      clickCount: 0,
      deliveryStatus: 'delivered',
      template: 'system_maintenance',
      metadata: {
        maintenanceDate: '2024-01-28T02:00:00Z',
        duration: '2 hours',
        affectedServices: ['Video Streaming', 'Payment Processing']
      }
    },
    {
      id: 'NOTIF_006',
      title: 'Assignment Submission',
      message: 'Diana Prince has submitted assignment for Module 3: Advanced CSS',
      type: 'assignment',
      status: 'sent',
      channel: 'email',
      recipient: 'mentor@kalpla.com',
      recipientType: 'mentor',
      priority: 'medium',
      category: 'Learning Progress',
      tags: ['assignment', 'submission', 'css'],
      scheduledAt: '2024-01-20T18:30:00Z',
      sentAt: '2024-01-20T18:30:15Z',
      readAt: '2024-01-20T19:15:45Z',
      clickCount: 1,
      deliveryStatus: 'delivered',
      template: 'assignment_submission',
      metadata: {
        assignmentId: 'ASSIGN_202',
        studentName: 'Diana Prince',
        courseName: 'Complete Web Development Bootcamp',
        moduleName: 'Module 3: Advanced CSS',
        submissionDate: '2024-01-20T18:30:00Z'
      }
    },
    {
      id: 'NOTIF_007',
      title: 'Failed Payment Alert',
      message: 'Payment failed for Eve Adams - Digital Marketing Course (₹9,000)',
      type: 'payment_failure',
      status: 'sent',
      channel: 'email',
      recipient: 'admin@kalpla.com',
      recipientType: 'admin',
      priority: 'high',
      category: 'Financial',
      tags: ['payment', 'failure', 'digital-marketing'],
      scheduledAt: '2024-01-21T11:20:00Z',
      sentAt: '2024-01-21T11:20:08Z',
      readAt: '2024-01-21T11:25:12Z',
      clickCount: 1,
      deliveryStatus: 'delivered',
      template: 'payment_failure',
      metadata: {
        transactionId: 'TXN_789',
        amount: 9000,
        studentName: 'Eve Adams',
        courseName: 'Digital Marketing Course',
        failureReason: 'Insufficient Funds',
        retryCount: 2
      }
    },
    {
      id: 'NOTIF_008',
      title: 'Course Enrollment Reminder',
      message: 'Reminder: Your enrollment in Financial Modeling Course starts tomorrow',
      type: 'enrollment_reminder',
      status: 'sent',
      channel: 'sms',
      recipient: '+91-9876543210',
      recipientType: 'student',
      priority: 'low',
      category: 'Learning Progress',
      tags: ['reminder', 'enrollment', 'financial-modeling'],
      scheduledAt: '2024-01-21T20:00:00Z',
      sentAt: '2024-01-21T20:00:12Z',
      readAt: '2024-01-21T20:05:30Z',
      clickCount: 0,
      deliveryStatus: 'delivered',
      template: 'enrollment_reminder',
      metadata: {
        userId: 'USER_456',
        courseId: 'COURSE_004',
        studentName: 'Frank White',
        courseName: 'Financial Modeling Course',
        startDate: '2024-01-22T09:00:00Z'
      }
    }
  ];

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'user_registration', label: 'User Registration' },
    { value: 'payment', label: 'Payment' },
    { value: 'course_completion', label: 'Course Completion' },
    { value: 'mentor_application', label: 'Mentor Application' },
    { value: 'system', label: 'System' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'payment_failure', label: 'Payment Failure' },
    { value: 'enrollment_reminder', label: 'Enrollment Reminder' }
  ];

  const channels = [
    { value: 'all', label: 'All Channels' },
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push Notification' },
    { value: 'sms', label: 'SMS' },
    { value: 'in_app', label: 'In-App' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    const matchesChannel = filterChannel === 'all' || notification.channel === filterChannel;
    return matchesSearch && matchesType && matchesStatus && matchesChannel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <UserIcon className="h-5 w-5 text-blue-500" />;
      case 'payment': return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />;
      case 'course_completion': return <AcademicCapIcon className="h-5 w-5 text-purple-500" />;
      case 'mentor_application': return <ShieldCheckIcon className="h-5 w-5 text-orange-500" />;
      case 'system': return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'assignment': return <DocumentTextIcon className="h-5 w-5 text-indigo-500" />;
      case 'payment_failure': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'enrollment_reminder': return <CalendarIcon className="h-5 w-5 text-teal-500" />;
      default: return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <EnvelopeIcon className="h-4 w-4" />;
      case 'push': return <BellIcon className="h-4 w-4" />;
      case 'sms': return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'in_app': return <GlobeAltIcon className="h-4 w-4" />;
      default: return <BellIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage all platform notifications across different channels</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sent Successfully</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.status === 'sent').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Email Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.channel === 'email').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="draft">Draft</option>
                </select>

                {/* Channel Filter */}
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {channels.map(channel => (
                    <option key={channel.value} value={channel.value}>{channel.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Notification
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Templates
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{notification.message}</p>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        {getChannelIcon(notification.channel)}
                        <span className="ml-2 capitalize">{notification.channel}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span className="capitalize">{notification.recipientType}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(notification.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BellIcon className="h-4 w-4 mr-2" />
                        <span>{notification.category}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {notification.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Status */}
                    {notification.status === 'sent' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Delivery:</span>
                          <span className={`ml-2 font-medium ${
                            notification.deliveryStatus === 'delivered' ? 'text-green-600' : 
                            notification.deliveryStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {notification.deliveryStatus}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Clicks:</span>
                          <span className="ml-2 font-medium">{notification.clickCount}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Template:</span>
                          <span className="ml-2 font-medium">{notification.template}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Recipient:</span>
                          <span className="ml-2 font-medium">{notification.recipient}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      {notification.status === 'pending' && (
                        <button className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Send Now
                        </button>
                      )}
                      <button className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterChannel !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No notifications have been created yet.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create First Notification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

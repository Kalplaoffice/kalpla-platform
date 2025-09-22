'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function ApprovalsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Mock data for approvals and moderation
  const approvals = [
    {
      id: 'APPROVAL_001',
      type: 'mentor_application',
      title: 'Mentor Application - Dr. Sarah Johnson',
      status: 'pending',
      submittedBy: 'Dr. Sarah Johnson',
      submittedByEmail: 'sarah@example.com',
      submittedDate: '2024-01-20',
      lastReviewed: null,
      reviewer: null,
      description: 'Application for mentor position in Web Development track',
      details: {
        specialization: 'Web Development',
        experience: '15+ years',
        company: 'TechInnovate Inc.',
        achievements: ['Ex-Google', 'Y Combinator Alum', 'Forbes 30 Under 30'],
        portfolio: 'github.com/sarahjohnson',
        linkedin: 'linkedin.com/in/sarahjohnson'
      },
      priority: 'high',
      estimatedReviewTime: '2 days',
      notes: 'Strong technical background, excellent communication skills'
    },
    {
      id: 'APPROVAL_002',
      type: 'course_content',
      title: 'Course Content Review - Data Science with Python',
      status: 'under_review',
      submittedBy: 'Prof. Michael Chen',
      submittedByEmail: 'michael@example.com',
      submittedDate: '2024-01-18',
      lastReviewed: '2024-01-19',
      reviewer: 'Admin User',
      description: 'Review of new course content for Data Science specialization',
      details: {
        courseTitle: 'Data Science with Python',
        lessons: 64,
        duration: '16 weeks',
        difficulty: 'Intermediate',
        prerequisites: ['Basic Python', 'Statistics'],
        learningObjectives: ['Data Analysis', 'Machine Learning', 'Visualization']
      },
      priority: 'medium',
      estimatedReviewTime: '5 days',
      notes: 'Content looks comprehensive, needs minor adjustments to assessment criteria'
    },
    {
      id: 'APPROVAL_003',
      type: 'student_project',
      title: 'Student Project Submission - E-commerce Website',
      status: 'approved',
      submittedBy: 'Rahul Sharma',
      submittedByEmail: 'rahul@example.com',
      submittedDate: '2024-01-15',
      lastReviewed: '2024-01-16',
      reviewer: 'Dr. Sarah Johnson',
      description: 'Final project submission for Web Development Bootcamp',
      details: {
        projectTitle: 'E-commerce Website',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        githubRepo: 'github.com/rahul/ecommerce',
        liveDemo: 'ecommerce-demo.vercel.app',
        features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration']
      },
      priority: 'low',
      estimatedReviewTime: '1 day',
      notes: 'Excellent implementation, meets all requirements'
    },
    {
      id: 'APPROVAL_004',
      type: 'content_moderation',
      title: 'Content Moderation - Inappropriate Comment',
      status: 'rejected',
      submittedBy: 'System',
      submittedByEmail: 'system@kalpla.com',
      submittedDate: '2024-01-22',
      lastReviewed: '2024-01-22',
      reviewer: 'Admin User',
      description: 'Reported inappropriate comment in course discussion forum',
      details: {
        reportedBy: 'Student User',
        contentType: 'Forum Comment',
        courseId: '1',
        lessonId: '15',
        reason: 'Inappropriate Language',
        content: 'This is spam content that violates community guidelines'
      },
      priority: 'high',
      estimatedReviewTime: '1 hour',
      notes: 'Content removed, user warned about community guidelines'
    },
    {
      id: 'APPROVAL_005',
      type: 'ksmp_application',
      title: 'KSMP Application - Priya Patel',
      status: 'pending',
      submittedBy: 'Priya Patel',
      submittedByEmail: 'priya@example.com',
      submittedDate: '2024-01-21',
      lastReviewed: null,
      reviewer: null,
      description: 'Application for Kalpla Student Mentorship Program',
      details: {
        currentRole: 'Business Analyst',
        experience: '4 years',
        education: 'MBA Marketing - IIM Ahmedabad',
        motivation: 'Looking to enhance strategic thinking and leadership skills',
        goals: 'Lead strategic initiatives at a Fortune 500 company',
        cohort: 'Cohort 2024-01'
      },
      priority: 'medium',
      estimatedReviewTime: '3 days',
      notes: 'Strong academic background, good potential for mentorship'
    },
    {
      id: 'APPROVAL_006',
      type: 'course_content',
      title: 'Course Content Update - Mobile App Development',
      status: 'under_review',
      submittedBy: 'Dr. Sarah Johnson',
      submittedByEmail: 'sarah@example.com',
      submittedDate: '2024-01-19',
      lastReviewed: '2024-01-20',
      reviewer: 'Admin User',
      description: 'Update to React Native course content with new features',
      details: {
        courseTitle: 'Mobile App Development',
        updateType: 'Content Update',
        changes: ['Added React Native 0.72 features', 'Updated navigation library', 'New testing modules'],
        affectedLessons: [8, 12, 15, 20],
        impact: 'Minor - Backward compatible'
      },
      priority: 'low',
      estimatedReviewTime: '2 days',
      notes: 'Updates look good, no breaking changes detected'
    }
  ];

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || approval.type === filterType;
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mentor_application': return 'text-blue-600 bg-blue-100';
      case 'course_content': return 'text-green-600 bg-green-100';
      case 'student_project': return 'text-purple-600 bg-purple-100';
      case 'content_moderation': return 'text-red-600 bg-red-100';
      case 'ksmp_application': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'under_review': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
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
      day: 'numeric'
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading approvals...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Approvals & Moderation</h1>
                <p className="text-gray-600 mt-1">Review and moderate content, applications, and submissions</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.status === 'under_review').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.status === 'approved').length}</p>
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
                    placeholder="Search approvals..."
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
                  <option value="all">All Types</option>
                  <option value="mentor_application">Mentor Applications</option>
                  <option value="course_content">Course Content</option>
                  <option value="student_project">Student Projects</option>
                  <option value="content_moderation">Content Moderation</option>
                  <option value="ksmp_application">KSMP Applications</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FlagIcon className="h-5 w-5 mr-2" />
                  Bulk Actions
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Review Queue
                </button>
              </div>
            </div>
          </div>

          {/* Approvals List */}
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <div key={approval.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(approval.type)}`}>
                        {approval.type.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                        {getStatusIcon(approval.status)}
                        <span className="ml-1 capitalize">{approval.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                        {approval.priority} priority
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{approval.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">Submitted By</p>
                          <p>{approval.submittedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">Submitted</p>
                          <p>{formatDate(approval.submittedDate)}</p>
                        </div>
                      </div>
                      {approval.reviewer && (
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          <div>
                            <p className="font-medium">Reviewer</p>
                            <p>{approval.reviewer}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">Est. Review Time</p>
                          <p>{approval.estimatedReviewTime}</p>
                        </div>
                      </div>
                    </div>

                    {approval.notes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{approval.notes}</p>
                      </div>
                    )}

                    {/* Key Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.entries(approval.details).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-gray-600 ml-1">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Review
                    </button>
                    {approval.status === 'pending' && (
                      <>
                        <button className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApprovals.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No items require approval at this time.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
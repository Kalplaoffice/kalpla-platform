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
  EyeIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  StarIcon,
  GlobeAltIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function ApprovalsModerationPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

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
      title: 'Mentor Application - Dr. Sarah Wilson',
      description: 'Application to become a mentor for Business Strategy specialization',
      status: 'pending',
      priority: 'high',
      submittedBy: 'Dr. Sarah Wilson',
      submittedAt: '2024-01-21T08:45:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'User Management',
      tags: ['mentor', 'business-strategy', 'application'],
      metadata: {
        applicantName: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@email.com',
        specialization: 'Business Strategy',
        experience: '15 years',
        company: 'Strategic Consulting Inc.',
        education: 'PhD in Business Administration',
        certifications: ['PMP', 'Six Sigma Black Belt'],
        portfolio: 'https://sarahwilson.com/portfolio',
        linkedin: 'https://linkedin.com/in/sarahwilson',
        motivation: 'Passionate about helping entrepreneurs build successful businesses through strategic thinking and execution.',
        expectedStudents: 50,
        availability: 'Weekends and evenings',
        languages: ['English', 'Spanish'],
        timezone: 'IST'
      },
      attachments: [
        { name: 'resume.pdf', type: 'document', size: '2.1 MB' },
        { name: 'portfolio.pdf', type: 'document', size: '5.3 MB' },
        { name: 'certificates.pdf', type: 'document', size: '1.8 MB' }
      ],
      comments: [],
      flags: []
    },
    {
      id: 'APPROVAL_002',
      type: 'course_submission',
      title: 'Course Submission - Advanced Python Programming',
      description: 'New course submission for Advanced Python Programming with Data Science focus',
      status: 'pending',
      priority: 'medium',
      submittedBy: 'Prof. Michael Chen',
      submittedAt: '2024-01-20T14:30:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'Content Management',
      tags: ['python', 'data-science', 'programming', 'course'],
      metadata: {
        courseTitle: 'Advanced Python Programming',
        instructor: 'Prof. Michael Chen',
        duration: '8 weeks',
        modules: 12,
        lessons: 48,
        difficulty: 'Advanced',
        prerequisites: ['Basic Python', 'Statistics'],
        learningOutcomes: [
          'Master advanced Python concepts',
          'Build data science applications',
          'Implement machine learning algorithms'
        ],
        targetAudience: 'Intermediate to Advanced Python developers',
        estimatedHours: 80,
        price: 15000,
        language: 'English',
        subtitles: ['Hindi', 'Tamil'],
        certificate: true,
        handsOnProjects: 6,
        quizzes: 12,
        assignments: 8
      },
      attachments: [
        { name: 'course_outline.pdf', type: 'document', size: '3.2 MB' },
        { name: 'sample_lesson.mp4', type: 'video', size: '125 MB' },
        { name: 'assessment_samples.pdf', type: 'document', size: '2.5 MB' }
      ],
      comments: [],
      flags: []
    },
    {
      id: 'APPROVAL_003',
      type: 'content_moderation',
      title: 'Content Flag - Inappropriate Comment',
      description: 'Student reported inappropriate comment in course discussion forum',
      status: 'pending',
      priority: 'high',
      submittedBy: 'System Auto-Flag',
      submittedAt: '2024-01-21T16:20:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'Content Moderation',
      tags: ['inappropriate', 'comment', 'forum', 'student-report'],
      metadata: {
        reportedBy: 'Alice Johnson',
        reportedAt: '2024-01-21T16:15:00Z',
        contentType: 'forum_comment',
        contentId: 'COMMENT_789',
        courseId: 'COURSE_001',
        lessonId: 'LESSON_015',
        flaggedContent: 'This is spam and not related to the course content at all. Please remove this.',
        context: 'Discussion about HTML basics in Complete Web Development Bootcamp',
        severity: 'medium',
        violationType: 'spam',
        previousViolations: 0,
        userReputation: 'good'
      },
      attachments: [
        { name: 'screenshot.png', type: 'image', size: '1.2 MB' },
        { name: 'context_conversation.pdf', type: 'document', size: '0.8 MB' }
      ],
      comments: [],
      flags: [
        { type: 'inappropriate', severity: 'medium', automated: true }
      ]
    },
    {
      id: 'APPROVAL_004',
      type: 'ksmp_application',
      title: 'KSMP Application - Cohort 2024-02',
      description: 'Application for Kalpla Startup Mentorship Program - Cohort starting February 2024',
      status: 'pending',
      priority: 'high',
      submittedBy: 'Rajesh Kumar',
      submittedAt: '2024-01-19T11:15:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'Program Management',
      tags: ['ksmp', 'startup', 'mentorship', 'cohort-2024'],
      metadata: {
        applicantName: 'Rajesh Kumar',
        email: 'rajesh.kumar@startup.com',
        startupName: 'TechInnovate Solutions',
        industry: 'FinTech',
        stage: 'Early Stage',
        teamSize: 5,
        fundingRaised: 500000,
        revenue: 0,
        businessModel: 'B2B SaaS',
        targetMarket: 'Small and Medium Enterprises',
        competitiveAdvantage: 'AI-powered financial analytics',
        mentorshipGoals: [
          'Product-market fit validation',
          'Scaling strategy development',
          'Investor pitch preparation'
        ],
        expectedOutcomes: 'Secure Series A funding within 6 months',
        timeCommitment: '10 hours per week',
        preferredMentors: ['Dr. Sarah Johnson', 'Mr. David Lee'],
        previousExperience: '2 years in fintech',
        references: [
          { name: 'John Smith', company: 'ABC Ventures', email: 'john@abc.com' },
          { name: 'Jane Doe', company: 'XYZ Capital', email: 'jane@xyz.com' }
        ]
      },
      attachments: [
        { name: 'business_plan.pdf', type: 'document', size: '4.5 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '8.2 MB' },
        { name: 'financial_projections.xlsx', type: 'document', size: '1.1 MB' },
        { name: 'product_demo.mp4', type: 'video', size: '45 MB' }
      ],
      comments: [],
      flags: []
    },
    {
      id: 'APPROVAL_005',
      type: 'payment_dispute',
      title: 'Payment Dispute - Course Refund Request',
      description: 'Student requesting refund for Digital Marketing Course due to technical issues',
      status: 'pending',
      priority: 'medium',
      submittedBy: 'Eve Adams',
      submittedAt: '2024-01-20T09:30:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'Financial',
      tags: ['refund', 'payment-dispute', 'technical-issues'],
      metadata: {
        studentName: 'Eve Adams',
        email: 'eve.adams@email.com',
        courseId: 'COURSE_003',
        courseName: 'Digital Marketing Masterclass',
        transactionId: 'TXN_456',
        amount: 9000,
        paymentDate: '2024-01-15T10:00:00Z',
        refundReason: 'Technical issues with video streaming',
        refundAmount: 9000,
        refundType: 'full',
        supportingEvidence: 'Multiple screenshots of streaming errors',
        resolutionAttempts: [
          'Cleared browser cache',
          'Tried different browsers',
          'Contacted support team'
        ],
        studentSatisfaction: 'dissatisfied',
        courseProgress: '15%',
        timeSpent: '2 hours'
      },
      attachments: [
        { name: 'error_screenshots.pdf', type: 'document', size: '2.8 MB' },
        { name: 'support_tickets.pdf', type: 'document', size: '1.5 MB' },
        { name: 'browser_logs.txt', type: 'document', size: '0.3 MB' }
      ],
      comments: [],
      flags: []
    },
    {
      id: 'APPROVAL_006',
      type: 'content_moderation',
      title: 'Content Flag - Copyright Violation',
      description: 'Potential copyright violation detected in uploaded course material',
      status: 'pending',
      priority: 'high',
      submittedBy: 'Automated System',
      submittedAt: '2024-01-21T12:45:00Z',
      reviewedBy: null,
      reviewedAt: null,
      category: 'Content Moderation',
      tags: ['copyright', 'violation', 'automated-detection'],
      metadata: {
        detectedBy: 'Automated Copyright Scanner',
        detectedAt: '2024-01-21T12:40:00Z',
        contentType: 'course_video',
        contentId: 'VIDEO_123',
        courseId: 'COURSE_002',
        instructor: 'Prof. Michael Chen',
        violationType: 'copyright_infringement',
        confidence: 85,
        matchedContent: 'Stock footage from Shutterstock',
        originalSource: 'Shutterstock Video ID: 123456789',
        usageRights: 'Commercial license required',
        suggestedAction: 'Remove or replace content',
        severity: 'high',
        legalRisk: 'medium'
      },
      attachments: [
        { name: 'violation_report.pdf', type: 'document', size: '1.8 MB' },
        { name: 'matched_content_sample.mp4', type: 'video', size: '15 MB' },
        { name: 'original_source_info.pdf', type: 'document', size: '0.9 MB' }
      ],
      comments: [],
      flags: [
        { type: 'copyright', severity: 'high', automated: true }
      ]
    }
  ];

  const approvalTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'mentor_application', label: 'Mentor Applications' },
    { value: 'course_submission', label: 'Course Submissions' },
    { value: 'content_moderation', label: 'Content Moderation' },
    { value: 'ksmp_application', label: 'KSMP Applications' },
    { value: 'payment_dispute', label: 'Payment Disputes' }
  ];

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || approval.type === filterType;
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mentor_application': return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case 'course_submission': return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      case 'content_moderation': return <FlagIcon className="h-5 w-5 text-red-500" />;
      case 'ksmp_application': return <AcademicCapIcon className="h-5 w-5 text-purple-500" />;
      case 'payment_dispute': return <CurrencyDollarIcon className="h-5 w-5 text-orange-500" />;
      default: return <ShieldCheckIcon className="h-5 w-5 text-gray-500" />;
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

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return <DocumentTextIcon className="h-4 w-4" />;
      case 'image': return <PhotoIcon className="h-4 w-4" />;
      case 'video': return <VideoCameraIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
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
                <p className="text-gray-600 mt-1">Review and moderate content, applications, and platform activities</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved Today</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FlagIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Content Flags</p>
                    <p className="text-2xl font-bold text-gray-900">{approvals.filter(a => a.type === 'content_moderation').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Review Time</p>
                    <p className="text-2xl font-bold text-gray-900">2.5h</p>
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
                  {approvalTypes.map(type => (
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
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Bulk Actions
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Quick Approve
                </button>
              </div>
            </div>
          </div>

          {/* Approvals List */}
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <div key={approval.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getTypeIcon(approval.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                          {approval.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                          {approval.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{approval.description}</p>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>{approval.submittedBy}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(approval.submittedAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        <span>{approval.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{approval.reviewedBy ? `Reviewed by ${approval.reviewedBy}` : 'Not reviewed'}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {approval.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Flags */}
                    {approval.flags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <FlagIcon className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">Flags:</span>
                          {approval.flags.map((flag, index) => (
                            <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              flag.severity === 'high' ? 'bg-red-100 text-red-800' :
                              flag.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {flag.type} ({flag.severity})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {approval.attachments.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Attachments:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {approval.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                              {getAttachmentIcon(attachment.type)}
                              <span className="text-sm text-gray-700">{attachment.name}</span>
                              <span className="text-xs text-gray-500">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Metadata Preview */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Information:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        {Object.entries(approval.metadata).slice(0, 6).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="ml-1">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Review Details
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
                      <button className="flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        Add Comment
                      </button>
                    </div>
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
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No pending approvals at the moment.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

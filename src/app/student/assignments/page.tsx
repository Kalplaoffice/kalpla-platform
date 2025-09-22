'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  DocumentIcon,
  VideoCameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function StudentAssignmentsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    if (user?.role && !['student', 'learner'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'React Portfolio Website',
      course: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      dueDate: '2024-01-20',
      dueTime: '23:59',
      status: 'pending',
      priority: 'high',
      description: 'Create a responsive portfolio website using React, showcasing your projects and skills. Include components for About, Projects, Skills, and Contact sections.',
      requirements: [
        'Use React functional components with hooks',
        'Implement responsive design with CSS Grid/Flexbox',
        'Include at least 3 project showcases',
        'Add smooth animations and transitions',
        'Deploy to Netlify or Vercel'
      ],
      submissionType: 'file',
      maxFileSize: '50MB',
      allowedFormats: ['zip', 'pdf', 'docx'],
      points: 100,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: []
    },
    {
      id: 2,
      title: 'Data Analysis Report',
      course: 'Data Science Bootcamp',
      instructor: 'Dr. Michael Chen',
      dueDate: '2024-01-18',
      dueTime: '17:00',
      status: 'submitted',
      priority: 'medium',
      description: 'Analyze the provided dataset and create a comprehensive report with visualizations and insights.',
      requirements: [
        'Clean and preprocess the data',
        'Perform exploratory data analysis',
        'Create at least 5 meaningful visualizations',
        'Write a detailed analysis report',
        'Include recommendations based on findings'
      ],
      submissionType: 'file',
      maxFileSize: '25MB',
      allowedFormats: ['pdf', 'docx', 'ipynb'],
      points: 150,
      submittedAt: '2024-01-17T16:30:00Z',
      grade: 92,
      feedback: 'Excellent analysis! Your visualizations are clear and insightful. Consider adding more statistical tests to strengthen your conclusions.',
      attachments: ['data_analysis_report.pdf']
    },
    {
      id: 3,
      title: 'UI/UX Design Critique',
      course: 'Digital Marketing Mastery',
      instructor: 'Emily Rodriguez',
      dueDate: '2024-01-15',
      dueTime: '12:00',
      status: 'overdue',
      priority: 'high',
      description: 'Review and critique a mobile app interface, providing detailed feedback on usability and design principles.',
      requirements: [
        'Choose a mobile app to analyze',
        'Document usability issues with screenshots',
        'Apply UX design principles in your critique',
        'Provide specific recommendations for improvement',
        'Create a presentation of your findings'
      ],
      submissionType: 'file',
      maxFileSize: '30MB',
      allowedFormats: ['pdf', 'pptx', 'zip'],
      points: 80,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: []
    },
    {
      id: 4,
      title: 'JavaScript Algorithms',
      course: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      dueDate: '2024-01-25',
      dueTime: '23:59',
      status: 'pending',
      priority: 'medium',
      description: 'Solve 5 algorithmic problems using JavaScript. Focus on efficiency and clean code practices.',
      requirements: [
        'Solve all 5 problems correctly',
        'Include time and space complexity analysis',
        'Write clean, readable code with comments',
        'Test your solutions with provided test cases',
        'Submit as a single JavaScript file'
      ],
      submissionType: 'file',
      maxFileSize: '10MB',
      allowedFormats: ['js', 'txt'],
      points: 120,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: []
    },
    {
      id: 5,
      title: 'Marketing Campaign Proposal',
      course: 'Digital Marketing Mastery',
      instructor: 'Emily Rodriguez',
      dueDate: '2024-01-12',
      dueTime: '17:00',
      status: 'graded',
      priority: 'low',
      description: 'Create a comprehensive marketing campaign proposal for a new product launch.',
      requirements: [
        'Define target audience and personas',
        'Develop campaign messaging and positioning',
        'Create a multi-channel marketing strategy',
        'Include budget allocation and timeline',
        'Define success metrics and KPIs'
      ],
      submissionType: 'file',
      maxFileSize: '20MB',
      allowedFormats: ['pdf', 'docx', 'pptx'],
      points: 100,
      submittedAt: '2024-01-11T16:45:00Z',
      grade: 88,
      feedback: 'Great strategic thinking! Your target audience analysis is thorough. Consider adding more specific budget breakdowns and competitor analysis.',
      attachments: ['marketing_proposal.pdf']
    }
  ];

  const courses = ['Web Development Fundamentals', 'Data Science Bootcamp', 'Digital Marketing Mastery'];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || assignment.course === filterCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'graded':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = (dueDate: string, dueTime: string) => {
    const due = new Date(`${dueDate}T${dueTime}:00`);
    return new Date() > due;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-2 text-gray-600">
                Track your assignments, submit work, and view feedback from instructors
              </p>
            </div>
            <Link
              href="/student/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assignments, courses, or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {assignments.filter(a => a.status === 'overdue').length}
                  </p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {assignments.filter(a => a.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {assignments.filter(a => a.status === 'graded').length}
                  </p>
                  <p className="text-sm text-gray-600">Graded</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    <span>{assignment.course}</span>
                    <span className="mx-2">•</span>
                    <span>{assignment.instructor}</span>
                    <span className="mx-2">•</span>
                    <span>{assignment.points} points</span>
                  </div>
                  <p className="text-gray-700 mb-3">{assignment.description}</p>
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Due:</span>
                  <span className={`ml-1 font-medium ${
                    isOverdue(assignment.dueDate, assignment.dueTime) && assignment.status !== 'graded'
                      ? 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    {assignment.dueDate} at {assignment.dueTime}
                  </span>
                  {isOverdue(assignment.dueDate, assignment.dueTime) && assignment.status !== 'graded' && (
                    <ExclamationTriangleIcon className="h-4 w-4 ml-2 text-red-500" />
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {assignment.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                  {assignment.requirements.length > 3 && (
                    <li className="text-blue-600 text-sm">
                      +{assignment.requirements.length - 3} more requirements
                    </li>
                  )}
                </ul>
              </div>

              {/* Submission Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      <strong>Submission:</strong> {assignment.submissionType}
                    </span>
                    <span className="text-gray-600">
                      <strong>Max Size:</strong> {assignment.maxFileSize}
                    </span>
                    <span className="text-gray-600">
                      <strong>Formats:</strong> {assignment.allowedFormats.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grade and Feedback */}
              {assignment.grade && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-900">Grade & Feedback</h4>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-lg font-bold text-green-900">{assignment.grade}/100</span>
                    </div>
                  </div>
                  <p className="text-sm text-green-800">{assignment.feedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {assignment.status === 'pending' && (
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </button>
                )}
                {assignment.status === 'submitted' && (
                  <span className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Submitted on {new Date(assignment.submittedAt!).toLocaleDateString()}
                  </span>
                )}
                <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Details
                </button>
                {assignment.attachments.length > 0 && (
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <DocumentIcon className="h-4 w-4 mr-2" />
                    Download ({assignment.attachments.length})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria.' : 'You don\'t have any assignments yet.'}
            </p>
            <Link
              href="/student/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
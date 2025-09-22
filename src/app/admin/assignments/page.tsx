'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  StarIcon,
  DocumentArrowUpIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
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

  // Mock data for assignments
  const assignments = [
    {
      id: 'ASSIGN_001',
      title: 'Web Development Portfolio Project',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      status: 'active',
      type: 'project',
      difficulty: 'intermediate',
      dueDate: '2024-02-15T23:59:59Z',
      maxPoints: 100,
      totalSubmissions: 45,
      gradedSubmissions: 38,
      averageScore: 87.5,
      description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Include at least 3 projects with proper documentation.',
      requirements: [
        'Responsive design for mobile and desktop',
        'At least 3 project showcases',
        'Contact form with validation',
        'Clean and professional design',
        'Git repository with proper commits'
      ],
      resources: [
        'Design inspiration: dribbble.com',
        'CSS Framework: Bootstrap or Tailwind',
        'JavaScript validation library',
        'Git tutorial: github.com/git-guide'
      ],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'ASSIGN_002',
      title: 'Data Analysis Report',
      courseId: '2',
      courseTitle: 'Data Science with Python',
      instructor: 'Prof. Michael Chen',
      status: 'active',
      type: 'report',
      difficulty: 'advanced',
      dueDate: '2024-02-20T23:59:59Z',
      maxPoints: 150,
      totalSubmissions: 32,
      gradedSubmissions: 25,
      averageScore: 92.3,
      description: 'Analyze a dataset of your choice and create a comprehensive report with visualizations and insights.',
      requirements: [
        'Choose a dataset with at least 1000 records',
        'Perform exploratory data analysis',
        'Create at least 5 meaningful visualizations',
        'Provide actionable insights and recommendations',
        'Use Python libraries: pandas, matplotlib, seaborn'
      ],
      resources: [
        'Dataset sources: Kaggle, UCI ML Repository',
        'Visualization best practices guide',
        'Statistical analysis methods',
        'Report writing guidelines'
      ],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22'
    },
    {
      id: 'ASSIGN_003',
      title: 'UI/UX Design Case Study',
      courseId: '3',
      courseTitle: 'UI/UX Design Fundamentals',
      instructor: 'Dr. Emily Rodriguez',
      status: 'draft',
      type: 'case_study',
      difficulty: 'beginner',
      dueDate: '2024-03-01T23:59:59Z',
      maxPoints: 80,
      totalSubmissions: 0,
      gradedSubmissions: 0,
      averageScore: 0,
      description: 'Design a mobile app interface for a specific user problem. Include user research, wireframes, and prototypes.',
      requirements: [
        'Conduct user research and create personas',
        'Create low-fidelity wireframes',
        'Design high-fidelity mockups',
        'Create interactive prototype',
        'Document design decisions and rationale'
      ],
      resources: [
        'Design tools: Figma, Sketch, Adobe XD',
        'User research methods guide',
        'Design system examples',
        'Prototyping best practices'
      ],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22'
    },
    {
      id: 'ASSIGN_004',
      title: 'Digital Marketing Campaign',
      courseId: '4',
      courseTitle: 'Digital Marketing Mastery',
      instructor: 'Mr. David Kumar',
      status: 'completed',
      type: 'campaign',
      difficulty: 'intermediate',
      dueDate: '2024-01-10T23:59:59Z',
      maxPoints: 120,
      totalSubmissions: 28,
      gradedSubmissions: 28,
      averageScore: 89.7,
      description: 'Create a comprehensive digital marketing campaign for a product or service of your choice.',
      requirements: [
        'Define target audience and buyer personas',
        'Create content calendar for 4 weeks',
        'Design social media posts and ads',
        'Set up analytics and tracking',
        'Provide campaign performance metrics'
      ],
      resources: [
        'Social media platforms guidelines',
        'Content creation tools',
        'Analytics platforms: Google Analytics',
        'Campaign planning templates'
      ],
      createdAt: '2023-12-15',
      updatedAt: '2024-01-10'
    }
  ];

  const courses = [
    { id: '1', title: 'Complete Web Development Bootcamp' },
    { id: '2', title: 'Data Science with Python' },
    { id: '3', title: 'UI/UX Design Fundamentals' },
    { id: '4', title: 'Digital Marketing Mastery' }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || assignment.courseId === filterCourse;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'draft': return <ClockIcon className="h-4 w-4" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-purple-600 bg-purple-100';
      case 'report': return 'text-blue-600 bg-blue-100';
      case 'case_study': return 'text-green-600 bg-green-100';
      case 'campaign': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
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
          <p className="text-gray-600">Loading assignments...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Assignments & Grading</h1>
                <p className="text-gray-600 mt-1">Manage course assignments, submissions, and grading processes</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.filter(a => a.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DocumentArrowUpIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.reduce((acc, a) => acc + a.totalSubmissions, 0)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Graded Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.reduce((acc, a) => acc + a.gradedSubmissions, 0)}</p>
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
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Course Filter */}
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Assignment
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Grades
                </button>
              </div>
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.courseTitle}</p>
                      <p className="text-sm text-gray-500">by {assignment.instructor}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1 capitalize">{assignment.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                        {assignment.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{assignment.maxPoints}</p>
                      <p className="text-xs text-blue-600">Max Points</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{assignment.totalSubmissions}</p>
                      <p className="text-xs text-green-600">Submissions</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{assignment.averageScore}</p>
                      <p className="text-xs text-purple-600">Avg Score</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p>{formatDate(assignment.dueDate)}</p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Difficulty</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                        {assignment.difficulty}
                      </span>
                    </div>

                    {/* Requirements Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Requirements</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {assignment.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="line-clamp-1">{req}</span>
                          </li>
                        ))}
                        {assignment.requirements.length > 3 && (
                          <li className="text-gray-500 text-xs">
                            +{assignment.requirements.length - 3} more requirements
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Grading Progress */}
                    {assignment.totalSubmissions > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Grading Progress</span>
                          <span>{assignment.gradedSubmissions}/{assignment.totalSubmissions}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(assignment.gradedSubmissions / assignment.totalSubmissions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                      <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterCourse !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No assignments have been created yet.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create First Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

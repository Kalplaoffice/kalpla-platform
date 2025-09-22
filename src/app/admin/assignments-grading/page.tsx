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
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  StarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  BookOpenIcon,
  UsersIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function AssignmentsGradingPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [activeTab, setActiveTab] = useState('assignments');

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
      title: 'HTML Portfolio Website',
      courseId: 'COURSE_001',
      courseName: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Include sections for about, projects, skills, and contact.',
      type: 'project',
      status: 'active',
      difficulty: 'beginner',
      maxPoints: 100,
      dueDate: '2024-02-15T23:59:59Z',
      submissionCount: 45,
      gradedCount: 38,
      averageGrade: 85.5,
      totalSubmissions: 50,
      requirements: [
        'Responsive design for mobile and desktop',
        'At least 4 sections (About, Projects, Skills, Contact)',
        'Use of CSS Grid or Flexbox',
        'JavaScript for interactive elements',
        'Clean and professional design'
      ],
      rubric: [
        { criteria: 'Design & Layout', weight: 25, description: 'Visual appeal and responsive design' },
        { criteria: 'HTML Structure', weight: 20, description: 'Semantic HTML and proper structure' },
        { criteria: 'CSS Styling', weight: 25, description: 'CSS implementation and responsiveness' },
        { criteria: 'JavaScript Functionality', weight: 20, description: 'Interactive features and functionality' },
        { criteria: 'Code Quality', weight: 10, description: 'Clean code and best practices' }
      ],
      resources: [
        { name: 'Assignment Brief.pdf', type: 'document', size: '2.1 MB' },
        { name: 'Design Guidelines.pdf', type: 'document', size: '1.8 MB' },
        { name: 'Sample Code.zip', type: 'archive', size: '5.2 MB' }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'ASSIGN_002',
      title: 'Data Analysis with Pandas',
      courseId: 'COURSE_002',
      courseName: 'Data Science with Python',
      instructor: 'Prof. Michael Chen',
      description: 'Analyze a dataset using Pandas library. Perform data cleaning, exploration, and create visualizations.',
      type: 'analysis',
      status: 'active',
      difficulty: 'intermediate',
      maxPoints: 150,
      dueDate: '2024-02-20T23:59:59Z',
      submissionCount: 32,
      gradedCount: 28,
      averageGrade: 78.2,
      totalSubmissions: 35,
      requirements: [
        'Load and explore the dataset',
        'Handle missing values appropriately',
        'Perform statistical analysis',
        'Create at least 3 visualizations',
        'Write a summary report'
      ],
      rubric: [
        { criteria: 'Data Cleaning', weight: 30, description: 'Handling missing values and data quality' },
        { criteria: 'Analysis', weight: 35, description: 'Statistical analysis and insights' },
        { criteria: 'Visualizations', weight: 25, description: 'Quality and relevance of charts' },
        { criteria: 'Report', weight: 10, description: 'Clarity and completeness of summary' }
      ],
      resources: [
        { name: 'Dataset.csv', type: 'data', size: '15.3 MB' },
        { name: 'Analysis Template.ipynb', type: 'notebook', size: '2.8 MB' },
        { name: 'Pandas Reference.pdf', type: 'document', size: '3.1 MB' }
      ],
      createdAt: '2024-01-18T09:00:00Z',
      updatedAt: '2024-01-22T16:45:00Z'
    },
    {
      id: 'ASSIGN_003',
      title: 'Marketing Strategy Presentation',
      courseId: 'COURSE_003',
      courseName: 'Digital Marketing Masterclass',
      instructor: 'Mr. David Kumar',
      description: 'Develop a comprehensive digital marketing strategy for a startup. Include target audience, channels, budget, and KPIs.',
      type: 'presentation',
      status: 'active',
      difficulty: 'advanced',
      maxPoints: 200,
      dueDate: '2024-02-25T23:59:59Z',
      submissionCount: 28,
      gradedCount: 22,
      averageGrade: 82.7,
      totalSubmissions: 30,
      requirements: [
        'Define target audience personas',
        'Select appropriate marketing channels',
        'Create budget allocation plan',
        'Define key performance indicators',
        'Present findings in a professional format'
      ],
      rubric: [
        { criteria: 'Strategy Development', weight: 40, description: 'Comprehensive and realistic strategy' },
        { criteria: 'Target Audience', weight: 20, description: 'Well-defined personas and segmentation' },
        { criteria: 'Channel Selection', weight: 20, description: 'Appropriate channel mix and rationale' },
        { criteria: 'Budget Planning', weight: 10, description: 'Realistic budget allocation' },
        { criteria: 'Presentation', weight: 10, description: 'Professional presentation and clarity' }
      ],
      resources: [
        { name: 'Case Study Brief.pdf', type: 'document', size: '1.5 MB' },
        { name: 'Marketing Templates.pptx', type: 'presentation', size: '8.7 MB' },
        { name: 'Industry Reports.pdf', type: 'document', size: '4.2 MB' }
      ],
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-01-25T13:20:00Z'
    },
    {
      id: 'ASSIGN_004',
      title: 'Financial Model Excel Project',
      courseId: 'COURSE_004',
      courseName: 'Financial Modeling with Excel',
      instructor: 'Ms. Emily Rodriguez',
      description: 'Build a comprehensive financial model for a SaaS startup including revenue projections, cost analysis, and valuation.',
      type: 'model',
      status: 'draft',
      difficulty: 'advanced',
      maxPoints: 250,
      dueDate: '2024-03-01T23:59:59Z',
      submissionCount: 0,
      gradedCount: 0,
      averageGrade: 0,
      totalSubmissions: 25,
      requirements: [
        'Build revenue model with multiple scenarios',
        'Include detailed cost structure',
        'Calculate key financial metrics',
        'Perform sensitivity analysis',
        'Create executive summary'
      ],
      rubric: [
        { criteria: 'Revenue Model', weight: 35, description: 'Accurate and realistic revenue projections' },
        { criteria: 'Cost Analysis', weight: 25, description: 'Comprehensive cost structure' },
        { criteria: 'Financial Metrics', weight: 20, description: 'Key ratios and indicators' },
        { criteria: 'Sensitivity Analysis', weight: 15, description: 'Scenario modeling and analysis' },
        { criteria: 'Presentation', weight: 5, description: 'Clear and professional format' }
      ],
      resources: [
        { name: 'Financial Model Template.xlsx', type: 'spreadsheet', size: '1.2 MB' },
        { name: 'Industry Benchmarks.pdf', type: 'document', size: '2.5 MB' },
        { name: 'Valuation Methods.pdf', type: 'document', size: '1.8 MB' }
      ],
      createdAt: '2024-01-25T14:00:00Z',
      updatedAt: '2024-01-25T14:00:00Z'
    }
  ];

  // Mock data for submissions
  const submissions = [
    {
      id: 'SUBMIT_001',
      assignmentId: 'ASSIGN_001',
      assignmentTitle: 'HTML Portfolio Website',
      studentId: 'STUDENT_001',
      studentName: 'Alice Johnson',
      studentEmail: 'alice.johnson@email.com',
      courseId: 'COURSE_001',
      courseName: 'Complete Web Development Bootcamp',
      status: 'graded',
      grade: 92,
      maxPoints: 100,
      percentage: 92,
      submittedAt: '2024-02-14T18:30:00Z',
      gradedAt: '2024-02-15T10:15:00Z',
      gradedBy: 'Dr. Sarah Johnson',
      feedback: 'Excellent work! Your portfolio demonstrates strong understanding of responsive design principles. The JavaScript interactions are smooth and the overall design is professional. Consider adding more projects to showcase your skills.',
      files: [
        { name: 'portfolio.html', type: 'html', size: '15.2 KB' },
        { name: 'styles.css', type: 'css', size: '8.7 KB' },
        { name: 'script.js', type: 'javascript', size: '5.3 KB' },
        { name: 'screenshots.zip', type: 'archive', size: '2.1 MB' }
      ],
      rubricScores: [
        { criteria: 'Design & Layout', score: 23, maxScore: 25 },
        { criteria: 'HTML Structure', score: 19, maxScore: 20 },
        { criteria: 'CSS Styling', score: 24, maxScore: 25 },
        { criteria: 'JavaScript Functionality', score: 18, maxScore: 20 },
        { criteria: 'Code Quality', score: 8, maxScore: 10 }
      ],
      lateSubmission: false,
      plagiarismScore: 5,
      timeSpent: '8 hours'
    },
    {
      id: 'SUBMIT_002',
      assignmentId: 'ASSIGN_001',
      assignmentTitle: 'HTML Portfolio Website',
      studentId: 'STUDENT_002',
      studentName: 'Bob Williams',
      studentEmail: 'bob.williams@email.com',
      courseId: 'COURSE_001',
      courseName: 'Complete Web Development Bootcamp',
      status: 'graded',
      grade: 78,
      maxPoints: 100,
      percentage: 78,
      submittedAt: '2024-02-15T23:45:00Z',
      gradedAt: '2024-02-16T09:30:00Z',
      gradedBy: 'Dr. Sarah Johnson',
      feedback: 'Good effort! The basic structure is solid and the design is clean. However, the responsive design needs improvement on mobile devices. The JavaScript functionality could be more robust. Keep practicing!',
      files: [
        { name: 'index.html', type: 'html', size: '12.8 KB' },
        { name: 'style.css', type: 'css', size: '6.2 KB' },
        { name: 'main.js', type: 'javascript', size: '3.1 KB' }
      ],
      rubricScores: [
        { criteria: 'Design & Layout', score: 18, maxScore: 25 },
        { criteria: 'HTML Structure', score: 16, maxScore: 20 },
        { criteria: 'CSS Styling', score: 19, maxScore: 25 },
        { criteria: 'JavaScript Functionality', score: 15, maxScore: 20 },
        { criteria: 'Code Quality', score: 10, maxScore: 10 }
      ],
      lateSubmission: true,
      plagiarismScore: 12,
      timeSpent: '6 hours'
    },
    {
      id: 'SUBMIT_003',
      assignmentId: 'ASSIGN_002',
      assignmentTitle: 'Data Analysis with Pandas',
      studentId: 'STUDENT_003',
      studentName: 'Charlie Brown',
      studentEmail: 'charlie.brown@email.com',
      courseId: 'COURSE_002',
      courseName: 'Data Science with Python',
      status: 'pending',
      grade: null,
      maxPoints: 150,
      percentage: null,
      submittedAt: '2024-02-19T16:20:00Z',
      gradedAt: null,
      gradedBy: null,
      feedback: null,
      files: [
        { name: 'data_analysis.ipynb', type: 'notebook', size: '2.1 MB' },
        { name: 'analysis_report.pdf', type: 'document', size: '1.8 MB' },
        { name: 'dataset_cleaned.csv', type: 'data', size: '12.5 MB' }
      ],
      rubricScores: null,
      lateSubmission: false,
      plagiarismScore: 8,
      timeSpent: '12 hours'
    },
    {
      id: 'SUBMIT_004',
      assignmentId: 'ASSIGN_002',
      assignmentTitle: 'Data Analysis with Pandas',
      studentId: 'STUDENT_004',
      studentName: 'Diana Prince',
      studentEmail: 'diana.prince@email.com',
      courseId: 'COURSE_002',
      courseName: 'Data Science with Python',
      status: 'graded',
      grade: 135,
      maxPoints: 150,
      percentage: 90,
      submittedAt: '2024-02-18T14:15:00Z',
      gradedAt: '2024-02-19T11:45:00Z',
      gradedBy: 'Prof. Michael Chen',
      feedback: 'Outstanding analysis! Your data cleaning approach was thorough and the visualizations are excellent. The insights drawn from the analysis are valuable and well-presented. Great work on the statistical analysis.',
      files: [
        { name: 'pandas_analysis.ipynb', type: 'notebook', size: '3.2 MB' },
        { name: 'final_report.pdf', type: 'document', size: '2.5 MB' },
        { name: 'visualizations.png', type: 'image', size: '1.8 MB' }
      ],
      rubricScores: [
        { criteria: 'Data Cleaning', score: 28, maxScore: 30 },
        { criteria: 'Analysis', score: 32, maxScore: 35 },
        { criteria: 'Visualizations', score: 23, maxScore: 25 },
        { criteria: 'Report', score: 9, maxScore: 10 }
      ],
      lateSubmission: false,
      plagiarismScore: 3,
      timeSpent: '15 hours'
    }
  ];

  const courses = [
    { id: 'COURSE_001', name: 'Complete Web Development Bootcamp' },
    { id: 'COURSE_002', name: 'Data Science with Python' },
    { id: 'COURSE_003', name: 'Digital Marketing Masterclass' },
    { id: 'COURSE_004', name: 'Financial Modeling with Excel' }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || assignment.courseId === filterCourse;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || submission.courseId === filterCourse;
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesGrade = filterGrade === 'all' || 
      (filterGrade === 'excellent' && submission.percentage && submission.percentage >= 90) ||
      (filterGrade === 'good' && submission.percentage && submission.percentage >= 80 && submission.percentage < 90) ||
      (filterGrade === 'average' && submission.percentage && submission.percentage >= 70 && submission.percentage < 80) ||
      (filterGrade === 'poor' && submission.percentage && submission.percentage < 70);
    return matchesSearch && matchesCourse && matchesStatus && matchesGrade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'late': return 'text-red-600 bg-red-100';
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

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    return 'Poor';
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments and grading...</p>
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
                <p className="text-gray-600 mt-1">Manage assignments, submissions, and grading across all courses</p>
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
                    <p className="text-sm font-medium text-gray-600">Graded Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{submissions.filter(s => s.status === 'graded').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Grading</p>
                    <p className="text-2xl font-bold text-gray-900">{submissions.filter(s => s.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {submissions.filter(s => s.status === 'graded').length > 0 
                        ? Math.round(submissions.filter(s => s.status === 'graded').reduce((acc, s) => acc + s.percentage!, 0) / submissions.filter(s => s.status === 'graded').length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'assignments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Assignments ({assignments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'submissions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Submissions ({submissions.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
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
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                  <option value="graded">Graded</option>
                  <option value="pending">Pending</option>
                </select>

                {/* Grade Filter (for submissions) */}
                {activeTab === 'submissions' && (
                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Grades</option>
                    <option value="excellent">Excellent (90%+)</option>
                    <option value="good">Good (80-89%)</option>
                    <option value="average">Average (70-79%)</option>
                    <option value="poor">Poor (&lt;70%)</option>
                  </select>
                )}
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Assignment
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <DocumentCheckIcon className="h-5 w-5 mr-2" />
                  Bulk Grade
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'assignments' ? (
            <div className="space-y-6">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{assignment.description}</p>

                      {/* Key Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          <span>{assignment.courseName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <span>{assignment.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 mr-2" />
                          <span>{assignment.maxPoints} points</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{assignment.submissionCount}</div>
                          <div className="text-sm text-gray-600">Submissions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{assignment.gradedCount}</div>
                          <div className="text-sm text-gray-600">Graded</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{assignment.averageGrade}%</div>
                          <div className="text-sm text-gray-600">Avg Grade</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {assignment.totalSubmissions > 0 ? Math.round((assignment.submissionCount / assignment.totalSubmissions) * 100) : 0}%
                          </div>
                          <div className="text-sm text-gray-600">Submission Rate</div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {assignment.requirements.slice(0, 3).map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                          ))}
                          {assignment.requirements.length > 3 && (
                            <li className="text-gray-500">+{assignment.requirements.length - 3} more requirements</li>
                          )}
                        </ul>
                      </div>

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
                        <button className="flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          Submissions
                        </button>
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
          ) : (
            <div className="space-y-6">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{submission.assignmentTitle}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                          {submission.grade && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(submission.percentage!)}`}>
                              {submission.grade}/{submission.maxPoints} ({submission.percentage}%)
                            </span>
                          )}
                          {submission.lateSubmission && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Late
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <span>{submission.studentName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          <span>{submission.courseName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>Submitted: {formatDate(submission.submittedAt)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span>Time: {submission.timeSpent}</span>
                        </div>
                      </div>

                      {/* Files */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Files:</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.files.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({file.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rubric Scores */}
                      {submission.rubricScores && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Rubric Scores:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {submission.rubricScores.map((score, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{score.criteria}</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {score.score}/{score.maxScore}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      {submission.feedback && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 mb-1">Instructor Feedback:</h4>
                          <p className="text-sm text-blue-700">{submission.feedback}</p>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Plagiarism Score:</span>
                          <span className={`ml-2 font-medium ${submission.plagiarismScore < 10 ? 'text-green-600' : 'text-red-600'}`}>
                            {submission.plagiarismScore}%
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Graded By:</span>
                          <span className="ml-2 font-medium">{submission.gradedBy || 'Not graded'}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Grade:</span>
                          <span className={`ml-2 font-medium ${submission.grade ? getGradeColor(submission.percentage!) : 'text-gray-600'}`}>
                            {submission.grade ? getGradeLabel(submission.percentage!) : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Submission
                        </button>
                        {submission.status === 'pending' && (
                          <button className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Grade
                          </button>
                        )}
                        <button className="flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit Grade
                        </button>
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
          )}

          {/* Empty State */}
          {(activeTab === 'assignments' && filteredAssignments.length === 0) || (activeTab === 'submissions' && filteredSubmissions.length === 0) ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterCourse !== 'all' || filterStatus !== 'all' || filterGrade !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : `No ${activeTab} have been created yet.`
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create First Assignment
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

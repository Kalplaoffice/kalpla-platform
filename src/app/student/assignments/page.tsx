'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';


interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  courseId: string;
  phase?: number;
  dueDate: string;
  maxMarks: number;
  status: 'not_submitted' | 'submitted' | 'graded' | 'late';
  submission?: {
    id: string;
    submittedAt: string;
    fileUrl: string;
    fileName: string;
    fileSize: string;
    textSubmission?: string;
    linkSubmission?: string;
  };
  grade?: {
    score: number;
    feedback: string;
    gradedAt: string;
    gradedBy: string;
  };
  instructions: string;
  allowedFileTypes: string[];
  maxFileSize: string;
  createdAt: string;
}

export default function StudentAssignments() {
  const { hasRole } = useRoleBasedAccess();
  
  // Check if user is student
  const isStudent = hasRole('Student');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionType, setSubmissionType] = useState<'file' | 'text' | 'link'>('file');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Financial Model Assignment',
        description: 'Create a comprehensive financial model for your startup idea',
        course: 'KSMP Phase 3',
        courseId: 'ksmp',
        phase: 3,
        dueDate: '2024-01-25T23:59:00Z',
        maxMarks: 100,
        status: 'not_submitted',
        instructions: 'Create a 3-year financial projection model including revenue, expenses, and cash flow. Use Excel or Google Sheets.',
        allowedFileTypes: ['xlsx', 'xls', 'pdf'],
        maxFileSize: '10MB',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Data Visualization Project',
        description: 'Create interactive visualizations using Python libraries',
        course: 'Python for Data Science',
        courseId: 'python-ds',
        dueDate: '2024-01-28T23:59:00Z',
        maxMarks: 100,
        status: 'submitted',
        submission: {
          id: 'sub1',
          submittedAt: '2024-01-26T14:30:00Z',
          fileUrl: '#',
          fileName: 'data_viz_project.ipynb',
          fileSize: '2.3 MB'
        },
        instructions: 'Create at least 3 different types of visualizations using matplotlib, seaborn, or plotly. Include insights and analysis.',
        allowedFileTypes: ['ipynb', 'py', 'pdf'],
        maxFileSize: '5MB',
        createdAt: '2024-01-20T09:00:00Z'
      },
      {
        id: '3',
        title: 'React Component Library',
        description: 'Build a reusable component library using React',
        course: 'React Development',
        courseId: 'react-dev',
        dueDate: '2024-01-30T23:59:00Z',
        maxMarks: 100,
        status: 'not_submitted',
        instructions: 'Create a component library with at least 5 reusable components. Include documentation and examples.',
        allowedFileTypes: ['zip', 'rar'],
        maxFileSize: '20MB',
        createdAt: '2024-01-22T11:00:00Z'
      },
      {
        id: '4',
        title: 'Market Research Report',
        description: 'Conduct market research and create a comprehensive report',
        course: 'KSMP Phase 1',
        courseId: 'ksmp',
        phase: 1,
        dueDate: '2024-01-15T23:59:00Z',
        maxMarks: 100,
        status: 'graded',
        submission: {
          id: 'sub2',
          submittedAt: '2024-01-14T16:45:00Z',
          fileUrl: '#',
          fileName: 'market_research_report.pdf',
          fileSize: '4.1 MB'
        },
        grade: {
          score: 85,
          feedback: 'Excellent market analysis with comprehensive data. Good use of primary and secondary research. Consider adding more competitor analysis in future assignments.',
          gradedAt: '2024-01-16T10:30:00Z',
          gradedBy: 'John Doe'
        },
        instructions: 'Research your target market and create a detailed report covering market size, trends, competition, and opportunities.',
        allowedFileTypes: ['pdf', 'doc', 'docx'],
        maxFileSize: '10MB',
        createdAt: '2024-01-10T14:00:00Z'
      },
      {
        id: '5',
        title: 'Business Model Canvas',
        description: 'Create a business model canvas for your startup',
        course: 'KSMP Phase 2',
        courseId: 'ksmp',
        phase: 2,
        dueDate: '2024-01-20T23:59:00Z',
        maxMarks: 100,
        status: 'graded',
        submission: {
          id: 'sub3',
          submittedAt: '2024-01-19T20:15:00Z',
          fileUrl: '#',
          fileName: 'business_model_canvas.pdf',
          fileSize: '1.8 MB'
        },
        grade: {
          score: 92,
          feedback: 'Outstanding business model canvas! Clear value proposition and well-defined customer segments. Revenue streams are well thought out.',
          gradedAt: '2024-01-21T09:15:00Z',
          gradedBy: 'Jane Smith'
        },
        instructions: 'Complete the business model canvas template with detailed information about your startup idea.',
        allowedFileTypes: ['pdf', 'png', 'jpg'],
        maxFileSize: '5MB',
        createdAt: '2024-01-12T16:00:00Z'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.status === 'not_submitted';
    if (filter === 'submitted') return assignment.status === 'submitted';
    if (filter === 'graded') return assignment.status === 'graded';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_submitted':
        return 'text-red-600 bg-red-100';
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'graded':
        return 'text-green-600 bg-green-100';
      case 'late':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_submitted':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'submitted':
        return <ClockIcon className="h-4 w-4" />;
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'late':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSubmissionFile(file);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      // TODO: Implement actual submission API call
      console.log('Submitting assignment:', selectedAssignment.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setAssignments(prev => prev.map(assignment => 
        assignment.id === selectedAssignment.id 
          ? { 
              ...assignment, 
              status: 'submitted',
              submission: {
                id: `sub${Date.now()}`,
                submittedAt: new Date().toISOString(),
                fileUrl: '#',
                fileName: submissionFile?.name || 'text_submission.txt',
                fileSize: submissionFile ? `${(submissionFile.size / 1024 / 1024).toFixed(1)} MB` : '1 KB',
                textSubmission: submissionText,
                linkSubmission: submissionLink
              }
            }
          : assignment
      ));
      
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setSubmissionText('');
      setSubmissionLink('');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Track and submit your course assignments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'not_submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Graded</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Assignments', count: assignments.length },
              { key: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'not_submitted').length },
              { key: 'submitted', label: 'Submitted', count: assignments.filter(a => a.status === 'submitted').length },
              { key: 'graded', label: 'Graded', count: assignments.filter(a => a.status === 'graded').length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                return (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusIcon(assignment.status)}
                            <span className="ml-1">{assignment.status.replace('_', ' ')}</span>
                          </span>
                          {assignment.phase && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Phase {assignment.phase}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-2" />
                            {assignment.course}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Due: {formatDate(assignment.dueDate)}
                          </div>
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            {assignment.maxMarks} marks
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
                          </div>
                        </div>

                        {assignment.submission && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Submission Details</h4>
                            <div className="text-sm text-gray-600">
                              <p>Submitted: {formatDate(assignment.submission.submittedAt)}</p>
                              <p>File: {assignment.submission.fileName} ({assignment.submission.fileSize})</p>
                            </div>
                          </div>
                        )}

                        {assignment.grade && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900">Grade & Feedback</h4>
                              <span className="text-lg font-bold text-green-600">
                                {assignment.grade.score}/{assignment.maxMarks}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{assignment.grade.feedback}</p>
                            <p className="text-xs text-gray-500">
                              Graded by {assignment.grade.gradedBy} on {formatDate(assignment.grade.gradedAt)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmissionModal(true);
                          }}
                          disabled={assignment.status === 'graded'}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            assignment.status === 'not_submitted'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : assignment.status === 'submitted'
                              ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                              : 'bg-green-100 text-green-700 cursor-not-allowed'
                          }`}
                        >
                          {assignment.status === 'not_submitted' ? (
                            <>
                              <ArrowUpTrayIcon className="h-4 w-4 mr-2 inline" />
                              Submit
                            </>
                          ) : assignment.status === 'submitted' ? (
                            'Submitted'
                          ) : (
                            'Graded'
                          )}
                        </button>
                        
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <EyeIcon className="h-4 w-4 mr-1 inline" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submission Modal */}
        {showSubmissionModal && selectedAssignment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSubmissionModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Submit Assignment: {selectedAssignment.title}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Instructions</h4>
                      <p className="text-sm text-gray-600">{selectedAssignment.instructions}</p>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Submission Type</h4>
                      <div className="flex space-x-4">
                        {['file', 'text', 'link'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setSubmissionType(type as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              submissionType === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {submissionType === 'file' && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Upload File</h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept={selectedAssignment.allowedFileTypes.map(type => `.${type}`).join(',')}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Allowed types: {selectedAssignment.allowedFileTypes.join(', ')} • 
                              Max size: {selectedAssignment.maxFileSize}
                            </p>
                          </label>
                        </div>
                        {submissionFile && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-900">{submissionFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(submissionFile.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {submissionType === 'text' && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Text Submission</h4>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Enter your submission text here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={6}
                        />
                      </div>
                    )}

                    {submissionType === 'link' && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Link Submission</h4>
                        <input
                          type="url"
                          value={submissionLink}
                          onChange={(e) => setSubmissionLink(e.target.value)}
                          placeholder="https://example.com/your-submission"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowSubmissionModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAssignment}
                        disabled={submitting || (
                          submissionType === 'file' && !submissionFile ||
                          submissionType === 'text' && !submissionText.trim() ||
                          submissionType === 'link' && !submissionLink.trim()
                        )}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? 'Submitting...' : 'Submit Assignment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

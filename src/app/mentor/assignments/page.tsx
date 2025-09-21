'use client';

import { useState, useEffect } from 'react';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  phase?: number;
  submittedAt: string;
  dueDate: string;
  maxMarks: number;
  status: 'submitted' | 'graded' | 'overdue';
  submissionType: 'file' | 'text' | 'link';
  fileName?: string;
  fileSize?: string;
  textSubmission?: string;
  linkSubmission?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

interface GradingForm {
  grade: number;
  feedback: string;
}

export default function MentorAssignments() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is mentor
  const isMentor = hasRole('Mentor');
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'graded' | 'overdue'>('submitted');
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingForm, setGradingForm] = useState<GradingForm>({
    grade: 0,
    feedback: ''
  });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockSubmissions: AssignmentSubmission[] = [
      {
        id: 'sub1',
        assignmentId: 'a1',
        assignmentTitle: 'Financial Model Assignment',
        studentId: 's1',
        studentName: 'Rahul Sharma',
        studentEmail: 'rahul.sharma@email.com',
        course: 'KSMP Phase 3',
        phase: 3,
        submittedAt: '2024-01-20T14:30:00Z',
        dueDate: '2024-01-25T23:59:00Z',
        maxMarks: 100,
        status: 'submitted',
        submissionType: 'file',
        fileName: 'financial_model.xlsx',
        fileSize: '2.3 MB'
      },
      {
        id: 'sub2',
        assignmentId: 'a2',
        assignmentTitle: 'Business Model Canvas',
        studentId: 's2',
        studentName: 'Priya Patel',
        studentEmail: 'priya.patel@email.com',
        course: 'KSMP Phase 2',
        phase: 2,
        submittedAt: '2024-01-19T16:45:00Z',
        dueDate: '2024-01-22T23:59:00Z',
        maxMarks: 100,
        status: 'submitted',
        submissionType: 'file',
        fileName: 'business_model_canvas.pdf',
        fileSize: '1.8 MB'
      },
      {
        id: 'sub3',
        assignmentId: 'a3',
        assignmentTitle: 'Market Research Report',
        studentId: 's3',
        studentName: 'Mike Johnson',
        studentEmail: 'mike.johnson@email.com',
        course: 'KSMP Phase 1',
        phase: 1,
        submittedAt: '2024-01-18T10:15:00Z',
        dueDate: '2024-01-20T23:59:00Z',
        maxMarks: 100,
        status: 'graded',
        submissionType: 'file',
        fileName: 'market_research.docx',
        fileSize: '3.1 MB',
        grade: 85,
        feedback: 'Good research with solid data. Consider adding more competitor analysis in future assignments.',
        gradedAt: '2024-01-19T09:30:00Z',
        gradedBy: 'John Doe'
      },
      {
        id: 'sub4',
        assignmentId: 'a4',
        assignmentTitle: 'Investor Pitch Deck',
        studentId: 's4',
        studentName: 'Sarah Wilson',
        studentEmail: 'sarah.wilson@email.com',
        course: 'KSMP Phase 3',
        phase: 3,
        submittedAt: '2024-01-17T20:30:00Z',
        dueDate: '2024-01-22T23:59:00Z',
        maxMarks: 100,
        status: 'graded',
        submissionType: 'file',
        fileName: 'pitch_deck.pptx',
        fileSize: '4.2 MB',
        grade: 92,
        feedback: 'Excellent pitch deck with clear value proposition and strong market validation. Well-structured presentation.',
        gradedAt: '2024-01-18T14:15:00Z',
        gradedBy: 'John Doe'
      },
      {
        id: 'sub5',
        assignmentId: 'a5',
        assignmentTitle: 'Strategic Plan',
        studentId: 's5',
        studentName: 'Alex Brown',
        studentEmail: 'alex.brown@email.com',
        course: 'KSMP Phase 2',
        phase: 2,
        submittedAt: '2024-01-16T11:20:00Z',
        dueDate: '2024-01-18T23:59:00Z',
        maxMarks: 100,
        status: 'overdue',
        submissionType: 'text',
        textSubmission: 'This is a strategic plan for my startup focusing on market entry and growth strategies...'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <ClockIcon className="h-4 w-4" />;
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <DocumentTextIcon className="h-4 w-4 text-green-500" />;
      case 'link':
        return <DocumentTextIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || gradingForm.grade < 0 || gradingForm.grade > selectedSubmission.maxMarks) {
      alert('Please enter a valid grade');
      return;
    }

    setGrading(true);
    try {
      // TODO: Implement actual grading API call
      console.log('Grading submission:', selectedSubmission.id, gradingForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setSubmissions(prev => prev.map(submission => 
        submission.id === selectedSubmission.id 
          ? { 
              ...submission, 
              status: 'graded',
              grade: gradingForm.grade,
              feedback: gradingForm.feedback,
              gradedAt: new Date().toISOString(),
              gradedBy: 'John Doe' // Current mentor
            }
          : submission
      ));
      
      setShowGradingModal(false);
      setSelectedSubmission(null);
      setGradingForm({ grade: 0, feedback: '' });
    } catch (error) {
      console.error('Grading error:', error);
    } finally {
      setGrading(false);
    }
  };

  const openGradingModal = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGradingForm({
      grade: submission.grade || 0,
      feedback: submission.feedback || ''
    });
    setShowGradingModal(true);
  };

  if (!isMentor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the mentor dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <MentorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-semibold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted').length}
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
                  {submissions.filter(s => s.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {submissions.filter(s => s.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Submissions', count: submissions.length },
              { key: 'submitted', label: 'Pending Grading', count: submissions.filter(s => s.status === 'submitted').length },
              { key: 'graded', label: 'Graded', count: submissions.filter(s => s.status === 'graded').length },
              { key: 'overdue', label: 'Overdue', count: submissions.filter(s => s.status === 'overdue').length }
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

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Submissions</h2>
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-md font-semibold text-gray-900">{submission.assignmentTitle}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1">{submission.status}</span>
                        </span>
                        {submission.phase && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Phase {submission.phase}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          {submission.studentName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {submission.course}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Submitted: {formatDate(submission.submittedAt)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Due: {formatDate(submission.dueDate)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          {getSubmissionTypeIcon(submission.submissionType)}
                          <span className="ml-2 capitalize">{submission.submissionType}</span>
                        </div>
                        {submission.fileName && (
                          <div className="text-sm text-gray-600">
                            File: {submission.fileName} ({submission.fileSize})
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Max Marks: {submission.maxMarks}
                        </div>
                        {submission.grade && (
                          <div className="text-sm font-medium text-gray-900">
                            Grade: {submission.grade}/{submission.maxMarks}
                          </div>
                        )}
                      </div>

                      {submission.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Feedback</h4>
                          <p className="text-sm text-gray-700">{submission.feedback}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Graded by {submission.gradedBy} on {submission.gradedAt ? formatDate(submission.gradedAt) : 'N/A'}
                          </p>
                        </div>
                      )}

                      {submission.textSubmission && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Text Submission</h4>
                          <p className="text-sm text-gray-700">{submission.textSubmission}</p>
                        </div>
                      )}

                      {submission.linkSubmission && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Link Submission</h4>
                          <a
                            href={submission.linkSubmission}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {submission.linkSubmission}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openGradingModal(submission)}
                        disabled={submission.status === 'graded'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          submission.status === 'submitted' || submission.status === 'overdue'
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-100 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        {submission.status === 'graded' ? 'Already Graded' : 'Grade Submission'}
                      </button>
                      
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grading Modal */}
        {showGradingModal && selectedSubmission && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowGradingModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Grade Submission: {selectedSubmission.assignmentTitle}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Submission Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Student:</span>
                          <span className="ml-2 text-gray-900">{selectedSubmission.studentName}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Course:</span>
                          <span className="ml-2 text-gray-900">{selectedSubmission.course}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Submitted:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedSubmission.submittedAt)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Max Marks:</span>
                          <span className="ml-2 text-gray-900">{selectedSubmission.maxMarks}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade (0 - {selectedSubmission.maxMarks})</label>
                      <input
                        type="number"
                        min="0"
                        max={selectedSubmission.maxMarks}
                        value={gradingForm.grade}
                        onChange={(e) => setGradingForm({ ...gradingForm, grade: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter grade"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                      <textarea
                        value={gradingForm.feedback}
                        onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                        placeholder="Provide detailed feedback to help the student improve..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowGradingModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGradeSubmission}
                        disabled={grading || gradingForm.grade < 0 || gradingForm.grade > selectedSubmission.maxMarks}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {grading ? 'Grading...' : 'Submit Grade'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorLayout>
  );
}

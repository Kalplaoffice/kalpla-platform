'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { assignmentService } from '@/lib/assignmentService';
import { 
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentId: string;
  assignmentTitle: string;
  courseTitle?: string;
  cohortName?: string;
  content?: string;
  files: string[];
  submissionDate: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  grade?: number;
  feedback?: string;
  gradedDate?: string;
  maxPoints: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  maxPoints: number;
  dueDate: string;
  type: 'ESSAY' | 'PROJECT' | 'QUIZ' | 'MCQ';
}

export default function MentorGradingPage() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('pending');

  // Load submissions from backend service
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load pending submissions for the mentor
        const submissionsData = await assignmentService.getPendingSubmissions(user.id);
        
        // Transform the data to match the interface
        const transformedSubmissions = submissionsData.map(submission => ({
          id: submission.id,
          studentId: submission.userId,
          studentName: submission.user?.firstName + ' ' + submission.user?.lastName || 'Student',
          studentEmail: submission.user?.email || '',
          assignmentId: submission.assignmentId,
          assignmentTitle: submission.assignment?.title || 'Assignment',
          courseTitle: submission.assignment?.course?.title || 'Course',
          content: submission.textSubmission,
          files: submission.fileSubmission ? [submission.fileSubmission] : [],
          submissionDate: submission.submittedAt || submission.createdAt,
          status: submission.status === 'GRADED' ? 'GRADED' : 'SUBMITTED',
          grade: submission.grade,
          feedback: submission.feedback,
          gradedDate: submission.gradedAt,
          maxPoints: submission.assignment?.maxPoints || 100
        }));
        
        setSubmissions(transformedSubmissions);
      } catch (error) {
        console.error('Error loading submissions:', error);
        // Fallback to empty array on error
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [user?.id]);

  const filteredSubmissions = submissions.filter(submission => {
    switch (filter) {
      case 'pending':
        return submission.status === 'SUBMITTED' || submission.status === 'LATE';
      case 'graded':
        return submission.status === 'GRADED';
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'GRADED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'LATE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Pending Review';
      case 'GRADED':
        return 'Graded';
      case 'LATE':
        return 'Late Submission';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-100';
      case 'GRADED':
        return 'text-green-600 bg-green-100';
      case 'LATE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade) return;
    
    setGrading(true);
    
    try {
      // Implement actual grading logic using assignment service
      await assignmentService.gradeAssignment({
        submissionId: submission.id,
        grade,
        feedback
      });
      
      console.log('Grading submission:', {
        submissionId: selectedSubmission.id,
        grade: parseFloat(grade),
        feedback: feedback
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSubmissions(prev => prev.map(submission => 
        submission.id === selectedSubmission.id 
          ? { 
              ...submission, 
              status: 'GRADED',
              grade: parseFloat(grade),
              feedback: feedback,
              gradedDate: new Date().toISOString()
            }
          : submission
      ));
      
      setGrade('');
      setFeedback('');
      setSelectedSubmission(null);
      
    } catch (error) {
      console.error('Error grading submission:', error);
    } finally {
      setGrading(false);
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Authenticator>
      {({ signOut, user: authUser }) => {
        if (!authUser) return null;
        
        return (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Pending Submissions</h1>
              <p className="text-gray-600">
                Review and grade student submissions for your courses and KSMP cohorts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Submission List */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Submission List</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          filter === 'pending' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Pending ({submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'LATE').length})
                      </button>
                      <button
                        onClick={() => setFilter('graded')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          filter === 'graded' 
                            ? 'bg-green-100 text-green-800' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Graded ({submissions.filter(s => s.status === 'GRADED').length})
                      </button>
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          filter === 'all' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        All ({submissions.length})
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 ${
                        selectedSubmission?.id === submission.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleViewSubmission(submission)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900">
                              {submission.studentName}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {submission.assignmentTitle}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{submission.maxPoints} points</span>
                            </div>
                          </div>
                          {submission.courseTitle && (
                            <div className="mt-2">
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {submission.courseTitle}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            <span className="ml-1">{getStatusText(submission.status)}</span>
                          </div>
                          {submission.grade && (
                            <div className="text-sm font-medium text-gray-900">
                              Grade: {submission.grade}/{submission.maxPoints}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grading Interface */}
              <div className="bg-white rounded-lg shadow">
                {selectedSubmission ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedSubmission.studentName}
                      </h2>
                      <p className="text-gray-600 mb-4">{selectedSubmission.assignmentTitle}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Submitted: {new Date(selectedSubmission.submissionDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">{selectedSubmission.maxPoints} points</span>
                        </div>
                      </div>

                      {selectedSubmission.status === 'LATE' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">Late submission</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submission Content */}
                    {selectedSubmission.content && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Written Response</h3>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedSubmission.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Submission Files */}
                    {selectedSubmission.files.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Submitted Files</h3>
                        <div className="space-y-2">
                          {selectedSubmission.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm text-gray-700">{file}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-800 text-sm">
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grading Form */}
                    {selectedSubmission.status !== 'GRADED' ? (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Grade Assignment</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Grade (0 - {selectedSubmission.maxPoints})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={selectedSubmission.maxPoints}
                              value={grade}
                              onChange={(e) => setGrade(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter grade"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Feedback
                            </label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Provide detailed feedback to help the student improve..."
                            />
                          </div>

                          <button
                            onClick={handleGradeSubmission}
                            disabled={grading || !grade}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {grading ? 'Grading...' : 'Submit Grade'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Already Graded */
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Grading Results</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-900">Grade</span>
                            <span className="text-2xl font-bold text-green-600">
                              {selectedSubmission.grade}/{selectedSubmission.maxPoints}
                            </span>
                          </div>
                          {selectedSubmission.feedback && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-2">Feedback:</p>
                              <p className="text-sm text-gray-700 bg-white rounded p-3">
                                {selectedSubmission.feedback}
                              </p>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-gray-500">
                            Graded on {selectedSubmission.gradedDate && new Date(selectedSubmission.gradedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Submission</h3>
                    <p className="text-gray-600">
                      Choose a submission from the list to review and grade.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { assignmentService } from '@/lib/assignmentService';
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  instructions: string;
  resources: string[];
  courseTitle?: string;
  cohortName?: string;
  type: 'ESSAY' | 'PROJECT' | 'QUIZ' | 'MCQ';
  status: 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submission?: {
    id: string;
    content?: string;
    files: string[];
    submissionDate: string;
    grade?: number;
    feedback?: string;
    gradedDate?: string;
  };
}

export default function AssignmentsPage() {
  const { user } = useUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState<FileList | null>(null);

  // Load assignments from backend service
  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load assignments for all courses the user is enrolled in
        // For now, we'll use a mock course ID - in production, you'd get this from user enrollments
        const assignmentsData = await assignmentService.getAssignmentsByCourse('course-1');
        
        // Load user's submissions
        const submissionsData = await assignmentService.getSubmissionsByUser(user.id);
        
        // Combine assignments with submission data
        const assignmentsWithSubmissions = assignmentsData.map(assignment => {
          const submission = submissionsData.find(sub => sub.assignmentId === assignment.id);
          return {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate || '',
            maxPoints: assignment.maxPoints,
            instructions: assignment.instructions,
            resources: assignment.resources,
            courseTitle: 'KSMP Phase', // You might want to get this from the course data
            type: 'ESSAY' as const, // You might want to add this to the schema
            status: submission ? 'SUBMITTED' : 'NOT_SUBMITTED',
            submission: submission ? {
              id: submission.id,
              content: submission.textSubmission,
              files: submission.fileSubmission ? [submission.fileSubmission] : [],
              submissionDate: submission.submittedAt || '',
              grade: submission.grade,
              feedback: submission.feedback,
              gradedDate: submission.gradedAt
            } : undefined
          };
        });
        
        setAssignments(assignmentsWithSubmissions);
      } catch (error) {
        console.error('Error loading assignments:', error);
        // Fallback to empty array on error
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NOT_SUBMITTED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
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
      case 'NOT_SUBMITTED':
        return 'Not Submitted';
      case 'SUBMITTED':
        return 'Submitted';
      case 'GRADED':
        return 'Graded';
      case 'LATE':
        return 'Late';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_SUBMITTED':
        return 'text-yellow-600 bg-yellow-100';
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !assignments.find(a => a.id === selectedAssignment?.id)?.submission;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionFiles(event.target.files);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;
    
    setSubmitting(true);
    
    try {
      // Implement actual submission logic using assignment service
      await assignmentService.submitAssignment({
        assignmentId: assignment.id,
        textSubmission: submissionContent,
        fileSubmission: submissionFiles ? Array.from(submissionFiles).map(f => f.name).join(',') : undefined
      });
      
      console.log('Submitting assignment:', {
        assignmentId: selectedAssignment.id,
        content: submissionContent,
        files: submissionFiles
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setAssignments(prev => prev.map(assignment => 
        assignment.id === selectedAssignment.id 
          ? { 
              ...assignment, 
              status: 'SUBMITTED',
              submission: {
                id: 'new-submission',
                content: submissionContent,
                files: submissionFiles ? Array.from(submissionFiles).map(f => f.name) : [],
                submissionDate: new Date().toISOString()
              }
            }
          : assignment
      ));
      
      setSubmissionContent('');
      setSubmissionFiles(null);
      setSelectedAssignment(null);
      
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setSubmitting(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Assignments</h1>
              <p className="text-gray-600">
                View and submit your assignments, track your progress, and access feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assignment List */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Assignment List</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 ${
                        selectedAssignment?.id === assignment.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900">
                              {assignment.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{assignment.maxPoints} points</span>
                            </div>
                          </div>
                          {assignment.courseTitle && (
                            <div className="mt-2">
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                {assignment.courseTitle}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusIcon(assignment.status)}
                            <span className="ml-1">{getStatusText(assignment.status)}</span>
                          </div>
                          {assignment.submission?.grade && (
                            <div className="text-sm font-medium text-gray-900">
                              Grade: {assignment.submission.grade}/{assignment.maxPoints}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Detail */}
              <div className="bg-white rounded-lg shadow">
                {selectedAssignment ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedAssignment.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">{selectedAssignment.maxPoints} points</span>
                        </div>
                      </div>

                      {isOverdue(selectedAssignment.dueDate) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">This assignment is overdue</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Instructions</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedAssignment.instructions}
                        </p>
                      </div>
                    </div>

                    {/* Resources */}
                    {selectedAssignment.resources.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Resources</h3>
                        <div className="space-y-2">
                          {selectedAssignment.resources.map((resource, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <span className="text-sm text-gray-700">{resource}</span>
                              <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submission Status */}
                    {selectedAssignment.submission ? (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Your Submission</h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">
                              Submitted on {new Date(selectedAssignment.submission.submissionDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                              {getStatusText(selectedAssignment.status)}
                            </span>
                          </div>
                          
                          {selectedAssignment.submission.files.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-700 mb-2">Files:</p>
                              <div className="space-y-1">
                                {selectedAssignment.submission.files.map((file, index) => (
                                  <div key={index} className="flex items-center text-sm text-gray-600">
                                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                                    {file}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedAssignment.submission.grade && (
                            <div className="border-t border-green-200 pt-3 mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">Grade</span>
                                <span className="text-lg font-bold text-green-600">
                                  {selectedAssignment.submission.grade}/{selectedAssignment.maxPoints}
                                </span>
                              </div>
                              {selectedAssignment.submission.feedback && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-1">Feedback:</p>
                                  <p className="text-sm text-gray-700 bg-white rounded p-2">
                                    {selectedAssignment.submission.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Submission Form */
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Submit Assignment</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Written Response (Optional)
                            </label>
                            <textarea
                              value={submissionContent}
                              onChange={(e) => setSubmissionContent(e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your response here..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Files
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                              >
                                Choose Files
                              </label>
                              <p className="text-sm text-gray-500 mt-2">
                                PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Max 10MB each)
                              </p>
                            </div>
                            {submissionFiles && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-700 mb-2">Selected files:</p>
                                <div className="space-y-1">
                                  {Array.from(submissionFiles).map((file, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={handleSubmitAssignment}
                            disabled={submitting || (!submissionContent && !submissionFiles)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {submitting ? 'Submitting...' : 'Submit Assignment'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Assignment</h3>
                    <p className="text-gray-600">
                      Choose an assignment from the list to view details and submit your work.
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

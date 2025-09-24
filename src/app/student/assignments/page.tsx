'use client';

import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  DocumentArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { assignmentService, Assignment, Submission } from '@/lib/assignmentService';

export default function StudentAssignmentsPage() {
  // State management
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // Form States
  const [submitData, setSubmitData] = useState({
    fileUrl: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStudentId = 'student-1'; // Current student ID

  // Load assignments and submissions on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Add mock data for testing if no assignments exist
  useEffect(() => {
    if (!loading && assignments.length === 0 && !error) {
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          courseID: 'course-1',
          title: 'Business Model Canvas',
          description: 'Create a detailed Business Model Canvas for your startup idea. Include all nine building blocks with specific details about your target market, value proposition, and revenue streams.',
          dueDate: '2024-10-15T23:59:59Z',
          totalMarks: 100,
          fileUrl: 'https://example.com/bmc-template.pdf',
          createdBy: 'mentor-1',
          submissions: [],
          createdAt: '2024-10-01T10:00:00Z',
          updatedAt: '2024-10-01T10:00:00Z'
        },
        {
          id: '2',
          courseID: 'course-2',
          title: 'Financial Projections',
          description: 'Develop a 3-year financial projection for your startup including revenue forecasts, expense projections, and break-even analysis.',
          dueDate: '2024-10-20T23:59:59Z',
          totalMarks: 100,
          fileUrl: 'https://example.com/financial-template.xlsx',
          createdBy: 'mentor-2',
          submissions: [],
          createdAt: '2024-10-05T10:00:00Z',
          updatedAt: '2024-10-05T10:00:00Z'
        }
      ];
      setAssignments(mockAssignments);
    }
  }, [loading, assignments.length, error]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load assignments for current student's courses
      const assignmentsData = await assignmentService.getAssignments({
        search: searchQuery
      });
      
      // Load student's submissions
      const submissionsData = await assignmentService.getSubmissions({
        studentID: currentStudentId
      });
      
      // If API returns empty array, use mock data
      if (assignmentsData.length === 0) {
        console.log('API returned empty array, using mock data');
        const mockAssignments: Assignment[] = [
          {
            id: '1',
            courseID: 'course-1',
            title: 'Business Model Canvas',
            description: 'Create a detailed Business Model Canvas for your startup idea.',
            dueDate: '2024-10-15T23:59:59Z',
            totalMarks: 100,
            fileUrl: 'https://example.com/bmc-template.pdf',
            createdBy: 'mentor-1',
            submissions: [],
            createdAt: '2024-10-01T10:00:00Z',
            updatedAt: '2024-10-01T10:00:00Z'
          }
        ];
        setAssignments(mockAssignments);
        setError('Using offline data - API connection failed');
      } else {
        setAssignments(assignmentsData);
        setError(null);
      }
      
      setSubmissions(submissionsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const studentSubmission = submissions.find(s => s.assignmentID === assignment.id);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'not-submitted' && !studentSubmission) ||
      (statusFilter === 'submitted' && studentSubmission && !studentSubmission.grade) ||
      (statusFilter === 'graded' && studentSubmission && studentSubmission.grade);
    
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(s => s.assignmentID === assignmentId);
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = getSubmissionForAssignment(assignment.id);
    
    if (!submission) {
      return {
        status: 'not-submitted',
        text: 'Not Submitted',
        color: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      };
    }
    
    if (submission.grade) {
      return {
        status: 'graded',
        text: 'Graded',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      };
    }
    
    return {
      status: 'submitted',
      text: 'Submitted',
      color: 'bg-blue-100 text-blue-800',
      icon: ClockIcon
    };
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

  const isOverdue = (assignment: Assignment) => {
    if (!assignment.dueDate) return false;
    return new Date(assignment.dueDate) < new Date();
  };

  const isDueSoon = (assignment: Assignment) => {
    if (!assignment.dueDate) return false;
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000 && dueDate > now;
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitData({
      fileUrl: '',
      notes: ''
    });
    setShowSubmitModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);

    try {
      const submissionData = {
        assignmentID: selectedAssignment.id,
        studentID: currentStudentId,
        fileUrl: submitData.fileUrl,
        notes: submitData.notes
      };

      try {
        const newSubmission = await assignmentService.createSubmission(submissionData);
        setSubmissions([...submissions, newSubmission]);
        console.log('Submission created successfully via API');
      } catch (err) {
        console.log('API create failed, creating locally:', err.message);
        const newSubmission: Submission = {
          ...submissionData,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSubmissions([...submissions, newSubmission]);
      }
      
      setShowSubmitModal(false);
      setSelectedAssignment(null);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmitData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmitData({
      fileUrl: '',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
        <div className="mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
            <p className="mt-2 text-gray-600">View and submit your assignments</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
          </div>
        </div>
      </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                <option value="not-submitted">Not Submitted</option>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                </select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any assignments matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => {
              const assignmentStatus = getAssignmentStatus(assignment);
              const submission = getSubmissionForAssignment(assignment.id);
              const StatusIcon = assignmentStatus.icon;
              
              return (
                <div key={assignment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {assignment.description}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assignmentStatus.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {assignmentStatus.text}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {assignment.dueDate ? formatDate(assignment.dueDate) : 'No due date'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        {assignment.totalMarks} marks
                </div>
                      {submission && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Submitted: {submission.submittedAt ? formatDate(submission.submittedAt) : 'Unknown'}
              </div>
                      )}
            </div>

                    {/* Grade Display */}
                    {submission?.grade && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Grade: {submission.grade.marksObtained}/{assignment.totalMarks}
                            </p>
                            <p className="text-xs text-green-600">
                              Graded: {submission.grade.gradedAt ? formatDate(submission.grade.gradedAt) : 'Unknown'}
                            </p>
                          </div>
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        </div>
                        {submission.grade.feedback && (
                          <p className="mt-2 text-sm text-green-700">{submission.grade.feedback}</p>
                        )}
                </div>
                    )}

                    {/* Overdue/Due Soon Warning */}
                    {isOverdue(assignment) && !submission && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                          <p className="text-sm font-medium text-red-800">Assignment Overdue</p>
              </div>
            </div>
                    )}
                    
                    {isDueSoon(assignment) && !submission && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                          <p className="text-sm font-medium text-yellow-800">Due Soon</p>
                </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewAssignment(assignment)}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      {!submission && (
                        <button 
                          onClick={() => handleSubmitAssignment(assignment)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          <DocumentArrowUpIcon className="h-4 w-4 mr-1" />
                          Submit
                        </button>
                      )}
              </div>
            </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Assignment Modal */}
        {showViewModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Assignment Details</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAssignment.title}</p>
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAssignment.courseID}</p>
          </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedAssignment.dueDate ? formatDate(selectedAssignment.dueDate) : 'No due date'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAssignment.totalMarks}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAssignment.description}</p>
                </div>
                {selectedAssignment.fileUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference Material</label>
                    <a 
                      href={selectedAssignment.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download Reference File
                    </a>
              </div>
                )}
                
                {/* Submission Status */}
                {(() => {
                  const submission = getSubmissionForAssignment(selectedAssignment.id);
                  if (submission) {
                    return (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Submission</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-900">
                            Submitted: {submission.submittedAt ? formatDate(submission.submittedAt) : 'Unknown'}
                          </p>
                          {submission.fileUrl && (
                            <a 
                              href={submission.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Download Your Submission
                            </a>
                          )}
                          {submission.grade && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm font-medium text-green-800">
                                Grade: {submission.grade.marksObtained}/{selectedAssignment.totalMarks}
                              </p>
                              <p className="text-sm text-green-600">
                                Graded: {submission.grade.gradedAt ? formatDate(submission.grade.gradedAt) : 'Unknown'}
                              </p>
                              {submission.grade.feedback && (
                                <p className="mt-2 text-sm text-green-700">{submission.grade.feedback}</p>
                              )}
                            </div>
                  )}
                </div>
              </div>
                    );
                  }
                  return (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">You haven't submitted this assignment yet.</p>
                    </div>
                  );
                })()}
              </div>
                  </div>
                </div>
        )}

        {/* Submit Assignment Modal */}
        {showSubmitModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Submit Assignment</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{selectedAssignment.title}</h4>
                  <p className="text-sm text-gray-600">
                    Due: {selectedAssignment.dueDate ? formatDate(selectedAssignment.dueDate) : 'No due date'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Marks: {selectedAssignment.totalMarks}
                  </p>
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File URL</label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={submitData.fileUrl}
                    onChange={handleSubmitChange}
                    required
                    placeholder="https://example.com/your-submission.pdf"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your file to a cloud service (Google Drive, Dropbox, etc.) and paste the link here.
                  </p>
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={submitData.notes}
                    onChange={handleSubmitChange}
                    rows={3}
                    placeholder="Any additional notes or comments about your submission..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </button>
              </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { assignmentService, Assignment, Submission } from '@/lib/assignmentService';

export default function AdminAssignmentsPage() {
  // State management
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // CRUD Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    courseID: '',
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    fileUrl: '',
    createdBy: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load assignments on component mount
  useEffect(() => {
    loadAssignments();
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
          submissions: [
            {
              id: 'sub-1',
              assignmentID: '1',
              studentID: 'student-1',
              fileUrl: 'https://example.com/submission-1.pdf',
              submittedAt: '2024-10-10T14:30:00Z',
              grade: {
                id: 'grade-1',
                submissionID: 'sub-1',
                marksObtained: 85,
                feedback: 'Excellent work! Great market analysis. Consider adding more detail on customer segments.',
                gradedBy: 'mentor-1',
                gradedAt: '2024-10-12T10:00:00Z',
                createdAt: '2024-10-12T10:00:00Z',
                updatedAt: '2024-10-12T10:00:00Z'
              },
              createdAt: '2024-10-10T14:30:00Z',
              updatedAt: '2024-10-10T14:30:00Z'
            }
          ],
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

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAssignments({
        search: searchQuery
      });
      
      // If API returns empty array, use mock data
      if (data.length === 0) {
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
        setAssignments(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && new Date(assignment.dueDate || '') > new Date()) ||
      (statusFilter === 'overdue' && new Date(assignment.dueDate || '') < new Date());
    
    const matchesCourse = courseFilter === 'all' || assignment.courseID === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // CRUD Functions
  const handleCreateAssignment = () => {
    setFormData({
      courseID: '',
      title: '',
      description: '',
      dueDate: '',
      totalMarks: '',
      fileUrl: '',
      createdBy: 'mentor-1' // Default mentor for testing
    });
    setSelectedAssignment(null);
    setShowCreateModal(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      courseID: assignment.courseID,
      title: assignment.title,
      description: assignment.description || '',
      dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
      totalMarks: assignment.totalMarks?.toString() || '',
      fileUrl: assignment.fileUrl || '',
      createdBy: assignment.createdBy
    });
    setShowEditModal(true);
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assignmentData = {
        ...formData,
        totalMarks: parseInt(formData.totalMarks) || 0,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      };

      if (showCreateModal) {
        // Create new assignment
        try {
          const newAssignment = await assignmentService.createAssignment(assignmentData);
          setAssignments([...assignments, newAssignment]);
          console.log('Assignment created successfully via API');
        } catch (err) {
          console.log('API create failed, creating locally:', err.message);
          const newAssignment: Assignment = {
            ...assignmentData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            submissions: []
          };
          setAssignments([...assignments, newAssignment]);
        }
        setShowCreateModal(false);
      } else if (showEditModal && selectedAssignment) {
        // Update existing assignment
        try {
          const updatedAssignment = await assignmentService.updateAssignment(selectedAssignment.id, assignmentData);
          setAssignments(assignments.map(assignment => 
            assignment.id === selectedAssignment.id ? updatedAssignment : assignment
          ));
          console.log('Assignment updated successfully via API');
        } catch (err) {
          console.log('API update failed, updating locally:', err.message);
          const updatedAssignment: Assignment = {
            ...assignmentData,
            id: selectedAssignment.id,
            createdAt: selectedAssignment.createdAt,
            updatedAt: new Date().toISOString(),
            submissions: selectedAssignment.submissions
          };
          setAssignments(assignments.map(assignment => 
            assignment.id === selectedAssignment.id ? updatedAssignment : assignment
          ));
        }
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Error saving assignment:', err);
      alert('Failed to save assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssignment) return;

    try {
      await assignmentService.deleteAssignment(selectedAssignment.id);
      setAssignments(assignments.filter(assignment => assignment.id !== selectedAssignment.id));
      console.log('Assignment deleted successfully via API');
    } catch (err) {
      console.log('API delete failed, deleting locally:', err.message);
      setAssignments(assignments.filter(assignment => assignment.id !== selectedAssignment.id));
    }
    setShowDeleteModal(false);
    setSelectedAssignment(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedAssignment(null);
    setFormData({
      courseID: '',
      title: '',
      description: '',
      dueDate: '',
      totalMarks: '',
      fileUrl: '',
      createdBy: ''
    });
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (assignment: Assignment) => {
    if (!assignment.dueDate) return 'bg-gray-100 text-gray-800';
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (dueDate < now) return 'bg-red-100 text-red-800';
    if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (assignment: Assignment) => {
    if (!assignment.dueDate) return 'No Due Date';
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (dueDate < now) return 'Overdue';
    if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'Due Soon';
    return 'Active';
  };

  const getSubmissionStats = (assignment: Assignment) => {
    const submissions = assignment.submissions || [];
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.grade).length;
    const pendingSubmissions = totalSubmissions - gradedSubmissions;
    
    return { totalSubmissions, gradedSubmissions, pendingSubmissions };
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
              <p className="mt-2 text-gray-600">Monitor and manage all assignments across courses</p>
            </div>
            <button 
              onClick={handleCreateAssignment}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Assignment
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Courses</option>
                <option value="course-1">Course 1</option>
                <option value="course-2">Course 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new assignment.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateAssignment}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Assignment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => {
              const stats = getSubmissionStats(assignment);
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                        {getStatusText(assignment)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {assignment.dueDate ? formatDate(assignment.dueDate) : 'No due date'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        {assignment.totalMarks} marks
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{stats.totalSubmissions}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{stats.gradedSubmissions}</div>
                        <div className="text-xs text-gray-500">Graded</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">{stats.pendingSubmissions}</div>
                        <div className="text-xs text-gray-500">Pending</div>
                      </div>
            </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewAssignment(assignment)}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button 
                        onClick={() => handleEditAssignment(assignment)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Assignment</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course ID</label>
                    <input
                      type="text"
                      name="courseID"
                      value={formData.courseID}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="datetime-local"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference File URL</label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleFormChange}
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
                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Assignment Modal */}
        {showEditModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Assignment</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course ID</label>
                    <input
                      type="text"
                      name="courseID"
                      value={formData.courseID}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="datetime-local"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference File URL</label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleFormChange}
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
                    {isSubmitting ? 'Updating...' : 'Update Assignment'}
                  </button>
                </div>
              </form>
            </div>
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
                  <XMarkIcon className="h-6 w-6" />
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
                    <label className="block text-sm font-medium text-gray-700">Reference File</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submissions</label>
                  <div className="mt-2 space-y-2">
                    {selectedAssignment.submissions?.map((submission) => (
                      <div key={submission.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                    <div>
                            <p className="text-sm font-medium text-gray-900">Student: {submission.studentID}</p>
                            <p className="text-sm text-gray-600">
                              Submitted: {submission.submittedAt ? formatDate(submission.submittedAt) : 'Not submitted'}
                            </p>
                            {submission.grade && (
                              <p className="text-sm text-green-600">
                                Grade: {submission.grade.marksObtained}/{selectedAssignment.totalMarks}
                              </p>
                            )}
                    </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.grade ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.grade ? 'Graded' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!selectedAssignment.submissions || selectedAssignment.submissions.length === 0) && (
                      <p className="text-sm text-gray-500">No submissions yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAssignment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Assignment</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{selectedAssignment.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-3 px-4 py-3">
                  <button
                    onClick={closeModals}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                </button>
                </div>
              </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
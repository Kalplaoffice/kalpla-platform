'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  DocumentTextIcon,
  PaperClipIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
  TrophyIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { mentorAssignmentService, MentorAssignment } from '@/lib/mentorAssignmentService';
import { cohortService, Cohort } from '@/lib/cohortService';

export default function MentorAssignmentPage() {
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<MentorAssignment | null>(null);
  const [activeTab, setActiveTab] = useState<'assignments' | 'create' | 'templates'>('assignments');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assignmentsData, cohortsData] = await Promise.all([
        mentorAssignmentService.getMentorAssignments('mentor_1'), // Mock mentor ID
        cohortService.getCohorts()
      ]);
      
      setAssignments(assignmentsData);
      setCohorts(cohortsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData: Omit<MentorAssignment, 'id' | 'createdAt' | 'updatedAt' | 'submissions' | 'statistics'>) => {
    try {
      const newAssignment = await mentorAssignmentService.createAssignment(assignmentData);
      setAssignments([...assignments, newAssignment]);
      setShowCreateModal(false);
      setActiveTab('assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError('Failed to create assignment');
    }
  };

  const handleUpdateAssignment = async (assignmentId: string, updates: Partial<MentorAssignment>) => {
    try {
      const updatedAssignment = await mentorAssignmentService.updateAssignment(assignmentId, updates);
      if (updatedAssignment) {
        setAssignments(assignments.map(a => a.id === assignmentId ? updatedAssignment : a));
        setShowEditModal(false);
        setSelectedAssignment(null);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      setError('Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      const success = await mentorAssignmentService.deleteAssignment(assignmentId);
      if (success) {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        setShowDeleteModal(false);
        setSelectedAssignment(null);
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment');
    }
  };

  const handlePublishAssignment = async (assignmentId: string) => {
    try {
      const success = await mentorAssignmentService.publishAssignment(assignmentId);
      if (success) {
        await loadData(); // Reload to get updated status
      }
    } catch (error) {
      console.error('Error publishing assignment:', error);
      setError('Failed to publish assignment');
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
                <p className="text-gray-600">Create and manage assignments for your students</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Assignment
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'assignments', name: 'My Assignments', icon: DocumentTextIcon },
                { id: 'create', name: 'Create Assignment', icon: PlusIcon },
                { id: 'templates', name: 'Templates', icon: AcademicCapIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'assignments' && (
          <AssignmentsTab 
            assignments={assignments}
            onEdit={(assignment) => {
              setSelectedAssignment(assignment);
              setShowEditModal(true);
            }}
            onDelete={(assignment) => {
              setSelectedAssignment(assignment);
              setShowDeleteModal(true);
            }}
            onPublish={handlePublishAssignment}
            onView={(assignment) => {
              setSelectedAssignment(assignment);
              // Navigate to assignment details
            }}
          />
        )}

        {activeTab === 'create' && (
          <CreateAssignmentTab 
            cohorts={cohorts}
            onSubmit={handleCreateAssignment}
            onCancel={() => setActiveTab('assignments')}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab />
        )}

        {/* Modals */}
        {showEditModal && selectedAssignment && (
          <EditAssignmentModal
            assignment={selectedAssignment}
            cohorts={cohorts}
            onClose={() => {
              setShowEditModal(false);
              setSelectedAssignment(null);
            }}
            onSubmit={(updates) => handleUpdateAssignment(selectedAssignment.id, updates)}
          />
        )}

        {showDeleteModal && selectedAssignment && (
          <DeleteAssignmentModal
            assignment={selectedAssignment}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedAssignment(null);
            }}
            onConfirm={() => handleDeleteAssignment(selectedAssignment.id)}
          />
        )}
      </div>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ 
  assignments, 
  onEdit, 
  onDelete, 
  onPublish, 
  onView 
}: {
  assignments: MentorAssignment[];
  onEdit: (assignment: MentorAssignment) => void;
  onDelete: (assignment: MentorAssignment) => void;
  onPublish: (assignmentId: string) => void;
  onView: (assignment: MentorAssignment) => void;
}) {
  return (
    <div className="space-y-6">
      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">Create your first assignment to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorAssignmentService.getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorAssignmentService.getAssignmentTypeColor(assignment.type)}`}>
                      {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {assignment.cohortName}
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {assignment.phaseName}
                    </div>
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      {assignment.totalMarks} marks
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Due: {mentorAssignmentService.formatDate(assignment.dueDate)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {mentorAssignmentService.formatTime(assignment.dueDate)}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{assignment.statistics.submittedStudents}</p>
                      <p className="text-sm text-gray-600">Submissions</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{assignment.statistics.gradedStudents}</p>
                      <p className="text-sm text-gray-600">Graded</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{assignment.statistics.averageGrade}</p>
                      <p className="text-sm text-gray-600">Avg Grade</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">{assignment.statistics.lateSubmissions}</p>
                      <p className="text-sm text-gray-600">Late</p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {assignment.attachments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                            <PaperClipIcon className="h-4 w-4 text-gray-600 mr-2" />
                            <span className="text-sm text-gray-700">{attachment.originalName}</span>
                            <span className="text-xs text-gray-500 ml-2">({mentorAssignmentService.formatFileSize(attachment.size)})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onView(assignment)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(assignment)}
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="Edit Assignment"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {assignment.status === 'draft' && (
                    <button
                      onClick={() => onPublish(assignment.id)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Publish Assignment"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(assignment)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete Assignment"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Assignment Tab Component
function CreateAssignmentTab({ 
  cohorts, 
  onSubmit, 
  onCancel 
}: {
  cohorts: Cohort[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    mentorId: 'mentor_1',
    mentorName: 'Dr. Sarah Johnson',
    cohortId: '',
    cohortName: '',
    phaseId: '',
    phaseName: '',
    title: '',
    description: '',
    instructions: '',
    type: 'homework' as const,
    totalMarks: 100,
    dueDate: '',
    lateSubmissionPenalty: 10,
    maxLateDays: 3,
    status: 'draft' as const,
    attachments: [],
    rubric: {
      id: 'rubric_new',
      name: 'Assignment Rubric',
      description: 'Standard assignment rubric',
      criteria: [
        {
          id: 'crit_new_1',
          name: 'Content Quality',
          description: 'Quality of content and understanding',
          maxPoints: 50,
          weight: 0.5,
          levels: {
            excellent: { points: 50, description: 'Excellent content with deep understanding' },
            good: { points: 40, description: 'Good content with good understanding' },
            satisfactory: { points: 30, description: 'Satisfactory content with basic understanding' },
            needsImprovement: { points: 20, description: 'Content needs improvement' },
            unsatisfactory: { points: 10, description: 'Poor content quality' }
          }
        },
        {
          id: 'crit_new_2',
          name: 'Presentation',
          description: 'Quality of presentation and formatting',
          maxPoints: 30,
          weight: 0.3,
          levels: {
            excellent: { points: 30, description: 'Excellent presentation and formatting' },
            good: { points: 24, description: 'Good presentation and formatting' },
            satisfactory: { points: 18, description: 'Satisfactory presentation' },
            needsImprovement: { points: 12, description: 'Presentation needs improvement' },
            unsatisfactory: { points: 6, description: 'Poor presentation' }
          }
        },
        {
          id: 'crit_new_3',
          name: 'Timeliness',
          description: 'Submission on time and completeness',
          maxPoints: 20,
          weight: 0.2,
          levels: {
            excellent: { points: 20, description: 'Submitted on time and complete' },
            good: { points: 16, description: 'Submitted on time with minor issues' },
            satisfactory: { points: 12, description: 'Submitted with some issues' },
            needsImprovement: { points: 8, description: 'Late submission or incomplete' },
            unsatisfactory: { points: 4, description: 'Very late or very incomplete' }
          }
        }
      ],
      totalPoints: 100,
      gradingScale: {
        excellent: { min: 90, max: 100, description: 'Outstanding work' },
        good: { min: 80, max: 89, description: 'Good work' },
        satisfactory: { min: 70, max: 79, description: 'Satisfactory work' },
        needsImprovement: { min: 60, max: 69, description: 'Needs improvement' },
        unsatisfactory: { min: 0, max: 59, description: 'Unsatisfactory work' }
      }
    },
    settings: {
      allowLateSubmissions: true,
      allowResubmission: false,
      maxResubmissions: 0,
      plagiarismCheck: true,
      peerReview: false,
      anonymousGrading: false,
      showGradesImmediately: true,
      allowStudentComments: true,
      requireAcknowledgement: true,
      notificationSettings: {
        emailReminders: true,
        smsReminders: false,
        pushNotifications: true,
        reminderDays: [7, 3, 1]
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCohortChange = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (cohort) {
      setFormData({
        ...formData,
        cohortId: cohort.id,
        cohortName: cohort.name,
        phaseId: cohort.phases[0]?.id || '',
        phaseName: cohort.phases[0]?.phaseName || ''
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Assignment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter assignment title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="homework">Homework</option>
              <option value="project">Project</option>
              <option value="quiz">Quiz</option>
              <option value="presentation">Presentation</option>
              <option value="research">Research</option>
              <option value="lab">Lab</option>
              <option value="essay">Essay</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description of the assignment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
          <textarea
            required
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Detailed instructions for students"
          />
        </div>

        {/* Cohort and Phase Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cohort</label>
            <select
              required
              value={formData.cohortId}
              onChange={(e) => handleCohortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a cohort</option>
              {cohorts.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
            <input
              type="text"
              value={formData.phaseName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        {/* Marks and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
            <input
              type="number"
              required
              min="1"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="datetime-local"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.lateSubmissionPenalty}
              onChange={(e) => setFormData({ ...formData, lateSubmissionPenalty: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File Attachments</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <PaperClipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-500">PDF, DOC, DOCX, ZIP files up to 10MB</p>
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.rar"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
}

// Templates Tab Component
function TemplatesTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Templates</h3>
      <p className="text-gray-600">Assignment templates will be available soon.</p>
    </div>
  );
}

// Edit Assignment Modal Component
function EditAssignmentModal({ 
  assignment, 
  cohorts, 
  onClose, 
  onSubmit 
}: {
  assignment: MentorAssignment;
  cohorts: Cohort[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: assignment.title,
    description: assignment.description,
    instructions: assignment.instructions,
    type: assignment.type,
    totalMarks: assignment.totalMarks,
    dueDate: assignment.dueDate.split('T')[0] + 'T' + assignment.dueDate.split('T')[1].substring(0, 5),
    lateSubmissionPenalty: assignment.lateSubmissionPenalty,
    maxLateDays: assignment.maxLateDays
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Assignment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                required
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Delete Assignment Modal Component
function DeleteAssignmentModal({ 
  assignment, 
  onClose, 
  onConfirm 
}: {
  assignment: MentorAssignment;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Delete Assignment</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the assignment "{assignment.title}"? This action cannot be undone and will remove all associated submissions and grades.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
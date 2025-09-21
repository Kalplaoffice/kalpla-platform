'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

import { 
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';


interface KSMPPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  duration: string; // e.g., "4 weeks"
  objectives: string[];
  assignments: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
  }>;
  assignedMentor: string;
  mentorName: string;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
}

interface KSMPCohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  maxStudents: number;
  currentPhase: number;
  totalPhases: number;
  status: 'active' | 'completed' | 'upcoming';
  assignedMentors: Array<{
    mentorId: string;
    mentorName: string;
    phases: number[];
  }>;
  studentProgress: Array<{
    studentId: string;
    studentName: string;
    currentPhase: number;
    completedAssignments: number;
    totalAssignments: number;
    averageGrade: number;
  }>;
  createdAt: string;
}

interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  phaseNumber: number;
  submittedDate: string;
  status: 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
}

export default function KSMPManagementPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [activeTab, setActiveTab] = useState<'phases' | 'cohorts' | 'assignments'>('phases');
  const [phases, setPhases] = useState<KSMPPhase[]>([]);
  const [cohorts, setCohorts] = useState<KSMPCohort[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<KSMPPhase | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPhases: KSMPPhase[] = [
      {
        id: '1',
        phaseNumber: 1,
        title: 'Business Idea & Market Research',
        description: 'Students will develop their business idea and conduct comprehensive market research',
        duration: '4 weeks',
        objectives: [
          'Define a clear business concept',
          'Conduct market analysis',
          'Identify target customers',
          'Analyze competitive landscape'
        ],
        assignments: [
          {
            id: 'a1',
            title: 'Business Idea Pitch',
            description: 'Create a 5-minute pitch for your business idea',
            dueDate: '2024-02-15',
            maxMarks: 100
          },
          {
            id: 'a2',
            title: 'Market Research Report',
            description: 'Comprehensive market research analysis',
            dueDate: '2024-02-22',
            maxMarks: 100
          }
        ],
        assignedMentor: 'mentor1',
        mentorName: 'John Doe',
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: '2',
        phaseNumber: 2,
        title: 'Business Model & Strategy',
        description: 'Develop business model canvas and strategic planning',
        duration: '4 weeks',
        objectives: [
          'Create business model canvas',
          'Define value proposition',
          'Develop revenue streams',
          'Plan go-to-market strategy'
        ],
        assignments: [
          {
            id: 'a3',
            title: 'Business Model Canvas',
            description: 'Complete business model canvas for your venture',
            dueDate: '2024-03-15',
            maxMarks: 100
          },
          {
            id: 'a4',
            title: 'Strategic Plan',
            description: 'Develop comprehensive strategic plan',
            dueDate: '2024-03-22',
            maxMarks: 100
          }
        ],
        assignedMentor: 'mentor2',
        mentorName: 'Jane Smith',
        status: 'active',
        startDate: '2024-02-16',
        endDate: '2024-03-15'
      },
      {
        id: '3',
        phaseNumber: 3,
        title: 'Financial Planning & Funding',
        description: 'Financial modeling, budgeting, and funding strategies',
        duration: '4 weeks',
        objectives: [
          'Create financial projections',
          'Develop funding strategy',
          'Prepare investor pitch',
          'Understand financial metrics'
        ],
        assignments: [
          {
            id: 'a5',
            title: 'Financial Model',
            description: 'Build comprehensive financial model',
            dueDate: '2024-04-15',
            maxMarks: 100
          },
          {
            id: 'a6',
            title: 'Investor Pitch Deck',
            description: 'Create investor presentation',
            dueDate: '2024-04-22',
            maxMarks: 100
          }
        ],
        assignedMentor: 'mentor3',
        mentorName: 'Mike Johnson',
        status: 'upcoming',
        startDate: '2024-03-16',
        endDate: '2024-04-15'
      }
    ];

    const mockCohorts: KSMPCohort[] = [
      {
        id: '1',
        name: 'KSMP Cohort 2024-01',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        enrolledStudents: 25,
        maxStudents: 30,
        currentPhase: 2,
        totalPhases: 12,
        status: 'active',
        assignedMentors: [
          { mentorId: 'mentor1', mentorName: 'John Doe', phases: [1, 2, 3] },
          { mentorId: 'mentor2', mentorName: 'Jane Smith', phases: [4, 5, 6] },
          { mentorId: 'mentor3', mentorName: 'Mike Johnson', phases: [7, 8, 9] }
        ],
        studentProgress: [
          {
            studentId: 's1',
            studentName: 'Rahul Sharma',
            currentPhase: 2,
            completedAssignments: 3,
            totalAssignments: 4,
            averageGrade: 85
          },
          {
            studentId: 's2',
            studentName: 'Priya Patel',
            currentPhase: 2,
            completedAssignments: 4,
            totalAssignments: 4,
            averageGrade: 92
          }
        ],
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    const mockSubmissions: AssignmentSubmission[] = [
      {
        id: 'sub1',
        studentId: 's1',
        studentName: 'Rahul Sharma',
        assignmentId: 'a1',
        assignmentTitle: 'Business Idea Pitch',
        phaseNumber: 1,
        submittedDate: '2024-02-14T10:30:00Z',
        status: 'graded',
        grade: 85,
        feedback: 'Good pitch with clear value proposition. Consider adding more market validation data.'
      },
      {
        id: 'sub2',
        studentId: 's2',
        studentName: 'Priya Patel',
        assignmentId: 'a1',
        assignmentTitle: 'Business Idea Pitch',
        phaseNumber: 1,
        submittedDate: '2024-02-15T09:15:00Z',
        status: 'graded',
        grade: 92,
        feedback: 'Excellent pitch with strong market research backing. Well-structured presentation.'
      },
      {
        id: 'sub3',
        studentId: 's1',
        studentName: 'Rahul Sharma',
        assignmentId: 'a3',
        assignmentTitle: 'Business Model Canvas',
        phaseNumber: 2,
        submittedDate: '2024-03-14T16:45:00Z',
        status: 'submitted',
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPhases(mockPhases);
      setCohorts(mockCohorts);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-yellow-600 bg-yellow-100';
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
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
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'upcoming':
        return <ClockIcon className="h-4 w-4" />;
      case 'submitted':
        return <BookOpenIcon className="h-4 w-4" />;
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'late':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KSMP Management</h1>
            <p className="text-gray-600">Manage KSMP curriculum phases, cohorts, and assignments</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Reports
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Phase
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Phases</p>
                <p className="text-2xl font-semibold text-gray-900">{phases.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Cohorts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {cohorts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {cohorts.reduce((sum, cohort) => sum + cohort.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Submissions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('phases')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'phases'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Curriculum Phases ({phases.length})
              </button>
              <button
                onClick={() => setActiveTab('cohorts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cohorts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cohorts ({cohorts.length})
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assignment Submissions ({submissions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Phases Tab */}
            {activeTab === 'phases' && (
              <div className="space-y-4">
                {phases.map((phase) => (
                  <div key={phase.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Phase {phase.phaseNumber}: {phase.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                        {getStatusIcon(phase.status)}
                        <span className="ml-1">{phase.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {phase.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {phase.mentorName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpenIcon className="h-4 w-4 mr-2" />
                        {phase.assignments.length} assignments
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {phase.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {phase.assignments.length} assignments assigned
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPhase(phase);
                            setShowPhaseModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cohorts Tab */}
            {activeTab === 'cohorts' && (
              <div className="space-y-4">
                {cohorts.map((cohort) => (
                  <div key={cohort.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Phase {cohort.currentPhase} of {cohort.totalPhases}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                        {getStatusIcon(cohort.status)}
                        <span className="ml-1">{cohort.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {cohort.enrolledStudents}/{cohort.maxStudents} students
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        {cohort.assignedMentors.length} mentors
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        {cohort.totalPhases} phases
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Student Progress</h4>
                      <div className="space-y-2">
                        {cohort.studentProgress.map((student) => (
                          <div key={student.studentId} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                            <span className="text-gray-900">{student.studentName}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-600">Phase {student.currentPhase}</span>
                              <span className="text-gray-600">{student.completedAssignments}/{student.totalAssignments} assignments</span>
                              <span className="text-gray-600">Avg: {student.averageGrade}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(cohort.createdAt)}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phase
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{submission.assignmentTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Phase {submission.phaseNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(submission.submittedDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            <span className="ml-1">{submission.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {submission.grade ? `${submission.grade}/100` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {submission.status === 'submitted' && (
                              <button className="text-green-600 hover:text-green-900">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Phase Detail Modal */}
        {showPhaseModal && selectedPhase && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowPhaseModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Phase {selectedPhase.phaseNumber}: {selectedPhase.title}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Phase Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <span className="ml-2 text-gray-900">{selectedPhase.duration}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Assigned Mentor:</span>
                          <span className="ml-2 text-gray-900">{selectedPhase.mentorName}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPhase.status)}`}>
                            {selectedPhase.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Start Date:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedPhase.startDate)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">End Date:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedPhase.endDate)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Assignments:</span>
                          <span className="ml-2 text-gray-900">{selectedPhase.assignments.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Description</h4>
                      <p className="text-sm text-gray-900">{selectedPhase.description}</p>
                    </div>

                    {/* Objectives */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Learning Objectives</h4>
                      <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                        {selectedPhase.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Assignments */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Assignments</h4>
                      <div className="space-y-3">
                        {selectedPhase.assignments.map((assignment) => (
                          <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">{assignment.title}</h5>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Due: {formatDate(assignment.dueDate)}</span>
                              <span>Max Marks: {assignment.maxMarks}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowPhaseModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Edit Phase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

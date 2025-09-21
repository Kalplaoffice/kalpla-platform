'use client';

import { useState, useEffect } from 'react';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface StudentGrade {
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignments: Array<{
    assignmentId: string;
    assignmentTitle: string;
    course: string;
    phase?: number;
    submittedAt: string;
    dueDate: string;
    maxMarks: number;
    grade: number;
    percentage: number;
    feedback: string;
    gradedAt: string;
    status: 'graded' | 'pending' | 'overdue';
  }>;
  averageGrade: number;
  averagePercentage: number;
  totalAssignments: number;
  gradedAssignments: number;
}

interface PhaseGrade {
  phaseNumber: number;
  phaseTitle: string;
  students: StudentGrade[];
  averageGrade: number;
  totalAssignments: number;
  gradedAssignments: number;
}

export default function MentorGradebook() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is mentor
  const isMentor = hasRole('Mentor');
  const [phaseGrades, setPhaseGrades] = useState<PhaseGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<PhaseGrade | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPhaseGrades: PhaseGrade[] = [
      {
        phaseNumber: 1,
        phaseTitle: 'Business Idea & Market Research',
        averageGrade: 87.5,
        totalAssignments: 2,
        gradedAssignments: 2,
        students: [
          {
            studentId: 's1',
            studentName: 'Rahul Sharma',
            studentEmail: 'rahul.sharma@email.com',
            averageGrade: 90,
            averagePercentage: 90,
            totalAssignments: 2,
            gradedAssignments: 2,
            assignments: [
              {
                assignmentId: 'a1',
                assignmentTitle: 'Business Idea Pitch',
                course: 'KSMP Phase 1',
                phase: 1,
                submittedAt: '2024-02-14T10:30:00Z',
                dueDate: '2024-02-15T23:59:00Z',
                maxMarks: 100,
                grade: 92,
                percentage: 92,
                feedback: 'Excellent pitch with clear value proposition and market validation.',
                gradedAt: '2024-02-15T09:30:00Z',
                status: 'graded'
              },
              {
                assignmentId: 'a2',
                assignmentTitle: 'Market Research Report',
                course: 'KSMP Phase 1',
                phase: 1,
                submittedAt: '2024-02-21T14:45:00Z',
                dueDate: '2024-02-22T23:59:00Z',
                maxMarks: 100,
                grade: 88,
                percentage: 88,
                feedback: 'Good research with solid data. Consider adding more competitor analysis.',
                gradedAt: '2024-02-22T11:15:00Z',
                status: 'graded'
              }
            ]
          },
          {
            studentId: 's2',
            studentName: 'Priya Patel',
            studentEmail: 'priya.patel@email.com',
            averageGrade: 85,
            averagePercentage: 85,
            totalAssignments: 2,
            gradedAssignments: 2,
            assignments: [
              {
                assignmentId: 'a1',
                assignmentTitle: 'Business Idea Pitch',
                course: 'KSMP Phase 1',
                phase: 1,
                submittedAt: '2024-02-15T09:15:00Z',
                dueDate: '2024-02-15T23:59:00Z',
                maxMarks: 100,
                grade: 85,
                percentage: 85,
                feedback: 'Good pitch with clear business concept. Consider strengthening market validation.',
                gradedAt: '2024-02-15T10:30:00Z',
                status: 'graded'
              },
              {
                assignmentId: 'a2',
                assignmentTitle: 'Market Research Report',
                course: 'KSMP Phase 1',
                phase: 1,
                submittedAt: '2024-02-22T16:20:00Z',
                dueDate: '2024-02-22T23:59:00Z',
                maxMarks: 100,
                grade: 85,
                percentage: 85,
                feedback: 'Solid market research with good data collection. Analysis could be deeper.',
                gradedAt: '2024-02-23T08:45:00Z',
                status: 'graded'
              }
            ]
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Business Model & Strategy',
        averageGrade: 88.3,
        totalAssignments: 2,
        gradedAssignments: 2,
        students: [
          {
            studentId: 's1',
            studentName: 'Rahul Sharma',
            studentEmail: 'rahul.sharma@email.com',
            averageGrade: 90,
            averagePercentage: 90,
            totalAssignments: 2,
            gradedAssignments: 2,
            assignments: [
              {
                assignmentId: 'a3',
                assignmentTitle: 'Business Model Canvas',
                course: 'KSMP Phase 2',
                phase: 2,
                submittedAt: '2024-03-14T11:30:00Z',
                dueDate: '2024-03-15T23:59:00Z',
                maxMarks: 100,
                grade: 90,
                percentage: 90,
                feedback: 'Well-structured business model with clear value proposition.',
                gradedAt: '2024-03-16T09:15:00Z',
                status: 'graded'
              },
              {
                assignmentId: 'a4',
                assignmentTitle: 'Strategic Plan',
                course: 'KSMP Phase 2',
                phase: 2,
                submittedAt: '2024-03-21T15:45:00Z',
                dueDate: '2024-03-22T23:59:00Z',
                maxMarks: 100,
                grade: 90,
                percentage: 90,
                feedback: 'Excellent strategic thinking with clear implementation timeline.',
                gradedAt: '2024-03-23T10:30:00Z',
                status: 'graded'
              }
            ]
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: 'Financial Planning & Funding',
        averageGrade: 0,
        totalAssignments: 2,
        gradedAssignments: 1,
        students: [
          {
            studentId: 's1',
            studentName: 'Rahul Sharma',
            studentEmail: 'rahul.sharma@email.com',
            averageGrade: 88,
            averagePercentage: 88,
            totalAssignments: 2,
            gradedAssignments: 1,
            assignments: [
              {
                assignmentId: 'a5',
                assignmentTitle: 'Financial Model',
                course: 'KSMP Phase 3',
                phase: 3,
                submittedAt: '2024-04-14T13:20:00Z',
                dueDate: '2024-04-15T23:59:00Z',
                maxMarks: 100,
                grade: 88,
                percentage: 88,
                feedback: 'Good financial model with realistic projections. Consider adding sensitivity analysis.',
                gradedAt: '2024-04-16T14:30:00Z',
                status: 'graded'
              },
              {
                assignmentId: 'a6',
                assignmentTitle: 'Investor Pitch Deck',
                course: 'KSMP Phase 3',
                phase: 3,
                submittedAt: '2024-04-21T10:15:00Z',
                dueDate: '2024-04-22T23:59:00Z',
                maxMarks: 100,
                grade: 0,
                percentage: 0,
                feedback: '',
                gradedAt: '',
                status: 'pending'
              }
            ]
          }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPhaseGrades(mockPhaseGrades);
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

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    if (grade >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const exportGradebook = () => {
    // TODO: Implement gradebook export functionality
    console.log('Exporting gradebook...');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gradebook</h1>
            <p className="text-gray-600">View and manage student grades across KSMP phases</p>
          </div>
          <button
            onClick={exportGradebook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Gradebook
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Phases</p>
                <p className="text-2xl font-semibold text-gray-900">{phaseGrades.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phaseGrades.reduce((sum, phase) => sum + phase.students.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phaseGrades.reduce((sum, phase) => sum + phase.totalAssignments, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Grade</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phaseGrades.length > 0 
                    ? (phaseGrades.reduce((sum, phase) => sum + phase.averageGrade, 0) / phaseGrades.length).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Grades */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Phase-wise Grades</h2>
            <div className="space-y-4">
              {phaseGrades.map((phase) => (
                <div key={phase.phaseNumber} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-md font-semibold text-gray-900">
                        Phase {phase.phaseNumber}: {phase.phaseTitle}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{phase.students.length} students</span>
                        <span>{phase.gradedAssignments}/{phase.totalAssignments} assignments graded</span>
                        <span>Average: {phase.averageGrade.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(phase.averageGrade)}`}>
                        {phase.averageGrade.toFixed(1)}%
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPhase(phase);
                          setShowPhaseModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.students.map((student) => (
                      <div key={student.studentId} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{student.studentName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.averagePercentage)}`}>
                            {student.averagePercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>{student.gradedAssignments}/{student.totalAssignments} assignments graded</p>
                          <p>Average: {student.averageGrade.toFixed(1)}%</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowStudentModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2"
                        >
                          View Grades
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                    Phase {selectedPhase.phaseNumber}: {selectedPhase.phaseTitle}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Phase Stats */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedPhase.students.length}</p>
                          <p className="text-sm text-gray-600">Students</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedPhase.totalAssignments}</p>
                          <p className="text-sm text-gray-600">Total Assignments</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedPhase.gradedAssignments}</p>
                          <p className="text-sm text-gray-600">Graded</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedPhase.averageGrade.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Average Grade</p>
                        </div>
                      </div>
                    </div>

                    {/* Student Grades Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Assignments
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Average Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPhase.students.map((student) => (
                            <tr key={student.studentId}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                                  <div className="text-sm text-gray-500">{student.studentEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {student.gradedAssignments}/{student.totalAssignments} graded
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.averagePercentage)}`}>
                                  {student.averagePercentage.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowStudentModal(true);
                                    setShowPhaseModal(false);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View Grades
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowPhaseModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {showStudentModal && selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowStudentModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedStudent.studentName}</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-600">Email:</span>
                          <span className="ml-2 text-gray-900">{selectedStudent.studentEmail}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Average Grade:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(selectedStudent.averagePercentage)}`}>
                            {selectedStudent.averagePercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Total Assignments:</span>
                          <span className="ml-2 text-gray-900">{selectedStudent.totalAssignments}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Graded Assignments:</span>
                          <span className="ml-2 text-gray-900">{selectedStudent.gradedAssignments}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Assignment Grades</h4>
                      <div className="space-y-3">
                        {selectedStudent.assignments.map((assignment) => (
                          <div key={assignment.assignmentId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{assignment.assignmentTitle}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {getStatusIcon(assignment.status)}
                                <span className="ml-1">{assignment.status}</span>
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Course:</span>
                                <span className="ml-2">{assignment.course}</span>
                              </div>
                              <div>
                                <span className="font-medium">Max Marks:</span>
                                <span className="ml-2">{assignment.maxMarks}</span>
                              </div>
                              <div>
                                <span className="font-medium">Submitted:</span>
                                <span className="ml-2">{formatDate(assignment.submittedAt)}</span>
                              </div>
                              <div>
                                <span className="font-medium">Due:</span>
                                <span className="ml-2">{formatDate(assignment.dueDate)}</span>
                              </div>
                            </div>
                            {assignment.grade > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">Grade:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(assignment.percentage)}`}>
                                    {assignment.grade}/{assignment.maxMarks} ({assignment.percentage}%)
                                  </span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                  <p className="text-sm text-gray-700">{assignment.feedback}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Graded on {formatDate(assignment.gradedAt)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowStudentModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
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

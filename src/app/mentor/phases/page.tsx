'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlayIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface KSMPPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  duration: string;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  totalAssignments: number;
  gradedAssignments: number;
  pendingSubmissions: number;
  progress: number;
  curriculum: {
    id: string;
    title: string;
    type: 'video' | 'assignment' | 'live_session' | 'reading';
    duration: string;
    isCompleted: boolean;
    dueDate?: string;
  }[];
  liveSessions: {
    id: string;
    title: string;
    date: string;
    time: string;
    status: 'scheduled' | 'live' | 'completed';
    attendees: number;
  }[];
  assignments: {
    id: string;
    title: string;
    dueDate: string;
    totalSubmissions: number;
    gradedSubmissions: number;
    averageGrade: number;
  }[];
}

export default function MentorPhasesPage() {
  const { isMentor } = useRoleBasedAccess();
  const [phases, setPhases] = useState<KSMPPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<KSMPPhase | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPhases: KSMPPhase[] = [
      {
        id: 'p1',
        phaseNumber: 1,
        title: 'Business Idea & Market Research',
        description: 'Guide students through business ideation and comprehensive market research',
        duration: '4 weeks',
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 2,
        pendingSubmissions: 0,
        progress: 100,
        curriculum: [
          { id: 'c1', title: 'Introduction to Business Ideas', type: 'video', duration: '45 min', isCompleted: true },
          { id: 'c2', title: 'Market Research Fundamentals', type: 'video', duration: '60 min', isCompleted: true },
          { id: 'c3', title: 'Market Research Assignment', type: 'assignment', duration: '2 hours', isCompleted: true, dueDate: '2024-02-10' },
          { id: 'c4', title: 'Live Q&A Session', type: 'live_session', duration: '90 min', isCompleted: true }
        ],
        liveSessions: [
          { id: 'ls1', title: 'Market Research Workshop', date: '2024-01-20', time: '10:00 AM', status: 'completed', attendees: 24 },
          { id: 'ls2', title: 'Q&A Session', date: '2024-02-05', time: '2:00 PM', status: 'completed', attendees: 23 }
        ],
        assignments: [
          { id: 'a1', title: 'Market Research Report', dueDate: '2024-02-10', totalSubmissions: 25, gradedSubmissions: 25, averageGrade: 87 },
          { id: 'a2', title: 'Business Idea Pitch', dueDate: '2024-02-15', totalSubmissions: 25, gradedSubmissions: 25, averageGrade: 92 }
        ]
      },
      {
        id: 'p2',
        phaseNumber: 2,
        title: 'Business Model & Strategy',
        description: 'Help students develop comprehensive business models and strategic plans',
        duration: '4 weeks',
        status: 'completed',
        startDate: '2024-02-16',
        endDate: '2024-03-15',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 2,
        pendingSubmissions: 0,
        progress: 100,
        curriculum: [
          { id: 'c5', title: 'Business Model Canvas', type: 'video', duration: '50 min', isCompleted: true },
          { id: 'c6', title: 'Value Proposition Design', type: 'video', duration: '40 min', isCompleted: true },
          { id: 'c7', title: 'Business Model Assignment', type: 'assignment', duration: '3 hours', isCompleted: true, dueDate: '2024-03-05' },
          { id: 'c8', title: 'Strategy Planning Workshop', type: 'live_session', duration: '120 min', isCompleted: true }
        ],
        liveSessions: [
          { id: 'ls3', title: 'Business Model Workshop', date: '2024-02-22', time: '11:00 AM', status: 'completed', attendees: 25 },
          { id: 'ls4', title: 'Strategy Planning Session', date: '2024-03-08', time: '3:00 PM', status: 'completed', attendees: 24 }
        ],
        assignments: [
          { id: 'a3', title: 'Business Model Canvas', dueDate: '2024-03-05', totalSubmissions: 25, gradedSubmissions: 25, averageGrade: 89 },
          { id: 'a4', title: 'Strategic Plan Document', dueDate: '2024-03-15', totalSubmissions: 25, gradedSubmissions: 25, averageGrade: 85 }
        ]
      },
      {
        id: 'p3',
        phaseNumber: 3,
        title: 'Financial Planning & Funding',
        description: 'Mentor students in financial modeling and funding strategies',
        duration: '4 weeks',
        status: 'active',
        startDate: '2024-03-16',
        endDate: '2024-04-15',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 1,
        pendingSubmissions: 3,
        progress: 60,
        curriculum: [
          { id: 'c9', title: 'Financial Modeling Basics', type: 'video', duration: '55 min', isCompleted: true },
          { id: 'c10', title: 'Funding Strategies', type: 'video', duration: '45 min', isCompleted: true },
          { id: 'c11', title: 'Financial Model Assignment', type: 'assignment', duration: '4 hours', isCompleted: false, dueDate: '2024-04-05' },
          { id: 'c12', title: 'Investor Pitch Preparation', type: 'live_session', duration: '90 min', isCompleted: false }
        ],
        liveSessions: [
          { id: 'ls5', title: 'Financial Modeling Workshop', date: '2024-03-22', time: '10:00 AM', status: 'completed', attendees: 25 },
          { id: 'ls6', title: 'Funding Strategies Session', date: '2024-04-08', time: '2:00 PM', status: 'scheduled', attendees: 0 }
        ],
        assignments: [
          { id: 'a5', title: 'Financial Model', dueDate: '2024-04-05', totalSubmissions: 22, gradedSubmissions: 19, averageGrade: 0 },
          { id: 'a6', title: 'Funding Proposal', dueDate: '2024-04-15', totalSubmissions: 0, gradedSubmissions: 0, averageGrade: 0 }
        ]
      },
      {
        id: 'p4',
        phaseNumber: 4,
        title: 'Product Development & MVP',
        description: 'Guide students through product development and MVP creation',
        duration: '4 weeks',
        status: 'upcoming',
        startDate: '2024-04-16',
        endDate: '2024-05-15',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 0,
        pendingSubmissions: 0,
        progress: 0,
        curriculum: [
          { id: 'c13', title: 'Product Development Process', type: 'video', duration: '50 min', isCompleted: false },
          { id: 'c14', title: 'MVP Design Principles', type: 'video', duration: '40 min', isCompleted: false },
          { id: 'c15', title: 'MVP Development Assignment', type: 'assignment', duration: '5 hours', isCompleted: false, dueDate: '2024-05-05' },
          { id: 'c16', title: 'Product Demo Session', type: 'live_session', duration: '120 min', isCompleted: false }
        ],
        liveSessions: [
          { id: 'ls7', title: 'Product Development Workshop', date: '2024-04-22', time: '11:00 AM', status: 'scheduled', attendees: 0 },
          { id: 'ls8', title: 'MVP Design Session', date: '2024-05-08', time: '3:00 PM', status: 'scheduled', attendees: 0 }
        ],
        assignments: [
          { id: 'a7', title: 'MVP Development', dueDate: '2024-05-05', totalSubmissions: 0, gradedSubmissions: 0, averageGrade: 0 },
          { id: 'a8', title: 'Product Demo', dueDate: '2024-05-15', totalSubmissions: 0, gradedSubmissions: 0, averageGrade: 0 }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPhases(mockPhases);
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
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (phase: KSMPPhase) => {
    setSelectedPhase(phase);
    setShowDetailModal(true);
  };

  if (!isMentor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the mentor phases page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">KSMP Phases</h1>
            <p className="text-gray-600">Manage and track your assigned KSMP phases</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Phase
          </button>
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
              <PlayIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Phases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phases.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phases.reduce((sum, phase) => sum + phase.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {phases.reduce((sum, phase) => sum + phase.pendingSubmissions, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phases List */}
        <div className="space-y-6">
          {phases.map((phase) => (
            <div key={phase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(phase.status)}`}>
                        {getStatusIcon(phase.status)}
                        <span className="ml-1">{phase.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{phase.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {phase.duration}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {phase.enrolledStudents} students
                      </div>
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        {phase.gradedAssignments}/{phase.totalAssignments} graded
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(phase)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Phase Progress</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Curriculum</h4>
                    <p className="text-sm text-gray-600">
                      {phase.curriculum.filter(c => c.isCompleted).length}/{phase.curriculum.length} completed
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Live Sessions</h4>
                    <p className="text-sm text-gray-600">
                      {phase.liveSessions.filter(ls => ls.status === 'completed').length}/{phase.liveSessions.length} completed
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Assignments</h4>
                    <p className="text-sm text-gray-600">
                      {phase.gradedAssignments}/{phase.totalAssignments} graded
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {phase.pendingSubmissions > 0 && (
                      <span className="text-orange-600 font-medium">
                        {phase.pendingSubmissions} submissions pending grading
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/mentor/phases/${phase.id}/assignments`}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Grade Assignments
                    </Link>
                    <Link
                      href={`/mentor/phases/${phase.id}/sessions`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Manage Sessions
                    </Link>
                    <button
                      onClick={() => handleViewDetails(phase)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase Detail Modal */}
        {showDetailModal && selectedPhase && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Phase {selectedPhase.phaseNumber}: {selectedPhase.title}
                    </h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Curriculum */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Curriculum</h4>
                      <div className="space-y-3">
                        {selectedPhase.curriculum.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                item.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.type} • {item.duration}</p>
                              </div>
                            </div>
                            {item.dueDate && (
                              <span className="text-xs text-gray-500">
                                Due: {formatDate(item.dueDate)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Sessions */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Live Sessions</h4>
                      <div className="space-y-3">
                        {selectedPhase.liveSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{session.title}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(session.date)} at {session.time} • {session.attendees} attendees
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-700' :
                              session.status === 'live' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignments */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Assignments</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPhase.assignments.map((assignment) => (
                          <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">{assignment.title}</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div>Due: {formatDate(assignment.dueDate)}</div>
                              <div>Submissions: {assignment.totalSubmissions}</div>
                              <div>Graded: {assignment.gradedSubmissions}</div>
                              <div>Avg Grade: {assignment.averageGrade || 'N/A'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
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

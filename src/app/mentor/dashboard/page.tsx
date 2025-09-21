'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  UserGroupIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlayIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface AssignedPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  enrolledStudents: number;
  totalAssignments: number;
  gradedAssignments: number;
  startDate: string;
  endDate: string;
  progress: number;
}

interface LiveSession {
  id: string;
  title: string;
  phase: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'live' | 'completed';
  joinLink?: string;
  enrolledStudents: number;
  recordingUrl?: string;
}

interface PendingGrading {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  course: string;
  phase?: number;
  submittedAt: string;
  dueDate: string;
  maxMarks: number;
  status: 'submitted' | 'overdue';
  submissionType: 'file' | 'text' | 'link';
  fileName?: string;
}

export default function MentorDashboard() {
  const { isMentor, user } = useRoleBasedAccess();
  const [assignedPhases, setAssignedPhases] = useState<AssignedPhase[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [pendingGrading, setPendingGrading] = useState<PendingGrading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockAssignedPhases: AssignedPhase[] = [
      {
        id: 'p1',
        phaseNumber: 1,
        title: 'Business Idea & Market Research',
        description: 'Guide students through business ideation and market research',
        status: 'completed',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 2,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        progress: 100
      },
      {
        id: 'p2',
        phaseNumber: 2,
        title: 'Business Model & Strategy',
        description: 'Help students develop business models and strategic plans',
        status: 'completed',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 2,
        startDate: '2024-02-16',
        endDate: '2024-03-15',
        progress: 100
      },
      {
        id: 'p3',
        phaseNumber: 3,
        title: 'Financial Planning & Funding',
        description: 'Mentor students in financial modeling and funding strategies',
        status: 'active',
        enrolledStudents: 25,
        totalAssignments: 2,
        gradedAssignments: 1,
        startDate: '2024-03-16',
        endDate: '2024-04-15',
        progress: 60
      }
    ];

    const mockUpcomingSessions: LiveSession[] = [
      {
        id: 's1',
        title: 'Financial Modeling Workshop',
        phase: 'Phase 3',
        course: 'KSMP',
        date: '2024-01-22',
        time: '10:00 AM',
        duration: '2 hours',
        status: 'upcoming',
        joinLink: 'https://zoom.us/j/123456789',
        enrolledStudents: 25
      },
      {
        id: 's2',
        title: 'Investor Pitch Preparation',
        phase: 'Phase 3',
        course: 'KSMP',
        date: '2024-01-25',
        time: '2:00 PM',
        duration: '1.5 hours',
        status: 'upcoming',
        joinLink: 'https://zoom.us/j/987654321',
        enrolledStudents: 25
      },
      {
        id: 's3',
        title: 'Market Research Deep Dive',
        phase: 'Phase 1',
        course: 'KSMP',
        date: '2024-01-20',
        time: '11:00 AM',
        duration: '2 hours',
        status: 'completed',
        enrolledStudents: 25,
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session1.mp4'
      }
    ];

    const mockPendingGrading: PendingGrading[] = [
      {
        id: 'g1',
        assignmentId: 'a1',
        assignmentTitle: 'Financial Model Assignment',
        studentId: 's1',
        studentName: 'Rahul Sharma',
        course: 'KSMP Phase 3',
        phase: 3,
        submittedAt: '2024-01-20T14:30:00Z',
        dueDate: '2024-01-25T23:59:00Z',
        maxMarks: 100,
        status: 'submitted',
        submissionType: 'file',
        fileName: 'financial_model.xlsx'
      },
      {
        id: 'g2',
        assignmentId: 'a2',
        assignmentTitle: 'Business Model Canvas',
        studentId: 's2',
        studentName: 'Priya Patel',
        course: 'KSMP Phase 2',
        phase: 2,
        submittedAt: '2024-01-19T16:45:00Z',
        dueDate: '2024-01-22T23:59:00Z',
        maxMarks: 100,
        status: 'submitted',
        submissionType: 'file',
        fileName: 'business_model_canvas.pdf'
      },
      {
        id: 'g3',
        assignmentId: 'a3',
        assignmentTitle: 'Market Research Report',
        studentId: 's3',
        studentName: 'Mike Johnson',
        course: 'KSMP Phase 1',
        phase: 1,
        submittedAt: '2024-01-18T10:15:00Z',
        dueDate: '2024-01-20T23:59:00Z',
        maxMarks: 100,
        status: 'overdue',
        submissionType: 'file',
        fileName: 'market_research.docx'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setAssignedPhases(mockAssignedPhases);
      setUpcomingSessions(mockUpcomingSessions);
      setPendingGrading(mockPendingGrading);
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
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
      case 'live':
        return 'text-red-600 bg-red-100';
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      case 'live':
        return <PlayIcon className="h-4 w-4" />;
      case 'submitted':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your mentoring overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assigned Phases</p>
                <p className="text-2xl font-semibold text-gray-900">{assignedPhases.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <VideoCameraIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {upcomingSessions.filter(s => s.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingGrading.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignedPhases.reduce((sum, phase) => sum + phase.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned KSMP Phases */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Assigned KSMP Phases</h2>
              <Link
                href="/mentor/phases"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Phases
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedPhases.map((phase) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-md font-semibold text-gray-900">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                      {getStatusIcon(phase.status)}
                      <span className="ml-1">{phase.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {phase.enrolledStudents} students
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      {phase.gradedAssignments}/{phase.totalAssignments} graded
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      {phase.progress}% complete
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {phase.gradedAssignments} assignments graded
                    </div>
                    <Link
                      href={`/mentor/phases/${phase.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Live Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Live Sessions</h2>
              <Link
                href="/mentor/live-sessions"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Manage Sessions
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-500">{session.phase} • {session.course}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(session.date)} at {session.time} • {session.duration} • {session.enrolledStudents} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1">{session.status}</span>
                      </span>
                      {session.joinLink && session.status === 'upcoming' && (
                        <a
                          href={session.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Session
                        </a>
                      )}
                      {session.recordingUrl && session.status === 'completed' && (
                        <a
                          href={session.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          View Recording
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Grading Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Grading Tasks</h2>
              <Link
                href="/mentor/assignments"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Assignments
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingGrading.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{task.assignmentTitle}</h3>
                        <p className="text-sm text-gray-500">{task.studentName} • {task.course}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {formatDate(task.submittedAt)} • Due: {formatDate(task.dueDate)} • {task.maxMarks} marks
                        </p>
                        {task.fileName && (
                          <p className="text-xs text-gray-500">File: {task.fileName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </span>
                      <Link
                        href={`/mentor/assignments/${task.assignmentId}/grade/${task.id}`}
                        className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-orange-700 transition-colors"
                      >
                        Grade Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}

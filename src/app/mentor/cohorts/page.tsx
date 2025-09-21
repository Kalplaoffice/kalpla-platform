'use client';

import { useState, useEffect, Suspense } from 'react';
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
  PlusIcon,
  UsersIcon,
  TrophyIcon,
  SignalIcon
} from '@heroicons/react/24/outline';


interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  currentPhase: number;
  totalPhases: number;
  progress: number;
  assignments: {
    total: number;
    completed: number;
    pending: number;
  };
  liveSessions: {
    total: number;
    completed: number;
    upcoming: number;
  };
  averageGrade: number;
  topPerformers: {
    id: string;
    name: string;
    grade: number;
    progress: number;
  }[];
  recentActivity: {
    id: string;
    type: 'assignment' | 'session' | 'milestone';
    title: string;
    student: string;
    timestamp: string;
  }[];
}

function MentorCohortsContent() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is mentor
  const isMentor = hasRole('Mentor');
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCohorts: Cohort[] = [
      {
        id: 'c1',
        name: 'KSMP Cohort 2024-01',
        description: 'January 2024 cohort focusing on tech startups and innovation',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        status: 'active',
        totalStudents: 25,
        activeStudents: 23,
        completedStudents: 0,
        currentPhase: 3,
        totalPhases: 12,
        progress: 25,
        assignments: {
          total: 6,
          completed: 4,
          pending: 2
        },
        liveSessions: {
          total: 8,
          completed: 5,
          upcoming: 3
        },
        averageGrade: 87.5,
        topPerformers: [
          { id: 's1', name: 'Rahul Sharma', grade: 95, progress: 100 },
          { id: 's2', name: 'Priya Patel', grade: 92, progress: 95 },
          { id: 's3', name: 'Mike Johnson', grade: 89, progress: 90 }
        ],
        recentActivity: [
          { id: 'a1', type: 'assignment', title: 'Financial Model Assignment', student: 'Rahul Sharma', timestamp: '2024-01-20T14:30:00Z' },
          { id: 'a2', type: 'session', title: 'Live Q&A Session', student: 'All Students', timestamp: '2024-01-19T16:00:00Z' },
          { id: 'a3', type: 'milestone', title: 'Phase 2 Completion', student: 'Priya Patel', timestamp: '2024-01-18T10:15:00Z' }
        ]
      },
      {
        id: 'c2',
        name: 'KSMP Cohort 2023-09',
        description: 'September 2023 cohort with focus on e-commerce and fintech',
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        status: 'active',
        totalStudents: 30,
        activeStudents: 28,
        completedStudents: 0,
        currentPhase: 8,
        totalPhases: 12,
        progress: 67,
        assignments: {
          total: 16,
          completed: 14,
          pending: 2
        },
        liveSessions: {
          total: 20,
          completed: 18,
          upcoming: 2
        },
        averageGrade: 85.2,
        topPerformers: [
          { id: 's4', name: 'Sarah Wilson', grade: 96, progress: 100 },
          { id: 's5', name: 'Alex Brown', grade: 94, progress: 98 },
          { id: 's6', name: 'David Lee', grade: 91, progress: 95 }
        ],
        recentActivity: [
          { id: 'a4', type: 'assignment', title: 'Product Demo Assignment', student: 'Sarah Wilson', timestamp: '2024-01-21T09:45:00Z' },
          { id: 'a5', type: 'session', title: 'Investor Pitch Workshop', student: 'All Students', timestamp: '2024-01-20T14:00:00Z' },
          { id: 'a6', type: 'milestone', title: 'Phase 7 Completion', student: 'Alex Brown', timestamp: '2024-01-19T11:30:00Z' }
        ]
      },
      {
        id: 'c3',
        name: 'KSMP Cohort 2023-06',
        description: 'June 2023 cohort specializing in healthcare and biotech startups',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        status: 'completed',
        totalStudents: 20,
        activeStudents: 0,
        completedStudents: 18,
        currentPhase: 12,
        totalPhases: 12,
        progress: 100,
        assignments: {
          total: 24,
          completed: 24,
          pending: 0
        },
        liveSessions: {
          total: 24,
          completed: 24,
          upcoming: 0
        },
        averageGrade: 88.7,
        topPerformers: [
          { id: 's7', name: 'Emma Davis', grade: 98, progress: 100 },
          { id: 's8', name: 'James Wilson', grade: 95, progress: 100 },
          { id: 's9', name: 'Lisa Chen', grade: 93, progress: 100 }
        ],
        recentActivity: [
          { id: 'a7', type: 'milestone', title: 'Program Completion', student: 'Emma Davis', timestamp: '2024-01-15T16:00:00Z' },
          { id: 'a8', type: 'milestone', title: 'Program Completion', student: 'James Wilson', timestamp: '2024-01-15T15:30:00Z' },
          { id: 'a9', type: 'milestone', title: 'Program Completion', student: 'Lisa Chen', timestamp: '2024-01-15T15:00:00Z' }
        ]
      },
      {
        id: 'c4',
        name: 'KSMP Cohort 2024-03',
        description: 'March 2024 cohort focusing on AI and machine learning startups',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        status: 'upcoming',
        totalStudents: 0,
        activeStudents: 0,
        completedStudents: 0,
        currentPhase: 0,
        totalPhases: 12,
        progress: 0,
        assignments: {
          total: 0,
          completed: 0,
          pending: 0
        },
        liveSessions: {
          total: 0,
          completed: 0,
          upcoming: 0
        },
        averageGrade: 0,
        topPerformers: [],
        recentActivity: []
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setCohorts(mockCohorts);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'session':
        return <SignalIcon className="h-4 w-4 text-green-500" />;
      case 'milestone':
        return <TrophyIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewDetails = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setShowDetailModal(true);
  };

  if (!isMentor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the mentor cohorts page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">KSMP Cohorts</h1>
            <p className="text-gray-600">Manage and track your assigned KSMP cohorts</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Cohort
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Cohorts</p>
                <p className="text-2xl font-semibold text-gray-900">{cohorts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-green-600" />
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
                  {cohorts.reduce((sum, cohort) => sum + cohort.totalStudents, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Grade</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(cohorts.filter(c => c.status === 'active' || c.status === 'completed').reduce((sum, cohort) => sum + cohort.averageGrade, 0) / cohorts.filter(c => c.status === 'active' || c.status === 'completed').length || 0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cohorts List */}
        <div className="space-y-6">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{cohort.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cohort.status)}`}>
                        {getStatusIcon(cohort.status)}
                        <span className="ml-1">{cohort.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{cohort.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {cohort.totalStudents} students
                      </div>
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        Phase {cohort.currentPhase}/{cohort.totalPhases}
                      </div>
                      <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        {cohort.averageGrade}% avg grade
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(cohort)}
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
                    <span>Cohort Progress</span>
                    <span>{cohort.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${cohort.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Assignments</h4>
                    <p className="text-sm text-gray-600">
                      {cohort.assignments.completed}/{cohort.assignments.total} completed
                    </p>
                    {cohort.assignments.pending > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        {cohort.assignments.pending} pending grading
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Live Sessions</h4>
                    <p className="text-sm text-gray-600">
                      {cohort.liveSessions.completed}/{cohort.liveSessions.total} completed
                    </p>
                    {cohort.liveSessions.upcoming > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        {cohort.liveSessions.upcoming} upcoming
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Student Status</h4>
                    <p className="text-sm text-gray-600">
                      {cohort.activeStudents} active, {cohort.completedStudents} completed
                    </p>
                  </div>
                </div>

                {/* Top Performers */}
                {cohort.topPerformers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Top Performers</h4>
                    <div className="flex space-x-4">
                      {cohort.topPerformers.slice(0, 3).map((performer) => (
                        <div key={performer.id} className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                          <TrophyIcon className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                            <p className="text-xs text-gray-500">{performer.grade}% grade</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {cohort.recentActivity.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {cohort.recentActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 text-sm">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-gray-900">{activity.title}</p>
                            <p className="text-gray-500">{activity.student}</p>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {cohort.assignments.pending > 0 && (
                      <span className="text-orange-600 font-medium">
                        {cohort.assignments.pending} assignments pending grading
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/mentor/cohorts/${cohort.id}/students`}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Manage Students
                    </Link>
                    <Link
                      href={`/mentor/cohorts/${cohort.id}/assignments`}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Grade Assignments
                    </Link>
                    <button
                      onClick={() => handleViewDetails(cohort)}
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

        {/* Cohort Detail Modal */}
        {showDetailModal && selectedCohort && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedCohort.name}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cohort Overview */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Cohort Overview</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCohort.status)}`}>
                            {selectedCohort.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Duration:</span>
                          <span className="text-sm text-gray-900">
                            {formatDate(selectedCohort.startDate)} - {formatDate(selectedCohort.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Students:</span>
                          <span className="text-sm text-gray-900">{selectedCohort.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Current Phase:</span>
                          <span className="text-sm text-gray-900">{selectedCohort.currentPhase}/{selectedCohort.totalPhases}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Average Grade:</span>
                          <span className="text-sm text-gray-900">{selectedCohort.averageGrade}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Progress Statistics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Overall Progress</span>
                            <span className="text-gray-900">{selectedCohort.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedCohort.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Assignments</p>
                            <p className="text-gray-900">{selectedCohort.assignments.completed}/{selectedCohort.assignments.total}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Live Sessions</p>
                            <p className="text-gray-900">{selectedCohort.liveSessions.completed}/{selectedCohort.liveSessions.total}</p>
                          </div>
                        </div>
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

export default function MentorCohortsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <MentorCohortsContent />
    </Suspense>
  );
}

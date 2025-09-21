'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface KSMPPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  assignments: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
    status: 'not_submitted' | 'submitted' | 'graded';
    grade?: number;
    feedback?: string;
  }>;
  liveClasses: Array<{
    id: string;
    title: string;
    mentor: string;
    date: string;
    time: string;
    duration: string;
    status: 'upcoming' | 'live' | 'completed';
    joinLink?: string;
  }>;
  resources: Array<{
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link';
    url: string;
  }>;
  status: 'upcoming' | 'current' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
}

interface KSMPCohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  currentPhase: number;
  totalPhases: number;
  enrolledStudents: number;
  maxStudents: number;
  mentors: Array<{
    id: string;
    name: string;
    email: string;
    phases: number[];
  }>;
  studentProgress: {
    currentPhase: number;
    completedAssignments: number;
    totalAssignments: number;
    averageGrade: number;
    overallProgress: number;
  };
}

export default function StudentKSMP() {
  const { isStudent } = useRoleBasedAccess();
  const [ksmpData, setKsmpData] = useState<{
    enrolled: boolean;
    cohort: KSMPCohort | null;
    phases: KSMPPhase[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<KSMPPhase | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockKSMPData = {
      enrolled: true,
      cohort: {
        id: 'cohort1',
        name: 'KSMP Cohort 2024-01',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        currentPhase: 3,
        totalPhases: 12,
        enrolledStudents: 25,
        maxStudents: 30,
        mentors: [
          { id: 'm1', name: 'John Doe', email: 'john.doe@email.com', phases: [1, 2, 3] },
          { id: 'm2', name: 'Jane Smith', email: 'jane.smith@email.com', phases: [4, 5, 6] },
          { id: 'm3', name: 'Mike Johnson', email: 'mike.johnson@email.com', phases: [7, 8, 9] }
        ],
        studentProgress: {
          currentPhase: 3,
          completedAssignments: 4,
          totalAssignments: 6,
          averageGrade: 88.5,
          overallProgress: 25
        }
      },
      phases: [
        {
          id: 'p1',
          phaseNumber: 1,
          title: 'Business Idea & Market Research',
          description: 'Develop your business idea and conduct comprehensive market research',
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
              dueDate: '2024-02-15T23:59:00Z',
              maxMarks: 100,
              status: 'graded',
              grade: 92,
              feedback: 'Excellent pitch with clear value proposition and market validation.'
            },
            {
              id: 'a2',
              title: 'Market Research Report',
              description: 'Comprehensive market research analysis',
              dueDate: '2024-02-22T23:59:00Z',
              maxMarks: 100,
              status: 'graded',
              grade: 88,
              feedback: 'Good research with solid data. Consider adding more competitor analysis.'
            }
          ],
          liveClasses: [
            {
              id: 'lc1',
              title: 'Market Research Workshop',
              mentor: 'John Doe',
              date: '2024-02-10',
              time: '10:00 AM',
              duration: '2 hours',
              status: 'completed'
            }
          ],
          resources: [
            { id: 'r1', title: 'Market Research Template', type: 'pdf', url: '#' },
            { id: 'r2', title: 'Business Model Canvas Guide', type: 'pdf', url: '#' }
          ],
          status: 'completed',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          progress: 100
        },
        {
          id: 'p2',
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
              dueDate: '2024-03-15T23:59:00Z',
              maxMarks: 100,
              status: 'graded',
              grade: 90,
              feedback: 'Well-structured business model with clear value proposition.'
            },
            {
              id: 'a4',
              title: 'Strategic Plan',
              description: 'Develop comprehensive strategic plan',
              dueDate: '2024-03-22T23:59:00Z',
              maxMarks: 100,
              status: 'graded',
              grade: 85,
              feedback: 'Good strategic thinking. Consider adding more detailed implementation timeline.'
            }
          ],
          liveClasses: [
            {
              id: 'lc2',
              title: 'Business Model Workshop',
              mentor: 'John Doe',
              date: '2024-03-05',
              time: '2:00 PM',
              duration: '2 hours',
              status: 'completed'
            }
          ],
          resources: [
            { id: 'r3', title: 'Business Model Canvas Template', type: 'pdf', url: '#' },
            { id: 'r4', title: 'Strategy Planning Guide', type: 'pdf', url: '#' }
          ],
          status: 'completed',
          startDate: '2024-02-16',
          endDate: '2024-03-15',
          progress: 100
        },
        {
          id: 'p3',
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
              dueDate: '2024-04-15T23:59:00Z',
              maxMarks: 100,
              status: 'submitted'
            },
            {
              id: 'a6',
              title: 'Investor Pitch Deck',
              description: 'Create investor presentation',
              dueDate: '2024-04-22T23:59:00Z',
              maxMarks: 100,
              status: 'not_submitted'
            }
          ],
          liveClasses: [
            {
              id: 'lc3',
              title: 'Financial Modeling Workshop',
              mentor: 'John Doe',
              date: '2024-04-10',
              time: '10:00 AM',
              duration: '2 hours',
              status: 'upcoming',
              joinLink: 'https://zoom.us/j/123456789'
            }
          ],
          resources: [
            { id: 'r5', title: 'Financial Model Template', type: 'pdf', url: '#' },
            { id: 'r6', title: 'Pitch Deck Guide', type: 'pdf', url: '#' }
          ],
          status: 'current',
          startDate: '2024-03-16',
          endDate: '2024-04-15',
          progress: 60
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setKsmpData(mockKSMPData);
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
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      case 'graded':
        return 'text-green-600 bg-green-100';
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'not_submitted':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'current':
      case 'submitted':
        return <ClockIcon className="h-4 w-4" />;
      case 'upcoming':
      case 'not_submitted':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!ksmpData?.enrolled) {
    return (
      <StudentLayout>
        <div className="text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Enrolled in KSMP</h2>
          <p className="text-gray-600 mb-6">You are not currently enrolled in the Kalpla Startup Mentorship Program.</p>
          <Link
            href="/programs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Programs
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KSMP Progress</h1>
          <p className="text-gray-600">Track your progress through the Kalpla Startup Mentorship Program</p>
        </div>

        {/* Cohort Info */}
        {ksmpData.cohort && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{ksmpData.cohort.name}</h2>
                <p className="text-gray-600">
                  {formatDate(ksmpData.cohort.startDate)} - {formatDate(ksmpData.cohort.endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  Phase {ksmpData.cohort.currentPhase} of {ksmpData.cohort.totalPhases}
                </p>
                <p className="text-sm text-gray-600">
                  {ksmpData.cohort.studentProgress.overallProgress}% Complete
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{ksmpData.cohort.studentProgress.completedAssignments}</p>
                <p className="text-sm text-gray-600">Assignments Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{ksmpData.cohort.studentProgress.averageGrade.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Average Grade</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{ksmpData.cohort.mentors.length}</p>
                <p className="text-sm text-gray-600">Assigned Mentors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{ksmpData.cohort.enrolledStudents}</p>
                <p className="text-sm text-gray-600">Cohort Size</p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Program Completion</span>
              <span>{ksmpData.cohort?.studentProgress.overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full" 
                style={{ width: `${ksmpData.cohort?.studentProgress.overallProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {ksmpData.phases.map((phase) => (
              <div key={phase.id} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto mb-1 ${
                  phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                  phase.status === 'current' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {phase.phaseNumber}
                </div>
                <div className="text-xs text-gray-600 truncate" title={phase.title}>
                  Phase {phase.phaseNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {phase.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase Details</h3>
            <div className="space-y-4">
              {ksmpData.phases.map((phase) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-gray-900">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                      {getStatusIcon(phase.status)}
                      <span className="ml-1">{phase.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {phase.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      {phase.assignments.length} assignments
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      {phase.liveClasses.length} live classes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      {phase.progress}% complete
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPhase(phase);
                        setShowPhaseModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </button>
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
                          <span className="font-medium text-gray-600">Progress:</span>
                          <span className="ml-2 text-gray-900">{selectedPhase.progress}%</span>
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
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{assignment.title}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {getStatusIcon(assignment.status)}
                                <span className="ml-1">{assignment.status.replace('_', ' ')}</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Due: {formatDate(assignment.dueDate)}</span>
                              <span>Max Marks: {assignment.maxMarks}</span>
                              {assignment.grade && (
                                <span className="font-medium text-gray-900">
                                  Grade: {assignment.grade}/{assignment.maxMarks}
                                </span>
                              )}
                            </div>
                            {assignment.feedback && (
                              <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-700">{assignment.feedback}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Classes */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Live Classes</h4>
                      <div className="space-y-3">
                        {selectedPhase.liveClasses.map((classItem) => (
                          <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{classItem.title}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                                {getStatusIcon(classItem.status)}
                                <span className="ml-1">{classItem.status}</span>
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Mentor: {classItem.mentor}</p>
                              <p>Date: {formatDate(classItem.date)} at {classItem.time}</p>
                              <p>Duration: {classItem.duration}</p>
                            </div>
                            {classItem.joinLink && classItem.status === 'upcoming' && (
                              <div className="mt-2">
                                <a
                                  href={classItem.joinLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Join Class
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Resources</h4>
                      <div className="space-y-2">
                        {selectedPhase.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{resource.title}</span>
                            <span className="text-xs text-gray-500 uppercase">{resource.type}</span>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

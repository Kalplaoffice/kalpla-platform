'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

import { 
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';


interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson?: {
    id: string;
    title: string;
    duration: string;
  };
  lastAccessed?: string;
}

interface KSMPProgress {
  enrolled: boolean;
  currentPhase: number;
  totalPhases: number;
  phases: Array<{
    phaseNumber: number;
    title: string;
    status: 'completed' | 'current' | 'upcoming';
    progress: number;
    assignments: number;
    completedAssignments: number;
  }>;
  overallProgress: number;
}

interface LiveClass {
  id: string;
  title: string;
  course: string;
  mentor: string;
  date: string;
  time: string;
  duration: string;
  joinLink?: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface AssignmentDeadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'not_submitted' | 'submitted' | 'graded';
  grade?: number;
  maxMarks: number;
  phase?: number;
}

export default function StudentDashboard() {
  const { isStudent, user } = useRoleBasedAccess();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [ksmpProgress, setKsmpProgress] = useState<KSMPProgress | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [assignmentDeadlines, setAssignmentDeadlines] = useState<AssignmentDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockEnrolledCourses: EnrolledCourse[] = [
      {
        id: '1',
        title: 'Python for Data Science',
        instructor: 'Jane Smith',
        thumbnail: '/api/placeholder/300/200',
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        nextLesson: {
          id: 'l17',
          title: 'Data Visualization with Matplotlib',
          duration: '45 min'
        },
        lastAccessed: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        title: 'React Development',
        instructor: 'Mike Johnson',
        thumbnail: '/api/placeholder/300/200',
        progress: 30,
        totalLessons: 18,
        completedLessons: 5,
        nextLesson: {
          id: 'l6',
          title: 'State Management with Redux',
          duration: '60 min'
        },
        lastAccessed: '2024-01-19T10:15:00Z'
      },
      {
        id: '3',
        title: 'Digital Marketing',
        instructor: 'Sarah Wilson',
        thumbnail: '/api/placeholder/300/200',
        progress: 80,
        totalLessons: 15,
        completedLessons: 12,
        nextLesson: {
          id: 'l13',
          title: 'Social Media Advertising',
          duration: '50 min'
        },
        lastAccessed: '2024-01-20T16:45:00Z'
      }
    ];

    const mockKsmpProgress: KSMPProgress = {
      enrolled: true,
      currentPhase: 3,
      totalPhases: 12,
      phases: [
        { phaseNumber: 1, title: 'Business Idea & Market Research', status: 'completed', progress: 100, assignments: 2, completedAssignments: 2 },
        { phaseNumber: 2, title: 'Business Model & Strategy', status: 'completed', progress: 100, assignments: 2, completedAssignments: 2 },
        { phaseNumber: 3, title: 'Financial Planning & Funding', status: 'current', progress: 60, assignments: 2, completedAssignments: 1 },
        { phaseNumber: 4, title: 'Product Development', status: 'upcoming', progress: 0, assignments: 3, completedAssignments: 0 },
        { phaseNumber: 5, title: 'Marketing & Sales', status: 'upcoming', progress: 0, assignments: 2, completedAssignments: 0 },
        { phaseNumber: 6, title: 'Operations & Scaling', status: 'upcoming', progress: 0, assignments: 2, completedAssignments: 0 },
        { phaseNumber: 7, title: 'Legal & Compliance', status: 'upcoming', progress: 0, assignments: 1, completedAssignments: 0 },
        { phaseNumber: 8, title: 'Funding & Investment', status: 'upcoming', progress: 0, assignments: 2, completedAssignments: 0 },
        { phaseNumber: 9, title: 'Team Building', status: 'upcoming', progress: 0, assignments: 2, completedAssignments: 0 },
        { phaseNumber: 10, title: 'Technology & Innovation', status: 'upcoming', progress: 0, assignments: 2, completedAssignments: 0 },
        { phaseNumber: 11, title: 'International Expansion', status: 'upcoming', progress: 0, assignments: 1, completedAssignments: 0 },
        { phaseNumber: 12, title: 'Exit Strategy', status: 'upcoming', progress: 0, assignments: 1, completedAssignments: 0 }
      ],
      overallProgress: 25
    };

    const mockUpcomingClasses: LiveClass[] = [
      {
        id: '1',
        title: 'Financial Modeling Workshop',
        course: 'KSMP Phase 3',
        mentor: 'John Doe',
        date: '2024-01-22',
        time: '10:00 AM',
        duration: '2 hours',
        joinLink: 'https://zoom.us/j/123456789',
        status: 'upcoming'
      },
      {
        id: '2',
        title: 'Data Visualization Techniques',
        course: 'Python for Data Science',
        mentor: 'Jane Smith',
        date: '2024-01-24',
        time: '2:00 PM',
        duration: '1.5 hours',
        joinLink: 'https://zoom.us/j/987654321',
        status: 'upcoming'
      }
    ];

    const mockAssignmentDeadlines: AssignmentDeadline[] = [
      {
        id: '1',
        title: 'Financial Model Assignment',
        course: 'KSMP Phase 3',
        dueDate: '2024-01-25T23:59:00Z',
        status: 'not_submitted',
        maxMarks: 100,
        phase: 3
      },
      {
        id: '2',
        title: 'Data Visualization Project',
        course: 'Python for Data Science',
        dueDate: '2024-01-28T23:59:00Z',
        status: 'submitted',
        maxMarks: 100
      },
      {
        id: '3',
        title: 'React Component Library',
        course: 'React Development',
        dueDate: '2024-01-30T23:59:00Z',
        status: 'not_submitted',
        maxMarks: 100
      },
      {
        id: '4',
        title: 'Market Research Report',
        course: 'KSMP Phase 1',
        dueDate: '2024-01-15T23:59:00Z',
        status: 'graded',
        grade: 85,
        maxMarks: 100,
        phase: 1
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setEnrolledCourses(mockEnrolledCourses);
      setKsmpProgress(mockKsmpProgress);
      setUpcomingClasses(mockUpcomingClasses);
      setAssignmentDeadlines(mockAssignmentDeadlines);
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
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      case 'not_submitted':
        return 'text-red-600 bg-red-100';
      case 'submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'graded':
        return 'text-green-600 bg-green-100';
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
        return <ClockIcon className="h-4 w-4" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      case 'not_submitted':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'submitted':
        return <DocumentTextIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Home</h1>
          <p className="text-gray-600">Welcome back! Here's your learning overview</p>
        </div>

        {/* Enrolled Courses Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Enrolled Courses</h2>
              <Link
                href="/student/courses"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Courses
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{course.title}</h3>
                      <p className="text-sm text-gray-500">by {course.instructor}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {course.completedLessons}/{course.totalLessons} lessons completed
                      </div>
                      {course.nextLesson && (
                        <div className="mt-2">
                          <Link
                            href={`/student/courses/${course.id}/lesson/${course.nextLesson.id}`}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <PlayIcon className="h-3 w-3 mr-1" />
                            Continue: {course.nextLesson.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KSMP Progress Tracker */}
        {ksmpProgress?.enrolled && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">KSMP Progress Tracker</h2>
                <Link
                  href="/student/ksmp"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View Full Progress
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{ksmpProgress.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full" 
                    style={{ width: `${ksmpProgress.overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {ksmpProgress.phases.map((phase) => (
                  <div key={phase.phaseNumber} className="text-center">
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
                      {phase.completedAssignments}/{phase.assignments}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Live Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Live Classes</h2>
              <Link
                href="/student/live-classes"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Classes
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{classItem.title}</h3>
                        <p className="text-sm text-gray-500">{classItem.course} • {classItem.mentor}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(classItem.date)} at {classItem.time} • {classItem.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                        {getStatusIcon(classItem.status)}
                        <span className="ml-1">{classItem.status}</span>
                      </span>
                      {classItem.joinLink && (
                        <a
                          href={classItem.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Deadlines */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Assignment Deadlines</h2>
              <Link
                href="/student/assignments"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Assignments
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {assignmentDeadlines.slice(0, 5).map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                return (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(assignment.dueDate)} at {formatTime(assignment.dueDate)}
                            {daysUntilDue > 0 && (
                              <span className={`ml-2 ${
                                daysUntilDue <= 3 ? 'text-red-600' : 
                                daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-600'
                              }`}>
                                ({daysUntilDue} days left)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1">{assignment.status.replace('_', ' ')}</span>
                        </span>
                        {assignment.grade && (
                          <span className="text-sm font-medium text-gray-900">
                            {assignment.grade}/{assignment.maxMarks}
                          </span>
                        )}
                        {assignment.status === 'not_submitted' && (
                          <Link
                            href={`/student/assignments/${assignment.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Submit
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignmentDeadlines.filter(a => a.status === 'not_submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <VideoCameraIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

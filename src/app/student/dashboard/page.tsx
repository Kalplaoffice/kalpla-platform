'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  DocumentTextIcon,
  TrophyIcon,
  StarIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

export default function StudentDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    // Check if user is a student, if not redirect to appropriate dashboard
    if (user?.role && !['student', 'learner'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  // Mock data for demonstration
  const studentData = {
    name: user?.firstName || 'Student',
    enrolledCourses: 3,
    completedAssignments: 12,
    upcomingSessions: 2,
    notifications: 5,
    progress: {
      overall: 65,
      courses: [
        { name: 'Web Development Fundamentals', progress: 80, nextSession: '2024-01-15' },
        { name: 'Data Science Bootcamp', progress: 45, nextSession: '2024-01-16' },
        { name: 'Digital Marketing Mastery', progress: 70, nextSession: '2024-01-18' }
      ]
    },
    upcomingEvents: [
      { title: 'Live Coding Session', time: 'Today, 2:00 PM', type: 'live' },
      { title: 'Assignment Due: Project Proposal', time: 'Tomorrow, 11:59 PM', type: 'deadline' },
      { title: 'Mentorship Session', time: 'Jan 20, 3:00 PM', type: 'mentorship' }
    ],
    quickStats: {
      totalCourses: 3,
      completedModules: 8,
      totalAssignments: 15,
      averageGrade: 87
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="glass-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {studentData.name}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Continue your learning journey and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <BellIcon className="h-6 w-6 text-gray-400" />
                {studentData.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {studentData.notifications}
                  </span>
                )}
              </div>
              <GlassButton variant="glassPrimary" asChild>
                <Link href="/student/profile">
                  View Profile
                </Link>
              </GlassButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <GlassCard variant="intense">
            <GlassCardHeader>
              <GlassCardTitle>Your Learning Progress</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{studentData.quickStats.totalCourses}</div>
                <div className="text-sm text-gray-600">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{studentData.quickStats.completedModules}</div>
                <div className="text-sm text-gray-600">Completed Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{studentData.quickStats.totalAssignments}</div>
                <div className="text-sm text-gray-600">Total Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{studentData.quickStats.averageGrade}%</div>
                <div className="text-sm text-gray-600">Average Grade</div>
              </div>
                </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm text-gray-500">{studentData.progress.overall}%</span>
                </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${studentData.progress.overall}%` }}
                ></div>
              </div>
            </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <Link 
                  href="/student/schedule" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-3">
                {studentData.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                      {event.type === 'live' && <PlayIcon className="h-5 w-5 text-red-500" />}
                      {event.type === 'deadline' && <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />}
                      {event.type === 'mentorship' && <UserGroupIcon className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

            {/* Course Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                <Link 
                  href="/student/courses" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
                <div className="space-y-4">
                {studentData.progress.courses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{course.name}</h3>
                      <span className="text-sm text-gray-500">{course.progress}%</span>
                        </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Next session: {course.nextSession}</span>
                      <Link 
                        href={`/student/courses/${index + 1}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/student/courses"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5 mr-3 text-blue-600" />
                  <span>My Courses</span>
                </Link>
                <Link 
                  href="/student/schedule"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CalendarIcon className="h-5 w-5 mr-3 text-green-600" />
                  <span>Schedule</span>
                </Link>
                <Link 
                  href="/student/assignments"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3 text-purple-600" />
                  <span>Assignments</span>
                </Link>
                <Link 
                  href="/student/mentorship"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 mr-3 text-orange-600" />
                  <span>Mentorship</span>
                </Link>
                <Link 
                  href="/student/community"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UsersIcon className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>Community</span>
                </Link>
                <Link 
                  href="/student/resources"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3 text-gray-600" />
                  <span>Resources</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">Completed Assignment: Project Proposal</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PlayIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                      <div>
                    <p className="text-sm text-gray-900">Watched: React Hooks Tutorial</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                <div className="flex items-start">
                  <TrophyIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">Earned Badge: First Assignment</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
          </div>
        </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Sections</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/student/courses"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpenIcon className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-xs text-center">Courses</span>
                </Link>
                <Link 
                  href="/student/schedule"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CalendarDaysIcon className="h-6 w-6 mb-2 text-green-600" />
                  <span className="text-xs text-center">Schedule</span>
                </Link>
                <Link 
                  href="/student/mentorship"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="text-xs text-center">Mentorship</span>
                </Link>
                <Link 
                  href="/student/community"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UsersIcon className="h-6 w-6 mb-2 text-indigo-600" />
                  <span className="text-xs text-center">Community</span>
                </Link>
                <Link 
                  href="/student/assignments"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="text-xs text-center">Assignments</span>
                </Link>
                <Link 
                  href="/student/assessments"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DocumentCheckIcon className="h-6 w-6 mb-2 text-red-600" />
                  <span className="text-xs text-center">Assessments</span>
                </Link>
                <Link 
                  href="/student/resources"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-xs text-center">Resources</span>
                </Link>
                <Link 
                  href="/student/payments"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BanknotesIcon className="h-6 w-6 mb-2 text-green-600" />
                  <span className="text-xs text-center">Payments</span>
                </Link>
                <Link 
                  href="/student/notifications"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BellIcon className="h-6 w-6 mb-2 text-yellow-600" />
                  <span className="text-xs text-center">Notifications</span>
            </Link>
                <Link 
                  href="/student/profile"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CogIcon className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-xs text-center">Profile</span>
            </Link>
                <Link 
                  href="/student/support"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-xs text-center">Support</span>
            </Link>
                <Link 
                  href="/student/gamification"
                  className="flex flex-col items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <GiftIcon className="h-6 w-6 mb-2 text-pink-600" />
                  <span className="text-xs text-center">Rewards</span>
            </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
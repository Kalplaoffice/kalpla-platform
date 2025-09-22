'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function StudentSchedulePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    if (user?.role && !['student', 'learner'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  // Mock schedule data
  const scheduleData = {
    today: [
      {
        id: 1,
        title: 'Live Coding Session - React Hooks',
        type: 'live',
        time: '14:00',
        duration: 90,
        instructor: 'Sarah Johnson',
        course: 'Web Development Fundamentals',
        status: 'upcoming',
        joinLink: '#',
        description: 'Deep dive into React Hooks and state management'
      },
      {
        id: 2,
        title: 'Assignment Due: Project Proposal',
        type: 'deadline',
        time: '23:59',
        duration: 0,
        instructor: 'Dr. Michael Chen',
        course: 'Data Science Bootcamp',
        status: 'urgent',
        description: 'Submit your project proposal for the final project'
      }
    ],
    week: [
      {
        id: 3,
        title: 'Pandas Workshop',
        type: 'live',
        time: '10:00',
        duration: 120,
        instructor: 'Dr. Michael Chen',
        course: 'Data Science Bootcamp',
        status: 'upcoming',
        date: '2024-01-16',
        joinLink: '#',
        description: 'Hands-on workshop on data manipulation with Pandas'
      },
      {
        id: 4,
        title: 'Mentorship Session',
        type: 'mentorship',
        time: '15:00',
        duration: 60,
        instructor: 'Alex Thompson',
        course: 'UI/UX Design Principles',
        status: 'upcoming',
        date: '2024-01-17',
        joinLink: '#',
        description: '1:1 session to discuss your design portfolio'
      },
      {
        id: 5,
        title: 'SEO Optimization Live Class',
        type: 'live',
        time: '13:00',
        duration: 90,
        instructor: 'Emily Rodriguez',
        course: 'Digital Marketing Mastery',
        status: 'upcoming',
        date: '2024-01-18',
        joinLink: '#',
        description: 'Learn advanced SEO techniques and tools'
      },
      {
        id: 6,
        title: 'Quiz: JavaScript Fundamentals',
        type: 'assessment',
        time: '16:00',
        duration: 45,
        instructor: 'Sarah Johnson',
        course: 'Web Development Fundamentals',
        status: 'upcoming',
        date: '2024-01-19',
        description: 'Test your knowledge of JavaScript basics'
      }
    ],
    upcoming: [
      {
        id: 7,
        title: 'Social Media Strategy Workshop',
        type: 'live',
        time: '14:00',
        duration: 90,
        instructor: 'Emily Rodriguez',
        course: 'Digital Marketing Mastery',
        status: 'upcoming',
        date: '2024-01-20',
        joinLink: '#',
        description: 'Learn effective social media marketing strategies'
      },
      {
        id: 8,
        title: 'Final Project Presentation',
        type: 'presentation',
        time: '10:00',
        duration: 120,
        instructor: 'Dr. Michael Chen',
        course: 'Data Science Bootcamp',
        status: 'upcoming',
        date: '2024-01-25',
        description: 'Present your final data science project'
      }
    ]
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <PlayIcon className="h-5 w-5 text-red-500" />;
      case 'deadline':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'mentorship':
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case 'assessment':
        return <AcademicCapIcon className="h-5 w-5 text-purple-500" />;
      case 'presentation':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'live':
        return 'bg-red-50 border-red-200';
      case 'deadline':
        return 'bg-orange-50 border-orange-200';
      case 'mentorship':
        return 'bg-blue-50 border-blue-200';
      case 'assessment':
        return 'bg-purple-50 border-purple-200';
      case 'presentation':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
              <p className="mt-2 text-gray-600">
                Manage your classes, assignments, and important deadlines
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Event
              </button>
              <Link
                href="/student/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <BellIcon className="h-4 w-4 mr-1" />
                  <span>{scheduleData.today.length} events</span>
                </div>
              </div>
              
              {scheduleData.today.length > 0 ? (
                <div className="space-y-4">
                  {scheduleData.today.map((event) => (
                    <div key={event.id} className={`border rounded-lg p-4 ${getEventColor(event.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getEventIcon(event.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{event.time}</span>
                              {event.duration > 0 && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{event.duration} minutes</span>
                                </>
                              )}
                              <span className="mx-2">•</span>
                              <span>{event.course}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          {event.joinLink && (
                            <a
                              href={event.joinLink}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Join
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events today</h3>
                  <p className="text-gray-600">You have a free day! Perfect time to catch up on assignments.</p>
                </div>
              )}
            </div>

            {/* This Week */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">This Week</h3>
                <Link 
                  href="/student/schedule/week" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {scheduleData.week.map((event) => (
                  <div key={event.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{event.date}</span>
                        <span className="mx-2">•</span>
                        <span>{event.time}</span>
                        <span className="mx-2">•</span>
                        <span>{event.course}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      {event.joinLink && (
                        <a
                          href={event.joinLink}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {scheduleData.today.filter(e => e.type === 'deadline').map((event) => (
                  <div key={event.id} className="flex items-start p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.course}</p>
                      <p className="text-sm text-orange-600 mt-1">Due: {event.time}</p>
                    </div>
                  </div>
                ))}
                {scheduleData.week.filter(e => e.type === 'deadline').map((event) => (
                  <div key={event.id} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.course}</p>
                      <p className="text-sm text-yellow-600 mt-1">Due: {event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/student/assignments"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ExclamationTriangleIcon className="h-5 w-5 mr-3 text-orange-600" />
                  <span>View Assignments</span>
                </Link>
                <Link 
                  href="/student/mentorship"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Schedule Mentorship</span>
                </Link>
                <Link 
                  href="/student/courses"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <PlayIcon className="h-5 w-5 mr-3 text-red-600" />
                  <span>Join Live Classes</span>
                </Link>
                <button className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full">
                  <PlusIcon className="h-5 w-5 mr-3 text-green-600" />
                  <span>Add Personal Event</span>
                </button>
              </div>
            </div>

            {/* Calendar Integration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar Integration</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Sync with Google Calendar
                </button>
                <button className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Export Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

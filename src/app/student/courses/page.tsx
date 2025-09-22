'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function StudentCoursesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 80,
      status: 'active',
      duration: '12 weeks',
      nextSession: '2024-01-15',
      modules: 8,
      completedModules: 6,
      assignments: 5,
      completedAssignments: 4,
      averageGrade: 87,
      description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and React.',
      image: '/api/placeholder/300/200',
      tags: ['Frontend', 'React', 'JavaScript'],
      liveSessions: [
        { title: 'React Hooks Deep Dive', date: '2024-01-15', time: '2:00 PM' },
        { title: 'State Management', date: '2024-01-17', time: '3:00 PM' }
      ]
    },
    {
      id: 2,
      title: 'Data Science Bootcamp',
      instructor: 'Dr. Michael Chen',
      progress: 45,
      status: 'active',
      duration: '16 weeks',
      nextSession: '2024-01-16',
      modules: 12,
      completedModules: 5,
      assignments: 8,
      completedAssignments: 3,
      averageGrade: 92,
      description: 'Comprehensive data science course covering Python, statistics, machine learning, and data visualization.',
      image: '/api/placeholder/300/200',
      tags: ['Python', 'Machine Learning', 'Statistics'],
      liveSessions: [
        { title: 'Pandas Workshop', date: '2024-01-16', time: '10:00 AM' },
        { title: 'Machine Learning Basics', date: '2024-01-18', time: '11:00 AM' }
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      instructor: 'Emily Rodriguez',
      progress: 70,
      status: 'active',
      duration: '10 weeks',
      nextSession: '2024-01-18',
      modules: 6,
      completedModules: 4,
      assignments: 4,
      completedAssignments: 3,
      averageGrade: 85,
      description: 'Master digital marketing strategies including SEO, social media, content marketing, and analytics.',
      image: '/api/placeholder/300/200',
      tags: ['Marketing', 'SEO', 'Social Media'],
      liveSessions: [
        { title: 'SEO Optimization', date: '2024-01-18', time: '1:00 PM' },
        { title: 'Social Media Strategy', date: '2024-01-20', time: '2:00 PM' }
      ]
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      instructor: 'Alex Thompson',
      progress: 100,
      status: 'completed',
      duration: '8 weeks',
      nextSession: null,
      modules: 6,
      completedModules: 6,
      assignments: 4,
      completedAssignments: 4,
      averageGrade: 94,
      description: 'Learn user interface and user experience design principles, tools, and best practices.',
      image: '/api/placeholder/300/200',
      tags: ['Design', 'UI/UX', 'Figma'],
      liveSessions: []
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="mt-2 text-gray-600">
                Manage your enrolled courses and track your learning progress
              </p>
            </div>
            <Link
              href="/student/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Courses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  <p className="text-sm text-gray-600">Total Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <PlayIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(courses.reduce((acc, c) => acc + c.averageGrade, 0) / courses.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Course Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{course.instructor}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {course.status === 'completed' && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                    {course.status === 'active' && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{course.completedModules}/{course.modules}</div>
                    <div className="text-xs text-gray-500">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{course.completedAssignments}/{course.assignments}</div>
                    <div className="text-xs text-gray-500">Assignments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{course.averageGrade}%</div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Upcoming Sessions */}
                {course.liveSessions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Upcoming Sessions</h4>
                    <div className="space-y-2">
                      {course.liveSessions.slice(0, 2).map((session, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{session.title}</span>
                          <span className="ml-auto">{session.date} at {session.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                  </Link>
                  <Link
                    href={`/student/courses/${course.id}/assignments`}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                    Assignments
                  </Link>
                  <Link
                    href={`/student/courses/${course.id}/resources`}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Resources
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria.' : 'You haven\'t enrolled in any courses yet.'}
            </p>
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
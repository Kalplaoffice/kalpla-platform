'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  BookOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function LessonsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock data for lessons
  const lessons = [
    {
      id: '1',
      title: 'Introduction to HTML',
      description: 'Learn the basics of HTML structure and elements',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      type: 'video',
      duration: '45 minutes',
      order: 1,
      status: 'published',
      views: 1250,
      completionRate: 89,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
      instructor: 'Dr. Sarah Johnson',
      createdAt: '2023-10-15',
      updatedAt: '2024-01-20',
      resources: ['HTML Cheat Sheet', 'Code Examples']
    },
    {
      id: '2',
      title: 'CSS Fundamentals',
      description: 'Master CSS styling and layout techniques',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      type: 'video',
      duration: '60 minutes',
      order: 2,
      status: 'published',
      views: 1180,
      completionRate: 85,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      instructor: 'Dr. Sarah Johnson',
      createdAt: '2023-10-16',
      updatedAt: '2024-01-19',
      resources: ['CSS Reference', 'Practice Files']
    },
    {
      id: '3',
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming concepts',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      type: 'video',
      duration: '75 minutes',
      order: 3,
      status: 'published',
      views: 1100,
      completionRate: 82,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
      instructor: 'Dr. Sarah Johnson',
      createdAt: '2023-10-17',
      updatedAt: '2024-01-18',
      resources: ['JavaScript Exercises', 'Code Challenges']
    },
    {
      id: '4',
      title: 'Data Analysis with Pandas',
      description: 'Learn data manipulation and analysis using Pandas library',
      courseId: '2',
      courseTitle: 'Data Science with Python',
      type: 'video',
      duration: '90 minutes',
      order: 1,
      status: 'published',
      views: 950,
      completionRate: 88,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      instructor: 'Prof. Michael Chen',
      createdAt: '2023-09-20',
      updatedAt: '2024-01-17',
      resources: ['Dataset Files', 'Pandas Documentation']
    },
    {
      id: '5',
      title: 'Design Principles',
      description: 'Understanding fundamental design principles and theory',
      courseId: '3',
      courseTitle: 'UI/UX Design Fundamentals',
      type: 'video',
      duration: '50 minutes',
      order: 1,
      status: 'draft',
      views: 0,
      completionRate: 0,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      instructor: 'Dr. Emily Rodriguez',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-22',
      resources: ['Design Templates', 'Color Palette']
    },
    {
      id: '6',
      title: 'SEO Optimization',
      description: 'Learn search engine optimization techniques',
      courseId: '4',
      courseTitle: 'Digital Marketing Mastery',
      type: 'article',
      duration: '30 minutes',
      order: 1,
      status: 'published',
      views: 800,
      completionRate: 75,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      instructor: 'Mr. David Kumar',
      createdAt: '2023-11-05',
      updatedAt: '2024-01-15',
      resources: ['SEO Checklist', 'Keyword Research Tools']
    },
    {
      id: '7',
      title: 'React Native Setup',
      description: 'Setting up development environment for React Native',
      courseId: '5',
      courseTitle: 'Mobile App Development',
      type: 'video',
      duration: '40 minutes',
      order: 1,
      status: 'review',
      views: 0,
      completionRate: 0,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      instructor: 'Dr. Sarah Johnson',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-22',
      resources: ['Setup Guide', 'Development Tools']
    }
  ];

  const courses = [
    { id: '1', title: 'Complete Web Development Bootcamp' },
    { id: '2', title: 'Data Science with Python' },
    { id: '3', title: 'UI/UX Design Fundamentals' },
    { id: '4', title: 'Digital Marketing Mastery' },
    { id: '5', title: 'Mobile App Development' }
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || lesson.courseId === filterCourse;
    const matchesType = filterType === 'all' || lesson.type === filterType;
    return matchesSearch && matchesCourse && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-100';
      case 'article': return 'text-blue-600 bg-blue-100';
      case 'quiz': return 'text-green-600 bg-green-100';
      case 'assignment': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-4 w-4" />;
      case 'article': return <DocumentTextIcon className="h-4 w-4" />;
      case 'quiz': return <AcademicCapIcon className="h-4 w-4" />;
      case 'assignment': return <BookOpenIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="h-4 w-4" />;
      case 'draft': return <ClockIcon className="h-4 w-4" />;
      case 'review': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'archived': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleSelectAll = () => {
    if (selectedLessons.length === filteredLessons.length) {
      setSelectedLessons([]);
    } else {
      setSelectedLessons(filteredLessons.map(lesson => lesson.id));
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lessons Management</h1>
                <p className="text-gray-600 mt-1">Manage individual lessons, content, and student progress</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                    <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.status === 'published').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <VideoCameraIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Video Lessons</p>
                    <p className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.type === 'video').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {lessons.filter(l => l.completionRate > 0).length > 0 
                        ? Math.round(lessons.filter(l => l.completionRate > 0).reduce((acc, l) => acc + l.completionRate, 0) / lessons.filter(l => l.completionRate > 0).length)
                        : 0
                      }%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Course Filter */}
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Lesson
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Lessons Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLessons.includes(lesson.id)}
                          onChange={() => handleSelectLesson(lesson.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={lesson.thumbnail}
                              alt={lesson.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                            <div className="text-sm text-gray-500">{lesson.instructor}</div>
                            <div className="text-xs text-gray-400">Order: {lesson.order}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lesson.courseTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}>
                          {getTypeIcon(lesson.type)}
                          <span className="ml-1 capitalize">{lesson.type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lesson.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                          {getStatusIcon(lesson.status)}
                          <span className="ml-1 capitalize">{lesson.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lesson.views} views</div>
                        <div className="text-sm text-gray-500">{lesson.completionRate}% completion</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLessons.length}</span> of{' '}
                      <span className="font-medium">{lessons.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

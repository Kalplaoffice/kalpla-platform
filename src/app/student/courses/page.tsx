'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  totalRatings: number;
  price: number;
  originalPrice?: number;
  isEnrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed?: string;
  category: string;
  tags: string[];
  isLive: boolean;
  nextLiveSession?: string;
}

export default function StudentCoursesPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is student
  const isStudent = hasRole('Student');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('enrolled');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCourses: Course[] = [
      {
        id: 'c1',
        title: 'React Development Fundamentals',
        description: 'Learn React from scratch with hands-on projects and real-world applications',
        instructor: 'John Doe',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        duration: '8 weeks',
        level: 'Intermediate',
        rating: 4.8,
        totalRatings: 1247,
        price: 2500,
        originalPrice: 3500,
        isEnrolled: true,
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        lastAccessed: '2024-01-20T10:30:00Z',
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Frontend'],
        isLive: true,
        nextLiveSession: '2024-01-22T14:00:00Z'
      },
      {
        id: 'c2',
        title: 'Python for Data Science',
        description: 'Master Python programming for data analysis, visualization, and machine learning',
        instructor: 'Jane Smith',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        duration: '12 weeks',
        level: 'Beginner',
        rating: 4.9,
        totalRatings: 892,
        price: 3000,
        originalPrice: 4000,
        isEnrolled: true,
        progress: 30,
        totalLessons: 36,
        completedLessons: 11,
        lastAccessed: '2024-01-19T16:45:00Z',
        category: 'Data Science',
        tags: ['Python', 'Data Analysis', 'Machine Learning'],
        isLive: false
      },
      {
        id: 'c3',
        title: 'Digital Marketing Mastery',
        description: 'Complete guide to digital marketing strategies, SEO, social media, and analytics',
        instructor: 'Mike Johnson',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        duration: '6 weeks',
        level: 'Beginner',
        rating: 4.7,
        totalRatings: 654,
        price: 2000,
        isEnrolled: false,
        progress: 0,
        totalLessons: 18,
        completedLessons: 0,
        category: 'Marketing',
        tags: ['Digital Marketing', 'SEO', 'Social Media'],
        isLive: false
      },
      {
        id: 'c4',
        title: 'AWS Cloud Architecture',
        description: 'Design and deploy scalable cloud solutions using AWS services',
        instructor: 'Sarah Wilson',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        duration: '10 weeks',
        level: 'Advanced',
        rating: 4.9,
        totalRatings: 423,
        price: 4000,
        originalPrice: 5000,
        isEnrolled: true,
        progress: 100,
        totalLessons: 30,
        completedLessons: 30,
        lastAccessed: '2024-01-18T09:15:00Z',
        category: 'Cloud Computing',
        tags: ['AWS', 'Cloud Architecture', 'DevOps'],
        isLive: false
      },
      {
        id: 'c5',
        title: 'UI/UX Design Principles',
        description: 'Learn design thinking, user research, prototyping, and visual design',
        instructor: 'Alex Brown',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        duration: '8 weeks',
        level: 'Intermediate',
        rating: 4.6,
        totalRatings: 789,
        price: 2800,
        isEnrolled: false,
        progress: 0,
        totalLessons: 20,
        completedLessons: 0,
        category: 'Design',
        tags: ['UI/UX', 'Design Thinking', 'Prototyping'],
        isLive: false
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'enrolled' && course.isEnrolled) ||
      (filter === 'available' && !course.isEnrolled);
    
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const enrolledCourses = courses.filter(course => course.isEnrolled);
  const availableCourses = courses.filter(course => !course.isEnrolled);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student courses page.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey and discover new courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.filter(c => c.isEnrolled && c.progress === 100).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length || 0)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.filter(c => c.isEnrolled && c.isLive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="enrolled">My Courses</option>
                <option value="available">Available Courses</option>
                <option value="all">All Courses</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Marketing">Marketing</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Course Thumbnail */}
              <div className="relative">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpenIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                
                {/* Progress Bar for Enrolled Courses */}
                {course.isEnrolled && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                    <div 
                      className="bg-blue-600 h-2 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Live Badge */}
                {course.isLive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Live
                  </div>
                )}
                
                {/* Level Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(course.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {course.instructorAvatar ? (
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                    <p className="text-xs text-gray-500">{course.category}</p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    {course.totalLessons} lessons
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    {course.rating} ({course.totalRatings})
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    {course.level}
                  </div>
                </div>

                {/* Progress for Enrolled Courses */}
                {course.isEnrolled && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.completedLessons}/{course.totalLessons} lessons completed
                    </p>
                  </div>
                )}

                {/* Next Live Session */}
                {course.isLive && course.nextLiveSession && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Next Live Session</p>
                    <p className="text-sm text-blue-700">{formatDate(course.nextLiveSession)}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    {course.isEnrolled ? 'Continue Learning' : formatCurrency(course.price)}
                  </div>
                  <Link
                    href={course.isEnrolled ? `/student/courses/${course.id}` : `/courses/${course.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {course.isEnrolled ? 'Continue' : 'Enroll'}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
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
            <p className="text-gray-600">
              {searchTerm || filter !== 'enrolled' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'You haven\'t enrolled in any courses yet.'}
            </p>
            {filter === 'enrolled' && (
              <Link
                href="/courses"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Available Courses
              </Link>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

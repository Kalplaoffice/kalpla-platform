'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    'All',
    'Technology',
    'Business',
    'Design',
    'Marketing',
    'Data Science',
    'Programming',
    'Entrepreneurship'
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'John Doe',
      category: 'Technology',
      rating: 4.8,
      students: 1250,
      duration: '40 hours',
      price: 99,
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn React from scratch with hands-on projects and real-world applications.',
      level: 'Beginner',
      language: 'English'
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      instructor: 'Jane Smith',
      category: 'Marketing',
      rating: 4.7,
      students: 890,
      duration: '25 hours',
      price: 79,
      thumbnail: '/api/placeholder/300/200',
      description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
      level: 'Intermediate',
      language: 'English'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      category: 'Design',
      rating: 4.9,
      students: 2100,
      duration: '35 hours',
      price: 129,
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn the principles of user interface and user experience design.',
      level: 'Beginner',
      language: 'English'
    },
    {
      id: 4,
      title: 'Python for Data Science',
      instructor: 'Sarah Wilson',
      category: 'Data Science',
      rating: 4.6,
      students: 1500,
      duration: '45 hours',
      price: 149,
      thumbnail: '/api/placeholder/300/200',
      description: 'Complete Python course focused on data analysis and machine learning.',
      level: 'Intermediate',
      language: 'English'
    },
    {
      id: 5,
      title: 'Startup Business Planning',
      instructor: 'David Brown',
      category: 'Entrepreneurship',
      rating: 4.5,
      students: 750,
      duration: '20 hours',
      price: 89,
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn how to create a comprehensive business plan for your startup.',
      level: 'Beginner',
      language: 'English'
    },
    {
      id: 6,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Lisa Chen',
      category: 'Programming',
      rating: 4.8,
      students: 980,
      duration: '30 hours',
      price: 119,
      thumbnail: '/api/placeholder/300/200',
      description: 'Deep dive into advanced JavaScript concepts and modern development practices.',
      level: 'Advanced',
      language: 'English'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Marketplace</h1>
        <p className="text-gray-600">
          Discover and enroll in courses created by verified instructors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {sortedCourses.length} of {courses.length} courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Thumbnail */}
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-blue-600 px-2 py-1 rounded text-sm font-medium">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-sm text-blue-600 font-medium">{course.category}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {course.rating} ({course.students} students)
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {course.instructor}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  ${course.price}
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="border border-blue-600 text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: Open payment modal
                      console.log('Enroll in course:', course.id);
                    }}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all categories.
          </p>
        </div>
      )}
    </div>
  );
}

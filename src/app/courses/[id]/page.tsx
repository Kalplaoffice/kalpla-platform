'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock course data - in real app, this would be fetched based on courseId
  const course = {
    id: courseId,
    title: 'Complete React Development Course',
    instructor: 'John Doe',
    category: 'Technology',
    rating: 4.8,
    students: 1250,
    duration: '40 hours',
    price: 99,
    thumbnail: '/api/placeholder/600/400',
    description: 'Learn React from scratch with hands-on projects and real-world applications. This comprehensive course covers everything from basic concepts to advanced patterns.',
    level: 'Beginner',
    language: 'English',
    lastUpdated: '2024-01-15',
    instructorBio: 'Senior Software Engineer with 8+ years of experience in React development. Previously worked at Google and Facebook.',
    instructorAvatar: '/api/placeholder/100/100',
    whatYouWillLearn: [
      'React fundamentals and core concepts',
      'Component lifecycle and state management',
      'Hooks and modern React patterns',
      'Routing and navigation',
      'State management with Redux',
      'Testing React applications',
      'Performance optimization',
      'Deployment and production setup'
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Node.js installed on your computer',
      'A code editor (VS Code recommended)',
      'Basic understanding of web development concepts'
    ],
    curriculum: [
      {
        section: 'Getting Started',
        lessons: [
          { title: 'Introduction to React', duration: '15 min', type: 'video' },
          { title: 'Setting up Development Environment', duration: '20 min', type: 'video' },
          { title: 'Your First React Component', duration: '25 min', type: 'video' }
        ]
      },
      {
        section: 'React Fundamentals',
        lessons: [
          { title: 'JSX and Components', duration: '30 min', type: 'video' },
          { title: 'Props and State', duration: '35 min', type: 'video' },
          { title: 'Event Handling', duration: '25 min', type: 'video' },
          { title: 'Conditional Rendering', duration: '20 min', type: 'video' }
        ]
      },
      {
        section: 'Advanced Concepts',
        lessons: [
          { title: 'React Hooks', duration: '45 min', type: 'video' },
          { title: 'Context API', duration: '30 min', type: 'video' },
          { title: 'Performance Optimization', duration: '40 min', type: 'video' },
          { title: 'Testing React Apps', duration: '50 min', type: 'video' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        student: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent course! The instructor explains complex concepts in a simple way. Highly recommended for beginners.',
        date: '2024-01-10'
      },
      {
        id: 2,
        student: 'Mike Chen',
        rating: 5,
        comment: 'Great hands-on projects and real-world examples. The course structure is well organized.',
        date: '2024-01-08'
      },
      {
        id: 3,
        student: 'Emily Davis',
        rating: 4,
        comment: 'Good course overall, but could use more advanced topics. Still learned a lot!',
        date: '2024-01-05'
      }
    ]
  };

  const handleEnroll = () => {
    // TODO: Implement enrollment functionality
    console.log('Enroll in course:', course.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/courses"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <HeartIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Video/Thumbnail */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg h-96 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/90 hover:bg-white rounded-full p-4 transition-colors">
                  <PlayIcon className="h-8 w-8 text-gray-900" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-sm text-blue-600 font-medium">{course.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{course.rating}</span>
                  <span className="ml-1 text-gray-600">({course.students} students)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                  {course.students} students
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Instructor: {course.instructor}</p>
                  <p className="text-sm text-gray-600">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">${course.price}</div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              <button
                onClick={handleEnroll}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
              >
                Enroll Now
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Mobile and desktop access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Course includes:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    <span>40 hours of video content</span>
                  </div>
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span>15 downloadable resources</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    <span>5 hands-on projects</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Last updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* What You'll Learn */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                  <div className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <div key={index} className="flex items-start">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">{section.section}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <PlayIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-900">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor}</h3>
                    <p className="text-gray-600 mb-4">{course.instructorBio}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>8+ years experience</span>
                      <span>•</span>
                      <span>Senior Software Engineer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.student}</h4>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

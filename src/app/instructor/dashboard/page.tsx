'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { 
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  StarIcon,
  BellIcon,
  CogIcon,
  PlayIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function InstructorDashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    setLoading(false);
  }, [user, router]);

  const stats = [
    { name: 'Active Courses', value: '5', icon: BookOpenIcon, color: 'blue', change: '+1 this month' },
    { name: 'Total Students', value: '245', icon: UserGroupIcon, color: 'green', change: '+32 this week' },
    { name: 'Course Rating', value: '4.8', icon: StarIcon, color: 'yellow', change: '+0.2 this month' },
    { name: 'Revenue Earned', value: '₹7,04,375', icon: CurrencyDollarIcon, color: 'purple', change: '+₹1,00,000 this month' }
  ];

  const activeCourses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      students: 89,
      rating: 4.9,
      revenue: '₹2,66,667',
      progress: 85,
      nextLesson: 'State Management with Redux',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      students: 67,
      rating: 4.7,
      revenue: '₹1,75,000',
      progress: 72,
      nextLesson: 'Async Programming Patterns',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      students: 45,
      rating: 4.8,
      revenue: '₹1,50,000',
      progress: 60,
      nextLesson: 'Express.js Fundamentals',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Full-Stack Web Development',
      students: 34,
      rating: 4.6,
      revenue: '₹1,12,500',
      progress: 45,
      nextLesson: 'Database Integration',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Review Student Submissions',
      course: 'React Development Course',
      dueDate: '2024-02-15',
      priority: 'high',
      type: 'grading'
    },
    {
      id: 2,
      title: 'Record Next Lesson',
      course: 'Advanced JavaScript',
      dueDate: '2024-02-16',
      priority: 'medium',
      type: 'content'
    },
    {
      id: 3,
      title: 'Update Course Materials',
      course: 'Node.js Backend',
      dueDate: '2024-02-18',
      priority: 'low',
      type: 'maintenance'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New student enrolled', course: 'React Development', student: 'John Doe', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Course published', course: 'Full-Stack Web Development', time: '1 day ago', type: 'success' },
    { id: 3, action: 'Student completed course', course: 'Advanced JavaScript', student: 'Sarah Johnson', time: '2 days ago', type: 'success' },
    { id: 4, action: 'Received payment', amount: '₹24,917', course: 'React Development', time: '3 days ago', type: 'success' }
  ];

  const studentFeedback = [
    {
      id: 1,
      student: 'Alex Chen',
      course: 'React Development',
      rating: 5,
      comment: 'Excellent course! Very well structured and easy to follow.',
      date: '2024-02-10'
    },
    {
      id: 2,
      student: 'Maria Rodriguez',
      course: 'Advanced JavaScript',
      rating: 4,
      comment: 'Great content, but could use more practical examples.',
      date: '2024-02-08'
    },
    {
      id: 3,
      student: 'David Kim',
      course: 'Node.js Backend',
      rating: 5,
      comment: 'Perfect pace and very comprehensive coverage.',
      date: '2024-02-05'
    }
  ];

  const achievements = [
    { id: 1, title: 'Top Instructor', description: 'Highest rated instructor this month', icon: TrophyIcon, earned: true },
    { id: 2, title: 'Course Creator', description: 'Created 10+ courses', icon: BookOpenIcon, earned: true },
    { id: 3, title: 'Student Success', description: 'Helped 500+ students', icon: UserGroupIcon, earned: false },
    { id: 4, title: 'Revenue Milestone', description: 'Earned ₹8.3L+ in revenue', icon: CurrencyDollarIcon, earned: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your instructor dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`bg-${stat.color}-100 rounded-lg p-3`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Active Courses</h3>
                <Link href="/instructor/course-builder" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Create New Course
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {activeCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{course.title}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">{course.students}</span> students
                          </div>
                          <div>
                            <span className="font-medium">{course.rating}</span> ⭐ rating
                          </div>
                          <div>
                            <span className="font-medium text-green-600">{course.revenue}</span> earned
                          </div>
                          <div>
                            <span className="font-medium">{course.progress}%</span> complete
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Next: {course.nextLesson}</p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <Link
                          href={`/instructor/course-builder/${course.id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/courses/${course.id}`}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                          <p className="text-xs text-gray-600">{task.course}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            {task.type}
                          </span>
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.course || activity.student}
                        {activity.amount && ` - ${activity.amount}`}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Feedback */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {studentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{feedback.student}</h4>
                        <p className="text-xs text-gray-600">{feedback.course}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-3 w-3 ${
                                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{feedback.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(feedback.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-3 rounded-lg border-2 ${
                achievement.earned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <achievement.icon className={`h-5 w-5 ${
                    achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/instructor/course-builder" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PlusIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Create Course</span>
            </Link>
            <Link href="/instructor/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </Link>
            <Link href="/instructor/grading" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PencilIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Grade Assignments</span>
            </Link>
            <Link href="/instructor/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AcademicCapIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

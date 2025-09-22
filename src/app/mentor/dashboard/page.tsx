'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { 
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  StarIcon,
  BellIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function MentorDashboardPage() {
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
    { name: 'Active Mentees', value: '8', icon: UserGroupIcon, color: 'blue', change: '+2 this month' },
    { name: 'Sessions Completed', value: '24', icon: CheckCircleIcon, color: 'green', change: '+6 this week' },
    { name: 'Rating', value: '4.9', icon: StarIcon, color: 'yellow', change: '+0.1 this month' },
    { name: 'Hours Mentored', value: '48', icon: ClockIcon, color: 'purple', change: '+12 this week' }
  ];

  const currentMentees = [
    {
      id: 1,
      name: 'Alex Chen',
      startup: 'TechFlow Solutions',
      phase: 'Phase 4-6: Development',
      nextSession: '2024-02-15',
      progress: 65,
      avatar: '/api/placeholder/50/50'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      startup: 'HealthTech Innovations',
      phase: 'Phase 7-9: Growth',
      nextSession: '2024-02-16',
      progress: 80,
      avatar: '/api/placeholder/50/50'
    },
    {
      id: 3,
      name: 'David Kim',
      startup: 'EduAI Platform',
      phase: 'Phase 1-3: Foundation',
      nextSession: '2024-02-18',
      progress: 35,
      avatar: '/api/placeholder/50/50'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      startup: 'FinTech Startup',
      phase: 'Phase 10-12: Scale',
      nextSession: '2024-02-20',
      progress: 90,
      avatar: '/api/placeholder/50/50'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentee: 'Alex Chen',
      startup: 'TechFlow Solutions',
      date: '2024-02-15',
      time: '2:00 PM',
      type: 'Strategy Session',
      status: 'confirmed'
    },
    {
      id: 2,
      mentee: 'Maria Rodriguez',
      startup: 'HealthTech Innovations',
      date: '2024-02-16',
      time: '10:00 AM',
      type: 'Product Review',
      status: 'confirmed'
    },
    {
      id: 3,
      mentee: 'David Kim',
      startup: 'EduAI Platform',
      date: '2024-02-18',
      time: '3:00 PM',
      type: 'Business Model',
      status: 'pending'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Completed session', mentee: 'Alex Chen', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Reviewed business plan', mentee: 'Maria Rodriguez', time: '1 day ago', type: 'info' },
    { id: 3, action: 'Provided feedback', mentee: 'David Kim', time: '2 days ago', type: 'info' },
    { id: 4, action: 'Connected with investor', mentee: 'Sarah Johnson', time: '3 days ago', type: 'success' }
  ];

  const achievements = [
    { id: 1, title: 'Top Mentor', description: 'Highest rated mentor this month', icon: TrophyIcon, earned: true },
    { id: 2, title: 'Session Master', description: 'Completed 50+ sessions', icon: ChatBubbleLeftRightIcon, earned: true },
    { id: 3, title: 'Startup Success', description: 'Helped 5 startups raise funding', icon: RocketLaunchIcon, earned: false },
    { id: 4, title: 'Knowledge Sharing', description: 'Shared 100+ resources', icon: DocumentTextIcon, earned: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
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
          {/* Current Mentees */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Current Mentees</h3>
                <Link href="/mentor/cohorts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentMentees.map((mentee) => (
                    <div key={mentee.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{mentee.name}</h4>
                        <p className="text-sm text-gray-600">{mentee.startup}</p>
                        <p className="text-xs text-blue-600">{mentee.phase}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{mentee.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${mentee.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Next session: {new Date(mentee.nextSession).toLocaleDateString()}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">{session.mentee}</h4>
                          <p className="text-xs text-gray-600">{session.startup}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.date).toLocaleDateString()} at {session.time}
                          </p>
                          <p className="text-xs text-blue-600">{session.type}</p>
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
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
                      <p className="text-sm text-gray-600">{activity.mentee}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/mentor/sessions" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Schedule Session</span>
            </Link>
            <Link href="/mentor/cohorts" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Cohorts</span>
            </Link>
            <Link href="/mentor/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </Link>
            <Link href="/mentor/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AcademicCapIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
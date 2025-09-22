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
  BuildingOfficeIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
  UserPlusIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function StudentKSMPDashboardPage() {
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
    { name: 'KSMP Phase', value: 'Phase 4-6', icon: RocketLaunchIcon, color: 'blue', change: 'Development Stage' },
    { name: 'Mentor Sessions', value: '8', icon: UserGroupIcon, color: 'green', change: '+2 this month' },
    { name: 'Startup Progress', value: '65%', icon: ChartBarIcon, color: 'purple', change: '+15% this week' },
    { name: 'Funding Raised', value: '₹20.8L', icon: CurrencyDollarIcon, color: 'yellow', change: '+₹4.2L this month' }
  ];

  const ksmpPhases = [
    {
      id: 1,
      title: 'Phase 1-3: Foundation',
      description: 'Business model validation and market research',
      status: 'completed',
      progress: 100,
      completedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Phase 4-6: Development',
      description: 'Product development and MVP creation',
      status: 'current',
      progress: 65,
      dueDate: '2024-03-15'
    },
    {
      id: 3,
      title: 'Phase 7-9: Growth',
      description: 'Market expansion and user acquisition',
      status: 'upcoming',
      progress: 0,
      startDate: '2024-03-16'
    },
    {
      id: 4,
      title: 'Phase 10-12: Scale',
      description: 'Scaling operations and fundraising',
      status: 'upcoming',
      progress: 0,
      startDate: '2024-06-01'
    }
  ];

  const currentStartup = {
    id: 1,
    name: 'TechFlow Solutions',
    description: 'AI-powered workflow automation for small businesses',
    stage: 'Phase 4-6: Development',
    progress: 65,
    mentor: 'Dr. Sarah Johnson',
    nextMilestone: 'MVP Launch',
    dueDate: '2024-03-15',
    funding: '₹20.8L',
    teamSize: 4,
    thumbnail: '/api/placeholder/300/200'
  };

  const upcomingMentorSessions = [
    {
      id: 1,
      mentor: 'Dr. Sarah Johnson',
      date: '2024-02-15',
      time: '2:00 PM',
      type: 'Product Development Review',
      status: 'confirmed',
      agenda: 'MVP features and technical architecture'
    },
    {
      id: 2,
      mentor: 'Mike Chen',
      date: '2024-02-18',
      time: '10:00 AM',
      type: 'Business Strategy',
      status: 'pending',
      agenda: 'Go-to-market strategy and pricing model'
    },
    {
      id: 3,
      mentor: 'David Kim',
      date: '2024-02-22',
      time: '3:00 PM',
      type: 'Funding Preparation',
      status: 'pending',
      agenda: 'Pitch deck review and investor outreach'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Completed mentor session', mentor: 'Dr. Sarah Johnson', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Updated business model', startup: 'TechFlow Solutions', time: '1 day ago', type: 'info' },
    { id: 3, action: 'Submitted milestone report', phase: 'Phase 4-6', time: '2 days ago', type: 'success' },
    { id: 4, action: 'Connected with investor', investor: 'Venture Capital Partners', time: '3 days ago', type: 'success' }
  ];

  const achievements = [
    { id: 1, title: 'Phase Completion', description: 'Completed Foundation Phase', icon: TrophyIcon, earned: true },
    { id: 2, title: 'MVP Development', description: 'Built first product prototype', icon: LightBulbIcon, earned: false },
    { id: 3, title: 'Mentor Excellence', description: 'Perfect mentor session attendance', icon: StarIcon, earned: true },
    { id: 4, title: 'Funding Milestone', description: 'Raised first ₹8.3L', icon: CurrencyDollarIcon, earned: true }
  ];

  const ksmpResources = [
    { id: 1, title: 'Business Model Canvas Template', type: 'Template', category: 'Planning' },
    { id: 2, title: 'Pitch Deck Best Practices', type: 'Guide', category: 'Presentation' },
    { id: 3, title: 'Market Research Framework', type: 'Framework', category: 'Research' },
    { id: 4, title: 'Legal Entity Setup Guide', type: 'Guide', category: 'Legal' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your KSMP dashboard.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">KSMP Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  KSMP Participant
                </span>
              </div>
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
          {/* Current Startup */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Current Startup</h3>
                <Link href="/student/ksmp" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </Link>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900">{currentStartup.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{currentStartup.description}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{currentStartup.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${currentStartup.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Mentor</p>
                        <p className="font-medium text-gray-900">{currentStartup.mentor}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Milestone</p>
                        <p className="font-medium text-gray-900">{currentStartup.nextMilestone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Funding Raised</p>
                        <p className="font-medium text-green-600">{currentStartup.funding}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Team Size</p>
                        <p className="font-medium text-gray-900">{currentStartup.teamSize} members</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Mentor Sessions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingMentorSessions.map((session) => (
                    <div key={session.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">{session.mentor}</h4>
                          <p className="text-xs text-gray-600">{session.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.date).toLocaleDateString()} at {session.time}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">{session.agenda}</p>
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

        {/* KSMP Phases */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">KSMP Phases Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {ksmpPhases.map((phase) => (
                <div key={phase.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                    phase.status === 'current' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {phase.status === 'completed' ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{phase.id}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">{phase.title}</h4>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                    {phase.status === 'current' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${phase.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {phase.status === 'completed' && phase.completedDate && (
                      <p className="text-xs text-green-600 mt-1">
                        Completed: {new Date(phase.completedDate).toLocaleDateString()}
                      </p>
                    )}
                    {phase.status === 'current' && phase.dueDate && (
                      <p className="text-xs text-blue-600 mt-1">
                        Due: {new Date(phase.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {phase.status === 'upcoming' && phase.startDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Starts: {new Date(phase.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
                        {activity.mentor || activity.startup || activity.phase || activity.investor}
                      </p>
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
              <h3 className="text-lg font-semibold text-gray-900">KSMP Achievements</h3>
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

        {/* KSMP Resources */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KSMP Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ksmpResources.map((resource) => (
              <div key={resource.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="text-sm font-medium text-gray-900">{resource.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{resource.type}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                  {resource.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/student/ksmp" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RocketLaunchIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">KSMP Program</span>
            </Link>
            <Link href="/mentors" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">My Mentors</span>
            </Link>
            <Link href="/investors" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BriefcaseIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Find Investors</span>
            </Link>
            <Link href="/student/payments" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CurrencyDollarIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Funding</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

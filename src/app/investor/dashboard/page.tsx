'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { 
  BuildingOfficeIcon,
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
  EyeIcon,
  DocumentTextIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function InvestorDashboardPage() {
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
    { name: 'Portfolio Companies', value: '12', icon: BuildingOfficeIcon, color: 'blue', change: '+2 this quarter' },
    { name: 'Total Investments', value: '₹20.8Cr', icon: CurrencyDollarIcon, color: 'green', change: '+₹4.2Cr this month' },
    { name: 'Active Deals', value: '5', icon: RocketLaunchIcon, color: 'purple', change: '+1 this week' },
    { name: 'Success Rate', value: '85%', icon: TrophyIcon, color: 'yellow', change: '+5% this year' }
  ];

  const portfolioCompanies = [
    {
      id: 1,
      name: 'HealthTech Solutions',
      sector: 'Healthcare',
      stage: 'Series A',
      investment: '₹41.7L',
      valuation: '₹4.2Cr',
      status: 'Active',
      lastUpdate: '2024-02-10',
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'FinFlow',
      sector: 'Fintech',
      stage: 'Seed',
      investment: '₹25L',
      valuation: '₹1.7Cr',
      status: 'Active',
      lastUpdate: '2024-02-08',
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'EduAI',
      sector: 'EdTech',
      stage: 'Pre-Seed',
      investment: '₹16.7L',
      valuation: '₹83.3L',
      status: 'Active',
      lastUpdate: '2024-02-05',
      thumbnail: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'GreenTech Innovations',
      sector: 'CleanTech',
      stage: 'Series B',
      investment: '₹83.3L',
      valuation: '₹8.3Cr',
      status: 'Active',
      lastUpdate: '2024-02-12',
      thumbnail: '/api/placeholder/60/60'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'KSMP Cohort 15 Demo Day',
      date: '2024-02-20',
      time: '2:00 PM EST',
      startups: 8,
      location: 'Virtual Event',
      type: 'demo'
    },
    {
      id: 2,
      title: 'Portfolio Company Board Meeting',
      date: '2024-02-22',
      time: '10:00 AM EST',
      company: 'HealthTech Solutions',
      location: 'San Francisco, CA',
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Investment Committee Meeting',
      date: '2024-02-25',
      time: '3:00 PM EST',
      agenda: 'Review new deal pipeline',
      location: 'Virtual Meeting',
      type: 'committee'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New investment made', company: 'GreenTech Innovations', amount: '₹83.3L', time: '2 days ago', type: 'success' },
    { id: 2, action: 'Board meeting completed', company: 'HealthTech Solutions', time: '1 week ago', type: 'info' },
    { id: 3, action: 'Due diligence started', company: 'AI Startup XYZ', time: '2 weeks ago', type: 'info' },
    { id: 4, action: 'Exit completed', company: 'TechFlow Inc', amount: '₹4.2Cr', time: '1 month ago', type: 'success' }
  ];

  const dealPipeline = [
    {
      id: 1,
      company: 'AI Startup XYZ',
      sector: 'AI/ML',
      stage: 'Series A',
      amount: '₹1.7Cr',
      status: 'Due Diligence',
      probability: '75%',
      expectedClose: '2024-03-15'
    },
    {
      id: 2,
      company: 'Blockchain Solutions',
      sector: 'Fintech',
      stage: 'Seed',
      amount: '₹41.7L',
      status: 'Term Sheet',
      probability: '60%',
      expectedClose: '2024-03-30'
    },
    {
      id: 3,
      company: 'MedTech Innovations',
      sector: 'Healthcare',
      stage: 'Pre-Seed',
      amount: '₹25L',
      status: 'Initial Review',
      probability: '40%',
      expectedClose: '2024-04-15'
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
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
          {/* Portfolio Companies */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Companies</h3>
                <Link href="/investor/portfolio" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {portfolioCompanies.map((company) => (
                    <div key={company.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-600">{company.sector} • {company.stage}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-green-600">Investment: {company.investment}</span>
                          <span className="text-xs text-blue-600">Valuation: {company.valuation}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last update: {new Date(company.lastUpdate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {company.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                          <p className="text-xs text-gray-600">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                          {event.startups && (
                            <p className="text-xs text-blue-600">{event.startups} startups</p>
                          )}
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          event.type === 'demo' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type}
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
          {/* Deal Pipeline */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Deal Pipeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dealPipeline.map((deal) => (
                  <div key={deal.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{deal.company}</h4>
                        <p className="text-xs text-gray-600">{deal.sector} • {deal.stage}</p>
                        <p className="text-xs text-green-600">Amount: {deal.amount}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expected close: {new Date(deal.expectedClose).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          deal.probability === '75%' ? 'bg-green-100 text-green-800' :
                          deal.probability === '60%' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.probability}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{deal.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                      <p className="text-sm text-gray-600">{activity.company}</p>
                      {activity.amount && (
                        <p className="text-sm text-green-600">{activity.amount}</p>
                      )}
                      <p className="text-xs text-gray-500">{activity.time}</p>
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
            <Link href="/investors/startups" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <EyeIcon className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Browse Startups</span>
            </Link>
            <Link href="/investor/demo-days" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Demo Days</span>
            </Link>
            <Link href="/investor/opportunities" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RocketLaunchIcon className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Opportunities</span>
            </Link>
            <Link href="/investor/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BuildingOfficeIcon className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
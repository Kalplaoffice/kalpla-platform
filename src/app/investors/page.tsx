'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  RocketLaunchIcon,
  EyeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Authenticator } from '@aws-amplify/ui-react';

export default function InvestorsPage() {
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const sectors = [
    'All',
    'Technology',
    'Healthcare',
    'Fintech',
    'E-commerce',
    'SaaS',
    'AI/ML',
    'CleanTech',
    'EdTech'
  ];

  const stages = [
    'All',
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+'
  ];

  const publicStats = [
    { name: 'Total Startups Graduated', value: '150+', icon: RocketLaunchIcon },
    { name: 'Total Funding Raised', value: '$2.5M+', icon: CurrencyDollarIcon },
    { name: 'Success Rate', value: '85%', icon: TrophyIcon },
    { name: 'Active Cohorts', value: '12', icon: UserGroupIcon }
  ];

  const upcomingDemoDays = [
    {
      id: 1,
      title: 'KSMP Cohort 15 Demo Day',
      date: '2024-03-15',
      time: '2:00 PM EST',
      startups: 8,
      location: 'Virtual Event',
      description: 'Presenting innovative startups from our latest cohort covering fintech, healthcare, and AI sectors.'
    },
    {
      id: 2,
      title: 'Spring Innovation Showcase',
      date: '2024-04-20',
      time: '1:00 PM EST',
      startups: 12,
      location: 'San Francisco, CA',
      description: 'Join us for our largest demo day featuring top-performing startups from multiple cohorts.'
    },
    {
      id: 3,
      title: 'TechStars Kalpla Partnership Demo',
      date: '2024-05-10',
      time: '3:00 PM EST',
      startups: 6,
      location: 'New York, NY',
      description: 'Exclusive showcase of startups from our partnership with TechStars accelerator program.'
    }
  ];

  const featuredStartups = [
    {
      id: 1,
      name: 'HealthTech Solutions',
      sector: 'Healthcare',
      stage: 'Series A',
      description: 'AI-powered diagnostic platform for early disease detection',
      funding: '$2.5M',
      investors: ['Sequoia Capital', 'Andreessen Horowitz'],
      status: 'Funded',
      cohort: 'KSMP Cohort 12'
    },
    {
      id: 2,
      name: 'FinFlow',
      sector: 'Fintech',
      stage: 'Seed',
      description: 'Blockchain-based payment processing for SMEs',
      funding: '$1.2M',
      investors: ['Y Combinator', 'First Round Capital'],
      status: 'Funded',
      cohort: 'KSMP Cohort 11'
    },
    {
      id: 3,
      name: 'EduAI',
      sector: 'EdTech',
      stage: 'Pre-Seed',
      description: 'Personalized learning platform using AI',
      funding: '$500K',
      investors: ['Angel Investors'],
      status: 'Seeking Funding',
      cohort: 'KSMP Cohort 13'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Investor <span className="text-yellow-300">Portal</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover investment opportunities from our network of innovative startups and entrepreneurs.
            </p>
          </div>
        </div>
      </div>

      {/* Public Stats */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {publicStats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-2">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Demo Days */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Demo Days</h2>
            <div className="space-y-6">
              {upcomingDemoDays.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {event.startups} startups
                        </div>
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Register to Attend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Startups */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Startups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStartups.map((startup) => (
                <div key={startup.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{startup.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{startup.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {startup.sector}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {startup.stage}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Funding: <span className="font-medium">{startup.funding}</span></div>
                    <div>Cohort: <span className="font-medium">{startup.cohort}</span></div>
                    <div>Status: <span className={`font-medium ${
                      startup.status === 'Funded' ? 'text-green-600' : 'text-yellow-600'
                    }`}>{startup.status}</span></div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Investor Benefits */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Investor Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our investor network to access detailed startup profiles, financials, and exclusive investment opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Early Access</h3>
              <p className="text-gray-600">
                Get first look at promising startups before they hit the market
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Access comprehensive financials, metrics, and growth projections
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Network Access</h3>
              <p className="text-gray-600">
                Connect with other investors and industry experts
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Events</h3>
              <p className="text-gray-600">
                Attend private demo days and networking events
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Record</h3>
              <p className="text-gray-600">
                Invest in startups with proven mentorship and support
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <LockClosedIcon className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confidentiality</h3>
              <p className="text-gray-600">
                Secure platform with NDA-protected information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Exclusive Investor Access
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our investor network to access detailed startup profiles, financials, and exclusive investment opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Authenticator>
              {({ signOut, user }) => {
                if (user) {
                  return (
                    <Link
                      href="/investors/dashboard"
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Access Investor Portal
                    </Link>
                  );
                }
                return (
                  <Link
                    href="/auth/signup?role=Investor"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Become an Investor
                  </Link>
                );
              }}
            </Authenticator>
            <Link
              href="/investors/apply"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Apply for Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

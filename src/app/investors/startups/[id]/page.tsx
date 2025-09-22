'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  TrophyIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function StartupDetailPage() {
  const params = useParams();
  const startupId = params.id;
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock startup data - in real app, this would be fetched based on startupId
  const startup = {
    id: startupId,
    name: 'HealthTech Solutions',
    tagline: 'AI-powered diagnostic platform for early disease detection',
    description: 'HealthTech Solutions is revolutionizing healthcare through advanced AI algorithms that can detect diseases in their early stages with unprecedented accuracy. Our platform combines machine learning with medical imaging to provide doctors with powerful diagnostic tools.',
    sector: 'Healthcare',
    stage: 'Series A',
    funding: 2500000,
    valuation: 15000000,
    employees: 25,
    founded: '2021',
    location: 'San Francisco, CA',
    website: 'https://healthtechsolutions.com',
    linkedin: 'https://linkedin.com/company/healthtechsolutions',
    thumbnail: '/api/placeholder/600/400',
    status: 'Funded',
    cohort: 'KSMP Cohort 12',
    founders: [
      {
        name: 'Dr. Sarah Chen',
        title: 'CEO & Co-founder',
        bio: 'Former Google Health researcher with 10+ years in medical AI',
        avatar: '/api/placeholder/100/100',
        linkedin: 'https://linkedin.com/in/sarahchen'
      },
      {
        name: 'Michael Rodriguez',
        title: 'CTO & Co-founder',
        bio: 'Ex-Microsoft engineer specializing in computer vision',
        avatar: '/api/placeholder/100/100',
        linkedin: 'https://linkedin.com/in/michaelrodriguez'
      }
    ],
    investors: [
      { name: 'Sequoia Capital', amount: 1500000, type: 'Lead' },
      { name: 'Andreessen Horowitz', amount: 1000000, type: 'Participant' }
    ],
    metrics: {
      revenue: 500000,
      growth: 150,
      customers: 50,
      retention: 95
    },
    milestones: [
      { date: '2021-01', event: 'Company founded' },
      { date: '2021-06', event: 'First AI model deployed' },
      { date: '2022-03', event: 'FDA approval for diagnostic tool' },
      { date: '2022-09', event: 'Series A funding closed' },
      { date: '2023-01', event: 'Expanded to 10 hospitals' }
    ],
    team: [
      { name: 'Dr. Sarah Chen', role: 'CEO', experience: '10+ years' },
      { name: 'Michael Rodriguez', role: 'CTO', experience: '8+ years' },
      { name: 'Dr. Lisa Wang', role: 'Chief Medical Officer', experience: '15+ years' },
      { name: 'James Kim', role: 'VP Engineering', experience: '12+ years' }
    ],
    reviews: [
      {
        id: 1,
        reviewer: 'Dr. John Smith',
        hospital: 'Mayo Clinic',
        rating: 5,
        comment: 'This platform has revolutionized our diagnostic capabilities. The accuracy is remarkable.',
        date: '2023-12-15'
      },
      {
        id: 2,
        reviewer: 'Dr. Maria Garcia',
        hospital: 'Johns Hopkins',
        rating: 5,
        comment: 'Excellent tool for early detection. Our patient outcomes have improved significantly.',
        date: '2023-11-20'
      }
    ]
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    console.log('Contact startup:', startup.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/investors"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Investors
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

      {/* Startup Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Startup Info */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg h-96 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">
                  {startup.sector}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 text-white">
                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-bold">
                  {startup.stage}
                </span>
              </div>
            </div>

            {/* Startup Details */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-sm text-green-600 font-medium">{startup.sector}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600">{startup.cohort}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{startup.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{startup.tagline}</p>
              <p className="text-gray-700 mb-4">{startup.description}</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                  ${startup.funding.toLocaleString()} raised
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                  {startup.employees} employees
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-1" />
                  Founded {startup.founded}
                </div>
                <div className="flex items-center text-gray-600">
                  <BuildingOfficeIcon className="h-5 w-5 mr-1" />
                  {startup.location}
                </div>
              </div>

              {/* Founders */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Founders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startup.founders.map((founder, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{founder.name}</p>
                        <p className="text-sm text-gray-600">{founder.title}</p>
                        <p className="text-xs text-gray-500">{founder.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Investment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">${startup.funding.toLocaleString()}</div>
                <p className="text-gray-600">Total Funding Raised</p>
                <div className="text-lg font-semibold text-green-600 mt-2">
                  Valuation: ${startup.valuation.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium">{startup.stage}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">{startup.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Employees</span>
                  <span className="font-medium">{startup.employees}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-medium">{startup.founded}</span>
                </div>
              </div>

              <button
                onClick={handleContact}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
              >
                Contact Startup
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Detailed financials available</span>
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Business plan & projections</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Growth metrics & KPIs</span>
                </div>
                <div className="flex items-center">
                  <TrophyIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Industry awards & recognition</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Investors</h3>
                <div className="space-y-2">
                  {startup.investors.map((investor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{investor.name}</span>
                      <div className="text-right">
                        <span className="font-medium">${investor.amount.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1">({investor.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Connect</h3>
                <div className="space-y-2">
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    Company Website
                  </a>
                  <a
                    href={startup.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
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
                      ? 'border-green-500 text-green-600'
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
                {/* Milestones */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Milestones</h3>
                  <div className="space-y-4">
                    {startup.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{milestone.event}</h4>
                          <p className="text-gray-600">{new Date(milestone.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {startup.team.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-gray-600">{member.role}</p>
                          <p className="text-sm text-gray-500">{member.experience}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Annual Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">${startup.metrics.revenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Growth Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{startup.metrics.growth}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <UserGroupIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">{startup.metrics.customers}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <TrophyIcon className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Retention Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{startup.metrics.retention}%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {startup.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.reviewer}</h4>
                        <p className="text-sm text-gray-600">{review.hospital}</p>
                      </div>
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
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
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

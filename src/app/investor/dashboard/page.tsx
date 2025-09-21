'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  BuildingOfficeIcon,
  CalendarIcon,
  StarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface FeaturedStartup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  currentPhase: number;
  totalPhases: number;
  status: 'fundraising' | 'growth' | 'development' | 'launched';
  industry: string;
  foundedYear: number;
  teamSize: number;
  fundingRaised?: number;
  fundingTarget?: number;
  valuation?: number;
  mentor: string;
  pitchVideoUrl?: string;
  demoDayDate?: string;
  isApproved: boolean;
}

interface DemoDay {
  id: string;
  title: string;
  startupId: string;
  startupName: string;
  date: string;
  time: string;
  duration: string;
  phase: number;
  mentor: string;
  joinLink?: string;
  status: 'upcoming' | 'live' | 'completed';
  attendees: number;
  maxAttendees: number;
  recordingUrl?: string;
}

export default function InvestorDashboard() {
  const { hasRole, user } = useRoleBasedAccess();
  
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [featuredStartups, setFeaturedStartups] = useState<FeaturedStartup[]>([]);
  const [upcomingDemoDays, setUpcomingDemoDays] = useState<DemoDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockFeaturedStartups: FeaturedStartup[] = [
      {
        id: 's1',
        name: 'TechFlow Solutions',
        tagline: 'AI-powered workflow automation for enterprises',
        description: 'Revolutionizing business processes with intelligent automation and machine learning',
        logo: '/api/placeholder/100/100',
        currentPhase: 8,
        totalPhases: 12,
        status: 'fundraising',
        industry: 'Enterprise Software',
        foundedYear: 2023,
        teamSize: 8,
        fundingRaised: 500000,
        fundingTarget: 2000000,
        valuation: 8000000,
        mentor: 'John Doe',
        pitchVideoUrl: 'https://example.com/pitch1.mp4',
        demoDayDate: '2024-02-15',
        isApproved: true
      },
      {
        id: 's2',
        name: 'GreenTech Innovations',
        tagline: 'Sustainable energy solutions for smart cities',
        description: 'Developing renewable energy technologies for urban infrastructure',
        logo: '/api/placeholder/100/100',
        currentPhase: 6,
        totalPhases: 12,
        status: 'growth',
        industry: 'Clean Technology',
        foundedYear: 2022,
        teamSize: 12,
        fundingRaised: 1200000,
        fundingTarget: 5000000,
        valuation: 15000000,
        mentor: 'Jane Smith',
        pitchVideoUrl: 'https://example.com/pitch2.mp4',
        demoDayDate: '2024-02-20',
        isApproved: true
      },
      {
        id: 's3',
        name: 'HealthTech Pro',
        tagline: 'Telemedicine platform for rural healthcare',
        description: 'Connecting rural patients with urban specialists through AI-powered telemedicine',
        logo: '/api/placeholder/100/100',
        currentPhase: 9,
        totalPhases: 12,
        status: 'fundraising',
        industry: 'Healthcare Technology',
        foundedYear: 2023,
        teamSize: 15,
        fundingRaised: 800000,
        fundingTarget: 3000000,
        valuation: 12000000,
        mentor: 'Mike Johnson',
        pitchVideoUrl: 'https://example.com/pitch3.mp4',
        demoDayDate: '2024-02-25',
        isApproved: true
      },
      {
        id: 's4',
        name: 'EduTech Solutions',
        tagline: 'Personalized learning platform for K-12 education',
        description: 'Adaptive learning technology that personalizes education for every student',
        logo: '/api/placeholder/100/100',
        currentPhase: 7,
        totalPhases: 12,
        status: 'development',
        industry: 'Education Technology',
        foundedYear: 2023,
        teamSize: 10,
        fundingRaised: 300000,
        fundingTarget: 1500000,
        valuation: 5000000,
        mentor: 'Sarah Wilson',
        pitchVideoUrl: 'https://example.com/pitch4.mp4',
        demoDayDate: '2024-03-01',
        isApproved: false
      }
    ];

    const mockDemoDays: DemoDay[] = [
      {
        id: 'dd1',
        title: 'TechFlow Solutions Demo Day',
        startupId: 's1',
        startupName: 'TechFlow Solutions',
        date: '2024-02-15',
        time: '2:00 PM',
        duration: '2 hours',
        phase: 8,
        mentor: 'John Doe',
        joinLink: 'https://zoom.us/j/demo1',
        status: 'upcoming',
        attendees: 45,
        maxAttendees: 100
      },
      {
        id: 'dd2',
        title: 'GreenTech Innovations Demo Day',
        startupId: 's2',
        startupName: 'GreenTech Innovations',
        date: '2024-02-20',
        time: '3:00 PM',
        duration: '2 hours',
        phase: 6,
        mentor: 'Jane Smith',
        joinLink: 'https://zoom.us/j/demo2',
        status: 'upcoming',
        attendees: 38,
        maxAttendees: 100
      },
      {
        id: 'dd3',
        title: 'HealthTech Pro Demo Day',
        startupId: 's3',
        startupName: 'HealthTech Pro',
        date: '2024-02-25',
        time: '4:00 PM',
        duration: '2 hours',
        phase: 9,
        mentor: 'Mike Johnson',
        joinLink: 'https://zoom.us/j/demo3',
        status: 'upcoming',
        attendees: 52,
        maxAttendees: 100
      },
      {
        id: 'dd4',
        title: 'EduTech Solutions Demo Day',
        startupId: 's4',
        startupName: 'EduTech Solutions',
        date: '2024-03-01',
        time: '2:00 PM',
        duration: '2 hours',
        phase: 7,
        mentor: 'Sarah Wilson',
        joinLink: 'https://zoom.us/j/demo4',
        status: 'upcoming',
        attendees: 29,
        maxAttendees: 100
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setFeaturedStartups(mockFeaturedStartups);
      setUpcomingDemoDays(mockDemoDays);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fundraising':
        return 'text-blue-600 bg-blue-100';
      case 'growth':
        return 'text-green-600 bg-green-100';
      case 'development':
        return 'text-yellow-600 bg-yellow-100';
      case 'launched':
        return 'text-purple-600 bg-purple-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      case 'live':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fundraising':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'growth':
        return <ChartBarIcon className="h-4 w-4" />;
      case 'development':
        return <ClockIcon className="h-4 w-4" />;
      case 'launched':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      case 'live':
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!isInvestor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the investor dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <InvestorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </InvestorLayout>
    );
  }

  return (
    <InvestorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="text-gray-600">Discover and connect with promising KSMP startups</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Featured Startups</p>
                <p className="text-2xl font-semibold text-gray-900">{featuredStartups.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Demo Days</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingDemoDays.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Funding Raised</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(featuredStartups.reduce((sum, startup) => sum + (startup.fundingRaised || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Team Size</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {featuredStartups.reduce((sum, startup) => sum + startup.teamSize, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured KSMP Startups */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured KSMP Startups</h2>
              <Link
                href="/investor/startups"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Startups
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStartups.map((startup) => (
                <div key={startup.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md font-semibold text-gray-900 truncate">{startup.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{startup.tagline}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                          {getStatusIcon(startup.status)}
                          <span className="ml-1">{startup.status}</span>
                        </span>
                        {startup.isApproved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{startup.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Industry:</span>
                      <span className="ml-1">{startup.industry}</span>
                    </div>
                    <div>
                      <span className="font-medium">Phase:</span>
                      <span className="ml-1">{startup.currentPhase}/{startup.totalPhases}</span>
                    </div>
                    <div>
                      <span className="font-medium">Team Size:</span>
                      <span className="ml-1">{startup.teamSize}</span>
                    </div>
                    <div>
                      <span className="font-medium">Founded:</span>
                      <span className="ml-1">{startup.foundedYear}</span>
                    </div>
                  </div>

                  {startup.fundingRaised && (
                    <div className="mb-3 p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Funding Raised:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(startup.fundingRaised)}</span>
                      </div>
                      {startup.fundingTarget && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">Funding Target:</span>
                          <span className="font-medium text-gray-900">{formatCurrency(startup.fundingTarget)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mentor: {startup.mentor}
                    </div>
                    <div className="flex space-x-2">
                      {startup.pitchVideoUrl && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <PlayIcon className="h-4 w-4 mr-1 inline" />
                          Pitch Video
                        </button>
                      )}
                      <Link
                        href={`/investor/profiles/${startup.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Demo Days */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Demo Days</h2>
              <Link
                href="/investor/demo-days"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Demo Days
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingDemoDays.map((demoDay) => (
                <div key={demoDay.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{demoDay.title}</h3>
                        <p className="text-sm text-gray-500">{demoDay.startupName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(demoDay.date)} at {demoDay.time} • {demoDay.duration} • Phase {demoDay.phase}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mentor: {demoDay.mentor} • {demoDay.attendees}/{demoDay.maxAttendees} attendees
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demoDay.status)}`}>
                        {getStatusIcon(demoDay.status)}
                        <span className="ml-1">{demoDay.status}</span>
                      </span>
                      {demoDay.joinLink && (
                        <a
                          href={demoDay.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Join Demo Day
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/investor/startups"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Featured Startups</h3>
                    <p className="text-xs text-gray-500">Discover top-performing startups</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/investor/demo-days"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Demo Day Schedules</h3>
                    <p className="text-xs text-gray-500">View upcoming presentations</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/investor/contact"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Contact Startups</h3>
                    <p className="text-xs text-gray-500">Connect with founders</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}

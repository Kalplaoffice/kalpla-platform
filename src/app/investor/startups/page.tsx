'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  BuildingOfficeIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlayIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
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
  location: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  keyMetrics: {
    revenue?: number;
    users?: number;
    growth?: number;
    mrr?: number;
  };
  milestones: Array<{
    title: string;
    date: string;
    description: string;
  }>;
}

export default function FeaturedStartupsPage() {
  const { hasRole } = useRoleBasedAccess();
  
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [startups, setStartups] = useState<FeaturedStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'fundraising' | 'growth' | 'development' | 'launched'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<FeaturedStartup | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStartups: FeaturedStartup[] = [
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
        isApproved: true,
        location: 'Bangalore, India',
        website: 'https://techflow.com',
        linkedin: 'https://linkedin.com/company/techflow',
        twitter: 'https://twitter.com/techflow',
        keyMetrics: {
          revenue: 120000,
          users: 1500,
          growth: 25,
          mrr: 10000
        },
        milestones: [
          {
            title: 'Product Launch',
            date: '2024-01-15',
            description: 'Successfully launched MVP with 100 beta users'
          },
          {
            title: 'First Funding Round',
            date: '2024-01-30',
            description: 'Raised $500K in seed funding from angel investors'
          }
        ]
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
        isApproved: true,
        location: 'Mumbai, India',
        website: 'https://greentech.com',
        linkedin: 'https://linkedin.com/company/greentech',
        twitter: 'https://twitter.com/greentech',
        keyMetrics: {
          revenue: 300000,
          users: 5000,
          growth: 40,
          mrr: 25000
        },
        milestones: [
          {
            title: 'Pilot Project',
            date: '2023-12-01',
            description: 'Completed pilot project with Mumbai Municipal Corporation'
          },
          {
            title: 'Series A Funding',
            date: '2024-01-10',
            description: 'Raised $1.2M in Series A funding'
          }
        ]
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
        isApproved: true,
        location: 'Delhi, India',
        website: 'https://healthtechpro.com',
        linkedin: 'https://linkedin.com/company/healthtechpro',
        twitter: 'https://twitter.com/healthtechpro',
        keyMetrics: {
          revenue: 200000,
          users: 8000,
          growth: 60,
          mrr: 15000
        },
        milestones: [
          {
            title: 'Platform Launch',
            date: '2023-11-15',
            description: 'Launched telemedicine platform in 5 rural districts'
          },
          {
            title: 'Partnership Agreement',
            date: '2024-01-20',
            description: 'Signed partnership with 10 rural hospitals'
          }
        ]
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
        isApproved: false,
        location: 'Chennai, India',
        website: 'https://edutechsolutions.com',
        linkedin: 'https://linkedin.com/company/edutechsolutions',
        twitter: 'https://twitter.com/edutechsolutions',
        keyMetrics: {
          revenue: 80000,
          users: 2000,
          growth: 35,
          mrr: 6000
        },
        milestones: [
          {
            title: 'Beta Launch',
            date: '2023-12-10',
            description: 'Launched beta version with 500 students'
          },
          {
            title: 'School Partnership',
            date: '2024-01-05',
            description: 'Partnered with 3 schools for pilot program'
          }
        ]
      },
      {
        id: 's5',
        name: 'FinTech Innovations',
        tagline: 'Blockchain-based payment solutions for SMEs',
        description: 'Secure and efficient payment processing for small and medium enterprises',
        logo: '/api/placeholder/100/100',
        currentPhase: 10,
        totalPhases: 12,
        status: 'launched',
        industry: 'Financial Technology',
        foundedYear: 2022,
        teamSize: 20,
        fundingRaised: 2000000,
        fundingTarget: 8000000,
        valuation: 25000000,
        mentor: 'David Brown',
        pitchVideoUrl: 'https://example.com/pitch5.mp4',
        demoDayDate: '2024-03-05',
        isApproved: true,
        location: 'Pune, India',
        website: 'https://fintechinnovations.com',
        linkedin: 'https://linkedin.com/company/fintechinnovations',
        twitter: 'https://twitter.com/fintechinnovations',
        keyMetrics: {
          revenue: 500000,
          users: 12000,
          growth: 80,
          mrr: 40000
        },
        milestones: [
          {
            title: 'Platform Launch',
            date: '2023-10-01',
            description: 'Launched payment platform with 1000 merchants'
          },
          {
            title: 'Series B Funding',
            date: '2024-01-15',
            description: 'Raised $2M in Series B funding'
          }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setStartups(mockStartups);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStartups = startups.filter(startup => {
    const matchesFilter = filter === 'all' || startup.status === filter;
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Featured Startups</h1>
            <p className="text-gray-600">Discover and connect with promising KSMP startups</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Startups</p>
                <p className="text-2xl font-semibold text-gray-900">{startups.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Funding Raised</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(startups.reduce((sum, startup) => sum + (startup.fundingRaised || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Team Size</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {startups.reduce((sum, startup) => sum + startup.teamSize, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved Startups</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {startups.filter(s => s.isApproved).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups by name, tagline, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Startups', count: startups.length },
                { key: 'fundraising', label: 'Fundraising', count: startups.filter(s => s.status === 'fundraising').length },
                { key: 'growth', label: 'Growth', count: startups.filter(s => s.status === 'growth').length },
                { key: 'development', label: 'Development', count: startups.filter(s => s.status === 'development').length },
                { key: 'launched', label: 'Launched', count: startups.filter(s => s.status === 'launched').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Startups Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Startup Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
                <div key={startup.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{startup.name}</h3>
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

                  {startup.keyMetrics && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {startup.keyMetrics.revenue && (
                          <div>
                            <span className="text-gray-600">Revenue:</span>
                            <span className="ml-1 font-medium">{formatCurrency(startup.keyMetrics.revenue)}</span>
                          </div>
                        )}
                        {startup.keyMetrics.users && (
                          <div>
                            <span className="text-gray-600">Users:</span>
                            <span className="ml-1 font-medium">{startup.keyMetrics.users.toLocaleString()}</span>
                          </div>
                        )}
                        {startup.keyMetrics.growth && (
                          <div>
                            <span className="text-gray-600">Growth:</span>
                            <span className="ml-1 font-medium">{startup.keyMetrics.growth}%</span>
                          </div>
                        )}
                        {startup.keyMetrics.mrr && (
                          <div>
                            <span className="text-gray-600">MRR:</span>
                            <span className="ml-1 font-medium">{formatCurrency(startup.keyMetrics.mrr)}</span>
                          </div>
                        )}
                      </div>
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
                          Pitch
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedStartup(startup);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Startup Detail Modal */}
        {showDetailModal && selectedStartup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedStartup.name}</h3>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          {selectedStartup.logo ? (
                            <img
                              src={selectedStartup.logo}
                              alt={selectedStartup.name}
                              className="h-24 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-medium text-gray-900">{selectedStartup.tagline}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedStartup.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStartup.status)}`}>
                            {getStatusIcon(selectedStartup.status)}
                            <span className="ml-1">{selectedStartup.status}</span>
                          </span>
                          {selectedStartup.isApproved && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Approved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                        <p className="text-sm text-gray-900">{selectedStartup.industry}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedStartup.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                        <p className="text-sm text-gray-900">{selectedStartup.foundedYear}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Team Size</label>
                        <p className="text-sm text-gray-900">{selectedStartup.teamSize}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">KSMP Phase</label>
                        <p className="text-sm text-gray-900">{selectedStartup.currentPhase}/{selectedStartup.totalPhases}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mentor</label>
                        <p className="text-sm text-gray-900">{selectedStartup.mentor}</p>
                      </div>
                    </div>

                    {/* Funding Information */}
                    {(selectedStartup.fundingRaised || selectedStartup.valuation) && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Funding Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedStartup.fundingRaised && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Funding Raised</label>
                              <p className="text-sm text-gray-900">{formatCurrency(selectedStartup.fundingRaised)}</p>
                            </div>
                          )}
                          {selectedStartup.fundingTarget && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Funding Target</label>
                              <p className="text-sm text-gray-900">{formatCurrency(selectedStartup.fundingTarget)}</p>
                            </div>
                          )}
                          {selectedStartup.valuation && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Valuation</label>
                              <p className="text-sm text-gray-900">{formatCurrency(selectedStartup.valuation)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Metrics */}
                    {selectedStartup.keyMetrics && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Key Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedStartup.keyMetrics.revenue && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Revenue</label>
                              <p className="text-sm text-gray-900">{formatCurrency(selectedStartup.keyMetrics.revenue)}</p>
                            </div>
                          )}
                          {selectedStartup.keyMetrics.users && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Users</label>
                              <p className="text-sm text-gray-900">{selectedStartup.keyMetrics.users.toLocaleString()}</p>
                            </div>
                          )}
                          {selectedStartup.keyMetrics.growth && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Growth Rate</label>
                              <p className="text-sm text-gray-900">{selectedStartup.keyMetrics.growth}%</p>
                            </div>
                          )}
                          {selectedStartup.keyMetrics.mrr && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Monthly Recurring Revenue</label>
                              <p className="text-sm text-gray-900">{formatCurrency(selectedStartup.keyMetrics.mrr)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {selectedStartup.milestones && selectedStartup.milestones.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Recent Milestones</h4>
                        <div className="space-y-3">
                          {selectedStartup.milestones.map((milestone, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-medium text-gray-900">{milestone.title}</h5>
                                <span className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {(selectedStartup.website || selectedStartup.linkedin || selectedStartup.twitter) && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Social Links</h4>
                        <div className="flex space-x-4">
                          {selectedStartup.website && (
                            <a
                              href={selectedStartup.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Website
                            </a>
                          )}
                          {selectedStartup.linkedin && (
                            <a
                              href={selectedStartup.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              LinkedIn
                            </a>
                          )}
                          {selectedStartup.twitter && (
                            <a
                              href={selectedStartup.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <Link
                        href={`/investor/profiles/${selectedStartup.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Full Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InvestorLayout>
  );
}

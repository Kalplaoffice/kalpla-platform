'use client';

import { useState, useEffect, Suspense } from 'react';
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
  ShieldCheckIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';


interface StartupProfile {
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
  mentorEmail: string;
  mentorPhone?: string;
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
    arr?: number;
    ltv?: number;
    cac?: number;
  };
  milestones: Array<{
    title: string;
    date: string;
    description: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    experience: string;
    linkedin?: string;
    photo?: string;
  }>;
  businessModel: string;
  marketSize: string;
  competitiveAdvantage: string;
  financialProjections: Array<{
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  useOfFunds: string;
  exitStrategy: string;
  risks: string;
  contactInfo: {
    email: string;
    phone?: string;
    address: string;
  };
}

interface InvestorAccess {
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  accessLevel: 'limited' | 'full';
  requestedDate: string;
}

function StartupProfilesContent() {
  const { hasRole } = useRoleBasedAccess();
  
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [startupProfiles, setStartupProfiles] = useState<StartupProfile[]>([]);
  const [investorAccess, setInvestorAccess] = useState<InvestorAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStartupProfiles: StartupProfile[] = [
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
        mentorEmail: 'john.doe@email.com',
        mentorPhone: '+91 98765 43210',
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
          mrr: 10000,
          arr: 120000,
          ltv: 5000,
          cac: 500
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
        ],
        team: [
          {
            name: 'Rahul Sharma',
            role: 'CEO & Co-founder',
            experience: '10+ years in enterprise software',
            linkedin: 'https://linkedin.com/in/rahulsharma',
            photo: '/api/placeholder/50/50'
          },
          {
            name: 'Priya Patel',
            role: 'CTO & Co-founder',
            experience: '8+ years in AI/ML',
            linkedin: 'https://linkedin.com/in/priyapatel',
            photo: '/api/placeholder/50/50'
          }
        ],
        businessModel: 'SaaS subscription model with enterprise licensing',
        marketSize: '$50B+ global workflow automation market',
        competitiveAdvantage: 'AI-powered automation with 90% accuracy',
        financialProjections: [
          { year: 2024, revenue: 500000, expenses: 300000, profit: 200000 },
          { year: 2025, revenue: 1500000, expenses: 800000, profit: 700000 },
          { year: 2026, revenue: 3000000, expenses: 1500000, profit: 1500000 }
        ],
        useOfFunds: 'Product development (40%), Sales & Marketing (35%), Team expansion (25%)',
        exitStrategy: 'Strategic acquisition by enterprise software companies',
        risks: 'Competition from established players, market adoption challenges',
        contactInfo: {
          email: 'contact@techflow.com',
          phone: '+91 98765 43210',
          address: 'Bangalore, India'
        }
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
        mentorEmail: 'jane.smith@email.com',
        mentorPhone: '+91 98765 43211',
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
          mrr: 25000,
          arr: 300000,
          ltv: 8000,
          cac: 800
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
        ],
        team: [
          {
            name: 'Mike Johnson',
            role: 'CEO & Co-founder',
            experience: '12+ years in clean energy',
            linkedin: 'https://linkedin.com/in/mikejohnson',
            photo: '/api/placeholder/50/50'
          },
          {
            name: 'Sarah Wilson',
            role: 'CTO & Co-founder',
            experience: '10+ years in renewable energy',
            linkedin: 'https://linkedin.com/in/sarahwilson',
            photo: '/api/placeholder/50/50'
          }
        ],
        businessModel: 'B2B sales with government contracts and enterprise partnerships',
        marketSize: '$100B+ global clean energy market',
        competitiveAdvantage: 'Proprietary energy storage technology',
        financialProjections: [
          { year: 2024, revenue: 800000, expenses: 500000, profit: 300000 },
          { year: 2025, revenue: 2500000, expenses: 1200000, profit: 1300000 },
          { year: 2026, revenue: 5000000, expenses: 2000000, profit: 3000000 }
        ],
        useOfFunds: 'R&D (45%), Market expansion (30%), Team scaling (25%)',
        exitStrategy: 'IPO or acquisition by energy conglomerates',
        risks: 'Regulatory changes, technology competition',
        contactInfo: {
          email: 'contact@greentech.com',
          phone: '+91 98765 43211',
          address: 'Mumbai, India'
        }
      }
    ];

    const mockInvestorAccess: InvestorAccess = {
      isApproved: true,
      approvalStatus: 'approved',
      approvalDate: '2024-01-15T00:00:00Z',
      accessLevel: 'full',
      requestedDate: '2024-01-10T00:00:00Z'
    };

    // Simulate API call
    setTimeout(() => {
      setStartupProfiles(mockStartupProfiles);
      setInvestorAccess(mockInvestorAccess);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
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
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
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
          <h1 className="text-2xl font-bold text-gray-900">Startup Profiles</h1>
          <p className="text-gray-600">Access detailed startup information and connect with founders</p>
        </div>

        {/* Investor Access Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Investor Access Status</h3>
                <p className="text-sm text-gray-600">Your access level to startup profiles</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(investorAccess?.approvalStatus || 'pending')}`}>
                {getStatusIcon(investorAccess?.approvalStatus || 'pending')}
                <span className="ml-1">{investorAccess?.approvalStatus || 'pending'}</span>
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {investorAccess?.isApproved ? 'Full Access' : 'Limited Access'}
              </p>
            </div>
          </div>
        </div>

        {/* Access Level Info */}
        {!investorAccess?.isApproved && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <LockClosedIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-md font-medium text-yellow-800">Limited Access</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You currently have limited access to startup profiles. To view full profiles, pitch videos, and contact information, 
                  please request approval from the Kalpla team.
                </p>
                <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                  Request Full Access
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Profiles</p>
                <p className="text-2xl font-semibold text-gray-900">{startupProfiles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved Startups</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {startupProfiles.filter(s => s.isApproved).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Funding Raised</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(startupProfiles.reduce((sum, startup) => sum + (startup.fundingRaised || 0), 0))}
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
                  {startupProfiles.reduce((sum, startup) => sum + startup.teamSize, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Startup Profiles */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Startup Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startupProfiles.map((startup) => (
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

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mentor: {startup.mentor}
                    </div>
                    <div className="flex space-x-2">
                      {startup.pitchVideoUrl && investorAccess?.isApproved && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <PlayIcon className="h-4 w-4 mr-1 inline" />
                          Pitch Video
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedStartup(startup);
                          setShowProfileModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Startup Profile Modal */}
        {showProfileModal && selectedStartup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowProfileModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedStartup.name}</h3>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          {selectedStartup.logo ? (
                            <img
                              src={selectedStartup.logo}
                              alt={selectedStartup.name}
                              className="h-32 w-32 rounded-lg object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-medium text-gray-900">{selectedStartup.tagline}</h4>
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

                    {/* Team Information */}
                    {selectedStartup.team && selectedStartup.team.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Team</h4>
                        <div className="space-y-3">
                          {selectedStartup.team.map((member, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {member.photo ? (
                                    <img
                                      src={member.photo}
                                      alt={member.name}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900">{member.name}</h5>
                                  <p className="text-sm text-gray-600">{member.role}</p>
                                  <p className="text-xs text-gray-500">{member.experience}</p>
                                </div>
                                {member.linkedin && (
                                  <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Business Information */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Business Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Business Model</label>
                          <p className="text-sm text-gray-900">{selectedStartup.businessModel}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Market Size</label>
                          <p className="text-sm text-gray-900">{selectedStartup.marketSize}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Competitive Advantage</label>
                          <p className="text-sm text-gray-900">{selectedStartup.competitiveAdvantage}</p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Projections */}
                    {selectedStartup.financialProjections && selectedStartup.financialProjections.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Financial Projections</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedStartup.financialProjections.map((projection, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{projection.year}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(projection.revenue)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(projection.expenses)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(projection.profit)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Investment Information */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Investment Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Use of Funds</label>
                          <p className="text-sm text-gray-900">{selectedStartup.useOfFunds}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Exit Strategy</label>
                          <p className="text-sm text-gray-900">{selectedStartup.exitStrategy}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Risks</label>
                          <p className="text-sm text-gray-900">{selectedStartup.risks}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {investorAccess?.isApproved && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="text-sm text-gray-900">{selectedStartup.contactInfo.email}</p>
                          </div>
                          {selectedStartup.contactInfo.phone && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Phone</label>
                              <p className="text-sm text-gray-900">{selectedStartup.contactInfo.phone}</p>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <p className="text-sm text-gray-900">{selectedStartup.contactInfo.address}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      {investorAccess?.isApproved && (
                        <Link
                          href={`/investor/contact?startup=${selectedStartup.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Contact Startup
                        </Link>
                      )}
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

export default function StartupProfilesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <StartupProfilesContent />
    </Suspense>
  );
}

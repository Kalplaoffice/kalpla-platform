'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  StarIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  SignalIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

interface InvestmentOpportunity {
  id: string;
  startupName: string;
  tagline: string;
  description: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
  fundingGoal: number;
  currentFunding: number;
  valuation: number;
  equityOffered: number;
  founders: {
    id: string;
    name: string;
    role: string;
    experience: string;
    avatar?: string;
  }[];
  ksmpPhase: number;
  ksmpCohort: string;
  mentor: {
    id: string;
    name: string;
    expertise: string;
    avatar?: string;
  };
  metrics: {
    revenue: number;
    users: number;
    growthRate: number;
    burnRate: number;
  };
  pitchVideo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  financialProjections?: string;
  status: 'open' | 'funded' | 'closed';
  deadline: string;
  minimumInvestment: number;
  maximumInvestment: number;
  investorCount: number;
  totalInvested: number;
  averageRating: number;
  totalRatings: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function InvestorOpportunitiesPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('open');
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockOpportunities: InvestmentOpportunity[] = [
      {
        id: 'o1',
        startupName: 'TechFlow Solutions',
        tagline: 'AI-powered workflow automation for enterprises',
        description: 'TechFlow Solutions is revolutionizing enterprise workflow management through advanced AI automation, helping companies reduce operational costs by 40% and increase productivity by 60%.',
        industry: 'Enterprise Software',
        stage: 'early',
        fundingGoal: 5000000,
        currentFunding: 1500000,
        valuation: 20000000,
        equityOffered: 25,
        founders: [
          { id: 'f1', name: 'Rahul Sharma', role: 'CEO', experience: 'Ex-Microsoft, 8 years in AI/ML' },
          { id: 'f2', name: 'Priya Patel', role: 'CTO', experience: 'Ex-Google, 6 years in enterprise software' }
        ],
        ksmpPhase: 8,
        ksmpCohort: 'KSMP Cohort 2023-09',
        mentor: {
          id: 'm1',
          name: 'Dr. Rajesh Kumar',
          expertise: 'Enterprise Technology & AI'
        },
        metrics: {
          revenue: 500000,
          users: 1500,
          growthRate: 25,
          burnRate: 80000
        },
        pitchVideo: 'https://s3.amazonaws.com/kalpla-pitches/techflow-pitch.mp4',
        pitchDeck: '/resources/techflow-pitch.pdf',
        businessPlan: '/resources/techflow-business-plan.pdf',
        financialProjections: '/resources/techflow-financials.xlsx',
        status: 'open',
        deadline: '2024-02-15',
        minimumInvestment: 100000,
        maximumInvestment: 1000000,
        investorCount: 8,
        totalInvested: 1500000,
        averageRating: 4.7,
        totalRatings: 12,
        tags: ['AI', 'Enterprise', 'Automation', 'SaaS'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'o2',
        startupName: 'GreenTech Innovations',
        tagline: 'Sustainable energy solutions for rural India',
        description: 'GreenTech Innovations is developing affordable solar energy solutions specifically designed for rural Indian households, with a focus on sustainability and accessibility.',
        industry: 'Clean Energy',
        stage: 'mvp',
        fundingGoal: 3000000,
        currentFunding: 800000,
        valuation: 12000000,
        equityOffered: 20,
        founders: [
          { id: 'f3', name: 'Mike Johnson', role: 'CEO', experience: 'Ex-Tesla, 10 years in renewable energy' },
          { id: 'f4', name: 'Sarah Wilson', role: 'COO', experience: 'Ex-Siemens, 7 years in operations' }
        ],
        ksmpPhase: 6,
        ksmpCohort: 'KSMP Cohort 2023-09',
        mentor: {
          id: 'm2',
          name: 'Dr. Anjali Mehta',
          expertise: 'Clean Energy & Sustainability'
        },
        metrics: {
          revenue: 200000,
          users: 800,
          growthRate: 35,
          burnRate: 60000
        },
        pitchVideo: 'https://s3.amazonaws.com/kalpla-pitches/greentech-pitch.mp4',
        pitchDeck: '/resources/greentech-pitch.pdf',
        businessPlan: '/resources/greentech-business-plan.pdf',
        financialProjections: '/resources/greentech-financials.xlsx',
        status: 'open',
        deadline: '2024-02-20',
        minimumInvestment: 50000,
        maximumInvestment: 500000,
        investorCount: 5,
        totalInvested: 800000,
        averageRating: 4.5,
        totalRatings: 8,
        tags: ['Clean Energy', 'Sustainability', 'Rural', 'Solar'],
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-21T11:15:00Z'
      },
      {
        id: 'o3',
        startupName: 'HealthConnect',
        tagline: 'Telemedicine platform connecting patients with specialists',
        description: 'HealthConnect is building a comprehensive telemedicine platform that connects patients in remote areas with specialized healthcare providers, improving access to quality healthcare.',
        industry: 'Healthcare',
        stage: 'growth',
        fundingGoal: 8000000,
        currentFunding: 3000000,
        valuation: 35000000,
        equityOffered: 15,
        founders: [
          { id: 'f5', name: 'Dr. Alex Brown', role: 'CEO', experience: 'Ex-Apollo Hospitals, 12 years in healthcare' },
          { id: 'f6', name: 'Lisa Chen', role: 'CTO', experience: 'Ex-IBM, 8 years in healthcare tech' }
        ],
        ksmpPhase: 10,
        ksmpCohort: 'KSMP Cohort 2023-06',
        mentor: {
          id: 'm3',
          name: 'Dr. Sanjay Gupta',
          expertise: 'Healthcare Technology & Telemedicine'
        },
        metrics: {
          revenue: 1200000,
          users: 5000,
          growthRate: 45,
          burnRate: 120000
        },
        pitchVideo: 'https://s3.amazonaws.com/kalpla-pitches/healthconnect-pitch.mp4',
        pitchDeck: '/resources/healthconnect-pitch.pdf',
        businessPlan: '/resources/healthconnect-business-plan.pdf',
        financialProjections: '/resources/healthconnect-financials.xlsx',
        status: 'open',
        deadline: '2024-02-25',
        minimumInvestment: 200000,
        maximumInvestment: 2000000,
        investorCount: 12,
        totalInvested: 3000000,
        averageRating: 4.8,
        totalRatings: 15,
        tags: ['Healthcare', 'Telemedicine', 'AI', 'Mobile'],
        createdAt: '2024-01-10T14:00:00Z',
        updatedAt: '2024-01-19T16:45:00Z'
      },
      {
        id: 'o4',
        startupName: 'EduTech Pro',
        tagline: 'Personalized learning platform for K-12 education',
        description: 'EduTech Pro is creating an AI-powered personalized learning platform that adapts to each student\'s learning style and pace, improving educational outcomes.',
        industry: 'EdTech',
        stage: 'early',
        fundingGoal: 4000000,
        currentFunding: 1200000,
        valuation: 18000000,
        equityOffered: 22,
        founders: [
          { id: 'f7', name: 'Emma Davis', role: 'CEO', experience: 'Ex-Khan Academy, 6 years in EdTech' },
          { id: 'f8', name: 'James Wilson', role: 'CTO', experience: 'Ex-Coursera, 8 years in learning platforms' }
        ],
        ksmpPhase: 7,
        ksmpCohort: 'KSMP Cohort 2024-01',
        mentor: {
          id: 'm4',
          name: 'Dr. Priya Singh',
          expertise: 'Educational Technology & AI'
        },
        metrics: {
          revenue: 300000,
          users: 2000,
          growthRate: 30,
          burnRate: 70000
        },
        pitchVideo: 'https://s3.amazonaws.com/kalpla-pitches/edutech-pitch.mp4',
        pitchDeck: '/resources/edutech-pitch.pdf',
        businessPlan: '/resources/edutech-business-plan.pdf',
        financialProjections: '/resources/edutech-financials.xlsx',
        status: 'open',
        deadline: '2024-03-01',
        minimumInvestment: 75000,
        maximumInvestment: 750000,
        investorCount: 6,
        totalInvested: 1200000,
        averageRating: 4.6,
        totalRatings: 10,
        tags: ['EdTech', 'AI', 'K-12', 'Personalization'],
        createdAt: '2024-01-20T12:00:00Z',
        updatedAt: '2024-01-21T09:30:00Z'
      },
      {
        id: 'o5',
        startupName: 'FinTech Solutions',
        tagline: 'Blockchain-based payment solutions for SMEs',
        description: 'FinTech Solutions is developing secure, blockchain-based payment solutions specifically designed for small and medium enterprises, reducing transaction costs and improving security.',
        industry: 'FinTech',
        stage: 'scale',
        fundingGoal: 10000000,
        currentFunding: 5000000,
        valuation: 50000000,
        equityOffered: 10,
        founders: [
          { id: 'f9', name: 'David Lee', role: 'CEO', experience: 'Ex-PayPal, 10 years in fintech' },
          { id: 'f10', name: 'Maria Garcia', role: 'CTO', experience: 'Ex-Stripe, 7 years in blockchain' }
        ],
        ksmpPhase: 12,
        ksmpCohort: 'KSMP Cohort 2023-06',
        mentor: {
          id: 'm5',
          name: 'Rajesh Agarwal',
          expertise: 'FinTech & Blockchain'
        },
        metrics: {
          revenue: 2500000,
          users: 10000,
          growthRate: 60,
          burnRate: 200000
        },
        pitchVideo: 'https://s3.amazonaws.com/kalpla-pitches/fintech-pitch.mp4',
        pitchDeck: '/resources/fintech-pitch.pdf',
        businessPlan: '/resources/fintech-business-plan.pdf',
        financialProjections: '/resources/fintech-financials.xlsx',
        status: 'funded',
        deadline: '2024-01-30',
        minimumInvestment: 500000,
        maximumInvestment: 5000000,
        investorCount: 20,
        totalInvested: 5000000,
        averageRating: 4.9,
        totalRatings: 25,
        tags: ['FinTech', 'Blockchain', 'SME', 'Payments'],
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-20T17:20:00Z'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || opportunity.industry === industryFilter;
    const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
    const matchesStatus = statusFilter === 'all' || opportunity.status === statusFilter;
    
    return matchesSearch && matchesIndustry && matchesStage && matchesStatus;
  });

  const openOpportunities = opportunities.filter(o => o.status === 'open');
  const fundedOpportunities = opportunities.filter(o => o.status === 'funded');
  const totalFundingGoal = opportunities.reduce((sum, o) => sum + o.fundingGoal, 0);
  const totalCurrentFunding = opportunities.reduce((sum, o) => sum + o.currentFunding, 0);

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
      month: 'short',
      year: 'numeric'
    });
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea':
        return 'text-gray-600 bg-gray-100';
      case 'mvp':
        return 'text-blue-600 bg-blue-100';
      case 'early':
        return 'text-green-600 bg-green-100';
      case 'growth':
        return 'text-purple-600 bg-purple-100';
      case 'scale':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'funded':
        return 'text-blue-600 bg-blue-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewDetails = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailModal(true);
  };

  if (!isInvestor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the investor opportunities page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
            <p className="text-gray-600">Discover and invest in promising startups from our KSMP program</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              My Investments
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Opportunities</p>
                <p className="text-2xl font-semibold text-gray-900">{openOpportunities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Funded Startups</p>
                <p className="text-2xl font-semibold text-gray-900">{fundedOpportunities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Funding Goal</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalFundingGoal)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Funding</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalCurrentFunding)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Industries</option>
                <option value="Enterprise Software">Enterprise Software</option>
                <option value="Clean Energy">Clean Energy</option>
                <option value="Healthcare">Healthcare</option>
                <option value="EdTech">EdTech</option>
                <option value="FinTech">FinTech</option>
              </select>
              
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stages</option>
                <option value="idea">Idea</option>
                <option value="mvp">MVP</option>
                <option value="early">Early Stage</option>
                <option value="growth">Growth Stage</option>
                <option value="scale">Scale Stage</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="funded">Funded</option>
                <option value="closed">Closed</option>
                <option value="all">All Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.startupName}</h3>
                    <p className="text-sm text-gray-600 mb-3">{opportunity.tagline}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
                        {opportunity.stage}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(opportunity.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">({opportunity.totalRatings})</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{opportunity.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Funding Goal</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(opportunity.fundingGoal)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Funding</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(opportunity.currentFunding)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valuation</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(opportunity.valuation)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Equity Offered</p>
                    <p className="font-semibold text-gray-900">{opportunity.equityOffered}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Funding Progress</span>
                    <span>{Math.round((opportunity.currentFunding / opportunity.fundingGoal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(opportunity.currentFunding / opportunity.fundingGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* KSMP Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-blue-900">KSMP Phase {opportunity.ksmpPhase}</p>
                      <p className="text-blue-700">{opportunity.ksmpCohort}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-700">Mentor: {opportunity.mentor.name}</p>
                      <p className="text-blue-600 text-xs">{opportunity.mentor.expertise}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {opportunity.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{opportunity.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Deadline: {formatDate(opportunity.deadline)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(opportunity)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">
              {searchTerm || industryFilter !== 'all' || stageFilter !== 'all' || statusFilter !== 'open'
                ? 'Try adjusting your search or filters.'
                : 'No investment opportunities are currently available.'}
            </p>
          </div>
        )}

        {/* Opportunity Detail Modal */}
        {showDetailModal && selectedOpportunity && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedOpportunity.startupName}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company Overview */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Company Overview</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Tagline</p>
                          <p className="text-sm text-gray-600">{selectedOpportunity.tagline}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Description</p>
                          <p className="text-sm text-gray-600">{selectedOpportunity.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Industry</p>
                          <p className="text-sm text-gray-600">{selectedOpportunity.industry}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Stage</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(selectedOpportunity.stage)}`}>
                            {selectedOpportunity.stage}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Funding Goal:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedOpportunity.fundingGoal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Current Funding:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedOpportunity.currentFunding)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Valuation:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedOpportunity.valuation)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Equity Offered:</span>
                          <span className="text-sm text-gray-900">{selectedOpportunity.equityOffered}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Min Investment:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedOpportunity.minimumInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Investment:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedOpportunity.maximumInvestment)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Founders */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Founders</h4>
                      <div className="space-y-3">
                        {selectedOpportunity.founders.map((founder) => (
                          <div key={founder.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{founder.name}</p>
                            <p className="text-sm text-gray-600">{founder.role}</p>
                            <p className="text-xs text-gray-500">{founder.experience}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(selectedOpportunity.metrics.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Users</p>
                          <p className="font-semibold text-gray-900">{selectedOpportunity.metrics.users.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Growth Rate</p>
                          <p className="font-semibold text-gray-900">{selectedOpportunity.metrics.growthRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Burn Rate</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(selectedOpportunity.metrics.burnRate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOpportunity.pitchVideo && (
                          <a
                            href={selectedOpportunity.pitchVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <VideoCameraIcon className="h-5 w-5 text-red-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Pitch Video</p>
                              <p className="text-xs text-gray-500">Watch the startup pitch</p>
                            </div>
                          </a>
                        )}
                        {selectedOpportunity.pitchDeck && (
                          <a
                            href={selectedOpportunity.pitchDeck}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Pitch Deck</p>
                              <p className="text-xs text-gray-500">Download presentation</p>
                            </div>
                          </a>
                        )}
                        {selectedOpportunity.businessPlan && (
                          <a
                            href={selectedOpportunity.businessPlan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <DocumentTextIcon className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Business Plan</p>
                              <p className="text-xs text-gray-500">Download business plan</p>
                            </div>
                          </a>
                        )}
                        {selectedOpportunity.financialProjections && (
                          <a
                            href={selectedOpportunity.financialProjections}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Financial Projections</p>
                              <p className="text-xs text-gray-500">Download financial model</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Investment Deadline: {formatDate(selectedOpportunity.deadline)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                        Contact Startup
                      </button>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Invest Now
                      </button>
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

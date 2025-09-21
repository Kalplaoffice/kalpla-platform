'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface PortfolioInvestment {
  id: string;
  startupId: string;
  startupName: string;
  tagline: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
  investmentAmount: number;
  equityPercentage: number;
  investmentDate: string;
  valuationAtInvestment: number;
  currentValuation: number;
  status: 'active' | 'exited' | 'written_off';
  exitDate?: string;
  exitValue?: number;
  exitMultiple?: number;
  founders: {
    id: string;
    name: string;
    role: string;
  }[];
  mentor: {
    id: string;
    name: string;
    expertise: string;
  };
  ksmpPhase: number;
  ksmpCohort: string;
  updates: {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'milestone' | 'funding' | 'product' | 'team' | 'other';
  }[];
  metrics: {
    revenue: number;
    users: number;
    growthRate: number;
    burnRate: number;
  };
  documents: {
    id: string;
    name: string;
    type: 'report' | 'financial' | 'update' | 'other';
    url: string;
    date: string;
  }[];
}

interface PortfolioSummary {
  totalInvestments: number;
  totalInvested: number;
  totalCurrentValue: number;
  totalExitedValue: number;
  averageReturn: number;
  bestPerformer: {
    name: string;
    return: number;
  };
  worstPerformer: {
    name: string;
    return: number;
  };
  activeInvestments: number;
  exitedInvestments: number;
  writtenOffInvestments: number;
}

export default function InvestorPortfolioPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [investments, setInvestments] = useState<PortfolioInvestment[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'exited' | 'written_off'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'return'>('date');
  const [selectedInvestment, setSelectedInvestment] = useState<PortfolioInvestment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockInvestments: PortfolioInvestment[] = [
      {
        id: 'inv1',
        startupId: 'o1',
        startupName: 'TechFlow Solutions',
        tagline: 'AI-powered workflow automation for enterprises',
        industry: 'Enterprise Software',
        stage: 'early',
        investmentAmount: 500000,
        equityPercentage: 2.5,
        investmentDate: '2023-09-15',
        valuationAtInvestment: 20000000,
        currentValuation: 28000000,
        status: 'active',
        founders: [
          { id: 'f1', name: 'Rahul Sharma', role: 'CEO' },
          { id: 'f2', name: 'Priya Patel', role: 'CTO' }
        ],
        mentor: {
          id: 'm1',
          name: 'Dr. Rajesh Kumar',
          expertise: 'Enterprise Technology & AI'
        },
        ksmpPhase: 8,
        ksmpCohort: 'KSMP Cohort 2023-09',
        updates: [
          {
            id: 'u1',
            title: 'Series A Funding Round',
            description: 'Successfully raised ₹2.5M in Series A funding',
            date: '2024-01-15',
            type: 'funding'
          },
          {
            id: 'u2',
            title: 'Product Launch',
            description: 'Launched AI workflow automation platform',
            date: '2024-01-10',
            type: 'product'
          }
        ],
        metrics: {
          revenue: 800000,
          users: 2500,
          growthRate: 35,
          burnRate: 100000
        },
        documents: [
          { id: 'd1', name: 'Q4 2023 Report', type: 'report', url: '/reports/techflow-q4-2023.pdf', date: '2024-01-01' },
          { id: 'd2', name: 'Financial Statements', type: 'financial', url: '/financials/techflow-2023.pdf', date: '2023-12-31' }
        ]
      },
      {
        id: 'inv2',
        startupId: 'o2',
        startupName: 'GreenTech Innovations',
        tagline: 'Sustainable energy solutions for rural India',
        industry: 'Clean Energy',
        stage: 'mvp',
        investmentAmount: 300000,
        equityPercentage: 2.0,
        investmentDate: '2023-11-20',
        valuationAtInvestment: 15000000,
        currentValuation: 18000000,
        status: 'active',
        founders: [
          { id: 'f3', name: 'Mike Johnson', role: 'CEO' },
          { id: 'f4', name: 'Sarah Wilson', role: 'COO' }
        ],
        mentor: {
          id: 'm2',
          name: 'Dr. Anjali Mehta',
          expertise: 'Clean Energy & Sustainability'
        },
        ksmpPhase: 6,
        ksmpCohort: 'KSMP Cohort 2023-09',
        updates: [
          {
            id: 'u3',
            title: 'Pilot Program Success',
            description: 'Completed successful pilot in 5 rural villages',
            date: '2024-01-20',
            type: 'milestone'
          }
        ],
        metrics: {
          revenue: 400000,
          users: 1200,
          growthRate: 40,
          burnRate: 80000
        },
        documents: [
          { id: 'd3', name: 'Q4 2023 Report', type: 'report', url: '/reports/greentech-q4-2023.pdf', date: '2024-01-01' }
        ]
      },
      {
        id: 'inv3',
        startupId: 'o3',
        startupName: 'HealthConnect',
        tagline: 'Telemedicine platform connecting patients with specialists',
        industry: 'Healthcare',
        stage: 'growth',
        investmentAmount: 1000000,
        equityPercentage: 2.9,
        investmentDate: '2023-08-10',
        valuationAtInvestment: 35000000,
        currentValuation: 50000000,
        status: 'active',
        founders: [
          { id: 'f5', name: 'Dr. Alex Brown', role: 'CEO' },
          { id: 'f6', name: 'Lisa Chen', role: 'CTO' }
        ],
        mentor: {
          id: 'm3',
          name: 'Dr. Sanjay Gupta',
          expertise: 'Healthcare Technology & Telemedicine'
        },
        ksmpPhase: 10,
        ksmpCohort: 'KSMP Cohort 2023-06',
        updates: [
          {
            id: 'u4',
            title: 'Series B Funding',
            description: 'Raised ₹8M in Series B funding round',
            date: '2024-01-18',
            type: 'funding'
          },
          {
            id: 'u5',
            title: 'New Partnership',
            description: 'Partnership with major hospital chain',
            date: '2024-01-12',
            type: 'milestone'
          }
        ],
        metrics: {
          revenue: 2000000,
          users: 8000,
          growthRate: 50,
          burnRate: 150000
        },
        documents: [
          { id: 'd4', name: 'Q4 2023 Report', type: 'report', url: '/reports/healthconnect-q4-2023.pdf', date: '2024-01-01' },
          { id: 'd5', name: 'Financial Statements', type: 'financial', url: '/financials/healthconnect-2023.pdf', date: '2023-12-31' }
        ]
      },
      {
        id: 'inv4',
        startupId: 'o4',
        startupName: 'EduTech Pro',
        tagline: 'Personalized learning platform for K-12 education',
        industry: 'EdTech',
        stage: 'early',
        investmentAmount: 400000,
        equityPercentage: 2.2,
        investmentDate: '2023-12-05',
        valuationAtInvestment: 18000000,
        currentValuation: 22000000,
        status: 'active',
        founders: [
          { id: 'f7', name: 'Emma Davis', role: 'CEO' },
          { id: 'f8', name: 'James Wilson', role: 'CTO' }
        ],
        mentor: {
          id: 'm4',
          name: 'Dr. Priya Singh',
          expertise: 'Educational Technology & AI'
        },
        ksmpPhase: 7,
        ksmpCohort: 'KSMP Cohort 2024-01',
        updates: [
          {
            id: 'u6',
            title: 'Product Beta Launch',
            description: 'Launched beta version with 500 students',
            date: '2024-01-25',
            type: 'product'
          }
        ],
        metrics: {
          revenue: 500000,
          users: 3000,
          growthRate: 30,
          burnRate: 90000
        },
        documents: [
          { id: 'd6', name: 'Q4 2023 Report', type: 'report', url: '/reports/edutech-q4-2023.pdf', date: '2024-01-01' }
        ]
      },
      {
        id: 'inv5',
        startupId: 'o5',
        startupName: 'FinTech Solutions',
        tagline: 'Blockchain-based payment solutions for SMEs',
        industry: 'FinTech',
        stage: 'scale',
        investmentAmount: 2000000,
        equityPercentage: 4.0,
        investmentDate: '2023-06-15',
        valuationAtInvestment: 50000000,
        currentValuation: 75000000,
        status: 'exited',
        exitDate: '2024-01-30',
        exitValue: 3000000,
        exitMultiple: 1.5,
        founders: [
          { id: 'f9', name: 'David Lee', role: 'CEO' },
          { id: 'f10', name: 'Maria Garcia', role: 'CTO' }
        ],
        mentor: {
          id: 'm5',
          name: 'Rajesh Agarwal',
          expertise: 'FinTech & Blockchain'
        },
        ksmpPhase: 12,
        ksmpCohort: 'KSMP Cohort 2023-06',
        updates: [
          {
            id: 'u7',
            title: 'Successful Exit',
            description: 'Acquired by major fintech company',
            date: '2024-01-30',
            type: 'milestone'
          }
        ],
        metrics: {
          revenue: 5000000,
          users: 15000,
          growthRate: 60,
          burnRate: 200000
        },
        documents: [
          { id: 'd7', name: 'Exit Report', type: 'report', url: '/reports/fintech-exit.pdf', date: '2024-01-30' }
        ]
      }
    ];

    const mockPortfolioSummary: PortfolioSummary = {
      totalInvestments: 5,
      totalInvested: 4200000,
      totalCurrentValue: 19300000,
      totalExitedValue: 3000000,
      averageReturn: 85.2,
      bestPerformer: {
        name: 'FinTech Solutions',
        return: 150
      },
      worstPerformer: {
        name: 'EduTech Pro',
        return: 22
      },
      activeInvestments: 4,
      exitedInvestments: 1,
      writtenOffInvestments: 0
    };

    // Simulate API call
    setTimeout(() => {
      setInvestments(mockInvestments);
      setPortfolioSummary(mockPortfolioSummary);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInvestments = investments.filter(investment => {
    if (filter === 'all') return true;
    return investment.status === filter;
  });

  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime();
      case 'value':
        return b.currentValuation - a.currentValuation;
      case 'return':
        const aReturn = a.status === 'exited' ? (a.exitMultiple || 0) : (a.currentValuation / a.valuationAtInvestment);
        const bReturn = b.status === 'exited' ? (b.exitMultiple || 0) : (b.currentValuation / b.valuationAtInvestment);
        return bReturn - aReturn;
      default:
        return 0;
    }
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'exited':
        return 'text-blue-600 bg-blue-100';
      case 'written_off':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'exited':
        return <TrophyIcon className="h-4 w-4" />;
      case 'written_off':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const calculateReturn = (investment: PortfolioInvestment) => {
    if (investment.status === 'exited') {
      return investment.exitMultiple || 0;
    }
    return (investment.currentValuation / investment.valuationAtInvestment) * 100;
  };

  const getReturnColor = (returnValue: number) => {
    if (returnValue > 100) return 'text-green-600';
    if (returnValue > 50) return 'text-blue-600';
    if (returnValue > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReturnIcon = (returnValue: number) => {
    if (returnValue > 100) return <ArrowTrendingUpIcon className="h-4 w-4" />;
    if (returnValue > 0) return <ArrowUpIcon className="h-4 w-4" />;
    return <ArrowTrendingDownIcon className="h-4 w-4" />;
  };

  const handleViewDetails = (investment: PortfolioInvestment) => {
    setSelectedInvestment(investment);
    setShowDetailModal(true);
  };

  if (!isInvestor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the investor portfolio page.</p>
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

  if (!portfolioSummary) {
    return (
      <InvestorLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio data available</h3>
          <p className="text-gray-600">Unable to load portfolio data at this time.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600">Track your investments and portfolio performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/investor/opportunities"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              View Opportunities
            </Link>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Invested</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(portfolioSummary.totalInvested)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Value</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(portfolioSummary.totalCurrentValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Exited Value</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(portfolioSummary.totalExitedValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Return</p>
                <p className="text-2xl font-semibold text-gray-900">{portfolioSummary.averageReturn}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active</span>
                <span className="text-sm font-semibold text-gray-900">{portfolioSummary.activeInvestments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Exited</span>
                <span className="text-sm font-semibold text-gray-900">{portfolioSummary.exitedInvestments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Written Off</span>
                <span className="text-sm font-semibold text-gray-900">{portfolioSummary.writtenOffInvestments}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Performer</h3>
            <div className="text-center">
              <p className="text-sm text-gray-500">Startup</p>
              <p className="text-lg font-semibold text-gray-900">{portfolioSummary.bestPerformer.name}</p>
              <p className="text-sm text-green-600">+{portfolioSummary.bestPerformer.return}% return</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Worst Performer</h3>
            <div className="text-center">
              <p className="text-sm text-gray-500">Startup</p>
              <p className="text-lg font-semibold text-gray-900">{portfolioSummary.worstPerformer.name}</p>
              <p className="text-sm text-red-600">+{portfolioSummary.worstPerformer.return}% return</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Investments</option>
                <option value="active">Active</option>
                <option value="exited">Exited</option>
                <option value="written_off">Written Off</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="value">Sort by Value</option>
                <option value="return">Sort by Return</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investments List */}
        <div className="space-y-4">
          {sortedInvestments.map((investment) => {
            const returnValue = calculateReturn(investment);
            return (
              <div key={investment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{investment.startupName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                          {getStatusIcon(investment.status)}
                          <span className="ml-1">{investment.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{investment.tagline}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <p className="text-gray-500">Investment</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(investment.investmentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Equity</p>
                          <p className="font-semibold text-gray-900">{investment.equityPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Value</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(investment.currentValuation)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Return</p>
                          <div className="flex items-center">
                            <span className={`font-semibold ${getReturnColor(returnValue)}`}>
                              {returnValue.toFixed(1)}%
                            </span>
                            <span className="ml-1">
                              {getReturnIcon(returnValue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(investment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Recent Updates */}
                  {investment.updates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Updates</h4>
                      <div className="space-y-2">
                        {investment.updates.slice(0, 2).map((update) => (
                          <div key={update.id} className="flex items-center space-x-3 text-sm">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-gray-900">{update.title}</p>
                              <p className="text-gray-500">{update.description}</p>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {formatDate(update.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Invested: {formatDate(investment.investmentDate)}
                      {investment.exitDate && (
                        <span className="ml-2">Exited: {formatDate(investment.exitDate)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(investment)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        View Details
                        <EyeIcon className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedInvestments.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investments found</h3>
            <p className="text-gray-600">
              {filter !== 'all'
                ? 'No investments match the selected filter.'
                : 'You haven\'t made any investments yet.'}
            </p>
            <Link
              href="/investor/opportunities"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Investment Opportunities
            </Link>
          </div>
        )}

        {/* Investment Detail Modal */}
        {showDetailModal && selectedInvestment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedInvestment.startupName}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Investment Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Investment Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Investment Amount:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedInvestment.investmentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Equity Percentage:</span>
                          <span className="text-sm text-gray-900">{selectedInvestment.equityPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Investment Date:</span>
                          <span className="text-sm text-gray-900">{formatDate(selectedInvestment.investmentDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Valuation at Investment:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedInvestment.valuationAtInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Current Valuation:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedInvestment.currentValuation)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Return:</span>
                          <span className={`text-sm font-semibold ${getReturnColor(calculateReturn(selectedInvestment))}`}>
                            {calculateReturn(selectedInvestment).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Company Information</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Industry</p>
                          <p className="text-sm text-gray-600">{selectedInvestment.industry}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Stage</p>
                          <p className="text-sm text-gray-600">{selectedInvestment.stage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">KSMP Phase</p>
                          <p className="text-sm text-gray-600">Phase {selectedInvestment.ksmpPhase}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">KSMP Cohort</p>
                          <p className="text-sm text-gray-600">{selectedInvestment.ksmpCohort}</p>
                        </div>
                      </div>
                    </div>

                    {/* Founders */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Founders</h4>
                      <div className="space-y-3">
                        {selectedInvestment.founders.map((founder) => (
                          <div key={founder.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{founder.name}</p>
                            <p className="text-sm text-gray-600">{founder.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mentor */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Mentor</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{selectedInvestment.mentor.name}</p>
                        <p className="text-sm text-gray-600">{selectedInvestment.mentor.expertise}</p>
                      </div>
                    </div>

                    {/* Updates */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h4>
                      <div className="space-y-3">
                        {selectedInvestment.updates.map((update) => (
                          <div key={update.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">{update.title}</h5>
                              <span className="text-xs text-gray-500">{formatDate(update.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{update.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedInvestment.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(doc.date)}</p>
                            </div>
                          </a>
                        ))}
                      </div>
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

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  BanknotesIcon,
  ChartPieIcon,
  LineChartIcon
} from '@heroicons/react/24/outline';
import { investmentTrackingService, Investment, FundingRound, InvestmentPortfolio, InvestmentAnalytics, InvestmentFilters } from '@/lib/investmentTrackingService';
import { PortfolioTab, InvestmentsTab, RoundsTab, AnalyticsTab } from './components';
import { InvestmentModal, FundingRoundModal, InvestmentDetailsModal, RoundDetailsModal } from './modals';

export default function InvestmentTrackingPage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'investments' | 'rounds' | 'analytics'>('portfolio');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([]);
  const [portfolio, setPortfolio] = useState<InvestmentPortfolio | null>(null);
  const [analytics, setAnalytics] = useState<InvestmentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [selectedRound, setSelectedRound] = useState<FundingRound | null>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [filters, setFilters] = useState<InvestmentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvestmentData();
  }, []);

  const loadInvestmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [investmentsData, roundsData, portfolioData, analyticsData] = await Promise.all([
        investmentTrackingService.getInvestments('current_investor', filters),
        investmentTrackingService.getFundingRounds('current_startup'),
        investmentTrackingService.getInvestmentPortfolio('current_investor'),
        investmentTrackingService.getInvestmentAnalytics('current_investor')
      ]);

      setInvestments(investmentsData);
      setFundingRounds(roundsData);
      setPortfolio(portfolioData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading investment data:', error);
      setError('Failed to load investment data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestment = async (investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await investmentTrackingService.createInvestment(investmentData);
      await loadInvestmentData();
      setShowInvestmentModal(false);
    } catch (error) {
      console.error('Error creating investment:', error);
    }
  };

  const handleCreateFundingRound = async (roundData: Omit<FundingRound, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await investmentTrackingService.createFundingRound(roundData);
      await loadInvestmentData();
      setShowRoundModal(false);
    } catch (error) {
      console.error('Error creating funding round:', error);
    }
  };

  const handleUpdateInvestment = async (investmentId: string, updates: Partial<Investment>) => {
    try {
      await investmentTrackingService.updateInvestment(investmentId, updates);
      await loadInvestmentData();
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Investment Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investment Tracking</h1>
                <p className="text-gray-600">Track investments, funding rounds, and portfolio performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowInvestmentModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Investment
              </button>
              <button 
                onClick={() => setShowRoundModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Funding Round
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'portfolio', name: 'Portfolio Overview', icon: ChartPieIcon },
                { id: 'investments', name: 'Investments', icon: BanknotesIcon },
                { id: 'rounds', name: 'Funding Rounds', icon: BuildingOfficeIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <PortfolioTab portfolio={portfolio} />
        )}

        {activeTab === 'investments' && (
          <InvestmentsTab 
            investments={investments}
            onSelectInvestment={setSelectedInvestment}
            onUpdateInvestment={handleUpdateInvestment}
            filters={filters}
            onFiltersChange={setFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {activeTab === 'rounds' && (
          <RoundsTab 
            rounds={fundingRounds}
            onSelectRound={setSelectedRound}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab analytics={analytics} />
        )}

        {/* Modals */}
        {showInvestmentModal && (
          <InvestmentModal 
            onClose={() => setShowInvestmentModal(false)}
            onSave={handleCreateInvestment}
          />
        )}

        {showRoundModal && (
          <FundingRoundModal 
            onClose={() => setShowRoundModal(false)}
            onSave={handleCreateFundingRound}
          />
        )}

        {/* Investment Details Modal */}
        {selectedInvestment && (
          <InvestmentDetailsModal 
            investment={selectedInvestment}
            onClose={() => setSelectedInvestment(null)}
            onUpdate={handleUpdateInvestment}
          />
        )}

        {/* Round Details Modal */}
        {selectedRound && (
          <RoundDetailsModal 
            round={selectedRound}
            onClose={() => setSelectedRound(null)}
          />
        )}
      </div>
    </div>
  );
}

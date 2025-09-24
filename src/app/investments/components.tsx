import React from 'react';
import {
  ChartPieIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  BanknotesIcon,
  LineChartIcon
} from '@heroicons/react/24/outline';
import { investmentTrackingService, Investment, FundingRound, InvestmentPortfolio, InvestmentAnalytics } from '@/lib/investmentTrackingService';

// Portfolio Tab Component
function PortfolioTab({ portfolio }: { portfolio: InvestmentPortfolio | null }) {
  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <ChartPieIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Data</h3>
        <p className="text-gray-600">Portfolio data could not be loaded.</p>
      </div>
    );
  }

  const portfolioAllocation = JSON.parse(portfolio.portfolioAllocation as any);
  const sectorAllocation = JSON.parse(portfolio.sectorAllocation as any);
  const stageAllocation = JSON.parse(portfolio.stageAllocation as any);
  const geographyAllocation = JSON.parse(portfolio.geographyAllocation as any);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {investmentTrackingService.formatCurrency(portfolio.totalInvested, portfolio.currency)}
              </p>
              <p className="text-sm text-gray-600">Total Invested</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {investmentTrackingService.formatCurrency(portfolio.totalValue, portfolio.currency)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{portfolio.numberOfInvestments}</p>
              <p className="text-sm text-gray-600">Total Investments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{portfolio.averageReturn.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Average Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Return</span>
              <span className="text-lg font-semibold text-gray-900">
                {investmentTrackingService.formatCurrency(portfolio.totalReturn, portfolio.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IRR</span>
              <span className="text-lg font-semibold text-gray-900">
                {portfolio.irr ? `${portfolio.irr.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Multiple</span>
              <span className="text-lg font-semibold text-gray-900">
                {portfolio.multiple ? `${portfolio.multiple.toFixed(1)}x` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Investments</span>
              <span className="text-lg font-semibold text-gray-900">{portfolio.activeInvestments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Exited Investments</span>
              <span className="text-lg font-semibold text-gray-900">{portfolio.exitedInvestments}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Strategy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Strategy</span>
              <span className="text-sm text-gray-900">{portfolio.investmentStrategy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Risk Profile</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getRiskLevelColor(portfolio.riskProfile)}`}>
                {portfolio.riskProfile}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Target Returns</span>
              <span className="text-sm text-gray-900">{portfolio.targetReturns}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Investment Horizon</span>
              <span className="text-sm text-gray-900">{portfolio.investmentHorizon}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Liquidity Needs</span>
              <span className="text-sm text-gray-900">{portfolio.liquidityNeeds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h2>
          <div className="space-y-3">
            {Object.entries(sectorAllocation).map(([sector, amount]: [string, any]) => (
              <div key={sector} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{sector}</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(amount, portfolio.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage Allocation</h2>
          <div className="space-y-3">
            {Object.entries(stageAllocation).map(([stage, amount]: [string, any]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{stage.replace('_', ' ').toUpperCase()}</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(amount, portfolio.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geography Allocation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Geography Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(geographyAllocation).map(([geography, amount]: [string, any]) => (
            <div key={geography} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{geography}</span>
              <span className="text-sm text-gray-600">
                {investmentTrackingService.formatCurrency(amount, portfolio.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Investments Tab Component
function InvestmentsTab({ 
  investments, 
  onSelectInvestment,
  onUpdateInvestment,
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange
}: {
  investments: Investment[];
  onSelectInvestment: (investment: Investment) => void;
  onUpdateInvestment: (investmentId: string, updates: Partial<Investment>) => void;
  filters: InvestmentFilters;
  onFiltersChange: (filters: InvestmentFilters) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = searchTerm === '' || 
      investment.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.geography.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investment.roundName && investment.roundName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filters.status?.length === 0 || filters.status?.includes(investment.status);
    const matchesType = filters.investmentType?.length === 0 || filters.investmentType?.includes(investment.investmentType);
    const matchesStage = filters.investmentStage?.length === 0 || filters.investmentStage?.includes(investment.investmentStage);
    const matchesSector = filters.sector?.length === 0 || filters.sector?.includes(investment.sector);
    const matchesGeography = filters.geography?.length === 0 || filters.geography?.includes(investment.geography);
    const matchesRiskLevel = filters.riskLevel?.length === 0 || filters.riskLevel?.includes(investment.riskLevel);
    
    return matchesSearch && matchesStatus && matchesType && matchesStage && matchesSector && matchesGeography && matchesRiskLevel;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search investments..."
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Investments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestments.map((investment) => (
          <div key={investment.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{investment.startupName}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getStatusColor(investment.status)}`}>
                {investment.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(investment.amount, investment.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getInvestmentTypeColor(investment.investmentType)}`}>
                  {investment.investmentType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stage</span>
                <span className="text-sm font-medium text-gray-900">{investment.investmentStage.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sector</span>
                <span className="text-sm font-medium text-gray-900">{investment.sector}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getRiskLevelColor(investment.riskLevel)}`}>
                  {investment.riskLevel}
                </span>
              </div>
              {investment.equityPercentage && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Equity</span>
                  <span className="text-sm font-medium text-gray-900">{investment.equityPercentage}%</span>
                </div>
              )}
              {investment.valuation && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valuation</span>
                  <span className="text-sm font-medium text-gray-900">
                    {investmentTrackingService.formatCurrency(investment.valuation, investment.currency)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {investmentTrackingService.formatDate(investment.investmentDate)}
              </div>
              <button
                onClick={() => onSelectInvestment(investment)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredInvestments.length === 0 && (
        <div className="text-center py-12">
          <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Found</h3>
          <p className="text-gray-600">No investments match your current filters.</p>
        </div>
      )}
    </div>
  );
}

// Rounds Tab Component
function RoundsTab({ 
  rounds, 
  onSelectRound 
}: {
  rounds: FundingRound[];
  onSelectRound: (round: FundingRound) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.map((round) => (
          <div key={round.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{round.roundName}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getRoundStatusColor(round.status)}`}>
                {round.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-900">{round.roundType.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Target</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(round.targetAmount, round.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Raised</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(round.raisedAmount, round.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valuation</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(round.valuation, round.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {((round.raisedAmount / round.targetAmount) * 100).toFixed(1)}%
                </span>
              </div>
              {round.leadInvestor && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lead Investor</span>
                  <span className="text-sm font-medium text-gray-900">{round.leadInvestor}</span>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(round.raisedAmount / round.targetAmount) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {investmentTrackingService.formatDate(round.roundDate)}
              </div>
              <button
                onClick={() => onSelectRound(round)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {rounds.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Funding Rounds</h3>
          <p className="text-gray-600">No funding rounds have been created yet.</p>
        </div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ analytics }: { analytics: InvestmentAnalytics[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics.map((analytic) => (
          <div key={analytic.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{analytic.analyticsType.replace('_', ' ').toUpperCase()}</h3>
              <span className="text-sm text-gray-500">{analytic.period}</span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Investments</span>
                <span className="text-sm font-medium text-gray-900">{analytic.totalInvestments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Invested</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(analytic.totalInvested, 'INR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(analytic.totalValue, 'INR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Return</span>
                <span className="text-sm font-medium text-gray-900">
                  {investmentTrackingService.formatCurrency(analytic.totalReturn, 'INR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Return</span>
                <span className="text-sm font-medium text-gray-900">{analytic.averageReturn.toFixed(1)}%</span>
              </div>
              {analytic.irr && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IRR</span>
                  <span className="text-sm font-medium text-gray-900">{analytic.irr.toFixed(1)}%</span>
                </div>
              )}
              {analytic.multiple && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Multiple</span>
                  <span className="text-sm font-medium text-gray-900">{analytic.multiple.toFixed(1)}x</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="text-sm font-medium text-gray-900">{analytic.winRate.toFixed(1)}%</span>
              </div>
            </div>
            
            {analytic.insights.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {analytic.insights.slice(0, 3).map((insight, index) => (
                    <li key={index}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              {investmentTrackingService.formatDate(analytic.endDate)}
            </div>
          </div>
        ))}
      </div>
      
      {analytics.length === 0 && (
        <div className="text-center py-12">
          <BarChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Analytics data is not available yet.</p>
        </div>
      )}
    </div>
  );
}


// Export all components
export { PortfolioTab, InvestmentsTab, RoundsTab, AnalyticsTab };

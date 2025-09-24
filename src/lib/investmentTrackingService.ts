import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface Investment {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  investorRole: string;
  startupId: string;
  startupName: string;
  startupEmail: string;
  investmentType: 'equity' | 'convertible_note' | 'safe' | 'debt' | 'revenue_share' | 'hybrid' | 'other';
  investmentStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'late_stage' | 'pre_ipo';
  amount: number;
  currency: string;
  equityPercentage?: number;
  valuation?: number;
  investmentDate: string;
  closingDate?: string;
  status: 'committed' | 'invested' | 'active' | 'exited' | 'written_off' | 'pending' | 'cancelled';
  roundName?: string;
  roundType?: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'series_d' | 'series_e' | 'growth' | 'late_stage' | 'bridge' | 'convertible' | 'other';
  leadInvestor: boolean;
  coInvestors?: string[];
  investmentTerms: any;
  dueDiligence?: any;
  legalDocuments?: any[];
  boardSeat: boolean;
  boardSeats?: number;
  votingRights: boolean;
  antiDilution: boolean;
  liquidationPreference?: number;
  participationRights: boolean;
  tagAlongRights: boolean;
  dragAlongRights: boolean;
  informationRights: boolean;
  proRataRights: boolean;
  exitStrategy?: string;
  expectedReturn?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  sector: string;
  geography: string;
  notes?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface FundingRound {
  id: string;
  startupId: string;
  startupName: string;
  startupEmail: string;
  roundName: string;
  roundType: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'series_d' | 'series_e' | 'growth' | 'late_stage' | 'bridge' | 'convertible' | 'other';
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  valuation: number;
  preMoneyValuation?: number;
  postMoneyValuation?: number;
  roundDate: string;
  closingDate?: string;
  status: 'announced' | 'active' | 'oversubscribed' | 'closed' | 'cancelled' | 'delayed';
  leadInvestor?: string;
  leadInvestorAmount?: number;
  coInvestors: any[];
  minimumInvestment?: number;
  maximumInvestment?: number;
  useOfFunds: string;
  milestones: string[];
  timeline: string;
  documents?: any[];
  legalStructure?: string;
  sharePrice?: number;
  totalShares?: number;
  newShares?: number;
  dilutionPercentage?: number;
  antiDilution: boolean;
  liquidationPreference?: number;
  boardComposition?: any;
  votingRights?: any;
  informationRights?: any;
  exitStrategy?: string;
  expectedReturn?: number;
  riskAssessment?: any;
  sector: string;
  geography: string;
  notes?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentPortfolio {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  investorRole: string;
  portfolioName: string;
  description?: string;
  totalInvested: number;
  totalValue: number;
  currency: string;
  numberOfInvestments: number;
  activeInvestments: number;
  exitedInvestments: number;
  averageInvestment: number;
  averageReturn: number;
  totalReturn: number;
  irr?: number;
  multiple?: number;
  portfolioAllocation: any;
  sectorAllocation: any;
  stageAllocation: any;
  geographyAllocation: any;
  riskProfile: 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';
  investmentStrategy: string;
  targetReturns: number;
  investmentHorizon: string;
  liquidityNeeds: string;
  diversification: any;
  performanceMetrics: any;
  benchmarkComparison?: any;
  portfolioStatus: 'active' | 'inactive' | 'closed' | 'liquidated';
  lastUpdated: string;
  notes?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentAnalytics {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  investorRole: string;
  analyticsType: 'portfolio_performance' | 'sector_analysis' | 'stage_analysis' | 'geography_analysis' | 'risk_analysis' | 'benchmark_comparison' | 'peer_comparison' | 'market_analysis' | 'trend_analysis' | 'custom';
  period: string;
  startDate: string;
  endDate: string;
  totalInvestments: number;
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  averageReturn: number;
  irr?: number;
  multiple?: number;
  winRate: number;
  lossRate: number;
  averageHoldingPeriod: number;
  sectorPerformance: any;
  stagePerformance: any;
  geographyPerformance: any;
  riskMetrics: any;
  performanceAttribution: any;
  benchmarkComparison?: any;
  portfolioMetrics: any;
  marketMetrics?: any;
  peerComparison?: any;
  trends: any;
  insights: string[];
  recommendations: string[];
  alerts: string[];
  notes?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentFilters {
  status?: string[];
  investmentType?: string[];
  investmentStage?: string[];
  sector?: string[];
  geography?: string[];
  riskLevel?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

class InvestmentTrackingService {
  /**
   * Create investment
   */
  async createInvestment(investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment> {
    try {
      const result = await client.models.Investment.create({
        investorId: investmentData.investorId,
        investorName: investmentData.investorName,
        investorEmail: investmentData.investorEmail,
        investorRole: investmentData.investorRole,
        startupId: investmentData.startupId,
        startupName: investmentData.startupName,
        startupEmail: investmentData.startupEmail,
        investmentType: investmentData.investmentType,
        investmentStage: investmentData.investmentStage,
        amount: investmentData.amount,
        currency: investmentData.currency,
        equityPercentage: investmentData.equityPercentage,
        valuation: investmentData.valuation,
        investmentDate: investmentData.investmentDate,
        closingDate: investmentData.closingDate,
        status: investmentData.status,
        roundName: investmentData.roundName,
        roundType: investmentData.roundType,
        leadInvestor: investmentData.leadInvestor,
        coInvestors: investmentData.coInvestors,
        investmentTerms: JSON.stringify(investmentData.investmentTerms),
        dueDiligence: investmentData.dueDiligence ? JSON.stringify(investmentData.dueDiligence) : null,
        legalDocuments: investmentData.legalDocuments ? JSON.stringify(investmentData.legalDocuments) : null,
        boardSeat: investmentData.boardSeat,
        boardSeats: investmentData.boardSeats,
        votingRights: investmentData.votingRights,
        antiDilution: investmentData.antiDilution,
        liquidationPreference: investmentData.liquidationPreference,
        participationRights: investmentData.participationRights,
        tagAlongRights: investmentData.tagAlongRights,
        dragAlongRights: investmentData.dragAlongRights,
        informationRights: investmentData.informationRights,
        proRataRights: investmentData.proRataRights,
        exitStrategy: investmentData.exitStrategy,
        expectedReturn: investmentData.expectedReturn,
        riskLevel: investmentData.riskLevel,
        sector: investmentData.sector,
        geography: investmentData.geography,
        notes: investmentData.notes,
        tags: investmentData.tags,
        metadata: investmentData.metadata ? JSON.stringify(investmentData.metadata) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Investment created successfully:', result.data);
      return result.data as Investment;
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  }

  /**
   * Update investment
   */
  async updateInvestment(investmentId: string, updates: Partial<Investment>): Promise<Investment> {
    try {
      const updateData: any = {
        id: investmentId,
        updatedAt: new Date().toISOString()
      };

      if (updates.status) updateData.status = updates.status;
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.valuation) updateData.valuation = updates.valuation;
      if (updates.equityPercentage) updateData.equityPercentage = updates.equityPercentage;
      if (updates.closingDate) updateData.closingDate = updates.closingDate;
      if (updates.expectedReturn) updateData.expectedReturn = updates.expectedReturn;
      if (updates.exitStrategy) updateData.exitStrategy = updates.exitStrategy;
      if (updates.notes) updateData.notes = updates.notes;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.metadata) updateData.metadata = JSON.stringify(updates.metadata);

      const result = await client.models.Investment.update(updateData);

      console.log('Investment updated successfully:', result.data);
      return result.data as Investment;
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  }

  /**
   * Get investments for investor
   */
  async getInvestments(investorId: string, filters?: InvestmentFilters): Promise<Investment[]> {
    try {
      const result = await client.models.Investment.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      let investments = result.data as Investment[] || [];

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        investments = investments.filter(investment => filters.status!.includes(investment.status));
      }

      if (filters?.investmentType && filters.investmentType.length > 0) {
        investments = investments.filter(investment => filters.investmentType!.includes(investment.investmentType));
      }

      if (filters?.investmentStage && filters.investmentStage.length > 0) {
        investments = investments.filter(investment => filters.investmentStage!.includes(investment.investmentStage));
      }

      if (filters?.sector && filters.sector.length > 0) {
        investments = investments.filter(investment => filters.sector!.includes(investment.sector));
      }

      if (filters?.geography && filters.geography.length > 0) {
        investments = investments.filter(investment => filters.geography!.includes(investment.geography));
      }

      if (filters?.riskLevel && filters.riskLevel.length > 0) {
        investments = investments.filter(investment => filters.riskLevel!.includes(investment.riskLevel));
      }

      if (filters?.amountRange) {
        investments = investments.filter(investment => 
          investment.amount >= filters.amountRange!.min && 
          investment.amount <= filters.amountRange!.max
        );
      }

      if (filters?.dateRange) {
        investments = investments.filter(investment => {
          const investmentDate = new Date(investment.investmentDate);
          const startDate = new Date(filters.dateRange!.start);
          const endDate = new Date(filters.dateRange!.end);
          return investmentDate >= startDate && investmentDate <= endDate;
        });
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        investments = investments.filter(investment => 
          investment.startupName.toLowerCase().includes(searchLower) ||
          investment.sector.toLowerCase().includes(searchLower) ||
          investment.geography.toLowerCase().includes(searchLower) ||
          (investment.roundName && investment.roundName.toLowerCase().includes(searchLower))
        );
      }

      // Sort by investment date (newest first)
      investments.sort((a, b) => new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime());

      return investments;
    } catch (error) {
      console.error('Error getting investments:', error);
      return [];
    }
  }

  /**
   * Get funding rounds for startup
   */
  async getFundingRounds(startupId: string): Promise<FundingRound[]> {
    try {
      const result = await client.models.FundingRound.list({
        filter: {
          startupId: { eq: startupId }
        }
      });

      let rounds = result.data as FundingRound[] || [];

      // Sort by round date (newest first)
      rounds.sort((a, b) => new Date(b.roundDate).getTime() - new Date(a.roundDate).getTime());

      return rounds;
    } catch (error) {
      console.error('Error getting funding rounds:', error);
      return [];
    }
  }

  /**
   * Create funding round
   */
  async createFundingRound(roundData: Omit<FundingRound, 'id' | 'createdAt' | 'updatedAt'>): Promise<FundingRound> {
    try {
      const result = await client.models.FundingRound.create({
        startupId: roundData.startupId,
        startupName: roundData.startupName,
        startupEmail: roundData.startupEmail,
        roundName: roundData.roundName,
        roundType: roundData.roundType,
        targetAmount: roundData.targetAmount,
        raisedAmount: roundData.raisedAmount,
        currency: roundData.currency,
        valuation: roundData.valuation,
        preMoneyValuation: roundData.preMoneyValuation,
        postMoneyValuation: roundData.postMoneyValuation,
        roundDate: roundData.roundDate,
        closingDate: roundData.closingDate,
        status: roundData.status,
        leadInvestor: roundData.leadInvestor,
        leadInvestorAmount: roundData.leadInvestorAmount,
        coInvestors: JSON.stringify(roundData.coInvestors),
        minimumInvestment: roundData.minimumInvestment,
        maximumInvestment: roundData.maximumInvestment,
        useOfFunds: roundData.useOfFunds,
        milestones: roundData.milestones,
        timeline: roundData.timeline,
        documents: roundData.documents ? JSON.stringify(roundData.documents) : null,
        legalStructure: roundData.legalStructure,
        sharePrice: roundData.sharePrice,
        totalShares: roundData.totalShares,
        newShares: roundData.newShares,
        dilutionPercentage: roundData.dilutionPercentage,
        antiDilution: roundData.antiDilution,
        liquidationPreference: roundData.liquidationPreference,
        boardComposition: roundData.boardComposition ? JSON.stringify(roundData.boardComposition) : null,
        votingRights: roundData.votingRights ? JSON.stringify(roundData.votingRights) : null,
        informationRights: roundData.informationRights ? JSON.stringify(roundData.informationRights) : null,
        exitStrategy: roundData.exitStrategy,
        expectedReturn: roundData.expectedReturn,
        riskAssessment: roundData.riskAssessment ? JSON.stringify(roundData.riskAssessment) : null,
        sector: roundData.sector,
        geography: roundData.geography,
        notes: roundData.notes,
        tags: roundData.tags,
        metadata: roundData.metadata ? JSON.stringify(roundData.metadata) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Funding round created successfully:', result.data);
      return result.data as FundingRound;
    } catch (error) {
      console.error('Error creating funding round:', error);
      throw error;
    }
  }

  /**
   * Get investment portfolio
   */
  async getInvestmentPortfolio(investorId: string): Promise<InvestmentPortfolio | null> {
    try {
      const result = await client.models.InvestmentPortfolio.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      return result.data?.[0] as InvestmentPortfolio || null;
    } catch (error) {
      console.error('Error getting investment portfolio:', error);
      return null;
    }
  }

  /**
   * Update investment portfolio
   */
  async updateInvestmentPortfolio(investorId: string, portfolioData: Partial<InvestmentPortfolio>): Promise<InvestmentPortfolio> {
    try {
      const existingPortfolio = await this.getInvestmentPortfolio(investorId);
      
      if (existingPortfolio) {
        const updateData: any = {
          id: existingPortfolio.id,
          lastUpdated: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (portfolioData.totalInvested !== undefined) updateData.totalInvested = portfolioData.totalInvested;
        if (portfolioData.totalValue !== undefined) updateData.totalValue = portfolioData.totalValue;
        if (portfolioData.numberOfInvestments !== undefined) updateData.numberOfInvestments = portfolioData.numberOfInvestments;
        if (portfolioData.activeInvestments !== undefined) updateData.activeInvestments = portfolioData.activeInvestments;
        if (portfolioData.exitedInvestments !== undefined) updateData.exitedInvestments = portfolioData.exitedInvestments;
        if (portfolioData.averageInvestment !== undefined) updateData.averageInvestment = portfolioData.averageInvestment;
        if (portfolioData.averageReturn !== undefined) updateData.averageReturn = portfolioData.averageReturn;
        if (portfolioData.totalReturn !== undefined) updateData.totalReturn = portfolioData.totalReturn;
        if (portfolioData.irr !== undefined) updateData.irr = portfolioData.irr;
        if (portfolioData.multiple !== undefined) updateData.multiple = portfolioData.multiple;
        if (portfolioData.portfolioAllocation) updateData.portfolioAllocation = JSON.stringify(portfolioData.portfolioAllocation);
        if (portfolioData.sectorAllocation) updateData.sectorAllocation = JSON.stringify(portfolioData.sectorAllocation);
        if (portfolioData.stageAllocation) updateData.stageAllocation = JSON.stringify(portfolioData.stageAllocation);
        if (portfolioData.geographyAllocation) updateData.geographyAllocation = JSON.stringify(portfolioData.geographyAllocation);
        if (portfolioData.performanceMetrics) updateData.performanceMetrics = JSON.stringify(portfolioData.performanceMetrics);
        if (portfolioData.benchmarkComparison) updateData.benchmarkComparison = JSON.stringify(portfolioData.benchmarkComparison);

        const result = await client.models.InvestmentPortfolio.update(updateData);
        return result.data as InvestmentPortfolio;
      } else {
        // Create new portfolio
        const result = await client.models.InvestmentPortfolio.create({
          investorId: investorId,
          investorName: portfolioData.investorName || 'Investor',
          investorEmail: portfolioData.investorEmail || 'investor@example.com',
          investorRole: portfolioData.investorRole || 'investor',
          portfolioName: portfolioData.portfolioName || 'Main Portfolio',
          description: portfolioData.description,
          totalInvested: portfolioData.totalInvested || 0,
          totalValue: portfolioData.totalValue || 0,
          currency: portfolioData.currency || 'INR',
          numberOfInvestments: portfolioData.numberOfInvestments || 0,
          activeInvestments: portfolioData.activeInvestments || 0,
          exitedInvestments: portfolioData.exitedInvestments || 0,
          averageInvestment: portfolioData.averageInvestment || 0,
          averageReturn: portfolioData.averageReturn || 0,
          totalReturn: portfolioData.totalReturn || 0,
          irr: portfolioData.irr,
          multiple: portfolioData.multiple,
          portfolioAllocation: JSON.stringify(portfolioData.portfolioAllocation || {}),
          sectorAllocation: JSON.stringify(portfolioData.sectorAllocation || {}),
          stageAllocation: JSON.stringify(portfolioData.stageAllocation || {}),
          geographyAllocation: JSON.stringify(portfolioData.geographyAllocation || {}),
          riskProfile: portfolioData.riskProfile || 'moderate',
          investmentStrategy: portfolioData.investmentStrategy || 'Growth',
          targetReturns: portfolioData.targetReturns || 0,
          investmentHorizon: portfolioData.investmentHorizon || '5-7 years',
          liquidityNeeds: portfolioData.liquidityNeeds || 'Low',
          diversification: JSON.stringify(portfolioData.diversification || {}),
          performanceMetrics: JSON.stringify(portfolioData.performanceMetrics || {}),
          benchmarkComparison: portfolioData.benchmarkComparison ? JSON.stringify(portfolioData.benchmarkComparison) : null,
          portfolioStatus: portfolioData.portfolioStatus || 'active',
          lastUpdated: new Date().toISOString(),
          notes: portfolioData.notes,
          tags: portfolioData.tags || [],
          metadata: portfolioData.metadata ? JSON.stringify(portfolioData.metadata) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return result.data as InvestmentPortfolio;
      }
    } catch (error) {
      console.error('Error updating investment portfolio:', error);
      throw error;
    }
  }

  /**
   * Get investment analytics
   */
  async getInvestmentAnalytics(investorId: string, analyticsType?: string): Promise<InvestmentAnalytics[]> {
    try {
      let filter: any = {
        investorId: { eq: investorId }
      };

      if (analyticsType) {
        filter.analyticsType = { eq: analyticsType };
      }

      const result = await client.models.InvestmentAnalytics.list({
        filter: filter
      });

      let analytics = result.data as InvestmentAnalytics[] || [];

      // Sort by end date (newest first)
      analytics.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

      return analytics;
    } catch (error) {
      console.error('Error getting investment analytics:', error);
      return [];
    }
  }

  /**
   * Calculate portfolio metrics
   */
  async calculatePortfolioMetrics(investorId: string): Promise<any> {
    try {
      const investments = await this.getInvestments(investorId);
      
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;
      const exitedInvestments = investments.filter(inv => inv.status === 'exited').length;
      const averageInvestment = investments.length > 0 ? totalInvested / investments.length : 0;

      // Calculate sector allocation
      const sectorAllocation: { [key: string]: number } = {};
      investments.forEach(inv => {
        sectorAllocation[inv.sector] = (sectorAllocation[inv.sector] || 0) + inv.amount;
      });

      // Calculate stage allocation
      const stageAllocation: { [key: string]: number } = {};
      investments.forEach(inv => {
        stageAllocation[inv.investmentStage] = (stageAllocation[inv.investmentStage] || 0) + inv.amount;
      });

      // Calculate geography allocation
      const geographyAllocation: { [key: string]: number } = {};
      investments.forEach(inv => {
        geographyAllocation[inv.geography] = (geographyAllocation[inv.geography] || 0) + inv.amount;
      });

      return {
        totalInvested,
        numberOfInvestments: investments.length,
        activeInvestments,
        exitedInvestments,
        averageInvestment,
        sectorAllocation,
        stageAllocation,
        geographyAllocation
      };
    } catch (error) {
      console.error('Error calculating portfolio metrics:', error);
      return {
        totalInvested: 0,
        numberOfInvestments: 0,
        activeInvestments: 0,
        exitedInvestments: 0,
        averageInvestment: 0,
        sectorAllocation: {},
        stageAllocation: {},
        geographyAllocation: {}
      };
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'exited':
        return 'bg-blue-100 text-blue-800';
      case 'committed':
        return 'bg-yellow-100 text-yellow-800';
      case 'invested':
        return 'bg-green-100 text-green-800';
      case 'written_off':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get risk level color
   */
  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'very_high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get investment type color
   */
  getInvestmentTypeColor(type: string): string {
    switch (type) {
      case 'equity':
        return 'bg-blue-100 text-blue-800';
      case 'convertible_note':
        return 'bg-purple-100 text-purple-800';
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'debt':
        return 'bg-orange-100 text-orange-800';
      case 'revenue_share':
        return 'bg-pink-100 text-pink-800';
      case 'hybrid':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get round status color
   */
  getRoundStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-blue-100 text-blue-800';
      case 'oversubscribed':
        return 'bg-purple-100 text-purple-800';
      case 'announced':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delayed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const investmentTrackingService = new InvestmentTrackingService();

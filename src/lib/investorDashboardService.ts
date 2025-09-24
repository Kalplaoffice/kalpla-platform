import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface DemoDay {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  virtualLink?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  featuredStartups: string[];
  agenda: any[];
  speakers: any[];
  sponsors: any[];
  attendees: string[];
  registrationDeadline: string;
  maxAttendees?: number;
  currentAttendees: number;
  requirements?: string[];
  materials?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedStartup {
  id: string;
  startupName: string;
  description: string;
  industry: string;
  stage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'late_stage' | 'pre_ipo';
  fundingRaised?: number;
  fundingGoal?: number;
  valuation?: number;
  founders: any[];
  teamSize?: number;
  location: string;
  website?: string;
  pitchDeck?: string;
  demoVideo?: string;
  traction: any;
  marketSize?: number;
  competitiveAdvantage: string;
  businessModel: string;
  revenue?: number;
  growthRate?: number;
  keyMetrics: any;
  investmentHighlights: string[];
  risks: string[];
  useOfFunds: string;
  exitStrategy?: string;
  featuredDate: string;
  status: 'active' | 'featured' | 'funded' | 'inactive';
  investorInterest: string[];
  meetingsScheduled: any[];
  createdAt: string;
  updatedAt: string;
}

export interface InvestorMeeting {
  id: string;
  investorId: string;
  investorName: string;
  startupId: string;
  startupName: string;
  meetingType: 'pitch_meeting' | 'due_diligence' | 'follow_up' | 'negotiation' | 'closing';
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  agenda?: string;
  notes?: string;
  outcome?: string;
  followUpActions?: string[];
  meetingLink?: string;
  attendees: any[];
  createdAt: string;
  updatedAt: string;
}

export interface InvestorInterest {
  id: string;
  investorId: string;
  investorName: string;
  startupId: string;
  startupName: string;
  interestLevel: 'low' | 'medium' | 'high' | 'very_high';
  investmentAmount?: number;
  timeline?: string;
  conditions?: string[];
  notes?: string;
  status: 'expressed' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface InvestorDashboardData {
  upcomingDemoDays: DemoDay[];
  featuredStartups: FeaturedStartup[];
  scheduledMeetings: InvestorMeeting[];
  expressedInterests: InvestorInterest[];
  recentActivity: any[];
  analytics: {
    totalStartupsViewed: number;
    totalMeetingsScheduled: number;
    totalInterestsExpressed: number;
    averageInvestmentAmount: number;
    topIndustries: { industry: string; count: number }[];
    investmentStageDistribution: { stage: string; count: number }[];
  };
}

export interface StartupFilters {
  industry?: string[];
  stage?: string[];
  location?: string[];
  fundingRange?: {
    min: number;
    max: number;
  };
  teamSize?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

class InvestorDashboardService {
  /**
   * Get investor dashboard data
   */
  async getDashboardData(investorId: string): Promise<InvestorDashboardData> {
    try {
      const [upcomingDemoDays, featuredStartups, scheduledMeetings, expressedInterests] = await Promise.all([
        this.getUpcomingDemoDays(),
        this.getFeaturedStartups(),
        this.getScheduledMeetings(investorId),
        this.getExpressedInterests(investorId)
      ]);

      const analytics = await this.getInvestorAnalytics(investorId);
      const recentActivity = await this.getRecentActivity(investorId);

      return {
        upcomingDemoDays,
        featuredStartups,
        scheduledMeetings,
        expressedInterests,
        recentActivity,
        analytics
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {
        upcomingDemoDays: [],
        featuredStartups: [],
        scheduledMeetings: [],
        expressedInterests: [],
        recentActivity: [],
        analytics: {
          totalStartupsViewed: 0,
          totalMeetingsScheduled: 0,
          totalInterestsExpressed: 0,
          averageInvestmentAmount: 0,
          topIndustries: [],
          investmentStageDistribution: []
        }
      };
    }
  }

  /**
   * Get upcoming demo days
   */
  async getUpcomingDemoDays(): Promise<DemoDay[]> {
    try {
      const result = await client.models.DemoDay.list({
        filter: {
          status: { eq: 'upcoming' }
        }
      });

      return result.data as DemoDay[] || [];
    } catch (error) {
      console.error('Error getting upcoming demo days:', error);
      return [];
    }
  }

  /**
   * Get featured startups
   */
  async getFeaturedStartups(filters?: StartupFilters): Promise<FeaturedStartup[]> {
    try {
      let filter: any = {
        status: { eq: 'featured' }
      };

      if (filters?.industry && filters.industry.length > 0) {
        filter.industry = { in: filters.industry };
      }

      if (filters?.stage && filters.stage.length > 0) {
        filter.stage = { in: filters.stage };
      }

      const result = await client.models.FeaturedStartup.list({
        filter: filter
      });

      let startups = result.data as FeaturedStartup[] || [];

      // Apply additional filters
      if (filters?.location && filters.location.length > 0) {
        startups = startups.filter(startup => 
          filters.location!.some(loc => startup.location.toLowerCase().includes(loc.toLowerCase()))
        );
      }

      if (filters?.fundingRange) {
        startups = startups.filter(startup => 
          startup.fundingRaised && 
          startup.fundingRaised >= filters.fundingRange!.min &&
          startup.fundingRaised <= filters.fundingRange!.max
        );
      }

      if (filters?.teamSize) {
        startups = startups.filter(startup => 
          startup.teamSize && 
          startup.teamSize >= filters.teamSize!.min &&
          startup.teamSize <= filters.teamSize!.max
        );
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        startups = startups.filter(startup => 
          startup.startupName.toLowerCase().includes(searchLower) ||
          startup.description.toLowerCase().includes(searchLower) ||
          startup.industry.toLowerCase().includes(searchLower)
        );
      }

      return startups;
    } catch (error) {
      console.error('Error getting featured startups:', error);
      return [];
    }
  }

  /**
   * Get scheduled meetings for investor
   */
  async getScheduledMeetings(investorId: string): Promise<InvestorMeeting[]> {
    try {
      const result = await client.models.InvestorMeeting.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      return result.data as InvestorMeeting[] || [];
    } catch (error) {
      console.error('Error getting scheduled meetings:', error);
      return [];
    }
  }

  /**
   * Get expressed interests for investor
   */
  async getExpressedInterests(investorId: string): Promise<InvestorInterest[]> {
    try {
      const result = await client.models.InvestorInterest.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      return result.data as InvestorInterest[] || [];
    } catch (error) {
      console.error('Error getting expressed interests:', error);
      return [];
    }
  }

  /**
   * Schedule a meeting with startup
   */
  async scheduleMeeting(meetingData: Omit<InvestorMeeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvestorMeeting> {
    try {
      const result = await client.models.InvestorMeeting.create({
        investorId: meetingData.investorId,
        investorName: meetingData.investorName,
        startupId: meetingData.startupId,
        startupName: meetingData.startupName,
        meetingType: meetingData.meetingType,
        scheduledDate: meetingData.scheduledDate,
        duration: meetingData.duration,
        status: meetingData.status,
        agenda: meetingData.agenda,
        notes: meetingData.notes,
        outcome: meetingData.outcome,
        followUpActions: meetingData.followUpActions,
        meetingLink: meetingData.meetingLink,
        attendees: JSON.stringify(meetingData.attendees),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Meeting scheduled successfully:', result.data);
      return result.data as InvestorMeeting;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  /**
   * Express interest in startup
   */
  async expressInterest(interestData: Omit<InvestorInterest, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvestorInterest> {
    try {
      const result = await client.models.InvestorInterest.create({
        investorId: interestData.investorId,
        investorName: interestData.investorName,
        startupId: interestData.startupId,
        startupName: interestData.startupName,
        interestLevel: interestData.interestLevel,
        investmentAmount: interestData.investmentAmount,
        timeline: interestData.timeline,
        conditions: interestData.conditions,
        notes: interestData.notes,
        status: interestData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Interest expressed successfully:', result.data);
      return result.data as InvestorInterest;
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw error;
    }
  }

  /**
   * Update meeting status
   */
  async updateMeetingStatus(meetingId: string, status: string, notes?: string, outcome?: string): Promise<boolean> {
    try {
      const updateData: any = {
        id: meetingId,
        status: status,
        updatedAt: new Date().toISOString()
      };

      if (notes) updateData.notes = notes;
      if (outcome) updateData.outcome = outcome;

      const result = await client.models.InvestorMeeting.update(updateData);

      console.log('Meeting status updated successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error updating meeting status:', error);
      return false;
    }
  }

  /**
   * Update interest status
   */
  async updateInterestStatus(interestId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        id: interestId,
        status: status,
        updatedAt: new Date().toISOString()
      };

      if (notes) updateData.notes = notes;

      const result = await client.models.InvestorInterest.update(updateData);

      console.log('Interest status updated successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error updating interest status:', error);
      return false;
    }
  }

  /**
   * Get investor analytics
   */
  private async getInvestorAnalytics(investorId: string): Promise<any> {
    try {
      const [meetings, interests] = await Promise.all([
        this.getScheduledMeetings(investorId),
        this.getExpressedInterests(investorId)
      ]);

      const totalStartupsViewed = new Set([
        ...meetings.map(m => m.startupId),
        ...interests.map(i => i.startupId)
      ]).size;

      const totalMeetingsScheduled = meetings.length;
      const totalInterestsExpressed = interests.length;

      const investmentAmounts = interests
        .filter(i => i.investmentAmount)
        .map(i => i.investmentAmount!);
      const averageInvestmentAmount = investmentAmounts.length > 0 
        ? investmentAmounts.reduce((sum, amount) => sum + amount, 0) / investmentAmounts.length 
        : 0;

      // Get industry distribution
      const industryCount: { [key: string]: number } = {};
      meetings.forEach(meeting => {
        // This would need to be fetched from startup data
        // For now, using mock data
        const industry = 'Technology'; // Mock industry
        industryCount[industry] = (industryCount[industry] || 0) + 1;
      });

      const topIndustries = Object.entries(industryCount)
        .map(([industry, count]) => ({ industry, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get stage distribution
      const stageCount: { [key: string]: number } = {};
      meetings.forEach(meeting => {
        // This would need to be fetched from startup data
        // For now, using mock data
        const stage = 'seed'; // Mock stage
        stageCount[stage] = (stageCount[stage] || 0) + 1;
      });

      const investmentStageDistribution = Object.entries(stageCount)
        .map(([stage, count]) => ({ stage, count }))
        .sort((a, b) => b.count - a.count);

      return {
        totalStartupsViewed,
        totalMeetingsScheduled,
        totalInterestsExpressed,
        averageInvestmentAmount,
        topIndustries,
        investmentStageDistribution
      };
    } catch (error) {
      console.error('Error getting investor analytics:', error);
      return {
        totalStartupsViewed: 0,
        totalMeetingsScheduled: 0,
        totalInterestsExpressed: 0,
        averageInvestmentAmount: 0,
        topIndustries: [],
        investmentStageDistribution: []
      };
    }
  }

  /**
   * Get recent activity
   */
  private async getRecentActivity(investorId: string): Promise<any[]> {
    try {
      const [meetings, interests] = await Promise.all([
        this.getScheduledMeetings(investorId),
        this.getExpressedInterests(investorId)
      ]);

      const activities = [
        ...meetings.map(meeting => ({
          id: meeting.id,
          type: 'meeting',
          title: `Meeting with ${meeting.startupName}`,
          date: meeting.scheduledDate,
          status: meeting.status,
          description: `${meeting.meetingType.replace('_', ' ')} meeting`
        })),
        ...interests.map(interest => ({
          id: interest.id,
          type: 'interest',
          title: `Interest in ${interest.startupName}`,
          date: interest.createdAt,
          status: interest.status,
          description: `${interest.interestLevel} interest level`
        }))
      ];

      return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Register for demo day
   */
  async registerForDemoDay(demoDayId: string, investorId: string): Promise<boolean> {
    try {
      const demoDay = await client.models.DemoDay.get({ id: demoDayId });
      if (!demoDay.data) {
        throw new Error('Demo day not found');
      }

      const attendees = demoDay.data.attendees || [];
      if (attendees.includes(investorId)) {
        throw new Error('Already registered for this demo day');
      }

      const currentAttendees = demoDay.data.currentAttendees || 0;
      const maxAttendees = demoDay.data.maxAttendees;

      if (maxAttendees && currentAttendees >= maxAttendees) {
        throw new Error('Demo day is full');
      }

      await client.models.DemoDay.update({
        id: demoDayId,
        attendees: [...attendees, investorId],
        currentAttendees: currentAttendees + 1,
        updatedAt: new Date().toISOString()
      });

      console.log('Successfully registered for demo day');
      return true;
    } catch (error) {
      console.error('Error registering for demo day:', error);
      return false;
    }
  }

  /**
   * Get startup details
   */
  async getStartupDetails(startupId: string): Promise<FeaturedStartup | null> {
    try {
      const result = await client.models.FeaturedStartup.get({ id: startupId });
      return result.data as FeaturedStartup || null;
    } catch (error) {
      console.error('Error getting startup details:', error);
      return null;
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'upcoming':
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'live':
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'featured':
        return 'bg-purple-100 text-purple-800';
      case 'funded':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get interest level color
   */
  getInterestLevelColor(level: string): string {
    switch (level) {
      case 'very_high':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const investorDashboardService = new InvestorDashboardService();

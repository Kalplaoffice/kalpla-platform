import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface StartupProfile {
  id: string;
  startupName: string;
  description: string;
  industry: string;
  stage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'late_stage' | 'pre_ipo';
  foundedDate: string;
  location: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  pitchVideo?: string;
  pitchDeck?: string;
  demoVideo?: string;
  team: TeamMember[];
  founders: Founder[];
  advisors?: Advisor[];
  investors?: Investor[];
  funding: FundingInfo;
  traction: TractionData;
  metrics: MetricsData;
  milestones: Milestone[];
  updates: TractionUpdate[];
  socialMedia?: SocialMedia;
  contactInfo: ContactInfo;
  status: 'draft' | 'published' | 'archived' | 'suspended';
  visibility: 'public' | 'private' | 'investors_only';
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  startupId: string;
  startupName: string;
  name: string;
  role: string;
  position: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  phone?: string;
  expertise: string[];
  experience: Experience[];
  education: Education[];
  achievements?: string[];
  isFounder: boolean;
  isActive: boolean;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Founder {
  name: string;
  position: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  expertise: string[];
  experience: Experience[];
  education: Education[];
  achievements?: string[];
}

export interface Advisor {
  name: string;
  position: string;
  company?: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  expertise: string[];
  experience: Experience[];
}

export interface Investor {
  name: string;
  type: 'angel' | 'vc' | 'corporate' | 'government' | 'other';
  company?: string;
  amount?: number;
  round?: string;
  date?: string;
  linkedin?: string;
}

export interface FundingInfo {
  totalRaised: number;
  currentRound: string;
  fundingGoal: number;
  valuation?: number;
  investors: Investor[];
  rounds: FundingRound[];
}

export interface FundingRound {
  round: string;
  amount: number;
  date: string;
  investors: string[];
  valuation?: number;
}

export interface TractionData {
  users: number;
  revenue: number;
  growthRate: number;
  marketShare?: number;
  keyMetrics: KeyMetric[];
  milestones: Milestone[];
  updates: TractionUpdate[];
}

export interface KeyMetric {
  name: string;
  value: number;
  unit: string;
  growth: number;
  period: string;
}

export interface MetricsData {
  userMetrics: KeyMetric[];
  revenueMetrics: KeyMetric[];
  engagementMetrics: KeyMetric[];
  businessMetrics: KeyMetric[];
}

export interface Milestone {
  id: string;
  startupId: string;
  startupName: string;
  title: string;
  description: string;
  category: 'product_launch' | 'funding_round' | 'user_milestone' | 'revenue_milestone' | 'partnership' | 'team_milestone' | 'market_expansion' | 'product_update' | 'award' | 'recognition' | 'other';
  achievedDate: string;
  impact?: string;
  metrics: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TractionUpdate {
  id: string;
  startupId: string;
  startupName: string;
  title: string;
  description: string;
  category: 'user_growth' | 'revenue_growth' | 'product_launch' | 'partnership' | 'funding' | 'team_expansion' | 'market_expansion' | 'product_update' | 'achievement' | 'other';
  metrics: any;
  attachments?: any[];
  isPublic: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

export interface StartupProfileFilters {
  industry?: string[];
  stage?: string[];
  location?: string[];
  foundedYear?: {
    start: number;
    end: number;
  };
  teamSize?: {
    min: number;
    max: number;
  };
  fundingRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  featured?: boolean;
  verified?: boolean;
}

class StartupProfileService {
  /**
   * Create startup profile
   */
  async createProfile(profileData: Omit<StartupProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StartupProfile> {
    try {
      const result = await client.models.StartupProfile.create({
        startupName: profileData.startupName,
        description: profileData.description,
        industry: profileData.industry,
        stage: profileData.stage,
        foundedDate: profileData.foundedDate,
        location: profileData.location,
        website: profileData.website,
        logo: profileData.logo,
        coverImage: profileData.coverImage,
        pitchVideo: profileData.pitchVideo,
        pitchDeck: profileData.pitchDeck,
        demoVideo: profileData.demoVideo,
        team: JSON.stringify(profileData.team),
        founders: JSON.stringify(profileData.founders),
        advisors: profileData.advisors ? JSON.stringify(profileData.advisors) : null,
        investors: profileData.investors ? JSON.stringify(profileData.investors) : null,
        funding: JSON.stringify(profileData.funding),
        traction: JSON.stringify(profileData.traction),
        metrics: JSON.stringify(profileData.metrics),
        milestones: JSON.stringify(profileData.milestones),
        updates: JSON.stringify(profileData.updates),
        socialMedia: profileData.socialMedia ? JSON.stringify(profileData.socialMedia) : null,
        contactInfo: JSON.stringify(profileData.contactInfo),
        status: profileData.status,
        visibility: profileData.visibility,
        featured: profileData.featured,
        verified: profileData.verified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Startup profile created successfully:', result.data);
      return result.data as StartupProfile;
    } catch (error) {
      console.error('Error creating startup profile:', error);
      throw error;
    }
  }

  /**
   * Update startup profile
   */
  async updateProfile(profileId: string, updates: Partial<StartupProfile>): Promise<StartupProfile> {
    try {
      const updateData: any = {
        id: profileId,
        updatedAt: new Date().toISOString()
      };

      if (updates.startupName) updateData.startupName = updates.startupName;
      if (updates.description) updateData.description = updates.description;
      if (updates.industry) updateData.industry = updates.industry;
      if (updates.stage) updateData.stage = updates.stage;
      if (updates.location) updateData.location = updates.location;
      if (updates.website) updateData.website = updates.website;
      if (updates.logo) updateData.logo = updates.logo;
      if (updates.coverImage) updateData.coverImage = updates.coverImage;
      if (updates.pitchVideo) updateData.pitchVideo = updates.pitchVideo;
      if (updates.pitchDeck) updateData.pitchDeck = updates.pitchDeck;
      if (updates.demoVideo) updateData.demoVideo = updates.demoVideo;
      if (updates.team) updateData.team = JSON.stringify(updates.team);
      if (updates.founders) updateData.founders = JSON.stringify(updates.founders);
      if (updates.advisors) updateData.advisors = JSON.stringify(updates.advisors);
      if (updates.investors) updateData.investors = JSON.stringify(updates.investors);
      if (updates.funding) updateData.funding = JSON.stringify(updates.funding);
      if (updates.traction) updateData.traction = JSON.stringify(updates.traction);
      if (updates.metrics) updateData.metrics = JSON.stringify(updates.metrics);
      if (updates.milestones) updateData.milestones = JSON.stringify(updates.milestones);
      if (updates.updates) updateData.updates = JSON.stringify(updates.updates);
      if (updates.socialMedia) updateData.socialMedia = JSON.stringify(updates.socialMedia);
      if (updates.contactInfo) updateData.contactInfo = JSON.stringify(updates.contactInfo);
      if (updates.status) updateData.status = updates.status;
      if (updates.visibility) updateData.visibility = updates.visibility;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.verified !== undefined) updateData.verified = updates.verified;

      const result = await client.models.StartupProfile.update(updateData);

      console.log('Startup profile updated successfully:', result.data);
      return result.data as StartupProfile;
    } catch (error) {
      console.error('Error updating startup profile:', error);
      throw error;
    }
  }

  /**
   * Get startup profiles
   */
  async getProfiles(filters?: StartupProfileFilters): Promise<StartupProfile[]> {
    try {
      let filter: any = {};
      
      if (filters?.industry && filters.industry.length > 0) {
        filter.industry = { in: filters.industry };
      }
      
      if (filters?.stage && filters.stage.length > 0) {
        filter.stage = { in: filters.stage };
      }

      if (filters?.featured !== undefined) {
        filter.featured = { eq: filters.featured };
      }

      if (filters?.verified !== undefined) {
        filter.verified = { eq: filters.verified };
      }

      const result = await client.models.StartupProfile.list({
        filter: filter
      });

      let profiles = result.data as StartupProfile[] || [];

      // Apply additional filters
      if (filters?.location && filters.location.length > 0) {
        profiles = profiles.filter(profile => 
          filters.location!.some(loc => profile.location.toLowerCase().includes(loc.toLowerCase()))
        );
      }

      if (filters?.foundedYear) {
        profiles = profiles.filter(profile => {
          const foundedYear = new Date(profile.foundedDate).getFullYear();
          return foundedYear >= filters.foundedYear!.start && foundedYear <= filters.foundedYear!.end;
        });
      }

      if (filters?.teamSize) {
        profiles = profiles.filter(profile => {
          const teamSize = profile.team.length;
          return teamSize >= filters.teamSize!.min && teamSize <= filters.teamSize!.max;
        });
      }

      if (filters?.fundingRange) {
        profiles = profiles.filter(profile => {
          const funding = JSON.parse(profile.funding as any).totalRaised;
          return funding >= filters.fundingRange!.min && funding <= filters.fundingRange!.max;
        });
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        profiles = profiles.filter(profile => 
          profile.startupName.toLowerCase().includes(searchLower) ||
          profile.description.toLowerCase().includes(searchLower) ||
          profile.industry.toLowerCase().includes(searchLower)
        );
      }

      // Sort by featured and creation date
      profiles.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return profiles;
    } catch (error) {
      console.error('Error getting startup profiles:', error);
      return [];
    }
  }

  /**
   * Get startup profile by ID
   */
  async getProfileById(profileId: string): Promise<StartupProfile | null> {
    try {
      const result = await client.models.StartupProfile.get({ id: profileId });
      return result.data as StartupProfile || null;
    } catch (error) {
      console.error('Error getting profile by ID:', error);
      return null;
    }
  }

  /**
   * Add team member
   */
  async addTeamMember(memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    try {
      const result = await client.models.TeamMember.create({
        startupId: memberData.startupId,
        startupName: memberData.startupName,
        name: memberData.name,
        role: memberData.role,
        position: memberData.position,
        bio: memberData.bio,
        photo: memberData.photo,
        linkedin: memberData.linkedin,
        twitter: memberData.twitter,
        email: memberData.email,
        phone: memberData.phone,
        expertise: memberData.expertise,
        experience: JSON.stringify(memberData.experience),
        education: JSON.stringify(memberData.education),
        achievements: memberData.achievements,
        isFounder: memberData.isFounder,
        isActive: memberData.isActive,
        joinedDate: memberData.joinedDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Team member added successfully:', result.data);
      return result.data as TeamMember;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  /**
   * Add traction update
   */
  async addTractionUpdate(updateData: Omit<TractionUpdate, 'id' | 'createdAt' | 'updatedAt'>): Promise<TractionUpdate> {
    try {
      const result = await client.models.TractionUpdate.create({
        startupId: updateData.startupId,
        startupName: updateData.startupName,
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        metrics: JSON.stringify(updateData.metrics),
        attachments: updateData.attachments ? JSON.stringify(updateData.attachments) : null,
        isPublic: updateData.isPublic,
        publishedAt: updateData.publishedAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Traction update added successfully:', result.data);
      return result.data as TractionUpdate;
    } catch (error) {
      console.error('Error adding traction update:', error);
      throw error;
    }
  }

  /**
   * Add milestone
   */
  async addMilestone(milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<Milestone> {
    try {
      const result = await client.models.StartupMilestone.create({
        startupId: milestoneData.startupId,
        startupName: milestoneData.startupName,
        title: milestoneData.title,
        description: milestoneData.description,
        category: milestoneData.category,
        achievedDate: milestoneData.achievedDate,
        impact: milestoneData.impact,
        metrics: JSON.stringify(milestoneData.metrics),
        isPublic: milestoneData.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Milestone added successfully:', result.data);
      return result.data as Milestone;
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  }

  /**
   * Get team members for startup
   */
  async getTeamMembers(startupId: string): Promise<TeamMember[]> {
    try {
      const result = await client.models.TeamMember.list({
        filter: {
          startupId: { eq: startupId }
        }
      });

      return result.data as TeamMember[] || [];
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }

  /**
   * Get traction updates for startup
   */
  async getTractionUpdates(startupId: string): Promise<TractionUpdate[]> {
    try {
      const result = await client.models.TractionUpdate.list({
        filter: {
          startupId: { eq: startupId }
        }
      });

      return result.data as TractionUpdate[] || [];
    } catch (error) {
      console.error('Error getting traction updates:', error);
      return [];
    }
  }

  /**
   * Get milestones for startup
   */
  async getMilestones(startupId: string): Promise<Milestone[]> {
    try {
      const result = await client.models.StartupMilestone.list({
        filter: {
          startupId: { eq: startupId }
        }
      });

      return result.data as Milestone[] || [];
    } catch (error) {
      console.error('Error getting milestones:', error);
      return [];
    }
  }

  /**
   * Upload pitch video
   */
  async uploadPitchVideo(profileId: string, videoFile: File): Promise<string> {
    try {
      // In a real implementation, this would upload to S3
      // For now, return a mock URL
      const videoUrl = `https://example.com/videos/${profileId}_pitch_${Date.now()}.mp4`;
      
      await this.updateProfile(profileId, { pitchVideo: videoUrl });
      
      console.log('Pitch video uploaded successfully:', videoUrl);
      return videoUrl;
    } catch (error) {
      console.error('Error uploading pitch video:', error);
      throw error;
    }
  }

  /**
   * Upload demo video
   */
  async uploadDemoVideo(profileId: string, videoFile: File): Promise<string> {
    try {
      // In a real implementation, this would upload to S3
      // For now, return a mock URL
      const videoUrl = `https://example.com/videos/${profileId}_demo_${Date.now()}.mp4`;
      
      await this.updateProfile(profileId, { demoVideo: videoUrl });
      
      console.log('Demo video uploaded successfully:', videoUrl);
      return videoUrl;
    } catch (error) {
      console.error('Error uploading demo video:', error);
      throw error;
    }
  }

  /**
   * Upload pitch deck
   */
  async uploadPitchDeck(profileId: string, deckFile: File): Promise<string> {
    try {
      // In a real implementation, this would upload to S3
      // For now, return a mock URL
      const deckUrl = `https://example.com/decks/${profileId}_pitch_${Date.now()}.pdf`;
      
      await this.updateProfile(profileId, { pitchDeck: deckUrl });
      
      console.log('Pitch deck uploaded successfully:', deckUrl);
      return deckUrl;
    } catch (error) {
      console.error('Error uploading pitch deck:', error);
      throw error;
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
      day: 'numeric'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get visibility color
   */
  getVisibilityColor(visibility: string): string {
    switch (visibility) {
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'private':
        return 'bg-red-100 text-red-800';
      case 'investors_only':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get category color
   */
  getCategoryColor(category: string): string {
    switch (category) {
      case 'user_growth':
        return 'bg-blue-100 text-blue-800';
      case 'revenue_growth':
        return 'bg-green-100 text-green-800';
      case 'product_launch':
        return 'bg-purple-100 text-purple-800';
      case 'partnership':
        return 'bg-orange-100 text-orange-800';
      case 'funding':
        return 'bg-yellow-100 text-yellow-800';
      case 'team_expansion':
        return 'bg-pink-100 text-pink-800';
      case 'market_expansion':
        return 'bg-indigo-100 text-indigo-800';
      case 'product_update':
        return 'bg-cyan-100 text-cyan-800';
      case 'achievement':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const startupProfileService = new StartupProfileService();

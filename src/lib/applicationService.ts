import { generateClient } from 'aws-amplify/api';
import { 
  SUBMIT_KSMP_APPLICATION,
  SUBMIT_INVESTOR_APPLICATION,
  SUBMIT_MENTOR_APPLICATION
} from '../graphql/mutations';
import { 
  GET_KSMP_APPLICATION,
  GET_INVESTOR_APPLICATION,
  GET_MENTOR_APPLICATION_DETAILS,
  LIST_PENDING_APPLICATIONS
} from '../graphql/queries';

const client = generateClient();

export interface KSMPApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  submittedAt: string;
  startupIdea: string;
  teamSize: number;
  currentPhase: string;
  fundingRaised?: number;
  businessModel: string;
  targetMarket: string;
  competitiveAdvantage: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  submittedAt: string;
  company: string;
  position: string;
  investmentFocus: string[];
  portfolioSize: string;
  website?: string;
  linkedinProfile?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  submittedAt: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  certifications?: string[];
  portfolio?: string;
  linkedinProfile?: string;
  website?: string;
  documents?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKSMPApplicationData {
  userId: string;
  startupIdea: string;
  teamSize: number;
  currentPhase: string;
  fundingRaised?: number;
  businessModel: string;
  targetMarket: string;
  competitiveAdvantage: string;
}

export interface CreateInvestorApplicationData {
  userId: string;
  company: string;
  position: string;
  investmentFocus: string[];
  portfolioSize: string;
  website?: string;
  linkedinProfile?: string;
}

export interface CreateMentorApplicationData {
  userId: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  certifications?: string[];
  portfolio?: string;
  linkedinProfile?: string;
  website?: string;
  documents?: string[];
}

export const applicationService = {
  /**
   * Submit KSMP application
   */
  async submitKSMPApplication(applicationData: CreateKSMPApplicationData): Promise<KSMPApplication> {
    try {
      const result = await client.graphql({
        query: SUBMIT_KSMP_APPLICATION,
        variables: { input: applicationData }
      });
      return result.data.createKSMPApplication;
    } catch (error) {
      console.error('Error submitting KSMP application:', error);
      throw error;
    }
  },

  /**
   * Submit investor application
   */
  async submitInvestorApplication(applicationData: CreateInvestorApplicationData): Promise<InvestorApplication> {
    try {
      const result = await client.graphql({
        query: SUBMIT_INVESTOR_APPLICATION,
        variables: { input: applicationData }
      });
      return result.data.createInvestorApplication;
    } catch (error) {
      console.error('Error submitting investor application:', error);
      throw error;
    }
  },

  /**
   * Submit mentor application
   */
  async submitMentorApplication(applicationData: CreateMentorApplicationData): Promise<MentorApplication> {
    try {
      const result = await client.graphql({
        query: SUBMIT_MENTOR_APPLICATION,
        variables: { input: applicationData }
      });
      return result.data.createMentorApplication;
    } catch (error) {
      console.error('Error submitting mentor application:', error);
      throw error;
    }
  },

  /**
   * Get KSMP application
   */
  async getKSMPApplication(applicationId: string): Promise<KSMPApplication> {
    try {
      const result = await client.graphql({
        query: GET_KSMP_APPLICATION,
        variables: { id: applicationId }
      });
      return result.data.getKSMPApplication;
    } catch (error) {
      console.error('Error fetching KSMP application:', error);
      throw error;
    }
  },

  /**
   * Get investor application
   */
  async getInvestorApplication(applicationId: string): Promise<InvestorApplication> {
    try {
      const result = await client.graphql({
        query: GET_INVESTOR_APPLICATION,
        variables: { id: applicationId }
      });
      return result.data.getInvestorApplication;
    } catch (error) {
      console.error('Error fetching investor application:', error);
      throw error;
    }
  },

  /**
   * Get mentor application details
   */
  async getMentorApplicationDetails(applicationId: string): Promise<MentorApplication> {
    try {
      const result = await client.graphql({
        query: GET_MENTOR_APPLICATION_DETAILS,
        variables: { id: applicationId }
      });
      return result.data.getMentorApplication;
    } catch (error) {
      console.error('Error fetching mentor application:', error);
      throw error;
    }
  },

  /**
   * List pending applications (for admin)
   */
  async listPendingApplications(): Promise<{
    ksmpApplications: KSMPApplication[];
    investorApplications: InvestorApplication[];
    mentorApplications: MentorApplication[];
  }> {
    try {
      const result = await client.graphql({
        query: LIST_PENDING_APPLICATIONS
      });
      return result.data.listPendingApplications;
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      throw error;
    }
  },

  /**
   * Get application status color
   */
  getApplicationStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'APPROVED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      case 'UNDER_REVIEW':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  },

  /**
   * Format submission date
   */
  formatSubmissionDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Validate KSMP application data
   */
  validateKSMPApplication(data: CreateKSMPApplicationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.startupIdea || data.startupIdea.trim().length < 10) {
      errors.push('Startup idea must be at least 10 characters long');
    }
    
    if (!data.teamSize || data.teamSize < 1) {
      errors.push('Team size must be at least 1');
    }
    
    if (!data.businessModel || data.businessModel.trim().length < 10) {
      errors.push('Business model must be at least 10 characters long');
    }
    
    if (!data.targetMarket || data.targetMarket.trim().length < 10) {
      errors.push('Target market must be at least 10 characters long');
    }
    
    if (!data.competitiveAdvantage || data.competitiveAdvantage.trim().length < 10) {
      errors.push('Competitive advantage must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate investor application data
   */
  validateInvestorApplication(data: CreateInvestorApplicationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.company || data.company.trim().length < 2) {
      errors.push('Company name must be at least 2 characters long');
    }
    
    if (!data.position || data.position.trim().length < 2) {
      errors.push('Position must be at least 2 characters long');
    }
    
    if (!data.investmentFocus || data.investmentFocus.length === 0) {
      errors.push('At least one investment focus area is required');
    }
    
    if (!data.portfolioSize || data.portfolioSize.trim().length < 2) {
      errors.push('Portfolio size must be specified');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate mentor application data
   */
  validateMentorApplication(data: CreateMentorApplicationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.bio || data.bio.trim().length < 50) {
      errors.push('Bio must be at least 50 characters long');
    }
    
    if (!data.expertise || data.expertise.length === 0) {
      errors.push('At least one expertise area is required');
    }
    
    if (!data.experience || data.experience.trim().length < 20) {
      errors.push('Experience must be at least 20 characters long');
    }
    
    if (!data.education || data.education.trim().length < 10) {
      errors.push('Education must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

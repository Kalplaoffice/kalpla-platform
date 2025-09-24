import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface InvestorApplication {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  companyName?: string;
  companyWebsite?: string;
  investmentFocus: string[];
  investmentAmount?: number;
  investmentStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'late_stage' | 'pre_ipo';
  portfolioCompanies?: string[];
  previousInvestments?: any[];
  investmentCriteria: any;
  dueDiligence: any;
  riskAssessment: any;
  complianceDocuments: any[];
  references?: any[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorProfile {
  id: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  companyName: string;
  companyWebsite?: string;
  investmentFocus: string[];
  investmentAmount?: number;
  investmentStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'late_stage' | 'pre_ipo';
  portfolioCompanies?: string[];
  previousInvestments?: any[];
  investmentCriteria: any;
  dueDiligence: any;
  riskAssessment: any;
  complianceDocuments: any[];
  references?: any[];
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  accessLevel: 'basic' | 'premium' | 'vip' | 'admin';
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorAccessLog {
  id: string;
  investorId: string;
  investorName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentCriteria {
  sectors: string[];
  stages: string[];
  minInvestment: number;
  maxInvestment: number;
  geographicFocus: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  expectedReturns: number;
  investmentHorizon: string;
  coInvestmentPreferences: boolean;
  boardSeatRequirements: boolean;
}

export interface DueDiligence {
  financialAnalysis: boolean;
  marketAnalysis: boolean;
  teamAssessment: boolean;
  legalReview: boolean;
  technicalReview: boolean;
  customerValidation: boolean;
  competitiveAnalysis: boolean;
  riskAssessment: boolean;
}

export interface RiskAssessment {
  marketRisk: 'low' | 'medium' | 'high';
  technologyRisk: 'low' | 'medium' | 'high';
  teamRisk: 'low' | 'medium' | 'high';
  financialRisk: 'low' | 'medium' | 'high';
  regulatoryRisk: 'low' | 'medium' | 'high';
  competitiveRisk: 'low' | 'medium' | 'high';
  overallRisk: 'low' | 'medium' | 'high';
  riskMitigation: string[];
}

export interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Reference {
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  relationship: string;
  verified: boolean;
}

export interface ApplicationFilters {
  status?: string[];
  investmentStage?: string[];
  investmentAmount?: {
    min: number;
    max: number;
  };
  submittedDate?: {
    start: string;
    end: string;
  };
  reviewedBy?: string;
}

class InvestorApplicationService {
  /**
   * Create investor application
   */
  async createApplication(applicationData: Omit<InvestorApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<InvestorApplication> {
    try {
      const result = await client.models.InvestorApplication.create({
        investorId: applicationData.investorId,
        investorName: applicationData.investorName,
        investorEmail: applicationData.investorEmail,
        companyName: applicationData.companyName,
        companyWebsite: applicationData.companyWebsite,
        investmentFocus: applicationData.investmentFocus,
        investmentAmount: applicationData.investmentAmount,
        investmentStage: applicationData.investmentStage,
        portfolioCompanies: applicationData.portfolioCompanies,
        previousInvestments: applicationData.previousInvestments ? JSON.stringify(applicationData.previousInvestments) : null,
        investmentCriteria: JSON.stringify(applicationData.investmentCriteria),
        dueDiligence: JSON.stringify(applicationData.dueDiligence),
        riskAssessment: JSON.stringify(applicationData.riskAssessment),
        complianceDocuments: JSON.stringify(applicationData.complianceDocuments),
        references: applicationData.references ? JSON.stringify(applicationData.references) : null,
        status: applicationData.status,
        submittedAt: applicationData.submittedAt,
        reviewedBy: applicationData.reviewedBy,
        reviewedAt: applicationData.reviewedAt,
        approvedBy: applicationData.approvedBy,
        approvedAt: applicationData.approvedAt,
        rejectionReason: applicationData.rejectionReason,
        notes: applicationData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Investor application created successfully:', result.data);
      return result.data as InvestorApplication;
    } catch (error) {
      console.error('Error creating investor application:', error);
      throw error;
    }
  }

  /**
   * Update investor application
   */
  async updateApplication(applicationId: string, updates: Partial<InvestorApplication>): Promise<InvestorApplication> {
    try {
      const updateData: any = {
        id: applicationId,
        updatedAt: new Date().toISOString()
      };

      if (updates.investmentFocus) updateData.investmentFocus = updates.investmentFocus;
      if (updates.investmentAmount !== undefined) updateData.investmentAmount = updates.investmentAmount;
      if (updates.investmentStage) updateData.investmentStage = updates.investmentStage;
      if (updates.portfolioCompanies) updateData.portfolioCompanies = updates.portfolioCompanies;
      if (updates.previousInvestments) updateData.previousInvestments = JSON.stringify(updates.previousInvestments);
      if (updates.investmentCriteria) updateData.investmentCriteria = JSON.stringify(updates.investmentCriteria);
      if (updates.dueDiligence) updateData.dueDiligence = JSON.stringify(updates.dueDiligence);
      if (updates.riskAssessment) updateData.riskAssessment = JSON.stringify(updates.riskAssessment);
      if (updates.complianceDocuments) updateData.complianceDocuments = JSON.stringify(updates.complianceDocuments);
      if (updates.references) updateData.references = JSON.stringify(updates.references);
      if (updates.status) updateData.status = updates.status;
      if (updates.submittedAt) updateData.submittedAt = updates.submittedAt;
      if (updates.reviewedBy) updateData.reviewedBy = updates.reviewedBy;
      if (updates.reviewedAt) updateData.reviewedAt = updates.reviewedAt;
      if (updates.approvedBy) updateData.approvedBy = updates.approvedBy;
      if (updates.approvedAt) updateData.approvedAt = updates.approvedAt;
      if (updates.rejectionReason) updateData.rejectionReason = updates.rejectionReason;
      if (updates.notes) updateData.notes = updates.notes;

      const result = await client.models.InvestorApplication.update(updateData);

      console.log('Investor application updated successfully:', result.data);
      return result.data as InvestorApplication;
    } catch (error) {
      console.error('Error updating investor application:', error);
      throw error;
    }
  }

  /**
   * Get investor applications
   */
  async getApplications(filters?: ApplicationFilters): Promise<InvestorApplication[]> {
    try {
      let filter: any = {};
      
      if (filters?.status && filters.status.length > 0) {
        filter.status = { in: filters.status };
      }
      
      if (filters?.investmentStage && filters.investmentStage.length > 0) {
        filter.investmentStage = { in: filters.investmentStage };
      }

      const result = await client.models.InvestorApplication.list({
        filter: filter
      });

      let applications = result.data as InvestorApplication[] || [];

      // Apply additional filters
      if (filters?.investmentAmount) {
        applications = applications.filter(app => 
          app.investmentAmount && 
          app.investmentAmount >= filters.investmentAmount!.min &&
          app.investmentAmount <= filters.investmentAmount!.max
        );
      }

      if (filters?.submittedDate) {
        applications = applications.filter(app => 
          app.submittedAt &&
          new Date(app.submittedAt) >= new Date(filters.submittedDate!.start) &&
          new Date(app.submittedAt) <= new Date(filters.submittedDate!.end)
        );
      }

      if (filters?.reviewedBy) {
        applications = applications.filter(app => app.reviewedBy === filters.reviewedBy);
      }

      // Sort by submitted date (newest first)
      applications.sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      });

      return applications;
    } catch (error) {
      console.error('Error getting investor applications:', error);
      return [];
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string): Promise<InvestorApplication | null> {
    try {
      const result = await client.models.InvestorApplication.get({ id: applicationId });
      return result.data as InvestorApplication || null;
    } catch (error) {
      console.error('Error getting application by ID:', error);
      return null;
    }
  }

  /**
   * Submit application for review
   */
  async submitApplication(applicationId: string): Promise<boolean> {
    try {
      const result = await client.models.InvestorApplication.update({
        id: applicationId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Application submitted successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      return false;
    }
  }

  /**
   * Review application
   */
  async reviewApplication(applicationId: string, reviewedBy: string, notes?: string): Promise<boolean> {
    try {
      const result = await client.models.InvestorApplication.update({
        id: applicationId,
        status: 'under_review',
        reviewedBy: reviewedBy,
        reviewedAt: new Date().toISOString(),
        notes: notes,
        updatedAt: new Date().toISOString()
      });

      console.log('Application reviewed successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error reviewing application:', error);
      return false;
    }
  }

  /**
   * Approve application
   */
  async approveApplication(applicationId: string, approvedBy: string, notes?: string): Promise<boolean> {
    try {
      const application = await this.getApplicationById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      // Update application status
      await client.models.InvestorApplication.update({
        id: applicationId,
        status: 'approved',
        approvedBy: approvedBy,
        approvedAt: new Date().toISOString(),
        notes: notes,
        updatedAt: new Date().toISOString()
      });

      // Create investor profile
      await this.createInvestorProfile(application);

      console.log('Application approved successfully');
      return true;
    } catch (error) {
      console.error('Error approving application:', error);
      return false;
    }
  }

  /**
   * Reject application
   */
  async rejectApplication(applicationId: string, rejectedBy: string, rejectionReason: string, notes?: string): Promise<boolean> {
    try {
      const result = await client.models.InvestorApplication.update({
        id: applicationId,
        status: 'rejected',
        reviewedBy: rejectedBy,
        reviewedAt: new Date().toISOString(),
        rejectionReason: rejectionReason,
        notes: notes,
        updatedAt: new Date().toISOString()
      });

      console.log('Application rejected successfully:', result.data);
      return true;
    } catch (error) {
      console.error('Error rejecting application:', error);
      return false;
    }
  }

  /**
   * Create investor profile from approved application
   */
  private async createInvestorProfile(application: InvestorApplication): Promise<InvestorProfile> {
    try {
      const profile: Omit<InvestorProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        investorId: application.investorId,
        investorName: application.investorName,
        investorEmail: application.investorEmail,
        companyName: application.companyName || '',
        companyWebsite: application.companyWebsite,
        investmentFocus: application.investmentFocus,
        investmentAmount: application.investmentAmount,
        investmentStage: application.investmentStage,
        portfolioCompanies: application.portfolioCompanies,
        previousInvestments: application.previousInvestments,
        investmentCriteria: application.investmentCriteria,
        dueDiligence: application.dueDiligence,
        riskAssessment: application.riskAssessment,
        complianceDocuments: application.complianceDocuments,
        references: application.references,
        status: 'active',
        accessLevel: this.determineAccessLevel(application),
        permissions: this.determinePermissions(application),
        lastLoginAt: new Date().toISOString()
      };

      const result = await client.models.InvestorProfile.create({
        investorId: profile.investorId,
        investorName: profile.investorName,
        investorEmail: profile.investorEmail,
        companyName: profile.companyName,
        companyWebsite: profile.companyWebsite,
        investmentFocus: profile.investmentFocus,
        investmentAmount: profile.investmentAmount,
        investmentStage: profile.investmentStage,
        portfolioCompanies: profile.portfolioCompanies,
        previousInvestments: profile.previousInvestments ? JSON.stringify(profile.previousInvestments) : null,
        investmentCriteria: JSON.stringify(profile.investmentCriteria),
        dueDiligence: JSON.stringify(profile.dueDiligence),
        riskAssessment: JSON.stringify(profile.riskAssessment),
        complianceDocuments: JSON.stringify(profile.complianceDocuments),
        references: profile.references ? JSON.stringify(profile.references) : null,
        status: profile.status,
        accessLevel: profile.accessLevel,
        permissions: profile.permissions,
        lastLoginAt: profile.lastLoginAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Investor profile created successfully:', result.data);
      return result.data as InvestorProfile;
    } catch (error) {
      console.error('Error creating investor profile:', error);
      throw error;
    }
  }

  /**
   * Determine access level based on application
   */
  private determineAccessLevel(application: InvestorApplication): 'basic' | 'premium' | 'vip' | 'admin' {
    if (application.investmentAmount && application.investmentAmount >= 10000000) {
      return 'vip';
    } else if (application.investmentAmount && application.investmentAmount >= 1000000) {
      return 'premium';
    } else {
      return 'basic';
    }
  }

  /**
   * Determine permissions based on application
   */
  private determinePermissions(application: InvestorApplication): string[] {
    const basePermissions = ['view_portfolio', 'view_analytics'];
    
    if (application.investmentAmount && application.investmentAmount >= 1000000) {
      basePermissions.push('view_detailed_analytics', 'download_reports');
    }
    
    if (application.investmentAmount && application.investmentAmount >= 10000000) {
      basePermissions.push('view_confidential_data', 'access_premium_features');
    }
    
    return basePermissions;
  }

  /**
   * Get investor profile
   */
  async getInvestorProfile(investorId: string): Promise<InvestorProfile | null> {
    try {
      const result = await client.models.InvestorProfile.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      return result.data?.[0] as InvestorProfile || null;
    } catch (error) {
      console.error('Error getting investor profile:', error);
      return null;
    }
  }

  /**
   * Update investor profile
   */
  async updateInvestorProfile(profileId: string, updates: Partial<InvestorProfile>): Promise<InvestorProfile> {
    try {
      const updateData: any = {
        id: profileId,
        updatedAt: new Date().toISOString()
      };

      if (updates.investmentFocus) updateData.investmentFocus = updates.investmentFocus;
      if (updates.investmentAmount !== undefined) updateData.investmentAmount = updates.investmentAmount;
      if (updates.investmentStage) updateData.investmentStage = updates.investmentStage;
      if (updates.portfolioCompanies) updateData.portfolioCompanies = updates.portfolioCompanies;
      if (updates.previousInvestments) updateData.previousInvestments = JSON.stringify(updates.previousInvestments);
      if (updates.investmentCriteria) updateData.investmentCriteria = JSON.stringify(updates.investmentCriteria);
      if (updates.dueDiligence) updateData.dueDiligence = JSON.stringify(updates.dueDiligence);
      if (updates.riskAssessment) updateData.riskAssessment = JSON.stringify(updates.riskAssessment);
      if (updates.complianceDocuments) updateData.complianceDocuments = JSON.stringify(updates.complianceDocuments);
      if (updates.references) updateData.references = JSON.stringify(updates.references);
      if (updates.status) updateData.status = updates.status;
      if (updates.accessLevel) updateData.accessLevel = updates.accessLevel;
      if (updates.permissions) updateData.permissions = updates.permissions;
      if (updates.lastLoginAt) updateData.lastLoginAt = updates.lastLoginAt;

      const result = await client.models.InvestorProfile.update(updateData);

      console.log('Investor profile updated successfully:', result.data);
      return result.data as InvestorProfile;
    } catch (error) {
      console.error('Error updating investor profile:', error);
      throw error;
    }
  }

  /**
   * Log investor access
   */
  async logAccess(investorId: string, action: string, resource: string, success: boolean, details?: any): Promise<void> {
    try {
      const profile = await this.getInvestorProfile(investorId);
      if (!profile) return;

      await client.models.InvestorAccessLog.create({
        investorId: investorId,
        investorName: profile.investorName,
        action: action,
        resource: resource,
        timestamp: new Date().toISOString(),
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent,
        success: success,
        details: details ? JSON.stringify(details) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging investor access:', error);
    }
  }

  /**
   * Get access logs for investor
   */
  async getAccessLogs(investorId: string): Promise<InvestorAccessLog[]> {
    try {
      const result = await client.models.InvestorAccessLog.list({
        filter: {
          investorId: { eq: investorId }
        }
      });

      return result.data as InvestorAccessLog[] || [];
    } catch (error) {
      console.error('Error getting access logs:', error);
      return [];
    }
  }

  /**
   * Check if investor has permission
   */
  async hasPermission(investorId: string, permission: string): Promise<boolean> {
    try {
      const profile = await this.getInvestorProfile(investorId);
      if (!profile) return false;

      return profile.permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(): string {
    // In a real implementation, this would get the actual client IP
    return '127.0.0.1';
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
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'terminated':
        return 'bg-red-100 text-red-800';
      case 'submitted':
      case 'under_review':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'withdrawn':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get access level color
   */
  getAccessLevelColor(accessLevel: string): string {
    switch (accessLevel) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'vip':
        return 'bg-gold-100 text-gold-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const investorApplicationService = new InvestorApplicationService();

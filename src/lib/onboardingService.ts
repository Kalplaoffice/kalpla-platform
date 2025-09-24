import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export interface MentorApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  industry: string;
  specialization: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: string[];
  certifications: string[];
  languages: string[];
  previousMentoring: boolean;
  mentoringExperience: string;
  preferredMentoringAreas: string[];
  availability: {
    hoursPerWeek: string;
    preferredTimeSlots: string[];
    timezone: string;
  };
  motivation: string;
  goals: string;
  expectations: string;
  linkedinProfile: string;
  portfolio: string;
  resume?: File;
  profilePicture?: File;
}

export interface InvestorApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  investorType: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  investmentRange: string;
  typicalTicketSize: string;
  sectorsOfInterest: string[];
  investmentStage: string[];
  geographicFocus: string[];
  portfolioSize: string;
  numberOfInvestments: string;
  notableInvestments: string;
  exitExperience: string;
  investmentCriteria: string;
  dueDiligenceProcess: string;
  valueAddCapabilities: string[];
  networkSize: string;
  industryConnections: string[];
  resources: string[];
  motivation: string;
  goals: string;
  expectations: string;
  linkedinProfile: string;
  website: string;
  pitchDeck?: File;
  profilePicture?: File;
}

export interface StudentOnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  timezone: string;
  educationLevel: string;
  currentInstitution: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa: string;
  workExperience: string;
  currentJob: string;
  industry: string;
  careerGoals: string[];
  interests: string[];
  learningStyle: string[];
  preferredSubjects: string[];
  skillLevel: string;
  learningGoals: string;
  motivation: string;
  expectations: string;
  timeCommitment: string;
  languages: string[];
  certifications: string[];
  portfolio: string;
  linkedinProfile: string;
  resume?: File;
  profilePicture?: File;
  interestedPrograms: string[];
  ksmpInterest: boolean;
  ksmpApplication: string;
}

class OnboardingService {
  /**
   * Submit mentor application
   */
  async submitMentorApplication(data: MentorApplicationData): Promise<{ success: boolean; error?: string; applicationId?: string }> {
    try {
      // Upload files if provided
      let resumeUrl = '';
      let profilePictureUrl = '';

      if (data.resume) {
        resumeUrl = await this.uploadFile(data.resume, 'mentor-resumes');
      }

      if (data.profilePicture) {
        profilePictureUrl = await this.uploadFile(data.profilePicture, 'mentor-profiles');
      }

      // Create mentor application record
      const applicationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        timezone: data.timezone,
        currentCompany: data.currentCompany,
        currentPosition: data.currentPosition,
        yearsOfExperience: data.yearsOfExperience,
        industry: data.industry,
        specialization: data.specialization,
        education: data.education,
        skills: data.skills,
        certifications: data.certifications,
        languages: data.languages,
        previousMentoring: data.previousMentoring,
        mentoringExperience: data.mentoringExperience,
        preferredMentoringAreas: data.preferredMentoringAreas,
        availability: data.availability,
        motivation: data.motivation,
        goals: data.goals,
        expectations: data.expectations,
        linkedinProfile: data.linkedinProfile,
        portfolio: data.portfolio,
        resumeUrl,
        profilePictureUrl,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        applicationType: 'mentor'
      };

      // For now, simulate API call
      console.log('Mentor application submitted:', applicationData);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.MentorApplication.create(applicationData);
      
      return { success: true, applicationId: 'mentor_' + Date.now() };
    } catch (error) {
      console.error('Error submitting mentor application:', error);
      return { success: false, error: 'Failed to submit application' };
    }
  }

  /**
   * Submit investor application
   */
  async submitInvestorApplication(data: InvestorApplicationData): Promise<{ success: boolean; error?: string; applicationId?: string }> {
    try {
      // Upload files if provided
      let pitchDeckUrl = '';
      let profilePictureUrl = '';

      if (data.pitchDeck) {
        pitchDeckUrl = await this.uploadFile(data.pitchDeck, 'investor-pitch-decks');
      }

      if (data.profilePicture) {
        profilePictureUrl = await this.uploadFile(data.profilePicture, 'investor-profiles');
      }

      // Create investor application record
      const applicationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        timezone: data.timezone,
        investorType: data.investorType,
        currentCompany: data.currentCompany,
        currentPosition: data.currentPosition,
        yearsOfExperience: data.yearsOfExperience,
        investmentRange: data.investmentRange,
        typicalTicketSize: data.typicalTicketSize,
        sectorsOfInterest: data.sectorsOfInterest,
        investmentStage: data.investmentStage,
        geographicFocus: data.geographicFocus,
        portfolioSize: data.portfolioSize,
        numberOfInvestments: data.numberOfInvestments,
        notableInvestments: data.notableInvestments,
        exitExperience: data.exitExperience,
        investmentCriteria: data.investmentCriteria,
        dueDiligenceProcess: data.dueDiligenceProcess,
        valueAddCapabilities: data.valueAddCapabilities,
        networkSize: data.networkSize,
        industryConnections: data.industryConnections,
        resources: data.resources,
        motivation: data.motivation,
        goals: data.goals,
        expectations: data.expectations,
        linkedinProfile: data.linkedinProfile,
        website: data.website,
        pitchDeckUrl,
        profilePictureUrl,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        applicationType: 'investor'
      };

      // For now, simulate API call
      console.log('Investor application submitted:', applicationData);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.InvestorApplication.create(applicationData);
      
      return { success: true, applicationId: 'investor_' + Date.now() };
    } catch (error) {
      console.error('Error submitting investor application:', error);
      return { success: false, error: 'Failed to submit application' };
    }
  }

  /**
   * Submit student onboarding data
   */
  async submitStudentOnboarding(data: StudentOnboardingData): Promise<{ success: boolean; error?: string; userId?: string }> {
    try {
      // Upload files if provided
      let resumeUrl = '';
      let profilePictureUrl = '';

      if (data.resume) {
        resumeUrl = await this.uploadFile(data.resume, 'student-resumes');
      }

      if (data.profilePicture) {
        profilePictureUrl = await this.uploadFile(data.profilePicture, 'student-profiles');
      }

      // Create student profile record
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        location: data.location,
        timezone: data.timezone,
        educationLevel: data.educationLevel,
        currentInstitution: data.currentInstitution,
        fieldOfStudy: data.fieldOfStudy,
        graduationYear: data.graduationYear,
        gpa: data.gpa,
        workExperience: data.workExperience,
        currentJob: data.currentJob,
        industry: data.industry,
        careerGoals: data.careerGoals,
        interests: data.interests,
        learningStyle: data.learningStyle,
        preferredSubjects: data.preferredSubjects,
        skillLevel: data.skillLevel,
        learningGoals: data.learningGoals,
        motivation: data.motivation,
        expectations: data.expectations,
        timeCommitment: data.timeCommitment,
        languages: data.languages,
        certifications: data.certifications,
        portfolio: data.portfolio,
        linkedinProfile: data.linkedinProfile,
        resumeUrl,
        profilePictureUrl,
        interestedPrograms: data.interestedPrograms,
        ksmpInterest: data.ksmpInterest,
        ksmpApplication: data.ksmpApplication,
        onboardingComplete: true,
        onboardingDate: new Date().toISOString(),
        userType: 'student'
      };

      // For now, simulate API call
      console.log('Student onboarding completed:', profileData);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.StudentProfile.create(profileData);
      
      return { success: true, userId: 'student_' + Date.now() };
    } catch (error) {
      console.error('Error completing student onboarding:', error);
      return { success: false, error: 'Failed to complete onboarding' };
    }
  }

  /**
   * Upload file to S3
   */
  private async uploadFile(file: File, folder: string): Promise<string> {
    try {
      // For now, simulate file upload
      // In a real implementation, you would use AWS S3 or Amplify Storage
      console.log(`Uploading file ${file.name} to ${folder}`);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return simulated URL
      return `https://kalpla-storage.s3.amazonaws.com/${folder}/${Date.now()}_${file.name}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Get application status
   */
  async getApplicationStatus(applicationId: string): Promise<{ status: string; message?: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, you would query your database:
      // const result = await client.models.Application.get({ id: applicationId });
      
      return { status: 'pending', message: 'Application is under review' };
    } catch (error) {
      console.error('Error getting application status:', error);
      return { status: 'error', message: 'Failed to get status' };
    }
  }

  /**
   * Get onboarding statistics
   */
  async getOnboardingStats(): Promise<{
    totalStudents: number;
    totalMentors: number;
    totalInvestors: number;
    pendingApplications: number;
  }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        totalStudents: 1250,
        totalMentors: 85,
        totalInvestors: 45,
        pendingApplications: 12
      };
    } catch (error) {
      console.error('Error getting onboarding stats:', error);
      return {
        totalStudents: 0,
        totalMentors: 0,
        totalInvestors: 0,
        pendingApplications: 0
      };
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate required fields
   */
  validateRequiredFields(data: any, requiredFields: string[]): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        missingFields.push(field);
      }
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }
}

export const onboardingService = new OnboardingService();

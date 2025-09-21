import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_MENTOR_APPLICATION,
  UPDATE_MENTOR_APPLICATION
} from '../graphql/mutations';
import { 
  GET_MENTOR_APPLICATION,
  LIST_MENTOR_APPLICATIONS
} from '../graphql/queries';

const client = generateClient();

export interface MentorApplicationData {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  linkedin?: string;
  portfolio?: string;
  bio: string;
  availability: string;
  documents: {
    // Mandatory Documents
    panCard: File;
    aadhaarCard: File;
    bankAccountDetails: File;
    cancelledCheque: File;
    educationalCertificate: File;
    experienceProof: File;
    passportPhoto: File;
    digitalSignature: File;
    
    // Optional Documents
    gstRegistration?: File;
    professionalTaxRegistration?: File;
  };
  signature: string;
  signatureImage: string;
  consentData: {
    declarationAccepted: boolean;
    declarationTimestamp: string;
    ipAddress: string;
    deviceId: string;
    userAgent: string;
    signatureImage: string;
    signatureTimestamp: string;
  };
}

export interface MentorApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  name: string;
  email: string;
  phone: string;
  expertise: string;
  linkedin?: string;
  portfolio?: string;
  bio: string;
  availability: string;
  documents: {
    // Mandatory Documents
    panCard: string;
    aadhaarCard: string;
    bankAccountDetails: string;
    cancelledCheque: string;
    educationalCertificate: string;
    experienceProof: string;
    passportPhoto: string;
    digitalSignature: string;
    
    // Optional Documents
    gstRegistration?: string;
    professionalTaxRegistration?: string;
  };
  declarationPdf?: string;
  consentData: {
    declarationAccepted: boolean;
    declarationTimestamp: string;
    ipAddress: string;
    deviceId: string;
    userAgent: string;
    signatureImage: string;
    signatureTimestamp: string;
  };
  reviewNotes?: string;
  rejectionReason?: string;
}

class MentorApplicationService {
  /**
   * Upload document to S3
   */
  async uploadDocument(file: File, userId: string, documentType: string): Promise<string> {
    try {
      const fileName = `${documentType}_${Date.now()}.${file.name.split('.').pop()}`;
      const key = `mentor-uploads/${userId}/${fileName}`;
      
      const result = await uploadData({
        key: key,
        data: file,
        options: {
          contentType: file.type,
          level: 'private',
          metadata: {
            userId,
            documentType,
            originalName: file.name
          }
        }
      }).result;
      
      return result.key;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error(`Failed to upload ${documentType} document`);
    }
  }

  /**
   * Upload multiple documents
   */
  async uploadDocuments(documents: MentorApplicationData['documents'], userId: string): Promise<{
    panCard: string;
    aadhaarCard: string;
    bankAccountDetails: string;
    cancelledCheque: string;
    educationalCertificate: string;
    experienceProof: string;
    passportPhoto: string;
    digitalSignature: string;
    gstRegistration?: string;
    professionalTaxRegistration?: string;
  }> {
    const uploads = await Promise.all([
      this.uploadDocument(documents.panCard, userId, 'panCard'),
      this.uploadDocument(documents.aadhaarCard, userId, 'aadhaarCard'),
      this.uploadDocument(documents.bankAccountDetails, userId, 'bankAccountDetails'),
      this.uploadDocument(documents.cancelledCheque, userId, 'cancelledCheque'),
      this.uploadDocument(documents.educationalCertificate, userId, 'educationalCertificate'),
      this.uploadDocument(documents.experienceProof, userId, 'experienceProof'),
      this.uploadDocument(documents.passportPhoto, userId, 'passportPhoto'),
      this.uploadDocument(documents.digitalSignature, userId, 'digitalSignature'),
      documents.gstRegistration ? this.uploadDocument(documents.gstRegistration, userId, 'gstRegistration') : Promise.resolve(''),
      documents.professionalTaxRegistration ? this.uploadDocument(documents.professionalTaxRegistration, userId, 'professionalTaxRegistration') : Promise.resolve('')
    ]);

    return {
      panCard: uploads[0],
      aadhaarCard: uploads[1],
      bankAccountDetails: uploads[2],
      cancelledCheque: uploads[3],
      educationalCertificate: uploads[4],
      experienceProof: uploads[5],
      passportPhoto: uploads[6],
      digitalSignature: uploads[7],
      gstRegistration: uploads[8] || undefined,
      professionalTaxRegistration: uploads[9] || undefined
    };
  }

  /**
   * Submit mentor application
   */
  async submitApplication(data: MentorApplicationData, userId: string): Promise<MentorApplication> {
    try {
      // Upload documents first
      const documentUrls = await this.uploadDocuments(data.documents, userId);
      
      // Create application record
      const applicationInput = {
        userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        expertise: data.expertise,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        bio: data.bio,
        availability: data.availability,
        documents: documentUrls,
        consentData: data.consentData,
        status: 'PENDING',
        submittedDate: new Date().toISOString()
      };

      const result = await client.graphql({
        query: createMentorApplication,
        variables: { input: applicationInput }
      });

      const application = result.data.createMentorApplication;
      
      // Generate declaration PDF
      try {
        await client.graphql({
          query: generateMentorDeclarationPdf,
          variables: { applicationId: application.id }
        });
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
        // Don't fail the entire submission if PDF generation fails
      }

      return application;
    } catch (error) {
      console.error('Error submitting mentor application:', error);
      throw new Error('Failed to submit mentor application');
    }
  }

  /**
   * Get mentor application by ID
   */
  async getApplication(applicationId: string): Promise<MentorApplication | null> {
    try {
      const result = await client.graphql({
        query: getMentorApplication,
        variables: { id: applicationId }
      });

      return result.data.getMentorApplication;
    } catch (error) {
      console.error('Error getting mentor application:', error);
      throw new Error('Failed to get mentor application');
    }
  }

  /**
   * Get all mentor applications (admin only)
   */
  async getAllApplications(status?: string): Promise<MentorApplication[]> {
    try {
      const filter = status ? { status: { eq: status } } : undefined;
      
      const result = await client.graphql({
        query: listMentorApplications,
        variables: { filter }
      });

      return result.data.listMentorApplications.items;
    } catch (error) {
      console.error('Error getting mentor applications:', error);
      throw new Error('Failed to get mentor applications');
    }
  }

  /**
   * Get pending mentor applications (admin only)
   */
  async getPendingApplications(): Promise<MentorApplication[]> {
    return this.getAllApplications('PENDING');
  }

  /**
   * Review mentor application (admin only)
   */
  async reviewApplication(
    applicationId: string, 
    status: 'APPROVED' | 'REJECTED', 
    notes?: string
  ): Promise<MentorApplication> {
    try {
      const result = await client.graphql({
        query: reviewMentorApplication,
        variables: { applicationId, status, notes }
      });

      const application = result.data.reviewMentorApplication;
      
      // If approved, add user to Mentor group
      if (status === 'APPROVED') {
        await this.addUserToMentorGroup(application.userId);
      }

      return application;
    } catch (error) {
      console.error('Error reviewing mentor application:', error);
      throw new Error('Failed to review mentor application');
    }
  }

  /**
   * Add user to Mentor group (admin only)
   */
  private async addUserToMentorGroup(userId: string): Promise<void> {
    try {
      // This would typically call a Lambda function or use AWS SDK
      // For now, we'll simulate the group assignment
      console.log(`Adding user ${userId} to Mentor group`);
      
      // In a real implementation, you would:
      // 1. Call a Lambda function with admin privileges
      // 2. Use AWS SDK to call cognito.adminAddUserToGroup
      // 3. Update user profile in DynamoDB
      
    } catch (error) {
      console.error('Error adding user to Mentor group:', error);
      throw new Error('Failed to add user to Mentor group');
    }
  }

  /**
   * Get signed URL for document download
   */
  async getDocumentUrl(documentKey: string): Promise<string> {
    try {
      const url = await getUrl({
        key: documentKey,
        options: {
          level: 'private',
          expiresIn: 3600 // 1 hour
        }
      });
      
      return url as string;
    } catch (error) {
      console.error('Error getting document URL:', error);
      throw new Error('Failed to get document URL');
    }
  }

  /**
   * Get signed URL for declaration PDF
   */
  async getDeclarationPdfUrl(pdfKey: string): Promise<string> {
    try {
      const url = await getUrl({
        key: pdfKey,
        options: {
          level: 'private',
          expiresIn: 3600 // 1 hour
        }
      });
      
      return url as string;
    } catch (error) {
      console.error('Error getting PDF URL:', error);
      throw new Error('Failed to get PDF URL');
    }
  }

  /**
   * Check if user has pending mentor application
   */
  async hasPendingApplication(userId: string): Promise<boolean> {
    try {
      const applications = await this.getAllApplications();
      return applications.some(app => 
        app.userId === userId && app.status === 'PENDING'
      );
    } catch (error) {
      console.error('Error checking pending application:', error);
      return false;
    }
  }

  /**
   * Get user's mentor application status
   */
  async getApplicationStatus(userId: string): Promise<{
    hasApplication: boolean;
    status?: string;
    applicationId?: string;
  }> {
    try {
      const applications = await this.getAllApplications();
      const userApplication = applications.find(app => app.userId === userId);
      
      if (!userApplication) {
        return { hasApplication: false };
      }
      
      return {
        hasApplication: true,
        status: userApplication.status,
        applicationId: userApplication.id
      };
    } catch (error) {
      console.error('Error getting application status:', error);
      return { hasApplication: false };
    }
  }
}

// Export singleton instance
export const mentorApplicationService = new MentorApplicationService();
export default mentorApplicationService;

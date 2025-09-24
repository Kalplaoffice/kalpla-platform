import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { UPDATE_USER } from '@/graphql/mutations';

const client = generateClient();

export interface UserApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  requestedRole: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  groups: string[];
  isVerified: boolean;
  createdAt: string;
  lastSignIn?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}

class AdminService {
  /**
   * Get all pending applications
   */
  async getPendingApplications(): Promise<UserApplication[]> {
    try {
      // This would typically call your GraphQL API
      // For now, returning mock data
      return [
        {
          id: 'app-1',
          userId: 'user-1',
          status: 'PENDING',
          submittedDate: '2024-01-01T00:00:00Z',
          requestedRole: 'Instructor',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      ];
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      throw error;
    }
  }

  /**
   * Approve user application and assign to group
   */
  async approveApplication(applicationId: string, reviewerNotes?: string): Promise<void> {
    try {
      // Get application details
      const application = await this.getApplicationById(applicationId);
      
      // Add user to the requested group
      await this.addUserToGroup(application.userId, application.requestedRole);
      
      // Update application status
      await this.updateApplicationStatus(applicationId, 'APPROVED', reviewerNotes);
      
      // Send notification to user
      await this.sendApprovalNotification(application.email, application.requestedRole);
      
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  }

  /**
   * Reject user application
   */
  async rejectApplication(applicationId: string, rejectionReason: string): Promise<void> {
    try {
      // Get application details
      const application = await this.getApplicationById(applicationId);
      
      // Update application status
      await this.updateApplicationStatus(applicationId, 'REJECTED', undefined, rejectionReason);
      
      // Send notification to user
      await this.sendRejectionNotification(application.email, rejectionReason);
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  }

  /**
   * Add user to Cognito group
   */
  async addUserToGroup(userId: string, groupName: string): Promise<void> {
    try {
      // This would typically call a Lambda function or use AWS SDK
      // For now, we'll use a mock implementation
      console.log(`Adding user ${userId} to group ${groupName}`);
      
      // In a real implementation, you would:
      // 1. Call a Lambda function with admin privileges
      // 2. Use AWS SDK to call cognito.adminAddUserToGroup
      // 3. Update user profile in DynamoDB
      
    } catch (error) {
      console.error('Error adding user to group:', error);
      throw error;
    }
  }

  /**
   * Remove user from Cognito group
   */
  async removeUserFromGroup(userId: string, groupName: string): Promise<void> {
    try {
      console.log(`Removing user ${userId} from group ${groupName}`);
      
      // In a real implementation, you would:
      // 1. Call a Lambda function with admin privileges
      // 2. Use AWS SDK to call cognito.adminRemoveUserFromGroup
      // 3. Update user profile in DynamoDB
      
    } catch (error) {
      console.error('Error removing user from group:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getUsers(page: number = 1, limit: number = 10, filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{ users: AdminUser[]; total: number; page: number; totalPages: number }> {
    try {
      // This would typically call your GraphQL API
      // For now, returning mock data
      const mockUsers: AdminUser[] = [
        {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Student',
          groups: ['Student'],
          isVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
          lastSignIn: '2024-01-15T10:30:00Z',
          status: 'ACTIVE'
        }
      ];

      return {
        users: mockUsers,
        total: mockUsers.length,
        page,
        totalPages: Math.ceil(mockUsers.length / limit)
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId: string, reason: string, userEmail?: string, firstName?: string): Promise<void> {
    try {
      console.log(`Suspending user ${userId} for reason: ${reason}`);
      
      // Update user status in DynamoDB via GraphQL
      const result = await client.graphql({
        query: UPDATE_USER,
        variables: {
          input: {
            id: userId,
            status: "Suspended",
          },
        },
      });

      console.log('User suspended successfully:', result);
      
      // Send email notification
      if (userEmail) {
        await this.sendStatusChangeNotification(userEmail, firstName || 'User', 'Suspended');
      }
      
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }

  /**
   * Reactivate user account
   */
  async reactivateUser(userId: string, userEmail?: string, firstName?: string): Promise<void> {
    try {
      console.log(`Reactivating user ${userId}`);
      
      // Update user status in DynamoDB via GraphQL
      const result = await client.graphql({
        query: UPDATE_USER,
        variables: {
          input: {
            id: userId,
            status: "Active",
          },
        },
      });

      console.log('User reactivated successfully:', result);
      
      // Send email notification
      if (userEmail) {
        await this.sendStatusChangeNotification(userEmail, firstName || 'User', 'Active');
      }
      
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, newRole: string): Promise<void> {
    try {
      // Get current user groups
      const currentGroups = await this.getUserGroups(userId);
      
      // Remove from all current groups
      for (const group of currentGroups) {
        await this.removeUserFromGroup(userId, group);
      }
      
      // Add to new group
      await this.addUserToGroup(userId, newRole);
      
      // Update user profile
      await this.updateUserProfile(userId, { role: newRole });
      
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Get user groups
   */
  private async getUserGroups(userId: string): Promise<string[]> {
    try {
      // This would typically call a Lambda function or use AWS SDK
      // For now, returning mock data
      return ['Student'];
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  }

  /**
   * Get application by ID
   */
  private async getApplicationById(applicationId: string): Promise<UserApplication> {
    try {
      // This would typically call your GraphQL API
      // For now, returning mock data
      return {
        id: applicationId,
        userId: 'user-1',
        status: 'PENDING',
        submittedDate: '2024-01-01T00:00:00Z',
        requestedRole: 'Instructor',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  private async updateApplicationStatus(
    applicationId: string, 
    status: 'APPROVED' | 'REJECTED', 
    reviewerNotes?: string,
    rejectionReason?: string
  ): Promise<void> {
    try {
      console.log(`Updating application ${applicationId} status to ${status}`);
      
      // In a real implementation, you would:
      // 1. Call your GraphQL API to update the application
      // 2. Update the application record in DynamoDB
      
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  private async updateUserProfile(userId: string, updates: Record<string, any>): Promise<void> {
    try {
      console.log(`Updating user ${userId} profile:`, updates);
      
      // In a real implementation, you would:
      // 1. Call your GraphQL API to update the user
      // 2. Update the user record in DynamoDB
      
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Send approval notification
   */
  private async sendApprovalNotification(email: string, role: string): Promise<void> {
    try {
      console.log(`Sending approval notification to ${email} for role ${role}`);
      
      // In a real implementation, you would:
      // 1. Call a Lambda function to send email/SMS notification
      // 2. Use AWS SES or SNS to send the notification
      
    } catch (error) {
      console.error('Error sending approval notification:', error);
      throw error;
    }
  }

  /**
   * Send rejection notification
   */
  private async sendRejectionNotification(email: string, reason: string): Promise<void> {
    try {
      console.log(`Sending rejection notification to ${email} with reason: ${reason}`);
      
      // In a real implementation, you would:
      // 1. Call a Lambda function to send email/SMS notification
      // 2. Use AWS SES or SNS to send the notification
      
    } catch (error) {
      console.error('Error sending rejection notification:', error);
      throw error;
    }
  }

  /**
   * Send status change notification via Lambda
   */
  private async sendStatusChangeNotification(email: string, firstName: string, status: 'Suspended' | 'Active'): Promise<void> {
    try {
      console.log(`📧 Sending ${status} notification to ${email}`);
      
      // Call the Lambda function directly
      const lambdaParams = {
        email,
        firstName,
        status
      };

      // Use AWS Lambda invoke via API Gateway or direct invocation
      // For now, we'll use a simple fetch to an API endpoint
      // In production, you might want to use AWS SDK directly
      const response = await fetch('/api/notifyUserStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lambdaParams),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      console.log(`✅ ${status} notification sent successfully to ${email}`);
      
    } catch (error) {
      console.error(`❌ Error sending ${status} notification to ${email}:`, error);
      // Don't throw error here to prevent blocking the main operation
      // The status change should still succeed even if email fails
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;

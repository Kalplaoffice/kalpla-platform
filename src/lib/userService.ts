import { generateClient } from 'aws-amplify/api';
import { GET_USER } from '@/graphql/queries';

const client = generateClient();

export interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  /**
   * Get user data by ID
   */
  async getUserById(userId: string): Promise<UserData | null> {
    try {
      const result = await client.graphql({
        query: GET_USER,
        variables: { id: userId },
      });

      return result.data.getUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /**
   * Check if user is suspended
   */
  async isUserSuspended(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user?.status === 'Suspended';
    } catch (error) {
      console.error('Error checking user suspension status:', error);
      return false;
    }
  }

  /**
   * Get user status
   */
  async getUserStatus(userId: string): Promise<string | null> {
    try {
      const user = await this.getUserById(userId);
      return user?.status || null;
    } catch (error) {
      console.error('Error getting user status:', error);
      return null;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;

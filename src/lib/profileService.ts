import { generateClient } from 'aws-amplify/api';
import { 
  UPDATE_USER_PROFILE, 
  UPDATE_STUDENT_PROFILE, 
  UPDATE_MENTOR_PROFILE 
} from '../graphql/mutations';
import { 
  GET_USER_PROFILE, 
  GET_STUDENT_PROFILE, 
  GET_MENTOR_PROFILE 
} from '../graphql/queries';

const client = generateClient();

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  bio?: string;
  interests?: string[];
  goals?: string;
  currentPhase?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  totalCoursesCompleted?: number;
  totalHoursWatched?: number;
  averageGrade?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  bio?: string;
  expertise?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  portfolio?: string;
  linkedinProfile?: string;
  website?: string;
  assignedPhases?: string[];
  maxStudentsPerPhase?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
}

export interface UpdateStudentProfileData {
  id: string;
  bio?: string;
  interests?: string[];
  goals?: string;
  education?: string;
  experience?: string;
  skills?: string[];
}

export interface UpdateMentorProfileData {
  id: string;
  bio?: string;
  expertise?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  portfolio?: string;
  linkedinProfile?: string;
  website?: string;
}

export const profileService = {
  /**
   * Update user profile
   */
  async updateUserProfile(profileData: UpdateUserProfileData): Promise<UserProfile> {
    try {
      const result = await client.graphql({
        query: UPDATE_USER_PROFILE,
        variables: { input: profileData }
      });
      return result.data.updateUserProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Update student profile
   */
  async updateStudentProfile(profileData: UpdateStudentProfileData): Promise<StudentProfile> {
    try {
      const result = await client.graphql({
        query: UPDATE_STUDENT_PROFILE,
        variables: { input: profileData }
      });
      return result.data.updateStudentProfile;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  },

  /**
   * Update mentor profile
   */
  async updateMentorProfile(profileData: UpdateMentorProfileData): Promise<MentorProfile> {
    try {
      const result = await client.graphql({
        query: UPDATE_MENTOR_PROFILE,
        variables: { input: profileData }
      });
      return result.data.updateMentorProfile;
    } catch (error) {
      console.error('Error updating mentor profile:', error);
      throw error;
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const result = await client.graphql({
        query: GET_USER_PROFILE,
        variables: { id: userId }
      });
      return result.data.getUserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Get student profile
   */
  async getStudentProfile(userId: string): Promise<StudentProfile> {
    try {
      const result = await client.graphql({
        query: GET_STUDENT_PROFILE,
        variables: { userId }
      });
      return result.data.getStudentProfile;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  },

  /**
   * Get mentor profile
   */
  async getMentorProfile(userId: string): Promise<MentorProfile> {
    try {
      const result = await client.graphql({
        query: GET_MENTOR_PROFILE,
        variables: { userId }
      });
      return result.data.getMentorProfile;
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      throw error;
    }
  },

  /**
   * Get full name from profile
   */
  getFullName(profile: UserProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
  },

  /**
   * Get initials from profile
   */
  getInitials(profile: UserProfile): string {
    const firstInitial = profile.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = profile.lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  },

  /**
   * Validate profile data
   */
  validateProfileData(data: any, requiredFields: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format skills array for display
   */
  formatSkills(skills: string[]): string {
    return skills.join(', ');
  },

  /**
   * Parse skills string to array
   */
  parseSkills(skillsString: string): string[] {
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  },

  /**
   * Get profile completion percentage
   */
  getProfileCompletionPercentage(profile: any, requiredFields: string[]): number {
    const completedFields = requiredFields.filter(field => {
      const value = profile[field];
      return value && (typeof value !== 'string' || value.trim() !== '');
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }
};

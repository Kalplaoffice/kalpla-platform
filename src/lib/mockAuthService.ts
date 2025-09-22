import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';

// Mock users with different roles
export const mockUsers = {
  admin: {
    username: 'admin@kalpla.in',
    password: 'Admin123!',
    email: 'admin@kalpla.in',
    role: 'Admin',
    name: 'Admin User',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      company: 'Kalpla',
      position: 'System Administrator'
    }
  },
  learncapacademy: {
    username: 'learncapacademy@gmail.com',
    password: 'PocoX2@512200',
    email: 'learncapacademy@gmail.com',
    role: 'Admin',
    name: 'LearnCap Academy Admin',
    profile: {
      firstName: 'LearnCap',
      lastName: 'Academy',
      company: 'LearnCap Academy',
      position: 'Administrator'
    }
  },
  student: {
    username: 'student@kalpla.in',
    password: 'Student123!',
    email: 'student@kalpla.in',
    role: 'Student',
    name: 'John Student',
    profile: {
      firstName: 'John',
      lastName: 'Student',
      company: 'University',
      position: 'Student'
    }
  },
  instructor: {
    username: 'instructor@kalpla.in',
    password: 'Instructor123!',
    email: 'instructor@kalpla.in',
    role: 'Instructor',
    name: 'Dr. Jane Instructor',
    profile: {
      firstName: 'Jane',
      lastName: 'Instructor',
      company: 'Kalpla University',
      position: 'Professor'
    }
  },
  mentor: {
    username: 'mentor@kalpla.in',
    password: 'Mentor123!',
    email: 'mentor@kalpla.in',
    role: 'Mentor',
    name: 'Mike Mentor',
    profile: {
      firstName: 'Mike',
      lastName: 'Mentor',
      company: 'TechCorp',
      position: 'Senior Developer'
    }
  },
  investor: {
    username: 'investor@kalpla.in',
    password: 'Investor123!',
    email: 'investor@kalpla.in',
    role: 'Investor',
    name: 'Sarah Investor',
    profile: {
      firstName: 'Sarah',
      lastName: 'Investor',
      company: 'Venture Capital',
      position: 'Investment Partner'
    }
  }
};

// Mock authentication service
export class MockAuthService {
  private static currentUser: any = null;
  private static isAuthenticated = false;

  // Mock sign in
  static async signIn(username: string, password: string) {
    try {
      // Check if it's a mock user
      const mockUser = Object.values(mockUsers).find(user => 
        user.username === username && user.password === password
      );

      if (mockUser) {
        // Create mock user object
        this.currentUser = {
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name,
          profile: mockUser.profile,
          signInDetails: {
            loginId: mockUser.username
          },
          userId: mockUser.username,
          isMockUser: true
        };
        
        this.isAuthenticated = true;
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockAuth', JSON.stringify({
            user: this.currentUser,
            isAuthenticated: true,
            timestamp: Date.now()
          }));
        }

        return {
          isSignedIn: true,
          nextStep: {
            signInStep: 'DONE'
          }
        };
      } else {
        // For non-mock users, throw an error instead of trying Cognito
        throw new Error('Invalid credentials. Please use one of the test accounts.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Mock sign up
  static async signUp(username: string, password: string, email: string, role: string = 'Student') {
    try {
      // For mock users, just return success
      if (Object.values(mockUsers).some(user => user.username === username)) {
        return {
          isSignUpComplete: true,
          nextStep: {
            signUpStep: 'DONE'
          }
        };
      }

      // Try real Cognito sign up
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Mock sign out
  static async signOut() {
    try {
      this.currentUser = null;
      this.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuth');
      }
      
      // Try real Cognito sign out
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      // Check localStorage first for mock users
      if (typeof window === 'undefined') return null;
      const mockAuth = localStorage.getItem('mockAuth');
      if (mockAuth) {
        const { user, isAuthenticated, timestamp } = JSON.parse(mockAuth);
        
        // Check if session is still valid (24 hours)
        if (isAuthenticated && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          this.currentUser = user;
          this.isAuthenticated = true;
          return user;
        } else {
          if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuth');
      }
        }
      }

      // Try real Cognito
      const user = await getCurrentUser();
      this.currentUser = user;
      this.isAuthenticated = true;
      return user;
    } catch (error) {
      this.currentUser = null;
      this.isAuthenticated = false;
      return null;
    }
  }

  // Get user role
  static getUserRole(): string {
    if (this.currentUser?.role) {
      return this.currentUser.role;
    }
    return 'Guest';
  }

  // Check if user is authenticated
  static isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get user profile
  static getUserProfile() {
    return this.currentUser?.profile || null;
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  // Check if user has any of the specified roles
  static hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }

  // Get mock users for testing
  static getMockUsers() {
    return mockUsers;
  }

  // Check if user is a mock user
  static isMockUser(username: string): boolean {
    return Object.values(mockUsers).some(user => user.username === username);
  }

  // Get mock user by username
  static getMockUser(username: string) {
    return Object.values(mockUsers).find(user => user.username === username);
  }

  // Initialize mock auth from localStorage
  static initializeFromStorage() {
    if (typeof window === 'undefined') return null;
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
      const { user, isAuthenticated, timestamp } = JSON.parse(mockAuth);
      
      // Check if session is still valid
      if (isAuthenticated && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        this.currentUser = user;
        this.isAuthenticated = true;
        return true;
      } else {
        if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuth');
      }
      }
    }
    return false;
  }
}

// Initialize mock auth on module load
MockAuthService.initializeFromStorage();

export default MockAuthService;

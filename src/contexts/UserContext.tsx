'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getCurrentUser, 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp, 
  resendSignUpCode, 
  resetPassword, 
  confirmResetPassword, 
  updatePassword, 
  updateUserAttributes,
  signInWithRedirect
} from '@aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  name?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
  };
  signInDetails?: {
    loginId: string;
    groups?: string[];
  };
  userId: string;
  isMockUser?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (data: {
    email?: string;
    phoneNumber?: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendSignUp: (username: string) => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  resetPassword: (username: string, code: string, newPassword: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (attributes: Record<string, string>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Only use Cognito - no mock auth fallback
      const cognitoUser = await getCurrentUser();
      if (cognitoUser) {
        const userData = await transformCognitoUser(cognitoUser);
        setUser(userData);
      }
    } catch (error) {
      console.log('No authenticated user');
      setUser(null);
    } finally {
      setLoading(false);
    }

    // Listen for auth state changes
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      const { event } = payload;
      
      if (event === 'signIn') {
        try {
          const cognitoUser = await getCurrentUser();
          const userData = await transformCognitoUser(cognitoUser);
          setUser(userData);
        } catch (error) {
          console.error('Error getting user after sign in:', error);
          setUser(null);
        }
      } else if (event === 'signOut') {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  };

  const transformCognitoUser = async (cognitoUser: any): Promise<User> => {
    const attributes = cognitoUser.attributes || {};
    
    return {
      id: cognitoUser.username,
      email: attributes.email || cognitoUser.username,
      firstName: attributes.given_name || attributes.firstName,
      lastName: attributes.family_name || attributes.lastName,
      role: attributes['custom:role'] || attributes.role || 'Student',
      name: attributes.name || `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
      profile: {
        firstName: attributes.given_name || attributes.firstName,
        lastName: attributes.family_name || attributes.lastName,
        company: attributes['custom:company'] || attributes.company,
        position: attributes['custom:position'] || attributes.position,
      },
      signInDetails: {
        loginId: cognitoUser.username,
      },
      userId: cognitoUser.username,
      isMockUser: false,
    };
  };

  const signIn = async (username: string, password: string) => {
    try {
      const result = await signIn(username, password);
      // The auth state change listener will handle setting the user
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (data: {
    email?: string;
    phoneNumber?: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => {
    try {
      const signUpData = {
        username: data.email || data.phoneNumber || '',
        password: data.password,
        attributes: {
          email: data.email,
          phone_number: data.phoneNumber,
          given_name: data.firstName,
          family_name: data.lastName,
          'custom:role': data.role || 'Student',
        },
      };

      await signUp(signUpData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      await confirmSignUp(username, code);
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  };

  const resendSignUp = async (username: string) => {
    try {
      await resendSignUpCode(username);
    } catch (error) {
      console.error('Resend sign up error:', error);
      throw error;
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      await resetPassword(username);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (username: string, code: string, newPassword: string) => {
    try {
      await resetPasswordSubmit(username, code, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const currentUser = await getCurrentUser();
      await updatePassword(currentUser, { oldPassword, newPassword });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const updateProfile = async (attributes: Record<string, string>) => {
    try {
      const currentUser = await getCurrentUser();
      await updateUserAttributes(currentUser, attributes);
      
      // Refresh user data
      const updatedUser = await getCurrentUser();
      const userData = await transformCognitoUser(updatedUser);
      setUser(userData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userData = await transformCognitoUser(currentUser);
      setUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle,
      signOut, 
      confirmSignUp, 
      resendSignUp,
      forgotPassword,
      resetPassword,
      changePassword,
      updateProfile,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

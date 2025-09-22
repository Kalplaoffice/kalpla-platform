'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User } from '@/lib/authService';
import MockAuthService from '@/lib/mockAuthService';

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
      // Try real Cognito auth first
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        return;
      }

      // If no Cognito user, check mock auth
      const mockUser = await MockAuthService.getCurrentUser();
      if (mockUser) {
        setUser(mockUser);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('No authenticated user');
    } finally {
      setLoading(false);
    }

    // Listen for auth state changes
    const unsubscribe = authService.addAuthListener((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  };

  const signIn = async (username: string, password: string) => {
    try {
      // For Cognito users, try Cognito first
      const cognitoUsers = [
        'learncapacademy@gmail.com',
        'jnaneshshetty08@gmail.com',
        'jnaneshshetty09@gmail.com',
        'jnaneshshetty512@gmail.com'
      ];
      
      if (cognitoUsers.includes(username)) {
        try {
          const user = await authService.signIn({ username, password });
          setUser(user);
          return;
        } catch (cognitoError) {
          console.error('Cognito sign in error:', cognitoError);
          throw cognitoError;
        }
      }

      // For other users, try mock auth first
      const mockResult = await MockAuthService.signIn(username, password);
      if (mockResult.isSignedIn) {
        const mockUser = await MockAuthService.getCurrentUser();
        setUser(mockUser);
        return;
      }
    } catch (mockError) {
      // If mock auth fails, try real Cognito auth
      try {
        const user = await authService.signIn({ username, password });
        setUser(user);
      } catch (cognitoError) {
        console.error('Sign in error:', cognitoError);
        throw cognitoError;
      }
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
      await authService.signUp(data);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Sign out from mock auth
      await MockAuthService.signOut();
      
      // Sign out from real Cognito
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      await authService.confirmSignUp(username, code);
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  };

  const resendSignUp = async (username: string) => {
    try {
      await authService.resendSignUp(username);
    } catch (error) {
      console.error('Resend sign up error:', error);
      throw error;
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      await authService.forgotPassword(username);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (username: string, code: string, newPassword: string) => {
    try {
      await authService.forgotPasswordSubmit(username, code, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const updateProfile = async (attributes: Record<string, string>) => {
    try {
      await authService.updateUserAttributes(attributes);
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
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

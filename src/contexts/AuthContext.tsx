'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { multiAuthService, AuthUser } from '@/lib/multiAuthService';
import { User, getUserRole } from '@/lib/authUtils';
import { tokenClaimsService, TokenClaims } from '@/lib/tokenClaimsService';
import { userService } from '@/lib/userService';

interface AuthContextType {
  user: AuthUser | null;
  tokenClaims: TokenClaims | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userStatus: string | null;
  isSuspended: boolean;
  signIn: (data: { email?: string; phone?: string; password: string; loginMethod: 'email' | 'phone' }) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email?: string; phone?: string; password: string; name?: string; loginMethod: 'email' | 'phone' }) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  confirmSignUp: (username: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (username: string) => Promise<{ success: boolean; error?: string }>;
  confirmResetPassword: (username: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getUserRole: () => string;
  hasPermission: (permission: string) => Promise<boolean>;
  hasRole: (role: string | string[]) => Promise<boolean>;
  getAvailablePermissions: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokenClaims, setTokenClaims] = useState<TokenClaims | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);

  // Function to check user status
  const checkUserStatus = async (userId: string) => {
    try {
      const status = await userService.getUserStatus(userId);
      setUserStatus(status);
      setIsSuspended(status === 'Suspended');
      
      // If user is suspended, sign them out
      if (status === 'Suspended') {
        console.log('User is suspended, signing out...');
        await multiAuthService.signOut();
        setUser(null);
        setTokenClaims(null);
        setUserStatus(null);
        setIsSuspended(false);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const currentUser = await multiAuthService.getCurrentUser();
        setUser(currentUser);
        
        // Check user status if user exists
        if (currentUser) {
          await checkUserStatus(currentUser.id);
        }
        
        // Get token claims
        const claims = await tokenClaimsService.getTokenClaims();
        setTokenClaims(claims);
      } catch (error) {
        console.log('No authenticated user');
        setUser(null);
        setTokenClaims(null);
        setUserStatus(null);
        setIsSuspended(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const removeListener = multiAuthService.addAuthListener(async (authUser) => {
      setUser(authUser);
      
      // Check user status if user exists
      if (authUser) {
        await checkUserStatus(authUser.id);
      } else {
        setUserStatus(null);
        setIsSuspended(false);
      }
      
      // Update token claims when user changes
      if (authUser) {
        const claims = await tokenClaimsService.getTokenClaims();
        setTokenClaims(claims);
      } else {
        setTokenClaims(null);
        tokenClaimsService.clearCache();
      }
      
      setIsLoading(false);
    });

    return () => removeListener();
  }, []);

  const signIn = async (data: { email?: string; phone?: string; password: string; loginMethod: 'email' | 'phone' }) => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.signIn(data);
      if (result.success && result.user) {
        setUser(result.user);
        
        // Check user status after successful login
        await checkUserStatus(result.user.id);
      }
      return {
        success: result.success,
        error: result.error?.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign in failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: { email?: string; phone?: string; password: string; name?: string; loginMethod: 'email' | 'phone' }) => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.signUp(data);
      return {
        success: result.success,
        error: result.error?.message,
        requiresConfirmation: result.requiresConfirmation
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.signOut();
      if (result.success) {
        setUser(null);
      }
      return {
        success: result.success,
        error: result.error?.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign out failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.confirmSignUp(username, code);
      return {
        success: result.success,
        error: result.error?.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Confirmation failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (username: string) => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.resetPassword(username);
      return {
        success: result.success,
        error: result.error?.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmResetPassword = async (username: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const result = await multiAuthService.confirmResetPassword(username, code, newPassword);
      return {
        success: result.success,
        error: result.error?.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset confirmation failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = (): string => {
    if (!user) return 'Guest';
    
    // Use token claims if available, otherwise fallback to legacy method
    if (tokenClaims) {
      return tokenClaims.role;
    }
    
    // Convert AuthUser to User format for compatibility
    const userForRole: User = {
      username: user.name,
      email: user.email,
      role: undefined, // Will be determined by getUserRole function
      signInDetails: {
        loginId: user.email || user.phone,
        groups: []
      },
      userId: user.id,
      isMockUser: false
    };

    return getUserRole(userForRole);
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    return await tokenClaimsService.hasPermission(permission);
  };

  const hasRole = async (role: string | string[]): Promise<boolean> => {
    return await tokenClaimsService.hasRole(role);
  };

  const getAvailablePermissions = async (): Promise<string[]> => {
    return await tokenClaimsService.getAvailablePermissions();
  };

  const value: AuthContextType = {
    user,
    tokenClaims,
    isLoading,
    isAuthenticated: !!user,
    userStatus,
    isSuspended,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    getUserRole,
    hasPermission,
    hasRole,
    getAvailablePermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for role-based access control
export function useRoleBasedAccess() {
  const { user, tokenClaims, userStatus, isSuspended, getUserRole, hasPermission, hasRole: hasRoleAsync } = useAuth();
  const userRole = getUserRole();

  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!user || isSuspended) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
  };

  const isAdmin = (): boolean => hasRole('Admin');
  const isMentor = (): boolean => hasRole('Mentor');
  const isStudent = (): boolean => hasRole(['Student', 'StudentKSMP']);
  const isStudentKSMP = (): boolean => hasRole('StudentKSMP');
  const isInvestor = (): boolean => hasRole('Investor');

  return {
    user,
    tokenClaims,
    userRole,
    userStatus,
    isSuspended,
    hasRole,
    hasPermission,
    hasRoleAsync,
    isAdmin,
    isMentor,
    isStudent,
    isStudentKSMP,
    isInvestor,
    isAuthenticated: !!user && !isSuspended
  };
}

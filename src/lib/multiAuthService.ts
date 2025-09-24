import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  picture?: string;
  loginMethod: 'email' | 'phone' | 'google';
  isVerified: boolean;
}

export interface SignUpData {
  email?: string;
  phone?: string;
  password: string;
  name?: string;
  loginMethod: 'email' | 'phone';
}

export interface SignInData {
  email?: string;
  phone?: string;
  password: string;
  loginMethod: 'email' | 'phone';
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

class MultiAuthService {
  private currentUser: AuthUser | null = null;
  private authListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const user = await this.getCurrentUser();
      this.setCurrentUser(user);
    } catch (error) {
      this.setCurrentUser(null);
    }

    // Listen for auth events
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          this.handleSignIn(payload.data);
          break;
        case 'signedOut':
          this.handleSignOut();
          break;
        case 'tokenRefresh':
          this.handleTokenRefresh(payload.data);
          break;
        case 'tokenRefresh_failure':
          this.handleTokenRefreshFailure(payload.data);
          break;
      }
    });
  }

  private async handleSignIn(data: any) {
    try {
      const user = await this.getCurrentUser();
      this.setCurrentUser(user);
    } catch (error) {
      console.error('Error handling sign in:', error);
    }
  }

  private handleSignOut() {
    this.setCurrentUser(null);
  }

  private handleTokenRefresh(data: any) {
    console.log('Token refreshed:', data);
  }

  private handleTokenRefreshFailure(data: any) {
    console.error('Token refresh failed:', data);
    this.setCurrentUser(null);
  }

  private setCurrentUser(user: AuthUser | null) {
    this.currentUser = user;
    this.authListeners.forEach(listener => listener(user));
  }

  // Public methods
  async signUp(data: SignUpData): Promise<{ success: boolean; error?: AuthError; requiresConfirmation?: boolean }> {
    try {
      let username: string;
      let userAttributes: any = {};

      if (data.loginMethod === 'email' && data.email) {
        username = data.email;
        userAttributes.email = data.email;
      } else if (data.loginMethod === 'phone' && data.phone) {
        username = data.phone;
        userAttributes.phone_number = data.phone;
      } else {
        throw new Error('Invalid login method or missing credentials');
      }

      if (data.name) {
        userAttributes.name = data.name;
      }

      const result = await signUp({
        username,
        password: data.password,
        options: {
          userAttributes
        }
      });

      return {
        success: true,
        requiresConfirmation: result.isSignUpComplete === false
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async signIn(data: SignInData): Promise<{ success: boolean; error?: AuthError; user?: AuthUser }> {
    try {
      let username: string;

      if (data.loginMethod === 'email' && data.email) {
        username = data.email;
      } else if (data.loginMethod === 'phone' && data.phone) {
        username = data.phone;
      } else {
        throw new Error('Invalid login method or missing credentials');
      }

      const result = await signIn({
        username,
        password: data.password
      });

      if (result.isSignedIn) {
        const user = await this.getCurrentUser();
        return {
          success: true,
          user
        };
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async signInWithGoogle(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await signInWithRedirect({ provider: 'Google' });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'GOOGLE_SIGNIN_ERROR',
          message: error.message || 'Google sign-in failed',
          name: error.name || 'GoogleSignInError'
        }
      };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await signOut();
      this.setCurrentUser(null);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser();
      
      // Determine login method based on available attributes
      let loginMethod: 'email' | 'phone' | 'google' = 'email';
      if (user.signInDetails?.loginId) {
        const loginId = user.signInDetails.loginId;
        if (loginId.includes('@')) {
          loginMethod = 'email';
        } else if (loginId.match(/^\+\d/)) {
          loginMethod = 'phone';
        }
      }

      // Check if it's a Google login (would have different attributes)
      if (user.signInDetails?.loginId?.includes('google')) {
        loginMethod = 'google';
      }

      return {
        id: user.userId,
        email: user.signInDetails?.loginId?.includes('@') ? user.signInDetails.loginId : undefined,
        phone: user.signInDetails?.loginId?.match(/^\+\d/) ? user.signInDetails.loginId : undefined,
        name: user.username,
        picture: undefined, // Would be available for Google OAuth
        loginMethod,
        isVerified: true // Assume verified if we can get the user
      };
    } catch (error) {
      return null;
    }
  }

  async confirmSignUp(username: string, confirmationCode: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await confirmSignUp({
        username,
        confirmationCode
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async resendConfirmationCode(username: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await resendSignUpCode({ username });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async resetPassword(username: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await resetPassword({ username });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  async confirmResetPassword(username: string, confirmationCode: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          name: error.name || 'Error'
        }
      };
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUserSync(): AuthUser | null {
    return this.currentUser;
  }

  addAuthListener(listener: (user: AuthUser | null) => void): () => void {
    this.authListeners.push(listener);
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Validation helpers
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length === 10) {
      return `+1${digits}`; // Default to US
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    } else if (digits.length > 11) {
      return `+${digits}`;
    }
    
    return phone; // Return as-is if can't format
  }
}

export const multiAuthService = new MultiAuthService();

import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, resetPassword, updatePassword, updateUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  groups: string[];
  phoneNumber?: string;
  profilePicture?: string;
  isVerified: boolean;
  signInDetails?: {
    loginId: string;
    groups?: string[];
    authFlowType?: string;
  };
}

export interface SignUpData {
  email?: string;
  phoneNumber?: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface SignInData {
  username: string; // Can be email, phone, or username
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.setupAuthListener();
  }

  /**
   * Setup authentication state listener
   */
  private setupAuthListener() {
    Hub.listen('auth', (data) => {
      const { payload } = data;
      
      switch (payload.event) {
        case 'signIn':
          this.handleSignIn(payload.data);
          break;
        case 'signOut':
          this.handleSignOut();
          break;
        case 'signUp':
          this.handleSignUp(payload.data);
          break;
        case 'confirmSignUp':
          this.handleConfirmSignUp(payload.data);
          break;
        case 'forgotPassword':
          this.handleForgotPassword(payload.data);
          break;
        case 'forgotPasswordSubmit':
          this.handleForgotPasswordSubmit(payload.data);
          break;
        case 'tokenRefresh':
          this.handleTokenRefresh(payload.data);
          break;
        case 'tokenRefresh_failure':
          this.handleTokenRefreshFailure(payload.data);
          break;
        case 'configured':
          this.handleConfigured();
          break;
      }
    });
  }

  /**
   * Add authentication state listener
   */
  addAuthListener(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  /**
   * Sign up with email or phone number
   */
  async signUp(data: SignUpData): Promise<CognitoUser> {
    try {
      const { email, phoneNumber, password, firstName, lastName, role } = data;
      
      // Determine username (email takes precedence over phone)
      const username = email || phoneNumber;
      if (!username) {
        throw new Error('Either email or phone number is required');
      }

      // Prepare attributes
      const attributes: any = {
        given_name: firstName,
        family_name: lastName,
      };

      if (email) {
        attributes.email = email;
      }
      
      if (phoneNumber) {
        attributes.phone_number = phoneNumber;
      }

      if (role && role !== 'Student') {
        attributes['custom:requested_role'] = role;
      }

      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: attributes
        }
      });

      console.log('Sign up successful:', result);
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(username: string, code: string): Promise<string> {
    try {
      const result = await confirmSignUp({ username, confirmationCode: code });
      console.log('Confirm sign up successful:', result);
      return result;
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Resend confirmation code
   */
  async resendSignUp(username: string): Promise<void> {
    try {
      await resendSignUpCode({ username });
      console.log('Resend sign up successful');
    } catch (error) {
      console.error('Resend sign up error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Sign in with email, phone, or username
   */
  async signIn(data: SignInData): Promise<User> {
    try {
      const { username, password } = data;
      
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (!isSignedIn) {
        throw new Error('Sign in failed');
      }
      const cognitoUser = await getCurrentUser();
      console.log('Sign in successful:', cognitoUser);
      
      // Extract user information from the user object
      const user = await this.extractUserFromSession(cognitoUser);
      this.currentUser = user;
      this.notifyListeners();
      
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Sign in with Google (federated)
   */
  async signInWithGoogle(): Promise<void> {
    try {
      // Google sign-in not implemented in v6 yet
      throw new Error('Google sign-in not implemented in v6 yet');
    } catch (error) {
      console.error('Google sign in error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut();
      this.currentUser = null;
      this.notifyListeners();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser) {
        const user = await this.extractUserFromSession(cognitoUser);
        this.currentUser = user;
        return user;
      }
      return null;
    } catch (error) {
      console.log('No authenticated user:', error);
      this.currentUser = null;
      return null;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<CognitoUserSession | null> {
    try {
      // Session handling is different in v6
      const user = await getCurrentUser();
      return user ? { getIdToken: () => ({ getPayload: () => ({}) }) } : null;
    } catch (error) {
      console.log('No current session:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(username: string): Promise<void> {
    try {
      await resetPassword({ username });
      console.log('Forgot password successful');
    } catch (error) {
      console.error('Forgot password error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Reset password with code
   */
  async forgotPasswordSubmit(username: string, code: string, newPassword: string): Promise<void> {
    try {
      await resetPassword({
        username,
        confirmationCode: code,
        newPassword
      });
      console.log('Reset password successful');
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await updatePassword({ oldPassword, newPassword });
      console.log('Change password successful');
    } catch (error) {
      console.error('Change password error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Update user attributes
   */
  async updateUserAttributes(attributes: Record<string, string>): Promise<void> {
    try {
      await updateUserAttributes({ userAttributes: attributes });
      console.log('Update user attributes successful');
    } catch (error) {
      console.error('Update user attributes error:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Extract user information from Amplify v6 user object
   */
  private async extractUserFromSession(user: any): Promise<User> {
    // In v6, user object structure is different
    const userId = user.userId || user.username || '';
    const email = user.signInDetails?.loginId || '';
    const firstName = email.split('@')[0] || '';
    
    // Determine role based on email (fallback for specific users)
    let role = 'Student';
    if (email === 'learncapacademy@gmail.com') {
      role = 'Admin';
    } else if (email === 'jnaneshshetty08@gmail.com') {
      role = 'Student';
    } else if (email === 'jnaneshshetty09@gmail.com') {
      role = 'Mentor';
    } else if (email === 'jnaneshshetty512@gmail.com') {
      role = 'StudentKSMP';
    }
    
    // TODO: In the future, we should get groups from Cognito tokens
    // For now, we'll use email-based role detection
    const groups = [role];
    
    return {
      id: userId,
      email: email,
      firstName: firstName,
      lastName: '',
      role: role,
      groups: groups,
      phoneNumber: undefined,
      profilePicture: undefined,
      isVerified: true,
      signInDetails: {
        loginId: email,
        groups: groups,
        authFlowType: user.signInDetails?.authFlowType || 'USER_SRP_AUTH'
      }
    };
  }

  /**
   * Determine primary role from groups and custom role
   */
  private determinePrimaryRole(groups: string[], customRole: string): string {
    const rolePrecedence = {
      'Admin': 5,
      'Instructor': 4,
      'Mentor': 3,
      'Investor': 2,
      'Student': 1
    };
    
    let highestRole = customRole;
    let highestPrecedence = rolePrecedence[customRole as keyof typeof rolePrecedence] || 0;
    
    for (const group of groups) {
      const precedence = rolePrecedence[group as keyof typeof rolePrecedence] || 0;
      if (precedence > highestPrecedence) {
        highestPrecedence = precedence;
        highestRole = group;
      }
    }
    
    return highestRole;
  }

  /**
   * Normalize error objects
   */
  private normalizeError(error: any): AuthError {
    if (error.code) {
      return {
        code: error.code,
        message: error.message || error.name || 'Authentication error',
        name: error.name || 'AuthError'
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      name: 'AuthError'
    };
  }

  /**
   * Event handlers
   */
  private handleSignIn(data: any) {
    console.log('Auth event: signIn', data);
    // User will be extracted when getCurrentUser is called
  }

  private handleSignOut() {
    console.log('Auth event: signOut');
    this.currentUser = null;
    this.notifyListeners();
  }

  private handleSignUp(data: any) {
    console.log('Auth event: signUp', data);
  }

  private handleConfirmSignUp(data: any) {
    console.log('Auth event: confirmSignUp', data);
  }

  private handleForgotPassword(data: any) {
    console.log('Auth event: forgotPassword', data);
  }

  private handleForgotPasswordSubmit(data: any) {
    console.log('Auth event: forgotPasswordSubmit', data);
  }

  private handleTokenRefresh(data: any) {
    console.log('Auth event: tokenRefresh', data);
  }

  private handleTokenRefreshFailure(data: any) {
    console.log('Auth event: tokenRefresh_failure', data);
    this.currentUser = null;
    this.notifyListeners();
  }

  private handleConfigured() {
    console.log('Auth event: configured');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
import MockAuthService from './mockAuthService';

export interface User {
  username?: string;
  email?: string;
  role?: string;
  name?: string;
  profile?: any;
  signInDetails?: {
    loginId?: string;
    groups?: string[];
  };
  userId?: string;
  isMockUser?: boolean;
}

/**
 * Get user role from user object
 */
export function getUserRole(user: User | null): string {
  if (!user) return 'Guest';
  
  if (user.role) {
    return user.role;
  }
  
  // Check for Cognito groups in user attributes
  if (user.signInDetails?.loginId) {
    // This is a real Cognito user
    const email = user.signInDetails.loginId;
    
    // Check specific users for their roles
    if (email === 'learncapacademy@gmail.com') {
      return 'Admin';
    } else if (email === 'jnaneshshetty08@gmail.com') {
      return 'Student';
    } else if (email === 'jnaneshshetty09@gmail.com') {
      return 'Mentor';
    } else if (email === 'jnaneshshetty512@gmail.com') {
      return 'StudentKSMP';
    }
    
    // Check if user has groups in attributes (if available)
    if (user.signInDetails.groups && user.signInDetails.groups.length > 0) {
      return user.signInDetails.groups[0];
    }
  }
  
  // Check mock auth service
  if (MockAuthService.isUserAuthenticated()) {
    return MockAuthService.getUserRole();
  }
  
  return 'Guest';
}

/**
 * Get dashboard path based on user role
 */
export function getDashboardPath(user: User | null): string {
  const role = getUserRole(user);
  
  switch (role) {
    case 'Admin':
      return '/admin/dashboard';
    case 'Student':
      return '/student/dashboard';
    case 'StudentKSMP':
      return '/student-ksmp/dashboard';
    case 'Instructor':
      return '/instructor/dashboard';
    case 'Mentor':
      return '/mentor/dashboard';
    case 'Investor':
      return '/investor/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(user: User | null): boolean {
  return user !== null || MockAuthService.isUserAuthenticated();
}

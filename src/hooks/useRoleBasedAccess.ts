import { useUser } from '@/contexts/UserContext';
import MockAuthService from '@/lib/mockAuthService';

export interface RolePermissions {
  canViewAdmin: boolean;
  canViewStudent: boolean;
  canViewInstructor: boolean;
  canViewMentor: boolean;
  canViewInvestor: boolean;
  canCreateCourses: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canAccessKSMP: boolean;
  canViewStartups: boolean;
  canManagePayments: boolean;
}

export function useRoleBasedAccess() {
  const { user } = useUser();

  const getUserRole = (): string => {
    if (user?.role) {
      return user.role;
    }
    
    // Check for Cognito groups in user attributes
    if (user?.signInDetails?.loginId) {
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
  };

  const hasRole = (role: string): boolean => {
    return getUserRole() === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    const userRole = getUserRole();
    return roles.includes(userRole);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    const userRole = getUserRole();
    return roles.every(role => userRole === role);
  };

  const getPermissions = (): RolePermissions => {
    const role = getUserRole();
    
    return {
      canViewAdmin: role === 'Admin',
      canViewStudent: ['Admin', 'Student', 'StudentKSMP'].includes(role),
      canViewInstructor: ['Admin', 'Instructor'].includes(role),
      canViewMentor: ['Admin', 'Mentor'].includes(role),
      canViewInvestor: ['Admin', 'Investor'].includes(role),
      canCreateCourses: ['Admin', 'Instructor'].includes(role),
      canManageUsers: role === 'Admin',
      canViewAnalytics: ['Admin', 'Instructor', 'Mentor'].includes(role),
      canAccessKSMP: ['Admin', 'Student', 'StudentKSMP', 'Mentor'].includes(role),
      canViewStartups: ['Admin', 'Investor', 'Mentor'].includes(role),
      canManagePayments: ['Admin', 'Student', 'StudentKSMP'].includes(role)
    };
  };

  const canAccess = (resource: string): boolean => {
    const permissions = getPermissions();
    
    switch (resource) {
      case 'admin':
        return permissions.canViewAdmin;
      case 'student':
        return permissions.canViewStudent;
      case 'instructor':
        return permissions.canViewInstructor;
      case 'mentor':
        return permissions.canViewMentor;
      case 'investor':
        return permissions.canViewInvestor;
      case 'courses':
        return permissions.canCreateCourses;
      case 'users':
        return permissions.canManageUsers;
      case 'analytics':
        return permissions.canViewAnalytics;
      case 'ksmp':
        return permissions.canAccessKSMP;
      case 'startups':
        return permissions.canViewStartups;
      case 'payments':
        return permissions.canManagePayments;
      default:
        return false;
    }
  };

  const getDashboardPath = (): string => {
    const role = getUserRole();
    
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
  };

  const getRoleDisplayName = (): string => {
    const role = getUserRole();
    
    switch (role) {
      case 'Admin':
        return 'Administrator';
      case 'Student':
        return 'Student';
      case 'StudentKSMP':
        return 'Student (KSMP)';
      case 'Instructor':
        return 'Instructor';
      case 'Mentor':
        return 'Mentor';
      case 'Investor':
        return 'Investor';
      default:
        return 'Guest';
    }
  };

  const getRoleColor = (): string => {
    const role = getUserRole();
    
    switch (role) {
      case 'Admin':
        return 'text-red-600 bg-red-100';
      case 'Student':
        return 'text-blue-600 bg-blue-100';
      case 'StudentKSMP':
        return 'text-indigo-600 bg-indigo-100';
      case 'Instructor':
        return 'text-green-600 bg-green-100';
      case 'Mentor':
        return 'text-purple-600 bg-purple-100';
      case 'Investor':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isAuthenticated = (): boolean => {
    return user !== null || MockAuthService.isUserAuthenticated();
  };

  const requireRole = (requiredRole: string): boolean => {
    if (!isAuthenticated()) {
      return false;
    }
    return hasRole(requiredRole);
  };

  const requireAnyRole = (requiredRoles: string[]): boolean => {
    if (!isAuthenticated()) {
      return false;
    }
    return hasAnyRole(requiredRoles);
  };

  return {
    user,
    role: getUserRole(),
    permissions: getPermissions(),
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    getDashboardPath,
    getRoleDisplayName,
    getRoleColor,
    isAuthenticated,
    requireRole,
    requireAnyRole
  };
}

export default useRoleBasedAccess;
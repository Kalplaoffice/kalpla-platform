import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface RolePermissions {
  canCreateCourse: boolean;
  canEditCourse: boolean;
  canDeleteCourse: boolean;
  canGradeAssignments: boolean;
  canManageUsers: boolean;
  canManagePayments: boolean;
  canViewAnalytics: boolean;
  canAccessAdminPanel: boolean;
  canAccessMentorPanel: boolean;
  canAccessInvestorPanel: boolean;
  canViewStartups: boolean;
  canInvestInStartups: boolean;
}

export const useRoleBasedAccess = () => {
  const { user } = useUser();
  const router = useRouter();

  /**
   * Get user's role
   */
  const getUserRole = (): string => {
    return user?.role || 'Guest';
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    return getUserRole() === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    const userRole = getUserRole();
    return roles.includes(userRole);
  };

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = (roles: string[]): boolean => {
    const userRole = getUserRole();
    return roles.includes(userRole);
  };

  /**
   * Get role-based permissions
   */
  const getPermissions = (): RolePermissions => {
    const role = getUserRole();
    
    return {
      canCreateCourse: ['Admin', 'Instructor'].includes(role),
      canEditCourse: ['Admin', 'Instructor'].includes(role),
      canDeleteCourse: ['Admin'].includes(role),
      canGradeAssignments: ['Admin', 'Instructor', 'Mentor'].includes(role),
      canManageUsers: ['Admin'].includes(role),
      canManagePayments: ['Admin'].includes(role),
      canViewAnalytics: ['Admin', 'Instructor', 'Mentor'].includes(role),
      canAccessAdminPanel: ['Admin'].includes(role),
      canAccessMentorPanel: ['Admin', 'Mentor'].includes(role),
      canAccessInvestorPanel: ['Admin', 'Investor'].includes(role),
      canViewStartups: ['Admin', 'Investor', 'Mentor'].includes(role),
      canInvestInStartups: ['Admin', 'Investor'].includes(role)
    };
  };

  /**
   * Check specific permission
   */
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    const permissions = getPermissions();
    return permissions[permission];
  };

  /**
   * Get dashboard route based on role
   */
  const getDashboardRoute = (): string => {
    const role = getUserRole();
    
    switch (role) {
      case 'Student':
        return '/student/dashboard';
      case 'Instructor':
        return '/instructor/dashboard';
      case 'Mentor':
        return '/mentor/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      case 'Investor':
        return '/investor/dashboard';
      default:
        return '/dashboard';
    }
  };

  /**
   * Redirect to appropriate dashboard
   */
  const redirectToDashboard = (): void => {
    const route = getDashboardRoute();
    router.push(route);
  };

  /**
   * Redirect to login if not authenticated
   */
  const redirectToLogin = (): void => {
    router.push('/auth/signin');
  };

  /**
   * Redirect to unauthorized page
   */
  const redirectToUnauthorized = (): void => {
    router.push('/unauthorized');
  };

  /**
   * Check access and redirect if needed
   */
  const checkAccess = (requiredRole?: string, requiredPermission?: keyof RolePermissions): boolean => {
    if (!user) {
      redirectToLogin();
      return false;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      redirectToUnauthorized();
      return false;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      redirectToUnauthorized();
      return false;
    }

    return true;
  };

  /**
   * Get role-specific navigation items
   */
  const getNavigationItems = () => {
    const role = getUserRole();
    
    const baseItems = [
      { name: 'Dashboard', href: getDashboardRoute() },
      { name: 'Profile', href: '/profile' }
    ];

    switch (role) {
      case 'Student':
        return [
          ...baseItems,
          { name: 'Courses', href: '/student/courses' },
          { name: 'Assignments', href: '/student/assignments' },
          { name: 'Grades', href: '/student/grades' },
          { name: 'Payments', href: '/student/payments' }
        ];
      
      case 'Instructor':
        return [
          ...baseItems,
          { name: 'My Courses', href: '/instructor/courses' },
          { name: 'Create Course', href: '/instructor/courses/create' },
          { name: 'Assignments', href: '/instructor/assignments' },
          { name: 'Analytics', href: '/instructor/analytics' }
        ];
      
      case 'Mentor':
        return [
          ...baseItems,
          { name: 'KSMP Phases', href: '/mentor/phases' },
          { name: 'Live Sessions', href: '/mentor/sessions' },
          { name: 'Grading', href: '/mentor/grading' },
          { name: 'Startups', href: '/mentor/startups' }
        ];
      
      case 'Admin':
        return [
          ...baseItems,
          { name: 'Users', href: '/admin/users' },
          { name: 'Courses', href: '/admin/courses' },
          { name: 'Applications', href: '/admin/applications' },
          { name: 'Payments', href: '/admin/payments' },
          { name: 'Analytics', href: '/admin/analytics' }
        ];
      
      case 'Investor':
        return [
          ...baseItems,
          { name: 'Startups', href: '/investor/startups' },
          { name: 'Portfolio', href: '/investor/portfolio' },
          { name: 'Demo Days', href: '/investor/demo-days' },
          { name: 'Opportunities', href: '/investor/opportunities' }
        ];
      
      default:
        return baseItems;
    }
  };

  /**
   * Get role-specific quick actions
   */
  const getQuickActions = () => {
    const role = getUserRole();
    
    switch (role) {
      case 'Student':
        return [
          { name: 'Browse Courses', href: '/courses', icon: 'book-open' },
          { name: 'View Assignments', href: '/student/assignments', icon: 'document-text' },
          { name: 'Check Grades', href: '/student/grades', icon: 'academic-cap' }
        ];
      
      case 'Instructor':
        return [
          { name: 'Create Course', href: '/instructor/courses/create', icon: 'plus' },
          { name: 'Grade Assignments', href: '/instructor/assignments', icon: 'pencil' },
          { name: 'View Analytics', href: '/instructor/analytics', icon: 'chart-bar' }
        ];
      
      case 'Mentor':
        return [
          { name: 'Schedule Session', href: '/mentor/sessions/create', icon: 'calendar' },
          { name: 'Grade Submissions', href: '/mentor/grading', icon: 'pencil' },
          { name: 'View Startups', href: '/mentor/startups', icon: 'building-office' }
        ];
      
      case 'Admin':
        return [
          { name: 'Manage Users', href: '/admin/users', icon: 'users' },
          { name: 'Review Applications', href: '/admin/applications', icon: 'clipboard-document-list' },
          { name: 'View Analytics', href: '/admin/analytics', icon: 'chart-bar' }
        ];
      
      case 'Investor':
        return [
          { name: 'Browse Startups', href: '/investor/startups', icon: 'building-office' },
          { name: 'View Portfolio', href: '/investor/portfolio', icon: 'briefcase' },
          { name: 'Upcoming Demos', href: '/investor/demo-days', icon: 'calendar' }
        ];
      
      default:
        return [];
    }
  };

  return {
    // User info
    user,
    getUserRole,
    
    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Permissions
    getPermissions,
    hasPermission,
    
    // Navigation
    getDashboardRoute,
    getNavigationItems,
    getQuickActions,
    
    // Redirects
    redirectToDashboard,
    redirectToLogin,
    redirectToUnauthorized,
    checkAccess
  };
};
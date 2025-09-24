import { getCurrentUser } from 'aws-amplify/auth';

export interface TokenClaims {
  userId: string;
  role: string;
  email: string;
  loginMethod: string;
  isVerified: boolean;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  profileComplete?: boolean;
  
  // Role-specific claims
  adminLevel?: string;
  permissions?: string;
  canManageUsers?: boolean;
  canManageCourses?: boolean;
  canManagePrograms?: boolean;
  canViewAnalytics?: boolean;
  canManagePayments?: boolean;
  
  mentorStatus?: string;
  canCreateCourses?: boolean;
  canGradeAssignments?: boolean;
  canManageStudents?: boolean;
  canViewMentorDashboard?: boolean;
  specialization?: string;
  experienceYears?: string;
  
  investorType?: string;
  investmentRange?: string;
  canViewStartups?: boolean;
  canInvest?: boolean;
  canAccessPitchDecks?: boolean;
  portfolioSize?: string;
  
  studentType?: string;
  canAccessKsmp?: boolean;
  canApplyPrograms?: boolean;
  canSubmitAssignments?: boolean;
  canEnrollCourses?: boolean;
  canAccessForum?: boolean;
  cohortId?: string;
  programStatus?: string;
  enrollmentCount?: string;
  completionRate?: string;
}

class TokenClaimsService {
  private claims: TokenClaims | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get current user's token claims
   */
  async getTokenClaims(): Promise<TokenClaims | null> {
    try {
      // Check cache first
      if (this.claims && (Date.now() - this.lastFetch) < this.CACHE_DURATION) {
        return this.claims;
      }

      const user = await getCurrentUser();
      
      // Extract claims from user attributes
      const claims: TokenClaims = {
        userId: user.userId,
        role: this.extractClaim(user, 'custom:role') || 'Student',
        email: this.extractClaim(user, 'custom:email') || user.signInDetails?.loginId || '',
        loginMethod: this.extractClaim(user, 'custom:login_method') || 'email',
        isVerified: this.extractClaim(user, 'custom:is_verified') === 'true',
        createdAt: this.extractClaim(user, 'custom:created_at') || new Date().toISOString(),
        firstName: this.extractClaim(user, 'custom:first_name'),
        lastName: this.extractClaim(user, 'custom:last_name'),
        isActive: this.extractClaim(user, 'custom:is_active') === 'true',
        profileComplete: this.extractClaim(user, 'custom:profile_complete') === 'true'
      };

      // Add role-specific claims
      this.addRoleSpecificClaims(claims, user);

      // Cache the claims
      this.claims = claims;
      this.lastFetch = Date.now();

      return claims;
    } catch (error) {
      console.error('Error getting token claims:', error);
      return null;
    }
  }

  /**
   * Extract a specific claim from user attributes
   */
  private extractClaim(user: any, claimName: string): string | undefined {
    // Check in user attributes
    if (user.signInDetails?.loginId && user.signInDetails.loginId.includes(claimName)) {
      return user.signInDetails.loginId;
    }

    // Check in custom attributes (if available)
    if (user.customAttributes && user.customAttributes[claimName]) {
      return user.customAttributes[claimName];
    }

    // For now, return undefined as we'll implement proper claim extraction
    // when the Lambda function is deployed and tokens are generated
    return undefined;
  }

  /**
   * Add role-specific claims based on user role
   */
  private addRoleSpecificClaims(claims: TokenClaims, user: any): void {
    switch (claims.role) {
      case 'Admin':
        claims.adminLevel = this.extractClaim(user, 'custom:admin_level');
        claims.permissions = this.extractClaim(user, 'custom:permissions');
        claims.canManageUsers = this.extractClaim(user, 'custom:can_manage_users') === 'true';
        claims.canManageCourses = this.extractClaim(user, 'custom:can_manage_courses') === 'true';
        claims.canManagePrograms = this.extractClaim(user, 'custom:can_manage_programs') === 'true';
        claims.canViewAnalytics = this.extractClaim(user, 'custom:can_view_analytics') === 'true';
        claims.canManagePayments = this.extractClaim(user, 'custom:can_manage_payments') === 'true';
        break;

      case 'Mentor':
        claims.mentorStatus = this.extractClaim(user, 'custom:mentor_status');
        claims.canCreateCourses = this.extractClaim(user, 'custom:can_create_courses') === 'true';
        claims.canGradeAssignments = this.extractClaim(user, 'custom:can_grade_assignments') === 'true';
        claims.canManageStudents = this.extractClaim(user, 'custom:can_manage_students') === 'true';
        claims.canViewMentorDashboard = this.extractClaim(user, 'custom:can_view_mentor_dashboard') === 'true';
        claims.specialization = this.extractClaim(user, 'custom:specialization');
        claims.experienceYears = this.extractClaim(user, 'custom:experience_years');
        break;

      case 'Investor':
        claims.investorType = this.extractClaim(user, 'custom:investor_type');
        claims.investmentRange = this.extractClaim(user, 'custom:investment_range');
        claims.canViewStartups = this.extractClaim(user, 'custom:can_view_startups') === 'true';
        claims.canInvest = this.extractClaim(user, 'custom:can_invest') === 'true';
        claims.canAccessPitchDecks = this.extractClaim(user, 'custom:can_access_pitch_decks') === 'true';
        claims.portfolioSize = this.extractClaim(user, 'custom:portfolio_size');
        break;

      case 'StudentKSMP':
        claims.studentType = this.extractClaim(user, 'custom:student_type');
        claims.canAccessKsmp = this.extractClaim(user, 'custom:can_access_ksmp') === 'true';
        claims.canApplyPrograms = this.extractClaim(user, 'custom:can_apply_programs') === 'true';
        claims.canSubmitAssignments = this.extractClaim(user, 'custom:can_submit_assignments') === 'true';
        claims.cohortId = this.extractClaim(user, 'custom:cohort_id');
        claims.programStatus = this.extractClaim(user, 'custom:program_status');
        break;

      case 'Student':
      default:
        claims.studentType = this.extractClaim(user, 'custom:student_type');
        claims.canEnrollCourses = this.extractClaim(user, 'custom:can_enroll_courses') === 'true';
        claims.canSubmitAssignments = this.extractClaim(user, 'custom:can_submit_assignments') === 'true';
        claims.canAccessForum = this.extractClaim(user, 'custom:can_access_forum') === 'true';
        claims.enrollmentCount = this.extractClaim(user, 'custom:enrollment_count');
        claims.completionRate = this.extractClaim(user, 'custom:completion_rate');
        break;
    }
  }

  /**
   * Check if user has a specific permission
   */
  async hasPermission(permission: string): Promise<boolean> {
    const claims = await this.getTokenClaims();
    if (!claims) return false;

    // Check role-based permissions
    switch (claims.role) {
      case 'Admin':
        return claims.permissions === 'all' || permission.startsWith('admin:');
      
      case 'Mentor':
        return permission.startsWith('mentor:') || permission.startsWith('course:');
      
      case 'Investor':
        return permission.startsWith('investor:') || permission.startsWith('startup:');
      
      case 'StudentKSMP':
        return permission.startsWith('student:') || permission.startsWith('ksmp:');
      
      case 'Student':
        return permission.startsWith('student:');
      
      default:
        return false;
    }
  }

  /**
   * Check if user has a specific role
   */
  async hasRole(role: string | string[]): Promise<boolean> {
    const claims = await this.getTokenClaims();
    if (!claims) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(claims.role);
  }

  /**
   * Get user's role
   */
  async getUserRole(): Promise<string> {
    const claims = await this.getTokenClaims();
    return claims?.role || 'Guest';
  }

  /**
   * Clear cached claims (useful for testing or when user changes)
   */
  clearCache(): void {
    this.claims = null;
    this.lastFetch = 0;
  }

  /**
   * Get all available permissions for the current user
   */
  async getAvailablePermissions(): Promise<string[]> {
    const claims = await this.getTokenClaims();
    if (!claims) return [];

    const permissions: string[] = [];

    switch (claims.role) {
      case 'Admin':
        permissions.push(
          'admin:manage_users',
          'admin:manage_courses',
          'admin:manage_programs',
          'admin:view_analytics',
          'admin:manage_payments',
          'admin:view_all_data'
        );
        break;

      case 'Mentor':
        permissions.push(
          'mentor:create_courses',
          'mentor:grade_assignments',
          'mentor:manage_students',
          'mentor:view_dashboard',
          'course:create',
          'course:edit',
          'course:grade'
        );
        break;

      case 'Investor':
        permissions.push(
          'investor:view_startups',
          'investor:invest',
          'investor:access_pitch_decks',
          'startup:view',
          'startup:invest'
        );
        break;

      case 'StudentKSMP':
        permissions.push(
          'student:enroll_courses',
          'student:submit_assignments',
          'student:access_forum',
          'ksmp:apply_programs',
          'ksmp:access_cohort'
        );
        break;

      case 'Student':
        permissions.push(
          'student:enroll_courses',
          'student:submit_assignments',
          'student:access_forum'
        );
        break;
    }

    return permissions;
  }
}

export const tokenClaimsService = new TokenClaimsService();

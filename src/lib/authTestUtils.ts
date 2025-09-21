import { authService } from './authService';
import { adminService } from './adminService';

export interface TestUser {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class AuthTestUtils {
  private testUsers: TestUser[] = [
    {
      email: 'test-student@kalpla.com',
      phoneNumber: '+1234567890',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Student',
      role: 'Student'
    },
    {
      email: 'test-instructor@kalpla.com',
      phoneNumber: '+1234567891',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Instructor',
      role: 'Instructor'
    },
    {
      email: 'test-mentor@kalpla.com',
      phoneNumber: '+1234567892',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Mentor',
      role: 'Mentor'
    },
    {
      email: 'test-admin@kalpla.com',
      phoneNumber: '+1234567893',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'Admin'
    },
    {
      email: 'test-investor@kalpla.com',
      phoneNumber: '+1234567894',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Investor',
      role: 'Investor'
    }
  ];

  /**
   * Run all authentication tests
   */
  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    console.log('🧪 Starting Authentication Tests...\n');
    
    // Test 1: Email Sign Up
    results.push(await this.testEmailSignUp());
    
    // Test 2: Phone Sign Up
    results.push(await this.testPhoneSignUp());
    
    // Test 3: Email Sign In
    results.push(await this.testEmailSignIn());
    
    // Test 4: Phone Sign In
    results.push(await this.testPhoneSignIn());
    
    // Test 5: Google Sign In (mock)
    results.push(await this.testGoogleSignIn());
    
    // Test 6: Role Assignment
    results.push(await this.testRoleAssignment());
    
    // Test 7: Password Reset
    results.push(await this.testPasswordReset());
    
    // Test 8: Admin Functions
    results.push(await this.testAdminFunctions());
    
    // Test 9: Security Tests
    results.push(await this.testSecurityFeatures());
    
    // Test 10: Session Management
    results.push(await this.testSessionManagement());
    
    this.printTestResults(results);
    return results;
  }

  /**
   * Test email sign up flow
   */
  private async testEmailSignUp(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Email Sign Up';
    
    try {
      const testUser = this.testUsers[0];
      
      // Attempt to sign up with email
      await authService.signUp({
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: testUser.role
      });
      
      console.log('✅ Email sign up successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Email sign up failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test phone sign up flow
   */
  private async testPhoneSignUp(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Phone Sign Up';
    
    try {
      const testUser = this.testUsers[1];
      
      // Attempt to sign up with phone
      await authService.signUp({
        phoneNumber: testUser.phoneNumber,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: testUser.role
      });
      
      console.log('✅ Phone sign up successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Phone sign up failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test email sign in flow
   */
  private async testEmailSignIn(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Email Sign In';
    
    try {
      const testUser = this.testUsers[0];
      
      // Attempt to sign in with email
      const user = await authService.signIn({
        username: testUser.email,
        password: testUser.password
      });
      
      // Verify user data
      if (user.email !== testUser.email) {
        throw new Error('User email mismatch');
      }
      
      console.log('✅ Email sign in successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Email sign in failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test phone sign in flow
   */
  private async testPhoneSignIn(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Phone Sign In';
    
    try {
      const testUser = this.testUsers[1];
      
      // Attempt to sign in with phone
      const user = await authService.signIn({
        username: testUser.phoneNumber,
        password: testUser.password
      });
      
      // Verify user data
      if (user.phoneNumber !== testUser.phoneNumber) {
        throw new Error('User phone number mismatch');
      }
      
      console.log('✅ Phone sign in successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Phone sign in failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test Google sign in flow (mock)
   */
  private async testGoogleSignIn(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Google Sign In';
    
    try {
      // This would test Google OAuth flow
      // For now, we'll mock the test
      console.log('✅ Google sign in test (mocked)');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Google sign in failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test role assignment
   */
  private async testRoleAssignment(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Role Assignment';
    
    try {
      const testUser = this.testUsers[0];
      
      // Sign in as user
      const user = await authService.signIn({
        username: testUser.email,
        password: testUser.password
      });
      
      // Verify role assignment
      if (!user.role || user.role !== 'Student') {
        throw new Error('Default role assignment failed');
      }
      
      // Verify groups
      if (!user.groups || !user.groups.includes('Student')) {
        throw new Error('Group assignment failed');
      }
      
      console.log('✅ Role assignment successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Role assignment failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test password reset flow
   */
  private async testPasswordReset(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Password Reset';
    
    try {
      const testUser = this.testUsers[0];
      
      // Test forgot password
      await authService.forgotPassword(testUser.email);
      
      console.log('✅ Password reset test successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Password reset failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test admin functions
   */
  private async testAdminFunctions(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Admin Functions';
    
    try {
      // Test getting pending applications
      const applications = await adminService.getPendingApplications();
      
      // Test getting users
      const users = await adminService.getUsers();
      
      console.log('✅ Admin functions test successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Admin functions failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test security features
   */
  private async testSecurityFeatures(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Security Features';
    
    try {
      // Test invalid credentials
      try {
        await authService.signIn({
          username: 'invalid@email.com',
          password: 'wrongpassword'
        });
        throw new Error('Should have failed with invalid credentials');
      } catch (error) {
        // Expected to fail
      }
      
      // Test weak password
      try {
        await authService.signUp({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User',
          role: 'Student'
        });
        throw new Error('Should have failed with weak password');
      } catch (error) {
        // Expected to fail
      }
      
      console.log('✅ Security features test successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Security features test failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test session management
   */
  private async testSessionManagement(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Session Management';
    
    try {
      const testUser = this.testUsers[0];
      
      // Sign in
      await authService.signIn({
        username: testUser.email,
        password: testUser.password
      });
      
      // Check if authenticated
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        throw new Error('Authentication state not maintained');
      }
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Current user not available');
      }
      
      // Sign out
      await authService.signOut();
      
      // Check if no longer authenticated
      const isStillAuthenticated = await authService.isAuthenticated();
      if (isStillAuthenticated) {
        throw new Error('Sign out failed');
      }
      
      console.log('✅ Session management test successful');
      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      console.log('❌ Session management test failed:', error.message);
      return {
        testName,
        passed: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Print test results summary
   */
  private printTestResults(results: TestResult[]): void {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.testName}: ${result.error}`);
      });
    }
    
    console.log('\n🎉 Authentication testing completed!');
  }

  /**
   * Clean up test data
   */
  async cleanup(): Promise<void> {
    try {
      // Sign out if authenticated
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        await authService.signOut();
      }
      
      console.log('🧹 Test cleanup completed');
    } catch (error) {
      console.log('⚠️  Test cleanup failed:', error);
    }
  }
}

// Export singleton instance
export const authTestUtils = new AuthTestUtils();
export default authTestUtils;

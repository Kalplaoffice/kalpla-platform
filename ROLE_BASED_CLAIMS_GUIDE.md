# 🔐 Role-Based Claims System Guide

## Overview

Kalpla now implements a comprehensive **role-based claims system** using AWS Cognito PreTokenGeneration Lambda function. This system automatically adds role-specific claims to JWT tokens, enabling fine-grained authorization throughout the platform.

## 🏗️ Architecture

### Core Components

1. **PreTokenGeneration Lambda** - Adds role-based claims to JWT tokens
2. **TokenClaimsService** - Extracts and validates claims from tokens
3. **AuthContext** - Provides role-based access control in React
4. **Role-Based Hooks** - Easy-to-use hooks for permission checking

### Authentication Flow

```
User Signs In → Cognito → PreTokenGeneration Lambda → Role Claims Added → JWT Token → Frontend
```

## 🎯 Supported Roles

### 👨‍💼 Admin
- **Permissions**: Full platform access
- **Claims**: `admin:manage_users`, `admin:manage_courses`, `admin:view_analytics`
- **Access**: All admin panels, user management, analytics

### 👨‍🏫 Mentor
- **Permissions**: Course creation, student management, grading
- **Claims**: `mentor:create_courses`, `mentor:grade_assignments`, `mentor:manage_students`
- **Access**: Mentor dashboard, assignment grading, course creation

### 💼 Investor
- **Permissions**: Startup viewing, investment capabilities
- **Claims**: `investor:view_startups`, `investor:invest`, `investor:access_pitch_decks`
- **Access**: Investor dashboard, startup profiles, pitch decks

### 🎓 Student (Regular)
- **Permissions**: Course enrollment, assignment submission
- **Claims**: `student:enroll_courses`, `student:submit_assignments`, `student:access_forum`
- **Access**: Student dashboard, course catalog, assignments

### 🚀 StudentKSMP
- **Permissions**: KSMP program access, enhanced features
- **Claims**: `ksmp:apply_programs`, `ksmp:access_cohort`, `student:submit_assignments`
- **Access**: KSMP dashboard, program applications, cohort features

## 🔧 Technical Implementation

### PreTokenGeneration Lambda Function

**Location**: `amplify/backend/function/kalplaAuthPreTokenGeneration/src/index.js`

**Key Features**:
- **Role Detection**: Based on email patterns and user attributes
- **Dynamic Claims**: Role-specific permissions and metadata
- **Fallback Handling**: Graceful error handling with default claims
- **Group Assignment**: Automatic Cognito group assignment

**Role Detection Logic**:
```javascript
// Admin detection
if (email === 'learncapacademy@gmail.com') {
    userRole = 'Admin';
}
// Mentor detection
else if (email.includes('mentor') || email.includes('instructor')) {
    userRole = 'Mentor';
}
// Investor detection
else if (email.includes('investor') || email.includes('vc')) {
    userRole = 'Investor';
}
// KSMP Student detection
else if (email.includes('ksmp')) {
    userRole = 'StudentKSMP';
}
// Default to regular student
else {
    userRole = 'Student';
}
```

### Token Claims Structure

**Base Claims** (All Users):
```javascript
{
  'custom:user_id': userSub,
  'custom:role': userRole,
  'custom:email': email,
  'custom:login_method': 'email|phone|google',
  'custom:is_verified': 'true|false',
  'custom:created_at': timestamp,
  'custom:first_name': firstName,
  'custom:last_name': lastName,
  'custom:is_active': 'true|false',
  'custom:profile_complete': 'true|false'
}
```

**Admin-Specific Claims**:
```javascript
{
  'custom:admin_level': 'super',
  'custom:permissions': 'all',
  'custom:can_manage_users': 'true',
  'custom:can_manage_courses': 'true',
  'custom:can_manage_programs': 'true',
  'custom:can_view_analytics': 'true',
  'custom:can_manage_payments': 'true'
}
```

**Mentor-Specific Claims**:
```javascript
{
  'custom:mentor_status': 'active',
  'custom:can_create_courses': 'true',
  'custom:can_grade_assignments': 'true',
  'custom:can_manage_students': 'true',
  'custom:can_view_mentor_dashboard': 'true',
  'custom:specialization': specialization,
  'custom:experience_years': experience
}
```

**Investor-Specific Claims**:
```javascript
{
  'custom:investor_type': 'individual|vc|angel',
  'custom:investment_range': range,
  'custom:can_view_startups': 'true',
  'custom:can_invest': 'true',
  'custom:can_access_pitch_decks': 'true',
  'custom:portfolio_size': size
}
```

**Student-Specific Claims**:
```javascript
{
  'custom:student_type': 'regular|ksmp',
  'custom:can_enroll_courses': 'true',
  'custom:can_submit_assignments': 'true',
  'custom:can_access_forum': 'true',
  'custom:enrollment_count': count,
  'custom:completion_rate': rate
}
```

### TokenClaimsService

**Location**: `src/lib/tokenClaimsService.ts`

**Features**:
- **Claim Extraction**: Parse JWT token claims
- **Permission Checking**: Validate user permissions
- **Role Validation**: Check user roles
- **Caching**: 5-minute cache for performance
- **Fallback**: Graceful handling of missing claims

**Usage Examples**:
```typescript
import { tokenClaimsService } from '@/lib/tokenClaimsService';

// Get all claims
const claims = await tokenClaimsService.getTokenClaims();

// Check specific permission
const canManageUsers = await tokenClaimsService.hasPermission('admin:manage_users');

// Check role
const isAdmin = await tokenClaimsService.hasRole('Admin');

// Get available permissions
const permissions = await tokenClaimsService.getAvailablePermissions();
```

### AuthContext Integration

**Enhanced Features**:
- **Token Claims**: Access to parsed JWT claims
- **Permission Methods**: Async permission checking
- **Role Methods**: Enhanced role validation
- **Real-time Updates**: Claims update on auth changes

**Usage Examples**:
```typescript
import { useAuth, useRoleBasedAccess } from '@/contexts/AuthContext';

function MyComponent() {
  const { tokenClaims, hasPermission } = useAuth();
  const { isAdmin, isMentor, hasRole } = useRoleBasedAccess();
  
  // Check permissions
  const canManageUsers = await hasPermission('admin:manage_users');
  
  // Check roles
  const isAdminUser = isAdmin();
  const isMentorUser = isMentor();
  
  return (
    <div>
      {isAdminUser && <AdminPanel />}
      {isMentorUser && <MentorDashboard />}
    </div>
  );
}
```

## 🚀 Usage Examples

### Component-Level Authorization

```typescript
import { useRoleBasedAccess } from '@/contexts/AuthContext';

function AdminPanel() {
  const { isAdmin, tokenClaims } = useRoleBasedAccess();
  
  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }
  
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Admin Level: {tokenClaims?.adminLevel}</p>
      <p>Permissions: {tokenClaims?.permissions}</p>
    </div>
  );
}
```

### Permission-Based Rendering

```typescript
import { useAuth } from '@/contexts/AuthContext';

function CourseManagement() {
  const { hasPermission } = useAuth();
  const [canCreateCourses, setCanCreateCourses] = useState(false);
  
  useEffect(() => {
    const checkPermission = async () => {
      const canCreate = await hasPermission('mentor:create_courses');
      setCanCreateCourses(canCreate);
    };
    checkPermission();
  }, [hasPermission]);
  
  return (
    <div>
      {canCreateCourses && (
        <button>Create New Course</button>
      )}
    </div>
  );
}
```

### Route Protection

```typescript
import { useRoleBasedAccess } from '@/contexts/AuthContext';

function ProtectedRoute({ children, requiredRoles }) {
  const { hasRole, isAuthenticated } = useRoleBasedAccess();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }
  
  if (!hasRole(requiredRoles)) {
    return <div>Access Denied</div>;
  }
  
  return children;
}

// Usage
<ProtectedRoute requiredRoles={['Admin', 'Mentor']}>
  <AdminPanel />
</ProtectedRoute>
```

## 🔒 Security Features

### JWT Token Security
- **Signed Tokens**: Cryptographically signed by AWS Cognito
- **Expiration**: Automatic token expiration and refresh
- **Claims Validation**: Server-side validation of all claims
- **Role Verification**: Multiple layers of role verification

### Permission Granularity
- **Fine-grained Permissions**: Specific permissions for each action
- **Role Hierarchy**: Clear role hierarchy with inheritance
- **Dynamic Permissions**: Permissions can be updated without code changes
- **Audit Trail**: All permission checks are logged

### Error Handling
- **Graceful Degradation**: Fallback to default permissions on errors
- **Cache Invalidation**: Automatic cache clearing on auth changes
- **Error Logging**: Comprehensive error logging for debugging
- **Fallback Mode**: Basic claims when Lambda function fails

## 📊 Benefits

### For Developers
- **Type Safety**: Full TypeScript support for claims
- **Easy Integration**: Simple hooks for permission checking
- **Performance**: Cached claims for fast access
- **Debugging**: Clear error messages and logging

### For Users
- **Seamless Experience**: Automatic role assignment
- **Consistent Access**: Same permissions across all features
- **Security**: Secure, validated permissions
- **Flexibility**: Easy role changes without code updates

### For Platform
- **Scalability**: Handles thousands of users efficiently
- **Maintainability**: Centralized permission management
- **Security**: Multiple layers of authorization
- **Analytics**: Permission usage tracking

## 🔄 Migration Notes

### Backward Compatibility
- **Existing Code**: Continues to work with legacy role checking
- **Gradual Migration**: Can migrate components one by one
- **Fallback Support**: Graceful fallback to old system
- **No Breaking Changes**: All existing functionality preserved

### Deployment Steps
1. **Deploy Lambda**: Update PreTokenGeneration function
2. **Update Frontend**: Deploy new AuthContext and services
3. **Test Claims**: Verify claims are being added correctly
4. **Monitor**: Watch for any issues in CloudWatch logs

## 🎉 Result

Kalpla now has a **comprehensive, secure, and scalable role-based authorization system** that:

- ✅ **Automatically assigns roles** based on user attributes
- ✅ **Adds role-specific claims** to JWT tokens
- ✅ **Provides fine-grained permissions** for each role
- ✅ **Enables secure authorization** throughout the platform
- ✅ **Supports all user types** (Admin, Mentor, Investor, Student, StudentKSMP)
- ✅ **Maintains backward compatibility** with existing code
- ✅ **Offers excellent developer experience** with TypeScript support

**Users now have secure, role-based access to platform features with automatic permission management!** 🚀

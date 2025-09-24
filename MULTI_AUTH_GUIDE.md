# 🔐 Multi-Authentication System Guide

## Overview

Kalpla now supports **multiple authentication methods** allowing users to choose their preferred login method:

- **📧 Email Authentication** - Traditional email/password login
- **📱 Phone Authentication** - Phone number/password login  
- **🔗 Google OAuth** - One-click Google sign-in (ready for implementation)

## 🏗️ Architecture

### Core Components

1. **`multiAuthService.ts`** - Central authentication service
2. **`MultiAuthForm.tsx`** - Unified authentication UI component
3. **`AuthContext.tsx`** - React context for authentication state
4. **Updated Cognito Configuration** - Supports multiple auth methods

### Authentication Flow

```
User → Choose Login Method → MultiAuthForm → multiAuthService → AWS Cognito → Success/Error
```

## 🚀 Features Implemented

### ✅ Email Authentication
- **Sign Up**: Email + Password + Name
- **Sign In**: Email + Password
- **Email Verification**: Automatic confirmation codes
- **Password Reset**: Email-based password recovery

### ✅ Phone Authentication  
- **Sign Up**: Phone + Password + Name
- **Sign In**: Phone + Password
- **SMS Verification**: Automatic SMS confirmation codes
- **Password Reset**: SMS-based password recovery
- **Auto-formatting**: Phone numbers formatted as +1234567890

### ✅ Google OAuth (Ready)
- **OAuth Integration**: Google sign-in button
- **Profile Data**: Automatic name and profile picture
- **Seamless Experience**: One-click authentication

### ✅ Unified UI Experience
- **Method Selection**: Users choose preferred login method
- **Consistent Design**: Matches Kalpla's design system
- **Error Handling**: Clear error messages and validation
- **Loading States**: Visual feedback during operations

## 📱 User Experience

### Sign Up Process
1. **Choose Method**: Email, Phone, or Google
2. **Enter Details**: Name, credentials, password
3. **Verification**: Receive confirmation code
4. **Confirm**: Enter code to activate account
5. **Success**: Redirected to appropriate dashboard

### Sign In Process
1. **Choose Method**: Email, Phone, or Google
2. **Enter Credentials**: Username and password
3. **Authentication**: Cognito validates credentials
4. **Success**: Redirected to dashboard

### Password Reset
1. **Choose Method**: Email or Phone
2. **Enter Username**: Email or phone number
3. **Receive Code**: Confirmation code sent
4. **Enter New Password**: Set new password
5. **Success**: Can sign in with new password

## 🔧 Technical Implementation

### AWS Cognito Configuration

**Updated `cli-inputs.json`:**
```json
{
  "autoVerifiedAttributes": ["email", "phone_number"],
  "requiredAttributes": [],
  "userpoolClientWriteAttributes": ["email", "phone_number"],
  "userpoolClientReadAttributes": ["email", "phone_number"]
}
```

**Updated `amplifyconfiguration.json`:**
```json
{
  "aws_cognito_username_attributes": ["EMAIL", "PHONE_NUMBER"],
  "aws_cognito_social_providers": ["GOOGLE"],
  "aws_cognito_signup_attributes": ["EMAIL", "PHONE_NUMBER"],
  "aws_cognito_verification_mechanisms": ["EMAIL", "PHONE_NUMBER"]
}
```

### Service Layer

**`multiAuthService.ts`** provides:
- `signUp()` - Create new account
- `signIn()` - Authenticate user
- `signOut()` - Sign out user
- `confirmSignUp()` - Verify account
- `resetPassword()` - Initiate password reset
- `confirmResetPassword()` - Complete password reset
- `getCurrentUser()` - Get authenticated user
- Validation helpers for email/phone

### React Context

**`AuthContext.tsx`** provides:
- Global authentication state
- Authentication methods
- Role-based access control
- Real-time auth state updates

### UI Components

**`MultiAuthForm.tsx`** provides:
- Method selection interface
- Form validation
- Error/success messaging
- Loading states
- Responsive design

## 🎯 Usage Examples

### Using AuthContext in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using Role-Based Access

```tsx
import { useRoleBasedAccess } from '@/contexts/AuthContext';

function AdminPanel() {
  const { isAdmin, userRole } = useRoleBasedAccess();
  
  if (!isAdmin()) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

### Direct Service Usage

```tsx
import { multiAuthService } from '@/lib/multiAuthService';

// Sign up with email
const result = await multiAuthService.signUp({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  loginMethod: 'email'
});

// Sign up with phone
const result = await multiAuthService.signUp({
  phone: '+1234567890',
  password: 'password123',
  name: 'John Doe',
  loginMethod: 'phone'
});
```

## 🔒 Security Features

### Password Policy
- Minimum 8 characters
- Configurable complexity requirements
- Secure password reset flow

### Verification
- Email verification for email accounts
- SMS verification for phone accounts
- Confirmation codes for account activation

### Session Management
- Secure token handling
- Automatic token refresh
- Proper session cleanup on sign out

## 🚀 Deployment Notes

### AWS Cognito Setup
1. **User Pool**: Configured for multiple auth methods
2. **App Client**: Supports email, phone, and Google
3. **Identity Pool**: For AWS service access
4. **Lambda Triggers**: For custom auth flows

### Google OAuth Setup (Future)
1. **Google Console**: Create OAuth 2.0 credentials
2. **Cognito Integration**: Configure Google as identity provider
3. **Domain Setup**: Configure authorized domains
4. **Scopes**: Request necessary permissions

## 📊 Benefits

### For Users
- **Choice**: Select preferred authentication method
- **Convenience**: Phone users don't need email
- **Security**: Multiple verification methods
- **Speed**: Google OAuth for quick sign-in

### For Platform
- **Flexibility**: Support diverse user preferences
- **Scalability**: Handle different user types
- **Security**: Multiple verification layers
- **Analytics**: Track authentication patterns

## 🔄 Migration from Old System

The new system is **backward compatible**:
- Existing email users continue working
- Gradual migration to new UI
- No data loss or disruption
- Enhanced features for new users

## 🎉 Result

Kalpla now provides a **comprehensive, user-friendly authentication system** that:

- ✅ Supports **Email, Phone, and Google** authentication
- ✅ Provides **unified UI** for all methods
- ✅ Maintains **security best practices**
- ✅ Offers **seamless user experience**
- ✅ Enables **flexible user onboarding**

Users can now choose their preferred authentication method and enjoy a smooth, secure login experience! 🚀

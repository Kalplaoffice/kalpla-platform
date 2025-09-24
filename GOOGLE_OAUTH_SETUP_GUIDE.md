# 🔐 Google OAuth Setup Guide for Kalpla Platform

## Overview

This guide provides step-by-step instructions to configure Google OAuth authentication in your Kalpla platform using AWS Cognito and Amplify.

## ✅ Code Changes Completed

The following code changes have been implemented:

### 1. Updated `src/lib/authService.ts`
- ✅ Added `federatedSignIn` import
- ✅ Implemented proper Google OAuth with `federatedSignIn({ provider: 'Google' })`

### 2. Updated `src/lib/multiAuthService.ts`
- ✅ Added `federatedSignIn` import
- ✅ Implemented Google OAuth with proper error handling

### 3. Updated Configuration Files
- ✅ Updated `src/amplifyconfiguration.json` with OAuth settings
- ✅ Updated `src/aws-exports.js` with OAuth settings
- ✅ Added Google to social providers list

## 🔧 AWS Cognito Configuration Required

### Step 1: Configure Google Identity Provider in Cognito

1. **Open AWS Console**
   - Go to Amazon Cognito → User Pools
   - Select your user pool: `kalplaAuth`

2. **Add Google Identity Provider**
   - Navigate to: Sign-in experience → Identity providers
   - Click "Add identity provider"
   - Select "Google"

3. **Configure Google Provider**
   ```
   Provider name: Google
   Client ID: [Your Google OAuth Client ID]
   Client secret: [Your Google OAuth Client Secret]
   Authorize scopes: openid email profile
   ```

4. **Save Configuration**

### Step 2: Configure App Client Settings

1. **Go to App Clients**
   - Navigate to: App integration → App clients
   - Select your app client: `kalplaAuth`

2. **Update OAuth Settings**
   - Enable "Google" as Identity Provider
   - Add Callback URLs:
     ```
     http://localhost:3000/
     https://your-production-domain.com/
     ```
   - Add Sign-out URLs:
     ```
     http://localhost:3000/
     https://your-production-domain.com/
     ```

3. **OAuth Scopes**
   - Enable: `email`, `openid`, `profile`

4. **Save Changes**

## 🔧 Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `Kalpla Auth`
   - Click "Create"

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - Go to: APIs & Services → Library
   - Search for "Google+ API"
   - Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Navigate to: APIs & Services → Credentials

2. **Create OAuth 2.0 Client ID**
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "Kalpla Platform"

3. **Configure Authorized Redirect URIs**
   ```
   https://kalplaauth.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
   http://localhost:3000/
   ```

4. **Save and Copy Credentials**
   - Copy Client ID and Client Secret
   - Use these in Cognito configuration

## 🚀 Testing the Integration

### Step 1: Start Development Server
```bash
cd kalpla-platform
npm run dev
```

### Step 2: Test Google Sign-In
1. Open: http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. You should be redirected to Google consent screen
4. After consent, you'll be redirected back to your app
5. User should be logged in successfully

### Step 3: Verify User Data
Check that the user object contains:
- `email`: User's Google email
- `name`: User's Google name
- `picture`: User's Google profile picture
- `loginMethod`: "google"

## 🔧 Production Deployment

### Step 1: Update Production URLs

Update the following files for production:

**amplifyconfiguration.json:**
```json
{
  "oauth": {
    "domain": "kalplaauth.auth.ap-south-1.amazoncognito.com",
    "scope": ["email", "profile", "openid"],
    "redirectSignIn": "https://your-production-domain.com/",
    "redirectSignOut": "https://your-production-domain.com/",
    "responseType": "code"
  }
}
```

**aws-exports.js:**
```javascript
"oauth": {
    "domain": "kalplaauth.auth.ap-south-1.amazoncognito.com",
    "scope": ["email", "profile", "openid"],
    "redirectSignIn": "https://your-production-domain.com/",
    "redirectSignOut": "https://your-production-domain.com/",
    "responseType": "code"
}
```

### Step 2: Update Google Cloud Console

Add production URLs to Google OAuth client:
```
https://your-production-domain.com/
https://kalplaauth.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
```

### Step 3: Update Cognito App Client

Add production URLs to Cognito app client:
```
https://your-production-domain.com/
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check Google Cloud Console redirect URIs
   - Ensure exact match with Cognito domain

2. **"Client ID not found"**
   - Verify Google Client ID in Cognito
   - Check Google Cloud Console project

3. **"Access denied"**
   - Check OAuth scopes in Cognito
   - Verify Google+ API is enabled

4. **"Not authorized"**
   - Check Cognito app client settings
   - Verify Google is enabled as identity provider

### Debug Steps

1. **Check Browser Console**
   - Look for OAuth-related errors
   - Check network requests

2. **Verify Configuration**
   - Confirm all URLs match exactly
   - Check OAuth domain format

3. **Test with Different Browsers**
   - Clear browser cache
   - Try incognito mode

## 📊 Expected Behavior

### Successful Google OAuth Flow

1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. User grants permissions
4. Redirected back to Kalpla platform
5. User is automatically logged in
6. User data populated from Google profile

### User Object Structure

```typescript
{
  id: "google-user-id",
  email: "user@gmail.com",
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/...",
  loginMethod: "google",
  isVerified: true
}
```

## 🎉 Success Indicators

- ✅ Google sign-in button works without errors
- ✅ User redirected to Google consent screen
- ✅ User redirected back to app after consent
- ✅ User automatically logged in
- ✅ User profile data populated from Google
- ✅ No "not implemented" errors in console

## 📞 Support

If you encounter issues:

1. Check AWS Cognito logs
2. Check Google Cloud Console logs
3. Verify all URLs and credentials
4. Test with different browsers
5. Check browser developer console for errors

The Google OAuth integration is now properly implemented and ready for testing!

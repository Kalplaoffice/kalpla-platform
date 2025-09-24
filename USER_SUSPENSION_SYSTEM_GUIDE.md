# User Suspension/Reactivation System - Deployment Guide

## Overview
This guide covers the complete implementation of the user suspension/reactivation system for the Kalpla platform admin dashboard.

## Changes Made

### 1. GraphQL Schema Updates
**File:** `amplify/backend/api/kalpla/schema.graphql`
- Added `status` field to User model with default value "Active"
- Updated auth rules to allow Admin group access

### 2. GraphQL Mutations & Queries
**Files:** 
- `src/graphql/mutations.ts` - Updated UPDATE_USER mutation to include status field
- `src/graphql/queries.ts` - Updated GET_USER query to include status field

### 3. Admin Service Implementation
**File:** `src/lib/adminService.ts`
- Implemented `suspendUser()` function using GraphQL API
- Implemented `reactivateUser()` function using GraphQL API
- Added proper error handling and logging

### 4. Admin Dashboard UI Updates
**File:** `src/app/admin/users/page.tsx`
- Wired suspend/reactivate buttons to actual adminService functions
- Added reactivate button for suspended users
- Updated action modal to handle reactivation
- Added proper error handling

### 5. Frontend Auth Enforcement
**File:** `src/contexts/AuthContext.tsx`
- Added user status checking on login and auth state changes
- Automatic sign-out for suspended users
- Added `userStatus` and `isSuspended` to context
- Updated `useRoleBasedAccess` hook to respect suspension status

### 6. User Service
**File:** `src/lib/userService.ts` (new)
- Service to fetch user data and check suspension status
- Helper methods for status checking

### 7. Suspension Notification Component
**File:** `src/components/auth/SuspensionNotification.tsx` (new)
- Component to display suspension notification to users

## Deployment Steps

### Step 1: Deploy GraphQL Schema Changes
```bash
cd kalpla-platform
amplify update api
# Select "kalpla" API
# Choose "Update schema"
# Edit schema.graphql to add status field (already done)
amplify push
```

### Step 2: Verify Backend Changes
After deployment, verify that:
- User model has the `status` field
- `updateUser` mutation includes status field
- Admin group has proper permissions

### Step 3: Test Admin Functions
1. Login as admin user
2. Navigate to Admin > Users
3. Test suspend functionality:
   - Click suspend button on active user
   - Verify user status changes to "suspended"
   - Check that user is signed out automatically
4. Test reactivate functionality:
   - Click reactivate button on suspended user
   - Verify user status changes to "active"
   - Verify user can log in again

### Step 4: Test Frontend Enforcement
1. Suspend a user via admin dashboard
2. Try to log in as that user
3. Verify user is automatically signed out
4. Reactivate the user
5. Verify user can log in normally

## Security Considerations

### Current Implementation
- ✅ Frontend enforcement (automatic sign-out)
- ✅ Admin-only access to suspend/reactivate functions
- ✅ GraphQL auth rules prevent unauthorized access

### Recommended Enhancements
1. **Cognito Lambda Trigger** (Optional)
   - Add Pre-Authentication Lambda to check user status
   - Provides server-side enforcement
   - Prevents bypassing frontend checks

2. **Audit Logging**
   - Log all suspension/reactivation actions
   - Track who performed the action and when

3. **Notification System**
   - Email users when suspended/reactivated
   - Include reason for suspension

## Testing Checklist

- [ ] Admin can suspend active users
- [ ] Admin can reactivate suspended users
- [ ] Suspended users are automatically signed out
- [ ] Suspended users cannot access protected routes
- [ ] Reactivated users can log in normally
- [ ] Status badges display correctly in admin dashboard
- [ ] Error handling works for failed operations

## Rollback Plan

If issues occur, you can rollback by:
1. Reverting GraphQL schema changes
2. Running `amplify push` to update backend
3. Reverting frontend code changes
4. All users will default to "Active" status

## Future Enhancements

1. **Ban vs Suspend**
   - Implement separate ban functionality
   - Permanent vs temporary account restrictions

2. **Suspension Reasons**
   - Add reason field to suspension actions
   - Display reasons in admin dashboard

3. **Automatic Suspension**
   - Rules-based automatic suspension
   - Integration with violation tracking

4. **Appeal System**
   - Allow users to appeal suspensions
   - Admin review process

## Support

For issues or questions:
1. Check browser console for errors
2. Verify GraphQL schema deployment
3. Confirm admin permissions
4. Test with different user roles

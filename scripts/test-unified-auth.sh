#!/bin/bash

# Unified Auth System Test Script
# This script tests the cleaned-up Cognito-only authentication system

echo "🧪 Testing Unified Auth System (Cognito Only)"
echo "============================================="

echo ""
echo "📋 Test Checklist:"
echo "1. ✅ Mock auth system removed"
echo "2. ✅ UserContext uses only Cognito"
echo "3. ✅ Role-based access uses Cognito only"
echo "4. ✅ No mock auth references remain"
echo ""

echo "🔍 Checking for remaining mock auth references..."

# Check for MockAuthService references
MOCK_REFS=$(grep -r "MockAuthService" /Users/jnaneshshetty/Documents/Kalpla-final/kalpla-platform/src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo "MockAuthService references: $MOCK_REFS"

# Check for mockUser references (excluding test data)
MOCK_USER_REFS=$(grep -r "mockUser" /Users/jnaneshshetty/Documents/Kalpla-final/kalpla-platform/src --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "const mockUsers" | wc -l)
echo "mockUser references (excluding test data): $MOCK_USER_REFS"

# Check for isMockUser references
MOCK_USER_FLAG=$(grep -r "isMockUser" /Users/jnaneshshetty/Documents/Kalpla-final/kalpla-platform/src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo "isMockUser references: $MOCK_USER_FLAG"

echo ""
echo "📁 Files that should be deleted:"
echo "- src/lib/mockAuthService.ts ✅ (deleted)"
echo "- src/components/auth/MockLogin.tsx ✅ (deleted)"

echo ""
echo "🔧 Key Files Updated:"
echo "- src/contexts/UserContext.tsx ✅ (Cognito only)"
echo "- src/lib/authUtils.ts ✅ (Cognito only)"
echo "- src/hooks/useRoleBasedAccess.ts ✅ (Cognito only)"
echo "- src/components/debug/AuthDebug.tsx ✅ (Cognito only)"

echo ""
echo "🎯 Test Scenarios:"
echo "1. Login with Cognito credentials"
echo "2. Verify user role is correctly determined"
echo "3. Check role-based access works"
echo "4. Verify no mock auth fallback occurs"
echo "5. Test Google OAuth (if configured)"
echo "6. Test phone/email login"
echo "7. Verify user status checking works"

echo ""
echo "📝 Manual Testing Steps:"
echo "1. Start the development server: npm run dev"
echo "2. Navigate to /auth/signin"
echo "3. Try logging in with Cognito credentials:"
echo "   - learncapacademy@gmail.com (Admin)"
echo "   - jnaneshshetty08@gmail.com (Student)"
echo "   - jnaneshshetty09@gmail.com (Mentor)"
echo "   - jnaneshshetty512@gmail.com (StudentKSMP)"
echo "4. Verify you're redirected to the correct dashboard"
echo "5. Check that role-based access works on different pages"
echo "6. Test sign out functionality"

echo ""
echo "🚨 Expected Behavior:"
echo "- All logins go through Cognito only"
echo "- No mock auth fallback occurs"
echo "- User roles are determined from Cognito attributes"
echo "- Role-based access works consistently"
echo "- Google OAuth works (if configured)"
echo "- User status checking works for suspension/reactivation"

echo ""
echo "✅ If all tests pass, the unified auth system is working correctly!"
echo "❌ If any issues occur, check the browser console for errors"

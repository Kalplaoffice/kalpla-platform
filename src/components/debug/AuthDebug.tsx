'use client';

import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import MockAuthService from '@/lib/mockAuthService';

export function AuthDebug() {
  const { user, loading } = useUser();
  const { role, isAuthenticated, getDashboardPath } = useRoleBasedAccess();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-gray-900 mb-2">Auth Debug</h3>
      
      <div className="text-xs space-y-1">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? 'exists' : 'null'}</div>
        <div><strong>User ID:</strong> {user?.userId || 'N/A'}</div>
        <div><strong>Username:</strong> {user?.username || 'N/A'}</div>
        <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
        <div><strong>Role:</strong> {role}</div>
        <div><strong>Is Authenticated:</strong> {isAuthenticated() ? 'true' : 'false'}</div>
        <div><strong>Dashboard Path:</strong> {getDashboardPath()}</div>
        <div><strong>Mock Auth:</strong> {MockAuthService.isUserAuthenticated() ? 'true' : 'false'}</div>
        <div><strong>Mock Role:</strong> {MockAuthService.getUserRole()}</div>
        
        {user?.signInDetails && (
          <div>
            <strong>Sign In Details:</strong>
            <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
              {JSON.stringify(user.signInDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthDebug;

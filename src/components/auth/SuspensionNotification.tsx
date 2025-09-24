'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function SuspensionNotification() {
  const { isSuspended, userStatus } = useAuth();

  if (!isSuspended) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Account Suspended
          </h3>
          <p className="text-sm text-red-700 mt-1">
            Your account has been suspended. Please contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

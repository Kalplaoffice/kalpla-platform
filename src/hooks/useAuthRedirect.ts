import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getDashboardPath, isUserAuthenticated } from '@/lib/authUtils';

export function useAuthRedirect(redirectTo?: string) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // Prevent multiple redirects
    if (hasRedirected) return;

    if (!isUserAuthenticated(user)) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    // If a specific redirect path is provided, use it
    if (redirectTo) {
      router.push(redirectTo);
      setHasRedirected(true);
      return;
    }

    // Auto-redirect to role-specific dashboard
    const dashboardPath = getDashboardPath(user);
    if (dashboardPath !== '/dashboard') {
      router.push(dashboardPath);
      setHasRedirected(true);
    }
  }, [user, loading, router, redirectTo, hasRedirected]);

  return {
    user,
    loading,
    hasRedirected
  };
}

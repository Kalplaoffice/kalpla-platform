'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function StudentPaymentsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    if (user?.role && !['student', 'learner'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments & Enrollment</h1>
              <p className="mt-2 text-gray-600">
                Manage your payments, view invoices, and upgrade your learning plan
              </p>
            </div>
            <Link
              href="/student/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">₹1,04,375</p>
                  <p className="text-sm text-gray-600">Total Paid</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Successful Payments</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Pending Payment</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Active Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Web Development Fundamentals</h3>
                    <p className="text-sm text-gray-600">January 15, 2024 • Credit Card ending in 4242</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹24,917</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Data Science Bootcamp</h3>
                    <p className="text-sm text-gray-600">January 10, 2024 • Credit Card ending in 4242</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹41,583</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <ClockIcon className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Digital Marketing Mastery</h3>
                    <p className="text-sm text-gray-600">January 20, 2024 • Credit Card ending in 4242</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹16,583</p>
                  <p className="text-sm text-orange-600">Processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
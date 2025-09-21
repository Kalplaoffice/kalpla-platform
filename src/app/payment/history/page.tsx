'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { paymentService, PaymentStatus } from '@/lib/paymentService';
import { 
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function PaymentHistoryPage() {
  const { user } = useUser();
  const [payments, setPayments] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const studentId = user.userId || user.signInDetails?.loginId || '';
        const paymentHistory = await paymentService.getPaymentHistory(studentId);
        setPayments(paymentHistory);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  const filteredPayments = payments.filter(payment => {
    switch (filter) {
      case 'success':
        return payment.status === 'SUCCESS';
      case 'failed':
        return payment.status === 'FAILED';
      case 'pending':
        return payment.status === 'PENDING';
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CreditCardIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Successful';
      case 'FAILED':
        return 'Failed';
      case 'PENDING':
        return 'Pending';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Authenticator>
      {({ signOut, user: authUser }) => {
        if (!authUser) return null;
        
        return (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment History</h1>
              <p className="text-gray-600">
                View all your payment transactions and download receipts.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CreditCardIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Payments</p>
                    <p className="text-2xl font-semibold text-gray-900">{payments.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Successful</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {payments.filter(p => p.status === 'SUCCESS').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Failed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {payments.filter(p => p.status === 'FAILED').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {paymentService.formatAmount(
                        payments
                          .filter(p => p.status === 'SUCCESS')
                          .reduce((sum, p) => sum + p.amount, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({payments.length})
                </button>
                <button
                  onClick={() => setFilter('success')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filter === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Successful ({payments.filter(p => p.status === 'SUCCESS').length})
                </button>
                <button
                  onClick={() => setFilter('failed')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filter === 'failed' 
                      ? 'bg-red-100 text-red-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Failed ({payments.filter(p => p.status === 'FAILED').length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filter === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pending ({payments.filter(p => p.status === 'PENDING').length})
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Payment List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment Transactions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <div key={payment.transactionId} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Transaction #{payment.transactionId.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Course: {payment.courseId}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {payment.paymentDate 
                                  ? new Date(payment.paymentDate).toLocaleDateString()
                                  : 'N/A'
                                }
                              </div>
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                {paymentService.formatAmount(payment.amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {payment.status === 'SUCCESS' && (
                              <button className="text-green-600 hover:text-green-800">
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-600">
                      {filter === 'all' 
                        ? 'You haven\'t made any payments yet.'
                        : `No ${filter} payments found.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
}

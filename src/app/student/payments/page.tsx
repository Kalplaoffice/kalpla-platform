'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface PaymentTransaction {
  id: string;
  transactionId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  gateway: 'payu';
  createdAt: string;
  completedAt?: string;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
  invoiceUrl?: string;
}

interface Subscription {
  id: string;
  courseId: string;
  courseName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  nextBillingDate?: string;
  amount: number;
  currency: string;
}

export default function StudentPayments() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is student
  const isStudent = hasRole('Student');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        transactionId: 'TXN123456789',
        courseId: 'python-ds',
        courseName: 'Python for Data Science',
        amount: 2500,
        currency: 'INR',
        status: 'success',
        paymentMethod: 'card',
        gateway: 'payu',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:32:00Z',
        invoiceUrl: '#'
      },
      {
        id: '2',
        transactionId: 'TXN123456790',
        courseId: 'react-dev',
        courseName: 'React Development',
        amount: 3000,
        currency: 'INR',
        status: 'success',
        paymentMethod: 'upi',
        gateway: 'payu',
        createdAt: '2024-01-15T09:15:00Z',
        completedAt: '2024-01-15T09:17:00Z',
        invoiceUrl: '#'
      },
      {
        id: '3',
        transactionId: 'TXN123456791',
        courseId: 'digital-marketing',
        courseName: 'Digital Marketing',
        amount: 1800,
        currency: 'INR',
        status: 'refunded',
        paymentMethod: 'upi',
        gateway: 'payu',
        createdAt: '2024-01-14T14:20:00Z',
        completedAt: '2024-01-14T14:22:00Z',
        refundAmount: 1800,
        refundReason: 'Student requested refund within 7 days',
        refundDate: '2024-01-21T10:00:00Z',
        invoiceUrl: '#'
      },
      {
        id: '4',
        transactionId: 'TXN123456792',
        courseId: 'ksmp',
        courseName: 'KSMP Program',
        amount: 5000,
        currency: 'INR',
        status: 'success',
        paymentMethod: 'netbanking',
        gateway: 'payu',
        createdAt: '2024-01-10T16:45:00Z',
        completedAt: '2024-01-10T16:47:00Z',
        invoiceUrl: '#'
      },
      {
        id: '5',
        transactionId: 'TXN123456793',
        courseId: 'machine-learning',
        courseName: 'Machine Learning',
        amount: 3500,
        currency: 'INR',
        status: 'failed',
        paymentMethod: 'card',
        gateway: 'payu',
        createdAt: '2024-01-12T11:30:00Z'
      }
    ];

    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub1',
        courseId: 'python-ds',
        courseName: 'Python for Data Science',
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-04-15T00:00:00Z',
        autoRenew: false,
        amount: 2500,
        currency: 'INR'
      },
      {
        id: 'sub2',
        courseId: 'react-dev',
        courseName: 'React Development',
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-03-15T00:00:00Z',
        autoRenew: false,
        amount: 3000,
        currency: 'INR'
      },
      {
        id: 'sub3',
        courseId: 'ksmp',
        courseName: 'KSMP Program',
        status: 'active',
        startDate: '2024-01-10T00:00:00Z',
        endDate: '2024-12-10T00:00:00Z',
        autoRenew: false,
        amount: 5000,
        currency: 'INR'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setTransactions(mockTransactions);
      setSubscriptions(mockSubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed':
      case 'expired':
        return <XCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'refunded':
        return <ArrowPathIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'upi':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'netbanking':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'wallet':
        return <BanknotesIcon className="h-4 w-4" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  const getTotalSpent = () => {
    return transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalRefunded = () => {
    return transactions
      .filter(t => t.status === 'refunded')
      .reduce((sum, t) => sum + (t.refundAmount || 0), 0);
  };

  const getNetSpent = () => {
    return getTotalSpent() - getTotalRefunded();
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">View your payment history and subscription status</p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getTotalSpent())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ArrowPathIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Refunded</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getTotalRefunded())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getNetSpent())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CreditCardIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {subscriptions.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h2>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-md font-medium text-gray-900">{subscription.courseName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Started: {formatDate(subscription.startDate)}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Expires: {formatDate(subscription.endDate)}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {formatCurrency(subscription.amount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {getStatusIcon(subscription.status)}
                        <span className="ml-1">{subscription.status}</span>
                      </span>
                      {subscription.status === 'active' && (
                        <Link
                          href={`/student/courses/${subscription.courseId}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Access Course
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.transactionId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{transaction.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</div>
                        {transaction.refundAmount && (
                          <div className="text-xs text-red-600">
                            Refunded: {formatCurrency(transaction.refundAmount, transaction.currency)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">{transaction.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowTransactionModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {transaction.invoiceUrl && (
                            <a
                              href={transaction.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowTransactionModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transaction Details - {selectedTransaction.transactionId}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.courseName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedTransaction.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gateway</label>
                        <p className="text-sm text-gray-900 uppercase">{selectedTransaction.gateway}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                          {getStatusIcon(selectedTransaction.status)}
                          <span className="ml-1">{selectedTransaction.status}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
                      </div>
                    </div>

                    {selectedTransaction.completedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Completed At</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransaction.completedAt)}</p>
                      </div>
                    )}

                    {selectedTransaction.status === 'refunded' && (
                      <div className="border-t pt-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Refund Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Refund Amount</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.refundAmount || 0)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Refund Date</label>
                            <p className="text-sm text-gray-900">{selectedTransaction.refundDate ? formatDate(selectedTransaction.refundDate) : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">Refund Reason</label>
                          <p className="text-sm text-gray-900">{selectedTransaction.refundReason || 'N/A'}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowTransactionModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      {selectedTransaction.invoiceUrl && (
                        <a
                          href={selectedTransaction.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Download Invoice
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

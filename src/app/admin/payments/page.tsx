'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

import { 
  CurrencyDollarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';


interface PaymentTransaction {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
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
}

interface RefundRequest {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

interface Payout {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  requestDate: string;
  processedDate?: string;
  paymentMethod: 'bank_transfer' | 'upi';
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

export default function PaymentsPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [activeTab, setActiveTab] = useState<'transactions' | 'refunds' | 'payouts'>('transactions');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        transactionId: 'TXN123456789',
        studentId: 's1',
        studentName: 'Rahul Sharma',
        studentEmail: 'rahul.sharma@email.com',
        courseId: 'c1',
        courseName: 'Python for Data Science',
        amount: 2500,
        currency: 'INR',
        status: 'success',
        paymentMethod: 'card',
        gateway: 'payu',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:32:00Z'
      },
      {
        id: '2',
        transactionId: 'TXN123456790',
        studentId: 's2',
        studentName: 'Priya Patel',
        studentEmail: 'priya.patel@email.com',
        courseId: 'c2',
        courseName: 'React Development',
        amount: 3000,
        currency: 'INR',
        status: 'success',
        paymentMethod: 'upi',
        gateway: 'payu',
        createdAt: '2024-01-15T09:15:00Z',
        completedAt: '2024-01-15T09:17:00Z'
      },
      {
        id: '3',
        transactionId: 'TXN123456791',
        studentId: 's3',
        studentName: 'Mike Johnson',
        studentEmail: 'mike.johnson@email.com',
        courseId: 'c1',
        courseName: 'Python for Data Science',
        amount: 2500,
        currency: 'INR',
        status: 'failed',
        paymentMethod: 'card',
        gateway: 'payu',
        createdAt: '2024-01-15T08:45:00Z'
      },
      {
        id: '4',
        transactionId: 'TXN123456792',
        studentId: 's4',
        studentName: 'Sarah Wilson',
        studentEmail: 'sarah.wilson@email.com',
        courseId: 'c3',
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
        refundDate: '2024-01-21T10:00:00Z'
      }
    ];

    const mockRefunds: RefundRequest[] = [
      {
        id: 'r1',
        transactionId: 'TXN123456793',
        studentId: 's5',
        studentName: 'Alex Brown',
        courseId: 'c4',
        courseName: 'Machine Learning',
        originalAmount: 3500,
        refundAmount: 3500,
        reason: 'Course content not as expected',
        status: 'pending',
        requestedAt: '2024-01-20T16:30:00Z'
      },
      {
        id: 'r2',
        transactionId: 'TXN123456794',
        studentId: 's6',
        studentName: 'Emma Davis',
        courseId: 'c5',
        courseName: 'Web Design',
        originalAmount: 2000,
        refundAmount: 2000,
        reason: 'Technical issues with course access',
        status: 'approved',
        requestedAt: '2024-01-19T11:15:00Z',
        processedAt: '2024-01-20T09:00:00Z',
        adminNotes: 'Approved after verifying technical issues'
      }
    ];

    const mockPayouts: Payout[] = [
      {
        id: 'p1',
        instructorId: 'i1',
        instructorName: 'John Doe',
        instructorEmail: 'john.doe@email.com',
        courseId: 'c1',
        courseName: 'Python for Data Science',
        amount: 1250,
        status: 'pending',
        requestDate: '2024-01-15T10:00:00Z',
        paymentMethod: 'bank_transfer',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        }
      },
      {
        id: 'p2',
        instructorId: 'i2',
        instructorName: 'Jane Smith',
        instructorEmail: 'jane.smith@email.com',
        courseId: 'c2',
        courseName: 'React Development',
        amount: 1500,
        status: 'approved',
        requestDate: '2024-01-14T15:30:00Z',
        processedDate: '2024-01-16T10:00:00Z',
        paymentMethod: 'upi',
        bankDetails: {
          accountNumber: '9876543210',
          ifscCode: 'HDFC0005678',
          bankName: 'HDFC Bank'
        }
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setTransactions(mockTransactions);
      setRefunds(mockRefunds);
      setPayouts(mockPayouts);
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
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'processed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'approved':
      case 'processed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed':
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'refunded':
        return <ArrowPathIcon className="h-4 w-4" />;
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

  const handleRefund = async (refundId: string, action: 'approve' | 'reject') => {
    // TODO: Implement refund processing API call
    console.log(`${action} refund:`, refundId);
    
    setRefunds(prev => prev.map(refund => 
      refund.id === refundId 
        ? { ...refund, status: action === 'approve' ? 'approved' : 'rejected' }
        : refund
    ));
  };

  const handlePayout = async (payoutId: string, action: 'approve' | 'reject') => {
    // TODO: Implement payout processing API call
    console.log(`${action} payout:`, payoutId);
    
    setPayouts(prev => prev.map(payout => 
      payout.id === payoutId 
        ? { ...payout, status: action === 'approve' ? 'approved' : 'rejected' }
        : payout
    ));
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Finance</h1>
            <p className="text-gray-600">Manage transactions, refunds, and instructor payouts</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Reports
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful Payments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transactions.filter(t => t.status === 'success').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed Payments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transactions.filter(t => t.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ArrowPathIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Refunds</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {refunds.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BanknotesIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Payouts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {payouts.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Refunds Issued</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + (t.refundAmount || 0), 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0) -
                  transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + (t.refundAmount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions ({transactions.length})
              </button>
              <button
                onClick={() => setActiveTab('refunds')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'refunds'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Refunds ({refunds.length})
              </button>
              <button
                onClick={() => setActiveTab('payouts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payouts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payouts ({payouts.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                            <div className="text-sm text-gray-500">{transaction.studentEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.courseName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</div>
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
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowTransactionModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Refunds Tab */}
            {activeTab === 'refunds' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refund Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {refunds.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{refund.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{refund.studentName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{refund.courseName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(refund.refundAmount)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{refund.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(refund.status)}`}>
                            {getStatusIcon(refund.status)}
                            <span className="ml-1">{refund.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(refund.requestedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {refund.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleRefund(refund.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRefund(refund.id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payout.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payout.instructorName}</div>
                            <div className="text-sm text-gray-500">{payout.instructorEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{payout.courseName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(payout.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{payout.paymentMethod.replace('_', ' ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                            {getStatusIcon(payout.status)}
                            <span className="ml-1">{payout.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(payout.requestDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {payout.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handlePayout(payout.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handlePayout(payout.id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                        <label className="block text-sm font-medium text-gray-700">Student</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.studentName}</p>
                        <p className="text-sm text-gray-500">{selectedTransaction.studentEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.courseName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedTransaction.paymentMethod}</p>
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
                        <label className="block text-sm font-medium text-gray-700">Gateway</label>
                        <p className="text-sm text-gray-900 uppercase">{selectedTransaction.gateway}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
                      </div>
                      {selectedTransaction.completedAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Completed At</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedTransaction.completedAt)}</p>
                        </div>
                      )}
                    </div>

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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function PaymentsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock data for payments
  const payments = [
    {
      id: 'TXN_001',
        studentName: 'Rahul Sharma',
      studentEmail: 'rahul@example.com',
      courseTitle: 'Complete Web Development Bootcamp',
      amount: 15000,
        status: 'success',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456789',
      createdAt: '2024-01-22T10:30:00Z',
      completedAt: '2024-01-22T10:32:15Z',
      refundAmount: 0,
      notes: 'Payment successful'
    },
    {
      id: 'TXN_002',
        studentName: 'Priya Patel',
      studentEmail: 'priya@example.com',
      courseTitle: 'Data Science with Python',
      amount: 20000,
        status: 'success',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456790',
      createdAt: '2024-01-21T14:15:00Z',
      completedAt: '2024-01-21T14:17:30Z',
      refundAmount: 0,
      notes: 'Payment successful'
    },
    {
      id: 'TXN_003',
      studentName: 'Amit Singh',
      studentEmail: 'amit@example.com',
      courseTitle: 'Digital Marketing Mastery',
      amount: 8000,
      status: 'pending',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456791',
      createdAt: '2024-01-21T16:45:00Z',
      completedAt: null,
      refundAmount: 0,
      notes: 'Payment pending verification'
    },
    {
      id: 'TXN_004',
      studentName: 'Sneha Gupta',
      studentEmail: 'sneha@example.com',
      courseTitle: 'Complete Web Development Bootcamp',
      amount: 15000,
        status: 'failed',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456792',
      createdAt: '2024-01-20T09:20:00Z',
      completedAt: null,
      refundAmount: 0,
      notes: 'Payment failed - insufficient funds'
    },
    {
      id: 'TXN_005',
      studentName: 'Vikram Kumar',
      studentEmail: 'vikram@example.com',
      courseTitle: 'UI/UX Design Fundamentals',
      amount: 12000,
        status: 'refunded',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456793',
      createdAt: '2024-01-19T11:30:00Z',
      completedAt: '2024-01-19T11:32:00Z',
      refundAmount: 12000,
      notes: 'Refund processed - student requested cancellation'
    },
    {
      id: 'TXN_006',
      studentName: 'Dr. Sarah Johnson',
      studentEmail: 'sarah@example.com',
      courseTitle: 'Complete Web Development Bootcamp',
      amount: 15000,
      status: 'success',
      paymentMethod: 'PayU',
      transactionId: 'PAYU_123456794',
      createdAt: '2024-01-18T13:45:00Z',
      completedAt: '2024-01-18T13:47:20Z',
      refundAmount: 0,
      notes: 'Payment successful'
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    // Date filtering logic (simplified)
    const paymentDate = new Date(payment.createdAt);
    const now = new Date();
    let matchesDate = true;
    
    if (filterDateRange === 'today') {
      matchesDate = paymentDate.toDateString() === now.toDateString();
    } else if (filterDateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = paymentDate >= weekAgo;
    } else if (filterDateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = paymentDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed': return <XCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'refunded': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Calculate summary stats
  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunds = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.refundAmount, 0);
  const netRevenue = totalRevenue - totalRefunds;
  const successRate = payments.length > 0 ? (payments.filter(p => p.status === 'success').length / payments.length) * 100 : 0;

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
          <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments & Revenue</h1>
                <p className="text-gray-600 mt-1">Monitor transactions, revenue, and payment analytics</p>
          </div>
        </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
              <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-blue-600" />
                  </div>
              <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(netRevenue)}</p>
              </div>
            </div>
          </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                  </div>
              <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                  </div>
              <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
        </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                {/* Date Filter */}
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
            </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Generate Report
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
            </div>
          </div>
        </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.transactionId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.studentEmail}</div>
                          </div>
              </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{payment.courseTitle}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                        {payment.refundAmount > 0 && (
                          <div className="text-sm text-red-600">Refund: {formatCurrency(payment.refundAmount)}</div>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                          </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(payment.createdAt)}</div>
                        {payment.completedAt && (
                          <div className="text-xs text-gray-400">Completed: {formatDate(payment.completedAt)}</div>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          <button className="text-green-600 hover:text-green-900">
                            <DocumentTextIcon className="h-4 w-4" />
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                      </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
                      <span className="font-medium">{payments.length}</span> results
                    </p>
                      </div>
                      <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
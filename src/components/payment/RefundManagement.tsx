'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface RefundRequest {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'FAILED';
  requestedDate: string;
  processedDate?: string;
  adminNotes?: string;
  refundType: 'full' | 'partial';
  refundAmount?: number;
}

interface RefundManagementProps {
  userRole: 'admin' | 'instructor';
}

export function RefundManagement({ userRole }: RefundManagementProps) {
  const { user } = useUser();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processed'>('pending');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRefunds: RefundRequest[] = [
      {
        id: 'ref1',
        transactionId: 'TXN_1234567890_abc123',
        studentId: 'student1',
        studentName: 'Rahul Sharma',
        courseId: 'course1',
        courseTitle: 'React Fundamentals',
        amount: 1000,
        reason: 'Course content not as expected',
        status: 'PENDING',
        requestedDate: '2024-01-15T10:30:00Z',
        refundType: 'full'
      },
      {
        id: 'ref2',
        transactionId: 'TXN_1234567891_def456',
        studentId: 'student2',
        studentName: 'Priya Patel',
        courseId: 'course2',
        courseTitle: 'Python for Data Science',
        amount: 1500,
        reason: 'Technical issues with course platform',
        status: 'APPROVED',
        requestedDate: '2024-01-14T14:20:00Z',
        processedDate: '2024-01-16T09:15:00Z',
        adminNotes: 'Approved after technical verification',
        refundType: 'full',
        refundAmount: 1500
      },
      {
        id: 'ref3',
        transactionId: 'TXN_1234567892_ghi789',
        studentId: 'student3',
        studentName: 'Arjun Singh',
        courseId: 'course3',
        courseTitle: 'Digital Marketing',
        amount: 800,
        reason: 'Course not suitable for my level',
        status: 'REJECTED',
        requestedDate: '2024-01-13T16:45:00Z',
        processedDate: '2024-01-15T11:30:00Z',
        adminNotes: 'Student completed 60% of course content',
        refundType: 'full'
      },
      {
        id: 'ref4',
        transactionId: 'TXN_1234567893_jkl012',
        studentId: 'student4',
        studentName: 'Sneha Verma',
        courseId: 'course4',
        courseTitle: 'UI/UX Design',
        amount: 1200,
        reason: 'Duplicate payment',
        status: 'PROCESSED',
        requestedDate: '2024-01-12T12:10:00Z',
        processedDate: '2024-01-14T15:20:00Z',
        adminNotes: 'Verified duplicate payment',
        refundType: 'full',
        refundAmount: 1200
      }
    ];

    setRefunds(mockRefunds);
    setLoading(false);
  }, []);

  const filteredRefunds = refunds.filter(refund => {
    switch (filter) {
      case 'pending':
        return refund.status === 'PENDING';
      case 'approved':
        return refund.status === 'APPROVED';
      case 'rejected':
        return refund.status === 'REJECTED';
      case 'processed':
        return refund.status === 'PROCESSED';
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'PROCESSED':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'PROCESSED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleProcessRefund = async (refundId: string, action: 'approve' | 'reject', notes?: string) => {
    setProcessing(true);
    try {
      // TODO: Implement actual refund processing API call
      console.log('Processing refund:', { refundId, action, notes });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setRefunds(prev => prev.map(refund => 
        refund.id === refundId 
          ? { 
              ...refund, 
              status: action === 'approve' ? 'APPROVED' : 'REJECTED',
              adminNotes: notes,
              processedDate: new Date().toISOString()
            }
          : refund
      ));
      
      setShowRefundModal(false);
      setSelectedRefund(null);
    } catch (error) {
      console.error('Refund processing error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Refund Management</h2>
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected', 'processed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                filter === status
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status} ({refunds.filter(r => status === 'all' ? true : r.status === status.toUpperCase()).length})
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {refunds.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {refunds.filter(r => r.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {refunds.filter(r => r.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Refunded</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  refunds
                    .filter(r => r.status === 'PROCESSED')
                    .reduce((sum, r) => sum + (r.refundAmount || r.amount), 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refunds List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Refund Requests</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRefunds.map((refund) => (
            <div key={refund.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-900">
                      {refund.studentName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(refund.status)}`}>
                      {getStatusIcon(refund.status)}
                      <span className="ml-1">{refund.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{refund.courseTitle}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(refund.amount)}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(refund.requestedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Transaction:</span>
                      <span className="ml-1">{refund.transactionId.slice(-8)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Reason:</strong> {refund.reason}
                  </p>
                  {refund.adminNotes && (
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Admin Notes:</strong> {refund.adminNotes}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRefund(refund);
                      setShowRefundModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  {refund.status === 'PENDING' && userRole === 'admin' && (
                    <button
                      onClick={() => {
                        setSelectedRefund(refund);
                        setShowRefundModal(true);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Processing Modal */}
      {showRefundModal && selectedRefund && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowRefundModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Process Refund Request
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Student: {selectedRefund.studentName}</p>
                    <p className="text-sm text-gray-600">Course: {selectedRefund.courseTitle}</p>
                    <p className="text-sm text-gray-600">Amount: {formatCurrency(selectedRefund.amount)}</p>
                    <p className="text-sm text-gray-600">Reason: {selectedRefund.reason}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleProcessRefund(selectedRefund.id, 'approve')}
                      disabled={processing}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {processing ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleProcessRefund(selectedRefund.id, 'reject')}
                      disabled={processing}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                    >
                      {processing ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

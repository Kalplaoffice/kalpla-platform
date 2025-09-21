'use client';

import { useState, useEffect, Suspense } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface ApprovalItem {
  id: string;
  type: 'instructor_application' | 'course_submission';
  title: string;
  applicantName: string;
  applicantEmail: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  additionalInfo?: {
    experience?: string;
    qualifications?: string;
    courseDescription?: string;
    courseDuration?: string;
    coursePrice?: number;
  };
}

function ApprovalsContent() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockApprovals: ApprovalItem[] = [
      {
        id: '1',
        type: 'instructor_application',
        title: 'Instructor Application',
        applicantName: 'Rahul Sharma',
        applicantEmail: 'rahul.sharma@email.com',
        submittedDate: '2024-01-15T10:30:00Z',
        status: 'pending',
        description: 'Application to become a Python programming instructor',
        additionalInfo: {
          experience: '5 years of Python development experience',
          qualifications: 'MSc Computer Science, Certified Python Developer'
        }
      },
      {
        id: '2',
        type: 'course_submission',
        title: 'Course Submission',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane.smith@email.com',
        submittedDate: '2024-01-15T09:15:00Z',
        status: 'pending',
        description: 'Python for Data Science course submission',
        additionalInfo: {
          courseDescription: 'Comprehensive course covering Python basics to advanced data science concepts',
          courseDuration: '8 weeks',
          coursePrice: 2500
        }
      },
      {
        id: '3',
        type: 'instructor_application',
        title: 'Instructor Application',
        applicantName: 'Mike Johnson',
        applicantEmail: 'mike.johnson@email.com',
        submittedDate: '2024-01-14T14:20:00Z',
        status: 'approved',
        description: 'Application to become a React development instructor',
        additionalInfo: {
          experience: '7 years of React and frontend development',
          qualifications: 'BSc Computer Science, React Certified'
        }
      },
      {
        id: '4',
        type: 'course_submission',
        title: 'Course Submission',
        applicantName: 'Sarah Wilson',
        applicantEmail: 'sarah.wilson@email.com',
        submittedDate: '2024-01-14T11:45:00Z',
        status: 'rejected',
        description: 'Digital Marketing Fundamentals course submission',
        additionalInfo: {
          courseDescription: 'Basic digital marketing concepts and strategies',
          courseDuration: '6 weeks',
          coursePrice: 1800
        }
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setApprovals(mockApprovals);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApprovals = approvals.filter(approval => {
    if (selectedTab === 'all') return true;
    return approval.status === selectedTab;
  });

  const handleApproval = async (approvalId: string, action: 'approve' | 'reject') => {
    setProcessing(true);
    try {
      // TODO: Implement actual approval API call
      console.log(`${action} approval:`, approvalId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setApprovals(prev => prev.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
          : approval
      ));
      
      setShowModal(false);
      setSelectedApproval(null);
    } catch (error) {
      console.error('Approval processing error:', error);
    } finally {
      setProcessing(false);
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'instructor_application':
        return <AcademicCapIcon className="h-5 w-5 text-blue-500" />;
      case 'course_submission':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-500" />;
    }
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals & Applications</h1>
          <p className="text-gray-600">Review and manage instructor applications and course submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {approvals.filter(a => a.status === 'pending').length}
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
                  {approvals.filter(a => a.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {approvals.filter(a => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{approvals.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'pending', label: 'Pending', count: approvals.filter(a => a.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: approvals.filter(a => a.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: approvals.filter(a => a.status === 'rejected').length },
                { key: 'all', label: 'All', count: approvals.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Approvals Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApprovals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(approval.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {approval.type === 'instructor_application' ? 'Instructor' : 'Course'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{approval.applicantName}</div>
                          <div className="text-sm text-gray-500">{approval.applicantEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{approval.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(approval.submittedDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                          {getStatusIcon(approval.status)}
                          <span className="ml-1">{approval.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedApproval(approval);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {approval.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproval(approval.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleApproval(approval.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
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

        {/* Approval Detail Modal */}
        {showModal && selectedApproval && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedApproval.title} - {selectedApproval.applicantName}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applicant Details</label>
                      <div className="mt-1 text-sm text-gray-900">
                        <p><strong>Name:</strong> {selectedApproval.applicantName}</p>
                        <p><strong>Email:</strong> {selectedApproval.applicantEmail}</p>
                        <p><strong>Submitted:</strong> {formatDate(selectedApproval.submittedDate)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApproval.description}</p>
                    </div>

                    {selectedApproval.additionalInfo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                        <div className="mt-1 text-sm text-gray-900 space-y-2">
                          {selectedApproval.additionalInfo.experience && (
                            <p><strong>Experience:</strong> {selectedApproval.additionalInfo.experience}</p>
                          )}
                          {selectedApproval.additionalInfo.qualifications && (
                            <p><strong>Qualifications:</strong> {selectedApproval.additionalInfo.qualifications}</p>
                          )}
                          {selectedApproval.additionalInfo.courseDescription && (
                            <p><strong>Course Description:</strong> {selectedApproval.additionalInfo.courseDescription}</p>
                          )}
                          {selectedApproval.additionalInfo.courseDuration && (
                            <p><strong>Duration:</strong> {selectedApproval.additionalInfo.courseDuration}</p>
                          )}
                          {selectedApproval.additionalInfo.coursePrice && (
                            <p><strong>Price:</strong> {formatCurrency(selectedApproval.additionalInfo.coursePrice)}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      {selectedApproval.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(selectedApproval.id, 'reject')}
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                          >
                            {processing ? 'Processing...' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleApproval(selectedApproval.id, 'approve')}
                            disabled={processing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                          >
                            {processing ? 'Processing...' : 'Approve'}
                          </button>
                        </>
                      )}
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

export default function ApprovalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <ApprovalsContent />
    </Suspense>
  );
}

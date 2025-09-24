'use client';

import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FilterIcon,
  FunnelIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { enrollmentService, Enrollment, PaymentRecord } from '@/lib/enrollmentService';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in real implementation, fetch from API
      const mockEnrollments: Enrollment[] = [
        {
          id: 'enrollment_1',
          studentId: 'student_1',
          programId: 'program_1',
          programTitle: 'Master of Science in Computer Science',
          degreeType: 'master',
          field: 'Computer Science',
          status: 'active',
          enrollmentDate: '2024-01-15T00:00:00Z',
          startDate: '2024-02-01T00:00:00Z',
          totalFee: 150000,
          paidAmount: 150000,
          currency: 'INR',
          paymentStatus: 'completed',
          applicationData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+91-9876543210'
          },
          progress: {
            completedPhases: 2,
            totalPhases: 4,
            completedCourses: 8,
            totalCourses: 16,
            creditsEarned: 24,
            totalCredits: 48
          },
          documents: {
            applicationForm: true,
            paymentReceipt: true,
            identityProof: true,
            academicTranscripts: true,
            recommendationLetter: true
          },
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-03-15T00:00:00Z'
        },
        {
          id: 'enrollment_2',
          studentId: 'student_2',
          programId: 'program_2',
          programTitle: 'Bachelor of Technology in Data Science',
          degreeType: 'bachelor',
          field: 'Data Science',
          status: 'pending',
          enrollmentDate: '2024-03-01T00:00:00Z',
          totalFee: 200000,
          paidAmount: 50000,
          currency: 'INR',
          paymentStatus: 'partial',
          applicationData: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+91-9876543211'
          },
          progress: {
            completedPhases: 0,
            totalPhases: 6,
            completedCourses: 0,
            totalCourses: 24,
            creditsEarned: 0,
            totalCredits: 72
          },
          documents: {
            applicationForm: true,
            paymentReceipt: true,
            identityProof: true,
            academicTranscripts: false,
            recommendationLetter: false
          },
          createdAt: '2024-03-01T00:00:00Z',
          updatedAt: '2024-03-01T00:00:00Z'
        },
        {
          id: 'enrollment_3',
          studentId: 'student_3',
          programId: 'program_3',
          programTitle: 'Master of Business Administration',
          degreeType: 'master',
          field: 'Business Administration',
          status: 'approved',
          enrollmentDate: '2024-02-15T00:00:00Z',
          totalFee: 300000,
          paidAmount: 0,
          currency: 'INR',
          paymentStatus: 'pending',
          applicationData: {
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com',
            phone: '+91-9876543212'
          },
          progress: {
            completedPhases: 0,
            totalPhases: 4,
            completedCourses: 0,
            totalCourses: 20,
            creditsEarned: 0,
            totalCredits: 60
          },
          documents: {
            applicationForm: true,
            paymentReceipt: false,
            identityProof: true,
            academicTranscripts: true,
            recommendationLetter: true
          },
          createdAt: '2024-02-15T00:00:00Z',
          updatedAt: '2024-02-15T00:00:00Z'
        }
      ];

      setEnrollments(mockEnrollments);
      
      // Calculate stats
      const enrollmentStats = {
        totalEnrollments: mockEnrollments.length,
        pendingEnrollments: mockEnrollments.filter(e => e.status === 'pending').length,
        activeEnrollments: mockEnrollments.filter(e => e.status === 'active').length,
        completedEnrollments: mockEnrollments.filter(e => e.status === 'completed').length,
        totalRevenue: mockEnrollments.reduce((sum, e) => sum + e.paidAmount, 0),
        pendingPayments: mockEnrollments.filter(e => e.paymentStatus === 'pending' || e.paymentStatus === 'partial').length
      };
      
      setStats(enrollmentStats);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetails(true);
  };

  const handleEditEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async (enrollmentId: string, newStatus: Enrollment['status']) => {
    try {
      const success = await enrollmentService.updateEnrollmentStatus(enrollmentId, newStatus);
      if (success) {
        // Update local state
        setEnrollments(prev => prev.map(e => 
          e.id === enrollmentId 
            ? { ...e, status: newStatus, updatedAt: new Date().toISOString() }
            : e
        ));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating enrollment status:', error);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.programTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.applicationData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.applicationData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.applicationData.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || enrollment.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return enrollmentService.formatCurrency(amount, currency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrollment Management</h1>
          <p className="text-gray-600">Manage student enrollments, payments, and program status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue, 'INR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending Payment</option>
                <option value="partial">Partial Payment</option>
                <option value="completed">Payment Complete</option>
                <option value="failed">Payment Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Enrollments ({filteredEnrollments.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.applicationData.firstName} {enrollment.applicationData.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{enrollment.applicationData.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{enrollment.programTitle}</div>
                        <div className="text-sm text-gray-500">{enrollment.degreeType.toUpperCase()} in {enrollment.field}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${enrollmentService.getStatusColor(enrollment.status)}`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(enrollment.paidAmount, enrollment.currency)} / {formatCurrency(enrollment.totalFee, enrollment.currency)}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${enrollmentService.getPaymentStatusColor(enrollment.paymentStatus)}`}>
                          {enrollment.paymentStatus.charAt(0).toUpperCase() + enrollment.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {enrollment.progress.completedPhases}/{enrollment.progress.totalPhases} phases
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(enrollment.progress.completedPhases / enrollment.progress.totalPhases) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(enrollment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditEnrollment(enrollment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enrollment Details Modal */}
        {showDetails && selectedEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Enrollment Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">
                        {selectedEnrollment.applicationData.firstName} {selectedEnrollment.applicationData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{selectedEnrollment.applicationData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-gray-900">{selectedEnrollment.applicationData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Student ID</p>
                      <p className="text-gray-900">{selectedEnrollment.studentId}</p>
                    </div>
                  </div>
                </div>

                {/* Program Information */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Program Title</p>
                      <p className="text-gray-900">{selectedEnrollment.programTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Degree Type</p>
                      <p className="text-gray-900">{selectedEnrollment.degreeType.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Field of Study</p>
                      <p className="text-gray-900">{selectedEnrollment.field}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${enrollmentService.getStatusColor(selectedEnrollment.status)}`}>
                        {selectedEnrollment.status.charAt(0).toUpperCase() + selectedEnrollment.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Enrollment Date</p>
                      <p className="text-gray-900">{formatDate(selectedEnrollment.enrollmentDate)}</p>
                    </div>
                    {selectedEnrollment.startDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Start Date</p>
                        <p className="text-gray-900">{formatDate(selectedEnrollment.startDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Fee</p>
                      <p className="text-gray-900">{formatCurrency(selectedEnrollment.totalFee, selectedEnrollment.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                      <p className="text-gray-900">{formatCurrency(selectedEnrollment.paidAmount, selectedEnrollment.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
                      <p className="text-gray-900">{formatCurrency(selectedEnrollment.totalFee - selectedEnrollment.paidAmount, selectedEnrollment.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Status</p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${enrollmentService.getPaymentStatusColor(selectedEnrollment.paymentStatus)}`}>
                        {selectedEnrollment.paymentStatus.charAt(0).toUpperCase() + selectedEnrollment.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Information */}
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Phases</p>
                      <p className="text-gray-900">{selectedEnrollment.progress.completedPhases}/{selectedEnrollment.progress.totalPhases}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                      <p className="text-gray-900">{selectedEnrollment.progress.completedCourses}/{selectedEnrollment.progress.totalCourses}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                      <p className="text-gray-900">{selectedEnrollment.progress.creditsEarned}/{selectedEnrollment.progress.totalCredits}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Progress Percentage</p>
                      <p className="text-gray-900">{Math.round((selectedEnrollment.progress.completedPhases / selectedEnrollment.progress.totalPhases) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedEnrollment.documents).map(([doc, status]) => (
                      <div key={doc} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {doc.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status ? 'Submitted' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Enrollment Modal */}
        {showEditModal && selectedEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Update Enrollment Status</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Student: {selectedEnrollment.applicationData.firstName} {selectedEnrollment.applicationData.lastName}</p>
                  <p className="text-sm text-gray-600 mb-4">Program: {selectedEnrollment.programTitle}</p>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select
                    defaultValue={selectedEnrollment.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const newStatus = e.target.value as Enrollment['status'];
                      handleUpdateStatus(selectedEnrollment.id, newStatus);
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

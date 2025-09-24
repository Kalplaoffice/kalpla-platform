'use client';

import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusIcon,
  FilterIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { enrollmentService, Enrollment, PaymentRecord, EnrollmentProgress } from '@/lib/enrollmentService';

export default function StudentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [progress, setProgress] = useState<EnrollmentProgress | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    totalPaid: 0,
    totalDue: 0,
    averageGPA: 0
  });

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock student ID - in real implementation, get from auth context
      const studentId = 'student_1';
      const enrollmentData = await enrollmentService.getStudentEnrollments(studentId);
      const enrollmentStats = await enrollmentService.getEnrollmentStats(studentId);
      
      setEnrollments(enrollmentData);
      setStats(enrollmentStats);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (enrollment: Enrollment) => {
    try {
      setSelectedEnrollment(enrollment);
      
      // Load payment history and progress
      const payments = await enrollmentService.getPaymentHistory(enrollment.id);
      const enrollmentProgress = await enrollmentService.getEnrollmentProgress(enrollment.id);
      
      setPaymentHistory(payments);
      setProgress(enrollmentProgress);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading enrollment details:', error);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.programTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return enrollmentService.formatCurrency(amount, currency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrollments</h1>
          <p className="text-gray-600">Track your degree programs, progress, and payments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid, 'INR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average GPA</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGPA.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={() => window.location.href = '/degree-programs'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Enroll in Program
            </button>
          </div>
        </div>

        {/* Enrollments List */}
        <div className="space-y-6">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No enrollments match your search criteria.'
                  : 'You haven\'t enrolled in any programs yet.'
                }
              </p>
              <button
                onClick={() => window.location.href = '/degree-programs'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Programs
              </button>
            </div>
          ) : (
            filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{enrollment.programTitle}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${enrollmentService.getStatusColor(enrollment.status)}`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{enrollment.degreeType.toUpperCase()} in {enrollment.field}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Enrolled</p>
                          <p className="text-sm text-gray-600">{formatDate(enrollment.enrollmentDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Payment Status</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${enrollmentService.getPaymentStatusColor(enrollment.paymentStatus)}`}>
                            {enrollment.paymentStatus.charAt(0).toUpperCase() + enrollment.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Progress</p>
                          <p className="text-sm text-gray-600">
                            {enrollment.progress.completedPhases}/{enrollment.progress.totalPhases} phases
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Program Progress</span>
                        <span>{Math.round((enrollment.progress.completedPhases / enrollment.progress.totalPhases) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(enrollment.progress.completedPhases / enrollment.progress.totalPhases) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          Paid: <span className="font-medium text-green-600">{formatCurrency(enrollment.paidAmount, enrollment.currency)}</span>
                        </span>
                        <span className="text-gray-600">
                          Total: <span className="font-medium text-gray-900">{formatCurrency(enrollment.totalFee, enrollment.currency)}</span>
                        </span>
                        {enrollment.totalFee > enrollment.paidAmount && (
                          <span className="text-gray-600">
                            Due: <span className="font-medium text-red-600">{formatCurrency(enrollment.totalFee - enrollment.paidAmount, enrollment.currency)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleViewDetails(enrollment)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

                {/* Program Information */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
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

                {/* Progress Information */}
                {progress && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Phase Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Phase</span>
                            <span className="text-sm font-medium">{progress.currentPhase}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Completed Phases</span>
                            <span className="text-sm font-medium">{progress.completedPhases.length}</span>
                          </div>
                          {progress.currentCourse && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Current Course</span>
                              <span className="text-sm font-medium">{progress.currentCourse}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Academic Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">GPA</span>
                            <span className="text-sm font-medium">{progress.gpa || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Attendance</span>
                            <span className="text-sm font-medium">{progress.attendance}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Assignments</span>
                            <span className="text-sm font-medium">{progress.assignments.submitted}/{progress.assignments.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment History */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                  {paymentHistory.length === 0 ? (
                    <p className="text-gray-600">No payment records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium text-gray-900">{payment.description}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                payment.status === 'success' ? 'bg-green-100 text-green-800' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="mr-4">Amount: {formatCurrency(payment.amount, payment.currency)}</span>
                              <span className="mr-4">Method: {payment.paymentMethod}</span>
                              <span>Date: {formatDate(payment.paymentDate)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                            <p className="text-xs text-gray-600">TXN: {payment.transactionId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
      </div>
    </div>
  );
}

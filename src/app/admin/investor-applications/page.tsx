'use client';

import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { investorApplicationService, InvestorApplication, ApplicationFilters } from '@/lib/investorApplicationService';

export default function AdminInvestorApprovalDashboard() {
  const [applications, setApplications] = useState<InvestorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<InvestorApplication | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const applicationsData = await investorApplicationService.getApplications(filters);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load investor applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      const success = await investorApplicationService.approveApplication(
        selectedApplication.id,
        'admin_1',
        approvalNotes
      );
      
      if (success) {
        setShowApprovalModal(false);
        setApprovalNotes('');
        await loadApplications();
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;

    try {
      const success = await investorApplicationService.rejectApplication(
        selectedApplication.id,
        'admin_1',
        rejectionReason,
        approvalNotes
      );
      
      if (success) {
        setShowRejectionModal(false);
        setRejectionReason('');
        setApprovalNotes('');
        await loadApplications();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleReview = async (applicationId: string) => {
    try {
      const success = await investorApplicationService.reviewApplication(
        applicationId,
        'admin_1',
        'Application under review'
      );
      
      if (success) {
        await loadApplications();
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.investorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Applications</h1>
                <p className="text-gray-600">Review and approve investor applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Stage</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Stages</option>
                  <option value="seed">Seed</option>
                  <option value="series_a">Series A</option>
                  <option value="series_b">Series B</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by investor name, company, or email..."
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Investor Applications ({filteredApplications.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      application.status === 'approved' ? 'bg-green-100' :
                      application.status === 'rejected' ? 'bg-red-100' :
                      application.status === 'under_review' ? 'bg-blue-100' :
                      application.status === 'submitted' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      <BuildingOfficeIcon className={`h-6 w-6 ${
                        application.status === 'approved' ? 'text-green-600' :
                        application.status === 'rejected' ? 'text-red-600' :
                        application.status === 'under_review' ? 'text-blue-600' :
                        application.status === 'submitted' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{application.investorName}</h3>
                      <p className="text-sm text-gray-600">{application.companyName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorApplicationService.getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <span className="text-sm text-gray-600">{application.investmentStage}</span>
                        <span className="text-sm text-gray-500">
                          {application.submittedAt ? investorApplicationService.formatDate(application.submittedAt) : 'Not submitted'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {application.investmentAmount && (
                      <p className="text-lg font-bold text-gray-900">
                        ₹{application.investmentAmount.toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">{application.investmentFocus?.join(', ')}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      
                      {application.status === 'submitted' && (
                        <button
                          onClick={() => handleReview(application.id)}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Review
                        </button>
                      )}
                      
                      {application.status === 'under_review' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowRejectionModal(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="p-8 text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600">No investor applications match your current filters.</p>
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Company Name</p>
                        <p className="text-sm text-gray-900">{selectedApplication.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Website</p>
                        <p className="text-sm text-gray-900">{selectedApplication.companyWebsite}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Investor Name</p>
                        <p className="text-sm text-gray-900">{selectedApplication.investorName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-900">{selectedApplication.investorEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Investment Profile */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Investment Stage</p>
                        <p className="text-sm text-gray-900">{selectedApplication.investmentStage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Investment Amount</p>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.investmentAmount 
                            ? `₹${selectedApplication.investmentAmount.toLocaleString('en-IN')}` 
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Investment Focus</p>
                        <p className="text-sm text-gray-900">{selectedApplication.investmentFocus?.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Companies */}
                  {selectedApplication.portfolioCompanies && selectedApplication.portfolioCompanies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Companies</h3>
                      <div className="space-y-2">
                        {selectedApplication.portfolioCompanies.map((company, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-900">{company}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorApplicationService.getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Submitted At</p>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.submittedAt 
                            ? investorApplicationService.formatDate(selectedApplication.submittedAt)
                            : 'Not submitted'
                          }
                        </p>
                      </div>
                      {selectedApplication.reviewedBy && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Reviewed By</p>
                          <p className="text-sm text-gray-900">{selectedApplication.reviewedBy}</p>
                        </div>
                      )}
                      {selectedApplication.approvedBy && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Approved By</p>
                          <p className="text-sm text-gray-900">{selectedApplication.approvedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedApplication.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                      <p className="text-sm text-gray-900">{selectedApplication.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Approve Application</h2>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Investor: {selectedApplication.investorName}</p>
                  <p className="text-sm text-gray-600">Company: {selectedApplication.companyName}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this approval..."
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reject Application</h2>
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Investor: {selectedApplication.investorName}</p>
                  <p className="text-sm text-gray-600">Company: {selectedApplication.companyName}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Explain why this application is being rejected..."
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Application
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

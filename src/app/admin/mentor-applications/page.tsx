'use client';

import { useState, useEffect } from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { mentorApplicationService, MentorApplication } from '@/lib/mentorApplicationService';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function MentorApplicationsPage() {
  const { checkAccess, hasPermission } = useRoleBasedAccess();
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    // Check admin access
    if (!checkAccess('Admin', 'canAccessAdminPanel')) {
      return;
    }
    
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await mentorApplicationService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (application: MentorApplication, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(true);
      await mentorApplicationService.reviewApplication(
        application.id,
        status,
        status === 'APPROVED' ? reviewNotes : rejectionReason
      );
      
      // Reload applications
      await loadApplications();
      setShowModal(false);
      setReviewNotes('');
      setRejectionReason('');
    } catch (error) {
      console.error('Error reviewing application:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDocument = async (documentKey: string, fileName: string) => {
    try {
      const url = await mentorApplicationService.getDocumentUrl(documentKey);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const downloadDeclarationPdf = async (pdfKey: string) => {
    try {
      const url = await mentorApplicationService.getDeclarationPdfUrl(pdfKey);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mentor-declaration.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'ALL' || app.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!hasPermission('canAccessAdminPanel')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage mentor applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'ALL', label: 'All Applications', count: applications.length },
                { key: 'PENDING', label: 'Pending', count: applications.filter(a => a.status === 'PENDING').length },
                { key: 'APPROVED', label: 'Approved', count: applications.filter(a => a.status === 'APPROVED').length },
                { key: 'REJECTED', label: 'Rejected', count: applications.filter(a => a.status === 'REJECTED').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'ALL' 
                  ? 'No mentor applications have been submitted yet.'
                  : `No ${filter.toLowerCase()} applications found.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expertise
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
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.expertise}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(application.submittedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <EyeIcon className="h-4 w-4 inline mr-1" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Review Application - {selectedApplication.name}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expertise</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.expertise}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.availability}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedApplication.linkedin ? (
                          <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {selectedApplication.linkedin}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.bio}</p>
                  </div>

                  {/* Documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mandatory Documents</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">PAN Card</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.panCard, 'pan-card.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Aadhaar Card</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.aadhaarCard, 'aadhaar-card.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Bank Account Details</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.bankAccountDetails, 'bank-details.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Cancelled Cheque</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.cancelledCheque, 'cancelled-cheque.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Educational Certificate</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.educationalCertificate, 'educational-certificate.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Experience Proof</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.experienceProof, 'experience-proof.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Passport Photo</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.passportPhoto, 'passport-photo.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Digital Signature</span>
                        <button
                          onClick={() => downloadDocument(selectedApplication.documents.digitalSignature, 'digital-signature.pdf')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    {/* Optional Documents */}
                    {(selectedApplication.documents.gstRegistration || selectedApplication.documents.professionalTaxRegistration) && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Documents</label>
                        <div className="space-y-2">
                          {selectedApplication.documents.gstRegistration && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-900">GST Registration</span>
                              <button
                                onClick={() => downloadDocument(selectedApplication.documents.gstRegistration!, 'gst-registration.pdf')}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                                Download
                              </button>
                            </div>
                          )}
                          {selectedApplication.documents.professionalTaxRegistration && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-900">Professional Tax Registration</span>
                              <button
                                onClick={() => downloadDocument(selectedApplication.documents.professionalTaxRegistration!, 'professional-tax-registration.pdf')}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                                Download
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Declaration PDF */}
                    {selectedApplication.declarationPdf && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Legal Documents</label>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-900">Declaration PDF (Legal Proof)</span>
                          <button
                            onClick={() => downloadDeclarationPdf(selectedApplication.declarationPdf!)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  {selectedApplication.status === 'PENDING' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Notes (Optional)
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add any notes about this application..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (Required if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Explain why this application is being rejected..."
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReview(selectedApplication, 'REJECTED')}
                          disabled={actionLoading || !rejectionReason.trim()}
                          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleReview(selectedApplication, 'APPROVED')}
                          disabled={actionLoading}
                          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

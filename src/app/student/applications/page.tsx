'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const client = generateClient();

interface ProgramApplication {
  id: string;
  programID: string;
  studentID: string;
  fullName: string;
  email: string;
  phone?: string;
  statementOfPurpose?: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Program {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  fee: number;
  currency: string;
  duration: number;
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [programs, setPrograms] = useState<Record<string, Program>>({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ProgramApplication | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      // Fetch user's applications
      const applicationsResult = await client.graphql({
        query: `
          query ListProgramApplicationsByStudent($studentID: ID!) {
            listProgramApplications(filter: { studentID: { eq: $studentID } }) {
              items {
                id
                programID
                studentID
                fullName
                email
                phone
                statementOfPurpose
                status
                submittedAt
                reviewedAt
                reviewedBy
                reviewNotes
                createdAt
                updatedAt
              }
            }
          }
        `,
        variables: {
          studentID: user.username
        }
      });

      const applicationsData = applicationsResult.data.listProgramApplications.items;
      setApplications(applicationsData);

      // Fetch program details for each application
      const programIds = [...new Set(applicationsData.map(app => app.programID))];
      const programsData: Record<string, Program> = {};

      for (const programId of programIds) {
        try {
          const programResult = await client.graphql({
            query: `
              query GetDegreeProgram($id: ID!) {
                getDegreeProgram(id: $id) {
                  id
                  title
                  shortTitle
                  description
                  fee
                  currency
                  duration
                }
              }
            `,
            variables: { id: programId }
          });

          if (programResult.data.getDegreeProgram) {
            programsData[programId] = programResult.data.getDegreeProgram;
          }
        } catch (error) {
          console.error(`Error fetching program ${programId}:`, error);
        }
      }

      setPrograms(programsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const openApplicationModal = (application: ProgramApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your application is under review. You will receive an update within 2-3 weeks.';
      case 'approved':
        return 'Congratulations! Your application has been approved. You will receive payment instructions via email.';
      case 'rejected':
        return 'Unfortunately, your application was not approved this time. You can apply again in the next intake.';
      case 'withdrawn':
        return 'Your application has been withdrawn.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your program applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't applied to any programs yet. Browse our programs to get started.
            </p>
            <div className="mt-6">
              <a
                href="/programs"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Programs
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const program = programs[application.programID];
              return (
                <div key={application.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {program ? program.title : `Program ${application.programID}`}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </span>
                        </div>
                        
                        {program && (
                          <div className="text-sm text-gray-600 mb-3">
                            <p>{program.shortTitle}</p>
                            <p>Duration: {program.duration} months • Fee: {program.currency} {program.fee.toLocaleString()}</p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Applied: {new Date(application.submittedAt).toLocaleDateString()}
                          </div>
                          {application.reviewedAt && (
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className={`p-3 rounded-md ${
                          application.status === 'approved' ? 'bg-green-50 border border-green-200' :
                          application.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                          application.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-start">
                            {application.status === 'pending' && (
                              <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                            )}
                            {application.status === 'approved' && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                            )}
                            {application.status === 'rejected' && (
                              <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                            )}
                            <p className={`text-sm ${
                              application.status === 'approved' ? 'text-green-800' :
                              application.status === 'rejected' ? 'text-red-800' :
                              application.status === 'pending' ? 'text-yellow-800' :
                              'text-gray-800'
                            }`}>
                              {getStatusMessage(application.status)}
                            </p>
                          </div>
                        </div>

                        {application.reviewNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Review Notes</h4>
                            <p className="text-sm text-gray-700">{application.reviewNotes}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <button
                          onClick={() => openApplicationModal(application)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Application Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Application Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedApplication.email}</p>
                    </div>
                    {selectedApplication.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedApplication.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        <span className="ml-1 capitalize">{selectedApplication.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p className="text-gray-900">{new Date(selectedApplication.submittedAt).toLocaleString()}</p>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reviewed</label>
                        <p className="text-gray-900">{new Date(selectedApplication.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statement of Purpose */}
                {selectedApplication.statementOfPurpose && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statement of Purpose
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedApplication.statementOfPurpose}
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                {selectedApplication.reviewNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Notes
                    </label>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedApplication.reviewNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {selectedApplication.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Next Steps</h4>
                        <p className="text-sm text-green-800 mt-1">
                          Congratulations! You will receive payment instructions via email within 24 hours. 
                          Please complete your payment to secure your spot in the program.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-red-900">Application Not Approved</h4>
                        <p className="text-sm text-red-800 mt-1">
                          Don't be discouraged! You can apply again in the next intake. 
                          Consider strengthening your application with additional qualifications or experience.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

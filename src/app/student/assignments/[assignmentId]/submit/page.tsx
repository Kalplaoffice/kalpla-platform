'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  DocumentTextIcon,
  PaperClipIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  TrophyIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { studentSubmissionService, StudentSubmission, SubmissionUploadProgress } from '@/lib/studentSubmissionService';
import { mentorAssignmentService, MentorAssignment } from '@/lib/mentorAssignmentService';

interface StudentSubmissionPageProps {
  params: {
    assignmentId: string;
  };
}

export default function StudentSubmissionPage({ params }: StudentSubmissionPageProps) {
  const [assignment, setAssignment] = useState<MentorAssignment | null>(null);
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'submit' | 'view' | 'history'>('submit');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Submission form state
  const [formData, setFormData] = useState({
    content: '',
    attachments: [] as File[],
    acknowledgements: {
      plagiarism: false,
      originality: false,
      collaboration: false
    }
  });

  const [uploadProgress, setUploadProgress] = useState<SubmissionUploadProgress[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, [params.assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assignmentData, existingSubmission] = await Promise.all([
        mentorAssignmentService.getAssignment(params.assignmentId),
        studentSubmissionService.getSubmission(`sub_${params.assignmentId}_student_1`) // Mock student ID
      ]);
      
      setAssignment(assignmentData);
      setSubmission(existingSubmission);
      
      if (existingSubmission) {
        setActiveTab('view');
        setFormData({
          content: existingSubmission.content,
          attachments: [],
          acknowledgements: {
            plagiarism: existingSubmission.acknowledgements.some(a => a.content.includes('plagiarized')),
            originality: existingSubmission.acknowledgements.some(a => a.content.includes('original')),
            collaboration: existingSubmission.acknowledgements.some(a => a.content.includes('collaboration'))
          }
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files]
    });

    // Initialize upload progress
    const newProgress = files.map(file => ({
      fileId: `file_${Date.now()}_${Math.random()}`,
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));
    setUploadProgress([...uploadProgress, ...newProgress]);

    // Simulate upload progress
    files.forEach((file, index) => {
      const progressId = newProgress[index].fileId;
      simulateUploadProgress(progressId, file);
    });
  };

  const simulateUploadProgress = (fileId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileId === fileId 
              ? { ...p, progress: 100, status: 'completed' }
              : p
          )
        );
      } else {
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileId === fileId 
              ? { ...p, progress: Math.round(progress) }
              : p
          )
        );
      }
    }, 200);
  };

  const removeFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attachments: newAttachments
    });
    
    // Remove from upload progress
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate submission
      const validation = await studentSubmissionService.validateSubmission(
        params.assignmentId,
        formData.content,
        formData.attachments
      );

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Upload files to S3
      const uploadedAttachments = [];
      for (const file of formData.attachments) {
        const attachment = await studentSubmissionService.uploadFileToS3(
          file,
          `sub_${Date.now()}`,
          `Uploaded file: ${file.name}`
        );
        if (attachment) {
          uploadedAttachments.push(attachment);
        }
      }

      // Create submission
      const submissionData = {
        assignmentId: params.assignmentId,
        assignmentTitle: assignment?.title || '',
        studentId: 'student_1', // Mock student ID
        studentName: 'John Doe', // Mock student name
        studentEmail: 'john.doe@student.kalpla.edu', // Mock student email
        content: formData.content,
        attachments: uploadedAttachments,
        resubmissionCount: submission?.resubmissionCount || 0,
        maxResubmissions: assignment?.settings.maxResubmissions || 0
      };

      const newSubmission = await studentSubmissionService.createSubmission(submissionData);

      // Add acknowledgements
      if (formData.acknowledgements.plagiarism) {
        await studentSubmissionService.addAcknowledgement(
          newSubmission.id,
          'student_1',
          'I acknowledge that this submission is my own work and I have not plagiarized any content.'
        );
      }

      if (formData.acknowledgements.originality) {
        await studentSubmissionService.addAcknowledgement(
          newSubmission.id,
          'student_1',
          'I confirm that this work is original and has not been submitted elsewhere.'
        );
      }

      if (formData.acknowledgements.collaboration) {
        await studentSubmissionService.addAcknowledgement(
          newSubmission.id,
          'student_1',
          'I acknowledge any collaboration with classmates and have cited all sources appropriately.'
        );
      }

      setSubmission(newSubmission);
      setActiveTab('view');
      setShowSubmitModal(false);
      
      // Reset form
      setFormData({
        content: '',
        attachments: [],
        acknowledgements: {
          plagiarism: false,
          originality: false,
          collaboration: false
        }
      });
      setUploadProgress([]);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmission = async () => {
    try {
      if (submission) {
        const success = await studentSubmissionService.deleteSubmission(submission.id);
        if (success) {
          setSubmission(null);
          setActiveTab('submit');
          setShowDeleteModal(false);
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      setError('Failed to delete submission');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assignment</h2>
          <p className="text-gray-600">{error || 'Assignment not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                <p className="text-gray-600">Assignment Submission</p>
              </div>
            </div>
            {submission && (
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${studentSubmissionService.getStatusColor(submission.status)}`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
                {submission.grade && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Grade: {submission.grade}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{assignment.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
              <div className="text-gray-600 whitespace-pre-wrap">{assignment.instructions}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">{assignment.totalMarks}</p>
              <p className="text-sm text-gray-600">Total Marks</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">{studentSubmissionService.formatDate(assignment.dueDate)}</p>
              <p className="text-sm text-gray-600">Due Date</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-yellow-600">{studentSubmissionService.formatTime(assignment.dueDate)}</p>
              <p className="text-sm text-gray-600">Due Time</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-600">{assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}</p>
              <p className="text-sm text-gray-600">Type</p>
            </div>
          </div>

          {/* Attachments */}
          {assignment.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Assignment Files</h3>
              <div className="space-y-2">
                {assignment.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <PaperClipIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.originalName}</p>
                        <p className="text-xs text-gray-500">{studentSubmissionService.formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'submit', name: 'Submit Assignment', icon: CloudArrowUpIcon },
                { id: 'view', name: 'View Submission', icon: EyeIcon },
                { id: 'history', name: 'Submission History', icon: ClockIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'submit' && (
          <SubmitTab 
            assignment={assignment}
            formData={formData}
            setFormData={setFormData}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onSubmit={() => setShowSubmitModal(true)}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'view' && submission && (
          <ViewSubmissionTab 
            submission={submission}
            assignment={assignment}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab assignmentId={params.assignmentId} />
        )}

        {/* Submit Modal */}
        {showSubmitModal && (
          <SubmitModal
            assignment={assignment}
            formData={formData}
            onSubmit={handleSubmit}
            onClose={() => setShowSubmitModal(false)}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Delete Modal */}
        {showDeleteModal && submission && (
          <DeleteModal
            submission={submission}
            onConfirm={handleDeleteSubmission}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
}

// Submit Tab Component
function SubmitTab({ 
  assignment, 
  formData, 
  setFormData, 
  uploadProgress, 
  fileInputRef, 
  onFileUpload, 
  onRemoveFile, 
  onSubmit, 
  isSubmitting 
}: {
  assignment: MentorAssignment;
  formData: any;
  setFormData: any;
  uploadProgress: SubmissionUploadProgress[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Assignment</h2>
      
      <div className="space-y-6">
        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={8}
            placeholder="Describe your submission, explain your approach, or provide any additional information..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX, ZIP files up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.rar,.txt,.jpg,.jpeg,.png"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Choose Files
            </button>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadProgress.map((progress, index) => (
                <div key={progress.fileId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <PaperClipIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{progress.fileName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {progress.status === 'uploading' && (
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progress}%` }}
                        ></div>
                      </div>
                    )}
                    {progress.status === 'completed' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {progress.status === 'error' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acknowledgements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acknowledgements</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acknowledgements.plagiarism}
                onChange={(e) => setFormData({
                  ...formData,
                  acknowledgements: {
                    ...formData.acknowledgements,
                    plagiarism: e.target.checked
                  }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I acknowledge that this submission is my own work and I have not plagiarized any content.
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acknowledgements.originality}
                onChange={(e) => setFormData({
                  ...formData,
                  acknowledgements: {
                    ...formData.acknowledgements,
                    originality: e.target.checked
                  }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I confirm that this work is original and has not been submitted elsewhere.
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acknowledgements.collaboration}
                onChange={(e) => setFormData({
                  ...formData,
                  acknowledgements: {
                    ...formData.acknowledgements,
                    collaboration: e.target.checked
                  }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I acknowledge any collaboration with classmates and have cited all sources appropriately.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !formData.content.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// View Submission Tab Component
function ViewSubmissionTab({ 
  submission, 
  assignment, 
  onDelete 
}: {
  submission: StudentSubmission;
  assignment: MentorAssignment;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Submission</h2>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${studentSubmissionService.getStatusColor(submission.status)}`}>
            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
          </span>
          {submission.grade && (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
              Grade: {submission.grade}/{assignment.totalMarks}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Submission Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-600">{studentSubmissionService.formatDate(submission.submittedAt)}</p>
            <p className="text-sm text-gray-600">Submitted</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <ClockIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-600">{studentSubmissionService.formatTime(submission.submittedAt)}</p>
            <p className="text-sm text-gray-600">Time</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <PaperClipIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-600">{submission.attachments.length}</p>
            <p className="text-sm text-gray-600">Files</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <ChatBubbleLeftIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-yellow-600">{submission.comments.length}</p>
            <p className="text-sm text-gray-600">Comments</p>
          </div>
        </div>

        {/* Submission Content */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Content</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
          </div>
        </div>

        {/* Attachments */}
        {submission.attachments.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Attached Files</h3>
            <div className="space-y-2">
              {submission.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{studentSubmissionService.getFileTypeIcon(attachment.type)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.originalName}</p>
                      <p className="text-xs text-gray-500">{studentSubmissionService.formatFileSize(attachment.size)}</p>
                    </div>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {submission.feedback && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback</h3>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{submission.feedback}</p>
            </div>
          </div>
        )}

        {/* Comments */}
        {submission.comments.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Comments</h3>
            <div className="space-y-3">
              {submission.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        comment.authorType === 'mentor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {comment.authorType}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{studentSubmissionService.formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </div>
  );
}

// History Tab Component
function HistoryTab({ assignmentId }: { assignmentId: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Submission History</h3>
      <p className="text-gray-600">Submission history will be available soon.</p>
    </div>
  );
}

// Submit Modal Component
function SubmitModal({ 
  assignment, 
  formData, 
  onSubmit, 
  onClose, 
  isSubmitting 
}: {
  assignment: MentorAssignment;
  formData: any;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Submission</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to submit your assignment "{assignment.title}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal Component
function DeleteModal({ 
  submission, 
  onConfirm, 
  onClose 
}: {
  submission: StudentSubmission;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Delete Submission</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete your submission for "{submission.assignmentTitle}"? This action cannot be undone and will remove all attached files.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Submission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

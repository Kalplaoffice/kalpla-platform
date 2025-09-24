'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  CalendarIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { courseApprovalService, CourseApproval, ApprovalCriteria } from '@/lib/courseApprovalService';
import { courseService } from '@/lib/courseService';
import { curriculumService } from '@/lib/curriculumService';

export default function CourseReviewPage() {
  const router = useRouter();
  const params = useParams();
  const approvalId = params.approvalId as string;
  
  const [approval, setApproval] = useState<CourseApproval | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<ApprovalCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    feedback: '',
    rejectionReason: '',
    requiredChanges: [''],
    criteriaScores: {} as { [key: string]: number },
    overallScore: 0,
    recommendation: 'approve' as 'approve' | 'reject' | 'request_changes'
  });

  useEffect(() => {
    loadReviewData();
  }, [approvalId]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      
      const [approvalData, criteriaData] = await Promise.all([
        courseApprovalService.getApproval(approvalId),
        courseApprovalService.getApprovalCriteria()
      ]);
      
      if (approvalData) {
        setApproval(approvalData);
        
        // Load course and curriculum data
        const [courseData, curriculumData] = await Promise.all([
          courseService.getCourse(approvalData.courseId),
          curriculumService.getCurriculum(approvalData.courseId)
        ]);
        
        setCourse(courseData);
        setCurriculum(curriculumData);
      }
      
      setCriteria(criteriaData);
      
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = async () => {
    try {
      setReviewing(true);
      const result = await courseApprovalService.startReview(
        approvalId,
        'current-admin-id',
        'Current Admin'
      );
      
      if (result.success) {
        setApproval(prev => prev ? { ...prev, status: 'under_review' } : null);
      }
    } catch (error) {
      console.error('Error starting review:', error);
    } finally {
      setReviewing(false);
    }
  };

  const handleApprove = async () => {
    try {
      setReviewing(true);
      const result = await courseApprovalService.approveCourse(
        approvalId,
        'current-admin-id',
        'Current Admin',
        reviewData.feedback
      );
      
      if (result.success) {
        router.push('/admin/courses/approvals');
      }
    } catch (error) {
      console.error('Error approving course:', error);
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    try {
      setReviewing(true);
      const result = await courseApprovalService.rejectCourse(
        approvalId,
        'current-admin-id',
        'Current Admin',
        reviewData.rejectionReason,
        reviewData.requiredChanges.filter(change => change.trim())
      );
      
      if (result.success) {
        router.push('/admin/courses/approvals');
      }
    } catch (error) {
      console.error('Error rejecting course:', error);
    } finally {
      setReviewing(false);
    }
  };

  const handleRequestChanges = async () => {
    try {
      setReviewing(true);
      const result = await courseApprovalService.requestChanges(
        approvalId,
        'current-admin-id',
        'Current Admin',
        reviewData.feedback,
        reviewData.requiredChanges.filter(change => change.trim())
      );
      
      if (result.success) {
        router.push('/admin/courses/approvals');
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
    } finally {
      setReviewing(false);
    }
  };

  const updateCriteriaScore = (criteriaId: string, score: number) => {
    setReviewData(prev => ({
      ...prev,
      criteriaScores: { ...prev.criteriaScores, [criteriaId]: score }
    }));
  };

  const addRequiredChange = () => {
    setReviewData(prev => ({
      ...prev,
      requiredChanges: [...prev.requiredChanges, '']
    }));
  };

  const updateRequiredChange = (index: number, value: string) => {
    setReviewData(prev => ({
      ...prev,
      requiredChanges: prev.requiredChanges.map((change, i) => 
        i === index ? value : change
      )
    }));
  };

  const removeRequiredChange = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      requiredChanges: prev.requiredChanges.filter((_, i) => i !== index)
    }));
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-4 w-4 text-red-500" />;
      case 'pdf':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTotalDuration = () => {
    return curriculum.reduce((total, lesson) => {
      if (lesson.duration) {
        const minutes = parseInt(lesson.duration.replace(/\D/g, ''));
        return total + minutes;
      }
      return total;
    }, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review data...</p>
        </div>
      </div>
    );
  }

  if (!approval || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Review Not Found</h1>
          <p className="text-gray-600 mb-6">The review you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/courses/approvals')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Approvals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/courses/approvals')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Approvals
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Course Review</span>
            </div>
            
            {approval.status === 'submitted' && (
              <button
                onClick={handleStartReview}
                disabled={reviewing}
                className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  reviewing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {reviewing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting Review...
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Start Review
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-4">{course.shortDescription}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {approval.instructorName}
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Submitted {new Date(approval.submittedAt).toLocaleDateString()}
                    </span>
                    <span>{curriculum.length} lessons</span>
                    <span>{formatDuration(getTotalDuration())}</span>
                    <span className="font-medium text-gray-900">
                      {course.isFree ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Description</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>

            {/* Curriculum Review */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Curriculum</h2>
              
              <div className="space-y-3">
                {curriculum.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 w-8">{index + 1}</span>
                    {getLessonTypeIcon(lesson.type)}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {lesson.duration && (
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      )}
                      {lesson.isPreview && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Preview
                        </span>
                      )}
                      <button
                        onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowApprovalModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve Course
                </button>
                
                <button
                  onClick={() => setShowRejectionModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject Course
                </button>
                
                <button
                  onClick={() => setShowRejectionModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
                >
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  Request Changes
                </button>
              </div>
            </div>

            {/* Approval Criteria */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Criteria</h3>
              
              <div className="space-y-4">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{criterion.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        criterion.isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {criterion.isRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{criterion.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Score:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => updateCriteriaScore(criterion.id, score)}
                            className={`w-6 h-6 rounded-full text-xs font-medium ${
                              reviewData.criteriaScores[criterion.id] === score
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Lessons:</span>
                  <span className="text-sm font-medium text-gray-900">{approval.metadata.totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Duration:</span>
                  <span className="text-sm font-medium text-gray-900">{formatDuration(approval.metadata.totalDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Preview Lessons:</span>
                  <span className="text-sm font-medium text-gray-900">{approval.metadata.previewLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Course Price:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {approval.metadata.isFree ? 'Free' : `₹${approval.metadata.coursePrice.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Approve Course</h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
                  <textarea
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                    rows={4}
                    placeholder="Provide feedback to the instructor..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={reviewing}
                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                      reviewing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {reviewing ? 'Approving...' : 'Approve Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reject Course</h3>
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
                  <textarea
                    value={reviewData.rejectionReason}
                    onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                    rows={3}
                    placeholder="Explain why the course is being rejected..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Changes</label>
                  <div className="space-y-2">
                    {reviewData.requiredChanges.map((change, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={change}
                          onChange={(e) => updateRequiredChange(index, e.target.value)}
                          placeholder={`Required change ${index + 1}`}
                          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {reviewData.requiredChanges.length > 1 && (
                          <button
                            onClick={() => removeRequiredChange(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addRequiredChange}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <span className="mr-1">+</span>
                      Add Required Change
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={reviewing || !reviewData.rejectionReason.trim()}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                      reviewing || !reviewData.rejectionReason.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {reviewing ? 'Rejecting...' : 'Reject Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

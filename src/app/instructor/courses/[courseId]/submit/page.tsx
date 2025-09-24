'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { courseApprovalService, CourseApproval } from '@/lib/courseApprovalService';
import { courseService } from '@/lib/courseService';
import { curriculumService } from '@/lib/curriculumService';

export default function CourseSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [existingApproval, setExistingApproval] = useState<CourseApproval | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // Load course details
      const courseData = await courseService.getCourse(courseId);
      setCourse(courseData);
      
      // Load curriculum
      const curriculumData = await curriculumService.getCurriculum(courseId);
      setCurriculum(curriculumData);
      
      // Check for existing approval
      const approvals = await courseApprovalService.getInstructorApprovals('current-instructor-id');
      const existing = approvals.find(approval => approval.courseId === courseId);
      setExistingApproval(existing || null);
      
    } catch (error) {
      console.error('Error loading course data:', error);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!course) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const result = await courseApprovalService.submitCourseForApproval(courseId, {
        instructorId: 'current-instructor-id',
        instructorName: 'Current Instructor',
        instructorEmail: 'instructor@example.com'
      });
      
      if (result.success) {
        router.push(`/instructor/courses/${courseId}/submission-success`);
      } else {
        setError(result.error || 'Failed to submit course for approval');
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'under_review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'submitted':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
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
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/instructor/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
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
                onClick={() => router.push(`/instructor/courses/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Course
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Submit for Approval</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.shortDescription}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {formatDuration(getTotalDuration())}
                </span>
                <span>{curriculum.length} lessons</span>
                <span className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {course.isFree ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Approval Status */}
        {existingApproval && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(existingApproval.status)}
              <h2 className="text-lg font-semibold text-gray-900">Current Approval Status</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(existingApproval.status)}`}>
                  {existingApproval.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm text-gray-900">
                  {new Date(existingApproval.submittedAt).toLocaleDateString()}
                </span>
              </div>
              
              {existingApproval.reviewedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviewed:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(existingApproval.reviewedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {existingApproval.reviewerName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviewer:</span>
                  <span className="text-sm text-gray-900">{existingApproval.reviewerName}</span>
                </div>
              )}
              
              {existingApproval.feedback && (
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Feedback:</span>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {existingApproval.feedback}
                  </p>
                </div>
              )}
              
              {existingApproval.rejectionReason && (
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Rejection Reason:</span>
                  <p className="text-sm text-red-900 bg-red-50 p-3 rounded-lg">
                    {existingApproval.rejectionReason}
                  </p>
                </div>
              )}
              
              {existingApproval.requiredChanges && existingApproval.requiredChanges.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Required Changes:</span>
                  <ul className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg space-y-1">
                    {existingApproval.requiredChanges.map((change, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {existingApproval.status === 'rejected' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Resubmit Course</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Make the required changes and resubmit your course for review.
                </p>
                <button
                  onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Edit Course
                </button>
              </div>
            )}
          </div>
        )}

        {/* Course Content Review */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content Review</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <PlayIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">Video Lessons</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {curriculum.filter(l => l.type === 'video').length}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">PDF Lessons</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {curriculum.filter(l => l.type === 'pdf').length}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Quiz Lessons</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {curriculum.filter(l => l.type === 'quiz').length}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Lesson Overview</h3>
              <div className="space-y-2">
                {curriculum.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500 w-8">{index + 1}</span>
                    {getLessonTypeIcon(lesson.type)}
                    <span className="text-sm text-gray-900 flex-1">{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                    )}
                    {lesson.isPreview && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Preview
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Submission Guidelines</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Ensure all lesson content is complete and properly formatted</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Verify that all video and PDF files are properly uploaded</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Check that quiz questions are accurate and well-designed</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Ensure course description and metadata are complete</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Review time: Typically 2-5 business days</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}`)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {(!existingApproval || existingApproval.status === 'rejected') && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

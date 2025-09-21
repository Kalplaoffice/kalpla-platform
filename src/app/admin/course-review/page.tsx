'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { courseService } from '@/lib/courseService';
import { CoursePreview } from '@/components/course/CoursePreview';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: string;
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  price: number;
  currency: string;
  thumbnail?: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  publishedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  sections: any[];
  createdAt: string;
  updatedAt: string;
}

export default function CourseReviewPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPendingCourses();
  }, []);

  const loadPendingCourses = async () => {
    try {
      setLoading(true);
      const pendingCourses = await courseService.getCoursesByStatus('PENDING_REVIEW');
      setCourses(pendingCourses);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    try {
      setActionLoading(courseId);
      const updatedCourse = await courseService.approveCourse(courseId, reviewNotes);
      
      // Update the courses list
      setCourses(courses.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
      
      setSelectedCourse(null);
      setReviewNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to approve course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCourse = async (courseId: string) => {
    try {
      setActionLoading(courseId);
      const updatedCourse = await courseService.rejectCourse(courseId, rejectionReason);
      
      // Update the courses list
      setCourses(courses.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
      
      setSelectedCourse(null);
      setRejectionReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to reject course');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only administrators can access the course review page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Review</h1>
          <p className="text-gray-600">
            Review and approve courses submitted by instructors.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Pending Review ({courses.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {courses.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses pending review</p>
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-6 cursor-pointer hover:bg-gray-50 ${
                        selectedCourse?.id === course.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex items-start space-x-3">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {course.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                              {course.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted {formatDate(course.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Course Details & Actions */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <div className="space-y-6">
                {/* Course Preview */}
                <CoursePreview course={selectedCourse} />

                {/* Review Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Review Actions</h3>
                  
                  <div className="space-y-4">
                    {/* Review Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Add notes about the course review..."
                      />
                    </div>

                    {/* Rejection Reason */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (if rejecting)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Explain why the course is being rejected..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApproveCourse(selectedCourse.id)}
                        disabled={actionLoading === selectedCourse.id}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>
                          {actionLoading === selectedCourse.id ? 'Approving...' : 'Approve Course'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleRejectCourse(selectedCourse.id)}
                        disabled={actionLoading === selectedCourse.id || !rejectionReason.trim()}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        <span>
                          {actionLoading === selectedCourse.id ? 'Rejecting...' : 'Reject Course'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">
                  Choose a course from the list to review its content and make approval decisions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

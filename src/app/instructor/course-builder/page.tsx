'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseBuilder } from '@/components/course/CourseBuilder';
import { useUser } from '@/contexts/UserContext';
import { courseService } from '@/lib/courseService';
import {
  PlusIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function CourseBuilderPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNewCourse = async () => {
    if (!user) {
      setError('You must be logged in to create a course');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newCourse = await courseService.createCourseDraft({
        title: 'Untitled Course',
        description: 'Enter a description for your course',
        category: 'Business',
        subcategory: 'Entrepreneurship',
        difficulty: 'BEGINNER',
        language: 'English',
        prerequisites: [],
        learningOutcomes: [],
        price: 0,
        currency: 'USD',
        thumbnail: ''
      });

      // Redirect to the course builder with the new course ID
      router.push(`/instructor/course-builder/${newCourse.id}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create new course');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">You must be logged in to access the course builder.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only instructors can access the course builder.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/instructor/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Course Builder</h1>
          </div>
          <p className="text-gray-600">
            Create and manage your courses with our intuitive drag-and-drop builder.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Create New Course */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create a New Course</h3>
            <p className="text-gray-600 mb-6">
              Start building your course with our drag-and-drop interface. Add sections, lessons, and interactive content.
            </p>
            <button
              onClick={handleCreateNewCourse}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{loading ? 'Creating...' : 'Create New Course'}</span>
            </button>
          </div>
        </div>

        {/* Course Builder Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Drag & Drop Builder</h4>
            <p className="text-sm text-gray-600">
              Easily organize your course content with our intuitive drag-and-drop interface.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Video Integration</h4>
            <p className="text-sm text-gray-600">
              Upload videos that are automatically processed for optimal streaming quality.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-purple-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Review & Publish</h4>
            <p className="text-sm text-gray-600">
              Submit your course for review and publish it to reach students worldwide.
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Course Structure</h4>
                <p className="text-sm text-gray-600">
                  Add sections and lessons to organize your content logically.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Add Content</h4>
                <p className="text-sm text-gray-600">
                  Upload videos, add descriptions, and attach resources to each lesson.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Preview & Test</h4>
                <p className="text-sm text-gray-600">
                  Use the preview mode to see how your course will appear to students.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Submit for Review</h4>
                <p className="text-sm text-gray-600">
                  Submit your course for review by our team before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { CourseBuilder } from '@/components/course/CourseBuilder';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function CourseBuilderEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const courseId = params.courseId as string;

  const handleCourseUpdate = (course: any) => {
    console.log('Course updated:', course);
    // Handle course updates (e.g., show success message, update UI)
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
              onClick={() => router.push('/instructor/course-builder')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Course Builder</h1>
          </div>
          <p className="text-gray-600">
            Edit and manage your course content with our intuitive drag-and-drop builder.
          </p>
        </div>

        {/* Course Builder */}
        <CourseBuilder 
          courseId={courseId}
          onCourseUpdate={handleCourseUpdate}
        />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon, EyeIcon, PencilIcon, ShareIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function CourseCreationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const isPublished = searchParams.get('published') === 'true';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isPublished ? 'Course Published Successfully!' : 'Course Created Successfully!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isPublished 
              ? 'Your course is now live and available for students to enroll.'
              : 'Your course has been saved as a draft. You can publish it when you\'re ready.'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What's next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Review Your Course</h3>
                <p className="text-gray-600 mt-1">
                  Take a look at your course from a student's perspective to ensure everything looks perfect.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Add Course Content</h3>
                <p className="text-gray-600 mt-1">
                  Create lessons, upload videos, and add assignments to make your course comprehensive.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Promote Your Course</h3>
                <p className="text-gray-600 mt-1">
                  Share your course on social media and with your network to attract students.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Monitor Performance</h3>
                <p className="text-gray-600 mt-1">
                  Track student enrollment, completion rates, and feedback to improve your course.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              View Course
            </button>
            
            <button
              onClick={() => router.push(`/instructor/courses/${courseId}/edit`)}
              className="flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Course
            </button>
            
            <button
              onClick={() => router.push(`/instructor/courses/${courseId}/analytics`)}
              className="flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Analytics
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/courses/${courseId}`);
                alert('Course link copied to clipboard!');
              }}
              className="flex items-center justify-center px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Course
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/instructor/courses')}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back to My Courses
          </button>
          
          <button
            onClick={() => router.push('/instructor/courses/create')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Another Course
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center">
            <Image
              src={kalplaLogo}
              alt="Kalpla"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="ml-2 text-lg font-medium text-gray-600">Kalpla</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Empowering instructors to share knowledge
          </p>
        </div>
      </div>
    </div>
  );
}

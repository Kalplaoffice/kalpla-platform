'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon, EyeIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function SubmissionSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course Submitted for Approval!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your course has been successfully submitted for review. Our team will review it within 2-5 business days.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Review Process</h3>
                <p className="text-gray-600 mt-1">
                  Our admin team will thoroughly review your course content, structure, and quality.
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
                <h3 className="text-lg font-medium text-gray-900">Quality Assessment</h3>
                <p className="text-gray-600 mt-1">
                  We'll evaluate content quality, technical aspects, and educational value.
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
                <h3 className="text-lg font-medium text-gray-900">Decision & Feedback</h3>
                <p className="text-gray-600 mt-1">
                  You'll receive an email with the decision and any feedback or required changes.
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
                <h3 className="text-lg font-medium text-gray-900">Course Publication</h3>
                <p className="text-gray-600 mt-1">
                  If approved, your course will be published and available to students.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Review Timeline</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>Typical review time: 2-5 business days</span>
            </div>
            <div className="flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              <span>You'll receive detailed feedback via email</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              <span>Check your course status in the instructor dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}`)}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            View Course
          </button>
          
          <button
            onClick={() => router.push('/instructor/courses')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Courses
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

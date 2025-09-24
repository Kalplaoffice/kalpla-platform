'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon, EnvelopeIcon, PhoneIcon, AcademicCapIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function StudentOnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Kalpla!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your onboarding is complete! You're now ready to start your learning journey with us.
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
                <h3 className="text-lg font-medium text-gray-900">Explore Courses</h3>
                <p className="text-gray-600 mt-1">
                  Browse our extensive catalog of courses tailored to your interests and career goals. Start with recommended courses based on your profile.
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
                <h3 className="text-lg font-medium text-gray-900">Connect with Mentors</h3>
                <p className="text-gray-600 mt-1">
                  Get matched with experienced mentors who can guide you through your learning journey and help you achieve your goals.
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
                <h3 className="text-lg font-medium text-gray-900">Join Communities</h3>
                <p className="text-gray-600 mt-1">
                  Connect with fellow learners, participate in discussions, and build your professional network within our vibrant community.
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
                <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
                <p className="text-gray-600 mt-1">
                  Monitor your learning progress, earn certificates, and showcase your achievements on your profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <RocketLaunchIcon className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-medium text-purple-900">Quick Start Guide</h3>
          </div>
          <div className="space-y-2 text-purple-800">
            <p>• Complete your first course within 7 days</p>
            <p>• Set up your learning schedule</p>
            <p>• Join at least one community discussion</p>
            <p>• Connect with a mentor</p>
            <p>• Update your learning goals regularly</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Stay Engaged</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Receive personalized learning recommendations</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Get support from our student success team</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/courses')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Courses
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
            Your journey to success starts here
          </p>
        </div>
      </div>
    </div>
  );
}

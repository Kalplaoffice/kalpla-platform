'use client';

import { CheckCircleIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MentorOnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Application Submitted Successfully!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your interest in becoming a mentor with Kalpla
          </p>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div className="flex items-start">
              <ClockIcon className="h-6 w-6 text-blue-500 mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
                <div className="mt-2 text-sm text-gray-600 space-y-2">
                  <p>1. Our admin team will review your application and documents</p>
                  <p>2. We'll verify your credentials and background</p>
                  <p>3. You'll receive an email notification within 3-5 business days</p>
                  <p>4. Upon approval, you'll gain access to the Mentor Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <EnvelopeIcon className="h-6 w-6 text-blue-500 mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Stay Updated</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We'll send you email updates about your application status. 
                  Please check your spam folder if you don't receive our emails.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• Your application includes a legally binding declaration</p>
                <p>• All uploaded documents are securely stored and encrypted</p>
                <p>• You can track your application status in your profile</p>
                <p>• Contact support if you have any questions</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Home
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In to Track Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

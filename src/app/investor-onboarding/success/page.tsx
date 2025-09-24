'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon, EnvelopeIcon, PhoneIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function InvestorOnboardingSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Investor Application Submitted!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in investing through Kalpla. We've received your application and will review it carefully.
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
                <h3 className="text-lg font-medium text-gray-900">Application Review</h3>
                <p className="text-gray-600 mt-1">
                  Our investment team will review your application within 2-3 business days. We'll verify your credentials, investment history, and alignment with our platform.
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
                <h3 className="text-lg font-medium text-gray-900">Due Diligence</h3>
                <p className="text-gray-600 mt-1">
                  We'll conduct background checks, verify your investment capacity, and ensure compliance with regulatory requirements.
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
                <h3 className="text-lg font-medium text-gray-900">Platform Access</h3>
                <p className="text-gray-600 mt-1">
                  Upon approval, you'll receive access to our investor dashboard, startup profiles, pitch decks, and investment opportunities.
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
                <h3 className="text-lg font-medium text-gray-900">Start Investing</h3>
                <p className="text-gray-600 mt-1">
                  Begin exploring investment opportunities, connecting with startups, and building your portfolio through Kalpla's platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-green-900">Investment Benefits</h3>
          </div>
          <div className="space-y-2 text-green-800">
            <p>• Access to vetted startup opportunities</p>
            <p>• Comprehensive due diligence reports</p>
            <p>• Direct communication with founders</p>
            <p>• Portfolio tracking and analytics</p>
            <p>• Networking with other investors</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Stay Connected</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-800">We'll send you investment opportunities via email</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Contact our investment team for support</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => router.push('/investor')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Explore Investment Opportunities
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
            Connecting investors with innovative startups
          </p>
        </div>
      </div>
    </div>
  );
}

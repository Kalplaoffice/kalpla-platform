'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowLeftIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function CancellationPage() {
  const [cancellationType, setCancellationType] = useState<'course' | 'program' | 'subscription'>('course');

  const cancellationPolicies = [
    {
      type: 'course',
      title: 'Course Cancellation',
      description: 'Cancel your course enrollment',
      icon: DocumentTextIcon,
      color: 'blue',
      policy: 'Full refund within 7 days, partial refund within 30 days',
      details: [
        'Cancel within 7 days for full refund',
        'Partial refund within 30 days based on progress',
        'No refund after 30 days',
        'Certificates remain valid if course completed'
      ]
    },
    {
      type: 'program',
      title: 'Program Cancellation',
      description: 'Cancel your KSMP program enrollment',
      icon: CalendarIcon,
      color: 'purple',
      policy: 'Different terms apply for program cancellations',
      details: [
        'Full refund before program start',
        '50% refund within first week',
        '25% refund within first month',
        'No refund after program completion'
      ]
    },
    {
      type: 'subscription',
      title: 'Subscription Cancellation',
      description: 'Cancel your recurring subscription',
      icon: ClockIcon,
      color: 'green',
      policy: 'Cancel anytime, access until end of billing period',
      details: [
        'Cancel anytime from your account',
        'Access continues until end of billing period',
        'No additional charges after cancellation',
        'Can reactivate subscription anytime'
      ]
    }
  ];

  const cancellationSteps = [
    {
      step: 1,
      title: 'Access Cancellation',
      description: 'Go to your account settings or contact support',
      icon: InformationCircleIcon
    },
    {
      step: 2,
      title: 'Select Reason',
      description: 'Choose why you want to cancel (optional)',
      icon: DocumentTextIcon
    },
    {
      step: 3,
      title: 'Confirm Cancellation',
      description: 'Review terms and confirm your cancellation',
      icon: CheckCircleIcon
    },
    {
      step: 4,
      title: 'Receive Confirmation',
      description: 'Get confirmation email with refund details',
      icon: EnvelopeIcon
    }
  ];

  const refundTimeline = [
    {
      period: 'Immediate',
      description: 'Cancellation confirmation sent',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      period: '1-2 Business Days',
      description: 'Refund processing begins',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      period: '3-5 Business Days',
      description: 'Refund appears in your account',
      icon: CalendarIcon,
      color: 'purple'
    },
    {
      period: '7-10 Business Days',
      description: 'Full refund completion',
      icon: CheckCircleIcon,
      color: 'green'
    }
  ];

  const handleCancellationTypeChange = (type: 'course' | 'program' | 'subscription') => {
    setCancellationType(type);
  };

  const handleStartCancellation = () => {
    // TODO: Implement cancellation flow
    console.log('Starting cancellation for:', cancellationType);
    alert(`Starting ${cancellationType} cancellation process...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center">
              <XMarkIcon className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Cancellation Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Cancellation Policy
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              We understand that circumstances change. Our flexible cancellation policy 
              ensures you can modify or cancel your enrollment when needed.
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Types */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Would You Like to Cancel?
            </h3>
            <p className="text-xl text-gray-600">
              Select the type of cancellation you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cancellationPolicies.map((policy, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                  cancellationType === policy.type
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleCancellationTypeChange(policy.type as 'course' | 'program' | 'subscription')}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${policy.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                    <policy.icon className={`h-6 w-6 text-${policy.color}-600`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{policy.title}</h4>
                    <p className="text-gray-600">{policy.description}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 font-medium">{policy.policy}</p>
                <ul className="space-y-2">
                  {policy.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Policy Details */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {cancellationPolicies.find(p => p.type === cancellationType)?.title} Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Terms</h4>
                <ul className="space-y-3">
                  {cancellationPolicies.find(p => p.type === cancellationType)?.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Cancellation is effective immediately</span>
                  </div>
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Refunds processed within 5-7 business days</span>
                  </div>
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Confirmation email sent upon cancellation</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleStartCancellation}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Start Cancellation Process
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How to Cancel
            </h3>
            <p className="text-xl text-gray-600">
              Simple 4-step cancellation process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {cancellationSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refund Timeline */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Refund Timeline
            </h3>
            <p className="text-xl text-gray-600">
              What to expect after cancellation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {refundTimeline.map((timeline, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-${timeline.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <timeline.icon className={`h-8 w-8 text-${timeline.color}-600`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{timeline.period}</h4>
                <p className="text-gray-600 text-sm">{timeline.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Before You Cancel
            </h3>
            <p className="text-xl text-gray-600">
              Consider these alternatives to cancellation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Pause Subscription</h4>
              <p className="text-gray-600 mb-4">Temporarily pause your subscription instead of canceling</p>
              <button className="text-blue-600 font-medium hover:text-blue-700">Learn More</button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Switch Plans</h4>
              <p className="text-gray-600 mb-4">Change to a different plan that better fits your needs</p>
              <button className="text-blue-600 font-medium hover:text-blue-700">Learn More</button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <InformationCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Support</h4>
              <p className="text-gray-600 mb-4">Contact our support team for personalized assistance</p>
              <button className="text-blue-600 font-medium hover:text-blue-700">Contact Us</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-16 bg-red-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Need Help with Cancellation?
          </h3>
          <p className="text-xl text-red-100 mb-8">
            Our support team is here to help you with any cancellation questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Contact Support
            </Link>
            <a
              href="tel:+918660200835"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

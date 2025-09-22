'use client';

import Link from 'next/link';
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function RefundPage() {
  const refundPolicies = [
    {
      title: 'Course Refunds',
      description: 'Full refund within 7 days if less than 20% content accessed',
      icon: DocumentTextIcon,
      details: [
        '7-day full refund policy',
        'Partial refunds within 30 days based on content consumption',
        'No refunds after 30 days',
        'Refunds processed within 5-7 business days'
      ]
    },
    {
      title: 'Program Refunds',
      description: 'KSMP program has different refund terms',
      icon: ClockIcon,
      details: [
        'Full refund before program start',
        '50% refund within first week',
        '25% refund within first month',
        'No refunds after program completion'
      ]
    },
    {
      title: 'Payment Issues',
      description: 'Technical payment problems are handled separately',
      icon: ExclamationTriangleIcon,
      details: [
        'Double charges refunded immediately',
        'Failed payments investigated within 24 hours',
        'Bank processing errors resolved within 3-5 days',
        'Contact support for payment disputes'
      ]
    }
  ];

  const refundSteps = [
    {
      step: 1,
      title: 'Submit Request',
      description: 'Fill out the refund request form with your details',
      icon: DocumentTextIcon
    },
    {
      step: 2,
      title: 'Review Process',
      description: 'Our team reviews your request within 24-48 hours',
      icon: CheckCircleIcon
    },
    {
      step: 3,
      title: 'Approval',
      description: 'You receive confirmation of refund approval',
      icon: InformationCircleIcon
    },
    {
      step: 4,
      title: 'Processing',
      description: 'Refund is processed and credited to your account',
      icon: CurrencyDollarIcon
    }
  ];

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
              <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Refund Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Refund Policy
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              We want you to be completely satisfied with your learning experience. 
              Our flexible refund policy ensures you can try our courses risk-free.
            </p>
          </div>
        </div>
      </div>

      {/* Refund Policies */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Refund Policies by Category
            </h3>
            <p className="text-xl text-gray-600">
              Different types of purchases have different refund terms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {refundPolicies.map((policy, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <policy.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{policy.title}</h4>
                </div>
                <p className="text-gray-600 mb-4">{policy.description}</p>
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

      {/* Refund Process */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How to Request a Refund
            </h3>
            <p className="text-xl text-gray-600">
              Simple 4-step process to get your refund
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {refundSteps.map((step, index) => (
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

      {/* Important Notes */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Important Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Course enrollment fees
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Program registration fees
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Subscription charges
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Payment processing fees
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Not Included</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    Third-party service fees
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    Bank transfer charges
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    Currency conversion fees
                  </li>
                  <li className="flex items-center text-gray-700">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    Completed certifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Need Help with Your Refund?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you with any refund questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Contact Support
            </Link>
            <a
              href="tel:+918660200835"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
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

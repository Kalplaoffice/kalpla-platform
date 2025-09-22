'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'methods' | 'security' | 'billing'>('methods');

  const paymentMethods = [
    {
      name: 'Credit/Debit Cards',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, American Express',
      features: ['Instant processing', 'Secure encryption', 'Wide acceptance'],
      color: 'blue'
    },
    {
      name: 'UPI',
      icon: CurrencyDollarIcon,
      description: 'Google Pay, PhonePe, Paytm',
      features: ['Quick payments', 'No fees', 'Mobile friendly'],
      color: 'green'
    },
    {
      name: 'Net Banking',
      icon: ShieldCheckIcon,
      description: 'Direct bank transfers',
      features: ['Bank security', 'Direct transfer', 'Low fees'],
      color: 'purple'
    },
    {
      name: 'Digital Wallets',
      icon: LockClosedIcon,
      description: 'PayPal, Razorpay, Stripe',
      features: ['Fast checkout', 'Secure storage', 'Easy management'],
      color: 'orange'
    }
  ];

  const securityFeatures = [
    {
      title: 'SSL Encryption',
      description: 'All payment data is encrypted using industry-standard SSL',
      icon: ShieldCheckIcon
    },
    {
      title: 'PCI Compliance',
      description: 'We are PCI DSS compliant for secure card processing',
      icon: CheckCircleIcon
    },
    {
      title: 'Fraud Protection',
      description: 'Advanced fraud detection and prevention systems',
      icon: ExclamationTriangleIcon
    },
    {
      title: 'Secure Storage',
      description: 'Payment information is securely stored and encrypted',
      icon: LockClosedIcon
    }
  ];

  const billingInfo = [
    {
      title: 'Payment History',
      description: 'View all your past transactions and receipts',
      icon: ClockIcon
    },
    {
      title: 'Billing Address',
      description: 'Manage your billing information and addresses',
      icon: InformationCircleIcon
    },
    {
      title: 'Tax Invoices',
      description: 'Download GST-compliant invoices for all purchases',
      icon: DocumentTextIcon
    },
    {
      title: 'Payment Methods',
      description: 'Add, remove, or update your payment methods',
      icon: CreditCardIcon
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
              <CreditCardIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Secure Payment Solutions
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Choose from multiple secure payment methods. Your financial information is protected 
              with industry-leading security measures.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'methods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'billing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Billing Info
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Accepted Payment Methods
              </h3>
              <p className="text-xl text-gray-600">
                Choose the payment method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-${method.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                      <method.icon className={`h-6 w-6 text-${method.color}-600`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{method.name}</h4>
                      <p className="text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {method.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Security
              </h3>
              <p className="text-xl text-gray-600">
                Your financial information is protected with the highest security standards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Security Certifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900">PCI DSS</h5>
                  <p className="text-sm text-gray-600">Payment Card Industry</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <LockClosedIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900">SSL/TLS</h5>
                  <p className="text-sm text-gray-600">256-bit Encryption</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900">ISO 27001</h5>
                  <p className="text-sm text-gray-600">Information Security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Info Tab */}
      {activeTab === 'billing' && (
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Billing Information
              </h3>
              <p className="text-xl text-gray-600">
                Manage your billing details and payment history
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {billingInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <info.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{info.title}</h4>
                      <p className="text-gray-600">{info.description}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Support */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Need Help with Payments?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you with any payment questions
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

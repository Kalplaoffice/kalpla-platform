'use client';

import Link from 'next/link';
import { 
  AcademicCapIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function TermsPage() {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Kalpla</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <DocumentTextIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
              <p className="text-lg text-gray-600">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <a href="#acceptance" className="text-blue-600 hover:text-blue-700 text-sm">1. Acceptance of Terms</a>
                <a href="#description" className="text-blue-600 hover:text-blue-700 text-sm">2. Service Description</a>
                <a href="#accounts" className="text-blue-600 hover:text-blue-700 text-sm">3. User Accounts</a>
                <a href="#conduct" className="text-blue-600 hover:text-blue-700 text-sm">4. User Conduct</a>
                <a href="#content" className="text-blue-600 hover:text-blue-700 text-sm">5. Content and Intellectual Property</a>
                <a href="#payments" className="text-blue-600 hover:text-blue-700 text-sm">6. Payments and Refunds</a>
                <a href="#privacy" className="text-blue-600 hover:text-blue-700 text-sm">7. Privacy Policy</a>
                <a href="#termination" className="text-blue-600 hover:text-blue-700 text-sm">8. Termination</a>
                <a href="#disclaimers" className="text-blue-600 hover:text-blue-700 text-sm">9. Disclaimers</a>
                <a href="#limitation" className="text-blue-600 hover:text-blue-700 text-sm">10. Limitation of Liability</a>
                <a href="#governing" className="text-blue-600 hover:text-blue-700 text-sm">11. Governing Law</a>
                <a href="#changes" className="text-blue-600 hover:text-blue-700 text-sm">12. Changes to Terms</a>
              </div>
            </div>

            {/* Terms Content */}
            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section id="acceptance" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Kalpla platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700">
                  These Terms of Service ("Terms") govern your use of our website, mobile applications, and related services (collectively, the "Service") operated by Kalpla ("us", "we", or "our").
                </p>
              </section>

              {/* Section 2 */}
              <section id="description" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                  2. Service Description
                </h2>
                <p className="text-gray-700 mb-4">
                  Kalpla is an educational technology platform that provides:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Online courses and educational content</li>
                  <li>Kalpla Startup Mentorship Program (KSMP)</li>
                  <li>Mentor-student matching and guidance</li>
                  <li>Assignment submission and grading systems</li>
                  <li>Live class sessions and recorded content</li>
                  <li>Payment processing for course enrollments</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to modify, suspend, or discontinue any part of our Service at any time with or without notice.
                </p>
              </section>

              {/* Section 3 */}
              <section id="accounts" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                  3. User Accounts
                </h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of our Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
                <p className="text-gray-700">
                  You must be at least 13 years old to create an account. Users under 18 must have parental consent.
                </p>
              </section>

              {/* Section 4 */}
              <section id="conduct" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  4. User Conduct
                </h2>
                <p className="text-gray-700 mb-4">
                  You agree not to use our Service to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Share inappropriate or offensive content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to access our Service</li>
                  <li>Share account credentials with others</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </section>

              {/* Section 5 */}
              <section id="content" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                  5. Content and Intellectual Property
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>Our Content:</strong> All content on our platform, including courses, materials, and software, is owned by Kalpla or our licensors and is protected by copyright and other intellectual property laws.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Your Content:</strong> You retain ownership of content you submit, but grant us a license to use, modify, and distribute it in connection with our Service.
                </p>
                <p className="text-gray-700">
                  <strong>License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our Service for personal, non-commercial purposes.
                </p>
              </section>

              {/* Section 6 */}
              <section id="payments" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600 mr-3" />
                  6. Payments and Refunds
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>Payment Terms:</strong> Course fees are due at the time of enrollment. We accept payments through our integrated payment gateway (PayU).
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Refund Policy:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Full refund within 7 days of enrollment if no content accessed</li>
                  <li>Partial refund within 30 days based on content consumption</li>
                  <li>No refunds after 30 days or significant content consumption</li>
                  <li>Refunds processed within 5-10 business days</li>
                </ul>
                <p className="text-gray-700">
                  <strong>Price Changes:</strong> We reserve the right to change course prices at any time. Existing enrollments are not affected.
                </p>
              </section>

              {/* Section 7 */}
              <section id="privacy" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                  7. Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
                </p>
                <p className="text-gray-700">
                  By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy. Please review our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>{' '}
                  for more details.
                </p>
              </section>

              {/* Section 8 */}
              <section id="termination" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Termination
                </h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will cease immediately. You may terminate your account at any time by contacting our support team.
                </p>
              </section>

              {/* Section 9 */}
              <section id="disclaimers" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Disclaimers
                </h2>
                <p className="text-gray-700 mb-4">
                  The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, conditions and terms relating to our Service.
                </p>
                <p className="text-gray-700">
                  We do not guarantee that our Service will be uninterrupted, secure, or error-free, or that any defects will be corrected.
                </p>
              </section>

              {/* Section 10 */}
              <section id="limitation" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="text-gray-700 mb-4">
                  In no event shall Kalpla, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-700">
                  Our total liability to you for all claims arising from or relating to these Terms or the Service shall not exceed the amount you paid us for the Service in the 12 months preceding the claim.
                </p>
              </section>

              {/* Section 11 */}
              <section id="governing" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Governing Law
                </h2>
                <p className="text-gray-700">
                  These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
                </p>
              </section>

              {/* Section 12 */}
              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  12. Changes to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-700">
                  Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the new Terms, please stop using the Service.
                </p>
              </section>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@kalpla.com<br />
                  <strong>Phone:</strong> +91 9876543210<br />
                  <strong>Address:</strong> Kalpla Technologies Pvt Ltd, Bangalore, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

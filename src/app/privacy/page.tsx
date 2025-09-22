'use client';

import Link from 'next/link';
import { 
  AcademicCapIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CogIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function PrivacyPage() {
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
              <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-lg text-gray-600">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-gray-700 mb-4">
                At Kalpla, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform.
              </p>
              <p className="text-gray-700">
                By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <a href="#information" className="text-blue-600 hover:text-blue-700 text-sm">1. Information We Collect</a>
                <a href="#usage" className="text-blue-600 hover:text-blue-700 text-sm">2. How We Use Your Information</a>
                <a href="#sharing" className="text-blue-600 hover:text-blue-700 text-sm">3. Information Sharing</a>
                <a href="#security" className="text-blue-600 hover:text-blue-700 text-sm">4. Data Security</a>
                <a href="#retention" className="text-blue-600 hover:text-blue-700 text-sm">5. Data Retention</a>
                <a href="#rights" className="text-blue-600 hover:text-blue-700 text-sm">6. Your Rights</a>
                <a href="#cookies" className="text-blue-600 hover:text-blue-700 text-sm">7. Cookies and Tracking</a>
                <a href="#third-party" className="text-blue-600 hover:text-blue-700 text-sm">8. Third-Party Services</a>
                <a href="#children" className="text-blue-600 hover:text-blue-700 text-sm">9. Children's Privacy</a>
                <a href="#international" className="text-blue-600 hover:text-blue-700 text-sm">10. International Transfers</a>
                <a href="#changes" className="text-blue-600 hover:text-blue-700 text-sm">11. Changes to Privacy Policy</a>
                <a href="#contact" className="text-blue-600 hover:text-blue-700 text-sm">12. Contact Us</a>
              </div>
            </div>

            {/* Privacy Content */}
            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section id="information" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                  1. Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                  <li><strong>Profile Information:</strong> Profile picture, bio, educational background</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by PayU)</li>
                  <li><strong>Educational Data:</strong> Course enrollments, assignments, grades, progress</li>
                  <li><strong>Communication:</strong> Messages, feedback, support requests</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
                <p className="text-gray-700 mb-4">
                  We automatically collect certain information about your use of our Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                  <li><strong>Learning Analytics:</strong> Course progress, video watch time, quiz scores</li>
                  <li><strong>Location Data:</strong> General geographic location (country/region)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Similar Technologies</h3>
                <p className="text-gray-700">
                  We use cookies, web beacons, and similar technologies to enhance your experience and analyze usage patterns. See our Cookies section for more details.
                </p>
              </section>

              {/* Section 2 */}
              <section id="usage" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CogIcon className="h-6 w-6 text-blue-600 mr-3" />
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Service Delivery:</strong> Provide educational content, track progress, facilitate learning</li>
                  <li><strong>Account Management:</strong> Create and maintain your account, authenticate users</li>
                  <li><strong>Communication:</strong> Send course updates, announcements, and support responses</li>
                  <li><strong>Payment Processing:</strong> Process payments and manage subscriptions</li>
                  <li><strong>Personalization:</strong> Customize content and recommendations</li>
                  <li><strong>Analytics:</strong> Improve our Service and develop new features</li>
                  <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                </ul>
                <p className="text-gray-700">
                  We process your information based on legitimate interests, contractual necessity, and your consent where required.
                </p>
              </section>

              {/* Section 3 */}
              <section id="sharing" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600 mr-3" />
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third parties who help us operate our Service (payment processors, cloud storage, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                  <li><strong>Educational Partners:</strong> With mentors and instructors (limited to necessary information)</li>
                </ul>
                <p className="text-gray-700">
                  All third parties are required to maintain the confidentiality of your information and use it only for the purposes we specify.
                </p>
              </section>

              {/* Section 4 */}
              <section id="security" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <LockClosedIcon className="h-6 w-6 text-blue-600 mr-3" />
                  4. Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Encryption:</strong> Data encrypted in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Limited access to authorized personnel only</li>
                  <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                  <li><strong>Secure Infrastructure:</strong> AWS cloud services with enterprise-grade security</li>
                  <li><strong>Authentication:</strong> Multi-factor authentication for admin access</li>
                </ul>
                <p className="text-gray-700">
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              {/* Section 5 */}
              <section id="retention" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Data Retention
                </h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Account Data:</strong> Until you delete your account or request deletion</li>
                  <li><strong>Educational Records:</strong> 7 years for academic and certification purposes</li>
                  <li><strong>Payment Records:</strong> 7 years for accounting and tax purposes</li>
                  <li><strong>Support Communications:</strong> 3 years for service improvement</li>
                  <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained longer</li>
                </ul>
                <p className="text-gray-700">
                  We will delete or anonymize your personal information when it is no longer needed, unless we are required to retain it for legal or regulatory purposes.
                </p>
              </section>

              {/* Section 6 */}
              <section id="rights" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <EyeIcon className="h-6 w-6 text-blue-600 mr-3" />
                  6. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us at support@kalpla.in. We will respond to your request within 30 days.
                </p>
              </section>

              {/* Section 7 */}
              <section id="cookies" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality and security</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how you use our Service</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling certain cookies may affect Service functionality.
                </p>
              </section>

              {/* Section 8 */}
              <section id="third-party" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Third-Party Services
                </h2>
                <p className="text-gray-700 mb-4">
                  Our Service integrates with third-party services that may collect information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Payment Processing:</strong> PayU for payment processing</li>
                  <li><strong>Cloud Services:</strong> AWS for hosting and storage</li>
                  <li><strong>Analytics:</strong> Google Analytics for usage analytics</li>
                  <li><strong>Authentication:</strong> AWS Cognito for user authentication</li>
                  <li><strong>Communication:</strong> Email service providers for notifications</li>
                </ul>
                <p className="text-gray-700">
                  These third parties have their own privacy policies. We encourage you to review them.
                </p>
              </section>

              {/* Section 9 */}
              <section id="children" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  9. Children's Privacy
                </h2>
                <p className="text-gray-700 mb-4">
                  Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                </p>
                <p className="text-gray-700 mb-4">
                  For users between 13-18, we require parental consent for account creation and data processing.
                </p>
                <p className="text-gray-700">
                  If we discover that we have collected information from a child under 13, we will delete it immediately. If you believe we have collected information from a child, please contact us.
                </p>
              </section>

              {/* Section 10 */}
              <section id="international" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. International Data Transfers
                </h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Adequacy Decisions:</strong> Transfer to countries with adequate data protection</li>
                  <li><strong>Standard Contractual Clauses:</strong> EU-approved contractual safeguards</li>
                  <li><strong>Certification Schemes:</strong> Privacy Shield or equivalent frameworks</li>
                  <li><strong>Consent:</strong> Your explicit consent for transfers</li>
                </ul>
                <p className="text-gray-700">
                  We maintain the same level of protection for your information regardless of where it is processed.
                </p>
              </section>

              {/* Section 11 */}
              <section id="changes" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices on our Service</li>
                </ul>
                <p className="text-gray-700">
                  Your continued use of our Service after changes become effective constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">General Privacy Inquiries</h3>
                      <p className="text-gray-700">
                        <strong>Email:</strong> support@kalpla.in<br />
                        <strong>Phone:</strong> +91 8660200835
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h3>
                      <p className="text-gray-700">
                        <strong>Email:</strong> support@kalpla.in<br />
                        <strong>Address:</strong> Kalpla<br />
                        Udupi, Karnataka, India
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                This Privacy Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

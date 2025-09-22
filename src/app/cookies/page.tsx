'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowLeftIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const cookieTypes = [
    {
      name: 'Necessary Cookies',
      description: 'Essential for the website to function properly',
      icon: ShieldCheckIcon,
      color: 'green',
      examples: ['Authentication', 'Security', 'Basic functionality'],
      required: true
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website',
      icon: InformationCircleIcon,
      color: 'blue',
      examples: ['Page views', 'User behavior', 'Performance metrics'],
      required: false
    },
    {
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaigns',
      icon: CircleStackIcon,
      color: 'purple',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration'],
      required: false
    },
    {
      name: 'Preference Cookies',
      description: 'Remember your settings and preferences for a better experience',
      icon: CogIcon,
      color: 'orange',
      examples: ['Language settings', 'Theme preferences', 'Customization'],
      required: false
    }
  ];

  const cookieDetails = [
    {
      name: '_ga',
      purpose: 'Google Analytics - Distinguishes unique users',
      duration: '2 years',
      type: 'Analytics'
    },
    {
      name: '_gid',
      purpose: 'Google Analytics - Distinguishes unique users',
      duration: '24 hours',
      type: 'Analytics'
    },
    {
      name: 'session_id',
      purpose: 'Maintains user session state',
      duration: 'Session',
      type: 'Necessary'
    },
    {
      name: 'user_preferences',
      purpose: 'Stores user interface preferences',
      duration: '1 year',
      type: 'Preferences'
    },
    {
      name: 'marketing_campaign',
      purpose: 'Tracks marketing campaign effectiveness',
      duration: '30 days',
      type: 'Marketing'
    }
  ];

  const handleCookieToggle = (type: keyof typeof cookiePreferences) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    // TODO: Implement cookie preference saving
    console.log('Saving cookie preferences:', cookiePreferences);
    alert('Cookie preferences saved successfully!');
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
              <CircleStackIcon className="h-8 w-8 text-orange-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Cookie Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Cookie Policy
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
              Learn more about how we use cookies and manage your preferences.
            </p>
          </div>
        </div>
      </div>

      {/* What Are Cookies */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              What Are Cookies?
            </h3>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our site.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Small Files</h4>
                  <p className="text-sm text-gray-600">Tiny text files stored on your device</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CogIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Remember Settings</h4>
                  <p className="text-sm text-gray-600">Store your preferences and settings</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure & Safe</h4>
                  <p className="text-sm text-gray-600">Protected and encrypted data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Types */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Cookies We Use
            </h3>
            <p className="text-xl text-gray-600">
              We use different types of cookies for various purposes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                    <type.icon className={`h-6 w-6 text-${type.color}-600`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{type.name}</h4>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {type.examples.map((example, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      {example}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${type.required ? 'text-green-600' : 'text-gray-600'}`}>
                    {type.required ? 'Required' : 'Optional'}
                  </span>
                  {!type.required && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cookiePreferences[type.name.toLowerCase().replace(' ', '') as keyof typeof cookiePreferences]}
                        onChange={() => handleCookieToggle(type.name.toLowerCase().replace(' ', '') as keyof typeof cookiePreferences)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cookiePreferences[type.name.toLowerCase().replace(' ', '') as keyof typeof cookiePreferences] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cookiePreferences[type.name.toLowerCase().replace(' ', '') as keyof typeof cookiePreferences] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cookie Details Table */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Specific Cookies We Use
            </h3>
            <p className="text-xl text-gray-600">
              Detailed information about the cookies on our website
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cookie Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cookieDetails.map((cookie, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cookie.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {cookie.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cookie.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cookie.type === 'Necessary' ? 'bg-green-100 text-green-800' :
                        cookie.type === 'Analytics' ? 'bg-blue-100 text-blue-800' :
                        cookie.type === 'Marketing' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {cookie.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cookie Management */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Your Cookie Preferences
            </h3>
            <p className="text-gray-700 mb-6">
              You can control which cookies you accept. Please note that disabling certain cookies 
              may affect the functionality of our website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSavePreferences}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => {
                  setCookiePreferences({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true
                  });
                }}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => {
                  setCookiePreferences({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    preferences: false
                  });
                }}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Settings */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Manage Cookies in Your Browser
            </h3>
            <p className="text-xl text-gray-600">
              You can also control cookies through your browser settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
              <p className="text-sm text-gray-600 mb-4">Settings → Privacy → Cookies</p>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-700">Learn More</a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
              <p className="text-sm text-gray-600 mb-4">Options → Privacy → Cookies</p>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-700">Learn More</a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
              <p className="text-sm text-gray-600 mb-4">Preferences → Privacy → Cookies</p>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-700">Learn More</a>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
              <p className="text-sm text-gray-600 mb-4">Settings → Cookies → Manage</p>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-700">Learn More</a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Questions About Cookies?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Contact us if you have any questions about our cookie policy
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

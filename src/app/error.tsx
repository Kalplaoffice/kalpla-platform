'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowPathIcon,
  BugAntIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  const handleReportError = () => {
    // In a real application, you would send this to your error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('Error Report:', errorReport);
    
    // You could send this to a service like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error);
    
    alert('Error has been reported to our development team. Thank you for your patience.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          </div>
          
          {/* Error Icon */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Error</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-medium text-red-800 mb-2">Error Details (Development)</h3>
            <p className="text-sm text-red-700 mb-2">
              <strong>Message:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-sm text-red-700 mb-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
            {error.stack && (
              <details className="text-sm text-red-700">
                <summary className="cursor-pointer font-medium">Stack Trace</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-red-100 p-2 rounded border">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            What can you do?
          </h3>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group"
            >
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Refresh the Page
                </p>
                <p className="text-sm text-gray-500">
                  Try reloading the page to see if the issue resolves
                </p>
              </div>
            </button>

            <button
              onClick={handleReportError}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group"
            >
              <div className="flex-shrink-0">
                <BugAntIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Report This Error
                </p>
                <p className="text-sm text-gray-500">
                  Help us improve by reporting this issue
                </p>
              </div>
            </button>

            <Link
              href="/support"
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group"
            >
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Contact Support
                </p>
                <p className="text-sm text-gray-500">
                  Get help from our support team
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            If this problem persists, please{' '}
            <Link
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              contact our support team
            </Link>
            {' '}with the error details above.
          </p>
        </div>

        {/* Error ID for Support */}
        {error.digest && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Error ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{error.digest}</code>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Please include this ID when contacting support
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

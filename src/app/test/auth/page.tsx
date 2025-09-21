'use client';

import { useState } from 'react';
import { authTestUtils, TestResult } from '@/lib/authTestUtils';
import { PlayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AuthTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await authTestUtils.runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const cleanup = async () => {
    await authTestUtils.cleanup();
  };

  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;
  const successRate = results.length > 0 ? ((passedTests / results.length) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Authentication System Tests
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Comprehensive testing suite for Kalpla authentication features
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Test Controls</h2>
              <p className="text-sm text-gray-600">
                Run comprehensive authentication tests to verify system functionality
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={cleanup}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cleanup
              </button>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Test Results</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Passed</p>
                    <p className="text-2xl font-bold text-green-900">{passedTests}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{failedTests}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">%</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Success Rate</p>
                    <p className="text-2xl font-bold text-blue-900">{successRate}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">Total Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            {showDetails && (
              <div className="space-y-3">
                <h3 className="text-md font-medium text-gray-900">Test Details</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.passed
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {result.passed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">{result.testName}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.duration}ms
                      </div>
                    </div>
                    {result.error && (
                      <div className="mt-2 text-sm text-red-600">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Authentication Flows</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Email sign up and sign in</li>
                <li>• Phone number sign up and sign in</li>
                <li>• Google OAuth integration</li>
                <li>• Password reset flow</li>
                <li>• Account confirmation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Security & Management</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Role-based access control</li>
                <li>• Group assignment and management</li>
                <li>• Admin approval workflows</li>
                <li>• Session management</li>
                <li>• Security validation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Testing Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These tests will create and modify user accounts in your Cognito User Pool. 
                  Make sure you're running against a development environment. 
                  The cleanup function will attempt to sign out any authenticated users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

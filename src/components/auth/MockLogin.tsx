'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MockAuthService, mockUsers } from '@/lib/mockAuthService';
import { getDashboardPath } from '@/lib/authUtils';
import { 
  UserIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MockLoginProps {
  onLogin?: (user: any) => void;
  className?: string;
}

export function MockLogin({ onLogin, className = '' }: MockLoginProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleQuickLogin = async (userKey: string) => {
    const user = mockUsers[userKey as keyof typeof mockUsers];
    if (user) {
      setSelectedUser(user.username);
      setPassword(user.password);
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!selectedUser || !password) {
      setError('Please select a user and enter password');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await MockAuthService.signIn(selectedUser, password);
      
      if (result.isSignedIn) {
        setSuccess('Login successful! Redirecting...');
        
        // Get the logged-in user
        const user = await MockAuthService.getCurrentUser();
        
        // Call the onLogin callback if provided
        if (onLogin) {
          onLogin(user);
        }

        // Redirect immediately based on role
        const dashboardPath = getDashboardPath(user);
        router.push(dashboardPath);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await MockAuthService.signOut();
    setSelectedUser('');
    setPassword('');
    setSuccess('');
    setError('');
    router.push('/');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Mock Login for Testing
        </h2>
        <p className="text-gray-600">
          Use these predefined accounts to test role-based access
        </p>
      </div>

      {/* Quick Login Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Login:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(mockUsers).map(([key, user]) => (
            <button
              key={key}
              onClick={() => handleQuickLogin(key)}
              disabled={isLoading}
              className="flex items-center justify-between p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div>
                <div className="font-medium text-sm text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Manual Login Form */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Manual Login:</h3>
        
        <div className="space-y-4">
          {/* Username Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Choose a user...</option>
              {Object.entries(mockUsers).map(([key, user]) => (
                <option key={key} value={user.username}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !selectedUser || !password}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* User Info */}
      {MockAuthService.isUserAuthenticated() && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Current User:</h4>
          <div className="text-sm text-gray-600">
            <div><strong>Name:</strong> {MockAuthService.getCurrentUser()?.name}</div>
            <div><strong>Role:</strong> {MockAuthService.getUserRole()}</div>
            <div><strong>Email:</strong> {MockAuthService.getCurrentUser()?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* Test Credentials */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Test Credentials:</h4>
        <div className="text-sm text-blue-800 space-y-1">
          {Object.entries(mockUsers).map(([key, user]) => (
            <div key={key}>
              <strong>{user.role}:</strong> {user.username} / {user.password}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MockLogin;

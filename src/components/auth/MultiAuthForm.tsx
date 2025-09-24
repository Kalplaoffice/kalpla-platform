'use client';

import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  UserIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { multiAuthService, AuthUser, SignUpData, SignInData } from '@/lib/multiAuthService';

interface MultiAuthFormProps {
  onAuthSuccess: (user: AuthUser) => void;
  onClose?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'confirm-signup';
type LoginMethod = 'email' | 'phone' | 'google';

export default function MultiAuthForm({ onAuthSuccess, onClose }: MultiAuthFormProps) {
  // State management
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    confirmationCode: '',
    newPassword: ''
  });

  // Reset form when mode changes
  useEffect(() => {
    setFormData({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
      confirmationCode: '',
      newPassword: ''
    });
    setError(null);
    setSuccess(null);
  }, [authMode, loginMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleLoginMethodChange = (method: LoginMethod) => {
    setLoginMethod(method);
    setError(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (loginMethod === 'email' && !multiAuthService.isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (loginMethod === 'phone' && !multiAuthService.isValidPhone(formData.phone)) {
        throw new Error('Please enter a valid phone number (e.g., +1234567890)');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const signUpData: SignUpData = {
        password: formData.password,
        name: formData.name,
        loginMethod
      };

      if (loginMethod === 'email') {
        signUpData.email = formData.email;
      } else {
        signUpData.phone = multiAuthService.formatPhoneNumber(formData.phone);
      }

      const result = await multiAuthService.signUp(signUpData);

      if (result.success) {
        if (result.requiresConfirmation) {
          setAuthMode('confirm-signup');
          setSuccess('Account created! Please check your email/phone for a confirmation code.');
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          setAuthMode('signin');
        }
      } else {
        setError(result.error?.message || 'Sign up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (loginMethod === 'email' && !multiAuthService.isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (loginMethod === 'phone' && !multiAuthService.isValidPhone(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const signInData: SignInData = {
        password: formData.password,
        loginMethod
      };

      if (loginMethod === 'email') {
        signInData.email = formData.email;
      } else {
        signInData.phone = multiAuthService.formatPhoneNumber(formData.phone);
      }

      const result = await multiAuthService.signIn(signInData);

      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        setError(result.error?.message || 'Sign in failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await multiAuthService.signInWithGoogle();
      if (result.success) {
        // Handle successful Google sign in
      } else {
        setError(result.error?.message || 'Google sign in failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const username = loginMethod === 'email' ? formData.email : formData.phone;
      const result = await multiAuthService.confirmSignUp(username, formData.confirmationCode);

      if (result.success) {
        setSuccess('Account confirmed successfully! You can now sign in.');
        setAuthMode('signin');
      } else {
        setError(result.error?.message || 'Confirmation failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const username = loginMethod === 'email' ? formData.email : formData.phone;
      const result = await multiAuthService.resetPassword(username);

      if (result.success) {
        setSuccess('Password reset code sent! Please check your email/phone.');
        setAuthMode('forgot-password');
      } else {
        setError(result.error?.message || 'Password reset failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const username = loginMethod === 'email' ? formData.email : formData.phone;
      const result = await multiAuthService.confirmResetPassword(
        username,
        formData.confirmationCode,
        formData.newPassword
      );

      if (result.success) {
        setSuccess('Password reset successfully! You can now sign in.');
        setAuthMode('signin');
      } else {
        setError(result.error?.message || 'Password reset failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginMethodSelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">Choose your login method</label>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleLoginMethodChange('email')}
          className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
            loginMethod === 'email'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          Email
        </button>
        <button
          type="button"
          onClick={() => handleLoginMethodChange('phone')}
          className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
            loginMethod === 'phone'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <PhoneIcon className="h-5 w-5 mr-2" />
          Phone
        </button>
        <button
          type="button"
          onClick={() => handleLoginMethodChange('google')}
          className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
            loginMethod === 'google'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (authMode) {
      case 'signin':
        return (
          <form onSubmit={handleSignIn} className="space-y-4">
            {renderLoginMethodSelector()}
            
            {loginMethod === 'google' ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    {loginMethod === 'email' ? (
                      <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    ) : (
                      <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    )}
                    <input
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      name={loginMethod === 'email' ? 'email' : 'phone'}
                      value={loginMethod === 'email' ? formData.email : formData.phone}
                      onChange={handleInputChange}
                      placeholder={loginMethod === 'email' ? 'Enter your email' : '+1234567890'}
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </>
            )}
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            {renderLoginMethodSelector()}
            
            {loginMethod !== 'google' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    {loginMethod === 'email' ? (
                      <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    ) : (
                      <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    )}
                    <input
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      name={loginMethod === 'email' ? 'email' : 'phone'}
                      value={loginMethod === 'email' ? formData.email : formData.phone}
                      onChange={handleInputChange}
                      placeholder={loginMethod === 'email' ? 'Enter your email' : '+1234567890'}
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                      className="pl-10 pr-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </>
            )}
          </form>
        );

      case 'confirm-signup':
        return (
          <form onSubmit={handleConfirmSignUp} className="space-y-4">
            <div className="text-center mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900">Confirm Your Account</h3>
              <p className="text-sm text-gray-600 mt-1">
                We sent a confirmation code to your {loginMethod === 'email' ? 'email' : 'phone'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Code</label>
              <input
                type="text"
                name="confirmationCode"
                value={formData.confirmationCode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                required
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Confirm Account'}
            </button>
          </form>
        );

      case 'forgot-password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-4">
              <LockClosedIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enter your {loginMethod === 'email' ? 'email' : 'phone'} to receive a reset code
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {loginMethod === 'email' ? (
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                ) : (
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                )}
                <input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  name={loginMethod === 'email' ? 'email' : 'phone'}
                  value={loginMethod === 'email' ? formData.email : formData.phone}
                  onChange={handleInputChange}
                  placeholder={loginMethod === 'email' ? 'Enter your email' : '+1234567890'}
                  required
                  className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === 'signin' && 'Sign In'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'confirm-signup' && 'Confirm Account'}
            {authMode === 'forgot-password' && 'Reset Password'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {renderForm()}

        {/* Mode Switcher */}
        <div className="mt-6 text-center">
          {authMode === 'signin' && (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create one
              </button>
            </p>
          )}
          {authMode === 'signup' && (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
          {(authMode === 'confirm-signup' || authMode === 'forgot-password') && (
            <button
              onClick={() => setAuthMode('signin')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

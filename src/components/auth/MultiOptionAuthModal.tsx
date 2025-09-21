'use client';

import { useState, useEffect } from 'react';
import { authService, SignUpData, SignInData, PhoneSignInData, OTPVerificationData } from '@/lib/authService';
import { 
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface MultiOptionAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'signin' | 'signup' | 'phone' | 'google';
}

type AuthMode = 'signin' | 'signup' | 'phone' | 'otp' | 'forgot' | 'reset' | 'mfa';

export function MultiOptionAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  defaultMode = 'signin' 
}: MultiOptionAuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [signInData, setSignInData] = useState<SignInData>({ username: '', password: '' });
  const [signUpData, setSignUpData] = useState<SignUpData>({ 
    email: '', 
    password: '', 
    name: '', 
    phone: '', 
    role: 'Student' 
  });
  const [phoneData, setPhoneData] = useState<PhoneSignInData>({ phoneNumber: '' });
  const [otpData, setOtpData] = useState<OTPVerificationData>({ phoneNumber: '', code: '' });
  const [forgotData, setForgotData] = useState({ email: '' });
  const [resetData, setResetData] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [mfaData, setMfaData] = useState({ code: '' });

  // MFA setup
  const [mfaSetup, setMfaSetup] = useState<{ secretKey: string; qrCode: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, defaultMode]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(signInData);
      setSuccess('Signed in successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signUp(signUpData);
      if (result.needsConfirmation) {
        setSuccess('Account created! Please check your email for verification code.');
        setMode('otp');
        setOtpData({ phoneNumber: '', code: '' });
      } else {
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signInWithPhone(phoneData);
      setSuccess('OTP sent to your phone number!');
      setMode('otp');
      setOtpData({ phoneNumber: phoneData.phoneNumber, code: '' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Phone sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.verifyOTP(otpData);
      setSuccess('Phone verified successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signInWithGoogle();
      // Google sign in will redirect, so we don't need to handle success here
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign in failed');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(forgotData.email);
      setSuccess('Password reset code sent to your email!');
      setMode('reset');
      setResetData({ ...resetData, email: forgotData.email });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Forgot password failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.confirmForgotPassword(
        resetData.email, 
        resetData.code, 
        resetData.newPassword
      );
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        setMode('signin');
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASetup = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.enableMFA();
      setMfaSetup(result);
      setSuccess('MFA setup initiated! Scan the QR code with your authenticator app.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'MFA setup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.verifyMFASetup(mfaData.code);
      setSuccess('MFA enabled successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'MFA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'phone': return 'Phone Sign In';
      case 'otp': return 'Verify Code';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Password';
      case 'mfa': return 'Enable MFA';
      default: return 'Authentication';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'signin': return <KeyIcon className="h-6 w-6" />;
      case 'signup': return <UserIcon className="h-6 w-6" />;
      case 'phone': return <PhoneIcon className="h-6 w-6" />;
      case 'otp': return <CheckCircleIcon className="h-6 w-6" />;
      case 'forgot': return <EnvelopeIcon className="h-6 w-6" />;
      case 'reset': return <KeyIcon className="h-6 w-6" />;
      case 'mfa': return <CheckCircleIcon className="h-6 w-6" />;
      default: return <KeyIcon className="h-6 w-6" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              {getModeIcon()}
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                {getModeTitle()}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Display */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            {mode === 'signin' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    value={signInData.username}
                    onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email or phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
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
                <button
                  onClick={handleSignIn}
                  disabled={loading || !signInData.username || !signInData.password}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="text-center">
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={signUpData.role}
                    onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Investor">Investor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a strong password"
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
                <button
                  onClick={handleSignUp}
                  disabled={loading || !signUpData.name || !signUpData.email || !signUpData.password}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            )}

            {/* Phone Sign In Form */}
            {mode === 'phone' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneData.phoneNumber}
                    onChange={(e) => setPhoneData({ phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <button
                  onClick={handlePhoneSignIn}
                  disabled={loading || !phoneData.phoneNumber}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            )}

            {/* OTP Verification Form */}
            {mode === 'otp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otpData.code}
                    onChange={(e) => setOtpData({ ...otpData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the 6-digit code"
                  />
                </div>
                <button
                  onClick={handleOTPVerification}
                  disabled={loading || !otpData.code}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({ email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <button
                  onClick={handleForgotPassword}
                  disabled={loading || !forgotData.email}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending Reset Code...' : 'Send Reset Code'}
                </button>
              </div>
            )}

            {/* Password Reset Form */}
            {mode === 'reset' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={resetData.code}
                    onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the verification code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handlePasswordReset}
                  disabled={loading || !resetData.code || !resetData.newPassword || !resetData.confirmPassword}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>
            )}

            {/* MFA Setup Form */}
            {mode === 'mfa' && (
              <div className="space-y-4">
                {!mfaSetup ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Enable Multi-Factor Authentication (MFA) to add an extra layer of security to your account.
                    </p>
                    <button
                      onClick={handleMFASetup}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Setting up MFA...' : 'Enable MFA'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-4">
                      <img src={mfaSetup.qrCode} alt="QR Code" className="mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={mfaData.code}
                        onChange={(e) => setMfaData({ code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter the 6-digit code from your app"
                      />
                    </div>
                    <button
                      onClick={handleMFAVerification}
                      disabled={loading || !mfaData.code}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4"
                    >
                      {loading ? 'Verifying...' : 'Verify & Enable MFA'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Alternative Sign In Options */}
            {mode === 'signin' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={() => setMode('phone')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Sign in with Phone
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 text-center space-y-2">
              {mode === 'signin' && (
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              )}
              
              {mode === 'signup' && (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {(mode === 'phone' || mode === 'otp') && (
                <button
                  onClick={() => setMode('signin')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Email Sign In
                </button>
              )}

              {(mode === 'forgot' || mode === 'reset') && (
                <button
                  onClick={() => setMode('signin')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { paymentService, PaymentRequest } from '@/lib/paymentService';
import { 
  XMarkIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseType: 'course' | 'program' | 'ksmp';
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseType,
  amount,
  currency = 'INR',
  onPaymentSuccess,
  onPaymentFailure
}: PaymentModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'redirecting'>('details');

  const handlePayment = async () => {
    if (!user) {
      setError('Please sign in to make a payment');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStep('processing');

    try {
      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        studentId: user.userId || user.signInDetails?.loginId || '',
        courseId: courseId,
        amount: amount,
        studentInfo: {
          firstName: user.signInDetails?.loginId?.split(' ')[0] || 'Student',
          lastName: user.signInDetails?.loginId?.split(' ')[1] || '',
          email: user.signInDetails?.loginId || '',
          phone: user.phoneNumber || ''
        },
        courseInfo: {
          title: courseTitle,
          type: courseType,
          description: `Enrollment in ${courseTitle}`
        }
      };

      // Validate payment request
      const validationErrors = paymentService.validatePaymentRequest(paymentRequest);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Initiate payment
      const paymentResponse = await paymentService.initiatePayment(paymentRequest);

      if (paymentResponse.success) {
        setPaymentStep('redirecting');
        
        // Redirect to PayU payment page
        setTimeout(() => {
          paymentService.redirectToPayU(paymentResponse.paymentParams);
        }, 1000);
      } else {
        throw new Error(paymentResponse.error || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      setPaymentStep('details');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStepIcon = () => {
    switch (paymentStep) {
      case 'processing':
        return <ClockIcon className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'redirecting':
        return <CreditCardIcon className="h-8 w-8 text-green-500" />;
      default:
        return <CreditCardIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getPaymentStepText = () => {
    switch (paymentStep) {
      case 'processing':
        return 'Processing payment request...';
      case 'redirecting':
        return 'Redirecting to payment gateway...';
      default:
        return 'Payment Details';
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
              {getPaymentStepIcon()}
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                {getPaymentStepText()}
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
            {paymentStep === 'details' && (
              <>
                {/* Course Details */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Course Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{courseTitle}</div>
                      <div className="text-gray-600 capitalize">{courseType}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {paymentService.formatAmount(amount, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Payment Method</span>
                      <span className="text-sm text-gray-900">PayU Gateway</span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {/* Payment Security Notice */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <div className="text-sm text-blue-700">
                      <div className="font-medium">Secure Payment</div>
                      <div>Your payment is processed securely through PayU gateway</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Processing Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Please wait while we prepare your payment...
                </p>
              </div>
            )}

            {paymentStep === 'redirecting' && (
              <div className="text-center py-8">
                <CreditCardIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Redirecting to Payment Gateway
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to PayU secure payment page...
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700">
                    Please complete the payment on the next page. Do not close this window.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

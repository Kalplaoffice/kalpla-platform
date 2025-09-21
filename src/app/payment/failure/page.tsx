'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService } from '@/lib/paymentService';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const handlePaymentFailure = async () => {
      try {
        // Get transaction ID from URL parameters
        const transactionId = searchParams.get('txnid') || searchParams.get('transaction_id');
        const reason = searchParams.get('reason') || 'Payment was cancelled or failed';
        
        if (!transactionId) {
          throw new Error('Transaction ID not found');
        }

        // Handle payment failure
        await paymentService.handlePaymentFailure(transactionId, reason);
        
        // Get payment details
        const paymentStatus = await paymentService.checkPaymentStatus(transactionId);
        setPaymentData(paymentStatus);

        setLoading(false);
      } catch (error) {
        console.error('Payment failure handling error:', error);
        setError(error instanceof Error ? error.message : 'Payment verification failed');
        setLoading(false);
      }
    };

    handlePaymentFailure();
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Navigate back to the course page or payment page
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Payment Status
          </h2>
          <p className="text-gray-600">
            Please wait while we process your payment status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          {error || 'Your payment could not be processed. Please try again or contact support if the issue persists.'}
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{paymentData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {paymentService.formatAmount(paymentData.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-red-600 capitalize">
                  {paymentData.status}
                </span>
              </div>
              {paymentData.failureReason && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-medium text-red-600">
                    {paymentData.failureReason}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>If you continue to experience issues, please contact our support team.</p>
        </div>

        <div className="mt-4">
          <Link
            href="/support"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

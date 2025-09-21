'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService } from '@/lib/paymentService';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get transaction ID from URL parameters
        const transactionId = searchParams.get('txnid') || searchParams.get('transaction_id');
        
        if (!transactionId) {
          throw new Error('Transaction ID not found');
        }

        // Handle payment success
        await paymentService.handlePaymentSuccess(transactionId);
        
        // Get payment details
        const paymentStatus = await paymentService.checkPaymentStatus(transactionId);
        setPaymentData(paymentStatus);

        setLoading(false);
      } catch (error) {
        console.error('Payment success handling error:', error);
        setError(error instanceof Error ? error.message : 'Payment verification failed');
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/support"
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. You now have access to your course.
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>
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
                <span className="font-medium text-green-600 capitalize">
                  {paymentData.status}
                </span>
              </div>
              {paymentData.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(paymentData.paymentDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
          <Link
            href="/courses"
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
          >
            Browse More Courses
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>A confirmation email has been sent to your registered email address.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

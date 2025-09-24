'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  XCircleIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = () => {
    try {
      // Get payment response parameters from PayU
      const paymentResponse = {
        status: searchParams.get('status') || 'cancelled',
        txnid: searchParams.get('txnid') || '',
        amount: parseFloat(searchParams.get('amount') || '0'),
        productinfo: searchParams.get('productinfo') || '',
        firstname: searchParams.get('firstname') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        hash: searchParams.get('hash') || ''
      };

      setPaymentData(paymentResponse);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    // In a real implementation, you would redirect back to the payment page
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Payment Cancelled</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cancellation Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="h-12 w-12 text-yellow-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-xl text-gray-600 mb-2">You have cancelled the payment process</p>
          <p className="text-gray-500">No charges have been made to your account</p>
        </div>

        {/* Payment Details */}
        {paymentData && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Student Name</p>
                  <p className="text-sm text-gray-600">{paymentData.firstname || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{paymentData.email || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Program</p>
                  <p className="text-sm text-gray-600">{paymentData.productinfo || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Transaction ID</p>
                  <p className="text-sm text-gray-600 font-mono">{paymentData.txnid || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Amount</p>
                  <p className="text-sm text-gray-600 font-semibold">₹{paymentData.amount?.toLocaleString('en-IN') || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <p className="text-sm text-yellow-600 font-semibold">Cancelled</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Payment Cancellation</p>
              <p className="mb-2">
                You have successfully cancelled the payment process. No charges have been made to your account, 
                and you can complete your enrollment at any time.
              </p>
              <p>
                If you change your mind, you can retry the payment process or contact our support team 
                for assistance with alternative payment methods.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Retry Payment</h3>
                <p className="text-gray-600">You can complete your enrollment by retrying the payment process.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Explore Other Programs</h3>
                <p className="text-gray-600">Browse our other degree programs that might interest you.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contact Support</h3>
                <p className="text-gray-600">Get help with payment options or program information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetryPayment}
            className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Complete Enrollment
          </button>
          
          <button
            onClick={() => router.push('/degree-programs')}
            className="flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Browse Programs
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

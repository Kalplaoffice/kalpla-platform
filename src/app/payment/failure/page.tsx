'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { payuService } from '@/lib/payuService';

export default function PaymentFailurePage() {
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
        status: searchParams.get('status') || 'failure',
        txnid: searchParams.get('txnid') || '',
        amount: parseFloat(searchParams.get('amount') || '0'),
        productinfo: searchParams.get('productinfo') || '',
        firstname: searchParams.get('firstname') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        hash: searchParams.get('hash') || '',
        error: searchParams.get('error') || '',
        error_Message: searchParams.get('error_Message') || ''
      };

      setPaymentData(paymentResponse);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return payuService.formatCurrency(amount, currency);
  };

  const handleRetryPayment = () => {
    // In a real implementation, you would redirect back to the payment page
    router.push('/dashboard');
  };

  const getErrorMessage = () => {
    if (paymentData?.error_Message) {
      return paymentData.error_Message;
    }
    if (paymentData?.error) {
      return paymentData.error;
    }
    return 'Payment was not completed successfully.';
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
              <span className="ml-2 text-lg font-medium text-gray-900">Payment Failed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Failure Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 mb-2">We're sorry, your payment could not be processed</p>
          <p className="text-gray-500">Don't worry, no charges have been made to your account</p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Message</h3>
                <p className="text-sm text-red-700 mt-1">{getErrorMessage()}</p>
              </div>
            </div>
          </div>

          {paymentData && (
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
                  <p className="text-sm text-gray-600 font-semibold">{formatCurrency(paymentData.amount)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <p className="text-sm text-red-600 font-semibold">Failed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Common Reasons */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Reasons for Payment Failure</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">•</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Insufficient Funds</h3>
                <p className="text-gray-600">Your account may not have sufficient balance for this transaction.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">•</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Card Expired</h3>
                <p className="text-gray-600">Your payment card may have expired or is invalid.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">•</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Network Issues</h3>
                <p className="text-gray-600">Temporary network connectivity issues may have caused the failure.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">•</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Bank Restrictions</h3>
                <p className="text-gray-600">Your bank may have restrictions on online transactions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What You Can Do</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Try Again</h3>
                <p className="text-gray-600">You can retry the payment with the same or different payment method.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Check Your Payment Method</h3>
                <p className="text-gray-600">Verify that your card/bank account has sufficient funds and is active.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contact Support</h3>
                <p className="text-gray-600">If the issue persists, contact our support team for assistance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is available to help you resolve any payment issues.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Email Support</h4>
                <p className="text-sm text-gray-600">support@kalpla.edu</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Phone Support</h4>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
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
            Try Payment Again
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
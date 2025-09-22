'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentData = {
      txnid: urlParams.get('txnid'),
      amount: urlParams.get('amount'),
      productinfo: urlParams.get('productinfo'),
      firstname: urlParams.get('firstname'),
      email: urlParams.get('email'),
      status: urlParams.get('status'),
      hash: urlParams.get('hash'),
      key: urlParams.get('key'),
      udf1: urlParams.get('udf1'),
      udf2: urlParams.get('udf2'),
      udf3: urlParams.get('udf3'),
      udf4: urlParams.get('udf4')
    };

    setPaymentDetails(paymentData);
    setIsLoading(false);

    // Log payment success
    console.log('Payment Success:', paymentData);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Your payment has been processed successfully
            </p>
          </div>

          {paymentDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Payment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Transaction ID
                  </label>
                  <p className="text-green-900 font-mono">{paymentDetails.txnid}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Amount
                  </label>
                  <p className="text-green-900 font-semibold">₹{paymentDetails.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Product
                  </label>
                  <p className="text-green-900">{paymentDetails.productinfo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Customer Name
                  </label>
                  <p className="text-green-900">{paymentDetails.firstname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Email
                  </label>
                  <p className="text-green-900">{paymentDetails.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Status
                  </label>
                  <p className="text-green-900 font-semibold">{paymentDetails.status}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you for your payment! You will receive a confirmation email shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/payment-test"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Payment Test
              </Link>
              <Link
                href="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
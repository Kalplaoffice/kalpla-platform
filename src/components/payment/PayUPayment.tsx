'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  WalletIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { payuService, PaymentRequest, EnrollmentPayment } from '@/lib/payuService';

interface PayUPaymentProps {
  enrollmentId: string;
  programId: string;
  studentId: string;
  amount: number;
  currency: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  programTitle: string;
  onPaymentSuccess: (payment: EnrollmentPayment) => void;
  onPaymentFailure: (error: string) => void;
  onCancel: () => void;
}

export default function PayUPayment({
  enrollmentId,
  programId,
  studentId,
  amount,
  currency,
  studentName,
  studentEmail,
  studentPhone,
  programTitle,
  onPaymentSuccess,
  onPaymentFailure,
  onCancel
}: PayUPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [enrollmentPayment, setEnrollmentPayment] = useState<EnrollmentPayment | null>(null);

  const paymentMethods = payuService.getPaymentMethods();

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate payment data
      const validation = payuService.validatePaymentData({
        amount,
        studentName,
        studentEmail,
        studentPhone,
        programTitle
      });

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Create payment request
      const result = await payuService.createPaymentRequest({
        enrollmentId,
        programId,
        studentId,
        amount,
        currency,
        studentName,
        studentEmail,
        studentPhone,
        programTitle
      });

      setPaymentRequest(result.paymentRequest);
      setEnrollmentPayment(result.enrollmentPayment);
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleProceedToPayment = () => {
    if (!paymentRequest) {
      setError('Payment request not initialized');
      return;
    }

    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Create form and submit to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payuService.getConfig().baseUrl + '/_payment';
    form.target = '_blank';

    // Add all payment request parameters as hidden inputs
    Object.entries(paymentRequest).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    // Add payment method
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = 'pg';
    methodInput.value = selectedPaymentMethod;
    form.appendChild(methodInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return payuService.formatCurrency(amount, currency);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCardIcon className="h-6 w-6" />;
      case 'netbanking':
        return <BanknotesIcon className="h-6 w-6" />;
      case 'upi':
        return <DevicePhoneMobileIcon className="h-6 w-6" />;
      case 'wallet':
        return <WalletIcon className="h-6 w-6" />;
      case 'emi':
        return <CalendarDaysIcon className="h-6 w-6" />;
      default:
        return <CreditCardIcon className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
        </div>
        <p className="text-gray-600">Complete your enrollment with PayU's secure payment gateway</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Program:</span>
            <span className="font-medium text-gray-900">{programTitle}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Student:</span>
            <span className="font-medium text-gray-900">{studentName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{studentEmail}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-900">{studentPhone}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(amount, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {getPaymentMethodIcon(method.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-2xl">{method.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Secure Payment</p>
            <ul className="space-y-1">
              <li>• Your payment is processed securely by PayU</li>
              <li>• We use 256-bit SSL encryption for all transactions</li>
              <li>• Your card details are never stored on our servers</li>
              <li>• You will receive a confirmation email after successful payment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedPaymentMethod || !paymentRequest}
          className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center ${
            !selectedPaymentMethod || !paymentRequest
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <LockClosedIcon className="h-5 w-5 mr-2" />
          Proceed to PayU
        </button>
      </div>

      {/* Transaction ID */}
      {enrollmentPayment && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Transaction ID: <span className="font-mono">{enrollmentPayment.txnid}</span>
          </p>
        </div>
      )}
    </div>
  );
}

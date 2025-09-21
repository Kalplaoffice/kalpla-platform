'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { currencyService, Currency, PaymentMethod } from '@/lib/currencyService';
import { paymentService, PaymentRequest } from '@/lib/paymentService';
import { 
  XMarkIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface MultiCurrencyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseType: 'course' | 'program' | 'ksmp';
  baseAmount: number;
  baseCurrency?: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: () => void;
}

export function MultiCurrencyPaymentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseType,
  baseAmount,
  baseCurrency = 'USD',
  onPaymentSuccess,
  onPaymentFailure
}: MultiCurrencyPaymentModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'currency' | 'method' | 'processing' | 'redirecting'>('currency');
  
  // Currency and payment method states
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [paymentFees, setPaymentFees] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  // Available options
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (isOpen) {
      initializePaymentOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCurrency && baseAmount) {
      calculateAmounts();
    }
  }, [selectedCurrency, baseAmount]);

  useEffect(() => {
    if (selectedCurrency) {
      updatePaymentMethods();
    }
  }, [selectedCurrency]);

  const initializePaymentOptions = async () => {
    try {
      // Get supported currencies
      const supportedCurrencies = currencyService.getSupportedCurrencies();
      setCurrencies(supportedCurrencies);
      
      // Set default currency based on user location or preference
      const userPreferredCurrency = currencyService.getUserPreferredCurrency();
      const defaultCurrency = supportedCurrencies.find(c => c.code === userPreferredCurrency) || supportedCurrencies[0];
      setSelectedCurrency(defaultCurrency);
      
      // Update exchange rates
      await currencyService.updateExchangeRates();
    } catch (error) {
      console.error('Failed to initialize payment options:', error);
      setError('Failed to load payment options');
    }
  };

  const calculateAmounts = () => {
    if (!selectedCurrency) return;

    // Convert base amount to selected currency
    const conversion = currencyService.convertCurrency(baseAmount, baseCurrency, selectedCurrency.code);
    setConvertedAmount(conversion.convertedAmount);

    // Calculate payment fees if payment method is selected
    if (selectedPaymentMethod) {
      const fees = currencyService.calculatePaymentFees(conversion.convertedAmount, selectedPaymentMethod, selectedCurrency.code);
      setPaymentFees(fees);
      setTotalAmount(conversion.convertedAmount + fees);
    } else {
      setPaymentFees(0);
      setTotalAmount(conversion.convertedAmount);
    }
  };

  const updatePaymentMethods = () => {
    if (!selectedCurrency) return;

    const methods = currencyService.getPaymentMethods(selectedCurrency.code);
    setPaymentMethods(methods);
    
    // Auto-select first method if only one available
    if (methods.length === 1) {
      setSelectedPaymentMethod(methods[0]);
    } else {
      setSelectedPaymentMethod(null);
    }
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setSelectedPaymentMethod(null); // Reset payment method when currency changes
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!user || !selectedCurrency || !selectedPaymentMethod) {
      setError('Please select currency and payment method');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStep('processing');

    try {
      // Prepare payment request with multi-currency support
      const paymentRequest: PaymentRequest = {
        studentId: user.userId || user.signInDetails?.loginId || '',
        courseId: courseId,
        amount: totalAmount,
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

      // Add currency and payment method information
      const enhancedRequest = {
        ...paymentRequest,
        currency: selectedCurrency.code,
        paymentMethod: selectedPaymentMethod.type,
        baseAmount: baseAmount,
        baseCurrency: baseCurrency,
        exchangeRate: currencyService.getExchangeRate(baseCurrency, selectedCurrency.code),
        paymentFees: paymentFees
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
      setPaymentStep('currency');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStepIcon = () => {
    switch (paymentStep) {
      case 'currency':
        return <GlobeAltIcon className="h-8 w-8 text-blue-500" />;
      case 'method':
        return <CreditCardIcon className="h-8 w-8 text-green-500" />;
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
      case 'currency':
        return 'Select Currency';
      case 'method':
        return 'Choose Payment Method';
      case 'processing':
        return 'Processing Payment...';
      case 'redirecting':
        return 'Redirecting to Payment Gateway...';
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
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

            {/* Currency Selection */}
            {paymentStep === 'currency' && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Select Currency</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedCurrency?.code === currency.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{currency.code}</div>
                          <div className="text-sm text-gray-600">{currency.name}</div>
                        </div>
                        <div className="text-lg">{currency.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            {paymentStep === 'method' && selectedCurrency && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Choose Payment Method</h4>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodChange(method)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-600">
                              {method.fees.percentage}% + {currencyService.formatCurrency(method.fees.fixed, selectedCurrency.code)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.supportedCurrencies.includes(selectedCurrency.code) ? 'Available' : 'Not Available'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {selectedCurrency && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course Price ({baseCurrency})</span>
                      <span className="font-medium">
                        {currencyService.formatCurrency(baseAmount, baseCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Converted Amount ({selectedCurrency.code})</span>
                      <span className="font-medium">
                        {currencyService.formatCurrency(convertedAmount, selectedCurrency.code)}
                      </span>
                    </div>
                    {paymentFees > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Fees</span>
                        <span className="font-medium">
                          {currencyService.formatCurrency(paymentFees, selectedCurrency.code)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-medium">Total Amount</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {currencyService.formatCurrency(totalAmount, selectedCurrency.code)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <div className="font-medium">Secure Multi-Currency Payment</div>
                  <div>Your payment is processed securely with real-time currency conversion</div>
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
              
              {paymentStep === 'currency' && selectedCurrency && (
                <button
                  onClick={() => setPaymentStep('method')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              )}
              
              {paymentStep === 'method' && selectedPaymentMethod && (
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              )}
            </div>

            {/* Processing States */}
            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Processing Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Please wait while we process your payment...
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
                  You will be redirected to secure payment page...
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

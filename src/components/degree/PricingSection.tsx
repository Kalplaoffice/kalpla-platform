'use client';

import React, { useState } from 'react';
import { 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  GiftIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PricingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  discount?: number;
}

interface PricingSectionProps {
  programTitle: string;
  basePrice: number;
  currency: string;
  duration: number;
}

export default function PricingSection({ programTitle, basePrice, currency, duration }: PricingSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('full');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const pricingOptions: PricingOption[] = [
    {
      id: 'full',
      name: 'Full Payment',
      description: 'Pay the complete program fee upfront',
      price: basePrice,
      currency,
      duration: 'One-time payment',
      features: [
        'Complete program access',
        'All course materials',
        'Certificate of completion',
        'Lifetime access to resources',
        'Priority support',
        'Career guidance sessions'
      ],
      isRecommended: true,
      discount: 10
    },
    {
      id: 'installment',
      name: 'Installment Plan',
      description: 'Pay in monthly installments',
      price: Math.ceil(basePrice / duration),
      originalPrice: Math.ceil(basePrice / duration),
      currency,
      duration: `${duration} monthly payments`,
      features: [
        'Complete program access',
        'All course materials',
        'Certificate of completion',
        'Monthly payment flexibility',
        'Standard support',
        'Career guidance sessions'
      ]
    },
    {
      id: 'scholarship',
      name: 'Scholarship Program',
      description: 'Apply for financial assistance',
      price: Math.ceil(basePrice * 0.5), // 50% scholarship
      originalPrice: basePrice,
      currency,
      duration: 'One-time payment',
      features: [
        'Complete program access',
        'All course materials',
        'Certificate of completion',
        'Financial assistance',
        'Standard support',
        'Career guidance sessions'
      ],
      discount: 50
    }
  ];

  const selectedPricing = pricingOptions.find(option => option.id === selectedOption);

  const handleApplyNow = () => {
    setShowPaymentModal(true);
  };

  const paymentMethods = [
    { id: 'credit', name: 'Credit Card', icon: CreditCardIcon },
    { id: 'debit', name: 'Debit Card', icon: CreditCardIcon },
    { id: 'upi', name: 'UPI', icon: GiftIcon },
    { id: 'netbanking', name: 'Net Banking', icon: CurrencyDollarIcon },
    { id: 'emi', name: 'EMI', icon: ClockIcon }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Payment Plan</h3>
        <p className="text-gray-600">
          Select the payment option that works best for you
        </p>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {pricingOptions.map((option) => (
          <div
            key={option.id}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${option.isRecommended ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => setSelectedOption(option.id)}
          >
            {option.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Recommended
                </span>
              </div>
            )}

            {option.discount && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                  {option.discount}% OFF
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(option.price, option.currency)}
                </span>
                {option.originalPrice && option.originalPrice !== option.price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    {formatCurrency(option.originalPrice, option.currency)}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600">{option.duration}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className={`w-full py-2 px-4 rounded-lg text-center font-medium ${
              selectedOption === option.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {selectedOption === option.id ? 'Selected' : 'Select Plan'}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Plan Summary */}
      {selectedPricing && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Plan Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Plan Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{selectedPricing.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedPricing.price, selectedPricing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Schedule:</span>
                  <span className="font-medium">{selectedPricing.duration}</span>
                </div>
                {selectedPricing.discount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">{selectedPricing.discount}% OFF</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">What's Included</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                {selectedPricing.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {selectedPricing.features.length > 4 && (
                  <li className="text-gray-500">
                    +{selectedPricing.features.length - 4} more benefits
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <method.icon className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Information</p>
            <ul className="space-y-1">
              <li>• All payments are processed securely through our payment gateway</li>
              <li>• You will receive a confirmation email after successful payment</li>
              <li>• Program access will be granted within 24 hours of payment confirmation</li>
              <li>• Refund policy applies as per our terms and conditions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Apply Now Button */}
      <div className="text-center">
        <button
          onClick={handleApplyNow}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Now - {selectedPricing && formatCurrency(selectedPricing.price, selectedPricing.currency)}
        </button>
        
        <p className="text-sm text-gray-500 mt-3">
          Secure payment • Instant access • 30-day money-back guarantee
        </p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Application</h3>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Program:</span>
                    <span className="font-medium">{programTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{selectedPricing?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{selectedPricing && formatCurrency(selectedPricing.price, selectedPricing.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Choose payment method...</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In a real implementation, redirect to payment gateway
                  alert('Redirecting to payment gateway...');
                  setShowPaymentModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

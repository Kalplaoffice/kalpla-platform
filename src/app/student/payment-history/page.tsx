'use client';

import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  PrinterIcon,
  ShareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { studentPaymentHistoryService, StudentPaymentHistory, PaymentSummary, PaymentFilters, PaymentReceipt } from '@/lib/studentPaymentHistoryService';

export default function StudentPaymentHistoryPage() {
  const [payments, setPayments] = useState<StudentPaymentHistory[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<StudentPaymentHistory | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [paymentsData, summaryData] = await Promise.all([
        studentPaymentHistoryService.getPaymentHistory('current_student', filters),
        studentPaymentHistoryService.getPaymentSummary('current_student')
      ]);
      
      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReceipt = async (payment: StudentPaymentHistory) => {
    try {
      const receipt = await studentPaymentHistoryService.generatePaymentReceipt(payment.transactionId);
      setReceipt(receipt);
      setShowReceiptModal(true);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  const handleDownloadReceipt = async (receiptNumber: string) => {
    try {
      const pdfBlob = await studentPaymentHistoryService.downloadReceiptAsPDF(receiptNumber);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${receiptNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const handleRequestRefund = async () => {
    if (!selectedPayment || !refundReason) return;

    try {
      const success = await studentPaymentHistoryService.requestRefund(
        selectedPayment.transactionId,
        refundReason
      );
      
      if (success) {
        setRefundModal(false);
        setRefundReason('');
        await loadPaymentHistory();
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
    }
  };

  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    loadPaymentHistory();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600">View your payment history, receipts, and transaction details</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">₹{summary.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Total Paid</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{summary.successfulPayments}</p>
                  <p className="text-sm text-gray-600">Successful Payments</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <ReceiptRefundIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">₹{summary.totalRefunded.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Total Refunded</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{summary.totalPayments}</p>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange({
                      ...filters,
                      status: value === 'all' ? undefined : [value]
                    });
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange({
                      ...filters,
                      paymentMethod: value === 'all' ? undefined : [value]
                    });
                  }}
                >
                  <option value="all">All Methods</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="upi">UPI</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const startDate = e.target.value;
                    handleFilterChange({
                      ...filters,
                      dateRange: startDate ? {
                        start: startDate,
                        end: filters.dateRange?.end || new Date().toISOString().split('T')[0]
                      } : undefined
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const endDate = e.target.value;
                    handleFilterChange({
                      ...filters,
                      dateRange: endDate ? {
                        start: filters.dateRange?.start || '2020-01-01',
                        end: endDate
                      } : undefined
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      payment.status === 'success' ? 'bg-green-100' :
                      payment.status === 'failed' ? 'bg-red-100' :
                      payment.status === 'pending' ? 'bg-yellow-100' :
                      payment.status === 'cancelled' ? 'bg-gray-100' :
                      'bg-blue-100'
                    }`}>
                      <CreditCardIcon className={`h-6 w-6 ${
                        payment.status === 'success' ? 'text-green-600' :
                        payment.status === 'failed' ? 'text-red-600' :
                        payment.status === 'pending' ? 'text-yellow-600' :
                        payment.status === 'cancelled' ? 'text-gray-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{payment.description}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentPaymentHistoryService.getStatusColor(payment.status)}`}>
                          {studentPaymentHistoryService.getStatusIcon(payment.status)} {payment.status}
                        </span>
                        <span className="text-sm text-gray-600">{payment.paymentMethod}</span>
                        <span className="text-sm text-gray-500">{studentPaymentHistoryService.formatDate(payment.paymentDate)}</span>
                      </div>
                      {payment.planName && (
                        <p className="text-sm text-gray-500 mt-1">Plan: {payment.planName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-600">#{payment.transactionId}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleGenerateReceipt(payment)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Receipt
                      </button>
                      
                      {payment.status === 'success' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setRefundModal(true);
                          }}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                        >
                          <ReceiptRefundIcon className="h-4 w-4 mr-1" />
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {payments.length === 0 && (
            <div className="p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
              <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
          )}
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && receipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Receipt Number</p>
                      <p className="text-sm text-gray-900">{receipt.receiptNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Transaction ID</p>
                      <p className="text-sm text-gray-900">{receipt.transactionId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Student Name</p>
                      <p className="text-sm text-gray-900">{receipt.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900">{receipt.studentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{receipt.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-sm text-gray-900">{receipt.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Date</p>
                      <p className="text-sm text-gray-900">{studentPaymentHistoryService.formatDate(receipt.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentPaymentHistoryService.getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm text-gray-900">{receipt.description}</p>
                  </div>
                  
                  {receipt.planName && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Plan</p>
                      <p className="text-sm text-gray-900">{receipt.planName}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDownloadReceipt(receipt.receiptNumber)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                      <PrinterIcon className="h-5 w-5 mr-2" />
                      Print
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <ShareIcon className="h-5 w-5 mr-2" />
                      Share
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Generated: {studentPaymentHistoryService.formatDate(receipt.generatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {refundModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Request Refund</h2>
                  <button
                    onClick={() => setRefundModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Payment Details:</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayment.description}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{selectedPayment.amount.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Date: {studentPaymentHistoryService.formatDate(selectedPayment.paymentDate)}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Refund</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Please explain why you need a refund..."
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setRefundModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestRefund}
                    disabled={!refundReason.trim()}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Refund
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

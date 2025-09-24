'use client';

import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { adminPaymentService, PaymentTransaction, RefundRequest, MentorPayout, PaymentAnalytics, PaymentFilters } from '@/lib/adminPaymentService';

export default function AdminPaymentDashboard() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [payouts, setPayouts] = useState<MentorPayout[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'refunds' | 'payouts' | 'analytics'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, refundsData, payoutsData, analyticsData] = await Promise.all([
        adminPaymentService.getPaymentTransactions(),
        adminPaymentService.getRefundRequests(),
        adminPaymentService.getMentorPayouts(),
        adminPaymentService.getPaymentAnalytics()
      ]);
      
      setTransactions(transactionsData);
      setRefunds(refundsData);
      setPayouts(payoutsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
                <p className="text-gray-600">Manage transactions, refunds, and mentor payouts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'transactions', name: 'Transactions', icon: DocumentTextIcon },
                { id: 'refunds', name: 'Refunds', icon: ArrowPathIcon },
                { id: 'payouts', name: 'Mentor Payouts', icon: UserGroupIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && analytics && (
          <OverviewTab analytics={analytics} />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab transactions={transactions} />
        )}

        {activeTab === 'refunds' && (
          <RefundsTab refunds={refunds} />
        )}

        {activeTab === 'payouts' && (
          <PayoutsTab payouts={payouts} />
        )}

        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab analytics={analytics} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics }: { analytics: PaymentAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.totalTransactions}</p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ArrowPathIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRefunds.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Total Refunds</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{analytics.mentorPayouts.totalAmount.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Mentor Payouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Volume */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h2>
        <div className="space-y-3">
          {analytics.transactionVolume.slice(-6).map((volume) => (
            <div key={volume.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{volume.period}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{volume.transactions} transactions</span>
                <span className="text-sm font-medium text-gray-900">₹{volume.revenue.toLocaleString('en-IN')}</span>
                <span className="text-sm text-red-600">₹{volume.refunds.toLocaleString('en-IN')} refunds</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Transactions Tab Component
function TransactionsTab({ transactions }: { transactions: PaymentTransaction[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Transactions</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.status === 'success' ? 'bg-green-100' :
                  transaction.status === 'failed' ? 'bg-red-100' :
                  transaction.status === 'pending' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  <CreditCardIcon className={`h-5 w-5 ${
                    transaction.status === 'success' ? 'text-green-600' :
                    transaction.status === 'failed' ? 'text-red-600' :
                    transaction.status === 'pending' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.studentName}</p>
                  <p className="text-xs text-gray-500">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{adminPaymentService.formatDate(transaction.paymentDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{transaction.amount.toLocaleString('en-IN')}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${adminPaymentService.getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Refunds Tab Component
function RefundsTab({ refunds }: { refunds: RefundRequest[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Requests</h2>
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{refund.studentName}</h3>
                <p className="text-sm text-gray-600">{refund.studentEmail}</p>
                <p className="text-sm text-gray-500">Transaction: {refund.transactionId}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{refund.amount.toLocaleString('en-IN')}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${adminPaymentService.getStatusColor(refund.status)}`}>
                  {refund.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Payouts Tab Component
function PayoutsTab({ payouts }: { payouts: MentorPayout[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mentor Payouts</h2>
        <div className="space-y-4">
          {payouts.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{payout.mentorName}</h3>
                <p className="text-sm text-gray-600">{payout.mentorEmail}</p>
                <p className="text-sm text-gray-500">Period: {payout.period}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{payout.amount.toLocaleString('en-IN')}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${adminPaymentService.getStatusColor(payout.status)}`}>
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ analytics }: { analytics: PaymentAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">₹{analytics.totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">₹{analytics.netRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Net Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">₹{analytics.averageTransactionValue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Average Transaction Value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
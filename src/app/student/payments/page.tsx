'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { subscriptionService, SubscriptionPlan, StudentSubscription, PaymentTransaction, BillingInfo } from '@/lib/subscriptionService';

export default function StudentPaymentDashboard() {
  const [subscriptions, setSubscriptions] = useState<StudentSubscription[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'payments' | 'billing'>('overview');
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [subscriptionsData, paymentsData] = await Promise.all([
        subscriptionService.getStudentSubscriptions('student_1'), // Mock student ID
        subscriptionService.getStudentPaymentHistory('student_1')
      ]);
      
      setSubscriptions(subscriptionsData);
      setPayments(paymentsData);
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
              <CreditCardIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
                <p className="text-gray-600">Manage your subscriptions and payments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Spent</div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'subscriptions', name: 'Subscriptions', icon: DocumentTextIcon },
                { id: 'payments', name: 'Payment History', icon: CreditCardIcon },
                { id: 'billing', name: 'Billing Info', icon: CogIcon }
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
        {activeTab === 'overview' && (
          <OverviewTab subscriptions={subscriptions} payments={payments} />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsTab 
            subscriptions={subscriptions}
            selectedSubscription={selectedSubscription}
            onSelectSubscription={setSelectedSubscription}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsTab payments={payments} />
        )}

        {activeTab === 'billing' && (
          <BillingTab billingInfo={billingInfo} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ subscriptions, payments }: { subscriptions: StudentSubscription[]; payments: PaymentTransaction[] }) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalSpent = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const monthlySpending = payments
    .filter(p => p.status === 'success' && new Date(p.paymentDate).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{monthlySpending.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'success').length}</p>
              <p className="text-sm text-gray-600">Successful Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Subscriptions</h2>
        <div className="space-y-3">
          {subscriptions.filter(s => s.status === 'active').map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{subscription.planName}</p>
                  <p className="text-xs text-gray-500">{subscription.billingCycle} • Next billing: {subscriptionService.formatDate(subscription.nextBillingDate || subscription.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${subscriptionService.getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
                <span className="text-sm font-medium text-gray-900">₹{subscription.nextPaymentAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
        <div className="space-y-3">
          {payments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500">{subscriptionService.formatDate(payment.paymentDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  payment.status === 'success' ? 'bg-green-100 text-green-800' :
                  payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {payment.status}
                </span>
                <span className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Subscriptions Tab Component
function SubscriptionsTab({ 
  subscriptions, 
  selectedSubscription, 
  onSelectSubscription 
}: {
  subscriptions: StudentSubscription[];
  selectedSubscription: string | null;
  onSelectSubscription: (id: string | null) => void;
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSubscriptions = subscriptions.filter(sub => 
    filterStatus === 'all' || sub.status === filterStatus
  );

  const selectedSubscriptionData = selectedSubscription 
    ? subscriptions.find(s => s.id === selectedSubscription)
    : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">All Subscriptions</h2>
          {filteredSubscriptions.map((subscription) => (
            <div 
              key={subscription.id} 
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
                selectedSubscription === subscription.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectSubscription(subscription.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.planName}</h3>
                  <p className="text-sm text-gray-600">{subscription.billingCycle} • Started: {subscriptionService.formatDate(subscription.startDate)}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${subscriptionService.getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                    <span className="text-sm text-gray-600">₹{subscription.totalPaid.toLocaleString('en-IN')} paid</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{subscription.nextPaymentAmount?.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Next payment</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Details</h2>
          {selectedSubscriptionData ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedSubscriptionData.planName}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">₹{selectedSubscriptionData.nextPaymentAmount?.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Next Payment</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₹{selectedSubscriptionData.totalPaid.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Total Paid</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Subscription Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${subscriptionService.getStatusColor(selectedSubscriptionData.status)}`}>
                        {selectedSubscriptionData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="text-gray-900">{selectedSubscriptionData.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="text-gray-900">{subscriptionService.formatDate(selectedSubscriptionData.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="text-gray-900">{subscriptionService.formatDate(selectedSubscriptionData.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto Renew:</span>
                      <span className="text-gray-900">{selectedSubscriptionData.autoRenew ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {selectedSubscriptionData.status === 'active' && (
                  <div className="pt-4 border-t">
                    <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Subscription</h3>
              <p className="text-gray-600">Choose a subscription from the list to view detailed information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Payments Tab Component
function PaymentsTab({ payments }: { payments: PaymentTransaction[] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Payments</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by description or transaction ID..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  payment.status === 'success' ? 'bg-green-100' :
                  payment.status === 'failed' ? 'bg-red-100' :
                  payment.status === 'pending' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  <CreditCardIcon className={`h-5 w-5 ${
                    payment.status === 'success' ? 'text-green-600' :
                    payment.status === 'failed' ? 'text-red-600' :
                    payment.status === 'pending' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500">Transaction: {payment.transactionId}</p>
                  <p className="text-xs text-gray-500">{subscriptionService.formatDate(payment.paymentDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  payment.status === 'success' ? 'bg-green-100 text-green-800' :
                  payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Billing Tab Component
function BillingTab({ billingInfo }: { billingInfo: BillingInfo | null }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
        {billingInfo ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
              <div className="text-sm text-gray-600">
                <p>{billingInfo.billingAddress.street}</p>
                <p>{billingInfo.billingAddress.city}, {billingInfo.billingAddress.state}</p>
                <p>{billingInfo.billingAddress.postalCode}, {billingInfo.billingAddress.country}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Payment Methods</h3>
              <div className="space-y-2">
                {billingInfo.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCardIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{method.type.toUpperCase()}</p>
                        {method.last4 && <p className="text-xs text-gray-500">**** **** **** {method.last4}</p>}
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing Information</h3>
            <p className="text-gray-600">Billing information will appear here once you make your first payment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
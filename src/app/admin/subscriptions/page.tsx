'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { subscriptionService, SubscriptionPlan, StudentSubscription, SubscriptionAnalytics } from '@/lib/subscriptionService';

export default function AdminSubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<StudentSubscription[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'subscriptions' | 'analytics'>('overview');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [plansData, analyticsData] = await Promise.all([
        subscriptionService.getSubscriptionPlans(),
        subscriptionService.getSubscriptionAnalytics()
      ]);
      
      setPlans(plansData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (planData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await subscriptionService.createSubscriptionPlan(planData);
      await loadData();
      setShowCreatePlan(false);
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription data...</p>
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
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
                <p className="text-gray-600">Manage subscription plans and monitor performance</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePlan(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Plan
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'plans', name: 'Subscription Plans', icon: DocumentTextIcon },
                { id: 'subscriptions', name: 'Student Subscriptions', icon: UserGroupIcon },
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
          <OverviewTab analytics={analytics} plans={plans} />
        )}

        {activeTab === 'plans' && (
          <PlansTab 
            plans={plans}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onCreatePlan={handleCreatePlan}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsTab subscriptions={subscriptions} />
        )}

        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab analytics={analytics} />
        )}

        {/* Create Plan Modal */}
        {showCreatePlan && (
          <CreatePlanModal
            onClose={() => setShowCreatePlan(false)}
            onCreatePlan={handleCreatePlan}
          />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics, plans }: { analytics: SubscriptionAnalytics; plans: SubscriptionPlan[] }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSubscriptions}</p>
              <p className="text-sm text-gray-600">Total Subscriptions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.activeSubscriptions}</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{analytics.monthlyRecurringRevenue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.churnRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Churn Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h2>
        <div className="space-y-3">
          {analytics.revenueByPlan.map((plan) => (
            <div key={plan.planId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{plan.planName}</p>
                <p className="text-xs text-gray-500">{plan.subscribers} subscribers</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">₹{plan.revenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Growth */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Growth</h2>
        <div className="space-y-3">
          {analytics.subscriptionGrowth.slice(-6).map((growth) => (
            <div key={growth.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{growth.period}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">+{growth.newSubscriptions}</span>
                <span className="text-sm text-gray-600">-{growth.cancellations}</span>
                <span className={`text-sm font-medium ${growth.netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.netGrowth >= 0 ? '+' : ''}{growth.netGrowth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Plans Tab Component
function PlansTab({ 
  plans, 
  selectedPlan, 
  onSelectPlan, 
  onCreatePlan 
}: {
  plans: SubscriptionPlan[];
  selectedPlan: string | null;
  onSelectPlan: (id: string | null) => void;
  onCreatePlan: (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || plan.type === filterType;
    return matchesSearch && matchesType;
  });

  const selectedPlanData = selectedPlan 
    ? plans.find(p => p.id === selectedPlan)
    : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Plans</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name or target..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="course">Course</option>
              <option value="degree">Degree</option>
              <option value="ksmp">KSMP</option>
              <option value="platform">Platform</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          {filteredPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectPlan(plan.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.targetName} • {plan.type}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-600">{plan.pricingModel}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{plan.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">{plan.currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Plan Details</h2>
          {selectedPlanData ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedPlanData.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{selectedPlanData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="text-gray-900">{selectedPlanData.targetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing Model:</span>
                      <span className="text-gray-900">{selectedPlanData.pricingModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-gray-900">₹{selectedPlanData.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{selectedPlanData.duration} {selectedPlanData.pricingModel === 'one_time' ? 'days' : 'months'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedPlanData.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Discounts</h4>
                  <div className="space-y-2 text-sm">
                    {selectedPlanData.earlyBirdDiscount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Early Bird:</span>
                        <span className="text-gray-900">{selectedPlanData.earlyBirdDiscount}%</span>
                      </div>
                    )}
                    {selectedPlanData.groupDiscount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group:</span>
                        <span className="text-gray-900">{selectedPlanData.groupDiscount}%</span>
                      </div>
                    )}
                    {selectedPlanData.discountPercentage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">General:</span>
                        <span className="text-gray-900">{selectedPlanData.discountPercentage}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PencilIcon className="h-4 w-4 mr-2 inline" />
                    Edit Plan
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <TrashIcon className="h-4 w-4 mr-2 inline" />
                    Delete Plan
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Plan</h3>
              <p className="text-gray-600">Choose a plan from the list to view detailed information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subscriptions Tab Component
function SubscriptionsTab({ subscriptions }: { subscriptions: StudentSubscription[] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Subscriptions</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by student name, plan, or email..."
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
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Subscriptions</h2>
        <div className="space-y-3">
          {filteredSubscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  subscription.status === 'active' ? 'bg-green-100' :
                  subscription.status === 'cancelled' ? 'bg-red-100' :
                  subscription.status === 'expired' ? 'bg-orange-100' :
                  'bg-gray-100'
                }`}>
                  <UserGroupIcon className={`h-5 w-5 ${
                    subscription.status === 'active' ? 'text-green-600' :
                    subscription.status === 'cancelled' ? 'text-red-600' :
                    subscription.status === 'expired' ? 'text-orange-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{subscription.studentName}</p>
                  <p className="text-xs text-gray-500">{subscription.planName}</p>
                  <p className="text-xs text-gray-500">{subscription.studentEmail}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">₹{subscription.totalPaid.toLocaleString('en-IN')}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${subscriptionService.getStatusColor(subscription.status)}`}>
                  {subscription.status}
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
function AnalyticsTab({ analytics }: { analytics: SubscriptionAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">₹{analytics.monthlyRecurringRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">₹{analytics.annualRecurringRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Annual Recurring Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">₹{analytics.averageRevenuePerUser.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Average Revenue Per User</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Subscriptions:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.totalSubscriptions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Subscriptions:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.activeSubscriptions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cancelled Subscriptions:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.cancelledSubscriptions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expired Subscriptions:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.expiredSubscriptions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Churn Rate:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.churnRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversion Rate:</span>
              <span className="text-sm font-medium text-gray-900">{analytics.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">MRR Growth:</span>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ARR Growth:</span>
              <span className="text-sm font-medium text-green-600">+15.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Plan Modal Component
function CreatePlanModal({ 
  onClose, 
  onCreatePlan 
}: {
  onClose: () => void;
  onCreatePlan: (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'course' as 'course' | 'degree' | 'ksmp' | 'platform',
    targetId: '',
    targetName: '',
    pricingModel: 'one_time' as 'one_time' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime',
    price: 0,
    currency: 'INR',
    duration: 0,
    features: [] as string[],
    isActive: true,
    maxStudents: undefined as number | undefined,
    discountPercentage: undefined as number | undefined,
    earlyBirdDiscount: undefined as number | undefined,
    groupDiscount: undefined as number | undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePlan(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Subscription Plan</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="course">Course</option>
                <option value="degree">Degree</option>
                <option value="ksmp">KSMP</option>
                <option value="platform">Platform</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target ID</label>
              <input
                type="text"
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Name</label>
              <input
                type="text"
                value={formData.targetName}
                onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model</label>
              <select
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="one_time">One Time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

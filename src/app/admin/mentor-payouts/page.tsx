'use client';

import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { mentorPayoutService, MentorPayout, RevenueShareCalculation, PayoutBatch, PayoutAnalytics, PayoutSettings } from '@/lib/mentorPayoutService';

export default function AdminMentorPayoutDashboard() {
  const [payouts, setPayouts] = useState<MentorPayout[]>([]);
  const [analytics, setAnalytics] = useState<PayoutAnalytics | null>(null);
  const [settings, setSettings] = useState<PayoutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'calculations' | 'batches' | 'settings'>('overview');
  const [selectedPayout, setSelectedPayout] = useState<MentorPayout | null>(null);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [calculationData, setCalculationData] = useState<RevenueShareCalculation | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [payoutsData, analyticsData, settingsData] = await Promise.all([
        mentorPayoutService.getMentorPayouts(),
        mentorPayoutService.getPayoutAnalytics(),
        mentorPayoutService.getPayoutSettings()
      ]);
      
      setPayouts(payoutsData);
      setAnalytics(analyticsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRevenueShare = async () => {
    if (!selectedMentor || !selectedPeriod) return;

    try {
      const calculation = await mentorPayoutService.calculateRevenueShare(selectedMentor, selectedPeriod);
      setCalculationData(calculation);
      setShowCalculationModal(true);
    } catch (error) {
      console.error('Error calculating revenue share:', error);
    }
  };

  const handleCreatePayout = async () => {
    if (!calculationData) return;

    try {
      const paymentDetails = {
        bankAccount: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          accountHolderName: calculationData.mentorName
        }
      };

      const payout = await mentorPayoutService.createMentorPayout(calculationData, 'bank_transfer', paymentDetails);
      setPayouts([...payouts, payout]);
      setShowCalculationModal(false);
      setShowPayoutModal(false);
      await loadData();
    } catch (error) {
      console.error('Error creating payout:', error);
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    try {
      const transactionId = `txn_${Date.now()}`;
      const success = await mentorPayoutService.processMentorPayout(payoutId, transactionId, 'admin_1');
      
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error processing payout:', error);
    }
  };

  const handleCreateBatch = async () => {
    try {
      const mentorIds = ['mentor_1', 'mentor_2', 'mentor_3']; // Mock mentor IDs
      const batch = await mentorPayoutService.createPayoutBatch(selectedPeriod, mentorIds, 'admin_1');
      setShowBatchModal(false);
      await loadData();
    } catch (error) {
      console.error('Error creating payout batch:', error);
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;

    try {
      const success = await mentorPayoutService.updatePayoutSettings(settings);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payout data...</p>
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
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mentor Payout System</h1>
                <p className="text-gray-600">Manage mentor payouts, revenue share calculations, and payment processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCalculationModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Calculate Revenue Share
              </button>
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Create Batch
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
                { id: 'payouts', name: 'Payouts', icon: BanknotesIcon },
                { id: 'calculations', name: 'Calculations', icon: CalculatorIcon },
                { id: 'batches', name: 'Batches', icon: DocumentTextIcon },
                { id: 'settings', name: 'Settings', icon: CogIcon }
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

        {activeTab === 'payouts' && (
          <PayoutsTab 
            payouts={payouts}
            onProcessPayout={handleProcessPayout}
            onSelectPayout={setSelectedPayout}
          />
        )}

        {activeTab === 'calculations' && (
          <CalculationsTab />
        )}

        {activeTab === 'batches' && (
          <BatchesTab />
        )}

        {activeTab === 'settings' && settings && (
          <SettingsTab 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* Revenue Share Calculation Modal */}
        {showCalculationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Calculate Revenue Share</h2>
                  <button
                    onClick={() => setShowCalculationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mentor</label>
                    <select
                      value={selectedMentor}
                      onChange={(e) => setSelectedMentor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Mentor</option>
                      <option value="mentor_1">John Doe</option>
                      <option value="mentor_2">Jane Smith</option>
                      <option value="mentor_3">Mike Johnson</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <input
                      type="month"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowCalculationModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCalculateRevenueShare}
                      disabled={!selectedMentor || !selectedPeriod}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Results Modal */}
        {calculationData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Revenue Share Calculation</h2>
                  <button
                    onClick={() => setCalculationData(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                      <p className="text-2xl font-bold text-blue-900">₹{calculationData.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-green-700">Mentor Earnings</p>
                      <p className="text-2xl font-bold text-green-900">₹{calculationData.mentorEarnings.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-orange-700">Platform Fee</p>
                      <p className="text-2xl font-bold text-orange-900">₹{calculationData.platformFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-purple-700">Net Amount</p>
                      <p className="text-2xl font-bold text-purple-900">₹{calculationData.netAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Breakdown</h3>
                    <div className="space-y-3">
                      {calculationData.courses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                            <p className="text-xs text-gray-500">{course.studentCount} students</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{course.mentorEarnings.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-500">{course.revenueSharePercentage}% share</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setCalculationData(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleCreatePayout}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create Payout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Creation Modal */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Create Payout Batch</h2>
                  <button
                    onClick={() => setShowBatchModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <input
                      type="month"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowBatchModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateBatch}
                      disabled={!selectedPeriod}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics }: { analytics: PayoutAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">₹{analytics.totalAmount.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600">Total Payouts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPayouts}</p>
              <p className="text-sm text-gray-600">Total Payouts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.completedPayouts}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.pendingPayouts}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Trends</h2>
        <div className="space-y-3">
          {analytics.payoutTrends.slice(-6).map((trend) => (
            <div key={trend.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{trend.period}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{trend.payouts} payouts</span>
                <span className="text-sm font-medium text-gray-900">₹{trend.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Share Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Share Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">₹{analytics.revenueShareAnalysis.totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹{analytics.revenueShareAnalysis.mentorRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-600">Mentor Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{analytics.revenueShareAnalysis.averageRevenueShare.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Average Share</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payouts Tab Component
function PayoutsTab({ 
  payouts, 
  onProcessPayout,
  onSelectPayout
}: {
  payouts: MentorPayout[];
  onProcessPayout: (id: string) => void;
  onSelectPayout: (payout: MentorPayout) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mentor Payouts</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {payouts.map((payout) => (
            <div key={payout.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    payout.status === 'completed' ? 'bg-green-100' :
                    payout.status === 'failed' ? 'bg-red-100' :
                    payout.status === 'pending' ? 'bg-yellow-100' :
                    payout.status === 'processing' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    <UserGroupIcon className={`h-6 w-6 ${
                      payout.status === 'completed' ? 'text-green-600' :
                      payout.status === 'failed' ? 'text-red-600' :
                      payout.status === 'pending' ? 'text-yellow-600' :
                      payout.status === 'processing' ? 'text-blue-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{payout.mentorName}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorPayoutService.getStatusColor(payout.status)}`}>
                        {payout.status}
                      </span>
                      <span className="text-sm text-gray-600">{payout.paymentMethod}</span>
                      <span className="text-sm text-gray-500">{mentorPayoutService.formatDate(payout.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Period: {payout.period}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">₹{payout.amount.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Net Amount</p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => onSelectPayout(payout)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    
                    {payout.status === 'pending' && (
                      <button
                        onClick={() => onProcessPayout(payout.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Process
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {payouts.length === 0 && (
          <div className="p-8 text-center">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payouts Found</h3>
            <p className="text-gray-600">No mentor payouts have been created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Calculations Tab Component
function CalculationsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Share Calculations</h2>
        <p className="text-gray-600">Use the "Calculate Revenue Share" button to calculate mentor earnings for a specific period.</p>
      </div>
    </div>
  );
}

// Batches Tab Component
function BatchesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Batches</h2>
        <p className="text-gray-600">Use the "Create Batch" button to create batch payouts for multiple mentors.</p>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ 
  settings, 
  onUpdateSettings 
}: {
  settings: PayoutSettings;
  onUpdateSettings: () => void;
}) {
  const [localSettings, setLocalSettings] = useState<PayoutSettings>(settings);

  const handleSave = () => {
    onUpdateSettings();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee Percentage</label>
            <input
              type="number"
              value={localSettings.platformFeePercentage}
              onChange={(e) => setLocalSettings({...localSettings, platformFeePercentage: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount</label>
            <input
              type="number"
              value={localSettings.minimumPayoutAmount}
              onChange={(e) => setLocalSettings({...localSettings, minimumPayoutAmount: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Percentage</label>
            <input
              type="number"
              value={localSettings.taxPercentage}
              onChange={(e) => setLocalSettings({...localSettings, taxPercentage: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Days</label>
            <input
              type="number"
              value={localSettings.processingDays}
              onChange={(e) => setLocalSettings({...localSettings, processingDays: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

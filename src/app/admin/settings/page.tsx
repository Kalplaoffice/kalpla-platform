'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  UserIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock settings data
  const settingsData = {
    general: {
      platformName: 'Kalpla EdTech Platform',
      platformDescription: 'Learn, grow, and succeed with Kalpla\'s comprehensive educational platform',
      contactEmail: 'admin@kalpla.com',
      supportEmail: 'support@kalpla.com',
      timezone: 'Asia/Kolkata',
      language: 'English',
      currency: 'INR'
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      loginAttempts: 5,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      sslEnabled: true,
      lastSecurityUpdate: '2024-01-20'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      userRegistrationAlerts: true,
      paymentAlerts: true,
      systemMaintenanceAlerts: true
    },
    integrations: {
      payuEnabled: true,
      payuMerchantKey: 'J7JOvh',
      payuMerchantSalt: 'a2bo9K3otgyaleULdXEQC8LWMCK04BP2',
      emailService: 'AWS SES',
      storageService: 'AWS S3',
      analyticsService: 'Google Analytics'
    },
    maintenance: {
      maintenanceMode: false,
      scheduledMaintenance: '2024-02-15T02:00:00Z',
      autoBackup: true,
      backupFrequency: 'daily',
      lastBackup: '2024-01-22T03:00:00Z'
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon },
    { id: 'maintenance', name: 'Maintenance', icon: DocumentTextIcon }
  ];

  const handleSaveSettings = (section: string) => {
    // Mock save functionality
    console.log(`Saving ${section} settings...`);
    // In a real app, this would make an API call to save the settings
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings & Security</h1>
                <p className="text-gray-600 mt-1">Configure platform settings, security, and integrations</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

          {/* Settings Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue={settingsData.general.platformName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue={settingsData.general.contactEmail}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
                    <textarea
                      rows={3}
                      defaultValue={settingsData.general.platformDescription}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('general')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save General Settings
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">SSL/TLS Encryption</h4>
                          <p className="text-sm text-gray-500">Enable HTTPS for all connections</p>
                        </div>
                        <div className="flex items-center">
                          {settingsData.security.sslEnabled ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          defaultValue={settingsData.security.sessionTimeout}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          defaultValue={settingsData.security.loginAttempts}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
                    <textarea
                      rows={3}
                      defaultValue={settingsData.security.ipWhitelist.join('\n')}
                      placeholder="Enter IP addresses or CIDR blocks, one per line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Last security update: {settingsData.security.lastSecurityUpdate}. 
                          Ensure all security patches are up to date.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('security')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Send notifications via email</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-500">Send notifications via SMS</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-500">Send browser push notifications</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Admin Alerts</h4>
                          <p className="text-sm text-gray-500">Notify admins of system events</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.adminAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.adminAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">User Registration Alerts</h4>
                          <p className="text-sm text-gray-500">Notify when new users register</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.userRegistrationAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.userRegistrationAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Alerts</h4>
                          <p className="text-sm text-gray-500">Notify of payment events</p>
                        </div>
                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.notifications.paymentAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.notifications.paymentAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('notifications')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h3>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Payment Gateway (PayU)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Key</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            defaultValue={settingsData.integrations.payuMerchantKey}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Salt</label>
                        <input
                          type="password"
                          defaultValue={settingsData.integrations.payuMerchantSalt}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-green-600">PayU integration is active</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Email Service</h4>
                      <p className="text-sm text-gray-600">{settingsData.integrations.emailService}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Storage Service</h4>
                      <p className="text-sm text-gray-600">{settingsData.integrations.storageService}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Analytics Service</h4>
                      <p className="text-sm text-gray-600">{settingsData.integrations.analyticsService}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings('integrations')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Integration Settings
                  </button>
                </div>
              </div>
            )}

            {/* Maintenance Settings */}
            {activeTab === 'maintenance' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
                    </div>
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.maintenance.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.maintenance.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Maintenance</label>
                      <input
                        type="datetime-local"
                        defaultValue={settingsData.maintenance.scheduledMaintenance}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                      <p className="text-sm text-gray-500">Automatically backup system data</p>
                    </div>
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.maintenance.autoBackup ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.maintenance.autoBackup ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Backup Status</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Last backup: {settingsData.maintenance.lastBackup}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Test Backup
                  </button>
                  <button
                    onClick={() => handleSaveSettings('maintenance')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Maintenance Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

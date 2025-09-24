'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser, updateUserAttributes, signOut } from 'aws-amplify/auth';

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  department: string;
  permissions: string[];
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
  adminStats: {
    totalUsers: number;
    activeCourses: number;
    totalRevenue: number;
    pendingApprovals: number;
  };
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: ''
  });

  const adminPermissions = [
    'User Management',
    'Course Approval',
    'Mentor Approval',
    'Investor Approval',
    'Payment Management',
    'Analytics Access',
    'System Settings',
    'Content Moderation'
  ];

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user from Cognito
      const currentUser = await getCurrentUser();
      const attributes = currentUser.attributes;

      // Mock admin profile data
      const mockProfile: AdminProfile = {
        id: currentUser.username,
        email: attributes.email || '',
        name: attributes.name || attributes.email?.split('@')[0] || 'Admin',
        phone: attributes.phone_number || '',
        role: 'Super Admin',
        department: 'Operations',
        permissions: ['User Management', 'Course Approval', 'Mentor Approval', 'Payment Management', 'Analytics Access'],
        profilePicture: attributes.picture || '',
        createdAt: attributes.created_at || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        adminStats: {
          totalUsers: 1250,
          activeCourses: 45,
          totalRevenue: 125000,
          pendingApprovals: 12
        }
      };

      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        phone: mockProfile.phone || '',
        department: mockProfile.department
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Update Cognito attributes
      const currentUser = await getCurrentUser();
      await updateUserAttributes(currentUser, {
        name: formData.name,
        phone_number: formData.phone,
        'custom:department': formData.department
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchAdminProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Reset form data to original values
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
        department: profile.department
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600">Manage your admin profile and system access</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {profile.role}
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-center bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    profile.name
                  )}
                </h2>
                
                <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  {profile.role}
                </div>

                <div className="flex items-center justify-center text-sm text-blue-600 mb-4">
                  <span className="font-medium">
                    {isEditing ? (
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="text-center bg-transparent border-b border-blue-500 focus:outline-none"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Technology">Technology</option>
                        <option value="Content">Content</option>
                        <option value="Finance">Finance</option>
                      </select>
                    ) : (
                      profile.department
                    )}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center justify-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Total Users</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.adminStats.totalUsers.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Active Courses</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.adminStats.activeCourses}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${profile.adminStats.totalRevenue.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm text-gray-600">Pending Approvals</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.adminStats.pendingApprovals}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/auth/forgot-password')}
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Administrative Information</h3>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrative Permissions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {adminPermissions.map((permission) => (
                      <div
                        key={permission}
                        className={`p-3 rounded-lg border ${
                          profile.permissions.includes(permission)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <CheckIcon className={`h-4 w-4 mr-2 ${
                            profile.permissions.includes(permission)
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            profile.permissions.includes(permission)
                              ? 'text-green-800'
                              : 'text-gray-600'
                          }`}>
                            {permission}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Information */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Admin since:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last login:</span>
                      <span className="ml-2 text-gray-900">
                        {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => router.push('/admin/users')}
                      className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
                    >
                      <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Manage Users</div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/admin/approvals')}
                      className="p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-center"
                    >
                      <ClockIcon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Pending Approvals</div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/admin/payments')}
                      className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center"
                    >
                      <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Payment Management</div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/admin/dashboard')}
                      className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center"
                    >
                      <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Analytics</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

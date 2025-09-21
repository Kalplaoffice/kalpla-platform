'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser, updateUserAttributes } from 'aws-amplify/auth';

interface InvestorProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company: string;
  title: string;
  investmentFocus: string[];
  investmentRange: string;
  portfolioSize: number;
  yearsExperience: string;
  linkedin?: string;
  website?: string;
  profilePicture?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  contactInfo: {
    address?: string;
    city?: string;
    country?: string;
    timezone?: string;
  };
  preferences: {
    sectors: string[];
    stages: string[];
    notifications: boolean;
    demoDayAlerts: boolean;
  };
  createdAt: string;
}

export default function InvestorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    title: '',
    investmentFocus: '',
    investmentRange: '',
    portfolioSize: '',
    yearsExperience: '',
    linkedin: '',
    website: '',
    address: '',
    city: '',
    country: '',
    timezone: '',
    sectors: '',
    stages: ''
  });

  const investmentFocusOptions = [
    'Early Stage', 'Growth Stage', 'Late Stage', 'Acquisition', 
    'Angel Investing', 'Venture Capital', 'Private Equity', 'Corporate VC'
  ];

  const sectorOptions = [
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'SaaS', 
    'AI/ML', 'CleanTech', 'EdTech', 'Biotech', 'Cybersecurity'
  ];

  const stageOptions = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'
  ];

  useEffect(() => {
    fetchInvestorProfile();
  }, []);

  const fetchInvestorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user from Cognito
      const currentUser = await Auth.currentAuthenticatedUser();
      const attributes = currentUser.attributes;

      // Mock investor profile data
      const mockProfile: InvestorProfile = {
        id: currentUser.username,
        email: attributes.email || '',
        name: attributes.name || attributes.email?.split('@')[0] || 'Investor',
        phone: attributes.phone_number || '',
        company: 'VentureCapital Partners',
        title: 'Investment Partner',
        investmentFocus: ['Early Stage', 'Venture Capital', 'Technology'],
        investmentRange: '$100K - $2M',
        portfolioSize: 25,
        yearsExperience: '10+ years',
        linkedin: 'https://linkedin.com/in/investor',
        website: 'https://vcpartners.com',
        profilePicture: attributes.picture || '',
        approvalStatus: 'approved',
        approvalDate: '2024-01-15',
        contactInfo: {
          address: '123 Investment Street',
          city: 'San Francisco',
          country: 'United States',
          timezone: 'PST'
        },
        preferences: {
          sectors: ['Technology', 'Fintech', 'AI/ML'],
          stages: ['Seed', 'Series A'],
          notifications: true,
          demoDayAlerts: true
        },
        createdAt: attributes.created_at || new Date().toISOString()
      };

      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        phone: mockProfile.phone || '',
        company: mockProfile.company,
        title: mockProfile.title,
        investmentFocus: mockProfile.investmentFocus.join(', '),
        investmentRange: mockProfile.investmentRange,
        portfolioSize: mockProfile.portfolioSize.toString(),
        yearsExperience: mockProfile.yearsExperience,
        linkedin: mockProfile.linkedin || '',
        website: mockProfile.website || '',
        address: mockProfile.contactInfo.address || '',
        city: mockProfile.contactInfo.city || '',
        country: mockProfile.contactInfo.country || '',
        timezone: mockProfile.contactInfo.timezone || '',
        sectors: mockProfile.preferences.sectors.join(', '),
        stages: mockProfile.preferences.stages.join(', ')
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Update Cognito attributes
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(currentUser, {
        name: formData.name,
        phone_number: formData.phone,
        'custom:company': formData.company,
        'custom:title': formData.title,
        'custom:investmentFocus': formData.investmentFocus,
        'custom:investmentRange': formData.investmentRange,
        'custom:portfolioSize': formData.portfolioSize,
        'custom:yearsExperience': formData.yearsExperience,
        'custom:linkedin': formData.linkedin,
        'custom:website': formData.website,
        'custom:address': formData.address,
        'custom:city': formData.city,
        'custom:country': formData.country,
        'custom:timezone': formData.timezone,
        'custom:sectors': formData.sectors,
        'custom:stages': formData.stages
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchInvestorProfile();
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
        company: profile.company,
        title: profile.title,
        investmentFocus: profile.investmentFocus.join(', '),
        investmentRange: profile.investmentRange,
        portfolioSize: profile.portfolioSize.toString(),
        yearsExperience: profile.yearsExperience,
        linkedin: profile.linkedin || '',
        website: profile.website || '',
        address: profile.contactInfo.address || '',
        city: profile.contactInfo.city || '',
        country: profile.contactInfo.country || '',
        timezone: profile.contactInfo.timezone || '',
        sectors: profile.preferences.sectors.join(', '),
        stages: profile.preferences.stages.join(', ')
      });
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
              <h1 className="text-2xl font-bold text-gray-900">Investor Profile</h1>
              <p className="text-gray-600">Manage your investor profile and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.approvalStatus === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : profile.approvalStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
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
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="text-center bg-transparent border-b border-blue-500 focus:outline-none"
                      placeholder="Title"
                    />
                  ) : (
                    profile.title
                  )}
                </div>

                <div className="flex items-center justify-center text-sm text-blue-600 mb-4">
                  <span className="font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="text-center bg-transparent border-b border-blue-500 focus:outline-none"
                        placeholder="Company"
                      />
                    ) : (
                      profile.company
                    )}
                  </span>
                </div>

                {/* Investment Stats */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.portfolioSize}</div>
                      <div className="text-gray-600">Portfolio</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.investmentRange}</div>
                      <div className="text-gray-600">Range</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{profile.yearsExperience}</div>
                    <div className="text-xs text-gray-600">Experience</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.approvalStatus === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : profile.approvalStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
                  </span>
                </div>
                {profile.approvalDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approved:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(profile.approvalDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member since:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Information</h3>
              
              <div className="space-y-6">
                {/* Investment Focus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Focus
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="investmentFocus"
                      value={formData.investmentFocus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Early Stage, Venture Capital, Technology..."
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.investmentFocus.map((focus) => (
                        <span
                          key={focus}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Investment Range and Portfolio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Range
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="investmentRange"
                        value={formData.investmentRange}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="$100K - $2M"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.investmentRange}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Size
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="portfolioSize"
                        value={formData.portfolioSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="25"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.portfolioSize} companies</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Sectors and Stages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Sectors
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="sectors"
                        value={formData.sectors}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Technology, Fintech, AI/ML..."
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences.sectors.map((sector) => (
                          <span
                            key={sector}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Stages
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="stages"
                        value={formData.stages}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seed, Series A..."
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences.stages.map((stage) => (
                          <span
                            key={stage}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {profile.linkedin || 'Not provided'}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://company.com"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {profile.website || 'Not provided'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="San Francisco"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.contactInfo.city || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="United States"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.contactInfo.country || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PST"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.contactInfo.timezone || 'Not provided'}</span>
                      </div>
                    )}
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

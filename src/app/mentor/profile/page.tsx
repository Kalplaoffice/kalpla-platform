'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  AcademicCapIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser, updateUserAttributes } from 'aws-amplify/auth';

interface MentorProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio: string;
  expertise: string[];
  ksmpPhases: number[];
  experience: string;
  company: string;
  title: string;
  linkedin?: string;
  portfolio?: string;
  languages: string[];
  profilePicture?: string;
  rating: number;
  mentees: number;
  sessions: number;
  specialties: string[];
  createdAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export default function MentorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    expertise: '',
    experience: '',
    company: '',
    title: '',
    linkedin: '',
    portfolio: '',
    languages: '',
    specialties: ''
  });

  const expertiseOptions = [
    'Technology', 'Business Strategy', 'Marketing', 'Finance', 
    'Product Development', 'Operations', 'Leadership', 'Sales', 'Legal'
  ];

  const ksmpPhaseOptions = [
    { value: 1, label: 'Phase 1-3: Foundation' },
    { value: 2, label: 'Phase 4-6: Development' },
    { value: 3, label: 'Phase 7-9: Growth' },
    { value: 4, label: 'Phase 10-12: Scale' }
  ];

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  const fetchMentorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user from Cognito
      const currentUser = await Auth.currentAuthenticatedUser();
      const attributes = currentUser.attributes;

      // Mock mentor profile data
      const mockProfile: MentorProfile = {
        id: currentUser.username,
        email: attributes.email || '',
        name: attributes.name || attributes.email?.split('@')[0] || 'Mentor',
        phone: attributes.phone_number || '',
        bio: attributes['custom:bio'] || 'Experienced mentor passionate about helping entrepreneurs succeed.',
        expertise: ['Technology', 'Business Strategy', 'Leadership'],
        ksmpPhases: [1, 2],
        experience: '15+ years',
        company: 'TechInnovate Inc.',
        title: 'CEO & Founder',
        linkedin: 'https://linkedin.com/in/mentor',
        portfolio: 'https://mentor.com',
        languages: ['English', 'Spanish'],
        profilePicture: attributes.picture || '',
        rating: 4.8,
        mentees: 45,
        sessions: 120,
        specialties: ['SaaS', 'AI/ML', 'Product Strategy', 'Team Building'],
        createdAt: attributes.created_at || new Date().toISOString(),
        approvalStatus: 'approved'
      };

      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        phone: mockProfile.phone || '',
        bio: mockProfile.bio,
        expertise: mockProfile.expertise.join(', '),
        experience: mockProfile.experience,
        company: mockProfile.company,
        title: mockProfile.title,
        linkedin: mockProfile.linkedin || '',
        portfolio: mockProfile.portfolio || '',
        languages: mockProfile.languages.join(', '),
        specialties: mockProfile.specialties.join(', ')
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        'custom:bio': formData.bio,
        'custom:expertise': formData.expertise,
        'custom:experience': formData.experience,
        'custom:company': formData.company,
        'custom:title': formData.title,
        'custom:linkedin': formData.linkedin,
        'custom:portfolio': formData.portfolio,
        'custom:languages': formData.languages,
        'custom:specialties': formData.specialties
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchMentorProfile();
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
        bio: profile.bio,
        expertise: profile.expertise.join(', '),
        experience: profile.experience,
        company: profile.company,
        title: profile.title,
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        languages: profile.languages.join(', '),
        specialties: profile.specialties.join(', ')
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
              <h1 className="text-2xl font-bold text-gray-900">Mentor Profile</h1>
              <p className="text-gray-600">Manage your mentor profile and expertise</p>
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

                {/* Rating and Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{profile.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">rating</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.mentees}</div>
                      <div className="text-gray-600">Mentees</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.sessions}</div>
                      <div className="text-gray-600">Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KSMP Phase Assignment */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">KSMP Phase Assignment</h3>
              <div className="space-y-2">
                {ksmpPhaseOptions.map((phase) => (
                  <div
                    key={phase.value}
                    className={`p-3 rounded-lg border ${
                      profile.ksmpPhases.includes(phase.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{phase.label}</span>
                      {profile.ksmpPhases.includes(phase.value) && (
                        <CheckIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
              
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your background and expertise..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{profile.bio}</p>
                    </div>
                  )}
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Technology, Business Strategy, Marketing..."
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="specialties"
                      value={formData.specialties}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SaaS, AI/ML, Product Strategy..."
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience and Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15+ years"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.experience}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="English, Spanish..."
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                          >
                            {lang}
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
                      Portfolio Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {profile.portfolio || 'Not provided'}
                        </a>
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
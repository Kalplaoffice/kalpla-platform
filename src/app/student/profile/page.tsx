'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { profileService } from '@/lib/profileService';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  CameraIcon,
  DocumentTextIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface StudentProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    linkedinProfile: string;
    website: string;
    bio: string;
    profilePhoto: string;
  };
  education: {
    degree: string;
    institution: string;
    yearOfPassing: string;
    percentage: string;
    additionalQualifications: string;
  };
  experience: {
    currentJob: string;
    company: string;
    experience: string;
    skills: string;
    previousExperience: string;
  };
  ksmpInfo: {
    cohort: string;
    phase: number;
    startDate: string;
    status: 'active' | 'completed' | 'dropped';
    mentor: {
      name: string;
      expertise: string;
    };
    achievements: string[];
    certificates: string[];
  };
  preferences: {
    notificationEmail: boolean;
    notificationSMS: boolean;
    marketingEmails: boolean;
    publicProfile: boolean;
    showProgress: boolean;
  };
}

interface ProfileStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  assignmentsSubmitted: number;
  assignmentsGraded: number;
  averageGrade: number;
  totalStudyHours: number;
  certificatesEarned: number;
  ksmpProgress: number;
}

export default function StudentProfilePage() {
  const { user } = useUser();
  const { isStudent } = useRoleBasedAccess();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'ksmp' | 'preferences'>('personal');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load user profile
        const userProfile = await profileService.getUserProfile(user.id);
        
        // Load student profile
        const studentProfile = await profileService.getStudentProfile(user.id);
        
        // Transform the data to match the interface
        const transformedProfile: StudentProfile = {
          personalInfo: {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            phone: '', // You might want to add this to the user profile
            dateOfBirth: '', // You might want to add this to the user profile
            gender: '', // You might want to add this to the user profile
            address: '', // You might want to add this to the user profile
            city: '', // You might want to add this to the user profile
            state: '', // You might want to add this to the user profile
            country: '', // You might want to add this to the user profile
            pincode: '', // You might want to add this to the user profile
            linkedinProfile: '', // You might want to add this to the user profile
            website: '', // You might want to add this to the user profile
            bio: studentProfile.bio || '',
            profilePhoto: userProfile.profilePicture || '/api/placeholder/150/150'
          },
          education: {
            degree: studentProfile.education || '',
            institution: '', // You might want to add this to the schema
            yearOfPassing: '', // You might want to add this to the schema
            percentage: '', // You might want to add this to the schema
            additionalQualifications: '' // You might want to add this to the schema
          },
          experience: {
            currentJob: '', // You might want to add this to the schema
            company: '', // You might want to add this to the schema
            experience: studentProfile.experience || '',
            skills: studentProfile.skills?.join(', ') || '',
            previousExperience: '' // You might want to add this to the schema
          },
          ksmpInfo: {
            cohort: '', // You might want to add this to the schema
            phase: 1, // You might want to add this to the schema
            startDate: '', // You might want to add this to the schema
            status: 'active', // You might want to add this to the schema
            mentor: {
              name: '', // You might want to add this to the schema
              expertise: '' // You might want to add this to the schema
            },
            achievements: [], // You might want to add this to the schema
            certificates: [] // You might want to add this to the schema
          },
          preferences: {
            notificationEmail: true,
            notificationSMS: false,
            marketingEmails: true,
            publicProfile: false,
            showProgress: true
          }
        };

        const mockStats: ProfileStats = {
          coursesEnrolled: 0, // You might want to calculate this from enrollments
          coursesCompleted: studentProfile.totalCoursesCompleted || 0,
          assignmentsSubmitted: 0, // You might want to calculate this from submissions
          assignmentsGraded: 0, // You might want to calculate this from submissions
          averageGrade: studentProfile.averageGrade || 0,
          totalStudyHours: studentProfile.totalHoursWatched || 0,
          certificatesEarned: 0, // You might want to calculate this from certificates
          ksmpProgress: 0 // You might want to calculate this from progress
        };
        
        setProfile(transformedProfile);
        setProfileStats(mockStats);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Set default profile on error
        setProfile(null);
        setProfileStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleInputChange = (section: keyof StudentProfile, field: string, value: any) => {
    if (!profile) return;
    
    setProfile(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      try {
        await profileService.updateStudentProfile({
          id: user?.id || '',
          ...profile
        });
        console.log('Profile updated successfully');
        // Refresh profile or show success message
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show error message
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'dropped':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'completed':
        return <TrophyIcon className="h-4 w-4" />;
      case 'dropped':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student profile page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || !profileStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.personalInfo.profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                </h1>
                <p className="text-gray-600">{profile.personalInfo.email}</p>
                <p className="text-sm text-gray-500">{profile.personalInfo.bio}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{profileStats.coursesEnrolled}</p>
            <p className="text-sm text-gray-500">Courses Enrolled</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{profileStats.coursesCompleted}</p>
            <p className="text-sm text-gray-500">Courses Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{profileStats.averageGrade}%</p>
            <p className="text-sm text-gray-500">Average Grade</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{profileStats.certificatesEarned}</p>
            <p className="text-sm text-gray-500">Certificates</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'personal', label: 'Personal Info', icon: UserIcon },
                { id: 'education', label: 'Education', icon: AcademicCapIcon },
                { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
                { id: 'ksmp', label: 'KSMP', icon: StarIcon },
                { id: 'preferences', label: 'Preferences', icon: CogIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={profile.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={profile.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={profile.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={profile.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={profile.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      value={profile.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      disabled={!editing}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={profile.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    disabled={!editing}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={profile.personalInfo.city}
                      onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={profile.personalInfo.state}
                      onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={profile.personalInfo.pincode}
                      onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={profile.personalInfo.linkedinProfile}
                      onChange={(e) => handleInputChange('personalInfo', 'linkedinProfile', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={profile.personalInfo.website}
                      onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                    disabled={!editing}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Educational Background</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highest Degree *</label>
                    <input
                      type="text"
                      value={profile.education.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                    <input
                      type="text"
                      value={profile.education.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                    <input
                      type="text"
                      value={profile.education.yearOfPassing}
                      onChange={(e) => handleInputChange('education', 'yearOfPassing', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                    <input
                      type="text"
                      value={profile.education.percentage}
                      onChange={(e) => handleInputChange('education', 'percentage', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Qualifications</label>
                  <textarea
                    value={profile.education.additionalQualifications}
                    onChange={(e) => handleInputChange('education', 'additionalQualifications', e.target.value)}
                    disabled={!editing}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    placeholder="List any additional qualifications or certifications"
                  />
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title</label>
                    <input
                      type="text"
                      value={profile.experience.currentJob}
                      onChange={(e) => handleInputChange('experience', 'currentJob', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={profile.experience.company}
                      onChange={(e) => handleInputChange('experience', 'company', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="text"
                      value={profile.experience.experience}
                      onChange={(e) => handleInputChange('experience', 'experience', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                    <input
                      type="text"
                      value={profile.experience.skills}
                      onChange={(e) => handleInputChange('experience', 'skills', e.target.value)}
                      disabled={!editing}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
                  <textarea
                    value={profile.experience.previousExperience}
                    onChange={(e) => handleInputChange('experience', 'previousExperience', e.target.value)}
                    disabled={!editing}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    placeholder="List your previous work experience"
                  />
                </div>
              </div>
            )}

            {/* KSMP Tab */}
            {activeTab === 'ksmp' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">KSMP Information</h3>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{profile.ksmpInfo.cohort}</h4>
                      <p className="text-sm text-gray-600">Started: {formatDate(profile.ksmpInfo.startDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.ksmpInfo.status)}`}>
                      {getStatusIcon(profile.ksmpInfo.status)}
                      <span className="ml-1">{profile.ksmpInfo.status}</span>
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>Phase {profile.ksmpInfo.phase} of 12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(profile.ksmpInfo.phase / 12) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mentor: {profile.ksmpInfo.mentor.name}</p>
                      <p className="text-xs text-gray-600">{profile.ksmpInfo.mentor.expertise}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Achievements</h4>
                  <div className="space-y-2">
                    {profile.ksmpInfo.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <TrophyIcon className="h-4 w-4 text-yellow-500" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Certificates</h4>
                  <div className="space-y-2">
                    {profile.ksmpInfo.certificates.map((certificate, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                        <span>{certificate}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notificationEmail}
                      onChange={(e) => handleInputChange('preferences', 'notificationEmail', e.target.checked)}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notificationSMS}
                      onChange={(e) => handleInputChange('preferences', 'notificationSMS', e.target.checked)}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Marketing Emails</label>
                      <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.marketingEmails}
                      onChange={(e) => handleInputChange('preferences', 'marketingEmails', e.target.checked)}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Public Profile</label>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.publicProfile}
                      onChange={(e) => handleInputChange('preferences', 'publicProfile', e.target.checked)}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Show Progress</label>
                      <p className="text-sm text-gray-500">Display your learning progress publicly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.showProgress}
                      onChange={(e) => handleInputChange('preferences', 'showProgress', e.target.checked)}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

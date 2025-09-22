'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function MentorsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);

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

  // Mock data for mentors
  const mentors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+91 98765 43220',
      status: 'active',
      specialization: 'Business Strategy',
      experience: '15+ years',
      company: 'TechInnovate Inc.',
      rating: 4.9,
      studentsMentored: 120,
      coursesCreated: 8,
      joinDate: '2023-06-15',
      lastActive: '2024-01-22',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      achievements: ['Ex-Google', 'Y Combinator Alum', 'Forbes 30 Under 30']
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'michael@example.com',
      phone: '+91 98765 43221',
      status: 'active',
      specialization: 'Data Science',
      experience: '12+ years',
      company: 'DataCorp Solutions',
      rating: 4.8,
      studentsMentored: 95,
      coursesCreated: 6,
      joinDate: '2023-08-20',
      lastActive: '2024-01-21',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      achievements: ['PhD Stanford', 'Kaggle Grandmaster', 'Published Author']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+91 98765 43222',
      status: 'pending',
      specialization: 'UX Design',
      experience: '10+ years',
      company: 'DesignStudio Pro',
      rating: 0,
      studentsMentored: 0,
      coursesCreated: 0,
      joinDate: '2024-01-15',
      lastActive: '2024-01-15',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      achievements: ['Apple Design Award', 'Dribbble Top Designer']
    },
    {
      id: '4',
      name: 'Mr. David Kumar',
      email: 'david@example.com',
      phone: '+91 98765 43223',
      status: 'inactive',
      specialization: 'Web Development',
      experience: '8+ years',
      company: 'WebCraft Ltd.',
      rating: 4.6,
      studentsMentored: 75,
      coursesCreated: 4,
      joinDate: '2023-05-10',
      lastActive: '2023-12-15',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      achievements: ['Open Source Contributor', 'Tech Speaker']
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || mentor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive': return <XCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleSelectAll = () => {
    if (selectedMentors.length === filteredMentors.length) {
      setSelectedMentors([]);
    } else {
      setSelectedMentors(filteredMentors.map(mentor => mentor.id));
    }
  };

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentors(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Mentors Management</h1>
                <p className="text-gray-600 mt-1">Manage mentor profiles, specializations, and performance</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Mentors</p>
                    <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                    <p className="text-2xl font-bold text-gray-900">{mentors.filter(m => m.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">{mentors.filter(m => m.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <StarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mentors.filter(m => m.rating > 0).length > 0 
                        ? (mentors.filter(m => m.rating > 0).reduce((acc, m) => acc + m.rating, 0) / mentors.filter(m => m.rating > 0).length).toFixed(1)
                        : '0.0'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Add Mentor
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={mentor.profileImage}
                      alt={mentor.name}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.specialization}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mentor.status)}`}>
                          {getStatusIcon(mentor.status)}
                          <span className="ml-1 capitalize">{mentor.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      <span>{mentor.company}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      <span>{mentor.experience}</span>
                    </div>
                    {mentor.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 mr-2 text-yellow-400" />
                        <span>{mentor.rating}/5.0 rating</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{mentor.studentsMentored}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{mentor.coursesCreated}</p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  {mentor.achievements.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Achievements</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.achievements.slice(0, 2).map((achievement, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {achievement}
                          </span>
                        ))}
                        {mentor.achievements.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{mentor.achievements.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first mentor.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Mentor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

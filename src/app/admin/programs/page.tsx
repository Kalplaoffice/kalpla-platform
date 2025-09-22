'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function ProgramsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Mock data for programs and investors
  const programs = [
    {
      id: 'PROG_001',
      name: 'TechCorp Ventures Partnership',
      type: 'corporate_partnership',
      status: 'active',
      partner: 'TechCorp Ventures',
      partnerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      investmentAmount: 5000000,
      equity: 15,
      startDate: '2023-06-01',
      endDate: '2025-06-01',
      description: 'Strategic partnership for EdTech platform development and market expansion.',
      benefits: ['Technology Integration', 'Market Access', 'Mentorship', 'Funding'],
      studentsSupported: 150,
      mentorsProvided: 8,
      coursesCreated: 12,
      successRate: 85,
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@techcorp.com',
      contactPhone: '+1 555-0123',
      location: 'San Francisco, CA',
      website: 'techcorp.com',
      createdAt: '2023-05-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'PROG_002',
      name: 'SeedFund Accelerator Program',
      type: 'accelerator',
      status: 'active',
      partner: 'SeedFund Partners',
      partnerLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
      investmentAmount: 2000000,
      equity: 8,
      startDate: '2023-09-01',
      endDate: '2024-09-01',
      description: 'Early-stage accelerator program focusing on EdTech startups and innovation.',
      benefits: ['Seed Funding', 'Mentorship', 'Networking', 'Demo Day Access'],
      studentsSupported: 75,
      mentorsProvided: 5,
      coursesCreated: 6,
      successRate: 78,
      contactPerson: 'Michael Chen',
      contactEmail: 'michael@seedfund.com',
      contactPhone: '+1 555-0124',
      location: 'New York, NY',
      website: 'seedfund.com',
      createdAt: '2023-08-01',
      updatedAt: '2024-01-18'
    },
    {
      id: 'PROG_003',
      name: 'Angel Investor Network',
      type: 'angel_network',
      status: 'active',
      partner: 'Angel Network India',
      partnerLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      investmentAmount: 1000000,
      equity: 5,
      startDate: '2023-12-01',
      endDate: '2024-12-01',
      description: 'Network of angel investors supporting innovative EdTech solutions.',
      benefits: ['Angel Funding', 'Industry Expertise', 'Market Validation', 'Growth Support'],
      studentsSupported: 50,
      mentorsProvided: 12,
      coursesCreated: 8,
      successRate: 82,
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'rajesh@angelnetwork.in',
      contactPhone: '+91 98765 43210',
      location: 'Bangalore, India',
      website: 'angelnetwork.in',
      createdAt: '2023-11-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'PROG_004',
      name: 'Government EdTech Initiative',
      type: 'government_grant',
      status: 'pending',
      partner: 'Ministry of Education',
      partnerLogo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&h=100&fit=crop',
      investmentAmount: 10000000,
      equity: 0,
      startDate: '2024-03-01',
      endDate: '2026-03-01',
      description: 'Government initiative to promote digital education and skill development.',
      benefits: ['Grant Funding', 'Policy Support', 'Public Sector Access', 'Scale Opportunities'],
      studentsSupported: 0,
      mentorsProvided: 0,
      coursesCreated: 0,
      successRate: 0,
      contactPerson: 'Dr. Priya Sharma',
      contactEmail: 'priya@education.gov.in',
      contactPhone: '+91 11 2345 6789',
      location: 'New Delhi, India',
      website: 'education.gov.in',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-22'
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'corporate_partnership': return 'text-blue-600 bg-blue-100';
      case 'accelerator': return 'text-green-600 bg-green-100';
      case 'angel_network': return 'text-purple-600 bg-purple-100';
      case 'government_grant': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Programs & Investors</h1>
                <p className="text-gray-600 mt-1">Manage strategic partnerships, investor relationships, and funding programs</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{programs.filter(p => p.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Investment</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(programs.reduce((acc, p) => acc + p.investmentAmount, 0))}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students Supported</p>
                    <p className="text-2xl font-bold text-gray-900">{programs.reduce((acc, p) => acc + p.studentsSupported, 0)}</p>
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
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="corporate_partnership">Corporate Partnership</option>
                  <option value="accelerator">Accelerator</option>
                  <option value="angel_network">Angel Network</option>
                  <option value="government_grant">Government Grant</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Program
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={program.partnerLogo}
                        alt={program.partner}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-600">{program.partner}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
                        {program.type.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                        {getStatusIcon(program.status)}
                        <span className="ml-1 capitalize">{program.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(program.investmentAmount)}</p>
                      <p className="text-xs text-blue-600">Investment</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{program.equity}%</p>
                      <p className="text-xs text-green-600">Equity</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Benefits</p>
                      <div className="flex flex-wrap gap-1">
                        {program.benefits.map((benefit, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">Start Date</p>
                          <p>{formatDate(program.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">End Date</p>
                          <p>{formatDate(program.endDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{program.studentsSupported}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{program.mentorsProvided}</p>
                        <p className="text-xs text-gray-600">Mentors</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{program.successRate}%</p>
                        <p className="text-xs text-gray-600">Success Rate</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900 mb-2">Contact Information</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <BriefcaseIcon className="h-4 w-4 mr-2" />
                          <span>{program.contactPerson}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <GlobeAltIcon className="h-4 w-4 mr-2" />
                          <span>{program.website}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                      <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No programs have been created yet.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create First Program
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
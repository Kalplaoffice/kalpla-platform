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
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon,
  BanknotesIcon,
  TrendingUpIcon,
  UsersIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function KSMPCohortsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

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

  // Mock data for KSMP cohorts
  const cohorts = [
    {
      id: 'COHORT_2024_02',
      name: 'Cohort 2024-02',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      duration: '6 months',
      maxParticipants: 50,
      currentParticipants: 32,
      applicationsReceived: 150,
      applicationsApproved: 35,
      applicationsRejected: 115,
      location: 'Hybrid (Online + Bangalore)',
      programManager: 'Dr. Sarah Johnson',
      programManagerEmail: 'sarah.johnson@kalpla.com',
      programManagerPhone: '+91-9876543210',
      description: 'Six-month intensive startup mentorship program focusing on product-market fit, scaling strategies, and investor readiness.',
      objectives: [
        'Validate product-market fit',
        'Develop scaling strategies',
        'Prepare for Series A funding',
        'Build strong mentor relationships',
        'Create investor-ready pitch decks'
      ],
      curriculum: [
        'Week 1-2: Program Orientation & Goal Setting',
        'Week 3-4: Market Research & Validation',
        'Week 5-8: Product Development & MVP',
        'Week 9-12: Go-to-Market Strategy',
        'Week 13-16: Scaling & Operations',
        'Week 17-20: Fundraising & Investor Relations',
        'Week 21-24: Demo Day & Graduation'
      ],
      mentors: [
        {
          id: 'MENTOR_001',
          name: 'Dr. Sarah Johnson',
          specialization: 'Business Strategy',
          experience: '15 years',
          company: 'Strategic Consulting Inc.',
          email: 'sarah.johnson@strategic.com',
          phone: '+91-9876543201',
          mentees: 8,
          rating: 4.9,
          availability: 'Weekends and evenings'
        },
        {
          id: 'MENTOR_002',
          name: 'Mr. David Lee',
          specialization: 'Technology',
          experience: '12 years',
          company: 'TechVentures',
          email: 'david.lee@techventures.com',
          phone: '+91-9876543202',
          mentees: 6,
          rating: 4.7,
          availability: 'Weekdays 6-8 PM'
        },
        {
          id: 'MENTOR_003',
          name: 'Ms. Emily Chen',
          specialization: 'Marketing',
          experience: '10 years',
          company: 'Marketing Solutions',
          email: 'emily.chen@marketing.com',
          phone: '+91-9876543203',
          mentees: 7,
          rating: 4.8,
          availability: 'Flexible schedule'
        }
      ],
      participants: [
        {
          id: 'PARTICIPANT_001',
          name: 'Rajesh Kumar',
          startupName: 'TechInnovate Solutions',
          industry: 'FinTech',
          stage: 'Early Stage',
          email: 'rajesh.kumar@startup.com',
          phone: '+91-9876543210',
          joinedDate: '2024-02-01',
          status: 'active',
          progress: 75,
          mentor: 'Dr. Sarah Johnson',
          milestones: [
            { name: 'Business Plan Review', completed: true, date: '2024-02-15' },
            { name: 'Market Validation', completed: true, date: '2024-03-01' },
            { name: 'Product Development', completed: true, date: '2024-04-15' },
            { name: 'Go-to-Market Strategy', completed: false, date: '2024-05-01' },
            { name: 'Investor Pitch', completed: false, date: '2024-06-01' }
          ],
          funding: {
            raised: 500000,
            target: 5000000,
            status: 'In Progress'
          }
        },
        {
          id: 'PARTICIPANT_002',
          name: 'Priya Sharma',
          startupName: 'HealthTech Innovations',
          industry: 'HealthTech',
          stage: 'Seed Stage',
          email: 'priya.sharma@healthtech.com',
          phone: '+91-9876543211',
          joinedDate: '2024-02-01',
          status: 'active',
          progress: 85,
          mentor: 'Ms. Emily Chen',
          milestones: [
            { name: 'Business Plan Review', completed: true, date: '2024-02-10' },
            { name: 'Market Validation', completed: true, date: '2024-02-25' },
            { name: 'Product Development', completed: true, date: '2024-04-01' },
            { name: 'Go-to-Market Strategy', completed: true, date: '2024-04-20' },
            { name: 'Investor Pitch', completed: false, date: '2024-05-15' }
          ],
          funding: {
            raised: 2000000,
            target: 10000000,
            status: 'In Progress'
          }
        }
      ],
      events: [
        {
          id: 'EVENT_001',
          name: 'Program Kickoff',
          date: '2024-02-01',
          type: 'Orientation',
          attendees: 32,
          status: 'completed'
        },
        {
          id: 'EVENT_002',
          name: 'Market Validation Workshop',
          date: '2024-02-15',
          type: 'Workshop',
          attendees: 28,
          status: 'completed'
        },
        {
          id: 'EVENT_003',
          name: 'Investor Pitch Practice',
          date: '2024-05-15',
          type: 'Workshop',
          attendees: 0,
          status: 'scheduled'
        },
        {
          id: 'EVENT_004',
          name: 'Demo Day',
          date: '2024-07-15',
          type: 'Demo Day',
          attendees: 0,
          status: 'scheduled'
        }
      ],
      statistics: {
        totalFundingRaised: 15000000,
        averageFundingPerStartup: 468750,
        successRate: 78,
        jobCreations: 120,
        mentorSatisfaction: 4.8,
        participantSatisfaction: 4.6
      },
      budget: {
        total: 5000000,
        spent: 2100000,
        remaining: 2900000,
        categories: {
          mentorFees: 1200000,
          venueRental: 300000,
          marketing: 200000,
          operations: 400000
        }
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-15T14:30:00Z'
    },
    {
      id: 'COHORT_2024_03',
      name: 'Cohort 2024-03',
      status: 'planning',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      duration: '6 months',
      maxParticipants: 50,
      currentParticipants: 0,
      applicationsReceived: 85,
      applicationsApproved: 0,
      applicationsRejected: 0,
      location: 'Hybrid (Online + Mumbai)',
      programManager: 'Mr. David Lee',
      programManagerEmail: 'david.lee@kalpla.com',
      programManagerPhone: '+91-9876543211',
      description: 'Six-month intensive startup mentorship program with focus on women entrepreneurship and diversity.',
      objectives: [
        'Support women entrepreneurs',
        'Build diverse startup ecosystem',
        'Provide specialized mentorship',
        'Create inclusive funding opportunities',
        'Develop leadership skills'
      ],
      curriculum: [
        'Week 1-2: Program Orientation & Diversity Training',
        'Week 3-4: Market Research & Validation',
        'Week 5-8: Product Development & MVP',
        'Week 9-12: Go-to-Market Strategy',
        'Week 13-16: Scaling & Operations',
        'Week 17-20: Fundraising & Investor Relations',
        'Week 21-24: Demo Day & Graduation'
      ],
      mentors: [
        {
          id: 'MENTOR_004',
          name: 'Dr. Priya Sharma',
          specialization: 'Women Leadership',
          experience: '18 years',
          company: 'Leadership Institute',
          email: 'priya.sharma@leadership.com',
          phone: '+91-9876543204',
          mentees: 0,
          rating: 4.9,
          availability: 'Flexible schedule'
        },
        {
          id: 'MENTOR_005',
          name: 'Ms. Anjali Patel',
          specialization: 'Social Impact',
          experience: '12 years',
          company: 'Impact Ventures',
          email: 'anjali.patel@impact.com',
          phone: '+91-9876543205',
          mentees: 0,
          rating: 4.7,
          availability: 'Weekends'
        }
      ],
      participants: [],
      events: [
        {
          id: 'EVENT_005',
          name: 'Program Kickoff',
          date: '2024-03-01',
          type: 'Orientation',
          attendees: 0,
          status: 'scheduled'
        }
      ],
      statistics: {
        totalFundingRaised: 0,
        averageFundingPerStartup: 0,
        successRate: 0,
        jobCreations: 0,
        mentorSatisfaction: 0,
        participantSatisfaction: 0
      },
      budget: {
        total: 4500000,
        spent: 500000,
        remaining: 4000000,
        categories: {
          mentorFees: 200000,
          venueRental: 100000,
          marketing: 100000,
          operations: 100000
        }
      },
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-20T09:00:00Z'
    },
    {
      id: 'COHORT_2023_04',
      name: 'Cohort 2023-04',
      status: 'completed',
      startDate: '2023-10-01',
      endDate: '2024-04-01',
      duration: '6 months',
      maxParticipants: 40,
      currentParticipants: 40,
      applicationsReceived: 120,
      applicationsApproved: 42,
      applicationsRejected: 78,
      location: 'Hybrid (Online + Delhi)',
      programManager: 'Ms. Emily Chen',
      programManagerEmail: 'emily.chen@kalpla.com',
      programManagerPhone: '+91-9876543212',
      description: 'Completed six-month startup mentorship program with focus on technology startups.',
      objectives: [
        'Validate product-market fit',
        'Develop scaling strategies',
        'Prepare for Series A funding',
        'Build strong mentor relationships',
        'Create investor-ready pitch decks'
      ],
      curriculum: [
        'Week 1-2: Program Orientation & Goal Setting',
        'Week 3-4: Market Research & Validation',
        'Week 5-8: Product Development & MVP',
        'Week 9-12: Go-to-Market Strategy',
        'Week 13-16: Scaling & Operations',
        'Week 17-20: Fundraising & Investor Relations',
        'Week 21-24: Demo Day & Graduation'
      ],
      mentors: [
        {
          id: 'MENTOR_006',
          name: 'Prof. Michael Chen',
          specialization: 'AI/ML',
          experience: '20 years',
          company: 'AI Research Lab',
          email: 'michael.chen@ai.com',
          phone: '+91-9876543206',
          mentees: 10,
          rating: 4.8,
          availability: 'Weekdays'
        }
      ],
      participants: [
        {
          id: 'PARTICIPANT_003',
          name: 'Vikram Singh',
          startupName: 'LogiTech Solutions',
          industry: 'Logistics',
          stage: 'Seed Stage',
          email: 'vikram.singh@logistics.com',
          phone: '+91-9876543214',
          joinedDate: '2023-10-01',
          status: 'graduated',
          progress: 100,
          mentor: 'Prof. Michael Chen',
          milestones: [
            { name: 'Business Plan Review', completed: true, date: '2023-10-15' },
            { name: 'Market Validation', completed: true, date: '2023-11-01' },
            { name: 'Product Development', completed: true, date: '2023-12-15' },
            { name: 'Go-to-Market Strategy', completed: true, date: '2024-01-15' },
            { name: 'Investor Pitch', completed: true, date: '2024-02-15' }
          ],
          funding: {
            raised: 3000000,
            target: 10000000,
            status: 'Completed'
          }
        }
      ],
      events: [
        {
          id: 'EVENT_006',
          name: 'Program Kickoff',
          date: '2023-10-01',
          type: 'Orientation',
          attendees: 40,
          status: 'completed'
        },
        {
          id: 'EVENT_007',
          name: 'Demo Day',
          date: '2024-03-15',
          type: 'Demo Day',
          attendees: 35,
          status: 'completed'
        }
      ],
      statistics: {
        totalFundingRaised: 25000000,
        averageFundingPerStartup: 625000,
        successRate: 85,
        jobCreations: 180,
        mentorSatisfaction: 4.7,
        participantSatisfaction: 4.8
      },
      budget: {
        total: 4000000,
        spent: 4000000,
        remaining: 0,
        categories: {
          mentorFees: 2000000,
          venueRental: 500000,
          marketing: 300000,
          operations: 1200000
        }
      },
      createdAt: '2023-09-15T10:00:00Z',
      updatedAt: '2024-04-01T16:00:00Z'
    }
  ];

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const filteredCohorts = cohorts.filter(cohort => {
    const matchesSearch = cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cohort.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cohort.programManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cohort.status === filterStatus;
    const matchesYear = filterYear === 'all' || cohort.name.includes(filterYear);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'paused': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KSMP cohorts...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">KSMP Cohorts</h1>
                <p className="text-gray-600 mt-1">Manage and monitor Kalpla Startup Mentorship Program cohorts</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Cohorts</p>
                    <p className="text-2xl font-bold text-gray-900">{cohorts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Cohorts</p>
                    <p className="text-2xl font-bold text-gray-900">{cohorts.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-gray-900">{cohorts.reduce((acc, c) => acc + c.currentParticipants, 0)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Funding</p>
                    <p className="text-2xl font-bold text-gray-900">₹4Cr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cohorts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>

                {/* Year Filter */}
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Cohort
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Cohorts List */}
          <div className="space-y-6">
            {filteredCohorts.map((cohort) => (
              <div key={cohort.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-5 w-5 text-blue-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{cohort.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                        {cohort.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{cohort.description}</p>

                    {/* Key Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        <span>{cohort.currentParticipants}/{cohort.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{cohort.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>{cohort.programManager}</span>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{cohort.applicationsReceived}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{cohort.applicationsApproved}</div>
                        <div className="text-sm text-gray-600">Approved</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{cohort.statistics.successRate}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(cohort.statistics.totalFundingRaised)}</div>
                        <div className="text-sm text-gray-600">Funding Raised</div>
                      </div>
                    </div>

                    {/* Mentors */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Mentors ({cohort.mentors.length}):</h4>
                      <div className="flex flex-wrap gap-2">
                        {cohort.mentors.map((mentor, index) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                            <UserIcon className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-blue-700">{mentor.name}</span>
                            <span className="text-xs text-blue-600">({mentor.specialization})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Events:</h4>
                      <div className="space-y-1">
                        {cohort.events.slice(0, 3).map((event, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{event.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">{formatDate(event.date)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                event.status === 'completed' ? 'bg-green-100 text-green-800' :
                                event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Status:</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Spent: {formatCurrency(cohort.budget.spent)}</span>
                        <span className="text-sm text-gray-600">Remaining: {formatCurrency(cohort.budget.remaining)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(cohort.budget.spent / cohort.budget.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        Participants
                      </button>
                      <button className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        Mentors
                      </button>
                      <button className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCohorts.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cohorts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterYear !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No KSMP cohorts have been created yet.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create First Cohort
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
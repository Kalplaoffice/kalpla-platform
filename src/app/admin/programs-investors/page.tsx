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
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function ProgramsInvestorsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('programs');

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

  // Mock data for programs
  const programs = [
    {
      id: 'PROGRAM_001',
      name: 'Kalpla Startup Mentorship Program (KSMP)',
      type: 'mentorship',
      status: 'active',
      description: 'Comprehensive startup mentorship program connecting entrepreneurs with experienced mentors',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      duration: '6 months',
      maxParticipants: 50,
      currentParticipants: 32,
      price: 25000,
      currency: 'INR',
      category: 'Entrepreneurship',
      level: 'Intermediate',
      language: 'English',
      location: 'Hybrid (Online + Bangalore)',
      organizer: 'Kalpla Education',
      contactEmail: 'ksmp@kalpla.com',
      contactPhone: '+91-9876543210',
      website: 'https://kalpla.com/ksmp',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/kalpla-ksmp',
        twitter: 'https://twitter.com/kalpla_ksmp'
      },
      features: [
        '1-on-1 mentorship sessions',
        'Weekly group workshops',
        'Access to investor network',
        'Pitch deck preparation',
        'Legal and compliance guidance',
        'Marketing strategy development'
      ],
      requirements: [
        'Early-stage startup (0-3 years)',
        'Minimum 2 team members',
        'Working prototype or MVP',
        'Clear business model',
        'Commitment to 6-month program'
      ],
      outcomes: [
        'Refined business strategy',
        'Investor-ready pitch deck',
        'Expanded professional network',
        'Potential funding opportunities',
        'Improved operational efficiency'
      ],
      mentors: [
        { name: 'Dr. Sarah Johnson', specialization: 'Business Strategy', experience: '15 years' },
        { name: 'Mr. David Lee', specialization: 'Technology', experience: '12 years' },
        { name: 'Ms. Emily Chen', specialization: 'Marketing', experience: '10 years' }
      ],
      investors: [
        { name: 'ABC Ventures', type: 'VC', focus: 'Early Stage', investmentRange: '₹50L - ₹5Cr' },
        { name: 'XYZ Capital', type: 'Angel Network', focus: 'Seed Stage', investmentRange: '₹10L - ₹1Cr' }
      ],
      statistics: {
        totalGraduates: 120,
        successRate: 78,
        averageFunding: 2500000,
        totalFundingRaised: 300000000,
        jobCreations: 450
      },
      reviews: {
        averageRating: 4.8,
        totalReviews: 45,
        testimonials: [
          'KSMP transformed our startup journey completely',
          'The mentorship quality is exceptional',
          'Great network of investors and mentors'
        ]
      }
    },
    {
      id: 'PROGRAM_002',
      name: 'Tech Innovation Accelerator',
      type: 'accelerator',
      status: 'active',
      description: 'Intensive 3-month accelerator program for tech startups with focus on product development and scaling',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      duration: '3 months',
      maxParticipants: 20,
      currentParticipants: 18,
      price: 50000,
      currency: 'INR',
      category: 'Technology',
      level: 'Advanced',
      language: 'English',
      location: 'Bangalore',
      organizer: 'Kalpla Education',
      contactEmail: 'accelerator@kalpla.com',
      contactPhone: '+91-9876543211',
      website: 'https://kalpla.com/accelerator',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/kalpla-accelerator',
        twitter: 'https://twitter.com/kalpla_accelerator'
      },
      features: [
        'Intensive product development',
        'Technical mentorship',
        'Co-working space access',
        'Demo day presentation',
        'Investor pitch sessions',
        'Legal and IP guidance'
      ],
      requirements: [
        'Tech startup with working product',
        'Minimum 3 team members',
        'Revenue or clear monetization path',
        'Commitment to full-time program',
        'Technical co-founder required'
      ],
      outcomes: [
        'Product-market fit validation',
        'Scalable technology architecture',
        'Investor connections',
        'Market expansion strategy',
        'Team scaling plan'
      ],
      mentors: [
        { name: 'Prof. Michael Chen', specialization: 'AI/ML', experience: '20 years' },
        { name: 'Dr. Lisa Wang', specialization: 'Product Management', experience: '15 years' },
        { name: 'Mr. Alex Kumar', specialization: 'Engineering', experience: '12 years' }
      ],
      investors: [
        { name: 'TechVentures', type: 'VC', focus: 'Series A', investmentRange: '₹5Cr - ₹50Cr' },
        { name: 'Innovation Fund', type: 'Corporate VC', focus: 'Growth Stage', investmentRange: '₹10Cr - ₹100Cr' }
      ],
      statistics: {
        totalGraduates: 60,
        successRate: 85,
        averageFunding: 15000000,
        totalFundingRaised: 900000000,
        jobCreations: 280
      },
      reviews: {
        averageRating: 4.9,
        totalReviews: 28,
        testimonials: [
          'Best accelerator program in India',
          'Amazing technical mentorship',
          'Great investor network'
        ]
      }
    },
    {
      id: 'PROGRAM_003',
      name: 'Women Entrepreneurship Program',
      type: 'specialized',
      status: 'planning',
      description: 'Dedicated program supporting women entrepreneurs with mentorship, funding, and networking opportunities',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      duration: '6 months',
      maxParticipants: 30,
      currentParticipants: 0,
      price: 20000,
      currency: 'INR',
      category: 'Women Entrepreneurship',
      level: 'Beginner to Intermediate',
      language: 'English/Hindi',
      location: 'Hybrid (Online + Mumbai)',
      organizer: 'Kalpla Education',
      contactEmail: 'women@kalpla.com',
      contactPhone: '+91-9876543212',
      website: 'https://kalpla.com/women-entrepreneurship',
      socialMedia: {
        linkedin: 'https://linkedin.com/company/kalpla-women',
        twitter: 'https://twitter.com/kalpla_women'
      },
      features: [
        'Women-only mentorship',
        'Gender-specific challenges',
        'Work-life balance guidance',
        'Childcare support',
        'Flexible scheduling',
        'Women investor network'
      ],
      requirements: [
        'Women-led startup',
        'Minimum 1 year in business',
        'Clear business vision',
        'Commitment to program',
        'Basic business plan'
      ],
      outcomes: [
        'Confidence building',
        'Business skill development',
        'Network expansion',
        'Funding opportunities',
        'Work-life integration'
      ],
      mentors: [
        { name: 'Dr. Priya Sharma', specialization: 'Women Leadership', experience: '18 years' },
        { name: 'Ms. Anjali Patel', specialization: 'Social Impact', experience: '12 years' },
        { name: 'Dr. Kavita Singh', specialization: 'Finance', experience: '15 years' }
      ],
      investors: [
        { name: 'Women Investment Fund', type: 'Impact Fund', focus: 'Women-led', investmentRange: '₹25L - ₹2Cr' },
        { name: 'Diversity Capital', type: 'Angel Network', focus: 'Diversity', investmentRange: '₹5L - ₹50L' }
      ],
      statistics: {
        totalGraduates: 0,
        successRate: 0,
        averageFunding: 0,
        totalFundingRaised: 0,
        jobCreations: 0
      },
      reviews: {
        averageRating: 0,
        totalReviews: 0,
        testimonials: []
      }
    }
  ];

  // Mock data for investors
  const investors = [
    {
      id: 'INVESTOR_001',
      name: 'ABC Ventures',
      type: 'Venture Capital',
      status: 'active',
      description: 'Early-stage venture capital firm focused on technology and innovation',
      founded: '2015',
      headquarters: 'Mumbai, India',
      website: 'https://abcventures.com',
      contactEmail: 'contact@abcventures.com',
      contactPhone: '+91-9876543201',
      linkedin: 'https://linkedin.com/company/abc-ventures',
      twitter: 'https://twitter.com/abcventures',
      focusAreas: ['Technology', 'FinTech', 'HealthTech', 'EdTech'],
      investmentStage: ['Seed', 'Series A', 'Series B'],
      investmentRange: '₹50L - ₹50Cr',
      portfolioSize: 45,
      totalInvestments: 1200000000,
      averageInvestment: 26666667,
      successRate: 72,
      keyPersonnel: [
        { name: 'Rajesh Kumar', role: 'Managing Partner', experience: '20 years' },
        { name: 'Priya Sharma', role: 'Investment Director', experience: '15 years' },
        { name: 'Amit Patel', role: 'Principal', experience: '10 years' }
      ],
      notableInvestments: [
        { company: 'TechStart Inc.', amount: '₹5Cr', stage: 'Series A', status: 'Active' },
        { company: 'EduTech Solutions', amount: '₹3Cr', stage: 'Seed', status: 'Active' },
        { company: 'HealthApp', amount: '₹8Cr', stage: 'Series B', status: 'Exited' }
      ],
      criteria: [
        'Strong founding team',
        'Clear market opportunity',
        'Scalable business model',
        'Technology differentiation',
        'Revenue potential'
      ],
      process: [
        'Initial application review',
        'Due diligence (4-6 weeks)',
        'Investment committee review',
        'Term sheet negotiation',
        'Legal documentation',
        'Funding disbursement'
      ],
      partnership: {
        status: 'active',
        startDate: '2023-01-15',
        programs: ['KSMP', 'Tech Innovation Accelerator'],
        totalInvestments: 8,
        totalAmount: 45000000,
        successStories: 5
      },
      reviews: {
        averageRating: 4.7,
        totalReviews: 12,
        testimonials: [
          'Great support throughout the journey',
          'Valuable strategic guidance',
          'Strong network connections'
        ]
      }
    },
    {
      id: 'INVESTOR_002',
      name: 'XYZ Capital',
      type: 'Angel Network',
      status: 'active',
      description: 'Angel investor network focused on early-stage startups with high growth potential',
      founded: '2018',
      headquarters: 'Bangalore, India',
      website: 'https://xyzcapital.com',
      contactEmail: 'info@xyzcapital.com',
      contactPhone: '+91-9876543202',
      linkedin: 'https://linkedin.com/company/xyz-capital',
      twitter: 'https://twitter.com/xyzcapital',
      focusAreas: ['Consumer Tech', 'SaaS', 'Marketplace', 'AI/ML'],
      investmentStage: ['Pre-Seed', 'Seed'],
      investmentRange: '₹10L - ₹1Cr',
      portfolioSize: 28,
      totalInvestments: 350000000,
      averageInvestment: 12500000,
      successRate: 68,
      keyPersonnel: [
        { name: 'David Lee', role: 'Lead Angel', experience: '25 years' },
        { name: 'Sarah Wilson', role: 'Investment Manager', experience: '12 years' },
        { name: 'Mike Chen', role: 'Portfolio Manager', experience: '8 years' }
      ],
      notableInvestments: [
        { company: 'MarketPlace Pro', amount: '₹50L', stage: 'Seed', status: 'Active' },
        { company: 'AI Solutions', amount: '₹75L', stage: 'Seed', status: 'Active' },
        { company: 'Consumer App', amount: '₹25L', stage: 'Pre-Seed', status: 'Exited' }
      ],
      criteria: [
        'Innovative solution',
        'Strong market demand',
        'Experienced team',
        'Clear monetization',
        'Scalability potential'
      ],
      process: [
        'Pitch presentation',
        'Reference checks',
        'Market validation',
        'Investment decision',
        'Funding completion'
      ],
      partnership: {
        status: 'active',
        startDate: '2023-06-01',
        programs: ['KSMP', 'Women Entrepreneurship Program'],
        totalInvestments: 12,
        totalAmount: 18000000,
        successStories: 8
      },
      reviews: {
        averageRating: 4.5,
        totalReviews: 8,
        testimonials: [
          'Quick decision making',
          'Hands-on approach',
          'Great mentorship'
        ]
      }
    },
    {
      id: 'INVESTOR_003',
      name: 'Innovation Fund',
      type: 'Corporate VC',
      status: 'pending',
      description: 'Corporate venture capital arm of a leading technology company',
      founded: '2020',
      headquarters: 'Delhi, India',
      website: 'https://innovationfund.com',
      contactEmail: 'partnerships@innovationfund.com',
      contactPhone: '+91-9876543203',
      linkedin: 'https://linkedin.com/company/innovation-fund',
      twitter: 'https://twitter.com/innovationfund',
      focusAreas: ['Enterprise Software', 'Cloud Computing', 'Cybersecurity', 'IoT'],
      investmentStage: ['Series A', 'Series B', 'Growth'],
      investmentRange: '₹5Cr - ₹100Cr',
      portfolioSize: 15,
      totalInvestments: 800000000,
      averageInvestment: 53333333,
      successRate: 80,
      keyPersonnel: [
        { name: 'Anjali Patel', role: 'Managing Director', experience: '22 years' },
        { name: 'Rohit Singh', role: 'Investment Director', experience: '18 years' },
        { name: 'Kavita Reddy', role: 'Principal', experience: '12 years' }
      ],
      notableInvestments: [
        { company: 'CloudTech', amount: '₹20Cr', stage: 'Series B', status: 'Active' },
        { company: 'SecureApp', amount: '₹15Cr', stage: 'Series A', status: 'Active' },
        { company: 'IoT Solutions', amount: '₹25Cr', stage: 'Growth', status: 'Active' }
      ],
      criteria: [
        'Enterprise focus',
        'Technology alignment',
        'Market leadership potential',
        'Strong revenue model',
        'Strategic value'
      ],
      process: [
        'Strategic fit assessment',
        'Technical due diligence',
        'Market analysis',
        'Investment committee',
        'Strategic partnership',
        'Funding and integration'
      ],
      partnership: {
        status: 'pending',
        startDate: null,
        programs: ['Tech Innovation Accelerator'],
        totalInvestments: 0,
        totalAmount: 0,
        successStories: 0
      },
      reviews: {
        averageRating: 0,
        totalReviews: 0,
        testimonials: []
      }
    }
  ];

  const programTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'accelerator', label: 'Accelerator' },
    { value: 'specialized', label: 'Specialized' }
  ];

  const investorTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Venture Capital', label: 'Venture Capital' },
    { value: 'Angel Network', label: 'Angel Network' },
    { value: 'Corporate VC', label: 'Corporate VC' },
    { value: 'Private Equity', label: 'Private Equity' }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.focusAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || investor.type === filterType;
    const matchesStatus = filterStatus === 'all' || investor.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'planning': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mentorship': return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case 'accelerator': return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
      case 'specialized': return <AcademicCapIcon className="h-5 w-5 text-purple-500" />;
      case 'Venture Capital': return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />;
      case 'Angel Network': return <UserGroupIcon className="h-5 w-5 text-green-500" />;
      case 'Corporate VC': return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
      default: return <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs and investors...</p>
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
                <p className="text-gray-600 mt-1">Manage programs and investor partnerships for startup ecosystem</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{programs.filter(p => p.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Partner Investors</p>
                    <p className="text-2xl font-bold text-gray-900">{investors.filter(i => i.status === 'active').length}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{programs.reduce((acc, p) => acc + p.currentParticipants, 0)}</p>
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
                    <p className="text-2xl font-bold text-gray-900">₹1.2Cr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('programs')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'programs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Programs ({programs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('investors')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'investors'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Investors ({investors.length})
                  </button>
                </nav>
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
                    placeholder={`Search ${activeTab}...`}
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
                  {activeTab === 'programs' ? (
                    programTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))
                  ) : (
                    investorTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))
                  )}
                </select>

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
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add {activeTab === 'programs' ? 'Program' : 'Investor'}
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Partnerships
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'programs' ? (
            <div className="space-y-6">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getTypeIcon(program.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                          {program.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{program.description}</p>

                      {/* Key Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          <span>{program.currentParticipants}/{program.maxParticipants} participants</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>{formatCurrency(program.price, program.currency)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{program.location}</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{program.statistics.totalGraduates}</div>
                          <div className="text-sm text-gray-600">Graduates</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{program.statistics.successRate}%</div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{formatCurrency(program.statistics.averageFunding)}</div>
                          <div className="text-sm text-gray-600">Avg Funding</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{program.reviews.averageRating}</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {program.features.slice(0, 4).map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {feature}
                            </span>
                          ))}
                          {program.features.length > 4 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{program.features.length - 4} more
                            </span>
                          )}
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
          ) : (
            <div className="space-y-6">
              {filteredInvestors.map((investor) => (
                <div key={investor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getTypeIcon(investor.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{investor.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investor.status)}`}>
                          {investor.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{investor.description}</p>

                      {/* Key Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          <span>{investor.headquarters}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>Founded {investor.founded}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>{investor.investmentRange}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <GlobeAltIcon className="h-4 w-4 mr-2" />
                          <span>{investor.portfolioSize} portfolio</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{formatCurrency(investor.totalInvestments)}</div>
                          <div className="text-sm text-gray-600">Total Invested</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{formatCurrency(investor.averageInvestment)}</div>
                          <div className="text-sm text-gray-600">Avg Investment</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{investor.successRate}%</div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{investor.reviews.averageRating}</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                      </div>

                      {/* Focus Areas */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {investor.focusAreas.map((area, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Partnership Status */}
                      {investor.partnership.status === 'active' && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Active Partnership</h4>
                              <p className="text-sm text-green-600">
                                {investor.partnership.totalInvestments} investments, {investor.partnership.successStories} success stories
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-800">
                                {formatCurrency(investor.partnership.totalAmount)}
                              </div>
                              <div className="text-xs text-green-600">Total Invested</div>
                            </div>
                          </div>
                        </div>
                      )}

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
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          Partnership
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
          )}

          {/* Empty State */}
          {(activeTab === 'programs' && filteredPrograms.length === 0) || (activeTab === 'investors' && filteredInvestors.length === 0) ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : `No ${activeTab} have been created yet.`
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First {activeTab === 'programs' ? 'Program' : 'Investor'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

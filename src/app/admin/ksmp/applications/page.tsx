'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
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
  UserGroupIcon,
  BanknotesIcon,
  TrendingUpIcon,
  UsersIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function KSMPApplicationsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCohort, setFilterCohort] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

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

  // Mock data for KSMP applications
  const applications = [
    {
      id: 'KSMP_APP_001',
      applicantName: 'Rajesh Kumar',
      email: 'rajesh.kumar@startup.com',
      phone: '+91-9876543210',
      startupName: 'TechInnovate Solutions',
      industry: 'FinTech',
      stage: 'Early Stage',
      status: 'pending',
      cohort: '2024-02',
      applicationDate: '2024-01-19T11:15:00Z',
      reviewedDate: null,
      reviewedBy: null,
      teamSize: 5,
      fundingRaised: 500000,
      revenue: 0,
      businessModel: 'B2B SaaS',
      targetMarket: 'Small and Medium Enterprises',
      competitiveAdvantage: 'AI-powered financial analytics',
      problemStatement: 'Small businesses struggle with financial planning and analysis due to lack of expertise and tools.',
      solution: 'AI-powered financial analytics platform that provides real-time insights and recommendations.',
      marketSize: '₹500Cr',
      traction: '50 beta users, ₹2L MRR',
      mentorshipGoals: [
        'Product-market fit validation',
        'Scaling strategy development',
        'Investor pitch preparation'
      ],
      expectedOutcomes: 'Secure Series A funding within 6 months',
      timeCommitment: '10 hours per week',
      preferredMentors: ['Dr. Sarah Johnson', 'Mr. David Lee'],
      previousExperience: '2 years in fintech',
      education: 'BTech Computer Science, IIT Delhi',
      references: [
        { name: 'John Smith', company: 'ABC Ventures', email: 'john@abc.com', phone: '+91-9876543201' },
        { name: 'Jane Doe', company: 'XYZ Capital', email: 'jane@xyz.com', phone: '+91-9876543202' }
      ],
      documents: [
        { name: 'business_plan.pdf', type: 'document', size: '4.5 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '8.2 MB' },
        { name: 'financial_projections.xlsx', type: 'spreadsheet', size: '1.1 MB' },
        { name: 'product_demo.mp4', type: 'video', size: '45 MB' }
      ],
      evaluation: {
        businessIdea: 8,
        marketPotential: 7,
        teamStrength: 9,
        executionCapability: 8,
        scalability: 7,
        overallScore: 7.8
      },
      notes: 'Strong technical team with good market understanding. Needs help with go-to-market strategy.',
      priority: 'high'
    },
    {
      id: 'KSMP_APP_002',
      applicantName: 'Priya Sharma',
      email: 'priya.sharma@healthtech.com',
      phone: '+91-9876543211',
      startupName: 'HealthTech Innovations',
      industry: 'HealthTech',
      stage: 'Seed Stage',
      status: 'approved',
      cohort: '2024-02',
      applicationDate: '2024-01-18T14:30:00Z',
      reviewedDate: '2024-01-20T10:15:00Z',
      reviewedBy: 'Dr. Sarah Johnson',
      teamSize: 8,
      fundingRaised: 2000000,
      revenue: 500000,
      businessModel: 'B2C Subscription',
      targetMarket: 'Urban health-conscious consumers',
      competitiveAdvantage: 'AI-powered personalized health recommendations',
      problemStatement: 'People lack personalized health guidance and often make poor health decisions.',
      solution: 'AI-powered health platform that provides personalized recommendations based on user data.',
      marketSize: '₹1000Cr',
      traction: '5000 users, ₹5L MRR',
      mentorshipGoals: [
        'Scale user acquisition',
        'Develop strategic partnerships',
        'Prepare for Series A'
      ],
      expectedOutcomes: 'Reach 50K users and ₹50L MRR',
      timeCommitment: '15 hours per week',
      preferredMentors: ['Dr. Sarah Johnson', 'Ms. Emily Chen'],
      previousExperience: '5 years in healthcare',
      education: 'MBA Healthcare Management, IIM Ahmedabad',
      references: [
        { name: 'Dr. Amit Patel', company: 'MedTech Ventures', email: 'amit@medtech.com', phone: '+91-9876543203' },
        { name: 'Ms. Kavita Singh', company: 'Health Capital', email: 'kavita@health.com', phone: '+91-9876543204' }
      ],
      documents: [
        { name: 'business_plan.pdf', type: 'document', size: '6.2 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '12.5 MB' },
        { name: 'user_research.pdf', type: 'document', size: '3.8 MB' },
        { name: 'financial_model.xlsx', type: 'spreadsheet', size: '2.1 MB' }
      ],
      evaluation: {
        businessIdea: 9,
        marketPotential: 8,
        teamStrength: 8,
        executionCapability: 9,
        scalability: 8,
        overallScore: 8.4
      },
      notes: 'Excellent team with strong market traction. Clear path to scale.',
      priority: 'high'
    },
    {
      id: 'KSMP_APP_003',
      applicantName: 'Amit Patel',
      email: 'amit.patel@edutech.com',
      phone: '+91-9876543212',
      startupName: 'EduTech Solutions',
      industry: 'EdTech',
      stage: 'Pre-Seed',
      status: 'rejected',
      cohort: '2024-02',
      applicationDate: '2024-01-17T09:45:00Z',
      reviewedDate: '2024-01-19T16:20:00Z',
      reviewedBy: 'Mr. David Lee',
      teamSize: 3,
      fundingRaised: 100000,
      revenue: 0,
      businessModel: 'B2B Platform',
      targetMarket: 'Educational Institutions',
      competitiveAdvantage: 'Gamified learning platform',
      problemStatement: 'Students lack engagement in traditional learning methods.',
      solution: 'Gamified learning platform that makes education interactive and fun.',
      marketSize: '₹2000Cr',
      traction: '10 pilot schools',
      mentorshipGoals: [
        'Validate product-market fit',
        'Develop go-to-market strategy',
        'Build strong team'
      ],
      expectedOutcomes: 'Secure seed funding and expand to 100 schools',
      timeCommitment: '8 hours per week',
      preferredMentors: ['Mr. David Lee', 'Dr. Sarah Johnson'],
      previousExperience: '3 years in education',
      education: 'MTech Computer Science, IIT Bombay',
      references: [
        { name: 'Prof. Rajesh Kumar', company: 'IIT Bombay', email: 'rajesh@iitb.ac.in', phone: '+91-9876543205' },
        { name: 'Ms. Sunita Reddy', company: 'EduVentures', email: 'sunita@eduventures.com', phone: '+91-9876543206' }
      ],
      documents: [
        { name: 'business_plan.pdf', type: 'document', size: '3.2 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '5.8 MB' },
        { name: 'product_demo.mp4', type: 'video', size: '25 MB' }
      ],
      evaluation: {
        businessIdea: 6,
        marketPotential: 7,
        teamStrength: 5,
        executionCapability: 6,
        scalability: 6,
        overallScore: 6.0
      },
      notes: 'Good idea but team needs strengthening. Market validation insufficient.',
      priority: 'medium'
    },
    {
      id: 'KSMP_APP_004',
      applicantName: 'Sneha Reddy',
      email: 'sneha.reddy@agritech.com',
      phone: '+91-9876543213',
      startupName: 'AgriTech Innovations',
      industry: 'AgriTech',
      stage: 'Early Stage',
      status: 'pending',
      cohort: '2024-02',
      applicationDate: '2024-01-20T16:45:00Z',
      reviewedDate: null,
      reviewedBy: null,
      teamSize: 6,
      fundingRaised: 750000,
      revenue: 100000,
      businessModel: 'B2B Marketplace',
      targetMarket: 'Farmers and Agricultural Suppliers',
      competitiveAdvantage: 'IoT-based crop monitoring and supply chain optimization',
      problemStatement: 'Farmers face challenges in crop monitoring and supply chain management.',
      solution: 'IoT-based platform for crop monitoring and supply chain optimization.',
      marketSize: '₹3000Cr',
      traction: '200 farmers, ₹1L MRR',
      mentorshipGoals: [
        'Scale farmer acquisition',
        'Develop IoT technology',
        'Build supply chain partnerships'
      ],
      expectedOutcomes: 'Reach 1000 farmers and ₹10L MRR',
      timeCommitment: '12 hours per week',
      preferredMentors: ['Dr. Sarah Johnson', 'Mr. David Lee'],
      previousExperience: '4 years in agriculture',
      education: 'BTech Agricultural Engineering, IIT Kharagpur',
      references: [
        { name: 'Dr. Ravi Kumar', company: 'AgriVentures', email: 'ravi@agriventures.com', phone: '+91-9876543207' },
        { name: 'Ms. Anjali Patel', company: 'FarmTech Capital', email: 'anjali@farmtech.com', phone: '+91-9876543208' }
      ],
      documents: [
        { name: 'business_plan.pdf', type: 'document', size: '5.8 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '9.5 MB' },
        { name: 'technical_specs.pdf', type: 'document', size: '2.3 MB' },
        { name: 'market_research.pdf', type: 'document', size: '4.1 MB' }
      ],
      evaluation: {
        businessIdea: 8,
        marketPotential: 9,
        teamStrength: 7,
        executionCapability: 8,
        scalability: 8,
        overallScore: 8.0
      },
      notes: 'Strong market opportunity with good technical foundation. Needs business development support.',
      priority: 'high'
    },
    {
      id: 'KSMP_APP_005',
      applicantName: 'Vikram Singh',
      email: 'vikram.singh@logistics.com',
      phone: '+91-9876543214',
      startupName: 'LogiTech Solutions',
      industry: 'Logistics',
      stage: 'Seed Stage',
      status: 'approved',
      cohort: '2024-02',
      applicationDate: '2024-01-16T13:20:00Z',
      reviewedDate: '2024-01-18T14:30:00Z',
      reviewedBy: 'Ms. Emily Chen',
      teamSize: 7,
      fundingRaised: 3000000,
      revenue: 1200000,
      businessModel: 'B2B SaaS',
      targetMarket: 'E-commerce and Retail Companies',
      competitiveAdvantage: 'AI-powered logistics optimization',
      problemStatement: 'Companies struggle with inefficient logistics and high shipping costs.',
      solution: 'AI-powered logistics platform that optimizes shipping routes and reduces costs.',
      marketSize: '₹1500Cr',
      traction: '50 enterprise clients, ₹15L MRR',
      mentorshipGoals: [
        'Scale enterprise sales',
        'Develop AI capabilities',
        'Expand to new markets'
      ],
      expectedOutcomes: 'Reach 200 clients and ₹50L MRR',
      timeCommitment: '20 hours per week',
      preferredMentors: ['Ms. Emily Chen', 'Dr. Sarah Johnson'],
      previousExperience: '8 years in logistics',
      education: 'MBA Operations, IIM Bangalore',
      references: [
        { name: 'Mr. Rajesh Kumar', company: 'LogiVentures', email: 'rajesh@logiventures.com', phone: '+91-9876543209' },
        { name: 'Ms. Priya Sharma', company: 'Supply Chain Capital', email: 'priya@supplychain.com', phone: '+91-9876543210' }
      ],
      documents: [
        { name: 'business_plan.pdf', type: 'document', size: '7.2 MB' },
        { name: 'pitch_deck.pdf', type: 'document', size: '11.8 MB' },
        { name: 'case_studies.pdf', type: 'document', size: '3.5 MB' },
        { name: 'financial_model.xlsx', type: 'spreadsheet', size: '2.8 MB' }
      ],
      evaluation: {
        businessIdea: 9,
        marketPotential: 8,
        teamStrength: 9,
        executionCapability: 9,
        scalability: 8,
        overallScore: 8.6
      },
      notes: 'Excellent execution with strong market traction. Ready for scaling.',
      priority: 'high'
    }
  ];

  const cohorts = [
    { value: 'all', label: 'All Cohorts' },
    { value: '2024-02', label: 'Cohort 2024-02' },
    { value: '2024-03', label: 'Cohort 2024-03' },
    { value: '2024-04', label: 'Cohort 2024-04' }
  ];

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'FinTech', label: 'FinTech' },
    { value: 'HealthTech', label: 'HealthTech' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'AgriTech', label: 'AgriTech' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'SaaS', label: 'SaaS' }
  ];

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
    const matchesCohort = filterCohort === 'all' || application.cohort === filterCohort;
    const matchesIndustry = filterIndustry === 'all' || application.industry === filterIndustry;
    return matchesSearch && matchesStatus && matchesCohort && matchesIndustry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Pre-Seed': return 'text-blue-600 bg-blue-100';
      case 'Seed Stage': return 'text-green-600 bg-green-100';
      case 'Early Stage': return 'text-yellow-600 bg-yellow-100';
      case 'Growth Stage': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <p className="text-gray-600">Loading KSMP applications...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">KSMP Applications</h1>
                <p className="text-gray-600 mt-1">Review and manage Kalpla Startup Mentorship Program applications</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'approved').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(applications.reduce((acc, a) => acc + a.evaluation.overallScore, 0) / applications.length * 10) / 10}
                    </p>
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
                    placeholder="Search applications..."
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
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Cohort Filter */}
                <select
                  value={filterCohort}
                  onChange={(e) => setFilterCohort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {cohorts.map(cohort => (
                    <option key={cohort.value} value={cohort.value}>{cohort.label}</option>
                  ))}
                </select>

                {/* Industry Filter */}
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {industries.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <DocumentCheckIcon className="h-5 w-5 mr-2" />
                  Bulk Review
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{application.startupName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                          {application.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(application.stage)}`}>
                          {application.stage}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>{application.applicantName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                        <span>{application.industry}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formatDate(application.applicationDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        <span>{application.teamSize} members</span>
                      </div>
                    </div>

                    {/* Business Overview */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Business Overview:</h4>
                      <p className="text-sm text-gray-600 mb-2">{application.problemStatement}</p>
                      <p className="text-sm text-gray-600 mb-2"><strong>Solution:</strong> {application.solution}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div><span className="font-medium">Market Size:</span> {application.marketSize}</div>
                        <div><span className="font-medium">Traction:</span> {application.traction}</div>
                        <div><span className="font-medium">Funding Raised:</span> {formatCurrency(application.fundingRaised)}</div>
                        <div><span className="font-medium">Revenue:</span> {formatCurrency(application.revenue)}</div>
                      </div>
                    </div>

                    {/* Evaluation Scores */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Scores:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(application.evaluation).map(([key, score]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm font-medium text-gray-900">{score}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mentorship Goals */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Mentorship Goals:</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.mentorshipGoals.map((goal, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Documents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{doc.name}</span>
                            <span className="text-xs text-gray-500">({doc.size})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {application.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Review Notes:</h4>
                        <p className="text-sm text-blue-700">{application.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button className="flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      <button className="flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        Assign Mentor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterCohort !== 'all' || filterIndustry !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No KSMP applications have been submitted yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
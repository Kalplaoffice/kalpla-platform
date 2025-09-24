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
  ArrowTrendingUpIcon,
  UsersIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
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
  
  // CRUD Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  
  // Form States
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    startupName: '',
    industry: 'FinTech',
    stage: 'Early Stage',
    status: 'pending',
    cohort: '2024-02',
    teamSize: 1,
    fundingRaised: 0,
    revenue: 0,
    businessModel: '',
    targetMarket: '',
    competitiveAdvantage: '',
    problemStatement: '',
    solution: '',
    marketSize: '',
    traction: '',
    mentorshipGoals: [],
    expectedOutcomes: '',
    timeCommitment: '',
    preferredMentors: [],
    previousExperience: '',
    education: '',
    notes: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Initialize applications data
  useEffect(() => {
    const initialApplications = [
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
    setApplications(initialApplications);
  }, []);

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

  // CRUD Functions
  const handleCreateApplication = () => {
    setFormData({
      applicantName: '',
      email: '',
      phone: '',
      startupName: '',
      industry: 'FinTech',
      stage: 'Early Stage',
      status: 'pending',
      cohort: '2024-02',
      teamSize: 1,
      fundingRaised: 0,
      revenue: 0,
      businessModel: '',
      targetMarket: '',
      competitiveAdvantage: '',
      problemStatement: '',
      solution: '',
      marketSize: '',
      traction: '',
      mentorshipGoals: [],
      expectedOutcomes: '',
      timeCommitment: '',
      preferredMentors: [],
      previousExperience: '',
      education: '',
      notes: '',
      priority: 'medium'
    });
    setSelectedApplication(null);
    setShowCreateModal(true);
  };

  const handleEditApplication = (application: any) => {
    setSelectedApplication(application);
    setFormData({
      applicantName: application.applicantName,
      email: application.email,
      phone: application.phone,
      startupName: application.startupName,
      industry: application.industry,
      stage: application.stage,
      status: application.status,
      cohort: application.cohort,
      teamSize: application.teamSize,
      fundingRaised: application.fundingRaised,
      revenue: application.revenue,
      businessModel: application.businessModel,
      targetMarket: application.targetMarket,
      competitiveAdvantage: application.competitiveAdvantage,
      problemStatement: application.problemStatement,
      solution: application.solution,
      marketSize: application.marketSize,
      traction: application.traction,
      mentorshipGoals: application.mentorshipGoals,
      expectedOutcomes: application.expectedOutcomes,
      timeCommitment: application.timeCommitment,
      preferredMentors: application.preferredMentors,
      previousExperience: application.previousExperience,
      education: application.education,
      notes: application.notes,
      priority: application.priority
    });
    setShowEditModal(true);
  };

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const handleDeleteApplication = (application: any) => {
    setSelectedApplication(application);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (showCreateModal) {
        // Create new application
        const newApplication = {
          id: `KSMP_APP_${String(applications.length + 1).padStart(3, '0')}`,
          ...formData,
          applicationDate: new Date().toISOString(),
          reviewedDate: null,
          reviewedBy: null,
          references: [],
          documents: [],
          evaluation: {
            businessIdea: 0,
            marketPotential: 0,
            teamStrength: 0,
            executionCapability: 0,
            scalability: 0,
            overallScore: 0
          }
        };
        setApplications(prev => [...prev, newApplication]);
        setShowCreateModal(false);
      } else if (showEditModal) {
        // Update existing application
        setApplications(prev => prev.map(application => 
          application.id === selectedApplication.id 
            ? { ...application, ...formData }
            : application
        ));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error saving application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev => prev.filter(application => application.id !== selectedApplication.id));
      setShowDeleteModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error deleting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamSize' || name === 'fundingRaised' || name === 'revenue' ? Number(value) : value
    }));
  };

  const handleMentorshipGoalChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      mentorshipGoals: prev.mentorshipGoals.map((goal, i) => 
        i === index ? value : goal
      )
    }));
  };

  const addMentorshipGoal = () => {
    setFormData(prev => ({
      ...prev,
      mentorshipGoals: [...prev.mentorshipGoals, '']
    }));
  };

  const removeMentorshipGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mentorshipGoals: prev.mentorshipGoals.filter((_, i) => i !== index)
    }));
  };

  const handlePreferredMentorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      preferredMentors: prev.preferredMentors.map((mentor, i) => 
        i === index ? value : mentor
      )
    }));
  };

  const addPreferredMentor = () => {
    setFormData(prev => ({
      ...prev,
      preferredMentors: [...prev.preferredMentors, '']
    }));
  };

  const removePreferredMentor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferredMentors: prev.preferredMentors.filter((_, i) => i !== index)
    }));
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedApplication(null);
    setFormData({
      applicantName: '',
      email: '',
      phone: '',
      startupName: '',
      industry: 'FinTech',
      stage: 'Early Stage',
      status: 'pending',
      cohort: '2024-02',
      teamSize: 1,
      fundingRaised: 0,
      revenue: 0,
      businessModel: '',
      targetMarket: '',
      competitiveAdvantage: '',
      problemStatement: '',
      solution: '',
      marketSize: '',
      traction: '',
      mentorshipGoals: [],
      expectedOutcomes: '',
      timeCommitment: '',
      preferredMentors: [],
      previousExperience: '',
      education: '',
      notes: '',
      priority: 'medium'
    });
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
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">KSMP Applications</h1>
                <p className="text-gray-600 mt-1">Review and manage Kalpla Startup Mentorship Program applications</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateApplication}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Application
                </button>
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
                      <button 
                        onClick={() => handleViewApplication(application)}
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button 
                        onClick={() => handleEditApplication(application)}
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        title="Edit Application"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
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
                      <button 
                        onClick={() => handleDeleteApplication(application)}
                        className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                        title="Delete Application"
                      >
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

      {/* Create Application Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New KSMP Application</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                  <input
                    type="text"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="AgriTech">AgriTech</option>
                    <option value="Logistics">Logistics</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Early Stage">Early Stage</option>
                    <option value="Seed Stage">Seed Stage</option>
                    <option value="Series A">Series A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cohort</label>
                  <select
                    name="cohort"
                    value={formData.cohort}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024-02">Cohort 2024-02</option>
                    <option value="2024-03">Cohort 2024-03</option>
                    <option value="2024-04">Cohort 2024-04</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleFormChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Raised (₹)</label>
                  <input
                    type="number"
                    name="fundingRaised"
                    value={formData.fundingRaised}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (₹)</label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
                <input
                  type="text"
                  name="businessModel"
                  value={formData.businessModel}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Market</label>
                <input
                  type="text"
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competitive Advantage</label>
                <input
                  type="text"
                  name="competitiveAdvantage"
                  value={formData.competitiveAdvantage}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Size</label>
                  <input
                    type="text"
                    name="marketSize"
                    value={formData.marketSize}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Traction</label>
                  <input
                    type="text"
                    name="traction"
                    value={formData.traction}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcomes</label>
                <input
                  type="text"
                  name="expectedOutcomes"
                  value={formData.expectedOutcomes}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Commitment</label>
                <input
                  type="text"
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Experience</label>
                <input
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit KSMP Application</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                  <input
                    type="text"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="AgriTech">AgriTech</option>
                    <option value="Logistics">Logistics</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Early Stage">Early Stage</option>
                    <option value="Seed Stage">Seed Stage</option>
                    <option value="Series A">Series A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cohort</label>
                  <select
                    name="cohort"
                    value={formData.cohort}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024-02">Cohort 2024-02</option>
                    <option value="2024-03">Cohort 2024-03</option>
                    <option value="2024-04">Cohort 2024-04</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleFormChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Raised (₹)</label>
                  <input
                    type="number"
                    name="fundingRaised"
                    value={formData.fundingRaised}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (₹)</label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
                <input
                  type="text"
                  name="businessModel"
                  value={formData.businessModel}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Market</label>
                <input
                  type="text"
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competitive Advantage</label>
                <input
                  type="text"
                  name="competitiveAdvantage"
                  value={formData.competitiveAdvantage}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Size</label>
                  <input
                    type="text"
                    name="marketSize"
                    value={formData.marketSize}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Traction</label>
                  <input
                    type="text"
                    name="traction"
                    value={formData.traction}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcomes</label>
                <input
                  type="text"
                  name="expectedOutcomes"
                  value={formData.expectedOutcomes}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Commitment</label>
                <input
                  type="text"
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Experience</label>
                <input
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Application Modal */}
      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">KSMP Application Details</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selectedApplication.startupName}</h4>
                <p className="text-sm text-gray-500">ID: {selectedApplication.id}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
                    <p className="text-sm text-gray-900">{selectedApplication.applicantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <p className="text-sm text-gray-900">{selectedApplication.industry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stage</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(selectedApplication.stage)}`}>
                      {selectedApplication.stage}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cohort</label>
                    <p className="text-sm text-gray-900">{selectedApplication.cohort}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Team Size</label>
                    <p className="text-sm text-gray-900">{selectedApplication.teamSize} members</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Funding Raised</label>
                    <p className="text-sm text-gray-900">₹{selectedApplication.fundingRaised.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Revenue</label>
                    <p className="text-sm text-gray-900">₹{selectedApplication.revenue.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedApplication.priority)}`}>
                      {selectedApplication.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedApplication.applicationDate)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Model</label>
                <p className="text-sm text-gray-600">{selectedApplication.businessModel}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
                <p className="text-sm text-gray-600">{selectedApplication.targetMarket}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competitive Advantage</label>
                <p className="text-sm text-gray-600">{selectedApplication.competitiveAdvantage}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
                <p className="text-sm text-gray-600">{selectedApplication.problemStatement}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
                <p className="text-sm text-gray-600">{selectedApplication.solution}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
                  <p className="text-sm text-gray-600">{selectedApplication.marketSize}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Traction</label>
                  <p className="text-sm text-gray-600">{selectedApplication.traction}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Outcomes</label>
                <p className="text-sm text-gray-600">{selectedApplication.expectedOutcomes}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment</label>
                <p className="text-sm text-gray-600">{selectedApplication.timeCommitment}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
                <p className="text-sm text-gray-600">{selectedApplication.previousExperience}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <p className="text-sm text-gray-600">{selectedApplication.education}</p>
              </div>
              
              {selectedApplication.mentorshipGoals && selectedApplication.mentorshipGoals.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mentorship Goals</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.mentorshipGoals.map((goal: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedApplication.preferredMentors && selectedApplication.preferredMentors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Mentors</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.preferredMentors.map((mentor: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {mentor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedApplication.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <p className="text-sm text-gray-600">{selectedApplication.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delete KSMP Application</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the application for <strong>{selectedApplication.startupName}</strong> by <strong>{selectedApplication.applicantName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
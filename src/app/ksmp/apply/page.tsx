'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { applicationService } from '@/lib/applicationService';
import { 
  RocketLaunchIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  TrophyIcon,
  BanknotesIcon,
  LightBulbIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface KSMPApplicationForm {
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
  };
  startupInfo: {
    startupName: string;
    tagline: string;
    industry: string;
    stage: string;
    foundedDate: string;
    coFounders: string;
    teamSize: string;
    website: string;
    socialMedia: string;
  };
  businessInfo: {
    problemStatement: string;
    solution: string;
    targetMarket: string;
    businessModel: string;
    revenueStreams: string;
    competitiveAdvantage: string;
    traction: string;
    fundingHistory: string;
  };
  ksmpInterest: {
    whyKSMP: string;
    expectations: string;
    commitment: string;
    mentorPreferences: string;
    goals: string;
  };
  documents: {
    pitchDeck: File | null;
    businessPlan: File | null;
    financialProjections: File | null;
    teamResumes: File | null;
    photo: File | null;
  };
}

interface KSMPPhase {
  id: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  skills: string[];
}

export default function KSMPApplyPage() {
  const { user } = useUser();
  const [applicationForm, setApplicationForm] = useState<KSMPApplicationForm>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      linkedinProfile: '',
      website: ''
    },
    startupInfo: {
      startupName: '',
      tagline: '',
      industry: '',
      stage: '',
      foundedDate: '',
      coFounders: '',
      teamSize: '',
      website: '',
      socialMedia: ''
    },
    businessInfo: {
      problemStatement: '',
      solution: '',
      targetMarket: '',
      businessModel: '',
      revenueStreams: '',
      competitiveAdvantage: '',
      traction: '',
      fundingHistory: ''
    },
    ksmpInterest: {
      whyKSMP: '',
      expectations: '',
      commitment: '',
      mentorPreferences: '',
      goals: ''
    },
    documents: {
      pitchDeck: null,
      businessPlan: null,
      financialProjections: null,
      teamResumes: null,
      photo: null
    }
  });

  const [ksmpPhases, setKsmpPhases] = useState<KSMPPhase[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const industryOptions = [
    'Technology & Software',
    'Healthcare & Life Sciences',
    'FinTech',
    'EdTech',
    'E-commerce & Retail',
    'Manufacturing',
    'Real Estate',
    'Energy & Environment',
    'Media & Entertainment',
    'Agriculture & Food',
    'Transportation & Logistics',
    'Consulting',
    'Other'
  ];

  const stageOptions = [
    'Idea Stage',
    'MVP Development',
    'Early Stage',
    'Growth Stage',
    'Scale Stage'
  ];

  useEffect(() => {
    // Mock KSMP phases data
    const mockPhases: KSMPPhase[] = [
      {
        id: 1,
        title: 'Business Idea & Market Research',
        description: 'Validate your business idea and conduct comprehensive market research',
        duration: '4 weeks',
        deliverables: ['Market Research Report', 'Competitive Analysis', 'Customer Personas'],
        skills: ['Market Research', 'Business Ideation', 'Competitive Analysis']
      },
      {
        id: 2,
        title: 'Business Model & Strategy',
        description: 'Develop a robust business model and strategic plan',
        duration: '4 weeks',
        deliverables: ['Business Model Canvas', 'Strategic Plan', 'Value Proposition'],
        skills: ['Business Modeling', 'Strategic Planning', 'Value Proposition']
      },
      {
        id: 3,
        title: 'Financial Planning & Funding',
        description: 'Create financial models and develop funding strategies',
        duration: '4 weeks',
        deliverables: ['Financial Model', 'Funding Strategy', 'Pitch Deck'],
        skills: ['Financial Modeling', 'Fundraising', 'Investment Strategy']
      },
      {
        id: 4,
        title: 'Product Development & MVP',
        description: 'Build and test your minimum viable product',
        duration: '6 weeks',
        deliverables: ['MVP', 'User Testing Report', 'Product Roadmap'],
        skills: ['Product Development', 'MVP Creation', 'User Testing']
      },
      {
        id: 5,
        title: 'Marketing & Branding',
        description: 'Develop marketing strategy and brand identity',
        duration: '4 weeks',
        deliverables: ['Marketing Strategy', 'Brand Guidelines', 'Content Plan'],
        skills: ['Marketing Strategy', 'Brand Development', 'Digital Marketing']
      },
      {
        id: 6,
        title: 'Sales & Customer Acquisition',
        description: 'Build sales processes and acquire customers',
        duration: '4 weeks',
        deliverables: ['Sales Process', 'Customer Acquisition Plan', 'CRM Setup'],
        skills: ['Sales Strategy', 'Customer Acquisition', 'CRM']
      },
      {
        id: 7,
        title: 'Operations & Scaling',
        description: 'Optimize operations and prepare for scaling',
        duration: '4 weeks',
        deliverables: ['Operations Manual', 'Scaling Plan', 'Process Optimization'],
        skills: ['Operations Management', 'Process Optimization', 'Scaling']
      },
      {
        id: 8,
        title: 'Team Building & Leadership',
        description: 'Build and lead high-performing teams',
        duration: '4 weeks',
        deliverables: ['Team Structure', 'Leadership Plan', 'HR Policies'],
        skills: ['Team Building', 'Leadership', 'HR Management']
      },
      {
        id: 9,
        title: 'Technology & Innovation',
        description: 'Leverage technology for competitive advantage',
        duration: '4 weeks',
        deliverables: ['Technology Strategy', 'Innovation Plan', 'Tech Stack'],
        skills: ['Technology Strategy', 'Innovation', 'Digital Transformation']
      },
      {
        id: 10,
        title: 'Legal & Compliance',
        description: 'Ensure legal compliance and protect intellectual property',
        duration: '4 weeks',
        deliverables: ['Legal Structure', 'Compliance Checklist', 'IP Strategy'],
        skills: ['Legal Structure', 'Compliance', 'Intellectual Property']
      },
      {
        id: 11,
        title: 'International Expansion',
        description: 'Plan and execute international market entry',
        duration: '4 weeks',
        deliverables: ['International Strategy', 'Market Entry Plan', 'Partnership Strategy'],
        skills: ['International Business', 'Market Entry', 'Global Strategy']
      },
      {
        id: 12,
        title: 'Exit Strategy & Growth',
        description: 'Plan exit strategies and long-term growth',
        duration: '4 weeks',
        deliverables: ['Exit Strategy', 'Growth Plan', 'Strategic Partnerships'],
        skills: ['Exit Strategy', 'Growth Planning', 'Strategic Partnerships']
      }
    ];

    setKsmpPhases(mockPhases);

    // Pre-fill form with user data if available
    if (user) {
      setApplicationForm(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: user.email || '',
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || ''
        }
      }));
    }
  }, [user]);

  const handleInputChange = (section: keyof KSMPApplicationForm, field: string, value: any) => {
    setApplicationForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setApplicationForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      alert('Please sign in to submit your application.');
      return;
    }

    setSubmitting(true);
    try {
      try {
        await applicationService.submitKSMPApplication({
          userId: user?.id || '',
          ...applicationForm
        });
        console.log('KSMP application submitted successfully');
        // Redirect to success page or show success message
      } catch (error) {
        console.error('Error submitting KSMP application:', error);
        // Show error message
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Application submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={applicationForm.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={applicationForm.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={applicationForm.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={applicationForm.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={applicationForm.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={applicationForm.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea
                value={applicationForm.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={applicationForm.personalInfo.city}
                  onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  value={applicationForm.personalInfo.state}
                  onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={applicationForm.personalInfo.pincode}
                  onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={applicationForm.personalInfo.linkedinProfile}
                  onChange={(e) => handleInputChange('personalInfo', 'linkedinProfile', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Website</label>
                <input
                  type="url"
                  value={applicationForm.personalInfo.website}
                  onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Startup Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name *</label>
                <input
                  type="text"
                  value={applicationForm.startupInfo.startupName}
                  onChange={(e) => handleInputChange('startupInfo', 'startupName', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline *</label>
                <input
                  type="text"
                  value={applicationForm.startupInfo.tagline}
                  onChange={(e) => handleInputChange('startupInfo', 'tagline', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="One-line description of your startup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={applicationForm.startupInfo.industry}
                  onChange={(e) => handleInputChange('startupInfo', 'industry', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage *</label>
                <select
                  value={applicationForm.startupInfo.stage}
                  onChange={(e) => handleInputChange('startupInfo', 'stage', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Stage</option>
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Founded Date *</label>
                <input
                  type="date"
                  value={applicationForm.startupInfo.foundedDate}
                  onChange={(e) => handleInputChange('startupInfo', 'foundedDate', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Co-founders</label>
                <input
                  type="text"
                  value={applicationForm.startupInfo.coFounders}
                  onChange={(e) => handleInputChange('startupInfo', 'coFounders', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Names and roles of co-founders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size *</label>
                <input
                  type="text"
                  value={applicationForm.startupInfo.teamSize}
                  onChange={(e) => handleInputChange('startupInfo', 'teamSize', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 3 people"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Website</label>
                <input
                  type="url"
                  value={applicationForm.startupInfo.website}
                  onChange={(e) => handleInputChange('startupInfo', 'website', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://yourstartup.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              <input
                type="text"
                value={applicationForm.startupInfo.socialMedia}
                onChange={(e) => handleInputChange('startupInfo', 'socialMedia', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Twitter, Instagram, Facebook handles"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement *</label>
              <textarea
                value={applicationForm.businessInfo.problemStatement}
                onChange={(e) => handleInputChange('businessInfo', 'problemStatement', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What problem are you solving? Who has this problem?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Solution *</label>
              <textarea
                value={applicationForm.businessInfo.solution}
                onChange={(e) => handleInputChange('businessInfo', 'solution', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="How are you solving this problem? What is your product/service?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Market *</label>
              <textarea
                value={applicationForm.businessInfo.targetMarket}
                onChange={(e) => handleInputChange('businessInfo', 'targetMarket', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Who are your target customers? What is the market size?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Model *</label>
              <textarea
                value={applicationForm.businessInfo.businessModel}
                onChange={(e) => handleInputChange('businessInfo', 'businessModel', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="How do you make money? What is your revenue model?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Streams</label>
              <textarea
                value={applicationForm.businessInfo.revenueStreams}
                onChange={(e) => handleInputChange('businessInfo', 'revenueStreams', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List all your revenue streams"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Competitive Advantage *</label>
              <textarea
                value={applicationForm.businessInfo.competitiveAdvantage}
                onChange={(e) => handleInputChange('businessInfo', 'competitiveAdvantage', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What makes you different from competitors? What is your moat?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Traction *</label>
              <textarea
                value={applicationForm.businessInfo.traction}
                onChange={(e) => handleInputChange('businessInfo', 'traction', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What traction do you have? Users, revenue, partnerships, etc."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding History</label>
              <textarea
                value={applicationForm.businessInfo.fundingHistory}
                onChange={(e) => handleInputChange('businessInfo', 'fundingHistory', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Previous funding rounds, amounts, investors"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">KSMP Interest & Goals</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">KSMP Program Overview</h4>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  The Kalpla Startup Mentorship Program (KSMP) is a comprehensive 12-phase program designed to guide startups 
                  from idea to scale. Each phase focuses on specific aspects of business development with expert mentorship.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ksmpPhases.slice(0, 6).map((phase) => (
                    <div key={phase.id} className="text-xs text-gray-600">
                      <strong>Phase {phase.id}:</strong> {phase.title}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">...and 6 more phases covering advanced topics</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join KSMP? *</label>
              <textarea
                value={applicationForm.ksmpInterest.whyKSMP}
                onChange={(e) => handleInputChange('ksmpInterest', 'whyKSMP', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What specific value do you expect from KSMP? How will it help your startup?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations from KSMP? *</label>
              <textarea
                value={applicationForm.ksmpInterest.expectations}
                onChange={(e) => handleInputChange('ksmpInterest', 'expectations', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What specific outcomes do you expect from the program?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Commitment Level *</label>
              <textarea
                value={applicationForm.ksmpInterest.commitment}
                onChange={(e) => handleInputChange('ksmpInterest', 'commitment', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="How much time can you commit to the program? What is your availability?"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentor Preferences</label>
              <textarea
                value={applicationForm.ksmpInterest.mentorPreferences}
                onChange={(e) => handleInputChange('ksmpInterest', 'mentorPreferences', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What type of mentor would you prefer? Any specific industry expertise?"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Goals & Objectives *</label>
              <textarea
                value={applicationForm.ksmpInterest.goals}
                onChange={(e) => handleInputChange('ksmpInterest', 'goals', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="What are your short-term and long-term goals? What do you want to achieve?"
                required
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Deck *</label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={(e) => handleFileChange('pitchDeck', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload your startup pitch deck (PDF or PowerPoint)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Plan</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('businessPlan', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Upload your detailed business plan (optional)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Financial Projections</label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => handleFileChange('financialProjections', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Upload your financial projections and models (optional)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Resumes</label>
                <input
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => handleFileChange('teamResumes', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Upload resumes of key team members (optional)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Founder Photo *</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload a professional photo of yourself</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply to KSMP</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join the Kalpla Startup Mentorship Program and accelerate your startup journey with expert guidance, 
            structured learning, and access to a network of successful entrepreneurs and investors.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Join KSMP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <UserGroupIcon className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Expert Mentorship</h3>
                <p className="text-sm text-gray-600">Get guidance from industry experts and successful entrepreneurs</p>
              </div>
            </div>
            <div className="flex items-start">
              <RocketLaunchIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Structured Program</h3>
                <p className="text-sm text-gray-600">12-phase comprehensive program covering all aspects of startup development</p>
              </div>
            </div>
            <div className="flex items-start">
              <ChartBarIcon className="h-6 w-6 text-purple-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Proven Track Record</h3>
                <p className="text-sm text-gray-600">KSMP alumni have raised millions in funding and built successful companies</p>
              </div>
            </div>
            <div className="flex items-start">
              <StarIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Network Access</h3>
                <p className="text-sm text-gray-600">Connect with investors, mentors, and fellow entrepreneurs</p>
              </div>
            </div>
            <div className="flex items-start">
              <TrophyIcon className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Demo Day</h3>
                <p className="text-sm text-gray-600">Present your startup to investors and industry leaders</p>
              </div>
            </div>
            <div className="flex items-start">
              <CogIcon className="h-6 w-6 text-teal-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Practical Learning</h3>
                <p className="text-sm text-gray-600">Hands-on workshops and real-world project implementation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">KSMP Application Form</h2>
              <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="px-6 pb-6 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSuccessModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your interest in joining KSMP. We will review your application 
                    and get back to you within 7-10 business days.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      href="/ksmp"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface InvestorApplicationForm {
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
  professionalInfo: {
    currentPosition: string;
    company: string;
    industry: string;
    yearsOfExperience: string;
    investmentExperience: string;
    investmentFocus: string[];
    preferredStages: string[];
    investmentRange: string;
    previousInvestments: string;
    achievements: string;
  };
  investmentCriteria: {
    preferredIndustries: string[];
    geographicFocus: string[];
    investmentSize: string;
    investmentHorizon: string;
    riskTolerance: string;
    valueAdd: string[];
    dueDiligenceProcess: string;
  };
  ksmpInterest: {
    whyInvest: string;
    valueProposition: string;
    expectations: string;
    portfolioFit: string;
  };
  documents: {
    resume: File | null;
    portfolio: File | null;
    financialStatements: File | null;
    photo: File | null;
  };
}

interface InvestmentStage {
  id: string;
  name: string;
  description: string;
  typicalInvestment: string;
  riskLevel: string;
}

export default function InvestorsApplyPage() {
  const { user } = useUser();
  const [applicationForm, setApplicationForm] = useState<InvestorApplicationForm>({
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
    professionalInfo: {
      currentPosition: '',
      company: '',
      industry: '',
      yearsOfExperience: '',
      investmentExperience: '',
      investmentFocus: [],
      preferredStages: [],
      investmentRange: '',
      previousInvestments: '',
      achievements: ''
    },
    investmentCriteria: {
      preferredIndustries: [],
      geographicFocus: [],
      investmentSize: '',
      investmentHorizon: '',
      riskTolerance: '',
      valueAdd: [],
      dueDiligenceProcess: ''
    },
    ksmpInterest: {
      whyInvest: '',
      valueProposition: '',
      expectations: '',
      portfolioFit: ''
    },
    documents: {
      resume: null,
      portfolio: null,
      financialStatements: null,
      photo: null
    }
  });

  const [investmentStages, setInvestmentStages] = useState<InvestmentStage[]>([]);
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

  const investmentFocusOptions = [
    'Early Stage Startups',
    'Growth Stage Companies',
    'Technology Innovation',
    'Social Impact',
    'Sustainable Business',
    'International Expansion',
    'M&A Opportunities',
    'Turnaround Situations'
  ];

  const valueAddOptions = [
    'Strategic Guidance',
    'Industry Expertise',
    'Network Access',
    'Operational Support',
    'Financial Management',
    'Marketing & Sales',
    'Technology Development',
    'International Markets',
    'Regulatory Compliance',
    'Team Building',
    'Fundraising Support',
    'Exit Strategy'
  ];

  const geographicOptions = [
    'India',
    'Southeast Asia',
    'North America',
    'Europe',
    'Middle East',
    'Africa',
    'Global'
  ];

  useEffect(() => {
    // Mock investment stages data
    const mockStages: InvestmentStage[] = [
      {
        id: 'idea',
        name: 'Idea Stage',
        description: 'Very early stage with just an idea or concept',
        typicalInvestment: '₹1-5 Lakhs',
        riskLevel: 'Very High'
      },
      {
        id: 'mvp',
        name: 'MVP Stage',
        description: 'Minimum Viable Product developed and tested',
        typicalInvestment: '₹5-25 Lakhs',
        riskLevel: 'High'
      },
      {
        id: 'early',
        name: 'Early Stage',
        description: 'Product launched with initial traction',
        typicalInvestment: '₹25 Lakhs - ₹1 Crore',
        riskLevel: 'High'
      },
      {
        id: 'growth',
        name: 'Growth Stage',
        description: 'Proven business model with scaling potential',
        typicalInvestment: '₹1-10 Crores',
        riskLevel: 'Medium'
      },
      {
        id: 'scale',
        name: 'Scale Stage',
        description: 'Established business ready for expansion',
        typicalInvestment: '₹10+ Crores',
        riskLevel: 'Medium'
      }
    ];

    setInvestmentStages(mockStages);

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

  const handleInputChange = (section: keyof InvestorApplicationForm, field: string, value: any) => {
    setApplicationForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof InvestorApplicationForm, field: string, value: string, checked: boolean) => {
    setApplicationForm(prev => {
      const currentArray = (prev[section] as any)[field] as string[];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
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
      // TODO: Implement actual application submission API call
      console.log('Submitting investor application:', applicationForm);
      
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Website/Portfolio</label>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Position *</label>
                <input
                  type="text"
                  value={applicationForm.professionalInfo.currentPosition}
                  onChange={(e) => handleInputChange('professionalInfo', 'currentPosition', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <input
                  type="text"
                  value={applicationForm.professionalInfo.company}
                  onChange={(e) => handleInputChange('professionalInfo', 'company', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <input
                  type="text"
                  value={applicationForm.professionalInfo.industry}
                  onChange={(e) => handleInputChange('professionalInfo', 'industry', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="text"
                  value={applicationForm.professionalInfo.yearsOfExperience}
                  onChange={(e) => handleInputChange('professionalInfo', 'yearsOfExperience', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Experience *</label>
              <textarea
                value={applicationForm.professionalInfo.investmentExperience}
                onChange={(e) => handleInputChange('professionalInfo', 'investmentExperience', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your investment experience and track record"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Focus *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {investmentFocusOptions.map((focus) => (
                  <label key={focus} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.professionalInfo.investmentFocus.includes(focus)}
                      onChange={(e) => handleArrayChange('professionalInfo', 'investmentFocus', focus, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{focus}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Investment Stages *</label>
              <div className="space-y-3">
                {investmentStages.map((stage) => (
                  <div key={stage.id} className="border border-gray-200 rounded-lg p-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={applicationForm.professionalInfo.preferredStages.includes(stage.id)}
                        onChange={(e) => handleArrayChange('professionalInfo', 'preferredStages', stage.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{stage.name}</div>
                        <div className="text-sm text-gray-600">{stage.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Typical Investment: {stage.typicalInvestment} | Risk: {stage.riskLevel}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range *</label>
              <select
                value={applicationForm.professionalInfo.investmentRange}
                onChange={(e) => handleInputChange('professionalInfo', 'investmentRange', e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Investment Range</option>
                <option value="1-5 lakhs">₹1-5 Lakhs</option>
                <option value="5-25 lakhs">₹5-25 Lakhs</option>
                <option value="25 lakhs-1 crore">₹25 Lakhs - ₹1 Crore</option>
                <option value="1-5 crores">₹1-5 Crores</option>
                <option value="5-10 crores">₹5-10 Crores</option>
                <option value="10+ crores">₹10+ Crores</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Investments</label>
              <textarea
                value={applicationForm.professionalInfo.previousInvestments}
                onChange={(e) => handleInputChange('professionalInfo', 'previousInvestments', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List your previous investments and their outcomes"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements *</label>
              <textarea
                value={applicationForm.professionalInfo.achievements}
                onChange={(e) => handleInputChange('professionalInfo', 'achievements', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your key professional achievements"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Criteria</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {industryOptions.map((industry) => (
                  <label key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.investmentCriteria.preferredIndustries.includes(industry)}
                      onChange={(e) => handleArrayChange('investmentCriteria', 'preferredIndustries', industry, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Focus *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {geographicOptions.map((region) => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.investmentCriteria.geographicFocus.includes(region)}
                      onChange={(e) => handleArrayChange('investmentCriteria', 'geographicFocus', region, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Size *</label>
                <select
                  value={applicationForm.investmentCriteria.investmentSize}
                  onChange={(e) => handleInputChange('investmentCriteria', 'investmentSize', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Investment Size</option>
                  <option value="1-5 lakhs">₹1-5 Lakhs</option>
                  <option value="5-25 lakhs">₹5-25 Lakhs</option>
                  <option value="25 lakhs-1 crore">₹25 Lakhs - ₹1 Crore</option>
                  <option value="1-5 crores">₹1-5 Crores</option>
                  <option value="5+ crores">₹5+ Crores</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Horizon *</label>
                <select
                  value={applicationForm.investmentCriteria.investmentHorizon}
                  onChange={(e) => handleInputChange('investmentCriteria', 'investmentHorizon', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Investment Horizon</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-7 years">5-7 years</option>
                  <option value="7+ years">7+ years</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance *</label>
              <select
                value={applicationForm.investmentCriteria.riskTolerance}
                onChange={(e) => handleInputChange('investmentCriteria', 'riskTolerance', e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Risk Tolerance</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
                <option value="very-aggressive">Very Aggressive</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Value Add Capabilities *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {valueAddOptions.map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.investmentCriteria.valueAdd.includes(value)}
                      onChange={(e) => handleArrayChange('investmentCriteria', 'valueAdd', value, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Diligence Process *</label>
              <textarea
                value={applicationForm.investmentCriteria.dueDiligenceProcess}
                onChange={(e) => handleInputChange('investmentCriteria', 'dueDiligenceProcess', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your due diligence process and criteria"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">KSMP Interest & Expectations</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to invest in KSMP startups? *</label>
              <textarea
                value={applicationForm.ksmpInterest.whyInvest}
                onChange={(e) => handleInputChange('ksmpInterest', 'whyInvest', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Explain your motivation for investing in KSMP startups"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What value will you bring to KSMP startups? *</label>
              <textarea
                value={applicationForm.ksmpInterest.valueProposition}
                onChange={(e) => handleInputChange('ksmpInterest', 'valueProposition', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the unique value you can provide to startups"
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
                placeholder="Share your expectations from the KSMP program"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">How does KSMP fit into your investment portfolio?</label>
              <textarea
                value={applicationForm.ksmpInterest.portfolioFit}
                onChange={(e) => handleInputChange('ksmpInterest', 'portfolioFit', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Explain how KSMP aligns with your investment strategy"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Portfolio</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx"
                  onChange={(e) => handleFileChange('portfolio', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statements</label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => handleFileChange('financialStatements', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Photo *</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Become a KSMP Investor</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our exclusive network of investors and discover high-potential startups from the Kalpla Startup Mentorship Program. 
            Access curated investment opportunities and connect with promising entrepreneurs.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Invest in KSMP Startups?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <TrophyIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Curated Opportunities</h3>
                <p className="text-sm text-gray-600">Access pre-screened, high-potential startups</p>
              </div>
            </div>
            <div className="flex items-start">
              <UserGroupIcon className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Mentored Founders</h3>
                <p className="text-sm text-gray-600">Invest in founders guided by industry experts</p>
              </div>
            </div>
            <div className="flex items-start">
              <ChartBarIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Proven Track Record</h3>
                <p className="text-sm text-gray-600">KSMP alumni have achieved significant success</p>
              </div>
            </div>
            <div className="flex items-start">
              <StarIcon className="h-6 w-6 text-purple-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Early Access</h3>
                <p className="text-sm text-gray-600">Get first access to promising startups</p>
              </div>
            </div>
            <div className="flex items-start">
              <BuildingOfficeIcon className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Network Access</h3>
                <p className="text-sm text-gray-600">Connect with other investors and mentors</p>
              </div>
            </div>
            <div className="flex items-start">
              <BanknotesIcon className="h-6 w-6 text-teal-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Flexible Investment</h3>
                <p className="text-sm text-gray-600">Choose investment size and terms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Investor Application Form</h2>
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
                    Thank you for your interest in becoming a KSMP investor. We will review your application 
                    and get back to you within 3-5 business days.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      href="/investors"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Investors
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

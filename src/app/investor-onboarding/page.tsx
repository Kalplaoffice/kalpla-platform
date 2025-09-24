'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

interface InvestorApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Professional Information
  investorType: string;
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  
  // Investment Information
  investmentRange: string;
  typicalTicketSize: string;
  sectorsOfInterest: string[];
  investmentStage: string[];
  geographicFocus: string[];
  
  // Portfolio Information
  portfolioSize: string;
  numberOfInvestments: string;
  notableInvestments: string;
  exitExperience: string;
  
  // Investment Criteria
  investmentCriteria: string;
  dueDiligenceProcess: string;
  valueAddCapabilities: string[];
  
  // Network & Resources
  networkSize: string;
  industryConnections: string[];
  resources: string[];
  
  // Motivation & Goals
  motivation: string;
  goals: string;
  expectations: string;
  
  // Additional Information
  linkedinProfile: string;
  website: string;
  pitchDeck: File | null;
  profilePicture: File | null;
  
  // Terms & Conditions
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToNDA: boolean;
}

export default function InvestorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvestorApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    investorType: '',
    currentCompany: '',
    currentPosition: '',
    yearsOfExperience: '',
    investmentRange: '',
    typicalTicketSize: '',
    sectorsOfInterest: [],
    investmentStage: [],
    geographicFocus: [],
    portfolioSize: '',
    numberOfInvestments: '',
    notableInvestments: '',
    exitExperience: '',
    investmentCriteria: '',
    dueDiligenceProcess: '',
    valueAddCapabilities: [],
    networkSize: '',
    industryConnections: [],
    resources: [],
    motivation: '',
    goals: '',
    expectations: '',
    linkedinProfile: '',
    website: '',
    pitchDeck: null,
    profilePicture: null,
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToNDA: false
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: UserIcon },
    { id: 2, title: 'Investment Profile', icon: CurrencyDollarIcon },
    { id: 3, title: 'Portfolio & Experience', icon: ChartBarIcon },
    { id: 4, title: 'Investment Criteria', icon: BriefcaseIcon },
    { id: 5, title: 'Network & Resources', icon: GlobeAltIcon },
    { id: 6, title: 'Motivation & Goals', icon: DocumentTextIcon },
    { id: 7, title: 'Documents & Review', icon: CheckCircleIcon }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field as keyof InvestorApplicationData] as string[]), value]
        : (prev[field as keyof InvestorApplicationData] as string[]).filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push('/investor-onboarding/success');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investor Type *</label>
                <select
                  value={formData.investorType}
                  onChange={(e) => handleInputChange('investorType', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Angel Investor">Angel Investor</option>
                  <option value="VC Partner">VC Partner</option>
                  <option value="VC Associate">VC Associate</option>
                  <option value="Corporate VC">Corporate VC</option>
                  <option value="Family Office">Family Office</option>
                  <option value="PE Investor">PE Investor</option>
                  <option value="Crowdfunding">Crowdfunding</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Profile</h2>
              <p className="text-gray-600">Share your investment preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range *</label>
                <select
                  value={formData.investmentRange}
                  onChange={(e) => handleInputChange('investmentRange', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Range</option>
                  <option value="₹1L - ₹10L">₹1L - ₹10L</option>
                  <option value="₹10L - ₹50L">₹10L - ₹50L</option>
                  <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
                  <option value="₹1Cr - ₹5Cr">₹1Cr - ₹5Cr</option>
                  <option value="₹5Cr - ₹10Cr">₹5Cr - ₹10Cr</option>
                  <option value="₹10Cr+">₹10Cr+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typical Ticket Size *</label>
                <select
                  value={formData.typicalTicketSize}
                  onChange={(e) => handleInputChange('typicalTicketSize', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Ticket Size</option>
                  <option value="₹1L - ₹5L">₹1L - ₹5L</option>
                  <option value="₹5L - ₹25L">₹5L - ₹25L</option>
                  <option value="₹25L - ₹50L">₹25L - ₹50L</option>
                  <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
                  <option value="₹1Cr - ₹2Cr">₹1Cr - ₹2Cr</option>
                  <option value="₹2Cr+">₹2Cr+</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sectors of Interest *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Technology', 'Fintech', 'Healthcare', 'EdTech', 'E-commerce', 'SaaS', 'AI/ML', 'Blockchain', 'CleanTech', 'AgriTech', 'PropTech', 'Other'].map(sector => (
                  <label key={sector} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sectorsOfInterest.includes(sector)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('sectorsOfInterest', sector, 'add');
                        } else {
                          handleArrayChange('sectorsOfInterest', sector, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{sector}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Stage *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth Stage', 'Late Stage'].map(stage => (
                  <label key={stage} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.investmentStage.includes(stage)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('investmentStage', stage, 'add');
                        } else {
                          handleArrayChange('investmentStage', stage, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{stage}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Focus *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['India', 'US', 'Europe', 'Southeast Asia', 'Middle East', 'Africa', 'Global'].map(region => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.geographicFocus.includes(region)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('geographicFocus', region, 'add');
                        } else {
                          handleArrayChange('geographicFocus', region, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio & Experience</h2>
              <p className="text-gray-600">Share your investment track record</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Size *</label>
                <select
                  value={formData.portfolioSize}
                  onChange={(e) => handleInputChange('portfolioSize', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="₹1Cr - ₹10Cr">₹1Cr - ₹10Cr</option>
                  <option value="₹10Cr - ₹50Cr">₹10Cr - ₹50Cr</option>
                  <option value="₹50Cr - ₹100Cr">₹50Cr - ₹100Cr</option>
                  <option value="₹100Cr - ₹500Cr">₹100Cr - ₹500Cr</option>
                  <option value="₹500Cr+">₹500Cr+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Investments *</label>
                <select
                  value={formData.numberOfInvestments}
                  onChange={(e) => handleInputChange('numberOfInvestments', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Count</option>
                  <option value="1-5">1-5 investments</option>
                  <option value="6-15">6-15 investments</option>
                  <option value="16-30">16-30 investments</option>
                  <option value="31-50">31-50 investments</option>
                  <option value="50+">50+ investments</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notable Investments</label>
              <textarea
                value={formData.notableInvestments}
                onChange={(e) => handleInputChange('notableInvestments', e.target.value)}
                rows={4}
                placeholder="List your notable investments and their outcomes..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exit Experience</label>
              <textarea
                value={formData.exitExperience}
                onChange={(e) => handleInputChange('exitExperience', e.target.value)}
                rows={4}
                placeholder="Describe your experience with exits (IPOs, acquisitions, etc.)..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Criteria</h2>
              <p className="text-gray-600">Share your investment decision process</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Criteria *</label>
              <textarea
                value={formData.investmentCriteria}
                onChange={(e) => handleInputChange('investmentCriteria', e.target.value)}
                rows={4}
                placeholder="What do you look for in startups? What are your key criteria?"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Diligence Process *</label>
              <textarea
                value={formData.dueDiligenceProcess}
                onChange={(e) => handleInputChange('dueDiligenceProcess', e.target.value)}
                rows={4}
                placeholder="Describe your due diligence process and timeline..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value-Add Capabilities *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Strategic Guidance', 'Business Development', 'Fundraising', 'Talent Acquisition', 'Market Access', 'Technology Expertise', 'Operational Support', 'Network Access', 'Mentorship', 'Industry Knowledge'].map(capability => (
                  <label key={capability} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.valueAddCapabilities.includes(capability)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('valueAddCapabilities', capability, 'add');
                        } else {
                          handleArrayChange('valueAddCapabilities', capability, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{capability}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Network & Resources</h2>
              <p className="text-gray-600">Share your network and available resources</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Size *</label>
              <select
                value={formData.networkSize}
                onChange={(e) => handleInputChange('networkSize', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Size</option>
                <option value="Small (50-200)">Small (50-200)</option>
                <option value="Medium (200-1000)">Medium (200-1000)</option>
                <option value="Large (1000-5000)">Large (1000-5000)</option>
                <option value="Very Large (5000+)">Very Large (5000+)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry Connections *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['C-Level Executives', 'Industry Experts', 'Government Officials', 'Media Contacts', 'Academic Researchers', 'Legal Professionals', 'Financial Advisors', 'Technology Leaders', 'Startup Founders', 'Other Investors'].map(connection => (
                  <label key={connection} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.industryConnections.includes(connection)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('industryConnections', connection, 'add');
                        } else {
                          handleArrayChange('industryConnections', connection, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{connection}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Resources *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Office Space', 'Meeting Rooms', 'Event Venues', 'Legal Services', 'Accounting Services', 'Marketing Support', 'Technology Infrastructure', 'Research Tools', 'Industry Reports', 'Mentorship Programs'].map(resource => (
                  <label key={resource} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.resources.includes(resource)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('resources', resource, 'add');
                        } else {
                          handleArrayChange('resources', resource, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{resource}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Motivation & Goals</h2>
              <p className="text-gray-600">Tell us why you want to invest through Kalpla</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you to invest in startups? *</label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                placeholder="Share your motivation for investing in startups..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your investment goals? *</label>
              <textarea
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                rows={4}
                placeholder="Describe your investment goals and objectives..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations from Kalpla? *</label>
              <textarea
                value={formData.expectations}
                onChange={(e) => handleInputChange('expectations', e.target.value)}
                rows={4}
                placeholder="Share your expectations from the Kalpla platform..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website/Portfolio</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents & Review</h2>
              <p className="text-gray-600">Upload documents and review your application</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload your profile picture</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('profilePicture', e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Pitch Deck</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload your investment pitch deck (PDF)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleInputChange('pitchDeck', e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Investor Type:</span> {formData.investorType}</p>
                <p><span className="font-medium">Investment Range:</span> {formData.investmentRange}</p>
                <p><span className="font-medium">Sectors:</span> {formData.sectorsOfInterest.join(', ')}</p>
                <p><span className="font-medium">Portfolio Size:</span> {formData.portfolioSize}</p>
                <p><span className="font-medium">Network Size:</span> {formData.networkSize}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a> *
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToPrivacy}
                    onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> *
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToNDA}
                    onChange={(e) => handleInputChange('agreeToNDA', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to sign a <a href="/nda" className="text-blue-600 hover:text-blue-800">Non-Disclosure Agreement</a> *
                  </span>
                </label>
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Kalpla</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToNDA}
              className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                isSubmitting || !formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToNDA
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              <CheckCircleIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { investorApplicationService, InvestorApplication, InvestmentCriteria, DueDiligence, RiskAssessment, ComplianceDocument, Reference } from '@/lib/investorApplicationService';

export default function InvestorApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [application, setApplication] = useState<Partial<InvestorApplication>>({
    investorId: 'current_investor',
    investorName: '',
    investorEmail: '',
    companyName: '',
    companyWebsite: '',
    investmentFocus: [],
    investmentAmount: undefined,
    investmentStage: 'seed',
    portfolioCompanies: [],
    previousInvestments: [],
    investmentCriteria: {
      sectors: [],
      stages: [],
      minInvestment: 0,
      maxInvestment: 0,
      geographicFocus: [],
      riskTolerance: 'medium',
      expectedReturns: 0,
      investmentHorizon: '',
      coInvestmentPreferences: false,
      boardSeatRequirements: false
    },
    dueDiligence: {
      financialAnalysis: false,
      marketAnalysis: false,
      teamAssessment: false,
      legalReview: false,
      technicalReview: false,
      customerValidation: false,
      competitiveAnalysis: false,
      riskAssessment: false
    },
    riskAssessment: {
      marketRisk: 'medium',
      technologyRisk: 'medium',
      teamRisk: 'medium',
      financialRisk: 'medium',
      regulatoryRisk: 'medium',
      competitiveRisk: 'medium',
      overallRisk: 'medium',
      riskMitigation: []
    },
    complianceDocuments: [],
    references: [],
    status: 'draft'
  });

  const steps = [
    { id: 1, name: 'Company Information', description: 'Basic company and contact details' },
    { id: 2, name: 'Investment Profile', description: 'Investment focus and criteria' },
    { id: 3, name: 'Portfolio & Experience', description: 'Previous investments and portfolio' },
    { id: 4, name: 'Due Diligence', description: 'Due diligence preferences and processes' },
    { id: 5, name: 'Risk Assessment', description: 'Risk tolerance and assessment' },
    { id: 6, name: 'Compliance', description: 'Compliance documents and verification' },
    { id: 7, name: 'References', description: 'Professional references' },
    { id: 8, name: 'Review & Submit', description: 'Review application and submit' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const applicationData = {
        ...application,
        submittedAt: new Date().toISOString(),
        status: 'submitted' as const
      };

      await investorApplicationService.createApplication(applicationData as any);
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your investor application has been submitted successfully. Our team will review it and get back to you within 5-7 business days.
          </p>
          <button
            onClick={() => window.location.href = '/investor/dashboard'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Application</h1>
              <p className="text-gray-600">Join our exclusive investor network</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentStep === 1 && <CompanyInformationStep application={application} setApplication={setApplication} />}
          {currentStep === 2 && <InvestmentProfileStep application={application} setApplication={setApplication} />}
          {currentStep === 3 && <PortfolioExperienceStep application={application} setApplication={setApplication} />}
          {currentStep === 4 && <DueDiligenceStep application={application} setApplication={setApplication} />}
          {currentStep === 5 && <RiskAssessmentStep application={application} setApplication={setApplication} />}
          {currentStep === 6 && <ComplianceStep application={application} setApplication={setApplication} />}
          {currentStep === 7 && <ReferencesStep application={application} setApplication={setApplication} />}
          {currentStep === 8 && <ReviewSubmitStep application={application} />}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                Next
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function CompanyInformationStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            value={application.companyName || ''}
            onChange={(e) => setApplication({...application, companyName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter company name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
          <input
            type="url"
            value={application.companyWebsite || ''}
            onChange={(e) => setApplication({...application, companyWebsite: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
          <input
            type="text"
            value={application.investorName || ''}
            onChange={(e) => setApplication({...application, investorName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={application.investorEmail || ''}
            onChange={(e) => setApplication({...application, investorEmail: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
    </div>
  );
}

function InvestmentProfileStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  const investmentStages = [
    { value: 'seed', label: 'Seed' },
    { value: 'series_a', label: 'Series A' },
    { value: 'series_b', label: 'Series B' },
    { value: 'series_c', label: 'Series C' },
    { value: 'growth', label: 'Growth' },
    { value: 'late_stage', label: 'Late Stage' },
    { value: 'pre_ipo', label: 'Pre-IPO' }
  ];

  const investmentFocusOptions = [
    'Technology', 'Healthcare', 'Fintech', 'EdTech', 'E-commerce', 'SaaS', 'AI/ML', 'Blockchain', 'CleanTech', 'Biotech'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Investment Profile</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Investment Stage *</label>
        <select
          value={application.investmentStage || 'seed'}
          onChange={(e) => setApplication({...application, investmentStage: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {investmentStages.map(stage => (
            <option key={stage.value} value={stage.value}>{stage.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (INR)</label>
        <input
          type="number"
          value={application.investmentAmount || ''}
          onChange={(e) => setApplication({...application, investmentAmount: parseFloat(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter investment amount"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Investment Focus *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {investmentFocusOptions.map(focus => (
            <label key={focus} className="flex items-center">
              <input
                type="checkbox"
                checked={application.investmentFocus?.includes(focus) || false}
                onChange={(e) => {
                  const currentFocus = application.investmentFocus || [];
                  if (e.target.checked) {
                    setApplication({...application, investmentFocus: [...currentFocus, focus]});
                  } else {
                    setApplication({...application, investmentFocus: currentFocus.filter(f => f !== focus)});
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{focus}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioExperienceStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Portfolio & Experience</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Companies</label>
        <textarea
          value={application.portfolioCompanies?.join('\n') || ''}
          onChange={(e) => setApplication({...application, portfolioCompanies: e.target.value.split('\n').filter(c => c.trim())})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter portfolio companies (one per line)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Previous Investments</label>
        <textarea
          value={JSON.stringify(application.previousInvestments || [], null, 2)}
          onChange={(e) => {
            try {
              const investments = JSON.parse(e.target.value);
              setApplication({...application, previousInvestments: investments});
            } catch (error) {
              // Invalid JSON, keep current value
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          placeholder="Enter previous investments as JSON array"
        />
      </div>
    </div>
  );
}

function DueDiligenceStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  const dueDiligenceOptions = [
    'Financial Analysis',
    'Market Analysis', 
    'Team Assessment',
    'Legal Review',
    'Technical Review',
    'Customer Validation',
    'Competitive Analysis',
    'Risk Assessment'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Due Diligence Preferences</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Due Diligence Areas</label>
        <div className="grid grid-cols-2 gap-3">
          {dueDiligenceOptions.map(option => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={application.dueDiligence?.[option.toLowerCase().replace(/\s+/g, '')] || false}
                onChange={(e) => {
                  const key = option.toLowerCase().replace(/\s+/g, '');
                  setApplication({
                    ...application,
                    dueDiligence: {
                      ...application.dueDiligence,
                      [key]: e.target.checked
                    }
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskAssessmentStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  const riskLevels = ['low', 'medium', 'high'];
  const riskTypes = [
    'Market Risk',
    'Technology Risk',
    'Team Risk',
    'Financial Risk',
    'Regulatory Risk',
    'Competitive Risk'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
      
      <div className="space-y-4">
        {riskTypes.map(riskType => (
          <div key={riskType}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{riskType}</label>
            <div className="flex space-x-4">
              {riskLevels.map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name={riskType.toLowerCase().replace(/\s+/g, '')}
                    value={level}
                    checked={application.riskAssessment?.[riskType.toLowerCase().replace(/\s+/g, '')] === level}
                    onChange={(e) => {
                      const key = riskType.toLowerCase().replace(/\s+/g, '');
                      setApplication({
                        ...application,
                        riskAssessment: {
                          ...application.riskAssessment,
                          [key]: e.target.value
                        }
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Compliance Documents</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">Drag and drop files here, or click to select</p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX files only</p>
        </div>
      </div>
    </div>
  );
}

function ReferencesStep({ application, setApplication }: { application: any, setApplication: (app: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Professional References</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
        <textarea
          value={JSON.stringify(application.references || [], null, 2)}
          onChange={(e) => {
            try {
              const references = JSON.parse(e.target.value);
              setApplication({...application, references: references});
            } catch (error) {
              // Invalid JSON, keep current value
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          placeholder="Enter references as JSON array"
        />
      </div>
    </div>
  );
}

function ReviewSubmitStep({ application }: { application: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
          <p className="text-sm text-gray-600">Company: {application.companyName}</p>
          <p className="text-sm text-gray-600">Website: {application.companyWebsite}</p>
          <p className="text-sm text-gray-600">Contact: {application.investorName} ({application.investorEmail})</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">Investment Profile</h3>
          <p className="text-sm text-gray-600">Stage: {application.investmentStage}</p>
          <p className="text-sm text-gray-600">Amount: ₹{application.investmentAmount?.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-600">Focus: {application.investmentFocus?.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}

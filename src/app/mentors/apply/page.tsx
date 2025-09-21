'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { 
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface MentorApplicationForm {
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
    expertise: string[];
    specializations: string[];
    previousCompanies: string;
    achievements: string;
  };
  education: {
    highestDegree: string;
    institution: string;
    yearOfPassing: string;
    additionalQualifications: string;
    certifications: string;
  };
  mentoringExperience: {
    hasMentored: boolean;
    mentoringExperience: string;
    mentoringStyle: string;
    preferredMentoringAreas: string[];
    availability: string;
    timeCommitment: string;
  };
  ksmpInterest: {
    interestedPhases: number[];
    whyMentor: string;
    valueProposition: string;
    expectations: string;
  };
  documents: {
    resume: File | null;
    portfolio: File | null;
    certificates: File | null;
    photo: File | null;
  };
}

interface KSMPPhase {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
}

export default function MentorsApplyPage() {
  const { user } = useUser();
  const [applicationForm, setApplicationForm] = useState<MentorApplicationForm>({
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
      expertise: [],
      specializations: [],
      previousCompanies: '',
      achievements: ''
    },
    education: {
      highestDegree: '',
      institution: '',
      yearOfPassing: '',
      additionalQualifications: '',
      certifications: ''
    },
    mentoringExperience: {
      hasMentored: false,
      mentoringExperience: '',
      mentoringStyle: '',
      preferredMentoringAreas: [],
      availability: '',
      timeCommitment: ''
    },
    ksmpInterest: {
      interestedPhases: [],
      whyMentor: '',
      valueProposition: '',
      expectations: ''
    },
    documents: {
      resume: null,
      portfolio: null,
      certificates: null,
      photo: null
    }
  });

  const [ksmpPhases, setKsmpPhases] = useState<KSMPPhase[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const expertiseOptions = [
    'Technology & Software Development',
    'Business Strategy & Management',
    'Marketing & Sales',
    'Finance & Investment',
    'Operations & Supply Chain',
    'Human Resources',
    'Product Management',
    'Data Science & Analytics',
    'Design & User Experience',
    'Legal & Compliance',
    'Healthcare & Life Sciences',
    'Education & Training',
    'Real Estate',
    'Manufacturing',
    'Retail & E-commerce',
    'Media & Entertainment',
    'Agriculture & Food',
    'Energy & Environment',
    'Transportation & Logistics',
    'Consulting'
  ];

  const specializationOptions = [
    'Startup Development',
    'Fundraising',
    'Market Research',
    'Product Development',
    'Team Building',
    'Financial Planning',
    'Marketing Strategy',
    'Operations Management',
    'Technology Implementation',
    'Business Development',
    'Strategic Planning',
    'Leadership Development',
    'Innovation Management',
    'Digital Transformation',
    'International Business'
  ];

  const mentoringAreas = [
    'Business Strategy',
    'Technology Development',
    'Marketing & Sales',
    'Finance & Funding',
    'Operations',
    'Team Management',
    'Product Development',
    'Market Research',
    'Legal & Compliance',
    'International Expansion'
  ];

  useEffect(() => {
    // Mock KSMP phases data
    const mockPhases: KSMPPhase[] = [
      {
        id: 1,
        title: 'Business Idea & Market Research',
        description: 'Guide students through business ideation and market research',
        duration: '4 weeks',
        skills: ['Market Research', 'Business Ideation', 'Competitive Analysis']
      },
      {
        id: 2,
        title: 'Business Model & Strategy',
        description: 'Help students develop business models and strategic plans',
        duration: '4 weeks',
        skills: ['Business Modeling', 'Strategic Planning', 'Value Proposition']
      },
      {
        id: 3,
        title: 'Financial Planning & Funding',
        description: 'Mentor students in financial modeling and funding strategies',
        duration: '4 weeks',
        skills: ['Financial Modeling', 'Fundraising', 'Investment Strategy']
      },
      {
        id: 4,
        title: 'Product Development & MVP',
        description: 'Oversee product development and MVP creation',
        duration: '6 weeks',
        skills: ['Product Development', 'MVP Creation', 'User Testing']
      },
      {
        id: 5,
        title: 'Marketing & Branding',
        description: 'Guide marketing strategy and brand development',
        duration: '4 weeks',
        skills: ['Marketing Strategy', 'Brand Development', 'Digital Marketing']
      },
      {
        id: 6,
        title: 'Sales & Customer Acquisition',
        description: 'Mentor sales strategy and customer acquisition',
        duration: '4 weeks',
        skills: ['Sales Strategy', 'Customer Acquisition', 'CRM']
      },
      {
        id: 7,
        title: 'Operations & Scaling',
        description: 'Guide operational scaling and process optimization',
        duration: '4 weeks',
        skills: ['Operations Management', 'Process Optimization', 'Scaling']
      },
      {
        id: 8,
        title: 'Team Building & Leadership',
        description: 'Mentor team building and leadership development',
        duration: '4 weeks',
        skills: ['Team Building', 'Leadership', 'HR Management']
      },
      {
        id: 9,
        title: 'Technology & Innovation',
        description: 'Guide technology implementation and innovation',
        duration: '4 weeks',
        skills: ['Technology Strategy', 'Innovation', 'Digital Transformation']
      },
      {
        id: 10,
        title: 'Legal & Compliance',
        description: 'Mentor legal structure and compliance requirements',
        duration: '4 weeks',
        skills: ['Legal Structure', 'Compliance', 'Intellectual Property']
      },
      {
        id: 11,
        title: 'International Expansion',
        description: 'Guide international market entry and expansion',
        duration: '4 weeks',
        skills: ['International Business', 'Market Entry', 'Global Strategy']
      },
      {
        id: 12,
        title: 'Exit Strategy & Growth',
        description: 'Mentor exit strategies and long-term growth planning',
        duration: '4 weeks',
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

  const handleInputChange = (section: keyof MentorApplicationForm, field: string, value: any) => {
    setApplicationForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof MentorApplicationForm, field: string, value: string, checked: boolean) => {
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

  const handlePhaseSelection = (phaseId: number, checked: boolean) => {
    setApplicationForm(prev => {
      const currentPhases = prev.ksmpInterest.interestedPhases;
      const newPhases = checked 
        ? [...currentPhases, phaseId]
        : currentPhases.filter(id => id !== phaseId);
      
      return {
        ...prev,
        ksmpInterest: {
          ...prev.ksmpInterest,
          interestedPhases: newPhases
        }
      };
    });
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      alert('Please sign in to submit your application.');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Implement actual application submission API call
      console.log('Submitting mentor application:', applicationForm);
      
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
    if (currentStep < 6) {
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {expertiseOptions.map((expertise) => (
                  <label key={expertise} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.professionalInfo.expertise.includes(expertise)}
                      onChange={(e) => handleArrayChange('professionalInfo', 'expertise', expertise, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{expertise}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specializations *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specializationOptions.map((specialization) => (
                  <label key={specialization} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.professionalInfo.specializations.includes(specialization)}
                      onChange={(e) => handleArrayChange('professionalInfo', 'specializations', specialization, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{specialization}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Companies</label>
              <textarea
                value={applicationForm.professionalInfo.previousCompanies}
                onChange={(e) => handleInputChange('professionalInfo', 'previousCompanies', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List your previous companies and roles"
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highest Degree *</label>
                <input
                  type="text"
                  value={applicationForm.education.highestDegree}
                  onChange={(e) => handleInputChange('education', 'highestDegree', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                <input
                  type="text"
                  value={applicationForm.education.institution}
                  onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
                <input
                  type="text"
                  value={applicationForm.education.yearOfPassing}
                  onChange={(e) => handleInputChange('education', 'yearOfPassing', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Qualifications</label>
              <textarea
                value={applicationForm.education.additionalQualifications}
                onChange={(e) => handleInputChange('education', 'additionalQualifications', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List any additional qualifications or certifications"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Certifications</label>
              <textarea
                value={applicationForm.education.certifications}
                onChange={(e) => handleInputChange('education', 'certifications', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List relevant professional certifications"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mentoring Experience</h3>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={applicationForm.mentoringExperience.hasMentored}
                  onChange={(e) => handleInputChange('mentoringExperience', 'hasMentored', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">I have previous mentoring experience</span>
              </label>
            </div>
            
            {applicationForm.mentoringExperience.hasMentored && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Experience *</label>
                <textarea
                  value={applicationForm.mentoringExperience.mentoringExperience}
                  onChange={(e) => handleInputChange('mentoringExperience', 'mentoringExperience', e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your previous mentoring experience"
                  required={applicationForm.mentoringExperience.hasMentored}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Style *</label>
              <textarea
                value={applicationForm.mentoringExperience.mentoringStyle}
                onChange={(e) => handleInputChange('mentoringExperience', 'mentoringStyle', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your mentoring style and approach"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Mentoring Areas *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mentoringAreas.map((area) => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationForm.mentoringExperience.preferredMentoringAreas.includes(area)}
                      onChange={(e) => handleArrayChange('mentoringExperience', 'preferredMentoringAreas', area, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                <select
                  value={applicationForm.mentoringExperience.availability}
                  onChange={(e) => handleInputChange('mentoringExperience', 'availability', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Availability</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="flexible">Flexible</option>
                  <option value="evenings">Evenings Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment *</label>
                <select
                  value={applicationForm.mentoringExperience.timeCommitment}
                  onChange={(e) => handleInputChange('mentoringExperience', 'timeCommitment', e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Time Commitment</option>
                  <option value="1-2 hours/week">1-2 hours per week</option>
                  <option value="3-5 hours/week">3-5 hours per week</option>
                  <option value="6-10 hours/week">6-10 hours per week</option>
                  <option value="10+ hours/week">10+ hours per week</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">KSMP Interest & Preferences</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Interested KSMP Phases *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ksmpPhases.map((phase) => (
                  <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={applicationForm.ksmpInterest.interestedPhases.includes(phase.id)}
                        onChange={(e) => handlePhaseSelection(phase.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Phase {phase.id}: {phase.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{phase.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Duration: {phase.duration}</div>
                        <div className="text-xs text-gray-500">Skills: {phase.skills.join(', ')}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to mentor in KSMP? *</label>
              <textarea
                value={applicationForm.ksmpInterest.whyMentor}
                onChange={(e) => handleInputChange('ksmpInterest', 'whyMentor', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Explain your motivation for becoming a KSMP mentor"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What value will you bring to KSMP students? *</label>
              <textarea
                value={applicationForm.ksmpInterest.valueProposition}
                onChange={(e) => handleInputChange('ksmpInterest', 'valueProposition', e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the unique value you can provide to students"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations from KSMP?</label>
              <textarea
                value={applicationForm.ksmpInterest.expectations}
                onChange={(e) => handleInputChange('ksmpInterest', 'expectations', e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Share your expectations from the KSMP program"
              />
            </div>
          </div>
        );

      case 6:
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Work Samples</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  onChange={(e) => handleFileChange('portfolio', e.target.files?.[0] || null)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificates</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('certificates', e.target.files?.[0] || null)}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Become a KSMP Mentor</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our community of experienced professionals and help shape the next generation of entrepreneurs. 
            Share your expertise and guide students through their startup journey.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Become a KSMP Mentor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <UserGroupIcon className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Impact Lives</h3>
                <p className="text-sm text-gray-600">Help aspiring entrepreneurs build successful startups</p>
              </div>
            </div>
            <div className="flex items-start">
              <StarIcon className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Build Network</h3>
                <p className="text-sm text-gray-600">Connect with other mentors and industry leaders</p>
              </div>
            </div>
            <div className="flex items-start">
              <ChartBarIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Professional Growth</h3>
                <p className="text-sm text-gray-600">Enhance your leadership and mentoring skills</p>
              </div>
            </div>
            <div className="flex items-start">
              <AcademicCapIcon className="h-6 w-6 text-purple-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Share Knowledge</h3>
                <p className="text-sm text-gray-600">Pass on your expertise to the next generation</p>
              </div>
            </div>
            <div className="flex items-start">
              <BriefcaseIcon className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Industry Recognition</h3>
                <p className="text-sm text-gray-600">Gain recognition as an industry expert</p>
              </div>
            </div>
            <div className="flex items-start">
              <GlobeAltIcon className="h-6 w-6 text-teal-600 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Flexible Schedule</h3>
                <p className="text-sm text-gray-600">Mentor according to your availability</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mentor Application Form</h2>
              <span className="text-sm text-gray-500">Step {currentStep} of 6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
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
            
            {currentStep < 6 ? (
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
                    Thank you for your interest in becoming a KSMP mentor. We will review your application 
                    and get back to you within 5-7 business days.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      href="/mentors"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Mentors
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

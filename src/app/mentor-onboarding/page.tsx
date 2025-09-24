'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  StarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

interface MentorApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Professional Information
  currentCompany: string;
  currentPosition: string;
  yearsOfExperience: string;
  industry: string;
  specialization: string[];
  
  // Education
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  
  // Skills & Expertise
  skills: string[];
  certifications: string[];
  languages: string[];
  
  // Mentoring Experience
  previousMentoring: boolean;
  mentoringExperience: string;
  preferredMentoringAreas: string[];
  
  // Availability
  availability: {
    hoursPerWeek: string;
    preferredTimeSlots: string[];
    timezone: string;
  };
  
  // Motivation
  motivation: string;
  goals: string;
  expectations: string;
  
  // Additional Information
  linkedinProfile: string;
  portfolio: string;
  resume: File | null;
  profilePicture: File | null;
  
  // Terms & Conditions
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToCodeOfConduct: boolean;
}

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MentorApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    currentCompany: '',
    currentPosition: '',
    yearsOfExperience: '',
    industry: '',
    specialization: [],
    education: [{ degree: '', institution: '', year: '' }],
    skills: [],
    certifications: [],
    languages: [],
    previousMentoring: false,
    mentoringExperience: '',
    preferredMentoringAreas: [],
    availability: {
      hoursPerWeek: '',
      preferredTimeSlots: [],
      timezone: ''
    },
    motivation: '',
    goals: '',
    expectations: '',
    linkedinProfile: '',
    portfolio: '',
    resume: null,
    profilePicture: null,
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToCodeOfConduct: false
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: UserIcon },
    { id: 2, title: 'Professional Background', icon: BriefcaseIcon },
    { id: 3, title: 'Education & Skills', icon: AcademicCapIcon },
    { id: 4, title: 'Mentoring Experience', icon: StarIcon },
    { id: 5, title: 'Availability', icon: GlobeAltIcon },
    { id: 6, title: 'Motivation & Goals', icon: DocumentTextIcon },
    { id: 7, title: 'Documents & Review', icon: CheckCircleIcon }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof MentorApplicationData],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field as keyof MentorApplicationData] as string[]), value]
        : (prev[field as keyof MentorApplicationData] as string[]).filter(item => item !== value)
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
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
      router.push('/mentor-onboarding/success');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone *</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Timezone</option>
                  <option value="UTC-12">UTC-12 (Baker Island)</option>
                  <option value="UTC-11">UTC-11 (American Samoa)</option>
                  <option value="UTC-10">UTC-10 (Hawaii)</option>
                  <option value="UTC-9">UTC-9 (Alaska)</option>
                  <option value="UTC-8">UTC-8 (Pacific Time)</option>
                  <option value="UTC-7">UTC-7 (Mountain Time)</option>
                  <option value="UTC-6">UTC-6 (Central Time)</option>
                  <option value="UTC-5">UTC-5 (Eastern Time)</option>
                  <option value="UTC-4">UTC-4 (Atlantic Time)</option>
                  <option value="UTC-3">UTC-3 (Brazil)</option>
                  <option value="UTC-2">UTC-2 (Mid-Atlantic)</option>
                  <option value="UTC-1">UTC-1 (Azores)</option>
                  <option value="UTC+0">UTC+0 (Greenwich)</option>
                  <option value="UTC+1">UTC+1 (Central European)</option>
                  <option value="UTC+2">UTC+2 (Eastern European)</option>
                  <option value="UTC+3">UTC+3 (Moscow)</option>
                  <option value="UTC+4">UTC+4 (Gulf)</option>
                  <option value="UTC+5">UTC+5 (Pakistan)</option>
                  <option value="UTC+5:30">UTC+5:30 (India)</option>
                  <option value="UTC+6">UTC+6 (Bangladesh)</option>
                  <option value="UTC+7">UTC+7 (Thailand)</option>
                  <option value="UTC+8">UTC+8 (China)</option>
                  <option value="UTC+9">UTC+9 (Japan)</option>
                  <option value="UTC+10">UTC+10 (Australia)</option>
                  <option value="UTC+11">UTC+11 (Solomon Islands)</option>
                  <option value="UTC+12">UTC+12 (New Zealand)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Background</h2>
              <p className="text-gray-600">Share your professional experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Company *</label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Position *</label>
                <input
                  type="text"
                  value={formData.currentPosition}
                  onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Legal">Legal</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization Areas *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Business Strategy', 'Product Management', 'Marketing', 'Sales', 'Finance', 'Operations', 'Technology', 'Leadership', 'Entrepreneurship', 'Innovation'].map(specialization => (
                  <label key={specialization} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialization.includes(specialization)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('specialization', specialization, 'add');
                        } else {
                          handleArrayChange('specialization', specialization, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{specialization}</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Education & Skills</h2>
              <p className="text-gray-600">Tell us about your educational background and skills</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Education
                </button>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      placeholder="e.g., MBA, B.Tech"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      placeholder="University name"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      placeholder="2020"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Leadership', 'Communication', 'Problem Solving', 'Strategic Thinking', 'Project Management', 'Data Analysis', 'Team Building', 'Negotiation', 'Public Speaking', 'Mentoring'].map(skill => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('skills', skill, 'add');
                        } else {
                          handleArrayChange('skills', skill, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'].map(language => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('languages', language, 'add');
                        } else {
                          handleArrayChange('languages', language, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{language}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentoring Experience</h2>
              <p className="text-gray-600">Share your mentoring background</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Have you mentored before? *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousMentoring"
                    checked={formData.previousMentoring === true}
                    onChange={() => handleInputChange('previousMentoring', true)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousMentoring"
                    checked={formData.previousMentoring === false}
                    onChange={() => handleInputChange('previousMentoring', false)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
            
            {formData.previousMentoring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Experience</label>
                <textarea
                  value={formData.mentoringExperience}
                  onChange={(e) => handleInputChange('mentoringExperience', e.target.value)}
                  rows={4}
                  placeholder="Describe your previous mentoring experience..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Mentoring Areas *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Career Development', 'Business Strategy', 'Leadership', 'Product Management', 'Marketing', 'Sales', 'Finance', 'Operations', 'Technology', 'Entrepreneurship'].map(area => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferredMentoringAreas.includes(area)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('preferredMentoringAreas', area, 'add');
                        } else {
                          handleArrayChange('preferredMentoringAreas', area, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area}</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability</h2>
              <p className="text-gray-600">Tell us about your availability for mentoring</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours per week you can dedicate to mentoring *</label>
              <select
                value={formData.availability.hoursPerWeek}
                onChange={(e) => handleNestedInputChange('availability', 'hoursPerWeek', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Hours</option>
                <option value="1-2">1-2 hours</option>
                <option value="3-5">3-5 hours</option>
                <option value="6-10">6-10 hours</option>
                <option value="11-15">11-15 hours</option>
                <option value="16+">16+ hours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time Slots *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Morning (6 AM - 12 PM)', 'Afternoon (12 PM - 6 PM)', 'Evening (6 PM - 12 AM)', 'Weekdays', 'Weekends', 'Flexible'].map(slot => (
                  <label key={slot} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availability.preferredTimeSlots.includes(slot)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('availability.preferredTimeSlots', slot, 'add');
                        } else {
                          handleArrayChange('availability.preferredTimeSlots', slot, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{slot}</span>
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
              <p className="text-gray-600">Tell us why you want to become a mentor</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you to become a mentor? *</label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                placeholder="Share your motivation for becoming a mentor..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your goals as a mentor? *</label>
              <textarea
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                rows={4}
                placeholder="Describe your goals and what you hope to achieve..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations from the mentoring program? *</label>
              <textarea
                value={formData.expectations}
                onChange={(e) => handleInputChange('expectations', e.target.value)}
                rows={4}
                placeholder="Share your expectations from Kalpla's mentoring program..."
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload your resume (PDF)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleInputChange('resume', e.target.files?.[0] || null)}
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
                <p><span className="font-medium">Company:</span> {formData.currentCompany}</p>
                <p><span className="font-medium">Position:</span> {formData.currentPosition}</p>
                <p><span className="font-medium">Experience:</span> {formData.yearsOfExperience} years</p>
                <p><span className="font-medium">Specialization:</span> {formData.specialization.join(', ')}</p>
                <p><span className="font-medium">Availability:</span> {formData.availability.hoursPerWeek} hours/week</p>
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
                    checked={formData.agreeToCodeOfConduct}
                    onChange={(e) => handleInputChange('agreeToCodeOfConduct', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to follow the <a href="/code-of-conduct" className="text-blue-600 hover:text-blue-800">Code of Conduct</a> *
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
              disabled={isSubmitting || !formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToCodeOfConduct}
              className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                isSubmitting || !formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToCodeOfConduct
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
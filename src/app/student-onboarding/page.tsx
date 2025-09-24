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
  EnvelopeIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

interface StudentOnboardingData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  timezone: string;
  
  // Educational Background
  educationLevel: string;
  currentInstitution: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa: string;
  
  // Professional Information
  workExperience: string;
  currentJob: string;
  industry: string;
  careerGoals: string[];
  
  // Interests & Preferences
  interests: string[];
  learningStyle: string[];
  preferredSubjects: string[];
  skillLevel: string;
  
  // Goals & Motivation
  learningGoals: string;
  motivation: string;
  expectations: string;
  timeCommitment: string;
  
  // Additional Information
  languages: string[];
  certifications: string[];
  portfolio: string;
  linkedinProfile: string;
  resume: File | null;
  profilePicture: File | null;
  
  // Program Selection
  interestedPrograms: string[];
  ksmpInterest: boolean;
  ksmpApplication: string;
  
  // Terms & Conditions
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToCodeOfConduct: boolean;
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StudentOnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    timezone: '',
    educationLevel: '',
    currentInstitution: '',
    fieldOfStudy: '',
    graduationYear: '',
    gpa: '',
    workExperience: '',
    currentJob: '',
    industry: '',
    careerGoals: [],
    interests: [],
    learningStyle: [],
    preferredSubjects: [],
    skillLevel: '',
    learningGoals: '',
    motivation: '',
    expectations: '',
    timeCommitment: '',
    languages: [],
    certifications: [],
    portfolio: '',
    linkedinProfile: '',
    resume: null,
    profilePicture: null,
    interestedPrograms: [],
    ksmpInterest: false,
    ksmpApplication: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToCodeOfConduct: false
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: UserIcon },
    { id: 2, title: 'Educational Background', icon: AcademicCapIcon },
    { id: 3, title: 'Professional Info', icon: BriefcaseIcon },
    { id: 4, title: 'Interests & Goals', icon: HeartIcon },
    { id: 5, title: 'Learning Preferences', icon: LightBulbIcon },
    { id: 6, title: 'Program Selection', icon: StarIcon },
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
        ? [...(prev[field as keyof StudentOnboardingData] as string[]), value]
        : (prev[field as keyof StudentOnboardingData] as string[]).filter(item => item !== value)
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
      router.push('/student-onboarding/success');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Educational Background</h2>
              <p className="text-gray-600">Share your educational journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="High School">High School</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional Degree">Professional Degree</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Institution</label>
                <input
                  type="text"
                  value={formData.currentInstitution}
                  onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
                  placeholder="University/School name"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                  placeholder="e.g., Computer Science, Business"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  placeholder="2024"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA (if applicable)</label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  placeholder="3.5/4.0 or 8.5/10"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
              <p className="text-gray-600">Tell us about your work experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience *</label>
                <select
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange('workExperience', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Experience</option>
                  <option value="No experience">No experience</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Job/Position</label>
                <input
                  type="text"
                  value={formData.currentJob}
                  onChange={(e) => handleInputChange('currentJob', e.target.value)}
                  placeholder="e.g., Software Engineer, Student"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Career Advancement', 'Skill Development', 'Industry Change', 'Entrepreneurship', 'Leadership', 'Specialization', 'Networking', 'Certification', 'Higher Education', 'Personal Growth'].map(goal => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.careerGoals.includes(goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('careerGoals', goal, 'add');
                        } else {
                          handleArrayChange('careerGoals', goal, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal}</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interests & Goals</h2>
              <p className="text-gray-600">What are you passionate about?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Sustainability', 'Arts', 'Sports', 'Travel', 'Food'].map(interest => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('interests', interest, 'add');
                        } else {
                          handleArrayChange('interests', interest, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Subjects *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Programming', 'Data Science', 'AI/ML', 'Web Development', 'Mobile Development', 'UI/UX Design', 'Digital Marketing', 'Business Strategy', 'Project Management', 'Leadership', 'Communication', 'Analytics'].map(subject => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferredSubjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('preferredSubjects', subject, 'add');
                        } else {
                          handleArrayChange('preferredSubjects', subject, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Skill Level *</label>
              <div className="space-y-2">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="skillLevel"
                      value={level}
                      checked={formData.skillLevel === level}
                      onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals *</label>
              <textarea
                value={formData.learningGoals}
                onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                rows={4}
                placeholder="What do you want to achieve through learning?"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Preferences</h2>
              <p className="text-gray-600">How do you like to learn?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Interactive', 'Self-paced', 'Group Learning', 'One-on-one', 'Online', 'In-person'].map(style => (
                  <label key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.learningStyle.includes(style)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('learningStyle', style, 'add');
                        } else {
                          handleArrayChange('learningStyle', style, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{style}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment *</label>
              <select
                value={formData.timeCommitment}
                onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Time Commitment</option>
                <option value="1-2 hours/week">1-2 hours/week</option>
                <option value="3-5 hours/week">3-5 hours/week</option>
                <option value="6-10 hours/week">6-10 hours/week</option>
                <option value="11-15 hours/week">11-15 hours/week</option>
                <option value="16+ hours/week">16+ hours/week</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you to learn? *</label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                placeholder="Share what drives your passion for learning..."
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
                placeholder="What do you hope to gain from our platform?"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Selection</h2>
              <p className="text-gray-600">Choose the programs you're interested in</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interested Programs *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Web Development', 'Data Science', 'AI/ML', 'Digital Marketing', 'Business Analytics', 'Project Management', 'UI/UX Design', 'Mobile Development', 'Cybersecurity', 'Cloud Computing'].map(program => (
                  <label key={program} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.interestedPrograms.includes(program)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('interestedPrograms', program, 'add');
                        } else {
                          handleArrayChange('interestedPrograms', program, 'remove');
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{program}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Kalpla Startup Mentorship Program (KSMP)</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ksmpInterest}
                      onChange={(e) => handleInputChange('ksmpInterest', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-blue-800 font-medium">I'm interested in KSMP</span>
                  </label>
                </div>
                {formData.ksmpInterest && (
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Why are you interested in KSMP?</label>
                    <textarea
                      value={formData.ksmpApplication}
                      onChange={(e) => handleInputChange('ksmpApplication', e.target.value)}
                      rows={3}
                      placeholder="Tell us about your startup idea or entrepreneurial goals..."
                      className="w-full border-blue-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
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
                <p><span className="font-medium">Education:</span> {formData.educationLevel}</p>
                <p><span className="font-medium">Experience:</span> {formData.workExperience}</p>
                <p><span className="font-medium">Interests:</span> {formData.interests.join(', ')}</p>
                <p><span className="font-medium">Programs:</span> {formData.interestedPrograms.join(', ')}</p>
                <p><span className="font-medium">Time Commitment:</span> {formData.timeCommitment}</p>
                {formData.ksmpInterest && <p><span className="font-medium">KSMP Interest:</span> Yes</p>}
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
              {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
              <CheckCircleIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

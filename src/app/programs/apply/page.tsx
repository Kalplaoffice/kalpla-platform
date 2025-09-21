'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { 
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Program {
  id: string;
  name: string;
  type: 'degree' | 'certificate' | 'diploma';
  duration: string;
  durationMonths: number;
  price: number;
  description: string;
  requirements: string[];
  curriculum: {
    semester: number;
    subjects: string[];
  }[];
  benefits: string[];
  eligibility: {
    education: string;
    experience: string;
    age: string;
  };
  applicationDeadline: string;
  startDate: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'open' | 'closed' | 'full';
  university: string;
  accreditation: string[];
}

interface ApplicationForm {
  programId: string;
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
    pincode: string;
  };
  education: {
    degree: string;
    institution: string;
    yearOfPassing: string;
    percentage: string;
    additionalQualifications: string;
  };
  experience: {
    currentJob: string;
    company: string;
    experience: string;
    skills: string;
  };
  documents: {
    resume: File | null;
    transcripts: File | null;
    idProof: File | null;
    photo: File | null;
  };
  additionalInfo: {
    motivation: string;
    careerGoals: string;
    expectations: string;
  };
}

export default function ProgramsApplyPage() {
  const { user } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    programId: '',
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
      pincode: ''
    },
    education: {
      degree: '',
      institution: '',
      yearOfPassing: '',
      percentage: '',
      additionalQualifications: ''
    },
    experience: {
      currentJob: '',
      company: '',
      experience: '',
      skills: ''
    },
    documents: {
      resume: null,
      transcripts: null,
      idProof: null,
      photo: null
    },
    additionalInfo: {
      motivation: '',
      careerGoals: '',
      expectations: ''
    }
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPrograms: Program[] = [
      {
        id: 'p1',
        name: 'Bachelor of Technology in Computer Science',
        type: 'degree',
        duration: '4 years',
        durationMonths: 48,
        price: 250000,
        description: 'Comprehensive B.Tech program in Computer Science with industry-relevant curriculum and practical training.',
        requirements: [
          '10+2 with Physics, Chemistry, and Mathematics',
          'Minimum 60% aggregate marks',
          'Valid entrance exam score (JEE Main/State CET)',
          'English proficiency'
        ],
        curriculum: [
          {
            semester: 1,
            subjects: ['Mathematics I', 'Physics', 'Chemistry', 'Programming Fundamentals', 'English Communication']
          },
          {
            semester: 2,
            subjects: ['Mathematics II', 'Data Structures', 'Digital Electronics', 'Engineering Graphics', 'Environmental Studies']
          }
        ],
        benefits: [
          'Industry-recognized degree',
          'Placement assistance',
          'Internship opportunities',
          'Alumni network access',
          'Career counseling'
        ],
        eligibility: {
          education: '10+2 with PCM',
          experience: 'No prior experience required',
          age: '17-25 years'
        },
        applicationDeadline: '2024-03-31',
        startDate: '2024-07-15',
        maxStudents: 120,
        enrolledStudents: 85,
        status: 'open',
        university: 'Kalpla University',
        accreditation: ['AICTE', 'UGC', 'NAAC A+']
      },
      {
        id: 'p2',
        name: 'Master of Business Administration',
        type: 'degree',
        duration: '2 years',
        durationMonths: 24,
        price: 180000,
        description: 'Advanced MBA program focusing on entrepreneurship, innovation, and business leadership.',
        requirements: [
          'Bachelor\'s degree in any discipline',
          'Minimum 50% aggregate marks',
          'Valid entrance exam score (CAT/MAT/XAT)',
          'Work experience preferred'
        ],
        curriculum: [
          {
            semester: 1,
            subjects: ['Management Principles', 'Business Economics', 'Financial Accounting', 'Marketing Management', 'Organizational Behavior']
          },
          {
            semester: 2,
            subjects: ['Operations Management', 'Human Resource Management', 'Business Law', 'Research Methods', 'Entrepreneurship']
          }
        ],
        benefits: [
          'Industry mentorship',
          'Startup incubation support',
          'Global exchange programs',
          'Executive networking',
          'Leadership development'
        ],
        eligibility: {
          education: 'Bachelor\'s degree',
          experience: '0-3 years preferred',
          age: '21-35 years'
        },
        applicationDeadline: '2024-04-15',
        startDate: '2024-06-01',
        maxStudents: 60,
        enrolledStudents: 45,
        status: 'open',
        university: 'Kalpla Business School',
        accreditation: ['AICTE', 'UGC', 'AMBA']
      },
      {
        id: 'p3',
        name: 'Diploma in Digital Marketing',
        type: 'diploma',
        duration: '1 year',
        durationMonths: 12,
        price: 45000,
        description: 'Comprehensive diploma program covering all aspects of digital marketing and analytics.',
        requirements: [
          '10+2 in any stream',
          'Basic computer knowledge',
          'English proficiency',
          'No prior marketing experience required'
        ],
        curriculum: [
          {
            semester: 1,
            subjects: ['Digital Marketing Fundamentals', 'SEO & SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing']
          },
          {
            semester: 2,
            subjects: ['Analytics & Reporting', 'PPC Advertising', 'Influencer Marketing', 'E-commerce Marketing', 'Marketing Automation']
          }
        ],
        benefits: [
          'Industry certification',
          'Live project experience',
          'Portfolio development',
          'Job placement support',
          'Lifetime access to resources'
        ],
        eligibility: {
          education: '10+2 any stream',
          experience: 'No experience required',
          age: '18+ years'
        },
        applicationDeadline: '2024-02-28',
        startDate: '2024-03-15',
        maxStudents: 40,
        enrolledStudents: 38,
        status: 'open',
        university: 'Kalpla Institute of Technology',
        accreditation: ['AICTE', 'Industry Certified']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPrograms(mockPrograms);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-red-600 bg-red-100';
      case 'full':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'closed':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'full':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'degree':
        return <AcademicCapIcon className="h-5 w-5 text-blue-600" />;
      case 'diploma':
        return <DocumentTextIcon className="h-5 w-5 text-green-600" />;
      case 'certificate':
        return <StarIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <AcademicCapIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleApplyNow = (program: Program) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/signin';
      return;
    }
    
    setSelectedProgram(program);
    setApplicationForm(prev => ({
      ...prev,
      programId: program.id,
      personalInfo: {
        ...prev.personalInfo,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || ''
      }
    }));
    setShowApplicationForm(true);
  };

  const handleInputChange = (section: keyof ApplicationForm, field: string, value: any) => {
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
    if (!selectedProgram) return;

    setSubmitting(true);
    try {
      // TODO: Implement actual application submission API call
      console.log('Submitting application:', applicationForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      setShowApplicationForm(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Application submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply to Programs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of degree programs, diplomas, and certificates. 
            Start your journey towards academic excellence and career success.
          </p>
        </div>

        {/* Programs List */}
        <div className="space-y-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(program.type)}
                      <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                        {getStatusIcon(program.status)}
                        <span className="ml-1">{program.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {program.duration}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        {formatCurrency(program.price)}
                      </div>
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                        {program.university}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {program.enrolledStudents}/{program.maxStudents} enrolled
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <p><strong>Application Deadline:</strong> {formatDate(program.applicationDeadline)}</p>
                      <p><strong>Program Start:</strong> {formatDate(program.startDate)}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => handleApplyNow(program)}
                      disabled={program.status !== 'open'}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        program.status === 'open'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {program.status === 'open' ? 'Apply Now' : 'Applications Closed'}
                    </button>
                  </div>
                </div>

                {/* Program Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Eligibility</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Education:</strong> {program.eligibility.education}</p>
                      <p><strong>Experience:</strong> {program.eligibility.experience}</p>
                      <p><strong>Age:</strong> {program.eligibility.age}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {program.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {program.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRightIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Accreditation */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Accreditation</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.accreditation.map((acc, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {programs.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs available</h3>
            <p className="text-gray-600">There are currently no programs open for applications.</p>
          </div>
        )}

        {/* Application Form Modal */}
        {showApplicationForm && selectedProgram && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowApplicationForm(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Application Form - {selectedProgram.name}
                    </h3>
                    <button
                      onClick={() => setShowApplicationForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
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
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Educational Background</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Highest Degree *</label>
                          <input
                            type="text"
                            value={applicationForm.education.degree}
                            onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
                          <input
                            type="text"
                            value={applicationForm.education.percentage}
                            onChange={(e) => handleInputChange('education', 'percentage', e.target.value)}
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
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title</label>
                          <input
                            type="text"
                            value={applicationForm.experience.currentJob}
                            onChange={(e) => handleInputChange('experience', 'currentJob', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={applicationForm.experience.company}
                            onChange={(e) => handleInputChange('experience', 'company', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                          <input
                            type="text"
                            value={applicationForm.experience.experience}
                            onChange={(e) => handleInputChange('experience', 'experience', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                          <input
                            type="text"
                            value={applicationForm.experience.skills}
                            onChange={(e) => handleInputChange('experience', 'skills', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Academic Transcripts *</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange('transcripts', e.target.files?.[0] || null)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof *</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('idProof', e.target.files?.[0] || null)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Passport Photo *</label>
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

                    {/* Additional Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join this program? *</label>
                          <textarea
                            value={applicationForm.additionalInfo.motivation}
                            onChange={(e) => handleInputChange('additionalInfo', 'motivation', e.target.value)}
                            rows={4}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">What are your career goals? *</label>
                          <textarea
                            value={applicationForm.additionalInfo.careerGoals}
                            onChange={(e) => handleInputChange('additionalInfo', 'careerGoals', e.target.value)}
                            rows={4}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">What do you expect from this program?</label>
                          <textarea
                            value={applicationForm.additionalInfo.expectations}
                            onChange={(e) => handleInputChange('additionalInfo', 'expectations', e.target.value)}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitApplication}
                      disabled={submitting}
                      className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
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

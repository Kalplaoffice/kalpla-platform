'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  BookOpenIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { degreeProgramService, DegreeProgram } from '@/lib/degreeProgramService';
import MentorsSection from '@/components/degree/MentorsSection';
import PricingSection from '@/components/degree/PricingSection';
import ApplicationForm from '@/components/degree/ApplicationForm';
import PayUPayment from '@/components/payment/PayUPayment';

export default function DegreeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<DegreeProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      loadProgram(params.id as string);
    }
  }, [params.id]);

  const loadProgram = async (programId: string) => {
    try {
      setLoading(true);
      const programData = await degreeProgramService.getDegreeProgram(programId);
      if (programData) {
        setProgram(programData);
      } else {
        setError('Degree program not found');
      }
    } catch (error) {
      console.error('Error loading program:', error);
      setError('Failed to load degree program');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getDegreeTypeColor = (type: string) => {
    switch (type) {
      case 'bachelor':
        return 'bg-blue-100 text-blue-800';
      case 'master':
        return 'bg-green-100 text-green-800';
      case 'certificate':
        return 'bg-yellow-100 text-yellow-800';
      case 'diploma':
        return 'bg-purple-100 text-purple-800';
      case 'phd':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyNow = () => {
    setShowApplicationForm(true);
  };

  const handlePaymentInitiated = (paymentData: any) => {
    setEnrollmentData(paymentData);
    setShowApplicationForm(false);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (payment: any) => {
    setShowPaymentForm(false);
    alert('Payment successful! You will be redirected to the success page.');
    // In a real implementation, redirect to success page
  };

  const handlePaymentFailure = (error: string) => {
    setShowPaymentForm(false);
    alert('Payment failed: ' + error);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In a real implementation, you would save this to user preferences
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: program?.title,
        text: program?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading degree program...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The degree program you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/degree-programs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse All Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/degree-programs')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Programs
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isFavorited ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400 mr-2" />
                )}
                {isFavorited ? 'Saved' : 'Save'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ShareIcon className="h-5 w-5 text-gray-400 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDegreeTypeColor(program.degreeType)}`}>
                      {program.degreeType.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {program.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">{program.shortTitle}</p>
                  <p className="text-gray-700 mb-6">{program.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {program.field}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {program.duration} months
                    </span>
                    <span className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      {program.totalCredits} credits
                    </span>
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(program.fee, program.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'curriculum', label: 'Curriculum' },
                    { id: 'mentors', label: 'Faculty' },
                    { id: 'pricing', label: 'Pricing' },
                    { id: 'admission', label: 'Admission' },
                    { id: 'outcomes', label: 'Learning Outcomes' },
                    { id: 'careers', label: 'Career Prospects' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {program.longDescription || program.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Comprehensive Curriculum</h4>
                            <p className="text-sm text-gray-600">{program.totalCredits} credit hours</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <ClockIcon className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Flexible Duration</h4>
                            <p className="text-sm text-gray-600">{program.duration} months</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                          <UserGroupIcon className="h-6 w-6 text-purple-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Expert Faculty</h4>
                            <p className="text-sm text-gray-600">Industry professionals</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                          <CheckCircleIcon className="h-6 w-6 text-yellow-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">Career Support</h4>
                            <p className="text-sm text-gray-600">Job placement assistance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Structure</h3>
                      <p className="text-gray-600 mb-6">
                        Our {program.degreeType} program in {program.field} is structured into {program.curriculumPhases.length} comprehensive phases, 
                        designed to provide you with a solid foundation and advanced knowledge in your chosen field.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {program.curriculumPhases.map((phase, index) => (
                        <div key={phase.id} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mr-4">
                                Phase {phase.order}
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900">{phase.name}</h4>
                                <p className="text-sm text-gray-600">{phase.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">{phase.duration} weeks</span>
                              <span className="text-sm text-gray-500">{phase.courses.length} courses</span>
                              {expandedPhase === phase.id ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </button>

                          {expandedPhase === phase.id && (
                            <div className="px-6 pb-4 border-t border-gray-200">
                              <div className="pt-4">
                                <h5 className="font-medium text-gray-900 mb-3">Courses in this Phase</h5>
                                <div className="space-y-3">
                                  {phase.courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div>
                                        <h6 className="font-medium text-gray-900">{course.courseTitle}</h6>
                                        <p className="text-sm text-gray-600">{course.courseDescription}</p>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm font-medium text-gray-900">{course.credits} credits</span>
                                        {course.isRequired && (
                                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                            Required
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {phase.requirements.length > 0 && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-gray-900 mb-3">Phase Requirements</h5>
                                    <div className="space-y-2">
                                      {phase.requirements.map((requirement) => (
                                        <div key={requirement.id} className="flex items-center p-2 bg-blue-50 rounded">
                                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                                          <span className="text-sm text-gray-700">{requirement.description}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentors Tab */}
                {activeTab === 'mentors' && (
                  <MentorsSection 
                    mentors={[
                      {
                        id: 'mentor_1',
                        name: 'Dr. Sarah Johnson',
                        title: 'Professor of Computer Science',
                        bio: 'Dr. Sarah Johnson has over 15 years of experience in software engineering and has published numerous research papers in top-tier conferences.',
                        email: 'sarah.johnson@kalpla.edu',
                        website: 'https://sarahjohnson.com',
                        linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
                        expertise: ['Software Engineering', 'Machine Learning', 'Data Structures'],
                        experience: '15+ years in software engineering',
                        education: 'PhD in Computer Science, MIT',
                        certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
                        rating: 4.8,
                        totalStudents: 1250,
                        courses: ['Introduction to Programming', 'Advanced Algorithms']
                      },
                      {
                        id: 'mentor_2',
                        name: 'Prof. Michael Chen',
                        title: 'Associate Professor of Data Science',
                        bio: 'Prof. Michael Chen specializes in data science and artificial intelligence, with extensive industry experience at leading tech companies.',
                        email: 'michael.chen@kalpla.edu',
                        linkedinProfile: 'https://linkedin.com/in/michaelchen',
                        expertise: ['Data Science', 'Artificial Intelligence', 'Statistics'],
                        experience: '12+ years in data science',
                        education: 'MS in Statistics, Stanford University',
                        certifications: ['Certified Data Scientist', 'TensorFlow Developer'],
                        rating: 4.9,
                        totalStudents: 980,
                        courses: ['Data Science Fundamentals', 'Machine Learning']
                      }
                    ]}
                    programTitle={program.title}
                  />
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <PricingSection 
                    programTitle={program.title}
                    basePrice={program.fee}
                    currency={program.currency}
                    duration={program.duration}
                  />
                )}

                {/* Admission Tab */}
                {activeTab === 'admission' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Requirements</h3>
                      <p className="text-gray-600 mb-6">
                        To be eligible for this {program.degreeType} program, you must meet the following requirements:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {program.admissionRequirements.map((requirement) => (
                        <div key={requirement.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-gray-900">{requirement.title}</h4>
                            <p className="text-gray-600 mt-1">{requirement.description}</p>
                            {requirement.minValue && (
                              <p className="text-sm text-gray-500 mt-2">
                                Minimum: {requirement.minValue} {requirement.unit || ''}
                              </p>
                            )}
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                              requirement.isRequired 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {requirement.isRequired ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Outcomes Tab */}
                {activeTab === 'outcomes' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
                      <p className="text-gray-600 mb-6">
                        Upon completion of this program, you will have developed the following knowledge, skills, and competencies:
                      </p>
                    </div>

                    <div className="space-y-6">
                      {['knowledge', 'skills', 'competencies', 'attitudes'].map((category) => {
                        const outcomes = program.learningOutcomes.filter(o => o.category === category);
                        if (outcomes.length === 0) return null;

                        return (
                          <div key={category}>
                            <h4 className="font-medium text-gray-900 mb-3 capitalize">{category}</h4>
                            <div className="space-y-3">
                              {outcomes.map((outcome) => (
                                <div key={outcome.id} className="p-4 border border-gray-200 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900">{outcome.title}</h5>
                                      <p className="text-gray-600 mt-1">{outcome.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      outcome.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                      outcome.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                      outcome.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {outcome.level}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Career Prospects Tab */}
                {activeTab === 'careers' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Prospects</h3>
                      <p className="text-gray-600 mb-6">
                        Graduates of this program can pursue various career opportunities in the field of {program.field}:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.careerProspects.map((career, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <UserGroupIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-900">{career}</h4>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-2">Career Support Services</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                          Resume and cover letter assistance
                        </li>
                        <li className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                          Interview preparation workshops
                        </li>
                        <li className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                          Job placement assistance
                        </li>
                        <li className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                          Industry networking events
                        </li>
                        <li className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                          Alumni mentorship program
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Now Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
                <p className="text-gray-600">Join our {program.degreeType} program today</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Program Fee</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(program.fee, program.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{program.duration} months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-medium text-gray-900">{program.totalCredits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-900">Next Intake</span>
                </div>
              </div>

              <button
                onClick={handleApplyNow}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Application deadline: Rolling admissions
                </p>
              </div>
            </div>

            {/* Program Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Degree Type</p>
                    <p className="text-sm text-gray-600 capitalize">{program.degreeType}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookOpenIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Field of Study</p>
                    <p className="text-sm text-gray-600">{program.field}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{program.duration} months</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Curriculum Phases</p>
                    <p className="text-sm text-gray-600">{program.curriculumPhases.length} phases</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{new Date(program.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">admissions@kalpla.edu</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <p className="text-sm text-gray-600">www.kalpla.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to {program.title}</h3>
            <p className="text-gray-600 mb-6">
              You are about to start your application for this {program.degreeType} program. 
              This will redirect you to our application portal.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In a real implementation, redirect to application form
                  alert('Redirecting to application portal...');
                  setShowApplyModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue to Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form */}
      {showApplicationForm && program && (
        <ApplicationForm
          programId={program.id}
          programTitle={program.title}
          programFee={program.fee}
          currency={program.currency}
          onClose={() => setShowApplicationForm(false)}
          onPaymentInitiated={handlePaymentInitiated}
        />
      )}

      {/* PayU Payment Form */}
      {showPaymentForm && enrollmentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PayUPayment
              enrollmentId={enrollmentData.enrollmentId}
              programId={enrollmentData.programId}
              studentId={enrollmentData.studentId}
              amount={enrollmentData.amount}
              currency={enrollmentData.currency}
              studentName={enrollmentData.studentName}
              studentEmail={enrollmentData.studentEmail}
              studentPhone={enrollmentData.studentPhone}
              programTitle={enrollmentData.programTitle}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
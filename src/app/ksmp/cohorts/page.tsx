'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  CogIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  maxStudents: number;
  enrolledStudents: number;
  currentPhase: number;
  totalPhases: number;
  mentors: {
    id: string;
    name: string;
    expertise: string;
    company: string;
  }[];
  description: string;
  highlights: string[];
  applicationDeadline: string;
  programFee: number;
  scholarships: {
    type: string;
    description: string;
    eligibility: string;
  }[];
  curriculum: {
    phase: number;
    title: string;
    duration: string;
    description: string;
  }[];
  alumni: {
    name: string;
    startup: string;
    achievement: string;
    funding: string;
  }[];
}

export default function KSMPCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCohorts: Cohort[] = [
      {
        id: 'c1',
        name: 'KSMP Cohort 2024-A',
        startDate: '2024-03-01',
        endDate: '2024-12-31',
        status: 'upcoming',
        maxStudents: 30,
        enrolledStudents: 18,
        currentPhase: 0,
        totalPhases: 12,
        mentors: [
          {
            id: 'm1',
            name: 'Dr. Rajesh Kumar',
            expertise: 'Enterprise Technology & AI',
            company: 'TechCorp Solutions'
          },
          {
            id: 'm2',
            name: 'Priya Sharma',
            expertise: 'Marketing & Growth',
            company: 'GrowthLab'
          },
          {
            id: 'm3',
            name: 'Amit Patel',
            expertise: 'Finance & Investment',
            company: 'FinanceFirst'
          }
        ],
        description: 'Join our flagship cohort designed for ambitious entrepreneurs ready to build the next generation of successful startups.',
        highlights: [
          '12-phase comprehensive curriculum',
          'Expert mentorship from industry leaders',
          'Access to investor network',
          'Demo day presentation opportunity',
          'Lifetime alumni network access'
        ],
        applicationDeadline: '2024-02-15',
        programFee: 50000,
        scholarships: [
          {
            type: 'Merit Scholarship',
            description: '50% fee waiver for exceptional candidates',
            eligibility: 'Outstanding academic record and innovative idea'
          },
          {
            type: 'Women Entrepreneur Scholarship',
            description: '30% fee waiver for women founders',
            eligibility: 'Female founder with innovative startup idea'
          },
          {
            type: 'Social Impact Scholarship',
            description: '40% fee waiver for social impact startups',
            eligibility: 'Startup focused on social/environmental impact'
          }
        ],
        curriculum: [
          {
            phase: 1,
            title: 'Business Idea & Market Research',
            duration: '4 weeks',
            description: 'Validate your business idea and conduct comprehensive market research'
          },
          {
            phase: 2,
            title: 'Business Model & Strategy',
            duration: '4 weeks',
            description: 'Develop a robust business model and strategic plan'
          },
          {
            phase: 3,
            title: 'Financial Planning & Funding',
            duration: '4 weeks',
            description: 'Create financial models and develop funding strategies'
          }
        ],
        alumni: [
          {
            name: 'Sarah Johnson',
            startup: 'TechFlow Solutions',
            achievement: 'Raised ₹2.5M Series A',
            funding: '₹2.5M'
          },
          {
            name: 'Rahul Gupta',
            startup: 'GreenTech Innovations',
            achievement: 'Acquired by major corporation',
            funding: '₹10M'
          }
        ]
      },
      {
        id: 'c2',
        name: 'KSMP Cohort 2024-B',
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        status: 'upcoming',
        maxStudents: 25,
        enrolledStudents: 8,
        currentPhase: 0,
        totalPhases: 12,
        mentors: [
          {
            id: 'm4',
            name: 'Dr. Anjali Mehta',
            expertise: 'Healthcare Technology',
            company: 'HealthTech Solutions'
          },
          {
            id: 'm5',
            name: 'Vikram Singh',
            expertise: 'E-commerce & Retail',
            company: 'RetailMax'
          }
        ],
        description: 'Our summer cohort focuses on technology-driven startups with global potential.',
        highlights: [
          'Intensive 12-month program',
          'International mentor network',
          'Global market access',
          'Advanced technology focus',
          'Premium networking events'
        ],
        applicationDeadline: '2024-06-01',
        programFee: 60000,
        scholarships: [
          {
            type: 'Technology Innovation Scholarship',
            description: '60% fee waiver for tech innovation',
            eligibility: 'Cutting-edge technology solution'
          }
        ],
        curriculum: [
          {
            phase: 1,
            title: 'Business Idea & Market Research',
            duration: '4 weeks',
            description: 'Validate your business idea and conduct comprehensive market research'
          },
          {
            phase: 2,
            title: 'Business Model & Strategy',
            duration: '4 weeks',
            description: 'Develop a robust business model and strategic plan'
          }
        ],
        alumni: [
          {
            name: 'Mike Chen',
            startup: 'DataFlow Analytics',
            achievement: 'IPO in 3 years',
            funding: '₹50M'
          }
        ]
      },
      {
        id: 'c3',
        name: 'KSMP Cohort 2023-B',
        startDate: '2023-07-01',
        endDate: '2024-06-30',
        status: 'completed',
        maxStudents: 20,
        enrolledStudents: 20,
        currentPhase: 12,
        totalPhases: 12,
        mentors: [
          {
            id: 'm6',
            name: 'Dr. Sanjay Gupta',
            expertise: 'Healthcare Technology',
            company: 'MedTech Innovations'
          },
          {
            id: 'm7',
            name: 'Lisa Wang',
            expertise: 'FinTech & Blockchain',
            company: 'BlockChain Solutions'
          }
        ],
        description: 'Successfully completed cohort with outstanding results and multiple successful exits.',
        highlights: [
          '100% completion rate',
          '₹25M+ total funding raised',
          '5 successful exits',
          '15 startups still operational',
          '95% mentor satisfaction'
        ],
        applicationDeadline: '2023-06-01',
        programFee: 45000,
        scholarships: [],
        curriculum: [
          {
            phase: 1,
            title: 'Business Idea & Market Research',
            duration: '4 weeks',
            description: 'Validate your business idea and conduct comprehensive market research'
          }
        ],
        alumni: [
          {
            name: 'David Lee',
            startup: 'FinTech Solutions',
            achievement: 'Acquired for ₹30M',
            funding: '₹30M'
          },
          {
            name: 'Maria Garcia',
            startup: 'EduTech Pro',
            achievement: 'Raised ₹5M Series A',
            funding: '₹5M'
          }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setCohorts(mockCohorts);
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
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'completed':
        return <TrophyIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setShowDetailModal(true);
  };

  const handleApplyNow = (cohort: Cohort) => {
    // Redirect to application page
    window.location.href = '/ksmp/apply';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">KSMP Cohorts</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our structured cohorts and accelerate your startup journey with expert mentorship, 
            comprehensive curriculum, and access to a network of successful entrepreneurs and investors.
          </p>
        </div>

        {/* Program Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">12 Phases</h3>
              <p className="text-sm text-gray-600">Comprehensive curriculum</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Expert Mentors</h3>
              <p className="text-sm text-gray-600">Industry leaders</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Demo Day</h3>
              <p className="text-sm text-gray-600">Investor presentations</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <GlobeAltIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Global Network</h3>
              <p className="text-sm text-gray-600">Lifetime access</p>
            </div>
          </div>
        </div>

        {/* Cohorts List */}
        <div className="space-y-6">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{cohort.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                        {getStatusIcon(cohort.status)}
                        <span className="ml-1">{cohort.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{cohort.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {cohort.enrolledStudents}/{cohort.maxStudents} students
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Phase {cohort.currentPhase}/{cohort.totalPhases}
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-2" />
                        {formatCurrency(cohort.programFee)}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <p><strong>Application Deadline:</strong> {formatDate(cohort.applicationDeadline)}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewDetails(cohort)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </button>
                    {cohort.status === 'upcoming' && (
                      <button
                        onClick={() => handleApplyNow(cohort)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {cohort.highlights.map((highlight, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentors */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Mentors</h4>
                  <div className="flex flex-wrap gap-3">
                    {cohort.mentors.map((mentor) => (
                      <div key={mentor.id} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mentor.name}</p>
                          <p className="text-xs text-gray-500">{mentor.expertise} • {mentor.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scholarships */}
                {cohort.scholarships.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Available Scholarships</h4>
                    <div className="space-y-2">
                      {cohort.scholarships.map((scholarship, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-900">{scholarship.type}</p>
                              <p className="text-xs text-green-700">{scholarship.description}</p>
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              {scholarship.eligibility}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alumni Success */}
                {cohort.alumni.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Alumni Success</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cohort.alumni.map((alumnus, index) => (
                        <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-medium text-yellow-900">{alumnus.name}</p>
                          <p className="text-xs text-yellow-700">{alumnus.startup}</p>
                          <p className="text-xs text-yellow-600">{alumnus.achievement}</p>
                          <p className="text-xs text-yellow-600 font-medium">Funding: {alumnus.funding}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {cohorts.length === 0 && (
          <div className="text-center py-12">
            <RocketLaunchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts available</h3>
            <p className="text-gray-600">There are currently no KSMP cohorts open for applications.</p>
          </div>
        )}

        {/* Cohort Detail Modal */}
        {showDetailModal && selectedCohort && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedCohort.name}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Program Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Program Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Duration:</span>
                          <span className="text-sm text-gray-900">{formatDate(selectedCohort.startDate)} - {formatDate(selectedCohort.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`text-sm font-medium ${getStatusColor(selectedCohort.status)}`}>{selectedCohort.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Students:</span>
                          <span className="text-sm text-gray-900">{selectedCohort.enrolledStudents}/{selectedCohort.maxStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Program Fee:</span>
                          <span className="text-sm text-gray-900">{formatCurrency(selectedCohort.programFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Application Deadline:</span>
                          <span className="text-sm text-gray-900">{formatDate(selectedCohort.applicationDeadline)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Description</h4>
                      <p className="text-sm text-gray-700">{selectedCohort.description}</p>
                    </div>

                    {/* Curriculum */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Curriculum Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCohort.curriculum.map((phase) => (
                          <div key={phase.phase} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">Phase {phase.phase}: {phase.title}</h5>
                              <span className="text-xs text-gray-500">{phase.duration}</span>
                            </div>
                            <p className="text-xs text-gray-600">{phase.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mentors */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Mentors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCohort.mentors.map((mentor) => (
                          <div key={mentor.id} className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserGroupIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                                <p className="text-xs text-gray-600">{mentor.expertise}</p>
                                <p className="text-xs text-gray-500">{mentor.company}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scholarships */}
                    {selectedCohort.scholarships.length > 0 && (
                      <div className="lg:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Available Scholarships</h4>
                        <div className="space-y-3">
                          {selectedCohort.scholarships.map((scholarship, index) => (
                            <div key={index} className="p-4 bg-green-50 rounded-lg">
                              <h5 className="text-sm font-medium text-green-900 mb-1">{scholarship.type}</h5>
                              <p className="text-sm text-green-700 mb-2">{scholarship.description}</p>
                              <p className="text-xs text-green-600"><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    {selectedCohort.status === 'upcoming' && (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleApplyNow(selectedCohort);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export default function ProgramDetailPage() {
  const params = useParams();
  const programId = params.id;
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock program data - in real app, this would be fetched based on programId
  const program = {
    id: programId,
    title: 'Bachelor of Technology in Computer Science',
    duration: '4 years',
    credits: '120 credits',
    description: 'Comprehensive computer science program with industry partnerships. This program provides students with a solid foundation in computer science fundamentals while emphasizing practical applications and real-world problem solving.',
    thumbnail: '/api/placeholder/600/400',
    price: 25000,
    level: 'Undergraduate',
    rating: 4.8,
    students: 1250,
    category: 'Technology',
    language: 'English',
    startDate: '2024-09-01',
    applicationDeadline: '2024-07-15',
    accreditation: 'ABET Accredited',
    programDirector: 'Dr. Sarah Johnson',
    directorBio: 'Professor of Computer Science with 15+ years of experience in software engineering and research.',
    directorAvatar: '/api/placeholder/100/100',
    curriculum: [
      {
        year: 'Year 1',
        courses: [
          'Introduction to Programming',
          'Data Structures and Algorithms',
          'Computer Organization',
          'Discrete Mathematics',
          'Calculus I & II'
        ]
      },
      {
        year: 'Year 2',
        courses: [
          'Object-Oriented Programming',
          'Database Systems',
          'Computer Networks',
          'Software Engineering',
          'Linear Algebra'
        ]
      },
      {
        year: 'Year 3',
        courses: [
          'Operating Systems',
          'Machine Learning',
          'Web Development',
          'Mobile App Development',
          'Statistics'
        ]
      },
      {
        year: 'Year 4',
        courses: [
          'Capstone Project',
          'Advanced Algorithms',
          'Cybersecurity',
          'Cloud Computing',
          'Professional Ethics'
        ]
      }
    ],
    careerOutcomes: [
      'Software Engineer',
      'Data Scientist',
      'Cybersecurity Analyst',
      'Web Developer',
      'Mobile App Developer',
      'Systems Analyst',
      'Database Administrator',
      'IT Consultant'
    ],
    admissionRequirements: [
      'High school diploma or equivalent',
      'Minimum GPA of 3.0',
      'SAT score of 1200+ or ACT score of 25+',
      'Two letters of recommendation',
      'Personal statement',
      'Official transcripts'
    ],
    financialAid: [
      'Federal Pell Grant',
      'Federal Direct Loans',
      'Work-Study Program',
      'Merit-based Scholarships',
      'Need-based Grants',
      'Payment Plans Available'
    ],
    reviews: [
      {
        id: 1,
        student: 'Alex Chen',
        graduationYear: '2023',
        rating: 5,
        comment: 'Excellent program with great faculty and hands-on learning opportunities. The curriculum is well-structured and industry-relevant.',
        currentJob: 'Software Engineer at Google'
      },
      {
        id: 2,
        student: 'Maria Rodriguez',
        graduationYear: '2022',
        rating: 5,
        comment: 'The program prepared me well for my career. The professors are knowledgeable and supportive, and the projects are challenging.',
        currentJob: 'Data Scientist at Microsoft'
      },
      {
        id: 3,
        student: 'David Kim',
        graduationYear: '2023',
        rating: 4,
        comment: 'Good program overall. Could use more focus on emerging technologies, but the fundamentals are solid.',
        currentJob: 'Full-Stack Developer at StartupXYZ'
      }
    ]
  };

  const handleApply = () => {
    // TODO: Implement application functionality
    console.log('Apply to program:', program.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'admission', label: 'Admission' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/programs"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Programs
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <HeartIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Program Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program Info */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg h-96 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-bold">
                  {program.level}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 text-white">
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">
                  {program.category}
                </span>
              </div>
            </div>

            {/* Program Details */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-sm text-indigo-600 font-medium">{program.category}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600">{program.accreditation}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{program.description}</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(program.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{program.rating}</span>
                  <span className="ml-1 text-gray-600">({program.students} students)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  {program.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <DocumentTextIcon className="h-5 w-5 mr-1" />
                  {program.credits}
                </div>
              </div>

              {/* Program Director */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Program Director: {program.programDirector}</p>
                  <p className="text-sm text-gray-600">{program.programDirectorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">${program.price.toLocaleString()}</div>
                <p className="text-gray-600">Total program cost</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{new Date(program.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Application Deadline</span>
                  <span className="font-medium text-red-600">{new Date(program.applicationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{program.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-medium">{program.credits}</span>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Apply Now
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Accredited program</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Industry partnerships</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Career support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">Financial aid available</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Program includes:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    <span>Bachelor's degree</span>
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    <span>Industry certifications</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Mentorship program</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Internship opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Career Outcomes */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Outcomes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.careerOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Aid */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Aid Options</h3>
                  <div className="space-y-2">
                    {program.financialAid.map((aid, index) => (
                      <div key={index} className="flex items-start">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{aid}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {program.curriculum.map((year, yearIndex) => (
                  <div key={yearIndex} className="border border-gray-200 rounded-lg">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="font-semibold text-indigo-900">{year.year}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {year.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="px-6 py-4 flex items-center">
                          <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'admission' && (
              <div className="space-y-8">
                {/* Admission Requirements */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Admission Requirements</h3>
                  <div className="space-y-3">
                    {program.admissionRequirements.map((req, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Process */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Submit Application</h4>
                        <p className="text-gray-600">Complete the online application form</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Submit Documents</h4>
                        <p className="text-gray-600">Upload transcripts, test scores, and recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Interview</h4>
                        <p className="text-gray-600">Participate in an admissions interview</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Decision</h4>
                        <p className="text-gray-600">Receive admission decision within 2-3 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {program.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.student}</h4>
                        <p className="text-sm text-gray-600">Class of {review.graduationYear}</p>
                        <p className="text-sm text-blue-600">{review.currentJob}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

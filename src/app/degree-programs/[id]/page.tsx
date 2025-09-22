'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon,
  BookOpenIcon,
  TrophyIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Mock data for degree programs (same as in the main page)
const degreePrograms = [
  {
    id: 1,
    title: 'Bachelor of Business Administration (BBA)',
    specialization: 'Entrepreneurship & Innovation',
    duration: '3 Years',
    format: 'Full-time',
    credits: '120 Credits',
    fee: '₹2,50,000',
    rating: 4.8,
    students: 150,
    description: 'Comprehensive undergraduate program focusing on business fundamentals with specialization in entrepreneurship and innovation.',
    features: [
      'Industry-relevant curriculum',
      'Internship opportunities',
      'Mentorship from industry experts',
      'Startup incubation support',
      'Global exchange programs'
    ],
    eligibility: '10+2 with 50% marks',
    admissionProcess: 'Entrance exam + Interview',
    careerProspects: ['Business Analyst', 'Startup Founder', 'Management Consultant', 'Product Manager'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Master of Business Administration (MBA)',
    specialization: 'Digital Business & Strategy',
    duration: '2 Years',
    format: 'Full-time',
    credits: '80 Credits',
    fee: '₹4,00,000',
    rating: 4.9,
    students: 80,
    description: 'Advanced management program designed for future business leaders with focus on digital transformation and strategic thinking.',
    features: [
      'Case study methodology',
      'Live projects with companies',
      'International study tours',
      'Leadership development',
      'Digital marketing specialization'
    ],
    eligibility: 'Bachelor degree with 50% marks',
    admissionProcess: 'CAT/MAT/GMAT + Interview',
    careerProspects: ['Senior Manager', 'Business Consultant', 'Digital Strategist', 'VP Operations'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Post Graduate Diploma in Management (PGDM)',
    specialization: 'Technology & Innovation',
    duration: '2 Years',
    format: 'Full-time',
    credits: '75 Credits',
    fee: '₹3,50,000',
    rating: 4.7,
    students: 60,
    description: 'Specialized diploma program focusing on technology management and innovation in modern business environments.',
    features: [
      'Technology-focused curriculum',
      'Industry partnerships',
      'Innovation labs access',
      'Tech startup exposure',
      'Certification programs'
    ],
    eligibility: 'Bachelor degree with 45% marks',
    admissionProcess: 'Entrance exam + Group Discussion + Interview',
    careerProspects: ['Tech Manager', 'Innovation Consultant', 'Product Owner', 'CTO'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Executive MBA (EMBA)',
    specialization: 'Leadership & Strategy',
    duration: '18 Months',
    format: 'Weekend',
    credits: '60 Credits',
    fee: '₹5,00,000',
    rating: 4.9,
    students: 40,
    description: 'Executive program designed for working professionals seeking to enhance their leadership and strategic management skills.',
    features: [
      'Weekend classes',
      'Executive coaching',
      'Peer learning',
      'Global immersion',
      'Capstone project'
    ],
    eligibility: 'Bachelor degree + 5 years work experience',
    admissionProcess: 'Application + Interview',
    careerProspects: ['C-Level Executive', 'Director', 'Senior VP', 'Board Member'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
  }
];

export default function DegreeProgramDetailPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const programId = parseInt(params.id);
    const foundProgram = degreePrograms.find(p => p.id === programId);
    setProgram(foundProgram || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
          <p className="text-gray-600 mb-6">The degree program you're looking for doesn't exist.</p>
          <Link
            href="/degree-programs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/degree-programs"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
                <p className="text-blue-600 font-semibold">{program.specialization}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/contact"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Admissions
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Image */}
            <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">{program.rating}</span>
                </div>
              </div>
            </div>

            {/* Program Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Program Overview</h2>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Prospects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Career Prospects</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {program.careerProspects.map((prospect: string, index: number) => (
                  <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-center text-sm font-medium">
                    {prospect}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{program.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Credits</p>
                    <p className="font-medium text-gray-900">{program.credits}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium text-gray-900">{program.format}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Current Students</p>
                    <p className="font-medium text-gray-900">{program.students}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Fee</p>
                    <p className="font-medium text-gray-900">{program.fee}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility</h3>
              <p className="text-gray-700">{program.eligibility}</p>
            </div>

            {/* Admission Process */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Process</h3>
              <p className="text-gray-700">{program.admissionProcess}</p>
            </div>

            {/* CTA */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-4">
                Take the first step towards your future career with this comprehensive degree program.
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors block"
                >
                  Apply Now
                </Link>
                <Link
                  href="/contact"
                  className="w-full border border-blue-600 text-blue-600 px-4 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors block"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

// Mock data for the program being viewed
const mockProgram = {
  id: 1,
  name: 'Bachelor of Business Administration (BBA)',
  specialization: 'Entrepreneurship & Innovation',
  duration: '3 Years',
  mode: 'Hybrid',
  schedule: 'Monday–Friday, 7–9 PM',
  description: 'Comprehensive undergraduate program focusing on business fundamentals with specialization in entrepreneurship and innovation. This program is designed to provide students with a solid foundation in business principles while fostering entrepreneurial thinking and innovation skills.',
  features: [
    'Industry-relevant curriculum',
    'Internship opportunities',
    'Mentorship from industry experts',
    'Startup incubation support',
    'Case study methodology',
    'Live projects with companies'
  ],
  advantages: [
    'Global exchange programs',
    'Industry partnerships',
    'Career placement support',
    'Alumni network',
    'Executive coaching',
    'Peer learning opportunities'
  ],
  eligibility: '10+2 with 50% marks',
  targetAudience: 'Students seeking business education with entrepreneurial focus',
  registrationLink: 'https://forms.google.com/bba-application',
  image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  status: 'active',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
  totalStudents: 150,
  revenue: '₹25,00,000'
};

export default function ViewDegreeProgramPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [program, setProgram] = useState(mockProgram);

  useEffect(() => {
    // Simulate loading program data
    const loadProgram = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgram(mockProgram);
      setIsLoading(false);
    };

    loadProgram();
  }, [params.id]);

  const handleDeleteProgram = () => {
    if (confirm('Are you sure you want to delete this degree program? This action cannot be undone.')) {
      // Here you would typically make an API call to delete the program
      console.log('Deleting program:', program.id);
      // Redirect back to the programs list
      window.location.href = '/admin/programs/degree-programs';
    }
  };

  const handleToggleStatus = () => {
    const newStatus = program.status === 'active' ? 'inactive' : 'active';
    if (confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this program?`)) {
      setProgram(prev => ({ ...prev, status: newStatus }));
      // Here you would typically make an API call to update the status
      console.log('Updating program status:', newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading program details...</p>
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
                href="/admin/programs/degree-programs"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Program Details</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage degree program information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  program.status === 'active'
                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {program.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <Link
                href={`/admin/programs/degree-programs/${program.id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-2 inline" />
                Edit
              </Link>
              <button
                onClick={handleDeleteProgram}
                className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-2 inline" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Image
                    src={program.image}
                    alt={program.name}
                    width={120}
                    height={120}
                    className="h-30 w-30 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{program.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {program.status === 'active' ? (
                        <>
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-lg text-blue-600 font-semibold mb-4">{program.specialization}</p>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {program.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {program.mode}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 col-span-2">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {program.schedule}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <TagIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {program.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Advantages</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {program.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center bg-green-50 px-3 py-2 rounded-md">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility & Target Audience */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Eligibility & Target Audience</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility</h4>
                  <p className="text-gray-600">{program.eligibility}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h4>
                  <p className="text-gray-600">{program.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/programs/degree-programs/${program.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Program
                </Link>
                <button
                  onClick={handleToggleStatus}
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    program.status === 'active'
                      ? 'border-red-300 text-red-700 hover:bg-red-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {program.status === 'active' ? (
                    <>
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeleteProgram}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Program
                </button>
              </div>
            </div>

            {/* Program Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="text-sm font-medium text-gray-900">{program.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Generated</span>
                  <span className="text-sm font-medium text-gray-900">{program.revenue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(program.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(program.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Link */}
            {program.registrationLink && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <LinkIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
                </div>
                <a
                  href={program.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View Registration Form
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  AcademicCapIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  TrophyIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { degreeProgramService, DegreeProgram } from '@/lib/degreeProgramService';

const stats = [
  { label: 'Total Programs', value: '0', icon: AcademicCapIcon },
  { label: 'Active Students', value: '0+', icon: UsersIcon },
  { label: 'Industry Partners', value: '50+', icon: BuildingOfficeIcon },
  { label: 'Placement Rate', value: '95%', icon: TrophyIcon }
];

export default function DegreeProgramsPage() {
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await degreeProgramService.getDegreePrograms();
      setDegreePrograms(data);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('Failed to load degree programs');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalPrograms = degreePrograms.length;
  const totalStudents = degreePrograms.reduce((sum, p) => sum + (p.totalStudents || 0), 0);

  const updatedStats = [
    { label: 'Total Programs', value: totalPrograms.toString(), icon: AcademicCapIcon },
    { label: 'Active Students', value: `${totalStudents}+`, icon: UsersIcon },
    { label: 'Industry Partners', value: '50+', icon: BuildingOfficeIcon },
    { label: 'Placement Rate', value: '95%', icon: TrophyIcon }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Degree <span className="text-yellow-300">Programs</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your career with our comprehensive degree programs designed for the future of business and entrepreneurship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/degree-programs#programs"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
              >
                Explore Programs
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Admissions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {updatedStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Degree Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of degree programs designed to prepare you for leadership roles in the modern business world.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading programs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Programs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadPrograms}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {degreePrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    {program.image ? (
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gray-200 flex items-center justify-center">
                        <AcademicCapIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-semibold">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                      <p className="text-blue-600 font-semibold">{program.specialization || 'General Program'}</p>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {program.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpenIcon className="h-4 w-4 mr-2" />
                        {program.mode}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {program.totalStudents || 0} students
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        {program.revenue || '₹0'}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {program.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{program.features.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link
                        href={`/degree-programs/${program.id}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Learn More
                      </Link>
                      <Link
                        href="/contact"
                        className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kalpla?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our degree programs are designed to provide you with the knowledge, skills, and network needed to succeed in today's dynamic business environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LightBulbIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation Focus</h3>
              <p className="text-gray-600">
                Our curriculum emphasizes innovation, entrepreneurship, and cutting-edge business practices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Perspective</h3>
              <p className="text-gray-600">
                International study tours and global case studies provide a worldwide business perspective.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Connect</h3>
              <p className="text-gray-600">
                Strong partnerships with leading companies ensure real-world exposure and placement opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful graduates who have transformed their careers with our degree programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

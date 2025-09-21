'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { 
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DegreeProgram {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "2 years", "18 months"
  totalCourses: number;
  enrolledStudents: number;
  maxStudents: number;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  startDate: string;
  endDate: string;
  requirements: string[];
  curriculum: Array<{
    semester: number;
    courses: string[];
  }>;
  assignedMentors: string[];
  createdAt: string;
  updatedAt: string;
}

interface KSMPCohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  maxStudents: number;
  currentPhase: number;
  totalPhases: number;
  status: 'active' | 'completed' | 'upcoming';
  assignedMentors: Array<{
    mentorId: string;
    mentorName: string;
    phases: number[];
  }>;
  createdAt: string;
}

export default function ProgramsPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is admin
  const isAdmin = hasRole('Admin');
  const [activeTab, setActiveTab] = useState<'degree' | 'ksmp'>('degree');
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [ksmpCohorts, setKsmpCohorts] = useState<KSMPCohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<DegreeProgram | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockDegreePrograms: DegreeProgram[] = [
      {
        id: '1',
        title: 'Bachelor of Computer Science',
        description: 'Comprehensive computer science program covering programming, algorithms, and software engineering',
        duration: '3 years',
        totalCourses: 24,
        enrolledStudents: 45,
        maxStudents: 60,
        price: 150000,
        status: 'active',
        startDate: '2024-02-01',
        endDate: '2027-01-31',
        requirements: ['High School Diploma', 'Mathematics Background', 'English Proficiency'],
        curriculum: [
          { semester: 1, courses: ['Programming Fundamentals', 'Mathematics', 'Computer Systems'] },
          { semester: 2, courses: ['Data Structures', 'Algorithms', 'Database Systems'] },
          { semester: 3, courses: ['Software Engineering', 'Web Development', 'Operating Systems'] },
          { semester: 4, courses: ['Machine Learning', 'Computer Networks', 'Project Management'] }
        ],
        assignedMentors: ['mentor1', 'mentor2'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Master of Data Science',
        description: 'Advanced data science program focusing on analytics, machine learning, and big data',
        duration: '2 years',
        totalCourses: 16,
        enrolledStudents: 28,
        maxStudents: 40,
        price: 200000,
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2026-02-28',
        requirements: ['Bachelor Degree', 'Statistics Background', 'Programming Experience'],
        curriculum: [
          { semester: 1, courses: ['Advanced Statistics', 'Python for Data Science', 'Data Visualization'] },
          { semester: 2, courses: ['Machine Learning', 'Big Data Analytics', 'Database Design'] },
          { semester: 3, courses: ['Deep Learning', 'Business Intelligence', 'Data Engineering'] },
          { semester: 4, courses: ['Capstone Project', 'Industry Internship', 'Thesis'] }
        ],
        assignedMentors: ['mentor3', 'mentor4'],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      }
    ];

    const mockKsmpCohorts: KSMPCohort[] = [
      {
        id: '1',
        name: 'KSMP Cohort 2024-01',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        enrolledStudents: 25,
        maxStudents: 30,
        currentPhase: 3,
        totalPhases: 12,
        status: 'active',
        assignedMentors: [
          { mentorId: 'mentor1', mentorName: 'John Doe', phases: [1, 2, 3] },
          { mentorId: 'mentor2', mentorName: 'Jane Smith', phases: [4, 5, 6] },
          { mentorId: 'mentor3', mentorName: 'Mike Johnson', phases: [7, 8, 9] }
        ],
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'KSMP Cohort 2024-02',
        startDate: '2024-02-15',
        endDate: '2025-01-15',
        enrolledStudents: 18,
        maxStudents: 30,
        currentPhase: 1,
        totalPhases: 12,
        status: 'active',
        assignedMentors: [
          { mentorId: 'mentor1', mentorName: 'John Doe', phases: [1, 2, 3] }
        ],
        createdAt: '2024-01-15T00:00:00Z'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setDegreePrograms(mockDegreePrograms);
      setKsmpCohorts(mockKsmpCohorts);
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
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive':
        return <XCircleIcon className="h-4 w-4" />;
      case 'draft':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
            <p className="text-gray-600">Manage degree programs and KSMP cohorts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Program
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('degree')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'degree'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Degree Programs ({degreePrograms.length})
              </button>
              <button
                onClick={() => setActiveTab('ksmp')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ksmp'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                KSMP Cohorts ({ksmpCohorts.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Degree Programs Tab */}
            {activeTab === 'degree' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {degreePrograms.map((program) => (
                    <div key={program.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                          {getStatusIcon(program.status)}
                          <span className="ml-1">{program.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {program.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {program.totalCourses} courses
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {program.enrolledStudents}/{program.maxStudents} students
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          {formatCurrency(program.price)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Starts: {formatDate(program.startDate)}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KSMP Cohorts Tab */}
            {activeTab === 'ksmp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {ksmpCohorts.map((cohort) => (
                    <div key={cohort.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Phase {cohort.currentPhase} of {cohort.totalPhases}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                          {getStatusIcon(cohort.status)}
                          <span className="ml-1">{cohort.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(cohort.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {cohort.enrolledStudents}/{cohort.maxStudents} students
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {cohort.assignedMentors.length} mentors
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {cohort.totalPhases} phases
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Mentors</h4>
                        <div className="space-y-1">
                          {cohort.assignedMentors.map((mentor) => (
                            <div key={mentor.mentorId} className="text-sm text-gray-600">
                              {mentor.mentorName} - Phases {mentor.phases.join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(cohort.createdAt)}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Program Detail Modal */}
        {showDetailModal && selectedProgram && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedProgram.title}</h3>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Program Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <span className="ml-2 text-gray-900">{selectedProgram.duration}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Total Courses:</span>
                          <span className="ml-2 text-gray-900">{selectedProgram.totalCourses}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Price:</span>
                          <span className="ml-2 text-gray-900">{formatCurrency(selectedProgram.price)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProgram.status)}`}>
                            {selectedProgram.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Start Date:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedProgram.startDate)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">End Date:</span>
                          <span className="ml-2 text-gray-900">{formatDate(selectedProgram.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Description</h4>
                      <p className="text-sm text-gray-900">{selectedProgram.description}</p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Requirements</h4>
                      <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                        {selectedProgram.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Curriculum */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Curriculum</h4>
                      <div className="space-y-3">
                        {selectedProgram.curriculum.map((semester) => (
                          <div key={semester.semester} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Semester {semester.semester}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {semester.courses.map((course, index) => (
                                <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                                  {course}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enrollment Stats */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Enrollment Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Enrolled Students:</span>
                          <span className="ml-2 text-gray-900">{selectedProgram.enrolledStudents}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Maximum Capacity:</span>
                          <span className="ml-2 text-gray-900">{selectedProgram.maxStudents}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Enrollment Rate:</span>
                          <span className="ml-2 text-gray-900">
                            {Math.round((selectedProgram.enrolledStudents / selectedProgram.maxStudents) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Edit Program
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

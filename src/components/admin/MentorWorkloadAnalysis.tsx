'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { mentorAssignmentService, Mentor, PhaseAssignment } from '@/lib/mentorAssignmentService';

interface WorkloadData {
  mentor: Mentor;
  assignments: PhaseAssignment[];
  workload: {
    totalStudents: number;
    totalPhases: number;
    utilizationRate: number;
  };
}

export default function MentorWorkloadAnalysis() {
  const [workloadData, setWorkloadData] = useState<WorkloadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<WorkloadData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'utilization' | 'students' | 'phases' | 'rating'>('utilization');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadWorkloadData();
  }, []);

  const loadWorkloadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentorAssignmentService.getMentorWorkload();
      setWorkloadData(data);
    } catch (error) {
      console.error('Error loading workload data:', error);
      setError('Failed to load mentor workload data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (mentorData: WorkloadData) => {
    setSelectedMentor(mentorData);
    setShowDetails(true);
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 75) return 'text-yellow-600';
    if (rate >= 50) return 'text-green-600';
    return 'text-gray-600';
  };

  const getUtilizationBgColor = (rate: number) => {
    if (rate >= 90) return 'bg-red-100';
    if (rate >= 75) return 'bg-yellow-100';
    if (rate >= 50) return 'bg-green-100';
    return 'bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
      case 'on-leave':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const sortedData = [...workloadData].sort((a, b) => {
    switch (sortBy) {
      case 'utilization':
        return b.workload.utilizationRate - a.workload.utilizationRate;
      case 'students':
        return b.workload.totalStudents - a.workload.totalStudents;
      case 'phases':
        return b.workload.totalPhases - a.workload.totalPhases;
      case 'rating':
        return b.mentor.rating - a.mentor.rating;
      default:
        return 0;
    }
  });

  const filteredData = sortedData.filter(data => {
    if (filterStatus === 'all') return true;
    return data.mentor.status === filterStatus;
  });

  const calculateOverallStats = () => {
    const totalMentors = workloadData.length;
    const activeMentors = workloadData.filter(d => d.mentor.status === 'active').length;
    const totalStudents = workloadData.reduce((sum, d) => sum + d.workload.totalStudents, 0);
    const averageUtilization = workloadData.length > 0 
      ? workloadData.reduce((sum, d) => sum + d.workload.utilizationRate, 0) / workloadData.length 
      : 0;
    const overloadedMentors = workloadData.filter(d => d.workload.utilizationRate >= 90).length;

    return {
      totalMentors,
      activeMentors,
      totalStudents,
      averageUtilization,
      overloadedMentors
    };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading workload analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Mentors</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalMentors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Mentors</p>
              <p className="text-lg font-bold text-gray-900">{stats.activeMentors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
              <p className="text-lg font-bold text-gray-900">{stats.averageUtilization.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Overloaded</p>
              <p className="text-lg font-bold text-gray-900">{stats.overloadedMentors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="utilization">Utilization Rate</option>
              <option value="students">Total Students</option>
              <option value="phases">Total Phases</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentor Workload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((data) => (
          <div key={data.mentor.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {data.mentor.firstName} {data.mentor.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{data.mentor.title}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                {getStatusIcon(data.mentor.status)}
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${mentorAssignmentService.getMentorStatusColor(data.mentor.status)}`}>
                  {data.mentor.status.charAt(0).toUpperCase() + data.mentor.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Workload Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-medium text-gray-900">{data.workload.totalStudents}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Phases</span>
                <span className="font-medium text-gray-900">{data.workload.totalPhases}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium text-gray-900">{data.mentor.rating}</span>
                </div>
              </div>
            </div>

            {/* Utilization Rate */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Utilization Rate</span>
                <span className={getUtilizationColor(data.workload.utilizationRate)}>
                  {data.workload.utilizationRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUtilizationBgColor(data.workload.utilizationRate).replace('bg-', 'bg-').replace('-100', '-600')}`}
                  style={{ width: `${Math.min(data.workload.utilizationRate, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Slots</span>
                <span className="font-medium text-gray-900">{data.mentor.availability.availableSlots}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Capacity</span>
                <span className="font-medium text-gray-900">{data.mentor.availability.maxStudents}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleViewDetails(data)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Mentor Details Modal */}
      {showDetails && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mentor Workload Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Mentor Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">{selectedMentor.mentor.firstName} {selectedMentor.mentor.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Title</p>
                      <p className="text-gray-900">{selectedMentor.mentor.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{selectedMentor.mentor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-gray-900">{selectedMentor.mentor.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-gray-900">{selectedMentor.mentor.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorAssignmentService.getMentorStatusColor(selectedMentor.mentor.status)}`}>
                        {selectedMentor.mentor.status.charAt(0).toUpperCase() + selectedMentor.mentor.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workload Summary */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedMentor.workload.totalStudents}</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedMentor.workload.totalPhases}</p>
                      <p className="text-sm text-gray-600">Active Phases</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getUtilizationColor(selectedMentor.workload.utilizationRate)}`}>
                        {selectedMentor.workload.utilizationRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Utilization Rate</p>
                    </div>
                  </div>
                </div>

                {/* Current Assignments */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h3>
                  {selectedMentor.assignments.length === 0 ? (
                    <p className="text-gray-600">No current assignments</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedMentor.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{assignment.phaseName}</h4>
                            <p className="text-sm text-gray-600">{assignment.programTitle}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorAssignmentService.getStatusColor(assignment.status)}`}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{assignment.studentCount} students</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expertise */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.mentor.expertise.map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

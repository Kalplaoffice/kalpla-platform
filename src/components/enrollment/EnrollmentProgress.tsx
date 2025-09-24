'use client';

import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TrophyIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { enrollmentService, EnrollmentProgress } from '@/lib/enrollmentService';

interface EnrollmentProgressProps {
  enrollmentId: string;
  programTitle: string;
}

export default function EnrollmentProgressComponent({ enrollmentId, programTitle }: EnrollmentProgressProps) {
  const [progress, setProgress] = useState<EnrollmentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [enrollmentId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const progressData = await enrollmentService.getEnrollmentProgress(enrollmentId);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading progress...</p>
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

  if (!progress) {
    return (
      <div className="text-center py-8">
        <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
        <p className="text-gray-600">Progress information will be available once you start the program.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Current Phase</p>
                <p className="text-lg font-semibold text-blue-600">Phase {progress.currentPhase}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed Phases</p>
                <p className="text-lg font-semibold text-green-600">{progress.completedPhases.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <StarIcon className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">GPA</p>
                <p className={`text-lg font-semibold ${getGradeColor(progress.gpa || 0)}`}>
                  {progress.gpa ? progress.gpa.toFixed(2) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className={`text-lg font-semibold ${getAttendanceColor(progress.attendance)}`}>
                  {progress.attendance}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Course */}
        {progress.currentCourse && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Current Course</h4>
            <div className="flex items-center">
              <BookOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{progress.currentCourse}</span>
            </div>
          </div>
        )}

        {/* Next Milestone */}
        {progress.nextMilestone && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Next Milestone</h4>
            <div className="flex items-center">
              <ArrowRightIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700">{progress.nextMilestone}</span>
            </div>
          </div>
        )}

        {/* Estimated Completion */}
        {progress.estimatedCompletion && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Estimated Completion</h4>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-700">{formatDate(progress.estimatedCompletion)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Academic Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignments */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-medium text-gray-900">Assignments</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Assignments</span>
                <span className="font-medium">{progress.assignments.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Submitted</span>
                <span className="font-medium text-blue-600">{progress.assignments.submitted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Graded</span>
                <span className="font-medium text-green-600">{progress.assignments.graded}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Submission Rate</span>
                <span>{progress.assignments.total > 0 ? Math.round((progress.assignments.submitted / progress.assignments.total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.assignments.total > 0 ? (progress.assignments.submitted / progress.assignments.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Exams */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-medium text-gray-900">Examinations</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Exams</span>
                <span className="font-medium">{progress.exams.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-blue-600">{progress.exams.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Passed</span>
                <span className="font-medium text-green-600">{progress.exams.passed}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pass Rate</span>
                <span>{progress.exams.completed > 0 ? Math.round((progress.exams.passed / progress.exams.completed) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.exams.completed > 0 ? (progress.exams.passed / progress.exams.completed) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Courses */}
      {progress.completedCourses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Courses</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.completedCourses.map((course, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{course}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Phases */}
      {progress.completedPhases.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Phases</h3>
          
          <div className="space-y-3">
            {progress.completedPhases.map((phase, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <TrophyIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-900">Phase {phase}</span>
                  <p className="text-xs text-gray-600">Successfully completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        
        <div className="space-y-3">
          {progress.gpa && progress.gpa >= 3.7 && (
            <div className="flex items-center p-3 bg-green-100 rounded-lg">
              <StarIcon className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm text-green-800">Excellent academic performance! Keep up the great work.</span>
            </div>
          )}
          
          {progress.attendance >= 90 && (
            <div className="flex items-center p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm text-blue-800">Outstanding attendance record. Your commitment is commendable.</span>
            </div>
          )}
          
          {progress.assignments.submitted === progress.assignments.total && progress.assignments.total > 0 && (
            <div className="flex items-center p-3 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-sm text-purple-800">Perfect assignment submission rate! You're staying on top of your work.</span>
            </div>
          )}
          
          {progress.exams.passed === progress.exams.completed && progress.exams.completed > 0 && (
            <div className="flex items-center p-3 bg-yellow-100 rounded-lg">
              <TrophyIcon className="h-5 w-5 text-yellow-600 mr-3" />
              <span className="text-sm text-yellow-800">Excellent exam performance! You're mastering the material.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

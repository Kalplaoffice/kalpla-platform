'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface GradeEntry {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseTitle?: string;
  cohortName?: string;
  maxPoints: number;
  grade: number;
  percentage: number;
  feedback?: string;
  submissionDate: string;
  gradedDate: string;
  status: 'GRADED' | 'PENDING' | 'LATE';
  type: 'ESSAY' | 'PROJECT' | 'QUIZ' | 'MCQ';
}

interface CourseStats {
  courseTitle: string;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  totalPoints: number;
  earnedPoints: number;
}

export default function GradebookPage() {
  const { user } = useUser();
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'grade' | 'assignment'>('date');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockGrades: GradeEntry[] = [
      {
        id: 'grade1',
        assignmentId: 'assign1',
        assignmentTitle: 'Business Idea Pitch',
        courseTitle: 'KSMP Phase 1',
        maxPoints: 100,
        grade: 85,
        percentage: 85,
        feedback: 'Good job! Your pitch is clear and compelling. Consider adding more market research data.',
        submissionDate: '2024-09-28T14:30:00Z',
        gradedDate: '2024-09-29T10:15:00Z',
        status: 'GRADED',
        type: 'ESSAY'
      },
      {
        id: 'grade2',
        assignmentId: 'assign2',
        assignmentTitle: 'Market Research Report',
        courseTitle: 'KSMP Phase 2',
        maxPoints: 100,
        grade: 88,
        percentage: 88,
        feedback: 'Excellent research and analysis. Your competitor analysis is particularly strong.',
        submissionDate: '2024-10-05T10:20:00Z',
        gradedDate: '2024-10-06T09:15:00Z',
        status: 'GRADED',
        type: 'PROJECT'
      },
      {
        id: 'grade3',
        assignmentId: 'assign3',
        assignmentTitle: 'Financial Model Quiz',
        courseTitle: 'KSMP Phase 4',
        maxPoints: 50,
        grade: 42,
        percentage: 84,
        feedback: 'Good understanding of financial concepts. Review unit economics calculations.',
        submissionDate: '2024-10-12T16:45:00Z',
        gradedDate: '2024-10-13T11:30:00Z',
        status: 'GRADED',
        type: 'QUIZ'
      },
      {
        id: 'grade4',
        assignmentId: 'assign4',
        assignmentTitle: 'Product Development Plan',
        courseTitle: 'KSMP Phase 3',
        maxPoints: 100,
        grade: 0,
        percentage: 0,
        submissionDate: '2024-10-15T23:59:59Z',
        gradedDate: '',
        status: 'PENDING',
        type: 'PROJECT'
      },
      {
        id: 'grade5',
        assignmentId: 'assign5',
        assignmentTitle: 'Pitch Deck Presentation',
        courseTitle: 'KSMP Phase 5',
        maxPoints: 100,
        grade: 0,
        percentage: 0,
        submissionDate: '2024-10-20T23:59:59Z',
        gradedDate: '',
        status: 'LATE',
        type: 'PROJECT'
      }
    ];

    const mockCourseStats: CourseStats[] = [
      {
        courseTitle: 'KSMP Phase 1',
        totalAssignments: 3,
        completedAssignments: 1,
        averageGrade: 85,
        totalPoints: 300,
        earnedPoints: 85
      },
      {
        courseTitle: 'KSMP Phase 2',
        totalAssignments: 2,
        completedAssignments: 1,
        averageGrade: 88,
        totalPoints: 200,
        earnedPoints: 88
      },
      {
        courseTitle: 'KSMP Phase 3',
        totalAssignments: 1,
        completedAssignments: 0,
        averageGrade: 0,
        totalPoints: 100,
        earnedPoints: 0
      },
      {
        courseTitle: 'KSMP Phase 4',
        totalAssignments: 1,
        completedAssignments: 1,
        averageGrade: 84,
        totalPoints: 50,
        earnedPoints: 42
      }
    ];
    
    setGrades(mockGrades);
    setCourseStats(mockCourseStats);
    setLoading(false);
  }, []);

  const filteredGrades = grades.filter(grade => 
    selectedCourse === 'all' || grade.courseTitle === selectedCourse
  );

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      case 'grade':
        return b.grade - a.grade;
      case 'assignment':
        return a.assignmentTitle.localeCompare(b.assignmentTitle);
      default:
        return 0;
    }
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GRADED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-blue-600 bg-blue-100';
      case 'LATE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'GRADED':
        return 'Graded';
      case 'PENDING':
        return 'Pending';
      case 'LATE':
        return 'Late';
      default:
        return status;
    }
  };

  const overallStats = courseStats.reduce((acc, course) => {
    acc.totalAssignments += course.totalAssignments;
    acc.completedAssignments += course.completedAssignments;
    acc.totalPoints += course.totalPoints;
    acc.earnedPoints += course.earnedPoints;
    return acc;
  }, { totalAssignments: 0, completedAssignments: 0, totalPoints: 0, earnedPoints: 0 });

  const overallAverage = overallStats.totalPoints > 0 
    ? (overallStats.earnedPoints / overallStats.totalPoints * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Authenticator>
      {({ signOut, user: authUser }) => {
        if (!authUser) return null;
        
        return (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Gradebook</h1>
              <p className="text-gray-600">
                Track your academic progress and view detailed feedback from your instructors.
              </p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Overall Average</p>
                    <p className="text-2xl font-semibold text-gray-900">{overallAverage}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {overallStats.completedAssignments}/{overallStats.totalAssignments}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Points Earned</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {overallStats.earnedPoints}/{overallStats.totalPoints}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">GPA</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {(parseFloat(overallAverage) / 100 * 4).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Course Performance</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {courseStats.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{course.courseTitle}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Average:</span>
                          <span className="font-medium">{course.averageGrade}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium">
                            {course.completedAssignments}/{course.totalAssignments}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(course.completedAssignments / course.totalAssignments) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Courses</option>
                    {courseStats.map((course, index) => (
                      <option key={index} value={course.courseTitle}>
                        {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'grade' | 'assignment')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Submission Date</option>
                    <option value="grade">Grade</option>
                    <option value="assignment">Assignment Name</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export Transcript
                  </button>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Assignment Grades</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedGrades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {grade.assignmentTitle}
                              </div>
                              <div className="text-sm text-gray-500">
                                {grade.type} • {grade.maxPoints} points
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{grade.courseTitle}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {grade.status === 'GRADED' ? (
                            <div className="flex items-center">
                              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.percentage)}`}>
                                {grade.grade}/{grade.maxPoints} ({grade.percentage}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grade.status)}`}>
                            {getStatusText(grade.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(grade.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {grade.status === 'GRADED' && (
                              <button className="text-blue-600 hover:text-blue-800">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button className="text-green-600 hover:text-green-800">
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {sortedGrades.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
                <p className="text-gray-600">
                  No assignments have been graded yet for the selected course.
                </p>
              </div>
            )}
          </div>
        );
      }}
    </Authenticator>
  );
}

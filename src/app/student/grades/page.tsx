'use client';

import { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/student/StudentLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { transcriptService } from '@/lib/transcriptService';
import { 
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Grade {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  course: string;
  courseId: string;
  phase?: number;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  feedback: string;
  gradedAt: string;
  gradedBy: string;
  status: 'graded' | 'pending';
}

interface CourseGrade {
  courseId: string;
  courseName: string;
  instructor: string;
  totalAssignments: number;
  gradedAssignments: number;
  averageScore: number;
  averagePercentage: number;
  grades: Grade[];
}

interface KSMPProgress {
  enrolled: boolean;
  currentPhase: number;
  totalPhases: number;
  phases: Array<{
    phaseNumber: number;
    title: string;
    status: 'completed' | 'current' | 'upcoming';
    averageScore: number;
    assignments: number;
    gradedAssignments: number;
  }>;
  overallAverage: number;
  totalAssignments: number;
  gradedAssignments: number;
}

interface Transcript {
  studentId: string;
  studentName: string;
  enrollmentDate: string;
  courses: CourseGrade[];
  ksmpProgress?: KSMPProgress;
  overallGPA: number;
  totalCredits: number;
  completedCredits: number;
  generatedAt: string;
}

export default function StudentGrades() {
  const { isStudent } = useRoleBasedAccess();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'ksmp' | 'transcript'>('overview');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTranscript: Transcript = {
      studentId: 's1',
      studentName: 'Rahul Sharma',
      enrollmentDate: '2024-01-15T00:00:00Z',
      overallGPA: 3.7,
      totalCredits: 12,
      completedCredits: 8,
      generatedAt: '2024-01-20T10:00:00Z',
      courses: [
        {
          courseId: 'python-ds',
          courseName: 'Python for Data Science',
          instructor: 'Jane Smith',
          totalAssignments: 8,
          gradedAssignments: 6,
          averageScore: 87.5,
          averagePercentage: 87.5,
          grades: [
            {
              id: 'g1',
              assignmentId: 'a1',
              assignmentTitle: 'Data Visualization Project',
              course: 'Python for Data Science',
              courseId: 'python-ds',
              score: 92,
              maxMarks: 100,
              percentage: 92,
              grade: 'A',
              feedback: 'Excellent work! Great use of visualization techniques and clear insights.',
              gradedAt: '2024-01-20T14:30:00Z',
              gradedBy: 'Jane Smith',
              status: 'graded'
            },
            {
              id: 'g2',
              assignmentId: 'a2',
              assignmentTitle: 'NumPy Fundamentals Quiz',
              course: 'Python for Data Science',
              courseId: 'python-ds',
              score: 85,
              maxMarks: 100,
              percentage: 85,
              grade: 'B+',
              feedback: 'Good understanding of NumPy concepts. Practice more with array operations.',
              gradedAt: '2024-01-18T10:15:00Z',
              gradedBy: 'Jane Smith',
              status: 'graded'
            }
          ]
        },
        {
          courseId: 'react-dev',
          courseName: 'React Development',
          instructor: 'Mike Johnson',
          totalAssignments: 6,
          gradedAssignments: 4,
          averageScore: 82.5,
          averagePercentage: 82.5,
          grades: [
            {
              id: 'g3',
              assignmentId: 'a3',
              assignmentTitle: 'Component Library Project',
              course: 'React Development',
              courseId: 'react-dev',
              score: 88,
              maxMarks: 100,
              percentage: 88,
              grade: 'B+',
              feedback: 'Well-structured components with good reusability. Consider adding more documentation.',
              gradedAt: '2024-01-19T16:45:00Z',
              gradedBy: 'Mike Johnson',
              status: 'graded'
            }
          ]
        }
      ],
      ksmpProgress: {
        enrolled: true,
        currentPhase: 3,
        totalPhases: 12,
        overallAverage: 88.3,
        totalAssignments: 8,
        gradedAssignments: 6,
        phases: [
          {
            phaseNumber: 1,
            title: 'Business Idea & Market Research',
            status: 'completed',
            averageScore: 90,
            assignments: 2,
            gradedAssignments: 2
          },
          {
            phaseNumber: 2,
            title: 'Business Model & Strategy',
            status: 'completed',
            averageScore: 87,
            assignments: 2,
            gradedAssignments: 2
          },
          {
            phaseNumber: 3,
            title: 'Financial Planning & Funding',
            status: 'current',
            averageScore: 88,
            assignments: 2,
            gradedAssignments: 2
          },
          {
            phaseNumber: 4,
            title: 'Product Development',
            status: 'upcoming',
            averageScore: 0,
            assignments: 3,
            gradedAssignments: 0
          },
          {
            phaseNumber: 5,
            title: 'Marketing & Sales',
            status: 'upcoming',
            averageScore: 0,
            assignments: 2,
            gradedAssignments: 0
          },
          {
            phaseNumber: 6,
            title: 'Operations & Scaling',
            status: 'upcoming',
            averageScore: 0,
            assignments: 2,
            gradedAssignments: 0
          },
          {
            phaseNumber: 7,
            title: 'Legal & Compliance',
            status: 'upcoming',
            averageScore: 0,
            assignments: 1,
            gradedAssignments: 0
          },
          {
            phaseNumber: 8,
            title: 'Funding & Investment',
            status: 'upcoming',
            averageScore: 0,
            assignments: 2,
            gradedAssignments: 0
          },
          {
            phaseNumber: 9,
            title: 'Team Building',
            status: 'upcoming',
            averageScore: 0,
            assignments: 2,
            gradedAssignments: 0
          },
          {
            phaseNumber: 10,
            title: 'Technology & Innovation',
            status: 'upcoming',
            averageScore: 0,
            assignments: 2,
            gradedAssignments: 0
          },
          {
            phaseNumber: 11,
            title: 'International Expansion',
            status: 'upcoming',
            averageScore: 0,
            assignments: 1,
            gradedAssignments: 0
          },
          {
            phaseNumber: 12,
            title: 'Exit Strategy',
            status: 'upcoming',
            averageScore: 0,
            assignments: 1,
            gradedAssignments: 0
          }
        ]
      }
    };

    // Simulate API call
    setTimeout(() => {
      setTranscript(mockTranscript);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'text-green-600 bg-green-100';
      case 'B':
      case 'B+':
        return 'text-blue-600 bg-blue-100';
      case 'C':
      case 'C+':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'current':
        return <ClockIcon className="h-4 w-4" />;
      case 'upcoming':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const calculateGPA = (percentage: number) => {
    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.7;
    if (percentage >= 70) return 3.3;
    if (percentage >= 60) return 3.0;
    if (percentage >= 50) return 2.7;
    return 2.0;
  };

  const downloadTranscript = async () => {
    try {
      const transcript = await transcriptService.generateTranscript(user?.id || '');
      if (transcript.transcriptUrl) {
        await transcriptService.downloadTranscript(
          transcript.transcriptUrl,
          `transcript_${user?.id}_${new Date().toISOString().split('T')[0]}.pdf`
        );
      }
    } catch (error) {
      console.error('Error downloading transcript:', error);
    }
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!transcript) {
    return (
      <StudentLayout>
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Grades Found</h2>
          <p className="text-gray-600">No grades are available at this time.</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grades / Transcript</h1>
            <p className="text-gray-600">View your academic progress and grades</p>
          </div>
          <button
            onClick={downloadTranscript}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download Transcript
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overall GPA</p>
                <p className="text-2xl font-semibold text-gray-900">{transcript.overallGPA}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Courses Enrolled</p>
                <p className="text-2xl font-semibold text-gray-900">{transcript.courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Credits Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transcript.completedCredits}/{transcript.totalCredits}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {transcript.ksmpProgress ? transcript.ksmpProgress.overallAverage.toFixed(1) : 'N/A'}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Course Grades
              </button>
              {transcript.ksmpProgress?.enrolled && (
                <button
                  onClick={() => setActiveTab('ksmp')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ksmp'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  KSMP Progress
                </button>
              )}
              <button
                onClick={() => setActiveTab('transcript')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transcript'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Full Transcript
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student Name:</span>
                        <span className="font-medium">{transcript.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enrollment Date:</span>
                        <span className="font-medium">{formatDate(transcript.enrollmentDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overall GPA:</span>
                        <span className="font-medium">{transcript.overallGPA}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits Completed:</span>
                        <span className="font-medium">{transcript.completedCredits}/{transcript.totalCredits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
                    <div className="space-y-3">
                      {transcript.courses.map((course) => (
                        <div key={course.courseId} className="flex items-center justify-between">
                          <span className="text-gray-600 truncate">{course.courseName}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{course.averagePercentage.toFixed(1)}%</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(course.grades[0]?.grade || 'N/A')}`}>
                              {course.grades[0]?.grade || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {transcript.ksmpProgress?.enrolled && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">KSMP Progress Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{transcript.ksmpProgress.currentPhase}</p>
                        <p className="text-sm text-gray-600">Current Phase</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{transcript.ksmpProgress.overallAverage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Average Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {transcript.ksmpProgress.gradedAssignments}/{transcript.ksmpProgress.totalAssignments}
                        </p>
                        <p className="text-sm text-gray-600">Assignments Graded</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Course Grades Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                {transcript.courses.map((course) => (
                  <div key={course.courseId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                        <p className="text-gray-600">by {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{course.averagePercentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">
                          {course.gradedAssignments}/{course.totalAssignments} assignments graded
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {course.grades.map((grade) => (
                        <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{grade.assignmentTitle}</h4>
                            <p className="text-xs text-gray-500">
                              Graded by {grade.gradedBy} on {formatDate(grade.gradedAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-900">
                              {grade.score}/{grade.maxMarks}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                            <span className="text-sm text-gray-600">{grade.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* KSMP Progress Tab */}
            {activeTab === 'ksmp' && transcript.ksmpProgress && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">KSMP Phase Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {transcript.ksmpProgress.phases.map((phase) => (
                      <div key={phase.phaseNumber} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">Phase {phase.phaseNumber}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseStatusColor(phase.status)}`}>
                            {getPhaseStatusIcon(phase.status)}
                            <span className="ml-1">{phase.status}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 truncate">{phase.title}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Score: {phase.averageScore > 0 ? `${phase.averageScore}%` : 'N/A'}</span>
                          <span>{phase.gradedAssignments}/{phase.assignments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Full Transcript Tab */}
            {activeTab === 'transcript' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Official Transcript</h3>
                    <span className="text-sm text-gray-500">
                      Generated on {formatDate(transcript.generatedAt)}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Student ID:</span>
                        <span className="ml-2 text-gray-900">{transcript.studentId}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Student Name:</span>
                        <span className="ml-2 text-gray-900">{transcript.studentName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Enrollment Date:</span>
                        <span className="ml-2 text-gray-900">{formatDate(transcript.enrollmentDate)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Overall GPA:</span>
                        <span className="ml-2 text-gray-900">{transcript.overallGPA}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {transcript.courses.map((course) => (
                    <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-gray-900">{course.courseName}</h4>
                        <span className="text-sm text-gray-600">Average: {course.averagePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="space-y-2">
                        {course.grades.map((grade) => (
                          <div key={grade.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{grade.assignmentTitle}</span>
                            <div className="flex items-center space-x-3">
                              <span>{grade.score}/{grade.maxMarks}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade.grade)}`}>
                                {grade.grade}
                              </span>
                              <span>{grade.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

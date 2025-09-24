'use client';

import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  DocumentIcon,
  ShieldCheckIcon,
  PlusIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { studentGradeService, StudentGrade, CourseGradeSummary, KSMPTranscript, GradeAnalytics, GradeComparison } from '@/lib/studentGradeService';

export default function StudentGradeDashboard() {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [courseSummaries, setCourseSummaries] = useState<CourseGradeSummary[]>([]);
  const [transcript, setTranscript] = useState<KSMPTranscript | null>(null);
  const [analytics, setAnalytics] = useState<GradeAnalytics | null>(null);
  const [comparison, setComparison] = useState<GradeComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'transcript' | 'analytics' | 'comparison'>('overview');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [gradesData, courseSummariesData, transcriptData, analyticsData, comparisonData] = await Promise.all([
        studentGradeService.getStudentGrades('student_1'), // Mock student ID
        studentGradeService.getStudentCourseSummaries('student_1'),
        studentGradeService.getKSMPTranscript('student_1'),
        studentGradeService.getGradeAnalytics('student_1'),
        studentGradeService.getGradeComparison('student_1')
      ]);
      
      setGrades(gradesData);
      setCourseSummaries(courseSummariesData);
      setTranscript(transcriptData);
      setAnalytics(analyticsData);
      setComparison(comparisonData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load grade data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading grade data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Grade Dashboard</h1>
                <p className="text-gray-600">Track your academic progress and performance</p>
              </div>
            </div>
            {transcript && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Cumulative GPA</div>
                <div className={`text-2xl font-bold ${studentGradeService.getGPAColor(transcript.cumulativeGPA)}`}>
                  {transcript.cumulativeGPA.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'courses', name: 'Per-Course', icon: DocumentTextIcon },
                { id: 'transcript', name: 'KSMP Transcript', icon: AcademicCapIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
                { id: 'comparison', name: 'Comparison', icon: UserGroupIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && analytics && (
          <OverviewTab analytics={analytics} transcript={transcript} />
        )}

        {activeTab === 'courses' && (
          <CoursesTab 
            courseSummaries={courseSummaries}
            selectedCourse={selectedCourse}
            onSelectCourse={setSelectedCourse}
          />
        )}

        {activeTab === 'transcript' && transcript && (
          <TranscriptTab transcript={transcript} />
        )}

        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab analytics={analytics} />
        )}

        {activeTab === 'comparison' && comparison && (
          <ComparisonTab comparison={comparison} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics, transcript }: { analytics: GradeAnalytics; transcript: KSMPTranscript | null }) {
  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.overallStats.averageGrade}%</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.overallStats.cumulativeGPA}</p>
              <p className="text-sm text-gray-600">Cumulative GPA</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.overallStats.completedAssignments}</p>
              <p className="text-sm text-gray-600">Completed Assignments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">#{analytics.overallStats.rank}</p>
              <p className="text-sm text-gray-600">Class Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Progress */}
      {transcript && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KSMP Program Progress</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Program: {transcript.programName}</span>
              <span className="text-sm text-gray-600">{transcript.completedCredits}/{transcript.totalCredits} credits</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(transcript.completedCredits / transcript.totalCredits) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Enrolled: {studentGradeService.formatDate(transcript.enrollmentDate)}</span>
              <span>Expected Graduation: {studentGradeService.formatDate(transcript.expectedGraduationDate)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Grades */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h2>
        <div className="space-y-3">
          {analytics.courseStats.slice(0, 5).map((course) => (
            <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                  <p className="text-xs text-gray-500">{course.completed}/{course.assignments} assignments</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentGradeService.getLetterGradeColor(course.letterGrade)}`}>
                  {course.letterGrade}
                </span>
                <span className="text-sm font-medium text-gray-900">{course.averageGrade}%</span>
                {course.trend === 'improving' && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
                {course.trend === 'declining' && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                {course.trend === 'stable' && <MinusIcon className="h-4 w-4 text-gray-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {transcript && transcript.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transcript.achievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Courses Tab Component
function CoursesTab({ 
  courseSummaries, 
  selectedCourse, 
  onSelectCourse 
}: {
  courseSummaries: CourseGradeSummary[];
  selectedCourse: string | null;
  onSelectCourse: (courseId: string | null) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCourses = courseSummaries.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedCourseData = selectedCourse 
    ? courseSummaries.find(c => c.courseId === selectedCourse)
    : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Courses</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by course name or code..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
          {filteredCourses.map((course) => (
            <div 
              key={course.courseId} 
              className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
                selectedCourse === course.courseId ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectCourse(course.courseId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                  <p className="text-sm text-gray-600">{course.courseCode} • {course.credits} credits</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentGradeService.getLetterGradeColor(course.letterGrade)}`}>
                      {course.letterGrade}
                    </span>
                    <span className="text-sm text-gray-600">GPA: {course.gpa}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentGradeService.getStatusColor(course.status)}`}>
                      {course.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{course.averageGrade}%</p>
                  <p className="text-sm text-gray-600">{course.completedAssignments}/{course.totalAssignments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
          {selectedCourseData ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedCourseData.courseName}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedCourseData.averageGrade}%</p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedCourseData.gpa}</p>
                  <p className="text-sm text-gray-600">GPA</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assignments</h4>
                  <div className="space-y-2">
                    {selectedCourseData.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-xs text-gray-500">{assignment.type} • Due: {studentGradeService.formatDate(assignment.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          {assignment.grade !== undefined ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{assignment.grade}/{assignment.maxGrade}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentGradeService.getLetterGradeColor(assignment.letterGrade || '')}`}>
                                {assignment.letterGrade}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not graded</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
              <p className="text-gray-600">Choose a course from the list to view detailed information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Transcript Tab Component
function TranscriptTab({ transcript }: { transcript: KSMPTranscript }) {
  return (
    <div className="space-y-6">
      {/* Transcript Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">KSMP Academic Transcript</h2>
          <p className="text-gray-600 mb-4">{transcript.programName}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{transcript.studentName}</p>
              <p className="text-sm text-gray-600">Student</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{transcript.cumulativeGPA}</p>
              <p className="text-sm text-gray-600">Cumulative GPA</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{transcript.completedCredits}</p>
              <p className="text-sm text-gray-600">Credits Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{transcript.overallGrade}</p>
              <p className="text-sm text-gray-600">Overall Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Academic Phases</h2>
        {transcript.phases.map((phase) => (
          <div key={phase.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                <p className="text-sm text-gray-600">Phase {phase.order}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${studentGradeService.getStatusColor(phase.status)}`}>
                  {phase.status.replace('_', ' ')}
                </span>
                <p className="text-sm text-gray-600 mt-1">{phase.completedCredits}/{phase.credits} credits</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(phase.completedCredits / phase.credits) * 100}%` }}
              ></div>
            </div>

            {phase.courses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Courses</h4>
                {phase.courses.map((course) => (
                  <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                      <p className="text-xs text-gray-500">{course.courseCode} • {course.credits} credits</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentGradeService.getLetterGradeColor(course.letterGrade)}`}>
                        {course.letterGrade}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{course.averageGrade}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievements and Honors */}
      {(transcript.achievements.length > 0 || transcript.honors.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transcript.achievements.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {transcript.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      <p className="text-xs text-gray-400">{studentGradeService.formatDate(achievement.earnedDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {transcript.honors.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Honors</h3>
              <div className="space-y-3">
                {transcript.honors.map((honor) => (
                  <div key={honor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <TrophyIcon className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{honor.name}</p>
                      <p className="text-xs text-gray-500">{honor.description}</p>
                      <p className="text-xs text-gray-400">{studentGradeService.formatDate(honor.earnedDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ analytics }: { analytics: GradeAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Performance Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Strengths</h3>
            <div className="space-y-2">
              {analytics.performance.strength.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Areas for Improvement</h3>
            <div className="space-y-2">
              {analytics.performance.improvement.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
            <div className="space-y-2">
              {analytics.performance.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ArrowRightIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
        <div className="space-y-3">
          {analytics.distribution.map((dist) => (
            <div key={dist.range} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{dist.range}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dist.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
                <span className="text-sm text-gray-500 w-12 text-right">{dist.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h2>
        <div className="space-y-3">
          {analytics.trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{trend.period}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Avg: {trend.averageGrade.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">({trend.assignments} assignments)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Comparison Tab Component
function ComparisonTab({ comparison }: { comparison: GradeComparison[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Comparison</h2>
        <div className="space-y-3">
          {comparison.map((student, index) => (
            <div key={student.studentId} className={`flex items-center justify-between p-4 rounded-lg ${
              index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                }`}>
                  {student.rank}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                  <p className="text-xs text-gray-500">{student.completedAssignments}/{student.totalAssignments} assignments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{student.averageGrade}%</p>
                <p className="text-xs text-gray-500">GPA: {student.cumulativeGPA}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
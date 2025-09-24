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
  PencilIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  DocumentIcon,
  ShieldCheckIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { mentorGradingService, Grade, GradebookEntry, GradebookStatistics, RubricScore } from '@/lib/mentorGradingService';
import { studentSubmissionService, StudentSubmission } from '@/lib/studentSubmissionService';
import { mentorAssignmentService, MentorAssignment } from '@/lib/mentorAssignmentService';

export default function MentorGradingPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradebookEntries, setGradebookEntries] = useState<GradebookEntry[]>([]);
  const [statistics, setStatistics] = useState<GradebookStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gradebook' | 'grading' | 'statistics'>('gradebook');
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<MentorAssignment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [gradesData, gradebookData, statisticsData] = await Promise.all([
        mentorGradingService.getMentorGrades('mentor_1'), // Mock mentor ID
        mentorGradingService.getMentorGradebook('mentor_1'),
        mentorGradingService.getGradebookStatistics('mentor_1')
      ]);
      
      setGrades(gradesData);
      setGradebookEntries(gradebookData);
      setStatistics(statisticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load grading data');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (
    submissionId: string,
    rubricScores: RubricScore[],
    feedback: string,
    bonusPoints: number = 0,
    latePenalty: number = 0
  ) => {
    try {
      const grade = await mentorGradingService.gradeSubmissionWithRubric(
        submissionId,
        'mentor_1',
        rubricScores,
        feedback,
        bonusPoints,
        latePenalty
      );

      if (grade) {
        await loadData(); // Reload data
        setShowGradingModal(false);
        setSelectedSubmission(null);
        setSelectedAssignment(null);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      setError('Failed to grade submission');
    }
  };

  const handleViewSubmission = async (submissionId: string) => {
    try {
      const submission = await studentSubmissionService.getSubmission(submissionId);
      const assignment = await mentorAssignmentService.getAssignment(submission?.assignmentId || '');
      
      if (submission && assignment) {
        setSelectedSubmission(submission);
        setSelectedAssignment(assignment);
        setShowGradingModal(true);
      }
    } catch (error) {
      console.error('Error loading submission:', error);
      setError('Failed to load submission');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading grading data...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Grading & Gradebook</h1>
                <p className="text-gray-600">Manage student grades and provide feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'gradebook', name: 'Gradebook', icon: DocumentTextIcon },
                { id: 'grading', name: 'Grading', icon: PencilIcon },
                { id: 'statistics', name: 'Statistics', icon: ChartBarIcon }
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
        {activeTab === 'gradebook' && (
          <GradebookTab 
            entries={gradebookEntries}
            onViewSubmission={handleViewSubmission}
          />
        )}

        {activeTab === 'grading' && (
          <GradingTab 
            grades={grades}
            onViewSubmission={handleViewSubmission}
          />
        )}

        {activeTab === 'statistics' && statistics && (
          <StatisticsTab statistics={statistics} />
        )}

        {/* Grading Modal */}
        {showGradingModal && selectedSubmission && selectedAssignment && (
          <GradingModal
            submission={selectedSubmission}
            assignment={selectedAssignment}
            onSubmit={handleGradeSubmission}
            onClose={() => {
              setShowGradingModal(false);
              setSelectedSubmission(null);
              setSelectedAssignment(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Gradebook Tab Component
function GradebookTab({ 
  entries, 
  onViewSubmission 
}: {
  entries: GradebookEntry[];
  onViewSubmission: (submissionId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignment, setFilterAssignment] = useState('all');

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesAssignment = filterAssignment === 'all' || entry.assignmentId === filterAssignment;
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  const uniqueAssignments = Array.from(new Set(entries.map(entry => entry.assignmentId)))
    .map(id => entries.find(entry => entry.assignmentId === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search students or assignments..."
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
              <option value="not_submitted">Not Submitted</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
              <option value="missing">Missing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
            <select
              value={filterAssignment}
              onChange={(e) => setFilterAssignment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Assignments</option>
              {uniqueAssignments.map((assignment) => (
                <option key={assignment?.assignmentId} value={assignment?.assignmentId}>
                  {assignment?.assignmentTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Gradebook</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.studentName}</div>
                      <div className="text-sm text-gray-500">{entry.studentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.assignmentTitle}</div>
                      <div className="text-sm text-gray-500">{entry.assignmentType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mentorGradingService.formatDate(entry.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorGradingService.getStatusColor(entry.status)}`}>
                      {entry.status.replace('_', ' ').charAt(0).toUpperCase() + entry.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.grade !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.grade}/{entry.maxGrade}
                        </span>
                        {entry.letterGrade && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorGradingService.getLetterGradeColor(entry.letterGrade)}`}>
                            {entry.letterGrade}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {entry.status === 'submitted' && (
                      <button
                        onClick={() => onViewSubmission(`sub_${entry.assignmentId}_${entry.studentId}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Grade
                      </button>
                    )}
                    {entry.status === 'graded' && (
                      <button
                        onClick={() => onViewSubmission(`sub_${entry.assignmentId}_${entry.studentId}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Grading Tab Component
function GradingTab({ 
  grades, 
  onViewSubmission 
}: {
  grades: Grade[];
  onViewSubmission: (submissionId: string) => void;
}) {
  return (
    <div className="space-y-6">
      {grades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600">Start grading assignments to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grades.map((grade) => (
            <div key={grade.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{grade.studentName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorGradingService.getStatusColor(grade.status)}`}>
                      {grade.status.replace('_', ' ').charAt(0).toUpperCase() + grade.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorGradingService.getLetterGradeColor(grade.letterGrade)}`}>
                      {grade.letterGrade}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{grade.feedback}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      {grade.grade}/{grade.maxGrade} ({grade.percentage}%)
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Graded: {mentorGradingService.formatDate(grade.gradedAt)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {mentorGradingService.formatTime(grade.gradedAt)}
                    </div>
                  </div>

                  {/* Rubric Scores */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Rubric Scores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {grade.rubricScores.map((score) => (
                        <div key={score.criteriaId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">{score.criteriaName}</span>
                            <span className="text-sm text-gray-600">{score.earnedPoints}/{score.maxPoints}</span>
                          </div>
                          <p className="text-xs text-gray-600">{score.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  {grade.comments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
                      <div className="space-y-2">
                        {grade.comments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                  comment.authorType === 'mentor' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {comment.authorType}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">{mentorGradingService.formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onViewSubmission(grade.submissionId)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="View Submission"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Statistics Tab Component
function StatisticsTab({ statistics }: { statistics: GradebookStatistics }) {
  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalAssignments}</p>
              <p className="text-sm text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.gradedAssignments}</p>
              <p className="text-sm text-gray-600">Graded Assignments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.averageGrade}</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
        <div className="space-y-3">
          {statistics.gradeDistribution.map((dist) => (
            <div key={dist.range} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{dist.range}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
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

      {/* Grade Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Trends by Assignment</h2>
        <div className="space-y-3">
          {statistics.gradeTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{trend.assignment}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Avg: {trend.averageGrade}</span>
                <span className="text-sm text-gray-500">({trend.gradedCount} graded)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Grading Modal Component
function GradingModal({ 
  submission, 
  assignment, 
  onSubmit, 
  onClose 
}: {
  submission: StudentSubmission;
  assignment: MentorAssignment;
  onSubmit: (submissionId: string, rubricScores: RubricScore[], feedback: string, bonusPoints: number, latePenalty: number) => void;
  onClose: () => void;
}) {
  const [rubricScores, setRubricScores] = useState<RubricScore[]>([]);
  const [feedback, setFeedback] = useState('');
  const [bonusPoints, setBonusPoints] = useState(0);
  const [latePenalty, setLatePenalty] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize rubric scores
    const initialScores = assignment.rubric.criteria.map(criteria => ({
      criteriaId: criteria.id,
      criteriaName: criteria.name,
      maxPoints: criteria.maxPoints,
      earnedPoints: 0,
      feedback: '',
      level: 'satisfactory' as const
    }));
    setRubricScores(initialScores);
  }, [assignment]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(submission.id, rubricScores, feedback, bonusPoints, latePenalty);
    } catch (error) {
      console.error('Error submitting grade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRubricScore = (criteriaId: string, earnedPoints: number, feedback: string, level: string) => {
    setRubricScores(prev => prev.map(score => 
      score.criteriaId === criteriaId 
        ? { ...score, earnedPoints, feedback, level: level as any }
        : score
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Grade Submission</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Submission Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Submission Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Student:</span>
                  <span className="ml-2 font-medium">{submission.studentName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Assignment:</span>
                  <span className="ml-2 font-medium">{assignment.title}</span>
                </div>
                <div>
                  <span className="text-gray-600">Submitted:</span>
                  <span className="ml-2 font-medium">{mentorGradingService.formatDate(submission.submittedAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max Grade:</span>
                  <span className="ml-2 font-medium">{assignment.totalMarks}</span>
                </div>
              </div>
            </div>

            {/* Submission Content */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Submission Content</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
              </div>
            </div>

            {/* Rubric Scoring */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Rubric Scoring</h3>
              <div className="space-y-4">
                {assignment.rubric.criteria.map((criteria) => {
                  const score = rubricScores.find(s => s.criteriaId === criteria.id);
                  return (
                    <div key={criteria.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                        <span className="text-sm text-gray-600">Max: {criteria.maxPoints} points</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Earned Points</label>
                          <input
                            type="number"
                            min="0"
                            max={criteria.maxPoints}
                            value={score?.earnedPoints || 0}
                            onChange={(e) => updateRubricScore(criteria.id, parseInt(e.target.value), score?.feedback || '', score?.level || 'satisfactory')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Level</label>
                          <select
                            value={score?.level || 'satisfactory'}
                            onChange={(e) => updateRubricScore(criteria.id, score?.earnedPoints || 0, score?.feedback || '', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="satisfactory">Satisfactory</option>
                            <option value="needs_improvement">Needs Improvement</option>
                            <option value="unsatisfactory">Unsatisfactory</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                        <textarea
                          value={score?.feedback || ''}
                          onChange={(e) => updateRubricScore(criteria.id, score?.earnedPoints || 0, e.target.value, score?.level || 'satisfactory')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder="Provide specific feedback for this criteria..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Points */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Points</label>
                <input
                  type="number"
                  min="0"
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty</label>
                <input
                  type="number"
                  min="0"
                  value={latePenalty}
                  onChange={(e) => setLatePenalty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Overall Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Provide overall feedback for this submission..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Grading...' : 'Submit Grade'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
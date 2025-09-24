'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon,
  ChatBubbleBottomCenterTextIcon,
  FlagIcon,
  HeartIcon,
  ThumbUpIcon,
  ThumbDownIcon
} from '@heroicons/react/24/outline';
import { 
  peerReviewService, 
  PeerReview, 
  ReviewRubric, 
  ReviewAssignment, 
  ReviewFeedback,
  ReviewStats,
  ReviewMatch,
  ReviewStatus,
  FeedbackType,
  ReviewType,
  MatchingStrategy,
  ReviewCriteria
} from '@/lib/peerReviewService';

interface PeerReviewDashboardProps {
  userId: string;
  userRole: 'admin' | 'instructor' | 'student';
}

export function PeerReviewDashboard({
  userId,
  userRole
}: PeerReviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'rubrics' | 'assignments' | 'feedback' | 'stats'>('reviews');
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [rubrics, setRubrics] = useState<ReviewRubric[]>([]);
  const [assignments, setAssignments] = useState<ReviewAssignment[]>([]);
  const [feedback, setFeedback] = useState<ReviewFeedback[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    assignmentId: '',
    courseId: '',
    status: '',
    reviewerId: '',
    revieweeId: '',
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab, filters, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'reviews':
          const reviewData = await peerReviewService.getPeerReviews({
            assignmentId: filters.assignmentId || undefined,
            courseId: filters.courseId || undefined,
            reviewerId: filters.reviewerId || undefined,
            revieweeId: filters.revieweeId || undefined,
            status: filters.status as ReviewStatus || undefined
          });
          setReviews(reviewData);
          break;
        case 'rubrics':
          const rubricData = await peerReviewService.getReviewRubrics();
          setRubrics(rubricData);
          break;
        case 'assignments':
          const assignmentData = await peerReviewService.getReviewAssignments();
          setAssignments(assignmentData);
          break;
        case 'feedback':
          const feedbackData = await peerReviewService.getReviewFeedback();
          setFeedback(feedbackData);
          break;
        case 'stats':
          const statsData = await peerReviewService.getReviewStats();
          setStats(statsData);
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewId: string, reviewData: {
    criteria: ReviewCriteria[];
    overallScore: number;
    overallFeedback: string;
    strengths: string[];
    improvements: string[];
  }) => {
    try {
      const updatedReview = await peerReviewService.submitPeerReview(reviewId, reviewData);
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  const handleCreateRubric = async (rubricData: Partial<ReviewRubric>) => {
    try {
      const newRubric = await peerReviewService.createReviewRubric({
        name: rubricData.name || '',
        description: rubricData.description || '',
        courseId: rubricData.courseId || '',
        courseName: rubricData.courseName || '',
        criteria: rubricData.criteria || [],
        isActive: rubricData.isActive || true,
        createdBy: userId
      });
      
      setRubrics(prev => [newRubric, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create rubric');
    }
  };

  const handleCreateAssignment = async (assignmentData: Partial<ReviewAssignment>) => {
    try {
      const newAssignment = await peerReviewService.createReviewAssignment({
        assignmentId: assignmentData.assignmentId || '',
        assignmentName: assignmentData.assignmentName || '',
        courseId: assignmentData.courseId || '',
        courseName: assignmentData.courseName || '',
        rubricId: assignmentData.rubricId || '',
        rubricName: assignmentData.rubricName || '',
        reviewType: assignmentData.reviewType || 'peer_review',
        matchingStrategy: assignmentData.matchingStrategy || 'random',
        reviewCount: assignmentData.reviewCount || 1,
        dueDate: assignmentData.dueDate || '',
        isActive: assignmentData.isActive || true,
        participants: assignmentData.participants || []
      });
      
      setAssignments(prev => [newAssignment, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
    }
  };

  const handleGenerateMatches = async (assignmentId: string, strategy: MatchingStrategy) => {
    try {
      const matches = await peerReviewService.generateReviewMatches(assignmentId, strategy);
      // In a real implementation, you would create peer reviews from these matches
      console.log('Generated matches:', matches);
    } catch (err: any) {
      setError(err.message || 'Failed to generate matches');
    }
  };

  const getStatusColor = (status: ReviewStatus) => {
    return peerReviewService.getReviewStatusColor(status);
  };

  const getFeedbackTypeColor = (type: FeedbackType) => {
    return peerReviewService.getFeedbackTypeColor(type);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    return peerReviewService.getScoreColor(score, maxScore);
  };

  const formatDate = (date: string) => {
    return peerReviewService.formatDate(date);
  };

  const formatRelativeTime = (date: string) => {
    return peerReviewService.formatRelativeTime(date);
  };

  const filteredReviews = reviews.filter(review => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return review.assignmentName.toLowerCase().includes(query) ||
             review.overallFeedback.toLowerCase().includes(query) ||
             review.strengths.some(strength => strength.toLowerCase().includes(query)) ||
             review.improvements.some(improvement => improvement.toLowerCase().includes(query));
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Peer Reviews</h1>
            <p className="text-gray-600">Manage student peer reviews and feedback</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Create Button */}
            {(userRole === 'admin' || userRole === 'instructor') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'reviews', label: 'Reviews', icon: ClipboardDocumentCheckIcon },
              { id: 'rubrics', label: 'Rubrics', icon: DocumentTextIcon },
              { id: 'assignments', label: 'Assignments', icon: AcademicCapIcon },
              { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon },
              { id: 'stats', label: 'Statistics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="overallScore">Overall Score</option>
                  <option value="status">Status</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAscendingIcon className="h-4 w-4" /> : <SortDescendingIcon className="h-4 w-4" />}
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedReviews.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Mark Complete
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{review.assignmentName}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                            {review.status.replace('_', ' ')}
                          </span>
                          {review.overallScore > 0 && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(review.overallScore, 100)}`}>
                              {review.overallScore}/100
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Reviewer</p>
                            <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reviewee</p>
                            <p className="text-sm font-medium text-gray-900">{review.revieweeName}</p>
                          </div>
                        </div>

                        {review.overallFeedback && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Overall Feedback</p>
                            <p className="text-sm text-gray-900">{review.overallFeedback}</p>
                          </div>
                        )}

                        {review.strengths.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Strengths</p>
                            <ul className="text-sm text-gray-900 list-disc list-inside">
                              {review.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {review.improvements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Areas for Improvement</p>
                            <ul className="text-sm text-gray-900 list-disc list-inside">
                              {review.improvements.map((improvement, index) => (
                                <li key={index}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Course: {review.courseName}</span>
                          <span>Due: {formatDate(review.dueDate)}</span>
                          {review.submittedAt && (
                            <span>Submitted: {formatRelativeTime(review.submittedAt)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReviews(prev => [...prev, review.id]);
                            } else {
                              setSelectedReviews(prev => prev.filter(id => id !== review.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        
                        <button className="text-blue-600 hover:text-blue-800" title="View Details">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {review.status === 'in_progress' && (
                          <button className="text-green-600 hover:text-green-800" title="Submit Review">
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button className="text-gray-600 hover:text-gray-800" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <div className="text-center py-8">
                  <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or create a new review</p>
                </div>
              )}
            </div>
          )}

          {/* Rubrics Tab */}
          {activeTab === 'rubrics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Review Rubrics</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Rubric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rubrics.map((rubric) => (
                  <div key={rubric.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{rubric.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{rubric.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Course:</span>
                        <span className="text-sm text-gray-900">{rubric.courseName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Criteria:</span>
                        <span className="text-sm text-gray-900">{rubric.criteria.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Max Score:</span>
                        <span className="text-sm text-gray-900">{rubric.maxScore}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-sm font-semibold ${
                          rubric.isActive ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {rubric.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Criteria:</h4>
                      <div className="space-y-1">
                        {rubric.criteria.map((criteria, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{criteria.name}</span>
                            <span className="text-gray-900">{criteria.maxScore} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Review Assignments</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.assignmentName}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Course</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.courseName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Review Type</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.reviewType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Matching Strategy</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.matchingStrategy.replace('_', ' ')}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Participants</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.participants.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reviews per Student</p>
                            <p className="text-sm font-medium text-gray-900">{assignment.reviewCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Due Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(assignment.dueDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleGenerateMatches(assignment.id, assignment.matchingStrategy)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Generate Matches"
                        >
                          <UserGroupIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Review Feedback</h3>
              </div>

              <div className="space-y-4">
                {feedback.map((feedbackItem) => (
                  <div key={feedbackItem.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeedbackTypeColor(feedbackItem.feedbackType)}`}>
                            {feedbackItem.feedbackType.replace('_', ' ')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{feedbackItem.rating}/5</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-900 mb-4">{feedbackItem.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>From: {feedbackItem.revieweeName}</span>
                          <span>Created: {formatRelativeTime(feedbackItem.createdAt)}</span>
                          <span className={`inline-flex items-center space-x-1 ${
                            feedbackItem.isHelpful ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            <ThumbUpIcon className="h-4 w-4" />
                            <span>{feedbackItem.isHelpful ? 'Helpful' : 'Not Helpful'}</span>
                          </span>
                          <span className={`inline-flex items-center space-x-1 ${
                            feedbackItem.isConstructive ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            <LightBulbIcon className="h-4 w-4" />
                            <span>{feedbackItem.isConstructive ? 'Constructive' : 'Not Constructive'}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800" title="View Details">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Review Status Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Review Status Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.reviewsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Reviewers */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Top Reviewers</h4>
                  <div className="space-y-2">
                    {stats.topReviewers.slice(0, 5).map((reviewer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{reviewer.userName}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{reviewer.reviewCount} reviews</span>
                          <span className="text-sm text-gray-500">({reviewer.averageScore.toFixed(1)} avg)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Trends */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Review Trends</h4>
                <div className="space-y-2">
                  {stats.reviewTrends.slice(0, 7).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{formatDate(trend.date)}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-900">{trend.reviewsCompleted} completed</span>
                        <span className="text-sm text-gray-500">({trend.averageScore.toFixed(1)} avg score)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

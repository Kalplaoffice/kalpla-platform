import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_PEER_REVIEW,
  UPDATE_PEER_REVIEW,
  DELETE_PEER_REVIEW,
  CREATE_REVIEW_CRITERIA,
  UPDATE_REVIEW_CRITERIA,
  DELETE_REVIEW_CRITERIA,
  CREATE_REVIEW_RUBRIC,
  UPDATE_REVIEW_RUBRIC,
  DELETE_REVIEW_RUBRIC,
  CREATE_REVIEW_ASSIGNMENT,
  UPDATE_REVIEW_ASSIGNMENT,
  DELETE_REVIEW_ASSIGNMENT,
  CREATE_REVIEW_FEEDBACK,
  UPDATE_REVIEW_FEEDBACK,
  DELETE_REVIEW_FEEDBACK
} from '../graphql/mutations';
import {
  GET_PEER_REVIEWS,
  GET_REVIEW_CRITERIA,
  GET_REVIEW_RUBRICS,
  GET_REVIEW_ASSIGNMENTS,
  GET_REVIEW_FEEDBACK,
  GET_REVIEW_STATS,
  GET_REVIEW_MATCHES,
  SEARCH_PEER_REVIEWS
} from '../graphql/queries';

const client = generateClient();

export interface PeerReview {
  id: string;
  assignmentId: string;
  assignmentName: string;
  courseId: string;
  courseName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  revieweeAvatar?: string;
  status: ReviewStatus;
  rubricId: string;
  rubricName: string;
  criteria: ReviewCriteria[];
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  isAnonymous: boolean;
  isBlind: boolean;
  dueDate: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewStatus = 
  | 'assigned' 
  | 'in_progress' 
  | 'submitted' 
  | 'completed' 
  | 'overdue' 
  | 'cancelled';

export interface ReviewCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
  score?: number;
  feedback?: string;
  examples?: string[];
}

export interface ReviewRubric {
  id: string;
  name: string;
  description: string;
  courseId: string;
  courseName: string;
  criteria: ReviewCriteria[];
  totalWeight: number;
  maxScore: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAssignment {
  id: string;
  assignmentId: string;
  assignmentName: string;
  courseId: string;
  courseName: string;
  rubricId: string;
  rubricName: string;
  reviewType: ReviewType;
  matchingStrategy: MatchingStrategy;
  reviewCount: number;
  dueDate: string;
  isActive: boolean;
  participants: string[];
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReviewType = 
  | 'peer_review' 
  | 'self_review' 
  | 'instructor_review' 
  | 'group_review';

export type MatchingStrategy = 
  | 'random' 
  | 'skill_based' 
  | 'performance_based' 
  | 'preference_based' 
  | 'instructor_assigned';

export interface ReviewFeedback {
  id: string;
  reviewId: string;
  revieweeId: string;
  revieweeName: string;
  feedbackType: FeedbackType;
  content: string;
  isHelpful: boolean;
  isConstructive: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export type FeedbackType = 
  | 'positive' 
  | 'constructive' 
  | 'suggestion' 
  | 'question' 
  | 'clarification';

export interface ReviewMatch {
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  assignmentId: string;
  assignmentName: string;
  compatibilityScore: number;
  matchReason: string;
}

export interface ReviewStats {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  averageScore: number;
  averageCompletionTime: number;
  reviewQualityScore: number;
  participationRate: number;
  reviewsByStatus: { [key: string]: number };
  reviewsByCriteria: { [key: string]: number };
  topReviewers: Array<{
    userId: string;
    userName: string;
    reviewCount: number;
    averageScore: number;
    qualityScore: number;
  }>;
  reviewTrends: Array<{
    date: string;
    reviewsCompleted: number;
    averageScore: number;
  }>;
}

class PeerReviewService {
  /**
   * Create peer review
   */
  async createPeerReview(review: Omit<PeerReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<PeerReview> {
    try {
      const result = await client.graphql({
        query: CREATE_PEER_REVIEW,
        variables: {
          input: {
            ...review,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createPeerReview;
    } catch (error) {
      console.error('Error creating peer review:', error);
      throw new Error('Failed to create peer review');
    }
  }

  /**
   * Get peer reviews
   */
  async getPeerReviews(filters?: {
    assignmentId?: string;
    courseId?: string;
    reviewerId?: string;
    revieweeId?: string;
    status?: ReviewStatus;
    rubricId?: string;
    limit?: number;
    offset?: number;
  }): Promise<PeerReview[]> {
    try {
      const result = await client.graphql({
        query: GET_PEER_REVIEWS,
        variables: filters
      });

      return result.data.getPeerReviews || [];
    } catch (error) {
      console.error('Error getting peer reviews:', error);
      return [];
    }
  }

  /**
   * Update peer review
   */
  async updatePeerReview(id: string, updates: Partial<PeerReview>): Promise<PeerReview> {
    try {
      const result = await client.graphql({
        query: UPDATE_PEER_REVIEW,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updatePeerReview;
    } catch (error) {
      console.error('Error updating peer review:', error);
      throw new Error('Failed to update peer review');
    }
  }

  /**
   * Delete peer review
   */
  async deletePeerReview(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_PEER_REVIEW,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting peer review:', error);
      return false;
    }
  }

  /**
   * Submit peer review
   */
  async submitPeerReview(id: string, reviewData: {
    criteria: ReviewCriteria[];
    overallScore: number;
    overallFeedback: string;
    strengths: string[];
    improvements: string[];
  }): Promise<PeerReview> {
    try {
      const overallScore = this.calculateOverallScore(reviewData.criteria);
      
      return await this.updatePeerReview(id, {
        ...reviewData,
        overallScore,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting peer review:', error);
      throw new Error('Failed to submit peer review');
    }
  }

  /**
   * Create review rubric
   */
  async createReviewRubric(rubric: Omit<ReviewRubric, 'id' | 'totalWeight' | 'maxScore' | 'createdAt' | 'updatedAt'>): Promise<ReviewRubric> {
    try {
      const totalWeight = rubric.criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
      const maxScore = rubric.criteria.reduce((sum, criteria) => sum + criteria.maxScore, 0);

      const result = await client.graphql({
        query: CREATE_REVIEW_RUBRIC,
        variables: {
          input: {
            ...rubric,
            totalWeight,
            maxScore,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReviewRubric;
    } catch (error) {
      console.error('Error creating review rubric:', error);
      throw new Error('Failed to create review rubric');
    }
  }

  /**
   * Get review rubrics
   */
  async getReviewRubrics(filters?: {
    courseId?: string;
    isActive?: boolean;
    createdBy?: string;
  }): Promise<ReviewRubric[]> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_RUBRICS,
        variables: filters
      });

      return result.data.getReviewRubrics || [];
    } catch (error) {
      console.error('Error getting review rubrics:', error);
      return [];
    }
  }

  /**
   * Update review rubric
   */
  async updateReviewRubric(id: string, updates: Partial<ReviewRubric>): Promise<ReviewRubric> {
    try {
      const rubric = await this.getReviewRubric(id);
      if (!rubric) throw new Error('Rubric not found');

      const updatedCriteria = updates.criteria || rubric.criteria;
      const totalWeight = updatedCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);
      const maxScore = updatedCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0);

      const result = await client.graphql({
        query: UPDATE_REVIEW_RUBRIC,
        variables: {
          input: {
            id,
            ...updates,
            totalWeight,
            maxScore,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateReviewRubric;
    } catch (error) {
      console.error('Error updating review rubric:', error);
      throw new Error('Failed to update review rubric');
    }
  }

  /**
   * Delete review rubric
   */
  async deleteReviewRubric(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_REVIEW_RUBRIC,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting review rubric:', error);
      return false;
    }
  }

  /**
   * Get single review rubric
   */
  async getReviewRubric(id: string): Promise<ReviewRubric | null> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_RUBRICS,
        variables: { id }
      });

      return result.data.getReviewRubrics?.[0] || null;
    } catch (error) {
      console.error('Error getting review rubric:', error);
      return null;
    }
  }

  /**
   * Create review assignment
   */
  async createReviewAssignment(assignment: Omit<ReviewAssignment, 'id' | 'reviews' | 'createdAt' | 'updatedAt'>): Promise<ReviewAssignment> {
    try {
      const result = await client.graphql({
        query: CREATE_REVIEW_ASSIGNMENT,
        variables: {
          input: {
            ...assignment,
            reviews: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReviewAssignment;
    } catch (error) {
      console.error('Error creating review assignment:', error);
      throw new Error('Failed to create review assignment');
    }
  }

  /**
   * Get review assignments
   */
  async getReviewAssignments(filters?: {
    assignmentId?: string;
    courseId?: string;
    isActive?: boolean;
  }): Promise<ReviewAssignment[]> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_ASSIGNMENTS,
        variables: filters
      });

      return result.data.getReviewAssignments || [];
    } catch (error) {
      console.error('Error getting review assignments:', error);
      return [];
    }
  }

  /**
   * Update review assignment
   */
  async updateReviewAssignment(id: string, updates: Partial<ReviewAssignment>): Promise<ReviewAssignment> {
    try {
      const result = await client.graphql({
        query: UPDATE_REVIEW_ASSIGNMENT,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateReviewAssignment;
    } catch (error) {
      console.error('Error updating review assignment:', error);
      throw new Error('Failed to update review assignment');
    }
  }

  /**
   * Delete review assignment
   */
  async deleteReviewAssignment(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_REVIEW_ASSIGNMENT,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting review assignment:', error);
      return false;
    }
  }

  /**
   * Generate review matches
   */
  async generateReviewMatches(assignmentId: string, strategy: MatchingStrategy): Promise<ReviewMatch[]> {
    try {
      const assignment = await this.getReviewAssignment(assignmentId);
      if (!assignment) throw new Error('Review assignment not found');

      const participants = assignment.participants;
      const reviewCount = assignment.reviewCount;

      let matches: ReviewMatch[] = [];

      switch (strategy) {
        case 'random':
          matches = this.generateRandomMatches(participants, reviewCount);
          break;
        case 'skill_based':
          matches = await this.generateSkillBasedMatches(participants, reviewCount, assignmentId);
          break;
        case 'performance_based':
          matches = await this.generatePerformanceBasedMatches(participants, reviewCount, assignmentId);
          break;
        case 'preference_based':
          matches = await this.generatePreferenceBasedMatches(participants, reviewCount, assignmentId);
          break;
        case 'instructor_assigned':
          matches = await this.generateInstructorAssignedMatches(participants, reviewCount, assignmentId);
          break;
        default:
          matches = this.generateRandomMatches(participants, reviewCount);
      }

      return matches;
    } catch (error) {
      console.error('Error generating review matches:', error);
      throw new Error('Failed to generate review matches');
    }
  }

  /**
   * Generate random matches
   */
  private generateRandomMatches(participants: string[], reviewCount: number): ReviewMatch[] {
    const matches: ReviewMatch[] = [];
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledParticipants.length; i++) {
      const reviewerId = shuffledParticipants[i];
      const reviewerName = `Student ${i + 1}`; // In real implementation, get from user service

      for (let j = 0; j < reviewCount; j++) {
        const revieweeIndex = (i + j + 1) % shuffledParticipants.length;
        const revieweeId = shuffledParticipants[revieweeIndex];
        const revieweeName = `Student ${revieweeIndex + 1}`;

        matches.push({
          reviewerId,
          reviewerName,
          revieweeId,
          revieweeName,
          assignmentId: '',
          assignmentName: '',
          compatibilityScore: Math.random(),
          matchReason: 'Random assignment'
        });
      }
    }

    return matches;
  }

  /**
   * Generate skill-based matches
   */
  private async generateSkillBasedMatches(participants: string[], reviewCount: number, assignmentId: string): Promise<ReviewMatch[]> {
    // In a real implementation, this would analyze student skills and match accordingly
    const matches: ReviewMatch[] = [];

    for (const reviewerId of participants) {
      const reviewerName = `Student ${participants.indexOf(reviewerId) + 1}`;
      
      for (let i = 0; i < reviewCount; i++) {
        const revieweeIndex = (participants.indexOf(reviewerId) + i + 1) % participants.length;
        const revieweeId = participants[revieweeIndex];
        const revieweeName = `Student ${revieweeIndex + 1}`;

        matches.push({
          reviewerId,
          reviewerName,
          revieweeId,
          revieweeName,
          assignmentId,
          assignmentName: '',
          compatibilityScore: 0.8 + Math.random() * 0.2,
          matchReason: 'Skill-based matching'
        });
      }
    }

    return matches;
  }

  /**
   * Generate performance-based matches
   */
  private async generatePerformanceBasedMatches(participants: string[], reviewCount: number, assignmentId: string): Promise<ReviewMatch[]> {
    // In a real implementation, this would analyze student performance and match accordingly
    const matches: ReviewMatch[] = [];

    for (const reviewerId of participants) {
      const reviewerName = `Student ${participants.indexOf(reviewerId) + 1}`;
      
      for (let i = 0; i < reviewCount; i++) {
        const revieweeIndex = (participants.indexOf(reviewerId) + i + 1) % participants.length;
        const revieweeId = participants[revieweeIndex];
        const revieweeName = `Student ${revieweeIndex + 1}`;

        matches.push({
          reviewerId,
          reviewerName,
          revieweeId,
          revieweeName,
          assignmentId,
          assignmentName: '',
          compatibilityScore: 0.7 + Math.random() * 0.3,
          matchReason: 'Performance-based matching'
        });
      }
    }

    return matches;
  }

  /**
   * Generate preference-based matches
   */
  private async generatePreferenceBasedMatches(participants: string[], reviewCount: number, assignmentId: string): Promise<ReviewMatch[]> {
    // In a real implementation, this would consider student preferences
    const matches: ReviewMatch[] = [];

    for (const reviewerId of participants) {
      const reviewerName = `Student ${participants.indexOf(reviewerId) + 1}`;
      
      for (let i = 0; i < reviewCount; i++) {
        const revieweeIndex = (participants.indexOf(reviewerId) + i + 1) % participants.length;
        const revieweeId = participants[revieweeIndex];
        const revieweeName = `Student ${revieweeIndex + 1}`;

        matches.push({
          reviewerId,
          reviewerName,
          revieweeId,
          revieweeName,
          assignmentId,
          assignmentName: '',
          compatibilityScore: 0.9 + Math.random() * 0.1,
          matchReason: 'Preference-based matching'
        });
      }
    }

    return matches;
  }

  /**
   * Generate instructor-assigned matches
   */
  private async generateInstructorAssignedMatches(participants: string[], reviewCount: number, assignmentId: string): Promise<ReviewMatch[]> {
    // In a real implementation, this would use instructor-assigned matches
    const matches: ReviewMatch[] = [];

    for (const reviewerId of participants) {
      const reviewerName = `Student ${participants.indexOf(reviewerId) + 1}`;
      
      for (let i = 0; i < reviewCount; i++) {
        const revieweeIndex = (participants.indexOf(reviewerId) + i + 1) % participants.length;
        const revieweeId = participants[revieweeIndex];
        const revieweeName = `Student ${revieweeIndex + 1}`;

        matches.push({
          reviewerId,
          reviewerName,
          revieweeId,
          revieweeName,
          assignmentId,
          assignmentName: '',
          compatibilityScore: 1.0,
          matchReason: 'Instructor assigned'
        });
      }
    }

    return matches;
  }

  /**
   * Get single review assignment
   */
  async getReviewAssignment(id: string): Promise<ReviewAssignment | null> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_ASSIGNMENTS,
        variables: { id }
      });

      return result.data.getReviewAssignments?.[0] || null;
    } catch (error) {
      console.error('Error getting review assignment:', error);
      return null;
    }
  }

  /**
   * Create review feedback
   */
  async createReviewFeedback(feedback: Omit<ReviewFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReviewFeedback> {
    try {
      const result = await client.graphql({
        query: CREATE_REVIEW_FEEDBACK,
        variables: {
          input: {
            ...feedback,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReviewFeedback;
    } catch (error) {
      console.error('Error creating review feedback:', error);
      throw new Error('Failed to create review feedback');
    }
  }

  /**
   * Get review feedback
   */
  async getReviewFeedback(filters?: {
    reviewId?: string;
    revieweeId?: string;
    feedbackType?: FeedbackType;
    isHelpful?: boolean;
    isConstructive?: boolean;
  }): Promise<ReviewFeedback[]> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_FEEDBACK,
        variables: filters
      });

      return result.data.getReviewFeedback || [];
    } catch (error) {
      console.error('Error getting review feedback:', error);
      return [];
    }
  }

  /**
   * Update review feedback
   */
  async updateReviewFeedback(id: string, updates: Partial<ReviewFeedback>): Promise<ReviewFeedback> {
    try {
      const result = await client.graphql({
        query: UPDATE_REVIEW_FEEDBACK,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateReviewFeedback;
    } catch (error) {
      console.error('Error updating review feedback:', error);
      throw new Error('Failed to update review feedback');
    }
  }

  /**
   * Delete review feedback
   */
  async deleteReviewFeedback(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_REVIEW_FEEDBACK,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting review feedback:', error);
      return false;
    }
  }

  /**
   * Get review statistics
   */
  async getReviewStats(filters?: {
    assignmentId?: string;
    courseId?: string;
    reviewerId?: string;
    revieweeId?: string;
  }): Promise<ReviewStats> {
    try {
      const result = await client.graphql({
        query: GET_REVIEW_STATS,
        variables: filters
      });

      return result.data.getReviewStats;
    } catch (error) {
      console.error('Error getting review stats:', error);
      return {
        totalReviews: 0,
        completedReviews: 0,
        pendingReviews: 0,
        overdueReviews: 0,
        averageScore: 0,
        averageCompletionTime: 0,
        reviewQualityScore: 0,
        participationRate: 0,
        reviewsByStatus: {},
        reviewsByCriteria: {},
        topReviewers: [],
        reviewTrends: []
      };
    }
  }

  /**
   * Search peer reviews
   */
  async searchPeerReviews(query: string, filters?: {
    assignmentId?: string;
    courseId?: string;
    reviewerId?: string;
    revieweeId?: string;
  }): Promise<PeerReview[]> {
    try {
      const reviews = await this.getPeerReviews(filters);
      
      return reviews.filter(review => 
        review.assignmentName.toLowerCase().includes(query.toLowerCase()) ||
        review.overallFeedback.toLowerCase().includes(query.toLowerCase()) ||
        review.strengths.some(strength => strength.toLowerCase().includes(query.toLowerCase())) ||
        review.improvements.some(improvement => improvement.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching peer reviews:', error);
      return [];
    }
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(criteria: ReviewCriteria[]): number {
    if (criteria.length === 0) return 0;

    const totalWeight = criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
    if (totalWeight === 0) return 0;

    const weightedScore = criteria.reduce((sum, criteria) => {
      const score = criteria.score || 0;
      return sum + (score * criteria.weight);
    }, 0);

    return Math.round((weightedScore / totalWeight) * 100) / 100;
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format relative time
   */
  formatRelativeTime(date: string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(date);
    }
  }

  /**
   * Get review status color
   */
  getReviewStatusColor(status: ReviewStatus): string {
    switch (status) {
      case 'assigned':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'submitted':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get feedback type color
   */
  getFeedbackTypeColor(type: FeedbackType): string {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'constructive':
        return 'text-blue-600 bg-blue-100';
      case 'suggestion':
        return 'text-yellow-600 bg-yellow-100';
      case 'question':
        return 'text-purple-600 bg-purple-100';
      case 'clarification':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get score color
   */
  getScoreColor(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) {
      return 'text-green-600 bg-green-100';
    } else if (percentage >= 80) {
      return 'text-blue-600 bg-blue-100';
    } else if (percentage >= 70) {
      return 'text-yellow-600 bg-yellow-100';
    } else if (percentage >= 60) {
      return 'text-orange-600 bg-orange-100';
    } else {
      return 'text-red-600 bg-red-100';
    }
  }
}

export const peerReviewService = new PeerReviewService();

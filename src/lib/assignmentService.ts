import { generateClient } from 'aws-amplify/api';
import { 
  SUBMIT_ASSIGNMENT, 
  GRADE_ASSIGNMENT 
} from '../graphql/mutations';
import { 
  GET_ASSIGNMENTS_BY_COURSE, 
  GET_SUBMISSIONS_BY_USER, 
  GET_SUBMISSIONS_BY_ASSIGNMENT, 
  GET_PENDING_SUBMISSIONS 
} from '../graphql/queries';

const client = generateClient();

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: string;
  maxPoints: number;
  submissionTypes: ('TEXT' | 'FILE' | 'LINK')[];
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  textSubmission?: string;
  fileSubmission?: string;
  linkSubmission?: string;
  status: 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED' | 'RETURNED';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmissionData {
  assignmentId: string;
  textSubmission?: string;
  fileSubmission?: string;
  linkSubmission?: string;
}

export interface GradeAssignmentData {
  submissionId: string;
  grade: number;
  feedback: string;
}

export const assignmentService = {
  /**
   * Submit an assignment
   */
  async submitAssignment(submissionData: AssignmentSubmissionData): Promise<AssignmentSubmission> {
    try {
      const result = await client.graphql({
        query: SUBMIT_ASSIGNMENT,
        variables: { 
          assignmentId: submissionData.assignmentId,
          input: {
            textSubmission: submissionData.textSubmission,
            fileSubmission: submissionData.fileSubmission,
            linkSubmission: submissionData.linkSubmission
          }
        }
      });
      return result.data.submitAssignment;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  },

  /**
   * Grade an assignment submission
   */
  async gradeAssignment(gradeData: GradeAssignmentData): Promise<AssignmentSubmission> {
    try {
      const result = await client.graphql({
        query: GRADE_ASSIGNMENT,
        variables: { 
          submissionId: gradeData.submissionId,
          grade: gradeData.grade,
          feedback: gradeData.feedback
        }
      });
      return result.data.gradeAssignment;
    } catch (error) {
      console.error('Error grading assignment:', error);
      throw error;
    }
  },

  /**
   * Get assignments for a specific course
   */
  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    try {
      const result = await client.graphql({
        query: GET_ASSIGNMENTS_BY_COURSE,
        variables: { courseId }
      });
      return result.data.getAssignmentsByCourse.items || [];
    } catch (error) {
      console.error('Error fetching assignments by course:', error);
      throw error;
    }
  },

  /**
   * Get submissions by a specific user
   */
  async getSubmissionsByUser(userId: string): Promise<AssignmentSubmission[]> {
    try {
      const result = await client.graphql({
        query: GET_SUBMISSIONS_BY_USER,
        variables: { userId }
      });
      return result.data.getSubmissionsByUser.items || [];
    } catch (error) {
      console.error('Error fetching submissions by user:', error);
      throw error;
    }
  },

  /**
   * Get submissions for a specific assignment
   */
  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    try {
      const result = await client.graphql({
        query: GET_SUBMISSIONS_BY_ASSIGNMENT,
        variables: { assignmentId }
      });
      return result.data.getSubmissionsByAssignment.items || [];
    } catch (error) {
      console.error('Error fetching submissions by assignment:', error);
      throw error;
    }
  },

  /**
   * Get pending submissions for a mentor
   */
  async getPendingSubmissions(mentorId: string): Promise<AssignmentSubmission[]> {
    try {
      const result = await client.graphql({
        query: GET_PENDING_SUBMISSIONS,
        variables: { mentorId }
      });
      return result.data.getPendingSubmissions.items || [];
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
      throw error;
    }
  },

  /**
   * Check if assignment is overdue
   */
  isAssignmentOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    const now = new Date();
    return now > due;
  },

  /**
   * Get days until due date
   */
  getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Format due date for display
   */
  formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    const daysUntilDue = this.getDaysUntilDue(dueDate);
    
    if (daysUntilDue < 0) {
      return `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) > 1 ? 's' : ''}`;
    } else if (daysUntilDue === 0) {
      return 'Due today';
    } else if (daysUntilDue === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${daysUntilDue} days`;
    }
  },

  /**
   * Get submission status color
   */
  getSubmissionStatusColor(status: string): string {
    switch (status) {
      case 'NOT_SUBMITTED':
        return 'text-red-600';
      case 'SUBMITTED':
        return 'text-yellow-600';
      case 'GRADED':
        return 'text-green-600';
      case 'RETURNED':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  },

  /**
   * Calculate grade percentage
   */
  calculateGradePercentage(grade: number, maxPoints: number): number {
    return Math.round((grade / maxPoints) * 100);
  },

  /**
   * Get grade letter
   */
  getGradeLetter(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
};

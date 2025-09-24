import { cohortService, Cohort, CohortStudent } from './cohortService';

export interface MentorAssignment {
  id: string;
  mentorId: string;
  mentorName: string;
  cohortId: string;
  cohortName: string;
  phaseId: string;
  phaseName: string;
  title: string;
  description: string;
  instructions: string;
  type: 'homework' | 'project' | 'quiz' | 'presentation' | 'research' | 'lab' | 'essay';
  totalMarks: number;
  dueDate: string;
  lateSubmissionPenalty: number;
  maxLateDays: number;
  status: 'draft' | 'published' | 'closed' | 'graded';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  attachments: AssignmentAttachment[];
  rubric: AssignmentRubric;
  submissions: AssignmentSubmission[];
  statistics: AssignmentStatistics;
  settings: AssignmentSettings;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  originalName: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: number;
  url: string;
  uploadedAt: string;
  description?: string;
}

export interface AssignmentRubric {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriteria[];
  totalPoints: number;
  gradingScale: {
    excellent: { min: number; max: number; description: string };
    good: { min: number; max: number; description: string };
    satisfactory: { min: number; max: number; description: string };
    needsImprovement: { min: number; max: number; description: string };
    unsatisfactory: { min: number; max: number; description: string };
  };
}

export interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
  levels: {
    excellent: { points: number; description: string };
    good: { points: number; description: string };
    satisfactory: { points: number; description: string };
    needsImprovement: { points: number; description: string };
    unsatisfactory: { points: number; description: string };
  };
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  content: string;
  attachments: SubmissionAttachment[];
  status: 'submitted' | 'graded' | 'returned' | 'late';
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  lateDays?: number;
  penaltyApplied?: number;
}

export interface SubmissionAttachment {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface AssignmentStatistics {
  totalStudents: number;
  submittedStudents: number;
  gradedStudents: number;
  lateSubmissions: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  gradeDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  submissionTrends: {
    date: string;
    submissions: number;
  }[];
}

export interface AssignmentSettings {
  allowLateSubmissions: boolean;
  allowResubmission: boolean;
  maxResubmissions: number;
  plagiarismCheck: boolean;
  peerReview: boolean;
  anonymousGrading: boolean;
  showGradesImmediately: boolean;
  allowStudentComments: boolean;
  requireAcknowledgement: boolean;
  notificationSettings: {
    emailReminders: boolean;
    smsReminders: boolean;
    pushNotifications: boolean;
    reminderDays: number[];
  };
}

class MentorAssignmentService {
  private assignments: MentorAssignment[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.assignments = [
      {
        id: 'assign_1',
        mentorId: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        cohortId: 'cohort_1',
        cohortName: 'KSMP Spring 2024',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        title: 'Data Structures Implementation Project',
        description: 'Implement and analyze various data structures including arrays, linked lists, stacks, queues, and binary trees.',
        instructions: 'Implement all required data structures with comprehensive testing and documentation.',
        type: 'project',
        totalMarks: 100,
        dueDate: '2024-02-28T23:59:00Z',
        lateSubmissionPenalty: 10,
        maxLateDays: 3,
        status: 'published',
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z',
        publishedAt: '2024-02-15T10:30:00Z',
        attachments: [
          {
            id: 'att_1',
            name: 'assignment_requirements.pdf',
            originalName: 'Data Structures Assignment Requirements.pdf',
            type: 'document',
            size: 1024000,
            url: '/assignments/data-structures-requirements.pdf',
            uploadedAt: '2024-02-15T10:15:00Z',
            description: 'Detailed requirements and specifications'
          }
        ],
        rubric: {
          id: 'rubric_1',
          name: 'Data Structures Project Rubric',
          description: 'Comprehensive rubric for data structures implementation project',
          criteria: [
            {
              id: 'crit_1',
              name: 'Code Quality',
              description: 'Code structure, readability, and best practices',
              maxPoints: 25,
              weight: 0.25,
              levels: {
                excellent: { points: 25, description: 'Clean, well-structured code with excellent documentation' },
                good: { points: 20, description: 'Good code structure with adequate documentation' },
                satisfactory: { points: 15, description: 'Acceptable code structure with basic documentation' },
                needsImprovement: { points: 10, description: 'Poor code structure with minimal documentation' },
                unsatisfactory: { points: 5, description: 'Very poor code structure with no documentation' }
              }
            }
          ],
          totalPoints: 100,
          gradingScale: {
            excellent: { min: 90, max: 100, description: 'Outstanding work that exceeds expectations' },
            good: { min: 80, max: 89, description: 'Good work that meets expectations' },
            satisfactory: { min: 70, max: 79, description: 'Satisfactory work that meets basic requirements' },
            needsImprovement: { min: 60, max: 69, description: 'Work that needs improvement' },
            unsatisfactory: { min: 0, max: 59, description: 'Work that does not meet requirements' }
          }
        },
        submissions: [],
        statistics: {
          totalStudents: 25,
          submittedStudents: 22,
          gradedStudents: 20,
          lateSubmissions: 3,
          averageGrade: 85.5,
          highestGrade: 98,
          lowestGrade: 72,
          gradeDistribution: [
            { range: '90-100', count: 8, percentage: 40 },
            { range: '80-89', count: 7, percentage: 35 },
            { range: '70-79', count: 4, percentage: 20 },
            { range: '60-69', count: 1, percentage: 5 },
            { range: '0-59', count: 0, percentage: 0 }
          ],
          submissionTrends: [
            { date: '2024-02-25', submissions: 5 },
            { date: '2024-02-26', submissions: 8 },
            { date: '2024-02-27', submissions: 6 },
            { date: '2024-02-28', submissions: 3 }
          ]
        },
        settings: {
          allowLateSubmissions: true,
          allowResubmission: false,
          maxResubmissions: 0,
          plagiarismCheck: true,
          peerReview: false,
          anonymousGrading: false,
          showGradesImmediately: true,
          allowStudentComments: true,
          requireAcknowledgement: true,
          notificationSettings: {
            emailReminders: true,
            smsReminders: false,
            pushNotifications: true,
            reminderDays: [7, 3, 1]
          }
        }
      }
    ];
  }

  async getMentorAssignments(mentorId: string): Promise<MentorAssignment[]> {
    try {
      return this.assignments.filter(a => a.mentorId === mentorId);
    } catch (error) {
      console.error('Error fetching mentor assignments:', error);
      return [];
    }
  }

  async getAssignment(assignmentId: string): Promise<MentorAssignment | null> {
    try {
      return this.assignments.find(a => a.id === assignmentId) || null;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return null;
    }
  }

  async createAssignment(assignmentData: Omit<MentorAssignment, 'id' | 'createdAt' | 'updatedAt' | 'submissions' | 'statistics'>): Promise<MentorAssignment> {
    try {
      const newAssignment: MentorAssignment = {
        ...assignmentData,
        id: `assign_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissions: [],
        statistics: {
          totalStudents: 0,
          submittedStudents: 0,
          gradedStudents: 0,
          lateSubmissions: 0,
          averageGrade: 0,
          highestGrade: 0,
          lowestGrade: 0,
          gradeDistribution: [],
          submissionTrends: []
        }
      };
      
      this.assignments.push(newAssignment);
      return newAssignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  async updateAssignment(assignmentId: string, updates: Partial<MentorAssignment>): Promise<MentorAssignment | null> {
    try {
      const index = this.assignments.findIndex(a => a.id === assignmentId);
      if (index === -1) return null;
      
      this.assignments[index] = {
        ...this.assignments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return this.assignments[index];
    } catch (error) {
      console.error('Error updating assignment:', error);
      return null;
    }
  }

  async deleteAssignment(assignmentId: string): Promise<boolean> {
    try {
      const index = this.assignments.findIndex(a => a.id === assignmentId);
      if (index === -1) return false;
      
      this.assignments.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      return false;
    }
  }

  async publishAssignment(assignmentId: string): Promise<boolean> {
    try {
      const assignment = this.assignments.find(a => a.id === assignmentId);
      if (!assignment) return false;
      
      assignment.status = 'published';
      assignment.publishedAt = new Date().toISOString();
      assignment.updatedAt = new Date().toISOString();
      
      return true;
    } catch (error) {
      console.error('Error publishing assignment:', error);
      return false;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'graded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAssignmentTypeColor(type: string): string {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'presentation':
        return 'bg-yellow-100 text-yellow-800';
      case 'research':
        return 'bg-indigo-100 text-indigo-800';
      case 'lab':
        return 'bg-red-100 text-red-800';
      case 'essay':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const mentorAssignmentService = new MentorAssignmentService();
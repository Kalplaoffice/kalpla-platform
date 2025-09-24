import { mentorAssignmentService, MentorAssignment } from './mentorAssignmentService';

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  content: string;
  attachments: SubmissionAttachment[];
  status: 'submitted' | 'graded' | 'returned' | 'late' | 'draft';
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  lateDays?: number;
  penaltyApplied?: number;
  resubmissionCount: number;
  maxResubmissions: number;
  acknowledgements: SubmissionAcknowledgement[];
  comments: SubmissionComment[];
}

export interface SubmissionAttachment {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  s3Key: string;
  uploadedAt: string;
  description?: string;
}

export interface SubmissionAcknowledgement {
  id: string;
  studentId: string;
  acknowledgedAt: string;
  content: string;
}

export interface SubmissionComment {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'student' | 'mentor';
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface SubmissionUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface SubmissionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class StudentSubmissionService {
  private submissions: StudentSubmission[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.submissions = [
      {
        id: 'sub_1',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        submittedAt: '2024-02-27T18:30:00Z',
        content: 'I have implemented all required data structures with comprehensive testing and documentation. The code includes dynamic arrays, linked lists, stacks, queues, and binary trees with all specified operations. I have also included unit tests with 85% coverage and a detailed performance analysis report.',
        attachments: [
          {
            id: 'sub_att_1',
            name: 'data_structures_project.zip',
            originalName: 'Data Structures Project - John Doe.zip',
            type: 'application/zip',
            size: 2048000,
            url: 'https://kalpla-submissions.s3.amazonaws.com/submissions/sub_1/data_structures_project.zip',
            s3Key: 'submissions/sub_1/data_structures_project.zip',
            uploadedAt: '2024-02-27T18:30:00Z',
            description: 'Complete project implementation with source code, tests, and documentation'
          },
          {
            id: 'sub_att_2',
            name: 'performance_analysis.pdf',
            originalName: 'Performance Analysis Report.pdf',
            type: 'application/pdf',
            size: 512000,
            url: 'https://kalpla-submissions.s3.amazonaws.com/submissions/sub_1/performance_analysis.pdf',
            s3Key: 'submissions/sub_1/performance_analysis.pdf',
            uploadedAt: '2024-02-27T18:32:00Z',
            description: 'Detailed performance analysis and complexity evaluation'
          }
        ],
        status: 'graded',
        grade: 92,
        feedback: 'Excellent implementation with clean code and comprehensive testing. The documentation is thorough and the analysis is well-presented. Minor suggestion: consider adding more edge case handling in the binary tree deletion.',
        gradedAt: '2024-02-28T14:00:00Z',
        gradedBy: 'mentor_1',
        resubmissionCount: 0,
        maxResubmissions: 0,
        acknowledgements: [
          {
            id: 'ack_1',
            studentId: 'student_1',
            acknowledgedAt: '2024-02-27T18:35:00Z',
            content: 'I acknowledge that this submission is my own work and I have not plagiarized any content.'
          }
        ],
        comments: [
          {
            id: 'comment_1',
            authorId: 'mentor_1',
            authorName: 'Dr. Sarah Johnson',
            authorType: 'mentor',
            content: 'Great work on the implementation! The code structure is excellent.',
            createdAt: '2024-02-28T14:05:00Z',
            isPrivate: false
          }
        ]
      },
      {
        id: 'sub_2',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@student.kalpla.edu',
        submittedAt: '2024-02-28T20:00:00Z',
        content: 'Completed the data structures implementation with unit tests and performance analysis. All required data structures have been implemented with proper error handling and documentation.',
        attachments: [
          {
            id: 'sub_att_3',
            name: 'data_structures_jane.zip',
            originalName: 'Data Structures - Jane Smith.zip',
            type: 'application/zip',
            size: 1536000,
            url: 'https://kalpla-submissions.s3.amazonaws.com/submissions/sub_2/data_structures_jane.zip',
            s3Key: 'submissions/sub_2/data_structures_jane.zip',
            uploadedAt: '2024-02-28T20:00:00Z',
            description: 'Project implementation with source code and tests'
          }
        ],
        status: 'graded',
        grade: 88,
        feedback: 'Good implementation with solid testing. The code structure is clean and the documentation is adequate. Consider improving the performance analysis section.',
        gradedAt: '2024-03-01T10:00:00Z',
        gradedBy: 'mentor_1',
        resubmissionCount: 0,
        maxResubmissions: 0,
        acknowledgements: [
          {
            id: 'ack_2',
            studentId: 'student_2',
            acknowledgedAt: '2024-02-28T20:05:00Z',
            content: 'I acknowledge that this submission is my own work and I have not plagiarized any content.'
          }
        ],
        comments: []
      },
      {
        id: 'sub_3',
        assignmentId: 'assign_2',
        assignmentTitle: 'Algorithm Analysis Quiz',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        submittedAt: '2024-03-05T13:45:00Z',
        content: 'Completed the algorithm analysis quiz. All questions answered with detailed explanations for short answer questions.',
        attachments: [],
        status: 'submitted',
        resubmissionCount: 0,
        maxResubmissions: 0,
        acknowledgements: [
          {
            id: 'ack_3',
            studentId: 'student_1',
            acknowledgedAt: '2024-03-05T13:50:00Z',
            content: 'I acknowledge that this quiz submission is my own work.'
          }
        ],
        comments: []
      }
    ];
  }

  /**
   * Get submissions for a student
   */
  async getStudentSubmissions(studentId: string): Promise<StudentSubmission[]> {
    try {
      return this.submissions.filter(s => s.studentId === studentId);
    } catch (error) {
      console.error('Error fetching student submissions:', error);
      return [];
    }
  }

  /**
   * Get submission by ID
   */
  async getSubmission(submissionId: string): Promise<StudentSubmission | null> {
    try {
      return this.submissions.find(s => s.id === submissionId) || null;
    } catch (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
  }

  /**
   * Get submissions for an assignment
   */
  async getAssignmentSubmissions(assignmentId: string): Promise<StudentSubmission[]> {
    try {
      return this.submissions.filter(s => s.assignmentId === assignmentId);
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
      return [];
    }
  }

  /**
   * Create new submission
   */
  async createSubmission(submissionData: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status' | 'resubmissionCount' | 'acknowledgements' | 'comments'>): Promise<StudentSubmission> {
    try {
      const assignment = await mentorAssignmentService.getAssignment(submissionData.assignmentId);
      if (!assignment) {
        throw new Error('Assignment not found');
      }

      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const isLate = now > dueDate;
      const lateDays = isLate ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      const newSubmission: StudentSubmission = {
        ...submissionData,
        id: `sub_${Date.now()}`,
        submittedAt: now.toISOString(),
        status: isLate ? 'late' : 'submitted',
        lateDays: isLate ? lateDays : undefined,
        penaltyApplied: isLate ? this.calculatePenalty(assignment.lateSubmissionPenalty, lateDays) : undefined,
        resubmissionCount: 0,
        acknowledgements: [],
        comments: []
      };

      this.submissions.push(newSubmission);
      return newSubmission;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  }

  /**
   * Update submission
   */
  async updateSubmission(submissionId: string, updates: Partial<StudentSubmission>): Promise<StudentSubmission | null> {
    try {
      const index = this.submissions.findIndex(s => s.id === submissionId);
      if (index === -1) return null;

      this.submissions[index] = {
        ...this.submissions[index],
        ...updates
      };

      return this.submissions[index];
    } catch (error) {
      console.error('Error updating submission:', error);
      return null;
    }
  }

  /**
   * Delete submission
   */
  async deleteSubmission(submissionId: string): Promise<boolean> {
    try {
      const index = this.submissions.findIndex(s => s.id === submissionId);
      if (index === -1) return false;

      this.submissions.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
    }
  }

  /**
   * Upload file to S3
   */
  async uploadFileToS3(
    file: File,
    submissionId: string,
    description?: string
  ): Promise<SubmissionAttachment | null> {
    try {
      // In a real implementation, this would upload to S3
      // For now, we'll simulate the upload process
      const s3Key = `submissions/${submissionId}/${file.name}`;
      const s3Url = `https://kalpla-submissions.s3.amazonaws.com/${s3Key}`;

      const attachment: SubmissionAttachment = {
        id: `att_${Date.now()}`,
        name: file.name,
        originalName: file.name,
        type: file.type,
        size: file.size,
        url: s3Url,
        s3Key: s3Key,
        uploadedAt: new Date().toISOString(),
        description
      };

      return attachment;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      return null;
    }
  }

  /**
   * Add attachment to submission
   */
  async addAttachmentToSubmission(
    submissionId: string,
    attachment: SubmissionAttachment
  ): Promise<boolean> {
    try {
      const submission = this.submissions.find(s => s.id === submissionId);
      if (!submission) return false;

      submission.attachments.push(attachment);
      return true;
    } catch (error) {
      console.error('Error adding attachment to submission:', error);
      return false;
    }
  }

  /**
   * Remove attachment from submission
   */
  async removeAttachmentFromSubmission(
    submissionId: string,
    attachmentId: string
  ): Promise<boolean> {
    try {
      const submission = this.submissions.find(s => s.id === submissionId);
      if (!submission) return false;

      const index = submission.attachments.findIndex(a => a.id === attachmentId);
      if (index === -1) return false;

      submission.attachments.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error removing attachment from submission:', error);
      return false;
    }
  }

  /**
   * Add acknowledgement to submission
   */
  async addAcknowledgement(
    submissionId: string,
    studentId: string,
    content: string
  ): Promise<boolean> {
    try {
      const submission = this.submissions.find(s => s.id === submissionId);
      if (!submission) return false;

      const acknowledgement: SubmissionAcknowledgement = {
        id: `ack_${Date.now()}`,
        studentId,
        acknowledgedAt: new Date().toISOString(),
        content
      };

      submission.acknowledgements.push(acknowledgement);
      return true;
    } catch (error) {
      console.error('Error adding acknowledgement:', error);
      return false;
    }
  }

  /**
   * Add comment to submission
   */
  async addComment(
    submissionId: string,
    authorId: string,
    authorName: string,
    authorType: 'student' | 'mentor',
    content: string,
    isPrivate: boolean = false
  ): Promise<boolean> {
    try {
      const submission = this.submissions.find(s => s.id === submissionId);
      if (!submission) return false;

      const comment: SubmissionComment = {
        id: `comment_${Date.now()}`,
        authorId,
        authorName,
        authorType,
        content,
        createdAt: new Date().toISOString(),
        isPrivate
      };

      submission.comments.push(comment);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }

  /**
   * Validate submission
   */
  async validateSubmission(
    assignmentId: string,
    content: string,
    attachments: File[]
  ): Promise<SubmissionValidation> {
    try {
      const assignment = await mentorAssignmentService.getAssignment(assignmentId);
      if (!assignment) {
        return {
          isValid: false,
          errors: ['Assignment not found'],
          warnings: []
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      // Validate content
      if (!content || content.trim().length < 10) {
        errors.push('Submission content must be at least 10 characters long');
      }

      // Validate attachments
      if (attachments.length === 0 && assignment.type === 'project') {
        warnings.push('Project assignments typically require file attachments');
      }

      // Validate file sizes
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      for (const file of attachments) {
        if (file.size > maxFileSize) {
          errors.push(`File ${file.name} exceeds maximum size of 10MB`);
        }
      }

      // Validate file types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-rar-compressed',
        'image/jpeg',
        'image/png',
        'text/plain'
      ];

      for (const file of attachments) {
        if (!allowedTypes.includes(file.type)) {
          errors.push(`File type ${file.type} is not allowed for ${file.name}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      console.error('Error validating submission:', error);
      return {
        isValid: false,
        errors: ['Validation error occurred'],
        warnings: []
      };
    }
  }

  /**
   * Calculate late penalty
   */
  private calculatePenalty(penaltyRate: number, lateDays: number): number {
    return Math.min(penaltyRate * lateDays, 100); // Cap at 100%
  }

  /**
   * Get submission statistics
   */
  async getSubmissionStatistics(studentId: string): Promise<{
    totalSubmissions: number;
    gradedSubmissions: number;
    averageGrade: number;
    lateSubmissions: number;
    pendingSubmissions: number;
  }> {
    try {
      const studentSubmissions = this.submissions.filter(s => s.studentId === studentId);
      
      const totalSubmissions = studentSubmissions.length;
      const gradedSubmissions = studentSubmissions.filter(s => s.grade !== undefined).length;
      const lateSubmissions = studentSubmissions.filter(s => s.status === 'late').length;
      const pendingSubmissions = studentSubmissions.filter(s => s.status === 'submitted').length;
      
      const grades = studentSubmissions
        .filter(s => s.grade !== undefined)
        .map(s => s.grade!);
      
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
        : 0;

      return {
        totalSubmissions,
        gradedSubmissions,
        averageGrade: Math.round(averageGrade * 100) / 100,
        lateSubmissions,
        pendingSubmissions
      };
    } catch (error) {
      console.error('Error calculating submission statistics:', error);
      return {
        totalSubmissions: 0,
        gradedSubmissions: 0,
        averageGrade: 0,
        lateSubmissions: 0,
        pendingSubmissions: 0
      };
    }
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format time
   */
  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get file type icon
   */
  getFileTypeIcon(type: string): string {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📎';
  }
}

export const studentSubmissionService = new StudentSubmissionService();

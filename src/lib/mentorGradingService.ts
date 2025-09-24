import { studentSubmissionService, StudentSubmission } from './studentSubmissionService';
import { mentorAssignmentService, MentorAssignment, AssignmentRubric } from './mentorAssignmentService';

export interface Grade {
  id: string;
  submissionId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  mentorId: string;
  mentorName: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  letterGrade: string;
  feedback: string;
  rubricScores: RubricScore[];
  gradedAt: string;
  gradedBy: string;
  status: 'graded' | 'returned' | 'needs_revision' | 'approved';
  latePenalty?: number;
  bonusPoints?: number;
  comments: GradeComment[];
  attachments: GradeAttachment[];
  isFinal: boolean;
  previousVersions: GradeVersion[];
}

export interface RubricScore {
  criteriaId: string;
  criteriaName: string;
  maxPoints: number;
  earnedPoints: number;
  feedback: string;
  level: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
}

export interface GradeComment {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'mentor' | 'student';
  content: string;
  createdAt: string;
  isPrivate: boolean;
  attachments: CommentAttachment[];
}

export interface GradeAttachment {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  description?: string;
}

export interface CommentAttachment {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface GradeVersion {
  id: string;
  grade: number;
  feedback: string;
  gradedAt: string;
  gradedBy: string;
  reason: string;
}

export interface GradebookEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentType: string;
  dueDate: string;
  submittedAt?: string;
  grade?: number;
  maxGrade: number;
  percentage?: number;
  letterGrade?: string;
  status: 'not_submitted' | 'submitted' | 'graded' | 'late' | 'missing';
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  lateDays?: number;
  penaltyApplied?: number;
}

export interface GradebookStatistics {
  totalAssignments: number;
  totalStudents: number;
  submittedAssignments: number;
  gradedAssignments: number;
  averageGrade: number;
  gradeDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  lateSubmissions: number;
  missingSubmissions: number;
  gradeTrends: {
    assignment: string;
    averageGrade: number;
    gradedCount: number;
  }[];
}

export interface GradingCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
  levels: {
    excellent: { points: number; description: string };
    good: { points: number; description: string };
    satisfactory: { points: number; description: string };
    needs_improvement: { points: number; description: string };
    unsatisfactory: { points: number; description: string };
  };
}

class MentorGradingService {
  private grades: Grade[] = [];
  private gradebookEntries: GradebookEntry[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock grades
    this.grades = [
      {
        id: 'grade_1',
        submissionId: 'sub_1',
        assignmentId: 'assign_1',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        mentorId: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        grade: 92,
        maxGrade: 100,
        percentage: 92,
        letterGrade: 'A',
        feedback: 'Excellent implementation with clean code and comprehensive testing. The documentation is thorough and the analysis is well-presented. Minor suggestion: consider adding more edge case handling in the binary tree deletion.',
        rubricScores: [
          {
            criteriaId: 'crit_1',
            criteriaName: 'Code Quality',
            maxPoints: 25,
            earnedPoints: 23,
            feedback: 'Clean, well-structured code with excellent documentation. Minor improvements could be made in error handling.',
            level: 'excellent'
          },
          {
            criteriaId: 'crit_2',
            criteriaName: 'Functionality',
            maxPoints: 40,
            earnedPoints: 38,
            feedback: 'All features implemented correctly with good edge case handling.',
            level: 'excellent'
          },
          {
            criteriaId: 'crit_3',
            criteriaName: 'Testing',
            maxPoints: 20,
            earnedPoints: 18,
            feedback: 'Good test coverage with comprehensive test cases.',
            level: 'good'
          },
          {
            criteriaId: 'crit_4',
            criteriaName: 'Documentation',
            maxPoints: 15,
            earnedPoints: 13,
            feedback: 'Excellent documentation with detailed analysis.',
            level: 'excellent'
          }
        ],
        gradedAt: '2024-02-28T14:00:00Z',
        gradedBy: 'mentor_1',
        status: 'graded',
        comments: [
          {
            id: 'comment_1',
            authorId: 'mentor_1',
            authorName: 'Dr. Sarah Johnson',
            authorType: 'mentor',
            content: 'Great work on the implementation! The code structure is excellent.',
            createdAt: '2024-02-28T14:05:00Z',
            isPrivate: false,
            attachments: []
          }
        ],
        attachments: [],
        isFinal: true,
        previousVersions: []
      },
      {
        id: 'grade_2',
        submissionId: 'sub_2',
        assignmentId: 'assign_1',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@student.kalpla.edu',
        mentorId: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        grade: 88,
        maxGrade: 100,
        percentage: 88,
        letterGrade: 'B+',
        feedback: 'Good implementation with solid testing. The code structure is clean and the documentation is adequate. Consider improving the performance analysis section.',
        rubricScores: [
          {
            criteriaId: 'crit_1',
            criteriaName: 'Code Quality',
            maxPoints: 25,
            earnedPoints: 20,
            feedback: 'Good code structure with adequate documentation.',
            level: 'good'
          },
          {
            criteriaId: 'crit_2',
            criteriaName: 'Functionality',
            maxPoints: 40,
            earnedPoints: 35,
            feedback: 'Most features implemented correctly with minor issues.',
            level: 'good'
          },
          {
            criteriaId: 'crit_3',
            criteriaName: 'Testing',
            maxPoints: 20,
            earnedPoints: 18,
            feedback: 'Good test coverage with adequate test cases.',
            level: 'good'
          },
          {
            criteriaId: 'crit_4',
            criteriaName: 'Documentation',
            maxPoints: 15,
            earnedPoints: 15,
            feedback: 'Good documentation with adequate analysis.',
            level: 'good'
          }
        ],
        gradedAt: '2024-03-01T10:00:00Z',
        gradedBy: 'mentor_1',
        status: 'graded',
        comments: [],
        attachments: [],
        isFinal: true,
        previousVersions: []
      }
    ];

    // Mock gradebook entries
    this.gradebookEntries = [
      {
        id: 'entry_1',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        assignmentType: 'project',
        dueDate: '2024-02-28T23:59:00Z',
        submittedAt: '2024-02-27T18:30:00Z',
        grade: 92,
        maxGrade: 100,
        percentage: 92,
        letterGrade: 'A',
        status: 'graded',
        feedback: 'Excellent implementation with clean code and comprehensive testing.',
        gradedAt: '2024-02-28T14:00:00Z',
        gradedBy: 'mentor_1'
      },
      {
        id: 'entry_2',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@student.kalpla.edu',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        assignmentType: 'project',
        dueDate: '2024-02-28T23:59:00Z',
        submittedAt: '2024-02-28T20:00:00Z',
        grade: 88,
        maxGrade: 100,
        percentage: 88,
        letterGrade: 'B+',
        status: 'graded',
        feedback: 'Good implementation with solid testing.',
        gradedAt: '2024-03-01T10:00:00Z',
        gradedBy: 'mentor_1'
      },
      {
        id: 'entry_3',
        studentId: 'student_3',
        studentName: 'Bob Wilson',
        studentEmail: 'bob.wilson@student.kalpla.edu',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        assignmentType: 'project',
        dueDate: '2024-02-28T23:59:00Z',
        submittedAt: '2024-03-01T10:00:00Z',
        grade: 75,
        maxGrade: 100,
        percentage: 75,
        letterGrade: 'C',
        status: 'graded',
        feedback: 'Satisfactory implementation with room for improvement.',
        gradedAt: '2024-03-02T09:00:00Z',
        gradedBy: 'mentor_1',
        lateDays: 1,
        penaltyApplied: 10
      },
      {
        id: 'entry_4',
        studentId: 'student_4',
        studentName: 'Alice Brown',
        studentEmail: 'alice.brown@student.kalpla.edu',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        assignmentType: 'project',
        dueDate: '2024-02-28T23:59:00Z',
        status: 'missing',
        maxGrade: 100
      }
    ];
  }

  /**
   * Get grades for a mentor
   */
  async getMentorGrades(mentorId: string): Promise<Grade[]> {
    try {
      return this.grades.filter(g => g.mentorId === mentorId);
    } catch (error) {
      console.error('Error fetching mentor grades:', error);
      return [];
    }
  }

  /**
   * Get grade by ID
   */
  async getGrade(gradeId: string): Promise<Grade | null> {
    try {
      return this.grades.find(g => g.id === gradeId) || null;
    } catch (error) {
      console.error('Error fetching grade:', error);
      return null;
    }
  }

  /**
   * Get grade by submission ID
   */
  async getGradeBySubmission(submissionId: string): Promise<Grade | null> {
    try {
      return this.grades.find(g => g.submissionId === submissionId) || null;
    } catch (error) {
      console.error('Error fetching grade by submission:', error);
      return null;
    }
  }

  /**
   * Create new grade
   */
  async createGrade(gradeData: Omit<Grade, 'id' | 'gradedAt' | 'gradedBy' | 'comments' | 'attachments' | 'previousVersions'>): Promise<Grade> {
    try {
      const newGrade: Grade = {
        ...gradeData,
        id: `grade_${Date.now()}`,
        gradedAt: new Date().toISOString(),
        gradedBy: gradeData.mentorId,
        comments: [],
        attachments: [],
        previousVersions: []
      };

      this.grades.push(newGrade);
      
      // Update gradebook entry
      await this.updateGradebookEntry(gradeData.submissionId, {
        grade: gradeData.grade,
        percentage: gradeData.percentage,
        letterGrade: gradeData.letterGrade,
        status: 'graded',
        feedback: gradeData.feedback,
        gradedAt: newGrade.gradedAt,
        gradedBy: newGrade.gradedBy
      });

      return newGrade;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  }

  /**
   * Update grade
   */
  async updateGrade(gradeId: string, updates: Partial<Grade>): Promise<Grade | null> {
    try {
      const index = this.grades.findIndex(g => g.id === gradeId);
      if (index === -1) return null;

      const currentGrade = this.grades[index];
      
      // Create version history
      const version: GradeVersion = {
        id: `version_${Date.now()}`,
        grade: currentGrade.grade,
        feedback: currentGrade.feedback,
        gradedAt: currentGrade.gradedAt,
        gradedBy: currentGrade.gradedBy,
        reason: 'Grade updated'
      };

      this.grades[index] = {
        ...currentGrade,
        ...updates,
        previousVersions: [...currentGrade.previousVersions, version]
      };

      // Update gradebook entry
      if (updates.grade !== undefined) {
        await this.updateGradebookEntry(currentGrade.submissionId, {
          grade: updates.grade,
          percentage: updates.percentage,
          letterGrade: updates.letterGrade,
          feedback: updates.feedback
        });
      }

      return this.grades[index];
    } catch (error) {
      console.error('Error updating grade:', error);
      return null;
    }
  }

  /**
   * Delete grade
   */
  async deleteGrade(gradeId: string): Promise<boolean> {
    try {
      const index = this.grades.findIndex(g => g.id === gradeId);
      if (index === -1) return false;

      const grade = this.grades[index];
      this.grades.splice(index, 1);

      // Update gradebook entry
      await this.updateGradebookEntry(grade.submissionId, {
        grade: undefined,
        percentage: undefined,
        letterGrade: undefined,
        status: 'submitted',
        feedback: undefined,
        gradedAt: undefined,
        gradedBy: undefined
      });

      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
      return false;
    }
  }

  /**
   * Grade submission with rubric
   */
  async gradeSubmissionWithRubric(
    submissionId: string,
    mentorId: string,
    rubricScores: RubricScore[],
    feedback: string,
    bonusPoints: number = 0,
    latePenalty: number = 0
  ): Promise<Grade | null> {
    try {
      const submission = await studentSubmissionService.getSubmission(submissionId);
      if (!submission) return null;

      const assignment = await mentorAssignmentService.getAssignment(submission.assignmentId);
      if (!assignment) return null;

      // Calculate total grade
      const totalEarnedPoints = rubricScores.reduce((sum, score) => sum + score.earnedPoints, 0);
      const totalMaxPoints = rubricScores.reduce((sum, score) => sum + score.maxPoints, 0);
      const baseGrade = (totalEarnedPoints / totalMaxPoints) * assignment.totalMarks;
      const finalGrade = Math.max(0, baseGrade + bonusPoints - latePenalty);
      const percentage = (finalGrade / assignment.totalMarks) * 100;
      const letterGrade = this.calculateLetterGrade(percentage);

      const gradeData = {
        submissionId,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        studentName: submission.studentName,
        studentEmail: submission.studentEmail,
        mentorId,
        mentorName: 'Dr. Sarah Johnson', // Mock mentor name
        grade: Math.round(finalGrade * 100) / 100,
        maxGrade: assignment.totalMarks,
        percentage: Math.round(percentage * 100) / 100,
        letterGrade,
        feedback,
        rubricScores,
        status: 'graded' as const,
        latePenalty: latePenalty > 0 ? latePenalty : undefined,
        bonusPoints: bonusPoints > 0 ? bonusPoints : undefined,
        isFinal: true
      };

      return await this.createGrade(gradeData);
    } catch (error) {
      console.error('Error grading submission with rubric:', error);
      return null;
    }
  }

  /**
   * Add comment to grade
   */
  async addGradeComment(
    gradeId: string,
    authorId: string,
    authorName: string,
    authorType: 'mentor' | 'student',
    content: string,
    isPrivate: boolean = false
  ): Promise<boolean> {
    try {
      const grade = this.grades.find(g => g.id === gradeId);
      if (!grade) return false;

      const comment: GradeComment = {
        id: `comment_${Date.now()}`,
        authorId,
        authorName,
        authorType,
        content,
        createdAt: new Date().toISOString(),
        isPrivate,
        attachments: []
      };

      grade.comments.push(comment);
      return true;
    } catch (error) {
      console.error('Error adding grade comment:', error);
      return false;
    }
  }

  /**
   * Get gradebook for a mentor
   */
  async getMentorGradebook(mentorId: string): Promise<GradebookEntry[]> {
    try {
      return this.gradebookEntries.filter(entry => 
        this.grades.some(grade => 
          grade.mentorId === mentorId && 
          grade.assignmentId === entry.assignmentId
        )
      );
    } catch (error) {
      console.error('Error fetching mentor gradebook:', error);
      return [];
    }
  }

  /**
   * Get gradebook statistics
   */
  async getGradebookStatistics(mentorId: string): Promise<GradebookStatistics> {
    try {
      const mentorEntries = await this.getMentorGradebook(mentorId);
      const gradedEntries = mentorEntries.filter(entry => entry.grade !== undefined);
      
      const totalAssignments = mentorEntries.length;
      const totalStudents = new Set(mentorEntries.map(entry => entry.studentId)).size;
      const submittedAssignments = mentorEntries.filter(entry => entry.submittedAt).length;
      const gradedAssignments = gradedEntries.length;
      const lateSubmissions = mentorEntries.filter(entry => entry.lateDays && entry.lateDays > 0).length;
      const missingSubmissions = mentorEntries.filter(entry => entry.status === 'missing').length;

      const grades = gradedEntries.map(entry => entry.grade!);
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
        : 0;

      const gradeDistribution = this.calculateGradeDistribution(grades);
      const gradeTrends = this.calculateGradeTrends(mentorEntries);

      return {
        totalAssignments,
        totalStudents,
        submittedAssignments,
        gradedAssignments,
        averageGrade: Math.round(averageGrade * 100) / 100,
        gradeDistribution,
        lateSubmissions,
        missingSubmissions,
        gradeTrends
      };
    } catch (error) {
      console.error('Error calculating gradebook statistics:', error);
      return {
        totalAssignments: 0,
        totalStudents: 0,
        submittedAssignments: 0,
        gradedAssignments: 0,
        averageGrade: 0,
        gradeDistribution: [],
        lateSubmissions: 0,
        missingSubmissions: 0,
        gradeTrends: []
      };
    }
  }

  /**
   * Update gradebook entry
   */
  private async updateGradebookEntry(submissionId: string, updates: Partial<GradebookEntry>): Promise<void> {
    try {
      const submission = await studentSubmissionService.getSubmission(submissionId);
      if (!submission) return;

      const index = this.gradebookEntries.findIndex(entry => 
        entry.studentId === submission.studentId && 
        entry.assignmentId === submission.assignmentId
      );

      if (index !== -1) {
        this.gradebookEntries[index] = {
          ...this.gradebookEntries[index],
          ...updates
        };
      }
    } catch (error) {
      console.error('Error updating gradebook entry:', error);
    }
  }

  /**
   * Calculate letter grade
   */
  private calculateLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }

  /**
   * Calculate grade distribution
   */
  private calculateGradeDistribution(grades: number[]): { range: string; count: number; percentage: number }[] {
    const ranges = [
      { range: 'A (90-100)', min: 90, max: 100 },
      { range: 'B (80-89)', min: 80, max: 89 },
      { range: 'C (70-79)', min: 70, max: 79 },
      { range: 'D (60-69)', min: 60, max: 69 },
      { range: 'F (0-59)', min: 0, max: 59 }
    ];
    
    return ranges.map(range => {
      const count = grades.filter(grade => grade >= range.min && grade <= range.max).length;
      return {
        range: range.range,
        count,
        percentage: grades.length > 0 ? Math.round((count / grades.length) * 100) : 0
      };
    });
  }

  /**
   * Calculate grade trends
   */
  private calculateGradeTrends(entries: GradebookEntry[]): { assignment: string; averageGrade: number; gradedCount: number }[] {
    const assignmentGroups = entries.reduce((groups, entry) => {
      if (!groups[entry.assignmentId]) {
        groups[entry.assignmentId] = [];
      }
      if (entry.grade !== undefined) {
        groups[entry.assignmentId].push(entry.grade);
      }
      return groups;
    }, {} as { [key: string]: number[] });

    return Object.entries(assignmentGroups).map(([assignmentId, grades]) => {
      const assignment = entries.find(entry => entry.assignmentId === assignmentId);
      const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
      
      return {
        assignment: assignment?.assignmentTitle || 'Unknown Assignment',
        averageGrade: Math.round(averageGrade * 100) / 100,
        gradedCount: grades.length
      };
    });
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
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-blue-100 text-blue-800';
      case 'needs_revision':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get letter grade color
   */
  getLetterGradeColor(letterGrade: string): string {
    if (letterGrade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (letterGrade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (letterGrade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (letterGrade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }
}

export const mentorGradingService = new MentorGradingService();

import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_STUDENT_PROGRESS,
  UPDATE_STUDENT_PROGRESS,
  CREATE_ASSIGNMENT_SUBMISSION,
  UPDATE_ASSIGNMENT_SUBMISSION,
  CREATE_LESSON_COMPLETION,
  UPDATE_LESSON_COMPLETION,
  CREATE_COURSE_ENROLLMENT,
  UPDATE_COURSE_ENROLLMENT
} from '../graphql/mutations';
import {
  GET_STUDENT_PROGRESS,
  GET_COURSE_PROGRESS,
  GET_LESSON_PROGRESS,
  GET_ASSIGNMENT_SUBMISSIONS,
  GET_STUDENT_ANALYTICS,
  GET_PROGRESS_SUMMARY
} from '../graphql/queries';

const client = generateClient();

export interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  lastAccessedDate: string;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  submittedAssignments: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalTimeSpent: number; // in minutes
  completionPercentage: number;
  currentStreak: number; // consecutive days of activity
  longestStreak: number;
  averageScore: number;
  certificates: string[];
  achievements: Achievement[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  lessonName: string;
  lessonOrder: number;
  status: LessonStatus;
  completionDate?: string;
  timeSpent: number; // in minutes
  lastPosition: number; // video position in seconds
  totalDuration: number; // lesson duration in seconds
  percentWatched: number;
  attempts: number;
  notes: string[];
  bookmarks: Bookmark[];
  quizScores: QuizScore[];
  createdAt: string;
  updatedAt: string;
}

export type LessonStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'skipped';

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  courseId: string;
  assignmentId: string;
  assignmentName: string;
  assignmentType: AssignmentType;
  submissionDate: string;
  dueDate: string;
  status: SubmissionStatus;
  score?: number;
  maxScore: number;
  feedback?: string;
  submissionContent: SubmissionContent;
  attachments: Attachment[];
  isLate: boolean;
  attempts: number;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentType = 
  | 'essay' 
  | 'quiz' 
  | 'project' 
  | 'presentation' 
  | 'discussion' 
  | 'peer_review' 
  | 'file_upload';

export type SubmissionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'graded' 
  | 'returned' 
  | 'resubmitted';

export interface SubmissionContent {
  text?: string;
  html?: string;
  files?: FileContent[];
  links?: string[];
  media?: MediaContent[];
}

export interface FileContent {
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  s3Url: string;
}

export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  s3Url: string;
  uploadedAt: string;
}

export interface QuizScore {
  quizId: string;
  quizName: string;
  score: number;
  maxScore: number;
  attempts: number;
  completedAt: string;
  timeSpent: number;
}

export interface Bookmark {
  id: string;
  timestamp: number; // video position in seconds
  title: string;
  note?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  earnedAt: string;
  points: number;
}

export type AchievementCategory = 
  | 'completion' 
  | 'streak' 
  | 'score' 
  | 'participation' 
  | 'milestone';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  type: MilestoneType;
  target: number;
  current: number;
  achieved: boolean;
  achievedAt?: string;
  reward?: string;
}

export type MilestoneType = 
  | 'lessons_completed' 
  | 'assignments_submitted' 
  | 'time_spent' 
  | 'streak_days' 
  | 'quiz_scores';

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  progress: StudentProgress;
  certificates: string[];
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = 
  | 'active' 
  | 'completed' 
  | 'paused' 
  | 'dropped';

export interface ProgressAnalytics {
  studentId: string;
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  submittedAssignments: number;
  totalTimeSpent: number;
  averageScore: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  achievements: number;
  certificates: number;
  lastActivityDate: string;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  courseProgress: CourseProgressSummary[];
}

export interface WeeklyProgress {
  week: string; // YYYY-WW format
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  timeSpent: number;
  averageScore: number;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  timeSpent: number;
  averageScore: number;
  coursesCompleted: number;
}

export interface CourseProgressSummary {
  courseId: string;
  courseName: string;
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageScore: number;
  timeSpent: number;
  lastAccessedDate: string;
}

class StudentProgressService {
  /**
   * Get student progress for a specific course
   */
  async getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress | null> {
    try {
      const result = await client.graphql({
        query: GET_STUDENT_PROGRESS,
        variables: { studentId, courseId }
      });

      return result.data.getStudentProgress;
    } catch (error) {
      console.error('Error getting student progress:', error);
      return null;
    }
  }

  /**
   * Get all course progress for a student
   */
  async getCourseProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_PROGRESS,
        variables: { studentId }
      });

      return result.data.getCourseProgress || [];
    } catch (error) {
      console.error('Error getting course progress:', error);
      return [];
    }
  }

  /**
   * Get lesson progress for a specific lesson
   */
  async getLessonProgress(studentId: string, lessonId: string): Promise<LessonProgress | null> {
    try {
      const result = await client.graphql({
        query: GET_LESSON_PROGRESS,
        variables: { studentId, lessonId }
      });

      return result.data.getLessonProgress;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(progress: Omit<LessonProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<LessonProgress> {
    try {
      const result = await client.graphql({
        query: UPDATE_LESSON_PROGRESS,
        variables: {
          input: {
            ...progress,
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update overall course progress
      await this.updateCourseProgress(progress.studentId, progress.courseId);

      return result.data.updateLessonProgress;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw new Error('Failed to update lesson progress');
    }
  }

  /**
   * Mark lesson as completed
   */
  async completeLesson(studentId: string, courseId: string, lessonId: string, lessonName: string, lessonOrder: number, timeSpent: number): Promise<LessonProgress> {
    try {
      const completionData: Omit<LessonProgress, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId,
        courseId,
        lessonId,
        lessonName,
        lessonOrder,
        status: 'completed',
        completionDate: new Date().toISOString(),
        timeSpent,
        lastPosition: 0,
        totalDuration: 0,
        percentWatched: 100,
        attempts: 1,
        notes: [],
        bookmarks: [],
        quizScores: []
      };

      const result = await client.graphql({
        query: CREATE_LESSON_COMPLETION,
        variables: {
          input: {
            ...completionData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update overall course progress
      await this.updateCourseProgress(studentId, courseId);

      // Check for achievements
      await this.checkAchievements(studentId, courseId);

      return result.data.createLessonCompletion;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw new Error('Failed to complete lesson');
    }
  }

  /**
   * Submit assignment
   */
  async submitAssignment(submission: Omit<AssignmentSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssignmentSubmission> {
    try {
      const submissionData = {
        ...submission,
        submissionDate: new Date().toISOString(),
        isLate: new Date() > new Date(submission.dueDate),
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await client.graphql({
        query: CREATE_ASSIGNMENT_SUBMISSION,
        variables: {
          input: submissionData
        }
      });

      // Update overall course progress
      await this.updateCourseProgress(submission.studentId, submission.courseId);

      // Check for achievements
      await this.checkAchievements(submission.studentId, submission.courseId);

      return result.data.createAssignmentSubmission;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw new Error('Failed to submit assignment');
    }
  }

  /**
   * Get assignment submissions for a student
   */
  async getAssignmentSubmissions(studentId: string, courseId?: string): Promise<AssignmentSubmission[]> {
    try {
      const result = await client.graphql({
        query: GET_ASSIGNMENT_SUBMISSIONS,
        variables: { studentId, courseId }
      });

      return result.data.getAssignmentSubmissions || [];
    } catch (error) {
      console.error('Error getting assignment submissions:', error);
      return [];
    }
  }

  /**
   * Update assignment submission
   */
  async updateAssignmentSubmission(submissionId: string, updates: Partial<AssignmentSubmission>): Promise<AssignmentSubmission> {
    try {
      const result = await client.graphql({
        query: UPDATE_ASSIGNMENT_SUBMISSION,
        variables: {
          input: {
            id: submissionId,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateAssignmentSubmission;
    } catch (error) {
      console.error('Error updating assignment submission:', error);
      throw new Error('Failed to update assignment submission');
    }
  }

  /**
   * Enroll student in course
   */
  async enrollInCourse(studentId: string, courseId: string, courseName: string): Promise<CourseEnrollment> {
    try {
      const enrollmentData = {
        studentId,
        courseId,
        courseName,
        enrollmentDate: new Date().toISOString(),
        status: 'active' as EnrollmentStatus,
        certificates: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await client.graphql({
        query: CREATE_COURSE_ENROLLMENT,
        variables: {
          input: enrollmentData
        }
      });

      // Create initial progress record
      await this.createInitialProgress(studentId, courseId, courseName);

      return result.data.createCourseEnrollment;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
  }

  /**
   * Create initial progress record
   */
  private async createInitialProgress(studentId: string, courseId: string, courseName: string): Promise<void> {
    try {
      const progressData = {
        studentId,
        courseId,
        courseName,
        enrollmentDate: new Date().toISOString(),
        lastAccessedDate: new Date().toISOString(),
        totalLessons: 0,
        completedLessons: 0,
        totalAssignments: 0,
        submittedAssignments: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        totalTimeSpent: 0,
        completionPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageScore: 0,
        certificates: [],
        achievements: [],
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await client.graphql({
        query: CREATE_STUDENT_PROGRESS,
        variables: {
          input: progressData
        }
      });
    } catch (error) {
      console.error('Error creating initial progress:', error);
    }
  }

  /**
   * Update overall course progress
   */
  private async updateCourseProgress(studentId: string, courseId: string): Promise<void> {
    try {
      // Get current progress
      const currentProgress = await this.getStudentProgress(studentId, courseId);
      if (!currentProgress) return;

      // Get all lesson progress for this course
      const lessonProgress = await this.getLessonProgressForCourse(studentId, courseId);
      const assignmentSubmissions = await this.getAssignmentSubmissions(studentId, courseId);

      // Calculate updated progress
      const completedLessons = lessonProgress.filter(lp => lp.status === 'completed').length;
      const submittedAssignments = assignmentSubmissions.filter(sub => sub.status === 'submitted' || sub.status === 'graded').length;
      const totalTimeSpent = lessonProgress.reduce((total, lp) => total + lp.timeSpent, 0);
      const completionPercentage = currentProgress.totalLessons > 0 ? 
        Math.round((completedLessons / currentProgress.totalLessons) * 100) : 0;

      // Update progress
      await client.graphql({
        query: UPDATE_STUDENT_PROGRESS,
        variables: {
          input: {
            id: currentProgress.id,
            completedLessons,
            submittedAssignments,
            totalTimeSpent,
            completionPercentage,
            lastAccessedDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  }

  /**
   * Get lesson progress for a course
   */
  private async getLessonProgressForCourse(studentId: string, courseId: string): Promise<LessonProgress[]> {
    try {
      // This would typically be a separate query
      // For now, we'll return an empty array
      return [];
    } catch (error) {
      console.error('Error getting lesson progress for course:', error);
      return [];
    }
  }

  /**
   * Check for achievements
   */
  private async checkAchievements(studentId: string, courseId: string): Promise<void> {
    try {
      const progress = await this.getStudentProgress(studentId, courseId);
      if (!progress) return;

      const achievements = [];

      // Check completion achievements
      if (progress.completionPercentage === 100) {
        achievements.push({
          id: `completion_${courseId}`,
          name: 'Course Completion',
          description: 'Completed the entire course',
          icon: '🎓',
          category: 'completion',
          earnedAt: new Date().toISOString(),
          points: 100
        });
      }

      // Check streak achievements
      if (progress.currentStreak >= 7) {
        achievements.push({
          id: `streak_7_${courseId}`,
          name: 'Week Warrior',
          description: '7-day learning streak',
          icon: '🔥',
          category: 'streak',
          earnedAt: new Date().toISOString(),
          points: 50
        });
      }

      // Add achievements to progress
      if (achievements.length > 0) {
        await client.graphql({
          query: UPDATE_STUDENT_PROGRESS,
          variables: {
            input: {
              id: progress.id,
              achievements: [...progress.achievements, ...achievements],
              updatedAt: new Date().toISOString()
            }
          }
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  /**
   * Get student analytics
   */
  async getStudentAnalytics(studentId: string): Promise<ProgressAnalytics> {
    try {
      const result = await client.graphql({
        query: GET_STUDENT_ANALYTICS,
        variables: { studentId }
      });

      return result.data.getStudentAnalytics;
    } catch (error) {
      console.error('Error getting student analytics:', error);
      throw new Error('Failed to get student analytics');
    }
  }

  /**
   * Get progress summary
   */
  async getProgressSummary(studentId: string): Promise<ProgressAnalytics> {
    try {
      const result = await client.graphql({
        query: GET_PROGRESS_SUMMARY,
        variables: { studentId }
      });

      return result.data.getProgressSummary;
    } catch (error) {
      console.error('Error getting progress summary:', error);
      throw new Error('Failed to get progress summary');
    }
  }

  /**
   * Calculate completion percentage
   */
  calculateCompletionPercentage(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Format time spent
   */
  formatTimeSpent(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  /**
   * Calculate streak
   */
  calculateStreak(lastActivityDates: string[]): { current: number; longest: number } {
    if (lastActivityDates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = lastActivityDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      if (i === 0) {
        tempStreak = 1;
      } else if (nextDate) {
        const daysDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    currentStreak = tempStreak;

    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * Get progress status
   */
  getProgressStatus(completionPercentage: number): { status: string; color: string } {
    if (completionPercentage === 100) {
      return { status: 'Completed', color: 'green' };
    } else if (completionPercentage >= 75) {
      return { status: 'Almost Done', color: 'blue' };
    } else if (completionPercentage >= 50) {
      return { status: 'In Progress', color: 'yellow' };
    } else if (completionPercentage >= 25) {
      return { status: 'Getting Started', color: 'orange' };
    } else {
      return { status: 'Just Started', color: 'red' };
    }
  }
}

export const studentProgressService = new StudentProgressService();

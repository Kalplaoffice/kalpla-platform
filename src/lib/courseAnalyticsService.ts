import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_COURSE_ANALYTICS,
  UPDATE_COURSE_ANALYTICS,
  CREATE_COURSE_METRICS,
  UPDATE_COURSE_METRICS,
  CREATE_STUDENT_COURSE_ANALYTICS,
  UPDATE_STUDENT_COURSE_ANALYTICS
} from '../graphql/mutations';
import {
  GET_COURSE_ANALYTICS,
  GET_COURSE_METRICS,
  GET_STUDENT_COURSE_ANALYTICS,
  GET_COURSE_COMPLETION_RATES,
  GET_COURSE_PERFORMANCE_METRICS,
  GET_COURSE_ENGAGEMENT_METRICS
} from '../graphql/queries';

const client = generateClient();

export interface CourseAnalytics {
  id: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  droppedEnrollments: number;
  completionRate: number;
  averageCompletionTime: number; // in days
  averageScore: number;
  totalRevenue: number;
  averageRating: number;
  totalRatings: number;
  metrics: CourseMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  demographics: DemographicsMetrics;
  timeSeries: TimeSeriesData[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseMetrics {
  id: string;
  courseId: string;
  period: AnalyticsPeriod;
  enrollments: number;
  completions: number;
  dropouts: number;
  averageScore: number;
  averageTimeToComplete: number;
  averageWatchTime: number;
  averageAssignmentScore: number;
  averageQuizScore: number;
  totalRevenue: number;
  refunds: number;
  netRevenue: number;
  averageRating: number;
  totalRatings: number;
  positiveRatings: number;
  negativeRatings: number;
  neutralRatings: number;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsPeriod = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly';

export interface EngagementMetrics {
  averageSessionDuration: number; // in minutes
  averageSessionsPerStudent: number;
  averageLessonsPerSession: number;
  averageTimePerLesson: number;
  bounceRate: number; // percentage
  retentionRate: number; // percentage
  reEngagementRate: number; // percentage
  socialShares: number;
  discussionPosts: number;
  assignmentSubmissions: number;
  quizAttempts: number;
  bookmarkCount: number;
  noteCount: number;
  helpRequests: number;
}

export interface PerformanceMetrics {
  averageGrade: number;
  gradeDistribution: GradeDistribution;
  assignmentPerformance: AssignmentPerformance;
  quizPerformance: QuizPerformance;
  projectPerformance: ProjectPerformance;
  peerReviewScores: PeerReviewScores;
  instructorFeedback: InstructorFeedback;
  improvementTrends: ImprovementTrends;
}

export interface GradeDistribution {
  a: number; // 90-100
  b: number; // 80-89
  c: number; // 70-79
  d: number; // 60-69
  f: number; // 0-59
  total: number;
}

export interface AssignmentPerformance {
  totalAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  averageScore: number;
  averageTimeToSubmit: number; // in hours
  lateSubmissions: number;
  resubmissions: number;
  plagiarismDetections: number;
}

export interface QuizPerformance {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  averageAttempts: number;
  averageTimePerQuiz: number; // in minutes
  perfectScores: number;
  passingScores: number; // >= 70%
  failingScores: number; // < 70%
}

export interface ProjectPerformance {
  totalProjects: number;
  submittedProjects: number;
  gradedProjects: number;
  averageScore: number;
  averageTimeToComplete: number; // in days
  peerReviews: number;
  averagePeerScore: number;
}

export interface PeerReviewScores {
  totalReviews: number;
  averageScore: number;
  helpfulReviews: number;
  constructiveReviews: number;
  averageReviewLength: number; // in words
}

export interface InstructorFeedback {
  totalFeedback: number;
  averageFeedbackLength: number; // in words
  positiveFeedback: number;
  constructiveFeedback: number;
  averageResponseTime: number; // in hours
}

export interface ImprovementTrends {
  scoreImprovement: number; // percentage improvement
  completionImprovement: number; // percentage improvement
  engagementImprovement: number; // percentage improvement
  retentionImprovement: number; // percentage improvement
  timeToCompleteImprovement: number; // percentage improvement
}

export interface DemographicsMetrics {
  ageDistribution: AgeDistribution;
  genderDistribution: GenderDistribution;
  locationDistribution: LocationDistribution;
  educationLevelDistribution: EducationLevelDistribution;
  experienceLevelDistribution: ExperienceLevelDistribution;
  deviceDistribution: DeviceDistribution;
  browserDistribution: BrowserDistribution;
}

export interface AgeDistribution {
  '18-24': number;
  '25-34': number;
  '35-44': number;
  '45-54': number;
  '55-64': number;
  '65+': number;
  total: number;
}

export interface GenderDistribution {
  male: number;
  female: number;
  nonBinary: number;
  preferNotToSay: number;
  total: number;
}

export interface LocationDistribution {
  northAmerica: number;
  southAmerica: number;
  europe: number;
  asia: number;
  africa: number;
  oceania: number;
  total: number;
}

export interface EducationLevelDistribution {
  highSchool: number;
  associate: number;
  bachelor: number;
  master: number;
  doctorate: number;
  other: number;
  total: number;
}

export interface ExperienceLevelDistribution {
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
  total: number;
}

export interface DeviceDistribution {
  desktop: number;
  mobile: number;
  tablet: number;
  total: number;
}

export interface BrowserDistribution {
  chrome: number;
  firefox: number;
  safari: number;
  edge: number;
  other: number;
  total: number;
}

export interface TimeSeriesData {
  date: string;
  enrollments: number;
  completions: number;
  dropouts: number;
  revenue: number;
  ratings: number;
  averageScore: number;
  averageWatchTime: number;
  engagementScore: number;
}

export interface StudentCourseAnalytics {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  completionDate?: string;
  status: 'active' | 'completed' | 'dropped' | 'paused';
  progressPercentage: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  lastAccessedDate: string;
  streakDays: number;
  engagementScore: number;
  performanceMetrics: StudentPerformanceMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPerformanceMetrics {
  averageQuizScore: number;
  averageAssignmentScore: number;
  averageProjectScore: number;
  participationScore: number;
  improvementRate: number;
  consistencyScore: number;
  helpSeekingBehavior: number;
  peerInteractionScore: number;
}

export interface CourseCompletionReport {
  courseId: string;
  courseName: string;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  averageCompletionTime: number;
  averageScore: number;
  topPerformingStudents: StudentCourseAnalytics[];
  strugglingStudents: StudentCourseAnalytics[];
  completionTrends: CompletionTrend[];
  recommendations: string[];
}

export interface CompletionTrend {
  period: string;
  completionRate: number;
  enrollments: number;
  completions: number;
}

class CourseAnalyticsService {
  /**
   * Get course analytics
   */
  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics | null> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_ANALYTICS,
        variables: { courseId }
      });

      return result.data.getCourseAnalytics;
    } catch (error) {
      console.error('Error getting course analytics:', error);
      return null;
    }
  }

  /**
   * Get course metrics for a specific period
   */
  async getCourseMetrics(courseId: string, period: AnalyticsPeriod): Promise<CourseMetrics[]> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_METRICS,
        variables: { courseId, period }
      });

      return result.data.getCourseMetrics || [];
    } catch (error) {
      console.error('Error getting course metrics:', error);
      return [];
    }
  }

  /**
   * Get student course analytics
   */
  async getStudentCourseAnalytics(courseId: string): Promise<StudentCourseAnalytics[]> {
    try {
      const result = await client.graphql({
        query: GET_STUDENT_COURSE_ANALYTICS,
        variables: { courseId }
      });

      return result.data.getStudentCourseAnalytics || [];
    } catch (error) {
      console.error('Error getting student course analytics:', error);
      return [];
    }
  }

  /**
   * Get course completion rates
   */
  async getCourseCompletionRates(courseId: string): Promise<CourseCompletionReport> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_COMPLETION_RATES,
        variables: { courseId }
      });

      return result.data.getCourseCompletionRates;
    } catch (error) {
      console.error('Error getting course completion rates:', error);
      throw new Error('Failed to get course completion rates');
    }
  }

  /**
   * Get course performance metrics
   */
  async getCoursePerformanceMetrics(courseId: string): Promise<PerformanceMetrics> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_PERFORMANCE_METRICS,
        variables: { courseId }
      });

      return result.data.getCoursePerformanceMetrics;
    } catch (error) {
      console.error('Error getting course performance metrics:', error);
      throw new Error('Failed to get course performance metrics');
    }
  }

  /**
   * Get course engagement metrics
   */
  async getCourseEngagementMetrics(courseId: string): Promise<EngagementMetrics> {
    try {
      const result = await client.graphql({
        query: GET_COURSE_ENGAGEMENT_METRICS,
        variables: { courseId }
      });

      return result.data.getCourseEngagementMetrics;
    } catch (error) {
      console.error('Error getting course engagement metrics:', error);
      throw new Error('Failed to get course engagement metrics');
    }
  }

  /**
   * Update course analytics
   */
  async updateCourseAnalytics(courseId: string, updates: Partial<CourseAnalytics>): Promise<CourseAnalytics> {
    try {
      const result = await client.graphql({
        query: UPDATE_COURSE_ANALYTICS,
        variables: {
          input: {
            id: courseId,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateCourseAnalytics;
    } catch (error) {
      console.error('Error updating course analytics:', error);
      throw new Error('Failed to update course analytics');
    }
  }

  /**
   * Create course metrics
   */
  async createCourseMetrics(metrics: Omit<CourseMetrics, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseMetrics> {
    try {
      const result = await client.graphql({
        query: CREATE_COURSE_METRICS,
        variables: {
          input: {
            ...metrics,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createCourseMetrics;
    } catch (error) {
      console.error('Error creating course metrics:', error);
      throw new Error('Failed to create course metrics');
    }
  }

  /**
   * Calculate completion rate
   */
  calculateCompletionRate(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate average completion time
   */
  calculateAverageCompletionTime(completionTimes: number[]): number {
    if (completionTimes.length === 0) return 0;
    const totalDays = completionTimes.reduce((sum, time) => sum + time, 0);
    return Math.round(totalDays / completionTimes.length);
  }

  /**
   * Calculate engagement score
   */
  calculateEngagementScore(metrics: EngagementMetrics): number {
    const weights = {
      sessionDuration: 0.2,
      sessionsPerStudent: 0.15,
      lessonsPerSession: 0.15,
      timePerLesson: 0.1,
      bounceRate: -0.1, // Negative weight
      retentionRate: 0.15,
      reEngagementRate: 0.1,
      socialShares: 0.05
    };

    const score = 
      (metrics.averageSessionDuration * weights.sessionDuration) +
      (metrics.averageSessionsPerStudent * weights.sessionsPerStudent) +
      (metrics.averageLessonsPerSession * weights.lessonsPerSession) +
      (metrics.averageTimePerLesson * weights.timePerLesson) +
      (metrics.bounceRate * weights.bounceRate) +
      (metrics.retentionRate * weights.retentionRate) +
      (metrics.reEngagementRate * weights.reEngagementRate) +
      (metrics.socialShares * weights.socialShares);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate performance score
   */
  calculatePerformanceScore(metrics: PerformanceMetrics): number {
    const weights = {
      averageGrade: 0.3,
      assignmentPerformance: 0.25,
      quizPerformance: 0.2,
      projectPerformance: 0.15,
      improvementTrends: 0.1
    };

    const score = 
      (metrics.averageGrade * weights.averageGrade) +
      (metrics.assignmentPerformance.averageScore * weights.assignmentPerformance) +
      (metrics.quizPerformance.averageScore * weights.quizPerformance) +
      (metrics.projectPerformance.averageScore * weights.projectPerformance) +
      (metrics.improvementTrends.scoreImprovement * weights.improvementTrends);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate completion report
   */
  async generateCompletionReport(courseId: string): Promise<CourseCompletionReport> {
    try {
      const [analytics, studentAnalytics] = await Promise.all([
        this.getCourseAnalytics(courseId),
        this.getStudentCourseAnalytics(courseId)
      ]);

      if (!analytics) {
        throw new Error('Course analytics not found');
      }

      // Calculate completion trends
      const completionTrends = this.calculateCompletionTrends(studentAnalytics);

      // Identify top performing and struggling students
      const topPerformingStudents = studentAnalytics
        .filter(student => student.status === 'completed')
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 10);

      const strugglingStudents = studentAnalytics
        .filter(student => student.status === 'active' && student.progressPercentage < 50)
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 10);

      // Generate recommendations
      const recommendations = this.generateRecommendations(analytics, studentAnalytics);

      return {
        courseId: analytics.courseId,
        courseName: analytics.courseName,
        totalEnrollments: analytics.totalEnrollments,
        completedEnrollments: analytics.completedEnrollments,
        completionRate: analytics.completionRate,
        averageCompletionTime: analytics.averageCompletionTime,
        averageScore: analytics.averageScore,
        topPerformingStudents,
        strugglingStudents,
        completionTrends,
        recommendations
      };
    } catch (error) {
      console.error('Error generating completion report:', error);
      throw new Error('Failed to generate completion report');
    }
  }

  /**
   * Calculate completion trends
   */
  private calculateCompletionTrends(studentAnalytics: StudentCourseAnalytics[]): CompletionTrend[] {
    const trends: CompletionTrend[] = [];
    const now = new Date();
    
    // Calculate trends for last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const periodStudents = studentAnalytics.filter(student => {
        const enrollmentDate = new Date(student.enrollmentDate);
        return enrollmentDate.getFullYear() === date.getFullYear() && 
               enrollmentDate.getMonth() === date.getMonth();
      });

      const enrollments = periodStudents.length;
      const completions = periodStudents.filter(student => student.status === 'completed').length;
      const completionRate = this.calculateCompletionRate(completions, enrollments);

      trends.push({
        period,
        completionRate,
        enrollments,
        completions
      });
    }

    return trends;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(analytics: CourseAnalytics, studentAnalytics: StudentCourseAnalytics[]): string[] {
    const recommendations: string[] = [];

    // Completion rate recommendations
    if (analytics.completionRate < 70) {
      recommendations.push('Consider adding more interactive elements to improve engagement');
      recommendations.push('Implement progress checkpoints to help students stay on track');
    }

    // Engagement recommendations
    if (analytics.engagement.averageSessionDuration < 30) {
      recommendations.push('Break down content into smaller, more digestible chunks');
      recommendations.push('Add interactive quizzes and activities throughout lessons');
    }

    // Performance recommendations
    if (analytics.averageScore < 80) {
      recommendations.push('Review assignment difficulty and provide more practice exercises');
      recommendations.push('Consider adding peer review sessions for collaborative learning');
    }

    // Dropout recommendations
    const dropoutRate = (analytics.droppedEnrollments / analytics.totalEnrollments) * 100;
    if (dropoutRate > 20) {
      recommendations.push('Implement early intervention strategies for at-risk students');
      recommendations.push('Add more support resources and help documentation');
    }

    // Time to completion recommendations
    if (analytics.averageCompletionTime > 90) {
      recommendations.push('Consider offering flexible pacing options');
      recommendations.push('Add time management tips and study schedules');
    }

    return recommendations;
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number): string {
    return `${value}%`;
  }

  /**
   * Format time duration
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(score: number): { grade: string; color: string } {
    if (score >= 90) return { grade: 'A', color: 'green' };
    if (score >= 80) return { grade: 'B', color: 'blue' };
    if (score >= 70) return { grade: 'C', color: 'yellow' };
    if (score >= 60) return { grade: 'D', color: 'orange' };
    return { grade: 'F', color: 'red' };
  }

  /**
   * Get completion status
   */
  getCompletionStatus(completionRate: number): { status: string; color: string } {
    if (completionRate >= 80) return { status: 'Excellent', color: 'green' };
    if (completionRate >= 70) return { status: 'Good', color: 'blue' };
    if (completionRate >= 60) return { status: 'Average', color: 'yellow' };
    if (completionRate >= 50) return { status: 'Below Average', color: 'orange' };
    return { status: 'Poor', color: 'red' };
  }
}

export const courseAnalyticsService = new CourseAnalyticsService();

import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_COHORT_ANALYTICS,
  UPDATE_COHORT_ANALYTICS,
  CREATE_MENTOR_PERFORMANCE,
  UPDATE_MENTOR_PERFORMANCE,
  CREATE_STUDENT_SUCCESS_METRICS,
  UPDATE_STUDENT_SUCCESS_METRICS,
  CREATE_MENTORSHIP_MATCH,
  UPDATE_MENTORSHIP_MATCH
} from '../graphql/mutations';
import {
  GET_COHORT_ANALYTICS,
  GET_MENTOR_PERFORMANCE,
  GET_STUDENT_SUCCESS_METRICS,
  GET_MENTORSHIP_MATCHES,
  GET_COHORT_PERFORMANCE,
  GET_MENTOR_EFFECTIVENESS
} from '../graphql/queries';

const client = generateClient();

export interface CohortAnalytics {
  id: string;
  cohortId: string;
  cohortName: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  totalMentors: number;
  activeMentorships: number;
  completedMentorships: number;
  averageMentorRating: number;
  studentSuccessRate: number;
  averageStudentProgress: number;
  retentionRate: number;
  satisfactionScore: number;
  metrics: CohortMetrics;
  mentorPerformance: MentorPerformanceSummary[];
  studentSuccess: StudentSuccessSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CohortMetrics {
  id: string;
  cohortId: string;
  period: AnalyticsPeriod;
  totalMentorships: number;
  activeMentorships: number;
  completedMentorships: number;
  droppedMentorships: number;
  averageMentorRating: number;
  averageStudentRating: number;
  averageSessionDuration: number; // in minutes
  averageSessionsPerWeek: number;
  averageStudentProgress: number;
  studentSuccessRate: number;
  mentorSatisfactionScore: number;
  studentSatisfactionScore: number;
  goalAchievementRate: number;
  interventionRate: number;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsPeriod = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly';

export interface MentorPerformance {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  cohortId: string;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageRating: number;
  totalSessions: number;
  averageSessionDuration: number;
  averageSessionsPerWeek: number;
  studentSuccessRate: number;
  mentorSatisfactionScore: number;
  responseTime: number; // in hours
  availabilityScore: number;
  communicationScore: number;
  expertiseScore: number;
  supportScore: number;
  metrics: MentorMetrics;
  achievements: MentorAchievement[];
  feedback: MentorFeedback[];
  createdAt: string;
  updatedAt: string;
}

export interface MentorMetrics {
  totalMentorshipHours: number;
  averageSessionRating: number;
  studentProgressImprovement: number;
  goalAchievementRate: number;
  interventionSuccessRate: number;
  studentRetentionRate: number;
  mentorEngagementScore: number;
  knowledgeSharingScore: number;
  leadershipScore: number;
  adaptabilityScore: number;
}

export interface MentorAchievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  earnedAt: string;
  points: number;
  icon: string;
}

export type AchievementCategory = 
  | 'excellence' 
  | 'dedication' 
  | 'leadership' 
  | 'innovation' 
  | 'collaboration';

export interface MentorFeedback {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  category: FeedbackCategory;
  submittedAt: string;
}

export type FeedbackCategory = 
  | 'communication' 
  | 'expertise' 
  | 'support' 
  | 'availability' 
  | 'overall';

export interface StudentSuccessMetrics {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cohortId: string;
  mentorId: string;
  mentorName: string;
  enrollmentDate: string;
  completionDate?: string;
  status: MentorshipStatus;
  progressPercentage: number;
  totalSessions: number;
  averageSessionRating: number;
  goalAchievementRate: number;
  skillImprovementScore: number;
  confidenceScore: number;
  satisfactionScore: number;
  retentionScore: number;
  metrics: StudentMetrics;
  goals: StudentGoal[];
  achievements: StudentAchievement[];
  feedback: StudentFeedback[];
  createdAt: string;
  updatedAt: string;
}

export type MentorshipStatus = 
  | 'active' 
  | 'completed' 
  | 'paused' 
  | 'dropped' 
  | 'transferred';

export interface StudentMetrics {
  totalMentorshipHours: number;
  averageSessionRating: number;
  goalCompletionRate: number;
  skillImprovementRate: number;
  confidenceImprovementRate: number;
  engagementScore: number;
  participationScore: number;
  initiativeScore: number;
  collaborationScore: number;
  problemSolvingScore: number;
}

export interface StudentGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  status: GoalStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export type GoalCategory = 
  | 'academic' 
  | 'career' 
  | 'personal' 
  | 'skill_development' 
  | 'networking';

export type GoalStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface StudentAchievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  earnedAt: string;
  points: number;
  icon: string;
}

export interface StudentFeedback {
  id: string;
  mentorId: string;
  mentorName: string;
  rating: number;
  comment: string;
  category: FeedbackCategory;
  submittedAt: string;
}

export interface MentorshipMatch {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  cohortId: string;
  matchDate: string;
  status: MatchStatus;
  compatibilityScore: number;
  matchReason: string;
  studentPreferences: StudentPreferences;
  mentorPreferences: MentorPreferences;
  performanceMetrics: MatchPerformanceMetrics;
  createdAt: string;
  updatedAt: string;
}

export type MatchStatus = 
  | 'active' 
  | 'completed' 
  | 'paused' 
  | 'terminated';

export interface StudentPreferences {
  preferredMentorExperience: string[];
  preferredCommunicationStyle: string[];
  preferredMeetingFrequency: string;
  preferredMeetingTime: string[];
  preferredMentorGender?: string;
  preferredMentorAgeRange?: string;
  specificRequirements: string[];
}

export interface MentorPreferences {
  preferredStudentLevel: string[];
  preferredStudentInterests: string[];
  preferredMeetingFrequency: string;
  preferredMeetingTime: string[];
  maxStudents: number;
  specificExpertise: string[];
}

export interface MatchPerformanceMetrics {
  compatibilityScore: number;
  communicationScore: number;
  goalAlignmentScore: number;
  progressScore: number;
  satisfactionScore: number;
  retentionScore: number;
}

export interface CohortPerformanceReport {
  cohortId: string;
  cohortName: string;
  totalStudents: number;
  totalMentors: number;
  studentSuccessRate: number;
  mentorEffectivenessScore: number;
  averageStudentProgress: number;
  retentionRate: number;
  satisfactionScore: number;
  topPerformingMentors: MentorPerformance[];
  strugglingMentors: MentorPerformance[];
  topPerformingStudents: StudentSuccessMetrics[];
  strugglingStudents: StudentSuccessMetrics[];
  recommendations: string[];
  trends: CohortTrend[];
}

export interface CohortTrend {
  period: string;
  studentSuccessRate: number;
  mentorEffectivenessScore: number;
  averageStudentProgress: number;
  retentionRate: number;
  satisfactionScore: number;
}

export interface MentorEffectivenessReport {
  mentorId: string;
  mentorName: string;
  effectivenessScore: number;
  studentSuccessRate: number;
  averageStudentProgress: number;
  studentSatisfactionScore: number;
  totalMentorshipHours: number;
  averageSessionRating: number;
  goalAchievementRate: number;
  interventionSuccessRate: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  studentFeedback: MentorFeedback[];
}

class KSMPCohortAnalyticsService {
  /**
   * Get cohort analytics
   */
  async getCohortAnalytics(cohortId: string): Promise<CohortAnalytics | null> {
    try {
      const result = await client.graphql({
        query: GET_COHORT_ANALYTICS,
        variables: { cohortId }
      });

      return result.data.getCohortAnalytics;
    } catch (error) {
      console.error('Error getting cohort analytics:', error);
      return null;
    }
  }

  /**
   * Get mentor performance
   */
  async getMentorPerformance(mentorId: string): Promise<MentorPerformance | null> {
    try {
      const result = await client.graphql({
        query: GET_MENTOR_PERFORMANCE,
        variables: { mentorId }
      });

      return result.data.getMentorPerformance;
    } catch (error) {
      console.error('Error getting mentor performance:', error);
      return null;
    }
  }

  /**
   * Get student success metrics
   */
  async getStudentSuccessMetrics(studentId: string): Promise<StudentSuccessMetrics | null> {
    try {
      const result = await client.graphql({
        query: GET_STUDENT_SUCCESS_METRICS,
        variables: { studentId }
      });

      return result.data.getStudentSuccessMetrics;
    } catch (error) {
      console.error('Error getting student success metrics:', error);
      return null;
    }
  }

  /**
   * Get mentorship matches
   */
  async getMentorshipMatches(cohortId: string): Promise<MentorshipMatch[]> {
    try {
      const result = await client.graphql({
        query: GET_MENTORSHIP_MATCHES,
        variables: { cohortId }
      });

      return result.data.getMentorshipMatches || [];
    } catch (error) {
      console.error('Error getting mentorship matches:', error);
      return [];
    }
  }

  /**
   * Get cohort performance
   */
  async getCohortPerformance(cohortId: string): Promise<CohortPerformanceReport> {
    try {
      const result = await client.graphql({
        query: GET_COHORT_PERFORMANCE,
        variables: { cohortId }
      });

      return result.data.getCohortPerformance;
    } catch (error) {
      console.error('Error getting cohort performance:', error);
      throw new Error('Failed to get cohort performance');
    }
  }

  /**
   * Get mentor effectiveness
   */
  async getMentorEffectiveness(mentorId: string): Promise<MentorEffectivenessReport> {
    try {
      const result = await client.graphql({
        query: GET_MENTOR_EFFECTIVENESS,
        variables: { mentorId }
      });

      return result.data.getMentorEffectiveness;
    } catch (error) {
      console.error('Error getting mentor effectiveness:', error);
      throw new Error('Failed to get mentor effectiveness');
    }
  }

  /**
   * Update mentor performance
   */
  async updateMentorPerformance(mentorId: string, updates: Partial<MentorPerformance>): Promise<MentorPerformance> {
    try {
      const result = await client.graphql({
        query: UPDATE_MENTOR_PERFORMANCE,
        variables: {
          input: {
            id: mentorId,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateMentorPerformance;
    } catch (error) {
      console.error('Error updating mentor performance:', error);
      throw new Error('Failed to update mentor performance');
    }
  }

  /**
   * Update student success metrics
   */
  async updateStudentSuccessMetrics(studentId: string, updates: Partial<StudentSuccessMetrics>): Promise<StudentSuccessMetrics> {
    try {
      const result = await client.graphql({
        query: UPDATE_STUDENT_SUCCESS_METRICS,
        variables: {
          input: {
            id: studentId,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateStudentSuccessMetrics;
    } catch (error) {
      console.error('Error updating student success metrics:', error);
      throw new Error('Failed to update student success metrics');
    }
  }

  /**
   * Calculate mentor effectiveness score
   */
  calculateMentorEffectivenessScore(mentor: MentorPerformance): number {
    const weights = {
      studentSuccessRate: 0.25,
      averageRating: 0.20,
      responseTime: 0.15,
      availabilityScore: 0.15,
      communicationScore: 0.10,
      expertiseScore: 0.10,
      supportScore: 0.05
    };

    // Convert response time to score (lower is better)
    const responseTimeScore = Math.max(0, 100 - (mentor.responseTime * 2));

    const score = 
      (mentor.studentSuccessRate * weights.studentSuccessRate) +
      (mentor.averageRating * weights.averageRating) +
      (responseTimeScore * weights.responseTime) +
      (mentor.availabilityScore * weights.availabilityScore) +
      (mentor.communicationScore * weights.communicationScore) +
      (mentor.expertiseScore * weights.expertiseScore) +
      (mentor.supportScore * weights.supportScore);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate student success rate
   */
  calculateStudentSuccessRate(students: StudentSuccessMetrics[]): number {
    if (students.length === 0) return 0;
    
    const successfulStudents = students.filter(student => 
      student.status === 'completed' && student.progressPercentage >= 80
    ).length;

    return Math.round((successfulStudents / students.length) * 100);
  }

  /**
   * Calculate cohort performance score
   */
  calculateCohortPerformanceScore(cohort: CohortAnalytics): number {
    const weights = {
      studentSuccessRate: 0.30,
      averageStudentProgress: 0.25,
      retentionRate: 0.20,
      satisfactionScore: 0.15,
      averageMentorRating: 0.10
    };

    const score = 
      (cohort.studentSuccessRate * weights.studentSuccessRate) +
      (cohort.averageStudentProgress * weights.averageStudentProgress) +
      (cohort.retentionRate * weights.retentionRate) +
      (cohort.satisfactionScore * weights.satisfactionScore) +
      (cohort.averageMentorRating * weights.averageMentorRating);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate cohort performance report
   */
  async generateCohortPerformanceReport(cohortId: string): Promise<CohortPerformanceReport> {
    try {
      const [cohortAnalytics, mentorshipMatches] = await Promise.all([
        this.getCohortAnalytics(cohortId),
        this.getMentorshipMatches(cohortId)
      ]);

      if (!cohortAnalytics) {
        throw new Error('Cohort analytics not found');
      }

      // Get mentor performance data
      const mentorPerformance = await Promise.all(
        cohortAnalytics.mentorPerformance.map(mentor => 
          this.getMentorPerformance(mentor.mentorId)
        )
      );

      // Get student success data
      const studentSuccess = await Promise.all(
        cohortAnalytics.studentSuccess.map(student => 
          this.getStudentSuccessMetrics(student.studentId)
        )
      );

      // Calculate trends
      const trends = this.calculateCohortTrends(cohortAnalytics);

      // Generate recommendations
      const recommendations = this.generateCohortRecommendations(cohortAnalytics, mentorPerformance, studentSuccess);

      return {
        cohortId: cohortAnalytics.cohortId,
        cohortName: cohortAnalytics.cohortName,
        totalStudents: cohortAnalytics.totalStudents,
        totalMentors: cohortAnalytics.totalMentors,
        studentSuccessRate: cohortAnalytics.studentSuccessRate,
        mentorEffectivenessScore: this.calculateMentorEffectivenessScore(mentorPerformance[0] || {} as MentorPerformance),
        averageStudentProgress: cohortAnalytics.averageStudentProgress,
        retentionRate: cohortAnalytics.retentionRate,
        satisfactionScore: cohortAnalytics.satisfactionScore,
        topPerformingMentors: mentorPerformance
          .filter(mentor => mentor && mentor.averageRating >= 4.5)
          .sort((a, b) => b!.averageRating - a!.averageRating)
          .slice(0, 5) as MentorPerformance[],
        strugglingMentors: mentorPerformance
          .filter(mentor => mentor && mentor.averageRating < 3.0)
          .sort((a, b) => a!.averageRating - b!.averageRating)
          .slice(0, 5) as MentorPerformance[],
        topPerformingStudents: studentSuccess
          .filter(student => student && student.progressPercentage >= 90)
          .sort((a, b) => b!.progressPercentage - a!.progressPercentage)
          .slice(0, 10) as StudentSuccessMetrics[],
        strugglingStudents: studentSuccess
          .filter(student => student && student.progressPercentage < 50)
          .sort((a, b) => a!.progressPercentage - b!.progressPercentage)
          .slice(0, 10) as StudentSuccessMetrics[],
        recommendations,
        trends
      };
    } catch (error) {
      console.error('Error generating cohort performance report:', error);
      throw new Error('Failed to generate cohort performance report');
    }
  }

  /**
   * Calculate cohort trends
   */
  private calculateCohortTrends(cohort: CohortAnalytics): CohortTrend[] {
    const trends: CohortTrend[] = [];
    const now = new Date();
    
    // Calculate trends for last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // This would typically come from historical data
      trends.push({
        period,
        studentSuccessRate: cohort.studentSuccessRate + (Math.random() - 0.5) * 10,
        mentorEffectivenessScore: cohort.averageMentorRating * 20 + (Math.random() - 0.5) * 10,
        averageStudentProgress: cohort.averageStudentProgress + (Math.random() - 0.5) * 10,
        retentionRate: cohort.retentionRate + (Math.random() - 0.5) * 10,
        satisfactionScore: cohort.satisfactionScore + (Math.random() - 0.5) * 10
      });
    }

    return trends;
  }

  /**
   * Generate cohort recommendations
   */
  private generateCohortRecommendations(
    cohort: CohortAnalytics, 
    mentors: (MentorPerformance | null)[], 
    students: (StudentSuccessMetrics | null)[]
  ): string[] {
    const recommendations: string[] = [];

    // Student success rate recommendations
    if (cohort.studentSuccessRate < 70) {
      recommendations.push('Implement additional support programs for struggling students');
      recommendations.push('Consider pairing struggling students with top-performing mentors');
    }

    // Mentor effectiveness recommendations
    const averageMentorRating = mentors
      .filter(mentor => mentor)
      .reduce((sum, mentor) => sum + mentor!.averageRating, 0) / mentors.length;

    if (averageMentorRating < 4.0) {
      recommendations.push('Provide additional mentor training and development programs');
      recommendations.push('Implement mentor peer support groups');
    }

    // Retention rate recommendations
    if (cohort.retentionRate < 80) {
      recommendations.push('Implement early intervention strategies for at-risk students');
      recommendations.push('Increase mentor-student check-in frequency');
    }

    // Satisfaction score recommendations
    if (cohort.satisfactionScore < 4.0) {
      recommendations.push('Conduct satisfaction surveys to identify improvement areas');
      recommendations.push('Implement feedback loops for continuous improvement');
    }

    return recommendations;
  }

  /**
   * Generate mentor effectiveness report
   */
  async generateMentorEffectivenessReport(mentorId: string): Promise<MentorEffectivenessReport> {
    try {
      const mentor = await this.getMentorPerformance(mentorId);
      if (!mentor) {
        throw new Error('Mentor not found');
      }

      const effectivenessScore = this.calculateMentorEffectivenessScore(mentor);
      
      // Analyze strengths and areas for improvement
      const strengths = this.analyzeMentorStrengths(mentor);
      const areasForImprovement = this.analyzeMentorImprovementAreas(mentor);
      const recommendations = this.generateMentorRecommendations(mentor);

      return {
        mentorId: mentor.mentorId,
        mentorName: mentor.mentorName,
        effectivenessScore,
        studentSuccessRate: mentor.studentSuccessRate,
        averageStudentProgress: mentor.studentSuccessRate, // Simplified
        studentSatisfactionScore: mentor.mentorSatisfactionScore,
        totalMentorshipHours: mentor.metrics.totalMentorshipHours,
        averageSessionRating: mentor.metrics.averageSessionRating,
        goalAchievementRate: mentor.metrics.goalAchievementRate,
        interventionSuccessRate: mentor.metrics.interventionSuccessRate,
        strengths,
        areasForImprovement,
        recommendations,
        studentFeedback: mentor.feedback
      };
    } catch (error) {
      console.error('Error generating mentor effectiveness report:', error);
      throw new Error('Failed to generate mentor effectiveness report');
    }
  }

  /**
   * Analyze mentor strengths
   */
  private analyzeMentorStrengths(mentor: MentorPerformance): string[] {
    const strengths: string[] = [];

    if (mentor.communicationScore >= 4.5) {
      strengths.push('Excellent communication skills');
    }
    if (mentor.expertiseScore >= 4.5) {
      strengths.push('High level of expertise');
    }
    if (mentor.availabilityScore >= 4.5) {
      strengths.push('High availability and responsiveness');
    }
    if (mentor.supportScore >= 4.5) {
      strengths.push('Strong support and guidance');
    }
    if (mentor.responseTime <= 2) {
      strengths.push('Quick response time');
    }
    if (mentor.studentSuccessRate >= 80) {
      strengths.push('High student success rate');
    }

    return strengths;
  }

  /**
   * Analyze mentor improvement areas
   */
  private analyzeMentorImprovementAreas(mentor: MentorPerformance): string[] {
    const areas: string[] = [];

    if (mentor.communicationScore < 3.5) {
      areas.push('Improve communication skills');
    }
    if (mentor.expertiseScore < 3.5) {
      areas.push('Enhance subject matter expertise');
    }
    if (mentor.availabilityScore < 3.5) {
      areas.push('Increase availability and responsiveness');
    }
    if (mentor.supportScore < 3.5) {
      areas.push('Strengthen support and guidance');
    }
    if (mentor.responseTime > 24) {
      areas.push('Reduce response time');
    }
    if (mentor.studentSuccessRate < 60) {
      areas.push('Improve student success outcomes');
    }

    return areas;
  }

  /**
   * Generate mentor recommendations
   */
  private generateMentorRecommendations(mentor: MentorPerformance): string[] {
    const recommendations: string[] = [];

    if (mentor.communicationScore < 4.0) {
      recommendations.push('Attend communication skills workshop');
      recommendations.push('Practice active listening techniques');
    }

    if (mentor.expertiseScore < 4.0) {
      recommendations.push('Enroll in advanced training courses');
      recommendations.push('Participate in peer knowledge sharing sessions');
    }

    if (mentor.availabilityScore < 4.0) {
      recommendations.push('Set up automated scheduling system');
      recommendations.push('Establish clear availability windows');
    }

    if (mentor.studentSuccessRate < 70) {
      recommendations.push('Implement structured goal-setting process');
      recommendations.push('Increase check-in frequency with struggling students');
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
   * Format duration
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
   * Get effectiveness status
   */
  getEffectivenessStatus(score: number): { status: string; color: string } {
    if (score >= 85) return { status: 'Excellent', color: 'green' };
    if (score >= 70) return { status: 'Good', color: 'blue' };
    if (score >= 60) return { status: 'Average', color: 'yellow' };
    if (score >= 50) return { status: 'Below Average', color: 'orange' };
    return { status: 'Poor', color: 'red' };
  }
}

export const ksmpCohortAnalyticsService = new KSMPCohortAnalyticsService();

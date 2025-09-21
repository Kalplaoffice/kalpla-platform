import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_STUDENT_PROGRESS, 
  UPDATE_STUDENT_PROGRESS,
  CREATE_COURSE_METRICS,
  UPDATE_COURSE_METRICS,
  CREATE_REVENUE_ANALYTICS,
  CREATE_STUDENT_ANALYTICS
} from '@/graphql/mutations';
import { 
  GET_STUDENT_PROGRESS,
  LIST_STUDENT_PROGRESS,
  GET_COURSE_METRICS,
  LIST_COURSE_METRICS,
  GET_REVENUE_ANALYTICS,
  LIST_REVENUE_ANALYTICS,
  GET_STUDENT_ANALYTICS,
  LIST_STUDENT_ANALYTICS
} from '@/graphql/queries';

const client = generateClient();

export interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  lastPosition: number;
  duration: number;
  percentWatched: number;
  completed: boolean;
  timeSpent: number;
  device?: string;
  timestamp: string;
}

export interface CourseMetrics {
  id: string;
  courseId: string;
  totalEnrollments: number;
  totalCompletions: number;
  averageCompletionTime: number;
  averageRating: number;
  updatedAt: string;
}

export interface RevenueAnalytics {
  id: string;
  date: string;
  totalRevenue: number;
  newEnrollments: number;
  courseSales: { courseId: string; revenue: number; enrollments: number }[];
}

export interface StudentAnalytics {
  id: string;
  studentId: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalTimeSpent: number;
  lastActivity: string;
}

export const analyticsService = {
  async recordStudentProgress(progress: StudentProgress) {
    try {
      const result = await client.graphql({ 
        query: CREATE_STUDENT_PROGRESS, 
        variables: { input: progress } 
      });
      return result.data.createStudentProgress;
    } catch (error) {
      console.error('Error recording student progress:', error);
      throw error;
    }
  },

  async updateStudentProgress(progress: StudentProgress) {
    try {
      const result = await client.graphql({ 
        query: UPDATE_STUDENT_PROGRESS, 
        variables: { input: progress } 
      });
      return result.data.updateStudentProgress;
    } catch (error) {
      console.error('Error updating student progress:', error);
      throw error;
    }
  },

  async getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress[]> {
    try {
      const result = await client.graphql({ 
        query: LIST_STUDENT_PROGRESS, 
        variables: { 
          filter: { 
            studentId: { eq: studentId },
            courseId: { eq: courseId }
          } 
        } 
      });
      return result.data.listStudentProgress.items;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  },

  async getCourseMetrics(courseId: string): Promise<CourseMetrics | null> {
    try {
      const result = await client.graphql({ 
        query: GET_COURSE_METRICS, 
        variables: { courseId } 
      });
      return result.data.getCourseMetrics;
    } catch (error) {
      console.error('Error fetching course metrics:', error);
      throw error;
    }
  },

  async getAllCourseMetrics(): Promise<CourseMetrics[]> {
    try {
      const result = await client.graphql({ 
        query: LIST_COURSE_METRICS 
      });
      return result.data.listCourseMetrics.items;
    } catch (error) {
      console.error('Error fetching all course metrics:', error);
      throw error;
    }
  },

  async getRevenueAnalytics(startDate: string, endDate: string): Promise<RevenueAnalytics[]> {
    try {
      const result = await client.graphql({ 
        query: LIST_REVENUE_ANALYTICS, 
        variables: { 
          filter: { 
            date: { 
              between: [startDate, endDate] 
            } 
          } 
        } 
      });
      return result.data.listRevenueAnalytics.items;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  async getStudentOverallAnalytics(studentId: string): Promise<StudentAnalytics | null> {
    try {
      const result = await client.graphql({ 
        query: GET_STUDENT_ANALYTICS, 
        variables: { userId: studentId } 
      });
      return result.data.getStudentAnalytics;
    } catch (error) {
      console.error('Error fetching student overall analytics:', error);
      throw error;
    }
  },

  async getDashboardData(period: 'daily' | 'weekly' | 'monthly') {
    try {
      // Calculate date range based on period
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      
      switch (period) {
        case 'daily':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }
      
      const startDateStr = startDate.toISOString().split('T')[0];
      
      // Fetch all data in parallel
      const [courseMetrics, revenueAnalytics] = await Promise.all([
        this.getAllCourseMetrics(),
        this.getRevenueAnalytics(startDateStr, endDate)
      ]);
      
      return {
        courseMetrics,
        revenueAnalytics,
        topCourses: courseMetrics.sort((a, b) => b.totalEnrollments - a.totalEnrollments).slice(0, 5),
        enrollmentTrends: revenueAnalytics.map(item => ({
          date: item.date,
          enrollments: item.newEnrollments,
          revenue: item.totalRevenue
        }))
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};
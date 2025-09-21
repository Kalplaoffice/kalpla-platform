import { generateClient } from 'aws-amplify/api';
import { 
  MARK_LESSON_COMPLETE, 
  TRACK_VIDEO_START, 
  TRACK_VIDEO_END,
  UPDATE_STUDENT_PROGRESS 
} from '../graphql/mutations';

const client = generateClient();

export interface VideoEventData {
  studentId: string;
  lessonId: string;
  eventType: 'START' | 'PAUSE' | 'RESUME' | 'END' | 'SEEK' | 'COMPLETE';
  timestamp: number;
  duration?: number;
  position?: number;
}

export interface StudentProgressData {
  studentId: string;
  courseId: string;
  lessonId: string;
  lastPosition: number;
  duration: number;
  percentWatched: number;
  completed: boolean;
  device?: string;
  sessionId?: string;
}

export const videoAnalyticsService = {
  /**
   * Mark a lesson as complete when 80% is watched
   */
  async markLessonComplete(studentId: string, lessonId: string) {
    try {
      const result = await client.graphql({
        query: MARK_LESSON_COMPLETE,
        variables: { studentId, lessonId }
      });
      return result.data.markLessonComplete;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  },

  /**
   * Track video start event
   */
  async trackVideoStart(eventData: VideoEventData) {
    try {
      const result = await client.graphql({
        query: TRACK_VIDEO_START,
        variables: { input: eventData }
      });
      return result.data.trackVideoStart;
    } catch (error) {
      console.error('Error tracking video start:', error);
      throw error;
    }
  },

  /**
   * Track video end event
   */
  async trackVideoEnd(eventData: VideoEventData) {
    try {
      const result = await client.graphql({
        query: TRACK_VIDEO_END,
        variables: { input: eventData }
      });
      return result.data.trackVideoEnd;
    } catch (error) {
      console.error('Error tracking video end:', error);
      throw error;
    }
  },

  /**
   * Update student progress
   */
  async updateStudentProgress(progressData: StudentProgressData) {
    try {
      const result = await client.graphql({
        query: UPDATE_STUDENT_PROGRESS,
        variables: { input: progressData }
      });
      return result.data.updateStudentProgress;
    } catch (error) {
      console.error('Error updating student progress:', error);
      throw error;
    }
  },

  /**
   * Auto-mark lesson complete when 80% watched
   */
  async checkAndMarkComplete(studentId: string, lessonId: string, currentTime: number, duration: number) {
    const percentWatched = (currentTime / duration) * 100;
    
    if (percentWatched >= 80) {
      try {
        await this.markLessonComplete(studentId, lessonId);
        return true;
      } catch (error) {
        console.error('Error auto-marking lesson complete:', error);
        return false;
      }
    }
    return false;
  }
};

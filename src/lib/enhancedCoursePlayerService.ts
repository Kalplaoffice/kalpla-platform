import { generateClient } from 'aws-amplify/api';
import { 
  GET_SIGNED_VIDEO_URL,
  UPDATE_VIDEO_PROGRESS,
  TRACK_VIDEO_EVENT,
  CREATE_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  CREATE_DISCUSSION,
  UPDATE_DISCUSSION,
  DELETE_DISCUSSION
} from '../graphql/mutations';
import {
  GET_VIDEO_PROGRESS,
  GET_VIDEO_ANALYTICS,
  GET_NOTES,
  GET_QUESTIONS,
  GET_DISCUSSIONS,
  GET_LESSON_DETAILS
} from '../graphql/queries';

const client = generateClient();

export interface VideoStreamingData {
  lessonId: string;
  signedUrls: {
    [quality: string]: {
      manifest: string;
      quality: string;
      bitrate: number;
      resolution: string;
    };
  };
  thumbnailUrl?: string;
  captionsUrls?: {
    [language: string]: string;
  };
  expiresIn: number;
  expiresAt: string;
  duration: number;
  title: string;
  description?: string;
  chapters?: Chapter[];
  metadata: {
    totalQualities: number;
    recommendedQuality: string;
    adaptiveStreaming: boolean;
  };
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  lessonId: string;
  userId: string;
  question: string;
  timestamp?: number;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  isInstructorAnswer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  timestamp?: number;
  replies: Reply[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  lastPosition: number;
  duration: number;
  percentWatched: number;
  completed: boolean;
  timeSpent: number;
  device?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

class EnhancedCoursePlayerService {
  /**
   * Get comprehensive video streaming data with CloudFront signed URLs
   */
  async getVideoStreamingData(lessonId: string, userId: string, userRole: string, quality: string = 'auto', duration: number = 3600): Promise<VideoStreamingData> {
    try {
      const result = await client.graphql({
        query: GET_SIGNED_VIDEO_URL,
        variables: { 
          lessonId,
          userId,
          userRole,
          quality,
          duration
        }
      });
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data.getSignedVideoUrl;
    } catch (error) {
      console.error('Error getting video streaming data:', error);
      throw new Error('Failed to get video streaming data');
    }
  }

  /**
   * Get lesson details with metadata
   */
  async getLessonDetails(lessonId: string): Promise<any> {
    try {
      const result = await client.graphql({
        query: GET_LESSON_DETAILS,
        variables: { lessonId }
      });
      
      return result.data.getLessonDetails;
    } catch (error) {
      console.error('Error getting lesson details:', error);
      throw new Error('Failed to get lesson details');
    }
  }

  /**
   * Update video progress with enhanced tracking
   */
  async updateVideoProgress(progress: Omit<LessonProgress, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await client.graphql({
        query: UPDATE_VIDEO_PROGRESS,
        variables: { 
          input: {
            ...progress,
            updatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
      throw new Error('Failed to update video progress');
    }
  }

  /**
   * Track video events for analytics
   */
  async trackVideoEvent(lessonId: string, userId: string, eventType: string, eventData: any): Promise<void> {
    try {
      await client.graphql({
        query: TRACK_VIDEO_EVENT,
        variables: {
          input: {
            lessonId,
            userId,
            eventType,
            eventData,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error tracking video event:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get user's video progress
   */
  async getVideoProgress(lessonId: string, userId: string): Promise<LessonProgress | null> {
    try {
      const result = await client.graphql({
        query: GET_VIDEO_PROGRESS,
        variables: { lessonId, userId }
      });
      
      return result.data.getVideoProgress;
    } catch (error) {
      console.error('Error getting video progress:', error);
      return null;
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(lessonId: string): Promise<any> {
    try {
      const result = await client.graphql({
        query: GET_VIDEO_ANALYTICS,
        variables: { lessonId }
      });
      
      return result.data.getVideoAnalytics;
    } catch (error) {
      console.error('Error getting video analytics:', error);
      return null;
    }
  }

  // Notes Management
  async getNotes(lessonId: string, userId: string): Promise<Note[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTES,
        variables: { lessonId, userId }
      });
      
      return result.data.getNotes || [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTE,
        variables: {
          input: {
            ...note,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.createNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  }

  async updateNote(noteId: string, content: string): Promise<Note> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTE,
        variables: {
          input: {
            id: noteId,
            content,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.updateNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_NOTE,
        variables: { input: { id: noteId } }
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  }

  // Questions Management
  async getQuestions(lessonId: string): Promise<Question[]> {
    try {
      const result = await client.graphql({
        query: GET_QUESTIONS,
        variables: { lessonId }
      });
      
      return result.data.getQuestions || [];
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }

  async createQuestion(question: Omit<Question, 'id' | 'answers' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    try {
      const result = await client.graphql({
        query: CREATE_QUESTION,
        variables: {
          input: {
            ...question,
            answers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.createQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Failed to create question');
    }
  }

  // Discussions Management
  async getDiscussions(lessonId: string): Promise<Discussion[]> {
    try {
      const result = await client.graphql({
        query: GET_DISCUSSIONS,
        variables: { lessonId }
      });
      
      return result.data.getDiscussions || [];
    } catch (error) {
      console.error('Error getting discussions:', error);
      return [];
    }
  }

  async createDiscussion(discussion: Omit<Discussion, 'id' | 'replies' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<Discussion> {
    try {
      const result = await client.graphql({
        query: CREATE_DISCUSSION,
        variables: {
          input: {
            ...discussion,
            replies: [],
            likes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.createDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw new Error('Failed to create discussion');
    }
  }

  /**
   * Refresh signed URLs before they expire
   */
  async refreshSignedUrls(lessonId: string, userId: string, userRole: string, currentUrls: VideoStreamingData): Promise<VideoStreamingData> {
    try {
      // Check if URLs are close to expiring (within 5 minutes)
      const expiresAt = new Date(currentUrls.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry > 5 * 60 * 1000) {
        // URLs are still valid, return current data
        return currentUrls;
      }
      
      // Refresh URLs
      return await this.getVideoStreamingData(lessonId, userId, userRole);
    } catch (error) {
      console.error('Error refreshing signed URLs:', error);
      throw new Error('Failed to refresh signed URLs');
    }
  }

  /**
   * Get recommended quality based on user's connection and device
   */
  getRecommendedQuality(userRole: string, connectionSpeed?: number): string {
    if (userRole === 'instructor' || userRole === 'admin') {
      return '1080p';
    }
    
    if (connectionSpeed) {
      if (connectionSpeed > 5000) return '1080p';
      if (connectionSpeed > 3000) return '720p';
      if (connectionSpeed > 1500) return '480p';
      return '360p';
    }
    
    return '720p'; // Default recommendation
  }

  /**
   * Detect connection speed for quality recommendation
   */
  async detectConnectionSpeed(): Promise<number> {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/connection-test', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      
      if (response.ok) {
        // Estimate speed based on response time (rough approximation)
        const responseTime = endTime - startTime;
        return Math.max(1000, 10000 - responseTime); // Return estimated kbps
      }
      
      return 3000; // Default fallback
    } catch (error) {
      console.warn('Connection speed detection failed:', error);
      return 3000; // Default fallback
    }
  }

  /**
   * Get video quality options with metadata
   */
  getVideoQualityOptions(signedUrls: VideoStreamingData['signedUrls']): Array<{
    quality: string;
    bitrate: number;
    resolution: string;
    manifest: string;
  }> {
    return Object.values(signedUrls).map(urlData => ({
      quality: urlData.quality,
      bitrate: urlData.bitrate,
      resolution: urlData.resolution,
      manifest: urlData.manifest
    })).sort((a, b) => b.bitrate - a.bitrate); // Sort by bitrate descending
  }

  /**
   * Format time for display
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(currentTime: number, duration: number): number {
    if (duration === 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }

  /**
   * Check if video is near completion
   */
  isNearCompletion(currentTime: number, duration: number, threshold: number = 0.95): boolean {
    return this.calculateProgress(currentTime, duration) >= threshold * 100;
  }
}

export const enhancedCoursePlayerService = new EnhancedCoursePlayerService();

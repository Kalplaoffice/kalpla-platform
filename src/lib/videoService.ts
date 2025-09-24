import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { 
  GET_SIGNED_VIDEO_URL,
  UPLOAD_VIDEO,
  PROCESS_VIDEO,
  UPDATE_VIDEO_PROGRESS,
  TRACK_VIDEO_EVENT,
  SUBMIT_INTERACTIVE_RESPONSE,
  CREATE_LIVE_SESSION,
  UPDATE_INTERACTIVE_TIMELINE
} from '../graphql/mutations';
import {
  GET_VIDEO_PROGRESS,
  GET_VIDEO_ANALYTICS,
  GET_INTERACTIVE_TIMELINE,
  GET_PROCESSING_STATUS,
  GET_VIDEO_MANIFEST_URL,
  GET_VIDEO_QUALITIES,
  GET_SIGNED_VIDEO_URL as getSignedVideoUrl
} from '../graphql/queries';

const client = generateClient();

export interface VideoProgress {
  lessonId: string;
  lastPosition: number;
  duration: number;
  percentWatched: number;
  completed: boolean;
  timeSpent: number;
  device?: string;
  sessionId?: string;
}

export interface VideoAnalytics {
  lessonId: string;
  totalViews: number;
  averageWatchTime: number;
  completionRate: number;
  dropOffPoints: number[];
  engagementScore: number;
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'note' | 'link';
  timestamp: number;
  duration: number;
  content: any;
  responses?: any[];
}

export interface InteractiveTimeline {
  lessonId: string;
  elements: InteractiveElement[];
  version: number;
  lastUpdated: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  instructorId: string;
  courseId: string;
  meetingUrl?: string;
  recordingUrl?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  attendees: string[];
}

class VideoService {
  /**
   * Get signed URL for video playback
   */
  async getSignedVideoUrl(lessonId: string): Promise<string> {
    try {
      const result = await client.graphql({
        query: getSignedVideoUrl,
        variables: { lessonId }
      });
      
      return result.data.getSignedVideoUrl;
    } catch (error) {
      console.error('Error getting signed video URL:', error);
      throw new Error('Failed to get video URL');
    }
  }

  /**
   * Get video progress for a user
   */
  async getVideoProgress(lessonId: string, userId: string): Promise<VideoProgress | null> {
    try {
      const result = await client.graphql({
        query: getVideoProgress,
        variables: { lessonId, userId }
      });
      
      return result.data.getVideoProgress;
    } catch (error) {
      console.error('Error getting video progress:', error);
      throw new Error('Failed to get video progress');
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(lessonId: string): Promise<VideoAnalytics | null> {
    try {
      const result = await client.graphql({
        query: getVideoAnalytics,
        variables: { lessonId }
      });
      
      return result.data.getVideoAnalytics;
    } catch (error) {
      console.error('Error getting video analytics:', error);
      throw new Error('Failed to get video analytics');
    }
  }

  /**
   * Get interactive timeline for a lesson
   */
  async getInteractiveTimeline(lessonId: string): Promise<InteractiveTimeline | null> {
    try {
      const result = await client.graphql({
        query: getInteractiveTimeline,
        variables: { lessonId }
      });
      
      return result.data.getInteractiveTimeline;
    } catch (error) {
      console.error('Error getting interactive timeline:', error);
      throw new Error('Failed to get interactive timeline');
    }
  }

  /**
   * Upload video file with enhanced progress tracking
   */
  async uploadVideoFile(file: File, lessonId: string, onProgress?: (progress: number) => void): Promise<string> {
    try {
      // Upload to S3 with progress tracking
      const fileName = `lesson_${lessonId}_${Date.now()}.${file.name.split('.').pop()}`;
      const key = `videos/raw/${lessonId}/${fileName}`;
      
      const uploadResult = await uploadData({
        key: key,
        data: file,
        options: {
          contentType: file.type,
          level: 'private',
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (onProgress && totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              onProgress(progress);
            }
          }
        }
      }).result;

      // Trigger video processing
      const result = await client.graphql({
        query: processVideo,
        variables: { 
          lessonId,
          videoKey: uploadResult.key,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type
        }
      });

      return result.data.processVideo.jobId;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Get processing status for a video
   */
  async getProcessingStatus(lessonId: string): Promise<string> {
    try {
      const result = await client.graphql({
        query: getProcessingStatus,
        variables: { lessonId }
      });
      
      return result.data.getProcessingStatus.status;
    } catch (error) {
      console.error('Error getting processing status:', error);
      throw new Error('Failed to get processing status');
    }
  }

  /**
   * Get video manifest URL for adaptive streaming
   */
  async getVideoManifestUrl(lessonId: string): Promise<string> {
    try {
      const result = await client.graphql({
        query: getVideoManifestUrl,
        variables: { lessonId }
      });
      
      return result.data.getVideoManifestUrl.url;
    } catch (error) {
      console.error('Error getting video manifest URL:', error);
      throw new Error('Failed to get video manifest URL');
    }
  }

  /**
   * Get available video qualities for a lesson
   */
  async getVideoQualities(lessonId: string): Promise<Array<{quality: string, bitrate: number, url: string}>> {
    try {
      const result = await client.graphql({
        query: getVideoQualities,
        variables: { lessonId }
      });
      
      return result.data.getVideoQualities.qualities;
    } catch (error) {
      console.error('Error getting video qualities:', error);
      throw new Error('Failed to get video qualities');
    }
  }

  /**
   * Update video progress
   */
  async updateVideoProgress(progress: VideoProgress, userId: string): Promise<void> {
    try {
      await client.graphql({
        query: updateVideoProgress,
        variables: { 
          input: {
            ...progress,
            userId,
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
   * Track video event
   */
  async trackVideoEvent(
    lessonId: string, 
    userId: string, 
    eventType: string, 
    eventData: any
  ): Promise<void> {
    try {
      await client.graphql({
        query: trackVideoEvent,
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
      throw new Error('Failed to track video event');
    }
  }

  /**
   * Submit interactive response
   */
  async submitInteractiveResponse(
    lessonId: string,
    userId: string,
    elementId: string,
    response: any
  ): Promise<void> {
    try {
      await client.graphql({
        query: submitInteractiveResponse,
        variables: {
          input: {
            lessonId,
            userId,
            elementId,
            response,
            submittedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error submitting interactive response:', error);
      throw new Error('Failed to submit interactive response');
    }
  }

  /**
   * Create live session
   */
  async createLiveSession(sessionData: Omit<LiveSession, 'id'>): Promise<LiveSession> {
    try {
      const result = await client.graphql({
        query: createLiveSession,
        variables: { input: sessionData }
      });
      
      return result.data.createLiveSession;
    } catch (error) {
      console.error('Error creating live session:', error);
      throw new Error('Failed to create live session');
    }
  }

  /**
   * Update interactive timeline
   */
  async updateInteractiveTimeline(
    lessonId: string,
    elements: InteractiveElement[]
  ): Promise<InteractiveTimeline> {
    try {
      const result = await client.graphql({
        query: updateInteractiveTimeline,
        variables: {
          input: {
            lessonId,
            elements,
            version: Date.now(),
            lastUpdated: new Date().toISOString()
          }
        }
      });
      
      return result.data.updateInteractiveTimeline;
    } catch (error) {
      console.error('Error updating interactive timeline:', error);
      throw new Error('Failed to update interactive timeline');
    }
  }

  /**
   * Get video thumbnail URL
   */
  async getVideoThumbnailUrl(videoKey: string): Promise<string> {
    try {
      const url = await getUrl({
        key: videoKey,
        options: {
          level: 'private',
          expiresIn: 3600 // 1 hour
        }
      });
      
      return url.url.toString();
    } catch (error) {
      console.error('Error getting video thumbnail URL:', error);
      throw new Error('Failed to get video thumbnail URL');
    }
  }
}

export const videoService = new VideoService();
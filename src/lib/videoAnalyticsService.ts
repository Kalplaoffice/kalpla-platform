import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export interface VideoEvent {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  eventType: VideoEventType;
  eventDetails: VideoEventDetails;
  timestamp: string;
  createdAt: string;
}

export type VideoEventType = 
  | 'PLAY' 
  | 'PAUSE' 
  | 'SEEK' 
  | 'COMPLETE' 
  | 'QUALITY_CHANGE' 
  | 'VOLUME_CHANGE' 
  | 'BUFFER_START' 
  | 'BUFFER_END' 
  | 'ERROR' 
  | 'SESSION_START' 
  | 'SESSION_END';

export interface VideoEventDetails {
  currentTime?: number;
  duration?: number;
  quality?: string;
  volume?: number;
  fromTime?: number;
  toTime?: number;
  errorMessage?: string;
  deviceInfo?: DeviceInfo;
  sessionId?: string;
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  connectionType?: string;
  connectionSpeed?: number;
  platform: string;
  browser: string;
}

export interface VideoSession {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  sessionData: SessionData;
  timestamp: string;
  createdAt: string;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalWatchTime: number;
  playCount: number;
  pauseCount: number;
  seekCount: number;
  qualityChanges: number;
  volumeChanges: number;
  completionCount: number;
  deviceInfo: DeviceInfo;
}

export interface VideoEngagement {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  engagementData: EngagementData;
  engagementMetrics: EngagementMetrics;
  timestamp: string;
  createdAt: string;
}

export interface EngagementData {
  totalWatchTime: number;
  totalDuration: number;
  playCount: number;
  pauseCount: number;
  seekCount: number;
  completionCount: number;
  sessionCount: number;
  qualityChanges: number;
  volumeChanges: number;
  notesCount: number;
  questionsCount: number;
  discussionsCount: number;
}

export interface EngagementMetrics {
  engagementScore: number;
  totalSessions: number;
  averageWatchTime: number;
  completionRate: number;
  watchTimeRatio: number;
  interactionScore: number;
  playCount: number;
  pauseCount: number;
  seekCount: number;
}

class VideoAnalyticsService {
  private sessionId: string | null = null;
  private sessionStartTime: number = 0;
  private sessionData: Partial<SessionData> = {};
  private eventQueue: VideoEvent[] = [];
  private isProcessing = false;

  /**
   * Initialize a new video session
   */
  async initializeSession(userId: string, courseId: string, lessonId: string): Promise<string> {
    try {
      this.sessionId = `${userId}_${lessonId}_${Date.now()}`;
      this.sessionStartTime = Date.now();
      
      this.sessionData = {
        sessionId: this.sessionId,
        startTime: this.sessionStartTime,
        totalWatchTime: 0,
        playCount: 0,
        pauseCount: 0,
        seekCount: 0,
        qualityChanges: 0,
        volumeChanges: 0,
        completionCount: 0,
        deviceInfo: this.getDeviceInfo()
      };

      await this.trackEvent(userId, courseId, lessonId, 'SESSION_START', {
        sessionId: this.sessionId,
        deviceInfo: this.sessionData.deviceInfo
      });

      return this.sessionId;
    } catch (error) {
      console.error('Error initializing session:', error);
      throw new Error('Failed to initialize video session');
    }
  }

  /**
   * Track video play event
   */
  async trackPlay(userId: string, courseId: string, lessonId: string, currentTime: number, duration: number, quality: string): Promise<void> {
    try {
      this.sessionData.playCount = (this.sessionData.playCount || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'PLAY', {
        currentTime,
        duration,
        quality,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking play event:', error);
    }
  }

  /**
   * Track video pause event
   */
  async trackPause(userId: string, courseId: string, lessonId: string, currentTime: number, duration: number): Promise<void> {
    try {
      this.sessionData.pauseCount = (this.sessionData.pauseCount || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'PAUSE', {
        currentTime,
        duration,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking pause event:', error);
    }
  }

  /**
   * Track video seek event
   */
  async trackSeek(userId: string, courseId: string, lessonId: string, fromTime: number, toTime: number): Promise<void> {
    try {
      this.sessionData.seekCount = (this.sessionData.seekCount || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'SEEK', {
        fromTime,
        toTime,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking seek event:', error);
    }
  }

  /**
   * Track video completion event
   */
  async trackComplete(userId: string, courseId: string, lessonId: string, duration: number, quality: string): Promise<void> {
    try {
      this.sessionData.completionCount = (this.sessionData.completionCount || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'COMPLETE', {
        currentTime: duration,
        duration,
        quality,
        sessionId: this.sessionId
      });

      await this.endSession(userId, courseId, lessonId);
    } catch (error) {
      console.error('Error tracking complete event:', error);
    }
  }

  /**
   * Track quality change event
   */
  async trackQualityChange(userId: string, courseId: string, lessonId: string, fromQuality: string, toQuality: string, currentTime: number): Promise<void> {
    try {
      this.sessionData.qualityChanges = (this.sessionData.qualityChanges || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'QUALITY_CHANGE', {
        currentTime,
        fromQuality,
        toQuality,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking quality change event:', error);
    }
  }

  /**
   * Track volume change event
   */
  async trackVolumeChange(userId: string, courseId: string, lessonId: string, volume: number, currentTime: number): Promise<void> {
    try {
      this.sessionData.volumeChanges = (this.sessionData.volumeChanges || 0) + 1;
      
      await this.trackEvent(userId, courseId, lessonId, 'VOLUME_CHANGE', {
        currentTime,
        volume,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking volume change event:', error);
    }
  }

  /**
   * Track buffer events
   */
  async trackBufferStart(userId: string, courseId: string, lessonId: string, currentTime: number): Promise<void> {
    try {
      await this.trackEvent(userId, courseId, lessonId, 'BUFFER_START', {
        currentTime,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking buffer start event:', error);
    }
  }

  async trackBufferEnd(userId: string, courseId: string, lessonId: string, currentTime: number): Promise<void> {
    try {
      await this.trackEvent(userId, courseId, lessonId, 'BUFFER_END', {
        currentTime,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking buffer end event:', error);
    }
  }

  /**
   * Track error events
   */
  async trackError(userId: string, courseId: string, lessonId: string, errorMessage: string, currentTime: number): Promise<void> {
    try {
      await this.trackEvent(userId, courseId, lessonId, 'ERROR', {
        currentTime,
        errorMessage,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Error tracking error event:', error);
    }
  }

  /**
   * Update watch time
   */
  updateWatchTime(watchTime: number): void {
    this.sessionData.totalWatchTime = watchTime;
  }

  /**
   * End video session
   */
  async endSession(userId: string, courseId: string, lessonId: string): Promise<void> {
    try {
      if (!this.sessionId) return;

      this.sessionData.endTime = Date.now();
      
      await this.trackEvent(userId, courseId, lessonId, 'SESSION_END', {
        sessionId: this.sessionId,
        totalWatchTime: this.sessionData.totalWatchTime || 0
      });

      await this.storeSessionData(userId, courseId, lessonId);
      await this.calculateEngagementMetrics(userId, courseId, lessonId);

      this.sessionId = null;
      this.sessionStartTime = 0;
      this.sessionData = {};
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  /**
   * Track generic video event
   */
  private async trackEvent(userId: string, courseId: string, lessonId: string, eventType: VideoEventType, eventDetails: VideoEventDetails): Promise<void> {
    try {
      const event: VideoEvent = {
        id: `${userId}_${lessonId}_${Date.now()}`,
        userId,
        courseId,
        lessonId,
        eventType,
        eventDetails: {
          ...eventDetails,
          deviceInfo: this.getDeviceInfo()
        },
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      this.eventQueue.push(event);

      if (this.eventQueue.length >= 10) {
        await this.processEventQueue();
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Process event queue
   */
  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];

    try {
      for (const event of eventsToProcess) {
        await client.graphql({
          query: TRACK_VIDEO_EVENT,
          variables: {
            input: {
              userId: event.userId,
              courseId: event.courseId,
              lessonId: event.lessonId,
              eventType: event.eventType,
              eventDetails: event.eventDetails,
              timestamp: event.timestamp
            }
          }
        });
      }
    } catch (error) {
      console.error('Error processing event queue:', error);
      this.eventQueue.unshift(...eventsToProcess);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Store session data
   */
  private async storeSessionData(userId: string, courseId: string, lessonId: string): Promise<void> {
    try {
      await client.graphql({
        query: CREATE_VIDEO_SESSION,
        variables: {
          input: {
            userId,
            courseId,
            lessonId,
            sessionData: this.sessionData,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error storing session data:', error);
    }
  }

  /**
   * Calculate engagement metrics
   */
  private async calculateEngagementMetrics(userId: string, courseId: string, lessonId: string): Promise<void> {
    try {
      const engagementData: EngagementData = {
        totalWatchTime: this.sessionData.totalWatchTime || 0,
        totalDuration: 0,
        playCount: this.sessionData.playCount || 0,
        pauseCount: this.sessionData.pauseCount || 0,
        seekCount: this.sessionData.seekCount || 0,
        completionCount: this.sessionData.completionCount || 0,
        sessionCount: 1,
        qualityChanges: this.sessionData.qualityChanges || 0,
        volumeChanges: this.sessionData.volumeChanges || 0,
        notesCount: 0,
        questionsCount: 0,
        discussionsCount: 0
      };

      await client.graphql({
        query: UPDATE_VIDEO_ENGAGEMENT,
        variables: {
          input: {
            userId,
            courseId,
            lessonId,
            engagementData,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error calculating engagement metrics:', error);
    }
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    
    let platform = 'unknown';
    if (userAgent.includes('Windows')) platform = 'windows';
    else if (userAgent.includes('Mac')) platform = 'mac';
    else if (userAgent.includes('Linux')) platform = 'linux';
    else if (userAgent.includes('Android')) platform = 'android';
    else if (userAgent.includes('iOS')) platform = 'ios';

    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Edge')) browser = 'edge';

    return {
      userAgent,
      screenResolution,
      platform,
      browser
    };
  }

  /**
   * Process any remaining events in queue
   */
  async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length > 0) {
      await this.processEventQueue();
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Get current session data
   */
  getCurrentSessionData(): Partial<SessionData> {
    return { ...this.sessionData };
  }
}

export const videoAnalyticsService = new VideoAnalyticsService();
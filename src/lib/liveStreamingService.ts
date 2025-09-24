import { generateClient } from 'aws-amplify/api';
import { IVSClient, CreateChannelCommand, GetStreamKeyCommand, ListStreamKeysCommand, DeleteChannelCommand } from '@aws-sdk/client-ivs';
import { 
  CREATE_LIVE_SESSION,
  UPDATE_LIVE_SESSION,
  DELETE_LIVE_SESSION,
  START_LIVE_RECORDING,
  STOP_LIVE_RECORDING,
  CREATE_LIVE_CHAT_MESSAGE,
  UPDATE_LIVE_ATTENDANCE
} from '../graphql/mutations';
import {
  GET_LIVE_SESSION,
  GET_LIVE_SESSIONS,
  GET_LIVE_RECORDING,
  GET_LIVE_CHAT_MESSAGES,
  GET_LIVE_ATTENDANCE
} from '../graphql/queries';

const client = generateClient();

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  courseId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: LiveSessionStatus;
  streamKey: string;
  playbackUrl: string;
  recordingUrl?: string;
  thumbnailUrl?: string;
  maxAttendees: number;
  currentAttendees: number;
  attendees: string[];
  settings: LiveSessionSettings;
  metadata: LiveSessionMetadata;
  createdAt: string;
  updatedAt: string;
}

export type LiveSessionStatus = 
  | 'scheduled' 
  | 'live' 
  | 'ended' 
  | 'cancelled' 
  | 'recording';

export interface LiveSessionSettings {
  allowChat: boolean;
  allowScreenShare: boolean;
  allowAttendeeVideo: boolean;
  allowAttendeeAudio: boolean;
  requireApproval: boolean;
  autoRecord: boolean;
  recordToS3: boolean;
  s3Bucket?: string;
  s3Key?: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  maxBitrate: number;
  resolution: string;
  framerate: number;
}

export interface LiveSessionMetadata {
  duration: number;
  totalViews: number;
  peakViewers: number;
  averageViewers: number;
  chatMessages: number;
  recordings: number;
  engagementScore: number;
}

export interface LiveRecording {
  id: string;
  sessionId: string;
  recordingId: string;
  status: 'pending' | 'recording' | 'processing' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  s3Bucket: string;
  s3Key: string;
  s3Url?: string;
  thumbnailUrl?: string;
  metadata: RecordingMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface RecordingMetadata {
  resolution: string;
  framerate: number;
  bitrate: number;
  codec: string;
  fileSize?: number;
  duration?: number;
  quality: string;
}

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  messageType: 'text' | 'emoji' | 'question' | 'answer';
  timestamp: string;
  isModerator: boolean;
  isInstructor: boolean;
  isPinned: boolean;
  replies: ChatReply[];
  likes: number;
  createdAt: string;
}

export interface ChatReply {
  id: string;
  messageId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  createdAt: string;
}

export interface LiveAttendance {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  joinTime: string;
  leaveTime?: string;
  duration: number;
  deviceInfo: DeviceInfo;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  lastSeen: string;
  isActive: boolean;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  screenResolution: string;
  connectionType?: string;
  connectionSpeed?: number;
}

export interface IVSStreamConfig {
  channelArn: string;
  streamKey: string;
  playbackUrl: string;
  ingestEndpoint: string;
  recordingConfigurationArn?: string;
}

class LiveStreamingService {
  private ivsClient: IVSClient;
  private eventBridgeClient: any = null;

  constructor() {
    this.initializeAWS();
  }

  private async initializeAWS() {
    try {
      // Initialize IVS client with proper configuration
      this.ivsClient = new IVSClient({ 
        region: 'ap-south-1',
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
        }
      });
      
      console.log('✅ IVS Client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AWS clients:', error);
      throw error;
    }
  }

  /**
   * Create a new live session
   */
  async createLiveSession(session: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'streamKey' | 'playbackUrl' | 'currentAttendees' | 'attendees' | 'metadata'>): Promise<LiveSession> {
    try {
      // Create IVS channel
      const channelConfig = await this.createIVSChannel(session.title, session.settings);
      
      const sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt'> = {
        ...session,
        streamKey: channelConfig.streamKey,
        playbackUrl: channelConfig.playbackUrl,
        currentAttendees: 0,
        attendees: [],
        metadata: {
          duration: 0,
          totalViews: 0,
          peakViewers: 0,
          averageViewers: 0,
          chatMessages: 0,
          recordings: 0,
          engagementScore: 0
        }
      };

      const result = await client.graphql({
        query: CREATE_LIVE_SESSION,
        variables: {
          input: {
            ...sessionData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createLiveSession;
    } catch (error) {
      console.error('Error creating live session:', error);
      throw new Error('Failed to create live session');
    }
  }

  /**
   * Start a live session
   */
  async startLiveSession(sessionId: string): Promise<LiveSession> {
    try {
      const result = await client.graphql({
        query: UPDATE_LIVE_SESSION,
        variables: {
          input: {
            id: sessionId,
            status: 'live',
            actualStartTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      const session = result.data.updateLiveSession;

      // Start auto-recording if enabled
      if (session.settings.autoRecord) {
        await this.startRecording(sessionId);
      }

      // Set up event monitoring
      await this.setupEventMonitoring(sessionId);

      return session;
    } catch (error) {
      console.error('Error starting live session:', error);
      throw new Error('Failed to start live session');
    }
  }

  /**
   * End a live session
   */
  async endLiveSession(sessionId: string): Promise<LiveSession> {
    try {
      const result = await client.graphql({
        query: UPDATE_LIVE_SESSION,
        variables: {
          input: {
            id: sessionId,
            status: 'ended',
            actualEndTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      const session = result.data.updateLiveSession;

      // Stop recording if active
      await this.stopRecording(sessionId);

      // Process final analytics
      await this.processSessionAnalytics(sessionId);

      return session;
    } catch (error) {
      console.error('Error ending live session:', error);
      throw new Error('Failed to end live session');
    }
  }

  /**
   * Start recording a live session
   */
  async startRecording(sessionId: string): Promise<LiveRecording> {
    try {
      const session = await this.getLiveSession(sessionId);
      
      // Create recording configuration if not exists
      let recordingConfigArn = session.settings.s3Bucket ? 
        await this.createRecordingConfiguration(session.settings.s3Bucket, session.settings.s3Key) : 
        undefined;

      // Start IVS recording
      const recordingParams = {
        channelArn: session.streamKey, // This should be channelArn
        ...(recordingConfigArn && { recordingConfigurationArn: recordingConfigArn })
      };

      const ivsRecording = await this.ivsClient.startStream({
        ...recordingParams
      }).promise();

      // Create recording record
      const result = await client.graphql({
        query: START_LIVE_RECORDING,
        variables: {
          input: {
            sessionId,
            recordingId: ivsRecording.recordingId,
            status: 'recording',
            startTime: new Date().toISOString(),
            s3Bucket: session.settings.s3Bucket || 'kalpla-recordings',
            s3Key: session.settings.s3Key || `recordings/${sessionId}/${Date.now()}`,
            metadata: {
              resolution: session.settings.resolution,
              framerate: session.settings.framerate,
              bitrate: session.settings.maxBitrate,
              codec: 'H264',
              quality: session.settings.quality
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.startLiveRecording;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording');
    }
  }

  /**
   * Stop recording a live session
   */
  async stopRecording(sessionId: string): Promise<LiveRecording> {
    try {
      const recording = await this.getActiveRecording(sessionId);
      
      // Stop IVS recording
      await this.ivsClient.stopStream({
        recordingId: recording.recordingId
      }).promise();

      // Update recording record
      const result = await client.graphql({
        query: STOP_LIVE_RECORDING,
        variables: {
          input: {
            id: recording.id,
            status: 'processing',
            endTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Process recording asynchronously
      this.processRecording(recording.id);

      return result.data.stopLiveRecording;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw new Error('Failed to stop recording');
    }
  }

  /**
   * Get live session details
   */
  async getLiveSession(sessionId: string): Promise<LiveSession> {
    try {
      const result = await client.graphql({
        query: GET_LIVE_SESSION,
        variables: { sessionId }
      });

      return result.data.getLiveSession;
    } catch (error) {
      console.error('Error getting live session:', error);
      throw new Error('Failed to get live session');
    }
  }

  /**
   * Get live sessions for a course
   */
  async getLiveSessions(courseId: string, status?: LiveSessionStatus): Promise<LiveSession[]> {
    try {
      const result = await client.graphql({
        query: GET_LIVE_SESSIONS,
        variables: { courseId, status }
      });

      return result.data.getLiveSessions || [];
    } catch (error) {
      console.error('Error getting live sessions:', error);
      return [];
    }
  }

  /**
   * Join a live session
   */
  async joinLiveSession(sessionId: string, userId: string): Promise<LiveAttendance> {
    try {
      const result = await client.graphql({
        query: UPDATE_LIVE_ATTENDANCE,
        variables: {
          input: {
            sessionId,
            userId,
            joinTime: new Date().toISOString(),
            deviceInfo: this.getDeviceInfo(),
            connectionQuality: 'good',
            lastSeen: new Date().toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update session attendee count
      await this.updateAttendeeCount(sessionId);

      return result.data.updateLiveAttendance;
    } catch (error) {
      console.error('Error joining live session:', error);
      throw new Error('Failed to join live session');
    }
  }

  /**
   * Leave a live session
   */
  async leaveLiveSession(sessionId: string, userId: string): Promise<void> {
    try {
      await client.graphql({
        query: UPDATE_LIVE_ATTENDANCE,
        variables: {
          input: {
            sessionId,
            userId,
            leaveTime: new Date().toISOString(),
            isActive: false,
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update session attendee count
      await this.updateAttendeeCount(sessionId);
    } catch (error) {
      console.error('Error leaving live session:', error);
    }
  }

  /**
   * Send chat message
   */
  async sendChatMessage(sessionId: string, userId: string, message: string, messageType: 'text' | 'emoji' | 'question' | 'answer' = 'text'): Promise<LiveChatMessage> {
    try {
      const result = await client.graphql({
        query: CREATE_LIVE_CHAT_MESSAGE,
        variables: {
          input: {
            sessionId,
            userId,
            message,
            messageType,
            timestamp: new Date().toISOString(),
            isModerator: false,
            isInstructor: false,
            isPinned: false,
            replies: [],
            likes: 0,
            createdAt: new Date().toISOString()
          }
        }
      });

      return result.data.createLiveChatMessage;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Failed to send chat message');
    }
  }

  /**
   * Get chat messages for a session
   */
  async getChatMessages(sessionId: string, limit: number = 100): Promise<LiveChatMessage[]> {
    try {
      const result = await client.graphql({
        query: GET_LIVE_CHAT_MESSAGES,
        variables: { sessionId, limit }
      });

      return result.data.getLiveChatMessages || [];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  /**
   * Get live attendance
   */
  async getLiveAttendance(sessionId: string): Promise<LiveAttendance[]> {
    try {
      const result = await client.graphql({
        query: GET_LIVE_ATTENDANCE,
        variables: { sessionId }
      });

      return result.data.getLiveAttendance || [];
    } catch (error) {
      console.error('Error getting live attendance:', error);
      return [];
    }
  }

  /**
   * Create IVS channel
   */
  private async createIVSChannel(name: string, settings: LiveSessionSettings): Promise<IVSStreamConfig> {
    try {
      // Create channel
      const channelCommand = new CreateChannelCommand({
        name: `kalpla-${name}-${Date.now()}`,
        type: 'BASIC',
        latencyMode: 'LOW',
        authorized: false,
        recordingConfigurationArn: settings.autoRecord ? 
          await this.createRecordingConfiguration(settings.s3Bucket, settings.s3Key) : 
          undefined
      });

      const channelResponse = await this.ivsClient.send(channelCommand);
      
      if (!channelResponse.channel?.arn) {
        throw new Error('Failed to create IVS channel');
      }

      // Get stream key
      const streamKeyCommand = new GetStreamKeyCommand({
        channelArn: channelResponse.channel.arn
      });

      const streamKeyResponse = await this.ivsClient.send(streamKeyCommand);

      if (!streamKeyResponse.streamKey?.value) {
        throw new Error('Failed to get stream key');
      }

      return {
        channelArn: channelResponse.channel.arn,
        streamKey: streamKeyResponse.streamKey.value,
        playbackUrl: channelResponse.channel.playbackUrl || '',
        ingestEndpoint: channelResponse.channel.ingestEndpoint || '',
        recordingConfigurationArn: channelResponse.channel.recordingConfigurationArn
      };
    } catch (error) {
      console.error('Error creating IVS channel:', error);
      throw new Error('Failed to create IVS channel');
    }
  }

  /**
   * Create recording configuration
   */
  private async createRecordingConfiguration(s3Bucket?: string, s3Key?: string): Promise<string> {
    try {
      const configParams = {
        name: `kalpla-recording-${Date.now()}`,
        destinationConfiguration: {
          s3: {
            bucketName: s3Bucket || 'kalpla-recordings',
            ...(s3Key && { prefix: s3Key })
          }
        },
        thumbnailConfiguration: {
          recordingMode: 'INTERVAL',
          targetIntervalSeconds: 30
        }
      };

      const config = await this.ivsClient.createRecordingConfiguration(configParams).promise();
      return config.recordingConfiguration.arn;
    } catch (error) {
      console.error('Error creating recording configuration:', error);
      throw new Error('Failed to create recording configuration');
    }
  }

  /**
   * Setup event monitoring
   */
  private async setupEventMonitoring(sessionId: string): Promise<void> {
    try {
      // Set up EventBridge rules for IVS events
      const ruleParams = {
        Name: `kalpla-live-session-${sessionId}`,
        Description: `Event monitoring for live session ${sessionId}`,
        EventPattern: JSON.stringify({
          source: ['aws.ivs'],
          'detail-type': ['IVS Stream State Change']
        }),
        State: 'ENABLED',
        Targets: [{
          Arn: process.env.LIVE_SESSION_EVENT_HANDLER_ARN,
          Id: '1',
          Input: JSON.stringify({ sessionId })
        }]
      };

      await this.eventBridgeClient.putRule(ruleParams).promise();
    } catch (error) {
      console.error('Error setting up event monitoring:', error);
    }
  }

  /**
   * Process session analytics
   */
  private async processSessionAnalytics(sessionId: string): Promise<void> {
    try {
      const attendance = await this.getLiveAttendance(sessionId);
      const chatMessages = await this.getChatMessages(sessionId);
      
      const analytics = {
        totalViews: attendance.length,
        peakViewers: Math.max(...attendance.map(a => 1)), // Simplified
        averageViewers: attendance.length,
        chatMessages: chatMessages.length,
        engagementScore: this.calculateEngagementScore(attendance, chatMessages)
      };

      await client.graphql({
        query: UPDATE_LIVE_SESSION,
        variables: {
          input: {
            id: sessionId,
            metadata: analytics,
            updatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error processing session analytics:', error);
    }
  }

  /**
   * Process recording
   */
  private async processRecording(recordingId: string): Promise<void> {
    try {
      // This would typically be handled by a Lambda function
      // that processes the recording and updates the database
      console.log(`Processing recording: ${recordingId}`);
    } catch (error) {
      console.error('Error processing recording:', error);
    }
  }

  /**
   * Update attendee count
   */
  private async updateAttendeeCount(sessionId: string): Promise<void> {
    try {
      const attendance = await this.getLiveAttendance(sessionId);
      const activeAttendees = attendance.filter(a => a.isActive).length;

      await client.graphql({
        query: UPDATE_LIVE_SESSION,
        variables: {
          input: {
            id: sessionId,
            currentAttendees: activeAttendees,
            updatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error updating attendee count:', error);
    }
  }

  /**
   * Get active recording
   */
  private async getActiveRecording(sessionId: string): Promise<LiveRecording> {
    try {
      const result = await client.graphql({
        query: GET_LIVE_RECORDING,
        variables: { sessionId, status: 'recording' }
      });

      return result.data.getLiveRecording;
    } catch (error) {
      console.error('Error getting active recording:', error);
      throw new Error('Failed to get active recording');
    }
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(attendance: LiveAttendance[], chatMessages: LiveChatMessage[]): number {
    const totalDuration = attendance.reduce((sum, a) => sum + a.duration, 0);
    const avgDuration = totalDuration / attendance.length;
    const chatEngagement = chatMessages.length / Math.max(attendance.length, 1);
    
    return Math.min(100, Math.round((avgDuration / 3600) * 50 + chatEngagement * 50));
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    
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
      platform,
      browser,
      screenResolution: `${screen.width}x${screen.height}`
    };
  }

  /**
   * Format duration
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get stream status
   */
  async getStreamStatus(channelArn: string): Promise<any> {
    try {
      const result = await this.ivsClient.getStream({
        channelArn
      }).promise();

      return result.stream;
    } catch (error) {
      console.error('Error getting stream status:', error);
      return null;
    }
  }

  /**
   * Create live channel for instructor
   */
  async createLiveChannel(instructorId: string, channelName?: string): Promise<IVSStreamConfig> {
    try {
      const name = channelName || `instructor-${instructorId}-${Date.now()}`;
      
      // Create channel
      const channelCommand = new CreateChannelCommand({
        name: name,
        type: 'BASIC',
        latencyMode: 'LOW',
        authorized: false
      });

      const channelResponse = await this.ivsClient.send(channelCommand);
      
      if (!channelResponse.channel?.arn) {
        throw new Error('Failed to create IVS channel');
      }

      // Get stream key
      const streamKeyCommand = new GetStreamKeyCommand({
        channelArn: channelResponse.channel.arn
      });

      const streamKeyResponse = await this.ivsClient.send(streamKeyCommand);

      if (!streamKeyResponse.streamKey?.value) {
        throw new Error('Failed to get stream key');
      }

      const config = {
        channelArn: channelResponse.channel.arn,
        streamKey: streamKeyResponse.streamKey.value,
        playbackUrl: channelResponse.channel.playbackUrl || '',
        ingestEndpoint: channelResponse.channel.ingestEndpoint || '',
        recordingConfigurationArn: channelResponse.channel.recordingConfigurationArn
      };

      console.log('✅ Live channel created successfully:', config);
      return config;
    } catch (error) {
      console.error('❌ Error creating live channel:', error);
      throw new Error('Failed to create live channel');
    }
  }
}

export const liveStreamingService = new LiveStreamingService();

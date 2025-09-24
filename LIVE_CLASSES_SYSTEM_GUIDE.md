# Live Classes System with Amazon IVS Integration

This document provides a comprehensive guide for the Kalpla live classes system that integrates with Amazon IVS (Interactive Video Service) for live streaming, auto-recording, and S3 storage.

## Overview

The live classes system provides:
- **Amazon IVS Integration**: Professional live streaming infrastructure
- **Auto-Recording**: Automatic recording of live sessions to S3
- **Real-time Chat**: Live chat functionality during sessions
- **Attendance Tracking**: Real-time attendance monitoring
- **Session Management**: Complete session lifecycle management
- **Quality Control**: Adaptive streaming quality
- **Analytics**: Comprehensive session analytics
- **Mobile Support**: Responsive design for all devices

## Architecture

```
Frontend (React) → Live Streaming Service → Amazon IVS
                                      ↓
                              Lambda Functions
                                      ↓
                              DynamoDB + S3
```

## Components

### 1. Live Streaming Service (`liveStreamingService.ts`)

**Location**: `src/lib/liveStreamingService.ts`

**Features**:
- Amazon IVS channel management
- Live session lifecycle management
- Auto-recording and S3 storage
- Real-time chat and attendance tracking
- Event monitoring and analytics
- Connection quality monitoring

**Key Methods**:
- `createLiveSession()`: Create new live session
- `startLiveSession()`: Start live streaming
- `endLiveSession()`: End live session
- `startRecording()`: Start auto-recording
- `stopRecording()`: Stop recording
- `joinLiveSession()`: Join as attendee
- `leaveLiveSession()`: Leave session
- `sendChatMessage()`: Send chat message
- `getChatMessages()`: Get chat messages
- `getLiveAttendance()`: Get attendance data

### 2. Live Class Player (`LiveClassPlayer.tsx`)

**Location**: `src/components/live/LiveClassPlayer.tsx`

**Features**:
- Real-time video playback
- Live chat interface
- Attendance monitoring
- Connection quality indicators
- Video controls and settings
- Responsive design

**Key Features**:
- **Video Player**: HLS.js integration for IVS playback
- **Chat System**: Real-time messaging with moderation
- **Attendance Panel**: Live attendee list
- **Quality Controls**: Adaptive streaming quality
- **Connection Monitoring**: Real-time connection status

### 3. Instructor Live Streaming (`InstructorLiveStreaming.tsx`)

**Location**: `src/components/instructor/InstructorLiveStreaming.tsx`

**Features**:
- Session creation and management
- Live streaming controls
- Camera and microphone management
- Screen sharing capabilities
- Recording controls
- Session analytics

**Key Features**:
- **Session Management**: Create, edit, and manage sessions
- **Streaming Controls**: Camera, microphone, screen share
- **Recording Management**: Start/stop recording
- **Preview System**: Video preview before going live
- **Settings Panel**: Streaming quality and options

## Amazon IVS Integration

### Channel Management

```typescript
// Create IVS channel
const channelConfig = await this.createIVSChannel(session.title, session.settings);

// Channel configuration
const channelParams = {
  name: name,
  type: 'BASIC',
  latencyMode: 'LOW',
  authorized: false,
  recordingConfigurationArn: settings.autoRecord ? 
    await this.createRecordingConfiguration(settings.s3Bucket, settings.s3Key) : 
    undefined
};
```

### Recording Configuration

```typescript
// Create recording configuration
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
```

### Stream Management

```typescript
// Start streaming
const ivsRecording = await this.ivsClient.startStream({
  channelArn: channelArn,
  ...(recordingConfigArn && { recordingConfigurationArn: recordingConfigArn })
}).promise();

// Stop streaming
await this.ivsClient.stopStream({
  recordingId: recordingId
}).promise();
```

## Database Schema

### DynamoDB Tables

#### 1. Live Sessions Table (`LIVE_SESSIONS_TABLE`)
```json
{
  "id": "sessionId",
  "title": "string",
  "description": "string",
  "instructorId": "string",
  "courseId": "string",
  "scheduledStartTime": "ISO string",
  "scheduledEndTime": "ISO string",
  "actualStartTime": "ISO string",
  "actualEndTime": "ISO string",
  "status": "scheduled|live|ended|cancelled|recording",
  "streamKey": "string",
  "playbackUrl": "string",
  "recordingUrl": "string",
  "thumbnailUrl": "string",
  "maxAttendees": "number",
  "currentAttendees": "number",
  "attendees": ["string"],
  "settings": {
    "allowChat": "boolean",
    "allowScreenShare": "boolean",
    "allowAttendeeVideo": "boolean",
    "allowAttendeeAudio": "boolean",
    "requireApproval": "boolean",
    "autoRecord": "boolean",
    "recordToS3": "boolean",
    "s3Bucket": "string",
    "s3Key": "string",
    "quality": "low|medium|high|ultra",
    "maxBitrate": "number",
    "resolution": "string",
    "framerate": "number"
  },
  "metadata": {
    "duration": "number",
    "totalViews": "number",
    "peakViewers": "number",
    "averageViewers": "number",
    "chatMessages": "number",
    "recordings": "number",
    "engagementScore": "number"
  },
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Live Recordings Table (`LIVE_RECORDINGS_TABLE`)
```json
{
  "id": "recordingId",
  "sessionId": "string",
  "recordingId": "string",
  "status": "pending|recording|processing|completed|failed",
  "startTime": "ISO string",
  "endTime": "ISO string",
  "duration": "number",
  "s3Bucket": "string",
  "s3Key": "string",
  "s3Url": "string",
  "thumbnailUrl": "string",
  "metadata": {
    "resolution": "string",
    "framerate": "number",
    "bitrate": "number",
    "codec": "string",
    "fileSize": "number",
    "duration": "number",
    "quality": "string"
  },
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 3. Live Chat Messages Table (`LIVE_CHAT_MESSAGES_TABLE`)
```json
{
  "id": "messageId",
  "sessionId": "string",
  "userId": "string",
  "userName": "string",
  "userAvatar": "string",
  "message": "string",
  "messageType": "text|emoji|question|answer",
  "timestamp": "ISO string",
  "isModerator": "boolean",
  "isInstructor": "boolean",
  "isPinned": "boolean",
  "replies": [
    {
      "id": "string",
      "messageId": "string",
      "userId": "string",
      "userName": "string",
      "message": "string",
      "timestamp": "ISO string",
      "createdAt": "ISO string"
    }
  ],
  "likes": "number",
  "createdAt": "ISO string"
}
```

#### 4. Live Attendance Table (`LIVE_ATTENDANCE_TABLE`)
```json
{
  "id": "attendanceId",
  "sessionId": "string",
  "userId": "string",
  "userName": "string",
  "joinTime": "ISO string",
  "leaveTime": "ISO string",
  "duration": "number",
  "deviceInfo": {
    "userAgent": "string",
    "platform": "string",
    "browser": "string",
    "screenResolution": "string",
    "connectionType": "string",
    "connectionSpeed": "number"
  },
  "connectionQuality": "excellent|good|fair|poor",
  "lastSeen": "ISO string",
  "isActive": "boolean"
}
```

## S3 Storage Structure

### Recording Storage

```
kalpla-recordings/
├── recordings/
│   ├── {sessionId}/
│   │   ├── {timestamp}/
│   │   │   ├── video.mp4
│   │   │   ├── thumbnail.jpg
│   │   │   └── metadata.json
│   │   └── ...
│   └── ...
├── thumbnails/
│   ├── {sessionId}/
│   │   ├── {timestamp}.jpg
│   │   └── ...
│   └── ...
└── metadata/
    ├── {sessionId}/
    │   ├── analytics.json
    │   └── ...
    └── ...
```

## Usage

### 1. Creating a Live Session

```typescript
import { liveStreamingService } from '@/lib/liveStreamingService';

// Create live session
const session = await liveStreamingService.createLiveSession({
  title: 'Advanced React Patterns',
  description: 'Learn advanced React patterns and best practices',
  instructorId: 'instructor-123',
  courseId: 'course-456',
  scheduledStartTime: '2024-01-15T10:00:00Z',
  scheduledEndTime: '2024-01-15T11:30:00Z',
  maxAttendees: 100,
  settings: {
    allowChat: true,
    allowScreenShare: false,
    allowAttendeeVideo: false,
    allowAttendeeAudio: false,
    requireApproval: false,
    autoRecord: true,
    recordToS3: true,
    s3Bucket: 'kalpla-recordings',
    s3Key: 'recordings/advanced-react-patterns',
    quality: 'high',
    maxBitrate: 5000,
    resolution: '1920x1080',
    framerate: 30
  }
});
```

### 2. Starting a Live Stream

```typescript
// Start live session
const liveSession = await liveStreamingService.startLiveSession(sessionId);

// The service will:
// 1. Create IVS channel
// 2. Generate stream key
// 3. Set up recording configuration
// 4. Start event monitoring
// 5. Begin auto-recording if enabled
```

### 3. Joining a Live Session

```typescript
// Join as attendee
const attendance = await liveStreamingService.joinLiveSession(sessionId, userId);

// Send chat message
const message = await liveStreamingService.sendChatMessage(
  sessionId, 
  userId, 
  'Hello everyone!', 
  'text'
);

// Get chat messages
const messages = await liveStreamingService.getChatMessages(sessionId, 50);
```

### 4. Managing Recordings

```typescript
// Start recording
const recording = await liveStreamingService.startRecording(sessionId);

// Stop recording
const stoppedRecording = await liveStreamingService.stopRecording(sessionId);

// Recording will be automatically processed and stored in S3
```

## Live Streaming Features

### 1. Video Quality Management

```typescript
// Quality settings
const qualitySettings = {
  low: { bitrate: 1000, resolution: '640x360', framerate: 15 },
  medium: { bitrate: 2500, resolution: '1280x720', framerate: 30 },
  high: { bitrate: 5000, resolution: '1920x1080', framerate: 30 },
  ultra: { bitrate: 8000, resolution: '1920x1080', framerate: 60 }
};
```

### 2. Connection Quality Monitoring

```typescript
// Monitor connection quality
const checkConnectionQuality = () => {
  const video = videoRef.current;
  const buffered = video.buffered;
  
  if (buffered.length > 0) {
    const bufferedEnd = buffered.end(buffered.length - 1);
    const currentTime = video.currentTime;
    const bufferAhead = bufferedEnd - currentTime;
    
    if (bufferAhead > 10) {
      setConnectionQuality('excellent');
    } else if (bufferAhead > 5) {
      setConnectionQuality('good');
    } else if (bufferAhead > 2) {
      setConnectionQuality('fair');
    } else {
      setConnectionQuality('poor');
    }
  }
};
```

### 3. Real-time Analytics

```typescript
// Process session analytics
const analytics = {
  totalViews: attendance.length,
  peakViewers: Math.max(...attendance.map(a => 1)),
  averageViewers: attendance.length,
  chatMessages: chatMessages.length,
  engagementScore: calculateEngagementScore(attendance, chatMessages)
};
```

## Chat System

### 1. Message Types

- **Text**: Regular text messages
- **Emoji**: Emoji reactions
- **Question**: Student questions
- **Answer**: Instructor answers

### 2. Moderation Features

- **Pin Messages**: Pin important messages
- **Moderator Controls**: Instructor moderation tools
- **Message Filtering**: Content filtering
- **Rate Limiting**: Prevent spam

### 3. Real-time Updates

```typescript
// Poll chat messages
const pollChatMessages = async () => {
  const messages = await liveStreamingService.getChatMessages(sessionId, 50);
  setChatMessages(messages);
  
  // Auto-scroll to bottom
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
};

// Poll every 2 seconds
setInterval(pollChatMessages, 2000);
```

## Attendance Tracking

### 1. Real-time Monitoring

```typescript
// Track attendance
const attendance = await liveStreamingService.getLiveAttendance(sessionId);

// Update attendee count
const updateAttendeeCount = async (sessionId: string) => {
  const attendance = await liveStreamingService.getLiveAttendance(sessionId);
  const activeAttendees = attendance.filter(a => a.isActive).length;
  
  await liveStreamingService.updateLiveSession(sessionId, {
    currentAttendees: activeAttendees
  });
};
```

### 2. Device Information

```typescript
// Collect device info
const deviceInfo = {
  userAgent: navigator.userAgent,
  platform: getPlatform(),
  browser: getBrowser(),
  screenResolution: `${screen.width}x${screen.height}`,
  connectionType: getConnectionType(),
  connectionSpeed: getConnectionSpeed()
};
```

## Recording Management

### 1. Auto-Recording

```typescript
// Enable auto-recording
const sessionSettings = {
  autoRecord: true,
  recordToS3: true,
  s3Bucket: 'kalpla-recordings',
  s3Key: `recordings/${sessionId}/${Date.now()}`
};
```

### 2. Recording Processing

```typescript
// Process recording
const processRecording = async (recordingId: string) => {
  // This would typically be handled by a Lambda function
  // that processes the recording and updates the database
  
  // 1. Download from IVS
  // 2. Process video (transcoding, thumbnails)
  // 3. Upload to S3
  // 4. Update database with final URLs
  // 5. Generate analytics
};
```

### 3. Thumbnail Generation

```typescript
// Thumbnail configuration
const thumbnailConfig = {
  recordingMode: 'INTERVAL',
  targetIntervalSeconds: 30
};
```

## Event Monitoring

### 1. EventBridge Integration

```typescript
// Set up event monitoring
const setupEventMonitoring = async (sessionId: string) => {
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

  await eventBridgeClient.putRule(ruleParams).promise();
};
```

### 2. Stream State Changes

- **Stream Started**: Session goes live
- **Stream Ended**: Session ends
- **Recording Started**: Recording begins
- **Recording Ended**: Recording stops
- **Error Events**: Stream errors

## Security Features

### 1. Access Control

- **Role-based Access**: Instructor vs student permissions
- **Session Authorization**: Verify user access to sessions
- **Stream Key Security**: Secure stream key management

### 2. Content Protection

- **DRM Support**: Digital rights management
- **Watermarking**: Add watermarks to recordings
- **Access Logging**: Track who accessed recordings

### 3. Privacy Controls

- **Recording Consent**: User consent for recording
- **Data Retention**: Configurable data retention policies
- **GDPR Compliance**: European data protection compliance

## Performance Optimization

### 1. Adaptive Streaming

```typescript
// HLS configuration
const hlsConfig = {
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 30,
  maxBufferLength: 60
};
```

### 2. Connection Optimization

- **CDN Integration**: Global content delivery
- **Edge Locations**: Reduce latency
- **Bandwidth Adaptation**: Adjust quality based on connection

### 3. Caching Strategy

- **Metadata Caching**: Cache session metadata
- **Chat Caching**: Cache recent chat messages
- **Attendance Caching**: Cache attendance data

## Mobile Support

### 1. Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Touch Controls**: Touch-friendly interface
- **Adaptive Layout**: Adjusts to screen size

### 2. Mobile-specific Features

- **Camera Integration**: Mobile camera support
- **Push Notifications**: Session notifications
- **Offline Support**: Limited offline functionality

## Analytics and Reporting

### 1. Session Analytics

```typescript
// Session metrics
const sessionMetrics = {
  duration: actualEndTime - actualStartTime,
  totalViews: attendance.length,
  peakViewers: Math.max(...attendance.map(a => 1)),
  averageViewers: attendance.length,
  chatMessages: chatMessages.length,
  engagementScore: calculateEngagementScore(attendance, chatMessages)
};
```

### 2. Recording Analytics

- **View Count**: How many times recording was viewed
- **Watch Time**: Total time spent watching
- **Completion Rate**: Percentage watched
- **Drop-off Points**: Where viewers stop watching

### 3. Instructor Analytics

- **Session Performance**: Session success metrics
- **Student Engagement**: Engagement levels
- **Technical Issues**: Stream quality issues

## Troubleshooting

### 1. Common Issues

**Stream Not Starting**:
- Check camera/microphone permissions
- Verify network connection
- Check IVS channel status

**Poor Video Quality**:
- Check network bandwidth
- Adjust quality settings
- Monitor connection quality

**Recording Issues**:
- Verify S3 permissions
- Check recording configuration
- Monitor storage space

### 2. Debug Tools

```typescript
// Debug stream status
const streamStatus = await liveStreamingService.getStreamStatus(channelArn);
console.log('Stream status:', streamStatus);

// Debug connection quality
const connectionQuality = checkConnectionQuality();
console.log('Connection quality:', connectionQuality);
```

### 3. Error Handling

```typescript
// Error handling
try {
  await liveStreamingService.startLiveSession(sessionId);
} catch (error) {
  console.error('Error starting stream:', error);
  setError('Failed to start streaming');
}
```

## Best Practices

### 1. Session Planning

- **Schedule in Advance**: Give students notice
- **Test Equipment**: Test camera/microphone beforehand
- **Prepare Content**: Have materials ready
- **Backup Plan**: Have contingency plans

### 2. Technical Setup

- **Stable Internet**: Use wired connection when possible
- **Good Lighting**: Ensure proper lighting
- **Audio Quality**: Use good microphone
- **Camera Position**: Position camera properly

### 3. Engagement Strategies

- **Interactive Content**: Use polls and questions
- **Chat Moderation**: Monitor and respond to chat
- **Break Time**: Include breaks in long sessions
- **Follow-up**: Send recordings and materials

## API Reference

### Live Streaming Service

#### Methods

- `createLiveSession(session)`: Create new live session
- `startLiveSession(sessionId)`: Start live streaming
- `endLiveSession(sessionId)`: End live session
- `startRecording(sessionId)`: Start recording
- `stopRecording(sessionId)`: Stop recording
- `joinLiveSession(sessionId, userId)`: Join session
- `leaveLiveSession(sessionId, userId)`: Leave session
- `sendChatMessage(sessionId, userId, message, type)`: Send message
- `getChatMessages(sessionId, limit)`: Get messages
- `getLiveAttendance(sessionId)`: Get attendance
- `getStreamStatus(channelArn)`: Get stream status
- `formatDuration(seconds)`: Format duration

### GraphQL Queries and Mutations

#### Queries

- `GET_LIVE_SESSION`: Get live session
- `GET_LIVE_SESSIONS`: Get live sessions
- `GET_LIVE_RECORDING`: Get live recording
- `GET_LIVE_CHAT_MESSAGES`: Get chat messages
- `GET_LIVE_ATTENDANCE`: Get attendance

#### Mutations

- `CREATE_LIVE_SESSION`: Create live session
- `UPDATE_LIVE_SESSION`: Update live session
- `DELETE_LIVE_SESSION`: Delete live session
- `START_LIVE_RECORDING`: Start recording
- `STOP_LIVE_RECORDING`: Stop recording
- `CREATE_LIVE_CHAT_MESSAGE`: Create chat message
- `UPDATE_LIVE_ATTENDANCE`: Update attendance

## Future Enhancements

1. **Advanced Analytics**: Detailed engagement metrics
2. **AI Integration**: Automated transcription and summaries
3. **Interactive Features**: Polls, quizzes, and Q&A
4. **Multi-camera Support**: Multiple camera angles
5. **Virtual Backgrounds**: Background replacement
6. **Breakout Rooms**: Small group discussions
7. **Whiteboard Integration**: Collaborative whiteboard
8. **Screen Recording**: Screen sharing with recording
9. **Mobile App**: Native mobile applications
10. **International Support**: Multi-language support

## Support

For issues or questions:
1. Check network connection
2. Verify browser permissions
3. Test with different browsers
4. Check IVS service status
5. Contact technical support

The live classes system provides a complete solution for professional live streaming with Amazon IVS integration, auto-recording, and comprehensive analytics!

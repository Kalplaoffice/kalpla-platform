# 🎥 Kalpla Video System Documentation

## Overview

The Kalpla video system provides a comprehensive, enterprise-grade video streaming solution with adaptive bitrate streaming (HLS), interactive elements, analytics, and live streaming capabilities. Built on AWS infrastructure, it delivers scalable, secure, and high-quality video experiences.

## 🏗️ Architecture

### High-Level Flow

```
Uploader (Instructor/Admin) 
  └→ S3 (raw uploads) 
        └→ S3 Event → Lambda → Start MediaConvert job (HLS + multiple renditions + captions)
              └→ MediaConvert outputs -> S3 (HLS master + variant playlists + segments)
                    └→ CloudFront (with Signed URLs) -> Frontend Video Player (HLS/IVS Player / Video.js)
Frontend player ↔ AppSync/REST (Auth via Cognito)
  ├─ Fetch signed CloudFront URL for playback (short-lived)
  ├─ Emit analytics events (play, pause, watch-time, quartile, seek) → AppSync / API Gateway → Lambda → DynamoDB / Kinesis / Pinpoint / CloudWatch
  └─ Periodic progress pings (store last watched position) → AppSync → DynamoDB
Live sessions: Amazon IVS (ingest) → recording to S3 → same MediaConvert / HLS if needed
Interactive elements: timed metadata (HLS ID3/VTT), WebSocket events (API Gateway) for quizzes/hotspots → backend persists results
```

## 🚀 Features Implemented

### 1. Adaptive Bitrate Streaming (HLS)
- **Multiple Quality Levels**: 1080p (5 Mbps), 720p (2.5 Mbps), 480p (1.2 Mbps), 360p (600 kbps)
- **Automatic Quality Switching**: Based on user bandwidth and device capabilities
- **HLS Master Playlist**: Dynamic quality selection
- **CloudFront CDN**: Global content delivery with edge caching

### 2. Video Analytics & Progress Tracking
- **Real-time Events**: Play, pause, seek, progress, completion, quartiles
- **Progress Tracking**: Resume from last watched position
- **Engagement Metrics**: Watch time, completion rates, drop-off points
- **Device Analytics**: Mobile, desktop, tablet breakdown
- **Session Tracking**: Unique session IDs for detailed analysis

### 3. Interactive Video Elements
- **Quiz Integration**: Timed quizzes with multiple choice questions
- **Call-to-Action**: Promotional overlays and external links
- **Chapter Markers**: Navigation points within videos
- **Hotspots**: Clickable regions with tooltips
- **Notes**: Timestamped annotations
- **Polls**: Real-time audience engagement

### 4. Live Streaming (Amazon IVS)
- **Low-latency Streaming**: Sub-second latency for interactive sessions
- **Automatic Recording**: Sessions recorded to S3 for on-demand playback
- **Stream Management**: Start/stop streaming controls
- **Participant Tracking**: Real-time viewer count
- **Stream Sharing**: Easy URL sharing for participants

### 5. Secure Video Access
- **CloudFront Signed URLs**: Time-limited access (1 hour expiry)
- **Role-based Access**: Enrolled students only
- **Encrypted Storage**: S3 server-side encryption
- **Access Logging**: Comprehensive audit trail

## 📁 File Structure

### Backend Lambda Functions
```
amplify/backend/function/
├── videoUploadProcessor/          # S3 event handler for video processing
│   ├── src/index.js              # MediaConvert job creation
│   └── src/package.json
├── videoProcessingComplete/       # MediaConvert completion handler
│   ├── src/index.js              # Update lesson with HLS URLs
│   └── src/package.json
├── videoSignedUrlGenerator/       # CloudFront signed URL generation
│   ├── src/index.js              # Secure video access
│   └── src/package.json
└── videoAnalyticsProcessor/      # Video analytics event processing
    ├── src/index.js              # Event tracking and progress updates
    └── src/package.json
```

### Frontend Components
```
src/components/video/
├── EnhancedVideoPlayer.tsx       # Main video player with HLS support
├── VideoUploader.tsx             # File upload interface for instructors
├── InteractiveTimelineEditor.tsx # Timeline management for interactive elements
└── LiveStreamingManager.tsx      # Live streaming interface

src/components/analytics/
└── VideoAnalyticsDashboard.tsx   # Analytics visualization

src/lib/
└── videoService.ts              # Video API service layer
```

### Database Schema Updates
```graphql
# Enhanced Lesson model
type Lesson {
  # Video Content
  videoUrl: String
  hlsUrl: String
  thumbnailUrl: String
  captionsUrl: String
  
  # Video Processing Status
  processingStatus: VideoProcessingStatus!
  processingJobId: String
  
  # Interactive Elements
  interactiveTimeline: [InteractiveElement]
}

# New models for video system
type VideoProgress {
  userId: ID!
  lessonId: ID!
  lastPosition: Float!
  duration: Float!
  percentWatched: Float!
  completed: Boolean!
  lastWatchedAt: AWSDateTime!
}

type VideoEvent {
  userId: ID!
  lessonId: ID!
  eventType: VideoEventType!
  currentTime: Float!
  duration: Float!
  bitrate: Int
  device: String
  sessionId: String
  metadata: AWSJSON
}

type InteractiveResponse {
  userId: ID!
  lessonId: ID!
  elementId: String!
  elementType: InteractiveElementType!
  timestamp: Float!
  payload: AWSJSON!
  score: Float
}

type LiveSession {
  title: String!
  description: String!
  mentorId: ID!
  cohortId: ID!
  scheduledDate: AWSDateTime!
  duration: Int!
  ivsChannelArn: String
  ivsPlaybackUrl: String
  ivsStreamKey: String
  status: SessionStatus!
}
```

## 🔧 Implementation Details

### 1. Video Upload & Processing

#### S3 Upload Flow
1. **Instructor uploads video** → S3 raw-videos bucket
2. **S3 event triggers Lambda** → `videoUploadProcessor`
3. **Lambda creates MediaConvert job** → Multiple HLS renditions
4. **MediaConvert outputs to S3** → HLS master playlist + segments
5. **EventBridge triggers completion** → `videoProcessingComplete`
6. **Lesson updated with HLS URL** → Ready for streaming

#### MediaConvert Configuration
```javascript
const jobSettings = {
  Role: process.env.MEDIACONVERT_ROLE_ARN,
  Settings: {
    Inputs: [{
      FileInput: inputUri,
      AudioSelectors: { "Audio Selector 1": { DefaultSelection: "DEFAULT" } },
      VideoSelector: { ColorSpace: "FOLLOW" }
    }],
    OutputGroups: [{
      Name: "HLS",
      OutputGroupSettings: {
        Type: "HLS_GROUP_SETTINGS",
        HlsGroupSettings: {
          SegmentLength: 6,
          MinSegmentLength: 0,
          Destination: outputUri,
          StreamInfResolution: "INCLUDE"
        }
      },
      Outputs: [
        // 1080p 5 Mbps
        { NameModifier: "_1080p", VideoDescription: { /* 1080p settings */ } },
        // 720p 2.5 Mbps
        { NameModifier: "_720p", VideoDescription: { /* 720p settings */ } },
        // 480p 1.2 Mbps
        { NameModifier: "_480p", VideoDescription: { /* 480p settings */ } },
        // 360p 600 kbps
        { NameModifier: "_360p", VideoDescription: { /* 360p settings */ } }
      ]
    }]
  }
};
```

### 2. Secure Video Playback

#### CloudFront Signed URLs
```javascript
const generateSignedUrl = (hlsUrl) => {
  const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
  const distributionDomain = process.env.CLOUDFRONT_DOMAIN;
  
  const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  
  const policy = JSON.stringify({
    Statement: [{
      Resource: cloudfrontUrl,
      Condition: { DateLessThan: { 'AWS:EpochTime': expires } }
    }]
  });
  
  const signature = crypto.createSign('RSA-SHA1')
    .update(policy)
    .sign(privateKey, 'base64');
  
  return `${cloudfrontUrl}?Expires=${expires}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;
};
```

#### Access Control Flow
1. **User requests video** → Frontend calls `getSignedVideoUrl`
2. **Lambda verifies enrollment** → Check user access to course
3. **Generate signed URL** → CloudFront URL with 1-hour expiry
4. **Return to frontend** → Video player loads HLS stream
5. **Automatic refresh** → New signed URL before expiry

### 3. Video Analytics

#### Event Tracking
```javascript
const trackEvent = async (eventType, metadata) => {
  await videoService.trackVideoEvent({
    lessonId,
    eventType,
    currentTime: videoRef.current.currentTime,
    duration: videoRef.current.duration,
    bitrate: getCurrentBitrate(),
    device: getDeviceInfo(),
    sessionId,
    metadata
  });
};
```

#### Analytics Events
- **PLAY**: Video started
- **PAUSE**: Video paused
- **SEEK**: User jumped to different timestamp
- **PROGRESS**: Periodic updates (every 15 seconds)
- **COMPLETE**: Video finished
- **QUARTILE_25/50/75**: Milestone reached
- **BUFFER_START/END**: Buffering events
- **ERROR**: Playback errors
- **INTERACTIVE_EVENT**: Quiz responses, hotspot clicks

#### Progress Tracking
```javascript
const updateVideoProgress = async (userId, lessonId, currentTime, duration) => {
  const percentWatched = (currentTime / duration) * 100;
  const completed = percentWatched >= 90;
  
  await videoService.updateVideoProgress({
    lessonId,
    lastPosition: currentTime,
    duration,
    percentWatched,
    completed,
    device: getDeviceInfo(),
    sessionId
  });
};
```

### 4. Interactive Elements

#### Timeline Structure
```javascript
interface InteractiveElement {
  startTime: number;
  endTime?: number;
  type: 'QUIZ' | 'HOTSPOT' | 'CHAPTER_MARKER' | 'CTA' | 'POLL' | 'NOTE';
  id: string;
  payload: any;
}
```

#### Quiz Implementation
```javascript
const handleInteractiveResponse = async (elementId, payload) => {
  await videoService.submitInteractiveResponse({
    lessonId,
    elementId,
    elementType: 'QUIZ',
    timestamp: currentTime,
    payload: { answer: payload.answer },
    score: calculateScore(payload)
  });
};
```

#### Timeline Editor
- **Visual Timeline**: Drag-and-drop interface
- **Element Types**: Quiz, CTA, Note, Hotspot, Chapter Marker, Poll
- **Time-based Triggers**: Elements appear at specific timestamps
- **Payload Management**: Custom data for each element type
- **Real-time Preview**: See elements in action

### 5. Live Streaming

#### Amazon IVS Integration
```javascript
const createLiveSession = async (sessionData) => {
  const result = await videoService.createLiveSession({
    title: sessionData.title,
    description: sessionData.description,
    cohortId: sessionData.cohortId,
    scheduledDate: sessionData.scheduledDate,
    duration: sessionData.duration
  });
  
  return result;
};
```

#### Stream Management
- **Channel Creation**: Automatic IVS channel setup
- **Stream Key Generation**: Unique keys for each session
- **Playback URL**: Low-latency streaming URL
- **Recording**: Automatic session recording
- **Status Tracking**: Live, ended, cancelled states

## 🎯 Usage Examples

### 1. Instructor Uploading Video
```typescript
import { VideoUploader } from '@/components/video/VideoUploader';

function LessonEditor({ lessonId }) {
  return (
    <div>
      <h2>Upload Video</h2>
      <VideoUploader 
        lessonId={lessonId}
        onUploadComplete={(videoKey) => {
          console.log('Video uploaded:', videoKey);
        }}
        onUploadError={(error) => {
          console.error('Upload failed:', error);
        }}
      />
    </div>
  );
}
```

### 2. Student Watching Video
```typescript
import { EnhancedVideoPlayer } from '@/components/video/EnhancedVideoPlayer';

function LessonViewer({ lessonId, title }) {
  return (
    <div>
      <h1>{title}</h1>
      <EnhancedVideoPlayer 
        lessonId={lessonId}
        title={title}
        onProgress={(currentTime, duration) => {
          console.log(`Progress: ${currentTime}/${duration}`);
        }}
        onComplete={() => {
          console.log('Video completed!');
        }}
      />
    </div>
  );
}
```

### 3. Adding Interactive Elements
```typescript
import { InteractiveTimelineEditor } from '@/components/video/InteractiveTimelineEditor';

function LessonEditor({ lessonId, videoDuration }) {
  return (
    <div>
      <h2>Interactive Timeline</h2>
      <InteractiveTimelineEditor 
        lessonId={lessonId}
        videoDuration={videoDuration}
        onTimelineUpdate={(timeline) => {
          console.log('Timeline updated:', timeline);
        }}
      />
    </div>
  );
}
```

### 4. Viewing Analytics
```typescript
import { VideoAnalyticsDashboard } from '@/components/analytics/VideoAnalyticsDashboard';

function AnalyticsView({ lessonId }) {
  return (
    <div>
      <h2>Video Analytics</h2>
      <VideoAnalyticsDashboard 
        lessonId={lessonId}
        startDate="2024-01-01"
        endDate="2024-01-31"
      />
    </div>
  );
}
```

### 5. Live Streaming Session
```typescript
import { LiveStreamingManager } from '@/components/video/LiveStreamingManager';

function LiveSession({ sessionId, isMentor }) {
  return (
    <div>
      <LiveStreamingManager 
        sessionId={sessionId}
        isMentor={isMentor}
        onSessionUpdate={(session) => {
          console.log('Session updated:', session);
        }}
      />
    </div>
  );
}
```

## 🔒 Security Considerations

### 1. Access Control
- **Enrollment Verification**: Only enrolled students can access videos
- **Role-based Permissions**: Instructors can upload, students can watch
- **Time-limited URLs**: Signed URLs expire after 1 hour
- **Device Tracking**: Monitor for suspicious access patterns

### 2. Content Protection
- **S3 Encryption**: Server-side encryption for stored videos
- **CloudFront Security**: HTTPS-only delivery
- **Signed URLs**: Prevent unauthorized access
- **Access Logging**: Comprehensive audit trail

### 3. Data Privacy
- **Analytics Anonymization**: Remove PII from analytics data
- **GDPR Compliance**: User data deletion capabilities
- **Retention Policies**: Automatic data cleanup
- **Consent Management**: User consent for analytics tracking

## 📊 Performance Optimization

### 1. CDN Optimization
- **CloudFront Edge Locations**: Global content delivery
- **Cache Policies**: Optimized TTL for different content types
- **Compression**: Gzip compression for playlists
- **HTTP/2**: Modern protocol support

### 2. Adaptive Streaming
- **Quality Selection**: Automatic quality adjustment
- **Bandwidth Monitoring**: Real-time network assessment
- **Buffer Management**: Optimal buffering strategies
- **Fallback Options**: Graceful degradation

### 3. Analytics Efficiency
- **Batch Processing**: Group events for efficiency
- **Throttling**: Limit event frequency
- **Compression**: Compress analytics data
- **Caching**: Cache frequently accessed metrics

## 🚀 Deployment & Configuration

### 1. AWS Resources Required
- **S3 Buckets**: Raw videos, HLS output, thumbnails
- **CloudFront Distribution**: CDN for video delivery
- **MediaConvert**: Video transcoding service
- **Lambda Functions**: Processing and analytics
- **DynamoDB Tables**: Video metadata and analytics
- **EventBridge**: Event routing
- **Amazon IVS**: Live streaming (optional)

### 2. Environment Variables
```bash
# MediaConvert
MEDIACONVERT_ROLE_ARN=arn:aws:iam::account:role/MediaConvertRole
HLS_OUTPUT_BUCKET=kalpla-hls-output

# CloudFront
CLOUDFRONT_KEY_PAIR_ID=K2JCJMDEHXQW5F
CLOUDFRONT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net

# DynamoDB
LESSON_TABLE=Lesson-dev
VIDEO_EVENTS_TABLE=VideoEvent-dev
VIDEO_PROGRESS_TABLE=VideoProgress-dev

# Kinesis (optional)
KINESIS_STREAM_NAME=video-analytics-stream
```

### 3. IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "cloudfront:CreateInvalidation",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🧪 Testing

### 1. Unit Tests
```javascript
// Test video upload
describe('VideoUploader', () => {
  it('should upload video successfully', async () => {
    const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const result = await videoService.uploadVideoFile(mockFile, 'lesson-1');
    expect(result).toBeDefined();
  });
});

// Test analytics tracking
describe('VideoAnalytics', () => {
  it('should track video events', async () => {
    await videoService.trackVideoEvent({
      lessonId: 'lesson-1',
      eventType: 'PLAY',
      currentTime: 0,
      duration: 100
    });
    // Verify event was stored
  });
});
```

### 2. Integration Tests
- **End-to-end video upload**: Upload → Process → Stream
- **Analytics pipeline**: Event → Storage → Dashboard
- **Interactive elements**: Timeline → Player → Response
- **Live streaming**: Start → Stream → End

### 3. Performance Tests
- **Concurrent users**: Test with multiple simultaneous viewers
- **Large files**: Test with 2GB+ video uploads
- **Analytics load**: High-frequency event tracking
- **CDN performance**: Global delivery speeds

## 🔮 Future Enhancements

### 1. Advanced Features
- **AI-powered Recommendations**: Personalized content suggestions
- **Automatic Captions**: Speech-to-text integration
- **Video Search**: Content-based search within videos
- **Social Features**: Comments, likes, sharing
- **Offline Support**: Download for offline viewing

### 2. Performance Improvements
- **Edge Computing**: Lambda@Edge for global processing
- **Advanced Caching**: Intelligent cache invalidation
- **Compression**: Advanced video compression algorithms
- **Bandwidth Optimization**: Dynamic quality adjustment

### 3. Analytics Enhancements
- **Real-time Dashboards**: Live analytics updates
- **Predictive Analytics**: ML-based insights
- **A/B Testing**: Video content optimization
- **Heatmaps**: Visual engagement tracking

## 📞 Support & Troubleshooting

### Common Issues

#### 1. Video Not Processing
- **Check S3 permissions**: Ensure Lambda can access S3
- **Verify MediaConvert role**: Check IAM role permissions
- **Monitor CloudWatch logs**: Check for error messages
- **Validate file format**: Ensure supported video formats

#### 2. Signed URL Issues
- **Check CloudFront configuration**: Verify key pair and domain
- **Validate expiration**: Ensure URLs haven't expired
- **Verify enrollment**: Check user access permissions
- **Test with curl**: Debug URL generation

#### 3. Analytics Not Tracking
- **Check DynamoDB permissions**: Ensure Lambda can write events
- **Verify event format**: Check required fields
- **Monitor Kinesis**: If using real-time analytics
- **Test with sample data**: Validate pipeline

### Debugging Tools
- **CloudWatch Logs**: Centralized logging
- **X-Ray Tracing**: Distributed tracing
- **CloudWatch Metrics**: Performance monitoring
- **DynamoDB Console**: Data inspection

## 📚 Additional Resources

- [AWS MediaConvert Documentation](https://docs.aws.amazon.com/mediaconvert/)
- [CloudFront Signed URLs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)
- [Amazon IVS Documentation](https://docs.aws.amazon.com/ivs/)
- [HLS.js Documentation](https://github.com/video-dev/hls.js/)
- [Video.js Documentation](https://videojs.com/)

---

This comprehensive video system transforms Kalpla into a world-class e-learning platform with enterprise-grade video capabilities. The implementation provides scalable, secure, and engaging video experiences that rival the best platforms in the industry.

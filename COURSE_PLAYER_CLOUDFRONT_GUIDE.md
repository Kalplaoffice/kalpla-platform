# Course Player with CloudFront Signed URLs

This document provides a comprehensive guide for the Kalpla course player system that integrates CloudFront signed URLs for secure video streaming with adaptive bitrate capabilities.

## Overview

The course player system provides:
- **CloudFront Signed URLs**: Secure video access with time-limited URLs
- **Adaptive Bitrate Streaming**: Multiple quality levels (4K, 1080p, 720p, 480p, 360p)
- **HLS Streaming**: HTTP Live Streaming with automatic quality selection
- **Progress Tracking**: Automatic progress saving and resume functionality
- **Interactive Features**: Notes, Q&A, and discussions
- **Real-time Analytics**: Video event tracking and user engagement metrics

## Architecture

```
Frontend (React) → Course Player Component → Enhanced Course Player Service
                                                      ↓
                                              GraphQL API Gateway
                                                      ↓
                                              Lambda Functions
                                                      ↓
                                              CloudFront + S3
```

## Components

### 1. Enhanced Course Player Service (`enhancedCoursePlayerService.ts`)

**Location**: `src/lib/enhancedCoursePlayerService.ts`

**Features**:
- CloudFront signed URL generation and management
- Video streaming data with multiple quality levels
- Progress tracking and analytics
- Notes, questions, and discussions management
- Connection speed detection for quality recommendations
- Automatic URL refresh before expiration

**Key Methods**:
- `getVideoStreamingData()`: Get comprehensive video data with signed URLs
- `refreshSignedUrls()`: Refresh URLs before expiration
- `updateVideoProgress()`: Track user progress
- `trackVideoEvent()`: Analytics event tracking
- `detectConnectionSpeed()`: Network speed detection

### 2. Course Player Component (`CoursePlayer.tsx`)

**Location**: `src/components/course/CoursePlayer.tsx`

**Features**:
- Professional video player with HLS.js integration
- Quality selection menu with bitrate information
- Custom video controls (play/pause, seek, volume)
- Real-time progress tracking
- Interactive sidebar with notes, Q&A, and discussions
- Automatic URL refresh and error handling
- Responsive design with mobile support

**Key Features**:
- **Video Controls**: Play/pause, seek bar, volume control, quality selection
- **Progress Tracking**: Automatic progress saving every 10 seconds
- **Interactive Elements**: Timestamped notes, questions, and discussions
- **Error Handling**: Graceful error recovery and retry mechanisms
- **Performance**: Optimized HLS configuration for smooth streaming

### 3. CloudFront Signed URL Generator (`videoSignedUrlGenerator`)

**Location**: `amplify/backend/function/videoSignedUrlGenerator/src/index.js`

**Features**:
- Secure signed URL generation with RSA-SHA1 signatures
- Multiple quality level support
- Thumbnail and caption URL generation
- User access verification
- Private key caching for performance
- Comprehensive error handling and logging

**Security Features**:
- **Access Control**: User role-based access verification
- **Time-limited URLs**: Configurable expiration times
- **Private Key Management**: Secure key storage in AWS Secrets Manager
- **Caching**: Private key caching to reduce Secrets Manager calls
- **Logging**: Comprehensive access logging for analytics

## Quality Levels

| Quality | Resolution | Bitrate | Use Case |
|---------|------------|---------|----------|
| 4K (2160p) | 3840x2160 | 15 Mbps | High-end displays, excellent bandwidth |
| 1080p | 1920x1080 | 5 Mbps | Standard HD, good bandwidth |
| 720p | 1280x720 | 3 Mbps | Balanced quality/bandwidth |
| 480p | 854x480 | 1.5 Mbps | Lower bandwidth, mobile |
| 360p | 640x360 | 800 kbps | Very low bandwidth, slow connections |

## Setup and Configuration

### Prerequisites

1. AWS CloudFront distribution configured
2. CloudFront key pair created
3. Private key stored in AWS Secrets Manager
4. S3 bucket with video content
5. Lambda functions deployed

### Environment Variables

```bash
# CloudFront Configuration
CLOUDFRONT_DOMAIN=your-distribution.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=your-key-pair-id
CLOUDFRONT_PRIVATE_KEY_SECRET_ARN=arn:aws:secretsmanager:region:account:secret:name

# DynamoDB Tables
LESSONS_TABLE=Lessons-dev
VIDEO_ACCESS_LOGS_TABLE=VideoAccessLogs-dev
```

### CloudFront Configuration

1. **Distribution Settings**:
   - Origin: S3 bucket with video content
   - Behaviors: Optimized for video streaming
   - Caching: Aggressive caching for video segments
   - Compression: Enabled for manifests

2. **Security Settings**:
   - Signed URLs: Enabled for private content
   - HTTPS: Enforced for all requests
   - WAF: Rate limiting and DDoS protection

## Usage

### 1. Basic Course Player Usage

```typescript
import { CoursePlayer } from '@/components/course/CoursePlayer';

function LessonPage() {
  const handleLessonComplete = (lessonId: string) => {
    console.log('Lesson completed:', lessonId);
    // Handle completion logic
  };

  const handleProgressUpdate = (progress: number) => {
    console.log('Progress:', progress);
    // Update overall course progress
  };

  return (
    <CoursePlayer
      courseId="course-123"
      lessonId="lesson-456"
      userId="user-789"
      userRole="student"
      onLessonComplete={handleLessonComplete}
      onProgressUpdate={handleProgressUpdate}
    />
  );
}
```

### 2. Service Usage

```typescript
import { enhancedCoursePlayerService } from '@/lib/enhancedCoursePlayerService';

// Get video streaming data
const videoData = await enhancedCoursePlayerService.getVideoStreamingData(
  'lesson-123',
  'user-456',
  'student',
  'auto',
  3600 // 1 hour expiry
);

// Update progress
await enhancedCoursePlayerService.updateVideoProgress({
  lessonId: 'lesson-123',
  userId: 'user-456',
  lastPosition: 120,
  duration: 1800,
  percentWatched: 6.67,
  completed: false,
  timeSpent: 120
});

// Track events
await enhancedCoursePlayerService.trackVideoEvent(
  'lesson-123',
  'user-456',
  'PLAY',
  { currentTime: 0, quality: '720p' }
);
```

### 3. Quality Management

```typescript
// Get recommended quality based on connection speed
const connectionSpeed = await enhancedCoursePlayerService.detectConnectionSpeed();
const recommendedQuality = enhancedCoursePlayerService.getRecommendedQuality(
  'student',
  connectionSpeed
);

// Get available quality options
const qualityOptions = enhancedCoursePlayerService.getVideoQualityOptions(
  videoData.signedUrls
);
```

## Features

### Video Streaming

- **Adaptive Streaming**: Automatic quality selection based on bandwidth
- **Multiple Formats**: HLS with multiple quality levels
- **Seamless Switching**: Quality changes without interruption
- **Buffering Optimization**: Smart buffering for smooth playback
- **Error Recovery**: Automatic retry and fallback mechanisms

### Progress Tracking

- **Automatic Saving**: Progress saved every 10 seconds
- **Resume Functionality**: Continue from last watched position
- **Completion Detection**: Automatic lesson completion at 95%
- **Cross-Device Sync**: Progress synchronized across devices
- **Analytics**: Detailed viewing analytics and engagement metrics

### Interactive Features

- **Timestamped Notes**: Add notes at specific video moments
- **Q&A System**: Ask questions related to video content
- **Discussions**: Community discussions and threaded conversations
- **Real-time Updates**: Live updates for questions and discussions
- **Search**: Search through notes, questions, and discussions

### Security

- **Signed URLs**: Time-limited access to video content
- **Access Control**: Role-based access verification
- **Encryption**: AES-128 encryption for video content
- **Audit Logging**: Comprehensive access logging
- **Rate Limiting**: Protection against abuse

## Performance Optimization

### Client-Side

- **HLS.js Configuration**: Optimized for low latency
- **Connection Detection**: Automatic quality recommendation
- **Caching**: Local caching of video metadata
- **Lazy Loading**: Components loaded on demand
- **Error Boundaries**: Graceful error handling

### Server-Side

- **Private Key Caching**: Reduced Secrets Manager calls
- **Connection Pooling**: Efficient database connections
- **CDN Optimization**: CloudFront caching strategies
- **Compression**: Gzip compression for manifests
- **Monitoring**: CloudWatch metrics and alarms

## Monitoring and Analytics

### Metrics Tracked

- **Video Events**: Play, pause, seek, complete, quality change
- **User Engagement**: Watch time, completion rates, drop-off points
- **Performance**: Load times, buffering events, error rates
- **Quality Usage**: Distribution of quality selections
- **Access Patterns**: Peak usage times, geographic distribution

### CloudWatch Alarms

- **Error Rate**: High error rate alerts
- **Latency**: High latency alerts
- **Throughput**: Unusual traffic patterns
- **Cost**: Unexpected cost increases

## Troubleshooting

### Common Issues

1. **Video Won't Load**:
   - Check CloudFront distribution status
   - Verify signed URL generation
   - Check user access permissions
   - Verify S3 bucket permissions

2. **Quality Issues**:
   - Check network connection speed
   - Verify quality availability
   - Check HLS.js compatibility
   - Monitor CloudFront cache hit ratio

3. **Progress Not Saving**:
   - Check DynamoDB permissions
   - Verify user authentication
   - Check network connectivity
   - Review error logs

### Debug Commands

```bash
# Check CloudFront distribution
aws cloudfront get-distribution --id DISTRIBUTION_ID

# Check signed URL generation
aws lambda invoke --function-name videoSignedUrlGenerator-dev response.json

# Check DynamoDB tables
aws dynamodb describe-table --table-name Lessons-dev

# Check CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/videoSignedUrlGenerator
```

## Security Considerations

1. **Access Control**: Implement proper user authentication and authorization
2. **URL Expiration**: Set appropriate expiration times for signed URLs
3. **Key Management**: Secure storage and rotation of private keys
4. **Audit Logging**: Comprehensive logging of all access attempts
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **HTTPS Only**: Enforce HTTPS for all video content
7. **CORS Configuration**: Proper CORS settings for web access

## Cost Optimization

1. **CloudFront Caching**: Optimize caching policies for video content
2. **Storage Classes**: Use appropriate S3 storage classes
3. **Lambda Optimization**: Optimize Lambda function performance
4. **DynamoDB**: Use on-demand billing for variable workloads
5. **Monitoring**: Set up cost alerts and monitoring

## Future Enhancements

1. **AI-Powered Quality**: Automatic quality optimization based on content
2. **Thumbnail Generation**: Automatic thumbnail creation
3. **Subtitle Support**: Multi-language subtitle support
4. **Live Streaming**: Real-time video streaming capabilities
5. **Advanced Analytics**: Machine learning-powered insights
6. **Mobile App**: Native mobile app integration
7. **Offline Support**: Download for offline viewing

## API Reference

### Enhanced Course Player Service

#### Methods

- `getVideoStreamingData(lessonId, userId, userRole, quality?, duration?)`: Get video streaming data
- `refreshSignedUrls(lessonId, userId, userRole, currentUrls)`: Refresh signed URLs
- `updateVideoProgress(progress)`: Update user progress
- `trackVideoEvent(lessonId, userId, eventType, eventData)`: Track video events
- `getVideoProgress(lessonId, userId)`: Get user progress
- `getVideoAnalytics(lessonId)`: Get video analytics
- `detectConnectionSpeed()`: Detect network speed
- `getRecommendedQuality(userRole, connectionSpeed?)`: Get recommended quality
- `getVideoQualityOptions(signedUrls)`: Get quality options
- `formatTime(seconds)`: Format time for display
- `calculateProgress(currentTime, duration)`: Calculate progress percentage

#### Notes Management

- `getNotes(lessonId, userId)`: Get user notes
- `createNote(note)`: Create new note
- `updateNote(noteId, content)`: Update note
- `deleteNote(noteId)`: Delete note

#### Questions Management

- `getQuestions(lessonId)`: Get lesson questions
- `createQuestion(question)`: Create new question

#### Discussions Management

- `getDiscussions(lessonId)`: Get lesson discussions
- `createDiscussion(discussion)`: Create new discussion

### GraphQL Queries and Mutations

#### Queries

- `GET_SIGNED_VIDEO_URL`: Get signed video URLs
- `GET_VIDEO_PROGRESS`: Get user progress
- `GET_VIDEO_ANALYTICS`: Get video analytics
- `GET_NOTES`: Get user notes
- `GET_QUESTIONS`: Get lesson questions
- `GET_DISCUSSIONS`: Get lesson discussions
- `GET_LESSON_DETAILS`: Get lesson details

#### Mutations

- `UPDATE_VIDEO_PROGRESS`: Update user progress
- `TRACK_VIDEO_EVENT`: Track video events
- `CREATE_NOTE`: Create note
- `UPDATE_NOTE`: Update note
- `DELETE_NOTE`: Delete note
- `CREATE_QUESTION`: Create question
- `CREATE_DISCUSSION`: Create discussion

## Support

For issues or questions:
1. Check CloudWatch logs for errors
2. Verify CloudFront distribution status
3. Check DynamoDB table permissions
4. Review signed URL generation
5. Test with sample video content
6. Contact development team

The course player system provides a comprehensive, secure, and scalable solution for video-based learning with professional-grade features and performance optimization.

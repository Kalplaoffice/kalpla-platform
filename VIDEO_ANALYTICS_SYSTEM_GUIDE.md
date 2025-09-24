# Video Analytics System

This document provides a comprehensive guide for the Kalpla video analytics system that tracks user interactions, engagement metrics, and provides detailed insights into video performance and user behavior.

## Overview

The video analytics system provides:
- **Comprehensive Event Tracking**: Play, pause, seek, completion, quality changes, and more
- **Real-time Analytics**: Live tracking of user interactions and engagement
- **Session Management**: Detailed session tracking with device information
- **Engagement Metrics**: Calculated engagement scores and performance indicators
- **Analytics Dashboard**: Visual dashboard with charts and insights
- **Database Storage**: Structured storage in DynamoDB with TTL management

## Architecture

```
Frontend (React) → Video Analytics Service → GraphQL API Gateway
                                                      ↓
                                              Analytics Processor (Lambda)
                                                      ↓
                                              DynamoDB Tables
```

## Components

### 1. Analytics Processor Lambda Function (`analyticsProcessor`)

**Location**: `amplify/backend/function/analyticsProcessor/src/index.js`

**Features**:
- Event processing and aggregation
- Real-time analytics calculation
- Database updates and metrics computation
- Error handling and retry mechanisms

**Event Types Processed**:
- `video_progress`: Progress updates and completion tracking
- `video_event`: Individual video events (play, pause, seek, etc.)
- `video_session`: Session start/end and session data
- `video_engagement`: Engagement metrics and calculations

### 2. Video Analytics Service (`videoAnalyticsService.ts`)

**Location**: `src/lib/videoAnalyticsService.ts`

**Features**:
- Session management and initialization
- Event tracking and queuing
- Device information detection
- Engagement metrics calculation
- Batch processing for performance

**Key Methods**:
- `initializeSession()`: Start a new video session
- `trackPlay()`, `trackPause()`, `trackSeek()`: Track specific events
- `trackComplete()`: Track video completion
- `trackQualityChange()`, `trackVolumeChange()`: Track user interactions
- `endSession()`: End session and calculate metrics

### 3. Video Analytics Dashboard (`VideoAnalyticsDashboard.tsx`)

**Location**: `src/components/analytics/VideoAnalyticsDashboard.tsx`

**Features**:
- Real-time analytics visualization
- Multiple view modes (overview, events, engagement, devices)
- Interactive charts and metrics
- Time range filtering
- Responsive design

## Database Schema

### DynamoDB Tables

#### 1. Video Events Table (`VIDEO_EVENTS_TABLE`)
```json
{
  "id": "userId_lessonId_timestamp",
  "userId": "string",
  "courseId": "string", 
  "lessonId": "string",
  "eventType": "PLAY|PAUSE|SEEK|COMPLETE|QUALITY_CHANGE|VOLUME_CHANGE|BUFFER_START|BUFFER_END|ERROR|SESSION_START|SESSION_END",
  "eventDetails": {
    "currentTime": "number",
    "duration": "number",
    "quality": "string",
    "volume": "number",
    "fromTime": "number",
    "toTime": "number",
    "errorMessage": "string",
    "deviceInfo": {
      "userAgent": "string",
      "screenResolution": "string",
      "platform": "string",
      "browser": "string"
    },
    "sessionId": "string"
  },
  "timestamp": "ISO string",
  "createdAt": "ISO string",
  "ttl": "number (1 year)"
}
```

#### 2. Video Sessions Table (`VIDEO_SESSIONS_TABLE`)
```json
{
  "id": "sessionId",
  "userId": "string",
  "courseId": "string",
  "lessonId": "string",
  "sessionData": {
    "sessionId": "string",
    "startTime": "number",
    "endTime": "number",
    "totalWatchTime": "number",
    "playCount": "number",
    "pauseCount": "number",
    "seekCount": "number",
    "qualityChanges": "number",
    "volumeChanges": "number",
    "completionCount": "number",
    "deviceInfo": "object"
  },
  "timestamp": "ISO string",
  "createdAt": "ISO string",
  "ttl": "number (90 days)"
}
```

#### 3. Video Engagement Table (`VIDEO_ENGAGEMENT_TABLE`)
```json
{
  "id": "userId_lessonId_timestamp",
  "userId": "string",
  "courseId": "string",
  "lessonId": "string",
  "engagementData": {
    "totalWatchTime": "number",
    "totalDuration": "number",
    "playCount": "number",
    "pauseCount": "number",
    "seekCount": "number",
    "completionCount": "number",
    "sessionCount": "number",
    "qualityChanges": "number",
    "volumeChanges": "number",
    "notesCount": "number",
    "questionsCount": "number",
    "discussionsCount": "number"
  },
  "engagementMetrics": {
    "engagementScore": "number (0-100)",
    "totalSessions": "number",
    "averageWatchTime": "number",
    "completionRate": "number",
    "watchTimeRatio": "number",
    "interactionScore": "number",
    "playCount": "number",
    "pauseCount": "number",
    "seekCount": "number"
  },
  "timestamp": "ISO string",
  "createdAt": "ISO string",
  "ttl": "number (1 year)"
}
```

#### 4. Lesson Analytics Table (`LESSON_ANALYTICS_TABLE`)
```json
{
  "id": "lessonId_date",
  "lessonId": "string",
  "date": "string (YYYY-MM-DD)",
  "totalPlays": "number",
  "totalPauses": "number",
  "totalCompletions": "number",
  "totalSeeks": "number",
  "totalQualityChanges": "number",
  "totalViews": "number",
  "averageWatchTime": "number",
  "completionRate": "number",
  "engagementScore": "number",
  "lastUpdated": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 5. User Engagement Table (`USER_ENGAGEMENT_TABLE`)
```json
{
  "id": "userId_lessonId",
  "userId": "string",
  "lessonId": "string",
  "engagementScore": "number (0-100)",
  "totalSessions": "number",
  "averageWatchTime": "number",
  "completionRate": "number",
  "lastUpdated": "ISO string",
  "updatedAt": "ISO string"
}
```

## Event Types

### Video Events

| Event Type | Description | Data Captured |
|------------|-------------|---------------|
| `PLAY` | Video playback started | currentTime, duration, quality |
| `PAUSE` | Video playback paused | currentTime, duration |
| `SEEK` | User seeks to different time | fromTime, toTime |
| `COMPLETE` | Video playback completed | duration, quality |
| `QUALITY_CHANGE` | Video quality changed | fromQuality, toQuality, currentTime |
| `VOLUME_CHANGE` | Volume level changed | volume, currentTime |
| `BUFFER_START` | Buffering started | currentTime |
| `BUFFER_END` | Buffering ended | currentTime |
| `ERROR` | Video playback error | errorMessage, currentTime |
| `SESSION_START` | Video session started | sessionId, deviceInfo |
| `SESSION_END` | Video session ended | sessionId, totalWatchTime |

### Device Information

```typescript
interface DeviceInfo {
  userAgent: string;           // Browser user agent
  screenResolution: string;    // Screen resolution (e.g., "1920x1080")
  connectionType?: string;     // Network connection type
  connectionSpeed?: number;    // Connection speed in kbps
  platform: string;           // Operating system platform
  browser: string;            // Browser type
}
```

## Engagement Metrics

### Engagement Score Calculation

The engagement score (0-100) is calculated using:

```javascript
const engagementScore = Math.round(
  (watchTimeRatio * 40) +      // 40% weight on watch time
  (completionRate * 40) +       // 40% weight on completion rate
  (interactionScore * 0.2)      // 20% weight on interactions
);
```

Where:
- **Watch Time Ratio**: `totalWatchTime / totalDuration`
- **Completion Rate**: `completionCount / sessionCount`
- **Interaction Score**: `min(100, (playCount + pauseCount + seekCount) * 2)`

### Engagement Levels

| Score Range | Level | Description |
|-------------|-------|-------------|
| 80-100 | Excellent | High engagement, frequent interactions |
| 60-79 | Good | Good engagement, regular interactions |
| 40-59 | Fair | Moderate engagement, some interactions |
| 0-39 | Poor | Low engagement, minimal interactions |

## Usage

### 1. Initialize Analytics in Course Player

```typescript
import { videoAnalyticsService } from '@/lib/videoAnalyticsService';

// Initialize session when video loads
useEffect(() => {
  const initializeAnalytics = async () => {
    await videoAnalyticsService.initializeSession(userId, courseId, lessonId);
  };
  
  initializeAnalytics();
}, [userId, courseId, lessonId]);
```

### 2. Track Video Events

```typescript
// Track play event
const handlePlay = () => {
  videoAnalyticsService.trackPlay(userId, courseId, lessonId, currentTime, duration, quality);
};

// Track pause event
const handlePause = () => {
  videoAnalyticsService.trackPause(userId, courseId, lessonId, currentTime, duration);
};

// Track seek event
const handleSeek = (fromTime: number, toTime: number) => {
  videoAnalyticsService.trackSeek(userId, courseId, lessonId, fromTime, toTime);
};

// Track completion
const handleComplete = () => {
  videoAnalyticsService.trackComplete(userId, courseId, lessonId, duration, quality);
};
```

### 3. Track Quality and Volume Changes

```typescript
// Track quality change
const handleQualityChange = (fromQuality: string, toQuality: string) => {
  videoAnalyticsService.trackQualityChange(userId, courseId, lessonId, fromQuality, toQuality, currentTime);
};

// Track volume change
const handleVolumeChange = (volume: number) => {
  videoAnalyticsService.trackVolumeChange(userId, courseId, lessonId, volume, currentTime);
};
```

### 4. Track Buffer Events

```typescript
// Track buffering
const handleWaiting = () => {
  videoAnalyticsService.trackBufferStart(userId, courseId, lessonId, currentTime);
};

const handleCanPlay = () => {
  videoAnalyticsService.trackBufferEnd(userId, courseId, lessonId, currentTime);
};
```

### 5. Track Errors

```typescript
const handleError = (error: Error) => {
  videoAnalyticsService.trackError(userId, courseId, lessonId, error.message, currentTime);
};
```

### 6. End Session

```typescript
// End session when component unmounts or video ends
useEffect(() => {
  return () => {
    videoAnalyticsService.endSession(userId, courseId, lessonId);
  };
}, []);
```

### 7. Use Analytics Dashboard

```typescript
import { VideoAnalyticsDashboard } from '@/components/analytics/VideoAnalyticsDashboard';

function AnalyticsPage() {
  return (
    <VideoAnalyticsDashboard
      lessonId="lesson-123"
      courseId="course-456"
      userId="user-789" // Optional for user-specific analytics
      dateRange={{ start: "2024-01-01", end: "2024-01-31" }} // Optional
    />
  );
}
```

## Analytics Dashboard Features

### Overview Tab
- **Key Metrics**: Total views, plays, completions, average watch time
- **Engagement Score**: Overall engagement with completion rate
- **Quality Distribution**: Breakdown of quality usage
- **Performance Indicators**: Visual charts and trends

### Events Tab
- **Recent Events**: List of recent video events with timestamps
- **Event Details**: Time, quality, device information
- **Event Filtering**: Filter by event type, user, or time range
- **Real-time Updates**: Live event tracking

### Engagement Tab
- **User Engagement Metrics**: Detailed engagement breakdown
- **Interaction Metrics**: Play, pause, seek counts
- **Performance Metrics**: Watch time ratio, interaction score
- **Engagement Trends**: Historical engagement data

### Devices Tab
- **Device Distribution**: Breakdown by device type
- **Platform Analytics**: Operating system and browser data
- **Screen Resolution**: Display resolution statistics
- **Connection Analytics**: Network and connection data

## Performance Optimization

### Event Batching
- Events are queued and processed in batches
- Reduces API calls and improves performance
- Automatic flush on component unmount

### TTL Management
- Automatic data expiration using DynamoDB TTL
- Reduces storage costs and improves performance
- Configurable retention periods

### Caching
- Device information cached for session duration
- Reduces redundant calculations
- Improves response times

## Monitoring and Alerts

### CloudWatch Metrics
- **Event Processing Rate**: Events processed per minute
- **Error Rate**: Failed event processing percentage
- **Latency**: Event processing latency
- **Throughput**: Events processed per second

### Alerts
- **High Error Rate**: Alert when error rate exceeds threshold
- **Processing Delays**: Alert when processing latency is high
- **Storage Usage**: Alert when storage usage is high
- **Performance Degradation**: Alert when performance metrics decline

## Security Considerations

### Data Privacy
- User data anonymization options
- GDPR compliance features
- Data retention policies
- User consent management

### Access Control
- Role-based access to analytics data
- API authentication and authorization
- Audit logging for data access
- Secure data transmission

## Troubleshooting

### Common Issues

1. **Events Not Tracking**:
   - Check network connectivity
   - Verify user authentication
   - Check browser console for errors
   - Verify API endpoint configuration

2. **Analytics Dashboard Not Loading**:
   - Check DynamoDB permissions
   - Verify GraphQL queries
   - Check data availability
   - Review error logs

3. **Performance Issues**:
   - Monitor event queue size
   - Check Lambda function performance
   - Review DynamoDB read/write capacity
   - Optimize query patterns

### Debug Commands

```bash
# Check Lambda function logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/analyticsProcessor

# Check DynamoDB table status
aws dynamodb describe-table --table-name VideoEvents-dev

# Check CloudWatch metrics
aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Duration --dimensions Name=FunctionName,Value=analyticsProcessor-dev
```

## Future Enhancements

1. **Real-time Analytics**: WebSocket-based real-time updates
2. **Machine Learning**: Predictive analytics and recommendations
3. **Advanced Visualizations**: Interactive charts and graphs
4. **Export Features**: Data export in various formats
5. **Custom Dashboards**: User-configurable dashboard layouts
6. **A/B Testing**: Analytics for A/B testing scenarios
7. **Mobile Analytics**: Enhanced mobile-specific metrics
8. **Integration APIs**: Third-party analytics integration

## API Reference

### Video Analytics Service

#### Methods

- `initializeSession(userId, courseId, lessonId)`: Initialize new session
- `trackPlay(userId, courseId, lessonId, currentTime, duration, quality)`: Track play event
- `trackPause(userId, courseId, lessonId, currentTime, duration)`: Track pause event
- `trackSeek(userId, courseId, lessonId, fromTime, toTime)`: Track seek event
- `trackComplete(userId, courseId, lessonId, duration, quality)`: Track completion
- `trackQualityChange(userId, courseId, lessonId, fromQuality, toQuality, currentTime)`: Track quality change
- `trackVolumeChange(userId, courseId, lessonId, volume, currentTime)`: Track volume change
- `trackBufferStart(userId, courseId, lessonId, currentTime)`: Track buffering start
- `trackBufferEnd(userId, courseId, lessonId, currentTime)`: Track buffering end
- `trackError(userId, courseId, lessonId, errorMessage, currentTime)`: Track error
- `updateWatchTime(watchTime)`: Update watch time
- `endSession(userId, courseId, lessonId)`: End session
- `flushEventQueue()`: Process remaining events
- `getCurrentSessionId()`: Get current session ID
- `getCurrentSessionData()`: Get current session data

### GraphQL Queries and Mutations

#### Queries

- `GET_VIDEO_ANALYTICS`: Get video analytics data
- `GET_LESSON_ANALYTICS`: Get lesson analytics
- `GET_USER_ENGAGEMENT`: Get user engagement metrics
- `GET_VIDEO_EVENTS`: Get video events

#### Mutations

- `TRACK_VIDEO_EVENT`: Track video event
- `CREATE_VIDEO_SESSION`: Create video session
- `UPDATE_VIDEO_ENGAGEMENT`: Update engagement metrics

## Support

For issues or questions:
1. Check CloudWatch logs for errors
2. Verify DynamoDB table permissions
3. Check GraphQL query syntax
4. Review event tracking implementation
5. Contact development team

The video analytics system provides comprehensive tracking and insights into user behavior, enabling data-driven decisions for improving video content and user experience.

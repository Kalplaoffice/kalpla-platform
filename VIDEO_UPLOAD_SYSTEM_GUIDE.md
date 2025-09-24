# Video Upload System with S3 + Transcoding for Adaptive Bitrate Streaming

This document provides a comprehensive guide for the Kalpla video upload system that includes S3 storage and AWS MediaConvert transcoding for adaptive bitrate streaming.

## Overview

The video upload system provides:
- **S3 Storage**: Secure video file storage with lifecycle management
- **MediaConvert Transcoding**: Automatic conversion to multiple quality levels (4K, 1080p, 720p, 480p, 360p)
- **Adaptive Bitrate Streaming**: HLS (HTTP Live Streaming) with automatic quality selection
- **CloudFront CDN**: Global content delivery for optimal performance
- **Real-time Processing**: Status monitoring and progress tracking
- **Security**: Signed URLs and access control

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Lambda        │
│   VideoUploader │───▶│   + Lambda       │───▶│   Functions     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │◀───│   S3 Bucket      │◀───│   MediaConvert  │
│   CDN           │    │   Video Storage   │    │   Transcoding   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Components

### 1. Video Upload Processor (`videoUploadProcessor`)

**Location**: `amplify/backend/function/videoUploadProcessor/src/index.js`

**Features**:
- Triggers on S3 upload events
- Creates MediaConvert jobs for transcoding
- Supports multiple quality levels (4K, 1080p, 720p, 480p, 360p)
- HLS output with AES-128 encryption
- Progress tracking and status updates

**Key Configuration**:
- Segment length: 6 seconds (optimized for adaptive streaming)
- Quality levels: 5 different resolutions
- Audio: AAC encoding with multiple bitrates
- Encryption: AES-128 for content protection

### 2. Video Signed URL Generator (`videoSignedUrlGenerator`)

**Location**: `amplify/backend/function/videoSignedUrlGenerator/src/index.js`

**Features**:
- Generates secure signed URLs for video access
- Supports multiple quality levels
- User access verification
- CloudFront integration

### 3. Adaptive Video Player Component

**Location**: `src/components/video/AdaptiveVideoPlayer.tsx`

**Features**:
- HLS.js integration for adaptive streaming
- Quality selection menu
- Progress tracking
- Custom controls
- Real-time status monitoring

### 4. Enhanced Video Service

**Location**: `src/lib/videoService.ts`

**Features**:
- Upload progress tracking
- Processing status monitoring
- Video manifest URL generation
- Quality level management
- Error handling and retry logic

## Quality Levels

| Quality | Resolution | Bitrate | Use Case |
|---------|------------|---------|----------|
| 4K (2160p) | 3840x2160 | 15 Mbps | High-end displays, excellent bandwidth |
| 1080p | 1920x1080 | 5 Mbps | Standard HD, good bandwidth |
| 720p | 1280x720 | 3 Mbps | Balanced quality/bandwidth |
| 480p | 854x480 | 1.5 Mbps | Lower bandwidth, mobile |
| 360p | 640x360 | 800 kbps | Very low bandwidth, slow connections |

## Setup and Deployment

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. Node.js and npm installed
3. Amplify CLI installed
4. CloudFormation template access

### Deployment Steps

1. **Deploy Infrastructure**:
   ```bash
   ./scripts/deploy-video-infrastructure.sh dev us-east-1
   ```

2. **Configure Environment Variables**:
   ```bash
   export MEDIACONVERT_ROLE_ARN="arn:aws:iam::ACCOUNT:role/MediaConvertRole"
   export VIDEO_BUCKET="kalpla-videos-dev-ACCOUNT"
   export CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
   ```

3. **Deploy Lambda Functions**:
   ```bash
   amplify push
   ```

### Manual Setup (Alternative)

1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://kalpla-videos-dev-ACCOUNT
   ```

2. **Create MediaConvert Role**:
   ```bash
   aws iam create-role --role-name MediaConvertRole --assume-role-policy-document file://mediaconvert-trust-policy.json
   ```

3. **Deploy CloudFormation Stack**:
   ```bash
   aws cloudformation create-stack --stack-name kalpla-video-infrastructure-dev --template-body file://cloudformation/video-infrastructure.yaml --capabilities CAPABILITY_IAM
   ```

## Usage

### 1. Upload Video

```typescript
import { VideoUploader } from '@/components/video/VideoUploader';

function LessonEditor() {
  const handleUploadComplete = (videoKey: string) => {
    console.log('Video uploaded:', videoKey);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return (
    <VideoUploader
      lessonId="lesson-123"
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
    />
  );
}
```

### 2. Play Video

```typescript
import { AdaptiveVideoPlayer } from '@/components/video/AdaptiveVideoPlayer';

function LessonPlayer() {
  const handleProgress = (progress: number) => {
    console.log('Video progress:', progress);
  };

  const handleComplete = () => {
    console.log('Video completed');
  };

  return (
    <AdaptiveVideoPlayer
      lessonId="lesson-123"
      onProgress={handleProgress}
      onComplete={handleComplete}
      autoplay={false}
      showControls={true}
    />
  );
}
```

### 3. Monitor Processing Status

```typescript
import { videoService } from '@/lib/videoService';

async function checkProcessingStatus(lessonId: string) {
  try {
    const status = await videoService.getProcessingStatus(lessonId);
    console.log('Processing status:', status);
    
    if (status === 'COMPLETED') {
      const manifestUrl = await videoService.getVideoManifestUrl(lessonId);
      console.log('Manifest URL:', manifestUrl);
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
}
```

## Configuration

### MediaConvert Settings

The MediaConvert job is configured with:
- **Input**: Supports MP4, MOV, AVI formats
- **Output**: HLS with multiple quality levels
- **Encryption**: AES-128 encryption
- **Segments**: 6-second segments for optimal streaming
- **Audio**: AAC encoding with multiple bitrates

### S3 Configuration

- **Lifecycle Rules**: Automatic transition to IA (30 days) and Glacier (90 days)
- **CORS**: Configured for web access
- **Versioning**: Enabled for data protection
- **Public Access**: Blocked for security

### CloudFront Configuration

- **Caching**: Optimized for video content
- **Compression**: Enabled for better performance
- **Security**: WAF protection with rate limiting
- **HTTPS**: Enforced for all requests

## Monitoring and Analytics

### Processing Status

The system tracks video processing through these states:
- `UPLOADING`: File being uploaded to S3
- `PROCESSING`: MediaConvert job running
- `COMPLETED`: Video ready for streaming
- `FAILED`: Processing error occurred

### Video Analytics

Tracked metrics include:
- Total views
- Average watch time
- Completion rate
- Drop-off points
- Engagement score

## Troubleshooting

### Common Issues

1. **Upload Fails**:
   - Check file size (max 2GB)
   - Verify file format (MP4, MOV, AVI)
   - Check S3 permissions

2. **Processing Stuck**:
   - Check MediaConvert job status
   - Verify IAM role permissions
   - Check CloudWatch logs

3. **Video Won't Play**:
   - Verify processing completed
   - Check CloudFront distribution
   - Test manifest URL access

### Debug Commands

```bash
# Check MediaConvert jobs
aws mediaconvert list-jobs --region us-east-1

# Check S3 bucket contents
aws s3 ls s3://kalpla-videos-dev-ACCOUNT/processed/

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name kalpla-video-infrastructure-dev
```

## Security Considerations

1. **Access Control**: All videos require signed URLs
2. **Encryption**: Videos encrypted with AES-128
3. **CORS**: Properly configured for web access
4. **WAF**: Rate limiting and DDoS protection
5. **IAM**: Least privilege access for Lambda functions

## Performance Optimization

1. **CDN**: CloudFront for global distribution
2. **Caching**: Aggressive caching for video segments
3. **Compression**: Gzip compression for manifests
4. **Adaptive Streaming**: Automatic quality selection
5. **Lifecycle Management**: Automatic archival to reduce costs

## Cost Optimization

1. **Storage Classes**: Automatic transition to cheaper storage
2. **MediaConvert**: On-demand pricing
3. **CloudFront**: Pay-per-use model
4. **Lifecycle Rules**: Automatic cleanup of incomplete uploads

## Future Enhancements

1. **AI-Powered Quality**: Automatic quality optimization
2. **Thumbnail Generation**: Automatic thumbnail creation
3. **Subtitle Support**: Multi-language subtitles
4. **Live Streaming**: Real-time video streaming
5. **Analytics Dashboard**: Advanced video analytics

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review MediaConvert job status
3. Verify IAM permissions
4. Test with sample videos
5. Contact development team

## API Reference

### VideoService Methods

- `uploadVideoFile(file, lessonId, onProgress?)`: Upload video with progress tracking
- `getProcessingStatus(lessonId)`: Get current processing status
- `getVideoManifestUrl(lessonId)`: Get HLS manifest URL
- `getVideoQualities(lessonId)`: Get available quality levels
- `updateVideoProgress(progress, userId)`: Update viewing progress
- `trackVideoEvent(lessonId, userId, eventType, eventData)`: Track video events

### GraphQL Queries

- `GET_PROCESSING_STATUS`: Query processing status
- `GET_VIDEO_MANIFEST_URL`: Get manifest URL
- `GET_VIDEO_QUALITIES`: Get quality levels
- `GET_VIDEO_PROGRESS`: Get user progress
- `GET_VIDEO_ANALYTICS`: Get analytics data

### GraphQL Mutations

- `PROCESS_VIDEO`: Trigger video processing
- `UPDATE_VIDEO_PROGRESS`: Update progress
- `TRACK_VIDEO_EVENT`: Track events
- `CREATE_LIVE_SESSION`: Create live sessions
- `UPDATE_INTERACTIVE_TIMELINE`: Update interactive elements

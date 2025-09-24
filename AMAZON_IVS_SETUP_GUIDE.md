# 🎥 Amazon IVS Live Streaming Setup Guide

## Overview

This guide provides step-by-step instructions to configure Amazon IVS (Interactive Video Service) live streaming in your Kalpla platform for both instructor broadcasting and student playback.

## ✅ Code Changes Completed

The following code changes have been implemented:

### 1. Installed Required Packages
- ✅ `@aws-sdk/client-ivs` - AWS SDK for IVS channel management
- ✅ `amazon-ivs-web-broadcast` - IVS Web Broadcast SDK for instructors
- ✅ `amazon-ivs-player` - IVS Player SDK for students

### 2. Updated `src/lib/liveStreamingService.ts`
- ✅ Added proper IVS client initialization with AWS SDK v3
- ✅ Implemented `createLiveChannel()` method for channel creation
- ✅ Added proper error handling and logging
- ✅ Fixed channel and stream key management

### 3. Updated `src/components/instructor/InstructorLiveStreaming.tsx`
- ✅ Added Amazon IVS Web Broadcast SDK integration
- ✅ Implemented proper `startIVSStream()` method
- ✅ Added `stopIVSStream()` method for cleanup
- ✅ Integrated with user media (camera/microphone)
- ✅ Added proper error handling

### 4. Created `src/components/live/StudentLivePlayer.tsx`
- ✅ Implemented Amazon IVS Player SDK for playback
- ✅ Added quality monitoring and connection status
- ✅ Created responsive player controls
- ✅ Added fullscreen and audio controls
- ✅ Implemented proper error handling

## 🔧 AWS Configuration Required

### Step 1: Enable Amazon IVS Service

1. **Open AWS Console**
   - Go to Amazon IVS service
   - Region: `ap-south-1` (same as your other services)

2. **Verify Service Access**
   - Ensure IVS service is available in your region
   - Check service quotas and limits

### Step 2: Configure IAM Permissions

1. **Create IAM Policy for IVS**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ivs:CreateChannel",
           "ivs:GetChannel",
           "ivs:ListChannels",
           "ivs:DeleteChannel",
           "ivs:GetStreamKey",
           "ivs:CreateStreamKey",
           "ivs:ListStreamKeys",
           "ivs:DeleteStreamKey",
           "ivs:GetStream",
           "ivs:ListStreams",
           "ivs:StopStream"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Attach Policy to Role**
   - Attach this policy to your Lambda execution role
   - Or to your application's IAM user/role

### Step 3: Environment Variables

Add these environment variables to your `.env.local`:

```env
# AWS Credentials for IVS
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key
NEXT_PUBLIC_AWS_REGION=ap-south-1

# IVS Configuration
NEXT_PUBLIC_IVS_REGION=ap-south-1
```

## 🚀 Testing the Integration

### Step 1: Test Channel Creation

1. **Start Development Server**
   ```bash
   cd kalpla-platform
   npm run dev
   ```

2. **Test Channel Creation**
   - Go to instructor dashboard
   - Try creating a live session
   - Check browser console for success messages

### Step 2: Test Instructor Broadcasting

1. **Create Live Session**
   - Instructor creates a new live session
   - System should create IVS channel and stream key
   - Instructor gets stream key and ingest endpoint

2. **Start Broadcasting**
   - Click "Start Streaming" button
   - Allow camera/microphone permissions
   - Should see video preview and "Stream started" message

### Step 3: Test Student Playback

1. **Join Live Session**
   - Student navigates to live session
   - Should see `StudentLivePlayer` component
   - Stream should load and play automatically

2. **Test Player Controls**
   - Play/pause functionality
   - Volume controls
   - Fullscreen mode
   - Quality indicators

## 🔧 Production Deployment

### Step 1: Update Environment Variables

For production, use IAM roles instead of access keys:

```env
# Production - Use IAM roles
AWS_REGION=ap-south-1
IVS_REGION=ap-south-1
```

### Step 2: Configure CORS

Update your IVS channel settings for production domains:

```javascript
// In your IVS channel configuration
const channelConfig = {
  name: 'kalpla-production-channel',
  type: 'BASIC',
  latencyMode: 'LOW',
  authorized: false,
  // Add CORS configuration if needed
};
```

### Step 3: Update Redirect URLs

Update your application URLs for production:

```javascript
// Update in your live streaming service
const productionUrls = {
  playbackUrl: 'https://your-production-domain.com/live',
  ingestEndpoint: 'https://your-production-domain.com/broadcast'
};
```

## 🐛 Troubleshooting

### Common Issues

1. **"IVS Client not initialized"**
   - Check AWS credentials
   - Verify IAM permissions
   - Check region configuration

2. **"Failed to create IVS channel"**
   - Check IAM permissions for `ivs:CreateChannel`
   - Verify AWS region is correct
   - Check service quotas

3. **"Stream key not found"**
   - Ensure `ivs:GetStreamKey` permission
   - Check channel creation was successful
   - Verify stream key generation

4. **"Player not supported"**
   - Check browser compatibility
   - Ensure HTTPS in production
   - Verify IVS Player SDK loaded correctly

5. **"Failed to start broadcast"**
   - Check camera/microphone permissions
   - Verify stream key is valid
   - Check network connectivity

### Debug Steps

1. **Check Browser Console**
   - Look for IVS-related errors
   - Check network requests to AWS
   - Verify SDK initialization

2. **Check AWS CloudWatch**
   - Look for Lambda function logs
   - Check IVS service logs
   - Verify API calls

3. **Test with Different Browsers**
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

## 📊 Expected Behavior

### Successful Instructor Flow

1. Instructor creates live session
2. IVS channel created automatically
3. Stream key generated
4. Instructor starts broadcasting
5. Video preview shows
6. "Stream started" confirmation

### Successful Student Flow

1. Student joins live session
2. IVS player loads stream
3. Video plays automatically
4. Quality indicators show
5. Controls work properly
6. Connection status updates

### Data Flow

```
Instructor → Create Session → IVS Channel → Stream Key → Broadcast
Student → Join Session → Playback URL → IVS Player → Watch Stream
```

## 🎯 Key Features Implemented

### For Instructors
- ✅ **Channel Management**: Automatic IVS channel creation
- ✅ **Broadcasting**: Real-time video/audio streaming
- ✅ **Stream Controls**: Start/stop streaming
- ✅ **Media Controls**: Camera/microphone toggle
- ✅ **Preview**: Local video preview
- ✅ **Error Handling**: Comprehensive error management

### For Students
- ✅ **Live Playback**: Real-time stream viewing
- ✅ **Quality Monitoring**: Connection quality indicators
- ✅ **Player Controls**: Play/pause, volume, fullscreen
- ✅ **Responsive Design**: Works on all devices
- ✅ **Error Recovery**: Automatic retry on errors
- ✅ **Status Indicators**: Live status and connection info

### For Platform
- ✅ **Scalable Infrastructure**: AWS IVS handles scaling
- ✅ **Global CDN**: CloudFront integration
- ✅ **Security**: Secure stream keys and URLs
- ✅ **Analytics**: Stream metrics and monitoring
- ✅ **Cost Optimization**: Pay-per-use pricing

## 🚀 Next Steps

1. **Test the Integration**
   - Create test live sessions
   - Verify instructor broadcasting
   - Test student playback

2. **Configure Production**
   - Set up production environment variables
   - Configure CORS settings
   - Test with production domains

3. **Monitor Performance**
   - Set up CloudWatch alarms
   - Monitor stream quality
   - Track usage metrics

4. **Add Advanced Features**
   - Recording capabilities
   - Chat integration
   - Screen sharing
   - Multi-camera support

## 📞 Support

If you encounter issues:

1. Check AWS IVS service status
2. Verify IAM permissions
3. Check browser console for errors
4. Test with different browsers
5. Review CloudWatch logs

The Amazon IVS live streaming integration is now properly implemented and ready for testing!

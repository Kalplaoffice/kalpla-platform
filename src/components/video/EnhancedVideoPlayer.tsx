'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { videoService } from '@/lib/videoService';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  lessonId: string;
  title: string;
  duration?: number;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

interface InteractiveElement {
  startTime: number;
  endTime?: number;
  type: 'QUIZ' | 'HOTSPOT' | 'CHAPTER_MARKER' | 'CTA' | 'POLL' | 'NOTE';
  id: string;
  payload: any;
}

export function EnhancedVideoPlayer({ 
  lessonId, 
  title, 
  duration, 
  onProgress, 
  onComplete 
}: VideoPlayerProps) {
  const { user } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [activeElement, setActiveElement] = useState<InteractiveElement | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
  
  // Analytics tracking
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);
  const [hasTrackedQuartiles, setHasTrackedQuartiles] = useState({
    25: false,
    50: false,
    75: false
  });

  useEffect(() => {
    initializeVideo();
    return () => {
      // Cleanup: save final progress
      if (videoRef.current && user) {
        saveProgress();
      }
    };
  }, [lessonId, user]);

  const initializeVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get signed URL for video playback
      const url = await videoService.getSignedVideoUrl(lessonId);
      setSignedUrl(url);
      
      // Get interactive timeline
      const timeline = await videoService.getInteractiveTimeline(lessonId);
      setInteractiveElements(timeline);
      
      // Get user's progress
      if (user) {
        const progress = await videoService.getVideoProgress(user.id, lessonId);
        if (progress && videoRef.current) {
          videoRef.current.currentTime = progress.lastPosition;
        }
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      
      // Track play event
      if (!hasTrackedPlay && user) {
        trackEvent('PLAY');
        setHasTrackedPlay(true);
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      
      // Track pause event and save progress
      if (user) {
        trackEvent('PAUSE');
        saveProgress();
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      const oldTime = videoRef.current.currentTime;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Track seek event
      if (user) {
        trackEvent('SEEK', { from: oldTime, to: newTime });
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      setCurrentTime(time);
      setVideoDuration(duration);
      
      // Check for interactive elements
      checkInteractiveElements(time);
      
      // Track quartiles
      trackQuartiles(time, duration);
      
      // Update progress callback
      onProgress?.(time, duration);
      
      // Save progress every 15 seconds
      if (time - lastProgressUpdate >= 15 && user) {
        saveProgress();
        setLastProgressUpdate(time);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    
    // Track completion
    if (user) {
      trackEvent('COMPLETE');
      saveProgress();
    }
    
    onComplete?.();
  };

  const checkInteractiveElements = (currentTime: number) => {
    const activeElement = interactiveElements.find(element => 
      currentTime >= element.startTime && 
      (!element.endTime || currentTime <= element.endTime)
    );
    
    if (activeElement && activeElement.id !== activeElement?.id) {
      setActiveElement(activeElement);
    } else if (!activeElement) {
      setActiveElement(null);
    }
  };

  const trackQuartiles = (currentTime: number, duration: number) => {
    if (!user) return;
    
    const percent = (currentTime / duration) * 100;
    
    if (percent >= 25 && !hasTrackedQuartiles[25]) {
      trackEvent('QUARTILE_25');
      setHasTrackedQuartiles(prev => ({ ...prev, 25: true }));
    }
    
    if (percent >= 50 && !hasTrackedQuartiles[50]) {
      trackEvent('QUARTILE_50');
      setHasTrackedQuartiles(prev => ({ ...prev, 50: true }));
    }
    
    if (percent >= 75 && !hasTrackedQuartiles[75]) {
      trackEvent('QUARTILE_75');
      setHasTrackedQuartiles(prev => ({ ...prev, 75: true }));
    }
  };

  const trackEvent = async (eventType: string, metadata?: any) => {
    if (!user || !videoRef.current) return;
    
    try {
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
    } catch (error) {
      console.error('Error tracking video event:', error);
    }
  };

  const saveProgress = async () => {
    if (!user || !videoRef.current) return;
    
    try {
      await videoService.updateVideoProgress({
        lessonId,
        lastPosition: videoRef.current.currentTime,
        duration: videoRef.current.duration,
        percentWatched: (videoRef.current.currentTime / videoRef.current.duration) * 100,
        completed: (videoRef.current.currentTime / videoRef.current.duration) >= 0.9,
        device: getDeviceInfo(),
        sessionId
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getCurrentBitrate = () => {
    // This would be implemented based on the video player's capabilities
    // For HLS.js, you can get this from the player instance
    return null;
  };

  const getDeviceInfo = () => {
    return navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInteractiveResponse = async (elementId: string, payload: any) => {
    if (!user) return;
    
    try {
      await videoService.submitInteractiveResponse({
        lessonId,
        elementId,
        elementType: activeElement?.type || 'QUIZ',
        timestamp: currentTime,
        payload
      });
      
      // Track interactive event
      trackEvent('INTERACTIVE_EVENT', { elementId, payload });
      
    } catch (error) {
      console.error('Error submitting interactive response:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={initializeVideo}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => setError('Video playback error')}
        onClick={() => setIsPlaying ? handlePause() : handlePlay()}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 2000)}
      >
        {signedUrl && (
          <source src={signedUrl} type="application/x-mpegURL" />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Interactive Overlay */}
      {activeElement && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg pointer-events-auto">
            {activeElement.type === 'QUIZ' && (
              <div>
                <h3 className="font-bold mb-2">Quiz Question</h3>
                <p className="mb-4">{activeElement.payload.question}</p>
                <div className="space-y-2">
                  {activeElement.payload.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleInteractiveResponse(activeElement.id, { answer: option })}
                      className="block w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeElement.type === 'CTA' && (
              <div>
                <h3 className="font-bold mb-2">{activeElement.payload.title}</h3>
                <p className="mb-4">{activeElement.payload.description}</p>
                <button
                  onClick={() => window.open(activeElement.payload.url, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {activeElement.payload.buttonText}
                </button>
              </div>
            )}
            
            {activeElement.type === 'NOTE' && (
              <div>
                <h3 className="font-bold mb-2">Note</h3>
                <p>{activeElement.payload.text}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={videoDuration || 0}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-gray-300"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-300">
                <BookmarkIcon className="h-5 w-5" />
              </button>
              
              <button className="text-white hover:text-gray-300">
                <ChatBubbleLeftIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-gray-300"
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { videoService } from '@/lib/videoService';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface AdaptiveVideoPlayerProps {
  lessonId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoplay?: boolean;
  showControls?: boolean;
}

interface VideoQuality {
  quality: string;
  bitrate: number;
  url: string;
  resolution?: string;
  codec?: string;
}

export function AdaptiveVideoPlayer({ 
  lessonId, 
  onProgress, 
  onComplete, 
  autoplay = false,
  showControls = true 
}: AdaptiveVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qualities, setQualities] = useState<VideoQuality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('idle');
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load video manifest and qualities
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setIsLoading(true);
        
        // Check processing status first
        const status = await videoService.getProcessingStatus(lessonId);
        setProcessingStatus(status);
        
        if (status === 'COMPLETED') {
          // Get manifest URL for HLS streaming
          const manifest = await videoService.getVideoManifestUrl(lessonId);
          setManifestUrl(manifest);
          
          // Get available qualities
          const videoQualities = await videoService.getVideoQualities(lessonId);
          setQualities(videoQualities);
          
          // Set default quality to highest available
          if (videoQualities.length > 0) {
            setCurrentQuality(videoQualities[0].quality);
          }
        } else if (status === 'PROCESSING') {
          // Poll for status updates
          const interval = setInterval(async () => {
            const newStatus = await videoService.getProcessingStatus(lessonId);
            setProcessingStatus(newStatus);
            
            if (newStatus === 'COMPLETED') {
              clearInterval(interval);
              await loadVideoData();
            } else if (newStatus === 'FAILED') {
              clearInterval(interval);
              setError('Video processing failed');
            }
          }, 5000);
          
          return () => clearInterval(interval);
        } else if (status === 'FAILED') {
          setError('Video processing failed');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
  }, [lessonId]);

  // Set up video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !manifestUrl) return;

    // Set up HLS.js for adaptive streaming
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = manifestUrl;
    } else {
      // Use HLS.js for other browsers
      import('hls.js').then((Hls) => {
        if (Hls.default.isSupported()) {
          const hls = new Hls.default({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          
          hls.loadSource(manifestUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.default.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed');
          });
          
          hls.on(Hls.default.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
              setError('Video playback error');
            }
          });
          
          return () => {
            hls.destroy();
          };
        } else {
          setError('HLS not supported in this browser');
        }
      });
    }

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handleError = () => {
      setError('Video playback error');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [manifestUrl, onProgress, onComplete]);

  // Track video progress
  useEffect(() => {
    if (isPlaying && currentTime > 0) {
      progressIntervalRef.current = setInterval(async () => {
        try {
          await videoService.updateVideoProgress({
            lessonId,
            lastPosition: currentTime,
            duration,
            percentWatched: (currentTime / duration) * 100,
            completed: currentTime >= duration * 0.95,
            timeSpent: currentTime,
            device: navigator.userAgent,
            sessionId: Date.now().toString()
          }, 'current-user-id'); // This should come from auth context
        } catch (error) {
          console.error('Error updating video progress:', error);
        }
      }, 10000); // Update every 10 seconds
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, lessonId]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  const changeQuality = useCallback((quality: string) => {
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    
    // HLS.js quality switching would be handled here
    // For now, we'll rely on adaptive streaming
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  if (processingStatus === 'PROCESSING') {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <ClockIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-white mb-2">Processing Video</h3>
        <p className="text-gray-400">
          Your video is being processed for adaptive streaming. This may take a few minutes.
        </p>
      </div>
    );
  }

  if (processingStatus === 'FAILED' || error) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-white mb-2">Video Error</h3>
        <p className="text-gray-400">
          {error || 'Failed to process video. Please try again later.'}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <div className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse">📹</div>
        <h3 className="text-lg font-medium text-white mb-2">Loading Video</h3>
        <p className="text-gray-400">Preparing video for playback...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster="/images/video-placeholder.jpg"
        onClick={togglePlay}
      />

      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                handleSeek(percentage * duration);
              }}
            >
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors"
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
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quality Selector */}
              {qualities.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span className="text-sm">{currentQuality}</span>
                  </button>
                  
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 min-w-32">
                      {qualities.map((quality) => (
                        <button
                          key={quality.quality}
                          onClick={() => changeQuality(quality.quality)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                            currentQuality === quality.quality ? 'text-blue-400' : 'text-white'
                          }`}
                        >
                          {quality.quality} ({quality.bitrate}kbps)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing Complete Indicator */}
      {processingStatus === 'COMPLETED' && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
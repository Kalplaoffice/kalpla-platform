'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ForwardIcon,
  BackwardIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface VideoQuality {
  id: string;
  label: string;
  resolution: string;
  bitrate: number;
  url: string;
  isDefault?: boolean;
}

interface AdaptiveVideoPlayerProps {
  videoQualities: VideoQuality[];
  title: string;
  duration?: number;
  onTimeUpdate?: (currentTime: number) => void;
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
  onQualityChange?: (quality: VideoQuality) => void;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  enableAdaptiveBitrate?: boolean;
}

export function AdaptiveVideoPlayer({
  videoQualities,
  title,
  duration,
  onTimeUpdate,
  onVideoEnd,
  onVideoStart,
  onQualityChange,
  className = '',
  autoPlay = false,
  showControls = true,
  enableAdaptiveBitrate = true
}: AdaptiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(showControls);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality | null>(null);
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<number>(0);
  const [bufferHealth, setBufferHealth] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // Initialize with default quality
  useEffect(() => {
    if (videoQualities.length > 0) {
      const defaultQuality = videoQualities.find(q => q.isDefault) || videoQualities[0];
      setCurrentQuality(defaultQuality);
      setAvailableQualities(videoQualities);
    }
  }, [videoQualities]);

  // Monitor network speed and buffer health
  useEffect(() => {
    if (!videoRef.current || !enableAdaptiveBitrate) return;

    const video = videoRef.current;
    let lastTime = 0;
    let lastBytes = 0;

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferHealth = ((bufferedEnd - video.currentTime) / video.duration) * 100;
        setBufferHealth(Math.max(0, Math.min(100, bufferHealth)));
      }
    };

    const handleLoadStart = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    // Estimate network speed
    const estimateNetworkSpeed = () => {
      if (video.networkState === 2) { // NETWORK_LOADING
        const currentTime = Date.now();
        const currentBytes = video.buffered.length > 0 ? video.buffered.end(0) : 0;
        
        if (lastTime > 0) {
          const timeDiff = (currentTime - lastTime) / 1000;
          const bytesDiff = currentBytes - lastBytes;
          const speed = (bytesDiff * 8) / timeDiff; // bits per second
          setNetworkSpeed(speed);
        }
        
        lastTime = currentTime;
        lastBytes = currentBytes;
      }
    };

    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', estimateNetworkSpeed);

    return () => {
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', estimateNetworkSpeed);
    };
  }, [enableAdaptiveBitrate]);

  // Adaptive bitrate logic
  useEffect(() => {
    if (!enableAdaptiveBitrate || !currentQuality) return;

    const video = videoRef.current;
    if (!video) return;

    // Check if we need to switch quality
    const shouldSwitchQuality = () => {
      if (bufferHealth < 10 && networkSpeed > 0) {
        // Buffer is low, try to switch to lower quality
        const currentIndex = availableQualities.findIndex(q => q.id === currentQuality.id);
        if (currentIndex > 0) {
          const lowerQuality = availableQualities[currentIndex - 1];
          switchToQuality(lowerQuality);
          return true;
        }
      } else if (bufferHealth > 30 && networkSpeed > 0) {
        // Buffer is healthy, try to switch to higher quality
        const currentIndex = availableQualities.findIndex(q => q.id === currentQuality.id);
        if (currentIndex < availableQualities.length - 1) {
          const higherQuality = availableQualities[currentIndex + 1];
          if (networkSpeed > higherQuality.bitrate * 1.5) {
            switchToQuality(higherQuality);
            return true;
          }
        }
      }
      return false;
    };

    const switchToQuality = (quality: VideoQuality) => {
      if (quality.id === currentQuality.id) return;
      
      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;
      
      setCurrentQuality(quality);
      video.src = quality.url;
      video.load();
      
      video.addEventListener('loadeddata', () => {
        video.currentTime = currentTime;
        if (wasPlaying) {
          video.play();
        }
      }, { once: true });
      
      onQualityChange?.(quality);
    };

    // Check quality every 5 seconds
    const interval = setInterval(shouldSwitchQuality, 5000);
    
    return () => clearInterval(interval);
  }, [currentQuality, bufferHealth, networkSpeed, enableAdaptiveBitrate, availableQualities, onQualityChange]);

  const handleQualitySelect = (quality: VideoQuality) => {
    if (quality.id === currentQuality?.id) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    
    setCurrentQuality(quality);
    video.src = quality.url;
    video.load();
    
    video.addEventListener('loadeddata', () => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        video.play();
      }
    }, { once: true });
    
    onQualityChange?.(quality);
    setShowQualityMenu(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatBitrate = (bitrate: number) => {
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(1)} Mbps`;
    } else if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(0)} Kbps`;
    }
    return `${bitrate} bps`;
  };

  const getNetworkSpeedLabel = (speed: number) => {
    if (speed >= 1000000) {
      return 'Fast';
    } else if (speed >= 500000) {
      return 'Good';
    } else if (speed >= 100000) {
      return 'Fair';
    }
    return 'Slow';
  };

  const getNetworkSpeedColor = (speed: number) => {
    if (speed >= 1000000) {
      return 'text-green-500';
    } else if (speed >= 500000) {
      return 'text-blue-500';
    } else if (speed >= 100000) {
      return 'text-yellow-500';
    }
    return 'text-red-500';
  };

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={currentQuality?.url || ''}
        className="w-full h-full"
        autoPlay={autoPlay}
        onLoadStart={() => setIsLoading(true)}
        onLoadedMetadata={() => {
          setDuration(videoRef.current?.duration || 0);
          setIsLoading(false);
        }}
        onTimeUpdate={() => {
          const time = videoRef.current?.currentTime || 0;
          setCurrentTime(time);
          onTimeUpdate?.(time);
        }}
        onEnded={() => {
          setIsPlaying(false);
          onVideoEnd?.();
        }}
        onPlay={() => {
          setIsPlaying(true);
          onVideoStart?.();
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => setError('Failed to load video')}
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeout) {
            clearTimeout(controlsTimeout);
          }
          const timeout = setTimeout(() => {
            setShowControls(false);
          }, 3000);
          setControlsTimeout(timeout);
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading video...</p>
          </div>
        </div>
      )}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="text-center text-white">
            <div className="animate-pulse rounded-full h-8 w-8 border-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Buffering...</p>
          </div>
        </div>
      )}

      {showControls && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
                  }
                }}
                className="hover:text-gray-300 transition-colors"
              >
                <BackwardIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => {
                  if (videoRef.current) {
                    if (isPlaying) {
                      videoRef.current.pause();
                    } else {
                      videoRef.current.play();
                    }
                  }
                }}
                className="hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="h-8 w-8" />
                ) : (
                  <PlayIcon className="h-8 w-8" />
                )}
              </button>
              
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
                  }
                }}
                className="hover:text-gray-300 transition-colors"
              >
                <ForwardIcon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isMuted) {
                        videoRef.current.volume = volume;
                        setIsMuted(false);
                      } else {
                        videoRef.current.volume = 0;
                        setIsMuted(true);
                      }
                    }
                  }}
                  className="hover:text-gray-300 transition-colors"
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
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    if (videoRef.current) {
                      videoRef.current.volume = newVolume;
                      setVolume(newVolume);
                      setIsMuted(newVolume === 0);
                    }
                  }}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quality Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-800 bg-opacity-50 rounded text-sm hover:bg-opacity-75 transition-colors"
                >
                  <span>{currentQuality?.label || 'Auto'}</span>
                  <SignalIcon className="h-3 w-3" />
                </button>
                
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-2 min-w-32">
                    {availableQualities.map((quality) => (
                      <button
                        key={quality.id}
                        onClick={() => handleQualitySelect(quality)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                          quality.id === currentQuality?.id ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{quality.label}</span>
                          <span className="text-xs text-gray-400">{formatBitrate(quality.bitrate)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Network Speed Indicator */}
              {enableAdaptiveBitrate && networkSpeed > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <WifiIcon className={`h-3 w-3 ${getNetworkSpeedColor(networkSpeed)}`} />
                  <span className={getNetworkSpeedColor(networkSpeed)}>
                    {getNetworkSpeedLabel(networkSpeed)}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <button
                onClick={() => {
                  if (videoRef.current) {
                    if (!isFullscreen) {
                      if (videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    } else {
                      if (document.exitFullscreen) {
                        document.exitFullscreen();
                      }
                    }
                    setIsFullscreen(!isFullscreen);
                  }
                }}
                className="hover:text-gray-300 transition-colors"
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-5 w-5" />
                ) : (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Title */}
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-white text-lg font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
          {title}
        </h3>
      </div>

      {/* Buffer Health Indicator */}
      {enableAdaptiveBitrate && (
        <div className="absolute top-4 right-4">
          <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white">
            Buffer: {Math.round(bufferHealth)}%
          </div>
        </div>
      )}
    </div>
  );
}

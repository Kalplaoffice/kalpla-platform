'use client';

import React, { useEffect, useRef, useState } from 'react';
import { create } from 'amazon-ivs-player';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ChatBubbleLeftIcon,
  UsersIcon,
  SignalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface StudentLivePlayerProps {
  playbackUrl: string;
  sessionTitle: string;
  instructorName: string;
  onChatToggle?: () => void;
  onAttendeesToggle?: () => void;
  showChat?: boolean;
  showAttendees?: boolean;
  attendeeCount?: number;
}

export function StudentLivePlayer({
  playbackUrl,
  sessionTitle,
  instructorName,
  onChatToggle,
  onAttendeesToggle,
  showChat = false,
  showAttendees = false,
  attendeeCount = 0
}: StudentLivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !playbackUrl) return;

    const initializePlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if IVS player is supported
        if (!create.isPlayerSupported) {
          throw new Error('IVS Player is not supported in this browser');
        }

        // Create IVS player
        const player = create();
        playerRef.current = player;

        // Attach to video element
        player.attachHTMLVideoElement(videoRef.current!);

        // Set up event listeners
        player.addEventListener('loadstart', () => {
          console.log('🔄 Loading stream...');
        });

        player.addEventListener('canplay', () => {
          console.log('✅ Stream ready to play');
          setIsLoading(false);
        });

        player.addEventListener('play', () => {
          console.log('▶️ Stream playing');
          setIsPlaying(true);
        });

        player.addEventListener('pause', () => {
          console.log('⏸️ Stream paused');
          setIsPlaying(false);
        });

        player.addEventListener('error', (event: any) => {
          console.error('❌ Player error:', event);
          setError('Failed to load stream: ' + event.detail?.message || 'Unknown error');
          setIsLoading(false);
        });

        player.addEventListener('qualitychange', (event: any) => {
          console.log('📊 Quality changed:', event.detail);
          // Update connection quality based on current quality
          const quality = event.detail?.quality;
          if (quality === '1080p' || quality === '720p') {
            setConnectionQuality('excellent');
          } else if (quality === '480p') {
            setConnectionQuality('good');
          } else if (quality === '360p') {
            setConnectionQuality('fair');
          } else {
            setConnectionQuality('poor');
          }
        });

        // Load the stream
        player.load(playbackUrl);

        // Auto-play if possible
        try {
          await player.play();
        } catch (playError) {
          console.log('Auto-play prevented, user interaction required');
        }

      } catch (error) {
        console.error('❌ Error initializing player:', error);
        setError('Failed to initialize player: ' + (error as Error).message);
        setIsLoading(false);
      }
    };

    initializePlayer();

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [playbackUrl]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

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
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'fair': return '📶';
      case 'poor': return '📶';
      default: return '📶';
    }
  };

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Stream Error</h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden relative">
      {/* Video Player */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto"
          playsInline
          controls={false}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading stream...</p>
            </div>
          </div>
        )}

        {/* Stream Info Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white">
          <h3 className="font-semibold text-lg">{sessionTitle}</h3>
          <p className="text-sm text-gray-300">Instructor: {instructorName}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${getConnectionQualityColor()}`}>
              {getConnectionQualityIcon()} {connectionQuality}
            </span>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between bg-black bg-opacity-50 rounded-lg p-3">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-6 h-6 text-white" />
                ) : (
                  <SpeakerWaveIcon className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {onChatToggle && (
                <button
                  onClick={onChatToggle}
                  className={`p-2 rounded-full transition-colors ${
                    showChat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <ChatBubbleLeftIcon className="w-6 h-6" />
                </button>
              )}
              
              {onAttendeesToggle && (
                <button
                  onClick={onAttendeesToggle}
                  className={`p-2 rounded-full transition-colors ${
                    showAttendees 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <UsersIcon className="w-6 h-6" />
                  {attendeeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {attendeeCount}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <ArrowsPointingOutIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Status */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center space-x-4">
          <span className={`flex items-center ${getConnectionQualityColor()}`}>
            <SignalIcon className="w-4 h-4 mr-1" />
            {connectionQuality}
          </span>
          <span>Live Stream</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      </div>
    </div>
  );
}

export default StudentLivePlayer;

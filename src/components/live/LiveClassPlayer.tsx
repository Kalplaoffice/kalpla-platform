'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChatBubbleLeftIcon,
  UsersIcon,
  ClockIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  HeartIcon,
  HandThumbUpIcon,
  ShareIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { liveStreamingService, LiveSession, LiveChatMessage, LiveAttendance } from '@/lib/liveStreamingService';

interface LiveClassPlayerProps {
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isInstructor?: boolean;
  onSessionEnd?: () => void;
}

export function LiveClassPlayer({
  sessionId,
  userId,
  userName,
  userAvatar,
  isInstructor = false,
  onSessionEnd
}: LiveClassPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Chat state
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Attendance state
  const [attendance, setAttendance] = useState<LiveAttendance[]>([]);
  const [showAttendance, setShowAttendance] = useState(false);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');
  
  // Timers
  const chatPollingRef = useRef<NodeJS.Timeout | null>(null);
  const attendancePollingRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSessionData();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  useEffect(() => {
    if (session && session.status === 'live') {
      setupVideoPlayer();
      joinSession();
      startPolling();
    }
  }, [session]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionData = await liveStreamingService.getLiveSession(sessionId);
      setSession(sessionData);
      
      if (sessionData.status === 'live') {
        setIsConnected(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load live session');
    } finally {
      setLoading(false);
    }
  };

  const setupVideoPlayer = () => {
    if (!session || !videoRef.current) return;

    const video = videoRef.current;
    
    // Set up HLS.js for IVS playback
    const setupHLS = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
            maxBufferLength: 60
          });
          
          hls.loadSource(session.playbackUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed');
            setIsBuffering(false);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
              setError('Video playback error');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = session.playbackUrl;
        } else {
          throw new Error('HLS not supported in this browser');
        }
      } catch (error) {
        console.error('Error setting up HLS:', error);
        setError('Failed to initialize video player');
      }
    };

    setupHLS();

    // Set up video event listeners
    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      setError('Video playback error');
      setIsBuffering(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  };

  const joinSession = async () => {
    try {
      await liveStreamingService.joinLiveSession(sessionId, userId);
      setIsConnected(true);
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Failed to join live session');
    }
  };

  const leaveSession = async () => {
    try {
      await liveStreamingService.leaveLiveSession(sessionId, userId);
      setIsConnected(false);
      onSessionEnd?.();
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  };

  const startPolling = () => {
    // Poll chat messages
    chatPollingRef.current = setInterval(async () => {
      try {
        const messages = await liveStreamingService.getChatMessages(sessionId, 50);
        setChatMessages(messages);
        
        // Auto-scroll to bottom
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      } catch (error) {
        console.error('Error polling chat messages:', error);
      }
    }, 2000);

    // Poll attendance
    attendancePollingRef.current = setInterval(async () => {
      try {
        const attendanceData = await liveStreamingService.getLiveAttendance(sessionId);
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error polling attendance:', error);
      }
    }, 5000);

    // Check connection quality
    connectionCheckRef.current = setInterval(() => {
      checkConnectionQuality();
    }, 10000);
  };

  const checkConnectionQuality = () => {
    if (!videoRef.current) return;

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

  const cleanup = () => {
    if (chatPollingRef.current) clearInterval(chatPollingRef.current);
    if (attendancePollingRef.current) clearInterval(attendancePollingRef.current);
    if (connectionCheckRef.current) clearInterval(connectionCheckRef.current);
    
    if (isConnected) {
      leaveSession();
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await liveStreamingService.sendChatMessage(sessionId, userId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading live session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Live Session</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadSessionData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white">Session not found</p>
        </div>
      </div>
    );
  }

  if (session.status !== 'live') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <ClockIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {session.status === 'scheduled' ? 'Session Not Started' : 'Session Ended'}
          </h3>
          <p className="text-gray-400">
            {session.status === 'scheduled' 
              ? `Session starts at ${formatTime(session.scheduledStartTime)}`
              : 'This live session has ended'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-semibold">{session.title}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <UsersIcon className="h-4 w-4" />
              <span>{session.currentAttendees}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SignalIcon className={`h-4 w-4 ${getConnectionQualityColor()}`} />
              <span className="capitalize">{connectionQuality}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAttendance(!showAttendance)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <UsersIcon className="h-5 w-5" />
            <span>Attendees</span>
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>Chat</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative group" onMouseMove={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              autoPlay
              muted={isMuted}
            />

            {/* Loading Indicator */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Video Controls Overlay */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
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
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quality Selector */}
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
                          {['auto', 'low', 'medium', 'high'].map((quality) => (
                            <button
                              key={quality}
                              onClick={() => {
                                setCurrentQuality(quality);
                                setShowQualityMenu(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                                currentQuality === quality ? 'text-blue-400' : 'text-white'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 flex flex-col">
          {/* Chat Section */}
          {showChat && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Live Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {message.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {message.userName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.isInstructor && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              Instructor
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!newMessage.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Section */}
          {showAttendance && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Attendees ({attendance.length})</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {attendance.map((attendee) => (
                    <div key={attendee.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {attendee.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {attendee.userName}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            attendee.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        <p className="text-xs text-gray-400">
                          Joined {formatTime(attendee.joinTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

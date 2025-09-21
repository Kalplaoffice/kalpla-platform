'use client';

import { useState, useEffect, useRef } from 'react';
import { videoService } from '@/lib/videoService';
import {
  PlayIcon,
  StopIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ShareIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  cohortId: string;
  scheduledDate: string;
  duration: number;
  meetingUrl?: string;
  recordingUrl?: string;
  ivsChannelArn?: string;
  ivsPlaybackUrl?: string;
  ivsStreamKey?: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
}

interface LiveStreamingManagerProps {
  sessionId?: string;
  isMentor?: boolean;
  onSessionUpdate?: (session: LiveSession) => void;
}

export function LiveStreamingManager({ 
  sessionId, 
  isMentor = false, 
  onSessionUpdate 
}: LiveStreamingManagerProps) {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState<string>('');
  const [playbackUrl, setPlaybackUrl] = useState<string>('');
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      // This would load the session details from the API
      // For now, we'll create a mock session
      const mockSession: LiveSession = {
        id: sessionId || 'mock-session',
        title: 'Live Mentoring Session',
        description: 'Weekly mentoring session for KSMP cohort',
        mentorId: 'mentor-1',
        cohortId: 'cohort-1',
        scheduledDate: new Date().toISOString(),
        duration: 60,
        status: 'SCHEDULED',
        ivsChannelArn: 'arn:aws:ivs:us-east-1:123456789012:channel/mock-channel',
        ivsPlaybackUrl: 'https://mock-playback-url.com',
        ivsStreamKey: 'mock-stream-key'
      };
      
      setSession(mockSession);
      setStreamKey(mockSession.ivsStreamKey || '');
      setPlaybackUrl(mockSession.ivsPlaybackUrl || '');
      
    } catch (err: any) {
      setError(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const startStreaming = async () => {
    try {
      if (!isMentor) {
        setError('Only mentors can start streaming');
        return;
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsStreaming(true);
      
      // Update session status
      if (session) {
        const updatedSession = { ...session, status: 'LIVE' as const };
        setSession(updatedSession);
        onSessionUpdate?.(updatedSession);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to start streaming');
    }
  };

  const stopStreaming = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
      
      // Update session status
      if (session) {
        const updatedSession = { ...session, status: 'ENDED' as const };
        setSession(updatedSession);
        onSessionUpdate?.(updatedSession);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to stop streaming');
    }
  };

  const joinSession = async () => {
    try {
      if (!playbackUrl) {
        setError('No playback URL available');
        return;
      }

      // For viewers, we would typically use the IVS player
      // For now, we'll just show the playback URL
      window.open(playbackUrl, '_blank');
      
    } catch (err: any) {
      setError(err.message || 'Failed to join session');
    }
  };

  const shareSession = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: session?.title || 'Live Session',
          text: session?.description || 'Join this live mentoring session',
          url: playbackUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(playbackUrl);
        alert('Session URL copied to clipboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to share session');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <VideoCameraIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <VideoCameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Found</h3>
          <p className="text-gray-600">No live session available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{session.title}</h2>
            <p className="text-gray-600 mt-1">{session.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(session.scheduledDate)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              {formatDuration(session.duration)}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            session.status === 'LIVE' ? 'bg-green-100 text-green-800' :
            session.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
            session.status === 'ENDED' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {session.status}
          </span>
          
          {session.status === 'LIVE' && (
            <div className="flex items-center text-sm text-gray-600">
              <UsersIcon className="h-4 w-4 mr-1" />
              {participantCount} participants
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Video Stream */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {isMentor ? 'Your Stream' : 'Live Stream'}
        </h3>
        
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          {isMentor && isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">
                  {isMentor ? 'Stream not started' : 'Waiting for stream to start'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {isMentor ? (
            <>
              {!isStreaming ? (
                <button
                  onClick={startStreaming}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Start Stream</span>
                </button>
              ) : (
                <button
                  onClick={stopStreaming}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <StopIcon className="h-5 w-5" />
                  <span>Stop Stream</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={joinSession}
              disabled={session.status !== 'LIVE'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Join Session</span>
            </button>
          )}
          
          <button
            onClick={shareSession}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Stream Info (for mentors) */}
      {isMentor && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stream Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stream Key
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={streamKey}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(streamKey)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Playback URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={playbackUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(playbackUrl)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Streaming Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Use OBS Studio or similar streaming software</li>
              <li>2. Set the stream URL to: <code className="bg-blue-100 px-1 rounded">rtmps://ingest.us-east-1.ivs.amazonaws.com/live/</code></li>
              <li>3. Use the stream key above as your stream key</li>
              <li>4. Start streaming and then click "Start Stream" above</li>
            </ol>
          </div>
        </div>
      )}

      {/* Chat/Interaction (placeholder) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Chat</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
          <p>Live chat functionality will be implemented here</p>
        </div>
      </div>
    </div>
  );
}

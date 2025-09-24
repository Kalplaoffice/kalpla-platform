'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from 'amazon-ivs-web-broadcast';
import {
  PlayIcon,
  StopIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  MicrophoneSlashIcon,
  VideoCameraSlashIcon,
  ShareIcon,
  UsersIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { liveStreamingService, LiveSession, LiveSessionSettings } from '@/lib/liveStreamingService';

interface InstructorLiveStreamingProps {
  courseId: string;
  instructorId: string;
  instructorName: string;
}

export function InstructorLiveStreaming({
  courseId,
  instructorId,
  instructorName
}: InstructorLiveStreamingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ivsClientRef = useRef<any>(null);
  
  // State management
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  
  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    maxAttendees: 100,
    settings: {
      allowChat: true,
      allowScreenShare: false,
      allowAttendeeVideo: false,
      allowAttendeeAudio: false,
      requireApproval: false,
      autoRecord: true,
      recordToS3: true,
      s3Bucket: 'kalpla-recordings',
      s3Key: '',
      quality: 'high' as const,
      maxBitrate: 5000,
      resolution: '1920x1080',
      framerate: 30
    } as LiveSessionSettings
  });

  useEffect(() => {
    loadSessions();
  }, [courseId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await liveStreamingService.getLiveSessions(courseId);
      setSessions(sessionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load live sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const sessionData = {
        title: formData.title,
        description: formData.description,
        instructorId,
        courseId,
        scheduledStartTime: formData.scheduledStartTime,
        scheduledEndTime: formData.scheduledEndTime,
        status: 'scheduled' as const,
        maxAttendees: formData.maxAttendees,
        settings: formData.settings
      };

      const newSession = await liveStreamingService.createLiveSession(sessionData);
      setSessions(prev => [...prev, newSession]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create live session');
    }
  };

  const startStreaming = async (sessionId: string) => {
    try {
      const session = await liveStreamingService.startLiveSession(sessionId);
      setCurrentSession(session);
      setIsStreaming(true);
      
      // Start camera and microphone
      await startCamera();
      await startMicrophone();
      
      // Start streaming to IVS
      await startIVSStream(session);
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Failed to start streaming');
    }
  };

  const stopIVSStream = async () => {
    try {
      if (ivsClientRef.current) {
        await ivsClientRef.current.stop();
        ivsClientRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      console.log('✅ IVS stream stopped successfully');
      setIsStreaming(false);
    } catch (error) {
      console.error('❌ Error stopping IVS stream:', error);
      setError('Failed to stop IVS stream: ' + (error as Error).message);
    }
  };

  const stopStreaming = async () => {
    try {
      // Stop IVS stream first
      await stopIVSStream();
      
      if (currentSession) {
        await liveStreamingService.endLiveSession(currentSession.id);
        setCurrentSession(null);
        setIsRecording(false);
      }
      
      console.log('✅ Streaming stopped successfully');
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Failed to stop streaming');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access camera');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        if (track.kind === 'video') {
          track.stop();
        }
      });
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      
      if (streamRef.current) {
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach(track => {
          streamRef.current!.addTrack(track);
        });
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Failed to access microphone');
    }
  };

  const stopMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        if (track.kind === 'audio') {
          track.stop();
        }
      });
    }
  };

  const startIVSStream = async (session: LiveSession) => {
    try {
      if (!session.streamKey || !session.playbackUrl) {
        throw new Error('Missing stream key or playback URL');
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;

      // Set up video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize IVS broadcast client
      const ivsClient = await createClient({
        ingestEndpoint: session.playbackUrl.replace('https://', '').split('/')[0] + '/api/v1'
      });

      ivsClientRef.current = ivsClient;

      // Add video and audio inputs
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) {
        await ivsClient.addVideoInputDevice(videoTrack);
      }
      
      if (audioTrack) {
        await ivsClient.addAudioInputDevice(audioTrack);
      }

      // Start streaming
      await ivsClient.start(session.streamKey);
      
      console.log('✅ IVS stream started successfully');
      setIsStreaming(true);
    } catch (error) {
      console.error('❌ Error starting IVS stream:', error);
      setError('Failed to start IVS stream: ' + (error as Error).message);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };

  const toggleMicrophone = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicrophoneEnabled(!microphoneEnabled);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScreenShareEnabled(true);
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
      setError('Failed to start screen share');
    }
  };

  const stopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      setScreenShareEnabled(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      maxAttendees: 100,
      settings: {
        allowChat: true,
        allowScreenShare: false,
        allowAttendeeVideo: false,
        allowAttendeeAudio: false,
        requireApproval: false,
        autoRecord: true,
        recordToS3: true,
        s3Bucket: 'kalpla-recordings',
        s3Key: '',
        quality: 'high',
        maxBitrate: 5000,
        resolution: '1920x1080',
        framerate: 30
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-500';
      case 'scheduled': return 'text-yellow-500';
      case 'ended': return 'text-gray-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <PlayIcon className="h-4 w-4" />;
      case 'scheduled': return <ClockIcon className="h-4 w-4" />;
      case 'ended': return <StopIcon className="h-4 w-4" />;
      case 'cancelled': return <XMarkIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Live Streaming</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Session</span>
        </button>
      </div>

      {/* Current Session Controls */}
      {currentSession && isStreaming && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-800">Live: {currentSession.title}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-green-700">
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{currentSession.currentAttendees} viewers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{liveStreamingService.formatDuration(currentSession.metadata.duration)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-lg transition-colors ${
                  cameraEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {cameraEnabled ? <VideoCameraIcon className="h-5 w-5" /> : <VideoCameraSlashIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleMicrophone}
                className={`p-2 rounded-lg transition-colors ${
                  microphoneEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {microphoneEnabled ? <MicrophoneIcon className="h-5 w-5" /> : <MicrophoneSlashIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={screenShareEnabled ? stopScreenShare : startScreenShare}
                className={`p-2 rounded-lg transition-colors ${
                  screenShareEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={stopStreaming}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <StopIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {showPreview && (
        <div className="mb-6">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              autoPlay
              muted
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className={`${getStatusColor(session.status)}`}>
                {getStatusIcon(session.status)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-500">{session.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                  <span>{new Date(session.scheduledStartTime).toLocaleString()}</span>
                  <span>{session.currentAttendees}/{session.maxAttendees} attendees</span>
                  <span className="capitalize">{session.status}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {session.status === 'scheduled' && (
                <button
                  onClick={() => startStreaming(session.id)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              )}
              {session.status === 'live' && (
                <button
                  onClick={() => setCurrentSession(session)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  setFormData({
                    title: session.title,
                    description: session.description,
                    scheduledStartTime: session.scheduledStartTime,
                    scheduledEndTime: session.scheduledEndTime,
                    maxAttendees: session.maxAttendees,
                    settings: session.settings
                  });
                  setShowCreateModal(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Live Session</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Session title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="Session description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledStartTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledStartTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledEndTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledEndTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 100 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Settings</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowChat}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, allowChat: e.target.checked }
                      }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow chat</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowScreenShare}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, allowScreenShare: e.target.checked }
                      }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow screen share</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoRecord}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, autoRecord: e.target.checked }
                      }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto record</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

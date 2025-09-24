'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { enhancedCoursePlayerService, VideoStreamingData, Note, Question, Discussion, LessonProgress } from '@/lib/enhancedCoursePlayerService';
import { videoAnalyticsService } from '@/lib/videoAnalyticsService';
import { InteractiveVideoPlayer } from '@/components/video/InteractiveVideoPlayer';

interface CoursePlayerProps {
  courseId: string;
  lessonId: string;
  userId: string;
  userRole: string;
  onLessonComplete?: (lessonId: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

export function CoursePlayer({ 
  courseId, 
  lessonId, 
  userId, 
  userRole, 
  onLessonComplete,
  onProgressUpdate 
}: CoursePlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState<'notes' | 'qa' | 'discussions'>('notes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoStreamingData | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  
  // Video player state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // UI state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  
  // Progress tracking
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressUpdateRef = useRef<number>(0);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      // Flush analytics events before component unmounts
      videoAnalyticsService.flushEventQueue();
    };
  }, [lessonId, userId, userRole]);

  // Auto-refresh signed URLs
  useEffect(() => {
    if (!videoData) return;

    const checkUrlExpiry = () => {
      const expiresAt = new Date(videoData.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Refresh URLs if they expire within 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000) {
        refreshSignedUrls();
      }
    };

    const interval = setInterval(checkUrlExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [videoData]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load video streaming data
      const streamingData = await enhancedCoursePlayerService.getVideoStreamingData(
        lessonId, 
        userId, 
        userRole
      );
      setVideoData(streamingData);

      // Load lesson details
      const lessonDetails = await enhancedCoursePlayerService.getLessonDetails(lessonId);
      setLesson(lessonDetails);

      // Load user progress
      const userProgress = await enhancedCoursePlayerService.getVideoProgress(lessonId, userId);
      setProgress(userProgress);

      // Load notes, questions, and discussions
      const [notesData, questionsData, discussionsData] = await Promise.all([
        enhancedCoursePlayerService.getNotes(lessonId, userId),
        enhancedCoursePlayerService.getQuestions(lessonId),
        enhancedCoursePlayerService.getDiscussions(lessonId)
      ]);

      setNotes(notesData);
      setQuestions(questionsData);
      setDiscussions(discussionsData);

      // Set recommended quality
      const connectionSpeed = await enhancedCoursePlayerService.detectConnectionSpeed();
      const recommendedQuality = enhancedCoursePlayerService.getRecommendedQuality(userRole, connectionSpeed);
      setCurrentQuality(recommendedQuality);

      // Initialize analytics session
      await videoAnalyticsService.initializeSession(userId, courseId, lessonId);

    } catch (err: any) {
      setError(err.message || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const refreshSignedUrls = async () => {
    if (!videoData) return;

    try {
      const newVideoData = await enhancedCoursePlayerService.refreshSignedUrls(
        lessonId,
        userId,
        userRole,
        videoData
      );
      setVideoData(newVideoData);
    } catch (error) {
      console.error('Failed to refresh signed URLs:', error);
    }
  };

  // Initialize HLS player
  useEffect(() => {
    if (!videoData || !videoRef.current) return;

    const initializeHLS = async () => {
      try {
        const video = videoRef.current;
        if (!video) return;

        // Clean up existing HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        // Get current quality manifest
        const qualityData = videoData.signedUrls[currentQuality];
        if (!qualityData) {
          throw new Error(`Quality ${currentQuality} not available`);
        }

        // Check if browser supports HLS natively
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = qualityData.manifest;
        } else {
          // Use HLS.js for other browsers
          const Hls = (await import('hls.js')).default;
          
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 30,
              maxMaxBufferLength: 60
            });
            
            hls.loadSource(qualityData.manifest);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log('HLS manifest parsed successfully');
            });
            
            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error('HLS error:', data);
              if (data.fatal) {
                setError('Video playback error');
              }
            });

            hlsRef.current = hls;
          } else {
            throw new Error('HLS not supported in this browser');
          }
        }

        // Set up video event listeners
        setupVideoEventListeners(video);

      } catch (error) {
        console.error('Error initializing HLS:', error);
        setError('Failed to initialize video player');
      }
    };

    initializeHLS();
  }, [videoData, currentQuality]);

  const setupVideoEventListeners = (video: HTMLVideoElement) => {
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (progress?.lastPosition) {
        video.currentTime = progress.lastPosition;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Update progress every 10 seconds
      const now = Date.now();
      if (now - lastProgressUpdateRef.current > 10000) {
        updateProgress(video.currentTime, video.duration);
        lastProgressUpdateRef.current = now;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      enhancedCoursePlayerService.trackVideoEvent(lessonId, userId, 'PLAY', {
        currentTime: video.currentTime,
        quality: currentQuality
      });
      
      // Track analytics
      videoAnalyticsService.trackPlay(userId, courseId, lessonId, video.currentTime, video.duration, currentQuality);
    };

    const handlePause = () => {
      setIsPlaying(false);
      updateProgress(video.currentTime, video.duration);
      enhancedCoursePlayerService.trackVideoEvent(lessonId, userId, 'PAUSE', {
        currentTime: video.currentTime,
        quality: currentQuality
      });
      
      // Track analytics
      videoAnalyticsService.trackPause(userId, courseId, lessonId, video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      updateProgress(video.duration, video.duration, true);
      enhancedCoursePlayerService.trackVideoEvent(lessonId, userId, 'COMPLETE', {
        duration: video.duration,
        quality: currentQuality
      });
      
      // Track analytics
      videoAnalyticsService.trackComplete(userId, courseId, lessonId, video.duration, currentQuality);
      onLessonComplete?.(lessonId);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
      videoAnalyticsService.trackBufferStart(userId, courseId, lessonId, video.currentTime);
    };
    
    const handleCanPlay = () => {
      setIsBuffering(false);
      videoAnalyticsService.trackBufferEnd(userId, courseId, lessonId, video.currentTime);
    };

    const handleError = () => {
      setError('Video playback error');
      setIsBuffering(false);
      videoAnalyticsService.trackError(userId, courseId, lessonId, 'Video playback error', video.currentTime);
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  };

  const updateProgress = async (currentTime: number, duration: number, completed: boolean = false) => {
    try {
      const progressData = {
        lessonId,
        userId,
        lastPosition: currentTime,
        duration,
        percentWatched: enhancedCoursePlayerService.calculateProgress(currentTime, duration),
        completed,
        timeSpent: currentTime,
        device: navigator.userAgent,
        sessionId: Date.now().toString()
      };

      await enhancedCoursePlayerService.updateVideoProgress(progressData);
      setProgress(progressData as LessonProgress);
      onProgressUpdate?.(progressData.percentWatched);
      
      // Update analytics watch time
      videoAnalyticsService.updateWatchTime(currentTime);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Video controls
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const oldTime = video.currentTime;
    video.currentTime = time;
    setCurrentTime(time);
    
    // Track analytics
    videoAnalyticsService.trackSeek(userId, courseId, lessonId, oldTime, time);
  }, [userId, courseId, lessonId]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Track analytics
    videoAnalyticsService.trackVolumeChange(userId, courseId, lessonId, newVolume, video.currentTime);
  }, [userId, courseId, lessonId]);

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
    const oldQuality = currentQuality;
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    
    // Track analytics
    videoAnalyticsService.trackQualityChange(userId, courseId, lessonId, oldQuality, quality, currentTime);
  }, [userId, courseId, lessonId, currentQuality, currentTime]);

  // Notes management
  const saveNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      const note = await enhancedCoursePlayerService.createNote({
        lessonId,
        userId,
        content: newNoteContent,
        timestamp: currentTime
      });

      setNotes(prev => [...prev, note]);
      setNewNoteContent('');
      setShowNotesModal(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Questions management
  const askQuestion = async () => {
    if (!newQuestionContent.trim()) return;

    try {
      const question = await enhancedCoursePlayerService.createQuestion({
        lessonId,
        userId,
        question: newQuestionContent,
        timestamp: currentTime
      });

      setQuestions(prev => [...prev, question]);
      setNewQuestionContent('');
      setShowQAModal(false);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  // Discussions management
  const startDiscussion = async () => {
    if (!newDiscussionContent.trim()) return;

    try {
      const discussion = await enhancedCoursePlayerService.createDiscussion({
        lessonId,
        userId,
        content: newDiscussionContent,
        timestamp: currentTime
      });

      setDiscussions(prev => [...prev, discussion]);
      setNewDiscussionContent('');
      setShowDiscussionModal(false);
    } catch (error) {
      console.error('Error starting discussion:', error);
    }
  };

  const formatTime = (time: number) => {
    return enhancedCoursePlayerService.formatTime(time);
  };

  const getProgressPercentage = () => {
    return enhancedCoursePlayerService.calculateProgress(currentTime, duration);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading course player...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Video</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadInitialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white">No video data available</p>
        </div>
      </div>
    );
  }

  const qualityOptions = enhancedCoursePlayerService.getVideoQualityOptions(videoData.signedUrls);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <Image src={kalplaLogo} alt="Kalpla" className="h-8 w-auto" />
          <div>
            <h1 className="text-white font-semibold">{lesson?.title || 'Course Player'}</h1>
            <p className="text-gray-400 text-sm">{lesson?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="text-sm text-gray-400">
            {Math.round(getProgressPercentage())}% Complete
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black relative group" onMouseMove={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={videoData.thumbnailUrl}
            />

            {/* Interactive Video Player Overlay */}
            <InteractiveVideoPlayer
              lessonId={lessonId}
              userId={userId}
              courseId={courseId}
              videoRef={videoRef}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onTimeUpdate={handleSeek}
              onPlay={togglePlay}
              onPause={togglePlay}
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
                    {qualityOptions.length > 1 && (
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
                            {qualityOptions.map((quality) => (
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

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowNotesModal(true)}
                        className="text-white hover:text-blue-400 transition-colors"
                        title="Add Note"
                      >
                        <BookmarkIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowQAModal(true)}
                        className="text-white hover:text-blue-400 transition-colors"
                        title="Ask Question"
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDiscussionModal(true)}
                        className="text-white hover:text-blue-400 transition-colors"
                        title="Start Discussion"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
              { id: 'qa', label: 'Q&A', icon: QuestionMarkCircleIcon },
              { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Notes</h3>
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Note
                  </button>
                </div>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(note.timestamp)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Questions</h3>
                  <button
                    onClick={() => setShowQAModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Ask Question
                  </button>
                </div>
                <div className="space-y-3">
                  {questions.map((question) => (
                    <div key={question.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          {question.timestamp ? formatTime(question.timestamp) : 'General'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {question.answers.length} answers
                        </span>
                      </div>
                      <p className="text-white text-sm mb-2">{question.question}</p>
                      {question.answers.length > 0 && (
                        <div className="text-xs text-gray-400">
                          Latest: {question.answers[question.answers.length - 1].answer.substring(0, 50)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Discussions</h3>
                  <button
                    onClick={() => setShowDiscussionModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Start Discussion
                  </button>
                </div>
                <div className="space-y-3">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          {discussion.timestamp ? formatTime(discussion.timestamp) : 'General'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {discussion.likes} likes
                        </span>
                      </div>
                      <p className="text-white text-sm mb-2">{discussion.content}</p>
                      <div className="text-xs text-gray-400">
                        {discussion.replies.length} replies
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-medium mb-4">Add Note at {formatTime(currentTime)}</h3>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-24 bg-gray-700 text-white rounded-lg p-3 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {showQAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-medium mb-4">Ask Question at {formatTime(currentTime)}</h3>
            <textarea
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full h-24 bg-gray-700 text-white rounded-lg p-3 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowQAModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={askQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiscussionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-medium mb-4">Start Discussion at {formatTime(currentTime)}</h3>
            <textarea
              value={newDiscussionContent}
              onChange={(e) => setNewDiscussionContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full h-24 bg-gray-700 text-white rounded-lg p-3 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowDiscussionModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={startDiscussion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

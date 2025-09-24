'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  DocumentTextIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { studentProgressService, LessonProgress, QuizScore, Bookmark } from '@/lib/studentProgressService';

interface LessonProgressTrackerProps {
  studentId: string;
  courseId: string;
  lessonId: string;
  lessonName: string;
  lessonOrder: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onProgressUpdate?: (progress: number) => void;
  onLessonComplete?: (lessonId: string) => void;
}

export function LessonProgressTracker({
  studentId,
  courseId,
  lessonId,
  lessonName,
  lessonOrder,
  videoRef,
  currentTime,
  duration,
  isPlaying,
  onProgressUpdate,
  onLessonComplete
}: LessonProgressTrackerProps) {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Progress tracking
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    loadLessonProgress();
  }, [studentId, lessonId]);

  useEffect(() => {
    if (lessonProgress && isPlaying) {
      startProgressTracking();
    } else {
      stopProgressTracking();
    }
  }, [isPlaying, lessonProgress]);

  useEffect(() => {
    if (isTracking && currentTime > lastUpdateTime) {
      updateWatchTime();
    }
  }, [currentTime, isTracking]);

  const loadLessonProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const progress = await studentProgressService.getLessonProgress(studentId, lessonId);
      setLessonProgress(progress);
      
      if (progress) {
        setTotalWatchTime(progress.timeSpent);
        onProgressUpdate?.(progress.percentWatched);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load lesson progress');
    } finally {
      setLoading(false);
    }
  };

  const startProgressTracking = () => {
    setIsTracking(true);
    setLastUpdateTime(currentTime);
  };

  const stopProgressTracking = () => {
    if (isTracking) {
      updateWatchTime();
      setIsTracking(false);
    }
  };

  const updateWatchTime = useCallback(() => {
    if (!isTracking || !lessonProgress) return;

    const timeDiff = currentTime - lastUpdateTime;
    if (timeDiff > 0 && timeDiff < 5) { // Avoid large jumps from seeking
      const newWatchTime = totalWatchTime + timeDiff;
      setTotalWatchTime(newWatchTime);
      
      // Update progress every 30 seconds
      if (newWatchTime - lessonProgress.timeSpent >= 30) {
        updateLessonProgress(newWatchTime);
      }
    }
    setLastUpdateTime(currentTime);
  }, [isTracking, currentTime, lastUpdateTime, totalWatchTime, lessonProgress]);

  const updateLessonProgress = async (watchTime: number) => {
    if (!lessonProgress) return;

    try {
      const percentWatched = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
      
      const updatedProgress = await studentProgressService.updateLessonProgress({
        ...lessonProgress,
        timeSpent: watchTime,
        lastPosition: currentTime,
        totalDuration: duration,
        percentWatched,
        status: percentWatched >= 90 ? 'completed' : 'in_progress'
      });

      setLessonProgress(updatedProgress);
      onProgressUpdate?.(percentWatched);

      // Show completion modal if lesson is completed
      if (percentWatched >= 90 && lessonProgress.status !== 'completed') {
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const completeLesson = async () => {
    try {
      setIsUpdating(true);
      
      const completedProgress = await studentProgressService.completeLesson(
        studentId,
        courseId,
        lessonId,
        lessonName,
        lessonOrder,
        totalWatchTime
      );

      setLessonProgress(completedProgress);
      setShowCompletionModal(false);
      onLessonComplete?.(lessonId);
    } catch (error) {
      console.error('Error completing lesson:', error);
      setError('Failed to complete lesson');
    } finally {
      setIsUpdating(false);
    }
  };

  const addBookmark = async () => {
    if (!bookmarkTitle.trim() || !lessonProgress) return;

    try {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        timestamp: currentTime,
        title: bookmarkTitle,
        note: bookmarkNote,
        createdAt: new Date().toISOString()
      };

      const updatedProgress = await studentProgressService.updateLessonProgress({
        ...lessonProgress,
        bookmarks: [...lessonProgress.bookmarks, newBookmark]
      });

      setLessonProgress(updatedProgress);
      setShowBookmarkModal(false);
      setBookmarkTitle('');
      setBookmarkNote('');
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const getProgressStatus = () => {
    if (!lessonProgress) return 'not_started';
    return lessonProgress.status;
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'not_started': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <PlayIcon className="h-5 w-5 text-blue-500" />;
      case 'not_started': return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const status = getProgressStatus();
  const percentWatched = lessonProgress?.percentWatched || 0;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getProgressIcon(status)}
            <div>
              <h3 className="font-medium text-gray-900">{lessonName}</h3>
              <p className="text-sm text-gray-500">Lesson {lessonOrder}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getProgressColor(status)}`}>
              {percentWatched}%
            </span>
            <span className="text-sm text-gray-500">
              {studentProgressService.formatTimeSpent(totalWatchTime)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                percentWatched >= 90 ? 'bg-green-500' :
                percentWatched >= 50 ? 'bg-blue-500' :
                percentWatched >= 25 ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}
              style={{ width: `${percentWatched}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBookmarkModal(true)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>Bookmark</span>
            </button>
            
            {lessonProgress?.bookmarks && lessonProgress.bookmarks.length > 0 && (
              <span className="text-sm text-gray-500">
                {lessonProgress.bookmarks.length} bookmarks
              </span>
            )}
          </div>

          {status === 'completed' && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks */}
      {lessonProgress?.bookmarks && lessonProgress.bookmarks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-medium text-gray-900 mb-3">Bookmarks</h4>
          <div className="space-y-2">
            {lessonProgress.bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = bookmark.timestamp;
                  }
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{bookmark.title}</p>
                  {bookmark.note && (
                    <p className="text-sm text-gray-500">{bookmark.note}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatTime(bookmark.timestamp)}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Lesson Completed!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Great job! You've completed "{lessonName}". You spent {studentProgressService.formatTimeSpent(totalWatchTime)} on this lesson.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Continue Watching
                </button>
                <button
                  onClick={completeLesson}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Completing...' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Add Bookmark
              </h3>
              <p className="text-sm text-gray-500">
                Bookmark at {formatTime(currentTime)}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bookmark title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  placeholder="Add a note about this bookmark"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBookmarkModal(false);
                  setBookmarkTitle('');
                  setBookmarkNote('');
                }}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addBookmark}
                disabled={!bookmarkTitle.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

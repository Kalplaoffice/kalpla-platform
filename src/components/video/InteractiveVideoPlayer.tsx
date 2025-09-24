'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
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
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { interactiveVideoService, InteractiveElement, QuizResponse, VideoAnnotation, ElementPosition } from '@/lib/interactiveVideoService';

interface InteractiveVideoPlayerProps {
  lessonId: string;
  userId: string;
  courseId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

export function InteractiveVideoPlayer({
  lessonId,
  userId,
  courseId,
  videoRef,
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onPlay,
  onPause
}: InteractiveVideoPlayerProps) {
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [activeElements, setActiveElements] = useState<InteractiveElement[]>([]);
  const [upcomingElements, setUpcomingElements] = useState<InteractiveElement[]>([]);
  const [annotations, setAnnotations] = useState<VideoAnnotation[]>([]);
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  
  // UI State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<InteractiveElement | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<VideoAnnotation | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | string[] | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationCategory, setAnnotationCategory] = useState<'info' | 'warning' | 'tip' | 'important' | 'example'>('info');
  const [showElementPreview, setShowElementPreview] = useState(false);
  const [previewElement, setPreviewElement] = useState<InteractiveElement | null>(null);
  
  // Quiz State
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  
  // Loading and Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load interactive elements
  useEffect(() => {
    loadInteractiveElements();
  }, [lessonId]);

  // Update active elements based on current time
  useEffect(() => {
    updateActiveElements();
    updateUpcomingElements();
  }, [currentTime, interactiveElements]);

  // Quiz timer
  useEffect(() => {
    if (currentQuiz && currentQuiz.content.quiz?.timeLimit && !quizSubmitted) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - quizStartTime;
        const remaining = Math.max(0, (currentQuiz.content.quiz!.timeLimit! * 1000) - elapsed);
        setQuizTimeRemaining(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          handleQuizTimeout();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuiz, quizStartTime, quizSubmitted]);

  const loadInteractiveElements = async () => {
    try {
      setLoading(true);
      setError(null);

      const [timeline, annotationsData, responsesData] = await Promise.all([
        interactiveVideoService.getInteractiveTimeline(lessonId),
        interactiveVideoService.getVideoAnnotations(lessonId, userId),
        interactiveVideoService.getQuizResponses(lessonId, userId)
      ]);

      setInteractiveElements(timeline.elements);
      setAnnotations(annotationsData);
      setQuizResponses(responsesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load interactive elements');
    } finally {
      setLoading(false);
    }
  };

  const updateActiveElements = () => {
    const active = interactiveVideoService.getElementsAtTimestamp(interactiveElements, currentTime);
    setActiveElements(active);
    
    // Auto-show elements if configured
    active.forEach(element => {
      if (element.settings.autoShow && element.type === 'quiz' && !quizResponses.find(r => r.elementId === element.id)) {
        showQuiz(element);
      }
    });
  };

  const updateUpcomingElements = () => {
    const upcoming = interactiveVideoService.getUpcomingElements(interactiveElements, currentTime, 10);
    setUpcomingElements(upcoming);
  };

  const showQuiz = (element: InteractiveElement) => {
    setCurrentQuiz(element);
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizStartTime(Date.now());
    setQuizTimeRemaining(element.content.quiz?.timeLimit || 0);
    setShowQuizModal(true);
    
    if (element.settings.pauseVideo) {
      onPause();
    }
  };

  const showAnnotation = (annotation: VideoAnnotation) => {
    setCurrentAnnotation(annotation);
    setShowAnnotationModal(true);
  };

  const handleQuizSubmit = async () => {
    if (!currentQuiz || !quizAnswer) return;

    try {
      const quizContent = currentQuiz.content.quiz!;
      const responseData = [{
        questionId: currentQuiz.id,
        answer: quizAnswer,
        isCorrect: false, // Will be calculated
        timeSpent: Math.floor((Date.now() - quizStartTime) / 1000)
      }];

      const { score, totalPoints, isCorrect } = interactiveVideoService.calculateQuizScore(responseData, quizContent);
      
      responseData[0].isCorrect = isCorrect;

      const response = await interactiveVideoService.submitQuizResponse({
        elementId: currentQuiz.id,
        userId,
        lessonId,
        responses: responseData,
        score,
        totalPoints,
        timeSpent: responseData[0].timeSpent,
        attempts: 1,
        isCorrect
      });

      setQuizResponses(prev => [...prev, response]);
      setQuizScore(score);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleQuizTimeout = () => {
    if (currentQuiz) {
      handleQuizSubmit();
    }
  };

  const handleCreateAnnotation = async () => {
    if (!annotationText.trim()) return;

    try {
      const position: ElementPosition = {
        x: 50,
        y: 50
      };

      const annotation = await interactiveVideoService.createVideoAnnotation({
        lessonId,
        userId,
        elementId: '', // Will be set by the service
        content: annotationText,
        timestamp: currentTime,
        position,
        style: interactiveVideoService.getDefaultAnnotationStyle(),
        category: annotationCategory,
        isPublic: false
      });

      setAnnotations(prev => [...prev, annotation]);
      setAnnotationText('');
      setShowAnnotationModal(false);
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };

  const handleElementClick = (element: InteractiveElement) => {
    switch (element.type) {
      case 'quiz':
        showQuiz(element);
        break;
      case 'annotation':
        // Find corresponding annotation
        const annotation = annotations.find(a => a.elementId === element.id);
        if (annotation) {
          showAnnotation(annotation);
        }
        break;
      case 'note':
        // Show note content
        break;
      case 'link':
        // Open link
        if (element.content.link) {
          if (element.content.link.openInNewTab) {
            window.open(element.content.link.url, '_blank');
          } else {
            window.location.href = element.content.link.url;
          }
        }
        break;
    }
  };

  const handleElementPreview = (element: InteractiveElement) => {
    setPreviewElement(element);
    setShowElementPreview(true);
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <QuestionMarkCircleIcon className="h-4 w-4" />;
      case 'annotation': return <DocumentTextIcon className="h-4 w-4" />;
      case 'note': return <BookmarkIcon className="h-4 w-4" />;
      case 'bookmark': return <BookmarkIcon className="h-4 w-4" />;
      case 'highlight': return <LightBulbIcon className="h-4 w-4" />;
      case 'poll': return <ChatBubbleLeftIcon className="h-4 w-4" />;
      case 'discussion': return <ChatBubbleLeftIcon className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'overlay': return <EyeIcon className="h-4 w-4" />;
      default: return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const getElementColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-500';
      case 'annotation': return 'bg-yellow-500';
      case 'note': return 'bg-green-500';
      case 'bookmark': return 'bg-purple-500';
      case 'highlight': return 'bg-orange-500';
      case 'poll': return 'bg-pink-500';
      case 'discussion': return 'bg-indigo-500';
      case 'link': return 'bg-cyan-500';
      case 'overlay': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'info': return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'tip': return <LightBulbIcon className="h-4 w-4 text-green-500" />;
      case 'important': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'example': return <DocumentTextIcon className="h-4 w-4 text-purple-500" />;
      default: return <InformationCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={loadInteractiveElements}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Active Elements Overlay */}
      {activeElements.map((element) => (
        <div
          key={element.id}
          className="absolute z-10 cursor-pointer"
          style={{
            left: `${element.position.x}%`,
            top: `${element.position.y}%`,
            width: element.position.width ? `${element.position.width}%` : 'auto',
            height: element.position.height ? `${element.position.height}%` : 'auto'
          }}
          onClick={() => handleElementClick(element)}
          onMouseEnter={() => handleElementPreview(element)}
          onMouseLeave={() => setShowElementPreview(false)}
        >
          <div className={`${getElementColor(element.type)} text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow`}>
            {getElementIcon(element.type)}
          </div>
          
          {/* Element Preview */}
          {showElementPreview && previewElement?.id === element.id && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-20">
              <div className="flex items-center space-x-2 mb-2">
                {getElementIcon(element.type)}
                <span className="font-medium text-gray-900">{element.content.title || element.type}</span>
              </div>
              {element.content.text && (
                <p className="text-sm text-gray-600 mb-2">{element.content.text}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{interactiveVideoService.formatTimestamp(element.timestamp)}</span>
                <span className="capitalize">{element.type}</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Upcoming Elements Indicator */}
      {upcomingElements.length > 0 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white rounded-lg p-3 z-10">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Upcoming</span>
          </div>
          <div className="space-y-1">
            {upcomingElements.slice(0, 3).map((element) => (
              <div
                key={element.id}
                className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-white hover:bg-opacity-20 rounded p-1"
                onClick={() => onTimeUpdate(element.timestamp)}
              >
                {getElementIcon(element.type)}
                <span>{element.content.title || element.type}</span>
                <span className="text-gray-400">
                  {interactiveVideoService.formatTimestamp(element.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quiz</h3>
              <div className="flex items-center space-x-4">
                {currentQuiz.content.quiz?.timeLimit && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{quizTimeRemaining}s</span>
                  </div>
                )}
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-900 mb-4">{currentQuiz.content.quiz?.question}</p>
              
              {currentQuiz.content.quiz?.questionType === 'multiple_choice' && (
                <div className="space-y-2">
                  {currentQuiz.content.quiz.options?.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={option.id}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuiz.content.quiz?.questionType === 'true_false' && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="quiz-answer"
                      value="true"
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">True</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="quiz-answer"
                      value="false"
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">False</span>
                  </label>
                </div>
              )}

              {currentQuiz.content.quiz?.questionType === 'fill_blank' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={Array.isArray(quizAnswer) ? quizAnswer[0] || '' : quizAnswer || ''}
                    onChange={(e) => setQuizAnswer([e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your answer..."
                  />
                </div>
              )}
            </div>

            {quizSubmitted && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900">Quiz Submitted!</span>
                </div>
                <p className="text-sm text-gray-600">
                  Score: {quizScore}/{currentQuiz.content.quiz?.points} points
                </p>
                {currentQuiz.content.quiz?.explanation && (
                  <p className="text-sm text-gray-700 mt-2">{currentQuiz.content.quiz.explanation}</p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {!quizSubmitted ? (
                <>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!quizAnswer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Annotation Modal */}
      {showAnnotationModal && currentAnnotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(currentAnnotation.category)}
                <h3 className="text-lg font-semibold text-gray-900">Annotation</h3>
              </div>
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-900">{currentAnnotation.content}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{interactiveVideoService.formatTimestamp(currentAnnotation.timestamp)}</span>
              <span>{currentAnnotation.likes} likes</span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Annotation Modal */}
      {showAnnotationModal && !currentAnnotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Annotation</h3>
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={annotationCategory}
                onChange={(e) => setAnnotationCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="tip">Tip</option>
                <option value="important">Important</option>
                <option value="example">Example</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Enter your annotation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnotation}
                disabled={!annotationText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

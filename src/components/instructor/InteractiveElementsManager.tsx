'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  BookmarkIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { interactiveVideoService, InteractiveElement, ElementPosition, QuizContent, AnnotationContent } from '@/lib/interactiveVideoService';

interface InteractiveElementsManagerProps {
  lessonId: string;
  userId: string;
  courseId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
}

export function InteractiveElementsManager({
  lessonId,
  userId,
  courseId,
  videoRef,
  currentTime,
  duration,
  onTimeUpdate
}: InteractiveElementsManagerProps) {
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [elementType, setElementType] = useState<string>('quiz');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    timestamp: 0,
    duration: 0,
    position: { x: 50, y: 50, width: 20, height: 20 } as ElementPosition,
    settings: interactiveVideoService.getDefaultElementSettings(),
    quiz: {
      question: '',
      questionType: 'multiple_choice' as const,
      options: [{ id: '1', text: '', isCorrect: false }],
      correctAnswer: '',
      explanation: '',
      points: 1,
      timeLimit: 0,
      allowRetry: true,
      showCorrectAnswer: true,
      randomizeOptions: false
    } as QuizContent,
    annotation: {
      text: '',
      style: interactiveVideoService.getDefaultAnnotationStyle(),
      category: 'info' as const,
      author: userId,
      isPublic: false
    } as AnnotationContent
  });

  useEffect(() => {
    loadInteractiveElements();
  }, [lessonId]);

  const loadInteractiveElements = async () => {
    try {
      setLoading(true);
      setError(null);
      const timeline = await interactiveVideoService.getInteractiveTimeline(lessonId);
      setInteractiveElements(timeline.elements);
    } catch (err: any) {
      setError(err.message || 'Failed to load interactive elements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElement = async () => {
    try {
      const elementData: Omit<InteractiveElement, 'id' | 'createdAt' | 'updatedAt'> = {
        lessonId,
        type: elementType as any,
        timestamp: formData.timestamp,
        duration: formData.duration,
        position: formData.position,
        content: {
          title: formData.title,
          text: formData.text,
          ...(elementType === 'quiz' && { quiz: formData.quiz }),
          ...(elementType === 'annotation' && { annotation: formData.annotation })
        },
        settings: formData.settings,
        isActive: true,
        createdBy: userId
      };

      const newElement = await interactiveVideoService.createInteractiveElement(elementData);
      setInteractiveElements(prev => [...prev, newElement]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating element:', error);
    }
  };

  const handleUpdateElement = async () => {
    if (!selectedElement) return;

    try {
      const updatedElement = await interactiveVideoService.updateInteractiveElement(selectedElement.id, {
        timestamp: formData.timestamp,
        duration: formData.duration,
        position: formData.position,
        content: {
          title: formData.title,
          text: formData.text,
          ...(elementType === 'quiz' && { quiz: formData.quiz }),
          ...(elementType === 'annotation' && { annotation: formData.annotation })
        },
        settings: formData.settings
      });

      setInteractiveElements(prev => 
        prev.map(el => el.id === selectedElement.id ? updatedElement : el)
      );
      setShowEditModal(false);
      setSelectedElement(null);
      resetForm();
    } catch (error) {
      console.error('Error updating element:', error);
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    if (!confirm('Are you sure you want to delete this element?')) return;

    try {
      await interactiveVideoService.deleteInteractiveElement(elementId);
      setInteractiveElements(prev => prev.filter(el => el.id !== elementId));
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  const handleEditElement = (element: InteractiveElement) => {
    setSelectedElement(element);
    setElementType(element.type);
    setFormData({
      title: element.content.title || '',
      text: element.content.text || '',
      timestamp: element.timestamp,
      duration: element.duration || 0,
      position: element.position,
      settings: element.settings,
      quiz: element.content.quiz || formData.quiz,
      annotation: element.content.annotation || formData.annotation
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      text: '',
      timestamp: currentTime,
      duration: 0,
      position: { x: 50, y: 50, width: 20, height: 20 },
      settings: interactiveVideoService.getDefaultElementSettings(),
      quiz: {
        question: '',
        questionType: 'multiple_choice',
        options: [{ id: '1', text: '', isCorrect: false }],
        correctAnswer: '',
        explanation: '',
        points: 1,
        timeLimit: 0,
        allowRetry: true,
        showCorrectAnswer: true,
        randomizeOptions: false
      },
      annotation: {
        text: '',
        style: interactiveVideoService.getDefaultAnnotationStyle(),
        category: 'info',
        author: userId,
        isPublic: false
      }
    });
  };

  const addQuizOption = () => {
    const newOption = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false
    };
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        options: [...prev.quiz.options, newOption]
      }
    }));
  };

  const removeQuizOption = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        options: prev.quiz.options.filter(opt => opt.id !== optionId)
      }
    }));
  };

  const updateQuizOption = (optionId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        options: prev.quiz.options.map(opt => 
          opt.id === optionId ? { ...opt, [field]: value } : opt
        )
      }
    }));
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
      default: return <DocumentTextIcon className="h-4 w-4" />;
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
        <h2 className="text-xl font-semibold text-gray-900">Interactive Elements</h2>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Element</span>
        </button>
      </div>

      {/* Elements List */}
      <div className="space-y-3">
        {interactiveElements.map((element) => (
          <div
            key={element.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`${getElementColor(element.type)} text-white rounded-full p-2`}>
                {getElementIcon(element.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {element.content.title || element.type}
                </h3>
                <p className="text-sm text-gray-500">
                  {interactiveVideoService.formatTimestamp(element.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTimeUpdate(element.timestamp)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Go to timestamp"
              >
                <PlayIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEditElement(element)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Edit element"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteElement(element.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete element"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showCreateModal ? 'Create Interactive Element' : 'Edit Interactive Element'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedElement(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Element Type</label>
                  <select
                    value={elementType}
                    onChange={(e) => setElementType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="annotation">Annotation</option>
                    <option value="note">Note</option>
                    <option value="bookmark">Bookmark</option>
                    <option value="highlight">Highlight</option>
                    <option value="poll">Poll</option>
                    <option value="discussion">Discussion</option>
                    <option value="link">Link</option>
                    <option value="overlay">Overlay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Element title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timestamp (seconds)</label>
                  <input
                    type="number"
                    value={formData.timestamp}
                    onChange={(e) => setFormData(prev => ({ ...prev, timestamp: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max={duration}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    placeholder="Element content"
                  />
                </div>
              </div>

              {/* Right Column - Type-specific Settings */}
              <div className="space-y-4">
                {elementType === 'quiz' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Quiz Settings</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <textarea
                        value={formData.quiz.question}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          quiz: { ...prev.quiz, question: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select
                        value={formData.quiz.questionType}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          quiz: { ...prev.quiz, questionType: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="fill_blank">Fill in the Blank</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    {formData.quiz.questionType === 'multiple_choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        <div className="space-y-2">
                          {formData.quiz.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="correct-answer"
                                checked={option.isCorrect}
                                onChange={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    quiz: {
                                      ...prev.quiz,
                                      options: prev.quiz.options.map(opt => ({
                                        ...opt,
                                        isCorrect: opt.id === option.id
                                      }))
                                    }
                                  }));
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => updateQuizOption(option.id, 'text', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Option text"
                              />
                              <button
                                onClick={() => removeQuizOption(option.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addQuizOption}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add Option</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                        <input
                          type="number"
                          value={formData.quiz.points}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            quiz: { ...prev.quiz, points: parseInt(e.target.value) || 1 }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (seconds)</label>
                        <input
                          type="number"
                          value={formData.quiz.timeLimit}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            quiz: { ...prev.quiz, timeLimit: parseInt(e.target.value) || 0 }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                      <textarea
                        value={formData.quiz.explanation}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          quiz: { ...prev.quiz, explanation: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-16 resize-none"
                        placeholder="Explanation for the answer"
                      />
                    </div>
                  </div>
                )}

                {elementType === 'annotation' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Annotation Settings</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.annotation.category}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          annotation: { ...prev.annotation, category: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="info">Information</option>
                        <option value="warning">Warning</option>
                        <option value="tip">Tip</option>
                        <option value="important">Important</option>
                        <option value="example">Example</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annotation Text</label>
                      <textarea
                        value={formData.annotation.text}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          annotation: { ...prev.annotation, text: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                        placeholder="Annotation content"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.annotation.isPublic}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          annotation: { ...prev.annotation, isPublic: e.target.checked }
                        }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">Make annotation public</label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedElement(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreateElement : handleUpdateElement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showCreateModal ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

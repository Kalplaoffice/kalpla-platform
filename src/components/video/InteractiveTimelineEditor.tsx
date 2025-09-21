'use client';

import { useState, useEffect } from 'react';
import { videoService } from '@/lib/videoService';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  CursorArrowRaysIcon,
  BookmarkIcon,
  MegaphoneIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface InteractiveElement {
  startTime: number;
  endTime?: number;
  type: 'QUIZ' | 'HOTSPOT' | 'CHAPTER_MARKER' | 'CTA' | 'POLL' | 'NOTE';
  id: string;
  payload: any;
}

interface InteractiveTimelineEditorProps {
  lessonId: string;
  videoDuration: number;
  onTimelineUpdate?: (timeline: InteractiveElement[]) => void;
}

export function InteractiveTimelineEditor({ 
  lessonId, 
  videoDuration, 
  onTimelineUpdate 
}: InteractiveTimelineEditorProps) {
  const [timeline, setTimeline] = useState<InteractiveElement[]>([]);
  const [editingElement, setEditingElement] = useState<InteractiveElement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newElementType, setNewElementType] = useState<InteractiveElement['type']>('QUIZ');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, [lessonId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const data = await videoService.getInteractiveTimeline(lessonId);
      setTimeline(data);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTimeline = async () => {
    try {
      setSaving(true);
      await videoService.updateInteractiveTimeline(lessonId, timeline);
      onTimelineUpdate?.(timeline);
    } catch (error) {
      console.error('Error saving timeline:', error);
    } finally {
      setSaving(false);
    }
  };

  const addElement = () => {
    const newElement: InteractiveElement = {
      startTime: 0,
      type: newElementType,
      id: `element_${Date.now()}`,
      payload: getDefaultPayload(newElementType)
    };
    
    setEditingElement(newElement);
    setShowAddForm(false);
  };

  const editElement = (element: InteractiveElement) => {
    setEditingElement({ ...element });
  };

  const deleteElement = (elementId: string) => {
    setTimeline(timeline.filter(el => el.id !== elementId));
  };

  const saveElement = () => {
    if (!editingElement) return;
    
    const existingIndex = timeline.findIndex(el => el.id === editingElement.id);
    
    if (existingIndex >= 0) {
      // Update existing element
      const newTimeline = [...timeline];
      newTimeline[existingIndex] = editingElement;
      setTimeline(newTimeline);
    } else {
      // Add new element
      setTimeline([...timeline, editingElement]);
    }
    
    setEditingElement(null);
  };

  const cancelEdit = () => {
    setEditingElement(null);
    setShowAddForm(false);
  };

  const getDefaultPayload = (type: InteractiveElement['type']) => {
    switch (type) {
      case 'QUIZ':
        return {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        };
      case 'CTA':
        return {
          title: '',
          description: '',
          buttonText: 'Learn More',
          url: ''
        };
      case 'NOTE':
        return {
          text: ''
        };
      case 'HOTSPOT':
        return {
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          tooltip: ''
        };
      case 'CHAPTER_MARKER':
        return {
          title: '',
          description: ''
        };
      case 'POLL':
        return {
          question: '',
          options: ['', ''],
          allowMultiple: false
        };
      default:
        return {};
    }
  };

  const getElementIcon = (type: InteractiveElement['type']) => {
    switch (type) {
      case 'QUIZ':
        return <QuestionMarkCircleIcon className="h-4 w-4" />;
      case 'HOTSPOT':
        return <CursorArrowRaysIcon className="h-4 w-4" />;
      case 'CHAPTER_MARKER':
        return <BookmarkIcon className="h-4 w-4" />;
      case 'CTA':
        return <MegaphoneIcon className="h-4 w-4" />;
      case 'POLL':
        return <ChatBubbleLeftIcon className="h-4 w-4" />;
      case 'NOTE':
        return <DocumentTextIcon className="h-4 w-4" />;
      default:
        return <QuestionMarkCircleIcon className="h-4 w-4" />;
    }
  };

  const getElementColor = (type: InteractiveElement['type']) => {
    switch (type) {
      case 'QUIZ':
        return 'bg-blue-100 text-blue-800';
      case 'HOTSPOT':
        return 'bg-green-100 text-green-800';
      case 'CHAPTER_MARKER':
        return 'bg-purple-100 text-purple-800';
      case 'CTA':
        return 'bg-orange-100 text-orange-800';
      case 'POLL':
        return 'bg-pink-100 text-pink-800';
      case 'NOTE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Interactive Timeline</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Element</span>
          </button>
          <button
            onClick={saveTimeline}
            disabled={saving}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Timeline'}
          </button>
        </div>
      </div>

      {/* Add Element Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Add Interactive Element</h4>
          <div className="flex items-center space-x-4">
            <select
              value={newElementType}
              onChange={(e) => setNewElementType(e.target.value as InteractiveElement['type'])}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="QUIZ">Quiz</option>
              <option value="CTA">Call to Action</option>
              <option value="NOTE">Note</option>
              <option value="HOTSPOT">Hotspot</option>
              <option value="CHAPTER_MARKER">Chapter Marker</option>
              <option value="POLL">Poll</option>
            </select>
            <button
              onClick={addElement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-3">
        {timeline.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No interactive elements added yet</p>
            <p className="text-sm">Click "Add Element" to get started</p>
          </div>
        ) : (
          timeline
            .sort((a, b) => a.startTime - b.startTime)
            .map((element) => (
              <div key={element.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getElementColor(element.type)}`}>
                      {getElementIcon(element.type)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {element.type.replace('_', ' ')} at {formatTime(element.startTime)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {element.type === 'QUIZ' && element.payload.question}
                        {element.type === 'CTA' && element.payload.title}
                        {element.type === 'NOTE' && element.payload.text}
                        {element.type === 'CHAPTER_MARKER' && element.payload.title}
                        {element.type === 'POLL' && element.payload.question}
                        {element.type === 'HOTSPOT' && element.payload.tooltip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editElement(element)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteElement(element.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Edit Element Modal */}
      {editingElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Edit {editingElement.type.replace('_', ' ')}
            </h4>
            
            <div className="space-y-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time (seconds)
                </label>
                <input
                  type="number"
                  value={editingElement.startTime}
                  onChange={(e) => setEditingElement({
                    ...editingElement,
                    startTime: Number(e.target.value)
                  })}
                  min="0"
                  max={videoDuration}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Time (if applicable) */}
              {(editingElement.type === 'HOTSPOT' || editingElement.type === 'CTA') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={editingElement.endTime || ''}
                    onChange={(e) => setEditingElement({
                      ...editingElement,
                      endTime: e.target.value ? Number(e.target.value) : undefined
                    })}
                    min={editingElement.startTime}
                    max={videoDuration}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Element-specific fields */}
              {editingElement.type === 'QUIZ' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <textarea
                      value={editingElement.payload.question}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        payload: { ...editingElement.payload, question: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options
                    </label>
                    {editingElement.payload.options.map((option: string, index: number) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingElement.payload.options];
                          newOptions[index] = e.target.value;
                          setEditingElement({
                            ...editingElement,
                            payload: { ...editingElement.payload, options: newOptions }
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {editingElement.type === 'CTA' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingElement.payload.title}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        payload: { ...editingElement.payload, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingElement.payload.description}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        payload: { ...editingElement.payload, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={editingElement.payload.url}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        payload: { ...editingElement.payload, url: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {editingElement.type === 'NOTE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note Text
                  </label>
                  <textarea
                    value={editingElement.payload.text}
                    onChange={(e) => setEditingElement({
                      ...editingElement,
                      payload: { ...editingElement.payload, text: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveElement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Element
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

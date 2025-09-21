'use client';

import { useState, useEffect } from 'react';
import { VideoUploader } from '@/components/video/VideoUploader';
import { XMarkIcon, EyeIcon, EyeSlashIcon, ClockIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl?: string;
  resources: string[];
  isPreview: boolean;
  processingStatus: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

interface LessonEditorProps {
  lesson?: Lesson;
  onSave: (lessonData: Partial<Lesson>) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    duration: lesson?.duration || 0,
    isPreview: lesson?.isPreview || false,
    resources: lesson?.resources || []
  });
  const [newResource, setNewResource] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'video' | 'resources'>('details');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Lesson description is required';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.duration < 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (formData.duration > 300) {
      newErrors.duration = 'Duration cannot exceed 300 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  const addResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleResourceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addResource();
    }
  };

  const getResourceType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube Video';
    } else if (url.includes('drive.google.com')) {
      return 'Google Drive';
    } else if (url.endsWith('.pdf')) {
      return 'PDF Document';
    } else if (url.endsWith('.ppt') || url.endsWith('.pptx')) {
      return 'PowerPoint';
    } else if (url.endsWith('.doc') || url.endsWith('.docx')) {
      return 'Word Document';
    } else {
      return 'External Link';
    }
  };

  const getResourceIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return '🎥';
    } else if (url.includes('drive.google.com')) {
      return '📁';
    } else if (url.endsWith('.pdf')) {
      return '📄';
    } else if (url.endsWith('.ppt') || url.endsWith('.pptx')) {
      return '📊';
    } else if (url.endsWith('.doc') || url.endsWith('.docx')) {
      return '📝';
    } else {
      return '🔗';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {lesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'video'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-2" />
              Video
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <LinkIcon className="h-4 w-4 inline mr-2" />
              Resources
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter lesson title"
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Lesson Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what students will learn in this lesson"
                rows={4}
                maxLength={1000}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  max="300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Estimated duration for this lesson
              </p>
            </div>

            {/* Preview Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Setting
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('isPreview', !formData.isPreview)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isPreview ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPreview ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex items-center space-x-2">
                  {formData.isPreview ? (
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">
                    {formData.isPreview ? 'Available for preview' : 'Not available for preview'}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Preview lessons are visible to students before enrollment
              </p>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Video Content</h4>
              <VideoUploader
                lessonId={lesson?.id || 'new-lesson'}
                onUploadComplete={(videoKey) => {
                  console.log('Video uploaded:', videoKey);
                  // Handle video upload completion
                }}
                onUploadError={(error) => {
                  console.error('Upload failed:', error);
                  // Handle upload error
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Resources</h4>
              
              {/* Add Resource */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Resource URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    onKeyDown={handleResourceKeyDown}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/resource"
                  />
                  <button
                    onClick={addResource}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Add links to PDFs, documents, external resources, or YouTube videos
                </p>
              </div>

              {/* Resources List */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Resources ({formData.resources.length})
                </h5>
                {formData.resources.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <LinkIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No resources added yet</p>
                    <p className="text-sm">Add URLs to provide additional learning materials</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getResourceIcon(resource)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getResourceType(resource)}
                            </p>
                            <p className="text-xs text-gray-600 truncate max-w-md">
                              {resource}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                          <button
                            onClick={() => removeResource(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {lesson ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { courseService } from '@/lib/courseService';

interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  language: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  thumbnail: File | null;
  promotionalVideo: File | null;
  courseMaterials: File[];
  isPublished: boolean;
  isFree: boolean;
}

interface UploadProgress {
  thumbnail: number;
  promotionalVideo: number;
  materials: { [key: string]: number };
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    thumbnail: 0,
    promotionalVideo: 0,
    materials: {}
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: '',
    duration: '',
    price: 0,
    language: 'English',
    tags: [],
    prerequisites: [],
    learningObjectives: [],
    thumbnail: null,
    promotionalVideo: null,
    courseMaterials: [],
    isPublished: false,
    isFree: false
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: DocumentTextIcon },
    { id: 2, title: 'Course Details', icon: AcademicCapIcon },
    { id: 3, title: 'Pricing & Settings', icon: CurrencyDollarIcon },
    { id: 4, title: 'Media & Materials', icon: PhotoIcon },
    { id: 5, title: 'Review & Publish', icon: CheckCircleIcon }
  ];

  const categories = [
    'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Healthcare',
    'Education', 'Data Science', 'AI/ML', 'Web Development', 'Mobile Development',
    'UI/UX Design', 'Digital Marketing', 'Project Management', 'Leadership'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  const handleInputChange = (field: string, value: any) => {
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

  const handleArrayChange = (field: string, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field as keyof CourseFormData] as string[]), value]
        : (prev[field as keyof CourseFormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'promotionalVideo' | 'materials') => {
    try {
      if (type === 'materials') {
        setUploadProgress(prev => ({
          ...prev,
          materials: { ...prev.materials, [file.name]: 0 }
        }));
      } else {
        setUploadProgress(prev => ({
          ...prev,
          [type]: 0
        }));
      }

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (type === 'materials') {
          setUploadProgress(prev => ({
            ...prev,
            materials: { ...prev.materials, [file.name]: progress }
          }));
        } else {
          setUploadProgress(prev => ({
            ...prev,
            [type]: progress
          }));
        }
      }

      // Simulate successful upload
      const uploadedUrl = `https://kalpla-courses.s3.amazonaws.com/${type}/${Date.now()}_${file.name}`;
      
      if (type === 'materials') {
        setFormData(prev => ({
          ...prev,
          courseMaterials: [...prev.courseMaterials, file]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [type]: file
        }));
      }

      return uploadedUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  };

  const removeFile = (type: 'thumbnail' | 'promotionalVideo' | 'materials', fileName?: string) => {
    if (type === 'materials' && fileName) {
      setFormData(prev => ({
        ...prev,
        courseMaterials: prev.courseMaterials.filter(file => file.name !== fileName)
      }));
      setUploadProgress(prev => ({
        ...prev,
        materials: { ...prev.materials, [fileName]: 0 }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: null
      }));
      setUploadProgress(prev => ({
        ...prev,
        [type]: 0
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Course title is required';
    if (!formData.description.trim()) newErrors.description = 'Course description is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.isFree && formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.learningObjectives.length === 0) newErrors.learningObjectives = 'At least one learning objective is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateForm() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Upload files
      let thumbnailUrl = '';
      let promotionalVideoUrl = '';
      const materialUrls: string[] = [];

      if (formData.thumbnail) {
        thumbnailUrl = await handleFileUpload(formData.thumbnail, 'thumbnail');
      }

      if (formData.promotionalVideo) {
        promotionalVideoUrl = await handleFileUpload(formData.promotionalVideo, 'promotionalVideo');
      }

      for (const material of formData.courseMaterials) {
        const url = await handleFileUpload(material, 'materials');
        materialUrls.push(url);
      }

      // Create course
      const courseData = {
        ...formData,
        thumbnailUrl,
        promotionalVideoUrl,
        materialUrls,
        instructorId: 'current-user-id', // This would come from auth context
        createdAt: new Date().toISOString(),
        status: formData.isPublished ? 'published' : 'draft'
      };

      const result = await courseService.createCourse(courseData);
      
      if (result.success) {
        router.push(`/instructor/courses/${result.courseId}`);
      } else {
        setErrors({ submit: result.error || 'Failed to create course' });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about your course</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter an engaging course title"
                className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description for course cards (max 150 characters)"
                maxLength={150}
                className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.shortDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formData.shortDescription.length}/150 characters</p>
              {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                placeholder="Provide a detailed description of your course..."
                className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.level ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Details</h2>
              <p className="text-gray-600">Define the course structure and objectives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 4 weeks, 20 hours"
                  className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives *</label>
              <div className="space-y-2">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...formData.learningObjectives];
                        newObjectives[index] = e.target.value;
                        handleInputChange('learningObjectives', newObjectives);
                      }}
                      placeholder={`Learning objective ${index + 1}`}
                      className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newObjectives = formData.learningObjectives.filter((_, i) => i !== index);
                        handleInputChange('learningObjectives', newObjectives);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newObjectives = [...formData.learningObjectives, ''];
                    handleInputChange('learningObjectives', newObjectives);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Learning Objective
                </button>
              </div>
              {errors.learningObjectives && <p className="mt-1 text-sm text-red-600">{errors.learningObjectives}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
              <div className="space-y-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => {
                        const newPrerequisites = [...formData.prerequisites];
                        newPrerequisites[index] = e.target.value;
                        handleInputChange('prerequisites', newPrerequisites);
                      }}
                      placeholder={`Prerequisite ${index + 1}`}
                      className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPrerequisites = formData.prerequisites.filter((_, i) => i !== index);
                        handleInputChange('prerequisites', newPrerequisites);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newPrerequisites = [...formData.prerequisites, ''];
                    handleInputChange('prerequisites', newPrerequisites);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Prerequisite
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = formData.tags.filter((_, i) => i !== index);
                        handleInputChange('tags', newTags);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter to add)"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && !formData.tags.includes(value)) {
                      handleInputChange('tags', [...formData.tags, value]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Settings</h2>
              <p className="text-gray-600">Set your course pricing and availability</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) => handleInputChange('isFree', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isFree" className="ml-2 text-sm font-medium text-gray-700">
                  This is a free course
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={`w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-gray-700">
                  Publish course immediately
                </label>
              </div>
              <p className="text-sm text-gray-600">
                If unchecked, the course will be saved as a draft and can be published later.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Media & Materials</h2>
              <p className="text-gray-600">Upload course thumbnail, videos, and materials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.thumbnail ? (
                    <div className="space-y-2">
                      <PhotoIcon className="mx-auto h-12 w-12 text-green-500" />
                      <p className="text-sm text-gray-600">{formData.thumbnail.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.thumbnail}%` }}
                        ></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('thumbnail')}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload thumbnail image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'thumbnail');
                          }
                        }}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Video</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.promotionalVideo ? (
                    <div className="space-y-2">
                      <VideoCameraIcon className="mx-auto h-12 w-12 text-green-500" />
                      <p className="text-sm text-gray-600">{formData.promotionalVideo.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.promotionalVideo}%` }}
                        ></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('promotionalVideo')}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload promotional video</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'promotionalVideo');
                          }
                        }}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Materials</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center mb-4">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload course materials (PDFs, documents, etc.)</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        handleFileUpload(file, 'materials');
                      });
                    }}
                    className="mt-2"
                  />
                </div>
                
                {formData.courseMaterials.length > 0 && (
                  <div className="space-y-2">
                    {formData.courseMaterials.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.materials[file.name] || 0}%` }}
                            ></div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('materials', file.name)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h2>
              <p className="text-gray-600">Review your course details before publishing</p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Preview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {formData.thumbnail ? (
                      <img
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <PhotoIcon className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>
                  <p className="text-gray-600 mb-4">{formData.shortDescription}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {formData.level}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formData.duration}
                    </span>
                    <span className="flex items-center">
                      <TagIcon className="h-4 w-4 mr-1" />
                      {formData.category}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {formData.isFree ? 'Free' : `₹${formData.price.toLocaleString('en-IN')}`}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          formData.isPublished ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {formData.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{formData.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Materials:</span>
                        <span className="font-medium">{formData.courseMaterials.length} files</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium text-gray-900 mb-2">Learning Objectives:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {formData.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/instructor/courses')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Courses
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Create Course</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <CloudArrowUpIcon className="h-5 w-5 mr-2 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  {formData.isPublished ? 'Publish Course' : 'Save as Draft'}
                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

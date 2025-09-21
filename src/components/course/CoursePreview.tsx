'use client';

import { useState } from 'react';
import {
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  TagIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: string;
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  price: number;
  currency: string;
  thumbnail?: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  sections: CourseSection[];
  createdAt: string;
  updatedAt: string;
}

interface CourseSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  isPreview: boolean;
  lessons: Lesson[];
}

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

interface CoursePreviewProps {
  course: Course;
}

export function CoursePreview({ course }: CoursePreviewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const totalDuration = course.sections.reduce((total, section) => {
    return total + section.lessons.reduce((sectionTotal, lesson) => sectionTotal + lesson.duration, 0);
  }, 0);

  const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title || 'Untitled Course'}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {course.description || 'No description provided'}
              </p>
              
              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{course.sections.length} sections</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.language}
                </span>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {course.currency} {course.price}
              </div>
              <div className="text-sm text-gray-600">One-time payment</div>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
                <ul className="space-y-1">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learning Outcomes */}
            {course.learningOutcomes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What You'll Learn</h3>
                <ul className="space-y-1">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
          <div className="space-y-3">
            {course.sections.map((section, sectionIndex) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-500">
                        Section {sectionIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-600">{section.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        {section.lessons.length} lessons • {formatDuration(section.duration)}
                      </div>
                      <div className={`transform transition-transform ${
                        expandedSections.has(section.id) ? 'rotate-180' : ''
                      }`}>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="px-4 py-3 space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-500">
                              {sectionIndex + 1}.{lessonIndex + 1}
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.videoUrl ? (
                                <PlayIcon className="h-4 w-4 text-gray-400" />
                              ) : (
                                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                              )}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-xs text-gray-600">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.isPreview && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Preview
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {course.sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No content added yet</p>
              <p className="text-sm">Add sections and lessons to see them here</p>
            </div>
          )}
        </div>

        {/* Course Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{course.sections.length}</div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{course.version}</div>
              <div className="text-sm text-gray-600">Version</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
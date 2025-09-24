'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ClockIcon,
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { curriculumService, Lesson } from '@/lib/curriculumService';
import LessonViewer from '@/components/curriculum/LessonViewer';

export default function StudentLessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLessonData();
  }, [courseId, lessonId]);

  const loadLessonData = async () => {
    try {
      setLoading(true);
      
      // Load all lessons for navigation
      const allLessons = await curriculumService.getCurriculum(courseId);
      setLessons(allLessons);
      
      // Find current lesson
      const currentLesson = allLessons.find(l => l.id === lessonId);
      if (currentLesson) {
        setLesson(currentLesson);
        setCurrentIndex(allLessons.findIndex(l => l.id === lessonId));
      }
      
      // Load completed lessons (this would come from user progress)
      // For now, simulate some completed lessons
      setCompletedLessons(new Set(['lesson_1']));
      
    } catch (error) {
      console.error('Error loading lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    // In a real implementation, you would save progress to the backend
    console.log('Lesson completed:', lessonId);
  };

  const navigateToLesson = (index: number) => {
    if (index >= 0 && index < lessons.length) {
      const targetLesson = lessons[index];
      router.push(`/student/courses/${courseId}/lessons/${targetLesson.id}`);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-4 w-4 text-red-500" />;
      case 'pdf':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'pdf':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => router.push(`/student/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/student/courses/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Course
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Learning</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Lesson {currentIndex + 1} of {lessons.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <LessonViewer 
              lesson={lesson} 
              onComplete={handleLessonComplete}
              isPreview={lesson.isPreview}
            />
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
              
              <div className="space-y-2">
                {lessons.map((lessonItem, index) => {
                  const isCompleted = completedLessons.has(lessonItem.id);
                  const isCurrent = lessonItem.id === lessonId;
                  const isLocked = !lessonItem.isVisible && !lessonItem.isPreview;
                  
                  return (
                    <div
                      key={lessonItem.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'border-blue-500 bg-blue-50' 
                          : isLocked
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => !isLocked && navigateToLesson(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : isLocked ? (
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            getLessonIcon(lessonItem.type)
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              isCurrent ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {lessonItem.title}
                            </h4>
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getLessonTypeColor(lessonItem.type)}`}>
                              {lessonItem.type.toUpperCase()}
                            </span>
                          </div>
                          
                          {lessonItem.duration && (
                            <div className="flex items-center text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {lessonItem.duration}
                            </div>
                          )}
                          
                          {lessonItem.isPreview && (
                            <span className="inline-block px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-1">
                              Preview
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigateToLesson(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
              currentIndex === 0 
                ? 'opacity-50 cursor-not-allowed text-gray-400' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous Lesson
          </button>
          
          <button
            onClick={() => navigateToLesson(currentIndex + 1)}
            disabled={currentIndex === lessons.length - 1}
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
              currentIndex === lessons.length - 1 
                ? 'opacity-50 cursor-not-allowed text-gray-400' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next Lesson
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

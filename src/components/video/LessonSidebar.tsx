'use client';

import { useState } from 'react';
import { 
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: number;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
  documentUrl?: string;
  quizId?: string;
  assignmentId?: string;
  order: number;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonSelect: (lesson: Lesson) => void;
  courseTitle?: string;
  className?: string;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  onLessonSelect,
  courseTitle = 'Course Lessons',
  className = ''
}: LessonSidebarProps) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  const toggleLessonExpansion = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="h-4 w-4" />;
      case 'document':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'quiz':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'assignment':
        return <DocumentTextIcon className="h-4 w-4" />;
      default:
        return <PlayIcon className="h-4 w-4" />;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-600';
      case 'document':
        return 'text-green-600';
      case 'quiz':
        return 'text-purple-600';
      case 'assignment':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCompletionStats = () => {
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
    const unlockedLessons = lessons.filter(lesson => !lesson.isLocked).length;
    
    return {
      total: totalLessons,
      completed: completedLessons,
      unlocked: unlockedLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  };

  const stats = getCompletionStats();

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{courseTitle}</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{stats.completed}/{stats.total} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {stats.percentage}% complete
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonId;
              const isExpanded = expandedLessons.has(lesson.id);
              
              return (
                <div key={lesson.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => {
                      if (lesson.isLocked) return;
                      onLessonSelect(lesson);
                      if (lesson.description) {
                        toggleLessonExpansion(lesson.id);
                      }
                    }}
                    disabled={lesson.isLocked}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 border-blue-200'
                        : lesson.isLocked
                        ? 'bg-gray-50 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {lesson.isLocked ? (
                          <LockClosedIcon className="h-4 w-4 text-gray-400" />
                        ) : lesson.isCompleted ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className={`${getLessonTypeColor(lesson.type)}`}>
                            {getLessonIcon(lesson.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium truncate ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {lesson.duration > 0 && (
                              <div className="flex items-center text-xs text-gray-500">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatDuration(lesson.duration)}
                              </div>
                            )}
                            {lesson.description && (
                              <ArrowRightIcon className={`h-3 w-3 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`} />
                            )}
                          </div>
                        </div>
                        
                        {lesson.description && isExpanded && (
                          <p className="text-xs text-gray-600 mt-1">
                            {lesson.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lesson.type === 'video' ? 'bg-blue-100 text-blue-700' :
                            lesson.type === 'document' ? 'bg-green-100 text-green-700' :
                            lesson.type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                            lesson.type === 'assignment' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {lesson.type}
                          </span>
                          
                          {lesson.isCompleted && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              Completed
                            </span>
                          )}
                          
                          {lesson.isLocked && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Unlocked Lessons</span>
            <span>{stats.unlocked}/{stats.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Completed Lessons</span>
            <span>{stats.completed}/{stats.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  PlusIcon,
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { curriculumService, Lesson, LessonType } from '@/lib/curriculumService';
import QuizBuilder from '@/components/curriculum/QuizBuilder';

interface LessonItemProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  onToggleVisibility: (lessonId: string) => void;
}

function LessonItem({ lesson, onEdit, onDelete, onToggleVisibility }: LessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-5 w-5 text-red-500" />;
      case 'pdf':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLessonTypeColor = (type: LessonType) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1"
          >
            <Bars3Icon className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-3">
            {getLessonIcon(lesson.type)}
            <div>
              <h3 className="text-sm font-medium text-gray-900">{lesson.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLessonTypeColor(lesson.type)}`}>
                  {lesson.type.toUpperCase()}
                </span>
                {lesson.duration && (
                  <span className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {lesson.duration}
                  </span>
                )}
                {lesson.isPreview && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleVisibility(lesson.id)}
            className={`p-1 rounded ${
              lesson.isVisible 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={lesson.isVisible ? 'Hide lesson' : 'Show lesson'}
          >
            {lesson.isVisible ? (
              <LockOpenIcon className="h-4 w-4" />
            ) : (
              <LockClosedIcon className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={() => onEdit(lesson)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit lesson"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(lesson.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete lesson"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CurriculumBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLessonType, setSelectedLessonType] = useState<LessonType>('video');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadCurriculum();
  }, [courseId]);

  const loadCurriculum = async () => {
    try {
      setLoading(true);
      const curriculum = await curriculumService.getCurriculum(courseId);
      setLessons(curriculum);
    } catch (error) {
      console.error('Error loading curriculum:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = lessons.findIndex(lesson => lesson.id === active.id);
      const newIndex = lessons.findIndex(lesson => lesson.id === over.id);
      
      const newLessons = arrayMove(lessons, oldIndex, newIndex);
      setLessons(newLessons);
      
      // Update order in backend
      await curriculumService.updateLessonOrder(courseId, newLessons.map(lesson => lesson.id));
    }
  };

  const handleAddLesson = (type: LessonType) => {
    setSelectedLessonType(type);
    setEditingLesson(null);
    setShowAddLessonModal(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedLessonType(lesson.type);
    setShowAddLessonModal(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      try {
        await curriculumService.deleteLesson(courseId, lessonId);
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Failed to delete lesson');
      }
    }
  };

  const handleToggleVisibility = async (lessonId: string) => {
    try {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        const updatedLesson = { ...lesson, isVisible: !lesson.isVisible };
        await curriculumService.updateLesson(courseId, lessonId, updatedLesson);
        setLessons(lessons.map(l => l.id === lessonId ? updatedLesson : l));
      }
    } catch (error) {
      console.error('Error toggling lesson visibility:', error);
      alert('Failed to update lesson visibility');
    }
  };

  const handleSaveLesson = async (lessonData: Partial<Lesson>) => {
    try {
      if (editingLesson) {
        // Update existing lesson
        const updatedLesson = await curriculumService.updateLesson(courseId, editingLesson.id, lessonData);
        setLessons(lessons.map(l => l.id === editingLesson.id ? updatedLesson : l));
      } else {
        // Create new lesson
        const newLesson = await curriculumService.createLesson(courseId, {
          ...lessonData,
          type: selectedLessonType,
          order: lessons.length + 1,
          isVisible: true,
          isPreview: false
        } as Lesson);
        setLessons([...lessons, newLesson]);
      }
      setShowAddLessonModal(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson');
    }
  };

  const getTotalDuration = () => {
    return lessons.reduce((total, lesson) => {
      if (lesson.duration) {
        const minutes = parseInt(lesson.duration.replace(/\D/g, ''));
        return total + minutes;
      }
      return total;
    }, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading curriculum...</p>
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
                onClick={() => router.push(`/instructor/courses/${courseId}`)}
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
              <span className="ml-2 text-lg font-medium text-gray-900">Curriculum Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {lessons.length} lessons • {formatDuration(getTotalDuration())}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Lesson Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Lesson</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleAddLesson('video')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
            >
              <div className="text-center">
                <PlayIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Video Lesson</p>
                <p className="text-xs text-gray-500">Upload video content</p>
              </div>
            </button>
            
            <button
              onClick={() => handleAddLesson('pdf')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">PDF Lesson</p>
                <p className="text-xs text-gray-500">Upload PDF documents</p>
              </div>
            </button>
            
            <button
              onClick={() => handleAddLesson('quiz')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Quiz Lesson</p>
                <p className="text-xs text-gray-500">Create interactive quizzes</p>
              </div>
            </button>
          </div>
        </div>

        {/* Curriculum List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
            <div className="text-sm text-gray-500">
              Drag and drop to reorder lessons
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons yet</h3>
              <p className="mt-2 text-gray-600">
                Start building your curriculum by adding your first lesson.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={lessons.map(lesson => lesson.id)}
                strategy={verticalListSortingStrategy}
              >
                {lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={handleEditLesson}
                    onDelete={handleDeleteLesson}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Add/Edit Lesson Modal */}
      {showAddLessonModal && (
        <LessonModal
          lesson={editingLesson}
          type={selectedLessonType}
          onSave={handleSaveLesson}
          onClose={() => {
            setShowAddLessonModal(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}

// Lesson Modal Component
interface LessonModalProps {
  lesson: Lesson | null;
  type: LessonType;
  onSave: (lessonData: Partial<Lesson>) => void;
  onClose: () => void;
}

function LessonModal({ lesson, type, onSave, onClose }: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    duration: lesson?.duration || '',
    content: lesson?.content || '',
    isPreview: lesson?.isPreview || false,
    isVisible: lesson?.isVisible !== false
  });
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [quizData, setQuizData] = useState(lesson?.quizData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'quiz' && quizData) {
      onSave({ ...formData, quizData });
    } else {
      onSave(formData);
    }
  };

  const handleQuizSave = (newQuizData: any) => {
    setQuizData(newQuizData);
    setShowQuizBuilder(false);
  };

  const renderContentEditor = () => {
    switch (type) {
      case 'video':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video File</label>
            <input
              type="file"
              accept="video/*"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Upload MP4, MOV, or AVI files (max 500MB)</p>
          </div>
        );
      
      case 'pdf':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
            <input
              type="file"
              accept=".pdf"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Upload PDF documents (max 50MB)</p>
          </div>
        );
      
      case 'quiz':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Quiz Builder</label>
              <button
                type="button"
                onClick={() => setShowQuizBuilder(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {quizData ? 'Edit Quiz' : 'Create Quiz'}
              </button>
            </div>
            {quizData ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {quizData.questions.length} questions
                  </span>
                  <span className="text-sm text-gray-500">
                    Passing Score: {quizData.passingScore}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Time Limit: {quizData.timeLimit || 'No limit'} minutes
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No quiz created yet</p>
                <p className="text-xs text-gray-400">Click "Create Quiz" to get started</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {lesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 15 minutes, 1 hour"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {renderContentEditor()}

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPreview}
                  onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Make this lesson a preview</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Make lesson visible to students</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {lesson ? 'Update Lesson' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quiz Builder Modal */}
      {showQuizBuilder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Quiz Builder</h3>
                <button
                  onClick={() => setShowQuizBuilder(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <QuizBuilder
                quizData={quizData}
                onSave={handleQuizSave}
                onCancel={() => setShowQuizBuilder(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

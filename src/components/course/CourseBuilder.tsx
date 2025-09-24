'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { courseService } from '@/lib/courseService';
import { CourseSectionEditor } from './CourseSectionEditor';
import { LessonEditor } from './LessonEditor';
import { CoursePreview } from './CoursePreview';
import {
  PlusIcon,
  EyeIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
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

interface CourseBuilderProps {
  courseId?: string;
  onCourseUpdate?: (course: Course) => void;
}

export function CourseBuilder({ courseId, onCourseUpdate }: CourseBuilderProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    } else {
      createNewCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourse(courseId!);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const createNewCourse = () => {
    const newCourse: Course = {
      id: '',
      title: '',
      description: '',
      category: '',
      subcategory: '',
      difficulty: 'BEGINNER',
      language: 'English',
      prerequisites: [],
      learningOutcomes: [],
      price: 0,
      currency: 'USD',
      thumbnail: '',
      status: 'DRAFT',
      version: 1,
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCourse(newCourse);
    setLoading(false);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !course) return;

    const { source, destination, type } = result;

    if (type === 'SECTION') {
      // Reorder sections
      const newSections = Array.from(course.sections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);

      // Update order numbers
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1
      }));

      await updateCourseSections(updatedSections);
    } else if (type === 'LESSON') {
      // Reorder lessons within a section
      const sourceSectionId = source.droppableId;
      const destSectionId = destination.droppableId;

      if (sourceSectionId === destSectionId) {
        // Same section - reorder
        const section = course.sections.find(s => s.id === sourceSectionId);
        if (!section) return;

        const newLessons = Array.from(section.lessons);
        const [reorderedLesson] = newLessons.splice(source.index, 1);
        newLessons.splice(destination.index, 0, reorderedLesson);

        // Update order numbers
        const updatedLessons = newLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        await updateSectionLessons(sourceSectionId, updatedLessons);
      } else {
        // Different sections - move lesson
        const sourceSection = course.sections.find(s => s.id === sourceSectionId);
        const destSection = course.sections.find(s => s.id === destSectionId);
        
        if (!sourceSection || !destSection) return;

        const newSourceLessons = Array.from(sourceSection.lessons);
        const newDestLessons = Array.from(destSection.lessons);
        
        const [movedLesson] = newSourceLessons.splice(source.index, 1);
        newDestLessons.splice(destination.index, 0, {
          ...movedLesson,
          sectionId: destSectionId
        });

        // Update order numbers for both sections
        const updatedSourceLessons = newSourceLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        const updatedDestLessons = newDestLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        await updateSectionLessons(sourceSectionId, updatedSourceLessons);
        await updateSectionLessons(destSectionId, updatedDestLessons);
      }
    }
  };

  const updateCourseSections = async (sections: CourseSection[]) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedCourse = { ...course, sections };
      setCourse(updatedCourse);
      
      await courseService.updateCourseStructure(course.id, sections);
      onCourseUpdate?.(updatedCourse);
    } catch (err: any) {
      setError(err.message || 'Failed to update course structure');
    } finally {
      setSaving(false);
    }
  };

  const updateSectionLessons = async (sectionId: string, lessons: Lesson[]) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedSections = course.sections.map(section => 
        section.id === sectionId ? { ...section, lessons } : section
      );
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      
      await courseService.updateSectionLessons(sectionId, lessons);
      onCourseUpdate?.(updatedCourse);
    } catch (err: any) {
      setError(err.message || 'Failed to update section lessons');
    } finally {
      setSaving(false);
    }
  };

  const addSection = async (sectionData: Partial<CourseSection>) => {
    if (!course) return;

    try {
      setSaving(true);
      const newSection: CourseSection = {
        id: `section_${Date.now()}`,
        title: sectionData.title || 'New Section',
        description: sectionData.description || '',
        order: course.sections.length + 1,
        duration: 0,
        isPreview: sectionData.isPreview || false,
        lessons: []
      };

      const updatedSections = [...course.sections, newSection];
      const updatedCourse = { ...course, sections: updatedSections };
      
      setCourse(updatedCourse);
      await courseService.createCourseSection(newSection);
      onCourseUpdate?.(updatedCourse);
      
      setShowAddSection(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add section');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (sectionId: string, sectionData: Partial<CourseSection>) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedSections = course.sections.map(section =>
        section.id === sectionId ? { ...section, ...sectionData } : section
      );
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      
      await courseService.updateCourseSection(sectionId, sectionData);
      onCourseUpdate?.(updatedCourse);
      
      setEditingSection(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedSections = course.sections.filter(section => section.id !== sectionId);
      
      // Update order numbers
      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index + 1
      }));
      
      const updatedCourse = { ...course, sections: reorderedSections };
      setCourse(updatedCourse);
      
      await courseService.deleteCourseSection(sectionId);
      onCourseUpdate?.(updatedCourse);
    } catch (err: any) {
      setError(err.message || 'Failed to delete section');
    } finally {
      setSaving(false);
    }
  };

  const addLesson = async (sectionId: string, lessonData: Partial<Lesson>) => {
    if (!course) return;

    try {
      setSaving(true);
      const section = course.sections.find(s => s.id === sectionId);
      if (!section) return;

      const newLesson: Lesson = {
        id: `lesson_${Date.now()}`,
        title: lessonData.title || 'New Lesson',
        description: lessonData.description || '',
        order: section.lessons.length + 1,
        duration: lessonData.duration || 0,
        videoUrl: lessonData.videoUrl,
        resources: lessonData.resources || [],
        isPreview: lessonData.isPreview || false,
        processingStatus: 'UPLOADING'
      };

      const updatedSections = course.sections.map(s =>
        s.id === sectionId 
          ? { ...s, lessons: [...s.lessons, newLesson] }
          : s
      );
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      
      await courseService.createLesson(sectionId, newLesson);
      onCourseUpdate?.(updatedCourse);
      
      setEditingLesson(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const updateLesson = async (lessonId: string, lessonData: Partial<Lesson>) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedSections = course.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
        )
      }));
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      
      await courseService.updateLesson(lessonId, lessonData);
      onCourseUpdate?.(updatedCourse);
      
      setEditingLesson(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson');
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedSections = course.sections.map(section => ({
        ...section,
        lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
      }));
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      
      await courseService.deleteLesson(lessonId);
      onCourseUpdate?.(updatedCourse);
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!course) return;

    try {
      setSaving(true);
      await courseService.updateCourse(course.id, course);
      onCourseUpdate?.(course);
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const submitForReview = async () => {
    if (!course) return;

    try {
      setSaving(true);
      const updatedCourse = await courseService.submitCourseForReview(course.id);
      setCourse(updatedCourse);
      onCourseUpdate?.(updatedCourse);
    } catch (err: any) {
      setError(err.message || 'Failed to submit for review');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'PENDING_REVIEW':
        return <ClockIcon className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'PUBLISHED':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Found</h3>
          <p className="text-gray-600">Unable to load course data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {course.title || 'Untitled Course'}
            </h1>
            <p className="text-gray-600 mb-4">
              {course.description || 'Add a description for your course'}
            </p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                {getStatusIcon(course.status)}
                <span className="ml-1">{course.status.replace('_', ' ')}</span>
              </span>
              <span className="text-sm text-gray-600">
                Version {course.version}
              </span>
              <span className="text-sm text-gray-600">
                {course.sections.length} sections
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <EyeIcon className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={saveDraft}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <DocumentTextIcon className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>
            {course.status === 'DRAFT' && (
              <button
                onClick={submitForReview}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Category:</span>
            <span className="ml-2 text-gray-600">{course.category || 'Not set'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Difficulty:</span>
            <span className="ml-2 text-gray-600">{course.difficulty}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Price:</span>
            <span className="ml-2 text-gray-600">₹{course.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Course Builder */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Course Structure</h2>
            <button
              onClick={() => setShowAddSection(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Section</span>
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections" type="SECTION">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {course.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-50 rounded-lg p-4 border-2 ${
                            snapshot.isDragging ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{section.title}</h3>
                                <p className="text-sm text-gray-600">{section.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {section.lessons.length} lessons
                              </span>
                              <button
                                onClick={() => setEditingSection(section.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteSection(section.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Lessons */}
                          <Droppable droppableId={section.id} type="LESSON">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                              >
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`bg-white rounded-lg p-3 border ${
                                          snapshot.isDragging ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="cursor-move text-gray-400 hover:text-gray-600"
                                            >
                                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                              <p className="text-sm text-gray-600">{lesson.description}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">
                                              {lesson.duration} min
                                            </span>
                                            <button
                                              onClick={() => setEditingLesson(lesson.id)}
                                              className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                              <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={() => deleteLesson(lesson.id)}
                                              className="p-1 text-gray-400 hover:text-red-600"
                                            >
                                              <TrashIcon className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                <button
                                  onClick={() => addLesson(section.id, {})}
                                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center space-x-2"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  <span>Add Lesson</span>
                                </button>
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {course.sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No sections added yet</p>
              <p className="text-sm">Click "Add Section" to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Course Preview */}
      {activeTab === 'preview' && course && (
        <CoursePreview course={course} />
      )}

      {/* Modals */}
      {showAddSection && (
        <CourseSectionEditor
          onSave={(sectionData) => addSection(sectionData)}
          onCancel={() => setShowAddSection(false)}
        />
      )}

      {editingSection && (
        <CourseSectionEditor
          section={course.sections.find(s => s.id === editingSection)}
          onSave={(sectionData) => updateSection(editingSection, sectionData)}
          onCancel={() => setEditingSection(null)}
        />
      )}

      {editingLesson && (
        <LessonEditor
          lesson={course.sections.flatMap(s => s.lessons).find(l => l.id === editingLesson)}
          onSave={(lessonData) => updateLesson(editingLesson, lessonData)}
          onCancel={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}

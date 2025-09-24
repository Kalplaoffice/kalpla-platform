'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CoursePlayer } from '@/components/course/CoursePlayer';
import { useAuth } from '@/contexts/AuthContext';

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-white text-xl mb-4">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the course player.</p>
        </div>
      </div>
    );
  }

  const handleLessonComplete = (completedLessonId: string) => {
    console.log('Lesson completed:', completedLessonId);
    // Handle lesson completion logic here
    // e.g., update course progress, unlock next lesson, etc.
  };

  const handleProgressUpdate = (progress: number) => {
    console.log('Progress updated:', progress);
    // Handle progress update logic here
    // e.g., update user's overall course progress
  };

  return (
    <CoursePlayer
      courseId={courseId}
      lessonId={lessonId}
      userId={user.id}
      userRole={user.role || 'student'}
      onLessonComplete={handleLessonComplete}
      onProgressUpdate={handleProgressUpdate}
    />
  );
}
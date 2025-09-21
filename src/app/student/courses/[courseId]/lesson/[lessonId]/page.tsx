'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentLayout } from '@/components/student/StudentLayout';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { LessonSidebar } from '@/components/video/LessonSidebar';
import { VideoTabs } from '@/components/video/VideoTabs';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { videoAnalyticsService } from '@/lib/videoAnalyticsService';
import { notesService } from '@/lib/notesService';
import { qaService } from '@/lib/qaService';
import { discussionService } from '@/lib/discussionService';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

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
  signedUrl?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: Lesson[];
}

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { isStudent } = useRoleBasedAccess();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCourse: Course = {
      id: courseId,
      title: 'Business Model Canvas Masterclass',
      description: 'Learn how to create and validate your business model canvas',
      instructor: 'John Doe',
      totalLessons: 8,
      completedLessons: 3,
      progress: 37.5,
      lessons: [
        {
          id: '1',
          title: 'Introduction to Business Model Canvas',
          description: 'Understanding the nine building blocks of a business model',
          type: 'video',
          duration: 1200,
          isCompleted: true,
          isLocked: false,
          videoUrl: 'https://example.com/video1.mp4',
          signedUrl: 'https://d1234567890.cloudfront.net/videos/intro-bmc.mp4?signature=abc123',
          order: 1
        },
        {
          id: '2',
          title: 'Value Proposition Design',
          description: 'How to create compelling value propositions for your customers',
          type: 'video',
          duration: 1800,
          isCompleted: true,
          isLocked: false,
          videoUrl: 'https://example.com/video2.mp4',
          signedUrl: 'https://d1234567890.cloudfront.net/videos/value-prop.mp4?signature=def456',
          order: 2
        },
        {
          id: '3',
          title: 'Customer Segments Analysis',
          description: 'Identifying and analyzing your target customer segments',
          type: 'video',
          duration: 1500,
          isCompleted: true,
          isLocked: false,
          videoUrl: 'https://example.com/video3.mp4',
          signedUrl: 'https://d1234567890.cloudfront.net/videos/customer-segments.mp4?signature=ghi789',
          order: 3
        },
        {
          id: '4',
          title: 'Revenue Streams and Pricing',
          description: 'Designing sustainable revenue streams and pricing strategies',
          type: 'video',
          duration: 2100,
          isCompleted: false,
          isLocked: false,
          videoUrl: 'https://example.com/video4.mp4',
          signedUrl: 'https://d1234567890.cloudfront.net/videos/revenue-streams.mp4?signature=jkl012',
          order: 4
        },
        {
          id: '5',
          title: 'Key Partnerships and Resources',
          description: 'Building strategic partnerships and managing key resources',
          type: 'video',
          duration: 1650,
          isCompleted: false,
          isLocked: false,
          videoUrl: 'https://example.com/video5.mp4',
          signedUrl: 'https://d1234567890.cloudfront.net/videos/partnerships.mp4?signature=mno345',
          order: 5
        },
        {
          id: '6',
          title: 'Business Model Canvas Quiz',
          description: 'Test your understanding of the business model canvas',
          type: 'quiz',
          duration: 600,
          isCompleted: false,
          isLocked: false,
          quizId: 'quiz1',
          order: 6
        },
        {
          id: '7',
          title: 'Assignment: Create Your BMC',
          description: 'Create your own business model canvas for your startup idea',
          type: 'assignment',
          duration: 0,
          isCompleted: false,
          isLocked: false,
          assignmentId: 'assignment1',
          order: 7
        },
        {
          id: '8',
          title: 'Advanced BMC Strategies',
          description: 'Advanced techniques for business model innovation',
          type: 'video',
          duration: 2400,
          isCompleted: false,
          isLocked: true,
          videoUrl: 'https://example.com/video8.mp4',
          order: 8
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setCourse(mockCourse);
      const lesson = mockCourse.lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
      } else {
        setError('Lesson not found');
      }
      setLoading(false);
    }, 1000);
  }, [courseId, lessonId]);

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    
    setCurrentLesson(lesson);
    setVideoLoading(true);
    setCurrentTime(0);
    
    // Navigate to the selected lesson
    router.push(`/student/courses/${courseId}/lesson/${lesson.id}`);
  };

  const handleVideoTimeUpdate = async (time: number) => {
    setCurrentTime(time);
    
    // Auto-mark lesson as completed when 80% is watched
    if (currentLesson && !currentLesson.isCompleted && time > currentLesson.duration * 0.8) {
      try {
        await videoAnalyticsService.markLessonComplete(user?.id || '', currentLesson.id);
        console.log('Lesson completed:', currentLesson.id);
      } catch (error) {
        console.error('Error marking lesson complete:', error);
      }
    }
  };

  const handleVideoStart = async () => {
    if (currentLesson && user?.id) {
      try {
        await videoAnalyticsService.trackVideoStart({
          studentId: user.id,
          lessonId: currentLesson.id,
          eventType: 'START',
          timestamp: Date.now(),
          position: currentTime
        });
        console.log('Video started:', currentLesson.id);
      } catch (error) {
        console.error('Error tracking video start:', error);
      }
    }
  };

  const handleVideoEnd = async () => {
    if (currentLesson && user?.id) {
      try {
        await videoAnalyticsService.trackVideoEnd({
          studentId: user.id,
          lessonId: currentLesson.id,
          eventType: 'END',
          timestamp: Date.now(),
          position: currentTime,
          duration: currentLesson.duration
        });
        console.log('Video ended:', currentLesson.id);
      } catch (error) {
        console.error('Error tracking video end:', error);
      }
    }
  };

  const handleNoteAdd = async (note: any) => {
    if (currentLesson && user?.id) {
      try {
        await notesService.createNote({
          studentId: user.id,
          lessonId: currentLesson.id,
          content: note.content,
          timestamp: note.timestamp
        });
        console.log('Note added:', note);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleQuestionAdd = async (question: any) => {
    if (currentLesson && user?.id) {
      try {
        await qaService.createQuestion({
          studentId: user.id,
          lessonId: currentLesson.id,
          question: question.question
        });
        console.log('Question added:', question);
      } catch (error) {
        console.error('Error saving question:', error);
      }
    }
  };

  const handleDiscussionAdd = async (discussion: any) => {
    if (currentLesson && user?.id) {
      try {
        await discussionService.createDiscussion({
          studentId: user.id,
          lessonId: currentLesson.id,
          title: discussion.title,
          content: discussion.content
        });
        console.log('Discussion added:', discussion);
      } catch (error) {
        console.error('Error saving discussion:', error);
      }
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  };

  const navigateToLesson = (lesson: Lesson | null) => {
    if (!lesson || lesson.isLocked) return;
    handleLessonSelect(lesson);
  };

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this content.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <StudentLayout>
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Course or lesson not found'}</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-1/4">
          <LessonSidebar
            lessons={course.lessons}
            currentLessonId={currentLesson.id}
            onLessonSelect={handleLessonSelect}
            courseTitle={course.title}
            className="h-full"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Lesson {currentLesson.order}: {currentLesson.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{course.completedLessons}</span> / {course.totalLessons} lessons completed
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <VideoPlayer
                videoUrl={currentLesson.signedUrl || currentLesson.videoUrl || ''}
                title={currentLesson.title}
                duration={currentLesson.duration}
                onTimeUpdate={handleVideoTimeUpdate}
                onVideoStart={handleVideoStart}
                onVideoEnd={handleVideoEnd}
                className="w-full h-96"
                autoPlay={false}
                showControls={true}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToLesson(getPreviousLesson())}
                disabled={!getPreviousLesson()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Previous Lesson</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{currentLesson.duration > 0 ? Math.floor(currentLesson.duration / 60) : 0}</span> min
                </div>
                {currentLesson.isCompleted && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateToLesson(getNextLesson())}
                disabled={!getNextLesson()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next Lesson</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="h-96">
            <VideoTabs
              lessonId={currentLesson.id}
              currentTime={currentTime}
              onNoteAdd={handleNoteAdd}
              onQuestionAdd={handleQuestionAdd}
              onDiscussionAdd={handleDiscussionAdd}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
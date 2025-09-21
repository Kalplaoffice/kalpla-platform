'use client';

import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { 
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon
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
  signedUrl?: string;
  order: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  maxGrade: number;
  type: 'file' | 'text' | 'link';
}

interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  letterGrade: string;
  completedAt: string;
  ksmpPhase?: number;
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
  assignments: Assignment[];
  grades: Grade[];
}

interface MobileLMSCourseViewProps {
  courseId: string;
  className?: string;
}

export function MobileLMSCourseView({ courseId, className = '' }: MobileLMSCourseViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'qa' | 'discussions' | 'assignments' | 'grades'>('notes');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['lessons']));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - same as desktop version
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
        ],
        assignments: [
          {
            id: '1',
            title: 'Business Model Canvas Assignment',
            description: 'Create a comprehensive business model canvas for your startup idea',
            dueDate: '2024-09-30',
            status: 'submitted',
            grade: 85,
            feedback: 'Great work! Your value proposition is well-defined. Consider adding more detail to your customer segments.',
            submittedAt: '2024-09-28T10:30:00Z',
            gradedAt: '2024-09-29T14:20:00Z',
            maxGrade: 100,
            type: 'file'
          },
          {
            id: '2',
            title: 'Market Research Report',
            description: 'Conduct market research and create a detailed report',
            dueDate: '2024-10-07',
            status: 'in-progress',
            maxGrade: 100,
            type: 'file'
          }
        ],
        grades: [
          {
            id: '1',
            courseId: courseId,
            courseName: 'Business Model Canvas Masterclass',
            grade: 85,
            maxGrade: 100,
            percentage: 85,
            letterGrade: 'B+',
            completedAt: '2024-09-29T14:20:00Z'
          },
          {
            id: '2',
            courseId: 'ksmp-phase-1',
            courseName: 'KSMP Phase 1: Business Ideation',
            grade: 90,
            maxGrade: 100,
            percentage: 90,
            letterGrade: 'A-',
            completedAt: '2024-09-15T16:45:00Z',
            ksmpPhase: 1
          },
          {
            id: '3',
            courseId: 'ksmp-phase-2',
            courseName: 'KSMP Phase 2: Market Research',
            grade: 80,
            maxGrade: 100,
            percentage: 80,
            letterGrade: 'B',
            completedAt: '2024-09-22T11:30:00Z',
            ksmpPhase: 2
          }
        ]
      };

      setCourse(mockCourse);
      setCurrentLesson(mockCourse.lessons[0]);
    } catch (err) {
      setError('Failed to load course data');
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setCurrentLesson(lesson);
    setShowSidebar(false);
  };

  const handleVideoTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'submitted':
        return 'text-blue-600';
      case 'in-progress':
        return 'text-yellow-600';
      case 'graded':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'submitted':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'graded':
        return <CheckCircleIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-4 w-4" />;
      case 'document':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'quiz':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'assignment':
        return <ClipboardDocumentListIcon className="h-4 w-4" />;
      default:
        return <PlayIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`text-center ${className}`}>
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600">{error || 'Course not found'}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h1>
              <p className="text-sm text-gray-600">
                {currentLesson ? `Lesson ${currentLesson.order}` : 'Select a lesson'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {course.completedLessons}/{course.totalLessons}
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {course.progress}% complete
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Lessons List */}
              <div>
                <button
                  onClick={() => toggleSection('lessons')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
                >
                  <span>Lessons</span>
                  {expandedSections.has('lessons') ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.has('lessons') && (
                  <div className="space-y-2">
                    {course.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        disabled={lesson.isLocked}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          currentLesson?.id === lesson.id
                            ? 'bg-blue-50 border border-blue-200'
                            : lesson.isLocked
                            ? 'bg-gray-50 cursor-not-allowed'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {lesson.isLocked ? (
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                            ) : lesson.isCompleted ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="text-blue-600">
                                {getLessonIcon(lesson.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {lesson.title}
                              </h4>
                              {lesson.duration > 0 && (
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatTime(lesson.duration)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {lesson.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignments */}
              <div>
                <button
                  onClick={() => toggleSection('assignments')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
                >
                  <span>Assignments</span>
                  {expandedSections.has('assignments') ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.has('assignments') && (
                  <div className="space-y-2">
                    {course.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {assignment.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Due: {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {getStatusIcon(assignment.status)}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('-', ' ')}
                          </span>
                          {assignment.grade && (
                            <span className="text-xs text-gray-600 ml-2">
                              Grade: {assignment.grade}/{assignment.maxGrade}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grades */}
              <div>
                <button
                  onClick={() => toggleSection('grades')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
                >
                  <span>Grades / Transcript</span>
                  {expandedSections.has('grades') ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.has('grades') && (
                  <div className="space-y-2">
                    {course.grades.map((grade) => (
                      <div
                        key={grade.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {grade.courseName}
                            </h4>
                            {grade.ksmpPhase && (
                              <p className="text-xs text-gray-600">
                                KSMP Phase {grade.ksmpPhase}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {grade.grade}/{grade.maxGrade}
                            </div>
                            <div className="text-xs text-gray-600">
                              {grade.letterGrade}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
            {currentLesson && currentLesson.type === 'video' ? (
              <VideoPlayer
                videoUrl={currentLesson.signedUrl || currentLesson.videoUrl || ''}
                title={currentLesson.title}
                duration={currentLesson.duration}
                onTimeUpdate={handleVideoTimeUpdate}
                className="w-full h-full"
                autoPlay={false}
                showControls={true}
              />
            ) : currentLesson ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-4">
                    {getLessonIcon(currentLesson.type)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {currentLesson.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {currentLesson.description}
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {currentLesson.type === 'quiz' ? 'Start Quiz' : 
                     currentLesson.type === 'assignment' ? 'View Assignment' : 
                     'Open Document'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a lesson to begin
                  </h3>
                  <p className="text-gray-600">
                    Choose a lesson from the sidebar to start learning
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="bg-white border-t border-gray-200">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
              { id: 'qa', label: 'Q&A', icon: QuestionMarkCircleIcon },
              { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon },
              { id: 'assignments', label: 'Assignments', icon: ClipboardDocumentListIcon },
              { id: 'grades', label: 'Grades', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 h-64 overflow-y-auto">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Add Note</h3>
                  <textarea
                    placeholder="Add a note at the current timestamp..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      Current time: {formatTime(currentTime)}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Add Note
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-900">This is an important concept about business model canvas</p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      <span>2:00</span>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Due: {formatDate(assignment.dueDate)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {getStatusIcon(assignment.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('-', ' ')}
                      </span>
                      {assignment.grade && (
                        <span className="text-sm text-gray-600">
                          Grade: {assignment.grade}/{assignment.maxGrade}
                        </span>
                      )}
                    </div>

                    {assignment.status === 'in-progress' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Submission
                          </label>
                          <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Submit Assignment
                        </button>
                      </div>
                    )}

                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Feedback</h4>
                        <p className="text-sm text-gray-700">{assignment.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="space-y-4">
                {course.grades.map((grade) => (
                  <div key={grade.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{grade.courseName}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {grade.grade}/{grade.maxGrade}
                        </div>
                        <div className="text-sm text-gray-600">
                          {grade.letterGrade}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${grade.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{grade.percentage}%</span>
                      <span>{formatDate(grade.completedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

# 📚 Curriculum Builder System Guide

## Overview

Kalpla now features a comprehensive **curriculum builder system** with drag-and-drop functionality, multiple content types (video, PDF, quiz), and advanced lesson management capabilities. The system allows instructors to create structured learning paths and students to engage with interactive content.

## 🏗️ System Architecture

### Core Components

1. **Curriculum Builder** - Drag-and-drop lesson management interface
2. **Lesson Types** - Video, PDF, and interactive quiz support
3. **Quiz Builder** - Advanced quiz creation with multiple question types
4. **Lesson Viewer** - Student-facing lesson consumption interface
5. **Curriculum Service** - Backend API for curriculum management

### User Flow

```
Instructor: Course → Curriculum Builder → Add Lessons → Drag & Drop Reorder → Publish
Student: Course → Lesson Navigation → Content Consumption → Progress Tracking
```

## 🎯 Curriculum Builder Features

### 📝 Drag-and-Drop Interface (`/instructor/courses/[courseId]/curriculum`)

**Core Functionality:**
- ✅ **Drag-and-Drop Reordering** - Intuitive lesson reordering with visual feedback
- ✅ **Lesson Type Support** - Video, PDF, and Quiz content types
- ✅ **Real-time Updates** - Instant order changes with backend synchronization
- ✅ **Visual Feedback** - Drag states, hover effects, and progress indicators
- ✅ **Keyboard Navigation** - Full keyboard accessibility support

**Lesson Management:**
- ✅ **Add Lessons** - Quick lesson creation with type selection
- ✅ **Edit Lessons** - Comprehensive lesson editing interface
- ✅ **Delete Lessons** - Safe lesson removal with confirmation
- ✅ **Visibility Toggle** - Show/hide lessons from students
- ✅ **Preview Mode** - Mark lessons as preview content

**Interface Features:**
- ✅ **Progress Tracking** - Visual progress indicators and statistics
- ✅ **Duration Calculation** - Automatic total course duration
- ✅ **Status Management** - Published, draft, and archived states
- ✅ **Responsive Design** - Optimized for all device sizes

### 🔧 Technical Implementation

**Drag-and-Drop System:**
- **Library**: `@dnd-kit/core` and `@dnd-kit/sortable`
- **Sensors**: Pointer and keyboard sensors for accessibility
- **Collision Detection**: `closestCenter` for smooth interactions
- **Strategy**: `verticalListSortingStrategy` for list-based sorting
- **Visual Feedback**: CSS transforms and opacity changes during drag

**State Management:**
- **Local State**: React hooks for form data and UI state
- **Backend Sync**: Real-time order updates to curriculum service
- **Error Handling**: Graceful handling of drag failures
- **Optimistic Updates**: Immediate UI updates with backend confirmation

## 📊 Content Types

### 🎥 Video Lessons

**Features:**
- ✅ **File Upload** - Direct video file upload to S3
- ✅ **Progress Tracking** - Real-time upload progress
- ✅ **Format Support** - MP4, MOV, AVI formats
- ✅ **Size Limits** - Up to 500MB file size
- ✅ **Thumbnail Support** - Custom thumbnail images
- ✅ **Duration Display** - Automatic duration calculation

**Student Experience:**
- ✅ **Video Player** - Native HTML5 video player
- ✅ **Fullscreen Support** - Fullscreen viewing capability
- ✅ **Progress Tracking** - Automatic progress saving
- ✅ **Quality Options** - Multiple quality settings
- ✅ **Accessibility** - Keyboard controls and captions

### 📄 PDF Lessons

**Features:**
- ✅ **Document Upload** - PDF file upload to S3
- ✅ **Preview Generation** - Automatic PDF preview
- ✅ **Download Support** - Direct file download
- ✅ **Size Limits** - Up to 50MB file size
- ✅ **Security** - Secure file access controls

**Student Experience:**
- ✅ **Inline Viewer** - PDF viewer within the platform
- ✅ **Download Option** - Offline access capability
- ✅ **Search Functionality** - Text search within PDFs
- ✅ **Zoom Controls** - Zoom in/out functionality
- ✅ **Print Support** - Direct printing capability

### 🧠 Quiz Lessons

**Advanced Quiz Builder:**
- ✅ **Multiple Question Types** - Multiple choice, true/false, short answer
- ✅ **Question Management** - Add, edit, delete questions
- ✅ **Answer Options** - Dynamic option management
- ✅ **Scoring System** - Custom point values per question
- ✅ **Explanations** - Detailed answer explanations
- ✅ **Settings Panel** - Comprehensive quiz configuration

**Quiz Settings:**
- ✅ **Passing Score** - Configurable passing percentage
- ✅ **Time Limits** - Optional time constraints
- ✅ **Retake Policy** - Allow or prevent retakes
- ✅ **Answer Display** - Show/hide correct answers
- ✅ **Randomization** - Question and option randomization

**Student Experience:**
- ✅ **Interactive Interface** - Engaging quiz interface
- ✅ **Real-time Feedback** - Immediate answer validation
- ✅ **Progress Tracking** - Question-by-question progress
- ✅ **Results Display** - Detailed score and feedback
- ✅ **Retake Functionality** - Multiple attempt support

## 🔧 Quiz Builder Component

### Advanced Features (`src/components/curriculum/QuizBuilder.tsx`)

**Question Types:**
- ✅ **Multiple Choice** - 2-6 answer options with single correct answer
- ✅ **True/False** - Binary choice questions
- ✅ **Short Answer** - Text input with exact match or keyword matching

**Question Management:**
- ✅ **Dynamic Addition** - Add unlimited questions
- ✅ **Question Editing** - Edit all question properties
- ✅ **Question Deletion** - Remove questions with validation
- ✅ **Option Management** - Add/remove answer options
- ✅ **Point Assignment** - Custom points per question

**Quiz Configuration:**
- ✅ **Passing Score** - Percentage-based passing threshold
- ✅ **Time Limits** - Optional time constraints
- ✅ **Retake Policy** - Control retake availability
- ✅ **Answer Visibility** - Show/hide correct answers
- ✅ **Explanation Support** - Detailed answer explanations

**Validation & Quality:**
- ✅ **Required Fields** - Ensure all questions are complete
- ✅ **Option Validation** - Validate answer options
- ✅ **Score Validation** - Ensure valid scoring system
- ✅ **Content Validation** - Check for empty or invalid content

## 📖 Lesson Viewer Component

### Student Experience (`src/components/curriculum/LessonViewer.tsx`)

**Content Rendering:**
- ✅ **Video Player** - Full-featured video playback
- ✅ **PDF Viewer** - Inline PDF viewing and download
- ✅ **Quiz Interface** - Interactive quiz taking experience
- ✅ **Progress Tracking** - Automatic lesson completion tracking

**Quiz Functionality:**
- ✅ **Question Navigation** - Easy question navigation
- ✅ **Answer Submission** - Secure answer submission
- ✅ **Score Calculation** - Automatic scoring and feedback
- ✅ **Results Display** - Detailed results with explanations
- ✅ **Retake Support** - Multiple attempt functionality

**User Interface:**
- ✅ **Responsive Design** - Mobile-optimized interface
- ✅ **Accessibility** - Full keyboard navigation support
- ✅ **Visual Feedback** - Clear success/error indicators
- ✅ **Progress Indicators** - Visual progress tracking

## 🔧 Curriculum Service

### Backend API (`src/lib/curriculumService.ts`)

**Core Methods:**
- `getCurriculum()` - Retrieve complete course curriculum
- `createLesson()` - Create new lesson with validation
- `updateLesson()` - Update existing lesson properties
- `deleteLesson()` - Remove lesson with confirmation
- `updateLessonOrder()` - Update lesson sequence
- `uploadLessonFile()` - Handle file uploads to S3
- `createQuizLesson()` - Specialized quiz lesson creation
- `getLesson()` - Retrieve individual lesson data
- `getCurriculumStats()` - Get curriculum analytics

**File Management:**
- ✅ **S3 Integration** - Secure file storage in AWS S3
- ✅ **Progress Tracking** - Real-time upload progress
- ✅ **File Validation** - Type and size validation
- ✅ **URL Generation** - Public URLs for uploaded files
- ✅ **Error Handling** - Graceful upload failure management

**Data Validation:**
- ✅ **Required Fields** - Ensure all mandatory data is present
- ✅ **Data Types** - Validate data types and formats
- ✅ **Business Logic** - Validate lesson-specific rules
- ✅ **File Validation** - Ensure uploaded files meet requirements
- ✅ **Quiz Validation** - Validate quiz data structure

## 📊 Data Models

### Lesson Data Structure

```typescript
interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: 'video' | 'pdf' | 'quiz';
  content: string; // Video URL, PDF URL, or quiz questions
  duration?: string;
  order: number;
  isVisible: boolean;
  isPreview: boolean;
  createdAt: string;
  updatedAt?: string;
  fileUrl?: string; // For uploaded files
  quizData?: QuizData; // For quiz lessons
}
```

### Quiz Data Structure

```typescript
interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  allowRetakes: boolean;
  showCorrectAnswers: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}
```

## 🎨 User Interface Features

### Curriculum Builder Interface

**Design Features:**
- ✅ **Drag-and-Drop** - Intuitive lesson reordering
- ✅ **Visual Feedback** - Clear drag states and hover effects
- ✅ **Progress Tracking** - Real-time upload progress bars
- ✅ **Error Handling** - Clear error messages and validation
- ✅ **Responsive Layout** - Works on all device sizes

**Lesson Cards:**
- ✅ **Type Icons** - Visual indicators for lesson types
- ✅ **Status Badges** - Published, draft, preview indicators
- ✅ **Duration Display** - Lesson duration information
- ✅ **Quick Actions** - Edit, delete, visibility toggle buttons
- ✅ **Drag Handles** - Clear drag interaction points

### Student Lesson Interface

**Navigation Features:**
- ✅ **Course Sidebar** - Complete course navigation
- ✅ **Progress Tracking** - Visual completion indicators
- ✅ **Lesson Navigation** - Previous/next lesson buttons
- ✅ **Status Indicators** - Completed, locked, preview states
- ✅ **Type Icons** - Visual lesson type identification

**Content Display:**
- ✅ **Responsive Video Player** - Full-featured video playback
- ✅ **PDF Viewer** - Inline document viewing
- ✅ **Interactive Quizzes** - Engaging quiz interface
- ✅ **Progress Tracking** - Automatic completion tracking
- ✅ **Accessibility** - Full keyboard navigation support

## 🔒 Security & Validation

### Data Security
- ✅ **Input Sanitization** - All user inputs are sanitized
- ✅ **File Type Validation** - Only allowed file types accepted
- ✅ **File Size Limits** - Prevents oversized file uploads
- ✅ **S3 Security** - Secure file storage with proper permissions
- ✅ **Access Control** - Role-based lesson access

### Content Validation
- ✅ **Required Fields** - All mandatory fields validated
- ✅ **Data Types** - Proper data type validation
- ✅ **Business Rules** - Lesson-specific validation logic
- ✅ **File Validation** - Uploaded file validation
- ✅ **Quiz Validation** - Comprehensive quiz data validation

## 📈 Analytics & Monitoring

### Curriculum Analytics
- ✅ **Lesson Statistics** - Total lessons, duration, types
- ✅ **Completion Rates** - Student completion tracking
- ✅ **Engagement Metrics** - Time spent, interactions
- ✅ **Quiz Performance** - Average scores, pass rates
- ✅ **Content Usage** - Most/least accessed content

### Upload Monitoring
- ✅ **Upload Success Rates** - Track file upload success
- ✅ **Upload Times** - Monitor upload performance
- ✅ **Error Tracking** - Log upload failures
- ✅ **Storage Usage** - Monitor S3 storage consumption
- ✅ **Bandwidth Usage** - Track data transfer

## 🚀 Benefits

### For Instructors
- ✅ **Intuitive Course Building** - Drag-and-drop curriculum creation
- ✅ **Rich Content Support** - Video, PDF, and interactive quizzes
- ✅ **Flexible Organization** - Easy lesson reordering and management
- ✅ **Preview Capabilities** - Preview lessons before publishing
- ✅ **Progress Tracking** - Monitor student engagement and completion

### For Students
- ✅ **Engaging Content** - Interactive lessons with multiple formats
- ✅ **Clear Navigation** - Easy course progression tracking
- ✅ **Progress Tracking** - Visual completion indicators
- ✅ **Flexible Learning** - Self-paced learning with retake options
- ✅ **Accessibility** - Full keyboard navigation and screen reader support

### For Platform
- ✅ **Content Quality** - Structured, validated course content
- ✅ **Scalable Storage** - Efficient S3 file management
- ✅ **Performance Monitoring** - Track system performance
- ✅ **User Engagement** - Interactive content increases engagement
- ✅ **Learning Analytics** - Detailed progress and performance data

## 🔄 Future Enhancements

### Planned Features
- ✅ **Advanced Quiz Types** - Fill-in-the-blank, matching, drag-and-drop
- ✅ **Video Chapters** - Chapter markers and navigation
- ✅ **Interactive PDFs** - Annotated PDFs with comments
- ✅ **Lesson Templates** - Pre-built lesson structures
- ✅ **Bulk Operations** - Multiple lesson management
- ✅ **AI Content Suggestions** - AI-powered content recommendations

### Integration Opportunities
- ✅ **Video Streaming** - Advanced video streaming services
- ✅ **Analytics Integration** - Detailed learning analytics
- ✅ **Mobile App** - Native mobile curriculum builder
- ✅ **Collaboration Tools** - Multi-instructor course creation
- ✅ **Assessment Tools** - Advanced assessment and grading

## 🎉 Result

Kalpla now has a **comprehensive, professional curriculum builder system** that:

- ✅ **Enables drag-and-drop course creation** with intuitive lesson management
- ✅ **Supports multiple content types** including video, PDF, and interactive quizzes
- ✅ **Provides advanced quiz building** with multiple question types and settings
- ✅ **Offers seamless student experience** with engaging content consumption
- ✅ **Maintains data security** with proper validation and access control
- ✅ **Tracks learning progress** with comprehensive analytics and monitoring
- ✅ **Ensures accessibility** with full keyboard navigation and screen reader support
- ✅ **Scales efficiently** with optimized file storage and performance monitoring

**Instructors now have a powerful, user-friendly system to create structured, engaging courses with rich multimedia content!** 🚀

**Students enjoy an interactive learning experience with clear navigation, progress tracking, and engaging content formats!** 📚

The curriculum builder system is **production-ready** and provides a solid foundation for content creation, management, and consumption on the Kalpla platform.

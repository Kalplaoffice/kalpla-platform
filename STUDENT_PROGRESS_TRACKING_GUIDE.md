# Student Progress Tracking System

This document provides a comprehensive guide for the Kalpla student progress tracking system that monitors lesson completion, assignment submissions, and provides detailed analytics.

## Overview

The student progress tracking system provides:
- **Lesson Completion Tracking**: Monitor video watch time and completion status
- **Assignment Submission Tracking**: Track assignment submissions and grades
- **Progress Analytics**: Comprehensive progress metrics and insights
- **Achievement System**: Gamification with achievements and milestones
- **Bookmark System**: Personal note-taking and bookmarking
- **Streak Tracking**: Learning streak monitoring
- **Progress Dashboard**: Visual progress representation
- **Real-time Updates**: Live progress updates during learning

## Architecture

```
Frontend (React) → Student Progress Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
```

## Components

### 1. Student Progress Service (`studentProgressService.ts`)

**Location**: `src/lib/studentProgressService.ts`

**Features**:
- Progress tracking and management
- Lesson completion monitoring
- Assignment submission handling
- Achievement and milestone tracking
- Analytics and reporting
- Streak calculation
- Bookmark management

**Key Methods**:
- `getStudentProgress()`: Get progress for specific course
- `getCourseProgress()`: Get all course progress
- `getLessonProgress()`: Get lesson-specific progress
- `updateLessonProgress()`: Update lesson progress
- `completeLesson()`: Mark lesson as completed
- `submitAssignment()`: Submit assignment
- `getAssignmentSubmissions()`: Get assignment submissions
- `enrollInCourse()`: Enroll student in course
- `getStudentAnalytics()`: Get comprehensive analytics
- `calculateStreak()`: Calculate learning streaks

### 2. Student Progress Dashboard (`StudentProgressDashboard.tsx`)

**Location**: `src/components/student/StudentProgressDashboard.tsx`

**Features**:
- Overview statistics and metrics
- Course progress visualization
- Recent activity tracking
- Achievement display
- Progress charts and trends
- Time-based filtering

**Key Features**:
- **Overview Stats**: Courses, lessons, assignments, time spent
- **Course Progress**: Visual progress bars and completion rates
- **Recent Activity**: Recent submissions and lessons
- **Achievements**: Gamification elements
- **Progress Charts**: Time-based progress visualization

### 3. Lesson Progress Tracker (`LessonProgressTracker.tsx`)

**Location**: `src/components/lesson/LessonProgressTracker.tsx`

**Features**:
- Real-time progress tracking
- Bookmark management
- Completion detection
- Watch time monitoring
- Progress visualization

**Key Features**:
- **Real-time Tracking**: Live progress updates
- **Bookmark System**: Personal note-taking
- **Completion Detection**: Automatic completion detection
- **Watch Time**: Accurate time tracking
- **Progress Bar**: Visual progress representation

## Database Schema

### DynamoDB Tables

#### 1. Student Progress Table (`STUDENT_PROGRESS_TABLE`)
```json
{
  "id": "progressId",
  "studentId": "string",
  "courseId": "string",
  "courseName": "string",
  "enrollmentDate": "ISO string",
  "lastAccessedDate": "ISO string",
  "totalLessons": "number",
  "completedLessons": "number",
  "totalAssignments": "number",
  "submittedAssignments": "number",
  "totalQuizzes": "number",
  "completedQuizzes": "number",
  "totalTimeSpent": "number",
  "completionPercentage": "number",
  "currentStreak": "number",
  "longestStreak": "number",
  "averageScore": "number",
  "certificates": ["string"],
  "achievements": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "category": "completion|streak|score|participation|milestone",
      "earnedAt": "ISO string",
      "points": "number"
    }
  ],
  "milestones": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "type": "lessons_completed|assignments_submitted|time_spent|streak_days|quiz_scores",
      "target": "number",
      "current": "number",
      "achieved": "boolean",
      "achievedAt": "ISO string",
      "reward": "string"
    }
  ],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Lesson Progress Table (`LESSON_PROGRESS_TABLE`)
```json
{
  "id": "lessonProgressId",
  "studentId": "string",
  "courseId": "string",
  "lessonId": "string",
  "lessonName": "string",
  "lessonOrder": "number",
  "status": "not_started|in_progress|completed|skipped",
  "completionDate": "ISO string",
  "timeSpent": "number",
  "lastPosition": "number",
  "totalDuration": "number",
  "percentWatched": "number",
  "attempts": "number",
  "notes": ["string"],
  "bookmarks": [
    {
      "id": "string",
      "timestamp": "number",
      "title": "string",
      "note": "string",
      "createdAt": "ISO string"
    }
  ],
  "quizScores": [
    {
      "quizId": "string",
      "quizName": "string",
      "score": "number",
      "maxScore": "number",
      "attempts": "number",
      "completedAt": "ISO string",
      "timeSpent": "number"
    }
  ],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 3. Assignment Submissions Table (`ASSIGNMENT_SUBMISSIONS_TABLE`)
```json
{
  "id": "submissionId",
  "studentId": "string",
  "courseId": "string",
  "assignmentId": "string",
  "assignmentName": "string",
  "assignmentType": "essay|quiz|project|presentation|discussion|peer_review|file_upload",
  "submissionDate": "ISO string",
  "dueDate": "ISO string",
  "status": "draft|submitted|graded|returned|resubmitted",
  "score": "number",
  "maxScore": "number",
  "feedback": "string",
  "submissionContent": {
    "text": "string",
    "html": "string",
    "files": [
      {
        "fileName": "string",
        "fileSize": "number",
        "fileType": "string",
        "s3Key": "string",
        "s3Url": "string"
      }
    ],
    "links": ["string"],
    "media": [
      {
        "type": "image|video|audio",
        "url": "string",
        "thumbnail": "string",
        "duration": "number"
      }
    ]
  },
  "attachments": [
    {
      "id": "string",
      "fileName": "string",
      "fileSize": "number",
      "fileType": "string",
      "s3Key": "string",
      "s3Url": "string",
      "uploadedAt": "ISO string"
    }
  ],
  "isLate": "boolean",
  "attempts": "number",
  "gradedBy": "string",
  "gradedAt": "ISO string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 4. Course Enrollments Table (`COURSE_ENROLLMENTS_TABLE`)
```json
{
  "id": "enrollmentId",
  "studentId": "string",
  "courseId": "string",
  "courseName": "string",
  "enrollmentDate": "ISO string",
  "status": "active|completed|paused|dropped",
  "progress": "StudentProgress object",
  "certificates": ["string"],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Progress Tracking

```typescript
import { studentProgressService } from '@/lib/studentProgressService';

// Get student progress for a course
const progress = await studentProgressService.getStudentProgress(studentId, courseId);

// Get all course progress
const allProgress = await studentProgressService.getCourseProgress(studentId);

// Get lesson progress
const lessonProgress = await studentProgressService.getLessonProgress(studentId, lessonId);
```

### 2. Lesson Completion Tracking

```typescript
// Update lesson progress
const updatedProgress = await studentProgressService.updateLessonProgress({
  studentId: 'student-123',
  courseId: 'course-456',
  lessonId: 'lesson-789',
  lessonName: 'Introduction to React',
  lessonOrder: 1,
  status: 'in_progress',
  timeSpent: 25, // minutes
  lastPosition: 300, // seconds
  totalDuration: 1800, // seconds
  percentWatched: 16.7,
  attempts: 1,
  notes: [],
  bookmarks: [],
  quizScores: []
});

// Complete lesson
const completedLesson = await studentProgressService.completeLesson(
  'student-123',
  'course-456',
  'lesson-789',
  'Introduction to React',
  1,
  25 // minutes spent
);
```

### 3. Assignment Submission

```typescript
// Submit assignment
const submission = await studentProgressService.submitAssignment({
  studentId: 'student-123',
  courseId: 'course-456',
  assignmentId: 'assignment-789',
  assignmentName: 'React Component Project',
  assignmentType: 'project',
  dueDate: '2024-01-15T23:59:59Z',
  status: 'submitted',
  maxScore: 100,
  submissionContent: {
    text: 'This is my React component project...',
    files: [{
      fileName: 'project.zip',
      fileSize: 1024000,
      fileType: 'application/zip',
      s3Key: 'submissions/project.zip',
      s3Url: 'https://s3.amazonaws.com/bucket/submissions/project.zip'
    }]
  },
  attachments: []
});

// Get assignment submissions
const submissions = await studentProgressService.getAssignmentSubmissions(studentId, courseId);
```

### 4. Course Enrollment

```typescript
// Enroll in course
const enrollment = await studentProgressService.enrollInCourse(
  'student-123',
  'course-456',
  'Advanced React Development'
);
```

### 5. Analytics and Reporting

```typescript
// Get student analytics
const analytics = await studentProgressService.getStudentAnalytics(studentId);

// Get progress summary
const summary = await studentProgressService.getProgressSummary(studentId);
```

## Progress Tracking Features

### 1. Lesson Progress Tracking

#### Real-time Updates
```typescript
// Track watch time
const updateWatchTime = () => {
  if (isPlaying && currentTime > lastUpdateTime) {
    const timeDiff = currentTime - lastUpdateTime;
    if (timeDiff > 0 && timeDiff < 5) {
      const newWatchTime = totalWatchTime + timeDiff;
      setTotalWatchTime(newWatchTime);
      
      // Update progress every 30 seconds
      if (newWatchTime - lessonProgress.timeSpent >= 30) {
        updateLessonProgress(newWatchTime);
      }
    }
  }
};
```

#### Completion Detection
```typescript
// Check for completion
const checkCompletion = (percentWatched: number) => {
  if (percentWatched >= 90 && lessonProgress.status !== 'completed') {
    setShowCompletionModal(true);
  }
};
```

#### Bookmark System
```typescript
// Add bookmark
const addBookmark = async (title: string, note: string, timestamp: number) => {
  const newBookmark = {
    id: Date.now().toString(),
    timestamp,
    title,
    note,
    createdAt: new Date().toISOString()
  };

  const updatedProgress = await studentProgressService.updateLessonProgress({
    ...lessonProgress,
    bookmarks: [...lessonProgress.bookmarks, newBookmark]
  });
};
```

### 2. Assignment Tracking

#### Submission Status
- **Draft**: Work in progress
- **Submitted**: Submitted for grading
- **Graded**: Graded by instructor
- **Returned**: Returned with feedback
- **Resubmitted**: Resubmitted after feedback

#### File Attachments
```typescript
// Handle file uploads
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { s3Key, s3Url } = await response.json();
  
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    s3Key,
    s3Url
  };
};
```

### 3. Achievement System

#### Achievement Categories
- **Completion**: Course and lesson completion
- **Streak**: Learning streak achievements
- **Score**: High score achievements
- **Participation**: Engagement achievements
- **Milestone**: Progress milestones

#### Achievement Detection
```typescript
// Check for achievements
const checkAchievements = async (studentId: string, courseId: string) => {
  const progress = await studentProgressService.getStudentProgress(studentId, courseId);
  
  const achievements = [];
  
  // Course completion
  if (progress.completionPercentage === 100) {
    achievements.push({
      id: `completion_${courseId}`,
      name: 'Course Completion',
      description: 'Completed the entire course',
      icon: '🎓',
      category: 'completion',
      earnedAt: new Date().toISOString(),
      points: 100
    });
  }
  
  // Learning streak
  if (progress.currentStreak >= 7) {
    achievements.push({
      id: `streak_7_${courseId}`,
      name: 'Week Warrior',
      description: '7-day learning streak',
      icon: '🔥',
      category: 'streak',
      earnedAt: new Date().toISOString(),
      points: 50
    });
  }
  
  return achievements;
};
```

### 4. Streak Calculation

```typescript
// Calculate learning streak
const calculateStreak = (lastActivityDates: string[]) => {
  if (lastActivityDates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = lastActivityDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const nextDate = sortedDates[i + 1];

    if (i === 0) {
      tempStreak = 1;
    } else if (nextDate) {
      const daysDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);
  currentStreak = tempStreak;

  return { current: currentStreak, longest: longestStreak };
};
```

## Dashboard Features

### 1. Overview Statistics

```typescript
// Overview stats
const overviewStats = {
  totalCourses: analytics.totalCourses,
  completedCourses: analytics.completedCourses,
  totalLessons: analytics.totalLessons,
  completedLessons: analytics.completedLessons,
  totalAssignments: analytics.totalAssignments,
  submittedAssignments: analytics.submittedAssignments,
  totalTimeSpent: analytics.totalTimeSpent,
  averageScore: analytics.averageScore,
  completionRate: analytics.completionRate,
  currentStreak: analytics.currentStreak,
  longestStreak: analytics.longestStreak
};
```

### 2. Course Progress Visualization

```typescript
// Course progress display
const CourseProgressCard = ({ course }) => (
  <div className="course-progress-card">
    <div className="progress-header">
      <h3>{course.courseName}</h3>
      <span className={`completion-percentage ${getProgressColor(course.completionPercentage)}`}>
        {course.completionPercentage}%
      </span>
    </div>
    
    <div className="progress-bar">
      <div 
        className={`progress-fill ${getProgressBarColor(course.completionPercentage)}`}
        style={{ width: `${course.completionPercentage}%` }}
      />
    </div>
    
    <div className="progress-stats">
      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
      <span>{course.submittedAssignments} assignments</span>
      <span>{formatTimeSpent(course.totalTimeSpent)}</span>
    </div>
  </div>
);
```

### 3. Recent Activity

```typescript
// Recent submissions
const RecentSubmissions = ({ submissions }) => (
  <div className="recent-submissions">
    {submissions.map(submission => (
      <div key={submission.id} className="submission-item">
        <div className="submission-icon">
          {getStatusIcon(submission.status)}
        </div>
        <div className="submission-content">
          <h4>{submission.assignmentName}</h4>
          <p>{submission.score}/{submission.maxScore} • {formatDate(submission.submissionDate)}</p>
        </div>
        <div className="submission-status">
          <span className={`status-badge ${submission.status}`}>
            {submission.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);
```

## Analytics and Reporting

### 1. Progress Analytics

```typescript
// Progress analytics
interface ProgressAnalytics {
  studentId: string;
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  submittedAssignments: number;
  totalTimeSpent: number;
  averageScore: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  achievements: number;
  certificates: number;
  lastActivityDate: string;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  courseProgress: CourseProgressSummary[];
}
```

### 2. Time-based Progress

```typescript
// Weekly progress
interface WeeklyProgress {
  week: string; // YYYY-WW format
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  timeSpent: number;
  averageScore: number;
}

// Monthly progress
interface MonthlyProgress {
  month: string; // YYYY-MM format
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  timeSpent: number;
  averageScore: number;
  coursesCompleted: number;
}
```

### 3. Course Progress Summary

```typescript
// Course progress summary
interface CourseProgressSummary {
  courseId: string;
  courseName: string;
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageScore: number;
  timeSpent: number;
  lastAccessedDate: string;
}
```

## Integration with Course Player

### 1. Lesson Progress Tracker Integration

```typescript
// Integrate with course player
const CoursePlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="course-player">
      <video ref={videoRef} />
      
      <LessonProgressTracker
        studentId={studentId}
        courseId={courseId}
        lessonId={lessonId}
        lessonName={lessonName}
        lessonOrder={lessonOrder}
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onProgressUpdate={setProgress}
        onLessonComplete={handleLessonComplete}
      />
    </div>
  );
};
```

### 2. Real-time Progress Updates

```typescript
// Real-time progress updates
const useProgressTracking = (studentId: string, lessonId: string) => {
  const [progress, setProgress] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(() => {
    setIsTracking(true);
  }, []);

  const stopTracking = useCallback(() => {
    if (isTracking) {
      updateProgress();
      setIsTracking(false);
    }
  }, [isTracking]);

  const updateProgress = useCallback(async () => {
    if (!progress) return;

    const updatedProgress = await studentProgressService.updateLessonProgress({
      ...progress,
      timeSpent: totalWatchTime,
      lastPosition: currentTime,
      percentWatched: Math.round((currentTime / duration) * 100)
    });

    setProgress(updatedProgress);
  }, [progress, totalWatchTime, currentTime, duration]);

  return { progress, startTracking, stopTracking };
};
```

## Best Practices

### 1. Progress Tracking

- **Accurate Time Tracking**: Track actual watch time, not just video duration
- **Completion Thresholds**: Use 90% completion threshold for lessons
- **Real-time Updates**: Update progress every 30 seconds during playback
- **Offline Support**: Cache progress locally for offline scenarios

### 2. Assignment Management

- **File Validation**: Validate file types and sizes
- **Draft Saving**: Auto-save drafts every few minutes
- **Late Submission**: Track and flag late submissions
- **Feedback Integration**: Integrate instructor feedback

### 3. Analytics

- **Privacy Compliance**: Ensure GDPR compliance for analytics
- **Data Retention**: Implement data retention policies
- **Performance**: Optimize queries for large datasets
- **Real-time Updates**: Provide real-time analytics updates

### 4. User Experience

- **Progress Visualization**: Clear progress indicators
- **Achievement Notifications**: Notify users of new achievements
- **Streak Reminders**: Remind users to maintain streaks
- **Mobile Optimization**: Ensure mobile-friendly progress tracking

## Troubleshooting

### 1. Common Issues

**Progress Not Updating**:
- Check network connection
- Verify user permissions
- Check for JavaScript errors
- Verify API endpoints

**Assignment Submission Fails**:
- Check file size limits
- Verify file type restrictions
- Check S3 permissions
- Verify submission deadline

**Analytics Not Loading**:
- Check data availability
- Verify query permissions
- Check for data processing delays
- Verify analytics service status

### 2. Debug Tools

```typescript
// Debug progress tracking
const debugProgress = () => {
  console.log('Current progress:', lessonProgress);
  console.log('Watch time:', totalWatchTime);
  console.log('Current time:', currentTime);
  console.log('Duration:', duration);
  console.log('Is tracking:', isTracking);
};

// Debug analytics
const debugAnalytics = async () => {
  const analytics = await studentProgressService.getStudentAnalytics(studentId);
  console.log('Analytics data:', analytics);
};
```

## API Reference

### Student Progress Service

#### Methods

- `getStudentProgress(studentId, courseId)`: Get student progress
- `getCourseProgress(studentId)`: Get all course progress
- `getLessonProgress(studentId, lessonId)`: Get lesson progress
- `updateLessonProgress(progress)`: Update lesson progress
- `completeLesson(studentId, courseId, lessonId, lessonName, lessonOrder, timeSpent)`: Complete lesson
- `submitAssignment(submission)`: Submit assignment
- `getAssignmentSubmissions(studentId, courseId?)`: Get assignment submissions
- `updateAssignmentSubmission(submissionId, updates)`: Update assignment submission
- `enrollInCourse(studentId, courseId, courseName)`: Enroll in course
- `getStudentAnalytics(studentId)`: Get student analytics
- `getProgressSummary(studentId)`: Get progress summary
- `calculateCompletionPercentage(completed, total)`: Calculate completion percentage
- `formatTimeSpent(minutes)`: Format time spent
- `calculateStreak(lastActivityDates)`: Calculate streak
- `getProgressStatus(completionPercentage)`: Get progress status

### GraphQL Queries and Mutations

#### Queries

- `GET_STUDENT_PROGRESS`: Get student progress
- `GET_COURSE_PROGRESS`: Get course progress
- `GET_LESSON_PROGRESS`: Get lesson progress
- `GET_ASSIGNMENT_SUBMISSIONS`: Get assignment submissions
- `GET_STUDENT_ANALYTICS`: Get student analytics
- `GET_PROGRESS_SUMMARY`: Get progress summary

#### Mutations

- `CREATE_STUDENT_PROGRESS`: Create student progress
- `UPDATE_STUDENT_PROGRESS`: Update student progress
- `CREATE_ASSIGNMENT_SUBMISSION`: Create assignment submission
- `UPDATE_ASSIGNMENT_SUBMISSION`: Update assignment submission
- `CREATE_LESSON_COMPLETION`: Create lesson completion
- `UPDATE_LESSON_COMPLETION`: Update lesson completion
- `CREATE_COURSE_ENROLLMENT`: Create course enrollment
- `UPDATE_COURSE_ENROLLMENT`: Update course enrollment

## Future Enhancements

1. **Advanced Analytics**: Machine learning insights
2. **Predictive Analytics**: Predict completion likelihood
3. **Social Features**: Peer progress comparison
4. **Gamification**: More achievement types
5. **Mobile App**: Native mobile progress tracking
6. **Offline Support**: Offline progress tracking
7. **AI Insights**: Personalized learning recommendations
8. **Integration**: Third-party learning management systems

## Support

For issues or questions:
1. Check progress tracking configuration
2. Verify user permissions
3. Check network connectivity
4. Review error logs
5. Contact technical support

The student progress tracking system provides comprehensive monitoring of student learning progress with detailed analytics and gamification features!

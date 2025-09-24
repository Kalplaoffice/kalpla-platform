# Interactive Video Elements System

This document provides a comprehensive guide for the Kalpla interactive video elements system that enables quizzes, annotations, notes, and other interactive content within videos.

## Overview

The interactive video elements system provides:
- **Timestamped Elements**: Interactive content that appears at specific video moments
- **Multiple Element Types**: Quizzes, annotations, notes, bookmarks, highlights, polls, discussions, links, and overlays
- **Real-time Interaction**: Live interaction with video content
- **Quiz System**: Multiple question types with scoring and analytics
- **Annotation System**: Collaborative annotations with categories and styling
- **Element Management**: Tools for instructors to create and manage interactive content
- **Analytics Integration**: Tracking of user interactions and engagement

## Architecture

```
Frontend (React) → Interactive Video Service → GraphQL API Gateway
                                                      ↓
                                              Lambda Functions
                                                      ↓
                                              DynamoDB Tables
```

## Components

### 1. Interactive Video Service (`interactiveVideoService.ts`)

**Location**: `src/lib/interactiveVideoService.ts`

**Features**:
- Interactive timeline management
- Element creation, updating, and deletion
- Quiz response handling and scoring
- Annotation management
- Timeline calculations and utilities

**Key Methods**:
- `getInteractiveTimeline()`: Get timeline with all elements
- `createInteractiveElement()`: Create new interactive element
- `updateInteractiveElement()`: Update existing element
- `deleteInteractiveElement()`: Delete element
- `submitQuizResponse()`: Submit quiz answers
- `calculateQuizScore()`: Calculate quiz scores
- `getElementsAtTimestamp()`: Get elements at specific time
- `getUpcomingElements()`: Get upcoming elements

### 2. Interactive Video Player (`InteractiveVideoPlayer.tsx`)

**Location**: `src/components/video/InteractiveVideoPlayer.tsx`

**Features**:
- Real-time element rendering and interaction
- Quiz modal with multiple question types
- Annotation display and creation
- Element preview and hover effects
- Upcoming elements indicator
- Timer-based quiz functionality

**Key Features**:
- **Element Overlay**: Visual elements positioned on video
- **Quiz Interface**: Interactive quiz modals with scoring
- **Annotation System**: Display and create annotations
- **Preview System**: Hover previews for elements
- **Timer Integration**: Quiz timers and countdowns

### 3. Interactive Elements Manager (`InteractiveElementsManager.tsx`)

**Location**: `src/components/instructor/InteractiveElementsManager.tsx`

**Features**:
- Element creation and editing interface
- Quiz configuration with multiple question types
- Annotation settings and styling
- Element positioning and timing
- Bulk element management

**Key Features**:
- **Element Creation**: Form-based element creation
- **Quiz Builder**: Visual quiz question builder
- **Annotation Editor**: Rich annotation creation
- **Timeline Management**: Visual timeline editing
- **Settings Configuration**: Element behavior settings

## Element Types

### 1. Quiz Elements

**Purpose**: Test knowledge and comprehension at specific video moments

**Question Types**:
- **Multiple Choice**: Single or multiple correct answers
- **True/False**: Binary choice questions
- **Fill in the Blank**: Text input questions
- **Essay**: Open-ended text responses

**Features**:
- Time limits and scoring
- Retry options and explanations
- Random option ordering
- Immediate feedback
- Progress tracking

**Configuration**:
```typescript
interface QuizContent {
  question: string;
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options?: QuizOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  timeLimit?: number;
  allowRetry: boolean;
  showCorrectAnswer: boolean;
  randomizeOptions: boolean;
}
```

### 2. Annotation Elements

**Purpose**: Add contextual information, tips, and explanations

**Categories**:
- **Information**: General information and context
- **Warning**: Important warnings or cautions
- **Tip**: Helpful tips and suggestions
- **Important**: Critical information
- **Example**: Examples and demonstrations

**Features**:
- Categorized annotations
- Public/private visibility
- Styling and formatting
- Collaborative annotations
- Like and reply system

**Configuration**:
```typescript
interface AnnotationContent {
  text: string;
  style: AnnotationStyle;
  category: 'info' | 'warning' | 'tip' | 'important' | 'example';
  author: string;
  isPublic: boolean;
}
```

### 3. Note Elements

**Purpose**: Personal note-taking and bookmarking

**Features**:
- Personal notes
- Timestamped bookmarks
- Searchable content
- Export functionality
- Privacy controls

### 4. Highlight Elements

**Purpose**: Emphasize important content

**Features**:
- Visual highlighting
- Customizable colors
- Text selection
- Export highlights
- Share highlights

### 5. Poll Elements

**Purpose**: Gather audience feedback and opinions

**Features**:
- Multiple choice polls
- Real-time results
- Anonymous voting
- Result visualization
- Export data

### 6. Discussion Elements

**Purpose**: Facilitate community discussions

**Features**:
- Threaded discussions
- Timestamped conversations
- Moderation tools
- Notification system
- Search functionality

### 7. Link Elements

**Purpose**: Provide external resources and references

**Features**:
- External links
- Resource references
- New tab opening
- Link validation
- Click tracking

### 8. Overlay Elements

**Purpose**: Display additional content and media

**Features**:
- Image overlays
- Video overlays
- Text overlays
- Custom positioning
- Animation effects

## Database Schema

### DynamoDB Tables

#### 1. Interactive Elements Table (`INTERACTIVE_ELEMENTS_TABLE`)
```json
{
  "id": "elementId",
  "lessonId": "string",
  "type": "quiz|annotation|note|bookmark|highlight|poll|discussion|link|overlay",
  "timestamp": "number",
  "duration": "number",
  "position": {
    "x": "number (0-100)",
    "y": "number (0-100)",
    "width": "number (0-100)",
    "height": "number (0-100)"
  },
  "content": {
    "title": "string",
    "text": "string",
    "html": "string",
    "media": {
      "type": "image|video|audio",
      "url": "string",
      "thumbnail": "string"
    },
    "quiz": "QuizContent",
    "annotation": "AnnotationContent",
    "link": "LinkContent"
  },
  "settings": {
    "autoShow": "boolean",
    "autoHide": "boolean",
    "clickable": "boolean",
    "draggable": "boolean",
    "resizable": "boolean",
    "showControls": "boolean",
    "allowInteraction": "boolean",
    "pauseVideo": "boolean",
    "skipable": "boolean"
  },
  "isActive": "boolean",
  "createdAt": "ISO string",
  "updatedAt": "ISO string",
  "createdBy": "string"
}
```

#### 2. Quiz Responses Table (`QUIZ_RESPONSES_TABLE`)
```json
{
  "id": "responseId",
  "elementId": "string",
  "userId": "string",
  "lessonId": "string",
  "responses": [
    {
      "questionId": "string",
      "answer": "string|string[]",
      "isCorrect": "boolean",
      "timeSpent": "number"
    }
  ],
  "score": "number",
  "totalPoints": "number",
  "timeSpent": "number",
  "attempts": "number",
  "isCorrect": "boolean",
  "submittedAt": "ISO string",
  "createdAt": "ISO string"
}
```

#### 3. Video Annotations Table (`VIDEO_ANNOTATIONS_TABLE`)
```json
{
  "id": "annotationId",
  "lessonId": "string",
  "userId": "string",
  "elementId": "string",
  "content": "string",
  "timestamp": "number",
  "position": {
    "x": "number",
    "y": "number"
  },
  "style": {
    "backgroundColor": "string",
    "textColor": "string",
    "borderColor": "string",
    "fontSize": "number",
    "fontWeight": "string",
    "fontStyle": "string"
  },
  "category": "string",
  "isPublic": "boolean",
  "likes": "number",
  "replies": [
    {
      "id": "string",
      "annotationId": "string",
      "userId": "string",
      "content": "string",
      "createdAt": "ISO string",
      "updatedAt": "ISO string"
    }
  ],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Integration

```typescript
import { InteractiveVideoPlayer } from '@/components/video/InteractiveVideoPlayer';

function VideoPlayer() {
  return (
    <div className="relative">
      <video ref={videoRef} />
      <InteractiveVideoPlayer
        lessonId="lesson-123"
        userId="user-456"
        courseId="course-789"
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onTimeUpdate={handleSeek}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
}
```

### 2. Creating Interactive Elements

```typescript
import { interactiveVideoService } from '@/lib/interactiveVideoService';

// Create a quiz element
const quizElement = await interactiveVideoService.createInteractiveElement({
  lessonId: 'lesson-123',
  type: 'quiz',
  timestamp: 120, // 2 minutes
  duration: 30, // 30 seconds
  position: { x: 50, y: 50, width: 80, height: 60 },
  content: {
    title: 'Knowledge Check',
    quiz: {
      question: 'What is the main topic of this section?',
      questionType: 'multiple_choice',
      options: [
        { id: '1', text: 'Option A', isCorrect: false },
        { id: '2', text: 'Option B', isCorrect: true },
        { id: '3', text: 'Option C', isCorrect: false }
      ],
      correctAnswer: '2',
      explanation: 'Option B is correct because...',
      points: 10,
      timeLimit: 30,
      allowRetry: true,
      showCorrectAnswer: true,
      randomizeOptions: false
    }
  },
  settings: {
    autoShow: true,
    pauseVideo: true,
    skipable: true
  },
  isActive: true,
  createdBy: 'instructor-123'
});
```

### 3. Creating Annotations

```typescript
// Create an annotation element
const annotationElement = await interactiveVideoService.createInteractiveElement({
  lessonId: 'lesson-123',
  type: 'annotation',
  timestamp: 180, // 3 minutes
  duration: 15, // 15 seconds
  position: { x: 20, y: 30, width: 60, height: 40 },
  content: {
    title: 'Important Note',
    annotation: {
      text: 'This concept is crucial for understanding the next section.',
      style: {
        backgroundColor: '#ffffcc',
        textColor: '#000000',
        borderColor: '#ffcc00',
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal'
      },
      category: 'important',
      author: 'instructor-123',
      isPublic: true
    }
  },
  settings: {
    autoShow: true,
    clickable: true
  },
  isActive: true,
  createdBy: 'instructor-123'
});
```

### 4. Submitting Quiz Responses

```typescript
// Submit quiz response
const response = await interactiveVideoService.submitQuizResponse({
  elementId: 'quiz-element-123',
  userId: 'user-456',
  lessonId: 'lesson-123',
  responses: [{
    questionId: 'quiz-element-123',
    answer: '2',
    isCorrect: true,
    timeSpent: 15
  }],
  score: 10,
  totalPoints: 10,
  timeSpent: 15,
  attempts: 1,
  isCorrect: true
});
```

### 5. Managing Elements

```typescript
// Get interactive timeline
const timeline = await interactiveVideoService.getInteractiveTimeline('lesson-123');

// Get elements at specific timestamp
const elementsAtTime = interactiveVideoService.getElementsAtTimestamp(
  timeline.elements, 
  120
);

// Get upcoming elements
const upcomingElements = interactiveVideoService.getUpcomingElements(
  timeline.elements, 
  currentTime, 
  10
);

// Update element
const updatedElement = await interactiveVideoService.updateInteractiveElement(
  'element-123',
  { timestamp: 150, duration: 20 }
);

// Delete element
await interactiveVideoService.deleteInteractiveElement('element-123');
```

## Element Positioning

### Position System

Elements are positioned using percentage-based coordinates:

- **X Position**: 0-100% from left edge
- **Y Position**: 0-100% from top edge
- **Width**: 0-100% of video width
- **Height**: 0-100% of video height

### Positioning Examples

```typescript
// Top-left corner
position: { x: 10, y: 10, width: 30, height: 20 }

// Center of video
position: { x: 50, y: 50, width: 80, height: 60 }

// Bottom-right corner
position: { x: 70, y: 80, width: 25, height: 15 }
```

## Element Settings

### Auto Behavior

```typescript
settings: {
  autoShow: true,        // Show automatically at timestamp
  autoHide: false,       // Hide automatically after duration
  pauseVideo: true,      // Pause video when element is active
  skipable: true         // Allow user to skip the element
}
```

### Interaction Settings

```typescript
settings: {
  clickable: true,       // Element can be clicked
  draggable: false,      // Element can be dragged
  resizable: false,      // Element can be resized
  showControls: true,   // Show element controls
  allowInteraction: true // Allow user interaction
}
```

## Quiz System

### Question Types

#### Multiple Choice
```typescript
quiz: {
  question: "What is the capital of France?",
  questionType: "multiple_choice",
  options: [
    { id: "1", text: "London", isCorrect: false },
    { id: "2", text: "Paris", isCorrect: true },
    { id: "3", text: "Berlin", isCorrect: false }
  ],
  correctAnswer: "2"
}
```

#### True/False
```typescript
quiz: {
  question: "The Earth is round.",
  questionType: "true_false",
  correctAnswer: "true"
}
```

#### Fill in the Blank
```typescript
quiz: {
  question: "The capital of France is ___.",
  questionType: "fill_blank",
  correctAnswer: ["Paris"]
}
```

### Scoring System

```typescript
// Calculate quiz score
const { score, totalPoints, isCorrect } = interactiveVideoService.calculateQuizScore(
  responses,
  quizContent
);
```

## Annotation System

### Categories and Styling

```typescript
// Default annotation style
const defaultStyle = {
  backgroundColor: '#ffffcc',
  textColor: '#000000',
  borderColor: '#ffcc00',
  fontSize: 14,
  fontWeight: 'normal',
  fontStyle: 'normal'
};

// Category-specific styles
const categoryStyles = {
  info: { backgroundColor: '#e3f2fd', borderColor: '#2196f3' },
  warning: { backgroundColor: '#fff3e0', borderColor: '#ff9800' },
  tip: { backgroundColor: '#e8f5e8', borderColor: '#4caf50' },
  important: { backgroundColor: '#ffebee', borderColor: '#f44336' },
  example: { backgroundColor: '#f3e5f5', borderColor: '#9c27b0' }
};
```

## Analytics Integration

### Event Tracking

```typescript
// Track quiz interactions
videoAnalyticsService.trackEvent(userId, courseId, lessonId, 'QUIZ_START', {
  elementId: 'quiz-123',
  timestamp: currentTime
});

// Track annotation views
videoAnalyticsService.trackEvent(userId, courseId, lessonId, 'ANNOTATION_VIEW', {
  elementId: 'annotation-456',
  timestamp: currentTime
});
```

### Performance Metrics

- **Quiz Completion Rate**: Percentage of quizzes completed
- **Annotation Engagement**: Views and interactions with annotations
- **Element Interaction Time**: Time spent on each element
- **User Progress**: Progress through interactive content

## Best Practices

### Element Design

1. **Timing**: Place elements at natural break points
2. **Positioning**: Avoid overlapping elements
3. **Duration**: Set appropriate durations for elements
4. **Content**: Keep content concise and relevant
5. **Accessibility**: Ensure elements are accessible

### Quiz Design

1. **Question Clarity**: Write clear, unambiguous questions
2. **Answer Options**: Provide plausible distractors
3. **Time Limits**: Set reasonable time limits
4. **Feedback**: Provide helpful explanations
5. **Difficulty**: Match difficulty to content level

### Annotation Guidelines

1. **Relevance**: Keep annotations relevant to content
2. **Categories**: Use appropriate categories
3. **Length**: Keep annotations concise
4. **Visibility**: Consider public vs private annotations
5. **Collaboration**: Encourage collaborative annotations

## Troubleshooting

### Common Issues

1. **Elements Not Showing**:
   - Check timestamp accuracy
   - Verify element is active
   - Check positioning values
   - Verify video duration

2. **Quiz Not Working**:
   - Check question format
   - Verify answer options
   - Check time limits
   - Verify scoring logic

3. **Annotations Not Displaying**:
   - Check annotation content
   - Verify positioning
   - Check visibility settings
   - Verify user permissions

### Debug Commands

```typescript
// Check element timeline
const timeline = await interactiveVideoService.getInteractiveTimeline(lessonId);
console.log('Timeline:', timeline);

// Check elements at timestamp
const elements = interactiveVideoService.getElementsAtTimestamp(
  timeline.elements, 
  currentTime
);
console.log('Elements at time:', elements);

// Validate element position
const isValid = interactiveVideoService.validateElementPosition(position);
console.log('Position valid:', isValid);
```

## Future Enhancements

1. **Advanced Quiz Types**: Drag-and-drop, matching, sequencing
2. **Rich Media Elements**: Video overlays, interactive images
3. **Collaborative Features**: Real-time collaboration on annotations
4. **AI Integration**: Automatic quiz generation, content suggestions
5. **Advanced Analytics**: Detailed interaction analytics
6. **Mobile Optimization**: Touch-optimized interactions
7. **Accessibility**: Enhanced accessibility features
8. **Export Features**: Export interactive content

## API Reference

### Interactive Video Service

#### Methods

- `getInteractiveTimeline(lessonId)`: Get interactive timeline
- `createInteractiveElement(element)`: Create new element
- `updateInteractiveElement(elementId, updates)`: Update element
- `deleteInteractiveElement(elementId)`: Delete element
- `submitQuizResponse(response)`: Submit quiz response
- `getQuizResponses(lessonId, userId)`: Get quiz responses
- `createVideoAnnotation(annotation)`: Create annotation
- `getVideoAnnotations(lessonId, userId)`: Get annotations
- `calculateQuizScore(responses, quiz)`: Calculate quiz score
- `getElementsAtTimestamp(elements, timestamp)`: Get elements at time
- `getUpcomingElements(elements, currentTime, lookAhead)`: Get upcoming elements
- `formatTimestamp(seconds)`: Format timestamp
- `validateElementPosition(position)`: Validate position
- `getDefaultElementSettings()`: Get default settings
- `getDefaultAnnotationStyle()`: Get default style

### GraphQL Queries and Mutations

#### Queries

- `GET_INTERACTIVE_ELEMENTS`: Get interactive elements
- `GET_QUIZ_RESPONSES`: Get quiz responses
- `GET_VIDEO_ANNOTATIONS`: Get video annotations
- `GET_INTERACTIVE_TIMELINE`: Get interactive timeline

#### Mutations

- `CREATE_INTERACTIVE_ELEMENT`: Create interactive element
- `UPDATE_INTERACTIVE_ELEMENT`: Update interactive element
- `DELETE_INTERACTIVE_ELEMENT`: Delete interactive element
- `SUBMIT_QUIZ_RESPONSE`: Submit quiz response
- `CREATE_VIDEO_ANNOTATION`: Create video annotation
- `UPDATE_VIDEO_ANNOTATION`: Update video annotation
- `DELETE_VIDEO_ANNOTATION`: Delete video annotation

## Support

For issues or questions:
1. Check element configuration
2. Verify timestamp accuracy
3. Check positioning values
4. Review element settings
5. Contact development team

The interactive video elements system provides comprehensive tools for creating engaging, interactive video content with quizzes, annotations, and other interactive elements.

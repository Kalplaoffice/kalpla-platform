# 🎓 Kalpla Course Creation Interface Documentation

## Overview

The Kalpla Course Creation Interface is a comprehensive, instructor-facing tool for building and publishing courses. Built with React, TypeScript, and AWS Amplify, it provides an intuitive drag-and-drop interface for course creation, lesson management, and content organization.

## 🏗️ Architecture

### High-Level Flow

```
Instructor Login → Course Builder → Create Course Structure → Add Content → Preview → Submit for Review → Admin Approval → Publish
```

### Component Hierarchy

```
CourseBuilder (Main Container)
├── CourseSectionEditor (Section Management)
├── LessonEditor (Lesson Management)
│   ├── VideoUploader (Video Content)
│   └── ResourceManager (Additional Resources)
├── CoursePreview (Student View Preview)
└── DragDropContext (react-beautiful-dnd)
```

## 🚀 Features Implemented

### 1. Drag-and-Drop Course Builder
- **Visual Course Structure**: Create sections and lessons with intuitive drag-and-drop
- **Real-time Reordering**: Reorder sections and lessons within sections
- **Cross-section Lesson Movement**: Move lessons between sections
- **Auto-save Functionality**: Automatic saving of course structure changes

### 2. Lesson Management System
- **Comprehensive Lesson Editor**: Title, description, duration, and metadata
- **Video Upload Integration**: Seamless integration with video processing pipeline
- **Resource Management**: Add PDFs, documents, external links, and YouTube videos
- **Preview Settings**: Mark lessons as preview content for students

### 3. Content Organization Features
- **Section-based Structure**: Organize lessons into logical sections/modules
- **Metadata Management**: Category, difficulty, prerequisites, learning outcomes
- **Version Control**: Track course versions and changes
- **Draft Management**: Save drafts and resume editing later

### 4. Review & Publish Workflow
- **Status Workflow**: Draft → Pending Review → Approved → Published
- **Admin Review System**: Comprehensive admin interface for course approval
- **Review Notes**: Add feedback and notes during review process
- **Rejection Handling**: Detailed rejection reasons and feedback

### 5. Preview Mode
- **Student View**: See exactly how students will experience the course
- **Interactive Preview**: Test all interactive elements and resources
- **Responsive Design**: Preview across different device sizes
- **Content Validation**: Ensure all content is properly formatted

## 📁 File Structure

### Core Components
```
src/components/course/
├── CourseBuilder.tsx              # Main course builder interface
├── CourseSectionEditor.tsx        # Section creation and editing
├── LessonEditor.tsx               # Lesson creation and editing
├── CoursePreview.tsx              # Student-facing preview
└── CourseService.ts               # API service layer
```

### Pages
```
src/app/instructor/course-builder/
├── page.tsx                       # Course builder landing page
└── [courseId]/page.tsx            # Dynamic course editing page

src/app/admin/course-review/
└── page.tsx                       # Admin course review interface
```

### GraphQL Schema Updates
```
amplify/backend/api/kalpla/schema.graphql
├── Course (enhanced with sections)
├── CourseSection (new model)
├── Lesson (updated with section relationship)
└── Course Creation mutations
```

## 🔧 Implementation Details

### 1. Drag-and-Drop Implementation

#### React Beautiful DnD Setup
```typescript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const handleDragEnd = async (result: any) => {
  const { source, destination, type } = result;
  
  if (type === 'SECTION') {
    // Reorder sections
    await updateCourseSections(reorderedSections);
  } else if (type === 'LESSON') {
    // Reorder or move lessons
    if (sourceSectionId === destSectionId) {
      await updateSectionLessons(sectionId, reorderedLessons);
    } else {
      await moveLessonBetweenSections(sourceSectionId, destSectionId, lesson);
    }
  }
};
```

#### Section Reordering
```typescript
const updateCourseSections = async (sections: CourseSection[]) => {
  const updatedSections = sections.map((section, index) => ({
    ...section,
    order: index + 1
  }));
  
  await courseService.updateCourseStructure(course.id, updatedSections);
};
```

### 2. Lesson Management

#### Lesson Creation Flow
```typescript
const addLesson = async (sectionId: string, lessonData: Partial<Lesson>) => {
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
  
  await courseService.createLesson(sectionId, newLesson);
};
```

#### Video Upload Integration
```typescript
<VideoUploader
  lessonId={lesson?.id || 'new-lesson'}
  onUploadComplete={(videoKey) => {
    // Handle video upload completion
    updateLesson(lessonId, { videoUrl: videoKey });
  }}
  onUploadError={(error) => {
    // Handle upload error
    setError(error);
  }}
/>
```

### 3. Content Organization

#### Section Management
```typescript
interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  isPreview: boolean;
  lessons: Lesson[];
}
```

#### Metadata Management
```typescript
interface Course {
  // Basic Info
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Learning Details
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  
  // Pricing
  price: number;
  currency: string;
  
  // Publishing
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  version: number;
}
```

### 4. Review & Publish Workflow

#### Status Transitions
```typescript
const submitForReview = async () => {
  const updatedCourse = await courseService.submitCourseForReview(course.id);
  setCourse(updatedCourse);
};

const approveCourse = async (courseId: string, reviewNotes?: string) => {
  const updatedCourse = await courseService.approveCourse(courseId, reviewNotes);
  return updatedCourse;
};

const rejectCourse = async (courseId: string, rejectionReason: string) => {
  const updatedCourse = await courseService.rejectCourse(courseId, rejectionReason);
  return updatedCourse;
};
```

#### Admin Review Interface
```typescript
const handleApproveCourse = async (courseId: string) => {
  const updatedCourse = await courseService.approveCourse(courseId, reviewNotes);
  setCourses(courses.map(course => 
    course.id === courseId ? updatedCourse : course
  ));
};
```

### 5. Preview Mode

#### Student View Simulation
```typescript
const CoursePreview = ({ course }: { course: Course }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
      </div>
      
      {/* Course Content */}
      <div className="space-y-4">
        {course.sections.map((section) => (
          <SectionPreview 
            key={section.id} 
            section={section} 
            expanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

## 🎯 Usage Examples

### 1. Creating a New Course
```typescript
import { CourseBuilder } from '@/components/course/CourseBuilder';

function InstructorDashboard() {
  const [course, setCourse] = useState(null);
  
  return (
    <div>
      <button onClick={createNewCourse}>
        Create New Course
      </button>
      
      {course && (
        <CourseBuilder 
          courseId={course.id}
          onCourseUpdate={setCourse}
        />
      )}
    </div>
  );
}
```

### 2. Adding a Section
```typescript
const addSection = async (sectionData: Partial<CourseSection>) => {
  const newSection: CourseSection = {
    id: `section_${Date.now()}`,
    title: sectionData.title || 'New Section',
    description: sectionData.description || '',
    order: course.sections.length + 1,
    duration: 0,
    isPreview: sectionData.isPreview || false,
    lessons: []
  };
  
  await courseService.createCourseSection(newSection);
};
```

### 3. Adding a Lesson
```typescript
const addLesson = async (sectionId: string, lessonData: Partial<Lesson>) => {
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
  
  await courseService.createLesson(sectionId, newLesson);
};
```

### 4. Admin Review Process
```typescript
const handleApproveCourse = async (courseId: string) => {
  try {
    setActionLoading(courseId);
    const updatedCourse = await courseService.approveCourse(courseId, reviewNotes);
    
    setCourses(courses.map(course => 
      course.id === courseId ? updatedCourse : course
    ));
    
    setSelectedCourse(null);
    setReviewNotes('');
  } catch (err) {
    setError(err.message);
  } finally {
    setActionLoading(null);
  }
};
```

## 🔒 Security & Access Control

### 1. Role-based Access
```typescript
// Instructor access
if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
  return <AccessDenied />;
}

// Admin access
if (user.role !== 'ADMIN') {
  return <AccessDenied />;
}
```

### 2. Course Ownership
```typescript
// Verify instructor owns the course
const course = await courseService.getCourse(courseId);
if (course.instructorId !== user.id && user.role !== 'ADMIN') {
  throw new Error('Access denied');
}
```

### 3. Status-based Permissions
```typescript
// Only allow editing of draft courses
if (course.status !== 'DRAFT') {
  return <ReadOnlyMode />;
}
```

## 📊 Database Schema

### Course Model
```graphql
type Course @model @auth(rules: [
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] },
  { allow: owner, operations: [read, update] },
  { allow: public, operations: [read] }
]) {
  id: ID!
  title: String!
  description: String!
  instructorId: ID! @index(name: "byInstructor")
  instructor: User! @belongsTo(fields: ["instructorId"])
  
  # Course Structure
  sections: [CourseSection!] @hasMany(indexName: "byCourse", fields: ["id"])
  
  # Course details
  category: String!
  subcategory: String
  difficulty: String!
  language: String!
  prerequisites: [String]
  
  # Content
  thumbnail: String
  videoUrl: String
  resources: [String]
  
  # Pricing
  price: Float!
  currency: String!
  
  # Course Creation & Publishing
  version: Int!
  publishedAt: AWSDateTime
  reviewedBy: ID
  reviewNotes: String
  rejectionReason: String
  
  # Status and metadata
  status: CourseStatus!
  approvalDate: AWSDateTime
  publishedDate: AWSDateTime
  
  # Learning Outcomes
  learningOutcomes: [String!]
  
  # Statistics
  enrollmentCount: Int!
  rating: Float!
  reviewCount: Int!
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### CourseSection Model
```graphql
type CourseSection @model @auth(rules: [
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] },
  { allow: owner, operations: [read, update] }
]) {
  id: ID!
  courseId: ID! @index(name: "byCourse")
  course: Course! @belongsTo(fields: ["courseId"])
  
  title: String!
  description: String
  order: Int!
  
  # Section Content
  lessons: [Lesson!] @hasMany(indexName: "bySection", fields: ["id"])
  
  # Metadata
  duration: Int!
  isPreview: Boolean!
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### Lesson Model (Enhanced)
```graphql
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] },
  { allow: owner, operations: [read, update] },
  { allow: public, operations: [read] }
]) {
  id: ID!
  courseId: ID! @index(name: "byCourse")
  course: Course! @belongsTo(fields: ["courseId"])
  sectionId: ID! @index(name: "bySection")
  section: CourseSection! @belongsTo(fields: ["sectionId"])
  
  title: String!
  description: String!
  order: Int!
  duration: Int!
  
  # Video Content
  videoUrl: String
  hlsUrl: String
  thumbnailUrl: String
  captionsUrl: String
  
  # Video Processing Status
  processingStatus: VideoProcessingStatus!
  processingJobId: String
  
  # Interactive Elements
  interactiveTimeline: [InteractiveElement]
  
  # Resources
  resources: [String]
  transcript: String
  
  # Access control
  isPreview: Boolean!
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

## 🚀 Deployment & Configuration

### 1. Required Dependencies
```json
{
  "dependencies": {
    "react-beautiful-dnd": "^13.1.1",
    "@aws-amplify/ui-react": "^5.0.0",
    "aws-amplify": "^5.0.0"
  }
}
```

### 2. Environment Variables
```bash
# AWS Amplify
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AMPLIFY_PROJECT_ID=your-project-id

# Video Processing
NEXT_PUBLIC_VIDEO_BUCKET=kalpla-video-uploads
NEXT_PUBLIC_HLS_BUCKET=kalpla-hls-output
```

### 3. IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "appsync:GraphQL",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🧪 Testing

### 1. Unit Tests
```typescript
describe('CourseBuilder', () => {
  it('should create a new course', async () => {
    const courseData = {
      title: 'Test Course',
      description: 'Test Description',
      category: 'Business'
    };
    
    const course = await courseService.createCourseDraft(courseData);
    expect(course.title).toBe('Test Course');
  });
  
  it('should reorder sections', async () => {
    const sections = [
      { id: '1', order: 1, title: 'Section 1' },
      { id: '2', order: 2, title: 'Section 2' }
    ];
    
    const reordered = sections.reverse();
    await courseService.updateCourseStructure('course-1', reordered);
    
    // Verify order was updated
  });
});
```

### 2. Integration Tests
```typescript
describe('Course Creation Flow', () => {
  it('should complete full course creation workflow', async () => {
    // 1. Create course draft
    const course = await courseService.createCourseDraft(courseData);
    
    // 2. Add sections
    const section = await courseService.createCourseSection({
      courseId: course.id,
      title: 'Introduction',
      order: 1
    });
    
    // 3. Add lessons
    const lesson = await courseService.createLesson(section.id, {
      title: 'Lesson 1',
      description: 'First lesson',
      order: 1,
      duration: 30
    });
    
    // 4. Submit for review
    const submittedCourse = await courseService.submitCourseForReview(course.id);
    expect(submittedCourse.status).toBe('PENDING_REVIEW');
  });
});
```

### 3. E2E Tests
```typescript
describe('Course Builder E2E', () => {
  it('should allow instructor to create and edit course', async () => {
    // Login as instructor
    await loginAsInstructor();
    
    // Navigate to course builder
    await page.goto('/instructor/course-builder');
    
    // Create new course
    await page.click('[data-testid="create-course"]');
    
    // Add section
    await page.click('[data-testid="add-section"]');
    await page.fill('[data-testid="section-title"]', 'Introduction');
    
    // Add lesson
    await page.click('[data-testid="add-lesson"]');
    await page.fill('[data-testid="lesson-title"]', 'Lesson 1');
    
    // Save draft
    await page.click('[data-testid="save-draft"]');
    
    // Verify course was created
    await expect(page.locator('[data-testid="course-status"]')).toHaveText('DRAFT');
  });
});
```

## 🔮 Future Enhancements

### 1. Advanced Features
- **Template System**: Pre-built course templates for common subjects
- **Collaborative Editing**: Multiple instructors working on the same course
- **Version History**: Track all changes and allow rollbacks
- **Bulk Operations**: Mass edit multiple lessons or sections
- **Import/Export**: Import from other platforms or export course data

### 2. AI-Powered Features
- **Content Suggestions**: AI-generated lesson titles and descriptions
- **Difficulty Assessment**: Automatic difficulty level detection
- **Prerequisite Analysis**: Suggest prerequisites based on content
- **Learning Path Optimization**: AI-recommended course structure

### 3. Advanced Analytics
- **Creation Analytics**: Track instructor productivity and course creation patterns
- **Content Performance**: Analyze which content types perform best
- **Review Metrics**: Track review times and approval rates
- **Quality Scoring**: Automated content quality assessment

### 4. Integration Enhancements
- **LMS Integration**: Connect with external learning management systems
- **Content Libraries**: Access to shared content repositories
- **Third-party Tools**: Integration with design tools, video editors
- **API Access**: RESTful API for external course creation tools

## 📞 Support & Troubleshooting

### Common Issues

#### 1. Drag-and-Drop Not Working
- **Check react-beautiful-dnd version**: Ensure compatibility with React 18+
- **Verify DragDropContext**: Ensure all draggable elements are wrapped
- **Check browser support**: Some older browsers may not support drag-and-drop

#### 2. Video Upload Issues
- **Check file size**: Ensure videos are under 2GB
- **Verify file format**: Only MP4, AVI, MOV, WMV, WebM supported
- **Check S3 permissions**: Ensure Lambda has proper S3 access

#### 3. Course Save Failures
- **Check GraphQL schema**: Ensure all required fields are provided
- **Verify user permissions**: Ensure user has instructor role
- **Check network connectivity**: Ensure stable internet connection

### Debugging Tools
- **React DevTools**: Inspect component state and props
- **GraphQL Playground**: Test queries and mutations
- **CloudWatch Logs**: Monitor Lambda function execution
- **DynamoDB Console**: Inspect database records

## 📚 Additional Resources

- [React Beautiful DnD Documentation](https://github.com/atlassian/react-beautiful-dnd)
- [AWS Amplify GraphQL Guide](https://docs.amplify.aws/cli/graphql/overview/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [React TypeScript Guide](https://react-typescript-cheatsheet.netlify.app/)

---

This comprehensive Course Creation Interface transforms Kalpla into a powerful platform for instructors to create engaging, well-structured courses. The implementation provides enterprise-grade functionality with an intuitive user experience that rivals the best course creation tools in the market.

# 📊 Kalpla Analytics Dashboard Documentation

## Overview

The Kalpla Analytics Dashboard is a comprehensive analytics system that provides real-time insights into student progress, course completion metrics, and revenue analytics. Built with React, TypeScript, and AWS services, it offers role-based analytics for administrators, mentors, and instructors.

## 🏗️ Architecture

### High-Level Flow

```
Student Activity → Data Capture → Real-time Processing → Analytics Storage → Dashboard Visualization
```

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Video Player  │───▶│   Progress API   │───▶│   DynamoDB      │───▶│   Analytics     │
│   Assignments   │    │   (GraphQL)      │    │   Streams       │    │   Dashboard     │
│   Payments      │    │                  │    │                 │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Lambda         │    │   CloudWatch    │
                       │   Processor      │    │   Events        │
                       └──────────────────┘    └─────────────────┘
```

## 🚀 Features Implemented

### 1. Student Progress Tracking
- **Real-time Progress Updates**: Track video watch time, completion percentage, and engagement
- **Assignment Tracking**: Monitor submission status and grading progress
- **KSMP Phase Progress**: Track startup mentorship program phase completion
- **Device & Session Analytics**: Capture device type and session information

### 2. Course Completion Metrics
- **Completion Rate Analysis**: Calculate average completion rates per course
- **Drop-off Point Detection**: Identify lessons where students most commonly stop
- **Engagement Metrics**: Track time spent, video views, and interaction patterns
- **Cohort Performance**: Monitor KSMP cohort progress and success rates

### 3. Revenue & Enrollment Analytics
- **Transaction Tracking**: Monitor PayU payment success/failure rates
- **Revenue Trends**: Daily, weekly, and monthly revenue analysis
- **Enrollment Patterns**: Track enrollment trends and peak periods
- **Course Performance**: Revenue per course and student lifetime value

### 4. Role-Based Dashboards
- **Admin Dashboard**: Comprehensive platform analytics and oversight
- **Mentor Dashboard**: Student progress tracking and KSMP analytics
- **Instructor Dashboard**: Course-specific performance metrics

## 📁 File Structure

### Core Components
```
src/components/analytics/
├── AnalyticsDashboard.tsx          # Main analytics dashboard
├── StudentProgressTracker.tsx      # Individual student progress
└── VideoAnalyticsDashboard.tsx     # Video-specific analytics

src/lib/
└── analyticsService.ts             # Analytics API service

src/app/
├── admin/analytics/page.tsx         # Admin analytics page
└── mentor/analytics/page.tsx       # Mentor analytics page
```

### Backend Components
```
amplify/backend/function/analyticsProcessor/
├── src/index.js                     # Lambda function for data processing
├── src/package.json                 # Dependencies
└── analyticsProcessor-cloudformation-template.json
```

### GraphQL Schema Updates
```
amplify/backend/api/kalpla/schema.graphql
├── StudentProgress (model)
├── CourseMetrics (model)
├── RevenueAnalytics (model)
├── StudentAnalytics (model)
└── Analytics queries and mutations
```

## 🔧 Implementation Details

### 1. Data Models

#### StudentProgress Model
```typescript
interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  lastPosition: number;        // seconds
  duration: number;           // total lesson duration
  percentWatched: number;     // 0-100
  completed: boolean;
  timeSpent: number;          // total time spent
  device?: string;
  sessionId?: string;
  lastWatchedAt: string;
}
```

#### CourseMetrics Model
```typescript
interface CourseMetrics {
  id: string;
  courseId: string;
  enrolledCount: number;
  completedCount: number;
  averageCompletionRate: number;
  averageTimeSpent: number;
  dropOffLessonId?: string;
  totalRevenue: number;
  averageRevenuePerStudent: number;
  lastUpdated: string;
  period: string;             // daily, weekly, monthly
}
```

#### RevenueAnalytics Model
```typescript
interface RevenueAnalytics {
  id: string;
  period: string;
  date: string;
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  topCourses: string[];
  topCoursesRevenue?: any;
  paymentMethodBreakdown?: any;
  geographicBreakdown?: any;
}
```

### 2. Real-time Data Capture

#### Video Progress Tracking
```typescript
const trackVideoProgress = async (event: {
  studentId: string;
  courseId: string;
  lessonId: string;
  currentTime: number;
  duration: number;
  eventType: 'play' | 'pause' | 'seek' | 'complete';
  device?: string;
  sessionId?: string;
}) => {
  const percentWatched = (event.currentTime / event.duration) * 100;
  const completed = event.eventType === 'complete' || percentWatched >= 90;

  await analyticsService.updateStudentProgress({
    studentId: event.studentId,
    courseId: event.courseId,
    lessonId: event.lessonId,
    lastPosition: event.currentTime,
    duration: event.duration,
    percentWatched,
    completed,
    device: event.device,
    sessionId: event.sessionId
  });
};
```

#### Assignment Submission Tracking
```typescript
const trackAssignmentSubmission = async (event: {
  studentId: string;
  courseId: string;
  assignmentId: string;
  submittedAt: string;
}) => {
  // Update student analytics
  await analyticsService.updateStudentAnalytics(event.studentId);
  
  // Update course metrics
  const metrics = await analyticsService.getCourseMetrics(event.courseId);
  if (metrics) {
    await analyticsService.updateCourseMetrics({
      ...metrics,
      lastUpdated: new Date().toISOString()
    });
  }
};
```

### 3. Data Processing Pipeline

#### Lambda Function Architecture
```javascript
exports.handler = async (event) => {
  try {
    if (event.source === 'aws.events') {
      // Scheduled processing (daily/weekly/monthly)
      await processScheduledAnalytics(event);
    } else if (event.Records) {
      // DynamoDB Stream processing (real-time)
      await processStreamEvents(event.Records);
    } else {
      // Direct invocation
      await processDirectAnalytics(event);
    }
  } catch (error) {
    console.error('Error processing analytics:', error);
  }
};
```

#### Scheduled Processing
```javascript
async function processDailyAnalytics(date) {
  const dateStr = date.toISOString().split('T')[0];
  
  // Get all courses
  const courses = await getAllCourses();
  
  // Process each course
  for (const course of courses) {
    await updateCourseMetrics(course.id, 'daily', dateStr);
  }
  
  // Update revenue analytics
  await updateRevenueAnalytics('daily', dateStr);
}
```

#### Real-time Processing
```javascript
async function processStudentProgressUpdate(newImage, oldImage) {
  const studentId = newImage.studentId.S;
  const courseId = newImage.courseId.S;
  
  // Update student analytics
  await updateStudentAnalytics(studentId);
  
  // Update course metrics
  await updateCourseMetrics(courseId, 'daily', new Date().toISOString().split('T')[0]);
}
```

### 4. Dashboard Components

#### Analytics Dashboard
```typescript
export function AnalyticsDashboard({ userRole, userId }: AnalyticsDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    const data = await analyticsService.getDashboardData(selectedPeriod);
    setDashboardData(data);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Revenue" value={formatCurrency(totalRevenue)} />
        <SummaryCard title="Total Enrollments" value={formatNumber(totalEnrollments)} />
        <SummaryCard title="Completion Rate" value={formatPercentage(averageCompletionRate)} />
        <SummaryCard title="Avg. Time Spent" value={formatDuration(averageTimeSpent)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueChartData} />
        <CompletionChart data={completionChartData} />
      </div>

      {/* Course Performance Table */}
      <CoursePerformanceTable data={courseMetrics} />
    </div>
  );
}
```

#### Student Progress Tracker
```typescript
export function StudentProgressTracker({ studentId, courseId }: StudentProgressTrackerProps) {
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useEffect(() => {
    loadStudentProgress();
  }, [studentId, courseId]);

  const loadStudentProgress = async () => {
    const progressData = await analyticsService.getStudentProgress(studentId, courseId);
    setProgress(progressData);
  };

  const getOverallProgress = () => {
    if (progress.length === 0) return 0;
    const totalPercent = progress.reduce((sum, item) => sum + item.percentWatched, 0);
    return totalPercent / progress.length;
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <ProgressSummary 
        overallProgress={getOverallProgress()}
        completedLessons={getCompletedLessons()}
        totalTimeSpent={getTotalTimeSpent()}
        lastActivity={getLastActivity()}
      />

      {/* Overall Progress Bar */}
      <ProgressBar progress={getOverallProgress()} />

      {/* Lesson Progress Details */}
      <LessonProgressDetails progress={progress} />
    </div>
  );
}
```

### 5. Chart Visualizations

#### Revenue Trend Chart
```typescript
const RevenueChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stroke="#3B82F6" 
        fill="#3B82F6" 
        fillOpacity={0.3} 
      />
    </AreaChart>
  </ResponsiveContainer>
);
```

#### Course Completion Chart
```typescript
const CompletionChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="course" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="enrolled" fill="#3B82F6" name="Enrolled" />
      <Bar dataKey="completed" fill="#10B981" name="Completed" />
    </BarChart>
  </ResponsiveContainer>
);
```

## 🎯 Usage Examples

### 1. Tracking Video Progress
```typescript
// In video player component
const handleTimeUpdate = (currentTime: number, duration: number) => {
  analyticsService.trackVideoProgress({
    studentId: user.id,
    courseId: course.id,
    lessonId: lesson.id,
    currentTime,
    duration,
    eventType: 'progress',
    device: navigator.userAgent,
    sessionId: sessionStorage.getItem('sessionId')
  });
};

const handleVideoComplete = () => {
  analyticsService.trackVideoProgress({
    studentId: user.id,
    courseId: course.id,
    lessonId: lesson.id,
    currentTime: lesson.duration,
    duration: lesson.duration,
    eventType: 'complete',
    device: navigator.userAgent,
    sessionId: sessionStorage.getItem('sessionId')
  });
};
```

### 2. Admin Dashboard Usage
```typescript
// Admin analytics page
export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'revenue'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <AnalyticsDashboard userRole="Admin" />}
        {activeTab === 'students' && <StudentProgressView />}
        {activeTab === 'courses' && <CourseAnalyticsView />}
        {activeTab === 'revenue' && <RevenueAnalyticsView />}
      </div>
    </div>
  );
}
```

### 3. Mentor Dashboard Usage
```typescript
// Mentor analytics page
export default function MentorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'ksmp'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentor Analytics</h1>
        
        {/* KSMP-specific analytics */}
        {activeTab === 'ksmp' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-2">Active Cohorts</h4>
                <div className="text-2xl font-bold text-blue-900 mb-1">3</div>
                <p className="text-sm text-blue-700">Currently mentoring</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-2">Phase Completion</h4>
                <div className="text-2xl font-bold text-green-900 mb-1">78%</div>
                <p className="text-sm text-green-700">Average completion rate</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-medium text-purple-900 mb-2">Startups Funded</h4>
                <div className="text-2xl font-bold text-purple-900 mb-1">12</div>
                <p className="text-sm text-purple-700">From your cohorts</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Real-time Analytics Processing
```javascript
// Lambda function for real-time processing
exports.handler = async (event) => {
  // Process DynamoDB stream events
  for (const record of event.Records) {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      const newImage = record.dynamodb.NewImage;
      
      // Process student progress updates
      if (record.eventSourceARN.includes('StudentProgress')) {
        await processStudentProgressUpdate(newImage);
      }
      
      // Process payment updates
      if (record.eventSourceARN.includes('Payment')) {
        await processPaymentUpdate(newImage);
      }
    }
  }
};
```

## 🔒 Security & Access Control

### 1. Role-based Access
```typescript
// Admin access
if (user.role !== 'ADMIN') {
  return <AccessDenied />;
}

// Mentor access
if (user.role !== 'MENTOR') {
  return <AccessDenied />;
}
```

### 2. Data Privacy
```typescript
// Student progress access
const getStudentProgress = async (studentId: string, courseId: string) => {
  // Verify user has access to this student's data
  if (user.role === 'STUDENT' && user.id !== studentId) {
    throw new Error('Access denied');
  }
  
  if (user.role === 'MENTOR') {
    // Verify mentor has access to this student
    const hasAccess = await verifyMentorStudentAccess(user.id, studentId);
    if (!hasAccess) {
      throw new Error('Access denied');
    }
  }
  
  return analyticsService.getStudentProgress(studentId, courseId);
};
```

### 3. Data Encryption
- All data stored in DynamoDB is encrypted at rest
- Data in transit is encrypted via HTTPS/TLS
- Sensitive analytics data is masked in logs

## 📊 Database Schema

### StudentProgress Table
```graphql
type StudentProgress @model @auth(rules: [
  { allow: owner, operations: [read, create, update] },
  { allow: groups, groups: ["Admin", "Mentor"], operations: [read] }
]) {
  id: ID!
  studentId: ID! @index(name: "byStudent")
  student: User! @belongsTo(fields: ["studentId"])
  courseId: ID! @index(name: "byCourse")
  course: Course! @belongsTo(fields: ["courseId"])
  lessonId: ID! @index(name: "byLesson")
  lesson: Lesson! @belongsTo(fields: ["lessonId"])
  
  # Progress tracking
  lastPosition: Float!
  duration: Float!
  percentWatched: Float!
  completed: Boolean!
  timeSpent: Float!
  
  # Device and session info
  device: String
  sessionId: String
  lastWatchedAt: AWSDateTime!
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### CourseMetrics Table
```graphql
type CourseMetrics @model @auth(rules: [
  { allow: groups, groups: ["Admin", "Mentor"], operations: [read, create, update] }
]) {
  id: ID!
  courseId: ID! @index(name: "byCourse")
  course: Course! @belongsTo(fields: ["courseId"])
  
  # Enrollment metrics
  enrolledCount: Int!
  completedCount: Int!
  averageCompletionRate: Float!
  
  # Engagement metrics
  averageTimeSpent: Float!
  dropOffLessonId: ID
  dropOffLesson: Lesson @belongsTo(fields: ["dropOffLessonId"])
  
  # Revenue metrics
  totalRevenue: Float!
  averageRevenuePerStudent: Float!
  
  # Time-based metrics
  lastUpdated: AWSDateTime!
  period: String!
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### RevenueAnalytics Table
```graphql
type RevenueAnalytics @model @auth(rules: [
  { allow: groups, groups: ["Admin"], operations: [read, create, update] }
]) {
  id: ID!
  
  # Time period
  period: String!
  date: AWSDate!
  
  # Revenue metrics
  totalRevenue: Float!
  totalTransactions: Int!
  successfulTransactions: Int!
  failedTransactions: Int!
  averageTransactionValue: Float!
  
  # Course performance
  topCourses: [String!]
  topCoursesRevenue: AWSJSON
  
  # Payment method breakdown
  paymentMethodBreakdown: AWSJSON
  
  # Geographic data
  geographicBreakdown: AWSJSON
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

## 🚀 Deployment & Configuration

### 1. Required Dependencies
```json
{
  "dependencies": {
    "recharts": "^2.8.0",
    "aws-amplify": "^5.0.0",
    "@aws-amplify/ui-react": "^5.0.0"
  }
}
```

### 2. Environment Variables
```bash
# Analytics Tables
COURSE_METRICS_TABLE=CourseMetrics
STUDENT_PROGRESS_TABLE=StudentProgress
REVENUE_ANALYTICS_TABLE=RevenueAnalytics
STUDENT_ANALYTICS_TABLE=StudentAnalytics

# Processing
ANALYTICS_PROCESSOR_FUNCTION=analyticsProcessor
```

### 3. IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:analyticsProcessor*"
    }
  ]
}
```

## 🧪 Testing

### 1. Unit Tests
```typescript
describe('AnalyticsService', () => {
  it('should track video progress', async () => {
    const progressData = {
      studentId: 'student-1',
      courseId: 'course-1',
      lessonId: 'lesson-1',
      lastPosition: 300,
      duration: 600,
      percentWatched: 50,
      completed: false
    };
    
    const result = await analyticsService.updateStudentProgress(progressData);
    expect(result.percentWatched).toBe(50);
  });
  
  it('should calculate course metrics', async () => {
    const metrics = await analyticsService.getCourseMetrics('course-1', 'monthly');
    expect(metrics.enrolledCount).toBeGreaterThan(0);
    expect(metrics.averageCompletionRate).toBeGreaterThanOrEqual(0);
  });
});
```

### 2. Integration Tests
```typescript
describe('Analytics Dashboard', () => {
  it('should load dashboard data', async () => {
    const dashboardData = await analyticsService.getDashboardData('monthly');
    expect(dashboardData.courseMetrics).toBeDefined();
    expect(dashboardData.revenueAnalytics).toBeDefined();
  });
  
  it('should track student progress', async () => {
    await analyticsService.trackVideoProgress({
      studentId: 'student-1',
      courseId: 'course-1',
      lessonId: 'lesson-1',
      currentTime: 300,
      duration: 600,
      eventType: 'progress'
    });
    
    const progress = await analyticsService.getStudentProgress('student-1', 'course-1');
    expect(progress.length).toBeGreaterThan(0);
  });
});
```

### 3. E2E Tests
```typescript
describe('Analytics Dashboard E2E', () => {
  it('should display analytics data', async () => {
    // Login as admin
    await loginAsAdmin();
    
    // Navigate to analytics
    await page.goto('/admin/analytics');
    
    // Check for summary cards
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-enrollments"]')).toBeVisible();
    
    // Check for charts
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="completion-chart"]')).toBeVisible();
  });
});
```

## 🔮 Future Enhancements

### 1. Advanced Analytics
- **Predictive Analytics**: ML models for student success prediction
- **Behavioral Analysis**: Deep learning for engagement patterns
- **Recommendation Engine**: Personalized course recommendations
- **A/B Testing**: Course content optimization

### 2. Real-time Features
- **Live Dashboards**: Real-time updates without refresh
- **Push Notifications**: Alerts for important metrics
- **WebSocket Integration**: Live data streaming
- **Real-time Collaboration**: Shared analytics sessions

### 3. Advanced Visualizations
- **Interactive Maps**: Geographic analytics
- **Heat Maps**: Engagement pattern visualization
- **Network Graphs**: Student interaction networks
- **3D Visualizations**: Immersive data exploration

### 4. Export & Reporting
- **PDF Reports**: Automated report generation
- **Excel Export**: Data export capabilities
- **Scheduled Reports**: Automated email reports
- **Custom Dashboards**: User-configurable views

## 📞 Support & Troubleshooting

### Common Issues

#### 1. Data Not Updating
- **Check Lambda Function**: Ensure analytics processor is running
- **Verify Permissions**: Check IAM roles and policies
- **Check DynamoDB Streams**: Ensure streams are enabled
- **Monitor CloudWatch Logs**: Check for processing errors

#### 2. Dashboard Loading Issues
- **Check API Calls**: Verify GraphQL queries are working
- **Verify Authentication**: Ensure user has proper role
- **Check Data Availability**: Verify data exists in tables
- **Clear Browser Cache**: Refresh dashboard data

#### 3. Performance Issues
- **Optimize Queries**: Use proper indexes and filters
- **Implement Caching**: Cache frequently accessed data
- **Paginate Results**: Limit data returned per request
- **Monitor Lambda Timeouts**: Adjust timeout settings

### Debugging Tools
- **CloudWatch Logs**: Monitor Lambda execution
- **DynamoDB Console**: Inspect table data
- **GraphQL Playground**: Test queries and mutations
- **Browser DevTools**: Debug frontend issues

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [AWS DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

This comprehensive Analytics Dashboard transforms Kalpla into a data-driven platform, providing actionable insights for administrators, mentors, and instructors to optimize student success and platform performance. The implementation provides enterprise-grade analytics capabilities with real-time processing and intuitive visualizations.

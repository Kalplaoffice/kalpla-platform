# Course Completion Metrics and Per-Course Analytics

This document provides a comprehensive guide for the Kalpla course completion metrics and per-course analytics system that tracks student performance, engagement, and completion rates.

## Overview

The course completion metrics system provides:
- **Completion Rate Tracking**: Monitor course completion rates and trends
- **Student Performance Analytics**: Track individual and aggregate performance
- **Engagement Metrics**: Measure student engagement and participation
- **Demographics Analysis**: Analyze student demographics and behavior
- **Performance Metrics**: Track grades, assignments, and assessments
- **Time-based Analytics**: Analyze trends over different time periods
- **Recommendation Engine**: Generate actionable insights and recommendations
- **Comparative Analysis**: Compare performance across different metrics

## Architecture

```
Frontend (React) → Course Analytics Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
```

## Components

### 1. Course Analytics Service (`courseAnalyticsService.ts`)

**Location**: `src/lib/courseAnalyticsService.ts`

**Features**:
- Course completion rate calculations
- Student performance analytics
- Engagement metrics tracking
- Demographics analysis
- Time-series data analysis
- Recommendation generation
- Performance scoring algorithms

**Key Methods**:
- `getCourseAnalytics()`: Get comprehensive course analytics
- `getCourseMetrics()`: Get metrics for specific time periods
- `getStudentCourseAnalytics()`: Get individual student analytics
- `getCourseCompletionRates()`: Get completion rate data
- `getCoursePerformanceMetrics()`: Get performance metrics
- `getCourseEngagementMetrics()`: Get engagement metrics
- `generateCompletionReport()`: Generate comprehensive completion report
- `calculateCompletionRate()`: Calculate completion rates
- `calculateEngagementScore()`: Calculate engagement scores
- `calculatePerformanceScore()`: Calculate performance scores

### 2. Course Analytics Dashboard (`CourseAnalyticsDashboard.tsx`)

**Location**: `src/components/instructor/CourseAnalyticsDashboard.tsx`

**Features**:
- Comprehensive analytics visualization
- Multi-tab interface for different metrics
- Real-time data updates
- Interactive charts and graphs
- Student performance tracking
- Engagement analysis
- Demographics visualization

**Key Features**:
- **Overview Tab**: Key metrics and completion trends
- **Students Tab**: Individual student performance
- **Engagement Tab**: Engagement metrics and participation
- **Performance Tab**: Grade distribution and performance analysis
- **Demographics Tab**: Student demographics and behavior

## Database Schema

### DynamoDB Tables

#### 1. Course Analytics Table (`COURSE_ANALYTICS_TABLE`)
```json
{
  "id": "courseId",
  "courseId": "string",
  "courseName": "string",
  "instructorId": "string",
  "totalEnrollments": "number",
  "activeEnrollments": "number",
  "completedEnrollments": "number",
  "droppedEnrollments": "number",
  "completionRate": "number",
  "averageCompletionTime": "number",
  "averageScore": "number",
  "totalRevenue": "number",
  "averageRating": "number",
  "totalRatings": "number",
  "metrics": {
    "enrollments": "number",
    "completions": "number",
    "dropouts": "number",
    "averageScore": "number",
    "averageTimeToComplete": "number",
    "averageWatchTime": "number",
    "averageAssignmentScore": "number",
    "averageQuizScore": "number",
    "totalRevenue": "number",
    "refunds": "number",
    "netRevenue": "number",
    "averageRating": "number",
    "totalRatings": "number",
    "positiveRatings": "number",
    "negativeRatings": "number",
    "neutralRatings": "number"
  },
  "engagement": {
    "averageSessionDuration": "number",
    "averageSessionsPerStudent": "number",
    "averageLessonsPerSession": "number",
    "averageTimePerLesson": "number",
    "bounceRate": "number",
    "retentionRate": "number",
    "reEngagementRate": "number",
    "socialShares": "number",
    "discussionPosts": "number",
    "assignmentSubmissions": "number",
    "quizAttempts": "number",
    "bookmarkCount": "number",
    "noteCount": "number",
    "helpRequests": "number"
  },
  "performance": {
    "averageGrade": "number",
    "gradeDistribution": {
      "a": "number",
      "b": "number",
      "c": "number",
      "d": "number",
      "f": "number",
      "total": "number"
    },
    "assignmentPerformance": {
      "totalAssignments": "number",
      "submittedAssignments": "number",
      "gradedAssignments": "number",
      "averageScore": "number",
      "averageTimeToSubmit": "number",
      "lateSubmissions": "number",
      "resubmissions": "number",
      "plagiarismDetections": "number"
    },
    "quizPerformance": {
      "totalQuizzes": "number",
      "totalAttempts": "number",
      "averageScore": "number",
      "averageAttempts": "number",
      "averageTimePerQuiz": "number",
      "perfectScores": "number",
      "passingScores": "number",
      "failingScores": "number"
    },
    "projectPerformance": {
      "totalProjects": "number",
      "submittedProjects": "number",
      "gradedProjects": "number",
      "averageScore": "number",
      "averageTimeToComplete": "number",
      "peerReviews": "number",
      "averagePeerScore": "number"
    },
    "improvementTrends": {
      "scoreImprovement": "number",
      "completionImprovement": "number",
      "engagementImprovement": "number",
      "retentionImprovement": "number",
      "timeToCompleteImprovement": "number"
    }
  },
  "demographics": {
    "ageDistribution": {
      "18-24": "number",
      "25-34": "number",
      "35-44": "number",
      "45-54": "number",
      "55-64": "number",
      "65+": "number",
      "total": "number"
    },
    "genderDistribution": {
      "male": "number",
      "female": "number",
      "nonBinary": "number",
      "preferNotToSay": "number",
      "total": "number"
    },
    "locationDistribution": {
      "northAmerica": "number",
      "southAmerica": "number",
      "europe": "number",
      "asia": "number",
      "africa": "number",
      "oceania": "number",
      "total": "number"
    },
    "educationLevelDistribution": {
      "highSchool": "number",
      "associate": "number",
      "bachelor": "number",
      "master": "number",
      "doctorate": "number",
      "other": "number",
      "total": "number"
    },
    "experienceLevelDistribution": {
      "beginner": "number",
      "intermediate": "number",
      "advanced": "number",
      "expert": "number",
      "total": "number"
    },
    "deviceDistribution": {
      "desktop": "number",
      "mobile": "number",
      "tablet": "number",
      "total": "number"
    },
    "browserDistribution": {
      "chrome": "number",
      "firefox": "number",
      "safari": "number",
      "edge": "number",
      "other": "number",
      "total": "number"
    }
  },
  "timeSeries": [
    {
      "date": "ISO string",
      "enrollments": "number",
      "completions": "number",
      "dropouts": "number",
      "revenue": "number",
      "ratings": "number",
      "averageScore": "number",
      "averageWatchTime": "number",
      "engagementScore": "number"
    }
  ],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Course Metrics Table (`COURSE_METRICS_TABLE`)
```json
{
  "id": "metricsId",
  "courseId": "string",
  "period": "daily|weekly|monthly|quarterly|yearly",
  "enrollments": "number",
  "completions": "number",
  "dropouts": "number",
  "averageScore": "number",
  "averageTimeToComplete": "number",
  "averageWatchTime": "number",
  "averageAssignmentScore": "number",
  "averageQuizScore": "number",
  "totalRevenue": "number",
  "refunds": "number",
  "netRevenue": "number",
  "averageRating": "number",
  "totalRatings": "number",
  "positiveRatings": "number",
  "negativeRatings": "number",
  "neutralRatings": "number",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 3. Student Course Analytics Table (`STUDENT_COURSE_ANALYTICS_TABLE`)
```json
{
  "id": "studentCourseId",
  "studentId": "string",
  "courseId": "string",
  "enrollmentDate": "ISO string",
  "completionDate": "ISO string",
  "status": "active|completed|dropped|paused",
  "progressPercentage": "number",
  "totalTimeSpent": "number",
  "averageScore": "number",
  "lessonsCompleted": "number",
  "totalLessons": "number",
  "assignmentsSubmitted": "number",
  "totalAssignments": "number",
  "quizzesCompleted": "number",
  "totalQuizzes": "number",
  "lastAccessedDate": "ISO string",
  "streakDays": "number",
  "engagementScore": "number",
  "performanceMetrics": {
    "averageQuizScore": "number",
    "averageAssignmentScore": "number",
    "averageProjectScore": "number",
    "participationScore": "number",
    "improvementRate": "number",
    "consistencyScore": "number",
    "helpSeekingBehavior": "number",
    "peerInteractionScore": "number"
  },
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Course Analytics

```typescript
import { courseAnalyticsService } from '@/lib/courseAnalyticsService';

// Get course analytics
const analytics = await courseAnalyticsService.getCourseAnalytics(courseId);

// Get course metrics for specific period
const metrics = await courseAnalyticsService.getCourseMetrics(courseId, 'monthly');

// Get student course analytics
const studentAnalytics = await courseAnalyticsService.getStudentCourseAnalytics(courseId);
```

### 2. Completion Rate Analysis

```typescript
// Get completion rates
const completionReport = await courseAnalyticsService.getCourseCompletionRates(courseId);

// Calculate completion rate
const completionRate = courseAnalyticsService.calculateCompletionRate(
  completedEnrollments, 
  totalEnrollments
);

// Generate completion report
const report = await courseAnalyticsService.generateCompletionReport(courseId);
```

### 3. Performance Metrics

```typescript
// Get performance metrics
const performanceMetrics = await courseAnalyticsService.getCoursePerformanceMetrics(courseId);

// Calculate performance score
const performanceScore = courseAnalyticsService.calculatePerformanceScore(performanceMetrics);

// Get grade distribution
const gradeDistribution = performanceMetrics.gradeDistribution;
```

### 4. Engagement Analysis

```typescript
// Get engagement metrics
const engagementMetrics = await courseAnalyticsService.getCourseEngagementMetrics(courseId);

// Calculate engagement score
const engagementScore = courseAnalyticsService.calculateEngagementScore(engagementMetrics);

// Analyze engagement trends
const engagementTrends = analytics.timeSeries.map(data => ({
  date: data.date,
  engagementScore: data.engagementScore
}));
```

## Analytics Features

### 1. Completion Rate Tracking

#### Completion Rate Calculation
```typescript
// Calculate completion rate
const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Example usage
const completionRate = calculateCompletionRate(150, 200); // 75%
```

#### Completion Trends
```typescript
// Calculate completion trends over time
const calculateCompletionTrends = (studentAnalytics: StudentCourseAnalytics[]) => {
  const trends: CompletionTrend[] = [];
  const now = new Date();
  
  // Calculate trends for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const periodStudents = studentAnalytics.filter(student => {
      const enrollmentDate = new Date(student.enrollmentDate);
      return enrollmentDate.getFullYear() === date.getFullYear() && 
             enrollmentDate.getMonth() === date.getMonth();
    });

    const enrollments = periodStudents.length;
    const completions = periodStudents.filter(student => student.status === 'completed').length;
    const completionRate = calculateCompletionRate(completions, enrollments);

    trends.push({
      period,
      completionRate,
      enrollments,
      completions
    });
  }

  return trends;
};
```

### 2. Student Performance Analytics

#### Performance Scoring
```typescript
// Calculate performance score
const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  const weights = {
    averageGrade: 0.3,
    assignmentPerformance: 0.25,
    quizPerformance: 0.2,
    projectPerformance: 0.15,
    improvementTrends: 0.1
  };

  const score = 
    (metrics.averageGrade * weights.averageGrade) +
    (metrics.assignmentPerformance.averageScore * weights.assignmentPerformance) +
    (metrics.quizPerformance.averageScore * weights.quizPerformance) +
    (metrics.projectPerformance.averageScore * weights.projectPerformance) +
    (metrics.improvementTrends.scoreImprovement * weights.improvementTrends);

  return Math.max(0, Math.min(100, Math.round(score)));
};
```

#### Grade Distribution Analysis
```typescript
// Analyze grade distribution
const analyzeGradeDistribution = (grades: number[]) => {
  const distribution = {
    a: 0, // 90-100
    b: 0, // 80-89
    c: 0, // 70-79
    d: 0, // 60-69
    f: 0  // 0-59
  };

  grades.forEach(grade => {
    if (grade >= 90) distribution.a++;
    else if (grade >= 80) distribution.b++;
    else if (grade >= 70) distribution.c++;
    else if (grade >= 60) distribution.d++;
    else distribution.f++;
  });

  distribution.total = grades.length;
  return distribution;
};
```

### 3. Engagement Metrics

#### Engagement Score Calculation
```typescript
// Calculate engagement score
const calculateEngagementScore = (metrics: EngagementMetrics): number => {
  const weights = {
    sessionDuration: 0.2,
    sessionsPerStudent: 0.15,
    lessonsPerSession: 0.15,
    timePerLesson: 0.1,
    bounceRate: -0.1, // Negative weight
    retentionRate: 0.15,
    reEngagementRate: 0.1,
    socialShares: 0.05
  };

  const score = 
    (metrics.averageSessionDuration * weights.sessionDuration) +
    (metrics.averageSessionsPerStudent * weights.sessionsPerStudent) +
    (metrics.averageLessonsPerSession * weights.lessonsPerSession) +
    (metrics.averageTimePerLesson * weights.timePerLesson) +
    (metrics.bounceRate * weights.bounceRate) +
    (metrics.retentionRate * weights.retentionRate) +
    (metrics.reEngagementRate * weights.reEngagementRate) +
    (metrics.socialShares * weights.socialShares);

  return Math.max(0, Math.min(100, Math.round(score)));
};
```

#### Engagement Analysis
```typescript
// Analyze engagement patterns
const analyzeEngagementPatterns = (engagementData: EngagementMetrics[]) => {
  const patterns = {
    peakHours: [],
    peakDays: [],
    averageSessionLength: 0,
    bounceRate: 0,
    retentionRate: 0
  };

  // Analyze peak hours
  const hourCounts = new Array(24).fill(0);
  engagementData.forEach(data => {
    // Count sessions by hour
    hourCounts[data.peakHour]++;
  });
  patterns.peakHours = hourCounts.indexOf(Math.max(...hourCounts));

  // Calculate averages
  patterns.averageSessionLength = engagementData.reduce((sum, data) => 
    sum + data.averageSessionDuration, 0) / engagementData.length;
  
  patterns.bounceRate = engagementData.reduce((sum, data) => 
    sum + data.bounceRate, 0) / engagementData.length;
  
  patterns.retentionRate = engagementData.reduce((sum, data) => 
    sum + data.retentionRate, 0) / engagementData.length;

  return patterns;
};
```

### 4. Demographics Analysis

#### Demographics Breakdown
```typescript
// Analyze demographics
const analyzeDemographics = (students: StudentCourseAnalytics[]) => {
  const demographics = {
    ageDistribution: { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65+': 0 },
    genderDistribution: { male: 0, female: 0, nonBinary: 0, preferNotToSay: 0 },
    locationDistribution: { northAmerica: 0, southAmerica: 0, europe: 0, asia: 0, africa: 0, oceania: 0 },
    educationLevelDistribution: { highSchool: 0, associate: 0, bachelor: 0, master: 0, doctorate: 0, other: 0 },
    experienceLevelDistribution: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 }
  };

  students.forEach(student => {
    // Count by age group
    if (student.age >= 18 && student.age <= 24) demographics.ageDistribution['18-24']++;
    else if (student.age >= 25 && student.age <= 34) demographics.ageDistribution['25-34']++;
    else if (student.age >= 35 && student.age <= 44) demographics.ageDistribution['35-44']++;
    else if (student.age >= 45 && student.age <= 54) demographics.ageDistribution['45-54']++;
    else if (student.age >= 55 && student.age <= 64) demographics.ageDistribution['55-64']++;
    else if (student.age >= 65) demographics.ageDistribution['65+']++;

    // Count by gender
    demographics.genderDistribution[student.gender]++;

    // Count by location
    demographics.locationDistribution[student.location]++;

    // Count by education level
    demographics.educationLevelDistribution[student.educationLevel]++;

    // Count by experience level
    demographics.experienceLevelDistribution[student.experienceLevel]++;
  });

  return demographics;
};
```

## Dashboard Features

### 1. Overview Tab

#### Key Metrics Display
```typescript
// Key metrics component
const KeyMetrics = ({ analytics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MetricCard
      title="Total Enrollments"
      value={analytics.totalEnrollments}
      subtitle={`${analytics.activeEnrollments} active`}
      icon={UsersIcon}
      color="blue"
    />
    <MetricCard
      title="Completion Rate"
      value={`${analytics.completionRate}%`}
      subtitle={`${analytics.completedEnrollments} completed`}
      icon={CheckCircleIcon}
      color="green"
    />
    <MetricCard
      title="Average Score"
      value={analytics.averageScore.toFixed(1)}
      subtitle={`${analytics.totalRatings} ratings`}
      icon={StarIcon}
      color="yellow"
    />
    <MetricCard
      title="Avg. Completion Time"
      value={`${analytics.averageCompletionTime} days`}
      subtitle="Average time to complete"
      icon={ClockIcon}
      color="purple"
    />
  </div>
);
```

#### Completion Trends Chart
```typescript
// Completion trends visualization
const CompletionTrendsChart = ({ trends }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Trends</h3>
    <div className="h-64">
      {/* Chart implementation would go here */}
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Chart implementation pending</p>
      </div>
    </div>
  </div>
);
```

### 2. Students Tab

#### Student Performance Table
```typescript
// Student performance table
const StudentPerformanceTable = ({ students }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map(student => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {student.studentId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      Student {student.studentId.slice(-4)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(student.enrollmentDate)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${student.progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{student.progressPercentage}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  student.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                  student.averageScore >= 80 ? 'bg-blue-100 text-blue-800' :
                  student.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.averageScore.toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  student.status === 'completed' ? 'bg-green-100 text-green-800' :
                  student.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
```

### 3. Engagement Tab

#### Engagement Metrics Grid
```typescript
// Engagement metrics grid
const EngagementMetricsGrid = ({ engagement }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <MetricCard
      title="Avg. Session Duration"
      value={formatDuration(engagement.averageSessionDuration)}
      icon={ClockIcon}
      color="blue"
    />
    <MetricCard
      title="Avg. Sessions per Student"
      value={engagement.averageSessionsPerStudent.toFixed(1)}
      icon={BookOpenIcon}
      color="green"
    />
    <MetricCard
      title="Discussion Posts"
      value={engagement.discussionPosts}
      icon={ChatBubbleLeftIcon}
      color="purple"
    />
    <MetricCard
      title="Assignment Submissions"
      value={engagement.assignmentSubmissions}
      icon={ClipboardDocumentListIcon}
      color="orange"
    />
    <MetricCard
      title="Social Shares"
      value={engagement.socialShares}
      icon={ShareIcon}
      color="pink"
    />
    <MetricCard
      title="Retention Rate"
      value={`${engagement.retentionRate}%`}
      icon={TrendingUpIcon}
      color="indigo"
    />
  </div>
);
```

### 4. Performance Tab

#### Grade Distribution Chart
```typescript
// Grade distribution visualization
const GradeDistributionChart = ({ gradeDistribution }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
    <div className="space-y-3">
      {[
        { grade: 'A (90-100)', count: gradeDistribution.a, color: 'bg-green-500' },
        { grade: 'B (80-89)', count: gradeDistribution.b, color: 'bg-blue-500' },
        { grade: 'C (70-79)', count: gradeDistribution.c, color: 'bg-yellow-500' },
        { grade: 'D (60-69)', count: gradeDistribution.d, color: 'bg-orange-500' },
        { grade: 'F (0-59)', count: gradeDistribution.f, color: 'bg-red-500' }
      ].map((item) => (
        <div key={item.grade} className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{item.grade}</span>
          <div className="flex items-center space-x-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${(item.count / gradeDistribution.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
```

### 5. Demographics Tab

#### Demographics Visualization
```typescript
// Demographics visualization
const DemographicsVisualization = ({ demographics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
      <div className="space-y-3">
        {Object.entries(demographics.ageDistribution).map(([age, count]) => (
          <div key={age} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{age}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(count / demographics.ageDistribution.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
      <div className="space-y-3">
        {Object.entries(demographics.deviceDistribution).map(([device, count]) => (
          <div key={device} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">{device}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(count / demographics.deviceDistribution.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
```

## Recommendation Engine

### 1. Completion Rate Recommendations

```typescript
// Generate completion rate recommendations
const generateCompletionRecommendations = (analytics: CourseAnalytics): string[] => {
  const recommendations: string[] = [];

  // Completion rate recommendations
  if (analytics.completionRate < 70) {
    recommendations.push('Consider adding more interactive elements to improve engagement');
    recommendations.push('Implement progress checkpoints to help students stay on track');
  }

  // Engagement recommendations
  if (analytics.engagement.averageSessionDuration < 30) {
    recommendations.push('Break down content into smaller, more digestible chunks');
    recommendations.push('Add interactive quizzes and activities throughout lessons');
  }

  // Performance recommendations
  if (analytics.averageScore < 80) {
    recommendations.push('Review assignment difficulty and provide more practice exercises');
    recommendations.push('Consider adding peer review sessions for collaborative learning');
  }

  // Dropout recommendations
  const dropoutRate = (analytics.droppedEnrollments / analytics.totalEnrollments) * 100;
  if (dropoutRate > 20) {
    recommendations.push('Implement early intervention strategies for at-risk students');
    recommendations.push('Add more support resources and help documentation');
  }

  return recommendations;
};
```

### 2. Performance Recommendations

```typescript
// Generate performance recommendations
const generatePerformanceRecommendations = (performance: PerformanceMetrics): string[] => {
  const recommendations: string[] = [];

  // Grade distribution recommendations
  if (performance.gradeDistribution.f > performance.gradeDistribution.total * 0.2) {
    recommendations.push('Consider providing additional support for struggling students');
    recommendations.push('Review course prerequisites and entry requirements');
  }

  // Assignment performance recommendations
  if (performance.assignmentPerformance.lateSubmissions > performance.assignmentPerformance.submittedAssignments * 0.3) {
    recommendations.push('Consider extending assignment deadlines');
    recommendations.push('Provide better time management guidance');
  }

  // Quiz performance recommendations
  if (performance.quizPerformance.averageAttempts > 3) {
    recommendations.push('Consider providing more practice quizzes');
    recommendations.push('Review quiz difficulty and question clarity');
  }

  return recommendations;
};
```

## Best Practices

### 1. Data Collection

- **Real-time Updates**: Update analytics in real-time
- **Data Validation**: Validate all incoming data
- **Error Handling**: Handle errors gracefully
- **Performance**: Optimize queries for large datasets

### 2. Analytics Accuracy

- **Consistent Metrics**: Use consistent calculation methods
- **Data Quality**: Ensure data quality and accuracy
- **Regular Updates**: Update analytics regularly
- **Validation**: Validate analytics results

### 3. Privacy and Security

- **Data Privacy**: Protect student privacy
- **Access Control**: Implement proper access controls
- **Data Retention**: Follow data retention policies
- **Compliance**: Ensure regulatory compliance

### 4. Performance Optimization

- **Caching**: Cache frequently accessed data
- **Pagination**: Use pagination for large datasets
- **Indexing**: Optimize database indexes
- **Query Optimization**: Optimize database queries

## Troubleshooting

### 1. Common Issues

**Analytics Not Loading**:
- Check data availability
- Verify query permissions
- Check for data processing delays
- Verify analytics service status

**Inaccurate Metrics**:
- Check data sources
- Verify calculation methods
- Check for data inconsistencies
- Validate data quality

**Performance Issues**:
- Check database performance
- Verify query optimization
- Check for memory leaks
- Monitor resource usage

### 2. Debug Tools

```typescript
// Debug analytics data
const debugAnalytics = async (courseId: string) => {
  const analytics = await courseAnalyticsService.getCourseAnalytics(courseId);
  console.log('Analytics data:', analytics);
  
  const completionReport = await courseAnalyticsService.generateCompletionReport(courseId);
  console.log('Completion report:', completionReport);
  
  const studentAnalytics = await courseAnalyticsService.getStudentCourseAnalytics(courseId);
  console.log('Student analytics:', studentAnalytics);
};
```

## API Reference

### Course Analytics Service

#### Methods

- `getCourseAnalytics(courseId)`: Get comprehensive course analytics
- `getCourseMetrics(courseId, period)`: Get metrics for specific period
- `getStudentCourseAnalytics(courseId)`: Get student course analytics
- `getCourseCompletionRates(courseId)`: Get completion rate data
- `getCoursePerformanceMetrics(courseId)`: Get performance metrics
- `getCourseEngagementMetrics(courseId)`: Get engagement metrics
- `generateCompletionReport(courseId)`: Generate completion report
- `updateCourseAnalytics(courseId, updates)`: Update course analytics
- `createCourseMetrics(metrics)`: Create course metrics
- `calculateCompletionRate(completed, total)`: Calculate completion rate
- `calculateEngagementScore(metrics)`: Calculate engagement score
- `calculatePerformanceScore(metrics)`: Calculate performance score
- `formatPercentage(value)`: Format percentage
- `formatDuration(minutes)`: Format duration
- `formatCurrency(amount)`: Format currency
- `getPerformanceGrade(score)`: Get performance grade
- `getCompletionStatus(completionRate)`: Get completion status

### GraphQL Queries and Mutations

#### Queries

- `GET_COURSE_ANALYTICS`: Get course analytics
- `GET_COURSE_METRICS`: Get course metrics
- `GET_STUDENT_COURSE_ANALYTICS`: Get student course analytics
- `GET_COURSE_COMPLETION_RATES`: Get completion rates
- `GET_COURSE_PERFORMANCE_METRICS`: Get performance metrics
- `GET_COURSE_ENGAGEMENT_METRICS`: Get engagement metrics

#### Mutations

- `CREATE_COURSE_ANALYTICS`: Create course analytics
- `UPDATE_COURSE_ANALYTICS`: Update course analytics
- `CREATE_COURSE_METRICS`: Create course metrics
- `UPDATE_COURSE_METRICS`: Update course metrics
- `CREATE_STUDENT_COURSE_ANALYTICS`: Create student course analytics
- `UPDATE_STUDENT_COURSE_ANALYTICS`: Update student course analytics

## Future Enhancements

1. **Advanced Analytics**: Machine learning insights
2. **Predictive Analytics**: Predict completion likelihood
3. **Real-time Dashboards**: Real-time analytics updates
4. **Custom Reports**: Customizable report generation
5. **Benchmarking**: Compare against industry standards
6. **AI Recommendations**: AI-powered recommendations
7. **Mobile Analytics**: Mobile-specific analytics
8. **Integration**: Third-party analytics integration

## Support

For issues or questions:
1. Check analytics configuration
2. Verify data sources
3. Check calculation methods
4. Review error logs
5. Contact technical support

The course completion metrics system provides comprehensive analytics for tracking student performance, engagement, and completion rates with actionable insights and recommendations!

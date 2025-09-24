# Peer Review System - Student Assignment Reviews

This document provides a comprehensive guide for the Kalpla peer review system that enables students to review each other's assignments.

## Overview

The peer review system provides:
- **Assignment Reviews**: Students review each other's assignments
- **Review Rubrics**: Customizable review criteria and scoring
- **Review Matching**: Intelligent matching algorithms for reviewer assignment
- **Feedback System**: Structured feedback with strengths and improvements
- **Review Analytics**: Performance metrics and quality tracking
- **Review Management**: Complete review lifecycle management
- **Quality Control**: Review quality assessment and moderation
- **Progress Tracking**: Track review completion and progress

## Architecture

```
Frontend (React) → Peer Review Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
```

## Components

### 1. Peer Review Service (`peerReviewService.ts`)

**Location**: `src/lib/peerReviewService.ts`

**Features**:
- Peer review creation and management
- Review rubric management
- Review assignment management
- Review matching algorithms
- Feedback system
- Review analytics and statistics
- Review quality assessment

**Key Methods**:
- `createPeerReview()`: Create new peer review
- `getPeerReviews()`: Get peer reviews with filtering
- `updatePeerReview()`: Update peer review
- `submitPeerReview()`: Submit completed peer review
- `createReviewRubric()`: Create review rubric
- `getReviewRubrics()`: Get review rubrics
- `createReviewAssignment()`: Create review assignment
- `generateReviewMatches()`: Generate reviewer matches
- `createReviewFeedback()`: Create review feedback
- `getReviewStats()`: Get review statistics
- `searchPeerReviews()`: Search peer reviews

### 2. Peer Review Dashboard (`PeerReviewDashboard.tsx`)

**Location**: `src/components/peerReview/PeerReviewDashboard.tsx`

**Features**:
- Multi-tab interface for review management
- Review list with filtering and sorting
- Rubric management
- Assignment management
- Feedback system
- Statistics and analytics
- Review submission interface

## Database Schema

### DynamoDB Tables

#### 1. Peer Reviews Table (`PEER_REVIEWS_TABLE`)
```json
{
  "id": "reviewId",
  "assignmentId": "string",
  "assignmentName": "string",
  "courseId": "string",
  "courseName": "string",
  "reviewerId": "string",
  "reviewerName": "string",
  "reviewerAvatar": "string",
  "revieweeId": "string",
  "revieweeName": "string",
  "revieweeAvatar": "string",
  "status": "assigned|in_progress|submitted|completed|overdue|cancelled",
  "rubricId": "string",
  "rubricName": "string",
  "criteria": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "weight": "number",
      "maxScore": "number",
      "score": "number",
      "feedback": "string",
      "examples": ["string"]
    }
  ],
  "overallScore": "number",
  "overallFeedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "isAnonymous": "boolean",
  "isBlind": "boolean",
  "dueDate": "ISO string",
  "submittedAt": "ISO string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Review Rubrics Table (`REVIEW_RUBRICS_TABLE`)
```json
{
  "id": "rubricId",
  "name": "string",
  "description": "string",
  "courseId": "string",
  "courseName": "string",
  "criteria": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "weight": "number",
      "maxScore": "number",
      "examples": ["string"]
    }
  ],
  "totalWeight": "number",
  "maxScore": "number",
  "isActive": "boolean",
  "createdBy": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 3. Review Assignments Table (`REVIEW_ASSIGNMENTS_TABLE`)
```json
{
  "id": "assignmentId",
  "assignmentId": "string",
  "assignmentName": "string",
  "courseId": "string",
  "courseName": "string",
  "rubricId": "string",
  "rubricName": "string",
  "reviewType": "peer_review|self_review|instructor_review|group_review",
  "matchingStrategy": "random|skill_based|performance_based|preference_based|instructor_assigned",
  "reviewCount": "number",
  "dueDate": "ISO string",
  "isActive": "boolean",
  "participants": ["string"],
  "reviews": ["string"],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 4. Review Feedback Table (`REVIEW_FEEDBACK_TABLE`)
```json
{
  "id": "feedbackId",
  "reviewId": "string",
  "revieweeId": "string",
  "revieweeName": "string",
  "feedbackType": "positive|constructive|suggestion|question|clarification",
  "content": "string",
  "isHelpful": "boolean",
  "isConstructive": "boolean",
  "rating": "number",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Peer Review Management

```typescript
import { peerReviewService } from '@/lib/peerReviewService';

// Create peer review
const review = await peerReviewService.createPeerReview({
  assignmentId: 'assign123',
  assignmentName: 'Math Assignment',
  courseId: 'course123',
  courseName: 'Mathematics 101',
  reviewerId: 'student123',
  reviewerName: 'John Doe',
  revieweeId: 'student456',
  revieweeName: 'Jane Smith',
  status: 'assigned',
  rubricId: 'rubric123',
  rubricName: 'Math Assignment Rubric',
  criteria: [],
  overallScore: 0,
  overallFeedback: '',
  strengths: [],
  improvements: [],
  isAnonymous: false,
  isBlind: false,
  dueDate: '2024-01-15T23:59:59Z'
});

// Get peer reviews
const reviews = await peerReviewService.getPeerReviews({
  assignmentId: 'assign123',
  reviewerId: 'student123'
});

// Submit peer review
await peerReviewService.submitPeerReview(reviewId, {
  criteria: [
    {
      id: 'criteria1',
      name: 'Problem Solving',
      description: 'Ability to solve mathematical problems',
      weight: 0.4,
      maxScore: 25,
      score: 22,
      feedback: 'Good problem-solving approach',
      examples: ['Clear step-by-step solution']
    }
  ],
  overallScore: 88,
  overallFeedback: 'Great work overall with room for improvement',
  strengths: ['Clear explanations', 'Good methodology'],
  improvements: ['Show more work', 'Check calculations']
});
```

### 2. Review Rubric Management

```typescript
// Create review rubric
const rubric = await peerReviewService.createReviewRubric({
  name: 'Math Assignment Rubric',
  description: 'Rubric for evaluating math assignments',
  courseId: 'course123',
  courseName: 'Mathematics 101',
  criteria: [
    {
      id: 'criteria1',
      name: 'Problem Solving',
      description: 'Ability to solve mathematical problems',
      weight: 0.4,
      maxScore: 25,
      examples: ['Clear methodology', 'Correct approach']
    },
    {
      id: 'criteria2',
      name: 'Accuracy',
      description: 'Correctness of calculations and answers',
      weight: 0.3,
      maxScore: 20,
      examples: ['Correct final answer', 'Accurate calculations']
    },
    {
      id: 'criteria3',
      name: 'Presentation',
      description: 'Clarity and organization of work',
      weight: 0.3,
      maxScore: 15,
      examples: ['Clear handwriting', 'Well-organized layout']
    }
  ],
  isActive: true,
  createdBy: 'instructor123'
});

// Get review rubrics
const rubrics = await peerReviewService.getReviewRubrics({
  courseId: 'course123'
});
```

### 3. Review Assignment Management

```typescript
// Create review assignment
const assignment = await peerReviewService.createReviewAssignment({
  assignmentId: 'assign123',
  assignmentName: 'Math Assignment',
  courseId: 'course123',
  courseName: 'Mathematics 101',
  rubricId: 'rubric123',
  rubricName: 'Math Assignment Rubric',
  reviewType: 'peer_review',
  matchingStrategy: 'random',
  reviewCount: 2,
  dueDate: '2024-01-15T23:59:59Z',
  isActive: true,
  participants: ['student1', 'student2', 'student3', 'student4']
});

// Generate review matches
const matches = await peerReviewService.generateReviewMatches('assign123', 'random');
```

### 4. Review Matching Algorithms

#### Random Matching
```typescript
const generateRandomMatches = (participants: string[], reviewCount: number): ReviewMatch[] => {
  const matches: ReviewMatch[] = [];
  const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffledParticipants.length; i++) {
    const reviewerId = shuffledParticipants[i];
    const reviewerName = `Student ${i + 1}`;

    for (let j = 0; j < reviewCount; j++) {
      const revieweeIndex = (i + j + 1) % shuffledParticipants.length;
      const revieweeId = shuffledParticipants[revieweeIndex];
      const revieweeName = `Student ${revieweeIndex + 1}`;

      matches.push({
        reviewerId,
        reviewerName,
        revieweeId,
        revieweeName,
        assignmentId: '',
        assignmentName: '',
        compatibilityScore: Math.random(),
        matchReason: 'Random assignment'
      });
    }
  }

  return matches;
};
```

#### Skill-Based Matching
```typescript
const generateSkillBasedMatches = async (participants: string[], reviewCount: number, assignmentId: string): Promise<ReviewMatch[]> => {
  const matches: ReviewMatch[] = [];

  for (const reviewerId of participants) {
    const reviewerName = `Student ${participants.indexOf(reviewerId) + 1}`;
    
    for (let i = 0; i < reviewCount; i++) {
      const revieweeIndex = (participants.indexOf(reviewerId) + i + 1) % participants.length;
      const revieweeId = participants[revieweeIndex];
      const revieweeName = `Student ${revieweeIndex + 1}`;

      matches.push({
        reviewerId,
        reviewerName,
        revieweeId,
        revieweeName,
        assignmentId,
        assignmentName: '',
        compatibilityScore: 0.8 + Math.random() * 0.2,
        matchReason: 'Skill-based matching'
      });
    }
  }

  return matches;
};
```

### 5. Review Feedback System

```typescript
// Create review feedback
const feedback = await peerReviewService.createReviewFeedback({
  reviewId: 'review123',
  revieweeId: 'student456',
  revieweeName: 'Jane Smith',
  feedbackType: 'constructive',
  content: 'Your solution was well-structured but could benefit from more detailed explanations.',
  isHelpful: true,
  isConstructive: true,
  rating: 4
});

// Get review feedback
const feedbackList = await peerReviewService.getReviewFeedback({
  reviewId: 'review123'
});
```

### 6. Review Analytics

```typescript
// Get review statistics
const stats = await peerReviewService.getReviewStats({
  assignmentId: 'assign123',
  courseId: 'course123'
});

// Search peer reviews
const searchResults = await peerReviewService.searchPeerReviews('math problems', {
  assignmentId: 'assign123'
});
```

## Features

### 1. Review Rubrics

#### Rubric Structure
- **Criteria**: Individual evaluation criteria
- **Weight**: Relative importance of each criterion
- **Max Score**: Maximum possible score for each criterion
- **Examples**: Sample responses for each criterion
- **Total Score**: Calculated total possible score

#### Rubric Management
```typescript
const createRubric = async (rubricData: RubricInput) => {
  try {
    // Validate criteria weights sum to 1
    const totalWeight = rubricData.criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new Error('Criteria weights must sum to 1');
    }

    const rubric = await peerReviewService.createReviewRubric({
      name: rubricData.name,
      description: rubricData.description,
      courseId: rubricData.courseId,
      courseName: rubricData.courseName,
      criteria: rubricData.criteria,
      isActive: true,
      createdBy: rubricData.createdBy
    });

    return rubric;
  } catch (error) {
    console.error('Error creating rubric:', error);
    throw new Error('Failed to create rubric');
  }
};
```

### 2. Review Matching Strategies

#### Matching Strategy Types
- **Random**: Random assignment of reviewers
- **Skill-Based**: Match based on student skill levels
- **Performance-Based**: Match based on academic performance
- **Preference-Based**: Match based on student preferences
- **Instructor-Assigned**: Manual assignment by instructor

#### Matching Algorithm
```typescript
const generateMatches = async (assignmentId: string, strategy: MatchingStrategy): Promise<ReviewMatch[]> => {
  try {
    const assignment = await peerReviewService.getReviewAssignment(assignmentId);
    if (!assignment) throw new Error('Review assignment not found');

    const participants = assignment.participants;
    const reviewCount = assignment.reviewCount;

    let matches: ReviewMatch[] = [];

    switch (strategy) {
      case 'random':
        matches = generateRandomMatches(participants, reviewCount);
        break;
      case 'skill_based':
        matches = await generateSkillBasedMatches(participants, reviewCount, assignmentId);
        break;
      case 'performance_based':
        matches = await generatePerformanceBasedMatches(participants, reviewCount, assignmentId);
        break;
      case 'preference_based':
        matches = await generatePreferenceBasedMatches(participants, reviewCount, assignmentId);
        break;
      case 'instructor_assigned':
        matches = await generateInstructorAssignedMatches(participants, reviewCount, assignmentId);
        break;
      default:
        matches = generateRandomMatches(participants, reviewCount);
    }

    return matches;
  } catch (error) {
    console.error('Error generating matches:', error);
    throw new Error('Failed to generate matches');
  }
};
```

### 3. Review Submission

#### Review Submission Process
```typescript
const submitReview = async (reviewId: string, reviewData: ReviewSubmissionData): Promise<PeerReview> => {
  try {
    // Validate review data
    if (!reviewData.criteria || reviewData.criteria.length === 0) {
      throw new Error('Review criteria are required');
    }

    if (!reviewData.overallFeedback || reviewData.overallFeedback.trim() === '') {
      throw new Error('Overall feedback is required');
    }

    // Calculate overall score
    const overallScore = calculateOverallScore(reviewData.criteria);
    
    // Submit review
    const updatedReview = await peerReviewService.submitPeerReview(reviewId, {
      criteria: reviewData.criteria,
      overallScore,
      overallFeedback: reviewData.overallFeedback,
      strengths: reviewData.strengths,
      improvements: reviewData.improvements
    });

    return updatedReview;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw new Error('Failed to submit review');
  }
};
```

#### Score Calculation
```typescript
const calculateOverallScore = (criteria: ReviewCriteria[]): number => {
  if (criteria.length === 0) return 0;

  const totalWeight = criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedScore = criteria.reduce((sum, criteria) => {
    const score = criteria.score || 0;
    return sum + (score * criteria.weight);
  }, 0);

  return Math.round((weightedScore / totalWeight) * 100) / 100;
};
```

### 4. Review Quality Assessment

#### Quality Metrics
- **Completeness**: All criteria reviewed
- **Constructiveness**: Helpful and actionable feedback
- **Accuracy**: Consistent with rubric standards
- **Timeliness**: Submitted within deadline

#### Quality Assessment
```typescript
const assessReviewQuality = (review: PeerReview): number => {
  let qualityScore = 0;
  
  // Completeness (25%)
  const completenessScore = review.criteria.filter(c => c.score !== undefined).length / review.criteria.length;
  qualityScore += completenessScore * 25;
  
  // Constructiveness (25%)
  const hasStrengths = review.strengths.length > 0;
  const hasImprovements = review.improvements.length > 0;
  const hasOverallFeedback = review.overallFeedback.trim().length > 0;
  const constructivenessScore = (hasStrengths ? 1 : 0) + (hasImprovements ? 1 : 0) + (hasOverallFeedback ? 1 : 0);
  qualityScore += (constructivenessScore / 3) * 25;
  
  // Accuracy (25%)
  const accuracyScore = review.criteria.filter(c => c.feedback && c.feedback.trim().length > 0).length / review.criteria.length;
  qualityScore += accuracyScore * 25;
  
  // Timeliness (25%)
  const isOnTime = review.submittedAt && new Date(review.submittedAt) <= new Date(review.dueDate);
  qualityScore += (isOnTime ? 1 : 0) * 25;
  
  return Math.round(qualityScore);
};
```

### 5. Review Analytics

#### Review Statistics
```typescript
interface ReviewStats {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  averageScore: number;
  averageCompletionTime: number;
  reviewQualityScore: number;
  participationRate: number;
  reviewsByStatus: { [key: string]: number };
  reviewsByCriteria: { [key: string]: number };
  topReviewers: Array<{
    userId: string;
    userName: string;
    reviewCount: number;
    averageScore: number;
    qualityScore: number;
  }>;
  reviewTrends: Array<{
    date: string;
    reviewsCompleted: number;
    averageScore: number;
  }>;
}
```

#### Analytics Calculation
```typescript
const calculateReviewStats = async (filters: ReviewFilters): Promise<ReviewStats> => {
  try {
    const reviews = await peerReviewService.getPeerReviews(filters);
    
    const totalReviews = reviews.length;
    const completedReviews = reviews.filter(r => r.status === 'completed').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const overdueReviews = reviews.filter(r => r.status === 'overdue').length;
    
    const averageScore = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length 
      : 0;
    
    const averageCompletionTime = reviews.length > 0
      ? reviews.reduce((sum, r) => {
          if (r.submittedAt) {
            const created = new Date(r.createdAt);
            const submitted = new Date(r.submittedAt);
            return sum + (submitted.getTime() - created.getTime());
          }
          return sum;
        }, 0) / reviews.length
      : 0;
    
    const reviewQualityScore = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + assessReviewQuality(r), 0) / reviews.length
      : 0;
    
    const participationRate = totalReviews > 0 ? (completedReviews / totalReviews) * 100 : 0;
    
    return {
      totalReviews,
      completedReviews,
      pendingReviews,
      overdueReviews,
      averageScore,
      averageCompletionTime,
      reviewQualityScore,
      participationRate,
      reviewsByStatus: {},
      reviewsByCriteria: {},
      topReviewers: [],
      reviewTrends: []
    };
  } catch (error) {
    console.error('Error calculating review stats:', error);
    throw new Error('Failed to calculate review stats');
  }
};
```

## Dashboard Features

### 1. Reviews Tab
- **Review List**: Display all peer reviews with filtering and sorting
- **Review Status**: Track review progress and completion
- **Review Submission**: Submit completed reviews
- **Review Details**: View detailed review information
- **Bulk Actions**: Manage multiple reviews at once

### 2. Rubrics Tab
- **Rubric List**: Display all review rubrics
- **Rubric Management**: Create, edit, delete rubrics
- **Criteria Management**: Manage rubric criteria
- **Rubric Preview**: Preview rubric structure
- **Rubric Status**: Active/inactive rubric management

### 3. Assignments Tab
- **Assignment List**: Display all review assignments
- **Assignment Management**: Create, edit, delete assignments
- **Matching Configuration**: Configure review matching
- **Participant Management**: Manage assignment participants
- **Match Generation**: Generate reviewer matches

### 4. Feedback Tab
- **Feedback List**: Display all review feedback
- **Feedback Types**: Categorize feedback by type
- **Feedback Quality**: Assess feedback quality
- **Feedback Management**: Manage feedback responses

### 5. Statistics Tab
- **Review Statistics**: Display review performance metrics
- **Quality Metrics**: Show review quality scores
- **Participation Rates**: Track student participation
- **Trend Analysis**: Analyze review trends over time

## Best Practices

### 1. Review Design
- **Clear Rubrics**: Use clear, specific evaluation criteria
- **Balanced Criteria**: Ensure criteria weights are balanced
- **Examples**: Provide examples for each criterion
- **Training**: Train students on review process

### 2. Matching Strategy
- **Appropriate Strategy**: Choose matching strategy based on context
- **Fair Distribution**: Ensure fair distribution of reviews
- **Avoid Conflicts**: Avoid matching students with conflicts
- **Consider Skills**: Match based on relevant skills

### 3. Quality Control
- **Review Guidelines**: Provide clear review guidelines
- **Quality Assessment**: Assess review quality regularly
- **Feedback Training**: Train students on giving constructive feedback
- **Moderation**: Moderate reviews when necessary

### 4. Analytics
- **Regular Monitoring**: Monitor review statistics regularly
- **Quality Tracking**: Track review quality over time
- **Participation Analysis**: Analyze participation patterns
- **Improvement Areas**: Identify areas for improvement

## API Reference

### Peer Review Service

#### Methods
- `createPeerReview(review)`: Create new peer review
- `getPeerReviews(filters?)`: Get peer reviews with filtering
- `updatePeerReview(id, updates)`: Update peer review
- `submitPeerReview(id, reviewData)`: Submit completed review
- `deletePeerReview(id)`: Delete peer review
- `createReviewRubric(rubric)`: Create review rubric
- `getReviewRubrics(filters?)`: Get review rubrics
- `updateReviewRubric(id, updates)`: Update review rubric
- `deleteReviewRubric(id)`: Delete review rubric
- `createReviewAssignment(assignment)`: Create review assignment
- `getReviewAssignments(filters?)`: Get review assignments
- `generateReviewMatches(assignmentId, strategy)`: Generate reviewer matches
- `createReviewFeedback(feedback)`: Create review feedback
- `getReviewFeedback(filters?)`: Get review feedback
- `getReviewStats(filters?)`: Get review statistics
- `searchPeerReviews(query, filters?)`: Search peer reviews
- `formatDate(date)`: Format date
- `formatRelativeTime(date)`: Format relative time
- `getReviewStatusColor(status)`: Get review status color
- `getFeedbackTypeColor(type)`: Get feedback type color
- `getScoreColor(score, maxScore)`: Get score color

## Future Enhancements

1. **AI-Powered Matching**: AI-enhanced reviewer matching
2. **Automated Quality Assessment**: AI-based review quality assessment
3. **Peer Calibration**: Peer review calibration system
4. **Advanced Analytics**: More detailed analytics and reporting
5. **Integration**: Third-party tool integration
6. **Mobile App**: Dedicated mobile app for reviews
7. **Real-time Collaboration**: Real-time collaborative reviews
8. **Gamification**: Gamified review experience

## Support

For issues or questions:
1. Check review guidelines
2. Verify rubric configuration
3. Check matching strategy
4. Review quality metrics
5. Contact technical support

The peer review system provides comprehensive student assignment review functionality with intelligent matching, quality assessment, and analytics!

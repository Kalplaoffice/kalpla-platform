# Kalpla Platform API Documentation

This document provides comprehensive API documentation for the Kalpla EdTech platform.

## Base URLs

- **Development**: `https://dev-api.kalpla.com`
- **Staging**: `https://staging-api.kalpla.com`
- **Production**: `https://api.kalpla.com`

## Authentication

### Authentication Methods

1. **JWT Token**: Bearer token in Authorization header
2. **Cognito User Pool**: AWS Cognito authentication
3. **API Key**: For external integrations

### Getting Authentication Token

```bash
# Login endpoint
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "Student",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Using Authentication Token

```bash
# Include token in requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## User Management

### User Registration

```bash
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Student",
  "phoneNumber": "+1234567890"
}

# Response
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Student",
  "isVerified": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get User Profile

```bash
GET /api/users/profile
Authorization: Bearer <token>

# Response
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Student",
  "profilePicture": "https://s3.amazonaws.com/bucket/profile.jpg",
  "bio": "Student bio",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile

```bash
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001"
}

# Response
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Course Management

### Get All Courses

```bash
GET /api/courses
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- category: Filter by category
- difficulty: Filter by difficulty
- search: Search query

# Response
{
  "courses": [
    {
      "id": "course-123",
      "title": "Introduction to Web Development",
      "description": "Learn the basics of web development",
      "instructor": {
        "id": "instructor-123",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "category": "Technology",
      "subcategory": "Web Development",
      "difficulty": "BEGINNER",
      "duration": 40,
      "language": "English",
      "prerequisites": ["Basic computer skills"],
      "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
      "price": 99.99,
      "currency": "USD",
      "status": "PUBLISHED",
      "enrollmentCount": 150,
      "rating": 4.5,
      "reviewCount": 25,
      "publishedDate": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Get Course Details

```bash
GET /api/courses/{courseId}
Authorization: Bearer <token>

# Response
{
  "id": "course-123",
  "title": "Introduction to Web Development",
  "description": "Learn the basics of web development",
  "instructor": {
    "id": "instructor-123",
    "firstName": "Jane",
    "lastName": "Smith",
    "bio": "Experienced web developer",
    "profilePicture": "https://s3.amazonaws.com/bucket/profile.jpg"
  },
  "category": "Technology",
  "subcategory": "Web Development",
  "difficulty": "BEGINNER",
  "duration": 40,
  "language": "English",
  "prerequisites": ["Basic computer skills"],
  "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
  "videoUrl": "https://cloudfront.amazonaws.com/video.mp4",
  "resources": [
    "https://s3.amazonaws.com/bucket/resource1.pdf",
    "https://s3.amazonaws.com/bucket/resource2.pdf"
  ],
  "price": 99.99,
  "currency": "USD",
  "status": "PUBLISHED",
  "enrollmentCount": 150,
  "rating": 4.5,
  "reviewCount": 25,
  "publishedDate": "2024-01-01T00:00:00Z",
  "lessons": [
    {
      "id": "lesson-123",
      "title": "Introduction to HTML",
      "description": "Learn the basics of HTML",
      "order": 1,
      "duration": 30,
      "videoUrl": "https://cloudfront.amazonaws.com/lesson1.mp4",
      "resources": ["https://s3.amazonaws.com/bucket/lesson1.pdf"],
      "transcript": "Lesson transcript...",
      "isPreview": true
    }
  ]
}
```

### Create Course (Instructor Only)

```bash
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced React Development",
  "description": "Learn advanced React concepts",
  "category": "Technology",
  "subcategory": "Web Development",
  "difficulty": "ADVANCED",
  "duration": 60,
  "language": "English",
  "prerequisites": ["Basic React knowledge"],
  "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
  "price": 199.99,
  "currency": "USD"
}

# Response
{
  "id": "course-456",
  "title": "Advanced React Development",
  "description": "Learn advanced React concepts",
  "instructorId": "instructor-123",
  "category": "Technology",
  "subcategory": "Web Development",
  "difficulty": "ADVANCED",
  "duration": 60,
  "language": "English",
  "prerequisites": ["Basic React knowledge"],
  "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
  "price": 199.99,
  "currency": "USD",
  "status": "DRAFT",
  "enrollmentCount": 0,
  "rating": 0,
  "reviewCount": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Enrollment Management

### Enroll in Course

```bash
POST /api/enrollments/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course-123",
  "paymentMethod": "payu"
}

# Response
{
  "id": "enrollment-123",
  "studentId": "student-123",
  "courseId": "course-123",
  "enrollmentDate": "2024-01-01T00:00:00Z",
  "progress": 0,
  "isCompleted": false,
  "amountPaid": 99.99,
  "currency": "USD",
  "paymentId": "payment-123"
}
```

### Get Student Enrollments

```bash
GET /api/enrollments/courses
Authorization: Bearer <token>
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- status: Filter by status (active, completed)

# Response
{
  "enrollments": [
    {
      "id": "enrollment-123",
      "course": {
        "id": "course-123",
        "title": "Introduction to Web Development",
        "thumbnail": "https://s3.amazonaws.com/bucket/thumbnail.jpg",
        "instructor": {
          "firstName": "Jane",
          "lastName": "Smith"
        }
      },
      "enrollmentDate": "2024-01-01T00:00:00Z",
      "completionDate": null,
      "progress": 25,
      "isCompleted": false,
      "amountPaid": 99.99,
      "currency": "USD"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

## Assignment Management

### Get Assignments

```bash
GET /api/assignments
Authorization: Bearer <token>
Query Parameters:
- courseId: Filter by course
- programId: Filter by program
- cohortId: Filter by cohort
- status: Filter by status

# Response
{
  "assignments": [
    {
      "id": "assignment-123",
      "title": "Build a Todo App",
      "description": "Create a todo application using React",
      "type": "PROJECT",
      "maxPoints": 100,
      "dueDate": "2024-02-01T23:59:59Z",
      "instructions": "Build a todo app with the following features...",
      "resources": ["https://s3.amazonaws.com/bucket/requirements.pdf"],
      "rubric": "Grading rubric...",
      "course": {
        "id": "course-123",
        "title": "Introduction to Web Development"
      },
      "instructor": {
        "id": "instructor-123",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "submissions": [
        {
          "id": "submission-123",
          "studentId": "student-123",
          "content": "Submission content",
          "files": ["https://s3.amazonaws.com/bucket/submission.zip"],
          "submissionDate": "2024-01-25T10:00:00Z",
          "status": "SUBMITTED",
          "grade": null,
          "feedback": null
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Submit Assignment

```bash
POST /api/assignments/{assignmentId}/submissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "content": "Assignment submission content",
  "files": [file1, file2]
}

# Response
{
  "id": "submission-123",
  "studentId": "student-123",
  "assignmentId": "assignment-123",
  "content": "Assignment submission content",
  "files": [
    "https://s3.amazonaws.com/bucket/submission1.pdf",
    "https://s3.amazonaws.com/bucket/submission2.zip"
  ],
  "submissionDate": "2024-01-25T10:00:00Z",
  "status": "SUBMITTED",
  "grade": null,
  "feedback": null
}
```

### Grade Assignment (Mentor/Instructor Only)

```bash
PUT /api/assignments/{assignmentId}/submissions/{submissionId}/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Great work! Your implementation shows good understanding of React concepts."
}

# Response
{
  "id": "submission-123",
  "studentId": "student-123",
  "assignmentId": "assignment-123",
  "content": "Assignment submission content",
  "files": [
    "https://s3.amazonaws.com/bucket/submission1.pdf",
    "https://s3.amazonaws.com/bucket/submission2.zip"
  ],
  "submissionDate": "2024-01-25T10:00:00Z",
  "status": "GRADED",
  "grade": 85,
  "feedback": "Great work! Your implementation shows good understanding of React concepts.",
  "gradedBy": "mentor-123",
  "gradedDate": "2024-01-26T14:30:00Z"
}
```

## Payment Management

### Create Payment Intent

```bash
POST /api/payments/intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "USD",
  "courseId": "course-123",
  "description": "Course enrollment payment"
}

# Response
{
  "id": "payment-intent-123",
  "clientSecret": "pi_1234567890_secret_abcdef",
  "amount": 99.99,
  "currency": "USD",
  "status": "requires_payment_method"
}
```

### Process Payment

```bash
POST /api/payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "payment-intent-123",
  "paymentMethodId": "pm_1234567890"
}

# Response
{
  "id": "payment-123",
  "amount": 99.99,
  "currency": "USD",
  "status": "succeeded",
  "paymentMethod": "card",
  "transactionId": "txn_1234567890",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Payment History

```bash
GET /api/payments/history
Authorization: Bearer <token>
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- status: Filter by status

# Response
{
  "payments": [
    {
      "id": "payment-123",
      "amount": 99.99,
      "currency": "USD",
      "status": "SUCCESS",
      "paymentMethod": "card",
      "transactionId": "txn_1234567890",
      "course": {
        "id": "course-123",
        "title": "Introduction to Web Development"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

## KSMP Management

### Get KSMP Cohorts

```bash
GET /api/ksmp/cohorts
Authorization: Bearer <token>

# Response
{
  "cohorts": [
    {
      "id": "cohort-123",
      "name": "KSMP Cohort 2024-01",
      "description": "First cohort of 2024",
      "mentor": {
        "id": "mentor-123",
        "firstName": "John",
        "lastName": "Doe",
        "expertise": ["Technology", "Business"]
      },
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "maxSize": 20,
      "currentSize": 15,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Enroll in KSMP

```bash
POST /api/ksmp/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "cohortId": "cohort-123",
  "startupName": "My Startup",
  "problemStatement": "We solve the problem of...",
  "solution": "Our solution is...",
  "targetMarket": "Small businesses",
  "businessModel": "SaaS subscription"
}

# Response
{
  "id": "ksmp-enrollment-123",
  "studentId": "student-123",
  "cohortId": "cohort-123",
  "enrollmentDate": "2024-01-01T00:00:00Z",
  "currentPhase": "PHASE_1",
  "progress": 0,
  "isCompleted": false,
  "amountPaid": 5000,
  "currency": "USD",
  "paymentId": "payment-123"
}
```

## Live Sessions

### Get Live Sessions

```bash
GET /api/sessions
Authorization: Bearer <token>
Query Parameters:
- cohortId: Filter by cohort
- status: Filter by status
- upcoming: Get only upcoming sessions

# Response
{
  "sessions": [
    {
      "id": "session-123",
      "title": "Introduction to Entrepreneurship",
      "description": "Learn the basics of starting a business",
      "mentor": {
        "id": "mentor-123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "cohort": {
        "id": "cohort-123",
        "name": "KSMP Cohort 2024-01"
      },
      "scheduledDate": "2024-02-01T10:00:00Z",
      "duration": 60,
      "meetingUrl": "https://zoom.us/j/123456789",
      "recordingUrl": null,
      "status": "SCHEDULED",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Live Session (Mentor Only)

```bash
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Marketing Strategies",
  "description": "Learn effective marketing strategies",
  "cohortId": "cohort-123",
  "scheduledDate": "2024-02-01T10:00:00Z",
  "duration": 60
}

# Response
{
  "id": "session-123",
  "title": "Marketing Strategies",
  "description": "Learn effective marketing strategies",
  "mentorId": "mentor-123",
  "cohortId": "cohort-123",
  "scheduledDate": "2024-02-01T10:00:00Z",
  "duration": 60,
  "meetingUrl": "https://zoom.us/j/123456789",
  "recordingUrl": null,
  "status": "SCHEDULED",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Startup Management

### Get Startups

```bash
GET /api/startups
Authorization: Bearer <token>
Query Parameters:
- stage: Filter by stage
- cohortId: Filter by cohort
- mentorId: Filter by mentor

# Response
{
  "startups": [
    {
      "id": "startup-123",
      "name": "TechCorp",
      "tagline": "Revolutionizing education",
      "description": "We create innovative educational solutions",
      "industry": "EdTech",
      "stage": "EARLY_STAGE",
      "problemStatement": "Students struggle with complex concepts",
      "solution": "Interactive learning platform",
      "targetMarket": "High school students",
      "businessModel": "Freemium SaaS",
      "teamSize": 5,
      "founders": ["John Doe", "Jane Smith"],
      "currentValuation": 1000000,
      "fundingRaised": 250000,
      "fundingGoal": 500000,
      "ksmpCohort": {
        "id": "cohort-123",
        "name": "KSMP Cohort 2024-01"
      },
      "currentPhase": "PHASE_3",
      "mentor": {
        "id": "mentor-123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "ACTIVE",
      "logoUrl": "https://s3.amazonaws.com/bucket/logo.jpg",
      "pitchDeckUrl": "https://s3.amazonaws.com/bucket/pitch.pdf",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Notifications

### Get Notifications

```bash
GET /api/notifications
Authorization: Bearer <token>
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- isRead: Filter by read status
- priority: Filter by priority

# Response
{
  "notifications": [
    {
      "id": "notification-123",
      "title": "Assignment Graded",
      "message": "Your assignment has been graded. Check your gradebook.",
      "type": "IN_APP",
      "priority": "MEDIUM",
      "isRead": false,
      "actionUrl": "/student/assignments",
      "actionText": "View Assignment",
      "category": "assignment",
      "relatedEntityId": "assignment-123",
      "relatedEntityType": "Assignment",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Mark Notification as Read

```bash
PUT /api/notifications/{notificationId}/read
Authorization: Bearer <token>

# Response
{
  "id": "notification-123",
  "title": "Assignment Graded",
  "message": "Your assignment has been graded. Check your gradebook.",
  "type": "IN_APP",
  "priority": "MEDIUM",
  "isRead": true,
  "actionUrl": "/student/assignments",
  "actionText": "View Assignment",
  "category": "assignment",
  "relatedEntityId": "assignment-123",
  "relatedEntityType": "Assignment",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123456789"
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Rate Limiting

- **Rate Limit**: 1000 requests per hour per user
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Webhooks

### PayU Payment Webhook

```bash
POST /api/webhooks/payu
Content-Type: application/json

{
  "txnid": "txn-123",
  "status": "success",
  "amount": "99.99",
  "hash": "calculated-hash",
  "firstname": "John",
  "email": "john@example.com",
  "phone": "1234567890"
}

# Response
{
  "status": "processed",
  "message": "Payment processed successfully"
}
```

## SDKs and Libraries

### JavaScript/Node.js

```bash
npm install @kalpla/api-client
```

```javascript
import { KalplaClient } from '@kalpla/api-client';

const client = new KalplaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.kalpla.com'
});

// Get courses
const courses = await client.courses.getAll();

// Enroll in course
const enrollment = await client.enrollments.create({
  courseId: 'course-123'
});
```

### Python

```bash
pip install kalpla-api
```

```python
from kalpla_api import KalplaClient

client = KalplaClient(
    api_key='your-api-key',
    base_url='https://api.kalpla.com'
)

# Get courses
courses = client.courses.get_all()

# Enroll in course
enrollment = client.enrollments.create({
    'courseId': 'course-123'
})
```

## Testing

### Postman Collection

Import the Postman collection for testing:
- [Kalpla API Collection](https://www.postman.com/kalpla/workspace/kalpla-api)

### API Testing

```bash
# Test authentication
curl -X POST https://api.kalpla.com/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test course enrollment
curl -X POST https://api.kalpla.com/api/enrollments/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "course-123"}'
```

## Support

- **Documentation**: [https://docs.kalpla.com](https://docs.kalpla.com)
- **Support Email**: support@kalpla.com
- **Status Page**: [https://status.kalpla.com](https://status.kalpla.com)
- **Community Forum**: [https://community.kalpla.com](https://community.kalpla.com)

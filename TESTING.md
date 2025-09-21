# Kalpla Platform Testing Guide

This guide covers comprehensive testing strategies for the Kalpla EdTech platform.

## Testing Strategy

### 1. Testing Pyramid
- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints and database interactions
- **End-to-End Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing
- **Security Tests**: Authentication and authorization

### 2. Testing Environments
- **Development**: Local development environment
- **Staging**: Pre-production environment
- **Production**: Live environment (limited testing)

## Unit Testing

### 1. Frontend Components
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests
npm test
```

#### Example Component Test
```typescript
// src/components/__tests__/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders navigation links for unauthenticated users', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
  });

  it('shows user role for authenticated users', () => {
    const mockUser = { role: 'Student' };
    render(<Navbar user={mockUser} />);
    
    expect(screen.getByText('Student')).toBeInTheDocument();
  });
});
```

### 2. Backend Functions
```bash
# Install testing dependencies
npm install --save-dev jest aws-sdk-mock

# Run tests
npm test
```

#### Example Lambda Function Test
```javascript
// amplify/backend/function/paymentProcessor/__tests__/index.test.js
const AWS = require('aws-sdk-mock');
const { handler } = require('../src/index');

describe('Payment Processor', () => {
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWS.restore();
  });

  it('should generate payment request successfully', async () => {
    const event = {
      body: JSON.stringify({
        studentId: 'test-student',
        courseId: 'test-course',
        amount: 1000,
        currency: 'INR'
      })
    };

    const result = await handler(event);
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty('hash');
  });
});
```

## Integration Testing

### 1. API Testing
```bash
# Install testing dependencies
npm install --save-dev supertest jest

# Run API tests
npm run test:api
```

#### Example API Test
```javascript
// tests/api/payment.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Payment API', () => {
  it('should create payment intent', async () => {
    const response = await request(app)
      .post('/api/payment')
      .send({
        studentId: 'test-student',
        courseId: 'test-course',
        amount: 1000
      })
      .expect(200);

    expect(response.body).toHaveProperty('paymentId');
    expect(response.body).toHaveProperty('clientSecret');
  });

  it('should handle payment webhook', async () => {
    const response = await request(app)
      .post('/api/payment/webhook')
      .send({
        txnid: 'test-txn',
        status: 'success',
        hash: 'test-hash'
      })
      .expect(200);

    expect(response.body).toHaveProperty('status', 'processed');
  });
});
```

### 2. Database Testing
```bash
# Install testing dependencies
npm install --save-dev dynamodb-local jest

# Run database tests
npm run test:db
```

#### Example Database Test
```javascript
// tests/database/user.test.js
const AWS = require('aws-sdk');
const { createUser, getUserByEmail } = require('../../src/database/user');

describe('User Database Operations', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Cleanup test database
    await cleanupTestDatabase();
  });

  it('should create user successfully', async () => {
    const userData = {
      id: 'test-user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'Student'
    };

    const result = await createUser(userData);
    
    expect(result).toHaveProperty('id', 'test-user-1');
    expect(result).toHaveProperty('email', 'test@example.com');
  });

  it('should get user by email', async () => {
    const user = await getUserByEmail('test@example.com');
    
    expect(user).toHaveProperty('email', 'test@example.com');
  });
});
```

## End-to-End Testing

### 1. Playwright Setup
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

#### Example E2E Test
```typescript
// tests/e2e/student-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Workflow', () => {
  test('should complete course enrollment flow', async ({ page }) => {
    // Navigate to courses page
    await page.goto('/courses');
    
    // Select a course
    await page.click('[data-testid="course-card"]');
    
    // Click enroll button
    await page.click('[data-testid="enroll-button"]');
    
    // Fill payment form
    await page.fill('[data-testid="payment-form"]', 'test-payment-data');
    
    // Submit payment
    await page.click('[data-testid="submit-payment"]');
    
    // Verify success page
    await expect(page).toHaveURL('/payment/success');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should submit assignment', async ({ page }) => {
    // Login as student
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email"]', 'student@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="signin-button"]');
    
    // Navigate to assignments
    await page.goto('/student/assignments');
    
    // Select assignment
    await page.click('[data-testid="assignment-card"]');
    
    // Upload file
    await page.setInputFiles('[data-testid="file-upload"]', 'test-assignment.pdf');
    
    // Submit assignment
    await page.click('[data-testid="submit-assignment"]');
    
    // Verify submission
    await expect(page.locator('[data-testid="submission-success"]')).toBeVisible();
  });
});
```

### 2. Cypress Setup
```bash
# Install Cypress
npm install --save-dev cypress

# Run Cypress tests
npm run cypress:open
```

#### Example Cypress Test
```javascript
// cypress/e2e/mentor-workflow.cy.js
describe('Mentor Workflow', () => {
  beforeEach(() => {
    cy.login('mentor@example.com', 'password');
  });

  it('should grade student assignment', () => {
    cy.visit('/mentor/grading');
    
    cy.get('[data-testid="pending-submission"]').first().click();
    
    cy.get('[data-testid="grade-input"]').type('85');
    cy.get('[data-testid="feedback-textarea"]').type('Great work!');
    
    cy.get('[data-testid="submit-grade"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

## Performance Testing

### 1. Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load tests
artillery run tests/performance/load-test.yml
```

#### Example Load Test Configuration
```yaml
# tests/performance/load-test.yml
config:
  target: 'https://api.kalpla.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer {{ token }}'

scenarios:
  - name: "Course Enrollment"
    weight: 70
    flow:
      - post:
          url: "/api/payment"
          json:
            studentId: "{{ $randomString() }}"
            courseId: "{{ $randomString() }}"
            amount: 1000

  - name: "Assignment Submission"
    weight: 30
    flow:
      - post:
          url: "/api/assignments/submit"
          json:
            assignmentId: "{{ $randomString() }}"
            content: "Test submission"
```

### 2. Stress Testing with K6
```bash
# Install K6
npm install -g k6

# Run stress tests
k6 run tests/performance/stress-test.js
```

#### Example Stress Test
```javascript
// tests/performance/stress-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let response = http.post('https://api.kalpla.com/api/payment', {
    studentId: 'test-student',
    courseId: 'test-course',
    amount: 1000
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## Security Testing

### 1. Authentication Testing
```javascript
// tests/security/auth.test.js
describe('Authentication Security', () => {
  it('should reject invalid JWT tokens', async () => {
    const response = await request(app)
      .get('/api/protected-route')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('should enforce role-based access control', async () => {
    const studentToken = await generateToken({ role: 'Student' });
    
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });
});
```

### 2. Input Validation Testing
```javascript
// tests/security/validation.test.js
describe('Input Validation', () => {
  it('should sanitize user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    
    const response = await request(app)
      .post('/api/assignments/submit')
      .send({ content: maliciousInput })
      .expect(400);
  });

  it('should validate file uploads', async () => {
    const response = await request(app)
      .post('/api/assignments/submit')
      .attach('file', 'malicious.exe')
      .expect(400);
  });
});
```

## Test Data Management

### 1. Test Data Setup
```javascript
// tests/helpers/test-data.js
export const testUsers = {
  student: {
    id: 'test-student-1',
    email: 'student@test.com',
    firstName: 'Test',
    lastName: 'Student',
    role: 'Student'
  },
  mentor: {
    id: 'test-mentor-1',
    email: 'mentor@test.com',
    firstName: 'Test',
    lastName: 'Mentor',
    role: 'Mentor'
  },
  admin: {
    id: 'test-admin-1',
    email: 'admin@test.com',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'Admin'
  }
};

export const testCourses = {
  course1: {
    id: 'test-course-1',
    title: 'Test Course',
    instructorId: 'test-instructor-1',
    price: 1000,
    status: 'PUBLISHED'
  }
};
```

### 2. Database Seeding
```javascript
// tests/helpers/seed-database.js
export async function seedTestData() {
  // Create test users
  for (const user of Object.values(testUsers)) {
    await createUser(user);
  }
  
  // Create test courses
  for (const course of Object.values(testCourses)) {
    await createCourse(course);
  }
}

export async function cleanupTestData() {
  // Delete test data
  await deleteAllTestUsers();
  await deleteAllTestCourses();
}
```

## Continuous Integration

### 1. GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run unit tests
      run: npm test
      
    - name: Run integration tests
      run: npm run test:integration
      
    - name: Run E2E tests
      run: npm run test:e2e
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### 2. Test Coverage
```bash
# Install coverage tools
npm install --save-dev nyc

# Run tests with coverage
npm run test:coverage
```

## Test Automation

### 1. Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:performance": "artillery run tests/performance/load-test.yml",
    "test:security": "jest --testPathPattern=security"
  }
}
```

### 2. Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## Testing Best Practices

### 1. Test Organization
- Group tests by feature
- Use descriptive test names
- Keep tests independent
- Use setup and teardown properly

### 2. Test Data
- Use realistic test data
- Avoid hardcoded values
- Clean up test data
- Use factories for data generation

### 3. Assertions
- Use specific assertions
- Test both positive and negative cases
- Verify error messages
- Check response codes

### 4. Performance
- Run tests in parallel
- Use test databases
- Mock external services
- Optimize test execution time

## Debugging Tests

### 1. Common Issues
- Async/await problems
- Test isolation issues
- Mock configuration errors
- Environment setup problems

### 2. Debugging Tools
- Jest debug mode
- Playwright debug mode
- Browser dev tools
- Network monitoring

### 3. Test Logs
```bash
# Enable verbose logging
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="should create user"
```

## Test Reporting

### 1. Coverage Reports
- HTML coverage reports
- Coverage thresholds
- Coverage badges
- Coverage trends

### 2. Test Results
- JUnit XML reports
- Test result summaries
- Performance metrics
- Failure analysis

## Maintenance

### 1. Regular Updates
- Update testing dependencies
- Review test coverage
- Refactor outdated tests
- Add new test cases

### 2. Test Documentation
- Test case documentation
- Testing procedures
- Troubleshooting guides
- Best practices updates

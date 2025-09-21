# Kalpla Development Guide

This guide provides detailed information for developers working on the Kalpla platform.

## 🏗️ Architecture Overview

### Frontend Architecture
- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **AWS Amplify UI** for pre-built authentication components
- **Heroicons** for consistent iconography

### Backend Architecture
- **AWS Amplify** as the backend-as-a-service platform
- **AWS Cognito** for user authentication and authorization
- **AWS AppSync** for GraphQL API with real-time subscriptions
- **DynamoDB** for NoSQL data storage
- **AWS S3** for file storage (videos, documents, images)
- **AWS CloudFront** for global content delivery
- **AWS Lambda** for serverless functions

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS Account with appropriate permissions
- AWS CLI configured with credentials

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd kalpla-platform
   npm install
   ```

2. **AWS Amplify Setup**
   ```bash
   # Initialize Amplify (if not already done)
   npm run amplify:init
   
   # Add authentication
   npm run amplify:add-auth
   
   # Add GraphQL API
   npm run amplify:add-api
   
   # Deploy backend
   npm run amplify:push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure Deep Dive

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                    # Authentication pages
│   │   ├── signin/             # Sign in page
│   │   └── signup/             # Sign up page
│   ├── courses/                # Course marketplace
│   ├── programs/               # Degree programs
│   ├── ksmp/                   # KSMP program
│   ├── mentors/                # Mentor profiles
│   ├── investors/              # Investor portal
│   ├── dashboard/              # Role-based dashboards
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # Reusable components
│   ├── layout/                 # Layout components
│   │   └── Navbar.tsx          # Navigation bar
│   └── providers/               # Context providers
│       └── AmplifyProvider.tsx  # Amplify configuration
├── contexts/                    # React contexts
│   └── UserContext.tsx         # User context for state management
├── lib/                        # Utility libraries
│   └── amplify.ts              # Amplify configuration and helpers
└── amplifyconfiguration.json   # Amplify configuration file
```

## 🔐 Authentication & Authorization

### User Roles
The platform supports six user roles with different permissions:

1. **Guest**: Browse public content only
2. **Student**: Enroll in courses, submit assignments, access content
3. **Instructor**: Create courses, manage content (requires admin approval)
4. **Mentor**: Manage KSMP cohorts, host live sessions, grade assignments
5. **Admin**: Full platform control, approvals, analytics
6. **Investor**: Access startup profiles, investment opportunities

### Implementation
- **AWS Cognito User Pools** for user management
- **User Groups** for role-based access control
- **GraphQL Schema** with fine-grained authorization rules
- **React Context** for user state management

## 📊 Database Schema

### Core Entities

#### User
```graphql
type User @model @auth(rules: [
  { allow: owner, operations: [read, update] },
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] }
]) {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  role: UserRole!
  # ... other fields
}
```

#### Course
```graphql
type Course @model @auth(rules: [
  { allow: groups, groups: ["Admin"], operations: [read, create, update, delete] },
  { allow: owner, operations: [read, update] },
  { allow: public, operations: [read] }
]) {
  id: ID!
  title: String!
  description: String!
  instructorId: ID!
  # ... other fields
}
```

### Relationships
- **One-to-Many**: User → Courses, User → Assignments
- **Many-to-Many**: Students ↔ Courses (via CourseEnrollment)
- **Hierarchical**: Course → Lessons

## 🎨 UI/UX Guidelines

### Design System
- **Color Palette**: Blue (#2563eb) as primary, Purple (#7c3aed) as secondary
- **Typography**: Geist Sans for headings, Geist Mono for code
- **Spacing**: Consistent 4px grid system
- **Components**: Tailwind CSS utility classes

### Component Patterns
- **Layout Components**: Consistent header, navigation, and footer
- **Card Components**: Reusable card layouts for courses, mentors, etc.
- **Form Components**: Consistent form styling and validation
- **Modal Components**: Overlay dialogs for actions

## 🔄 State Management

### React Context
- **UserContext**: Manages authenticated user state
- **ThemeContext**: Handles dark/light mode (future)
- **NotificationContext**: Manages toast notifications (future)

### Local State
- **useState**: For component-level state
- **useEffect**: For side effects and data fetching
- **Custom Hooks**: For reusable stateful logic

## 🧪 Testing Strategy

### Unit Tests
- **Jest**: For unit testing
- **React Testing Library**: For component testing
- **@testing-library/jest-dom**: For DOM assertions

### Integration Tests
- **Cypress**: For end-to-end testing
- **API Testing**: GraphQL query testing

### Test Structure
```
__tests__/
├── components/          # Component tests
├── pages/              # Page tests
├── utils/              # Utility function tests
└── e2e/                # End-to-end tests
```

## 🚀 Deployment

### Development
```bash
npm run dev              # Start development server
npm run amplify:push     # Deploy backend changes
```

### Staging
```bash
npm run build           # Build production bundle
npm run amplify:publish # Deploy to staging
```

### Production
```bash
npm run build           # Build production bundle
npm run amplify:publish # Deploy to production
```

## 🔧 Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_AMPLIFY_CONFIG=your_config_here
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### AWS Amplify Configuration
The `amplifyconfiguration.json` file is automatically generated and contains:
- API endpoints
- Authentication configuration
- Storage configuration
- Analytics configuration

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Implementation
- **Tailwind CSS**: Responsive utility classes
- **Flexbox/Grid**: Modern layout techniques
- **Mobile-first**: Design approach

## 🔍 Performance Optimization

### Frontend
- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Bundle Analysis**: Webpack bundle analyzer

### Backend
- **GraphQL**: Efficient data fetching
- **DynamoDB**: Fast NoSQL queries
- **CloudFront**: Global CDN
- **Lambda**: Serverless scaling

## 🐛 Debugging

### Frontend Debugging
- **React DevTools**: Component inspection
- **Next.js DevTools**: Performance monitoring
- **Browser DevTools**: Network and console debugging

### Backend Debugging
- **AWS CloudWatch**: Log monitoring
- **AWS X-Ray**: Distributed tracing
- **GraphQL Playground**: API testing

## 📚 API Documentation

### GraphQL Schema
The complete GraphQL schema is defined in `amplify/backend/api/kalpla/schema.graphql`.

### Key Queries
```graphql
# Get user profile
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    email
    firstName
    lastName
    role
  }
}

# List courses
query ListCourses($filter: ModelCourseFilterInput) {
  listCourses(filter: $filter) {
    items {
      id
      title
      description
      instructor {
        firstName
        lastName
      }
    }
  }
}
```

### Key Mutations
```graphql
# Create course enrollment
mutation CreateCourseEnrollment($input: CreateCourseEnrollmentInput!) {
  createCourseEnrollment(input: $input) {
    id
    studentId
    courseId
    enrollmentDate
  }
}
```

## 🔒 Security Best Practices

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies

### Backend Security
- **Authentication**: AWS Cognito
- **Authorization**: GraphQL schema rules
- **Data Encryption**: DynamoDB encryption at rest
- **API Security**: AWS AppSync security

## 📈 Monitoring & Analytics

### Application Monitoring
- **AWS CloudWatch**: Logs and metrics
- **AWS X-Ray**: Performance tracing
- **Custom Metrics**: Business metrics

### User Analytics
- **AWS Pinpoint**: User engagement
- **Custom Events**: Learning progress tracking

## 🤝 Contributing Guidelines

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety

### Git Workflow
1. Create feature branch
2. Make changes
3. Add tests
4. Submit pull request
5. Code review
6. Merge to main

### Commit Messages
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🆘 Troubleshooting

### Common Issues

#### Amplify Configuration
```bash
# Reset Amplify configuration
rm -rf amplify/
npm run amplify:init
```

#### Authentication Issues
```bash
# Clear Cognito cache
aws cognito-idp admin-delete-user --user-pool-id <pool-id> --username <username>
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next/
npm run build
```

## 📞 Support

For development support:
- Check the main README.md
- Review AWS Amplify documentation
- Create an issue in the repository
- Contact the development team

---

Happy coding! 🚀

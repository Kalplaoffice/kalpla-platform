# Kalpla - EdTech Platform

A comprehensive educational platform built with Next.js, TypeScript, and AWS Amplify, designed to provide courses, degree programs, mentorship, and startup incubation.

## 🚀 Features

### Core Features
- **Course Marketplace**: Browse and enroll in courses created by verified instructors
- **Degree Programs**: Comprehensive structured programs designed by industry experts
- **KSMP (Kalpla Startup Mentorship Program)**: 12-month cohort-based startup mentorship
- **Live Mentorship**: Connect with experienced mentors for personalized guidance
- **Assignment & Grading System**: Submit assignments and receive feedback from mentors
- **Role-based Dashboards**: Tailored experiences for Students, Instructors, Mentors, Admins, and Investors

### User Roles
- **Student**: Enroll in courses/programs, access content, submit assignments
- **Instructor**: Create courses, upload content (requires admin approval)
- **Mentor**: Manage KSMP phases, host live classes, grade assignments
- **Admin**: Full platform control, approvals, payments, cohorts management
- **Investor**: Access investment opportunities and startup demos
- **Guest**: Browse public content and mentor profiles

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **AWS Amplify UI** for authentication components

### Backend & Infrastructure
- **AWS Amplify** for backend infrastructure
- **AWS Cognito** for authentication and user management
- **AWS AppSync** for GraphQL API
- **DynamoDB** for data storage
- **AWS S3** for file storage (videos, documents)
- **AWS CloudFront** for CDN and content delivery
- **AWS Lambda** for serverless functions
- **Amazon IVS** for live streaming (planned)

### Payment Integration
- **Razorpay** for payment processing
- **AWS Lambda webhooks** for payment handling

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course marketplace
│   ├── programs/          # Degree programs
│   ├── ksmp/             # KSMP program
│   ├── mentors/          # Mentor profiles
│   ├── investors/        # Investor portal
│   ├── dashboard/        # Role-based dashboards
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── layout/           # Layout components (Navbar, etc.)
│   └── providers/        # Context providers
├── contexts/            # React contexts
├── lib/                 # Utility libraries
└── amplifyconfiguration.json # Amplify config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS Account
- AWS CLI configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kalpla-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS Amplify**
   ```bash
   npx @aws-amplify/cli@latest init
   ```

4. **Add authentication**
   ```bash
   npx @aws-amplify/cli@latest add auth
   ```

5. **Add GraphQL API**
   ```bash
   npx @aws-amplify/cli@latest add api
   ```

6. **Deploy backend**
   ```bash
   npx @aws-amplify/cli@latest push
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses a comprehensive GraphQL schema with the following main entities:

- **User**: Core user information with role-based access
- **Course**: Course details, lessons, and metadata
- **DegreeProgram**: Structured degree programs
- **KSMPCohort**: Startup mentorship cohorts
- **Assignment**: Assignments and submissions
- **LiveSession**: Live mentoring sessions
- **Payment**: Payment records and transactions

## 🔐 Authentication & Authorization

The platform implements role-based access control using AWS Cognito:

- User groups for different roles (Student, Instructor, Mentor, Admin, Investor)
- GraphQL schema with fine-grained authorization rules
- Protected routes and components based on user roles
- Guest access for public content

## 🎯 Key Workflows

### Course Creation Flow
1. Instructor applies to become an instructor
2. Admin approves instructor application
3. Instructor creates course and uploads content
4. Course submitted for admin review
5. Admin approves and publishes course
6. Students can enroll after payment

### KSMP Enrollment Flow
1. Student applies to KSMP program
2. Admin reviews application and approves
3. Student makes payment
4. Student assigned to cohort with mentor
5. Progress tracked through 12 phases
6. Graduation and demo day presentation

### Assignment & Grading Flow
1. Mentor creates assignment for cohort
2. Students submit assignments
3. Mentor grades assignments
4. Grades stored in gradebook
5. Students can view feedback and grades

## 🚀 Deployment

### Frontend Deployment
The application can be deployed to:
- **AWS Amplify Hosting** (recommended)
- **Vercel**
- **Netlify**

### Backend Deployment
Backend resources are automatically deployed via AWS Amplify CLI:
```bash
npx @aws-amplify/cli@latest push
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_AMPLIFY_CONFIG=your_amplify_config
```

### AWS Amplify Configuration
The `amplifyconfiguration.json` file contains all necessary AWS service configurations.

## 📱 Features by Role

### Student Features
- Browse and enroll in courses
- Access course content and videos
- Submit assignments
- View grades and feedback
- Track KSMP progress
- Attend live sessions

### Instructor Features
- Create and manage courses
- Upload course content
- View student analytics
- Manage earnings
- Submit courses for approval

### Mentor Features
- Manage KSMP cohorts
- Schedule live sessions
- Grade assignments
- Track mentee progress
- Access mentor resources

### Admin Features
- Approve instructors and courses
- Manage degree programs
- Oversee KSMP cohorts
- Monitor platform analytics
- Handle payments and refunds

### Investor Features
- Access startup profiles
- View financial information
- Attend demo days
- Connect with founders
- Track investment opportunities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Live Streaming Integration**: Amazon IVS for live classes
- **Mobile App**: React Native mobile application
- **AI-Powered Features**: Automated grading and recommendations
- **Advanced Analytics**: Detailed learning analytics
- **Internationalization**: Multi-language support
- **Advanced Payment Options**: Cryptocurrency and international payments

---

Built with ❤️ by the Kalpla Team
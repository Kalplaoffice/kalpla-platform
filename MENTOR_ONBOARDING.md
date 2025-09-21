# Mentor Onboarding Flow - Complete Implementation

This document outlines the comprehensive Mentor Onboarding Flow implemented for the Kalpla EdTech platform.

## Overview

The Mentor Onboarding Flow is a dedicated system that allows potential mentors to apply to become part of the Kalpla mentorship program. It includes document upload, PDF generation, and admin review workflows.

## Architecture

### Frontend Components
- **Mentor Onboarding Page** (`/mentor-onboarding`)
- **Success Page** (`/mentor-onboarding/success`)
- **Admin Review Page** (`/admin/mentor-applications`)

### Backend Services
- **DynamoDB Tables**: `MentorApplication`, `MentorProfile`
- **S3 Bucket**: `kalpla-mentor-documents-{env}-{accountId}`
- **Lambda Function**: `generateMentorDeclarationPdf`
- **GraphQL API**: Mutations and queries for mentor applications

## Flow Breakdown

### 1. Access & Entry Points

#### Public Access
- **Homepage CTA**: "Become a Mentor" button redirects to `/mentor-onboarding`
- **Direct URL**: `/mentor-onboarding` is publicly accessible
- **No authentication required** for initial access

#### User Experience
- Users can start the application process without signing up
- Email field auto-fills if user is logged in
- Google sign-in option available during the process

### 2. Onboarding Page UI

#### Step 1: Basic Information
- **Full Name** (required)
- **Email Address** (required, auto-filled if logged in)
- **Phone Number** (required)
- **Expertise/Domain** (required)
- **LinkedIn Profile** (optional)
- **Portfolio/Website** (optional)
- **Short Bio** (required, textarea)
- **Availability per Week** (required, dropdown)

#### Step 2: Document Upload
- **Government ID** (required): Aadhaar/Passport/Driver's License
- **Degree/Certification Proof** (required)
- **Resume/CV** (required)
- **File validation**: PDF, JPEG, PNG (max 10MB each)
- **S3 Upload**: Documents stored in `mentor-uploads/{userId}/` folder

#### Step 3: Declaration
- **Legal Declaration Text**: Comprehensive terms and conditions
- **Checkbox Confirmation**: "I declare that all information is true"
- **Digital Signature**: Typed name as digital signature
- **Legal Binding**: Creates legally binding agreement

#### Step 4: Review & Submit
- **Application Summary**: Review all entered information
- **Document Confirmation**: List of uploaded documents
- **Declaration Confirmation**: Signature and acceptance
- **Submit Button**: Final submission

### 3. Auto-PDF Generation

#### Lambda Function: `generateMentorDeclarationPdf`
- **Trigger**: Called after mentor application submission
- **Input**: Application ID
- **Process**:
  1. Fetch application data from DynamoDB
  2. Generate PDF using PDFKit
  3. Include application details, declaration text, signature
  4. Upload PDF to S3 (`mentor-declarations/{applicationId}/`)
  5. Update application record with PDF URL

#### PDF Content
- **Header**: "MENTOR DECLARATION"
- **Application Details**: ID, date, applicant info
- **Declaration Text**: Legal terms and conditions
- **Documents List**: Uploaded document references
- **Digital Signature**: Applicant's typed signature
- **Footer**: Generation timestamp and platform info

### 4. Review Workflow

#### Admin Dashboard Access
- **URL**: `/admin/mentor-applications`
- **Access Control**: Admin role required
- **Features**:
  - View all applications with filtering
  - Review application details
  - Download documents and PDFs
  - Approve/Reject applications

#### Application Review Process
1. **Admin Views Application**: Complete form data and documents
2. **Document Download**: Access to all uploaded files
3. **PDF Review**: Download and review declaration PDF
4. **Decision Making**: Approve or reject with notes
5. **User Notification**: Email notification sent to applicant

#### Approval Process
- **Approval**: User added to Cognito "Mentor" group
- **Access Granted**: User gains access to Mentor Dashboard
- **Profile Creation**: Mentor profile created in DynamoDB
- **Notification**: Success email sent to user

#### Rejection Process
- **Rejection Reason**: Admin provides detailed feedback
- **User Notification**: Rejection email with reason
- **No Access**: User remains in original role
- **Reapplication**: User can apply again after improvements

## Technical Implementation

### Database Schema

#### MentorApplication Table
```graphql
type MentorApplication {
  id: ID!
  userId: ID!
  status: ApplicationStatus!
  submittedDate: AWSDateTime!
  reviewedDate: AWSDateTime
  reviewedBy: ID
  
  # Personal Information
  name: String!
  email: String!
  phone: String!
  expertise: String!
  linkedin: String
  portfolio: String
  bio: String!
  availability: String!
  
  # Documents
  documents: MentorDocuments!
  declarationPdf: String
  
  # Review
  reviewNotes: String
  rejectionReason: String
}

type MentorDocuments {
  govId: String!
  degree: String!
  resume: String!
}
```

#### MentorProfile Table
```graphql
type MentorProfile {
  id: ID!
  userId: ID!
  
  # Professional Details
  expertise: [String]!
  experience: Int!
  education: String
  certifications: [String]
  portfolio: String
  linkedinProfile: String
  
  # KSMP Specific
  ksmpPhase: KSMPPhase!
  maxCohortSize: Int!
  currentCohorts: Int!
  
  # Application Status
  applicationStatus: String!
  applicationDate: AWSDateTime!
  approvalDate: AWSDateTime
  
  # Statistics
  totalMentees: Int!
  averageRating: Float!
}
```

### S3 Storage Structure

```
kalpla-mentor-documents-{env}-{accountId}/
├── mentor-uploads/
│   └── {userId}/
│       ├── govId_{timestamp}.pdf
│       ├── degree_{timestamp}.pdf
│       └── resume_{timestamp}.pdf
└── mentor-declarations/
    └── {applicationId}/
        └── declaration-{timestamp}.pdf
```

### Lambda Function Details

#### PDF Generation Function
- **Runtime**: Node.js 18.x
- **Memory**: 512MB
- **Timeout**: 60 seconds
- **Dependencies**: AWS SDK, PDFKit
- **Permissions**: DynamoDB read/write, S3 upload

#### IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/MentorApplication-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::kalpla-mentor-documents-*/*"
    }
  ]
}
```

### GraphQL Mutations

#### Submit Application
```graphql
mutation SubmitMentorApplication($input: MentorApplicationInput!) {
  submitMentorApplication(input: $input) {
    id
    status
    submittedDate
  }
}
```

#### Generate PDF
```graphql
mutation GenerateDeclarationPdf($applicationId: ID!) {
  generateMentorDeclarationPdf(applicationId: $applicationId)
}
```

#### Review Application
```graphql
mutation ReviewMentorApplication(
  $applicationId: ID!
  $status: ApplicationStatus!
  $notes: String
) {
  reviewMentorApplication(
    applicationId: $applicationId
    status: $status
    notes: $notes
  ) {
    id
    status
    reviewedDate
    reviewNotes
  }
}
```

## Security Features

### Document Security
- **Private S3 Bucket**: All documents stored in private bucket
- **Signed URLs**: Temporary access URLs for document downloads
- **Access Control**: Only admins can access documents
- **Encryption**: S3 server-side encryption enabled

### Data Validation
- **File Type Validation**: Only PDF, JPEG, PNG allowed
- **File Size Limits**: Maximum 10MB per file
- **Required Fields**: All mandatory fields validated
- **Email Validation**: Proper email format validation

### Access Control
- **Admin Only**: Review page restricted to admin role
- **User Isolation**: Users can only see their own applications
- **Cognito Integration**: Role-based access control
- **JWT Validation**: All API calls validated with JWT tokens

## User Experience Features

### Progressive Form
- **Multi-step Process**: 4-step guided form
- **Progress Indicator**: Visual progress bar
- **Step Validation**: Real-time validation
- **Save Progress**: Form data persisted between steps

### File Upload
- **Drag & Drop**: Modern file upload interface
- **Progress Indicators**: Upload progress feedback
- **Error Handling**: Clear error messages
- **File Preview**: Uploaded file confirmation

### Responsive Design
- **Mobile Friendly**: Optimized for all devices
- **Touch Support**: Touch-friendly interface
- **Accessibility**: WCAG compliant design
- **Loading States**: Proper loading indicators

## Admin Features

### Application Management
- **Filtering**: Filter by status (All, Pending, Approved, Rejected)
- **Search**: Search by name, email, expertise
- **Bulk Actions**: Process multiple applications
- **Export**: Export application data

### Document Management
- **Secure Download**: Signed URLs for document access
- **PDF Generation**: Automatic declaration PDF creation
- **Document Preview**: In-browser document viewing
- **Audit Trail**: Complete application history

### Review Process
- **Detailed Review**: Complete application information
- **Notes System**: Add review notes and feedback
- **Approval Workflow**: Streamlined approve/reject process
- **Notification System**: Automatic user notifications

## Legal Compliance

### Declaration PDF
- **Legal Binding**: Legally binding declaration document
- **Digital Signature**: Recognized digital signature format
- **Timestamp**: Generation timestamp for legal validity
- **Audit Trail**: Complete application and review history

### Data Protection
- **GDPR Compliance**: European data protection compliance
- **Data Retention**: Configurable data retention policies
- **Right to Deletion**: User data deletion capabilities
- **Privacy Policy**: Clear privacy policy integration

## Monitoring & Analytics

### Application Metrics
- **Submission Rate**: Track application submissions
- **Approval Rate**: Monitor approval percentages
- **Processing Time**: Average review time tracking
- **User Engagement**: Track user interaction patterns

### Error Monitoring
- **CloudWatch Logs**: Comprehensive logging
- **Error Tracking**: Application error monitoring
- **Performance Metrics**: Lambda function performance
- **S3 Metrics**: Storage usage and access patterns

## Deployment & Maintenance

### Deployment Steps
1. **Deploy Lambda Function**: `amplify push`
2. **Create S3 Bucket**: Automatic bucket creation
3. **Update GraphQL Schema**: Deploy schema changes
4. **Configure Permissions**: Set up IAM roles
5. **Test Workflow**: End-to-end testing

### Maintenance Tasks
- **Regular Backups**: S3 and DynamoDB backups
- **Security Updates**: Regular security patches
- **Performance Monitoring**: Monitor system performance
- **User Feedback**: Collect and implement feedback

## Future Enhancements

### Planned Features
- **Video Interviews**: Optional video interview process
- **Reference Checks**: Automated reference verification
- **Skill Assessments**: Technical skill evaluation
- **Mentor Matching**: AI-powered mentor-student matching

### Integration Opportunities
- **Background Checks**: Third-party verification services
- **Payment Processing**: Mentor compensation system
- **Analytics Dashboard**: Advanced reporting and analytics
- **Mobile App**: Native mobile application

## Troubleshooting

### Common Issues

#### File Upload Failures
- **Check S3 Permissions**: Verify bucket permissions
- **File Size Limits**: Ensure files are under 10MB
- **Network Issues**: Check internet connectivity
- **Browser Compatibility**: Test in different browsers

#### PDF Generation Errors
- **Lambda Timeout**: Increase function timeout
- **Memory Issues**: Increase Lambda memory allocation
- **Dependencies**: Verify PDFKit installation
- **Permissions**: Check S3 upload permissions

#### Application Submission Issues
- **Validation Errors**: Check required fields
- **Network Timeout**: Retry submission
- **Authentication**: Verify user authentication
- **API Errors**: Check GraphQL schema

### Debug Commands

```bash
# Check Lambda logs
amplify logs generateMentorDeclarationPdf

# Test S3 access
aws s3 ls s3://kalpla-mentor-documents-dev-123456789012/

# Check DynamoDB
aws dynamodb scan --table-name MentorApplication-dev

# Test GraphQL
amplify console api
```

## Conclusion

The Mentor Onboarding Flow provides a comprehensive, secure, and user-friendly system for mentor applications. It includes:

✅ **Complete Application Process**: Multi-step form with validation
✅ **Document Management**: Secure file upload and storage
✅ **PDF Generation**: Automatic declaration PDF creation
✅ **Admin Review**: Streamlined approval workflow
✅ **Security**: Comprehensive security measures
✅ **Legal Compliance**: Legally binding declarations
✅ **User Experience**: Modern, responsive interface
✅ **Monitoring**: Complete system monitoring

The system is production-ready and can scale with the platform's growth while maintaining security and compliance standards.

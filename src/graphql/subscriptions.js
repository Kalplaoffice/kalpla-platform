/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse(
    $filter: ModelSubscriptionCourseFilterInput
    $owner: String
  ) {
    onCreateCourse(filter: $filter, owner: $owner) {
      id
      title
      description
      instructorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse(
    $filter: ModelSubscriptionCourseFilterInput
    $owner: String
  ) {
    onUpdateCourse(filter: $filter, owner: $owner) {
      id
      title
      description
      instructorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse(
    $filter: ModelSubscriptionCourseFilterInput
    $owner: String
  ) {
    onDeleteCourse(filter: $filter, owner: $owner) {
      id
      title
      description
      instructorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateDegreeProgram = /* GraphQL */ `
  subscription OnCreateDegreeProgram(
    $filter: ModelSubscriptionDegreeProgramFilterInput
  ) {
    onCreateDegreeProgram(filter: $filter) {
      id
      title
      slug
      description
      shortDescription
      duration
      mode
      schedule
      price
      currency
      thumbnail
      gallery
      syllabus {
        nextToken
        startedAt
        __typename
      }
      instructors {
        nextToken
        startedAt
        __typename
      }
      features
      advantages
      eligibility
      targetAudience
      prerequisites
      learningOutcomes
      certification
      status
      totalStudents
      revenue
      enrollmentCount
      rating
      reviews {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateDegreeProgram = /* GraphQL */ `
  subscription OnUpdateDegreeProgram(
    $filter: ModelSubscriptionDegreeProgramFilterInput
  ) {
    onUpdateDegreeProgram(filter: $filter) {
      id
      title
      slug
      description
      shortDescription
      duration
      mode
      schedule
      price
      currency
      thumbnail
      gallery
      syllabus {
        nextToken
        startedAt
        __typename
      }
      instructors {
        nextToken
        startedAt
        __typename
      }
      features
      advantages
      eligibility
      targetAudience
      prerequisites
      learningOutcomes
      certification
      status
      totalStudents
      revenue
      enrollmentCount
      rating
      reviews {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteDegreeProgram = /* GraphQL */ `
  subscription OnDeleteDegreeProgram(
    $filter: ModelSubscriptionDegreeProgramFilterInput
  ) {
    onDeleteDegreeProgram(filter: $filter) {
      id
      title
      slug
      description
      shortDescription
      duration
      mode
      schedule
      price
      currency
      thumbnail
      gallery
      syllabus {
        nextToken
        startedAt
        __typename
      }
      instructors {
        nextToken
        startedAt
        __typename
      }
      features
      advantages
      eligibility
      targetAudience
      prerequisites
      learningOutcomes
      certification
      status
      totalStudents
      revenue
      enrollmentCount
      rating
      reviews {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateSyllabusSection = /* GraphQL */ `
  subscription OnCreateSyllabusSection(
    $filter: ModelSubscriptionSyllabusSectionFilterInput
  ) {
    onCreateSyllabusSection(filter: $filter) {
      id
      title
      description
      order
      duration
      lessons {
        nextToken
        startedAt
        __typename
      }
      degreeProgramID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramSyllabusId
      __typename
    }
  }
`;
export const onUpdateSyllabusSection = /* GraphQL */ `
  subscription OnUpdateSyllabusSection(
    $filter: ModelSubscriptionSyllabusSectionFilterInput
  ) {
    onUpdateSyllabusSection(filter: $filter) {
      id
      title
      description
      order
      duration
      lessons {
        nextToken
        startedAt
        __typename
      }
      degreeProgramID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramSyllabusId
      __typename
    }
  }
`;
export const onDeleteSyllabusSection = /* GraphQL */ `
  subscription OnDeleteSyllabusSection(
    $filter: ModelSubscriptionSyllabusSectionFilterInput
  ) {
    onDeleteSyllabusSection(filter: $filter) {
      id
      title
      description
      order
      duration
      lessons {
        nextToken
        startedAt
        __typename
      }
      degreeProgramID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramSyllabusId
      __typename
    }
  }
`;
export const onCreateLesson = /* GraphQL */ `
  subscription OnCreateLesson($filter: ModelSubscriptionLessonFilterInput) {
    onCreateLesson(filter: $filter) {
      id
      title
      description
      content
      videoUrl
      duration
      order
      isPreview
      resources
      syllabusSectionID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      syllabusSectionLessonsId
      __typename
    }
  }
`;
export const onUpdateLesson = /* GraphQL */ `
  subscription OnUpdateLesson($filter: ModelSubscriptionLessonFilterInput) {
    onUpdateLesson(filter: $filter) {
      id
      title
      description
      content
      videoUrl
      duration
      order
      isPreview
      resources
      syllabusSectionID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      syllabusSectionLessonsId
      __typename
    }
  }
`;
export const onDeleteLesson = /* GraphQL */ `
  subscription OnDeleteLesson($filter: ModelSubscriptionLessonFilterInput) {
    onDeleteLesson(filter: $filter) {
      id
      title
      description
      content
      videoUrl
      duration
      order
      isPreview
      resources
      syllabusSectionID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      syllabusSectionLessonsId
      __typename
    }
  }
`;
export const onCreateInstructor = /* GraphQL */ `
  subscription OnCreateInstructor(
    $filter: ModelSubscriptionInstructorFilterInput
  ) {
    onCreateInstructor(filter: $filter) {
      id
      name
      bio
      profileImage
      email
      phone
      expertise
      experience
      education
      certifications
      linkedinProfile
      website
      rating
      programs {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateInstructor = /* GraphQL */ `
  subscription OnUpdateInstructor(
    $filter: ModelSubscriptionInstructorFilterInput
  ) {
    onUpdateInstructor(filter: $filter) {
      id
      name
      bio
      profileImage
      email
      phone
      expertise
      experience
      education
      certifications
      linkedinProfile
      website
      rating
      programs {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteInstructor = /* GraphQL */ `
  subscription OnDeleteInstructor(
    $filter: ModelSubscriptionInstructorFilterInput
  ) {
    onDeleteInstructor(filter: $filter) {
      id
      name
      bio
      profileImage
      email
      phone
      expertise
      experience
      education
      certifications
      linkedinProfile
      website
      rating
      programs {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateEnrollment = /* GraphQL */ `
  subscription OnCreateEnrollment(
    $filter: ModelSubscriptionEnrollmentFilterInput
    $owner: String
  ) {
    onCreateEnrollment(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      paymentStatus
      transactionId
      amount
      currency
      paymentMethod
      enrollmentDate
      completionDate
      progress
      certificateIssued
      certificateUrl
      refundRequested
      refundStatus
      refundAmount
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdateEnrollment = /* GraphQL */ `
  subscription OnUpdateEnrollment(
    $filter: ModelSubscriptionEnrollmentFilterInput
    $owner: String
  ) {
    onUpdateEnrollment(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      paymentStatus
      transactionId
      amount
      currency
      paymentMethod
      enrollmentDate
      completionDate
      progress
      certificateIssued
      certificateUrl
      refundRequested
      refundStatus
      refundAmount
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeleteEnrollment = /* GraphQL */ `
  subscription OnDeleteEnrollment(
    $filter: ModelSubscriptionEnrollmentFilterInput
    $owner: String
  ) {
    onDeleteEnrollment(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      paymentStatus
      transactionId
      amount
      currency
      paymentMethod
      enrollmentDate
      completionDate
      progress
      certificateIssued
      certificateUrl
      refundRequested
      refundStatus
      refundAmount
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onCreateReview(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      rating
      title
      comment
      isVerified
      helpful
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramReviewsId
      owner
      __typename
    }
  }
`;
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onUpdateReview(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      rating
      title
      comment
      isVerified
      helpful
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramReviewsId
      owner
      __typename
    }
  }
`;
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onDeleteReview(filter: $filter, owner: $owner) {
      id
      studentID
      degreeProgramID
      rating
      title
      comment
      isVerified
      helpful
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      degreeProgramReviewsId
      owner
      __typename
    }
  }
`;
export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment(
    $filter: ModelSubscriptionPaymentFilterInput
    $owner: String
  ) {
    onCreatePayment(filter: $filter, owner: $owner) {
      id
      enrollmentID
      amount
      currency
      paymentMethod
      transactionId
      status
      gateway
      gatewayOrderId
      gatewayPaymentId
      gatewaySignature
      refundAmount
      refundStatus
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment(
    $filter: ModelSubscriptionPaymentFilterInput
    $owner: String
  ) {
    onUpdatePayment(filter: $filter, owner: $owner) {
      id
      enrollmentID
      amount
      currency
      paymentMethod
      transactionId
      status
      gateway
      gatewayOrderId
      gatewayPaymentId
      gatewaySignature
      refundAmount
      refundStatus
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment(
    $filter: ModelSubscriptionPaymentFilterInput
    $owner: String
  ) {
    onDeletePayment(filter: $filter, owner: $owner) {
      id
      enrollmentID
      amount
      currency
      paymentMethod
      transactionId
      status
      gateway
      gatewayOrderId
      gatewayPaymentId
      gatewaySignature
      refundAmount
      refundStatus
      refundDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const onCreateProgramInstructors = /* GraphQL */ `
  subscription OnCreateProgramInstructors(
    $filter: ModelSubscriptionProgramInstructorsFilterInput
  ) {
    onCreateProgramInstructors(filter: $filter) {
      id
      degreeProgramId
      instructorId
      degreeProgram {
        id
        title
        slug
        description
        shortDescription
        duration
        mode
        schedule
        price
        currency
        thumbnail
        gallery
        features
        advantages
        eligibility
        targetAudience
        prerequisites
        learningOutcomes
        certification
        status
        totalStudents
        revenue
        enrollmentCount
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      instructor {
        id
        name
        bio
        profileImage
        email
        phone
        expertise
        experience
        education
        certifications
        linkedinProfile
        website
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateProgramInstructors = /* GraphQL */ `
  subscription OnUpdateProgramInstructors(
    $filter: ModelSubscriptionProgramInstructorsFilterInput
  ) {
    onUpdateProgramInstructors(filter: $filter) {
      id
      degreeProgramId
      instructorId
      degreeProgram {
        id
        title
        slug
        description
        shortDescription
        duration
        mode
        schedule
        price
        currency
        thumbnail
        gallery
        features
        advantages
        eligibility
        targetAudience
        prerequisites
        learningOutcomes
        certification
        status
        totalStudents
        revenue
        enrollmentCount
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      instructor {
        id
        name
        bio
        profileImage
        email
        phone
        expertise
        experience
        education
        certifications
        linkedinProfile
        website
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteProgramInstructors = /* GraphQL */ `
  subscription OnDeleteProgramInstructors(
    $filter: ModelSubscriptionProgramInstructorsFilterInput
  ) {
    onDeleteProgramInstructors(filter: $filter) {
      id
      degreeProgramId
      instructorId
      degreeProgram {
        id
        title
        slug
        description
        shortDescription
        duration
        mode
        schedule
        price
        currency
        thumbnail
        gallery
        features
        advantages
        eligibility
        targetAudience
        prerequisites
        learningOutcomes
        certification
        status
        totalStudents
        revenue
        enrollmentCount
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      instructor {
        id
        name
        bio
        profileImage
        email
        phone
        expertise
        experience
        education
        certifications
        linkedinProfile
        website
        rating
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;

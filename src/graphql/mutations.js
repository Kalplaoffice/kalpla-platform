/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const deleteEnrollment = /* GraphQL */ `
  mutation DeleteEnrollment(
    $input: DeleteEnrollmentInput!
    $condition: ModelEnrollmentConditionInput
  ) {
    deleteEnrollment(input: $input, condition: $condition) {
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
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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
export const deletePayment = /* GraphQL */ `
  mutation DeletePayment(
    $input: DeletePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    deletePayment(input: $input, condition: $condition) {
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
export const createDegreeProgram = /* GraphQL */ `
  mutation CreateDegreeProgram(
    $input: CreateDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    createDegreeProgram(input: $input, condition: $condition) {
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
export const updateDegreeProgram = /* GraphQL */ `
  mutation UpdateDegreeProgram(
    $input: UpdateDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    updateDegreeProgram(input: $input, condition: $condition) {
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
export const deleteDegreeProgram = /* GraphQL */ `
  mutation DeleteDegreeProgram(
    $input: DeleteDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    deleteDegreeProgram(input: $input, condition: $condition) {
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
export const createSyllabusSection = /* GraphQL */ `
  mutation CreateSyllabusSection(
    $input: CreateSyllabusSectionInput!
    $condition: ModelSyllabusSectionConditionInput
  ) {
    createSyllabusSection(input: $input, condition: $condition) {
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
export const updateSyllabusSection = /* GraphQL */ `
  mutation UpdateSyllabusSection(
    $input: UpdateSyllabusSectionInput!
    $condition: ModelSyllabusSectionConditionInput
  ) {
    updateSyllabusSection(input: $input, condition: $condition) {
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
export const deleteSyllabusSection = /* GraphQL */ `
  mutation DeleteSyllabusSection(
    $input: DeleteSyllabusSectionInput!
    $condition: ModelSyllabusSectionConditionInput
  ) {
    deleteSyllabusSection(input: $input, condition: $condition) {
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
export const createLesson = /* GraphQL */ `
  mutation CreateLesson(
    $input: CreateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    createLesson(input: $input, condition: $condition) {
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
export const updateLesson = /* GraphQL */ `
  mutation UpdateLesson(
    $input: UpdateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    updateLesson(input: $input, condition: $condition) {
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
export const deleteLesson = /* GraphQL */ `
  mutation DeleteLesson(
    $input: DeleteLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    deleteLesson(input: $input, condition: $condition) {
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
export const createInstructor = /* GraphQL */ `
  mutation CreateInstructor(
    $input: CreateInstructorInput!
    $condition: ModelInstructorConditionInput
  ) {
    createInstructor(input: $input, condition: $condition) {
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
export const updateInstructor = /* GraphQL */ `
  mutation UpdateInstructor(
    $input: UpdateInstructorInput!
    $condition: ModelInstructorConditionInput
  ) {
    updateInstructor(input: $input, condition: $condition) {
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
export const deleteInstructor = /* GraphQL */ `
  mutation DeleteInstructor(
    $input: DeleteInstructorInput!
    $condition: ModelInstructorConditionInput
  ) {
    deleteInstructor(input: $input, condition: $condition) {
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
export const createEnrollment = /* GraphQL */ `
  mutation CreateEnrollment(
    $input: CreateEnrollmentInput!
    $condition: ModelEnrollmentConditionInput
  ) {
    createEnrollment(input: $input, condition: $condition) {
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
export const updateEnrollment = /* GraphQL */ `
  mutation UpdateEnrollment(
    $input: UpdateEnrollmentInput!
    $condition: ModelEnrollmentConditionInput
  ) {
    updateEnrollment(input: $input, condition: $condition) {
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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
export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
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
export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
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
export const createProgramInstructors = /* GraphQL */ `
  mutation CreateProgramInstructors(
    $input: CreateProgramInstructorsInput!
    $condition: ModelProgramInstructorsConditionInput
  ) {
    createProgramInstructors(input: $input, condition: $condition) {
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
export const updateProgramInstructors = /* GraphQL */ `
  mutation UpdateProgramInstructors(
    $input: UpdateProgramInstructorsInput!
    $condition: ModelProgramInstructorsConditionInput
  ) {
    updateProgramInstructors(input: $input, condition: $condition) {
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
export const deleteProgramInstructors = /* GraphQL */ `
  mutation DeleteProgramInstructors(
    $input: DeleteProgramInstructorsInput!
    $condition: ModelProgramInstructorsConditionInput
  ) {
    deleteProgramInstructors(input: $input, condition: $condition) {
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

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
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
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCourses = /* GraphQL */ `
  query SyncCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCourses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getDegreeProgram = /* GraphQL */ `
  query GetDegreeProgram($id: ID!) {
    getDegreeProgram(id: $id) {
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
export const listDegreePrograms = /* GraphQL */ `
  query ListDegreePrograms(
    $filter: ModelDegreeProgramFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDegreePrograms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncDegreePrograms = /* GraphQL */ `
  query SyncDegreePrograms(
    $filter: ModelDegreeProgramFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncDegreePrograms(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getDegreeProgramBySlug = /* GraphQL */ `
  query GetDegreeProgramBySlug(
    $slug: String!
    $sortDirection: ModelSortDirection
    $filter: ModelDegreeProgramFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getDegreeProgramBySlug(
      slug: $slug
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getSyllabusSection = /* GraphQL */ `
  query GetSyllabusSection($id: ID!) {
    getSyllabusSection(id: $id) {
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
export const listSyllabusSections = /* GraphQL */ `
  query ListSyllabusSections(
    $filter: ModelSyllabusSectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSyllabusSections(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        order
        duration
        degreeProgramID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        degreeProgramSyllabusId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncSyllabusSections = /* GraphQL */ `
  query SyncSyllabusSections(
    $filter: ModelSyllabusSectionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncSyllabusSections(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        description
        order
        duration
        degreeProgramID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        degreeProgramSyllabusId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syllabusSectionsByDegreeProgramID = /* GraphQL */ `
  query SyllabusSectionsByDegreeProgramID(
    $degreeProgramID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSyllabusSectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    syllabusSectionsByDegreeProgramID(
      degreeProgramID: $degreeProgramID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        order
        duration
        degreeProgramID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        degreeProgramSyllabusId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getLesson = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
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
export const listLessons = /* GraphQL */ `
  query ListLessons(
    $filter: ModelLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncLessons = /* GraphQL */ `
  query SyncLessons(
    $filter: ModelLessonFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLessons(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const lessonsBySyllabusSectionID = /* GraphQL */ `
  query LessonsBySyllabusSectionID(
    $syllabusSectionID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lessonsBySyllabusSectionID(
      syllabusSectionID: $syllabusSectionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getInstructor = /* GraphQL */ `
  query GetInstructor($id: ID!) {
    getInstructor(id: $id) {
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
export const listInstructors = /* GraphQL */ `
  query ListInstructors(
    $filter: ModelInstructorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInstructors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncInstructors = /* GraphQL */ `
  query SyncInstructors(
    $filter: ModelInstructorFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncInstructors(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getEnrollment = /* GraphQL */ `
  query GetEnrollment($id: ID!) {
    getEnrollment(id: $id) {
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
export const listEnrollments = /* GraphQL */ `
  query ListEnrollments(
    $filter: ModelEnrollmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEnrollments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncEnrollments = /* GraphQL */ `
  query SyncEnrollments(
    $filter: ModelEnrollmentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEnrollments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const enrollmentsByStudentID = /* GraphQL */ `
  query EnrollmentsByStudentID(
    $studentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEnrollmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    enrollmentsByStudentID(
      studentID: $studentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const enrollmentsByDegreeProgramID = /* GraphQL */ `
  query EnrollmentsByDegreeProgramID(
    $degreeProgramID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEnrollmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    enrollmentsByDegreeProgramID(
      degreeProgramID: $degreeProgramID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncReviews = /* GraphQL */ `
  query SyncReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncReviews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const reviewsByDegreeProgramID = /* GraphQL */ `
  query ReviewsByDegreeProgramID(
    $degreeProgramID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByDegreeProgramID(
      degreeProgramID: $degreeProgramID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
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
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPayments = /* GraphQL */ `
  query SyncPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPayments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const paymentsByEnrollmentID = /* GraphQL */ `
  query PaymentsByEnrollmentID(
    $enrollmentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsByEnrollmentID(
      enrollmentID: $enrollmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getProgramInstructors = /* GraphQL */ `
  query GetProgramInstructors($id: ID!) {
    getProgramInstructors(id: $id) {
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
export const listProgramInstructors = /* GraphQL */ `
  query ListProgramInstructors(
    $filter: ModelProgramInstructorsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProgramInstructors(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        degreeProgramId
        instructorId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncProgramInstructors = /* GraphQL */ `
  query SyncProgramInstructors(
    $filter: ModelProgramInstructorsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProgramInstructors(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        degreeProgramId
        instructorId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const programInstructorsByDegreeProgramId = /* GraphQL */ `
  query ProgramInstructorsByDegreeProgramId(
    $degreeProgramId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelProgramInstructorsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    programInstructorsByDegreeProgramId(
      degreeProgramId: $degreeProgramId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        degreeProgramId
        instructorId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const programInstructorsByInstructorId = /* GraphQL */ `
  query ProgramInstructorsByInstructorId(
    $instructorId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelProgramInstructorsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    programInstructorsByInstructorId(
      instructorId: $instructorId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        degreeProgramId
        instructorId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

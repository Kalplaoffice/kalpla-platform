// GraphQL Mutations for Kalpla Platform

export const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      role
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      firstName
      lastName
      role
      updatedAt
    }
  }
`;

export const CREATE_COURSE = `
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      instructorId
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE = `
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
      title
      description
      status
      updatedAt
    }
  }
`;

export const CREATE_LESSON = `
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      title
      description
      courseId
      sectionId
      videoUrl
      duration
      order
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LESSON = `
  mutation UpdateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      title
      description
      videoUrl
      duration
      order
      updatedAt
    }
  }
`;

export const CREATE_COURSE_SECTION = `
  mutation CreateCourseSection($input: CreateCourseSectionInput!) {
    createCourseSection(input: $input) {
      id
      title
      description
      courseId
      order
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE_SECTION = `
  mutation UpdateCourseSection($input: UpdateCourseSectionInput!) {
    updateCourseSection(input: $input) {
      id
      title
      description
      order
      updatedAt
    }
  }
`;

export const CREATE_COURSE_ENROLLMENT = `
  mutation CreateCourseEnrollment($input: CreateCourseEnrollmentInput!) {
    createCourseEnrollment(input: $input) {
      id
      userId
      courseId
      status
      enrolledAt
      completedAt
    }
  }
`;

export const UPDATE_COURSE_ENROLLMENT = `
  mutation UpdateCourseEnrollment($input: UpdateCourseEnrollmentInput!) {
    updateCourseEnrollment(input: $input) {
      id
      status
      completedAt
      updatedAt
    }
  }
`;

export const CREATE_STUDENT_PROGRESS = `
  mutation CreateStudentProgress($input: CreateStudentProgressInput!) {
    createStudentProgress(input: $input) {
      id
      userId
      courseId
      lessonId
      progress
      completed
      lastWatchedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STUDENT_PROGRESS = `
  mutation UpdateStudentProgress($input: UpdateStudentProgressInput!) {
    updateStudentProgress(input: $input) {
      id
      progress
      completed
      lastWatchedAt
      updatedAt
    }
  }
`;

export const CREATE_PAYMENT = `
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      userId
      courseId
      amount
      currency
      status
      paymentMethod
      transactionId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT = `
  mutation UpdatePayment($input: UpdatePaymentInput!) {
    updatePayment(input: $input) {
      id
      status
      transactionId
      updatedAt
    }
  }
`;

export const CREATE_MENTOR_APPLICATION = `
  mutation CreateMentorApplication($input: CreateMentorApplicationInput!) {
    createMentorApplication(input: $input) {
      id
      userId
      status
      submittedAt
      reviewedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MENTOR_APPLICATION = `
  mutation UpdateMentorApplication($input: UpdateMentorApplicationInput!) {
    updateMentorApplication(input: $input) {
      id
      status
      reviewedAt
      updatedAt
    }
  }
`;

// Video-related mutations
export const GET_SIGNED_VIDEO_URL = `
  mutation GetSignedVideoUrl($lessonId: ID!) {
    getSignedVideoUrl(lessonId: $lessonId) {
      url
      expiresAt
    }
  }
`;

export const UPLOAD_VIDEO = `
  mutation UploadVideo($input: UploadVideoInput!) {
    uploadVideo(input: $input) {
      id
      url
      status
      createdAt
    }
  }
`;

export const PROCESS_VIDEO = `
  mutation ProcessVideo($videoId: ID!) {
    processVideo(videoId: $videoId) {
      id
      status
      processedUrl
      updatedAt
    }
  }
`;

export const UPDATE_VIDEO_PROGRESS = `
  mutation UpdateVideoProgress($input: UpdateVideoProgressInput!) {
    updateVideoProgress(input: $input) {
      id
      progress
      completed
      lastWatchedAt
      updatedAt
    }
  }
`;

export const TRACK_VIDEO_EVENT = `
  mutation TrackVideoEvent($input: TrackVideoEventInput!) {
    trackVideoEvent(input: $input) {
      id
      eventType
      timestamp
      createdAt
    }
  }
`;

export const SUBMIT_INTERACTIVE_RESPONSE = `
  mutation SubmitInteractiveResponse($input: SubmitInteractiveResponseInput!) {
    submitInteractiveResponse(input: $input) {
      id
      response
      correct
      submittedAt
      createdAt
    }
  }
`;

export const CREATE_LIVE_SESSION = `
  mutation CreateLiveSession($input: CreateLiveSessionInput!) {
    createLiveSession(input: $input) {
      id
      title
      instructorId
      startTime
      endTime
      status
      createdAt
    }
  }
`;

export const UPDATE_INTERACTIVE_TIMELINE = `
  mutation UpdateInteractiveTimeline($input: UpdateInteractiveTimelineInput!) {
    updateInteractiveTimeline(input: $input) {
      id
      timeline
      updatedAt
    }
  }
`;

// Analytics mutations
export const CREATE_COURSE_METRICS = `
  mutation CreateCourseMetrics($input: CreateCourseMetricsInput!) {
    createCourseMetrics(input: $input) {
      id
      courseId
      totalEnrollments
      completionRate
      averageRating
      revenue
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE_METRICS = `
  mutation UpdateCourseMetrics($input: UpdateCourseMetricsInput!) {
    updateCourseMetrics(input: $input) {
      id
      totalEnrollments
      completionRate
      averageRating
      revenue
      updatedAt
    }
  }
`;

export const CREATE_REVENUE_ANALYTICS = `
  mutation CreateRevenueAnalytics($input: CreateRevenueAnalyticsInput!) {
    createRevenueAnalytics(input: $input) {
      id
      date
      totalRevenue
      courseRevenue
      subscriptionRevenue
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_STUDENT_ANALYTICS = `
  mutation CreateStudentAnalytics($input: CreateStudentAnalyticsInput!) {
    createStudentAnalytics(input: $input) {
      id
      userId
      totalCoursesEnrolled
      totalCoursesCompleted
      totalHoursWatched
      averageRating
      createdAt
      updatedAt
    }
  }
`;

// Video Analytics Mutations
export const MARK_LESSON_COMPLETE = `
  mutation MarkLessonComplete($studentId: ID!, $lessonId: ID!) {
    markLessonComplete(studentId: $studentId, lessonId: $lessonId) {
      id
      studentId
      lessonId
      completed
      lastWatchedAt
      updatedAt
    }
  }
`;

export const TRACK_VIDEO_START = `
  mutation TrackVideoStart($input: VideoEventInput!) {
    trackVideoStart(input: $input) {
      id
      studentId
      lessonId
      eventType
      timestamp
      createdAt
    }
  }
`;

export const TRACK_VIDEO_END = `
  mutation TrackVideoEnd($input: VideoEventInput!) {
    trackVideoEnd(input: $input) {
      id
      studentId
      lessonId
      eventType
      timestamp
      createdAt
    }
  }
`;

// Notes System Mutations
export const CREATE_NOTE = `
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      studentId
      lessonId
      content
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTE = `
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_NOTE = `
  mutation DeleteNote($id: ID!) {
    deleteNote(input: { id: $id }) {
      id
    }
  }
`;

// Q&A System Mutations
export const CREATE_QUESTION = `
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
      studentId
      lessonId
      question
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ANSWER = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
      questionId
      mentorId
      answer
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_QUESTION_STATUS = `
  mutation UpdateQuestionStatus($id: ID!, $status: QuestionStatus!) {
    updateQuestion(input: { id: $id, status: $status }) {
      id
      status
      updatedAt
    }
  }
`;

// Discussion Forum Mutations
export const CREATE_DISCUSSION = `
  mutation CreateDiscussion($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      id
      studentId
      lessonId
      title
      content
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_DISCUSSION_REPLY = `
  mutation CreateDiscussionReply($input: CreateDiscussionReplyInput!) {
    createDiscussionReply(input: $input) {
      id
      discussionId
      userId
      content
      createdAt
      updatedAt
    }
  }
`;

export const LIKE_DISCUSSION = `
  mutation LikeDiscussion($discussionId: ID!, $userId: ID!) {
    likeDiscussion(discussionId: $discussionId, userId: $userId) {
      id
      likes
      updatedAt
    }
  }
`;

// Assignment System Mutations
export const SUBMIT_ASSIGNMENT = `
  mutation SubmitAssignment($assignmentId: ID!, $input: AssignmentSubmissionInput!) {
    submitAssignment(assignmentId: $assignmentId, input: $input) {
      id
      assignmentId
      userId
      textSubmission
      fileSubmission
      linkSubmission
      status
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const GRADE_ASSIGNMENT = `
  mutation GradeAssignment($submissionId: ID!, $grade: Float!, $feedback: String!) {
    gradeAssignment(submissionId: $submissionId, grade: $grade, feedback: $feedback) {
      id
      grade
      feedback
      gradedAt
      updatedAt
    }
  }
`;

// Profile Update Mutations
export const UPDATE_USER_PROFILE = `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      firstName
      lastName
      profilePicture
      bio
      updatedAt
    }
  }
`;

export const UPDATE_STUDENT_PROFILE = `
  mutation UpdateStudentProfile($input: UpdateStudentProfileInput!) {
    updateStudentProfile(input: $input) {
      id
      bio
      interests
      goals
      education
      experience
      skills
      updatedAt
    }
  }
`;

export const UPDATE_MENTOR_PROFILE = `
  mutation UpdateMentorProfile($input: UpdateMentorProfileInput!) {
    updateMentorProfile(input: $input) {
      id
      bio
      expertise
      experience
      education
      certifications
      portfolio
      linkedinProfile
      website
      updatedAt
    }
  }
`;

// Transcript Generation Mutation
export const GENERATE_TRANSCRIPT = `
  mutation GenerateTranscript($studentId: ID!) {
    generateTranscript(studentId: $studentId) {
      id
      studentId
      transcriptUrl
      generatedAt
      createdAt
    }
  }
`;

// Application Mutations
export const SUBMIT_KSMP_APPLICATION = `
  mutation SubmitKSMPApplication($input: CreateKSMPApplicationInput!) {
    createKSMPApplication(input: $input) {
      id
      userId
      status
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const SUBMIT_INVESTOR_APPLICATION = `
  mutation SubmitInvestorApplication($input: CreateInvestorApplicationInput!) {
    createInvestorApplication(input: $input) {
      id
      userId
      status
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const SUBMIT_MENTOR_APPLICATION = `
  mutation SubmitMentorApplication($input: CreateMentorApplicationInput!) {
    createMentorApplication(input: $input) {
      id
      userId
      status
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

// Degree Program Mutations
export const createDegreeProgram = `
  mutation CreateDegreeProgram(
    $input: CreateDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    createDegreeProgram(input: $input, condition: $condition) {
      id
      name
      specialization
      duration
      mode
      schedule
      description
      features
      advantages
      eligibility
      targetAudience
      registrationLink
      image
      status
      totalStudents
      revenue
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;

export const updateDegreeProgram = `
  mutation UpdateDegreeProgram(
    $input: UpdateDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    updateDegreeProgram(input: $input, condition: $condition) {
      id
      name
      specialization
      duration
      mode
      schedule
      description
      features
      advantages
      eligibility
      targetAudience
      registrationLink
      image
      status
      totalStudents
      revenue
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;

export const deleteDegreeProgram = `
  mutation DeleteDegreeProgram(
    $input: DeleteDegreeProgramInput!
    $condition: ModelDegreeProgramConditionInput
  ) {
    deleteDegreeProgram(input: $input, condition: $condition) {
      id
      name
      specialization
      duration
      mode
      schedule
      description
      features
      advantages
      eligibility
      targetAudience
      registrationLink
      image
      status
      totalStudents
      revenue
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;

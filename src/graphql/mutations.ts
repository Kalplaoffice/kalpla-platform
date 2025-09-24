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
      status
      updatedAt
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
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
      instructorId
      updatedAt
    }
  }
`;

export const DELETE_COURSE = `
  mutation DeleteCourse($input: DeleteCourseInput!) {
    deleteCourse(input: $input) {
      id
    }
  }
`;

export const CREATE_DEGREE_PROGRAM = `
  mutation CreateDegreeProgram($input: CreateDegreeProgramInput!) {
    createDegreeProgram(input: $input) {
      id
      title
      shortTitle
      description
      longDescription
      degreeType
      field
      duration
      totalCredits
      fee
      currency
      isActive
      isPublic
      careerProspects
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_DEGREE_PROGRAM = `
  mutation UpdateDegreeProgram($input: UpdateDegreeProgramInput!) {
    updateDegreeProgram(input: $input) {
      id
      title
      shortTitle
      description
      longDescription
      degreeType
      field
      duration
      totalCredits
      fee
      currency
      isActive
      isPublic
      careerProspects
      createdBy
      updatedBy
      updatedAt
    }
  }
`;

export const DELETE_DEGREE_PROGRAM = `
  mutation DeleteDegreeProgram($input: DeleteDegreeProgramInput!) {
    deleteDegreeProgram(input: $input) {
      id
    }
  }
`;

export const CREATE_PROGRAM_APPLICATION = `
  mutation CreateProgramApplication($input: CreateProgramApplicationInput!) {
    createProgramApplication(input: $input) {
      id
      programID
      studentID
      fullName
      email
      phone
      statementOfPurpose
      status
      submittedAt
      reviewedAt
      reviewedBy
      reviewNotes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROGRAM_APPLICATION = `
  mutation UpdateProgramApplication($input: UpdateProgramApplicationInput!) {
    updateProgramApplication(input: $input) {
      id
      programID
      studentID
      fullName
      email
      phone
      statementOfPurpose
      status
      submittedAt
      reviewedAt
      reviewedBy
      reviewNotes
      updatedAt
    }
  }
`;

export const DELETE_PROGRAM_APPLICATION = `
  mutation DeleteProgramApplication($input: DeleteProgramApplicationInput!) {
    deleteProgramApplication(input: $input) {
      id
    }
  }
`;

export const CREATE_BLOG_POST = `
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      content
      excerpt
      author
      publishedAt
      tags
      featuredImage
      status
      views
      likes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BLOG_POST = `
  mutation UpdateBlogPost($input: UpdateBlogPostInput!) {
    updateBlogPost(input: $input) {
      id
      title
      content
      excerpt
      author
      publishedAt
      tags
      featuredImage
      status
      views
      likes
      updatedAt
    }
  }
`;

export const DELETE_BLOG_POST = `
  mutation DeleteBlogPost($input: DeleteBlogPostInput!) {
    deleteBlogPost(input: $input) {
      id
    }
  }
`;

export const CREATE_LESSON = `
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
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
    }
  }
`;

export const UPDATE_LESSON = `
  mutation UpdateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_LESSON = `
  mutation DeleteLesson($input: DeleteLessonInput!) {
    deleteLesson(input: $input) {
      id
    }
  }
`;

export const CREATE_SYLLABUS_SECTION = `
  mutation CreateSyllabusSection($input: CreateSyllabusSectionInput!) {
    createSyllabusSection(input: $input) {
      id
      title
      description
      order
      programID
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SYLLABUS_SECTION = `
  mutation UpdateSyllabusSection($input: UpdateSyllabusSectionInput!) {
    updateSyllabusSection(input: $input) {
      id
      title
      description
      order
      programID
      updatedAt
    }
  }
`;

export const DELETE_SYLLABUS_SECTION = `
  mutation DeleteSyllabusSection($input: DeleteSyllabusSectionInput!) {
    deleteSyllabusSection(input: $input) {
      id
    }
  }
`;

export const CREATE_INSTRUCTOR = `
  mutation CreateInstructor($input: CreateInstructorInput!) {
    createInstructor(input: $input) {
      id
      name
      email
      bio
      specialties
      experience
      profilePicture
      linkedinUrl
      twitterUrl
      websiteUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INSTRUCTOR = `
  mutation UpdateInstructor($input: UpdateInstructorInput!) {
    updateInstructor(input: $input) {
      id
      name
      email
      bio
      specialties
      experience
      profilePicture
      linkedinUrl
      twitterUrl
      websiteUrl
      updatedAt
    }
  }
`;

export const DELETE_INSTRUCTOR = `
  mutation DeleteInstructor($input: DeleteInstructorInput!) {
    deleteInstructor(input: $input) {
      id
    }
  }
`;

export const CREATE_ADMISSION_REQUIREMENT = `
  mutation CreateAdmissionRequirement($input: CreateAdmissionRequirementInput!) {
    createAdmissionRequirement(input: $input) {
      id
      title
      description
      isRequired
      programID
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ADMISSION_REQUIREMENT = `
  mutation UpdateAdmissionRequirement($input: UpdateAdmissionRequirementInput!) {
    updateAdmissionRequirement(input: $input) {
      id
      title
      description
      isRequired
      programID
      updatedAt
    }
  }
`;

export const DELETE_ADMISSION_REQUIREMENT = `
  mutation DeleteAdmissionRequirement($input: DeleteAdmissionRequirementInput!) {
    deleteAdmissionRequirement(input: $input) {
      id
    }
  }
`;

export const CREATE_LEARNING_OUTCOME = `
  mutation CreateLearningOutcome($input: CreateLearningOutcomeInput!) {
    createLearningOutcome(input: $input) {
      id
      title
      description
      programID
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_LEARNING_OUTCOME = `
  mutation UpdateLearningOutcome($input: UpdateLearningOutcomeInput!) {
    updateLearningOutcome(input: $input) {
      id
      title
      description
      programID
      updatedAt
    }
  }
`;

export const DELETE_LEARNING_OUTCOME = `
  mutation DeleteLearningOutcome($input: DeleteLearningOutcomeInput!) {
    deleteLearningOutcome(input: $input) {
      id
    }
  }
`;

export const CREATE_CURRICULUM_PHASE = `
  mutation CreateCurriculumPhase($input: CreateCurriculumPhaseInput!) {
    createCurriculumPhase(input: $input) {
      id
      title
      description
      duration
      order
      programID
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CURRICULUM_PHASE = `
  mutation UpdateCurriculumPhase($input: UpdateCurriculumPhaseInput!) {
    updateCurriculumPhase(input: $input) {
      id
      title
      description
      duration
      order
      programID
      updatedAt
    }
  }
`;

export const DELETE_CURRICULUM_PHASE = `
  mutation DeleteCurriculumPhase($input: DeleteCurriculumPhaseInput!) {
    deleteCurriculumPhase(input: $input) {
      id
    }
  }
`;

export const CREATE_STARTUP_PROFILE = `
  mutation CreateStartupProfile($input: CreateStartupProfileInput!) {
    createStartupProfile(input: $input) {
      id
      name
      description
      industry
      stage
      funding
      teamSize
      location
      website
      linkedin
      twitter
      foundedYear
      logo
      coverImage
      pitchDeck
      businessModel
      marketSize
      competitiveAdvantage
      traction
      financials
      team
      advisors
      investors
      milestones
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STARTUP_PROFILE = `
  mutation UpdateStartupProfile($input: UpdateStartupProfileInput!) {
    updateStartupProfile(input: $input) {
      id
      name
      description
      industry
      stage
      funding
      teamSize
      location
      website
      linkedin
      twitter
      foundedYear
      logo
      coverImage
      pitchDeck
      businessModel
      marketSize
      competitiveAdvantage
      traction
      financials
      team
      advisors
      investors
      milestones
      updatedAt
    }
  }
`;

export const DELETE_STARTUP_PROFILE = `
  mutation DeleteStartupProfile($input: DeleteStartupProfileInput!) {
    deleteStartupProfile(input: $input) {
      id
    }
  }
`;

export const CREATE_INVESTMENT = `
  mutation CreateInvestment($input: CreateInvestmentInput!) {
    createInvestment(input: $input) {
      id
      investorId
      startupId
      amount
      equity
      investmentType
      status
      date
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INVESTMENT = `
  mutation UpdateInvestment($input: UpdateInvestmentInput!) {
    updateInvestment(input: $input) {
      id
      investorId
      startupId
      amount
      equity
      investmentType
      status
      date
      notes
      updatedAt
    }
  }
`;

export const DELETE_INVESTMENT = `
  mutation DeleteInvestment($input: DeleteInvestmentInput!) {
    deleteInvestment(input: $input) {
      id
    }
  }
`;

export const CREATE_FUNDING_ROUND = `
  mutation CreateFundingRound($input: CreateFundingRoundInput!) {
    createFundingRound(input: $input) {
      id
      startupId
      roundType
      amount
      valuation
      date
      leadInvestor
      participants
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FUNDING_ROUND = `
  mutation UpdateFundingRound($input: UpdateFundingRoundInput!) {
    updateFundingRound(input: $input) {
      id
      startupId
      roundType
      amount
      valuation
      date
      leadInvestor
      participants
      status
      updatedAt
    }
  }
`;

export const DELETE_FUNDING_ROUND = `
  mutation DeleteFundingRound($input: DeleteFundingRoundInput!) {
    deleteFundingRound(input: $input) {
      id
    }
  }
`;

export const CREATE_INVESTMENT_PORTFOLIO = `
  mutation CreateInvestmentPortfolio($input: CreateInvestmentPortfolioInput!) {
    createInvestmentPortfolio(input: $input) {
      id
      investorId
      totalInvested
      totalValue
      totalReturn
      returnPercentage
      activeInvestments
      exitedInvestments
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INVESTMENT_PORTFOLIO = `
  mutation UpdateInvestmentPortfolio($input: UpdateInvestmentPortfolioInput!) {
    updateInvestmentPortfolio(input: $input) {
      id
      investorId
      totalInvested
      totalValue
      totalReturn
      returnPercentage
      activeInvestments
      exitedInvestments
      updatedAt
    }
  }
`;

export const DELETE_INVESTMENT_PORTFOLIO = `
  mutation DeleteInvestmentPortfolio($input: DeleteInvestmentPortfolioInput!) {
    deleteInvestmentPortfolio(input: $input) {
      id
    }
  }
`;

export const CREATE_INVESTMENT_ANALYTICS = `
  mutation CreateInvestmentAnalytics($input: CreateInvestmentAnalyticsInput!) {
    createInvestmentAnalytics(input: $input) {
      id
      investorId
      period
      totalInvestments
      totalAmount
      averageInvestment
      topSectors
      topStages
      performanceMetrics
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INVESTMENT_ANALYTICS = `
  mutation UpdateInvestmentAnalytics($input: UpdateInvestmentAnalyticsInput!) {
    updateInvestmentAnalytics(input: $input) {
      id
      investorId
      period
      totalInvestments
      totalAmount
      averageInvestment
      topSectors
      topStages
      performanceMetrics
      updatedAt
    }
  }
`;

export const DELETE_INVESTMENT_ANALYTICS = `
  mutation DeleteInvestmentAnalytics($input: DeleteInvestmentAnalyticsInput!) {
    deleteInvestmentAnalytics(input: $input) {
      id
    }
  }
`;

export const CREATE_REVENUE_ANALYTICS = `
  mutation CreateRevenueAnalytics($input: CreateRevenueAnalyticsInput!) {
    createRevenueAnalytics(input: $input) {
      id
      organizationId
      period
      totalRevenue
      recurringRevenue
      oneTimeRevenue
      revenueGrowth
      averageRevenuePerUser
      churnRate
      customerAcquisitionCost
      lifetimeValue
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_REVENUE_ANALYTICS = `
  mutation UpdateRevenueAnalytics($input: UpdateRevenueAnalyticsInput!) {
    updateRevenueAnalytics(input: $input) {
      id
      organizationId
      period
      totalRevenue
      recurringRevenue
      oneTimeRevenue
      revenueGrowth
      averageRevenuePerUser
      churnRate
      customerAcquisitionCost
      lifetimeValue
      updatedAt
    }
  }
`;

export const DELETE_REVENUE_ANALYTICS = `
  mutation DeleteRevenueAnalytics($input: DeleteRevenueAnalyticsInput!) {
    deleteRevenueAnalytics(input: $input) {
      id
    }
  }
`;

export const CREATE_STUDENT_PROGRESS = `
  mutation CreateStudentProgress($input: CreateStudentProgressInput!) {
    createStudentProgress(input: $input) {
      id
      studentId
      courseId
      lessonId
      progress
      completed
      timeSpent
      lastAccessed
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STUDENT_PROGRESS = `
  mutation UpdateStudentProgress($input: UpdateStudentProgressInput!) {
    updateStudentProgress(input: $input) {
      id
      studentId
      courseId
      lessonId
      progress
      completed
      timeSpent
      lastAccessed
      updatedAt
    }
  }
`;

export const DELETE_STUDENT_PROGRESS = `
  mutation DeleteStudentProgress($input: DeleteStudentProgressInput!) {
    deleteStudentProgress(input: $input) {
      id
    }
  }
`;

export const CREATE_COURSE_METRICS = `
  mutation CreateCourseMetrics($input: CreateCourseMetricsInput!) {
    createCourseMetrics(input: $input) {
      id
      courseId
      totalEnrollments
      completionRate
      averageRating
      totalRevenue
      monthlyRevenue
      studentSatisfaction
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COURSE_METRICS = `
  mutation UpdateCourseMetrics($input: UpdateCourseMetricsInput!) {
    updateCourseMetrics(input: $input) {
      id
      courseId
      totalEnrollments
      completionRate
      averageRating
      totalRevenue
      monthlyRevenue
      studentSatisfaction
      updatedAt
    }
  }
`;

export const DELETE_COURSE_METRICS = `
  mutation DeleteCourseMetrics($input: DeleteCourseMetricsInput!) {
    deleteCourseMetrics(input: $input) {
      id
    }
  }
`;

export const CREATE_STUDENT_ANALYTICS = `
  mutation CreateStudentAnalytics($input: CreateStudentAnalyticsInput!) {
    createStudentAnalytics(input: $input) {
      id
      studentId
      totalCourses
      completedCourses
      totalTimeSpent
      averageRating
      certificatesEarned
      lastLogin
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STUDENT_ANALYTICS = `
  mutation UpdateStudentAnalytics($input: UpdateStudentAnalyticsInput!) {
    updateStudentAnalytics(input: $input) {
      id
      studentId
      totalCourses
      completedCourses
      totalTimeSpent
      averageRating
      certificatesEarned
      lastLogin
      updatedAt
    }
  }
`;

export const DELETE_STUDENT_ANALYTICS = `
  mutation DeleteStudentAnalytics($input: DeleteStudentAnalyticsInput!) {
    deleteStudentAnalytics(input: $input) {
      id
    }
  }
`;

export const CREATE_PAYMENT_ANALYTICS = `
  mutation CreatePaymentAnalytics($input: CreatePaymentAnalyticsInput!) {
    createPaymentAnalytics(input: $input) {
      id
      organizationId
      period
      totalTransactions
      totalAmount
      successfulTransactions
      failedTransactions
      averageTransactionValue
      paymentMethods
      refunds
      chargebacks
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_ANALYTICS = `
  mutation UpdatePaymentAnalytics($input: UpdatePaymentAnalyticsInput!) {
    updatePaymentAnalytics(input: $input) {
      id
      organizationId
      period
      totalTransactions
      totalAmount
      successfulTransactions
      failedTransactions
      averageTransactionValue
      paymentMethods
      refunds
      chargebacks
      updatedAt
    }
  }
`;

export const DELETE_PAYMENT_ANALYTICS = `
  mutation DeletePaymentAnalytics($input: DeletePaymentAnalyticsInput!) {
    deletePaymentAnalytics(input: $input) {
      id
    }
  }
`;

export const CREATE_VIDEO_ANALYTICS = `
  mutation CreateVideoAnalytics($input: CreateVideoAnalyticsInput!) {
    createVideoAnalytics(input: $input) {
      id
      videoId
      views
      watchTime
      completionRate
      engagement
      likes
      dislikes
      comments
      shares
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VIDEO_ANALYTICS = `
  mutation UpdateVideoAnalytics($input: UpdateVideoAnalyticsInput!) {
    updateVideoAnalytics(input: $input) {
      id
      videoId
      views
      watchTime
      completionRate
      engagement
      likes
      dislikes
      comments
      shares
      updatedAt
    }
  }
`;

export const DELETE_VIDEO_ANALYTICS = `
  mutation DeleteVideoAnalytics($input: DeleteVideoAnalyticsInput!) {
    deleteVideoAnalytics(input: $input) {
      id
    }
  }
`;

export const CREATE_VIDEO_PROGRESS = `
  mutation CreateVideoProgress($input: CreateVideoProgressInput!) {
    createVideoProgress(input: $input) {
      id
      studentId
      videoId
      progress
      completed
      timeSpent
      lastWatched
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VIDEO_PROGRESS = `
  mutation UpdateVideoProgress($input: UpdateVideoProgressInput!) {
    updateVideoProgress(input: $input) {
      id
      studentId
      videoId
      progress
      completed
      timeSpent
      lastWatched
      updatedAt
    }
  }
`;

export const TRACK_VIDEO_EVENT = `
  mutation TrackVideoEvent($input: TrackVideoEventInput!) {
    trackVideoEvent(input: $input) {
      id
      studentId
      videoId
      eventType
      timestamp
      createdAt
    }
  }
`;

export const DELETE_VIDEO_PROGRESS = `
  mutation DeleteVideoProgress($input: DeleteVideoProgressInput!) {
    deleteVideoProgress(input: $input) {
      id
    }
  }
`;

export const CREATE_INTERACTIVE_TIMELINE = `
  mutation CreateInteractiveTimeline($input: CreateInteractiveTimelineInput!) {
    createInteractiveTimeline(input: $input) {
      id
      videoId
      elements {
        timestamp
        type
        content
        options
        correctAnswer
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INTERACTIVE_TIMELINE = `
  mutation UpdateInteractiveTimeline($input: UpdateInteractiveTimelineInput!) {
    updateInteractiveTimeline(input: $input) {
      id
      videoId
      elements {
        timestamp
        type
        content
        options
        correctAnswer
      }
      updatedAt
    }
  }
`;

export const DELETE_INTERACTIVE_TIMELINE = `
  mutation DeleteInteractiveTimeline($input: DeleteInteractiveTimelineInput!) {
    deleteInteractiveTimeline(input: $input) {
      id
    }
  }
`;

export const CREATE_INTERACTIVE_ELEMENT = `
  mutation CreateInteractiveElement($input: CreateInteractiveElementInput!) {
    createInteractiveElement(input: $input) {
      id
      lessonId
      elementType
      title
      content
      timestamp
      duration
      options
      correctAnswer
      explanation
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INTERACTIVE_ELEMENT = `
  mutation UpdateInteractiveElement($input: UpdateInteractiveElementInput!) {
    updateInteractiveElement(input: $input) {
      id
      lessonId
      elementType
      title
      content
      timestamp
      duration
      options
      correctAnswer
      explanation
      isActive
      updatedAt
    }
  }
`;

export const DELETE_INTERACTIVE_ELEMENT = `
  mutation DeleteInteractiveElement($input: DeleteInteractiveElementInput!) {
    deleteInteractiveElement(input: $input) {
      id
    }
  }
`;

export const SUBMIT_QUIZ_RESPONSE = `
  mutation SubmitQuizResponse($input: CreateQuizResponseInput!) {
    createQuizResponse(input: $input) {
      id
      studentId
      elementId
      answer
      isCorrect
      score
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_VIDEO_ANNOTATION = `
  mutation CreateVideoAnnotation($input: CreateVideoAnnotationInput!) {
    createVideoAnnotation(input: $input) {
      id
      studentId
      lessonId
      timestamp
      content
      annotationType
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VIDEO_ANNOTATION = `
  mutation UpdateVideoAnnotation($input: UpdateVideoAnnotationInput!) {
    updateVideoAnnotation(input: $input) {
      id
      timestamp
      content
      annotationType
      isPublic
      updatedAt
    }
  }
`;

export const DELETE_VIDEO_ANNOTATION = `
  mutation DeleteVideoAnnotation($input: DeleteVideoAnnotationInput!) {
    deleteVideoAnnotation(input: $input) {
      id
    }
  }
`;

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

export const UPDATE_DISCUSSION = `
  mutation UpdateDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input) {
      id
      studentId
      lessonId
      title
      content
      likes
      updatedAt
    }
  }
`;

export const DELETE_DISCUSSION = `
  mutation DeleteDiscussion($input: DeleteDiscussionInput!) {
    deleteDiscussion(input: $input) {
      id
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

export const UPDATE_DISCUSSION_REPLY = `
  mutation UpdateDiscussionReply($input: UpdateDiscussionReplyInput!) {
    updateDiscussionReply(input: $input) {
      id
      discussionId
      userId
      content
      updatedAt
    }
  }
`;

export const DELETE_DISCUSSION_REPLY = `
  mutation DeleteDiscussionReply($input: DeleteDiscussionReplyInput!) {
    deleteDiscussionReply(input: $input) {
      id
    }
  }
`;

export const LIKE_DISCUSSION = `
  mutation LikeDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input) {
      id
      likes
    }
  }
`;

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
      studentId
      lessonId
      content
      timestamp
      updatedAt
    }
  }
`;

export const DELETE_NOTE = `
  mutation DeleteNote($input: DeleteNoteInput!) {
    deleteNote(input: $input) {
      id
    }
  }
`;

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

export const UPDATE_QUESTION = `
  mutation UpdateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      id
      studentId
      lessonId
      question
      status
      updatedAt
    }
  }
`;

export const DELETE_QUESTION = `
  mutation DeleteQuestion($input: DeleteQuestionInput!) {
    deleteQuestion(input: $input) {
      id
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

export const UPDATE_ANSWER = `
  mutation UpdateAnswer($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      id
      questionId
      mentorId
      answer
      updatedAt
    }
  }
`;

export const DELETE_ANSWER = `
  mutation DeleteAnswer($input: DeleteAnswerInput!) {
    deleteAnswer(input: $input) {
      id
    }
  }
`;

export const UPDATE_QUESTION_STATUS = `
  mutation UpdateQuestionStatus($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      id
      status
    }
  }
`;

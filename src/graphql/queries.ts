// GraphQL Queries for Kalpla Platform

export const GET_USER = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      firstName
      lastName
      role
      status
      profilePicture
      bio
      createdAt
      updatedAt
    }
  }
`;

export const LIST_USERS = `
  query ListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        firstName
        lastName
        role
        status
        profilePicture
        bio
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_COURSE = `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      title
      description
      instructorId
      createdAt
      updatedAt
    }
  }
`;

export const LIST_COURSES = `
  query ListCourses($filter: ModelCourseFilterInput, $limit: Int, $nextToken: String) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        instructorId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_DEGREE_PROGRAM = `
  query GetDegreeProgram($id: ID!) {
    getDegreeProgram(id: $id) {
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

export const LIST_DEGREE_PROGRAMS = `
  query ListDegreePrograms($filter: ModelDegreeProgramFilterInput, $limit: Int, $nextToken: String) {
    listDegreePrograms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_PROGRAM_APPLICATION = `
  query GetProgramApplication($id: ID!) {
    getProgramApplication(id: $id) {
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

export const LIST_PROGRAM_APPLICATIONS = `
  query ListProgramApplications($filter: ModelProgramApplicationFilterInput, $limit: Int, $nextToken: String) {
    listProgramApplications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_PROGRAM_APPLICATIONS_BY_STUDENT = `
  query ListProgramApplicationsByStudent($studentID: ID!, $sortDirection: ModelSortDirection, $filter: ModelProgramApplicationFilterInput, $limit: Int, $nextToken: String) {
    listProgramApplicationsByStudent(studentID: $studentID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_BLOG_POST = `
  query GetBlogPost($id: ID!) {
    getBlogPost(id: $id) {
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

export const LIST_BLOG_POSTS = `
  query ListBlogPosts($filter: ModelBlogPostFilterInput, $limit: Int, $nextToken: String) {
    listBlogPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_LESSON = `
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
    }
  }
`;

export const LIST_LESSONS = `
  query ListLessons($filter: ModelLessonFilterInput, $limit: Int, $nextToken: String) {
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
      }
      nextToken
    }
  }
`;

export const LIST_LESSONS_BY_SECTION = `
  query ListLessonsBySection($syllabusSectionID: ID!, $sortDirection: ModelSortDirection, $filter: ModelLessonFilterInput, $limit: Int, $nextToken: String) {
    listLessonsBySection(syllabusSectionID: $syllabusSectionID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      }
      nextToken
    }
  }
`;

export const GET_SYLLABUS_SECTION = `
  query GetSyllabusSection($id: ID!) {
    getSyllabusSection(id: $id) {
      id
      title
      description
      order
      programID
      lessons {
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
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIST_SYLLABUS_SECTIONS = `
  query ListSyllabusSections($filter: ModelSyllabusSectionFilterInput, $limit: Int, $nextToken: String) {
    listSyllabusSections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        order
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const LIST_SYLLABUS_SECTIONS_BY_PROGRAM = `
  query ListSyllabusSectionsByProgram($programID: ID!, $sortDirection: ModelSortDirection, $filter: ModelSyllabusSectionFilterInput, $limit: Int, $nextToken: String) {
    listSyllabusSectionsByProgram(programID: $programID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        order
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_INSTRUCTOR = `
  query GetInstructor($id: ID!) {
    getInstructor(id: $id) {
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

export const LIST_INSTRUCTORS = `
  query ListInstructors($filter: ModelInstructorFilterInput, $limit: Int, $nextToken: String) {
    listInstructors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_ADMISSION_REQUIREMENT = `
  query GetAdmissionRequirement($id: ID!) {
    getAdmissionRequirement(id: $id) {
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

export const LIST_ADMISSION_REQUIREMENTS = `
  query ListAdmissionRequirements($filter: ModelAdmissionRequirementFilterInput, $limit: Int, $nextToken: String) {
    listAdmissionRequirements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        isRequired
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const LIST_ADMISSION_REQUIREMENTS_BY_PROGRAM = `
  query ListAdmissionRequirementsByProgram($programID: ID!, $sortDirection: ModelSortDirection, $filter: ModelAdmissionRequirementFilterInput, $limit: Int, $nextToken: String) {
    listAdmissionRequirementsByProgram(programID: $programID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        isRequired
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_LEARNING_OUTCOME = `
  query GetLearningOutcome($id: ID!) {
    getLearningOutcome(id: $id) {
      id
      title
      description
      programID
      createdAt
      updatedAt
    }
  }
`;

export const LIST_LEARNING_OUTCOMES = `
  query ListLearningOutcomes($filter: ModelLearningOutcomeFilterInput, $limit: Int, $nextToken: String) {
    listLearningOutcomes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const LIST_LEARNING_OUTCOMES_BY_PROGRAM = `
  query ListLearningOutcomesByProgram($programID: ID!, $sortDirection: ModelSortDirection, $filter: ModelLearningOutcomeFilterInput, $limit: Int, $nextToken: String) {
    listLearningOutcomesByProgram(programID: $programID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_CURRICULUM_PHASE = `
  query GetCurriculumPhase($id: ID!) {
    getCurriculumPhase(id: $id) {
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

export const LIST_CURRICULUM_PHASES = `
  query ListCurriculumPhases($filter: ModelCurriculumPhaseFilterInput, $limit: Int, $nextToken: String) {
    listCurriculumPhases(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        duration
        order
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const LIST_CURRICULUM_PHASES_BY_PROGRAM = `
  query ListCurriculumPhasesByProgram($programID: ID!, $sortDirection: ModelSortDirection, $filter: ModelCurriculumPhaseFilterInput, $limit: Int, $nextToken: String) {
    listCurriculumPhasesByProgram(programID: $programID, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        duration
        order
        programID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_STARTUP_PROFILE = `
  query GetStartupProfile($id: ID!) {
    getStartupProfile(id: $id) {
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

export const LIST_STARTUP_PROFILES = `
  query ListStartupProfiles($filter: ModelStartupProfileFilterInput, $limit: Int, $nextToken: String) {
    listStartupProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_INVESTMENT = `
  query GetInvestment($id: ID!) {
    getInvestment(id: $id) {
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

export const LIST_INVESTMENTS = `
  query ListInvestments($filter: ModelInvestmentFilterInput, $limit: Int, $nextToken: String) {
    listInvestments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_INVESTMENTS_BY_INVESTOR = `
  query ListInvestmentsByInvestor($investorId: ID!, $sortDirection: ModelSortDirection, $filter: ModelInvestmentFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentsByInvestor(investorId: $investorId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_INVESTMENTS_BY_STARTUP = `
  query ListInvestmentsByStartup($startupId: ID!, $sortDirection: ModelSortDirection, $filter: ModelInvestmentFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentsByStartup(startupId: $startupId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_FUNDING_ROUND = `
  query GetFundingRound($id: ID!) {
    getFundingRound(id: $id) {
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

export const LIST_FUNDING_ROUNDS = `
  query ListFundingRounds($filter: ModelFundingRoundFilterInput, $limit: Int, $nextToken: String) {
    listFundingRounds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_FUNDING_ROUNDS_BY_STARTUP = `
  query ListFundingRoundsByStartup($startupId: ID!, $sortDirection: ModelSortDirection, $filter: ModelFundingRoundFilterInput, $limit: Int, $nextToken: String) {
    listFundingRoundsByStartup(startupId: $startupId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_INVESTMENT_PORTFOLIO = `
  query GetInvestmentPortfolio($id: ID!) {
    getInvestmentPortfolio(id: $id) {
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

export const LIST_INVESTMENT_PORTFOLIOS = `
  query ListInvestmentPortfolios($filter: ModelInvestmentPortfolioFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentPortfolios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_INVESTMENT_PORTFOLIOS_BY_INVESTOR = `
  query ListInvestmentPortfoliosByInvestor($investorId: ID!, $sortDirection: ModelSortDirection, $filter: ModelInvestmentPortfolioFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentPortfoliosByInvestor(investorId: $investorId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_INVESTMENT_ANALYTICS = `
  query GetInvestmentAnalytics($id: ID!) {
    getInvestmentAnalytics(id: $id) {
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

export const LIST_INVESTMENT_ANALYTICS = `
  query ListInvestmentAnalytics($filter: ModelInvestmentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_INVESTMENT_ANALYTICS_BY_INVESTOR = `
  query ListInvestmentAnalyticsByInvestor($investorId: ID!, $sortDirection: ModelSortDirection, $filter: ModelInvestmentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listInvestmentAnalyticsByInvestor(investorId: $investorId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_REVENUE_ANALYTICS = `
  query GetRevenueAnalytics($id: ID!) {
    getRevenueAnalytics(id: $id) {
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

export const LIST_REVENUE_ANALYTICS = `
  query ListRevenueAnalytics($filter: ModelRevenueAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listRevenueAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_REVENUE_ANALYTICS_BY_ORGANIZATION = `
  query ListRevenueAnalyticsByOrganization($organizationId: ID!, $sortDirection: ModelSortDirection, $filter: ModelRevenueAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listRevenueAnalyticsByOrganization(organizationId: $organizationId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_STUDENT_PROGRESS = `
  query GetStudentProgress($id: ID!) {
    getStudentProgress(id: $id) {
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

export const LIST_STUDENT_PROGRESS = `
  query ListStudentProgress($filter: ModelStudentProgressFilterInput, $limit: Int, $nextToken: String) {
    listStudentProgress(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_STUDENT_PROGRESS_BY_STUDENT = `
  query ListStudentProgressByStudent($studentId: ID!, $sortDirection: ModelSortDirection, $filter: ModelStudentProgressFilterInput, $limit: Int, $nextToken: String) {
    listStudentProgressByStudent(studentId: $studentId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_STUDENT_PROGRESS_BY_COURSE = `
  query ListStudentProgressByCourse($courseId: ID!, $sortDirection: ModelSortDirection, $filter: ModelStudentProgressFilterInput, $limit: Int, $nextToken: String) {
    listStudentProgressByCourse(courseId: $courseId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_COURSE_METRICS = `
  query GetCourseMetrics($id: ID!) {
    getCourseMetrics(id: $id) {
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

export const LIST_COURSE_METRICS = `
  query ListCourseMetrics($filter: ModelCourseMetricsFilterInput, $limit: Int, $nextToken: String) {
    listCourseMetrics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_COURSE_METRICS_BY_COURSE = `
  query ListCourseMetricsByCourse($courseId: ID!, $sortDirection: ModelSortDirection, $filter: ModelCourseMetricsFilterInput, $limit: Int, $nextToken: String) {
    listCourseMetricsByCourse(courseId: $courseId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_STUDENT_ANALYTICS = `
  query GetStudentAnalytics($id: ID!) {
    getStudentAnalytics(id: $id) {
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

export const LIST_STUDENT_ANALYTICS = `
  query ListStudentAnalytics($filter: ModelStudentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listStudentAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_STUDENT_ANALYTICS_BY_STUDENT = `
  query ListStudentAnalyticsByStudent($studentId: ID!, $sortDirection: ModelSortDirection, $filter: ModelStudentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listStudentAnalyticsByStudent(studentId: $studentId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_PAYMENT_ANALYTICS = `
  query GetPaymentAnalytics($id: ID!) {
    getPaymentAnalytics(id: $id) {
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

export const LIST_PAYMENT_ANALYTICS = `
  query ListPaymentAnalytics($filter: ModelPaymentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listPaymentAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_PAYMENT_ANALYTICS_BY_ORGANIZATION = `
  query ListPaymentAnalyticsByOrganization($organizationId: ID!, $sortDirection: ModelSortDirection, $filter: ModelPaymentAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listPaymentAnalyticsByOrganization(organizationId: $organizationId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_VIDEO_ANALYTICS = `
  query GetVideoAnalytics($id: ID!) {
    getVideoAnalytics(id: $id) {
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

export const LIST_VIDEO_ANALYTICS = `
  query ListVideoAnalytics($filter: ModelVideoAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listVideoAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_VIDEO_ANALYTICS_BY_VIDEO = `
  query ListVideoAnalyticsByVideo($videoId: ID!, $sortDirection: ModelSortDirection, $filter: ModelVideoAnalyticsFilterInput, $limit: Int, $nextToken: String) {
    listVideoAnalyticsByVideo(videoId: $videoId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_VIDEO_PROGRESS = `
  query GetVideoProgress($id: ID!) {
    getVideoProgress(id: $id) {
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

export const LIST_VIDEO_PROGRESS = `
  query ListVideoProgress($filter: ModelVideoProgressFilterInput, $limit: Int, $nextToken: String) {
    listVideoProgress(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_VIDEO_PROGRESS_BY_STUDENT = `
  query ListVideoProgressByStudent($studentId: ID!, $sortDirection: ModelSortDirection, $filter: ModelVideoProgressFilterInput, $limit: Int, $nextToken: String) {
    listVideoProgressByStudent(studentId: $studentId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_VIDEO_PROGRESS_BY_VIDEO = `
  query ListVideoProgressByVideo($videoId: ID!, $sortDirection: ModelSortDirection, $filter: ModelVideoProgressFilterInput, $limit: Int, $nextToken: String) {
    listVideoProgressByVideo(videoId: $videoId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_INTERACTIVE_TIMELINE = `
  query GetInteractiveTimeline($id: ID!) {
    getInteractiveTimeline(id: $id) {
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

export const LIST_INTERACTIVE_TIMELINES = `
  query ListInteractiveTimelines($filter: ModelInteractiveTimelineFilterInput, $limit: Int, $nextToken: String) {
    listInteractiveTimelines(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const LIST_INTERACTIVE_TIMELINES_BY_VIDEO = `
  query ListInteractiveTimelinesByVideo($videoId: ID!, $sortDirection: ModelSortDirection, $filter: ModelInteractiveTimelineFilterInput, $limit: Int, $nextToken: String) {
    listInteractiveTimelinesByVideo(videoId: $videoId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const GET_DISCUSSIONS_BY_LESSON = `
  query GetDiscussionsByLesson($lessonId: ID!) {
    getDiscussionsByLesson(lessonId: $lessonId) {
      items {
        id
        studentId
        lessonId
        title
        content
        likes
        replies {
          items {
            id
            userId
            content
            createdAt
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_DISCUSSION_REPLIES = `
  query GetDiscussionReplies($discussionId: ID!) {
    getDiscussionReplies(discussionId: $discussionId) {
      items {
        id
        discussionId
        userId
        content
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_NOTES = `
  query GetNotes($studentId: ID!, $lessonId: ID!) {
    listNotes(filter: { studentId: { eq: $studentId }, lessonId: { eq: $lessonId } }) {
      items {
        id
        studentId
        lessonId
        content
        timestamp
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_QUESTIONS = `
  query GetQuestions($lessonId: ID!) {
    listQuestions(filter: { lessonId: { eq: $lessonId } }) {
      items {
        id
        studentId
        lessonId
        question
        status
        answers {
          items {
            id
            questionId
            mentorId
            answer
            createdAt
            updatedAt
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_DISCUSSIONS = `
  query GetDiscussions($lessonId: ID!) {
    listDiscussions(filter: { lessonId: { eq: $lessonId } }) {
      items {
        id
        studentId
        lessonId
        title
        content
        replies {
          items {
            id
            discussionId
            authorId
            content
            createdAt
            updatedAt
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_LESSON_DETAILS = `
  query GetLessonDetails($id: ID!) {
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
    }
  }
`;

export const GET_INTERACTIVE_ELEMENTS = `
  query GetInteractiveElements($lessonId: ID!) {
    listInteractiveElements(filter: { lessonId: { eq: $lessonId } }) {
      items {
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
  }
`;

export const GET_QUIZ_RESPONSES = `
  query GetQuizResponses($studentId: ID!, $elementId: ID!) {
    listQuizResponses(filter: { studentId: { eq: $studentId }, elementId: { eq: $elementId } }) {
      items {
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
  }
`;

export const GET_VIDEO_ANNOTATIONS = `
  query GetVideoAnnotations($studentId: ID!, $lessonId: ID!) {
    listVideoAnnotations(filter: { studentId: { eq: $studentId }, lessonId: { eq: $lessonId } }) {
      items {
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
  }
`;

// Leader Queries
export const GET_LEADER = `
  query GetLeader($id: ID!) {
    getLeader(id: $id) {
      id
      name
      imageUrl
      brandName
      brandLogoUrl
      createdAt
      updatedAt
    }
  }
`;

export const LIST_LEADERS = `
  query ListLeaders($filter: ModelLeaderFilterInput, $limit: Int, $nextToken: String) {
    listLeaders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        imageUrl
        brandName
        brandLogoUrl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
// Assignment GraphQL Queries

export const LIST_ASSIGNMENTS = `
  query ListAssignments(
    $filter: ModelAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssignments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        courseID
        title
        description
        dueDate
        totalMarks
        fileUrl
        createdBy
        submissions {
          items {
            id
            studentID
            fileUrl
            submittedAt
            grade {
              id
              marksObtained
              feedback
              gradedBy
              gradedAt
            }
          }
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

export const GET_ASSIGNMENT = `
  query GetAssignment($id: ID!) {
    getAssignment(id: $id) {
      id
      courseID
      title
      description
      dueDate
      totalMarks
      fileUrl
      createdBy
      submissions {
        items {
          id
          studentID
          fileUrl
          submittedAt
          grade {
            id
            marksObtained
            feedback
            gradedBy
            gradedAt
          }
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const LIST_SUBMISSIONS = `
  query ListSubmissions(
    $filter: ModelSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubmissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        assignmentID
        studentID
        fileUrl
        submittedAt
        grade {
          id
          marksObtained
          feedback
          gradedBy
          gradedAt
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

export const GET_SUBMISSION = `
  query GetSubmission($id: ID!) {
    getSubmission(id: $id) {
      id
      assignmentID
      studentID
      fileUrl
      submittedAt
      grade {
        id
        marksObtained
        feedback
        gradedBy
        gradedAt
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const LIST_GRADES = `
  query ListGrades(
    $filter: ModelGradeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGrades(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        submissionID
        marksObtained
        feedback
        gradedBy
        gradedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

export const GET_GRADE = `
  query GetGrade($id: ID!) {
    getGrade(id: $id) {
      id
      submissionID
      marksObtained
      feedback
      gradedBy
      gradedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const ASSIGNMENTS_BY_COURSE = `
  query AssignmentsByCourse(
    $courseID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    assignmentsByCourse(
      courseID: $courseID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        courseID
        title
        description
        dueDate
        totalMarks
        fileUrl
        createdBy
        submissions {
          items {
            id
            studentID
            fileUrl
            submittedAt
            grade {
              id
              marksObtained
              feedback
              gradedBy
              gradedAt
            }
          }
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

export const SUBMISSIONS_BY_ASSIGNMENT = `
  query SubmissionsByAssignment(
    $assignmentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    submissionsByAssignment(
      assignmentID: $assignmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assignmentID
        studentID
        fileUrl
        submittedAt
        grade {
          id
          marksObtained
          feedback
          gradedBy
          gradedAt
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

export const SUBMISSIONS_BY_STUDENT = `
  query SubmissionsByStudent(
    $studentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    submissionsByStudent(
      studentID: $studentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assignmentID
        studentID
        fileUrl
        submittedAt
        grade {
          id
          marksObtained
          feedback
          gradedBy
          gradedAt
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

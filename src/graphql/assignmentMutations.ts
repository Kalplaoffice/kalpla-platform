// Assignment GraphQL Mutations

export const CREATE_ASSIGNMENT = `
  mutation CreateAssignment(
    $input: CreateAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    createAssignment(input: $input, condition: $condition) {
      id
      courseID
      title
      description
      dueDate
      totalMarks
      fileUrl
      createdBy
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const UPDATE_ASSIGNMENT = `
  mutation UpdateAssignment(
    $input: UpdateAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    updateAssignment(input: $input, condition: $condition) {
      id
      courseID
      title
      description
      dueDate
      totalMarks
      fileUrl
      createdBy
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const DELETE_ASSIGNMENT = `
  mutation DeleteAssignment(
    $input: DeleteAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    deleteAssignment(input: $input, condition: $condition) {
      id
      courseID
      title
      description
      dueDate
      totalMarks
      fileUrl
      createdBy
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const CREATE_SUBMISSION = `
  mutation CreateSubmission(
    $input: CreateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    createSubmission(input: $input, condition: $condition) {
      id
      assignmentID
      studentID
      fileUrl
      submittedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const UPDATE_SUBMISSION = `
  mutation UpdateSubmission(
    $input: UpdateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    updateSubmission(input: $input, condition: $condition) {
      id
      assignmentID
      studentID
      fileUrl
      submittedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const DELETE_SUBMISSION = `
  mutation DeleteSubmission(
    $input: DeleteSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    deleteSubmission(input: $input, condition: $condition) {
      id
      assignmentID
      studentID
      fileUrl
      submittedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const CREATE_GRADE = `
  mutation CreateGrade(
    $input: CreateGradeInput!
    $condition: ModelGradeConditionInput
  ) {
    createGrade(input: $input, condition: $condition) {
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

export const UPDATE_GRADE = `
  mutation UpdateGrade(
    $input: UpdateGradeInput!
    $condition: ModelGradeConditionInput
  ) {
    updateGrade(input: $input, condition: $condition) {
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

export const DELETE_GRADE = `
  mutation DeleteGrade(
    $input: DeleteGradeInput!
    $condition: ModelGradeConditionInput
  ) {
    deleteGrade(input: $input, condition: $condition) {
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

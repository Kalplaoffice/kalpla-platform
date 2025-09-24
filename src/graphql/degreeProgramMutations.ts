import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export const createDegreeProgram = `
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

export const updateDegreeProgram = `
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
      createdAt
      updatedAt
    }
  }
`;

export const deleteDegreeProgram = `
  mutation DeleteDegreeProgram($input: DeleteDegreeProgramInput!) {
    deleteDegreeProgram(input: $input) {
      id
    }
  }
`;

export const createCurriculumPhase = `
  mutation CreateCurriculumPhase($input: CreateCurriculumPhaseInput!) {
    createCurriculumPhase(input: $input) {
      id
      name
      description
      order
      duration
      isRequired
      prerequisites
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const updateCurriculumPhase = `
  mutation UpdateCurriculumPhase($input: UpdateCurriculumPhaseInput!) {
    updateCurriculumPhase(input: $input) {
      id
      name
      description
      order
      duration
      isRequired
      prerequisites
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const deleteCurriculumPhase = `
  mutation DeleteCurriculumPhase($input: DeleteCurriculumPhaseInput!) {
    deleteCurriculumPhase(input: $input) {
      id
    }
  }
`;

export const createPhaseCourse = `
  mutation CreatePhaseCourse($input: CreatePhaseCourseInput!) {
    createPhaseCourse(input: $input) {
      id
      courseId
      courseTitle
      courseDescription
      credits
      isRequired
      isElective
      order
      prerequisites
      curriculumPhaseID
      createdAt
      updatedAt
    }
  }
`;

export const updatePhaseCourse = `
  mutation UpdatePhaseCourse($input: UpdatePhaseCourseInput!) {
    updatePhaseCourse(input: $input) {
      id
      courseId
      courseTitle
      courseDescription
      credits
      isRequired
      isElective
      order
      prerequisites
      curriculumPhaseID
      createdAt
      updatedAt
    }
  }
`;

export const deletePhaseCourse = `
  mutation DeletePhaseCourse($input: DeletePhaseCourseInput!) {
    deletePhaseCourse(input: $input) {
      id
    }
  }
`;

export const createPhaseRequirement = `
  mutation CreatePhaseRequirement($input: CreatePhaseRequirementInput!) {
    createPhaseRequirement(input: $input) {
      id
      type
      value
      description
      isRequired
      curriculumPhaseID
      createdAt
      updatedAt
    }
  }
`;

export const updatePhaseRequirement = `
  mutation UpdatePhaseRequirement($input: UpdatePhaseRequirementInput!) {
    updatePhaseRequirement(input: $input) {
      id
      type
      value
      description
      isRequired
      curriculumPhaseID
      createdAt
      updatedAt
    }
  }
`;

export const deletePhaseRequirement = `
  mutation DeletePhaseRequirement($input: DeletePhaseRequirementInput!) {
    deletePhaseRequirement(input: $input) {
      id
    }
  }
`;

export const createAdmissionRequirement = `
  mutation CreateAdmissionRequirement($input: CreateAdmissionRequirementInput!) {
    createAdmissionRequirement(input: $input) {
      id
      type
      title
      description
      isRequired
      minValue
      maxValue
      unit
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const updateAdmissionRequirement = `
  mutation UpdateAdmissionRequirement($input: UpdateAdmissionRequirementInput!) {
    updateAdmissionRequirement(input: $input) {
      id
      type
      title
      description
      isRequired
      minValue
      maxValue
      unit
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const deleteAdmissionRequirement = `
  mutation DeleteAdmissionRequirement($input: DeleteAdmissionRequirementInput!) {
    deleteAdmissionRequirement(input: $input) {
      id
    }
  }
`;

export const createLearningOutcome = `
  mutation CreateLearningOutcome($input: CreateLearningOutcomeInput!) {
    createLearningOutcome(input: $input) {
      id
      title
      description
      category
      level
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const updateLearningOutcome = `
  mutation UpdateLearningOutcome($input: UpdateLearningOutcomeInput!) {
    updateLearningOutcome(input: $input) {
      id
      title
      description
      category
      level
      degreeProgramID
      createdAt
      updatedAt
    }
  }
`;

export const deleteLearningOutcome = `
  mutation DeleteLearningOutcome($input: DeleteLearningOutcomeInput!) {
    deleteLearningOutcome(input: $input) {
      id
    }
  }
`;

// Helper functions for executing mutations
export const degreeProgramMutations = {
  createDegreeProgram: async (input: any) => {
    return await client.graphql({
      query: createDegreeProgram,
      variables: { input }
    });
  },

  updateDegreeProgram: async (input: any) => {
    return await client.graphql({
      query: updateDegreeProgram,
      variables: { input }
    });
  },

  deleteDegreeProgram: async (input: any) => {
    return await client.graphql({
      query: deleteDegreeProgram,
      variables: { input }
    });
  },

  createCurriculumPhase: async (input: any) => {
    return await client.graphql({
      query: createCurriculumPhase,
      variables: { input }
    });
  },

  updateCurriculumPhase: async (input: any) => {
    return await client.graphql({
      query: updateCurriculumPhase,
      variables: { input }
    });
  },

  deleteCurriculumPhase: async (input: any) => {
    return await client.graphql({
      query: deleteCurriculumPhase,
      variables: { input }
    });
  },

  createPhaseCourse: async (input: any) => {
    return await client.graphql({
      query: createPhaseCourse,
      variables: { input }
    });
  },

  updatePhaseCourse: async (input: any) => {
    return await client.graphql({
      query: updatePhaseCourse,
      variables: { input }
    });
  },

  deletePhaseCourse: async (input: any) => {
    return await client.graphql({
      query: deletePhaseCourse,
      variables: { input }
    });
  },

  createPhaseRequirement: async (input: any) => {
    return await client.graphql({
      query: createPhaseRequirement,
      variables: { input }
    });
  },

  updatePhaseRequirement: async (input: any) => {
    return await client.graphql({
      query: updatePhaseRequirement,
      variables: { input }
    });
  },

  deletePhaseRequirement: async (input: any) => {
    return await client.graphql({
      query: deletePhaseRequirement,
      variables: { input }
    });
  },

  createAdmissionRequirement: async (input: any) => {
    return await client.graphql({
      query: createAdmissionRequirement,
      variables: { input }
    });
  },

  updateAdmissionRequirement: async (input: any) => {
    return await client.graphql({
      query: updateAdmissionRequirement,
      variables: { input }
    });
  },

  deleteAdmissionRequirement: async (input: any) => {
    return await client.graphql({
      query: deleteAdmissionRequirement,
      variables: { input }
    });
  },

  createLearningOutcome: async (input: any) => {
    return await client.graphql({
      query: createLearningOutcome,
      variables: { input }
    });
  },

  updateLearningOutcome: async (input: any) => {
    return await client.graphql({
      query: updateLearningOutcome,
      variables: { input }
    });
  },

  deleteLearningOutcome: async (input: any) => {
    return await client.graphql({
      query: deleteLearningOutcome,
      variables: { input }
    });
  }
};

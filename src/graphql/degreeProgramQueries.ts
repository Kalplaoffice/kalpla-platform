import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export const getDegreeProgram = `
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
      curriculumPhases {
        items {
          id
          name
          description
          order
          duration
          isRequired
          prerequisites
          createdAt
          updatedAt
          courses {
            items {
              id
              courseId
              courseTitle
              courseDescription
              credits
              isRequired
              isElective
              order
              prerequisites
              createdAt
              updatedAt
            }
          }
          requirements {
            items {
              id
              type
              value
              description
              isRequired
              createdAt
              updatedAt
            }
          }
        }
      }
      admissionRequirements {
        items {
          id
          type
          title
          description
          isRequired
          minValue
          maxValue
          unit
          createdAt
          updatedAt
        }
      }
      learningOutcomes {
        items {
          id
          title
          description
          category
          level
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const listDegreePrograms = `
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
        curriculumPhases {
          items {
            id
            name
            description
            order
            duration
            isRequired
            prerequisites
            createdAt
            updatedAt
          }
        }
        admissionRequirements {
          items {
            id
            type
            title
            description
            isRequired
            minValue
            maxValue
            unit
            createdAt
            updatedAt
          }
        }
        learningOutcomes {
          items {
            id
            title
            description
            category
            level
            createdAt
            updatedAt
          }
        }
      }
      nextToken
    }
  }
`;

export const getDegreeProgramsByStatus = `
  query GetDegreeProgramsByStatus($isActive: Boolean!, $isPublic: Boolean!) {
    listDegreePrograms(filter: {isActive: {eq: $isActive}, isPublic: {eq: $isPublic}}) {
      items {
        id
        title
        shortTitle
        description
        degreeType
        field
        duration
        totalCredits
        fee
        currency
        isActive
        isPublic
        careerProspects
        createdAt
        updatedAt
      }
    }
  }
`;

export const getDegreeProgramsByType = `
  query GetDegreeProgramsByType($degreeType: DegreeType!) {
    listDegreePrograms(filter: {degreeType: {eq: $degreeType}}) {
      items {
        id
        title
        shortTitle
        description
        degreeType
        field
        duration
        totalCredits
        fee
        currency
        isActive
        isPublic
        careerProspects
        createdAt
        updatedAt
      }
    }
  }
`;

export const getDegreeProgramsByField = `
  query GetDegreeProgramsByField($field: String!) {
    listDegreePrograms(filter: {field: {eq: $field}}) {
      items {
        id
        title
        shortTitle
        description
        degreeType
        field
        duration
        totalCredits
        fee
        currency
        isActive
        isPublic
        careerProspects
        createdAt
        updatedAt
      }
    }
  }
`;

export const getCurriculumPhase = `
  query GetCurriculumPhase($id: ID!) {
    getCurriculumPhase(id: $id) {
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
      courses {
        items {
          id
          courseId
          courseTitle
          courseDescription
          credits
          isRequired
          isElective
          order
          prerequisites
          createdAt
          updatedAt
        }
      }
      requirements {
        items {
          id
          type
          value
          description
          isRequired
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const listCurriculumPhases = `
  query ListCurriculumPhases($filter: ModelCurriculumPhaseFilterInput, $limit: Int, $nextToken: String) {
    listCurriculumPhases(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        courses {
          items {
            id
            courseId
            courseTitle
            courseDescription
            credits
            isRequired
            isElective
            order
            prerequisites
            createdAt
            updatedAt
          }
        }
        requirements {
          items {
            id
            type
            value
            description
            isRequired
            createdAt
            updatedAt
          }
        }
      }
      nextToken
    }
  }
`;

export const getCurriculumPhasesByProgram = `
  query GetCurriculumPhasesByProgram($degreeProgramID: ID!) {
    listCurriculumPhases(filter: {degreeProgramID: {eq: $degreeProgramID}}) {
      items {
        id
        name
        description
        order
        duration
        isRequired
        prerequisites
        createdAt
        updatedAt
        courses {
          items {
            id
            courseId
            courseTitle
            courseDescription
            credits
            isRequired
            isElective
            order
            prerequisites
            createdAt
            updatedAt
          }
        }
        requirements {
          items {
            id
            type
            value
            description
            isRequired
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export const getAdmissionRequirementsByProgram = `
  query GetAdmissionRequirementsByProgram($degreeProgramID: ID!) {
    listAdmissionRequirements(filter: {degreeProgramID: {eq: $degreeProgramID}}) {
      items {
        id
        type
        title
        description
        isRequired
        minValue
        maxValue
        unit
        createdAt
        updatedAt
      }
    }
  }
`;

export const getLearningOutcomesByProgram = `
  query GetLearningOutcomesByProgram($degreeProgramID: ID!) {
    listLearningOutcomes(filter: {degreeProgramID: {eq: $degreeProgramID}}) {
      items {
        id
        title
        description
        category
        level
        createdAt
        updatedAt
      }
    }
  }
`;

// Helper functions for executing queries
export const degreeProgramQueries = {
  getDegreeProgram: async (id: string) => {
    return await client.graphql({
      query: getDegreeProgram,
      variables: { id }
    });
  },

  listDegreePrograms: async (filter?: any, limit?: number, nextToken?: string) => {
    return await client.graphql({
      query: listDegreePrograms,
      variables: { filter, limit, nextToken }
    });
  },

  getDegreeProgramsByStatus: async (isActive: boolean, isPublic: boolean) => {
    return await client.graphql({
      query: getDegreeProgramsByStatus,
      variables: { isActive, isPublic }
    });
  },

  getDegreeProgramsByType: async (degreeType: string) => {
    return await client.graphql({
      query: getDegreeProgramsByType,
      variables: { degreeType }
    });
  },

  getDegreeProgramsByField: async (field: string) => {
    return await client.graphql({
      query: getDegreeProgramsByField,
      variables: { field }
    });
  },

  getCurriculumPhase: async (id: string) => {
    return await client.graphql({
      query: getCurriculumPhase,
      variables: { id }
    });
  },

  listCurriculumPhases: async (filter?: any, limit?: number, nextToken?: string) => {
    return await client.graphql({
      query: listCurriculumPhases,
      variables: { filter, limit, nextToken }
    });
  },

  getCurriculumPhasesByProgram: async (degreeProgramID: string) => {
    return await client.graphql({
      query: getCurriculumPhasesByProgram,
      variables: { degreeProgramID }
    });
  },

  getAdmissionRequirementsByProgram: async (degreeProgramID: string) => {
    return await client.graphql({
      query: getAdmissionRequirementsByProgram,
      variables: { degreeProgramID }
    });
  },

  getLearningOutcomesByProgram: async (degreeProgramID: string) => {
    return await client.graphql({
      query: getLearningOutcomesByProgram,
      variables: { degreeProgramID }
    });
  }
};

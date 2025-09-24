import { generateClient } from 'aws-amplify/data';
import amplifyconfig from '../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { 
  CREATE_ASSIGNMENT, 
  UPDATE_ASSIGNMENT, 
  DELETE_ASSIGNMENT,
  CREATE_SUBMISSION,
  UPDATE_SUBMISSION,
  DELETE_SUBMISSION,
  CREATE_GRADE,
  UPDATE_GRADE,
  DELETE_GRADE
} from '../graphql/assignmentMutations';
import { 
  LIST_ASSIGNMENTS, 
  GET_ASSIGNMENT,
  LIST_SUBMISSIONS,
  GET_SUBMISSION,
  LIST_GRADES,
  GET_GRADE,
  ASSIGNMENTS_BY_COURSE,
  SUBMISSIONS_BY_ASSIGNMENT,
  SUBMISSIONS_BY_STUDENT
} from '../graphql/assignmentQueries';

// Configure Amplify with API key authentication
const config = {
  ...amplifyconfig,
  aws_appsync_authenticationType: 'API_KEY'
};

Amplify.configure(config);

// Generate client with API key auth mode for server-side operations
const client = generateClient({
  authMode: 'apiKey'
});

// TypeScript interfaces
export interface Assignment {
  id: string;
  courseID: string;
  title: string;
  description?: string;
  dueDate?: string;
  totalMarks?: number;
  fileUrl?: string;
  createdBy: string;
  submissions?: Submission[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  assignmentID: string;
  studentID: string;
  fileUrl?: string;
  submittedAt?: string;
  grade?: Grade;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  submissionID: string;
  marksObtained?: number;
  feedback?: string;
  gradedBy: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFilters {
  courseID?: string;
  createdBy?: string;
  search?: string;
}

export interface SubmissionFilters {
  assignmentID?: string;
  studentID?: string;
  graded?: boolean;
}

export interface GradeFilters {
  submissionID?: string;
  gradedBy?: string;
}

class AssignmentService {
  // Assignment CRUD Operations
  async getAssignments(filters?: AssignmentFilters): Promise<Assignment[]> {
    try {
      console.log('Starting getAssignments with filters:', filters);
      
      let filter: any = {};
      
      if (filters?.courseID) {
        filter.courseID = { eq: filters.courseID };
      }
      
      if (filters?.createdBy) {
        filter.createdBy = { eq: filters.createdBy };
      }

      if (filters?.search) {
        filter.or = [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } }
        ];
      }

      console.log('GraphQL filter:', filter);

      const { data } = await client.graphql({
        query: LIST_ASSIGNMENTS,
        variables: {
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      });

      console.log('GraphQL response:', data);
      return data.listAssignments.items as Assignment[];
    } catch (error) {
      console.error('Error in getAssignments:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      
      // Return empty array to trigger fallback in the component
      return [];
    }
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    try {
      const { data } = await client.graphql({
        query: GET_ASSIGNMENT,
        variables: { id }
      });

      return data.getAssignment as Assignment;
    } catch (error) {
      console.error('Error in getAssignment:', error);
      throw error;
    }
  }

  async createAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Assignment> {
    try {
      const { data } = await client.graphql({
        query: CREATE_ASSIGNMENT,
        variables: {
          input: assignmentData
        }
      });

      return data.createAssignment as Assignment;
    } catch (error) {
      console.error('Error in createAssignment:', error);
      throw error;
    }
  }

  async updateAssignment(id: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    try {
      const { data } = await client.graphql({
        query: UPDATE_ASSIGNMENT,
        variables: {
          input: {
            id,
            ...assignmentData
          }
        }
      });

      return data.updateAssignment as Assignment;
    } catch (error) {
      console.error('Error in updateAssignment:', error);
      throw error;
    }
  }

  async deleteAssignment(id: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_ASSIGNMENT,
        variables: {
          input: { id }
        }
      });
    } catch (error) {
      console.error('Error in deleteAssignment:', error);
      throw error;
    }
  }

  // Submission CRUD Operations
  async getSubmissions(filters?: SubmissionFilters): Promise<Submission[]> {
    try {
      let filter: any = {};
      
      if (filters?.assignmentID) {
        filter.assignmentID = { eq: filters.assignmentID };
      }
      
      if (filters?.studentID) {
        filter.studentID = { eq: filters.studentID };
      }

      const { data } = await client.graphql({
        query: LIST_SUBMISSIONS,
        variables: {
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      });

      return data.listSubmissions.items as Submission[];
    } catch (error) {
      console.error('Error in getSubmissions:', error);
      return [];
    }
  }

  async getSubmission(id: string): Promise<Submission | null> {
    try {
      const { data } = await client.graphql({
        query: GET_SUBMISSION,
        variables: { id }
      });

      return data.getSubmission as Submission;
    } catch (error) {
      console.error('Error in getSubmission:', error);
      throw error;
    }
  }

  async createSubmission(submissionData: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Submission> {
    try {
      const { data } = await client.graphql({
        query: CREATE_SUBMISSION,
        variables: {
          input: {
            ...submissionData,
            submittedAt: new Date().toISOString()
          }
        }
      });

      return data.createSubmission as Submission;
    } catch (error) {
      console.error('Error in createSubmission:', error);
      throw error;
    }
  }

  async updateSubmission(id: string, submissionData: Partial<Submission>): Promise<Submission> {
    try {
      const { data } = await client.graphql({
        query: UPDATE_SUBMISSION,
        variables: {
          input: {
            id,
            ...submissionData
          }
        }
      });

      return data.updateSubmission as Submission;
    } catch (error) {
      console.error('Error in updateSubmission:', error);
      throw error;
    }
  }

  async deleteSubmission(id: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_SUBMISSION,
        variables: {
          input: { id }
        }
      });
    } catch (error) {
      console.error('Error in deleteSubmission:', error);
      throw error;
    }
  }

  // Grade CRUD Operations
  async getGrades(filters?: GradeFilters): Promise<Grade[]> {
    try {
      let filter: any = {};
      
      if (filters?.submissionID) {
        filter.submissionID = { eq: filters.submissionID };
      }
      
      if (filters?.gradedBy) {
        filter.gradedBy = { eq: filters.gradedBy };
      }

      const { data } = await client.graphql({
        query: LIST_GRADES,
        variables: {
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      });

      return data.listGrades.items as Grade[];
    } catch (error) {
      console.error('Error in getGrades:', error);
      return [];
    }
  }

  async getGrade(id: string): Promise<Grade | null> {
    try {
      const { data } = await client.graphql({
        query: GET_GRADE,
        variables: { id }
      });

      return data.getGrade as Grade;
    } catch (error) {
      console.error('Error in getGrade:', error);
      throw error;
    }
  }

  async createGrade(gradeData: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Grade> {
    try {
      const { data } = await client.graphql({
        query: CREATE_GRADE,
        variables: {
          input: {
            ...gradeData,
            gradedAt: new Date().toISOString()
          }
        }
      });

      return data.createGrade as Grade;
    } catch (error) {
      console.error('Error in createGrade:', error);
      throw error;
    }
  }

  async updateGrade(id: string, gradeData: Partial<Grade>): Promise<Grade> {
    try {
      const { data } = await client.graphql({
        query: UPDATE_GRADE,
        variables: {
          input: {
            id,
            ...gradeData
          }
        }
      });

      return data.updateGrade as Grade;
    } catch (error) {
      console.error('Error in updateGrade:', error);
      throw error;
    }
  }

  async deleteGrade(id: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_GRADE,
        variables: {
          input: { id }
        }
      });
    } catch (error) {
      console.error('Error in deleteGrade:', error);
      throw error;
    }
  }

  // Specialized queries
  async getAssignmentsByCourse(courseID: string): Promise<Assignment[]> {
    try {
      const { data } = await client.graphql({
        query: ASSIGNMENTS_BY_COURSE,
        variables: {
          courseID,
          sortDirection: 'DESC'
        }
      });

      return data.assignmentsByCourse.items as Assignment[];
    } catch (error) {
      console.error('Error in getAssignmentsByCourse:', error);
      return [];
    }
  }

  async getSubmissionsByAssignment(assignmentID: string): Promise<Submission[]> {
    try {
      const { data } = await client.graphql({
        query: SUBMISSIONS_BY_ASSIGNMENT,
        variables: {
          assignmentID,
          sortDirection: 'DESC'
        }
      });

      return data.submissionsByAssignment.items as Submission[];
    } catch (error) {
      console.error('Error in getSubmissionsByAssignment:', error);
      return [];
    }
  }

  async getSubmissionsByStudent(studentID: string): Promise<Submission[]> {
    try {
      const { data } = await client.graphql({
        query: SUBMISSIONS_BY_STUDENT,
        variables: {
          studentID,
          sortDirection: 'DESC'
        }
      });

      return data.submissionsByStudent.items as Submission[];
    } catch (error) {
      console.error('Error in getSubmissionsByStudent:', error);
      return [];
    }
  }

  // Analytics methods
  async getAssignmentAnalytics(assignmentID: string): Promise<{
    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;
    averageGrade: number;
    submissionRate: number;
  }> {
    try {
      const submissions = await this.getSubmissionsByAssignment(assignmentID);
      const assignment = await this.getAssignment(assignmentID);
      
      const totalSubmissions = submissions.length;
      const gradedSubmissions = submissions.filter(s => s.grade).length;
      const pendingSubmissions = totalSubmissions - gradedSubmissions;
      
      const grades = submissions
        .filter(s => s.grade?.marksObtained)
        .map(s => s.grade!.marksObtained!);
      
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
        : 0;

      // Assuming we have a way to get total enrolled students
      const submissionRate = totalSubmissions > 0 ? (totalSubmissions / 100) * 100 : 0; // Placeholder

      return {
        totalSubmissions,
        gradedSubmissions,
        pendingSubmissions,
        averageGrade: Math.round(averageGrade * 100) / 100,
        submissionRate: Math.round(submissionRate * 100) / 100
      };
    } catch (error) {
      console.error('Error in getAssignmentAnalytics:', error);
      return {
        totalSubmissions: 0,
        gradedSubmissions: 0,
        pendingSubmissions: 0,
        averageGrade: 0,
        submissionRate: 0
      };
    }
  }
}

export const assignmentService = new AssignmentService();
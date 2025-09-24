import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { degreeProgramMutations } from '@/graphql/degreeProgramMutations';
import { degreeProgramQueries } from '@/graphql/degreeProgramQueries';

const client = generateClient<Schema>();

export interface CurriculumPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  duration: number; // in weeks
  courses: PhaseCourse[];
  requirements: PhaseRequirement[];
  isRequired: boolean;
  prerequisites?: string[]; // Phase IDs that must be completed first
}

export interface PhaseCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  credits: number;
  isRequired: boolean;
  isElective: boolean;
  order: number;
  prerequisites?: string[]; // Course IDs that must be completed first
}

export interface PhaseRequirement {
  id: string;
  type: 'minimum_credits' | 'minimum_courses' | 'specific_course' | 'gpa_requirement';
  value: number | string;
  description: string;
  isRequired: boolean;
}

export interface DegreeProgram {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  degreeType: 'bachelor' | 'master' | 'certificate' | 'diploma' | 'phd';
  field: string; // e.g., 'Computer Science', 'Business Administration'
  duration: number; // in months
  totalCredits: number;
  fee: number;
  currency: string;
  isActive: boolean;
  isPublic: boolean;
  curriculumPhases: CurriculumPhase[];
  admissionRequirements: AdmissionRequirement[];
  learningOutcomes: LearningOutcome[];
  careerProspects: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AdmissionRequirement {
  id: string;
  type: 'education' | 'experience' | 'test_score' | 'portfolio' | 'interview' | 'other';
  title: string;
  description: string;
  isRequired: boolean;
  minValue?: number; // for test scores, years of experience, etc.
  maxValue?: number;
  unit?: string; // years, months, score, etc.
}

export interface LearningOutcome {
  id: string;
  title: string;
  description: string;
  category: 'knowledge' | 'skills' | 'competencies' | 'attitudes';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

class DegreeProgramService {
  /**
   * Create a new degree program
   */
  async createDegreeProgram(programData: Omit<DegreeProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<DegreeProgram> {
    try {
      console.log('Creating degree program:', programData.title);
      
      // Prepare the input data for GraphQL
      const input = {
        title: programData.title,
        shortTitle: programData.shortTitle,
        description: programData.description,
        longDescription: programData.longDescription,
        degreeType: programData.degreeType,
        field: programData.field,
        duration: programData.duration,
        totalCredits: programData.totalCredits,
        fee: programData.fee,
        currency: programData.currency,
        isActive: programData.isActive,
        isPublic: programData.isPublic,
        careerProspects: programData.careerProspects,
        createdBy: programData.createdBy,
        updatedBy: programData.updatedBy
      };

      const result = await degreeProgramMutations.createDegreeProgram(input);
      
      if (result.data?.createDegreeProgram) {
        const createdProgram = result.data.createDegreeProgram;
        
        // Create curriculum phases
        if (programData.curriculumPhases && programData.curriculumPhases.length > 0) {
          for (const phase of programData.curriculumPhases) {
            await this.createCurriculumPhase(createdProgram.id, phase);
          }
        }
        
        // Create admission requirements
        if (programData.admissionRequirements && programData.admissionRequirements.length > 0) {
          for (const requirement of programData.admissionRequirements) {
            await this.createAdmissionRequirement(createdProgram.id, requirement);
          }
        }
        
        // Create learning outcomes
        if (programData.learningOutcomes && programData.learningOutcomes.length > 0) {
          for (const outcome of programData.learningOutcomes) {
            await this.createLearningOutcome(createdProgram.id, outcome);
          }
        }
        
        return await this.getDegreeProgram(createdProgram.id) || createdProgram;
      }
      
      throw new Error('Failed to create degree program');
    } catch (error) {
      console.error('Error creating degree program:', error);
      throw new Error('Failed to create degree program');
    }
  }

  /**
   * Get all degree programs
   */
  async getDegreePrograms(): Promise<DegreeProgram[]> {
    try {
      console.log('Getting degree programs');
      
      const result = await degreeProgramQueries.listDegreePrograms();
      
      if (result.data?.listDegreePrograms?.items) {
        return result.data.listDegreePrograms.items.map(this.transformGraphQLToDegreeProgram);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting degree programs:', error);
      return [];
    }
  }

  /**
   * Get degree program by ID
   */
  async getDegreeProgram(programId: string): Promise<DegreeProgram | null> {
    try {
      console.log('Getting degree program:', programId);
      
      const result = await degreeProgramQueries.getDegreeProgram(programId);
      
      if (result.data?.getDegreeProgram) {
        return this.transformGraphQLToDegreeProgram(result.data.getDegreeProgram);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting degree program:', error);
      return null;
    }
  }

  /**
   * Update degree program
   */
  async updateDegreeProgram(programId: string, updates: Partial<DegreeProgram>): Promise<DegreeProgram> {
    try {
      console.log('Updating degree program:', programId);
      
      const input = {
        id: programId,
        ...updates,
        updatedBy: 'current-admin-id'
      };

      const result = await degreeProgramMutations.updateDegreeProgram(input);
      
      if (result.data?.updateDegreeProgram) {
        return this.transformGraphQLToDegreeProgram(result.data.updateDegreeProgram);
      }
      
      throw new Error('Failed to update degree program');
    } catch (error) {
      console.error('Error updating degree program:', error);
      throw new Error('Failed to update degree program');
    }
  }

  /**
   * Delete degree program
   */
  async deleteDegreeProgram(programId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Deleting degree program:', programId);
      
      const result = await degreeProgramMutations.deleteDegreeProgram({ id: programId });
      
      if (result.data?.deleteDegreeProgram) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to delete degree program' };
    } catch (error) {
      console.error('Error deleting degree program:', error);
      return { success: false, error: 'Failed to delete degree program' };
    }
  }

  /**
   * Get available courses for degree program
   */
  async getAvailableCourses(): Promise<any[]> {
    try {
      console.log('Getting available courses');
      
      // Simulate available courses
      const courses = [
        {
          id: 'cs101',
          title: 'Introduction to Programming',
          description: 'Learn basic programming concepts and problem-solving',
          credits: 3,
          duration: 12, // weeks
          level: 'beginner'
        },
        {
          id: 'cs102',
          title: 'Data Structures and Algorithms',
          description: 'Fundamental data structures and algorithmic thinking',
          credits: 4,
          duration: 14,
          level: 'intermediate'
        }
      ];
      
      return courses;
    } catch (error) {
      console.error('Error getting available courses:', error);
      return [];
    }
  }

  /**
   * Create curriculum phase
   */
  private async createCurriculumPhase(degreeProgramID: string, phase: CurriculumPhase): Promise<void> {
    try {
      const input = {
        name: phase.name,
        description: phase.description,
        order: phase.order,
        duration: phase.duration,
        isRequired: phase.isRequired,
        prerequisites: phase.prerequisites,
        degreeProgramID
      };

      const result = await degreeProgramMutations.createCurriculumPhase(input);
      
      if (result.data?.createCurriculumPhase) {
        const createdPhase = result.data.createCurriculumPhase;
        
        // Create phase courses
        if (phase.courses && phase.courses.length > 0) {
          for (const course of phase.courses) {
            await this.createPhaseCourse(createdPhase.id, course);
          }
        }
        
        // Create phase requirements
        if (phase.requirements && phase.requirements.length > 0) {
          for (const requirement of phase.requirements) {
            await this.createPhaseRequirement(createdPhase.id, requirement);
          }
        }
      }
    } catch (error) {
      console.error('Error creating curriculum phase:', error);
    }
  }

  /**
   * Create phase course
   */
  private async createPhaseCourse(curriculumPhaseID: string, course: PhaseCourse): Promise<void> {
    try {
      const input = {
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        courseDescription: course.courseDescription,
        credits: course.credits,
        isRequired: course.isRequired,
        isElective: course.isElective,
        order: course.order,
        prerequisites: course.prerequisites,
        curriculumPhaseID
      };

      await degreeProgramMutations.createPhaseCourse(input);
    } catch (error) {
      console.error('Error creating phase course:', error);
    }
  }

  /**
   * Create phase requirement
   */
  private async createPhaseRequirement(curriculumPhaseID: string, requirement: PhaseRequirement): Promise<void> {
    try {
      const input = {
        type: requirement.type,
        value: requirement.value.toString(),
        description: requirement.description,
        isRequired: requirement.isRequired,
        curriculumPhaseID
      };

      await degreeProgramMutations.createPhaseRequirement(input);
    } catch (error) {
      console.error('Error creating phase requirement:', error);
    }
  }

  /**
   * Create admission requirement
   */
  private async createAdmissionRequirement(degreeProgramID: string, requirement: AdmissionRequirement): Promise<void> {
    try {
      const input = {
        type: requirement.type,
        title: requirement.title,
        description: requirement.description,
        isRequired: requirement.isRequired,
        minValue: requirement.minValue,
        maxValue: requirement.maxValue,
        unit: requirement.unit,
        degreeProgramID
      };

      await degreeProgramMutations.createAdmissionRequirement(input);
    } catch (error) {
      console.error('Error creating admission requirement:', error);
    }
  }

  /**
   * Create learning outcome
   */
  private async createLearningOutcome(degreeProgramID: string, outcome: LearningOutcome): Promise<void> {
    try {
      const input = {
        title: outcome.title,
        description: outcome.description,
        category: outcome.category,
        level: outcome.level,
        degreeProgramID
      };

      await degreeProgramMutations.createLearningOutcome(input);
    } catch (error) {
      console.error('Error creating learning outcome:', error);
    }
  }

  /**
   * Transform GraphQL response to DegreeProgram interface
   */
  private transformGraphQLToDegreeProgram(graphqlData: any): DegreeProgram {
    return {
      id: graphqlData.id,
      title: graphqlData.title,
      shortTitle: graphqlData.shortTitle,
      description: graphqlData.description,
      longDescription: graphqlData.longDescription,
      degreeType: graphqlData.degreeType,
      field: graphqlData.field,
      duration: graphqlData.duration,
      totalCredits: graphqlData.totalCredits,
      fee: graphqlData.fee,
      currency: graphqlData.currency,
      isActive: graphqlData.isActive,
      isPublic: graphqlData.isPublic,
      careerProspects: graphqlData.careerProspects || [],
      createdBy: graphqlData.createdBy,
      updatedBy: graphqlData.updatedBy,
      createdAt: graphqlData.createdAt,
      updatedAt: graphqlData.updatedAt,
      curriculumPhases: graphqlData.curriculumPhases?.items?.map((phase: any) => ({
        id: phase.id,
        name: phase.name,
        description: phase.description,
        order: phase.order,
        duration: phase.duration,
        isRequired: phase.isRequired,
        prerequisites: phase.prerequisites || [],
        courses: phase.courses?.items?.map((course: any) => ({
          id: course.id,
          courseId: course.courseId,
          courseTitle: course.courseTitle,
          courseDescription: course.courseDescription,
          credits: course.credits,
          isRequired: course.isRequired,
          isElective: course.isElective,
          order: course.order,
          prerequisites: course.prerequisites || []
        })) || [],
        requirements: phase.requirements?.items?.map((req: any) => ({
          id: req.id,
          type: req.type,
          value: req.value,
          description: req.description,
          isRequired: req.isRequired
        })) || []
      })) || [],
      admissionRequirements: graphqlData.admissionRequirements?.items?.map((req: any) => ({
        id: req.id,
        type: req.type,
        title: req.title,
        description: req.description,
        isRequired: req.isRequired,
        minValue: req.minValue,
        maxValue: req.maxValue,
        unit: req.unit
      })) || [],
      learningOutcomes: graphqlData.learningOutcomes?.items?.map((outcome: any) => ({
        id: outcome.id,
        title: outcome.title,
        description: outcome.description,
        category: outcome.category,
        level: outcome.level
      })) || []
    };
  }

  /**
   * Validate degree program data
   */
  validateDegreeProgram(programData: Partial<DegreeProgram>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!programData.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!programData.description?.trim()) {
      errors.push('Description is required');
    }
    
    if (!programData.degreeType) {
      errors.push('Degree type is required');
    }
    
    if (!programData.field?.trim()) {
      errors.push('Field of study is required');
    }
    
    if (!programData.duration || programData.duration <= 0) {
      errors.push('Duration must be greater than 0');
    }
    
    if (!programData.totalCredits || programData.totalCredits <= 0) {
      errors.push('Total credits must be greater than 0');
    }
    
    if (!programData.fee || programData.fee < 0) {
      errors.push('Fee must be a positive number');
    }
    
    if (!programData.currency?.trim()) {
      errors.push('Currency is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const degreeProgramService = new DegreeProgramService();
import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';
import { 
  createDegreeProgram, 
  updateDegreeProgram, 
  deleteDegreeProgram 
} from '@/graphql/mutations';
import { 
  listDegreePrograms, 
  getDegreeProgram 
} from '@/graphql/queries';

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

export interface DegreeProgram {
  id?: string;
  name: string;
  specialization?: string;
  duration: string;
  mode: string;
  schedule: string;
  description: string;
  features: string[];
  advantages: string[];
  eligibility: string;
  targetAudience: string;
  registrationLink?: string;
  image?: string;
  status: 'active' | 'inactive';
  totalStudents?: number;
  revenue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDegreeProgramInput {
  name: string;
  specialization?: string;
  duration: string;
  mode: string;
  schedule: string;
  description: string;
  features?: string[];
  advantages?: string[];
  eligibility: string;
  targetAudience: string;
  registrationLink?: string;
  image?: string;
  status?: 'active' | 'inactive';
  totalStudents?: number;
  revenue?: string;
}

export interface UpdateDegreeProgramInput extends CreateDegreeProgramInput {
  id: string;
}

export interface DegreeProgramFilters {
  status?: string;
  mode?: string;
  search?: string;
}

class DegreeProgramService {
  /**
   * Get all degree programs with optional filtering
   */
  async getDegreePrograms(filters?: DegreeProgramFilters): Promise<DegreeProgram[]> {
    try {
      // Build filter conditions
      let filter: any = {};
      
      if (filters?.status && filters.status !== 'all') {
        filter.status = { eq: filters.status };
      }
      
      if (filters?.mode && filters.mode !== 'all') {
        filter.mode = { eq: filters.mode };
      }

      if (filters?.search) {
        filter.or = [
          { name: { contains: filters.search } },
          { specialization: { contains: filters.search } }
        ];
      }

      const { data } = await client.graphql({
        query: listDegreePrograms,
        variables: {
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      });

      return data.listDegreePrograms.items as DegreeProgram[];
    } catch (error) {
      console.error('Error in getDegreePrograms:', error);
      throw error;
    }
  }

  /**
   * Get a single degree program by ID
   */
  async getDegreeProgram(id: string): Promise<DegreeProgram | null> {
    try {
      const { data } = await client.graphql({
        query: getDegreeProgram,
        variables: {
          id
        }
      });

      return data.getDegreeProgram as DegreeProgram | null;
    } catch (error) {
      console.error('Error in getDegreeProgram:', error);
      throw error;
    }
  }

  /**
   * Create a new degree program
   */
  async createDegreeProgram(input: CreateDegreeProgramInput): Promise<DegreeProgram> {
    try {
      const { data } = await client.graphql({
        query: createDegreeProgram,
        variables: {
          input: {
            name: input.name,
            specialization: input.specialization || '',
            duration: input.duration,
            mode: input.mode,
            schedule: input.schedule,
            description: input.description,
            features: input.features || [],
            advantages: input.advantages || [],
            eligibility: input.eligibility,
            targetAudience: input.targetAudience,
            registrationLink: input.registrationLink || '',
            image: input.image || '',
            status: input.status || 'active',
            totalStudents: input.totalStudents || 0,
            revenue: input.revenue || '₹0'
          }
        }
      });

      return data.createDegreeProgram as DegreeProgram;
    } catch (error) {
      console.error('Error in createDegreeProgram:', error);
      throw error;
    }
  }

  /**
   * Update an existing degree program
   */
  async updateDegreeProgram(input: UpdateDegreeProgramInput): Promise<DegreeProgram> {
    try {
      const { data } = await client.graphql({
        query: updateDegreeProgram,
        variables: {
          input: {
            id: input.id,
            name: input.name,
            specialization: input.specialization || '',
            duration: input.duration,
            mode: input.mode,
            schedule: input.schedule,
            description: input.description,
            features: input.features || [],
            advantages: input.advantages || [],
            eligibility: input.eligibility,
            targetAudience: input.targetAudience,
            registrationLink: input.registrationLink || '',
            image: input.image || '',
            status: input.status || 'active',
            totalStudents: input.totalStudents || 0,
            revenue: input.revenue || '₹0'
          }
        }
      });

      return data.updateDegreeProgram as DegreeProgram;
    } catch (error) {
      console.error('Error in updateDegreeProgram:', error);
      throw error;
    }
  }

  /**
   * Delete a degree program
   */
  async deleteDegreeProgram(id: string): Promise<void> {
    try {
      await client.graphql({
        query: deleteDegreeProgram,
        variables: {
          input: {
            id
          }
        }
      });
    } catch (error) {
      console.error('Error in deleteDegreeProgram:', error);
      throw error;
    }
  }

  /**
   * Toggle program status (active/inactive)
   */
  async toggleProgramStatus(id: string, currentStatus: 'active' | 'inactive'): Promise<DegreeProgram> {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { data } = await client.graphql({
        query: updateDegreeProgram,
        variables: {
          input: {
            id,
            status: newStatus
          }
        }
      });

      return data.updateDegreeProgram as DegreeProgram;
    } catch (error) {
      console.error('Error in toggleProgramStatus:', error);
      throw error;
    }
  }
}

export const degreeProgramService = new DegreeProgramService();

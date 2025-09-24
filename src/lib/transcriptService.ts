import { generateClient } from 'aws-amplify/api';
import { GENERATE_TRANSCRIPT } from '../graphql/mutations';
import { GET_TRANSCRIPT, LIST_TRANSCRIPTS } from '../graphql/queries';

const client = generateClient();

export interface Transcript {
  id: string;
  studentId: string;
  transcriptUrl: string;
  generatedAt: string;
  createdAt: string;
}

export const transcriptService = {
  /**
   * Generate transcript for a student
   */
  async generateTranscript(studentId: string): Promise<Transcript> {
    try {
      const result = await client.graphql({
        query: GENERATE_TRANSCRIPT,
        variables: { studentId }
      });
      return result.data.generateTranscript;
    } catch (error) {
      console.error('Error generating transcript:', error);
      throw error;
    }
  },

  /**
   * Get transcript for a student
   */
  async getTranscript(studentId: string): Promise<Transcript | null> {
    try {
      const result = await client.graphql({
        query: GET_TRANSCRIPT,
        variables: { studentId }
      });
      return result.data.getTranscript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  },

  /**
   * List all transcripts for a student
   */
  async listTranscripts(studentId: string, limit: number = 10, nextToken?: string): Promise<{ items: Transcript[]; nextToken?: string }> {
    try {
      const result = await client.graphql({
        query: LIST_TRANSCRIPTS,
        variables: { 
          filter: { studentId: { eq: studentId } },
          limit,
          nextToken 
        }
      });
      return {
        items: result.data.listTranscripts.items || [],
        nextToken: result.data.listTranscripts.nextToken
      };
    } catch (error) {
      console.error('Error listing transcripts:', error);
      throw error;
    }
  },

  /**
   * Download transcript
   */
  async downloadTranscript(transcriptUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(transcriptUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading transcript:', error);
      throw error;
    }
  },

  /**
   * Format generation date
   */
  formatGenerationDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Check if transcript is recent (within last 30 days)
   */
  isTranscriptRecent(generatedAt: string): boolean {
    const generated = new Date(generatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return generated > thirtyDaysAgo;
  },

  /**
   * Get transcript filename
   */
  getTranscriptFilename(studentId: string, generatedAt: string): string {
    const date = new Date(generatedAt);
    const dateStr = date.toISOString().split('T')[0];
    return `transcript_${studentId}_${dateStr}.pdf`;
  },

  /**
   * Generate transcript with loading state
   */
  async generateTranscriptWithLoading(studentId: string, onProgress?: (status: string) => void): Promise<Transcript> {
    try {
      onProgress?.('Generating transcript...');
      
      const transcript = await this.generateTranscript(studentId);
      
      onProgress?.('Transcript generated successfully!');
      
      return transcript;
    } catch (error) {
      onProgress?.('Error generating transcript');
      throw error;
    }
  }
};

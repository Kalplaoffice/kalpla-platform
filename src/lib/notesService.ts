import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_NOTE, 
  UPDATE_NOTE, 
  DELETE_NOTE 
} from '../graphql/mutations';
import { 
  GET_NOTES_BY_LESSON, 
  LIST_NOTES 
} from '../graphql/queries';

const client = generateClient();

export interface Note {
  id: string;
  studentId: string;
  lessonId: string;
  content: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  studentId: string;
  lessonId: string;
  content: string;
  timestamp: number;
}

export interface UpdateNoteData {
  id: string;
  content: string;
}

export const notesService = {
  /**
   * Create a new note
   */
  async createNote(noteData: CreateNoteData): Promise<Note> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTE,
        variables: { input: noteData }
      });
      return result.data.createNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  /**
   * Update an existing note
   */
  async updateNote(noteData: UpdateNoteData): Promise<Note> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTE,
        variables: { input: noteData }
      });
      return result.data.updateNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_NOTE,
        variables: { id: noteId }
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  /**
   * Get notes for a specific lesson and student
   */
  async getNotesByLesson(lessonId: string, studentId: string): Promise<Note[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTES_BY_LESSON,
        variables: { lessonId, studentId }
      });
      return result.data.getNotesByLesson.items || [];
    } catch (error) {
      console.error('Error fetching notes by lesson:', error);
      throw error;
    }
  },

  /**
   * List all notes for a student
   */
  async listNotes(studentId: string, limit: number = 50, nextToken?: string): Promise<{ items: Note[]; nextToken?: string }> {
    try {
      const result = await client.graphql({
        query: LIST_NOTES,
        variables: { 
          filter: { studentId: { eq: studentId } },
          limit,
          nextToken 
        }
      });
      return {
        items: result.data.listNotes.items || [],
        nextToken: result.data.listNotes.nextToken
      };
    } catch (error) {
      console.error('Error listing notes:', error);
      throw error;
    }
  },

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: number): string {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * Sort notes by timestamp
   */
  sortNotesByTimestamp(notes: Note[]): Note[] {
    return notes.sort((a, b) => a.timestamp - b.timestamp);
  }
};

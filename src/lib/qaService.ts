import { generateClient } from 'aws-amplify/api';
import {
  CREATE_QUESTION,
  CREATE_ANSWER,
  UPDATE_QUESTION_STATUS
} from '../graphql/mutations';
import {
  GET_QUESTIONS_BY_LESSON,
  GET_QUESTIONS_BY_STUDENT,
  GET_PENDING_QUESTIONS
} from '../graphql/queries';

const client = generateClient();

export interface Question {
  id: string;
  studentId: string;
  lessonId: string;
  question: string;
  status: 'PENDING' | 'ANSWERED' | 'RESOLVED';
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  mentorId: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  studentId: string;
  lessonId: string;
  question: string;
}

export interface CreateAnswerData {
  questionId: string;
  mentorId: string;
  answer: string;
}

export const qaService = {
  /**
   * Create a new question
   */
  async createQuestion(questionData: CreateQuestionData): Promise<Question> {
    try {
      const result = await client.graphql({
        query: CREATE_QUESTION,
        variables: { input: questionData }
      });
      return result.data.createQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  /**
   * Create an answer to a question
   */
  async createAnswer(answerData: CreateAnswerData): Promise<Answer> {
    try {
      const result = await client.graphql({
        query: CREATE_ANSWER,
        variables: { input: answerData }
      });
      return result.data.createAnswer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  },

  /**
   * Update question status
   */
  async updateQuestionStatus(questionId: string, status: 'PENDING' | 'ANSWERED' | 'RESOLVED'): Promise<Question> {
    try {
      const result = await client.graphql({
        query: UPDATE_QUESTION_STATUS,
        variables: { id: questionId, status }
      });
      return result.data.updateQuestion;
    } catch (error) {
      console.error('Error updating question status:', error);
      throw error;
    }
  },

  /**
   * Get questions for a specific lesson
   */
  async getQuestionsByLesson(lessonId: string): Promise<Question[]> {
    try {
      const result = await client.graphql({
        query: GET_QUESTIONS_BY_LESSON,
        variables: { lessonId }
      });
      return result.data.getQuestionsByLesson.items || [];
    } catch (error) {
      console.error('Error fetching questions by lesson:', error);
      throw error;
    }
  },

  /**
   * Get questions asked by a specific student
   */
  async getQuestionsByStudent(studentId: string): Promise<Question[]> {
    try {
      const result = await client.graphql({
        query: GET_QUESTIONS_BY_STUDENT,
        variables: { studentId }
      });
      return result.data.getQuestionsByStudent.items || [];
    } catch (error) {
      console.error('Error fetching questions by student:', error);
      throw error;
    }
  },

  /**
   * Get pending questions for a mentor
   */
  async getPendingQuestions(mentorId: string): Promise<Question[]> {
    try {
      const result = await client.graphql({
        query: GET_PENDING_QUESTIONS,
        variables: { mentorId }
      });
      return result.data.getPendingQuestions.items || [];
    } catch (error) {
      console.error('Error fetching pending questions:', error);
      throw error;
    }
  },

  /**
   * Answer a question and mark it as answered
   */
  async answerQuestion(questionId: string, mentorId: string, answer: string): Promise<Answer> {
    try {
      // Create the answer
      const answerResult = await this.createAnswer({
        questionId,
        mentorId,
        answer
      });

      // Update question status to answered
      await this.updateQuestionStatus(questionId, 'ANSWERED');

      return answerResult;
    } catch (error) {
      console.error('Error answering question:', error);
      throw error;
    }
  },

  /**
   * Mark question as resolved
   */
  async resolveQuestion(questionId: string): Promise<Question> {
    try {
      return await this.updateQuestionStatus(questionId, 'RESOLVED');
    } catch (error) {
      console.error('Error resolving question:', error);
      throw error;
    }
  },

  /**
   * Get question statistics
   */
  getQuestionStats(questions: Question[]) {
    const total = questions.length;
    const pending = questions.filter(q => q.status === 'PENDING').length;
    const answered = questions.filter(q => q.status === 'ANSWERED').length;
    const resolved = questions.filter(q => q.status === 'RESOLVED').length;

    return {
      total,
      pending,
      answered,
      resolved,
      answerRate: total > 0 ? ((answered + resolved) / total) * 100 : 0
    };
  }
};

import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export type LessonType = 'video' | 'pdf' | 'quiz';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: LessonType;
  content: string; // Video URL, PDF URL, or quiz questions
  duration?: string;
  order: number;
  isVisible: boolean;
  isPreview: boolean;
  createdAt: string;
  updatedAt?: string;
  fileUrl?: string; // For uploaded files
  quizData?: QuizData; // For quiz lessons
}

export interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  allowRetakes: boolean;
  showCorrectAnswers: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Curriculum {
  courseId: string;
  lessons: Lesson[];
  totalDuration: number;
  totalLessons: number;
  previewLessons: number;
}

class CurriculumService {
  /**
   * Get curriculum for a course
   */
  async getCurriculum(courseId: string): Promise<Lesson[]> {
    try {
      // For now, simulate API call
      console.log('Getting curriculum for course:', courseId);
      
      // In a real implementation, you would call your GraphQL query here:
      // const result = await client.models.Lesson.list({
      //   filter: { courseId: { eq: courseId } },
      //   sortDirection: 'ASC'
      // });
      
      // Simulate curriculum data
      const lessons: Lesson[] = [
        {
          id: 'lesson_1',
          courseId,
          title: 'Introduction to React',
          description: 'Learn the basics of React and its core concepts',
          type: 'video',
          content: 'https://example.com/video1.mp4',
          duration: '15 minutes',
          order: 1,
          isVisible: true,
          isPreview: true,
          createdAt: new Date().toISOString(),
          fileUrl: 'https://example.com/video1.mp4'
        },
        {
          id: 'lesson_2',
          courseId,
          title: 'React Components Deep Dive',
          description: 'Understanding React components and their lifecycle',
          type: 'pdf',
          content: 'https://example.com/pdf1.pdf',
          duration: '20 minutes',
          order: 2,
          isVisible: true,
          isPreview: false,
          createdAt: new Date().toISOString(),
          fileUrl: 'https://example.com/pdf1.pdf'
        },
        {
          id: 'lesson_3',
          courseId,
          title: 'React Quiz - Components',
          description: 'Test your knowledge of React components',
          type: 'quiz',
          content: 'Quiz questions and answers',
          duration: '10 minutes',
          order: 3,
          isVisible: true,
          isPreview: false,
          createdAt: new Date().toISOString(),
          quizData: {
            questions: [
              {
                id: 'q1',
                question: 'What is a React component?',
                type: 'multiple-choice',
                options: ['A function', 'A class', 'Both A and B', 'None of the above'],
                correctAnswer: 'Both A and B',
                explanation: 'React components can be either functions or classes.',
                points: 10
              },
              {
                id: 'q2',
                question: 'React uses JSX for templating.',
                type: 'true-false',
                correctAnswer: 'true',
                explanation: 'JSX is a syntax extension for JavaScript used in React.',
                points: 5
              }
            ],
            passingScore: 70,
            timeLimit: 10,
            allowRetakes: true,
            showCorrectAnswers: true
          }
        }
      ];
      
      return lessons.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error getting curriculum:', error);
      return [];
    }
  }

  /**
   * Create a new lesson
   */
  async createLesson(courseId: string, lessonData: Omit<Lesson, 'id' | 'createdAt'>): Promise<Lesson> {
    try {
      console.log('Creating lesson:', lessonData);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.Lesson.create({
      //   ...lessonData,
      //   courseId
      // });
      
      // Simulate lesson creation
      const newLesson: Lesson = {
        id: 'lesson_' + Date.now(),
        ...lessonData,
        createdAt: new Date().toISOString()
      };
      
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Failed to create lesson');
    }
  }

  /**
   * Update an existing lesson
   */
  async updateLesson(courseId: string, lessonId: string, updates: Partial<Lesson>): Promise<Lesson> {
    try {
      console.log('Updating lesson:', lessonId, updates);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.Lesson.update({
      //   id: lessonId,
      //   ...updates
      // });
      
      // Simulate lesson update
      const updatedLesson: Lesson = {
        id: lessonId,
        courseId,
        title: updates.title || 'Updated Lesson',
        description: updates.description,
        type: updates.type || 'video',
        content: updates.content || '',
        duration: updates.duration,
        order: updates.order || 1,
        isVisible: updates.isVisible !== undefined ? updates.isVisible : true,
        isPreview: updates.isPreview !== undefined ? updates.isPreview : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileUrl: updates.fileUrl,
        quizData: updates.quizData
      };
      
      return updatedLesson;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw new Error('Failed to update lesson');
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(courseId: string, lessonId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Deleting lesson:', lessonId);
      
      // In a real implementation, you would call your GraphQL mutation here:
      // const result = await client.models.Lesson.delete({ id: lessonId });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return { success: false, error: 'Failed to delete lesson' };
    }
  }

  /**
   * Update lesson order
   */
  async updateLessonOrder(courseId: string, lessonIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Updating lesson order:', courseId, lessonIds);
      
      // In a real implementation, you would update the order field for each lesson:
      // const updatePromises = lessonIds.map((lessonId, index) => 
      //   client.models.Lesson.update({
      //     id: lessonId,
      //     order: index + 1
      //   })
      // );
      // await Promise.all(updatePromises);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating lesson order:', error);
      return { success: false, error: 'Failed to update lesson order' };
    }
  }

  /**
   * Upload lesson file (video, PDF)
   */
  async uploadLessonFile(file: File, lessonType: LessonType, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const folder = lessonType === 'video' ? 'lesson-videos' : 'lesson-documents';
      const key = `${folder}/${fileName}`;

      // For now, simulate upload with progress
      if (onProgress) {
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          onProgress(progress);
        }
      }

      // In a real implementation, you would use Amplify Storage:
      // const result = await uploadData({
      //   key,
      //   data: file,
      //   options: {
      //     onProgress: ({ transferredBytes, totalBytes }) => {
      //       if (totalBytes) {
      //         const progress = Math.round((transferredBytes / totalBytes) * 100);
      //         onProgress?.(progress);
      //       }
      //     }
      //   }
      // }).result;

      // Simulate successful upload
      const uploadedUrl = `https://kalpla-lessons.s3.amazonaws.com/${key}`;
      
      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading lesson file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Create quiz lesson
   */
  async createQuizLesson(courseId: string, quizData: {
    title: string;
    description?: string;
    duration?: string;
    quizData: QuizData;
    order: number;
  }): Promise<Lesson> {
    try {
      const lessonData: Omit<Lesson, 'id' | 'createdAt'> = {
        courseId,
        title: quizData.title,
        description: quizData.description,
        type: 'quiz',
        content: JSON.stringify(quizData.quizData),
        duration: quizData.duration,
        order: quizData.order,
        isVisible: true,
        isPreview: false,
        quizData: quizData.quizData
      };

      return await this.createLesson(courseId, lessonData);
    } catch (error) {
      console.error('Error creating quiz lesson:', error);
      throw new Error('Failed to create quiz lesson');
    }
  }

  /**
   * Get lesson by ID
   */
  async getLesson(courseId: string, lessonId: string): Promise<Lesson | null> {
    try {
      console.log('Getting lesson:', lessonId);
      
      // In a real implementation, you would call your GraphQL query here:
      // const result = await client.models.Lesson.get({ id: lessonId });
      
      // Simulate lesson data
      const lesson: Lesson = {
        id: lessonId,
        courseId,
        title: 'Sample Lesson',
        description: 'This is a sample lesson',
        type: 'video',
        content: 'https://example.com/video.mp4',
        duration: '15 minutes',
        order: 1,
        isVisible: true,
        isPreview: false,
        createdAt: new Date().toISOString(),
        fileUrl: 'https://example.com/video.mp4'
      };
      
      return lesson;
    } catch (error) {
      console.error('Error getting lesson:', error);
      return null;
    }
  }

  /**
   * Get curriculum statistics
   */
  async getCurriculumStats(courseId: string): Promise<{
    totalLessons: number;
    totalDuration: number;
    videoLessons: number;
    pdfLessons: number;
    quizLessons: number;
    previewLessons: number;
  }> {
    try {
      const lessons = await this.getCurriculum(courseId);
      
      const stats = {
        totalLessons: lessons.length,
        totalDuration: lessons.reduce((total, lesson) => {
          if (lesson.duration) {
            const minutes = parseInt(lesson.duration.replace(/\D/g, ''));
            return total + minutes;
          }
          return total;
        }, 0),
        videoLessons: lessons.filter(l => l.type === 'video').length,
        pdfLessons: lessons.filter(l => l.type === 'pdf').length,
        quizLessons: lessons.filter(l => l.type === 'quiz').length,
        previewLessons: lessons.filter(l => l.isPreview).length
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting curriculum stats:', error);
      return {
        totalLessons: 0,
        totalDuration: 0,
        videoLessons: 0,
        pdfLessons: 0,
        quizLessons: 0,
        previewLessons: 0
      };
    }
  }

  /**
   * Validate lesson data
   */
  validateLessonData(lessonData: Partial<Lesson>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!lessonData.title?.trim()) {
      errors.push('Lesson title is required');
    }

    if (!lessonData.type) {
      errors.push('Lesson type is required');
    }

    if (lessonData.type === 'quiz' && !lessonData.quizData) {
      errors.push('Quiz data is required for quiz lessons');
    }

    if (lessonData.type !== 'quiz' && !lessonData.content?.trim()) {
      errors.push('Lesson content is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Parse quiz content from text
   */
  parseQuizContent(content: string): QuizData {
    try {
      // Simple parsing logic - in a real implementation, you'd have a more sophisticated parser
      const lines = content.split('\n').filter(line => line.trim());
      const questions: QuizQuestion[] = [];
      
      let currentQuestion: Partial<QuizQuestion> = {};
      
      for (const line of lines) {
        if (line.includes('?')) {
          // This is a question
          if (currentQuestion.question) {
            questions.push(currentQuestion as QuizQuestion);
          }
          currentQuestion = {
            id: `q${questions.length + 1}`,
            question: line.trim(),
            type: 'multiple-choice',
            points: 10
          };
        } else if (line.includes(',')) {
          // This might be options
          const options = line.split(',').map(opt => opt.trim());
          currentQuestion.options = options;
        } else if (line.includes('(') && line.includes(')')) {
          // This might be the correct answer
          const match = line.match(/\(([^)]+)\)/);
          if (match) {
            currentQuestion.correctAnswer = match[1].trim();
          }
        }
      }
      
      if (currentQuestion.question) {
        questions.push(currentQuestion as QuizQuestion);
      }
      
      return {
        questions,
        passingScore: 70,
        timeLimit: 10,
        allowRetakes: true,
        showCorrectAnswers: true
      };
    } catch (error) {
      console.error('Error parsing quiz content:', error);
      return {
        questions: [],
        passingScore: 70,
        timeLimit: 10,
        allowRetakes: true,
        showCorrectAnswers: true
      };
    }
  }
}

export const curriculumService = new CurriculumService();

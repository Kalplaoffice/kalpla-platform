import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_INTERACTIVE_ELEMENT,
  UPDATE_INTERACTIVE_ELEMENT,
  DELETE_INTERACTIVE_ELEMENT,
  SUBMIT_QUIZ_RESPONSE,
  CREATE_VIDEO_ANNOTATION,
  UPDATE_VIDEO_ANNOTATION,
  DELETE_VIDEO_ANNOTATION
} from '../graphql/mutations';
import {
  GET_INTERACTIVE_ELEMENTS,
  GET_QUIZ_RESPONSES,
  GET_VIDEO_ANNOTATIONS,
  GET_INTERACTIVE_TIMELINE
} from '../graphql/queries';

const client = generateClient();

export interface InteractiveElement {
  id: string;
  lessonId: string;
  type: InteractiveElementType;
  timestamp: number; // Video timestamp in seconds
  duration?: number; // Duration of the element (for overlays)
  position: ElementPosition;
  content: ElementContent;
  settings: ElementSettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type InteractiveElementType = 
  | 'quiz' 
  | 'annotation' 
  | 'note' 
  | 'bookmark' 
  | 'highlight' 
  | 'poll' 
  | 'discussion' 
  | 'link' 
  | 'overlay';

export interface ElementPosition {
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
  width?: number; // Percentage width
  height?: number; // Percentage height
}

export interface ElementContent {
  title?: string;
  text?: string;
  html?: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  };
  quiz?: QuizContent;
  annotation?: AnnotationContent;
  link?: LinkContent;
}

export interface QuizContent {
  question: string;
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options?: QuizOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  timeLimit?: number; // Seconds
  allowRetry: boolean;
  showCorrectAnswer: boolean;
  randomizeOptions: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface AnnotationContent {
  text: string;
  style: AnnotationStyle;
  category: 'info' | 'warning' | 'tip' | 'important' | 'example';
  author: string;
  isPublic: boolean;
}

export interface AnnotationStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export interface LinkContent {
  url: string;
  title: string;
  description?: string;
  openInNewTab: boolean;
}

export interface ElementSettings {
  autoShow: boolean; // Show automatically at timestamp
  autoHide: boolean; // Hide automatically after duration
  clickable: boolean;
  draggable: boolean;
  resizable: boolean;
  showControls: boolean;
  allowInteraction: boolean;
  pauseVideo: boolean; // Pause video when element is active
  skipable: boolean; // Allow user to skip the element
}

export interface QuizResponse {
  id: string;
  elementId: string;
  userId: string;
  lessonId: string;
  responses: QuizResponseData[];
  score: number;
  totalPoints: number;
  timeSpent: number;
  attempts: number;
  isCorrect: boolean;
  submittedAt: string;
  createdAt: string;
}

export interface QuizResponseData {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface VideoAnnotation {
  id: string;
  lessonId: string;
  userId: string;
  elementId: string;
  content: string;
  timestamp: number;
  position: ElementPosition;
  style: AnnotationStyle;
  category: string;
  isPublic: boolean;
  likes: number;
  replies: AnnotationReply[];
  createdAt: string;
  updatedAt: string;
}

export interface AnnotationReply {
  id: string;
  annotationId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InteractiveTimeline {
  lessonId: string;
  elements: InteractiveElement[];
  version: number;
  lastUpdated: string;
}

class InteractiveVideoService {
  /**
   * Get interactive timeline for a lesson
   */
  async getInteractiveTimeline(lessonId: string): Promise<InteractiveTimeline> {
    try {
      const result = await client.graphql({
        query: GET_INTERACTIVE_TIMELINE,
        variables: { lessonId }
      });
      
      return result.data.getInteractiveTimeline || {
        lessonId,
        elements: [],
        version: 1,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting interactive timeline:', error);
      throw new Error('Failed to get interactive timeline');
    }
  }

  /**
   * Create interactive element
   */
  async createInteractiveElement(element: Omit<InteractiveElement, 'id' | 'createdAt' | 'updatedAt'>): Promise<InteractiveElement> {
    try {
      const result = await client.graphql({
        query: CREATE_INTERACTIVE_ELEMENT,
        variables: {
          input: {
            ...element,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.createInteractiveElement;
    } catch (error) {
      console.error('Error creating interactive element:', error);
      throw new Error('Failed to create interactive element');
    }
  }

  /**
   * Update interactive element
   */
  async updateInteractiveElement(elementId: string, updates: Partial<InteractiveElement>): Promise<InteractiveElement> {
    try {
      const result = await client.graphql({
        query: UPDATE_INTERACTIVE_ELEMENT,
        variables: {
          input: {
            id: elementId,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.updateInteractiveElement;
    } catch (error) {
      console.error('Error updating interactive element:', error);
      throw new Error('Failed to update interactive element');
    }
  }

  /**
   * Delete interactive element
   */
  async deleteInteractiveElement(elementId: string): Promise<void> {
    try {
      await client.graphql({
        query: DELETE_INTERACTIVE_ELEMENT,
        variables: { input: { id: elementId } }
      });
    } catch (error) {
      console.error('Error deleting interactive element:', error);
      throw new Error('Failed to delete interactive element');
    }
  }

  /**
   * Submit quiz response
   */
  async submitQuizResponse(response: Omit<QuizResponse, 'id' | 'createdAt' | 'submittedAt'>): Promise<QuizResponse> {
    try {
      const result = await client.graphql({
        query: SUBMIT_QUIZ_RESPONSE,
        variables: {
          input: {
            ...response,
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.submitQuizResponse;
    } catch (error) {
      console.error('Error submitting quiz response:', error);
      throw new Error('Failed to submit quiz response');
    }
  }

  /**
   * Get quiz responses for a user
   */
  async getQuizResponses(lessonId: string, userId: string): Promise<QuizResponse[]> {
    try {
      const result = await client.graphql({
        query: GET_QUIZ_RESPONSES,
        variables: { lessonId, userId }
      });
      
      return result.data.getQuizResponses || [];
    } catch (error) {
      console.error('Error getting quiz responses:', error);
      return [];
    }
  }

  /**
   * Create video annotation
   */
  async createVideoAnnotation(annotation: Omit<VideoAnnotation, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'replies'>): Promise<VideoAnnotation> {
    try {
      const result = await client.graphql({
        query: CREATE_VIDEO_ANNOTATION,
        variables: {
          input: {
            ...annotation,
            likes: 0,
            replies: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      return result.data.createVideoAnnotation;
    } catch (error) {
      console.error('Error creating video annotation:', error);
      throw new Error('Failed to create video annotation');
    }
  }

  /**
   * Get video annotations
   */
  async getVideoAnnotations(lessonId: string, userId?: string): Promise<VideoAnnotation[]> {
    try {
      const result = await client.graphql({
        query: GET_VIDEO_ANNOTATIONS,
        variables: { lessonId, userId }
      });
      
      return result.data.getVideoAnnotations || [];
    } catch (error) {
      console.error('Error getting video annotations:', error);
      return [];
    }
  }

  /**
   * Calculate quiz score
   */
  calculateQuizScore(responses: QuizResponseData[], quiz: QuizContent): { score: number; totalPoints: number; isCorrect: boolean } {
    let score = 0;
    let totalPoints = quiz.points;
    let isCorrect = true;

    if (quiz.questionType === 'multiple_choice') {
      const correctAnswer = quiz.correctAnswer as string;
      const userAnswer = responses[0]?.answer as string;
      if (userAnswer === correctAnswer) {
        score = quiz.points;
      } else {
        isCorrect = false;
      }
    } else if (quiz.questionType === 'true_false') {
      const correctAnswer = quiz.correctAnswer as string;
      const userAnswer = responses[0]?.answer as string;
      if (userAnswer === correctAnswer) {
        score = quiz.points;
      } else {
        isCorrect = false;
      }
    } else if (quiz.questionType === 'fill_blank') {
      const correctAnswers = quiz.correctAnswer as string[];
      const userAnswers = responses[0]?.answer as string[];
      let correctCount = 0;
      
      correctAnswers.forEach((correct, index) => {
        if (userAnswers[index]?.toLowerCase().trim() === correct.toLowerCase().trim()) {
          correctCount++;
        }
      });
      
      score = (correctCount / correctAnswers.length) * quiz.points;
      isCorrect = correctCount === correctAnswers.length;
    }

    return { score, totalPoints, isCorrect };
  }

  /**
   * Get elements at specific timestamp
   */
  getElementsAtTimestamp(elements: InteractiveElement[], timestamp: number): InteractiveElement[] {
    return elements.filter(element => {
      const startTime = element.timestamp;
      const endTime = element.timestamp + (element.duration || 0);
      
      return timestamp >= startTime && timestamp <= endTime;
    });
  }

  /**
   * Get upcoming elements
   */
  getUpcomingElements(elements: InteractiveElement[], currentTime: number, lookAhead: number = 10): InteractiveElement[] {
    return elements.filter(element => {
      const timeUntilElement = element.timestamp - currentTime;
      return timeUntilElement > 0 && timeUntilElement <= lookAhead;
    }).sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Validate element position
   */
  validateElementPosition(position: ElementPosition): boolean {
    return (
      position.x >= 0 && position.x <= 100 &&
      position.y >= 0 && position.y <= 100 &&
      (!position.width || (position.width > 0 && position.width <= 100)) &&
      (!position.height || (position.height > 0 && position.height <= 100))
    );
  }

  /**
   * Get default element settings
   */
  getDefaultElementSettings(): ElementSettings {
    return {
      autoShow: true,
      autoHide: false,
      clickable: true,
      draggable: false,
      resizable: false,
      showControls: true,
      allowInteraction: true,
      pauseVideo: false,
      skipable: true
    };
  }

  /**
   * Get default annotation style
   */
  getDefaultAnnotationStyle(): AnnotationStyle {
    return {
      backgroundColor: '#ffffcc',
      textColor: '#000000',
      borderColor: '#ffcc00',
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal'
    };
  }
}

export const interactiveVideoService = new InteractiveVideoService();

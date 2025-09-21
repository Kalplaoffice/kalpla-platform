import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_DISCUSSION, 
  CREATE_DISCUSSION_REPLY, 
  LIKE_DISCUSSION 
} from '../graphql/mutations';
import { 
  GET_DISCUSSIONS_BY_LESSON, 
  GET_DISCUSSION_REPLIES 
} from '../graphql/queries';

const client = generateClient();

export interface Discussion {
  id: string;
  studentId: string;
  lessonId: string;
  title: string;
  content: string;
  likes: number;
  replies: DiscussionReply[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscussionData {
  studentId: string;
  lessonId: string;
  title: string;
  content: string;
}

export interface CreateDiscussionReplyData {
  discussionId: string;
  userId: string;
  content: string;
}

export const discussionService = {
  /**
   * Create a new discussion
   */
  async createDiscussion(discussionData: CreateDiscussionData): Promise<Discussion> {
    try {
      const result = await client.graphql({
        query: CREATE_DISCUSSION,
        variables: { input: discussionData }
      });
      return result.data.createDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    }
  },

  /**
   * Create a reply to a discussion
   */
  async createDiscussionReply(replyData: CreateDiscussionReplyData): Promise<DiscussionReply> {
    try {
      const result = await client.graphql({
        query: CREATE_DISCUSSION_REPLY,
        variables: { input: replyData }
      });
      return result.data.createDiscussionReply;
    } catch (error) {
      console.error('Error creating discussion reply:', error);
      throw error;
    }
  },

  /**
   * Like a discussion
   */
  async likeDiscussion(discussionId: string, userId: string): Promise<Discussion> {
    try {
      const result = await client.graphql({
        query: LIKE_DISCUSSION,
        variables: { discussionId, userId }
      });
      return result.data.likeDiscussion;
    } catch (error) {
      console.error('Error liking discussion:', error);
      throw error;
    }
  },

  /**
   * Get discussions for a specific lesson
   */
  async getDiscussionsByLesson(lessonId: string): Promise<Discussion[]> {
    try {
      const result = await client.graphql({
        query: GET_DISCUSSIONS_BY_LESSON,
        variables: { lessonId }
      });
      return result.data.getDiscussionsByLesson.items || [];
    } catch (error) {
      console.error('Error fetching discussions by lesson:', error);
      throw error;
    }
  },

  /**
   * Get replies for a specific discussion
   */
  async getDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
    try {
      const result = await client.graphql({
        query: GET_DISCUSSION_REPLIES,
        variables: { discussionId }
      });
      return result.data.getDiscussionReplies.items || [];
    } catch (error) {
      console.error('Error fetching discussion replies:', error);
      throw error;
    }
  },

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  /**
   * Sort discussions by most recent
   */
  sortDiscussionsByRecent(discussions: Discussion[]): Discussion[] {
    return discussions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Sort discussions by most liked
   */
  sortDiscussionsByLikes(discussions: Discussion[]): Discussion[] {
    return discussions.sort((a, b) => b.likes - a.likes);
  },

  /**
   * Get discussion statistics
   */
  getDiscussionStats(discussions: Discussion[]) {
    const total = discussions.length;
    const totalReplies = discussions.reduce((sum, d) => sum + d.replies.length, 0);
    const totalLikes = discussions.reduce((sum, d) => sum + d.likes, 0);
    const avgRepliesPerDiscussion = total > 0 ? totalReplies / total : 0;

    return {
      totalDiscussions: total,
      totalReplies,
      totalLikes,
      avgRepliesPerDiscussion: Math.round(avgRepliesPerDiscussion * 100) / 100
    };
  }
};

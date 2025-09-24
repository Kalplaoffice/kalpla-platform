import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_FORUM,
  UPDATE_FORUM,
  DELETE_FORUM,
  CREATE_DISCUSSION,
  UPDATE_DISCUSSION,
  DELETE_DISCUSSION,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  CREATE_FORUM_MEMBERSHIP,
  UPDATE_FORUM_MEMBERSHIP,
  DELETE_FORUM_MEMBERSHIP,
  CREATE_MODERATION_ACTION,
  UPDATE_MODERATION_ACTION
} from '../graphql/mutations';
import {
  GET_FORUMS,
  GET_DISCUSSIONS,
  GET_POSTS,
  GET_COMMENTS,
  GET_FORUM_MEMBERSHIPS,
  GET_MODERATION_ACTIONS,
  GET_FORUM_STATS,
  SEARCH_COMMUNITY
} from '../graphql/queries';

const client = generateClient();

export interface Forum {
  id: string;
  name: string;
  description: string;
  type: ForumType;
  category: ForumCategory;
  level: ForumLevel;
  courseId?: string;
  courseName?: string;
  ksmpId?: string;
  ksmpName?: string;
  isPublic: boolean;
  isActive: boolean;
  memberCount: number;
  postCount: number;
  discussionCount: number;
  lastActivityAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ForumType = 
  | 'general' 
  | 'q_and_a' 
  | 'announcements' 
  | 'study_group' 
  | 'project_collaboration' 
  | 'mentorship' 
  | 'alumni' 
  | 'career' 
  | 'technical' 
  | 'social';

export type ForumCategory = 
  | 'course' 
  | 'ksmp' 
  | 'general' 
  | 'academic' 
  | 'career' 
  | 'social' 
  | 'technical';

export type ForumLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface Discussion {
  id: string;
  forumId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  discussionId: string;
  forumId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentPostId?: string;
  isAnswer: boolean;
  isAccepted: boolean;
  likeCount: number;
  commentCount: number;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  discussionId: string;
  forumId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentCommentId?: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ForumMembership {
  id: string;
  forumId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: ForumRole;
  status: MembershipStatus;
  joinedAt: string;
  lastActiveAt?: string;
  postCount: number;
  commentCount: number;
  reputation: number;
}

export type ForumRole = 'member' | 'moderator' | 'admin' | 'owner';

export type MembershipStatus = 'active' | 'pending' | 'suspended' | 'banned';

export interface ModerationAction {
  id: string;
  forumId: string;
  moderatorId: string;
  moderatorName: string;
  targetType: ModerationTargetType;
  targetId: string;
  action: ModerationActionType;
  reason: string;
  description?: string;
  duration?: number; // in days
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ModerationTargetType = 'discussion' | 'post' | 'comment' | 'user';

export type ModerationActionType = 
  | 'warn' 
  | 'delete' 
  | 'lock' 
  | 'unlock' 
  | 'pin' 
  | 'unpin' 
  | 'suspend' 
  | 'ban' 
  | 'approve' 
  | 'reject';

export interface ForumStats {
  totalForums: number;
  totalDiscussions: number;
  totalPosts: number;
  totalComments: number;
  totalMembers: number;
  activeMembers: number;
  discussionsByType: { [key: string]: number };
  postsByCategory: { [key: string]: number };
  topContributors: Array<{
    userId: string;
    userName: string;
    postCount: number;
    commentCount: number;
    reputation: number;
  }>;
  recentActivity: Array<{
    type: 'discussion' | 'post' | 'comment';
    id: string;
    title: string;
    authorName: string;
    createdAt: string;
  }>;
}

export interface CommunitySearchResult {
  forums: Forum[];
  discussions: Discussion[];
  posts: Post[];
  comments: Comment[];
  totalResults: number;
  searchQuery: string;
  searchTime: number;
}

class CommunityDiscussionsService {
  /**
   * Create forum
   */
  async createForum(forum: Omit<Forum, 'id' | 'memberCount' | 'postCount' | 'discussionCount' | 'createdAt' | 'updatedAt'>): Promise<Forum> {
    try {
      const result = await client.graphql({
        query: CREATE_FORUM,
        variables: {
          input: {
            ...forum,
            memberCount: 0,
            postCount: 0,
            discussionCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createForum;
    } catch (error) {
      console.error('Error creating forum:', error);
      throw new Error('Failed to create forum');
    }
  }

  /**
   * Get forums
   */
  async getForums(filters?: {
    type?: ForumType;
    category?: ForumCategory;
    level?: ForumLevel;
    courseId?: string;
    ksmpId?: string;
    isPublic?: boolean;
    isActive?: boolean;
  }): Promise<Forum[]> {
    try {
      const result = await client.graphql({
        query: GET_FORUMS,
        variables: filters
      });

      return result.data.getForums || [];
    } catch (error) {
      console.error('Error getting forums:', error);
      return [];
    }
  }

  /**
   * Update forum
   */
  async updateForum(id: string, updates: Partial<Forum>): Promise<Forum> {
    try {
      const result = await client.graphql({
        query: UPDATE_FORUM,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateForum;
    } catch (error) {
      console.error('Error updating forum:', error);
      throw new Error('Failed to update forum');
    }
  }

  /**
   * Delete forum
   */
  async deleteForum(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_FORUM,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting forum:', error);
      return false;
    }
  }

  /**
   * Create discussion
   */
  async createDiscussion(discussion: Omit<Discussion, 'id' | 'viewCount' | 'likeCount' | 'commentCount' | 'lastActivityAt' | 'createdAt' | 'updatedAt'>): Promise<Discussion> {
    try {
      const result = await client.graphql({
        query: CREATE_DISCUSSION,
        variables: {
          input: {
            ...discussion,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            lastActivityAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update forum discussion count
      await this.updateForum(discussion.forumId, {
        discussionCount: await this.getDiscussionCount(discussion.forumId),
        lastActivityAt: new Date().toISOString()
      });

      return result.data.createDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw new Error('Failed to create discussion');
    }
  }

  /**
   * Get discussions
   */
  async getDiscussions(filters?: {
    forumId?: string;
    authorId?: string;
    isPinned?: boolean;
    isLocked?: boolean;
    isResolved?: boolean;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Discussion[]> {
    try {
      const result = await client.graphql({
        query: GET_DISCUSSIONS,
        variables: filters
      });

      return result.data.getDiscussions || [];
    } catch (error) {
      console.error('Error getting discussions:', error);
      return [];
    }
  }

  /**
   * Update discussion
   */
  async updateDiscussion(id: string, updates: Partial<Discussion>): Promise<Discussion> {
    try {
      const result = await client.graphql({
        query: UPDATE_DISCUSSION,
        variables: {
          input: {
            id,
            ...updates,
            lastActivityAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateDiscussion;
    } catch (error) {
      console.error('Error updating discussion:', error);
      throw new Error('Failed to update discussion');
    }
  }

  /**
   * Delete discussion
   */
  async deleteDiscussion(id: string): Promise<boolean> {
    try {
      const discussion = await this.getDiscussion(id);
      if (!discussion) throw new Error('Discussion not found');

      await client.graphql({
        query: DELETE_DISCUSSION,
        variables: { input: { id } }
      });

      // Update forum discussion count
      await this.updateForum(discussion.forumId, {
        discussionCount: await this.getDiscussionCount(discussion.forumId),
        lastActivityAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error deleting discussion:', error);
      return false;
    }
  }

  /**
   * Get single discussion
   */
  async getDiscussion(id: string): Promise<Discussion | null> {
    try {
      const result = await client.graphql({
        query: GET_DISCUSSIONS,
        variables: { id }
      });

      return result.data.getDiscussions?.[0] || null;
    } catch (error) {
      console.error('Error getting discussion:', error);
      return null;
    }
  }

  /**
   * Create post
   */
  async createPost(post: Omit<Post, 'id' | 'likeCount' | 'commentCount' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    try {
      const result = await client.graphql({
        query: CREATE_POST,
        variables: {
          input: {
            ...post,
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      // Update forum post count
      await this.updateForum(post.forumId, {
        postCount: await this.getPostCount(post.forumId),
        lastActivityAt: new Date().toISOString()
      });

      return result.data.createPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  /**
   * Get posts
   */
  async getPosts(filters?: {
    discussionId?: string;
    forumId?: string;
    authorId?: string;
    parentPostId?: string;
    isAnswer?: boolean;
    isAccepted?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Post[]> {
    try {
      const result = await client.graphql({
        query: GET_POSTS,
        variables: filters
      });

      return result.data.getPosts || [];
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }

  /**
   * Update post
   */
  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    try {
      const result = await client.graphql({
        query: UPDATE_POST,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updatePost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }

  /**
   * Delete post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      const post = await this.getPost(id);
      if (!post) throw new Error('Post not found');

      await client.graphql({
        query: DELETE_POST,
        variables: { input: { id } }
      });

      // Update forum post count
      await this.updateForum(post.forumId, {
        postCount: await this.getPostCount(post.forumId),
        lastActivityAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  /**
   * Get single post
   */
  async getPost(id: string): Promise<Post | null> {
    try {
      const result = await client.graphql({
        query: GET_POSTS,
        variables: { id }
      });

      return result.data.getPosts?.[0] || null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  }

  /**
   * Create comment
   */
  async createComment(comment: Omit<Comment, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    try {
      const result = await client.graphql({
        query: CREATE_COMMENT,
        variables: {
          input: {
            ...comment,
            likeCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  /**
   * Get comments
   */
  async getComments(filters?: {
    postId?: string;
    discussionId?: string;
    forumId?: string;
    authorId?: string;
    parentCommentId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Comment[]> {
    try {
      const result = await client.graphql({
        query: GET_COMMENTS,
        variables: filters
      });

      return result.data.getComments || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  /**
   * Update comment
   */
  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    try {
      const result = await client.graphql({
        query: UPDATE_COMMENT,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_COMMENT,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  /**
   * Create forum membership
   */
  async createForumMembership(membership: Omit<ForumMembership, 'id' | 'joinedAt' | 'postCount' | 'commentCount' | 'reputation'>): Promise<ForumMembership> {
    try {
      const result = await client.graphql({
        query: CREATE_FORUM_MEMBERSHIP,
        variables: {
          input: {
            ...membership,
            joinedAt: new Date().toISOString(),
            postCount: 0,
            commentCount: 0,
            reputation: 0
          }
        }
      });

      // Update forum member count
      await this.updateForum(membership.forumId, {
        memberCount: await this.getMemberCount(membership.forumId)
      });

      return result.data.createForumMembership;
    } catch (error) {
      console.error('Error creating forum membership:', error);
      throw new Error('Failed to create forum membership');
    }
  }

  /**
   * Get forum memberships
   */
  async getForumMemberships(filters?: {
    forumId?: string;
    userId?: string;
    role?: ForumRole;
    status?: MembershipStatus;
  }): Promise<ForumMembership[]> {
    try {
      const result = await client.graphql({
        query: GET_FORUM_MEMBERSHIPS,
        variables: filters
      });

      return result.data.getForumMemberships || [];
    } catch (error) {
      console.error('Error getting forum memberships:', error);
      return [];
    }
  }

  /**
   * Update forum membership
   */
  async updateForumMembership(id: string, updates: Partial<ForumMembership>): Promise<ForumMembership> {
    try {
      const result = await client.graphql({
        query: UPDATE_FORUM_MEMBERSHIP,
        variables: {
          input: {
            id,
            ...updates,
            lastActiveAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateForumMembership;
    } catch (error) {
      console.error('Error updating forum membership:', error);
      throw new Error('Failed to update forum membership');
    }
  }

  /**
   * Delete forum membership
   */
  async deleteForumMembership(id: string): Promise<boolean> {
    try {
      const membership = await this.getForumMembership(id);
      if (!membership) throw new Error('Membership not found');

      await client.graphql({
        query: DELETE_FORUM_MEMBERSHIP,
        variables: { input: { id } }
      });

      // Update forum member count
      await this.updateForum(membership.forumId, {
        memberCount: await this.getMemberCount(membership.forumId)
      });

      return true;
    } catch (error) {
      console.error('Error deleting forum membership:', error);
      return false;
    }
  }

  /**
   * Get single forum membership
   */
  async getForumMembership(id: string): Promise<ForumMembership | null> {
    try {
      const result = await client.graphql({
        query: GET_FORUM_MEMBERSHIPS,
        variables: { id }
      });

      return result.data.getForumMemberships?.[0] || null;
    } catch (error) {
      console.error('Error getting forum membership:', error);
      return null;
    }
  }

  /**
   * Create moderation action
   */
  async createModerationAction(action: Omit<ModerationAction, 'id' | 'createdAt' | 'updatedAt'>): Promise<ModerationAction> {
    try {
      const result = await client.graphql({
        query: CREATE_MODERATION_ACTION,
        variables: {
          input: {
            ...action,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createModerationAction;
    } catch (error) {
      console.error('Error creating moderation action:', error);
      throw new Error('Failed to create moderation action');
    }
  }

  /**
   * Get moderation actions
   */
  async getModerationActions(filters?: {
    forumId?: string;
    moderatorId?: string;
    targetType?: ModerationTargetType;
    targetId?: string;
    action?: ModerationActionType;
    isActive?: boolean;
  }): Promise<ModerationAction[]> {
    try {
      const result = await client.graphql({
        query: GET_MODERATION_ACTIONS,
        variables: filters
      });

      return result.data.getModerationActions || [];
    } catch (error) {
      console.error('Error getting moderation actions:', error);
      return [];
    }
  }

  /**
   * Update moderation action
   */
  async updateModerationAction(id: string, updates: Partial<ModerationAction>): Promise<ModerationAction> {
    try {
      const result = await client.graphql({
        query: UPDATE_MODERATION_ACTION,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateModerationAction;
    } catch (error) {
      console.error('Error updating moderation action:', error);
      throw new Error('Failed to update moderation action');
    }
  }

  /**
   * Search community
   */
  async searchCommunity(query: string, filters?: {
    forumId?: string;
    type?: ForumType;
    category?: ForumCategory;
  }): Promise<CommunitySearchResult> {
    try {
      const startTime = Date.now();
      
      const [forums, discussions, posts, comments] = await Promise.all([
        this.getForums(filters),
        this.getDiscussions({ forumId: filters?.forumId }),
        this.getPosts({ forumId: filters?.forumId }),
        this.getComments({ forumId: filters?.forumId })
      ]);

      const searchTime = Date.now() - startTime;

      const filteredForums = forums.filter(forum => 
        forum.name.toLowerCase().includes(query.toLowerCase()) ||
        forum.description.toLowerCase().includes(query.toLowerCase())
      );

      const filteredDiscussions = discussions.filter(discussion => 
        discussion.title.toLowerCase().includes(query.toLowerCase()) ||
        discussion.content.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase())
      );

      const filteredComments = comments.filter(comment => 
        comment.content.toLowerCase().includes(query.toLowerCase())
      );

      return {
        forums: filteredForums,
        discussions: filteredDiscussions,
        posts: filteredPosts,
        comments: filteredComments,
        totalResults: filteredForums.length + filteredDiscussions.length + filteredPosts.length + filteredComments.length,
        searchQuery: query,
        searchTime
      };
    } catch (error) {
      console.error('Error searching community:', error);
      return {
        forums: [],
        discussions: [],
        posts: [],
        comments: [],
        totalResults: 0,
        searchQuery: query,
        searchTime: 0
      };
    }
  }

  /**
   * Get forum statistics
   */
  async getForumStats(): Promise<ForumStats> {
    try {
      const result = await client.graphql({
        query: GET_FORUM_STATS
      });

      return result.data.getForumStats;
    } catch (error) {
      console.error('Error getting forum stats:', error);
      return {
        totalForums: 0,
        totalDiscussions: 0,
        totalPosts: 0,
        totalComments: 0,
        totalMembers: 0,
        activeMembers: 0,
        discussionsByType: {},
        postsByCategory: {},
        topContributors: [],
        recentActivity: []
      };
    }
  }

  /**
   * Get discussion count for forum
   */
  private async getDiscussionCount(forumId: string): Promise<number> {
    try {
      const discussions = await this.getDiscussions({ forumId });
      return discussions.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get post count for forum
   */
  private async getPostCount(forumId: string): Promise<number> {
    try {
      const posts = await this.getPosts({ forumId });
      return posts.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get member count for forum
   */
  private async getMemberCount(forumId: string): Promise<number> {
    try {
      const memberships = await this.getForumMemberships({ forumId });
      return memberships.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Like discussion
   */
  async likeDiscussion(discussionId: string, userId: string): Promise<Discussion> {
    try {
      const discussion = await this.getDiscussion(discussionId);
      if (!discussion) throw new Error('Discussion not found');

      return await this.updateDiscussion(discussionId, {
        likeCount: discussion.likeCount + 1
      });
    } catch (error) {
      console.error('Error liking discussion:', error);
      throw new Error('Failed to like discussion');
    }
  }

  /**
   * Like post
   */
  async likePost(postId: string, userId: string): Promise<Post> {
    try {
      const post = await this.getPost(postId);
      if (!post) throw new Error('Post not found');

      return await this.updatePost(postId, {
        likeCount: post.likeCount + 1
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw new Error('Failed to like post');
    }
  }

  /**
   * Like comment
   */
  async likeComment(commentId: string, userId: string): Promise<Comment> {
    try {
      const comment = await this.getComment(commentId);
      if (!comment) throw new Error('Comment not found');

      return await this.updateComment(commentId, {
        likeCount: comment.likeCount + 1
      });
    } catch (error) {
      console.error('Error liking comment:', error);
      throw new Error('Failed to like comment');
    }
  }

  /**
   * Get single comment
   */
  async getComment(id: string): Promise<Comment | null> {
    try {
      const result = await client.graphql({
        query: GET_COMMENTS,
        variables: { id }
      });

      return result.data.getComments?.[0] || null;
    } catch (error) {
      console.error('Error getting comment:', error);
      return null;
    }
  }

  /**
   * Pin discussion
   */
  async pinDiscussion(discussionId: string): Promise<Discussion> {
    try {
      return await this.updateDiscussion(discussionId, {
        isPinned: true
      });
    } catch (error) {
      console.error('Error pinning discussion:', error);
      throw new Error('Failed to pin discussion');
    }
  }

  /**
   * Unpin discussion
   */
  async unpinDiscussion(discussionId: string): Promise<Discussion> {
    try {
      return await this.updateDiscussion(discussionId, {
        isPinned: false
      });
    } catch (error) {
      console.error('Error unpinning discussion:', error);
      throw new Error('Failed to unpin discussion');
    }
  }

  /**
   * Lock discussion
   */
  async lockDiscussion(discussionId: string): Promise<Discussion> {
    try {
      return await this.updateDiscussion(discussionId, {
        isLocked: true
      });
    } catch (error) {
      console.error('Error locking discussion:', error);
      throw new Error('Failed to lock discussion');
    }
  }

  /**
   * Unlock discussion
   */
  async unlockDiscussion(discussionId: string): Promise<Discussion> {
    try {
      return await this.updateDiscussion(discussionId, {
        isLocked: false
      });
    } catch (error) {
      console.error('Error unlocking discussion:', error);
      throw new Error('Failed to unlock discussion');
    }
  }

  /**
   * Mark discussion as resolved
   */
  async markDiscussionResolved(discussionId: string): Promise<Discussion> {
    try {
      return await this.updateDiscussion(discussionId, {
        isResolved: true
      });
    } catch (error) {
      console.error('Error marking discussion as resolved:', error);
      throw new Error('Failed to mark discussion as resolved');
    }
  }

  /**
   * Accept post as answer
   */
  async acceptPostAsAnswer(postId: string): Promise<Post> {
    try {
      return await this.updatePost(postId, {
        isAccepted: true,
        isAnswer: true
      });
    } catch (error) {
      console.error('Error accepting post as answer:', error);
      throw new Error('Failed to accept post as answer');
    }
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format relative time
   */
  formatRelativeTime(date: string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(date);
    }
  }

  /**
   * Get forum type icon
   */
  getForumTypeIcon(type: ForumType): string {
    switch (type) {
      case 'general':
        return '💬';
      case 'q_and_a':
        return '❓';
      case 'announcements':
        return '📢';
      case 'study_group':
        return '📚';
      case 'project_collaboration':
        return '🤝';
      case 'mentorship':
        return '👨‍🏫';
      case 'alumni':
        return '🎓';
      case 'career':
        return '💼';
      case 'technical':
        return '⚙️';
      case 'social':
        return '🎉';
      default:
        return '💬';
    }
  }

  /**
   * Get forum level color
   */
  getForumLevelColor(level: ForumLevel): string {
    switch (level) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      case 'all':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get membership status color
   */
  getMembershipStatusColor(status: MembershipStatus): string {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-orange-600 bg-orange-100';
      case 'banned':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get moderation action color
   */
  getModerationActionColor(action: ModerationActionType): string {
    switch (action) {
      case 'warn':
        return 'text-yellow-600 bg-yellow-100';
      case 'delete':
        return 'text-red-600 bg-red-100';
      case 'lock':
        return 'text-orange-600 bg-orange-100';
      case 'unlock':
        return 'text-green-600 bg-green-100';
      case 'pin':
        return 'text-blue-600 bg-blue-100';
      case 'unpin':
        return 'text-gray-600 bg-gray-100';
      case 'suspend':
        return 'text-orange-600 bg-orange-100';
      case 'ban':
        return 'text-red-600 bg-red-100';
      case 'approve':
        return 'text-green-600 bg-green-100';
      case 'reject':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}

export const communityDiscussionsService = new CommunityDiscussionsService();

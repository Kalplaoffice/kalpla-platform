import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface ContactRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  targetId: string;
  targetName: string;
  targetEmail: string;
  targetRole: string;
  requestType: 'general_inquiry' | 'meeting_request' | 'collaboration_request' | 'investment_inquiry' | 'mentorship_request' | 'partnership_request' | 'support_request' | 'feedback_request' | 'other';
  subject: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'business' | 'technical' | 'investment' | 'mentorship' | 'partnership' | 'support' | 'feedback' | 'other';
  attachments?: any[];
  responseMessage?: string;
  respondedAt?: string;
  respondedBy?: string;
  scheduledMeeting?: any;
  followUpDate?: string;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  messageType: 'text' | 'image' | 'file' | 'meeting_invite' | 'system_message' | 'notification';
  subject?: string;
  content: string;
  attachments?: any[];
  isRead: boolean;
  readAt?: string;
  isEncrypted: boolean;
  encryptionKey?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'business' | 'technical' | 'investment' | 'mentorship' | 'partnership' | 'support' | 'feedback' | 'other';
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ContactConversation {
  id: string;
  participant1Id: string;
  participant1Name: string;
  participant1Email: string;
  participant1Role: string;
  participant2Id: string;
  participant2Name: string;
  participant2Email: string;
  participant2Role: string;
  conversationType: 'direct_message' | 'group_message' | 'support_conversation' | 'meeting_discussion' | 'project_discussion';
  subject: string;
  status: 'active' | 'archived' | 'blocked' | 'deleted';
  lastMessageAt: string;
  lastMessageId?: string;
  lastMessageContent?: string;
  lastMessageSender?: string;
  unreadCount1: number;
  unreadCount2: number;
  isArchived1: boolean;
  isArchived2: boolean;
  isBlocked1: boolean;
  isBlocked2: boolean;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSettings {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  allowContactRequests: boolean;
  allowDirectMessages: boolean;
  allowMeetingRequests: boolean;
  allowInvestorContact: boolean;
  allowMentorContact: boolean;
  allowStartupContact: boolean;
  allowStudentContact: boolean;
  contactPreferences: any;
  privacyLevel: 'public' | 'private' | 'restricted' | 'confidential';
  autoResponse?: string;
  businessHours?: any;
  timezone: string;
  notificationSettings: any;
  blockedUsers?: string[];
  whitelistedUsers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactNotification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  notificationType: 'new_message' | 'new_contact_request' | 'meeting_request' | 'message_read' | 'conversation_archived' | 'contact_approved' | 'contact_rejected' | 'system_notification';
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'business' | 'technical' | 'investment' | 'mentorship' | 'partnership' | 'support' | 'feedback' | 'other';
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  status?: string[];
  priority?: string[];
  category?: string[];
  requestType?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

class ContactService {
  /**
   * Send contact request
   */
  async sendContactRequest(requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactRequest> {
    try {
      // Check if target allows contact requests
      const targetSettings = await this.getContactSettings(requestData.targetId);
      if (!targetSettings?.allowContactRequests) {
        throw new Error('Target user does not allow contact requests');
      }

      // Check if requester is blocked
      if (targetSettings.blockedUsers?.includes(requestData.requesterId)) {
        throw new Error('You are blocked by this user');
      }

      const result = await client.models.ContactRequest.create({
        requesterId: requestData.requesterId,
        requesterName: requestData.requesterName,
        requesterEmail: requestData.requesterEmail,
        requesterRole: requestData.requesterRole,
        targetId: requestData.targetId,
        targetName: requestData.targetName,
        targetEmail: requestData.targetEmail,
        targetRole: requestData.targetRole,
        requestType: requestData.requestType,
        subject: requestData.subject,
        message: requestData.message,
        status: requestData.status,
        priority: requestData.priority,
        category: requestData.category,
        attachments: requestData.attachments ? JSON.stringify(requestData.attachments) : null,
        responseMessage: requestData.responseMessage,
        respondedAt: requestData.respondedAt,
        respondedBy: requestData.respondedBy,
        scheduledMeeting: requestData.scheduledMeeting ? JSON.stringify(requestData.scheduledMeeting) : null,
        followUpDate: requestData.followUpDate,
        tags: requestData.tags,
        metadata: requestData.metadata ? JSON.stringify(requestData.metadata) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Send notification to target
      await this.sendNotification({
        userId: requestData.targetId,
        userName: requestData.targetName,
        userEmail: requestData.targetEmail,
        notificationType: 'new_contact_request',
        title: 'New Contact Request',
        message: `${requestData.requesterName} sent you a contact request`,
        relatedId: result.data?.id,
        relatedType: 'contact_request',
        priority: requestData.priority,
        category: requestData.category,
        actionRequired: true,
        actionUrl: `/contacts/requests/${result.data?.id}`,
        metadata: JSON.stringify({ requesterId: requestData.requesterId, requesterRole: requestData.requesterRole })
      });

      console.log('Contact request sent successfully:', result.data);
      return result.data as ContactRequest;
    } catch (error) {
      console.error('Error sending contact request:', error);
      throw error;
    }
  }

  /**
   * Respond to contact request
   */
  async respondToContactRequest(requestId: string, response: string, status: 'approved' | 'rejected', responderId: string): Promise<boolean> {
    try {
      const updateData: any = {
        id: requestId,
        status: status,
        responseMessage: response,
        respondedAt: new Date().toISOString(),
        respondedBy: responderId,
        updatedAt: new Date().toISOString()
      };

      const result = await client.models.ContactRequest.update(updateData);

      // Send notification to requester
      const request = result.data as ContactRequest;
      await this.sendNotification({
        userId: request.requesterId,
        userName: request.requesterName,
        userEmail: request.requesterEmail,
        notificationType: status === 'approved' ? 'contact_approved' : 'contact_rejected',
        title: `Contact Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your contact request has been ${status}`,
        relatedId: requestId,
        relatedType: 'contact_request',
        priority: 'medium',
        category: request.category,
        actionRequired: false,
        metadata: JSON.stringify({ targetId: request.targetId, targetName: request.targetName })
      });

      console.log('Contact request response sent successfully');
      return true;
    } catch (error) {
      console.error('Error responding to contact request:', error);
      return false;
    }
  }

  /**
   * Send direct message
   */
  async sendMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
    try {
      // Check if recipient allows direct messages
      const recipientSettings = await this.getContactSettings(messageData.recipientId);
      if (!recipientSettings?.allowDirectMessages) {
        throw new Error('Recipient does not allow direct messages');
      }

      // Check if sender is blocked
      if (recipientSettings.blockedUsers?.includes(messageData.senderId)) {
        throw new Error('You are blocked by this user');
      }

      // Get or create conversation
      let conversation = await this.getConversation(messageData.senderId, messageData.recipientId);
      if (!conversation) {
        conversation = await this.createConversation({
          participant1Id: messageData.senderId,
          participant1Name: messageData.senderName,
          participant1Email: messageData.senderEmail,
          participant1Role: messageData.senderRole,
          participant2Id: messageData.recipientId,
          participant2Name: messageData.recipientName,
          participant2Email: messageData.recipientEmail,
          participant2Role: messageData.recipientRole,
          conversationType: 'direct_message',
          subject: messageData.subject || 'Direct Message',
          status: 'active',
          lastMessageAt: new Date().toISOString(),
          unreadCount1: 0,
          unreadCount2: 1,
          isArchived1: false,
          isArchived2: false,
          isBlocked1: false,
          isBlocked2: false,
          tags: [],
          metadata: JSON.stringify({})
        });
      }

      const result = await client.models.ContactMessage.create({
        conversationId: conversation.id,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        senderEmail: messageData.senderEmail,
        senderRole: messageData.senderRole,
        recipientId: messageData.recipientId,
        recipientName: messageData.recipientName,
        recipientEmail: messageData.recipientEmail,
        recipientRole: messageData.recipientRole,
        messageType: messageData.messageType,
        subject: messageData.subject,
        content: messageData.content,
        attachments: messageData.attachments ? JSON.stringify(messageData.attachments) : null,
        isRead: false,
        readAt: null,
        isEncrypted: messageData.isEncrypted,
        encryptionKey: messageData.encryptionKey,
        priority: messageData.priority,
        category: messageData.category,
        tags: messageData.tags,
        metadata: messageData.metadata ? JSON.stringify(messageData.metadata) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Update conversation
      await this.updateConversation(conversation.id, {
        lastMessageAt: new Date().toISOString(),
        lastMessageId: result.data?.id,
        lastMessageContent: messageData.content,
        lastMessageSender: messageData.senderName,
        unreadCount2: conversation.unreadCount2 + 1
      });

      // Send notification to recipient
      await this.sendNotification({
        userId: messageData.recipientId,
        userName: messageData.recipientName,
        userEmail: messageData.recipientEmail,
        notificationType: 'new_message',
        title: 'New Message',
        message: `${messageData.senderName} sent you a message`,
        relatedId: conversation.id,
        relatedType: 'conversation',
        priority: messageData.priority,
        category: messageData.category,
        actionRequired: true,
        actionUrl: `/contacts/conversations/${conversation.id}`,
        metadata: JSON.stringify({ senderId: messageData.senderId, senderRole: messageData.senderRole })
      });

      console.log('Message sent successfully:', result.data);
      return result.data as ContactMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get contact requests for user
   */
  async getContactRequests(userId: string, filters?: ContactFilters): Promise<ContactRequest[]> {
    try {
      const result = await client.models.ContactRequest.list({
        filter: {
          targetId: { eq: userId }
        }
      });

      let requests = result.data as ContactRequest[] || [];

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        requests = requests.filter(request => filters.status!.includes(request.status));
      }

      if (filters?.priority && filters.priority.length > 0) {
        requests = requests.filter(request => filters.priority!.includes(request.priority));
      }

      if (filters?.category && filters.category.length > 0) {
        requests = requests.filter(request => filters.category!.includes(request.category));
      }

      if (filters?.requestType && filters.requestType.length > 0) {
        requests = requests.filter(request => filters.requestType!.includes(request.requestType));
      }

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        requests = requests.filter(request => 
          request.subject.toLowerCase().includes(searchLower) ||
          request.message.toLowerCase().includes(searchLower) ||
          request.requesterName.toLowerCase().includes(searchLower)
        );
      }

      // Sort by priority and creation date
      requests.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return requests;
    } catch (error) {
      console.error('Error getting contact requests:', error);
      return [];
    }
  }

  /**
   * Get conversations for user
   */
  async getConversations(userId: string): Promise<ContactConversation[]> {
    try {
      const result = await client.models.ContactConversation.list({
        filter: {
          or: [
            { participant1Id: { eq: userId } },
            { participant2Id: { eq: userId } }
          ]
        }
      });

      let conversations = result.data as ContactConversation[] || [];

      // Filter out archived conversations
      conversations = conversations.filter(conv => 
        (conv.participant1Id === userId && !conv.isArchived1) ||
        (conv.participant2Id === userId && !conv.isArchived2)
      );

      // Sort by last message date
      conversations.sort((a, b) => 
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );

      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  /**
   * Get messages for conversation
   */
  async getMessages(conversationId: string): Promise<ContactMessage[]> {
    try {
      const result = await client.models.ContactMessage.list({
        filter: {
          conversationId: { eq: conversationId }
        }
      });

      let messages = result.data as ContactMessage[] || [];

      // Sort by creation date
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const result = await client.models.ContactMessage.update({
        id: messageId,
        isRead: true,
        readAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Message marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  /**
   * Get contact settings for user
   */
  async getContactSettings(userId: string): Promise<ContactSettings | null> {
    try {
      const result = await client.models.ContactSettings.list({
        filter: {
          userId: { eq: userId }
        }
      });

      return result.data?.[0] as ContactSettings || null;
    } catch (error) {
      console.error('Error getting contact settings:', error);
      return null;
    }
  }

  /**
   * Update contact settings
   */
  async updateContactSettings(userId: string, settings: Partial<ContactSettings>): Promise<ContactSettings> {
    try {
      const existingSettings = await this.getContactSettings(userId);
      
      if (existingSettings) {
        const updateData: any = {
          id: existingSettings.id,
          updatedAt: new Date().toISOString()
        };

        if (settings.allowContactRequests !== undefined) updateData.allowContactRequests = settings.allowContactRequests;
        if (settings.allowDirectMessages !== undefined) updateData.allowDirectMessages = settings.allowDirectMessages;
        if (settings.allowMeetingRequests !== undefined) updateData.allowMeetingRequests = settings.allowMeetingRequests;
        if (settings.allowInvestorContact !== undefined) updateData.allowInvestorContact = settings.allowInvestorContact;
        if (settings.allowMentorContact !== undefined) updateData.allowMentorContact = settings.allowMentorContact;
        if (settings.allowStartupContact !== undefined) updateData.allowStartupContact = settings.allowStartupContact;
        if (settings.allowStudentContact !== undefined) updateData.allowStudentContact = settings.allowStudentContact;
        if (settings.contactPreferences) updateData.contactPreferences = JSON.stringify(settings.contactPreferences);
        if (settings.privacyLevel) updateData.privacyLevel = settings.privacyLevel;
        if (settings.autoResponse) updateData.autoResponse = settings.autoResponse;
        if (settings.businessHours) updateData.businessHours = JSON.stringify(settings.businessHours);
        if (settings.timezone) updateData.timezone = settings.timezone;
        if (settings.notificationSettings) updateData.notificationSettings = JSON.stringify(settings.notificationSettings);
        if (settings.blockedUsers) updateData.blockedUsers = settings.blockedUsers;
        if (settings.whitelistedUsers) updateData.whitelistedUsers = settings.whitelistedUsers;

        const result = await client.models.ContactSettings.update(updateData);
        return result.data as ContactSettings;
      } else {
        // Create new settings
        const result = await client.models.ContactSettings.create({
          userId: userId,
          userName: settings.userName || 'User',
          userEmail: settings.userEmail || 'user@example.com',
          userRole: settings.userRole || 'user',
          allowContactRequests: settings.allowContactRequests ?? true,
          allowDirectMessages: settings.allowDirectMessages ?? true,
          allowMeetingRequests: settings.allowMeetingRequests ?? true,
          allowInvestorContact: settings.allowInvestorContact ?? true,
          allowMentorContact: settings.allowMentorContact ?? true,
          allowStartupContact: settings.allowStartupContact ?? true,
          allowStudentContact: settings.allowStudentContact ?? true,
          contactPreferences: JSON.stringify(settings.contactPreferences || {}),
          privacyLevel: settings.privacyLevel || 'private',
          autoResponse: settings.autoResponse,
          businessHours: settings.businessHours ? JSON.stringify(settings.businessHours) : null,
          timezone: settings.timezone || 'UTC',
          notificationSettings: JSON.stringify(settings.notificationSettings || {}),
          blockedUsers: settings.blockedUsers || [],
          whitelistedUsers: settings.whitelistedUsers || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return result.data as ContactSettings;
      }
    } catch (error) {
      console.error('Error updating contact settings:', error);
      throw error;
    }
  }

  /**
   * Get notifications for user
   */
  async getNotifications(userId: string): Promise<ContactNotification[]> {
    try {
      const result = await client.models.ContactNotification.list({
        filter: {
          userId: { eq: userId }
        }
      });

      let notifications = result.data as ContactNotification[] || [];

      // Sort by creation date
      notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const result = await client.models.ContactNotification.update({
        id: notificationId,
        isRead: true,
        readAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Notification marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Block user
   */
  async blockUser(userId: string, blockedUserId: string): Promise<boolean> {
    try {
      const settings = await this.getContactSettings(userId);
      if (!settings) {
        throw new Error('Contact settings not found');
      }

      const blockedUsers = settings.blockedUsers || [];
      if (!blockedUsers.includes(blockedUserId)) {
        blockedUsers.push(blockedUserId);
      }

      await this.updateContactSettings(userId, { blockedUsers });

      console.log('User blocked successfully');
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string, unblockedUserId: string): Promise<boolean> {
    try {
      const settings = await this.getContactSettings(userId);
      if (!settings) {
        throw new Error('Contact settings not found');
      }

      const blockedUsers = settings.blockedUsers || [];
      const updatedBlockedUsers = blockedUsers.filter(id => id !== unblockedUserId);

      await this.updateContactSettings(userId, { blockedUsers: updatedBlockedUsers });

      console.log('User unblocked successfully');
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      return false;
    }
  }

  /**
   * Private helper methods
   */
  private async getConversation(userId1: string, userId2: string): Promise<ContactConversation | null> {
    try {
      const result = await client.models.ContactConversation.list({
        filter: {
          or: [
            {
              and: [
                { participant1Id: { eq: userId1 } },
                { participant2Id: { eq: userId2 } }
              ]
            },
            {
              and: [
                { participant1Id: { eq: userId2 } },
                { participant2Id: { eq: userId1 } }
              ]
            }
          ]
        }
      });

      return result.data?.[0] as ContactConversation || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  private async createConversation(conversationData: Omit<ContactConversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactConversation> {
    try {
      const result = await client.models.ContactConversation.create({
        participant1Id: conversationData.participant1Id,
        participant1Name: conversationData.participant1Name,
        participant1Email: conversationData.participant1Email,
        participant1Role: conversationData.participant1Role,
        participant2Id: conversationData.participant2Id,
        participant2Name: conversationData.participant2Name,
        participant2Email: conversationData.participant2Email,
        participant2Role: conversationData.participant2Role,
        conversationType: conversationData.conversationType,
        subject: conversationData.subject,
        status: conversationData.status,
        lastMessageAt: conversationData.lastMessageAt,
        lastMessageId: conversationData.lastMessageId,
        lastMessageContent: conversationData.lastMessageContent,
        lastMessageSender: conversationData.lastMessageSender,
        unreadCount1: conversationData.unreadCount1,
        unreadCount2: conversationData.unreadCount2,
        isArchived1: conversationData.isArchived1,
        isArchived2: conversationData.isArchived2,
        isBlocked1: conversationData.isBlocked1,
        isBlocked2: conversationData.isBlocked2,
        tags: conversationData.tags,
        metadata: conversationData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return result.data as ContactConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  private async updateConversation(conversationId: string, updates: Partial<ContactConversation>): Promise<boolean> {
    try {
      const updateData: any = {
        id: conversationId,
        updatedAt: new Date().toISOString()
      };

      if (updates.lastMessageAt) updateData.lastMessageAt = updates.lastMessageAt;
      if (updates.lastMessageId) updateData.lastMessageId = updates.lastMessageId;
      if (updates.lastMessageContent) updateData.lastMessageContent = updates.lastMessageContent;
      if (updates.lastMessageSender) updateData.lastMessageSender = updates.lastMessageSender;
      if (updates.unreadCount1 !== undefined) updateData.unreadCount1 = updates.unreadCount1;
      if (updates.unreadCount2 !== undefined) updateData.unreadCount2 = updates.unreadCount2;
      if (updates.isArchived1 !== undefined) updateData.isArchived1 = updates.isArchived1;
      if (updates.isArchived2 !== undefined) updateData.isArchived2 = updates.isArchived2;
      if (updates.isBlocked1 !== undefined) updateData.isBlocked1 = updates.isBlocked1;
      if (updates.isBlocked2 !== undefined) updateData.isBlocked2 = updates.isBlocked2;

      await client.models.ContactConversation.update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating conversation:', error);
      return false;
    }
  }

  private async sendNotification(notificationData: Omit<ContactNotification, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactNotification> {
    try {
      const result = await client.models.ContactNotification.create({
        userId: notificationData.userId,
        userName: notificationData.userName,
        userEmail: notificationData.userEmail,
        notificationType: notificationData.notificationType,
        title: notificationData.title,
        message: notificationData.message,
        relatedId: notificationData.relatedId,
        relatedType: notificationData.relatedType,
        isRead: false,
        readAt: null,
        priority: notificationData.priority,
        category: notificationData.category,
        actionRequired: notificationData.actionRequired,
        actionUrl: notificationData.actionUrl,
        metadata: notificationData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return result.data as ContactNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Utility methods
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'investment':
        return 'bg-green-100 text-green-800';
      case 'mentorship':
        return 'bg-orange-100 text-orange-800';
      case 'partnership':
        return 'bg-pink-100 text-pink-800';
      case 'support':
        return 'bg-red-100 text-red-800';
      case 'feedback':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const contactService = new ContactService();

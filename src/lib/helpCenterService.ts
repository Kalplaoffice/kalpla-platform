import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,
  CREATE_SUPPORT_TICKET,
  UPDATE_SUPPORT_TICKET,
  CREATE_CONTACT_MESSAGE,
  UPDATE_CONTACT_MESSAGE,
  CREATE_KNOWLEDGE_BASE_ARTICLE,
  UPDATE_KNOWLEDGE_BASE_ARTICLE,
  DELETE_KNOWLEDGE_BASE_ARTICLE
} from '../graphql/mutations';
import {
  GET_FAQS,
  GET_SUPPORT_TICKETS,
  GET_CONTACT_MESSAGES,
  GET_KNOWLEDGE_BASE_ARTICLES,
  GET_SUPPORT_TICKET,
  GET_FAQ_CATEGORIES,
  SEARCH_HELP_CENTER
} from '../graphql/queries';

const client = generateClient();

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  priority: Priority;
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  lastUpdated: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type FAQCategory = 
  | 'general' 
  | 'account' 
  | 'billing' 
  | 'courses' 
  | 'technical' 
  | 'mobile' 
  | 'api' 
  | 'privacy' 
  | 'other';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: Priority;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  department: Department;
  attachments: Attachment[];
  messages: TicketMessage[];
  resolution?: string;
  resolvedAt?: string;
  closedAt?: string;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketCategory = 
  | 'technical_issue' 
  | 'billing_inquiry' 
  | 'account_help' 
  | 'course_support' 
  | 'feature_request' 
  | 'bug_report' 
  | 'general_inquiry' 
  | 'other';

export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'waiting_for_user' 
  | 'resolved' 
  | 'closed';

export type Department = 
  | 'technical_support' 
  | 'billing' 
  | 'customer_success' 
  | 'product' 
  | 'general';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent';
  message: string;
  attachments: Attachment[];
  isInternal: boolean;
  createdAt: string;
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: ContactCategory;
  priority: Priority;
  status: ContactStatus;
  assignedTo?: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactCategory = 
  | 'general_inquiry' 
  | 'sales' 
  | 'support' 
  | 'partnership' 
  | 'media' 
  | 'careers' 
  | 'feedback' 
  | 'other';

export type ContactStatus = 
  | 'new' 
  | 'in_progress' 
  | 'responded' 
  | 'closed';

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: KnowledgeBaseCategory;
  tags: string[];
  author: string;
  authorName: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeBaseCategory = 
  | 'getting_started' 
  | 'courses' 
  | 'account_management' 
  | 'billing' 
  | 'technical' 
  | 'mobile_app' 
  | 'api' 
  | 'troubleshooting' 
  | 'best_practices' 
  | 'other';

export interface HelpCenterSearchResult {
  faqs: FAQ[];
  articles: KnowledgeBaseArticle[];
  tickets: SupportTicket[];
  totalResults: number;
  searchQuery: string;
  searchTime: number;
}

export interface HelpCenterStats {
  totalFAQs: number;
  totalArticles: number;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number;
  satisfactionScore: number;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

class HelpCenterService {
  /**
   * Get FAQs
   */
  async getFAQs(category?: FAQCategory, searchQuery?: string): Promise<FAQ[]> {
    try {
      const result = await client.graphql({
        query: GET_FAQS,
        variables: { category, searchQuery }
      });

      return result.data.getFAQs || [];
    } catch (error) {
      console.error('Error getting FAQs:', error);
      return [];
    }
  }

  /**
   * Get FAQ categories
   */
  async getFAQCategories(): Promise<FAQCategory[]> {
    try {
      const result = await client.graphql({
        query: GET_FAQ_CATEGORIES
      });

      return result.data.getFAQCategories || [];
    } catch (error) {
      console.error('Error getting FAQ categories:', error);
      return [];
    }
  }

  /**
   * Create FAQ
   */
  async createFAQ(faq: Omit<FAQ, 'id' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>): Promise<FAQ> {
    try {
      const result = await client.graphql({
        query: CREATE_FAQ,
        variables: {
          input: {
            ...faq,
            viewCount: 0,
            helpfulCount: 0,
            notHelpfulCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createFAQ;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw new Error('Failed to create FAQ');
    }
  }

  /**
   * Update FAQ
   */
  async updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ> {
    try {
      const result = await client.graphql({
        query: UPDATE_FAQ,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateFAQ;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw new Error('Failed to update FAQ');
    }
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_FAQ,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }

  /**
   * Mark FAQ as helpful
   */
  async markFAQHelpful(id: string, isHelpful: boolean): Promise<FAQ> {
    try {
      const faq = await this.getFAQ(id);
      if (!faq) throw new Error('FAQ not found');

      const updates = isHelpful 
        ? { helpfulCount: faq.helpfulCount + 1 }
        : { notHelpfulCount: faq.notHelpfulCount + 1 };

      return await this.updateFAQ(id, updates);
    } catch (error) {
      console.error('Error marking FAQ as helpful:', error);
      throw new Error('Failed to mark FAQ as helpful');
    }
  }

  /**
   * Get single FAQ
   */
  async getFAQ(id: string): Promise<FAQ | null> {
    try {
      const result = await client.graphql({
        query: GET_FAQS,
        variables: { id }
      });

      return result.data.getFAQs?.[0] || null;
    } catch (error) {
      console.error('Error getting FAQ:', error);
      return null;
    }
  }

  /**
   * Create support ticket
   */
  async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'messages' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    try {
      const ticketNumber = this.generateTicketNumber();
      
      const result = await client.graphql({
        query: CREATE_SUPPORT_TICKET,
        variables: {
          input: {
            ...ticket,
            ticketNumber,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createSupportTicket;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw new Error('Failed to create support ticket');
    }
  }

  /**
   * Get support tickets
   */
  async getSupportTickets(userId?: string, status?: TicketStatus): Promise<SupportTicket[]> {
    try {
      const result = await client.graphql({
        query: GET_SUPPORT_TICKETS,
        variables: { userId, status }
      });

      return result.data.getSupportTickets || [];
    } catch (error) {
      console.error('Error getting support tickets:', error);
      return [];
    }
  }

  /**
   * Get single support ticket
   */
  async getSupportTicket(id: string): Promise<SupportTicket | null> {
    try {
      const result = await client.graphql({
        query: GET_SUPPORT_TICKET,
        variables: { id }
      });

      return result.data.getSupportTicket;
    } catch (error) {
      console.error('Error getting support ticket:', error);
      return null;
    }
  }

  /**
   * Update support ticket
   */
  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    try {
      const result = await client.graphql({
        query: UPDATE_SUPPORT_TICKET,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateSupportTicket;
    } catch (error) {
      console.error('Error updating support ticket:', error);
      throw new Error('Failed to update support ticket');
    }
  }

  /**
   * Add message to support ticket
   */
  async addTicketMessage(ticketId: string, message: Omit<TicketMessage, 'id' | 'createdAt'>): Promise<TicketMessage> {
    try {
      const ticket = await this.getSupportTicket(ticketId);
      if (!ticket) throw new Error('Ticket not found');

      const newMessage: TicketMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const updatedMessages = [...ticket.messages, newMessage];
      
      await this.updateSupportTicket(ticketId, { messages: updatedMessages });
      
      return newMessage;
    } catch (error) {
      console.error('Error adding ticket message:', error);
      throw new Error('Failed to add ticket message');
    }
  }

  /**
   * Create contact message
   */
  async createContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
    try {
      const result = await client.graphql({
        query: CREATE_CONTACT_MESSAGE,
        variables: {
          input: {
            ...message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createContactMessage;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw new Error('Failed to create contact message');
    }
  }

  /**
   * Get contact messages
   */
  async getContactMessages(status?: ContactStatus): Promise<ContactMessage[]> {
    try {
      const result = await client.graphql({
        query: GET_CONTACT_MESSAGES,
        variables: { status }
      });

      return result.data.getContactMessages || [];
    } catch (error) {
      console.error('Error getting contact messages:', error);
      return [];
    }
  }

  /**
   * Update contact message
   */
  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    try {
      const result = await client.graphql({
        query: UPDATE_CONTACT_MESSAGE,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateContactMessage;
    } catch (error) {
      console.error('Error updating contact message:', error);
      throw new Error('Failed to update contact message');
    }
  }

  /**
   * Get knowledge base articles
   */
  async getKnowledgeBaseArticles(category?: KnowledgeBaseCategory, searchQuery?: string): Promise<KnowledgeBaseArticle[]> {
    try {
      const result = await client.graphql({
        query: GET_KNOWLEDGE_BASE_ARTICLES,
        variables: { category, searchQuery }
      });

      return result.data.getKnowledgeBaseArticles || [];
    } catch (error) {
      console.error('Error getting knowledge base articles:', error);
      return [];
    }
  }

  /**
   * Create knowledge base article
   */
  async createKnowledgeBaseArticle(article: Omit<KnowledgeBaseArticle, 'id' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeBaseArticle> {
    try {
      const result = await client.graphql({
        query: CREATE_KNOWLEDGE_BASE_ARTICLE,
        variables: {
          input: {
            ...article,
            viewCount: 0,
            helpfulCount: 0,
            notHelpfulCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createKnowledgeBaseArticle;
    } catch (error) {
      console.error('Error creating knowledge base article:', error);
      throw new Error('Failed to create knowledge base article');
    }
  }

  /**
   * Update knowledge base article
   */
  async updateKnowledgeBaseArticle(id: string, updates: Partial<KnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> {
    try {
      const result = await client.graphql({
        query: UPDATE_KNOWLEDGE_BASE_ARTICLE,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateKnowledgeBaseArticle;
    } catch (error) {
      console.error('Error updating knowledge base article:', error);
      throw new Error('Failed to update knowledge base article');
    }
  }

  /**
   * Delete knowledge base article
   */
  async deleteKnowledgeBaseArticle(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_KNOWLEDGE_BASE_ARTICLE,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting knowledge base article:', error);
      return false;
    }
  }

  /**
   * Search help center
   */
  async searchHelpCenter(query: string): Promise<HelpCenterSearchResult> {
    try {
      const startTime = Date.now();
      
      const [faqs, articles, tickets] = await Promise.all([
        this.getFAQs(undefined, query),
        this.getKnowledgeBaseArticles(undefined, query),
        this.getSupportTickets(undefined, undefined) // In real implementation, would filter by query
      ]);

      const searchTime = Date.now() - startTime;

      return {
        faqs: faqs.filter(faq => 
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
        ),
        articles: articles.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase())
        ),
        tickets: tickets.filter(ticket => 
          ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
          ticket.description.toLowerCase().includes(query.toLowerCase())
        ),
        totalResults: 0, // Will be calculated
        searchQuery: query,
        searchTime
      };
    } catch (error) {
      console.error('Error searching help center:', error);
      return {
        faqs: [],
        articles: [],
        tickets: [],
        totalResults: 0,
        searchQuery: query,
        searchTime: 0
      };
    }
  }

  /**
   * Get help center stats
   */
  async getHelpCenterStats(): Promise<HelpCenterStats> {
    try {
      const [faqs, articles, tickets] = await Promise.all([
        this.getFAQs(),
        this.getKnowledgeBaseArticles(),
        this.getSupportTickets()
      ]);

      const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
      const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length;
      
      // Calculate average response time (simplified)
      const averageResponseTime = this.calculateAverageResponseTime(tickets);
      
      // Calculate satisfaction score (simplified)
      const satisfactionScore = this.calculateSatisfactionScore(tickets);
      
      // Get popular categories
      const popularCategories = this.getPopularCategories(faqs, articles);

      return {
        totalFAQs: faqs.length,
        totalArticles: articles.length,
        totalTickets: tickets.length,
        openTickets,
        resolvedTickets,
        averageResponseTime,
        satisfactionScore,
        popularCategories
      };
    } catch (error) {
      console.error('Error getting help center stats:', error);
      return {
        totalFAQs: 0,
        totalArticles: 0,
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0,
        averageResponseTime: 0,
        satisfactionScore: 0,
        popularCategories: []
      };
    }
  }

  /**
   * Generate ticket number
   */
  private generateTicketNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK-${timestamp}-${random}`;
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(tickets: SupportTicket[]): number {
    const ticketsWithResponse = tickets.filter(ticket => 
      ticket.messages.length > 1 && ticket.messages[1].senderType === 'agent'
    );

    if (ticketsWithResponse.length === 0) return 0;

    const totalResponseTime = ticketsWithResponse.reduce((sum, ticket) => {
      const userMessage = ticket.messages[0];
      const agentMessage = ticket.messages[1];
      
      const responseTime = new Date(agentMessage.createdAt).getTime() - new Date(userMessage.createdAt).getTime();
      return sum + responseTime;
    }, 0);

    return Math.round(totalResponseTime / ticketsWithResponse.length / (1000 * 60 * 60)); // Hours
  }

  /**
   * Calculate satisfaction score
   */
  private calculateSatisfactionScore(tickets: SupportTicket[]): number {
    const ticketsWithRating = tickets.filter(ticket => ticket.satisfactionRating !== undefined);
    
    if (ticketsWithRating.length === 0) return 0;

    const totalRating = ticketsWithRating.reduce((sum, ticket) => sum + (ticket.satisfactionRating || 0), 0);
    return Math.round((totalRating / ticketsWithRating.length) * 20); // Convert to percentage
  }

  /**
   * Get popular categories
   */
  private getPopularCategories(faqs: FAQ[], articles: KnowledgeBaseArticle[]): Array<{ category: string; count: number }> {
    const categoryCount: { [key: string]: number } = {};

    // Count FAQ categories
    faqs.forEach(faq => {
      categoryCount[faq.category] = (categoryCount[faq.category] || 0) + 1;
    });

    // Count article categories
    articles.forEach(article => {
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
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
   * Format priority
   */
  formatPriority(priority: Priority): { label: string; color: string } {
    switch (priority) {
      case 'critical':
        return { label: 'Critical', color: 'text-red-600 bg-red-100' };
      case 'high':
        return { label: 'High', color: 'text-orange-600 bg-orange-100' };
      case 'medium':
        return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
      case 'low':
        return { label: 'Low', color: 'text-green-600 bg-green-100' };
      default:
        return { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };
    }
  }

  /**
   * Format status
   */
  formatStatus(status: TicketStatus | ContactStatus): { label: string; color: string } {
    switch (status) {
      case 'open':
      case 'new':
        return { label: 'Open', color: 'text-blue-600 bg-blue-100' };
      case 'in_progress':
        return { label: 'In Progress', color: 'text-yellow-600 bg-yellow-100' };
      case 'waiting_for_user':
        return { label: 'Waiting for User', color: 'text-orange-600 bg-orange-100' };
      case 'resolved':
        return { label: 'Resolved', color: 'text-green-600 bg-green-100' };
      case 'closed':
        return { label: 'Closed', color: 'text-gray-600 bg-gray-100' };
      case 'responded':
        return { label: 'Responded', color: 'text-green-600 bg-green-100' };
      default:
        return { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };
    }
  }
}

export const helpCenterService = new HelpCenterService();

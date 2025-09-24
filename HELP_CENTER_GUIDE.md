# Help Center - FAQ, Contact Form & Support Tickets

This document provides a comprehensive guide for the Kalpla help center system that includes FAQ management, contact forms, and support ticket functionality.

## Overview

The help center system provides:
- **FAQ Management**: Comprehensive FAQ system with categories and search
- **Contact Form**: User contact form with message management
- **Support Tickets**: Full-featured support ticket system
- **Knowledge Base**: Knowledge base articles and documentation
- **Search Functionality**: Advanced search across all help content
- **User Feedback**: Helpful/not helpful voting system
- **Admin Dashboard**: Complete admin interface for managing help content
- **Analytics**: Help center statistics and performance metrics

## Architecture

```
Frontend (React) → Help Center Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
```

## Components

### 1. Help Center Service (`helpCenterService.ts`)

**Location**: `src/lib/helpCenterService.ts`

**Features**:
- FAQ management and search
- Support ticket creation and management
- Contact message handling
- Knowledge base article management
- Search functionality across all content
- User feedback and rating system
- Help center analytics and statistics

**Key Methods**:
- `getFAQs()`: Get FAQs with filtering and search
- `createFAQ()`: Create new FAQ
- `updateFAQ()`: Update existing FAQ
- `deleteFAQ()`: Delete FAQ
- `markFAQHelpful()`: Mark FAQ as helpful/not helpful
- `createSupportTicket()`: Create new support ticket
- `getSupportTickets()`: Get support tickets
- `updateSupportTicket()`: Update support ticket
- `addTicketMessage()`: Add message to ticket
- `createContactMessage()`: Create contact message
- `getKnowledgeBaseArticles()`: Get knowledge base articles
- `searchHelpCenter()`: Search across all help content
- `getHelpCenterStats()`: Get help center statistics

### 2. Help Center Dashboard (`HelpCenterDashboard.tsx`)

**Location**: `src/components/help/HelpCenterDashboard.tsx`

**Features**:
- Multi-tab interface for different help content types
- FAQ management and display
- Support ticket management
- Contact message handling
- Knowledge base article management
- Search functionality
- Admin controls for content management
- Statistics and analytics display

## Database Schema

### DynamoDB Tables

#### 1. FAQs Table (`FAQS_TABLE`)
```json
{
  "id": "faqId",
  "question": "string",
  "answer": "string",
  "category": "general|account|billing|courses|technical|mobile|api|privacy|other",
  "tags": ["string"],
  "priority": "low|medium|high|critical",
  "isPublished": "boolean",
  "viewCount": "number",
  "helpfulCount": "number",
  "notHelpfulCount": "number",
  "lastUpdated": "ISO string",
  "createdBy": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Support Tickets Table (`SUPPORT_TICKETS_TABLE`)
```json
{
  "id": "ticketId",
  "ticketNumber": "string",
  "userId": "string",
  "userName": "string",
  "userEmail": "string",
  "subject": "string",
  "description": "string",
  "category": "technical_issue|billing_inquiry|account_help|course_support|feature_request|bug_report|general_inquiry|other",
  "priority": "low|medium|high|critical",
  "status": "open|in_progress|waiting_for_user|resolved|closed",
  "assignedTo": "string",
  "assignedToName": "string",
  "department": "technical_support|billing|customer_success|product|general",
  "attachments": [
    {
      "id": "string",
      "fileName": "string",
      "fileSize": "number",
      "fileType": "string",
      "fileUrl": "string",
      "uploadedBy": "string",
      "uploadedAt": "ISO string"
    }
  ],
  "messages": [
    {
      "id": "string",
      "ticketId": "string",
      "senderId": "string",
      "senderName": "string",
      "senderType": "user|agent",
      "message": "string",
      "attachments": ["Attachment"],
      "isInternal": "boolean",
      "createdAt": "ISO string"
    }
  ],
  "resolution": "string",
  "resolvedAt": "ISO string",
  "closedAt": "ISO string",
  "satisfactionRating": "number",
  "satisfactionFeedback": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 3. Contact Messages Table (`CONTACT_MESSAGES_TABLE`)
```json
{
  "id": "messageId",
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string",
  "category": "general_inquiry|sales|support|partnership|media|careers|feedback|other",
  "priority": "low|medium|high|critical",
  "status": "new|in_progress|responded|closed",
  "assignedTo": "string",
  "response": "string",
  "respondedAt": "ISO string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 4. Knowledge Base Articles Table (`KNOWLEDGE_BASE_ARTICLES_TABLE`)
```json
{
  "id": "articleId",
  "title": "string",
  "content": "string",
  "summary": "string",
  "category": "getting_started|courses|account_management|billing|technical|mobile_app|api|troubleshooting|best_practices|other",
  "tags": ["string"],
  "author": "string",
  "authorName": "string",
  "isPublished": "boolean",
  "isFeatured": "boolean",
  "viewCount": "number",
  "helpfulCount": "number",
  "notHelpfulCount": "number",
  "lastUpdated": "ISO string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic FAQ Management

```typescript
import { helpCenterService } from '@/lib/helpCenterService';

// Get FAQs
const faqs = await helpCenterService.getFAQs('general');

// Create FAQ
const newFAQ = await helpCenterService.createFAQ({
  question: 'How do I reset my password?',
  answer: 'You can reset your password by clicking the "Forgot Password" link...',
  category: 'account',
  tags: ['password', 'reset', 'account'],
  priority: 'medium',
  isPublished: true,
  lastUpdated: new Date().toISOString(),
  createdBy: 'admin'
});

// Mark FAQ as helpful
await helpCenterService.markFAQHelpful(faqId, true);
```

### 2. Support Ticket Management

```typescript
// Create support ticket
const newTicket = await helpCenterService.createSupportTicket({
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  subject: 'Login Issue',
  description: 'I am unable to log into my account...',
  category: 'technical_issue',
  priority: 'high',
  status: 'open',
  department: 'technical_support',
  attachments: []
});

// Add message to ticket
await helpCenterService.addTicketMessage(ticketId, {
  ticketId,
  senderId: 'user123',
  senderName: 'John Doe',
  senderType: 'user',
  message: 'I tried clearing my browser cache but still having issues.',
  attachments: [],
  isInternal: false
});
```

### 3. Contact Message Handling

```typescript
// Create contact message
const newMessage = await helpCenterService.createContactMessage({
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1234567890',
  subject: 'Partnership Inquiry',
  message: 'I would like to discuss a potential partnership...',
  category: 'partnership',
  priority: 'medium',
  status: 'new'
});

// Update contact message
await helpCenterService.updateContactMessage(messageId, {
  status: 'responded',
  response: 'Thank you for your interest. We will get back to you soon.',
  respondedAt: new Date().toISOString()
});
```

### 4. Knowledge Base Management

```typescript
// Get knowledge base articles
const articles = await helpCenterService.getKnowledgeBaseArticles('getting_started');

// Create knowledge base article
const newArticle = await helpCenterService.createKnowledgeBaseArticle({
  title: 'Getting Started with Kalpla',
  content: 'Welcome to Kalpla! This guide will help you get started...',
  summary: 'A comprehensive guide for new users',
  category: 'getting_started',
  tags: ['getting_started', 'tutorial', 'beginner'],
  author: 'admin',
  authorName: 'Admin User',
  isPublished: true,
  isFeatured: true,
  lastUpdated: new Date().toISOString()
});
```

### 5. Search Functionality

```typescript
// Search help center
const searchResults = await helpCenterService.searchHelpCenter('password reset');

// Get help center statistics
const stats = await helpCenterService.getHelpCenterStats();
```

## Features

### 1. FAQ System

#### FAQ Categories
- **General**: General questions about the platform
- **Account**: Account management and settings
- **Billing**: Billing and payment questions
- **Courses**: Course-related questions
- **Technical**: Technical support questions
- **Mobile**: Mobile app questions
- **API**: API and developer questions
- **Privacy**: Privacy and security questions
- **Other**: Miscellaneous questions

#### FAQ Management
```typescript
// Create FAQ with validation
const createFAQ = async (faqData: FAQInput) => {
  // Validate required fields
  if (!faqData.question || !faqData.answer) {
    throw new Error('Question and answer are required');
  }

  // Create FAQ
  const faq = await helpCenterService.createFAQ({
    question: faqData.question,
    answer: faqData.answer,
    category: faqData.category,
    tags: faqData.tags,
    priority: faqData.priority,
    isPublished: faqData.isPublished,
    lastUpdated: new Date().toISOString(),
    createdBy: faqData.createdBy
  });

  return faq;
};
```

#### FAQ Voting System
```typescript
// Mark FAQ as helpful
const markFAQHelpful = async (faqId: string, isHelpful: boolean) => {
  try {
    const faq = await helpCenterService.getFAQ(faqId);
    if (!faq) throw new Error('FAQ not found');

    const updates = isHelpful 
      ? { helpfulCount: faq.helpfulCount + 1 }
      : { notHelpfulCount: faq.notHelpfulCount + 1 };

    return await helpCenterService.updateFAQ(faqId, updates);
  } catch (error) {
    console.error('Error marking FAQ as helpful:', error);
    throw new Error('Failed to mark FAQ as helpful');
  }
};
```

### 2. Support Ticket System

#### Ticket Categories
- **Technical Issue**: Technical problems and bugs
- **Billing Inquiry**: Billing and payment questions
- **Account Help**: Account management assistance
- **Course Support**: Course-related support
- **Feature Request**: Requests for new features
- **Bug Report**: Bug reports and issues
- **General Inquiry**: General questions
- **Other**: Miscellaneous inquiries

#### Ticket Status Workflow
```typescript
const ticketStatusWorkflow = {
  open: ['in_progress', 'closed'],
  in_progress: ['waiting_for_user', 'resolved', 'closed'],
  waiting_for_user: ['in_progress', 'resolved', 'closed'],
  resolved: ['closed'],
  closed: []
};
```

#### Ticket Message System
```typescript
// Add message to ticket
const addTicketMessage = async (ticketId: string, messageData: MessageInput) => {
  try {
    const ticket = await helpCenterService.getSupportTicket(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderType: messageData.senderType,
      message: messageData.message,
      attachments: messageData.attachments || [],
      isInternal: messageData.isInternal || false,
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...ticket.messages, newMessage];
    
    await helpCenterService.updateSupportTicket(ticketId, { 
      messages: updatedMessages,
      status: messageData.senderType === 'agent' ? 'in_progress' : 'waiting_for_user'
    });
    
    return newMessage;
  } catch (error) {
    console.error('Error adding ticket message:', error);
    throw new Error('Failed to add ticket message');
  }
};
```

### 3. Contact Form System

#### Contact Categories
- **General Inquiry**: General questions and inquiries
- **Sales**: Sales and pricing questions
- **Support**: Support requests
- **Partnership**: Partnership opportunities
- **Media**: Media and press inquiries
- **Careers**: Job opportunities
- **Feedback**: Product feedback
- **Other**: Miscellaneous inquiries

#### Contact Message Processing
```typescript
// Process contact message
const processContactMessage = async (messageId: string, response: string) => {
  try {
    const message = await helpCenterService.getContactMessage(messageId);
    if (!message) throw new Error('Message not found');

    await helpCenterService.updateContactMessage(messageId, {
      status: 'responded',
      response,
      respondedAt: new Date().toISOString()
    });

    // Send email notification to user
    await sendEmailNotification(message.email, response);

    return true;
  } catch (error) {
    console.error('Error processing contact message:', error);
    throw new Error('Failed to process contact message');
  }
};
```

### 4. Knowledge Base System

#### Knowledge Base Categories
- **Getting Started**: Beginner guides and tutorials
- **Courses**: Course-related documentation
- **Account Management**: Account settings and management
- **Billing**: Billing and payment documentation
- **Technical**: Technical documentation
- **Mobile App**: Mobile app documentation
- **API**: API documentation
- **Troubleshooting**: Problem-solving guides
- **Best Practices**: Best practices and tips
- **Other**: Miscellaneous documentation

#### Article Management
```typescript
// Create knowledge base article
const createArticle = async (articleData: ArticleInput) => {
  try {
    // Validate required fields
    if (!articleData.title || !articleData.content) {
      throw new Error('Title and content are required');
    }

    // Generate summary if not provided
    const summary = articleData.summary || generateSummary(articleData.content);

    const article = await helpCenterService.createKnowledgeBaseArticle({
      title: articleData.title,
      content: articleData.content,
      summary,
      category: articleData.category,
      tags: articleData.tags,
      author: articleData.author,
      authorName: articleData.authorName,
      isPublished: articleData.isPublished,
      isFeatured: articleData.isFeatured,
      lastUpdated: new Date().toISOString()
    });

    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error('Failed to create article');
  }
};
```

### 5. Search System

#### Advanced Search
```typescript
// Search help center with filters
const searchHelpCenter = async (query: string, filters?: SearchFilters) => {
  try {
    const startTime = Date.now();
    
    const [faqs, articles, tickets] = await Promise.all([
      helpCenterService.getFAQs(undefined, query),
      helpCenterService.getKnowledgeBaseArticles(undefined, query),
      helpCenterService.getSupportTickets(undefined, undefined)
    ]);

    const searchTime = Date.now() - startTime;

    // Filter results based on search filters
    let filteredFAQs = faqs;
    let filteredArticles = articles;
    let filteredTickets = tickets;

    if (filters?.category) {
      filteredFAQs = faqs.filter(faq => faq.category === filters.category);
      filteredArticles = articles.filter(article => article.category === filters.category);
    }

    if (filters?.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filteredFAQs = filteredFAQs.filter(faq => 
        new Date(faq.createdAt) >= startDate && new Date(faq.createdAt) <= endDate
      );
    }

    return {
      faqs: filteredFAQs,
      articles: filteredArticles,
      tickets: filteredTickets,
      totalResults: filteredFAQs.length + filteredArticles.length + filteredTickets.length,
      searchQuery: query,
      searchTime
    };
  } catch (error) {
    console.error('Error searching help center:', error);
    throw new Error('Failed to search help center');
  }
};
```

## Dashboard Features

### 1. FAQ Tab
- **FAQ List**: Display all FAQs with filtering and sorting
- **Category Filter**: Filter FAQs by category
- **Search**: Search within FAQs
- **Voting System**: Helpful/not helpful voting
- **Admin Controls**: Create, edit, delete FAQs
- **Statistics**: View count, helpful count, etc.

### 2. Support Tickets Tab
- **Ticket List**: Display all support tickets
- **Status Management**: Update ticket status
- **Priority Management**: Set ticket priority
- **Message System**: Add messages to tickets
- **Assignment**: Assign tickets to support agents
- **Resolution Tracking**: Track ticket resolution

### 3. Contact Messages Tab
- **Message List**: Display all contact messages
- **Status Management**: Update message status
- **Response System**: Respond to messages
- **Category Filter**: Filter by message category
- **Priority Management**: Set message priority

### 4. Knowledge Base Tab
- **Article List**: Display all knowledge base articles
- **Category Filter**: Filter articles by category
- **Featured Articles**: Highlight featured articles
- **Search**: Search within articles
- **Voting System**: Helpful/not helpful voting
- **Admin Controls**: Create, edit, delete articles

### 5. Search Results Tab
- **Unified Search**: Search across all help content
- **Result Categories**: Separate results by content type
- **Search Statistics**: Search time and result count
- **Quick Access**: Direct links to content

## Analytics and Statistics

### 1. Help Center Stats
```typescript
interface HelpCenterStats {
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
```

### 2. Performance Metrics
- **Response Time**: Average time to respond to tickets
- **Satisfaction Score**: User satisfaction rating
- **Resolution Rate**: Percentage of resolved tickets
- **Popular Content**: Most viewed FAQs and articles
- **Search Performance**: Search success rate and time

### 3. User Engagement
- **View Counts**: Track content views
- **Helpful Ratings**: Track helpful/not helpful votes
- **Search Queries**: Track popular search terms
- **User Feedback**: Collect user feedback

## Best Practices

### 1. Content Management
- **Regular Updates**: Keep FAQs and articles up to date
- **Clear Language**: Use clear, concise language
- **Categorization**: Properly categorize all content
- **Search Optimization**: Optimize content for search

### 2. User Experience
- **Easy Navigation**: Make content easy to find
- **Quick Access**: Provide quick access to common questions
- **Feedback System**: Collect user feedback
- **Mobile Friendly**: Ensure mobile compatibility

### 3. Support Efficiency
- **Quick Response**: Respond to tickets quickly
- **Proper Assignment**: Assign tickets to appropriate agents
- **Resolution Tracking**: Track ticket resolution
- **Knowledge Sharing**: Share knowledge across team

### 4. Security
- **Access Control**: Implement proper access controls
- **Data Privacy**: Protect user data
- **Audit Trail**: Track all changes
- **Secure Communication**: Secure ticket communication

## API Reference

### Help Center Service

#### Methods
- `getFAQs(category?, searchQuery?)`: Get FAQs with filtering
- `createFAQ(faq)`: Create new FAQ
- `updateFAQ(id, updates)`: Update existing FAQ
- `deleteFAQ(id)`: Delete FAQ
- `markFAQHelpful(id, isHelpful)`: Mark FAQ as helpful
- `getSupportTickets(userId?, status?)`: Get support tickets
- `createSupportTicket(ticket)`: Create new support ticket
- `updateSupportTicket(id, updates)`: Update support ticket
- `addTicketMessage(ticketId, message)`: Add message to ticket
- `createContactMessage(message)`: Create contact message
- `updateContactMessage(id, updates)`: Update contact message
- `getKnowledgeBaseArticles(category?, searchQuery?)`: Get articles
- `createKnowledgeBaseArticle(article)`: Create new article
- `updateKnowledgeBaseArticle(id, updates)`: Update article
- `deleteKnowledgeBaseArticle(id)`: Delete article
- `searchHelpCenter(query)`: Search across all content
- `getHelpCenterStats()`: Get help center statistics
- `formatDate(date)`: Format date
- `formatPriority(priority)`: Format priority
- `formatStatus(status)`: Format status

## Future Enhancements

1. **AI-Powered Search**: AI-enhanced search capabilities
2. **Chatbot Integration**: Integrate chatbot for instant support
3. **Video Tutorials**: Add video content to knowledge base
4. **Multi-language Support**: Support multiple languages
5. **Advanced Analytics**: More detailed analytics and reporting
6. **Integration**: Third-party tool integration
7. **Mobile App**: Dedicated mobile app for help center
8. **Automation**: Automated ticket routing and responses

## Support

For issues or questions:
1. Check FAQ section
2. Search knowledge base
3. Create support ticket
4. Contact support team
5. Check documentation

The help center system provides comprehensive FAQ management, contact form handling, and support ticket functionality with advanced search and analytics capabilities!

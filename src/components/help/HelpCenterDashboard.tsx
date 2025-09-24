'use client';

import React, { useState, useEffect } from 'react';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FilterIcon,
  SortAscendingIcon,
  SortDescendingIcon
} from '@heroicons/react/24/outline';
import { 
  helpCenterService, 
  FAQ, 
  SupportTicket, 
  ContactMessage, 
  KnowledgeBaseArticle,
  HelpCenterSearchResult,
  HelpCenterStats,
  FAQCategory,
  TicketCategory,
  ContactCategory,
  KnowledgeBaseCategory,
  Priority,
  TicketStatus,
  ContactStatus
} from '@/lib/helpCenterService';

interface HelpCenterDashboardProps {
  userId: string;
  userRole: 'admin' | 'support' | 'user';
}

export function HelpCenterDashboard({
  userId,
  userRole
}: HelpCenterDashboardProps) {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact' | 'knowledge' | 'search'>('faq');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [searchResults, setSearchResults] = useState<HelpCenterSearchResult | null>(null);
  const [stats, setStats] = useState<HelpCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadData();
  }, [activeTab, selectedCategory, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'faq':
          const faqData = await helpCenterService.getFAQs(selectedCategory as FAQCategory);
          setFaqs(faqData);
          break;
        case 'tickets':
          const ticketData = await helpCenterService.getSupportTickets();
          setTickets(ticketData);
          break;
        case 'contact':
          const contactData = await helpCenterService.getContactMessages();
          setContactMessages(contactData);
          break;
        case 'knowledge':
          const articleData = await helpCenterService.getKnowledgeBaseArticles(selectedCategory as KnowledgeBaseCategory);
          setArticles(articleData);
          break;
        case 'search':
          if (searchQuery) {
            const searchData = await helpCenterService.searchHelpCenter(searchQuery);
            setSearchResults(searchData);
          }
          break;
      }

      // Load stats for admin/support users
      if (userRole === 'admin' || userRole === 'support') {
        const statsData = await helpCenterService.getHelpCenterStats();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setActiveTab('search');
    await loadData();
  };

  const handleCreateFAQ = async (faqData: Partial<FAQ>) => {
    try {
      const newFAQ = await helpCenterService.createFAQ({
        question: faqData.question || '',
        answer: faqData.answer || '',
        category: faqData.category || 'general',
        tags: faqData.tags || [],
        priority: faqData.priority || 'medium',
        isPublished: faqData.isPublished || false,
        lastUpdated: new Date().toISOString(),
        createdBy: userId
      });
      
      setFaqs(prev => [newFAQ, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create FAQ');
    }
  };

  const handleCreateTicket = async (ticketData: Partial<SupportTicket>) => {
    try {
      const newTicket = await helpCenterService.createSupportTicket({
        userId: ticketData.userId || userId,
        userName: ticketData.userName || 'User',
        userEmail: ticketData.userEmail || 'user@example.com',
        subject: ticketData.subject || '',
        description: ticketData.description || '',
        category: ticketData.category || 'general_inquiry',
        priority: ticketData.priority || 'medium',
        status: 'open',
        department: ticketData.department || 'general',
        attachments: ticketData.attachments || []
      });
      
      setTickets(prev => [newTicket, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    }
  };

  const handleCreateContactMessage = async (messageData: Partial<ContactMessage>) => {
    try {
      const newMessage = await helpCenterService.createContactMessage({
        name: messageData.name || '',
        email: messageData.email || '',
        phone: messageData.phone,
        subject: messageData.subject || '',
        message: messageData.message || '',
        category: messageData.category || 'general_inquiry',
        priority: messageData.priority || 'medium',
        status: 'new'
      });
      
      setContactMessages(prev => [newMessage, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create contact message');
    }
  };

  const handleCreateArticle = async (articleData: Partial<KnowledgeBaseArticle>) => {
    try {
      const newArticle = await helpCenterService.createKnowledgeBaseArticle({
        title: articleData.title || '',
        content: articleData.content || '',
        summary: articleData.summary || '',
        category: articleData.category || 'general',
        tags: articleData.tags || [],
        author: userId,
        authorName: articleData.authorName || 'Author',
        isPublished: articleData.isPublished || false,
        isFeatured: articleData.isFeatured || false,
        lastUpdated: new Date().toISOString()
      });
      
      setArticles(prev => [newArticle, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    }
  };

  const handleMarkHelpful = async (id: string, isHelpful: boolean, type: 'faq' | 'article') => {
    try {
      if (type === 'faq') {
        await helpCenterService.markFAQHelpful(id, isHelpful);
        setFaqs(prev => prev.map(faq => 
          faq.id === id 
            ? { 
                ...faq, 
                helpfulCount: isHelpful ? faq.helpfulCount + 1 : faq.helpfulCount,
                notHelpfulCount: !isHelpful ? faq.notHelpfulCount + 1 : faq.notHelpfulCount
              }
            : faq
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark as helpful');
    }
  };

  const getStatusColor = (status: string) => {
    const statusInfo = helpCenterService.formatStatus(status as any);
    return statusInfo.color;
  };

  const getPriorityColor = (priority: Priority) => {
    const priorityInfo = helpCenterService.formatPriority(priority);
    return priorityInfo.color;
  };

  const formatDate = (date: string) => {
    return helpCenterService.formatDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-600">Manage FAQs, support tickets, and knowledge base</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search help center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Create Button */}
            {(userRole === 'admin' || userRole === 'support') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats (Admin/Support only) */}
      {stats && (userRole === 'admin' || userRole === 'support') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total FAQs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFAQs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Knowledge Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TicketIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.satisfactionScore}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'faq', label: 'FAQs', icon: QuestionMarkCircleIcon },
              { id: 'tickets', label: 'Support Tickets', icon: TicketIcon },
              { id: 'contact', label: 'Contact Messages', icon: ChatBubbleLeftRightIcon },
              { id: 'knowledge', label: 'Knowledge Base', icon: BookOpenIcon },
              { id: 'search', label: 'Search Results', icon: MagnifyingGlassIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* FAQs Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="general">General</option>
                  <option value="account">Account</option>
                  <option value="billing">Billing</option>
                  <option value="courses">Courses</option>
                  <option value="technical">Technical</option>
                  <option value="mobile">Mobile</option>
                  <option value="api">API</option>
                  <option value="privacy">Privacy</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="viewCount">View Count</option>
                  <option value="helpfulCount">Helpful Count</option>
                  <option value="priority">Priority</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAscendingIcon className="h-4 w-4" /> : <SortDescendingIcon className="h-4 w-4" />}
                </button>
              </div>

              {/* FAQs List */}
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(faq.priority)}`}>
                            {faq.priority}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {faq.category}
                          </span>
                          {faq.isPublished ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Draft
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-700 mb-4">{faq.answer}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{faq.viewCount} views</span>
                          <span>{faq.helpfulCount} helpful</span>
                          <span>{faq.notHelpfulCount} not helpful</span>
                          <span>Updated: {formatDate(faq.lastUpdated)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleMarkHelpful(faq.id, true, 'faq')}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                        >
                          <ThumbUpIcon className="h-4 w-4" />
                          <span>{faq.helpfulCount}</span>
                        </button>
                        <button
                          onClick={() => handleMarkHelpful(faq.id, false, 'faq')}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                        >
                          <ThumbDownIcon className="h-4 w-4" />
                          <span>{faq.notHelpfulCount}</span>
                        </button>
                        
                        {(userRole === 'admin' || userRole === 'support') && (
                          <div className="flex items-center space-x-1">
                            <button className="text-gray-400 hover:text-gray-600">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              {/* Tickets Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {ticket.ticketNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.subject}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {ticket.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.userEmail}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {ticket.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              {(userRole === 'admin' || userRole === 'support') && (
                                <>
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <CheckCircleIcon className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Contact Messages Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contactMessages.map((message) => (
                        <tr key={message.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {message.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {message.subject}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {message.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                              {message.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              {(userRole === 'admin' || userRole === 'support') && (
                                <>
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              {/* Articles List */}
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {article.category.replace('_', ' ')}
                          </span>
                          {article.isPublished ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Draft
                            </span>
                          )}
                          {article.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-700 mb-4">{article.summary}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{article.viewCount} views</span>
                          <span>{article.helpfulCount} helpful</span>
                          <span>{article.notHelpfulCount} not helpful</span>
                          <span>By {article.authorName}</span>
                          <span>Updated: {formatDate(article.lastUpdated)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleMarkHelpful(article.id, true, 'article')}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                        >
                          <ThumbUpIcon className="h-4 w-4" />
                          <span>{article.helpfulCount}</span>
                        </button>
                        <button
                          onClick={() => handleMarkHelpful(article.id, false, 'article')}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                        >
                          <ThumbDownIcon className="h-4 w-4" />
                          <span>{article.notHelpfulCount}</span>
                        </button>
                        
                        {(userRole === 'admin' || userRole === 'support') && (
                          <div className="flex items-center space-x-1">
                            <button className="text-gray-400 hover:text-gray-600">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Tab */}
          {activeTab === 'search' && searchResults && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results for "{searchResults.searchQuery}"
                </h3>
                <span className="text-sm text-gray-500">
                  {searchResults.totalResults} results in {searchResults.searchTime}ms
                </span>
              </div>

              {/* Search Results */}
              <div className="space-y-6">
                {/* FAQs */}
                {searchResults.faqs.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">FAQs ({searchResults.faqs.length})</h4>
                    <div className="space-y-3">
                      {searchResults.faqs.map((faq) => (
                        <div key={faq.id} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900">{faq.question}</h5>
                          <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {searchResults.articles.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Knowledge Base ({searchResults.articles.length})</h4>
                    <div className="space-y-3">
                      {searchResults.articles.map((article) => (
                        <div key={article.id} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900">{article.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tickets */}
                {searchResults.tickets.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Support Tickets ({searchResults.tickets.length})</h4>
                    <div className="space-y-3">
                      {searchResults.tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900">{ticket.subject}</h5>
                          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.totalResults === 0 && (
                  <div className="text-center py-8">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No results found</p>
                    <p className="text-sm text-gray-400">Try different keywords or check your spelling</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

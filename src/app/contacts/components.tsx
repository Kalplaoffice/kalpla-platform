import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { contactService, ContactRequest, ContactConversation, ContactMessage, ContactNotification, ContactSettings } from '@/lib/contactService';

// Contact Requests Tab Component
function ContactRequestsTab({ 
  requests, 
  onSelectRequest,
  onRespondToRequest,
  filters,
  onFiltersChange
}: {
  requests: ContactRequest[];
  onSelectRequest: (request: ContactRequest) => void;
  onRespondToRequest: (requestId: string, response: string, status: 'approved' | 'rejected') => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}) {
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filters.status.length === 0 || filters.status.includes(request.status);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(request.priority);
    const matchesCategory = filters.category.length === 0 || filters.category.includes(request.category);
    const matchesSearch = filters.searchTerm === '' || 
      request.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      request.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search contact requests..."
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.requesterName}</h3>
                  <p className="text-sm text-gray-600">{request.requesterRole} • {request.requesterEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getStatusColor(request.status)}`}>
                  {request.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getCategoryColor(request.category)}`}>
                  {request.category}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">{request.subject}</h4>
              <p className="text-gray-700">{request.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Request Type: {request.requestType.replace('_', ' ')}</span>
                <span className="mx-2">•</span>
                <span>{contactService.formatDate(request.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectRequest(request)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onRespondToRequest(request.id, 'Approved', 'approved')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => onRespondToRequest(request.id, 'Rejected', 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <UserPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Requests</h3>
          <p className="text-gray-600">No contact requests match your current filters.</p>
        </div>
      )}
    </div>
  );
}

// Messages Tab Component
function MessagesTab({ 
  conversations, 
  messages,
  onSelectConversation,
  onLoadMessages,
  onSendMessage
}: {
  conversations: ContactConversation[];
  messages: ContactMessage[];
  onSelectConversation: (conversation: ContactConversation) => void;
  onLoadMessages: (conversationId: string) => void;
  onSendMessage: (messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [selectedConv, setSelectedConv] = useState<ContactConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSelectConversation = (conversation: ContactConversation) => {
    setSelectedConv(conversation);
    onSelectConversation(conversation);
    onLoadMessages(conversation.id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConv) return;

    const messageData = {
      conversationId: selectedConv.id,
      senderId: 'current_user',
      senderName: 'Current User',
      senderEmail: 'user@example.com',
      senderRole: 'user',
      recipientId: selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Id : selectedConv.participant1Id,
      recipientName: selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Name : selectedConv.participant1Name,
      recipientEmail: selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Email : selectedConv.participant1Email,
      recipientRole: selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Role : selectedConv.participant1Role,
      messageType: 'text' as const,
      content: newMessage,
      isRead: false,
      isEncrypted: false,
      priority: 'medium' as const,
      category: 'business' as const,
      tags: []
    };

    onSendMessage(messageData);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        </div>
        
        <div className="overflow-y-auto h-[500px]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedConv?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.participant1Id === 'current_user' ? conversation.participant2Name : conversation.participant1Name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {conversation.lastMessageContent || 'No messages yet'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {contactService.formatDate(conversation.lastMessageAt)}
                  </p>
                  {conversation.unreadCount1 > 0 && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm flex flex-col">
        {selectedConv ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Name : selectedConv.participant1Name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConv.participant1Id === 'current_user' ? selectedConv.participant2Role : selectedConv.participant1Role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <VideoCameraIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'current_user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'current_user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {contactService.formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-600">Choose a conversation to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab({ 
  notifications, 
  onMarkAsRead 
}: {
  notifications: ContactNotification[];
  onMarkAsRead: (id: string) => void;
}) {
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="space-y-6">
      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Unread Notifications</h2>
          <div className="space-y-4">
            {unreadNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BellIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getCategoryColor(notification.category)}`}>
                          {notification.category}
                        </span>
                        {notification.actionRequired && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Read
                    </button>
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  {contactService.formatDate(notification.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Read Notifications</h2>
          <div className="space-y-4">
            {readNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <BellIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${contactService.getCategoryColor(notification.category)}`}>
                          {notification.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {contactService.formatDate(notification.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You don't have any notifications yet.</p>
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ 
  settings, 
  onUpdateSettings,
  onBlockUser,
  onUnblockUser
}: {
  settings: ContactSettings | null;
  onUpdateSettings: (settings: Partial<ContactSettings>) => void;
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
}) {
  if (!settings) {
    return (
      <div className="text-center py-12">
        <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
        <p className="text-gray-600">Contact settings could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Contact Requests</h3>
              <p className="text-sm text-gray-600">Allow others to send you contact requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowContactRequests}
                onChange={(e) => onUpdateSettings({ allowContactRequests: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Direct Messages</h3>
              <p className="text-sm text-gray-600">Allow others to send you direct messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowDirectMessages}
                onChange={(e) => onUpdateSettings({ allowDirectMessages: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Meeting Requests</h3>
              <p className="text-sm text-gray-600">Allow others to request meetings with you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowMeetingRequests}
                onChange={(e) => onUpdateSettings({ allowMeetingRequests: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Role-based Contact Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role-based Contact Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Investor Contact</h3>
              <p className="text-sm text-gray-600">Allow investors to contact you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowInvestorContact}
                onChange={(e) => onUpdateSettings({ allowInvestorContact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Mentor Contact</h3>
              <p className="text-sm text-gray-600">Allow mentors to contact you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowMentorContact}
                onChange={(e) => onUpdateSettings({ allowMentorContact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Startup Contact</h3>
              <p className="text-sm text-gray-600">Allow startups to contact you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowStartupContact}
                onChange={(e) => onUpdateSettings({ allowStartupContact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900">Allow Student Contact</h3>
              <p className="text-sm text-gray-600">Allow students to contact you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowStudentContact}
                onChange={(e) => onUpdateSettings({ allowStudentContact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Level</label>
            <select
              value={settings.privacyLevel}
              onChange={(e) => onUpdateSettings({ privacyLevel: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
              <option value="confidential">Confidential</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => onUpdateSettings({ timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auto Response</label>
            <textarea
              value={settings.autoResponse || ''}
              onChange={(e) => onUpdateSettings({ autoResponse: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Set an automatic response for incoming messages..."
            />
          </div>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blocked Users</h2>
        
        {settings.blockedUsers && settings.blockedUsers.length > 0 ? (
          <div className="space-y-2">
            {settings.blockedUsers.map((userId, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">User {userId}</span>
                <button
                  onClick={() => onUnblockUser(userId)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No blocked users.</p>
        )}
      </div>
    </div>
  );
}

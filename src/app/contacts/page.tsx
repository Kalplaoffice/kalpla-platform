'use client';

import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  BellIcon,
  CogIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PlusIcon,
  PencilIcon,
  PhoneIcon,
  VideoCameraIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { contactService, ContactRequest, ContactConversation, ContactMessage, ContactSettings, ContactNotification } from '@/lib/contactService';
import { ContactRequestsTab, MessagesTab, NotificationsTab, SettingsTab } from './components';
import { ContactRequestModal, MessageModal, SettingsModal, RequestDetailsModal } from './modals';

export default function ContactSystemPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'messages' | 'settings' | 'notifications'>('requests');
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [conversations, setConversations] = useState<ContactConversation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [notifications, setNotifications] = useState<ContactNotification[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ContactConversation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    category: [] as string[],
    searchTerm: ''
  });

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [requests, convs, notifs, userSettings] = await Promise.all([
        contactService.getContactRequests('current_user', filters),
        contactService.getConversations('current_user'),
        contactService.getNotifications('current_user'),
        contactService.getContactSettings('current_user')
      ]);

      setContactRequests(requests);
      setConversations(convs);
      setNotifications(notifs);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading contact data:', error);
      setError('Failed to load contact data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendContactRequest = async (requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await contactService.sendContactRequest(requestData);
      await loadContactData();
      setShowRequestModal(false);
    } catch (error) {
      console.error('Error sending contact request:', error);
    }
  };

  const handleRespondToRequest = async (requestId: string, response: string, status: 'approved' | 'rejected') => {
    try {
      await contactService.respondToContactRequest(requestId, response, status, 'current_user');
      await loadContactData();
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const handleSendMessage = async (messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await contactService.sendMessage(messageData);
      await loadContactData();
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLoadMessages = async (conversationId: string) => {
    try {
      const conversationMessages = await contactService.getMessages(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<ContactSettings>) => {
    try {
      await contactService.updateContactSettings('current_user', newSettings);
      await loadContactData();
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await contactService.blockUser('current_user', userId);
      await loadContactData();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await contactService.unblockUser('current_user', userId);
      await loadContactData();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Contact System</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact System</h1>
                <p className="text-gray-600">Secure communication with startups, mentors, and investors</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowRequestModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Contact Request
              </button>
              <button 
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                New Message
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'requests', name: 'Contact Requests', icon: UserPlusIcon, count: contactRequests.length },
                { id: 'messages', name: 'Messages', icon: ChatBubbleLeftIcon, count: conversations.length },
                { id: 'notifications', name: 'Notifications', icon: BellIcon, count: notifications.filter(n => !n.isRead).length },
                { id: 'settings', name: 'Settings', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && (
          <ContactRequestsTab 
            requests={contactRequests}
            onSelectRequest={setSelectedRequest}
            onRespondToRequest={handleRespondToRequest}
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesTab 
            conversations={conversations}
            messages={messages}
            onSelectConversation={setSelectedConversation}
            onLoadMessages={handleLoadMessages}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab 
            notifications={notifications}
            onMarkAsRead={(id) => contactService.markNotificationAsRead(id)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
          />
        )}

        {/* Modals */}
        {showRequestModal && (
          <ContactRequestModal 
            onClose={() => setShowRequestModal(false)}
            onSend={handleSendContactRequest}
          />
        )}

        {showMessageModal && (
          <MessageModal 
            onClose={() => setShowMessageModal(false)}
            onSend={handleSendMessage}
          />
        )}

        {showSettingsModal && (
          <SettingsModal 
            settings={settings}
            onClose={() => setShowSettingsModal(false)}
            onSave={handleUpdateSettings}
          />
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <RequestDetailsModal 
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onRespond={handleRespondToRequest}
          />
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { XCircleIcon, UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { contactService, ContactRequest, ContactMessage, ContactSettings } from '@/lib/contactService';

// Contact Request Modal
function ContactRequestModal({ 
  onClose, 
  onSend 
}: {
  onClose: () => void;
  onSend: (requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    requesterId: 'current_user',
    requesterName: 'Current User',
    requesterEmail: 'user@example.com',
    requesterRole: 'user',
    targetId: '',
    targetName: '',
    targetEmail: '',
    targetRole: '',
    requestType: 'general_inquiry' as const,
    subject: '',
    message: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    category: 'business' as const,
    attachments: [] as any[],
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Contact Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target User ID</label>
                <input
                  type="text"
                  value={formData.targetId}
                  onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Name</label>
                <input
                  type="text"
                  value={formData.targetName}
                  onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Email</label>
                <input
                  type="email"
                  value={formData.targetEmail}
                  onChange={(e) => setFormData({ ...formData, targetEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="investor">Investor</option>
                  <option value="mentor">Mentor</option>
                  <option value="startup">Startup</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general_inquiry">General Inquiry</option>
                <option value="meeting_request">Meeting Request</option>
                <option value="collaboration_request">Collaboration Request</option>
                <option value="investment_inquiry">Investment Inquiry</option>
                <option value="mentorship_request">Mentorship Request</option>
                <option value="partnership_request">Partnership Request</option>
                <option value="support_request">Support Request</option>
                <option value="feedback_request">Feedback Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="business">Business</option>
                  <option value="technical">Technical</option>
                  <option value="investment">Investment</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Message Modal
function MessageModal({ 
  onClose, 
  onSend 
}: {
  onClose: () => void;
  onSend: (messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    conversationId: '',
    senderId: 'current_user',
    senderName: 'Current User',
    senderEmail: 'user@example.com',
    senderRole: 'user',
    recipientId: '',
    recipientName: '',
    recipientEmail: '',
    recipientRole: '',
    messageType: 'text' as const,
    subject: '',
    content: '',
    attachments: [] as any[],
    isRead: false,
    isEncrypted: false,
    priority: 'medium' as const,
    category: 'business' as const,
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient User ID</label>
                <input
                  type="text"
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Role</label>
                <select
                  value={formData.recipientRole}
                  onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="investor">Investor</option>
                  <option value="mentor">Mentor</option>
                  <option value="startup">Startup</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
              <select
                value={formData.messageType}
                onChange={(e) => setFormData({ ...formData, messageType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="file">File</option>
                <option value="meeting_invite">Meeting Invite</option>
                <option value="system_message">System Message</option>
                <option value="notification">Notification</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="business">Business</option>
                  <option value="technical">Technical</option>
                  <option value="investment">Investment</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isEncrypted"
                checked={formData.isEncrypted}
                onChange={(e) => setFormData({ ...formData, isEncrypted: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isEncrypted" className="ml-2 text-sm text-gray-700">
                Encrypt Message
              </label>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Settings Modal
function SettingsModal({ 
  settings,
  onClose, 
  onSave 
}: {
  settings: ContactSettings | null;
  onClose: () => void;
  onSave: (settings: Partial<ContactSettings>) => void;
}) {
  const [formData, setFormData] = useState({
    allowContactRequests: settings?.allowContactRequests ?? true,
    allowDirectMessages: settings?.allowDirectMessages ?? true,
    allowMeetingRequests: settings?.allowMeetingRequests ?? true,
    allowInvestorContact: settings?.allowInvestorContact ?? true,
    allowMentorContact: settings?.allowMentorContact ?? true,
    allowStartupContact: settings?.allowStartupContact ?? true,
    allowStudentContact: settings?.allowStudentContact ?? true,
    privacyLevel: settings?.privacyLevel ?? 'private',
    timezone: settings?.timezone ?? 'UTC',
    autoResponse: settings?.autoResponse ?? ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900">Allow Contact Requests</h3>
                  <p className="text-sm text-gray-600">Allow others to send you contact requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowContactRequests}
                    onChange={(e) => setFormData({ ...formData, allowContactRequests: e.target.checked })}
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
                    checked={formData.allowDirectMessages}
                    onChange={(e) => setFormData({ ...formData, allowDirectMessages: e.target.checked })}
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
                    checked={formData.allowMeetingRequests}
                    onChange={(e) => setFormData({ ...formData, allowMeetingRequests: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Level</label>
              <select
                value={formData.privacyLevel}
                onChange={(e) => setFormData({ ...formData, privacyLevel: e.target.value as any })}
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
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
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
                value={formData.autoResponse}
                onChange={(e) => setFormData({ ...formData, autoResponse: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Set an automatic response for incoming messages..."
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Request Details Modal
function RequestDetailsModal({ 
  request,
  onClose, 
  onRespond 
}: {
  request: ContactRequest;
  onClose: () => void;
  onRespond: (requestId: string, response: string, status: 'approved' | 'rejected') => void;
}) {
  const [response, setResponse] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(false);

  const handleRespond = (status: 'approved' | 'rejected') => {
    onRespond(request.id, response, status);
    setShowResponseForm(false);
    setResponse('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Request Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Request Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.requesterName}</h3>
                  <p className="text-sm text-gray-600">{request.requesterRole} • {request.requesterEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
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

            {/* Request Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">Request Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-sm text-gray-900">{request.requestType.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Subject:</span>
                  <span className="ml-2 text-sm text-gray-900">{request.subject}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-sm text-gray-900">{contactService.formatDate(request.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">Message</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{request.message}</p>
              </div>
            </div>

            {/* Response */}
            {request.responseMessage && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Your Response</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-900">{request.responseMessage}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Responded on {contactService.formatDate(request.respondedAt!)} by {request.respondedBy}
                  </p>
                </div>
              </div>
            )}

            {/* Response Form */}
            {request.status === 'pending' && !showResponseForm && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Respond to Request
                </button>
              </div>
            )}

            {showResponseForm && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Response</h4>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your response..."
                />
                <div className="flex items-center justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowResponseForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond('approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRespond('rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// Export all modals
export { ContactRequestModal, MessageModal, SettingsModal, RequestDetailsModal };

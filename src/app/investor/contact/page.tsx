'use client';

import { useState, useEffect } from 'react';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface ContactRequest {
  id: string;
  startupId: string;
  startupName: string;
  startupTagline: string;
  startupLogo?: string;
  investorName: string;
  investorEmail: string;
  investorCompany?: string;
  subject: string;
  message: string;
  requestType: 'meeting' | 'funding' | 'partnership' | 'general';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  updatedAt: string;
  response?: string;
  responseDate?: string;
  meetingScheduled?: {
    date: string;
    time: string;
    duration: string;
    location: string;
    meetingLink?: string;
  };
}

interface StartupContact {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  contactEmail: string;
  contactPhone?: string;
  mentor: string;
  mentorEmail: string;
  mentorPhone?: string;
  status: 'fundraising' | 'growth' | 'development' | 'launched';
  isApproved: boolean;
}

export default function ContactStartupsPage() {
  const { isInvestor, user } = useRoleBasedAccess();
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [availableStartups, setAvailableStartups] = useState<StartupContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<StartupContact | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    requestType: 'general' as 'meeting' | 'funding' | 'partnership' | 'general'
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockContactRequests: ContactRequest[] = [
      {
        id: 'cr1',
        startupId: 's1',
        startupName: 'TechFlow Solutions',
        startupTagline: 'AI-powered workflow automation for enterprises',
        startupLogo: '/api/placeholder/100/100',
        investorName: user?.name || 'Investor',
        investorEmail: user?.email || 'investor@email.com',
        investorCompany: 'ABC Ventures',
        subject: 'Investment Interest - Series A',
        message: 'Hi, I\'m interested in discussing investment opportunities for your Series A round. Your AI-powered workflow automation solution looks very promising.',
        requestType: 'funding',
        status: 'accepted',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-21T14:30:00Z',
        response: 'Thank you for your interest! We\'d love to discuss this further. Let\'s schedule a meeting.',
        responseDate: '2024-01-21T14:30:00Z',
        meetingScheduled: {
          date: '2024-02-01',
          time: '2:00 PM',
          duration: '1 hour',
          location: 'Virtual (Zoom)',
          meetingLink: 'https://zoom.us/j/meeting1'
        }
      },
      {
        id: 'cr2',
        startupId: 's2',
        startupName: 'GreenTech Innovations',
        startupTagline: 'Sustainable energy solutions for smart cities',
        startupLogo: '/api/placeholder/100/100',
        investorName: user?.name || 'Investor',
        investorEmail: user?.email || 'investor@email.com',
        investorCompany: 'ABC Ventures',
        subject: 'Partnership Discussion',
        message: 'We\'re interested in exploring potential partnerships between our portfolio companies and your clean energy solutions.',
        requestType: 'partnership',
        status: 'pending',
        createdAt: '2024-01-22T15:30:00Z',
        updatedAt: '2024-01-22T15:30:00Z'
      },
      {
        id: 'cr3',
        startupId: 's3',
        startupName: 'HealthTech Pro',
        startupTagline: 'Telemedicine platform for rural healthcare',
        startupLogo: '/api/placeholder/100/100',
        investorName: user?.name || 'Investor',
        investorEmail: user?.email || 'investor@email.com',
        investorCompany: 'ABC Ventures',
        subject: 'General Inquiry',
        message: 'I\'d like to learn more about your telemedicine platform and its impact on rural healthcare.',
        requestType: 'general',
        status: 'completed',
        createdAt: '2024-01-18T09:15:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
        response: 'Thank you for your interest! We\'ve provided detailed information about our platform.',
        responseDate: '2024-01-19T16:45:00Z'
      }
    ];

    const mockAvailableStartups: StartupContact[] = [
      {
        id: 's1',
        name: 'TechFlow Solutions',
        tagline: 'AI-powered workflow automation for enterprises',
        logo: '/api/placeholder/100/100',
        contactEmail: 'contact@techflow.com',
        contactPhone: '+91 98765 43210',
        mentor: 'John Doe',
        mentorEmail: 'john.doe@email.com',
        mentorPhone: '+91 98765 43210',
        status: 'fundraising',
        isApproved: true
      },
      {
        id: 's2',
        name: 'GreenTech Innovations',
        tagline: 'Sustainable energy solutions for smart cities',
        logo: '/api/placeholder/100/100',
        contactEmail: 'contact@greentech.com',
        contactPhone: '+91 98765 43211',
        mentor: 'Jane Smith',
        mentorEmail: 'jane.smith@email.com',
        mentorPhone: '+91 98765 43211',
        status: 'growth',
        isApproved: true
      },
      {
        id: 's3',
        name: 'HealthTech Pro',
        tagline: 'Telemedicine platform for rural healthcare',
        logo: '/api/placeholder/100/100',
        contactEmail: 'contact@healthtechpro.com',
        contactPhone: '+91 98765 43212',
        mentor: 'Mike Johnson',
        mentorEmail: 'mike.johnson@email.com',
        mentorPhone: '+91 98765 43212',
        status: 'fundraising',
        isApproved: true
      },
      {
        id: 's4',
        name: 'EduTech Solutions',
        tagline: 'Personalized learning platform for K-12 education',
        logo: '/api/placeholder/100/100',
        contactEmail: 'contact@edutechsolutions.com',
        contactPhone: '+91 98765 43213',
        mentor: 'Sarah Wilson',
        mentorEmail: 'sarah.wilson@email.com',
        mentorPhone: '+91 98765 43213',
        status: 'development',
        isApproved: false
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setContactRequests(mockContactRequests);
      setAvailableStartups(mockAvailableStartups);
      setLoading(false);
    }, 1000);
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'declined':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'fundraising':
        return 'text-blue-600 bg-blue-100';
      case 'growth':
        return 'text-green-600 bg-green-100';
      case 'development':
        return 'text-yellow-600 bg-yellow-100';
      case 'launched':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'declined':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'fundraising':
        return <StarIcon className="h-4 w-4" />;
      case 'growth':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'development':
        return <ClockIcon className="h-4 w-4" />;
      case 'launched':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleSendContactRequest = async () => {
    if (!selectedStartup || !contactForm.subject || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    setSending(true);
    try {
      // TODO: Implement actual contact request API call
      console.log('Sending contact request:', {
        startupId: selectedStartup.id,
        ...contactForm
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to local state
      const newRequest: ContactRequest = {
        id: `cr${Date.now()}`,
        startupId: selectedStartup.id,
        startupName: selectedStartup.name,
        startupTagline: selectedStartup.tagline,
        startupLogo: selectedStartup.logo,
        investorName: user?.name || 'Investor',
        investorEmail: user?.email || 'investor@email.com',
        investorCompany: 'ABC Ventures',
        subject: contactForm.subject,
        message: contactForm.message,
        requestType: contactForm.requestType,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setContactRequests([newRequest, ...contactRequests]);
      setShowContactModal(false);
      setSelectedStartup(null);
      setContactForm({
        subject: '',
        message: '',
        requestType: 'general'
      });
    } catch (error) {
      console.error('Contact request error:', error);
    } finally {
      setSending(false);
    }
  };

  const openContactModal = (startup: StartupContact) => {
    setSelectedStartup(startup);
    setShowContactModal(true);
  };

  if (!isInvestor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the investor dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <InvestorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </InvestorLayout>
    );
  }

  return (
    <InvestorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Startups</h1>
          <p className="text-gray-600">Connect with startup founders and mentors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{contactRequests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contactRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Accepted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contactRequests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Startups</p>
                <p className="text-2xl font-semibold text-gray-900">{availableStartups.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Contact Requests</h2>
            <div className="space-y-4">
              {contactRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {request.startupLogo ? (
                            <img
                              src={request.startupLogo}
                              alt={request.startupName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900">{request.startupName}</h3>
                        <p className="text-sm text-gray-600">{request.startupTagline}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {request.requestType}
                          </span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900">{request.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Sent: {formatDate(request.createdAt)}</span>
                          {request.responseDate && (
                            <span>Response: {formatDate(request.responseDate)}</span>
                          )}
                        </div>
                        {request.response && (
                          <div className="mt-3 p-2 bg-gray-50 rounded">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Response:</h5>
                            <p className="text-sm text-gray-700">{request.response}</p>
                          </div>
                        )}
                        {request.meetingScheduled && (
                          <div className="mt-3 p-2 bg-green-50 rounded">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Meeting Scheduled:</h5>
                            <p className="text-sm text-gray-700">
                              {request.meetingScheduled.date} at {request.meetingScheduled.time} ({request.meetingScheduled.duration})
                            </p>
                            <p className="text-sm text-gray-700">{request.meetingScheduled.location}</p>
                            {request.meetingScheduled.meetingLink && (
                              <a
                                href={request.meetingScheduled.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Join Meeting
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Startups */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Startups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableStartups.map((startup) => (
                <div key={startup.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={startup.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{startup.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{startup.tagline}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                          {getStatusIcon(startup.status)}
                          <span className="ml-1">{startup.status}</span>
                        </span>
                        {startup.isApproved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {startup.contactEmail}
                    </div>
                    {startup.contactPhone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {startup.contactPhone}
                      </div>
                    )}
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      Mentor: {startup.mentor}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      {startup.isApproved ? 'Available for contact' : 'Pending approval'}
                    </div>
                    <button
                      onClick={() => openContactModal(startup)}
                      disabled={!startup.isApproved}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        startup.isApproved
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Contact Startup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && selectedStartup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowContactModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact {selectedStartup.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Startup Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Name:</span>
                          <span className="ml-2 text-gray-900">{selectedStartup.name}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className="ml-2 text-gray-900">{selectedStartup.status}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Contact Email:</span>
                          <span className="ml-2 text-gray-900">{selectedStartup.contactEmail}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Mentor:</span>
                          <span className="ml-2 text-gray-900">{selectedStartup.mentor}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                      <select
                        value={contactForm.requestType}
                        onChange={(e) => setContactForm({ ...contactForm, requestType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="meeting">Schedule Meeting</option>
                        <option value="funding">Funding Discussion</option>
                        <option value="partnership">Partnership Opportunity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter subject line"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                        placeholder="Enter your message..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowContactModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendContactRequest}
                        disabled={sending || !contactForm.subject || !contactForm.message}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        {sending ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InvestorLayout>
  );
}

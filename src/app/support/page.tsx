'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general'
  });

  const faqCategories = [
    { id: 'general', name: 'General', icon: InformationCircleIcon },
    { id: 'account', name: 'Account', icon: UserGroupIcon },
    { id: 'courses', name: 'Courses', icon: BookOpenIcon },
    { id: 'payments', name: 'Payments', icon: CurrencyDollarIcon },
    { id: 'technical', name: 'Technical', icon: CogIcon },
    { id: 'ksmp', name: 'KSMP Program', icon: AcademicCapIcon }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I create an account on Kalpla?',
      answer: 'To create an account, click the "Sign Up" button on our homepage. You can register using your email address, phone number, or Google account. Follow the verification steps to complete your registration.',
      category: 'account',
      helpful: 45
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through our secure payment gateway (PayU). All transactions are encrypted and secure.',
      category: 'payments',
      helpful: 38
    },
    {
      id: '3',
      question: 'How do I enroll in a course?',
      answer: 'Browse our courses page, select the course you want to enroll in, and click "Enroll". Complete the payment process, and you\'ll get immediate access to the course content.',
      category: 'courses',
      helpful: 52
    },
    {
      id: '4',
      question: 'Can I get a refund for a course?',
      answer: 'Yes, we offer refunds within 7 days of enrollment if you haven\'t accessed more than 20% of the course content. Partial refunds are available within 30 days based on content consumption.',
      category: 'payments',
      helpful: 41
    },
    {
      id: '5',
      question: 'What is the KSMP program?',
      answer: 'KSMP (Kalpla Startup Mentorship Program) is our flagship 12-phase program designed to guide aspiring entrepreneurs from idea to startup. It includes mentorship, live sessions, assignments, and investor connections.',
      category: 'ksmp',
      helpful: 67
    },
    {
      id: '6',
      question: 'How do I submit assignments?',
      answer: 'Go to the Assignments page in your dashboard, select the assignment you want to submit, and upload your file or provide your submission. Make sure to submit before the deadline.',
      category: 'courses',
      helpful: 33
    },
    {
      id: '7',
      question: 'I\'m having trouble accessing course videos. What should I do?',
      answer: 'Check your internet connection and try refreshing the page. Clear your browser cache and cookies. If the problem persists, try using a different browser or contact our technical support.',
      category: 'technical',
      helpful: 29
    },
    {
      id: '8',
      question: 'How do I update my profile information?',
      answer: 'Go to your profile page from the dashboard, click "Edit Profile", make your changes, and save. You can update your name, email, phone number, and profile picture.',
      category: 'account',
      helpful: 24
    },
    {
      id: '9',
      question: 'Can I access courses on mobile devices?',
      answer: 'Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can also download our mobile app for a better experience.',
      category: 'technical',
      helpful: 36
    },
    {
      id: '10',
      question: 'How do I become a mentor?',
      answer: 'Apply to become a mentor through our mentor application form. We review applications based on experience, expertise, and alignment with our program goals. Approved mentors go through our onboarding process.',
      category: 'ksmp',
      helpful: 19
    }
  ];

  const mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Cannot access course videos',
      description: 'I enrolled in the Python course but cannot play any videos. Getting an error message.',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T14:15:00Z'
    },
    {
      id: 'TKT-002',
      subject: 'Payment not processed',
      description: 'I tried to pay for the React course but the payment failed. Money was deducted from my account.',
      status: 'resolved',
      priority: 'urgent',
      createdAt: '2024-01-19T16:45:00Z',
      updatedAt: '2024-01-20T09:30:00Z'
    },
    {
      id: 'TKT-003',
      subject: 'Assignment submission issue',
      description: 'Cannot submit my Business Model Canvas assignment. The upload button is not working.',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-01-18T11:20:00Z',
      updatedAt: '2024-01-18T11:20:00Z'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement ticket submission
    console.log('Submitting ticket:', ticketForm);
    setShowTicketForm(false);
    setTicketForm({
      subject: '',
      description: '',
      priority: 'medium',
      category: 'general'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Help */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <PhoneIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
            <a href="tel:+918660200835" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block">
              +91 8660200835
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <EnvelopeIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <a href="mailto:support@kalpla.in" className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block">
              support@kalpla.in
            </a>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Support Hours</h3>
              <p className="text-gray-700">
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST<br />
                <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST<br />
                <strong>Sunday:</strong> Closed
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                FAQ ({faqs.length})
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Tickets ({mockTickets.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                {/* FAQ Search and Filters */}
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search FAQ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {faqCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FAQ Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {faqCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <category.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    </button>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map(faq => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {faqCategories.find(cat => cat.id === faq.category)?.name} • {faq.helpful} people found this helpful
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Helpful
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-700">
                            Not helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a message</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="What can we help you with?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="course">Course Related</option>
                          <option value="ksmp">KSMP Program</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Please describe your issue in detail..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Other ways to reach us</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Email Support</h4>
                          <p className="text-gray-600">support@kalpla.in</p>
                          <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <PhoneIcon className="h-6 w-6 text-green-600 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Phone Support</h4>
                          <p className="text-gray-600">+91 8660200835</p>
                          <p className="text-sm text-gray-500">Available during business hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Live Chat</h4>
                          <p className="text-gray-600">Available 24/7</p>
                          <p className="text-sm text-gray-500">Get instant help from our support team</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create New Ticket
                  </button>
                </div>

                <div className="space-y-4">
                  {mockTickets.map(ticket => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{ticket.subject}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Ticket ID: {ticket.id}</span>
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowTicketForm(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Support Ticket</h3>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="course">Course Related</option>
                      <option value="ksmp">KSMP Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={6}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Create Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

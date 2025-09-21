'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  VideoCameraIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface Session {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'qna' | 'presentation' | 'demo' | 'mentoring';
  cohortId: string;
  cohortName: string;
  phaseId: string;
  phaseTitle: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  joinLink?: string;
  recordingUrl?: string;
  enrolledStudents: number;
  attendedStudents?: number;
  platform: 'zoom' | 'amazon_ivs' | 'google_meet';
  autoRecord: boolean;
  agenda: string[];
  resources: {
    id: string;
    name: string;
    type: 'document' | 'video' | 'link';
    url: string;
  }[];
  feedback: {
    averageRating: number;
    totalResponses: number;
    comments: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function MentorSessionsPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is mentor
  const isMentor = hasRole('Mentor');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('scheduled');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockSessions: Session[] = [
      {
        id: 's1',
        title: 'Financial Modeling Workshop',
        description: 'Learn how to create comprehensive financial models for startups',
        type: 'workshop',
        cohortId: 'c1',
        cohortName: 'KSMP Cohort 2024-01',
        phaseId: 'p3',
        phaseTitle: 'Phase 3: Financial Planning & Funding',
        date: '2024-01-22',
        time: '10:00 AM',
        duration: '2 hours',
        status: 'scheduled',
        joinLink: 'https://zoom.us/j/123456789',
        enrolledStudents: 25,
        platform: 'zoom',
        autoRecord: true,
        agenda: [
          'Introduction to Financial Modeling',
          'Revenue Projections',
          'Cost Structure Analysis',
          'Cash Flow Forecasting',
          'Q&A Session'
        ],
        resources: [
          { id: 'r1', name: 'Financial Model Template', type: 'document', url: '/resources/financial-template.xlsx' },
          { id: 'r2', name: 'Revenue Projection Guide', type: 'document', url: '/resources/revenue-guide.pdf' }
        ],
        feedback: {
          averageRating: 0,
          totalResponses: 0,
          comments: []
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 's2',
        title: 'Investor Pitch Preparation',
        description: 'Prepare and practice your investor pitch presentation',
        type: 'presentation',
        cohortId: 'c1',
        cohortName: 'KSMP Cohort 2024-01',
        phaseId: 'p3',
        phaseTitle: 'Phase 3: Financial Planning & Funding',
        date: '2024-01-25',
        time: '2:00 PM',
        duration: '1.5 hours',
        status: 'scheduled',
        joinLink: 'https://zoom.us/j/987654321',
        enrolledStudents: 25,
        platform: 'zoom',
        autoRecord: true,
        agenda: [
          'Pitch Deck Structure',
          'Key Metrics to Highlight',
          'Common Investor Questions',
          'Practice Pitches',
          'Feedback Session'
        ],
        resources: [
          { id: 'r3', name: 'Pitch Deck Template', type: 'document', url: '/resources/pitch-template.pptx' },
          { id: 'r4', name: 'Investor Questions Guide', type: 'document', url: '/resources/investor-questions.pdf' }
        ],
        feedback: {
          averageRating: 0,
          totalResponses: 0,
          comments: []
        },
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 's3',
        title: 'Market Research Deep Dive',
        description: 'Advanced market research techniques and analysis',
        type: 'workshop',
        cohortId: 'c1',
        cohortName: 'KSMP Cohort 2024-01',
        phaseId: 'p1',
        phaseTitle: 'Phase 1: Business Idea & Market Research',
        date: '2024-01-20',
        time: '11:00 AM',
        duration: '2 hours',
        status: 'completed',
        enrolledStudents: 25,
        attendedStudents: 23,
        platform: 'amazon_ivs',
        autoRecord: true,
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session1.mp4',
        agenda: [
          'Market Size Analysis',
          'Competitor Research',
          'Customer Personas',
          'Market Trends',
          'Q&A Session'
        ],
        resources: [
          { id: 'r5', name: 'Market Research Checklist', type: 'document', url: '/resources/market-research-checklist.pdf' },
          { id: 'r6', name: 'Competitor Analysis Template', type: 'document', url: '/resources/competitor-analysis.xlsx' }
        ],
        feedback: {
          averageRating: 4.8,
          totalResponses: 20,
          comments: [
            'Very informative session',
            'Great examples provided',
            'Helpful templates'
          ]
        },
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-20T13:00:00Z'
      },
      {
        id: 's4',
        title: 'Business Model Canvas Workshop',
        description: 'Create and refine your business model canvas',
        type: 'workshop',
        cohortId: 'c1',
        cohortName: 'KSMP Cohort 2024-01',
        phaseId: 'p2',
        phaseTitle: 'Phase 2: Business Model & Strategy',
        date: '2024-01-18',
        time: '3:00 PM',
        duration: '1.5 hours',
        status: 'completed',
        enrolledStudents: 25,
        attendedStudents: 24,
        platform: 'amazon_ivs',
        autoRecord: true,
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session2.mp4',
        agenda: [
          'Business Model Canvas Overview',
          'Value Proposition Design',
          'Customer Segments',
          'Revenue Streams',
          'Cost Structure'
        ],
        resources: [
          { id: 'r7', name: 'Business Model Canvas Template', type: 'document', url: '/resources/bmc-template.pdf' },
          { id: 'r8', name: 'Value Proposition Canvas', type: 'document', url: '/resources/vpc-template.pdf' }
        ],
        feedback: {
          averageRating: 4.6,
          totalResponses: 22,
          comments: [
            'Clear explanation of concepts',
            'Good interactive elements',
            'Useful templates'
          ]
        },
        createdAt: '2024-01-12T11:00:00Z',
        updatedAt: '2024-01-18T16:30:00Z'
      },
      {
        id: 's5',
        title: 'Weekly Q&A Session',
        description: 'Open Q&A session for student questions and clarifications',
        type: 'qna',
        cohortId: 'c2',
        cohortName: 'KSMP Cohort 2023-09',
        phaseId: 'p8',
        phaseTitle: 'Phase 8: Product Development & MVP',
        date: '2024-01-24',
        time: '4:00 PM',
        duration: '1 hour',
        status: 'scheduled',
        joinLink: 'https://zoom.us/j/456789123',
        enrolledStudents: 30,
        platform: 'zoom',
        autoRecord: false,
        agenda: [
          'Open Q&A',
          'Clarifications',
          'Additional Support'
        ],
        resources: [],
        feedback: {
          averageRating: 0,
          totalResponses: 0,
          comments: []
        },
        createdAt: '2024-01-20T15:00:00Z',
        updatedAt: '2024-01-20T15:00:00Z'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.cohortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.phaseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || session.status === filter;
    const matchesType = typeFilter === 'all' || session.type === typeFilter;
    const matchesPlatform = platformFilter === 'all' || session.platform === platformFilter;
    
    return matchesSearch && matchesFilter && matchesType && matchesPlatform;
  });

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled');
  const liveSessions = sessions.filter(s => s.status === 'live');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'live':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      case 'live':
        return <SignalIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'text-purple-600 bg-purple-100';
      case 'qna':
        return 'text-blue-600 bg-blue-100';
      case 'presentation':
        return 'text-green-600 bg-green-100';
      case 'demo':
        return 'text-orange-600 bg-orange-100';
      case 'mentoring':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <VideoCameraIcon className="h-4 w-4 text-blue-500" />;
      case 'amazon_ivs':
        return <VideoCameraIcon className="h-4 w-4 text-orange-500" />;
      case 'google_meet':
        return <VideoCameraIcon className="h-4 w-4 text-green-500" />;
      default:
        return <VideoCameraIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const handleStartSession = (sessionId: string) => {
    // TODO: Implement session start logic
    console.log('Starting session:', sessionId);
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'live' }
        : session
    ));
  };

  const handleEndSession = (sessionId: string) => {
    // TODO: Implement session end logic
    console.log('Ending session:', sessionId);
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'completed',
            recordingUrl: `https://s3.amazonaws.com/kalpla-recordings/session${sessionId}.mp4`,
            attendedStudents: Math.floor(Math.random() * session.enrolledStudents) + 20
          }
        : session
    ));
  };

  if (!isMentor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the mentor sessions page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <MentorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentoring Sessions</h1>
            <p className="text-gray-600">Schedule and manage your mentoring sessions across all cohorts</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Schedule Session
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-semibold text-gray-900">{scheduledSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <SignalIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live</p>
                <p className="text-2xl font-semibold text-gray-900">{liveSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.reduce((sum, session) => sum + session.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="all">All Sessions</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="workshop">Workshop</option>
                <option value="qna">Q&A</option>
                <option value="presentation">Presentation</option>
                <option value="demo">Demo</option>
                <option value="mentoring">Mentoring</option>
              </select>
              
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="zoom">Zoom</option>
                <option value="amazon_ivs">Amazon IVS</option>
                <option value="google_meet">Google Meet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1">{session.status}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                        {session.type}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        {getPlatformIcon(session.platform)}
                        <span className="ml-1 capitalize">{session.platform}</span>
                      </div>
                      {session.autoRecord && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Auto-Record
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {formatTime(session.time)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {session.duration}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {session.attendedStudents || 0}/{session.enrolledStudents} attended
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      <span>{session.cohortName} • {session.phaseTitle}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(session)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    
                    {session.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartSession(session.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Start Session
                      </button>
                    )}
                    
                    {session.status === 'live' && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        End Session
                      </button>
                    )}
                    
                    {session.joinLink && session.status === 'scheduled' && (
                      <a
                        href={session.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Join Link
                      </a>
                    )}
                    
                    {session.recordingUrl && session.status === 'completed' && (
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        View Recording
                      </a>
                    )}
                    
                    <button className="text-gray-600 hover:text-gray-800">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Agenda Preview */}
                {session.agenda.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Agenda</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.agenda.slice(0, 3).map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {item}
                        </span>
                      ))}
                      {session.agenda.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{session.agenda.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Resources Preview */}
                {session.resources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.resources.slice(0, 2).map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                          {resource.name}
                        </a>
                      ))}
                      {session.resources.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{session.resources.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback for Completed Sessions */}
                {session.status === 'completed' && session.feedback.totalResponses > 0 && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-900">Session Feedback</p>
                        <p className="text-sm text-green-700">
                          {session.feedback.averageRating}/5.0 ({session.feedback.totalResponses} responses)
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(session.feedback.averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'scheduled' || typeFilter !== 'all' || platformFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'You don\'t have any scheduled sessions.'}
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Schedule Your First Session
            </button>
          </div>
        )}

        {/* Session Detail Modal */}
        {showDetailModal && selectedSession && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSession.title}</h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExclamationTriangleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Session Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedSession.type)}`}>
                            {selectedSession.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Date & Time:</span>
                          <span className="text-sm text-gray-900">
                            {formatDate(selectedSession.date)} at {formatTime(selectedSession.time)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Duration:</span>
                          <span className="text-sm text-gray-900">{selectedSession.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Platform:</span>
                          <span className="text-sm text-gray-900 capitalize">{selectedSession.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Students:</span>
                          <span className="text-sm text-gray-900">
                            {selectedSession.attendedStudents || 0}/{selectedSession.enrolledStudents}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Auto-Record:</span>
                          <span className="text-sm text-gray-900">
                            {selectedSession.autoRecord ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Agenda */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Agenda</h4>
                      <div className="space-y-2">
                        {selectedSession.agenda.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-900">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSession.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorLayout>
  );
}

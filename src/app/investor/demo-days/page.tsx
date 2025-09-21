'use client';

import { useState, useEffect } from 'react';
import { InvestorLayout } from '@/components/investor/InvestorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
import { 
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  EyeIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface DemoDay {
  id: string;
  title: string;
  startupId: string;
  startupName: string;
  startupTagline: string;
  startupLogo?: string;
  date: string;
  time: string;
  duration: string;
  phase: number;
  mentor: string;
  mentorEmail: string;
  joinLink?: string;
  status: 'upcoming' | 'live' | 'completed';
  attendees: number;
  maxAttendees: number;
  recordingUrl?: string;
  description: string;
  agenda: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  presentationSlides?: string;
  qnaSession: boolean;
  networkingSession: boolean;
  location: string;
  timezone: string;
}

export default function DemoDaySchedulesPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is investor
  const isInvestor = hasRole('Investor');
  const [demoDays, setDemoDays] = useState<DemoDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDemoDay, setSelectedDemoDay] = useState<DemoDay | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockDemoDays: DemoDay[] = [
      {
        id: 'dd1',
        title: 'TechFlow Solutions Demo Day',
        startupId: 's1',
        startupName: 'TechFlow Solutions',
        startupTagline: 'AI-powered workflow automation for enterprises',
        startupLogo: '/api/placeholder/100/100',
        date: '2024-02-15',
        time: '2:00 PM',
        duration: '2 hours',
        phase: 8,
        mentor: 'John Doe',
        mentorEmail: 'john.doe@email.com',
        joinLink: 'https://zoom.us/j/demo1',
        status: 'upcoming',
        attendees: 45,
        maxAttendees: 100,
        description: 'TechFlow Solutions presents their AI-powered workflow automation platform for enterprises. Learn about their innovative approach to business process optimization.',
        agenda: [
          {
            time: '2:00 PM',
            title: 'Welcome & Introduction',
            description: 'Opening remarks and agenda overview'
          },
          {
            time: '2:15 PM',
            title: 'Startup Presentation',
            description: 'TechFlow Solutions pitch and product demo'
          },
          {
            time: '3:00 PM',
            title: 'Q&A Session',
            description: 'Investor questions and startup responses'
          },
          {
            time: '3:30 PM',
            title: 'Networking Break',
            description: 'Informal networking and discussions'
          },
          {
            time: '3:45 PM',
            title: 'Closing Remarks',
            description: 'Wrap-up and next steps'
          }
        ],
        presentationSlides: 'https://docs.google.com/presentation/d/techflow-demo',
        qnaSession: true,
        networkingSession: true,
        location: 'Virtual (Zoom)',
        timezone: 'IST'
      },
      {
        id: 'dd2',
        title: 'GreenTech Innovations Demo Day',
        startupId: 's2',
        startupName: 'GreenTech Innovations',
        startupTagline: 'Sustainable energy solutions for smart cities',
        startupLogo: '/api/placeholder/100/100',
        date: '2024-02-20',
        time: '3:00 PM',
        duration: '2 hours',
        phase: 6,
        mentor: 'Jane Smith',
        mentorEmail: 'jane.smith@email.com',
        joinLink: 'https://zoom.us/j/demo2',
        status: 'upcoming',
        attendees: 38,
        maxAttendees: 100,
        description: 'GreenTech Innovations showcases their sustainable energy solutions for smart cities. Discover how they\'re revolutionizing urban infrastructure.',
        agenda: [
          {
            time: '3:00 PM',
            title: 'Welcome & Introduction',
            description: 'Opening remarks and agenda overview'
          },
          {
            time: '3:15 PM',
            title: 'Startup Presentation',
            description: 'GreenTech Innovations pitch and product demo'
          },
          {
            time: '4:00 PM',
            title: 'Q&A Session',
            description: 'Investor questions and startup responses'
          },
          {
            time: '4:30 PM',
            title: 'Networking Break',
            description: 'Informal networking and discussions'
          },
          {
            time: '4:45 PM',
            title: 'Closing Remarks',
            description: 'Wrap-up and next steps'
          }
        ],
        presentationSlides: 'https://docs.google.com/presentation/d/greentech-demo',
        qnaSession: true,
        networkingSession: true,
        location: 'Virtual (Zoom)',
        timezone: 'IST'
      },
      {
        id: 'dd3',
        title: 'HealthTech Pro Demo Day',
        startupId: 's3',
        startupName: 'HealthTech Pro',
        startupTagline: 'Telemedicine platform for rural healthcare',
        startupLogo: '/api/placeholder/100/100',
        date: '2024-02-25',
        time: '4:00 PM',
        duration: '2 hours',
        phase: 9,
        mentor: 'Mike Johnson',
        mentorEmail: 'mike.johnson@email.com',
        joinLink: 'https://zoom.us/j/demo3',
        status: 'upcoming',
        attendees: 52,
        maxAttendees: 100,
        description: 'HealthTech Pro presents their telemedicine platform for rural healthcare. Learn about their mission to connect rural patients with urban specialists.',
        agenda: [
          {
            time: '4:00 PM',
            title: 'Welcome & Introduction',
            description: 'Opening remarks and agenda overview'
          },
          {
            time: '4:15 PM',
            title: 'Startup Presentation',
            description: 'HealthTech Pro pitch and product demo'
          },
          {
            time: '5:00 PM',
            title: 'Q&A Session',
            description: 'Investor questions and startup responses'
          },
          {
            time: '5:30 PM',
            title: 'Networking Break',
            description: 'Informal networking and discussions'
          },
          {
            time: '5:45 PM',
            title: 'Closing Remarks',
            description: 'Wrap-up and next steps'
          }
        ],
        presentationSlides: 'https://docs.google.com/presentation/d/healthtech-demo',
        qnaSession: true,
        networkingSession: true,
        location: 'Virtual (Zoom)',
        timezone: 'IST'
      },
      {
        id: 'dd4',
        title: 'EduTech Solutions Demo Day',
        startupId: 's4',
        startupName: 'EduTech Solutions',
        startupTagline: 'Personalized learning platform for K-12 education',
        startupLogo: '/api/placeholder/100/100',
        date: '2024-03-01',
        time: '2:00 PM',
        duration: '2 hours',
        phase: 7,
        mentor: 'Sarah Wilson',
        mentorEmail: 'sarah.wilson@email.com',
        joinLink: 'https://zoom.us/j/demo4',
        status: 'upcoming',
        attendees: 29,
        maxAttendees: 100,
        description: 'EduTech Solutions showcases their personalized learning platform for K-12 education. Discover how they\'re revolutionizing education through adaptive technology.',
        agenda: [
          {
            time: '2:00 PM',
            title: 'Welcome & Introduction',
            description: 'Opening remarks and agenda overview'
          },
          {
            time: '2:15 PM',
            title: 'Startup Presentation',
            description: 'EduTech Solutions pitch and product demo'
          },
          {
            time: '3:00 PM',
            title: 'Q&A Session',
            description: 'Investor questions and startup responses'
          },
          {
            time: '3:30 PM',
            title: 'Networking Break',
            description: 'Informal networking and discussions'
          },
          {
            time: '3:45 PM',
            title: 'Closing Remarks',
            description: 'Wrap-up and next steps'
          }
        ],
        presentationSlides: 'https://docs.google.com/presentation/d/edutech-demo',
        qnaSession: true,
        networkingSession: true,
        location: 'Virtual (Zoom)',
        timezone: 'IST'
      },
      {
        id: 'dd5',
        title: 'FinTech Innovations Demo Day',
        startupId: 's5',
        startupName: 'FinTech Innovations',
        startupTagline: 'Blockchain-based payment solutions for SMEs',
        startupLogo: '/api/placeholder/100/100',
        date: '2024-03-05',
        time: '3:00 PM',
        duration: '2 hours',
        phase: 10,
        mentor: 'David Brown',
        mentorEmail: 'david.brown@email.com',
        joinLink: 'https://zoom.us/j/demo5',
        status: 'upcoming',
        attendees: 67,
        maxAttendees: 100,
        description: 'FinTech Innovations presents their blockchain-based payment solutions for SMEs. Learn about their secure and efficient payment processing platform.',
        agenda: [
          {
            time: '3:00 PM',
            title: 'Welcome & Introduction',
            description: 'Opening remarks and agenda overview'
          },
          {
            time: '3:15 PM',
            title: 'Startup Presentation',
            description: 'FinTech Innovations pitch and product demo'
          },
          {
            time: '4:00 PM',
            title: 'Q&A Session',
            description: 'Investor questions and startup responses'
          },
          {
            time: '4:30 PM',
            title: 'Networking Break',
            description: 'Informal networking and discussions'
          },
          {
            time: '4:45 PM',
            title: 'Closing Remarks',
            description: 'Wrap-up and next steps'
          }
        ],
        presentationSlides: 'https://docs.google.com/presentation/d/fintech-demo',
        qnaSession: true,
        networkingSession: true,
        location: 'Virtual (Zoom)',
        timezone: 'IST'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setDemoDays(mockDemoDays);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDemoDays = demoDays.filter(demoDay => {
    if (filter === 'all') return true;
    return demoDay.status === filter;
  });

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
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'live':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <CalendarIcon className="h-4 w-4" />;
      case 'live':
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Demo Day Schedules</h1>
            <p className="text-gray-600">View and join upcoming startup demo days</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Demo Days</p>
                <p className="text-2xl font-semibold text-gray-900">{demoDays.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {demoDays.filter(d => d.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Attendees</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {demoDays.reduce((sum, d) => sum + d.attendees, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Startups Presenting</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(demoDays.map(d => d.startupId)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Demo Days', count: demoDays.length },
              { key: 'upcoming', label: 'Upcoming', count: demoDays.filter(d => d.status === 'upcoming').length },
              { key: 'live', label: 'Live', count: demoDays.filter(d => d.status === 'live').length },
              { key: 'completed', label: 'Completed', count: demoDays.filter(d => d.status === 'completed').length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Demo Days List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Day Schedule</h2>
            <div className="space-y-4">
              {filteredDemoDays.map((demoDay) => (
                <div key={demoDay.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {demoDay.startupLogo ? (
                            <img
                              src={demoDay.startupLogo}
                              alt={demoDay.startupName}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{demoDay.title}</h3>
                        <p className="text-sm text-gray-600">{demoDay.startupTagline}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(demoDay.date)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatTime(demoDay.time)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {demoDay.duration}
                          </div>
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            Phase {demoDay.phase}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {demoDay.attendees}/{demoDay.maxAttendees} attendees
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            Mentor: {demoDay.mentor}
                          </div>
                          <div className="flex items-center">
                            <VideoCameraIcon className="h-4 w-4 mr-1" />
                            {demoDay.location}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{demoDay.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demoDay.status)}`}>
                        {getStatusIcon(demoDay.status)}
                        <span className="ml-1">{demoDay.status}</span>
                      </span>
                      {demoDay.joinLink && demoDay.status === 'upcoming' && (
                        <a
                          href={demoDay.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Join Demo Day
                        </a>
                      )}
                      {demoDay.recordingUrl && demoDay.status === 'completed' && (
                        <a
                          href={demoDay.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          View Recording
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedDemoDay(demoDay);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Day Detail Modal */}
        {showDetailModal && selectedDemoDay && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedDemoDay.title}</h3>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          {selectedDemoDay.startupLogo ? (
                            <img
                              src={selectedDemoDay.startupLogo}
                              alt={selectedDemoDay.startupName}
                              className="h-24 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-medium text-gray-900">{selectedDemoDay.startupName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedDemoDay.startupTagline}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDemoDay.status)}`}>
                            {getStatusIcon(selectedDemoDay.status)}
                            <span className="ml-1">{selectedDemoDay.status}</span>
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Phase {selectedDemoDay.phase}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedDemoDay.date)} at {formatTime(selectedDemoDay.time)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-sm text-gray-900">{selectedDemoDay.duration}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-sm text-gray-900">{selectedDemoDay.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Timezone</label>
                        <p className="text-sm text-gray-900">{selectedDemoDay.timezone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mentor</label>
                        <p className="text-sm text-gray-900">{selectedDemoDay.mentor}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Attendees</label>
                        <p className="text-sm text-gray-900">{selectedDemoDay.attendees}/{selectedDemoDay.maxAttendees}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-sm text-gray-900">{selectedDemoDay.description}</p>
                    </div>

                    {/* Agenda */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Event Agenda</h4>
                      <div className="space-y-3">
                        {selectedDemoDay.agenda.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-sm font-medium text-gray-900">{item.title}</h5>
                              <span className="text-xs text-gray-500">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Event Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDemoDay.qnaSession && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Q&A Session
                          </span>
                        )}
                        {selectedDemoDay.networkingSession && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Networking Session
                          </span>
                        )}
                        {selectedDemoDay.presentationSlides && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Presentation Slides
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-3">Resources</h4>
                      <div className="space-y-2">
                        {selectedDemoDay.presentationSlides && (
                          <a
                            href={selectedDemoDay.presentationSlides}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm block"
                          >
                            📊 Presentation Slides
                          </a>
                        )}
                        {selectedDemoDay.joinLink && (
                          <a
                            href={selectedDemoDay.joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm block"
                          >
                            🔗 Join Link
                          </a>
                        )}
                        {selectedDemoDay.recordingUrl && (
                          <a
                            href={selectedDemoDay.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm block"
                          >
                            🎥 Event Recording
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      {selectedDemoDay.joinLink && selectedDemoDay.status === 'upcoming' && (
                        <a
                          href={selectedDemoDay.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Join Demo Day
                        </a>
                      )}
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

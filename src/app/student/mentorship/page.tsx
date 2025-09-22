'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  PlusIcon,
  VideoCameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function StudentMentorshipPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    if (user?.role && !['student', 'learner'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  // Mock mentorship data
  const mentorshipData = {
    assignedMentors: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        title: 'Senior Software Engineer',
        company: 'Google',
        expertise: ['React', 'Node.js', 'System Design'],
        rating: 4.9,
        totalSessions: 45,
        avatar: '/api/placeholder/100/100',
        bio: 'Experienced software engineer with 10+ years in full-stack development. Passionate about mentoring the next generation of developers.',
        availability: 'Mon-Fri, 2:00 PM - 6:00 PM',
        nextAvailableSlot: '2024-01-15 at 3:00 PM',
        contactMethods: ['video', 'phone', 'email'],
        languages: ['English', 'Spanish']
      },
      {
        id: 2,
        name: 'Alex Thompson',
        title: 'UX Design Lead',
        company: 'Adobe',
        expertise: ['UI/UX Design', 'Figma', 'User Research'],
        rating: 4.8,
        totalSessions: 32,
        avatar: '/api/placeholder/100/100',
        bio: 'Creative UX designer focused on creating intuitive and beautiful user experiences. Expert in design systems and user research.',
        availability: 'Tue-Thu, 10:00 AM - 4:00 PM',
        nextAvailableSlot: '2024-01-16 at 11:00 AM',
        contactMethods: ['video', 'email'],
        languages: ['English']
      }
    ],
    upcomingSessions: [
      {
        id: 1,
        mentor: 'Dr. Sarah Johnson',
        title: 'Code Review Session',
        date: '2024-01-15',
        time: '15:00',
        duration: 60,
        type: 'video',
        status: 'confirmed',
        agenda: 'Review React project implementation and discuss best practices',
        meetingLink: '#'
      },
      {
        id: 2,
        mentor: 'Alex Thompson',
        title: 'Portfolio Review',
        date: '2024-01-17',
        time: '14:00',
        duration: 45,
        type: 'video',
        status: 'pending',
        agenda: 'Review design portfolio and provide feedback for improvement',
        meetingLink: '#'
      }
    ],
    pastSessions: [
      {
        id: 3,
        mentor: 'Dr. Sarah Johnson',
        title: 'Career Guidance',
        date: '2024-01-10',
        time: '16:00',
        duration: 60,
        type: 'video',
        status: 'completed',
        notes: 'Discussed career path in software engineering, recommended learning resources',
        feedback: 'Excellent session! Very helpful insights about the industry.',
        rating: 5
      },
      {
        id: 4,
        mentor: 'Alex Thompson',
        title: 'Design Critique',
        date: '2024-01-08',
        time: '13:00',
        duration: 45,
        type: 'video',
        status: 'completed',
        notes: 'Reviewed wireframes and provided feedback on user flow',
        feedback: 'Great feedback on improving user experience.',
        rating: 5
      }
    ],
    messages: [
      {
        id: 1,
        mentor: 'Dr. Sarah Johnson',
        message: 'Hi! I\'ve reviewed your latest React project. Great work on the component structure! Let\'s discuss some optimization opportunities in our next session.',
        timestamp: '2024-01-12 14:30',
        read: false
      },
      {
        id: 2,
        mentor: 'Alex Thompson',
        message: 'Your portfolio is looking great! I\'ve added some notes about the color scheme. Check them out before our next session.',
        timestamp: '2024-01-11 09:15',
        read: true
      }
    ]
  };

  const filteredMentors = mentorshipData.assignedMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentorship data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mentorship</h1>
              <p className="mt-2 text-gray-600">
                Connect with your mentors, schedule sessions, and track your progress
              </p>
            </div>
            <Link
              href="/student/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mentors')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'mentors'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Mentors
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sessions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sessions
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'messages'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Messages
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{mentorshipData.assignedMentors.length}</p>
                    <p className="text-sm text-gray-600">Assigned Mentors</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{mentorshipData.upcomingSessions.length}</p>
                    <p className="text-sm text-gray-600">Upcoming Sessions</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{mentorshipData.pastSessions.length}</p>
                    <p className="text-sm text-gray-600">Completed Sessions</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{mentorshipData.messages.filter(m => !m.read).length}</p>
                    <p className="text-sm text-gray-600">Unread Messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                <Link 
                  href="/student/schedule" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {mentorshipData.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {mentorshipData.upcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {session.type === 'video' ? (
                              <VideoCameraIcon className="h-5 w-5 text-blue-500" />
                            ) : (
                              <PhoneIcon className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{session.title}</h3>
                            <p className="text-sm text-gray-600">with {session.mentor}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>{session.date}</span>
                              <span className="mx-2">•</span>
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{session.time}</span>
                              <span className="mx-2">•</span>
                              <span>{session.duration} minutes</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.status}
                          </span>
                          <a
                            href={session.meetingLink}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Join
                          </a>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Agenda:</strong> {session.agenda}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">Schedule a session with your mentor to get started.</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule Session
                  </button>
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
                <Link 
                  href="/student/mentorship?tab=messages" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {mentorshipData.messages.slice(0, 3).map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900">{message.mentor}</h4>
                          {!message.read && (
                            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-8">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-gray-600">{mentor.title} at {mentor.company}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {mentor.rating} ({mentor.totalSessions} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{mentor.bio}</p>

                  {/* Expertise */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
                    <p className="text-sm text-gray-600">{mentor.availability}</p>
                    <p className="text-sm text-blue-600 mt-1">Next available: {mentor.nextAvailableSlot}</p>
                  </div>

                  {/* Contact Methods */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Methods</h4>
                    <div className="flex space-x-2">
                      {mentor.contactMethods.includes('video') && (
                        <span className="flex items-center text-sm text-gray-600">
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                          Video
                        </span>
                      )}
                      {mentor.contactMethods.includes('phone') && (
                        <span className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          Phone
                        </span>
                      )}
                      {mentor.contactMethods.includes('email') && (
                        <span className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Email
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Schedule Session
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            {/* Session History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Session History</h2>
              
              <div className="space-y-4">
                {mentorshipData.pastSessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {session.type === 'video' ? (
                            <VideoCameraIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <PhoneIcon className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{session.title}</h3>
                          <p className="text-sm text-gray-600">with {session.mentor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Session Notes</h4>
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Your Feedback</h4>
                        <p className="text-sm text-gray-700">{session.feedback}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      {session.date} at {session.time} • {session.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
              
              <div className="space-y-4">
                {mentorshipData.messages.map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900">{message.mentor}</h4>
                          {!message.read && (
                            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                        <p className="text-xs text-gray-500">{message.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Reply
                        </button>
                        {!message.read && (
                          <button className="text-gray-500 hover:text-gray-700 text-sm">
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

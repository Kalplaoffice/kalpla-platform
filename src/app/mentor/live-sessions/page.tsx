'use client';

import { useState, useEffect } from 'react';
import { MentorLayout } from '@/components/mentor/MentorLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  VideoCameraIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  phase: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  joinLink?: string;
  recordingUrl?: string;
  enrolledStudents: number;
  attendedStudents: number;
  platform: 'zoom' | 'amazon_ivs' | 'google_meet';
  autoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewSession {
  title: string;
  description: string;
  phase: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  platform: 'zoom' | 'amazon_ivs' | 'google_meet';
  autoRecord: boolean;
}

export default function LiveSessionsPage() {
  const { isMentor } = useRoleBasedAccess();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newSession, setNewSession] = useState<NewSession>({
    title: '',
    description: '',
    phase: '',
    course: '',
    date: '',
    time: '',
    duration: '60',
    platform: 'zoom',
    autoRecord: true
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockSessions: LiveSession[] = [
      {
        id: 's1',
        title: 'Financial Modeling Workshop',
        description: 'Learn how to create comprehensive financial models for startups',
        phase: 'Phase 3',
        course: 'KSMP',
        date: '2024-01-22',
        time: '10:00 AM',
        duration: '120',
        status: 'scheduled',
        joinLink: 'https://zoom.us/j/123456789',
        enrolledStudents: 25,
        attendedStudents: 0,
        platform: 'zoom',
        autoRecord: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 's2',
        title: 'Investor Pitch Preparation',
        description: 'Prepare and practice your investor pitch presentation',
        phase: 'Phase 3',
        course: 'KSMP',
        date: '2024-01-25',
        time: '2:00 PM',
        duration: '90',
        status: 'scheduled',
        joinLink: 'https://zoom.us/j/987654321',
        enrolledStudents: 25,
        attendedStudents: 0,
        platform: 'zoom',
        autoRecord: true,
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 's3',
        title: 'Market Research Deep Dive',
        description: 'Advanced market research techniques and analysis',
        phase: 'Phase 1',
        course: 'KSMP',
        date: '2024-01-20',
        time: '11:00 AM',
        duration: '120',
        status: 'completed',
        enrolledStudents: 25,
        attendedStudents: 23,
        platform: 'amazon_ivs',
        autoRecord: true,
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session1.mp4',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-20T13:00:00Z'
      },
      {
        id: 's4',
        title: 'Business Model Canvas Workshop',
        description: 'Create and refine your business model canvas',
        phase: 'Phase 2',
        course: 'KSMP',
        date: '2024-01-18',
        time: '3:00 PM',
        duration: '90',
        status: 'completed',
        enrolledStudents: 25,
        attendedStudents: 24,
        platform: 'amazon_ivs',
        autoRecord: true,
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session2.mp4',
        createdAt: '2024-01-12T11:00:00Z',
        updatedAt: '2024-01-18T16:30:00Z'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

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
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
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

  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.date || !newSession.time) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      // TODO: Implement actual session creation API call
      console.log('Creating session:', newSession);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock join link
      const joinLink = `https://${newSession.platform === 'zoom' ? 'zoom.us' : 'meet.google.com'}/j/${Math.random().toString(36).substr(2, 9)}`;
      
      const createdSession: LiveSession = {
        id: `s${Date.now()}`,
        ...newSession,
        status: 'scheduled',
        joinLink,
        enrolledStudents: 25,
        attendedStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSessions([...sessions, createdSession]);
      setShowCreateModal(false);
      setNewSession({
        title: '',
        description: '',
        phase: '',
        course: '',
        date: '',
        time: '',
        duration: '60',
        platform: 'zoom',
        autoRecord: true
      });
    } catch (error) {
      console.error('Session creation error:', error);
    } finally {
      setCreating(false);
    }
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
            attendedStudents: Math.floor(Math.random() * 25) + 20
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
          <p className="text-gray-600">You don't have permission to access the mentor dashboard.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
            <p className="text-gray-600">Schedule and manage your live mentoring sessions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
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
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter(s => s.status === 'live').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
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

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Sessions</h2>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-md font-semibold text-gray-900">{session.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1">{session.status}</span>
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
                      
                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      
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
                          {session.duration} min
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {session.attendedStudents}/{session.enrolledStudents} attended
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
                        <span>{session.phase} • {session.course}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedSession(session);
                          setShowDetailModal(true);
                        }}
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Session</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                      <input
                        type="text"
                        value={newSession.title}
                        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter session title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newSession.description}
                        onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter session description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phase *</label>
                        <select
                          value={newSession.phase}
                          onChange={(e) => setNewSession({ ...newSession, phase: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Phase</option>
                          <option value="Phase 1">Phase 1: Business Idea & Market Research</option>
                          <option value="Phase 2">Phase 2: Business Model & Strategy</option>
                          <option value="Phase 3">Phase 3: Financial Planning & Funding</option>
                          <option value="Phase 4">Phase 4: Product Development</option>
                          <option value="Phase 5">Phase 5: Marketing & Sales</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                        <select
                          value={newSession.course}
                          onChange={(e) => setNewSession({ ...newSession, course: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Course</option>
                          <option value="KSMP">KSMP</option>
                          <option value="Python for Data Science">Python for Data Science</option>
                          <option value="React Development">React Development</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                        <input
                          type="date"
                          value={newSession.date}
                          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                        <input
                          type="time"
                          value={newSession.time}
                          onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                        <select
                          value={newSession.duration}
                          onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="90">90 minutes</option>
                          <option value="120">120 minutes</option>
                          <option value="180">180 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <select
                          value={newSession.platform}
                          onChange={(e) => setNewSession({ ...newSession, platform: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="zoom">Zoom</option>
                          <option value="amazon_ivs">Amazon IVS</option>
                          <option value="google_meet">Google Meet</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoRecord"
                        checked={newSession.autoRecord}
                        onChange={(e) => setNewSession({ ...newSession, autoRecord: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoRecord" className="ml-2 block text-sm text-gray-700">
                        Auto-record session and save to S3
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateSession}
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        {creating ? 'Creating...' : 'Schedule Session'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Detail Modal */}
        {showDetailModal && selectedSession && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedSession.title}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedSession.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phase & Course</label>
                        <p className="text-sm text-gray-900">{selectedSession.phase} • {selectedSession.course}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Platform</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedSession.platform}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedSession.date)} at {formatTime(selectedSession.time)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-sm text-gray-900">{selectedSession.duration} minutes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Enrolled Students</label>
                        <p className="text-sm text-gray-900">{selectedSession.enrolledStudents}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Attended Students</label>
                        <p className="text-sm text-gray-900">{selectedSession.attendedStudents}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                        {getStatusIcon(selectedSession.status)}
                        <span className="ml-1">{selectedSession.status}</span>
                      </span>
                    </div>

                    {selectedSession.joinLink && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Join Link</label>
                        <a
                          href={selectedSession.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {selectedSession.joinLink}
                        </a>
                      </div>
                    )}

                    {selectedSession.recordingUrl && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recording</label>
                        <a
                          href={selectedSession.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm break-all"
                        >
                          {selectedSession.recordingUrl}
                        </a>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
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

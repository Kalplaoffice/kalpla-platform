'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLayout } from '@/components/student/StudentLayout';
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
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail?: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'live' | 'completed';
  joinLink?: string;
  recordingUrl?: string;
  enrolledStudents: number;
  attendedStudents?: number;
  platform: 'zoom' | 'amazon_ivs' | 'google_meet';
  isEnrolled: boolean;
  phase?: string;
  tags: string[];
}

export default function StudentLiveClassesPage() {
  const { hasRole } = useRoleBasedAccess();
  // Check if user is student
  const isStudent = hasRole('Student');
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('upcoming');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockSessions: LiveSession[] = [
      {
        id: 's1',
        title: 'React Hooks Deep Dive',
        description: 'Learn advanced React hooks patterns and best practices',
        courseId: 'c1',
        courseTitle: 'React Development Fundamentals',
        instructor: 'John Doe',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-22',
        time: '14:00',
        duration: '2 hours',
        status: 'upcoming',
        joinLink: 'https://zoom.us/j/123456789',
        enrolledStudents: 25,
        platform: 'zoom',
        isEnrolled: true,
        tags: ['React', 'Hooks', 'Advanced']
      },
      {
        id: 's2',
        title: 'Data Visualization with Python',
        description: 'Create stunning visualizations using Matplotlib and Seaborn',
        courseId: 'c2',
        courseTitle: 'Python for Data Science',
        instructor: 'Jane Smith',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-20',
        time: '10:00',
        duration: '1.5 hours',
        status: 'completed',
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session2.mp4',
        enrolledStudents: 30,
        attendedStudents: 28,
        platform: 'amazon_ivs',
        isEnrolled: true,
        tags: ['Python', 'Data Visualization', 'Matplotlib']
      },
      {
        id: 's3',
        title: 'AWS Lambda Functions',
        description: 'Build serverless applications with AWS Lambda',
        courseId: 'c4',
        courseTitle: 'AWS Cloud Architecture',
        instructor: 'Sarah Wilson',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-25',
        time: '16:00',
        duration: '2.5 hours',
        status: 'upcoming',
        joinLink: 'https://zoom.us/j/987654321',
        enrolledStudents: 20,
        platform: 'zoom',
        isEnrolled: true,
        tags: ['AWS', 'Lambda', 'Serverless']
      },
      {
        id: 's4',
        title: 'Digital Marketing Analytics',
        description: 'Track and analyze your marketing campaigns effectively',
        courseId: 'c3',
        courseTitle: 'Digital Marketing Mastery',
        instructor: 'Mike Johnson',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-18',
        time: '11:00',
        duration: '1 hour',
        status: 'completed',
        recordingUrl: 'https://s3.amazonaws.com/kalpla-recordings/session4.mp4',
        enrolledStudents: 35,
        attendedStudents: 32,
        platform: 'google_meet',
        isEnrolled: false,
        tags: ['Marketing', 'Analytics', 'Campaigns']
      },
      {
        id: 's5',
        title: 'UI Design Principles',
        description: 'Master the fundamentals of user interface design',
        courseId: 'c5',
        courseTitle: 'UI/UX Design Principles',
        instructor: 'Alex Brown',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-24',
        time: '13:00',
        duration: '1.5 hours',
        status: 'upcoming',
        joinLink: 'https://zoom.us/j/456789123',
        enrolledStudents: 28,
        platform: 'amazon_ivs',
        isEnrolled: false,
        tags: ['UI Design', 'Principles', 'User Experience']
      },
      {
        id: 's6',
        title: 'KSMP Phase 3: Financial Planning',
        description: 'Learn financial modeling and funding strategies for startups',
        courseId: 'ksmp',
        courseTitle: 'Kalpla Startup Mentorship Program',
        instructor: 'Dr. Rajesh Kumar',
        instructorAvatar: '/api/placeholder/40/40',
        thumbnail: '/api/placeholder/300/200',
        date: '2024-01-23',
        time: '15:00',
        duration: '2 hours',
        status: 'live',
        joinLink: 'https://zoom.us/j/live123456',
        enrolledStudents: 25,
        platform: 'zoom',
        isEnrolled: true,
        phase: 'Phase 3',
        tags: ['KSMP', 'Financial Planning', 'Startup Funding']
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
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || session.status === filter;
    const matchesPlatform = platformFilter === 'all' || session.platform === platformFilter;
    
    return matchesSearch && matchesFilter && matchesPlatform;
  });

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming' && s.isEnrolled);
  const liveSessions = sessions.filter(s => s.status === 'live' && s.isEnrolled);
  const completedSessions = sessions.filter(s => s.status === 'completed' && s.isEnrolled);

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
        return <SignalIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
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

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the live classes page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-gray-600">Join live sessions and watch recordings from your enrolled courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <SignalIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live Now</p>
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
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">{sessions.filter(s => s.isEnrolled).length}</p>
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
                  placeholder="Search live sessions..."
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
                <option value="upcoming">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Completed</option>
                <option value="all">All Sessions</option>
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

        {/* Live Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Session Thumbnail */}
              <div className="relative">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {session.thumbnail ? (
                    <img
                      src={session.thumbnail}
                      alt={session.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <VideoCameraIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                    <span className="ml-1">{session.status}</span>
                  </span>
                </div>
                
                {/* Platform Badge */}
                <div className="absolute top-2 left-2">
                  <div className="flex items-center bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium">
                    {getPlatformIcon(session.platform)}
                    <span className="ml-1 capitalize">{session.platform}</span>
                  </div>
                </div>
                
                {/* Phase Badge for KSMP */}
                {session.phase && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {session.phase}
                    </span>
                  </div>
                )}
              </div>

              {/* Session Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{session.courseTitle}</p>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {session.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {session.instructorAvatar ? (
                      <img
                        src={session.instructorAvatar}
                        alt={session.instructor}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.instructor}</p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
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
                    {session.enrolledStudents} enrolled
                  </div>
                </div>

                {/* Attendance for Completed Sessions */}
                {session.status === 'completed' && session.attendedStudents && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Session Completed</p>
                    <p className="text-sm text-green-700">
                      {session.attendedStudents}/{session.enrolledStudents} students attended
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {session.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.status === 'live' && session.joinLink && session.isEnrolled && (
                      <a
                        href={session.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                      >
                        <SignalIcon className="h-4 w-4 mr-2" />
                        Join Live
                      </a>
                    )}
                    
                    {session.status === 'upcoming' && session.isEnrolled && (
                      <button
                        disabled
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed flex items-center"
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Upcoming
                      </button>
                    )}
                    
                    {session.status === 'completed' && session.recordingUrl && (
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Watch Recording
                      </a>
                    )}
                    
                    {!session.isEnrolled && (
                      <Link
                        href={`/courses/${session.courseId}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
                      >
                        Enroll in Course
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No live sessions found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'upcoming' || platformFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'You don\'t have any upcoming live sessions.'}
            </p>
            <Link
              href="/student/courses"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Enrolled Courses
            </Link>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

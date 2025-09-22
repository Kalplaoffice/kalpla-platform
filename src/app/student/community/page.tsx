'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  UsersIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  EyeIcon,
  ClockIcon,
  UserCircleIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarIcon,
  StarIcon,
  ArrowRightIcon,
  BellIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export default function StudentCommunityPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [activeTab, setActiveTab] = useState('forums');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

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

  // Mock community data
  const communityData = {
    forums: [
      {
        id: 1,
        title: 'React Development Discussion',
        category: 'Web Development',
        description: 'Share your React projects, ask questions, and get help from fellow developers.',
        posts: 156,
        lastActivity: '2 hours ago',
        members: 89,
        isPinned: true,
        recentPost: {
          author: 'Sarah Chen',
          title: 'Best practices for React state management?',
          time: '2 hours ago'
        }
      },
      {
        id: 2,
        title: 'Data Science Study Group',
        category: 'Data Science',
        description: 'Collaborate on data science projects and share learning resources.',
        posts: 203,
        lastActivity: '4 hours ago',
        members: 67,
        isPinned: false,
        recentPost: {
          author: 'Mike Rodriguez',
          title: 'Python vs R for statistical analysis',
          time: '4 hours ago'
        }
      },
      {
        id: 3,
        title: 'UI/UX Design Critique',
        category: 'Design',
        description: 'Get feedback on your designs and share your creative work.',
        posts: 98,
        lastActivity: '1 day ago',
        members: 45,
        isPinned: false,
        recentPost: {
          author: 'Alex Thompson',
          title: 'Portfolio review needed - landing page design',
          time: '1 day ago'
        }
      },
      {
        id: 4,
        title: 'Career Advice & Networking',
        category: 'Career',
        description: 'Share job opportunities, career tips, and professional networking.',
        posts: 312,
        lastActivity: '3 hours ago',
        members: 124,
        isPinned: true,
        recentPost: {
          author: 'Emily Johnson',
          title: 'Tech interview preparation tips',
          time: '3 hours ago'
        }
      },
      {
        id: 5,
        title: 'Study Tips & Motivation',
        category: 'General',
        description: 'Share study strategies, motivation tips, and learning experiences.',
        posts: 187,
        lastActivity: '6 hours ago',
        members: 156,
        isPinned: false,
        recentPost: {
          author: 'David Kim',
          title: 'How to stay motivated during long coding sessions',
          time: '6 hours ago'
        }
      }
    ],
    groups: [
      {
        id: 1,
        name: 'React Developers Hub',
        description: 'A community for React enthusiasts to share projects and learn together.',
        members: 234,
        category: 'Web Development',
        isJoined: true,
        recentActivity: '5 new posts today',
        avatar: '/api/placeholder/60/60'
      },
      {
        id: 2,
        name: 'Data Science Beginners',
        description: 'Perfect for those starting their data science journey.',
        members: 189,
        category: 'Data Science',
        isJoined: true,
        recentActivity: '3 new members joined',
        avatar: '/api/placeholder/60/60'
      },
      {
        id: 3,
        name: 'Design Thinkers',
        description: 'Creative minds sharing design inspiration and feedback.',
        members: 156,
        category: 'Design',
        isJoined: false,
        recentActivity: '2 new projects shared',
        avatar: '/api/placeholder/60/60'
      },
      {
        id: 4,
        name: 'Career Changers',
        description: 'Support group for professionals transitioning to tech careers.',
        members: 298,
        category: 'Career',
        isJoined: true,
        recentActivity: '1 new job posting',
        avatar: '/api/placeholder/60/60'
      }
    ],
    events: [
      {
        id: 1,
        title: 'Virtual Coding Meetup',
        date: '2024-01-20',
        time: '18:00',
        type: 'online',
        attendees: 45,
        maxAttendees: 100,
        description: 'Join us for a virtual coding session where we\'ll build a React component together.',
        organizer: 'React Developers Hub',
        isRegistered: true
      },
      {
        id: 2,
        title: 'Data Science Workshop',
        date: '2024-01-25',
        time: '14:00',
        type: 'online',
        attendees: 23,
        maxAttendees: 50,
        description: 'Hands-on workshop on machine learning with Python.',
        organizer: 'Data Science Beginners',
        isRegistered: false
      },
      {
        id: 3,
        title: 'Design Portfolio Review',
        date: '2024-01-22',
        time: '16:00',
        type: 'online',
        attendees: 12,
        maxAttendees: 20,
        description: 'Get professional feedback on your design portfolio.',
        organizer: 'Design Thinkers',
        isRegistered: false
      }
    ],
    messages: [
      {
        id: 1,
        sender: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        message: 'Hey! I saw your React project on the forum. It looks amazing! Would you mind sharing the code?',
        timestamp: '2 hours ago',
        isRead: false,
        isOnline: true
      },
      {
        id: 2,
        sender: 'Mike Rodriguez',
        avatar: '/api/placeholder/40/40',
        message: 'Thanks for the study group session yesterday. The Python tips were really helpful!',
        timestamp: '4 hours ago',
        isRead: true,
        isOnline: false
      },
      {
        id: 3,
        sender: 'Alex Thompson',
        avatar: '/api/placeholder/40/40',
        message: 'Are you attending the design workshop this weekend?',
        timestamp: '1 day ago',
        isRead: true,
        isOnline: true
      }
    ]
  };

  const categories = ['all', 'Web Development', 'Data Science', 'Design', 'Career', 'General'];

  const filteredForums = communityData.forums.filter(forum => {
    const matchesSearch = forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         forum.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || forum.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="mt-2 text-gray-600">
                Connect with fellow students, join discussions, and grow your network
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
                onClick={() => setActiveTab('forums')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'forums'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Forums
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'groups'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'events'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Events
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

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search forums and discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Post
                  </button>
                </div>
              </div>
            </div>

            {/* Forums List */}
            <div className="space-y-4">
              {filteredForums.map((forum) => (
                <div key={forum.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{forum.title}</h3>
                        {forum.isPinned && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pinned
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {forum.category}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{forum.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ChatBubbleOvalLeftIcon className="h-4 w-4 mr-1" />
                          <span>{forum.posts} posts</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{forum.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Last activity: {forum.lastActivity}</span>
                        </div>
                      </div>
                      {forum.recentPost && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>Latest:</strong> {forum.recentPost.title} by {forum.recentPost.author} • {forum.recentPost.time}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {communityData.groups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                        {group.isJoined && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Joined
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{group.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          <span>{group.category}</span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">{group.recentActivity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {group.isJoined ? (
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        Leave Group
                      </button>
                    ) : (
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Join Group
                      </button>
                    )}
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="space-y-6">
              {communityData.events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {event.type}
                        </span>
                        {event.isRegistered && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Registered
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{event.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{event.attendees}/{event.maxAttendees} attendees</span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>Organized by {event.organizer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.isRegistered ? (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                          Registered
                        </span>
                      ) : (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Register
                        </button>
                      )}
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Message
                </button>
              </div>
              
              <div className="space-y-4">
                {communityData.messages.map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg ${message.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={message.avatar}
                          alt={message.sender}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        {message.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{message.sender}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                            {!message.isRead && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
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

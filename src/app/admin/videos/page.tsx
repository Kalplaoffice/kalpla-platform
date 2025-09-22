'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  VideoCameraIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CloudArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function VideosPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Mock data for videos
  const videos = [
    {
      id: 'VIDEO_001',
      title: 'Introduction to HTML Basics',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      status: 'published',
      duration: '45:30',
      fileSize: '2.3 GB',
      resolution: '1920x1080',
      format: 'MP4',
      quality: 'HD',
      views: 1250,
      likes: 89,
      dislikes: 2,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
      description: 'Learn the fundamentals of HTML structure, elements, and best practices for web development.',
      tags: ['HTML', 'Web Development', 'Basics', 'Tutorial'],
      uploadDate: '2024-01-15',
      publishDate: '2024-01-16',
      lastModified: '2024-01-20',
      storageLocation: 'AWS S3',
      cdnUrl: 'https://cdn.kalpla.com/videos/html-basics.mp4',
      transcriptAvailable: true,
      subtitlesAvailable: true,
      downloadAllowed: false,
      commentsEnabled: true,
      analytics: {
        watchTime: '38:45',
        completionRate: 78,
        avgWatchTime: '35:20',
        dropOffPoints: [12, 25, 38]
      }
    },
    {
      id: 'VIDEO_002',
      title: 'CSS Styling and Layout',
      courseId: '1',
      courseTitle: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      status: 'published',
      duration: '60:15',
      fileSize: '3.1 GB',
      resolution: '1920x1080',
      format: 'MP4',
      quality: 'HD',
      views: 1180,
      likes: 95,
      dislikes: 1,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      description: 'Master CSS styling techniques, flexbox, grid, and responsive design principles.',
      tags: ['CSS', 'Styling', 'Layout', 'Responsive Design'],
      uploadDate: '2024-01-16',
      publishDate: '2024-01-17',
      lastModified: '2024-01-19',
      storageLocation: 'AWS S3',
      cdnUrl: 'https://cdn.kalpla.com/videos/css-styling.mp4',
      transcriptAvailable: true,
      subtitlesAvailable: true,
      downloadAllowed: false,
      commentsEnabled: true,
      analytics: {
        watchTime: '52:30',
        completionRate: 85,
        avgWatchTime: '48:15',
        dropOffPoints: [15, 30, 45]
      }
    },
    {
      id: 'VIDEO_003',
      title: 'Data Analysis with Pandas',
      courseId: '2',
      courseTitle: 'Data Science with Python',
      instructor: 'Prof. Michael Chen',
      status: 'processing',
      duration: '90:45',
      fileSize: '4.2 GB',
      resolution: '1920x1080',
      format: 'MP4',
      quality: 'HD',
      views: 0,
      likes: 0,
      dislikes: 0,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      description: 'Comprehensive guide to data manipulation and analysis using Pandas library.',
      tags: ['Python', 'Pandas', 'Data Analysis', 'Data Science'],
      uploadDate: '2024-01-20',
      publishDate: null,
      lastModified: '2024-01-22',
      storageLocation: 'AWS S3',
      cdnUrl: null,
      transcriptAvailable: false,
      subtitlesAvailable: false,
      downloadAllowed: false,
      commentsEnabled: true,
      analytics: {
        watchTime: '0:00',
        completionRate: 0,
        avgWatchTime: '0:00',
        dropOffPoints: []
      }
    },
    {
      id: 'VIDEO_004',
      title: 'Design Principles and Theory',
      courseId: '3',
      courseTitle: 'UI/UX Design Fundamentals',
      instructor: 'Dr. Emily Rodriguez',
      status: 'draft',
      duration: '50:20',
      fileSize: '2.8 GB',
      resolution: '1920x1080',
      format: 'MP4',
      quality: 'HD',
      views: 0,
      likes: 0,
      dislikes: 0,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      description: 'Understanding fundamental design principles and their application in user interface design.',
      tags: ['Design', 'UI/UX', 'Principles', 'Theory'],
      uploadDate: '2024-01-18',
      publishDate: null,
      lastModified: '2024-01-22',
      storageLocation: 'AWS S3',
      cdnUrl: null,
      transcriptAvailable: false,
      subtitlesAvailable: false,
      downloadAllowed: false,
      commentsEnabled: true,
      analytics: {
        watchTime: '0:00',
        completionRate: 0,
        avgWatchTime: '0:00',
        dropOffPoints: []
      }
    },
    {
      id: 'VIDEO_005',
      title: 'SEO Optimization Strategies',
      courseId: '4',
      courseTitle: 'Digital Marketing Mastery',
      instructor: 'Mr. David Kumar',
      status: 'published',
      duration: '35:10',
      fileSize: '1.9 GB',
      resolution: '1920x1080',
      format: 'MP4',
      quality: 'HD',
      views: 800,
      likes: 67,
      dislikes: 3,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      description: 'Learn effective SEO strategies to improve website visibility and organic traffic.',
      tags: ['SEO', 'Digital Marketing', 'Optimization', 'Search Engine'],
      uploadDate: '2024-01-10',
      publishDate: '2024-01-12',
      lastModified: '2024-01-15',
      storageLocation: 'AWS S3',
      cdnUrl: 'https://cdn.kalpla.com/videos/seo-strategies.mp4',
      transcriptAvailable: true,
      subtitlesAvailable: true,
      downloadAllowed: false,
      commentsEnabled: true,
      analytics: {
        watchTime: '28:45',
        completionRate: 75,
        avgWatchTime: '26:30',
        dropOffPoints: [8, 18, 28]
      }
    }
  ];

  const courses = [
    { id: '1', title: 'Complete Web Development Bootcamp' },
    { id: '2', title: 'Data Science with Python' },
    { id: '3', title: 'UI/UX Design Fundamentals' },
    { id: '4', title: 'Digital Marketing Mastery' }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || video.courseId === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="h-4 w-4" />;
      case 'processing': return <ClockIcon className="h-4 w-4" />;
      case 'draft': return <DocumentTextIcon className="h-4 w-4" />;
      case 'failed': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Video Deployment</h1>
                <p className="text-gray-600 mt-1">Manage video content, uploads, and deployment across the platform</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Videos</p>
                    <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{videos.filter(v => v.status === 'published').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PlayIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900">14.3 GB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="processing">Processing</option>
                  <option value="draft">Draft</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Course Filter */}
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload Video
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                      {getStatusIcon(video.status)}
                      <span className="ml-1 capitalize">{video.status}</span>
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                    <button className="p-3 bg-white rounded-full shadow-lg">
                      <PlayIcon className="h-6 w-6 text-gray-900" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{video.courseTitle}</p>
                    <p className="text-sm text-gray-500">by {video.instructor}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Uploaded: {formatDate(video.uploadDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <VideoCameraIcon className="h-4 w-4 mr-2" />
                      <span>{video.resolution} • {video.fileSize}</span>
                    </div>
                    {video.status === 'published' && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PlayIcon className="h-4 w-4 mr-2" />
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          +{video.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-xs text-gray-600">
                      {video.transcriptAvailable ? (
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      Transcript
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      {video.subtitlesAvailable ? (
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      Subtitles
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      {video.downloadAllowed ? (
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      Download
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      {video.commentsEnabled ? (
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      Comments
                    </div>
                  </div>

                  {/* Analytics (for published videos) */}
                  {video.status === 'published' && video.analytics.completionRate > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completion Rate</span>
                        <span>{video.analytics.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${video.analytics.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterCourse !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No videos have been uploaded yet.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Upload First Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

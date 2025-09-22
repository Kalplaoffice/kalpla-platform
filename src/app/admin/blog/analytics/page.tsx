'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function BlogAnalyticsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedBlog, setSelectedBlog] = useState('all');

  useEffect(() => {
    if (loading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }

    if (user?.role && !['admin', 'editor'].includes(user.role.toLowerCase())) {
      router.push('/dashboard');
      setHasRedirected(true);
    }
  }, [user, loading, router, isAuthenticated, hasRedirected]);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 15420,
      totalLikes: 892,
      totalShares: 234,
      totalComments: 156,
      avgReadTime: '6.5 min',
      bounceRate: '42%',
      topPerformingBlog: 'Getting Started with React Hooks',
      topCategory: 'Web Development'
    },
    blogs: [
      {
        id: 1,
        title: 'Getting Started with React Hooks',
        views: 1250,
        likes: 89,
        shares: 23,
        comments: 15,
        readTime: '8 min',
        publishedAt: '2024-01-15',
        category: 'Web Development',
        author: 'Sarah Johnson',
        trend: 'up',
        trendPercentage: 15.2
      },
      {
        id: 2,
        title: 'Building Scalable APIs with Node.js',
        views: 980,
        likes: 67,
        shares: 18,
        comments: 12,
        readTime: '12 min',
        publishedAt: '2024-01-10',
        category: 'Backend Development',
        author: 'Michael Chen',
        trend: 'up',
        trendPercentage: 8.7
      },
      {
        id: 3,
        title: 'Introduction to Machine Learning',
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        readTime: '15 min',
        publishedAt: null,
        category: 'Data Science',
        author: 'Dr. Emily Rodriguez',
        trend: 'down',
        trendPercentage: 0
      },
      {
        id: 4,
        title: 'CSS Grid vs Flexbox: When to Use Which',
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        readTime: '10 min',
        publishedAt: '2024-02-01',
        category: 'Web Development',
        author: 'Alex Thompson',
        trend: 'stable',
        trendPercentage: 0
      },
      {
        id: 5,
        title: 'Database Design Best Practices',
        views: 750,
        likes: 45,
        shares: 14,
        comments: 8,
        readTime: '14 min',
        publishedAt: '2024-01-05',
        category: 'Database',
        author: 'David Kim',
        trend: 'up',
        trendPercentage: 12.3
      }
    ],
    trends: {
      views: [
        { date: '2024-01-01', value: 1200 },
        { date: '2024-01-02', value: 1350 },
        { date: '2024-01-03', value: 1100 },
        { date: '2024-01-04', value: 1450 },
        { date: '2024-01-05', value: 1600 },
        { date: '2024-01-06', value: 1400 },
        { date: '2024-01-07', value: 1800 },
        { date: '2024-01-08', value: 1700 },
        { date: '2024-01-09', value: 1900 },
        { date: '2024-01-10', value: 2100 },
        { date: '2024-01-11', value: 2000 },
        { date: '2024-01-12', value: 2200 },
        { date: '2024-01-13', value: 2100 },
        { date: '2024-01-14', value: 2300 },
        { date: '2024-01-15', value: 2500 },
        { date: '2024-01-16', value: 2400 },
        { date: '2024-01-17', value: 2600 },
        { date: '2024-01-18', value: 2500 },
        { date: '2024-01-19', value: 2700 },
        { date: '2024-01-20', value: 2800 },
        { date: '2024-01-21', value: 2900 },
        { date: '2024-01-22', value: 3000 },
        { date: '2024-01-23', value: 3100 },
        { date: '2024-01-24', value: 3200 },
        { date: '2024-01-25', value: 3300 },
        { date: '2024-01-26', value: 3400 },
        { date: '2024-01-27', value: 3500 },
        { date: '2024-01-28', value: 3600 },
        { date: '2024-01-29', value: 3700 },
        { date: '2024-01-30', value: 3800 }
      ],
      engagement: [
        { date: '2024-01-01', likes: 45, shares: 12, comments: 8 },
        { date: '2024-01-02', likes: 52, shares: 15, comments: 10 },
        { date: '2024-01-03', likes: 48, shares: 13, comments: 9 },
        { date: '2024-01-04', likes: 58, shares: 18, comments: 12 },
        { date: '2024-01-05', likes: 62, shares: 20, comments: 14 },
        { date: '2024-01-06', likes: 55, shares: 16, comments: 11 },
        { date: '2024-01-07', likes: 68, shares: 22, comments: 16 },
        { date: '2024-01-08', likes: 65, shares: 21, comments: 15 },
        { date: '2024-01-09', likes: 72, shares: 25, comments: 18 },
        { date: '2024-01-10', likes: 78, shares: 28, comments: 20 },
        { date: '2024-01-11', likes: 75, shares: 26, comments: 19 },
        { date: '2024-01-12', likes: 82, shares: 30, comments: 22 },
        { date: '2024-01-13', likes: 80, shares: 29, comments: 21 },
        { date: '2024-01-14', likes: 85, shares: 32, comments: 24 },
        { date: '2024-01-15', likes: 89, shares: 35, comments: 26 },
        { date: '2024-01-16', likes: 87, shares: 33, comments: 25 },
        { date: '2024-01-17', likes: 92, shares: 37, comments: 28 },
        { date: '2024-01-18', likes: 90, shares: 35, comments: 27 },
        { date: '2024-01-19', likes: 95, shares: 40, comments: 30 },
        { date: '2024-01-20', likes: 98, shares: 42, comments: 32 },
        { date: '2024-01-21', likes: 102, shares: 45, comments: 34 },
        { date: '2024-01-22', likes: 100, shares: 43, comments: 33 },
        { date: '2024-01-23', likes: 105, shares: 47, comments: 36 },
        { date: '2024-01-24', likes: 108, shares: 49, comments: 38 },
        { date: '2024-01-25', likes: 112, shares: 52, comments: 40 },
        { date: '2024-01-26', likes: 110, shares: 50, comments: 39 },
        { date: '2024-01-27', likes: 115, shares: 54, comments: 42 },
        { date: '2024-01-28', likes: 118, shares: 56, comments: 44 },
        { date: '2024-01-29', likes: 120, shares: 58, comments: 46 },
        { date: '2024-01-30', likes: 125, shares: 62, comments: 48 }
      ]
    },
    topCategories: [
      { name: 'Web Development', blogs: 3, views: 8900, engagement: 234 },
      { name: 'Backend Development', blogs: 1, views: 980, engagement: 97 },
      { name: 'Data Science', blogs: 1, views: 0, engagement: 0 },
      { name: 'Database', blogs: 1, views: 750, engagement: 67 }
    ],
    topAuthors: [
      { name: 'Sarah Johnson', blogs: 2, views: 2100, engagement: 156 },
      { name: 'Michael Chen', blogs: 1, views: 980, engagement: 97 },
      { name: 'Dr. Emily Rodriguez', blogs: 1, views: 0, engagement: 0 },
      { name: 'Alex Thompson', blogs: 1, views: 0, engagement: 0 },
      { name: 'David Kim', blogs: 1, views: 750, engagement: 67 }
    ]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
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
            <div className="flex items-center">
              <Link
                href="/admin/blog"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Blogs
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog Analytics</h1>
                <p className="mt-2 text-gray-600">
                  Track performance, engagement, and insights across your blog content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <select
                value={selectedBlog}
                onChange={(e) => setSelectedBlog(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Blogs</option>
                {analyticsData.blogs.map(blog => (
                  <option key={blog.id} value={blog.id}>{blog.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <HeartIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalLikes}</p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ShareIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalShares}</p>
                  <p className="text-sm text-gray-600">Total Shares</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalComments}</p>
                  <p className="text-sm text-gray-600">Total Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgReadTime}</p>
                  <p className="text-sm text-gray-600">Avg. Read Time</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.bounceRate}</p>
                  <p className="text-sm text-gray-600">Bounce Rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <TagIcon className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-lg font-bold text-gray-900">{analyticsData.overview.topCategory}</p>
                  <p className="text-sm text-gray-600">Top Category</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Performance */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Blog Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                          <div className="text-sm text-gray-500">{blog.category} • {blog.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.views.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.likes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.shares}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.comments}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.readTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTrendIcon(blog.trend)}
                          <span className={`ml-1 text-sm ${getTrendColor(blog.trend)}`}>
                            {blog.trendPercentage > 0 ? `+${blog.trendPercentage}%` : `${blog.trendPercentage}%`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Categories and Authors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Categories</h2>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.blogs} blogs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{category.views.toLocaleString()} views</div>
                    <div className="text-sm text-gray-500">{category.engagement} engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Authors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Authors</h2>
            <div className="space-y-4">
              {analyticsData.topAuthors.map((author, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{author.name}</div>
                      <div className="text-sm text-gray-500">{author.blogs} blogs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{author.views.toLocaleString()} views</div>
                    <div className="text-sm text-gray-500">{author.engagement} engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Engagement Trends (Last 30 Days)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analyticsData.trends.engagement[analyticsData.trends.engagement.length - 1].likes}
                </div>
                <div className="text-sm text-gray-600">Likes Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.trends.engagement[analyticsData.trends.engagement.length - 1].shares}
                </div>
                <div className="text-sm text-gray-600">Shares Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analyticsData.trends.engagement[analyticsData.trends.engagement.length - 1].comments}
                </div>
                <div className="text-sm text-gray-600">Comments Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

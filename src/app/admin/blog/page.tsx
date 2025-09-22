'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  PencilSquareIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function BlogManagementPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);

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

  // Mock blog data
  const blogs = [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      subtitle: 'A comprehensive guide to understanding and implementing React Hooks in your applications',
      author: 'Sarah Johnson',
      status: 'published',
      category: 'Web Development',
      tags: ['React', 'JavaScript', 'Hooks'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
      publishedAt: '2024-01-15',
      views: 1250,
      likes: 89,
      shares: 23,
      comments: 15,
      featuredImage: '/api/placeholder/300/200',
      slug: 'getting-started-react-hooks'
    },
    {
      id: 2,
      title: 'Data Science Career Path',
      subtitle: 'Everything you need to know about building a successful career in data science',
      author: 'Dr. Michael Chen',
      status: 'published',
      category: 'Career',
      tags: ['Data Science', 'Career', 'Python'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-14',
      publishedAt: '2024-01-12',
      views: 2100,
      likes: 156,
      shares: 45,
      comments: 28,
      featuredImage: '/api/placeholder/300/200',
      slug: 'data-science-career-path'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      subtitle: 'Essential design principles every developer should know',
      author: 'Alex Thompson',
      status: 'draft',
      category: 'Design',
      tags: ['UI/UX', 'Design', 'Principles'],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
      publishedAt: null,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      featuredImage: '/api/placeholder/300/200',
      slug: 'ui-ux-design-principles'
    },
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      subtitle: 'Understanding the basics of machine learning algorithms',
      author: 'Dr. Michael Chen',
      status: 'scheduled',
      category: 'Data Science',
      tags: ['Machine Learning', 'AI', 'Algorithms'],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22',
      publishedAt: '2024-01-25',
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      featuredImage: '/api/placeholder/300/200',
      slug: 'machine-learning-fundamentals'
    },
    {
      id: 5,
      title: 'Web Development Best Practices',
      subtitle: 'Industry standards and best practices for modern web development',
      author: 'Sarah Johnson',
      status: 'published',
      category: 'Web Development',
      tags: ['Web Development', 'Best Practices', 'Standards'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-11',
      publishedAt: '2024-01-10',
      views: 890,
      likes: 67,
      shares: 18,
      comments: 12,
      featuredImage: '/api/placeholder/300/200',
      slug: 'web-development-best-practices'
    }
  ];

  const authors = ['Sarah Johnson', 'Dr. Michael Chen', 'Alex Thompson'];
  const categories = ['Web Development', 'Data Science', 'Design', 'Career'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    const matchesAuthor = filterAuthor === 'all' || blog.author === filterAuthor;
    
    return matchesSearch && matchesStatus && matchesAuthor;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'draft':
        return <PencilIcon className="h-4 w-4" />;
      case 'scheduled':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const handleSelectBlog = (blogId: number) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(filteredBlogs.map(blog => blog.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedBlogs.length === 0) return;
    
    // Here you would implement the actual bulk action logic
    console.log(`Bulk ${action} for blogs:`, selectedBlogs);
    
    // Reset selection after action
    setSelectedBlogs([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog management...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your blog posts, create content, and track engagement
              </p>
            </div>
            <Link
              href="/admin/blog/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blogs by title, content, or tags..."
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
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Authors</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <PencilSquareIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                  <p className="text-sm text-gray-600">Total Blogs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {blogs.filter(b => b.status === 'published').length}
                  </p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <PencilIcon className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {blogs.filter(b => b.status === 'draft').length}
                  </p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {blogs.reduce((sum, blog) => sum + blog.views, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlogs.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedBlogs.length} blog{selectedBlogs.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('draft')}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Move to Draft
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBlogs.includes(blog.id)}
                        onChange={() => handleSelectBlog(blog.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                          <div className="text-sm text-gray-500">{blog.subtitle}</div>
                          <div className="flex items-center mt-1">
                            {blog.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mr-1">
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                        {getStatusIcon(blog.status)}
                        <span className="ml-1 capitalize">{blog.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {blog.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{blog.views} views</div>
                        <div className="text-gray-500">{blog.likes} likes</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/blog/${blog.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${blog.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <PencilSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first blog post.'}
            </p>
            <Link
              href="/admin/blog/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


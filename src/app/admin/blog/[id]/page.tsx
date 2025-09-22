'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import Link from 'next/link';
import { 
  PencilSquareIcon,
  ArrowLeftIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  ChartBarIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ViewBlogPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState<any>(null);

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

  // Load blog data
  useEffect(() => {
    const loadBlogData = async () => {
      try {
        // Mock blog data - in real app, fetch from API
        const mockBlogData = {
          id: params.id,
          title: 'Getting Started with React Hooks',
          subtitle: 'A comprehensive guide to understanding and implementing React Hooks in your applications',
          content: `# Getting Started with React Hooks

React Hooks revolutionized the way we write React components by allowing us to use state and other React features in functional components.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They were introduced in React 16.8.

## Common Hooks

### useState
The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect
The useEffect hook lets you perform side effects in functional components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Don't call hooks from regular JavaScript functions
3. **Use multiple useState calls** - You can use multiple useState hooks in a single component

## Conclusion

React Hooks provide a powerful and flexible way to manage state and side effects in functional components. They make your code more reusable and easier to test.`,
          author: 'Sarah Johnson',
          category: 'Web Development',
          tags: ['React', 'JavaScript', 'Hooks'],
          featuredImage: '/api/placeholder/800/400',
          status: 'published',
          createdAt: '2024-01-15T10:00:00',
          updatedAt: '2024-01-16T14:30:00',
          publishedAt: '2024-01-15T10:00:00',
          slug: 'getting-started-react-hooks',
          metaTitle: 'Getting Started with React Hooks - Complete Guide',
          metaDescription: 'Learn React Hooks from scratch with this comprehensive guide. Understand useState, useEffect, and other essential hooks with practical examples.',
          ogImage: '/api/placeholder/1200/630',
          analytics: {
            views: 1250,
            likes: 89,
            shares: 23,
            comments: 15,
            readTime: '8 min read'
          }
        };

        setBlogData(mockBlogData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading blog data:', error);
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadBlogData();
    }
  }, [params.id]);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        // Here you would make an API call to delete the blog
        console.log('Deleting blog:', blogData.id);
        
        // Redirect to blog management page
        router.push('/admin/blog');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/admin/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </Link>
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
                <h1 className="text-3xl font-bold text-gray-900">Blog Details</h1>
                <p className="mt-2 text-gray-600">
                  View and manage your blog post
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/blog/${blogData.slug}`}
                target="_blank"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                View Public
              </Link>
              <Link
                href={`/admin/blog/${blogData.id}/edit`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Blog Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(blogData.status)}`}>
                  {blogData.status.charAt(0).toUpperCase() + blogData.status.slice(1)}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Created: {new Date(blogData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Updated: {new Date(blogData.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{blogData.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{blogData.subtitle}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{blogData.author}</span>
                </div>
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  <span>{blogData.category}</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  <span>{blogData.analytics.readTime}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blogData.featuredImage && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <img
                  src={blogData.featuredImage}
                  alt={blogData.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Preview</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {blogData.content.substring(0, 500)}...
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  This is a preview of the first 500 characters. Click "Edit Blog" to see the full content.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.tags.map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EyeIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">{blogData.analytics.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-gray-700">Likes</span>
                  </div>
                  <span className="font-semibold text-gray-900">{blogData.analytics.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShareIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Shares</span>
                  </div>
                  <span className="font-semibold text-gray-900">{blogData.analytics.shares}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Comments</span>
                  </div>
                  <span className="font-semibold text-gray-900">{blogData.analytics.comments}</span>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <p className="text-sm text-gray-600">{blogData.metaTitle || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <p className="text-sm text-gray-600">{blogData.metaDescription || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <p className="text-sm text-gray-600">/blog/{blogData.slug}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/blog/${blogData.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Blog
                </Link>
                <Link
                  href={`/blog/${blogData.slug}`}
                  target="_blank"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  View Public
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Blog
                </button>
              </div>
            </div>

            {/* Blog Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900">{blogData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blogData.status)}`}>
                    {blogData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">{blogData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span className="text-gray-900">{blogData.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{new Date(blogData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-gray-900">{new Date(blogData.updatedAt).toLocaleDateString()}</span>
                </div>
                {blogData.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="text-gray-900">{new Date(blogData.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


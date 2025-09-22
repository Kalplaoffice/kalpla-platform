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
  PhotoIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function EditBlogPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useRoleBasedAccess();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    status: 'draft',
    publishDate: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    ogImage: ''
  });

  const [newTag, setNewTag] = useState('');

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
          category: 'Web Development',
          tags: ['React', 'JavaScript', 'Hooks'],
          featuredImage: '/api/placeholder/300/200',
          status: 'published',
          publishDate: '2024-01-15T10:00:00',
          metaTitle: 'Getting Started with React Hooks - Complete Guide',
          metaDescription: 'Learn React Hooks from scratch with this comprehensive guide. Understand useState, useEffect, and other essential hooks with practical examples.',
          slug: 'getting-started-react-hooks',
          ogImage: '/api/placeholder/1200/630'
        };

        setFormData(mockBlogData);
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

  const categories = ['Web Development', 'Data Science', 'Design', 'Career', 'Technology', 'Business'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (status: string) => {
    const blogData = {
      ...formData,
      status,
      author: user?.firstName + ' ' + user?.lastName || 'Admin',
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : formData.publishDate
    };

    try {
      // Here you would make an API call to update the blog
      console.log('Updating blog:', blogData);
      
      // Redirect to blog management page
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog editor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
                <p className="mt-2 text-gray-600">
                  Update and refine your blog content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update & Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'content'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'seo'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    SEO & Meta
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'settings'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter your blog title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle / Short Description
                      </label>
                      <textarea
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="Brief description of your blog post..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Content</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your blog content here..."
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Use markdown syntax for formatting. You can use **bold**, *italic*, # headings, etc.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        placeholder="SEO title for search engines..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Recommended: 50-60 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        placeholder="Brief description for search engine results..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Recommended: 150-160 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="blog-url-slug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        URL: /blog/{formData.slug}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Open Graph Image URL
                      </label>
                      <input
                        type="url"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/og-image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Image for social media sharing (1200x630px recommended)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Publishing Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                    {formData.status === 'scheduled' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Publish Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          name="publishDate"
                          value={formData.publishDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category and Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  {formData.featuredImage && (
                    <img
                      src={formData.featuredImage}
                      alt={formData.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{formData.title || 'Untitled'}</h2>
                  <p className="text-gray-600 mb-4">{formData.subtitle}</p>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formData.status === 'published' ? 'Published now' : 
                       formData.status === 'scheduled' ? `Scheduled for ${formData.publishDate}` : 'Draft'}
                    </div>
                    {formData.category && (
                      <div className="flex items-center mb-2">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        {formData.category}
                      </div>
                    )}
                    {formData.tags.length > 0 && (
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1" />
                        {formData.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSave('draft')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Update & Publish
                </button>
                {formData.status === 'scheduled' && (
                  <button
                    onClick={() => handleSave('scheduled')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Update Schedule
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { id: 'all', name: 'All Posts', icon: BookOpenIcon },
    { id: 'entrepreneurship', name: 'Entrepreneurship', icon: RocketLaunchIcon },
    { id: 'startup', name: 'Startup', icon: LightBulbIcon },
    { id: 'education', name: 'Education', icon: BookOpenIcon },
    { id: 'technology', name: 'Technology', icon: ChartBarIcon },
    { id: 'business', name: 'Business', icon: ChartBarIcon }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Skills Every Entrepreneur Should Master',
      excerpt: 'Discover the key skills that separate successful entrepreneurs from the rest. From leadership to financial management, learn what it takes to build a thriving business.',
      author: 'Sarah Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-15',
      readTime: '8 min read',
      category: 'entrepreneurship',
      tags: ['entrepreneurship', 'skills', 'leadership'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
      featured: true
    },
    {
      id: 2,
      title: 'Building Your First MVP: A Step-by-Step Guide',
      excerpt: 'Learn how to create a Minimum Viable Product that validates your idea and attracts early customers. Practical tips from successful startup founders.',
      author: 'Mike Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-12',
      readTime: '12 min read',
      category: 'startup',
      tags: ['mvp', 'startup', 'product development'],
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop&crop=center',
      featured: false
    },
    {
      id: 3,
      title: 'The Future of Online Education: Trends to Watch',
      excerpt: 'Explore the latest trends in online education and how they\'re reshaping the learning landscape. From AI-powered learning to micro-credentials.',
      author: 'Dr. Emily Rodriguez',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-10',
      readTime: '6 min read',
      category: 'education',
      tags: ['education', 'technology', 'future'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center',
      featured: false
    },
    {
      id: 4,
      title: 'Funding Your Startup: A Complete Guide to Investment Rounds',
      excerpt: 'Navigate the complex world of startup funding. From seed rounds to Series A, understand what investors look for and how to prepare.',
      author: 'David Park',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-08',
      readTime: '15 min read',
      category: 'startup',
      tags: ['funding', 'investment', 'startup'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center',
      featured: true
    },
    {
      id: 5,
      title: 'Digital Marketing Strategies for Small Businesses',
      excerpt: 'Cost-effective digital marketing strategies that actually work. Learn how to reach your target audience without breaking the bank.',
      author: 'Lisa Wang',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-05',
      readTime: '10 min read',
      category: 'business',
      tags: ['marketing', 'digital', 'small business'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
      featured: false
    },
    {
      id: 6,
      title: 'The Role of AI in Modern Business Operations',
      excerpt: 'How artificial intelligence is transforming business operations across industries. Real-world examples and implementation strategies.',
      author: 'Alex Thompson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      publishDate: '2024-01-03',
      readTime: '9 min read',
      category: 'technology',
      tags: ['AI', 'technology', 'business'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center',
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    } else if (sortBy === 'popular') {
      // Mock popularity based on featured status and read time
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    return 0;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = sortedPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Kalpla Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tips, and stories from entrepreneurs, educators, and industry experts. 
              Stay updated with the latest trends in education, entrepreneurship, and technology.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blog posts..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(post.publishDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        Read More
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-400 to-gray-600 relative">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      Read More
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Our Latest Posts
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get notified when we publish new articles about entrepreneurship, education, and technology.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-r-lg font-semibold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

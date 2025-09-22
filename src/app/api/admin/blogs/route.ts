import { NextRequest, NextResponse } from 'next/server';

// Mock blog data - in a real application, this would come from a database
let blogs = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    subtitle: 'A comprehensive guide to understanding and implementing React Hooks in your applications',
    content: '# Getting Started with React Hooks\n\nReact Hooks revolutionized the way we write React components...',
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
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Node.js',
    subtitle: 'Best practices for creating robust and scalable REST APIs using Node.js and Express',
    content: '# Building Scalable APIs with Node.js\n\nCreating scalable APIs is crucial for modern applications...',
    author: 'Michael Chen',
    category: 'Backend Development',
    tags: ['Node.js', 'Express', 'API', 'REST'],
    featuredImage: '/api/placeholder/800/400',
    status: 'published',
    createdAt: '2024-01-10T09:00:00',
    updatedAt: '2024-01-12T16:45:00',
    publishedAt: '2024-01-10T09:00:00',
    slug: 'building-scalable-apis-nodejs',
    metaTitle: 'Building Scalable APIs with Node.js - Complete Tutorial',
    metaDescription: 'Learn how to build scalable and robust REST APIs using Node.js and Express with best practices and real-world examples.',
    ogImage: '/api/placeholder/1200/630',
    analytics: {
      views: 980,
      likes: 67,
      shares: 18,
      comments: 12,
      readTime: '12 min read'
    }
  },
  {
    id: '3',
    title: 'Introduction to Machine Learning',
    subtitle: 'A beginner-friendly guide to understanding machine learning concepts and applications',
    content: '# Introduction to Machine Learning\n\nMachine Learning is transforming industries across the globe...',
    author: 'Dr. Emily Rodriguez',
    category: 'Data Science',
    tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
    featuredImage: '/api/placeholder/800/400',
    status: 'draft',
    createdAt: '2024-01-20T11:00:00',
    updatedAt: '2024-01-22T13:20:00',
    publishedAt: null,
    slug: 'introduction-machine-learning',
    metaTitle: 'Introduction to Machine Learning - Beginner Guide',
    metaDescription: 'Start your machine learning journey with this comprehensive beginner guide covering key concepts, algorithms, and practical applications.',
    ogImage: '/api/placeholder/1200/630',
    analytics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      readTime: '15 min read'
    }
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    subtitle: 'A detailed comparison of CSS Grid and Flexbox to help you choose the right layout method',
    content: '# CSS Grid vs Flexbox: When to Use Which\n\nBoth CSS Grid and Flexbox are powerful layout tools...',
    author: 'Alex Thompson',
    category: 'Web Development',
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
    featuredImage: '/api/placeholder/800/400',
    status: 'scheduled',
    createdAt: '2024-01-25T14:00:00',
    updatedAt: '2024-01-26T10:15:00',
    publishedAt: '2024-02-01T09:00:00',
    slug: 'css-grid-vs-flexbox-comparison',
    metaTitle: 'CSS Grid vs Flexbox: Complete Comparison Guide',
    metaDescription: 'Learn when to use CSS Grid vs Flexbox with practical examples and best practices for modern web layouts.',
    ogImage: '/api/placeholder/1200/630',
    analytics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      readTime: '10 min read'
    }
  },
  {
    id: '5',
    title: 'Database Design Best Practices',
    subtitle: 'Essential principles for designing efficient and maintainable database schemas',
    content: '# Database Design Best Practices\n\nGood database design is the foundation of any successful application...',
    author: 'David Kim',
    category: 'Database',
    tags: ['Database', 'SQL', 'Design', 'Performance'],
    featuredImage: '/api/placeholder/800/400',
    status: 'published',
    createdAt: '2024-01-05T08:00:00',
    updatedAt: '2024-01-08T12:30:00',
    publishedAt: '2024-01-05T08:00:00',
    slug: 'database-design-best-practices',
    metaTitle: 'Database Design Best Practices - Complete Guide',
    metaDescription: 'Master database design with these essential best practices for creating efficient, scalable, and maintainable database schemas.',
    ogImage: '/api/placeholder/1200/630',
    analytics: {
      views: 750,
      likes: 45,
      shares: 14,
      comments: 8,
      readTime: '14 min read'
    }
  }
];

// GET /api/admin/blogs - Fetch all blogs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredBlogs = [...blogs];

    // Apply filters
    if (status) {
      filteredBlogs = filteredBlogs.filter(blog => blog.status === status);
    }

    if (category) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (author) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (search) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by updated date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalPages = Math.ceil(filteredBlogs.length / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: paginatedBlogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredBlogs.length,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        status,
        category,
        author,
        search
      }
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'content', 'author', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate new blog data
    const newBlog = {
      id: (blogs.length + 1).toString(),
      title: body.title,
      subtitle: body.subtitle,
      content: body.content,
      author: body.author,
      category: body.category,
      tags: body.tags || [],
      featuredImage: body.featuredImage || '/api/placeholder/800/400',
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: body.status === 'published' ? new Date().toISOString() : body.publishedAt || null,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || body.subtitle,
      ogImage: body.ogImage || '/api/placeholder/1200/630',
      analytics: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        readTime: body.readTime || '5 min read'
      }
    };

    // Add to blogs array
    blogs.push(newBlog);

    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog created successfully'
    });

  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs - Bulk update blogs
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, blogIds } = body;

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. Action and blogIds are required.' },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    switch (action) {
      case 'publish':
        blogs = blogs.map(blog => {
          if (blogIds.includes(blog.id)) {
            updatedCount++;
            return {
              ...blog,
              status: 'published',
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return blog;
        });
        break;

      case 'draft':
        blogs = blogs.map(blog => {
          if (blogIds.includes(blog.id)) {
            updatedCount++;
            return {
              ...blog,
              status: 'draft',
              publishedAt: null,
              updatedAt: new Date().toISOString()
            };
          }
          return blog;
        });
        break;

      case 'delete':
        blogs = blogs.filter(blog => !blogIds.includes(blog.id));
        updatedCount = blogIds.length;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Supported actions: publish, draft, delete' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${updatedCount} blog(s)`,
      updatedCount
    });

  } catch (error) {
    console.error('Error updating blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blogs' },
      { status: 500 }
    );
  }
}


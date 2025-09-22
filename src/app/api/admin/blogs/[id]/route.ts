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

// GET /api/admin/blogs/[id] - Fetch a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = blogs.find(b => b.id === params.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id] - Update a blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const blogIndex = blogs.findIndex(b => b.id === params.id);

    if (blogIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update the blog
    const updatedBlog = {
      ...blogs[blogIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      // Update publishedAt if status changed to published
      publishedAt: body.status === 'published' && blogs[blogIndex].status !== 'published' 
        ? new Date().toISOString() 
        : blogs[blogIndex].publishedAt
    };

    blogs[blogIndex] = updatedBlog;

    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully'
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[id] - Delete a blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogIndex = blogs.findIndex(b => b.id === params.id);

    if (blogIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Remove the blog
    const deletedBlog = blogs[blogIndex];
    blogs.splice(blogIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedBlog,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}


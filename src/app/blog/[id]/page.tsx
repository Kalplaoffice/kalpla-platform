'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);

  // Mock blog post data
  const blogPost = {
    id: params.id,
    title: '10 Essential Skills Every Entrepreneur Should Master',
    content: `
      <p>Starting a business is one of the most challenging yet rewarding endeavors you can undertake. While there's no single formula for success, there are certain skills that successful entrepreneurs consistently demonstrate. In this comprehensive guide, we'll explore the 10 essential skills every entrepreneur should master to build a thriving business.</p>

      <h2>1. Leadership and Team Management</h2>
      <p>Great entrepreneurs are great leaders. They know how to inspire, motivate, and guide their teams toward a common vision. Leadership isn't just about giving orders—it's about:</p>
      <ul>
        <li>Setting clear goals and expectations</li>
        <li>Providing constructive feedback</li>
        <li>Leading by example</li>
        <li>Building trust and respect</li>
        <li>Delegating effectively</li>
      </ul>

      <h2>2. Financial Management</h2>
      <p>Understanding your business's financial health is crucial for making informed decisions. This includes:</p>
      <ul>
        <li>Reading and interpreting financial statements</li>
        <li>Managing cash flow</li>
        <li>Budgeting and forecasting</li>
        <li>Understanding key financial metrics</li>
        <li>Making data-driven financial decisions</li>
      </ul>

      <h2>3. Strategic Thinking</h2>
      <p>Entrepreneurs must be able to see the big picture and plan for the future. Strategic thinking involves:</p>
      <ul>
        <li>Analyzing market trends and opportunities</li>
        <li>Developing long-term business strategies</li>
        <li>Anticipating challenges and opportunities</li>
        <li>Making decisions that align with business goals</li>
        <li>Adapting strategies based on changing circumstances</li>
      </ul>

      <h2>4. Communication Skills</h2>
      <p>Effective communication is essential for building relationships with customers, employees, investors, and partners. This includes:</p>
      <ul>
        <li>Public speaking and presentations</li>
        <li>Written communication</li>
        <li>Active listening</li>
        <li>Negotiation skills</li>
        <li>Conflict resolution</li>
      </ul>

      <h2>5. Marketing and Sales</h2>
      <p>No business can succeed without customers. Entrepreneurs need to understand:</p>
      <ul>
        <li>Market research and customer analysis</li>
        <li>Brand building and positioning</li>
        <li>Digital marketing strategies</li>
        <li>Sales techniques and processes</li>
        <li>Customer relationship management</li>
      </ul>

      <h2>6. Problem-Solving and Critical Thinking</h2>
      <p>Running a business involves solving problems daily. Successful entrepreneurs:</p>
      <ul>
        <li>Think creatively and outside the box</li>
        <li>Analyze problems systematically</li>
        <li>Generate multiple solutions</li>
        <li>Make decisions under pressure</li>
        <li>Learn from failures and mistakes</li>
      </ul>

      <h2>7. Time Management and Productivity</h2>
      <p>Entrepreneurs often wear multiple hats and must manage their time effectively:</p>
      <ul>
        <li>Prioritizing tasks and activities</li>
        <li>Setting realistic goals and deadlines</li>
        <li>Delegating when appropriate</li>
        <li>Using productivity tools and techniques</li>
        <li>Maintaining work-life balance</li>
      </ul>

      <h2>8. Networking and Relationship Building</h2>
      <p>Building a strong network is crucial for business success:</p>
      <ul>
        <li>Attending industry events and conferences</li>
        <li>Building relationships with mentors</li>
        <li>Connecting with potential customers and partners</li>
        <li>Maintaining professional relationships</li>
        <li>Giving back to the community</li>
      </ul>

      <h2>9. Adaptability and Resilience</h2>
      <p>The business world is constantly changing, and entrepreneurs must be able to adapt:</p>
      <ul>
        <li>Embracing change and uncertainty</li>
        <li>Learning from failures and setbacks</li>
        <li>Staying positive during difficult times</li>
        <li>Being open to new ideas and approaches</li>
        <li>Maintaining persistence and determination</li>
      </ul>

      <h2>10. Continuous Learning</h2>
      <p>Successful entrepreneurs never stop learning:</p>
      <ul>
        <li>Staying updated with industry trends</li>
        <li>Seeking feedback and advice</li>
        <li>Investing in personal development</li>
        <li>Learning from competitors</li>
        <li>Embracing new technologies and tools</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Mastering these 10 essential skills won't guarantee success, but they will significantly increase your chances of building a thriving business. Remember that entrepreneurship is a journey, and these skills can be developed over time through practice, experience, and continuous learning.</p>

      <p>Start by identifying which skills you need to work on most, and create a plan to develop them. Consider taking courses, finding mentors, or joining entrepreneur communities to accelerate your learning.</p>

      <p>What skills do you think are most important for entrepreneurs? Share your thoughts in the comments below!</p>
    `,
    author: 'Sarah Johnson',
    authorBio: 'Sarah is a serial entrepreneur and business coach with over 15 years of experience helping startups scale. She has founded three successful companies and is passionate about sharing her knowledge with aspiring entrepreneurs.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'entrepreneurship',
    tags: ['entrepreneurship', 'skills', 'leadership', 'business'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
    views: 1250,
    likes: likes,
    comments: 23
  };

  const relatedPosts = [
    {
      id: 2,
      title: 'Building Your First MVP: A Step-by-Step Guide',
      author: 'Mike Chen',
      publishDate: '2024-01-12',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Funding Your Startup: A Complete Guide to Investment Rounds',
      author: 'David Park',
      publishDate: '2024-01-08',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Digital Marketing Strategies for Small Businesses',
      author: 'Lisa Wang',
      publishDate: '2024-01-05',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&crop=center'
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Blog
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                Entrepreneurship
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {blogPost.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                {blogPost.author}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {new Date(blogPost.publishDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                {blogPost.readTime}
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-5 w-5 mr-2" />
                {blogPost.views} views
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 mb-4">
            <TagIcon className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  About {blogPost.author}
                </h3>
                <p className="text-gray-600 mb-4">
                  {blogPost.authorBio}
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Follow {blogPost.author}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-2 mb-8">
            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-500" />
            <h3 className="text-2xl font-bold text-gray-900">
              Comments ({blogPost.comments})
            </h3>
          </div>
          
          {/* Comment Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <textarea
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Post Comment
              </button>
            </div>
          </div>

          {/* Sample Comments */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">John Smith</span>
                    <span className="text-gray-500 text-sm">2 days ago</span>
                  </div>
                  <p className="text-gray-700">
                    Great article! I especially found the section on financial management very helpful. 
                    As a new entrepreneur, I struggle with understanding cash flow. Do you have any 
                    recommendations for tools to help track this?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">Maria Garcia</span>
                    <span className="text-gray-500 text-sm">1 week ago</span>
                  </div>
                  <p className="text-gray-700">
                    Excellent breakdown of essential skills! I've been working on improving my 
                    networking skills, and your tips about attending industry events have been 
                    game-changing for my business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-400 to-gray-600 relative">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
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
                    className="block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

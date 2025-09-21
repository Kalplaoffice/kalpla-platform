'use client';

import Link from 'next/link';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  RocketLaunchIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const ksmpPhases = [
    {
      phase: 1,
      title: 'Business Ideation',
      duration: 'Month 1',
      description: 'Develop and validate your startup idea',
      topics: ['Idea Generation', 'Problem Validation', 'Market Research', 'Competitive Analysis']
    },
    {
      phase: 2,
      title: 'Market Research',
      duration: 'Month 2',
      description: 'Deep dive into market analysis and customer insights',
      topics: ['Customer Personas', 'Market Sizing', 'User Interviews', 'Market Trends']
    },
    {
      phase: 3,
      title: 'Business Model Design',
      duration: 'Month 3',
      description: 'Create and refine your business model canvas',
      topics: ['Business Model Canvas', 'Value Proposition', 'Revenue Streams', 'Cost Structure']
    },
    {
      phase: 4,
      title: 'Product Development',
      duration: 'Month 4',
      description: 'Build and test your minimum viable product',
      topics: ['MVP Development', 'Prototyping', 'User Testing', 'Product Iteration']
    },
    {
      phase: 5,
      title: 'Go-to-Market Strategy',
      duration: 'Month 5',
      description: 'Develop comprehensive marketing and sales strategies',
      topics: ['Marketing Strategy', 'Sales Funnel', 'Brand Positioning', 'Customer Acquisition']
    },
    {
      phase: 6,
      title: 'Financial Planning',
      duration: 'Month 6',
      description: 'Create financial models and funding strategies',
      topics: ['Financial Modeling', 'Funding Strategy', 'Pitch Deck', 'Investor Relations']
    },
    {
      phase: 7,
      title: 'Legal & Compliance',
      duration: 'Month 7',
      description: 'Navigate legal requirements and business compliance',
      topics: ['Legal Structure', 'Intellectual Property', 'Regulatory Compliance', 'Contracts']
    },
    {
      phase: 8,
      title: 'Operations & Scaling',
      duration: 'Month 8',
      description: 'Build operational processes and scaling strategies',
      topics: ['Operations Management', 'Team Building', 'Process Optimization', 'Scaling Strategy']
    },
    {
      phase: 9,
      title: 'Technology & Innovation',
      duration: 'Month 9',
      description: 'Leverage technology for competitive advantage',
      topics: ['Technology Stack', 'Digital Transformation', 'Innovation Management', 'Tech Trends']
    },
    {
      phase: 10,
      title: 'Leadership & Management',
      duration: 'Month 10',
      description: 'Develop leadership skills and management capabilities',
      topics: ['Leadership Development', 'Team Management', 'Strategic Planning', 'Decision Making']
    },
    {
      phase: 11,
      title: 'Growth & Expansion',
      duration: 'Month 11',
      description: 'Plan and execute growth strategies',
      topics: ['Growth Strategies', 'Market Expansion', 'Partnership Development', 'International Markets']
    },
    {
      phase: 12,
      title: 'Demo Day & Pitching',
      duration: 'Month 12',
      description: 'Present your startup to investors and stakeholders',
      topics: ['Pitch Preparation', 'Demo Day', 'Investor Presentations', 'Networking']
    }
  ];

  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Startup Advisor & Former CEO',
      expertise: 'Business Strategy, Fundraising',
      experience: '15+ years',
      image: '/api/placeholder/150/150',
      ksmpPhases: [1, 2, 3]
    },
    {
      name: 'Michael Chen',
      role: 'Tech Entrepreneur & Investor',
      expertise: 'Product Development, Technology',
      experience: '12+ years',
      image: '/api/placeholder/150/150',
      ksmpPhases: [4, 5, 6]
    },
    {
      name: 'Priya Sharma',
      role: 'Marketing Expert & Growth Hacker',
      expertise: 'Marketing, Customer Acquisition',
      experience: '10+ years',
      image: '/api/placeholder/150/150',
      ksmpPhases: [7, 8, 9]
    },
    {
      name: 'David Rodriguez',
      role: 'Legal Counsel & Compliance Expert',
      expertise: 'Legal, Compliance, IP',
      experience: '18+ years',
      image: '/api/placeholder/150/150',
      ksmpPhases: [10, 11, 12]
    }
  ];

  const stats = [
    { name: 'KSMP Graduates', value: '500+' },
    { name: 'Startups Funded', value: '150+' },
    { name: 'Total Funding Raised', value: '$50M+' },
    { name: 'Success Rate', value: '85%' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-yellow-300">Kalpla</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Empowering the next generation of entrepreneurs through comprehensive education, 
              mentorship, and startup incubation programs.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Kalpla, we believe that education is the foundation of innovation and entrepreneurship. 
                Our mission is to democratize access to high-quality education and mentorship, 
                enabling aspiring entrepreneurs to turn their ideas into successful businesses.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Through our comprehensive platform, we provide structured learning paths, 
                expert mentorship, and practical tools that help students and entrepreneurs 
                navigate the complex journey from idea to market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/ksmp"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Join KSMP Program
                </Link>
                <Link
                  href="/courses"
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Excellence</h4>
                    <p className="text-gray-600">Delivering the highest quality education and mentorship</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Innovation</h4>
                    <p className="text-gray-600">Embracing new technologies and teaching methods</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Accessibility</h4>
                    <p className="text-gray-600">Making quality education accessible to everyone</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Community</h4>
                    <p className="text-gray-600">Building a supportive learning community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KSMP Program Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kalpla Startup Mentorship Program (KSMP)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive 12-month program designed to transform your startup idea into a successful business
            </p>
          </div>

          {/* KSMP Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>

          {/* KSMP Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ksmpPhases.map((phase) => (
              <div key={phase.phase} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                    {phase.phase}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    <p className="text-sm text-gray-600">{phase.duration}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{phase.description}</p>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Topics:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {phase.topics.map((topic, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 text-green-500 mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Expert Mentors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from industry veterans and successful entrepreneurs who have been there and done that
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor) => (
              <div key={mentor.name} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserGroupIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{mentor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{mentor.role}</p>
                <p className="text-sm text-blue-600 mb-2">{mentor.expertise}</p>
                <p className="text-xs text-gray-500 mb-4">{mentor.experience}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">KSMP Phases:</span> {mentor.ksmpPhases.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/mentors"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Mentors
            </Link>
          </div>
        </div>
      </div>

      {/* Program Benefits */}
      <div className="bg-blue-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Kalpla?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our comprehensive approach combines education, mentorship, and practical experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Structured Learning</h3>
              <p className="text-blue-100">
                Follow a proven curriculum designed by industry experts and successful entrepreneurs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Expert Mentorship</h3>
              <p className="text-blue-100">
                Get personalized guidance from mentors who have built successful companies
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Practical Experience</h3>
              <p className="text-blue-100">
                Apply what you learn through real-world projects and startup challenges
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Community Support</h3>
              <p className="text-blue-100">
                Connect with like-minded entrepreneurs and build lasting professional relationships
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Proven Results</h3>
              <p className="text-blue-100">
                Join hundreds of successful graduates who have launched their startups
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <LightBulbIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Innovation Focus</h3>
              <p className="text-blue-100">
                Stay ahead with cutting-edge technologies and emerging market trends
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Entrepreneurial Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of aspiring entrepreneurs who have transformed their ideas into successful businesses with Kalpla
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply to KSMP
            </Link>
            <Link
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

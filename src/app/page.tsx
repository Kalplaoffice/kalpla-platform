'use client';

import Link from 'next/link';
import Image from 'next/image';
import iso9001 from '@/assets/images/iso-9001.svg';
import iso45001 from '@/assets/images/iso-45001.svg';
import iso27001 from '@/assets/images/iso-27001.svg';
import iso21001 from '@/assets/images/iso-21001.svg';
import LeadersSection from '@/components/LeadersSection';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  PlayIcon,
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CalendarIcon,
  DocumentTextIcon,
  SparklesIcon,
  FireIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import kalplaLogoWhite from '@/assets/images/kalpla-logo-white.svg';

export default function Home() {
  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'John Doe',
      price: 99,
      duration: '40 hours',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center',
      rating: 4.8,
      students: 1250
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      instructor: 'Jane Smith',
      price: 79,
      duration: '25 hours',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
      rating: 4.7,
      students: 890
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      price: 129,
      duration: '35 hours',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop&crop=center',
      rating: 4.9,
      students: 2100
    }
  ];

      const degreePrograms = [
        {
          id: 1,
          title: 'Bachelor of Technology in Computer Science',
          duration: '4 years',
          credits: '120 credits',
          description: 'Comprehensive computer science program with industry partnerships',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
          price: 25000,
          level: 'Undergraduate',
          rating: 4.8,
          students: 1250,
          category: 'Technology'
        },
        {
          id: 2,
          title: 'Master of Business Administration',
          duration: '2 years',
          credits: '60 credits',
          description: 'Advanced business management with focus on entrepreneurship',
          thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
          price: 35000,
          level: 'Graduate',
          rating: 4.9,
          students: 890,
          category: 'Business'
        },
        {
          id: 3,
          title: 'Diploma in Digital Marketing',
          duration: '1 year',
          credits: '30 credits',
          description: 'Practical digital marketing skills for modern businesses',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
          price: 12000,
          level: 'Diploma',
          rating: 4.7,
          students: 2100,
          category: 'Marketing'
        }
      ];

  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      expertise: 'Business Strategy',
      company: 'TechInnovate Inc.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      experience: '15+ years',
      rating: 4.9,
      students: 1200,
      achievements: ['Ex-Google', 'Y Combinator Alum', 'Forbes 30 Under 30'],
      specialties: ['Startup Strategy', 'Product-Market Fit', 'Scaling Operations']
    },
    {
      name: 'Michael Chen',
      expertise: 'Product Development',
      company: 'GrowthCorp',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '12+ years',
      rating: 4.8,
      students: 950,
      achievements: ['Ex-Meta', 'Serial Entrepreneur', 'TechCrunch Featured'],
      specialties: ['Product Design', 'User Experience', 'Growth Hacking']
    },
    {
      name: 'Lisa Rodriguez',
      expertise: 'Finance & Investment',
      company: 'VentureCapital Partners',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      experience: '18+ years',
      rating: 4.9,
      students: 800,
      achievements: ['Ex-Goldman Sachs', 'Angel Investor', 'Board Member'],
      specialties: ['Fundraising', 'Financial Modeling', 'Investment Strategy']
    },
    {
      name: 'David Kim',
      expertise: 'Technology',
      company: 'CloudTech Solutions',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      experience: '20+ years',
      rating: 4.7,
      students: 1100,
      achievements: ['Ex-Microsoft', 'Open Source Contributor', 'Tech Speaker'],
      specialties: ['Cloud Architecture', 'AI/ML', 'DevOps']
    }
  ];

  const isoCertifications = [
    {
      id: 1,
      name: 'ISO 9001:2015',
      title: 'Quality Management System',
      description: 'Ensures consistent quality in our educational services and processes',
      image: iso9001,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      name: 'ISO 45001:2018',
      title: 'Occupational Health & Safety',
      description: 'Committed to maintaining safe and healthy learning environments',
      image: iso45001,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 3,
      name: 'ISO 27001:2013',
      title: 'Information Security Management',
      description: 'Protecting student data and maintaining highest security standards',
      image: iso27001,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 4,
      name: 'ISO 21001:2018',
      title: 'Educational Organizations Management',
      description: 'Specialized standard for educational institutions and learning providers',
      image: iso21001,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ];

  const featuredStartups = [
    {
      name: 'HealthTech Solutions',
      sector: 'Healthcare',
      funding: '₹20.8Cr',
      description: 'AI-powered diagnostic platform'
    },
    {
      name: 'FinFlow',
      sector: 'Fintech',
      funding: '₹1Cr',
      description: 'Blockchain-based payment processing'
    },
    {
      name: 'EduAI',
      sector: 'EdTech',
      funding: '₹41.7L',
      description: 'Personalized learning platform'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Learn',
      description: 'Access comprehensive courses and degree programs',
      icon: BookOpenIcon
    },
    {
      step: 2,
      title: 'Practice',
      description: 'Apply knowledge through hands-on projects and assignments',
      icon: PlayIcon
    },
    {
      step: 3,
      title: 'Get Mentored',
      description: 'Receive guidance from industry experts and successful entrepreneurs',
      icon: UserGroupIcon
    }
  ];

  const testimonials = [
    {
      quote: "Kalpla's KSMP program transformed my startup idea into a successful business. The mentorship was invaluable.",
      author: "Sarah Williams",
      role: "CEO, TechStart Inc.",
      image: '/api/placeholder/100/100'
    },
    {
      quote: "The structured learning approach and expert mentors helped me scale my business from ₹0 to ₹8.3Cr ARR.",
      author: "Michael Chen",
      role: "Founder, GrowthCorp",
      image: '/api/placeholder/100/100'
    }
  ];

  const whyKalpla = [
    {
      title: 'Structured Grading System',
      description: 'Comprehensive evaluation with detailed feedback',
      icon: ChartBarIcon
    },
    {
      title: 'Live + Recorded Classes',
      description: 'Flexible learning with both live sessions and on-demand content',
      icon: PlayIcon
    },
    {
      title: 'Global Mentors',
      description: 'Access to industry experts from around the world',
      icon: GlobeAltIcon
    },
    {
      title: 'Secure Payments',
      description: 'Safe transactions with PayU integration and AWS security',
      icon: ShieldCheckIcon
    }
  ];

  const blogPosts = [
    {
      title: '10 Essential Skills for Modern Entrepreneurs',
      excerpt: 'Discover the key competencies every startup founder needs to succeed in today\'s competitive market.',
      date: 'March 15, 2024',
      readTime: '5 min read',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Building a Successful Startup Team',
      excerpt: 'Learn how to recruit, manage, and retain top talent for your growing company.',
      date: 'March 12, 2024',
      readTime: '7 min read',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Funding Strategies for Early-Stage Startups',
      excerpt: 'Explore different funding options and how to prepare for investor meetings.',
      date: 'March 10, 2024',
      readTime: '6 min read',
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-20 right-10 animate-float">
            <SparklesIcon className="h-8 w-8 text-yellow-300 opacity-60" />
          </div>
          <div className="absolute top-40 left-20 animate-float-delayed">
            <RocketLaunchIcon className="h-6 w-6 text-white opacity-60" />
          </div>
          <div className="absolute bottom-40 right-20 animate-float-slow">
            <LightBulbIcon className="h-7 w-7 text-yellow-300 opacity-60" />
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <Image
                src={kalplaLogoWhite}
                alt="Kalpla Logo"
                width={200}
                height={60}
                className="h-12 w-auto mx-auto"
              />
            </div>
            
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
              <FireIcon className="h-4 w-4 mr-2 text-yellow-300" />
              Join 10,000+ Successful Entrepreneurs
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Learn, Build, and Scale with{' '}
              <span className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-gradient">
                Kalpla
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delayed">
              Courses • Mentorship • Startup Programs
            </p>
            
            {/* Interactive Stats */}
            <div className="flex justify-center space-x-8 mb-8 animate-fade-in-delayed-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-blue-200">Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-blue-200">Success Rate</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delayed">
              <Link
                href="/courses"
                className="group bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center">
                  Explore Courses
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/ksmp"
                className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center">
                  Join KSMP
                  <RocketLaunchIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Preview */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 transform rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-4">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Most Popular
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Discover our most popular courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                      {course.rating} ⭐
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      Best Seller
                    </div>
                  </div>
                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                      {course.rating} ({course.students} students)
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">${course.price}</div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/courses"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center"
            >
              View All Courses
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Degree Programs */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-600 to-purple-600 transform -rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm font-medium mb-4">
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Accredited Programs
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry-Relevant Online Degree Programs</h2>
            <p className="text-xl text-gray-600">Structured programs designed by industry experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {degreePrograms.map((program, index) => (
              <div 
                key={program.id} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Program Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                      {program.rating} ⭐
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {program.level}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {program.category}
                    </div>
                  </div>
                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {program.title}
                    </h3>
                    <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(program.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {program.rating} ({program.students} students)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      {program.credits}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${program.price.toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/programs/${program.id}`}
                        className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm"
                      >
                        Learn More
                      </Link>
                      <button
                        onClick={() => {
                          // TODO: Open enrollment modal
                          console.log('Enroll in program:', program.id);
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/programs"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center"
            >
              View All Programs
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* KSMP Section */}
      <div className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
              <RocketLaunchIcon className="h-4 w-4 mr-2" />
              Limited Spots Available
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kalpla Startup Mentorship Program (12 months)</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your startup idea into a successful business with our comprehensive mentorship program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CalendarIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">12 Phases</h3>
              <p className="text-gray-600">Structured learning path from ideation to scaling</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="group text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">12 Mentors</h3>
              <p className="text-gray-600">Expert guidance from industry leaders</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
            <div className="group text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Assignments</h3>
              <p className="text-gray-600">Hands-on projects and deliverables</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/ksmp"
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center"
            >
              Apply Now
              <RocketLaunchIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mentors */}
      <div className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 transform rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
              <UsersIcon className="h-4 w-4 mr-2" />
              Expert Mentors
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Mentors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from industry veterans and successful entrepreneurs who have been there and done that
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {mentors.map((mentor, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Mentor Header */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Profile Image */}
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      {mentor.rating}
                    </div>
                  </div>
                </div>

                {/* Mentor Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {mentor.name}
                  </h3>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-purple-600 mb-1">{mentor.expertise}</p>
                    <p className="text-xs text-gray-600 mb-1">{mentor.company}</p>
                    <p className="text-xs text-gray-500">{mentor.experience} • {mentor.students} students</p>
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {mentor.achievements.slice(0, 2).map((achievement, idx) => (
                        <span 
                          key={idx}
                          className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href={`/mentors/${mentor.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/mentors"
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center"
            >
              Meet All Mentors
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Investors */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Startups</h2>
            <p className="text-xl text-gray-600">Discover investment opportunities from our network</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredStartups.map((startup, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{startup.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{startup.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{startup.sector}</span>
                  <span className="font-medium text-green-600">{startup.funding}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div>
              <Link
                href="/investors"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
              >
                View Demo Day
              </Link>
              <Link
                href="/investors/apply"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Join Investors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to transform your career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our successful graduates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Kalpla */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Kalpla?</h2>
            <p className="text-xl text-gray-600">Comprehensive features for your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyKalpla.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog/Resources */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Resources</h2>
            <p className="text-xl text-gray-600">Stay updated with industry insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>

      {/* ISO Certifications */}
      <div className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-600 to-purple-600 transform -rotate-12 scale-150"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-4">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Quality Certifications
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Internationally Recognized ISO Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kalpla is certified by leading international standards, ensuring the highest quality in education and operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {isoCertifications.map((cert, index) => (
              <div 
                key={cert.id} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Certification Header */}
                <div className={`bg-gradient-to-br ${cert.color} p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* ISO Image */}
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-white/90 backdrop-blur-sm border-4 border-white/20 shadow-lg flex items-center justify-center p-2">
                      <Image 
                        src={cert.image} 
                        alt={`${cert.name} certification`}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Certification Number */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold">
                      {cert.name}
                    </div>
                  </div>
                </div>

                {/* Certification Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {cert.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Certification Status */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs font-medium text-gray-600">Certified</span>
                      </div>
                      <div className={`px-3 py-1 ${cert.bgColor} ${cert.textColor} rounded-full text-xs font-semibold`}>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-8 text-gray-600">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-sm font-medium">Audited Annually</span>
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-500" />
                <span className="text-sm font-medium">International Standards</span>
              </div>
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Compliance Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaders Section */}
      <LeadersSection />

      {/* CTA Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Floating Success Icons */}
          <div className="absolute top-20 right-10 animate-float">
            <TrophyIcon className="h-8 w-8 text-yellow-300 opacity-60" />
          </div>
          <div className="absolute top-40 left-20 animate-float-delayed">
            <RocketLaunchIcon className="h-6 w-6 text-white opacity-60" />
          </div>
          <div className="absolute bottom-40 right-20 animate-float-slow">
            <SparklesIcon className="h-7 w-7 text-yellow-300 opacity-60" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
            <FireIcon className="h-4 w-4 mr-2 text-yellow-300" />
            Limited Time: Early Bird Discount Available
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Ready to Build Your Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delayed">
            Join thousands of entrepreneurs who have transformed their ideas into successful businesses
          </p>
          
          {/* Interactive Stats */}
          <div className="flex justify-center space-x-8 mb-8 animate-fade-in-delayed-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₹416Cr+</div>
              <div className="text-sm text-blue-200">Funding Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-sm text-blue-200">Startups Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">85%</div>
              <div className="text-sm text-blue-200">Success Rate</div>
            </div>
          </div>
          
          <div className="animate-slide-up-delayed">
            <Link
              href="/ksmp/apply"
              className="group bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center"
            >
              Apply for KSMP Today
              <RocketLaunchIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 flex justify-center items-center space-x-6 text-blue-200 animate-fade-in-delayed-2">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Secure Application</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Quick Response</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Expert Mentors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

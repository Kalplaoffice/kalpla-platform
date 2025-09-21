'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');

  const categories = [
    'All',
    'Computer Science',
    'Business Administration',
    'Data Science',
    'Digital Marketing',
    'Software Engineering',
    'Project Management',
    'Cybersecurity',
    'Artificial Intelligence'
  ];

  const durations = [
    'All',
    '6 months',
    '12 months',
    '18 months',
    '24 months'
  ];

  const programs = [
    {
      id: 1,
      title: 'Master of Science in Computer Science',
      description: 'Comprehensive program covering advanced computer science concepts, algorithms, and software engineering practices.',
      category: 'Computer Science',
      duration: '24 months',
      difficulty: 'Advanced',
      language: 'English',
      price: 15000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.8,
      students: 1250,
      completionRate: 92,
      instructor: 'Dr. Sarah Johnson',
      features: [
        'Advanced Algorithms & Data Structures',
        'Machine Learning & AI',
        'Software Architecture',
        'Database Systems',
        'Computer Networks',
        'Capstone Project'
      ],
      prerequisites: [
        'Bachelor\'s degree in related field',
        'Programming experience (Python, Java, C++)',
        'Mathematics background (Calculus, Linear Algebra)'
      ],
      outcomes: [
        'Design and implement complex software systems',
        'Apply machine learning algorithms to real-world problems',
        'Lead software development teams',
        'Research and publish in top-tier conferences'
      ],
      startDate: '2024-02-01',
      applicationDeadline: '2024-01-15',
      isOpen: true
    },
    {
      id: 2,
      title: 'Executive MBA in Digital Business',
      description: 'Designed for working professionals to master digital transformation, strategic management, and leadership.',
      category: 'Business Administration',
      duration: '18 months',
      difficulty: 'Advanced',
      language: 'English',
      price: 25000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.9,
      students: 850,
      completionRate: 95,
      instructor: 'Prof. Michael Chen',
      features: [
        'Digital Strategy & Innovation',
        'Financial Management',
        'Marketing Analytics',
        'Leadership & Change Management',
        'Global Business Environment',
        'Capstone Consulting Project'
      ],
      prerequisites: [
        'Bachelor\'s degree',
        '5+ years professional experience',
        'Management or leadership experience',
        'English proficiency (TOEFL/IELTS)'
      ],
      outcomes: [
        'Lead digital transformation initiatives',
        'Develop and execute business strategies',
        'Manage cross-functional teams',
        'Drive innovation and growth'
      ],
      startDate: '2024-03-01',
      applicationDeadline: '2024-02-15',
      isOpen: true
    },
    {
      id: 3,
      title: 'Data Science Professional Certificate',
      description: 'Intensive program focusing on data analysis, machine learning, and business intelligence.',
      category: 'Data Science',
      duration: '12 months',
      difficulty: 'Intermediate',
      language: 'English',
      price: 12000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.7,
      students: 2100,
      completionRate: 88,
      instructor: 'Dr. Lisa Rodriguez',
      features: [
        'Python & R Programming',
        'Statistical Analysis',
        'Machine Learning',
        'Big Data Technologies',
        'Data Visualization',
        'Real-world Projects'
      ],
      prerequisites: [
        'Bachelor\'s degree',
        'Basic programming knowledge',
        'Statistics background',
        'Mathematics (Calculus, Statistics)'
      ],
      outcomes: [
        'Analyze large datasets using advanced techniques',
        'Build predictive models',
        'Communicate insights effectively',
        'Lead data-driven decision making'
      ],
      startDate: '2024-01-15',
      applicationDeadline: '2024-01-01',
      isOpen: true
    },
    {
      id: 4,
      title: 'Cybersecurity Specialist Program',
      description: 'Comprehensive training in cybersecurity fundamentals, ethical hacking, and risk management.',
      category: 'Cybersecurity',
      duration: '18 months',
      difficulty: 'Advanced',
      language: 'English',
      price: 18000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.6,
      students: 950,
      completionRate: 90,
      instructor: 'Prof. David Kim',
      features: [
        'Network Security',
        'Ethical Hacking',
        'Risk Assessment',
        'Incident Response',
        'Compliance & Governance',
        'Hands-on Labs'
      ],
      prerequisites: [
        'IT background or related degree',
        'Basic networking knowledge',
        'Linux command line experience',
        'Security awareness'
      ],
      outcomes: [
        'Design secure network architectures',
        'Perform penetration testing',
        'Manage security incidents',
        'Implement compliance frameworks'
      ],
      startDate: '2024-04-01',
      applicationDeadline: '2024-03-15',
      isOpen: true
    },
    {
      id: 5,
      title: 'Digital Marketing Mastery Program',
      description: 'Complete program covering all aspects of digital marketing from strategy to execution.',
      category: 'Digital Marketing',
      duration: '12 months',
      difficulty: 'Intermediate',
      language: 'English',
      price: 8000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.5,
      students: 1800,
      completionRate: 85,
      instructor: 'Emma Thompson',
      features: [
        'SEO & SEM',
        'Social Media Marketing',
        'Content Strategy',
        'Email Marketing',
        'Analytics & Reporting',
        'Campaign Management'
      ],
      prerequisites: [
        'High school diploma',
        'Basic computer skills',
        'Marketing interest',
        'English proficiency'
      ],
      outcomes: [
        'Create comprehensive digital marketing strategies',
        'Execute multi-channel campaigns',
        'Analyze marketing performance',
        'Optimize conversion rates'
      ],
      startDate: '2024-02-15',
      applicationDeadline: '2024-02-01',
      isOpen: true
    },
    {
      id: 6,
      title: 'Artificial Intelligence Engineering',
      description: 'Advanced program focusing on AI/ML engineering, deep learning, and AI system design.',
      category: 'Artificial Intelligence',
      duration: '24 months',
      difficulty: 'Advanced',
      language: 'English',
      price: 20000,
      currency: 'USD',
      thumbnail: '/api/placeholder/400/250',
      rating: 4.9,
      students: 750,
      completionRate: 94,
      instructor: 'Dr. James Wilson',
      features: [
        'Deep Learning',
        'Natural Language Processing',
        'Computer Vision',
        'AI Ethics',
        'MLOps',
        'Research Project'
      ],
      prerequisites: [
        'Master\'s degree in CS or related field',
        'Strong programming skills',
        'Advanced mathematics',
        'Machine learning experience'
      ],
      outcomes: [
        'Design and implement AI systems',
        'Research and develop new algorithms',
        'Deploy ML models at scale',
        'Lead AI initiatives in organizations'
      ],
      startDate: '2024-03-15',
      applicationDeadline: '2024-03-01',
      isOpen: true
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || program.category === selectedCategory;
    const matchesDuration = selectedDuration === 'All' || program.duration === selectedDuration;
    return matchesSearch && matchesCategory && matchesDuration;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Degree Programs</h1>
        <p className="text-gray-600">
          Comprehensive, structured programs designed by industry experts to advance your career.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div className="lg:w-48">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredPrograms.length} of {programs.length} programs
        </p>
      </div>

      {/* Programs Grid */}
      <div className="space-y-6">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Program Image */}
                <div className="lg:w-80 flex-shrink-0">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Program Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {program.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${program.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{program.currency}</div>
                    </div>
                  </div>

                  {/* Program Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {program.category}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {program.students} students
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="h-4 w-4 mr-1" />
                      {program.completionRate}% completion
                    </div>
                  </div>

                  {/* Rating and Instructor */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" fill="currentColor" />
                      <span className="ml-1 text-sm font-medium">{program.rating}</span>
                      <span className="ml-2 text-sm text-gray-500">by {program.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Starts {new Date(program.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.features.slice(0, 4).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {program.features.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{program.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Application Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {program.isOpen ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Applications Open</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Applications Closed</span>
                        </div>
                      )}
                      <span className="ml-4 text-sm text-gray-500">
                        Deadline: {new Date(program.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/programs/${program.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                      {program.isOpen && (
                        <Link
                          href={`/programs/${program.id}/apply`}
                          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all programs.
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of professionals who have transformed their careers with our degree programs.
          </p>
          <Link
            href="/programs/apply"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Application
          </Link>
        </div>
      </div>
    </div>
  );
}

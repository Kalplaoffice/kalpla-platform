'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  CogIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = [
    {
      id: 'general',
      name: 'General',
      icon: QuestionMarkCircleIcon,
      description: 'General questions about Kalpla',
      color: 'blue'
    },
    {
      id: 'courses',
      name: 'Courses',
      icon: AcademicCapIcon,
      description: 'Questions about courses and programs',
      color: 'green'
    },
    {
      id: 'ksmp',
      name: 'KSMP',
      icon: RocketLaunchIcon,
      description: 'Kalpla Startup Mentorship Program',
      color: 'purple'
    },
    {
      id: 'mentors',
      name: 'Mentors',
      icon: UserGroupIcon,
      description: 'Questions about mentoring',
      color: 'yellow'
    },
    {
      id: 'investors',
      name: 'Investors',
      icon: BuildingOfficeIcon,
      description: 'Investment and funding questions',
      color: 'indigo'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CurrencyDollarIcon,
      description: 'Payment and billing questions',
      color: 'red'
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: CogIcon,
      description: 'Technical support and troubleshooting',
      color: 'gray'
    },
    {
      id: 'security',
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Security and privacy questions',
      color: 'teal'
    }
  ];

  const faqItems: FAQItem[] = [
    // General
    {
      id: '1',
      question: 'What is Kalpla?',
      answer: 'Kalpla is a comprehensive edtech platform that offers degree programs, professional courses, and the Kalpla Startup Mentorship Program (KSMP). We provide structured learning experiences with expert mentorship to help students and entrepreneurs achieve their goals.',
      category: 'general',
      tags: ['platform', 'overview', 'mission']
    },
    {
      id: '2',
      question: 'How do I get started with Kalpla?',
      answer: 'To get started, create an account on our platform, browse our courses and programs, and choose the one that best fits your goals. You can also apply to become a mentor or investor if you have relevant experience.',
      category: 'general',
      tags: ['getting-started', 'account', 'registration']
    },
    {
      id: '3',
      question: 'Is Kalpla free to use?',
      answer: 'Kalpla offers both free and paid programs. Some courses and resources are available for free, while comprehensive programs like KSMP and degree programs require payment. We also offer scholarships and financial aid for eligible students.',
      category: 'general',
      tags: ['pricing', 'free', 'cost']
    },

    // Courses
    {
      id: '4',
      question: 'What types of courses does Kalpla offer?',
      answer: 'Kalpla offers degree programs (B.Tech, MBA), professional diplomas, certificate courses, and specialized programs in technology, business, healthcare, and other fields. All courses are designed with industry relevance and practical application in mind.',
      category: 'courses',
      tags: ['course-types', 'programs', 'degrees']
    },
    {
      id: '5',
      question: 'How long do courses take to complete?',
      answer: 'Course duration varies by program. Degree programs typically take 2-4 years, professional diplomas take 6-12 months, and certificate courses can be completed in 1-3 months. KSMP is a 12-month intensive program.',
      category: 'courses',
      tags: ['duration', 'timeline', 'completion']
    },
    {
      id: '6',
      question: 'Do I get a certificate upon completion?',
      answer: 'Yes, upon successful completion of any course or program, you will receive a certificate. Degree programs provide accredited degrees, while other programs provide industry-recognized certificates.',
      category: 'courses',
      tags: ['certificate', 'accreditation', 'completion']
    },

    // KSMP
    {
      id: '7',
      question: 'What is the Kalpla Startup Mentorship Program (KSMP)?',
      answer: 'KSMP is a comprehensive 12-phase program designed to guide entrepreneurs from idea to scale. It includes mentorship from industry experts, structured curriculum, access to investor network, and demo day presentations.',
      category: 'ksmp',
      tags: ['program', 'startup', 'mentorship']
    },
    {
      id: '8',
      question: 'Who can apply for KSMP?',
      answer: 'KSMP is open to entrepreneurs with innovative startup ideas, regardless of their background. We welcome individuals from all industries and experience levels, from first-time entrepreneurs to experienced business leaders looking to start new ventures.',
      category: 'ksmp',
      tags: ['eligibility', 'application', 'requirements']
    },
    {
      id: '9',
      question: 'What are the 12 phases of KSMP?',
      answer: 'The 12 phases cover: 1) Business Idea & Market Research, 2) Business Model & Strategy, 3) Financial Planning & Funding, 4) Product Development & MVP, 5) Marketing & Branding, 6) Sales & Customer Acquisition, 7) Operations & Scaling, 8) Team Building & Leadership, 9) Technology & Innovation, 10) Legal & Compliance, 11) International Expansion, and 12) Exit Strategy & Growth.',
      category: 'ksmp',
      tags: ['phases', 'curriculum', 'structure']
    },
    {
      id: '10',
      question: 'How much does KSMP cost?',
      answer: 'KSMP program fees vary by cohort and range from ₹45,000 to ₹60,000. We offer various scholarships including merit-based, women entrepreneur, and social impact scholarships. Financial aid is also available for eligible candidates.',
      category: 'ksmp',
      tags: ['cost', 'pricing', 'scholarships']
    },

    // Mentors
    {
      id: '11',
      question: 'How do I become a mentor?',
      answer: 'To become a mentor, you need to have relevant industry experience, expertise in your field, and a passion for helping entrepreneurs. Apply through our mentor application form, and our team will review your qualifications.',
      category: 'mentors',
      tags: ['application', 'requirements', 'qualifications']
    },
    {
      id: '12',
      question: 'What are the benefits of being a mentor?',
      answer: 'Mentors gain access to a network of entrepreneurs and industry leaders, opportunities to share their expertise, potential investment opportunities, and the satisfaction of helping build the next generation of successful startups.',
      category: 'mentors',
      tags: ['benefits', 'network', 'opportunities']
    },
    {
      id: '13',
      question: 'How much time do I need to commit as a mentor?',
      answer: 'Mentor time commitment varies based on your availability and the number of mentees you work with. Typically, mentors spend 1-5 hours per week per mentee, including meetings, feedback, and guidance sessions.',
      category: 'mentors',
      tags: ['time-commitment', 'schedule', 'availability']
    },

    // Investors
    {
      id: '14',
      question: 'How do I become an investor?',
      answer: 'To become an investor, you need to demonstrate investment experience, financial capacity, and interest in supporting startups. Apply through our investor application form, and our team will review your credentials.',
      category: 'investors',
      tags: ['application', 'requirements', 'credentials']
    },
    {
      id: '15',
      question: 'What investment opportunities are available?',
      answer: 'Investors get access to curated startup opportunities from KSMP cohorts, early-stage companies, and alumni ventures. Investment sizes range from ₹1 lakh to ₹10+ crores depending on the startup stage and your preferences.',
      category: 'investors',
      tags: ['opportunities', 'startups', 'investment-size']
    },
    {
      id: '16',
      question: 'What support do investors receive?',
      answer: 'Investors receive detailed due diligence reports, access to mentor networks, regular startup updates, demo day presentations, and opportunities to co-invest with other investors in our network.',
      category: 'investors',
      tags: ['support', 'due-diligence', 'network']
    },

    // Payments
    {
      id: '17',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, net banking, UPI, digital wallets, and EMI options through our payment partner PayU. International students can pay via international cards or wire transfer.',
      category: 'payments',
      tags: ['payment-methods', 'cards', 'upi', 'emi']
    },
    {
      id: '18',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer refunds according to our refund policy. Full refunds are available within 7 days of enrollment for most programs, and partial refunds may be available based on program completion and circumstances.',
      category: 'payments',
      tags: ['refunds', 'policy', 'cancellation']
    },
    {
      id: '19',
      question: 'Can I pay in installments?',
      answer: 'Yes, we offer flexible payment options including monthly installments for most programs. EMI options are available through our payment partners, and we also offer custom payment plans for eligible students.',
      category: 'payments',
      tags: ['installments', 'emi', 'payment-plans']
    },

    // Technical
    {
      id: '20',
      question: 'What are the technical requirements?',
      answer: 'You need a computer or mobile device with internet connection, a modern web browser (Chrome, Firefox, Safari, Edge), and basic computer skills. Some courses may require specific software or tools.',
      category: 'technical',
      tags: ['requirements', 'browser', 'device']
    },
    {
      id: '21',
      question: 'How do I access my courses?',
      answer: 'Once enrolled, you can access your courses through your student dashboard. Courses are available 24/7, and you can learn at your own pace. Live sessions and mentor meetings are scheduled separately.',
      category: 'technical',
      tags: ['access', 'dashboard', '24-7']
    },
    {
      id: '22',
      question: 'What if I have technical issues?',
      answer: 'Our technical support team is available to help with any issues. Contact us through the support portal, email, or phone. We also have a comprehensive help center with troubleshooting guides.',
      category: 'technical',
      tags: ['support', 'troubleshooting', 'help']
    },

    // Security
    {
      id: '23',
      question: 'How is my data protected?',
      answer: 'We use industry-standard security measures including SSL encryption, secure data storage, and regular security audits. Your personal information is protected according to our privacy policy and applicable data protection laws.',
      category: 'security',
      tags: ['data-protection', 'privacy', 'security']
    },
    {
      id: '24',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account at any time through your account settings. Please note that account deletion is permanent and cannot be undone. Some data may be retained for legal or business purposes.',
      category: 'security',
      tags: ['account-deletion', 'data-retention', 'privacy']
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
      teal: 'bg-teal-100 text-teal-800'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Kalpla, our programs, and services. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedCategory === 'all'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">All</p>
                <p className="text-xs text-gray-500">{faqItems.length} questions</p>
              </div>
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              const count = faqItems.filter(item => item.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Icon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{count} questions</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms.' : 'No FAQs available for this category.'}
              </p>
            </div>
          ) : (
            filteredFAQs.map((item) => {
              const category = categories.find(cat => cat.id === item.category);
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-md font-medium text-gray-900">{item.question}</h3>
                          {category && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.color)}`}>
                              {category.name}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
              <a
                href="tel:+91-9876543210"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call Us
              </a>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

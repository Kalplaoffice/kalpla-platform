'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  RocketLaunchIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export default function KSMPPage() {
  const [selectedPhase, setSelectedPhase] = useState(1);

  const phases = [
    {
      number: 1,
      title: 'Foundation & Ideation',
      duration: '4 weeks',
      description: 'Learn the fundamentals of entrepreneurship and develop your initial business idea.',
      topics: ['Business Model Canvas', 'Market Research', 'Value Proposition', 'Customer Discovery'],
      deliverables: ['Business Model Canvas', 'Market Research Report', 'Initial Pitch Deck'],
      status: 'completed'
    },
    {
      number: 2,
      title: 'Market Validation',
      duration: '4 weeks',
      description: 'Validate your business idea through customer interviews and market analysis.',
      topics: ['Customer Interviews', 'Market Sizing', 'Competitive Analysis', 'Pivot Strategies'],
      deliverables: ['Customer Interview Report', 'Market Analysis', 'Competitive Landscape'],
      status: 'completed'
    },
    {
      number: 3,
      title: 'Product Development',
      duration: '6 weeks',
      description: 'Build your MVP and establish product-market fit.',
      topics: ['MVP Development', 'Product-Market Fit', 'User Testing', 'Iteration Cycles'],
      deliverables: ['MVP Prototype', 'User Testing Report', 'Product Roadmap'],
      status: 'current'
    },
    {
      number: 4,
      title: 'Business Model Refinement',
      duration: '4 weeks',
      description: 'Refine your business model and revenue streams.',
      topics: ['Revenue Models', 'Pricing Strategies', 'Unit Economics', 'Financial Projections'],
      deliverables: ['Financial Model', 'Pricing Strategy', 'Revenue Projections'],
      status: 'upcoming'
    },
    {
      number: 5,
      title: 'Marketing & Sales',
      duration: '4 weeks',
      description: 'Develop marketing strategies and sales processes.',
      topics: ['Marketing Strategy', 'Sales Funnel', 'Brand Building', 'Customer Acquisition'],
      deliverables: ['Marketing Plan', 'Sales Process', 'Brand Guidelines'],
      status: 'upcoming'
    },
    {
      number: 6,
      title: 'Operations & Scaling',
      duration: '4 weeks',
      description: 'Build operational processes and prepare for scaling.',
      topics: ['Operations Management', 'Team Building', 'Process Optimization', 'Scaling Strategies'],
      deliverables: ['Operations Manual', 'Hiring Plan', 'Scaling Roadmap'],
      status: 'upcoming'
    },
    {
      number: 7,
      title: 'Funding Preparation',
      duration: '4 weeks',
      description: 'Prepare for fundraising and investor relations.',
      topics: ['Investment Readiness', 'Pitch Deck', 'Financial Modeling', 'Investor Relations'],
      deliverables: ['Investment-Ready Pitch Deck', 'Financial Model', 'Investor List'],
      status: 'upcoming'
    },
    {
      number: 8,
      title: 'Legal & Compliance',
      duration: '3 weeks',
      description: 'Understand legal requirements and compliance.',
      topics: ['Business Registration', 'Intellectual Property', 'Contracts', 'Compliance'],
      deliverables: ['Legal Structure', 'IP Strategy', 'Compliance Checklist'],
      status: 'upcoming'
    },
    {
      number: 9,
      title: 'Technology & Innovation',
      duration: '4 weeks',
      description: 'Leverage technology for competitive advantage.',
      topics: ['Technology Strategy', 'Digital Transformation', 'Innovation Management', 'Tech Stack'],
      deliverables: ['Technology Roadmap', 'Innovation Strategy', 'Tech Implementation Plan'],
      status: 'upcoming'
    },
    {
      number: 10,
      title: 'Leadership & Management',
      duration: '4 weeks',
      description: 'Develop leadership skills and management capabilities.',
      topics: ['Leadership Development', 'Team Management', 'Decision Making', 'Communication'],
      deliverables: ['Leadership Development Plan', 'Management Framework', 'Communication Strategy'],
      status: 'upcoming'
    },
    {
      number: 11,
      title: 'Growth & Expansion',
      duration: '4 weeks',
      description: 'Plan for growth and market expansion.',
      topics: ['Growth Strategies', 'Market Expansion', 'Partnership Development', 'International Markets'],
      deliverables: ['Growth Strategy', 'Expansion Plan', 'Partnership Strategy'],
      status: 'upcoming'
    },
    {
      number: 12,
      title: 'Demo Day & Graduation',
      duration: '2 weeks',
      description: 'Present your startup to investors and graduate from the program.',
      topics: ['Final Pitch Preparation', 'Demo Day Presentation', 'Graduation Ceremony', 'Alumni Network'],
      deliverables: ['Final Pitch Deck', 'Demo Day Presentation', 'Graduation Certificate'],
      status: 'upcoming'
    }
  ];

  const stats = [
    { name: 'Active Cohorts', value: '12', icon: UserGroupIcon },
    { name: 'Graduated Startups', value: '150+', icon: TrophyIcon },
    { name: 'Success Rate', value: '85%', icon: ChartBarIcon },
    { name: 'Total Funding Raised', value: '$2.5M+', icon: RocketLaunchIcon }
  ];

  const currentPhase = phases.find(phase => phase.status === 'current');
  const completedPhases = phases.filter(phase => phase.status === 'completed');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Kalpla Startup Mentorship Program <span className="text-yellow-300">(KSMP)</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A comprehensive 12-month program designed to transform your startup idea into a successful business.
              Join our cohort-based learning experience with expert mentors and industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ksmp/apply"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/ksmp/cohorts"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Cohorts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-2">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Program Overview */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Business model development and validation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Product development and market fit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Marketing and sales strategies</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Fundraising and investor relations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Leadership and team management</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Expert mentorship from industry leaders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Access to investor network</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Peer learning and networking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Demo day presentation opportunity</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Lifetime access to alumni network</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Phase Highlight */}
          {currentPhase && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
              <div className="flex items-center mb-4">
                <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-blue-900">Current Phase</h2>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phase {currentPhase.number}: {currentPhase.title}
              </h3>
              <p className="text-gray-700 mb-4">{currentPhase.description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Duration: {currentPhase.duration}
              </div>
            </div>
          )}

          {/* Program Phases */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">12-Phase Program Structure</h2>
            <div className="space-y-4">
              {phases.map((phase) => (
                <div
                  key={phase.number}
                  className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                    phase.status === 'current'
                      ? 'border-blue-500 bg-blue-50'
                      : phase.status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPhase(phase.number)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          phase.status === 'current'
                            ? 'bg-blue-600 text-white'
                            : phase.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {phase.status === 'completed' ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          phase.number
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Phase {phase.number}: {phase.title}
                        </h3>
                        <p className="text-sm text-gray-600">{phase.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {phase.duration}
                    </div>
                  </div>

                  {selectedPhase === phase.number && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Topics</h4>
                          <ul className="space-y-1">
                            {phase.topics.map((topic, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                • {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Deliverables</h4>
                          <ul className="space-y-1">
                            {phase.deliverables.map((deliverable, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                • {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Startup Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the next cohort and transform your idea into a successful business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ksmp/apply"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply to KSMP
            </Link>
            <Link
              href="/mentors"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Meet Our Mentors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

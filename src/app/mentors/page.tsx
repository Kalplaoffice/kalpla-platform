'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedPhase, setSelectedPhase] = useState('All');

  const expertiseAreas = [
    'All',
    'Technology',
    'Business Strategy',
    'Marketing',
    'Finance',
    'Product Development',
    'Operations',
    'Leadership',
    'Sales',
    'Legal'
  ];

  const ksmpPhases = [
    'All',
    'Phase 1-3: Foundation',
    'Phase 4-6: Development',
    'Phase 7-9: Growth',
    'Phase 10-12: Scale'
  ];

  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'CEO & Founder',
      company: 'TechInnovate Inc.',
      expertise: ['Technology', 'Product Development', 'Leadership'],
      ksmpPhase: 'Phase 7-9: Growth',
      experience: '15+ years',
      rating: 4.9,
      mentees: 45,
      sessions: 120,
      bio: 'Serial entrepreneur with 3 successful exits. Expert in scaling tech startups from seed to Series A.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      portfolio: 'https://sarahjohnson.com',
      languages: ['English', 'Spanish'],
      availability: 'Available',
      specialties: ['SaaS', 'AI/ML', 'Product Strategy', 'Team Building']
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'VP of Marketing',
      company: 'GrowthCorp',
      expertise: ['Marketing', 'Business Strategy', 'Sales'],
      ksmpPhase: 'Phase 4-6: Development',
      experience: '12+ years',
      rating: 4.8,
      mentees: 38,
      sessions: 95,
      bio: 'Marketing expert who helped 50+ startups achieve product-market fit and scale their customer acquisition.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/michaelchen',
      portfolio: 'https://michaelchen.marketing',
      languages: ['English', 'Mandarin'],
      availability: 'Available',
      specialties: ['Growth Marketing', 'Brand Strategy', 'Customer Acquisition', 'Analytics']
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      title: 'Investment Partner',
      company: 'VentureCapital Partners',
      expertise: ['Finance', 'Business Strategy', 'Operations'],
      ksmpPhase: 'Phase 7-9: Growth',
      experience: '18+ years',
      rating: 4.9,
      mentees: 52,
      sessions: 140,
      bio: 'Former investment banker turned VC. Specializes in helping startups prepare for funding rounds.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/lisarodriguez',
      portfolio: 'https://lisarodriguez.vc',
      languages: ['English', 'Spanish', 'Portuguese'],
      availability: 'Available',
      specialties: ['Fundraising', 'Financial Modeling', 'Due Diligence', 'Investor Relations']
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'CTO',
      company: 'CloudTech Solutions',
      expertise: ['Technology', 'Product Development', 'Operations'],
      ksmpPhase: 'Phase 1-3: Foundation',
      experience: '20+ years',
      rating: 4.7,
      mentees: 41,
      sessions: 110,
      bio: 'Technology leader with expertise in building scalable software products and engineering teams.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/davidkim',
      portfolio: 'https://davidkim.tech',
      languages: ['English', 'Korean'],
      availability: 'Available',
      specialties: ['Software Architecture', 'DevOps', 'Team Scaling', 'Technical Strategy']
    },
    {
      id: 5,
      name: 'Emma Thompson',
      title: 'Head of Legal',
      company: 'StartupLegal Pro',
      expertise: ['Legal', 'Business Strategy', 'Operations'],
      ksmpPhase: 'Phase 10-12: Scale',
      experience: '14+ years',
      rating: 4.8,
      mentees: 35,
      sessions: 85,
      bio: 'Legal expert specializing in startup law, IP protection, and regulatory compliance.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/emmathompson',
      portfolio: 'https://emmathompson.legal',
      languages: ['English', 'French'],
      availability: 'Available',
      specialties: ['IP Law', 'Corporate Law', 'Compliance', 'Contract Negotiation']
    },
    {
      id: 6,
      name: 'James Wilson',
      title: 'Operations Director',
      company: 'ScaleOps Consulting',
      expertise: ['Operations', 'Leadership', 'Business Strategy'],
      ksmpPhase: 'Phase 4-6: Development',
      experience: '16+ years',
      rating: 4.6,
      mentees: 29,
      sessions: 75,
      bio: 'Operations expert who helps startups build efficient processes and scale their operations.',
      avatar: '/api/placeholder/150/150',
      linkedin: 'https://linkedin.com/in/jameswilson',
      portfolio: 'https://jameswilson.ops',
      languages: ['English'],
      availability: 'Available',
      specialties: ['Process Optimization', 'Team Management', 'Supply Chain', 'Quality Systems']
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = selectedExpertise === 'All' || mentor.expertise.includes(selectedExpertise);
    const matchesPhase = selectedPhase === 'All' || mentor.ksmpPhase === selectedPhase;
    return matchesSearch && matchesExpertise && matchesPhase;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Mentors</h1>
        <p className="text-gray-600">
          Learn from industry leaders and successful entrepreneurs who will guide you through your startup journey.
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
                placeholder="Search mentors, companies, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Expertise Filter */}
          <div className="lg:w-48">
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {expertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* KSMP Phase Filter */}
          <div className="lg:w-48">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ksmpPhases.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredMentors.length} of {mentors.length} mentors
        </p>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Mentor Header */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.title}</p>
                  <p className="text-sm text-blue-600 font-medium">{mentor.company}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{mentor.experience}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                {mentor.bio}
              </p>

              {/* Expertise Tags */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 3).map((exp) => (
                    <span
                      key={exp}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {exp}
                    </span>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{mentor.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {mentor.mentees} mentees
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {mentor.sessions} sessions
                </div>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    mentor.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {mentor.availability}
                </div>
              </div>

              {/* KSMP Phase */}
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">
                    KSMP: {mentor.ksmpPhase}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-2">
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </Link>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all mentors.
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Become a Mentor?</h2>
          <p className="text-purple-100 mb-6">
            Share your expertise and help the next generation of entrepreneurs succeed.
          </p>
          <Link
            href="/mentors/apply"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Apply to Become a Mentor
          </Link>
        </div>
      </div>
    </div>
  );
}

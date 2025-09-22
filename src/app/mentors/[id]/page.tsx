'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  StarIcon,
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

export default function MentorDetailPage() {
  const params = useParams();
  const mentorId = params.id;
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock mentor data - in real app, this would be fetched based on mentorId
  const mentor = {
    id: mentorId,
    name: 'Dr. Sarah Johnson',
    title: 'CEO & Founder',
    company: 'TechInnovate Inc.',
    expertise: ['Technology', 'Product Development', 'Leadership'],
    ksmpPhase: 'Phase 7-9: Growth',
    experience: '15+ years',
    rating: 4.9,
    mentees: 45,
    sessions: 120,
    bio: 'Serial entrepreneur with 3 successful exits. Expert in scaling tech startups from seed to Series A. Previously founded and sold two companies, raising over $50M in total funding.',
    avatar: '/api/placeholder/200/200',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    portfolio: 'https://sarahjohnson.com',
    languages: ['English', 'Spanish'],
    availability: 'Available',
    specialties: ['SaaS', 'AI/ML', 'Product Strategy', 'Team Building'],
    achievements: [
      'Founded 3 successful startups',
      'Raised $50M+ in funding',
      'Mentored 100+ entrepreneurs',
      'Speaker at TechCrunch Disrupt'
    ],
    education: [
      'MBA - Stanford Graduate School of Business',
      'BS Computer Science - MIT'
    ],
    workExperience: [
      'CEO, TechInnovate Inc. (2018-Present)',
      'VP Product, ScaleUp Corp (2015-2018)',
      'Senior Engineer, Google (2010-2015)'
    ]
  };

  const reviews = [
    {
      id: 1,
      mentee: 'Alex Chen',
      company: 'StartupXYZ',
      rating: 5,
      comment: 'Sarah provided invaluable guidance during our Series A fundraising. Her network and expertise were crucial to our success.',
      date: '2024-01-15'
    },
    {
      id: 2,
      mentee: 'Maria Rodriguez',
      company: 'TechFlow',
      rating: 5,
      comment: 'Excellent mentor with deep industry knowledge. Helped us refine our product strategy and scale our team effectively.',
      date: '2024-01-10'
    },
    {
      id: 3,
      mentee: 'David Kim',
      company: 'InnovateLab',
      rating: 4,
      comment: 'Great insights on building technical teams and product development processes. Highly recommend for tech startups.',
      date: '2024-01-05'
    }
  ];

  const handleBookSession = () => {
    // TODO: Implement booking functionality
    console.log('Book session with mentor:', mentor.id);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/mentors"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Mentors
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <HeartIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Avatar and Basic Info */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
                <p className="text-gray-600 mb-2">{mentor.title}</p>
                <p className="text-blue-600 font-medium mb-4">{mentor.company}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold">{mentor.rating}</span>
                  <span className="ml-1 text-gray-600">({mentor.sessions} sessions)</span>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-center mb-6">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    mentor.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700">{mentor.availability}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBookSession}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Book a Session
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                  Send Message
                </button>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{mentor.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mentees</span>
                  <span className="font-medium">{mentor.mentees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">{mentor.languages.join(', ')}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Connect</h3>
                <div className="space-y-2">
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </a>
                  <a
                    href={mentor.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    Personal Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentor.specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KSMP Phase */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">KSMP Involvement</h2>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-purple-800">KSMP Phase: {mentor.ksmpPhase}</p>
                    <p className="text-sm text-purple-600">Specializes in growth-stage startup mentorship</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              <div className="space-y-3">
                {mentor.education.map((edu, index) => (
                  <div key={index} className="flex items-start">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-gray-700">{edu}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
              <div className="space-y-3">
                {mentor.workExperience.map((exp, index) => (
                  <div key={index} className="flex items-start">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-gray-700">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h2>
              <div className="space-y-3">
                {mentor.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    <TrophyIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.mentee}</h4>
                        <p className="text-sm text-gray-600">{review.company}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

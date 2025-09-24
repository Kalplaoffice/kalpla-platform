'use client';

import React from 'react';
import { 
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedinProfile?: string;
  expertise: string[];
  experience: string;
  education: string;
  certifications: string[];
  rating: number;
  totalStudents: number;
  courses: string[];
}

interface MentorsSectionProps {
  mentors: Mentor[];
  programTitle: string;
}

export default function MentorsSection({ mentors, programTitle }: MentorsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (mentors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Faculty</h3>
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Faculty information will be available soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Meet Your Faculty</h3>
        <span className="text-sm text-gray-500">{mentors.length} instructors</span>
      </div>

      <p className="text-gray-600 mb-6">
        Learn from industry experts and experienced educators who will guide you through your {programTitle} journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Mentor Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="flex-shrink-0">
                {mentor.profileImage ? (
                  <img
                    src={mentor.profileImage}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-medium text-gray-900 truncate">{mentor.name}</h4>
                <p className="text-sm text-gray-600 truncate">{mentor.title}</p>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(mentor.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {mentor.rating.toFixed(1)} ({mentor.totalStudents} students)
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {mentor.bio}
            </p>

            {/* Experience & Education */}
            <div className="space-y-3 mb-4">
              {mentor.experience && (
                <div className="flex items-start">
                  <BriefcaseIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">Experience</p>
                    <p className="text-xs text-gray-600">{mentor.experience}</p>
                  </div>
                </div>
              )}
              
              {mentor.education && (
                <div className="flex items-start">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">Education</p>
                    <p className="text-xs text-gray-600">{mentor.education}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Expertise */}
            {mentor.expertise.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-900 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{mentor.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              {mentor.email && (
                <a
                  href={`mailto:${mentor.email}`}
                  className="text-gray-400 hover:text-gray-600"
                  title="Email"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                </a>
              )}
              
              {mentor.website && (
                <a
                  href={mentor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                  title="Website"
                >
                  <GlobeAltIcon className="h-4 w-4" />
                </a>
              )}
              
              {mentor.linkedinProfile && (
                <a
                  href={mentor.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                  title="LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Highlights */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Why Our Faculty Stands Out</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Industry Experience</h5>
            <p className="text-sm text-gray-600">Real-world expertise from leading professionals</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <StarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Proven Track Record</h5>
            <p className="text-sm text-gray-600">High ratings and successful student outcomes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-1">Personalized Support</h5>
            <p className="text-sm text-gray-600">Individual attention and mentorship</p>
          </div>
        </div>
      </div>
    </div>
  );
}

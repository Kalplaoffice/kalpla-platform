'use client';

import Image from 'next/image';
import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  StarIcon,
  EnvelopeIcon,
  UserGroupIcon,
  TrophyIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const leadershipTeam = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    position: 'Founder & CEO',
    bio: 'Visionary leader with 20+ years in education and entrepreneurship. Former VP at Infosys and serial entrepreneur.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    education: 'PhD in Management, IIM Bangalore',
    experience: '20+ years',
    achievements: ['Forbes 30 Under 30', 'Best Education Leader 2023', 'Serial Entrepreneur'],
    specialties: ['Strategic Leadership', 'Education Innovation', 'Startup Ecosystem'],
    email: 'rajesh@kalpla.in',
    linkedin: 'https://linkedin.com/in/rajeshkumar'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    position: 'Chief Academic Officer',
    bio: 'Renowned academic with expertise in curriculum design and educational technology. Former Dean at IIT Delhi.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    education: 'PhD in Education Technology, MIT',
    experience: '18+ years',
    achievements: ['Best Academic Leader 2022', 'Innovation in Education Award', 'Published 50+ Papers'],
    specialties: ['Curriculum Design', 'EdTech Innovation', 'Academic Excellence'],
    email: 'priya@kalpla.in',
    linkedin: 'https://linkedin.com/in/priyasharma'
  },
  {
    id: 3,
    name: 'Amit Patel',
    position: 'Chief Technology Officer',
    bio: 'Tech visionary with expertise in AI, ML, and educational platforms. Former CTO at multiple edtech startups.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    education: 'MS Computer Science, Stanford University',
    experience: '15+ years',
    achievements: ['Tech Innovation Award', 'AI Pioneer', 'Open Source Contributor'],
    specialties: ['Artificial Intelligence', 'Platform Development', 'Tech Strategy'],
    email: 'amit@kalpla.in',
    linkedin: 'https://linkedin.com/in/amitpatel'
  },
  {
    id: 4,
    name: 'Dr. Sarah Johnson',
    position: 'Head of Mentorship Programs',
    bio: 'Experienced mentor and business coach with a track record of nurturing successful entrepreneurs and startups.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    education: 'PhD in Psychology, Harvard University',
    experience: '12+ years',
    achievements: ['Best Mentor Award', 'Startup Success Stories', 'Leadership Coach'],
    specialties: ['Mentorship', 'Leadership Development', 'Startup Coaching'],
    email: 'sarah@kalpla.in',
    linkedin: 'https://linkedin.com/in/sarahjohnson'
  }
];

const facultyMembers = [
  {
    id: 1,
    name: 'Prof. David Lee',
    position: 'Professor of Entrepreneurship',
    bio: 'Expert in startup ecosystems and venture capital. Former investment banker turned educator.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    education: 'MBA Finance, Wharton School',
    experience: '10+ years',
    specialties: ['Venture Capital', 'Startup Strategy', 'Financial Modeling'],
    courses: ['Entrepreneurship Fundamentals', 'Venture Capital & Funding', 'Business Strategy']
  },
  {
    id: 2,
    name: 'Dr. Maria Garcia',
    position: 'Professor of Digital Marketing',
    bio: 'Digital marketing expert with extensive industry experience in global brands and startups.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    education: 'PhD Marketing, Kellogg School',
    experience: '8+ years',
    specialties: ['Digital Marketing', 'Brand Strategy', 'Consumer Behavior'],
    courses: ['Digital Marketing Masterclass', 'Brand Management', 'Consumer Insights']
  },
  {
    id: 3,
    name: 'Prof. Alex Chen',
    position: 'Professor of Technology Management',
    bio: 'Technology management expert with background in Silicon Valley startups and enterprise solutions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    education: 'MS Engineering, UC Berkeley',
    experience: '12+ years',
    specialties: ['Tech Strategy', 'Product Management', 'Innovation'],
    courses: ['Technology Strategy', 'Product Development', 'Innovation Management']
  },
  {
    id: 4,
    name: 'Dr. Emily Watson',
    position: 'Professor of Leadership',
    bio: 'Leadership development expert with focus on emotional intelligence and team dynamics.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    education: 'PhD Organizational Psychology, Columbia',
    experience: '9+ years',
    specialties: ['Leadership Development', 'Team Dynamics', 'Organizational Behavior'],
    courses: ['Leadership Excellence', 'Team Management', 'Organizational Psychology']
  }
];

const advisoryBoard = [
  {
    id: 1,
    name: 'Ravi Kumar',
    position: 'Advisory Board Member',
    company: 'Former President, Infosys',
    bio: 'Technology industry veteran with 30+ years of experience in global IT services.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Dr. Kiran Mazumdar-Shaw',
    position: 'Advisory Board Member',
    company: 'Chairman & MD, Biocon',
    bio: 'Renowned entrepreneur and biotechnology pioneer with extensive business experience.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Nandan Nilekani',
    position: 'Advisory Board Member',
    company: 'Co-founder, Infosys',
    bio: 'Technology visionary and social entrepreneur with deep expertise in digital transformation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  }
];

const stats = [
  { label: 'Leadership Team', value: '4', icon: UserGroupIcon },
  { label: 'Faculty Members', value: '25+', icon: AcademicCapIcon },
  { label: 'Advisory Board', value: '12', icon: TrophyIcon },
  { label: 'Years Experience', value: '200+', icon: ChartBarIcon }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Team
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Meet the passionate leaders, educators, and innovators who are shaping the future of entrepreneurship education.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our leadership team brings together decades of experience in education, technology, and entrepreneurship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {leadershipTeam.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          {member.education}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          {member.experience} experience
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <EnvelopeIcon className="h-5 w-5" />
                        </a>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Faculty Members
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our distinguished faculty brings real-world experience and academic excellence to the classroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {member.education}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      {member.experience} experience
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.specialties.map((specialty, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Courses:</h4>
                    <div className="space-y-1">
                      {member.courses.map((course, index) => (
                        <div key={index} className="text-xs text-gray-600">{course}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Board Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advisory Board
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry veterans and thought leaders who guide our strategic direction and ensure excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisoryBoard.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
                  <p className="text-gray-600 font-medium mb-3">{member.company}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Our Team Section */}
      <div className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of our mission to transform education and empower the next generation of entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

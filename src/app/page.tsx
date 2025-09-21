import Link from 'next/link';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  RocketLaunchIcon,
  PlayIcon,
  BookOpenIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      name: 'Course Marketplace',
      description: 'Discover and enroll in courses created by verified instructors',
      icon: BookOpenIcon,
      href: '/courses'
    },
    {
      name: 'Degree Programs',
      description: 'Structured programs designed by industry experts',
      icon: AcademicCapIcon,
      href: '/programs'
    },
    {
      name: 'Live Mentorship',
      description: 'Get personalized guidance from experienced mentors',
      icon: UserGroupIcon,
      href: '/mentors'
    },
    {
      name: 'KSMP Program',
      description: '12-month startup mentorship program with cohort-based learning',
      icon: RocketLaunchIcon,
      href: '/ksmp'
    }
  ];

  const stats = [
    { name: 'Active Students', value: '10,000+' },
    { name: 'Expert Instructors', value: '500+' },
    { name: 'Courses Available', value: '1,000+' },
    { name: 'Success Stories', value: '95%' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Learn, Grow, and Succeed with{' '}
              <span className="text-yellow-300">Kalpla</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students in our comprehensive educational platform. 
              From individual courses to structured degree programs and startup mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Courses
              </Link>
              <Link
                href="/ksmp"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Join KSMP
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/mentor-onboarding"
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                Become a Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers comprehensive learning solutions tailored to your goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Kalpla today and unlock your potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
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

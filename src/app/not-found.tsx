'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      description: 'Return to the main page'
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpenIcon,
      description: 'Browse available courses'
    },
    {
      name: 'KSMP Program',
      href: '/ksmp',
      icon: AcademicCapIcon,
      description: 'Learn about our startup program'
    },
    {
      name: 'Mentors',
      href: '/mentors',
      icon: UserGroupIcon,
      description: 'Meet our expert mentors'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          </div>
          
          {/* 404 Icon */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <link.icon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {link.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Looking for something specific? Try searching:
          </p>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses, programs, or topics..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Still can't find what you're looking for?{' '}
            <Link
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

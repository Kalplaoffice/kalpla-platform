'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SparklesIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import kalplaLogoWhite from '@/assets/images/kalpla-logo-white.svg';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { getDashboardPath, User } from '@/lib/authUtils';
import MultiAuthForm from '@/components/auth/MultiAuthForm';
import { multiAuthService, AuthUser } from '@/lib/multiAuthService';

export default function SignInPage() {
  const router = useRouter();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await multiAuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Redirect to appropriate dashboard
          const dashboardPath = getDashboardPath(user as User);
          router.push(dashboardPath);
        }
      } catch (error) {
        console.log('No authenticated user');
      }
    };

    checkAuth();

    // Listen for auth changes
    const removeListener = multiAuthService.addAuthListener((user) => {
      setCurrentUser(user);
      if (user) {
        const dashboardPath = getDashboardPath(user as User);
        router.push(dashboardPath);
      }
    });

    return () => removeListener();
  }, [router]);

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setShowAuthForm(false);
    const dashboardPath = getDashboardPath(user as User);
    router.push(dashboardPath);
  };

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Startup Mentorship',
      description: 'Join our KSMP program'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Network',
      description: 'Connect with like-minded entrepreneurs'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Progress',
      description: 'Monitor your learning journey'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={kalplaLogo}
                  alt="Kalpla"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-bold text-gray-900">Kalpla</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              <button
                onClick={() => setShowAuthForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Welcome to Kalpla
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn, Grow, and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Succeed
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of entrepreneurs who are building the future with Kalpla's comprehensive 
              educational platform, expert mentorship, and vibrant community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowAuthForm(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Expert Mentors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of entrepreneurs and take your skills to the next level.
            </p>
            <button
              onClick={() => setShowAuthForm(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Create Your Account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src={kalplaLogoWhite}
                  alt="Kalpla"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold">Kalpla</span>
              </div>
              <p className="text-gray-400">
                Empowering entrepreneurs through education, mentorship, and community.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="text-gray-400 hover:text-white">Courses</Link></li>
                <li><Link href="/programs" className="text-gray-400 hover:text-white">Programs</Link></li>
                <li><Link href="/mentors" className="text-gray-400 hover:text-white">Mentors</Link></li>
                <li><Link href="/ksmp" className="text-gray-400 hover:text-white">KSMP</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Kalpla. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Multi-Auth Form Modal */}
      {showAuthForm && (
        <MultiAuthForm
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthForm(false)}
        />
      )}
    </div>
  );
}
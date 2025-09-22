'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AcademicCapIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import kalplaLogoWhite from '@/assets/images/kalpla-logo-white.svg';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function SignUpPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>('Student');

  const roles = [
    { 
      value: 'Student', 
      label: 'Student', 
      description: 'Learn and grow with our courses and programs',
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-blue-600',
      features: ['Access to all courses', 'Progress tracking', 'Community support', 'Certificates']
    },
    { 
      value: 'Instructor', 
      label: 'Instructor', 
      description: 'Create and teach courses to students',
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600',
      features: ['Course creation tools', 'Student analytics', 'Revenue sharing', 'Teaching resources']
    },
    { 
      value: 'Mentor', 
      label: 'Mentor', 
      description: 'Guide students in the KSMP program',
      icon: RocketLaunchIcon,
      color: 'from-purple-500 to-purple-600',
      features: ['Mentorship tools', 'Startup guidance', 'Network access', 'Impact tracking']
    },
    { 
      value: 'Investor', 
      label: 'Investor', 
      description: 'Access investment opportunities and demos',
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-yellow-600',
      features: ['Startup portfolio', 'Deal pipeline', 'Demo day access', 'Investment analytics']
    },
  ];

  const stats = [
    { icon: StarIcon, value: '50K+', label: 'Students' },
    { icon: TrophyIcon, value: '500+', label: 'Courses' },
    { icon: ChartBarIcon, value: '95%', label: 'Success Rate' },
    { icon: RocketLaunchIcon, value: '200+', label: 'Startups' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-pink-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Features & Stats */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-center">
          <div className="max-w-md">
                <div className="flex items-center mb-8">
                  <Image
                    src={kalplaLogoWhite}
                    alt="Kalpla Logo"
                    width={120}
                    height={36}
                    className="h-10 w-auto"
                  />
                </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Start your journey to success
            </h2>
            
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of learners, creators, and entrepreneurs building the future
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-indigo-100">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Alex Chen</div>
                  <div className="text-indigo-100 text-sm">Student & Entrepreneur</div>
                </div>
              </div>
              <p className="text-indigo-100 italic">
                "Kalpla transformed my career. The mentorship program helped me launch my startup and raise $2M in funding."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center mb-8">
                  <Image
                    src={kalplaLogo}
                    alt="Kalpla Logo"
                    width={120}
                    height={36}
                    className="h-8 w-auto"
                  />
                </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Join Kalpla Today
                </h2>
                <p className="text-gray-600">
                  Choose your role and start your journey
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose your role
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <label
                      key={role.value}
                      className={`relative flex cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                        selectedRole === role.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={selectedRole === role.value}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center mr-3`}>
                            <role.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="font-semibold text-gray-900">{role.label}</div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{role.description}</div>
                        <div className="space-y-1">
                          {role.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-500">
                              <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedRole === role.value && (
                        <div className="flex-shrink-0 ml-4">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <Authenticator
                hideSignUp={false}
                components={{
                  SignUp: {
                    Header() {
                      return (
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SparklesIcon className="h-8 w-8 text-white" />
                          </div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            Join as a {selectedRole}
                          </h1>
                          <p className="text-gray-600 mt-2">
                            Create your account and start your journey
                          </p>
                        </div>
                      );
                    },
                    Footer() {
                      return (
                        <div className="mt-6 text-center">
                          <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                              href="/auth/signin"
                              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                              Sign in here
                            </Link>
                          </p>
                        </div>
                      );
                    },
                  },
                }}
              >
                {({ signOut, user }) => {
                  if (user) {
                    // Redirect to dashboard after successful sign up
                    router.push('/dashboard');
                  }
                  return null;
                }}
              </Authenticator>

              {/* Additional Options */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    <span className="ml-2">Twitter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

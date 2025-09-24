'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  UsersIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export default function OnboardingLandingPage() {
  const router = useRouter();

  const onboardingOptions = [
    {
      id: 'student',
      title: 'Student Onboarding',
      description: 'Join as a learner and start your educational journey',
      icon: AcademicCapIcon,
      color: 'blue',
      features: [
        'Personalized learning paths',
        'Access to expert mentors',
        'Interactive courses',
        'Community support',
        'Career guidance'
      ],
      buttonText: 'Start Learning',
      route: '/student-onboarding'
    },
    {
      id: 'mentor',
      title: 'Mentor Application',
      description: 'Share your expertise and guide aspiring learners',
      icon: StarIcon,
      color: 'purple',
      features: [
        'Flexible mentoring schedule',
        'Student matching system',
        'Professional development',
        'Recognition program',
        'Networking opportunities'
      ],
      buttonText: 'Apply as Mentor',
      route: '/mentor-onboarding'
    },
    {
      id: 'investor',
      title: 'Investor Application',
      description: 'Invest in innovative startups and support entrepreneurship',
      icon: CurrencyDollarIcon,
      color: 'green',
      features: [
        'Vetted startup opportunities',
        'Due diligence reports',
        'Direct founder access',
        'Portfolio tracking',
        'Investor network'
      ],
      buttonText: 'Start Investing',
      route: '/investor-onboarding'
    }
  ];

  const benefits = [
    {
      icon: UsersIcon,
      title: 'Expert Community',
      description: 'Connect with industry professionals, mentors, and fellow learners'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovative Learning',
      description: 'Cutting-edge courses and hands-on projects to accelerate your growth'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Career Growth',
      description: 'From skill development to startup investments, we support your journey'
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Assurance',
      description: 'Rigorous vetting ensures high-quality mentors and investment opportunities'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          accent: 'text-purple-600'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
          accent: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          accent: 'text-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Kalpla</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Kalpla</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose your path and join our community of learners, mentors, and investors. 
            Start your journey towards success today.
          </p>
        </div>

        {/* Onboarding Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {onboardingOptions.map((option) => {
            const colors = getColorClasses(option.color);
            return (
              <div
                key={option.id}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="text-center mb-6">
                  <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${colors.bg} mb-4`}>
                    <option.icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => router.push(option.route)}
                  className={`w-full ${colors.button} text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                >
                  {option.buttonText}
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Kalpla?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Expert Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Investment Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners, mentors, and investors who are already part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/student-onboarding')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Start Learning
            </button>
            <button
              onClick={() => router.push('/mentor-onboarding')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Become a Mentor
            </button>
            <button
              onClick={() => router.push('/investor-onboarding')}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Start Investing
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-600">Kalpla</span>
            </div>
            <p className="text-gray-500">
              Empowering learners, mentors, and investors to achieve their goals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

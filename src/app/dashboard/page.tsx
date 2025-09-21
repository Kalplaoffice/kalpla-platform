'use client';

import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ClockIcon,
  TrophyIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();
  const { getDashboardRoute } = useRoleBasedAccess();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== '/dashboard') {
        router.push(dashboardRoute);
      }
    }
  }, [user, getDashboardRoute, router]);

  const getRoleDashboard = (role: string) => {
    switch (role) {
      case 'Student':
        return <StudentDashboard />;
      case 'Instructor':
        return <InstructorDashboard />;
      case 'Mentor':
        return <MentorDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'Investor':
        return <InvestorDashboard />;
      default:
        return <GuestDashboard />;
    }
  };

  return (
    <Authenticator>
      {({ signOut, user: authUser }) => {
        if (!authUser) return null;
        
        const userRole = authUser.signInDetails?.loginId || 'Guest';
        
        return (
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {authUser.signInDetails?.loginId || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your {userRole.toLowerCase()} account.
              </p>
            </div>

            {getRoleDashboard(userRole)}
          </div>
        );
      }}
    </Authenticator>
  );
}

function StudentDashboard() {
  const stats = [
    { name: 'Courses Enrolled', value: '5', icon: BookOpenIcon },
    { name: 'Programs Completed', value: '2', icon: AcademicCapIcon },
    { name: 'Assignments Submitted', value: '12', icon: DocumentTextIcon },
    { name: 'Current KSMP Phase', value: 'Phase 3', icon: TrophyIcon },
  ];

  const recentActivity = [
    { title: 'Completed "React Fundamentals"', time: '2 hours ago', type: 'course' },
    { title: 'Submitted Assignment: Project Proposal', time: '1 day ago', type: 'assignment' },
    { title: 'Attended Live Session: Startup Funding', time: '2 days ago', type: 'session' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <stat.icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/courses"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span>Browse Courses</span>
          </Link>
          <Link
            href="/assignments"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
            <span>View Assignments</span>
          </Link>
          <Link
            href="/gradebook"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>View Gradebook</span>
          </Link>
          <Link
            href="/ksmp"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <TrophyIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>KSMP Progress</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-900">{activity.title}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstructorDashboard() {
  const stats = [
    { name: 'Courses Created', value: '8', icon: BookOpenIcon },
    { name: 'Total Students', value: '245', icon: UserGroupIcon },
    { name: 'Monthly Earnings', value: '$2,450', icon: ChartBarIcon },
    { name: 'Average Rating', value: '4.8', icon: TrophyIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <stat.icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/instructor/courses/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <BookOpenIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span>Create Course</span>
          </Link>
          <Link
            href="/instructor/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
            <span>View Analytics</span>
          </Link>
          <Link
            href="/instructor/earnings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <TrophyIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>Earnings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MentorDashboard() {
  const stats = [
    { name: 'Active Cohorts', value: '3', icon: UserGroupIcon },
    { name: 'Total Mentees', value: '45', icon: UserGroupIcon },
    { name: 'Live Sessions', value: '12', icon: CalendarIcon },
    { name: 'KSMP Phase', value: 'Phase 8', icon: TrophyIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <stat.icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/mentor/cohorts"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span>Manage Cohorts</span>
          </Link>
          <Link
            href="/mentor/sessions"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <CalendarIcon className="h-6 w-6 text-green-600 mr-3" />
            <span>Schedule Session</span>
          </Link>
          <Link
            href="/mentor/grading"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <DocumentTextIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>Grade Assignments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '1,250', icon: UserGroupIcon },
    { name: 'Pending Approvals', value: '8', icon: ClockIcon },
    { name: 'Active Courses', value: '156', icon: BookOpenIcon },
    { name: 'Revenue', value: '$45,230', icon: ChartBarIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <stat.icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/approvals"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span>Pending Approvals</span>
          </Link>
          <Link
            href="/admin/programs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <AcademicCapIcon className="h-6 w-6 text-green-600 mr-3" />
            <span>Manage Programs</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>Platform Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function InvestorDashboard() {
  const stats = [
    { name: 'Active Cohorts', value: '12', icon: UserGroupIcon },
    { name: 'Investment Opportunities', value: '8', icon: ChartBarIcon },
    { name: 'Demo Days Attended', value: '3', icon: CalendarIcon },
    { name: 'Portfolio Companies', value: '5', icon: TrophyIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <stat.icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/investor/opportunities"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span>Investment Opportunities</span>
          </Link>
          <Link
            href="/investor/demo-days"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <CalendarIcon className="h-6 w-6 text-green-600 mr-3" />
            <span>Demo Days</span>
          </Link>
          <Link
            href="/investor/portfolio"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <TrophyIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span>Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GuestDashboard() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to Kalpla!
      </h2>
      <p className="text-gray-600 mb-8">
        Sign up or sign in to access your personalized dashboard.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          href="/auth/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Sign Up
        </Link>
        <Link
          href="/auth/signin"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

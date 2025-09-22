'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  VideoCameraIcon,
  BellIcon,
  CogIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  {
    name: 'Users',
    icon: UsersIcon,
    children: [
      { name: 'Students', href: '/admin/users/students' },
      { name: 'Mentors', href: '/admin/users/mentors' },
      { name: 'Investors', href: '/admin/users/investors' }
    ]
  },
  {
    name: 'Courses',
    icon: BookOpenIcon,
    children: [
      { name: 'All Courses', href: '/admin/courses' },
      { name: 'Lessons', href: '/admin/courses/lessons' },
      { name: 'Approvals', href: '/admin/courses/approvals' }
    ]
  },
  {
    name: 'KSMP',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: 'Applications', href: '/admin/ksmp/applications' },
      { name: 'Cohorts', href: '/admin/ksmp/cohorts' }
    ]
  },
  {
    name: 'Programs',
    icon: AcademicCapIcon,
    children: [
      { name: 'Degree Programs', href: '/admin/programs/degree-programs' },
      { name: 'Programs & Investors', href: '/admin/programs' }
    ]
  },
  { name: 'Assignments & Grading', href: '/admin/assignments', icon: DocumentTextIcon },
      { name: 'Blog Management', href: '/admin/blog', icon: PencilSquareIcon },
      { name: 'Blog Analytics', href: '/admin/blog/analytics', icon: ChartBarIcon },
  { name: 'Payments & Revenue', href: '/admin/payments', icon: CurrencyDollarIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Approvals & Moderation', href: '/admin/approvals', icon: CheckBadgeIcon },
  { name: 'Video Deployment', href: '/admin/videos', icon: VideoCameraIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Settings & Security', href: '/admin/settings', icon: CogIcon }
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Kalpla Admin</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md">
                      <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                      {item.name}
                    </div>
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`
                            block px-3 py-2 text-sm rounded-md transition-colors
                            ${pathname === child.href
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@kalpla.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

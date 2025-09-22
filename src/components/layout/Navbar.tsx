'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  BookOpenIcon,
  AcademicCapIcon as GraduationCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserGroupIcon,
  NewspaperIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useUser();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation items for both logged in and logged out users
  const navigationItems = [
    { name: 'Courses', href: '/courses', icon: BookOpenIcon },
    { name: 'Degree Programs', href: '/degree-programs', icon: GraduationCapIcon },
    { name: 'Blog', href: '/blog', icon: NewspaperIcon },
  ];

  // Simplified navigation for authenticated users
  const getRoleBasedNavigation = () => {
    return [
      { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
      { name: 'Profile', href: '/profile', icon: UserIcon },
    ];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Always show navigation items regardless of authentication status
  const navigation = navigationItems;
  const userRole = user?.signInDetails?.loginId || 'Guest';
  const roleBasedNavigation = user ? getRoleBasedNavigation() : [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Student':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'Instructor':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'Mentor':
        return <UsersIcon className="h-5 w-5" />;
      case 'Admin':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'Investor':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50 font-['Poppins']">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src={kalplaLogo}
                  alt="Kalpla Logo"
                  width={120}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors font-['Poppins']"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - Centered */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:max-w-md">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search courses..."
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition-colors font-['Poppins'] ${
                    isSearchFocused 
                      ? 'border-blue-500 ring-1 ring-blue-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
              </div>
            </form>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4" ref={dropdownRef}>
                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    
                    {/* User Info */}
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium font-['Poppins']">
                        {user.signInDetails?.loginId || 'Guest'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize font-['Poppins']">
                        {userRole}
                      </div>
                    </div>
                    
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>

                  {activeDropdown === 'user' && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {roleBasedNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-['Poppins']"
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-200">
                          <button
                            onClick={async () => {
                              try {
                                await signOut();
                                router.push('/');
                                setActiveDropdown(null);
                              } catch (error) {
                                console.error('Error signing out:', error);
                              }
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-['Poppins']"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors font-['Poppins']"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors font-['Poppins']"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {/* Mobile Search Bar */}
          <div className="px-4 py-3 border-b border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          </div>
          
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors font-['Poppins']"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            {user ? (
              <div className="space-y-3">
                {/* Mobile Role-based Navigation */}
                <div className="space-y-1">
                  {roleBasedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors font-['Poppins']"
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      try {
                        await signOut();
                        router.push('/');
                        setIsOpen(false);
                      } catch (error) {
                        console.error('Error signing out:', error);
                      }
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors font-['Poppins']"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors font-['Poppins']"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors text-center font-['Poppins']"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

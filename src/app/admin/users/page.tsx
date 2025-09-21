'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'Student' | 'Instructor' | 'Mentor' | 'Admin' | 'Investor';
  status: 'active' | 'suspended' | 'banned' | 'pending';
  instructorStatus?: 'pending' | 'approved' | 'rejected';
  mentorStatus?: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalCourses: number;
  totalEnrollments: number;
  profilePicture?: string;
}

export default function UsersPage() {
  const { isAdmin } = useRoleBasedAccess();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'promote' | 'demote' | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'rahul.sharma@email.com',
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        role: 'Student',
        status: 'active',
        isVerified: true,
        mfaEnabled: false,
        createdAt: '2024-01-15T10:30:00Z',
        lastLoginAt: '2024-01-20T14:30:00Z',
        totalCourses: 3,
        totalEnrollments: 3
      },
      {
        id: '2',
        email: 'jane.smith@email.com',
        name: 'Jane Smith',
        phone: '+91 9876543211',
        role: 'Instructor',
        status: 'active',
        instructorStatus: 'approved',
        isVerified: true,
        mfaEnabled: true,
        createdAt: '2024-01-10T09:15:00Z',
        lastLoginAt: '2024-01-20T16:45:00Z',
        totalCourses: 2,
        totalEnrollments: 0
      },
      {
        id: '3',
        email: 'mike.johnson@email.com',
        name: 'Mike Johnson',
        phone: '+91 9876543212',
        role: 'Mentor',
        status: 'active',
        mentorStatus: 'approved',
        isVerified: true,
        mfaEnabled: false,
        createdAt: '2024-01-08T14:20:00Z',
        lastLoginAt: '2024-01-19T11:30:00Z',
        totalCourses: 0,
        totalEnrollments: 0
      },
      {
        id: '4',
        email: 'sarah.wilson@email.com',
        name: 'Sarah Wilson',
        phone: '+91 9876543213',
        role: 'Instructor',
        status: 'suspended',
        instructorStatus: 'pending',
        isVerified: true,
        mfaEnabled: false,
        createdAt: '2024-01-12T16:45:00Z',
        lastLoginAt: '2024-01-18T09:20:00Z',
        totalCourses: 1,
        totalEnrollments: 0
      },
      {
        id: '5',
        email: 'alex.brown@email.com',
        name: 'Alex Brown',
        phone: '+91 9876543214',
        role: 'Student',
        status: 'banned',
        isVerified: false,
        mfaEnabled: false,
        createdAt: '2024-01-05T12:30:00Z',
        lastLoginAt: '2024-01-15T10:15:00Z',
        totalCourses: 0,
        totalEnrollments: 0
      },
      {
        id: '6',
        email: 'priya.patel@email.com',
        name: 'Priya Patel',
        phone: '+91 9876543215',
        role: 'Student',
        status: 'active',
        isVerified: true,
        mfaEnabled: true,
        createdAt: '2024-01-14T11:20:00Z',
        lastLoginAt: '2024-01-20T08:30:00Z',
        totalCourses: 2,
        totalEnrollments: 2
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'suspended':
        return 'text-yellow-600 bg-yellow-100';
      case 'banned':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'suspended':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'banned':
        return <XCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Student':
        return <UsersIcon className="h-4 w-4" />;
      case 'Instructor':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'Mentor':
        return <UserGroupIcon className="h-4 w-4" />;
      case 'Admin':
        return <ShieldCheckIcon className="h-4 w-4" />;
      case 'Investor':
        return <ShieldExclamationIcon className="h-4 w-4" />;
      default:
        return <UsersIcon className="h-4 w-4" />;
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'promote' | 'demote') => {
    // TODO: Implement actual user action API call
    console.log(`${action} user:`, userId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'suspend':
            return { ...user, status: 'suspended' };
          case 'ban':
            return { ...user, status: 'banned' };
          case 'promote':
            // Logic for role promotion
            return user;
          case 'demote':
            // Logic for role demotion
            return user;
          default:
            return user;
        }
      }
      return user;
    }));
    
    setShowActionModal(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const getRoleHierarchy = (currentRole: string) => {
    const hierarchy = ['Student', 'Instructor', 'Mentor', 'Admin'];
    const currentIndex = hierarchy.indexOf(currentRole);
    
    return {
      canPromote: currentIndex < hierarchy.length - 1,
      canDemote: currentIndex > 0,
      nextRole: hierarchy[currentIndex + 1],
      prevRole: hierarchy[currentIndex - 1]
    };
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage users, roles, and account status</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Banned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.status === 'banned').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Mentor">Mentor</option>
                <option value="Admin">Admin</option>
                <option value="Investor">Investor</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const roleHierarchy = getRoleHierarchy(user.role);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 text-sm text-gray-900">{user.role}</span>
                        </div>
                        {user.instructorStatus && (
                          <div className="text-xs text-gray-500 mt-1">
                            Instructor: {user.instructorStatus}
                          </div>
                        )}
                        {user.mentorStatus && (
                          <div className="text-xs text-gray-500 mt-1">
                            Mentor: {user.mentorStatus}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isVerified ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          {user.mfaEnabled && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                              MFA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.totalCourses} courses
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.totalEnrollments} enrollments
                        </div>
                        {user.lastLoginAt && (
                          <div className="text-xs text-gray-500">
                            Last: {formatDate(user.lastLoginAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          {user.status === 'active' && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType('suspend');
                                setShowActionModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <ExclamationTriangleIcon className="h-4 w-4" />
                            </button>
                          )}
                          {user.status === 'suspended' && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType('ban');
                                setShowActionModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                          {roleHierarchy.canPromote && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType('promote');
                                setShowActionModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowUserModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-xl font-medium text-white">
                          {selectedUser.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        {selectedUser.phone && (
                          <p className="text-sm text-gray-500">{selectedUser.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="text-sm text-gray-900">{selectedUser.role}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                          {getStatusIcon(selectedUser.status)}
                          <span className="ml-1">{selectedUser.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                        <p className="text-sm text-gray-900">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">MFA Enabled</label>
                        <p className="text-sm text-gray-900">{selectedUser.mfaEnabled ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    {selectedUser.instructorStatus && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Instructor Status</label>
                        <p className="text-sm text-gray-900">{selectedUser.instructorStatus}</p>
                      </div>
                    )}

                    {selectedUser.mentorStatus && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mentor Status</label>
                        <p className="text-sm text-gray-900">{selectedUser.mentorStatus}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Courses</label>
                        <p className="text-sm text-gray-900">{selectedUser.totalCourses}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Enrollments</label>
                        <p className="text-sm text-gray-900">{selectedUser.totalEnrollments}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Joined</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      {selectedUser.lastLoginAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Login</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedUser.lastLoginAt)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Edit User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation Modal */}
        {showActionModal && selectedUser && actionType && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowActionModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Confirm Action
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to {actionType} user <strong>{selectedUser.name}</strong>?
                    </p>
                    
                    {actionType === 'promote' && (
                      <p className="text-sm text-gray-600">
                        This will promote the user from <strong>{selectedUser.role}</strong> to <strong>{getRoleHierarchy(selectedUser.role).nextRole}</strong>.
                      </p>
                    )}
                    
                    {actionType === 'demote' && (
                      <p className="text-sm text-gray-600">
                        This will demote the user from <strong>{selectedUser.role}</strong> to <strong>{getRoleHierarchy(selectedUser.role).prevRole}</strong>.
                      </p>
                    )}
                    
                    {actionType === 'suspend' && (
                      <p className="text-sm text-gray-600">
                        This will suspend the user's account. They will not be able to access the platform.
                      </p>
                    )}
                    
                    {actionType === 'ban' && (
                      <p className="text-sm text-gray-600">
                        This will permanently ban the user's account. This action cannot be undone.
                      </p>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUserAction(selectedUser.id, actionType)}
                        className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                          actionType === 'ban' 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : actionType === 'suspend'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Confirm {actionType}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

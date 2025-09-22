'use client';

import { useState, useEffect } from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  EyeIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface CourseApproval {
  id: string;
  title: string;
  instructor: string;
  category: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  duration: string;
  level: string;
  price: number;
}

export default function CourseApprovalsPage() {
  const { user } = useRoleBasedAccess();
  const [approvals, setApprovals] = useState<CourseApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockApprovals: CourseApproval[] = [
      {
        id: '1',
        title: 'Advanced React Development',
        instructor: 'Dr. Sarah Johnson',
        category: 'Web Development',
        submittedDate: '2024-01-15',
        status: 'pending',
        description: 'Comprehensive course covering advanced React concepts, hooks, and state management.',
        duration: '8 weeks',
        level: 'Intermediate',
        price: 299
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        instructor: 'Prof. Michael Chen',
        category: 'Data Science',
        submittedDate: '2024-01-12',
        status: 'approved',
        description: 'Introduction to machine learning algorithms and practical applications.',
        duration: '12 weeks',
        level: 'Beginner',
        price: 399
      },
      {
        id: '3',
        title: 'Digital Marketing Strategy',
        instructor: 'Lisa Rodriguez',
        category: 'Marketing',
        submittedDate: '2024-01-10',
        status: 'rejected',
        description: 'Complete guide to digital marketing strategies and campaign management.',
        duration: '6 weeks',
        level: 'Beginner',
        price: 199
      }
    ];
    
    setApprovals(mockApprovals);
    setLoading(false);
  }, []);

  const filteredApprovals = selectedStatus === 'all' 
    ? approvals 
    : approvals.filter(approval => approval.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleApproval = (id: string, action: 'approve' | 'reject') => {
    setApprovals(prev => 
      prev.map(approval => 
        approval.id === id 
          ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
          : approval
      )
    );
  };

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
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Course Approvals
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and approve course submissions from instructors
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Reviews
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {approvals.filter(a => a.status === 'pending').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {approvals.filter(a => a.status === 'approved').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejected
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {approvals.filter(a => a.status === 'rejected').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {approvals.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({approvals.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({approvals.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({approvals.filter(a => a.status === 'approved').length})
            </button>
            <button
              onClick={() => setSelectedStatus('rejected')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({approvals.filter(a => a.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredApprovals.map((approval) => (
              <li key={approval.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(approval.status)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {approval.title}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                            {approval.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p className="truncate">{approval.instructor}</p>
                          <span className="mx-2">•</span>
                          <p className="truncate">{approval.category}</p>
                          <span className="mx-2">•</span>
                          <p className="truncate">₹{approval.price}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {approval.description}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1 h-3 w-3" />
                          <p>Submitted: {new Date(approval.submittedDate).toLocaleDateString()}</p>
                          <span className="mx-2">•</span>
                          <p>{approval.duration}</p>
                          <span className="mx-2">•</span>
                          <p>{approval.level}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Review
                      </button>
                      {approval.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(approval.id, 'approve')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(approval.id, 'reject')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === 'all' 
                ? 'No courses have been submitted for approval yet.'
                : `No courses with status "${selectedStatus}" found.`
              }
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

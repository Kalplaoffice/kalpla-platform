'use client';

import { useParams } from 'next/navigation';
import { StudentLayout } from '@/components/student/StudentLayout';
import { ResponsiveLMSCourseView } from '@/components/lms/ResponsiveLMSCourseView';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CoursePage() {
  const params = useParams();
  const { isStudent } = useRoleBasedAccess();
  const courseId = params.courseId as string;

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this course.</p>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout>
      <ResponsiveLMSCourseView courseId={courseId} className="h-screen" />
    </StudentLayout>
  );
}

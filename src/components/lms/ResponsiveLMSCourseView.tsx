'use client';

import { useState, useEffect } from 'react';
import { LMSCourseView } from './LMSCourseView';
import { MobileLMSCourseView } from './MobileLMSCourseView';

interface ResponsiveLMSCourseViewProps {
  courseId: string;
  className?: string;
}

export function ResponsiveLMSCourseView({ courseId, className = '' }: ResponsiveLMSCourseViewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return <MobileLMSCourseView courseId={courseId} className={className} />;
  }

  return <LMSCourseView courseId={courseId} className={className} />;
}

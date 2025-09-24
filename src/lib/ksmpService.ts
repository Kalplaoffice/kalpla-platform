import { enrollmentService, Enrollment } from './enrollmentService';

export interface KSMPPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  duration: string; // e.g., "4 weeks"
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'current' | 'completed' | 'locked';
  progress: number; // 0-100
  requirements: {
    assignments: number;
    liveSessions: number;
    mentorMeetings: number;
    projects: number;
  };
  completed: {
    assignments: number;
    liveSessions: number;
    mentorMeetings: number;
    projects: number;
  };
  mentors: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  resources: {
    id: string;
    title: string;
    type: 'video' | 'document' | 'link' | 'quiz';
    url: string;
    completed: boolean;
  }[];
}

export interface KSMPAssignment {
  id: string;
  phaseId: string;
  phaseName: string;
  title: string;
  description: string;
  type: 'homework' | 'project' | 'quiz' | 'presentation' | 'research';
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  grade?: number;
  maxGrade: number;
  feedback?: string;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  submission?: {
    id: string;
    content: string;
    attachments: string[];
    submittedAt: string;
  };
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  phaseId: string;
  phaseName: string;
  scheduledDate: string;
  duration: number; // minutes
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  meetingUrl?: string;
  recordingUrl?: string;
  attendees: number;
  maxAttendees: number;
  topics: string[];
  prerequisites: string[];
  materials: {
    id: string;
    title: string;
    type: 'document' | 'video' | 'link';
    url: string;
  }[];
}

export interface MentorMeeting {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  scheduledDate: string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingUrl?: string;
  agenda: string[];
  notes?: string;
  actionItems: {
    id: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }[];
  feedback?: string;
}

export interface KSMPProgress {
  overallProgress: number; // 0-100
  currentPhase: number;
  completedPhases: number;
  totalPhases: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  liveSessionsAttended: number;
  totalLiveSessions: number;
  mentorMeetingsCompleted: number;
  totalMentorMeetings: number;
  projectsCompleted: number;
  totalProjects: number;
  gpa: number;
  attendanceRate: number;
  estimatedCompletion: string;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
}

class KSMPService {
  private phases: KSMPPhase[] = [];
  private assignments: KSMPAssignment[] = [];
  private liveClasses: LiveClass[] = [];
  private mentorMeetings: MentorMeeting[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock KSMP phases
    this.phases = [
      {
        id: 'phase_1',
        name: 'Foundation & Orientation',
        description: 'Introduction to KSMP, goal setting, and foundational concepts',
        order: 1,
        duration: '2 weeks',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-29T00:00:00Z',
        status: 'completed',
        progress: 100,
        requirements: {
          assignments: 3,
          liveSessions: 4,
          mentorMeetings: 2,
          projects: 1
        },
        completed: {
          assignments: 3,
          liveSessions: 4,
          mentorMeetings: 2,
          projects: 1
        },
        mentors: [
          { id: 'mentor_1', name: 'Dr. Sarah Johnson', role: 'Academic Mentor' },
          { id: 'mentor_2', name: 'Prof. Michael Chen', role: 'Industry Mentor' }
        ],
        resources: [
          { id: 'res_1', title: 'KSMP Orientation Guide', type: 'document', url: '/resources/orientation.pdf', completed: true },
          { id: 'res_2', title: 'Goal Setting Workshop', type: 'video', url: '/resources/goal-setting.mp4', completed: true }
        ]
      },
      {
        id: 'phase_2',
        name: 'Core Learning & Skill Development',
        description: 'Deep dive into core subjects and skill development',
        order: 2,
        duration: '6 weeks',
        startDate: '2024-01-30T00:00:00Z',
        endDate: '2024-03-12T00:00:00Z',
        status: 'current',
        progress: 65,
        requirements: {
          assignments: 8,
          liveSessions: 12,
          mentorMeetings: 6,
          projects: 3
        },
        completed: {
          assignments: 5,
          liveSessions: 8,
          mentorMeetings: 4,
          projects: 2
        },
        mentors: [
          { id: 'mentor_1', name: 'Dr. Sarah Johnson', role: 'Academic Mentor' },
          { id: 'mentor_3', name: 'Dr. Emily Rodriguez', role: 'Research Mentor' }
        ],
        resources: [
          { id: 'res_3', title: 'Core Concepts Handbook', type: 'document', url: '/resources/core-concepts.pdf', completed: true },
          { id: 'res_4', title: 'Skill Assessment Quiz', type: 'quiz', url: '/resources/skill-assessment', completed: false }
        ]
      },
      {
        id: 'phase_3',
        name: 'Advanced Application & Projects',
        description: 'Advanced projects and real-world applications',
        order: 3,
        duration: '4 weeks',
        startDate: '2024-03-13T00:00:00Z',
        endDate: '2024-04-10T00:00:00Z',
        status: 'upcoming',
        progress: 0,
        requirements: {
          assignments: 4,
          liveSessions: 8,
          mentorMeetings: 4,
          projects: 2
        },
        completed: {
          assignments: 0,
          liveSessions: 0,
          mentorMeetings: 0,
          projects: 0
        },
        mentors: [
          { id: 'mentor_2', name: 'Prof. Michael Chen', role: 'Industry Mentor' },
          { id: 'mentor_4', name: 'Dr. Alex Kumar', role: 'Project Mentor' }
        ],
        resources: [
          { id: 'res_5', title: 'Advanced Project Guidelines', type: 'document', url: '/resources/advanced-projects.pdf', completed: false },
          { id: 'res_6', title: 'Industry Case Studies', type: 'link', url: '/resources/case-studies', completed: false }
        ]
      },
      {
        id: 'phase_4',
        name: 'Capstone & Presentation',
        description: 'Final capstone project and presentation',
        order: 4,
        duration: '3 weeks',
        startDate: '2024-04-11T00:00:00Z',
        endDate: '2024-05-01T00:00:00Z',
        status: 'locked',
        progress: 0,
        requirements: {
          assignments: 2,
          liveSessions: 4,
          mentorMeetings: 3,
          projects: 1
        },
        completed: {
          assignments: 0,
          liveSessions: 0,
          mentorMeetings: 0,
          projects: 0
        },
        mentors: [
          { id: 'mentor_1', name: 'Dr. Sarah Johnson', role: 'Academic Mentor' },
          { id: 'mentor_2', name: 'Prof. Michael Chen', role: 'Industry Mentor' }
        ],
        resources: [
          { id: 'res_7', title: 'Capstone Project Template', type: 'document', url: '/resources/capstone-template.pdf', completed: false },
          { id: 'res_8', title: 'Presentation Guidelines', type: 'video', url: '/resources/presentation-guide.mp4', completed: false }
        ]
      }
    ];

    // Mock assignments
    this.assignments = [
      {
        id: 'assign_1',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        title: 'Data Structures Implementation',
        description: 'Implement and analyze various data structures including arrays, linked lists, and trees.',
        type: 'project',
        dueDate: '2024-02-15T23:59:00Z',
        status: 'submitted',
        grade: 85,
        maxGrade: 100,
        feedback: 'Good implementation with clear documentation. Consider optimizing the tree traversal algorithm.',
        attachments: [
          { id: 'att_1', name: 'assignment_requirements.pdf', url: '/assignments/requirements.pdf', type: 'pdf' }
        ],
        submission: {
          id: 'sub_1',
          content: 'Implemented all required data structures with comprehensive testing.',
          attachments: ['/submissions/data-structures.zip'],
          submittedAt: '2024-02-14T18:30:00Z'
        }
      },
      {
        id: 'assign_2',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        title: 'Algorithm Analysis Quiz',
        description: 'Multiple choice quiz covering time complexity, space complexity, and algorithm analysis.',
        type: 'quiz',
        dueDate: '2024-02-20T23:59:00Z',
        status: 'graded',
        grade: 92,
        maxGrade: 100,
        feedback: 'Excellent understanding of algorithmic concepts.',
        attachments: [
          { id: 'att_2', name: 'quiz_instructions.pdf', url: '/assignments/quiz-instructions.pdf', type: 'pdf' }
        ]
      },
      {
        id: 'assign_3',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        title: 'Research Paper Review',
        description: 'Review and analyze a recent research paper in computer science.',
        type: 'homework',
        dueDate: '2024-02-25T23:59:00Z',
        status: 'in-progress',
        maxGrade: 100,
        attachments: [
          { id: 'att_3', name: 'research_paper.pdf', url: '/assignments/research-paper.pdf', type: 'pdf' },
          { id: 'att_4', name: 'review_template.docx', url: '/assignments/review-template.docx', type: 'docx' }
        ]
      }
    ];

    // Mock live classes
    this.liveClasses = [
      {
        id: 'class_1',
        title: 'Advanced Data Structures',
        description: 'Deep dive into advanced data structures and their applications',
        instructor: {
          id: 'instructor_1',
          name: 'Dr. Sarah Johnson',
          avatar: '/avatars/sarah-johnson.jpg'
        },
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        scheduledDate: '2024-02-18T14:00:00Z',
        duration: 90,
        status: 'upcoming',
        meetingUrl: 'https://meet.kalpla.edu/advanced-ds',
        attendees: 25,
        maxAttendees: 30,
        topics: ['Red-Black Trees', 'B-Trees', 'Hash Tables', 'Graph Algorithms'],
        prerequisites: ['Basic Data Structures', 'Algorithm Analysis'],
        materials: [
          { id: 'mat_1', title: 'Class Slides', type: 'document', url: '/materials/advanced-ds-slides.pdf' },
          { id: 'mat_2', title: 'Practice Problems', type: 'document', url: '/materials/practice-problems.pdf' }
        ]
      },
      {
        id: 'class_2',
        title: 'System Design Fundamentals',
        description: 'Introduction to system design principles and patterns',
        instructor: {
          id: 'instructor_2',
          name: 'Prof. Michael Chen',
          avatar: '/avatars/michael-chen.jpg'
        },
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        scheduledDate: '2024-02-20T16:00:00Z',
        duration: 120,
        status: 'upcoming',
        meetingUrl: 'https://meet.kalpla.edu/system-design',
        attendees: 28,
        maxAttendees: 30,
        topics: ['Scalability', 'Load Balancing', 'Caching Strategies', 'Database Design'],
        prerequisites: ['Database Concepts', 'Networking Basics'],
        materials: [
          { id: 'mat_3', title: 'System Design Patterns', type: 'document', url: '/materials/system-design-patterns.pdf' },
          { id: 'mat_4', title: 'Case Study: Netflix Architecture', type: 'video', url: '/materials/netflix-case-study.mp4' }
        ]
      },
      {
        id: 'class_3',
        title: 'Machine Learning Applications',
        description: 'Practical applications of machine learning in real-world scenarios',
        instructor: {
          id: 'instructor_3',
          name: 'Dr. Emily Rodriguez',
          avatar: '/avatars/emily-rodriguez.jpg'
        },
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        scheduledDate: '2024-02-15T10:00:00Z',
        duration: 90,
        status: 'completed',
        recordingUrl: 'https://recordings.kalpla.edu/ml-applications-2024-02-15',
        attendees: 30,
        maxAttendees: 30,
        topics: ['Supervised Learning', 'Feature Engineering', 'Model Evaluation', 'Deployment'],
        prerequisites: ['Statistics', 'Python Programming'],
        materials: [
          { id: 'mat_5', title: 'ML Workshop Notebook', type: 'document', url: '/materials/ml-workshop.ipynb' },
          { id: 'mat_6', title: 'Dataset', type: 'link', url: '/materials/ml-dataset' }
        ]
      }
    ];

    // Mock mentor meetings
    this.mentorMeetings = [
      {
        id: 'meeting_1',
        mentorId: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        mentorAvatar: '/avatars/sarah-johnson.jpg',
        scheduledDate: '2024-02-22T15:00:00Z',
        duration: 60,
        status: 'scheduled',
        meetingUrl: 'https://meet.kalpla.edu/mentor-sarah',
        agenda: ['Progress Review', 'Assignment Feedback', 'Next Phase Planning'],
        actionItems: [
          { id: 'action_1', description: 'Complete research paper review', dueDate: '2024-02-25T23:59:00Z', completed: false },
          { id: 'action_2', description: 'Prepare for system design class', dueDate: '2024-02-20T16:00:00Z', completed: true }
        ]
      },
      {
        id: 'meeting_2',
        mentorId: 'mentor_2',
        mentorName: 'Prof. Michael Chen',
        mentorAvatar: '/avatars/michael-chen.jpg',
        scheduledDate: '2024-02-10T14:00:00Z',
        duration: 45,
        status: 'completed',
        agenda: ['Career Guidance', 'Industry Insights', 'Project Discussion'],
        notes: 'Discussed career paths in software engineering and current industry trends.',
        actionItems: [
          { id: 'action_3', description: 'Research software engineering roles', dueDate: '2024-02-28T23:59:00Z', completed: false },
          { id: 'action_4', description: 'Update LinkedIn profile', dueDate: '2024-02-20T23:59:00Z', completed: true }
        ],
        feedback: 'Great progress on assignments. Focus on improving documentation skills.'
      }
    ];
  }

  /**
   * Get KSMP phases for a student
   */
  async getKSMPPhases(): Promise<KSMPPhase[]> {
    try {
      return this.phases;
    } catch (error) {
      console.error('Error fetching KSMP phases:', error);
      return [];
    }
  }

  /**
   * Get assignments for a student
   */
  async getKSMPAssignments(): Promise<KSMPAssignment[]> {
    try {
      return this.assignments;
    } catch (error) {
      console.error('Error fetching KSMP assignments:', error);
      return [];
    }
  }

  /**
   * Get live classes for a student
   */
  async getLiveClasses(): Promise<LiveClass[]> {
    try {
      return this.liveClasses;
    } catch (error) {
      console.error('Error fetching live classes:', error);
      return [];
    }
  }

  /**
   * Get mentor meetings for a student
   */
  async getMentorMeetings(): Promise<MentorMeeting[]> {
    try {
      return this.mentorMeetings;
    } catch (error) {
      console.error('Error fetching mentor meetings:', error);
      return [];
    }
  }

  /**
   * Get overall KSMP progress
   */
  async getKSMPProgress(): Promise<KSMPProgress> {
    try {
      const totalAssignments = this.assignments.length;
      const completedAssignments = this.assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length;
      
      const totalLiveSessions = this.liveClasses.length;
      const attendedLiveSessions = this.liveClasses.filter(c => c.status === 'completed').length;
      
      const totalMentorMeetings = this.mentorMeetings.length;
      const completedMentorMeetings = this.mentorMeetings.filter(m => m.status === 'completed').length;

      const completedPhases = this.phases.filter(p => p.status === 'completed').length;
      const currentPhase = this.phases.find(p => p.status === 'current')?.order || 0;

      const overallProgress = Math.round(
        (completedPhases / this.phases.length) * 100
      );

      return {
        overallProgress,
        currentPhase,
        completedPhases,
        totalPhases: this.phases.length,
        assignmentsCompleted: completedAssignments,
        totalAssignments,
        liveSessionsAttended: attendedLiveSessions,
        totalLiveSessions,
        mentorMeetingsCompleted: completedMentorMeetings,
        totalMentorMeetings,
        projectsCompleted: 3, // Mock data
        totalProjects: 7, // Mock data
        gpa: 3.8,
        attendanceRate: 95,
        estimatedCompletion: '2024-05-01T00:00:00Z',
        achievements: [
          {
            id: 'ach_1',
            title: 'First Assignment Complete',
            description: 'Successfully completed your first KSMP assignment',
            icon: 'trophy',
            earnedAt: '2024-01-20T00:00:00Z'
          },
          {
            id: 'ach_2',
            title: 'Perfect Attendance',
            description: 'Attended all live sessions in Phase 1',
            icon: 'star',
            earnedAt: '2024-01-29T00:00:00Z'
          }
        ]
      };
    } catch (error) {
      console.error('Error calculating KSMP progress:', error);
      return {
        overallProgress: 0,
        currentPhase: 1,
        completedPhases: 0,
        totalPhases: 0,
        assignmentsCompleted: 0,
        totalAssignments: 0,
        liveSessionsAttended: 0,
        totalLiveSessions: 0,
        mentorMeetingsCompleted: 0,
        totalMentorMeetings: 0,
        projectsCompleted: 0,
        totalProjects: 0,
        gpa: 0,
        attendanceRate: 0,
        estimatedCompletion: '',
        achievements: []
      };
    }
  }

  /**
   * Get upcoming events (classes, meetings, deadlines)
   */
  async getUpcomingEvents(): Promise<Array<{
    id: string;
    title: string;
    type: 'class' | 'meeting' | 'assignment' | 'deadline';
    date: string;
    time: string;
    status: 'upcoming' | 'live' | 'overdue';
    url?: string;
  }>> {
    try {
      const events: Array<{
        id: string;
        title: string;
        type: 'class' | 'meeting' | 'assignment' | 'deadline';
        date: string;
        time: string;
        status: 'upcoming' | 'live' | 'overdue';
        url?: string;
      }> = [];

      // Add upcoming live classes
      this.liveClasses
        .filter(c => c.status === 'upcoming')
        .forEach(c => {
          events.push({
            id: `class_${c.id}`,
            title: c.title,
            type: 'class',
            date: new Date(c.scheduledDate).toLocaleDateString('en-IN'),
            time: new Date(c.scheduledDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'upcoming',
            url: c.meetingUrl
          });
        });

      // Add upcoming mentor meetings
      this.mentorMeetings
        .filter(m => m.status === 'scheduled')
        .forEach(m => {
          events.push({
            id: `meeting_${m.id}`,
            title: `Meeting with ${m.mentorName}`,
            type: 'meeting',
            date: new Date(m.scheduledDate).toLocaleDateString('en-IN'),
            time: new Date(m.scheduledDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'upcoming',
            url: m.meetingUrl
          });
        });

      // Add upcoming assignment deadlines
      this.assignments
        .filter(a => a.status === 'not-started' || a.status === 'in-progress')
        .forEach(a => {
          events.push({
            id: `assignment_${a.id}`,
            title: a.title,
            type: 'deadline',
            date: new Date(a.dueDate).toLocaleDateString('en-IN'),
            time: new Date(a.dueDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: new Date(a.dueDate) < new Date() ? 'overdue' : 'upcoming'
          });
        });

      // Sort by date
      return events.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format time
   */
  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'locked':
        return 'bg-gray-100 text-gray-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const ksmpService = new KSMPService();

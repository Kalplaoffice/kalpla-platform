import { ksmpService, KSMPPhase, KSMPAssignment, LiveClass, MentorMeeting } from './ksmpService';

export interface Cohort {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';
  maxStudents: number;
  currentStudents: number;
  phases: CohortPhase[];
  mentors: CohortMentor[];
  students: CohortStudent[];
  settings: CohortSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CohortPhase {
  id: string;
  phaseId: string;
  phaseName: string;
  order: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'paused';
  assignments: CohortAssignment[];
  liveClasses: CohortLiveClass[];
  mentorMeetings: CohortMentorMeeting[];
  gradingCriteria: GradingCriteria;
  completionRequirements: CompletionRequirements;
}

export interface CohortAssignment {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  type: 'homework' | 'project' | 'quiz' | 'presentation' | 'research';
  dueDate: string;
  maxGrade: number;
  weight: number; // Weight in phase grading
  submissions: AssignmentSubmission[];
  gradingRubric: GradingRubric;
  statistics: AssignmentStatistics;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  content: string;
  attachments: string[];
  submittedAt: string;
  gradedAt?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface GradingRubric {
  id: string;
  criteria: GradingCriteria[];
  totalPoints: number;
  description: string;
}

export interface GradingCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
}

export interface AssignmentStatistics {
  totalSubmissions: number;
  gradedSubmissions: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  gradeDistribution: {
    range: string;
    count: number;
  }[];
}

export interface CohortLiveClass {
  id: string;
  classId: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  scheduledDate: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  attendance: ClassAttendance[];
  materials: ClassMaterial[];
}

export interface ClassAttendance {
  studentId: string;
  studentName: string;
  attended: boolean;
  joinedAt?: string;
  leftAt?: string;
  duration?: number;
  participation: number; // 0-100
}

export interface ClassMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'quiz';
  url: string;
  downloads: number;
  views: number;
}

export interface CohortMentorMeeting {
  id: string;
  meetingId: string;
  mentorId: string;
  mentorName: string;
  scheduledDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  attendees: MeetingAttendee[];
  agenda: string[];
  notes?: string;
  actionItems: ActionItem[];
}

export interface MeetingAttendee {
  studentId: string;
  studentName: string;
  attended: boolean;
  joinedAt?: string;
  leftAt?: string;
  participation: number; // 0-100
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface CohortMentor {
  id: string;
  mentorId: string;
  name: string;
  email: string;
  role: 'academic' | 'industry' | 'research' | 'project';
  avatar?: string;
  assignedPhases: string[];
  maxStudents: number;
  currentStudents: number;
  workload: number; // 0-100
  performance: MentorPerformance;
}

export interface MentorPerformance {
  averageRating: number;
  totalMeetings: number;
  completedMeetings: number;
  studentSatisfaction: number;
  feedbackScore: number;
}

export interface CohortStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'dropped' | 'suspended';
  progress: StudentProgress;
  grades: StudentGrades;
  attendance: StudentAttendance;
  mentorAssignments: MentorAssignment[];
}

export interface StudentProgress {
  overallProgress: number; // 0-100
  phaseProgress: {
    phaseId: string;
    phaseName: string;
    progress: number;
    completed: boolean;
  }[];
  assignmentsCompleted: number;
  totalAssignments: number;
  liveSessionsAttended: number;
  totalLiveSessions: number;
  mentorMeetingsCompleted: number;
  totalMentorMeetings: number;
  lastActivity: string;
}

export interface StudentGrades {
  overallGPA: number;
  phaseGrades: {
    phaseId: string;
    phaseName: string;
    gpa: number;
    assignments: {
      assignmentId: string;
      title: string;
      grade: number;
      maxGrade: number;
      weight: number;
    }[];
  }[];
  gradeHistory: {
    date: string;
    assignment: string;
    grade: number;
    maxGrade: number;
  }[];
}

export interface StudentAttendance {
  overallAttendance: number; // 0-100
  liveClassAttendance: number;
  mentorMeetingAttendance: number;
  attendanceHistory: {
    date: string;
    type: 'live_class' | 'mentor_meeting';
    attended: boolean;
    duration?: number;
  }[];
}

export interface MentorAssignment {
  mentorId: string;
  mentorName: string;
  role: string;
  assignedDate: string;
  status: 'active' | 'inactive';
}

export interface CohortSettings {
  gradingScale: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  attendanceThreshold: number; // Minimum attendance percentage
  completionThreshold: number; // Minimum completion percentage
  autoGrading: boolean;
  lateSubmissionPenalty: number; // Percentage penalty
  plagiarismDetection: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface CompletionRequirements {
  minAssignmentsCompleted: number;
  minLiveSessionsAttended: number;
  minMentorMeetingsAttended: number;
  minOverallGrade: number;
  minAttendanceRate: number;
}

export interface CohortAnalytics {
  cohortId: string;
  cohortName: string;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  averageGPA: number;
  averageAttendance: number;
  phaseCompletion: {
    phaseId: string;
    phaseName: string;
    completedStudents: number;
    averageGrade: number;
    averageProgress: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  attendanceTrends: {
    date: string;
    attendanceRate: number;
    totalStudents: number;
  }[];
  performanceTrends: {
    date: string;
    averageGPA: number;
    averageProgress: number;
  }[];
}

class CohortService {
  private cohorts: Cohort[] = [];
  private analytics: CohortAnalytics[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock cohorts
    this.cohorts = [
      {
        id: 'cohort_1',
        name: 'KSMP Spring 2024',
        description: 'Spring 2024 cohort focusing on software engineering and data science',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-05-15T00:00:00Z',
        status: 'active',
        maxStudents: 50,
        currentStudents: 35,
        phases: this.generateMockPhases('cohort_1'),
        mentors: this.generateMockMentors(),
        students: this.generateMockStudents('cohort_1'),
        settings: {
          gradingScale: { A: 90, B: 80, C: 70, D: 60, F: 0 },
          attendanceThreshold: 80,
          completionThreshold: 75,
          autoGrading: false,
          lateSubmissionPenalty: 10,
          plagiarismDetection: true,
          notifications: { email: true, sms: true, push: true }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
        createdBy: 'admin_1',
        updatedBy: 'admin_1'
      },
      {
        id: 'cohort_2',
        name: 'KSMP Summer 2024',
        description: 'Summer 2024 cohort with focus on AI/ML and cybersecurity',
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-09-30T00:00:00Z',
        status: 'planning',
        maxStudents: 40,
        currentStudents: 0,
        phases: this.generateMockPhases('cohort_2'),
        mentors: this.generateMockMentors(),
        students: [],
        settings: {
          gradingScale: { A: 90, B: 80, C: 70, D: 60, F: 0 },
          attendanceThreshold: 85,
          completionThreshold: 80,
          autoGrading: true,
          lateSubmissionPenalty: 15,
          plagiarismDetection: true,
          notifications: { email: true, sms: false, push: true }
        },
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
        createdBy: 'admin_1',
        updatedBy: 'admin_1'
      }
    ];

    // Mock analytics
    this.analytics = [
      {
        cohortId: 'cohort_1',
        cohortName: 'KSMP Spring 2024',
        totalStudents: 35,
        activeStudents: 32,
        completedStudents: 0,
        averageProgress: 68,
        averageGPA: 3.4,
        averageAttendance: 87,
        phaseCompletion: [
          { phaseId: 'phase_1', phaseName: 'Foundation & Orientation', completedStudents: 35, averageGrade: 3.6, averageProgress: 100 },
          { phaseId: 'phase_2', phaseName: 'Core Learning & Skill Development', completedStudents: 28, averageGrade: 3.2, averageProgress: 75 },
          { phaseId: 'phase_3', phaseName: 'Advanced Application & Projects', completedStudents: 0, averageGrade: 0, averageProgress: 0 },
          { phaseId: 'phase_4', phaseName: 'Capstone & Presentation', completedStudents: 0, averageGrade: 0, averageProgress: 0 }
        ],
        gradeDistribution: [
          { grade: 'A', count: 8, percentage: 23 },
          { grade: 'B', count: 15, percentage: 43 },
          { grade: 'C', count: 9, percentage: 26 },
          { grade: 'D', count: 2, percentage: 6 },
          { grade: 'F', count: 1, percentage: 3 }
        ],
        attendanceTrends: [
          { date: '2024-01-15', attendanceRate: 95, totalStudents: 35 },
          { date: '2024-01-22', attendanceRate: 92, totalStudents: 35 },
          { date: '2024-01-29', attendanceRate: 88, totalStudents: 35 },
          { date: '2024-02-05', attendanceRate: 90, totalStudents: 35 },
          { date: '2024-02-12', attendanceRate: 87, totalStudents: 35 }
        ],
        performanceTrends: [
          { date: '2024-01-15', averageGPA: 3.2, averageProgress: 15 },
          { date: '2024-01-22', averageGPA: 3.3, averageProgress: 28 },
          { date: '2024-01-29', averageGPA: 3.4, averageProgress: 42 },
          { date: '2024-02-05', averageGPA: 3.4, averageProgress: 55 },
          { date: '2024-02-12', averageGPA: 3.4, averageProgress: 68 }
        ]
      }
    ];
  }

  private generateMockPhases(cohortId: string): CohortPhase[] {
    return [
      {
        id: `cohort_${cohortId}_phase_1`,
        phaseId: 'phase_1',
        phaseName: 'Foundation & Orientation',
        order: 1,
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-29T00:00:00Z',
        status: 'completed',
        assignments: this.generateMockAssignments('phase_1'),
        liveClasses: this.generateMockLiveClasses('phase_1'),
        mentorMeetings: this.generateMockMentorMeetings('phase_1'),
        gradingCriteria: {
          id: 'criteria_1',
          criteria: [
            { id: 'crit_1', name: 'Assignment Completion', description: 'Complete all assignments', maxPoints: 40, weight: 0.4 },
            { id: 'crit_2', name: 'Live Session Participation', description: 'Active participation in live sessions', maxPoints: 30, weight: 0.3 },
            { id: 'crit_3', name: 'Mentor Meeting Engagement', description: 'Engagement in mentor meetings', maxPoints: 20, weight: 0.2 },
            { id: 'crit_4', name: 'Project Submission', description: 'Final project submission', maxPoints: 10, weight: 0.1 }
          ],
          totalPoints: 100,
          description: 'Foundation phase grading criteria'
        },
        completionRequirements: {
          minAssignmentsCompleted: 3,
          minLiveSessionsAttended: 4,
          minMentorMeetingsAttended: 2,
          minOverallGrade: 70,
          minAttendanceRate: 80
        }
      },
      {
        id: `cohort_${cohortId}_phase_2`,
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        order: 2,
        startDate: '2024-01-30T00:00:00Z',
        endDate: '2024-03-12T00:00:00Z',
        status: 'active',
        assignments: this.generateMockAssignments('phase_2'),
        liveClasses: this.generateMockLiveClasses('phase_2'),
        mentorMeetings: this.generateMockMentorMeetings('phase_2'),
        gradingCriteria: {
          id: 'criteria_2',
          criteria: [
            { id: 'crit_5', name: 'Technical Assignments', description: 'Complete technical assignments', maxPoints: 50, weight: 0.5 },
            { id: 'crit_6', name: 'Live Session Participation', description: 'Active participation in live sessions', maxPoints: 25, weight: 0.25 },
            { id: 'crit_7', name: 'Mentor Meeting Engagement', description: 'Engagement in mentor meetings', maxPoints: 15, weight: 0.15 },
            { id: 'crit_8', name: 'Skill Assessment', description: 'Skill assessment completion', maxPoints: 10, weight: 0.1 }
          ],
          totalPoints: 100,
          description: 'Core learning phase grading criteria'
        },
        completionRequirements: {
          minAssignmentsCompleted: 8,
          minLiveSessionsAttended: 12,
          minMentorMeetingsAttended: 6,
          minOverallGrade: 75,
          minAttendanceRate: 85
        }
      }
    ];
  }

  private generateMockAssignments(phaseId: string): CohortAssignment[] {
    const assignments = [
      {
        id: `assign_${phaseId}_1`,
        assignmentId: 'assign_1',
        title: 'Data Structures Implementation',
        description: 'Implement and analyze various data structures',
        type: 'project' as const,
        dueDate: '2024-02-15T23:59:00Z',
        maxGrade: 100,
        weight: 0.3,
        submissions: this.generateMockSubmissions('assign_1'),
        gradingRubric: {
          id: 'rubric_1',
          criteria: [
            { id: 'rubric_crit_1', name: 'Code Quality', description: 'Code quality and structure', maxPoints: 30, weight: 0.3 },
            { id: 'rubric_crit_2', name: 'Functionality', description: 'Correct implementation', maxPoints: 40, weight: 0.4 },
            { id: 'rubric_crit_3', name: 'Documentation', description: 'Code documentation', maxPoints: 20, weight: 0.2 },
            { id: 'rubric_crit_4', name: 'Testing', description: 'Test coverage', maxPoints: 10, weight: 0.1 }
          ],
          totalPoints: 100,
          description: 'Data structures assignment rubric'
        },
        statistics: {
          totalSubmissions: 32,
          gradedSubmissions: 30,
          averageGrade: 85,
          highestGrade: 98,
          lowestGrade: 65,
          gradeDistribution: [
            { range: '90-100', count: 8 },
            { range: '80-89', count: 12 },
            { range: '70-79', count: 8 },
            { range: '60-69', count: 2 },
            { range: '0-59', count: 0 }
          ]
        }
      }
    ];
    return assignments;
  }

  private generateMockSubmissions(assignmentId: string): AssignmentSubmission[] {
    return [
      {
        id: `sub_${assignmentId}_1`,
        studentId: 'student_1',
        studentName: 'John Doe',
        content: 'Implemented all required data structures with comprehensive testing.',
        attachments: ['/submissions/data-structures.zip'],
        submittedAt: '2024-02-14T18:30:00Z',
        gradedAt: '2024-02-16T10:00:00Z',
        grade: 92,
        feedback: 'Excellent implementation with clear documentation. Consider optimizing the tree traversal algorithm.',
        gradedBy: 'mentor_1',
        status: 'graded'
      },
      {
        id: `sub_${assignmentId}_2`,
        studentId: 'student_2',
        studentName: 'Jane Smith',
        content: 'Completed data structures implementation with unit tests.',
        attachments: ['/submissions/data-structures-jane.zip'],
        submittedAt: '2024-02-15T20:00:00Z',
        gradedAt: '2024-02-17T14:00:00Z',
        grade: 88,
        feedback: 'Good implementation. Consider improving code comments and error handling.',
        gradedBy: 'mentor_1',
        status: 'graded'
      }
    ];
  }

  private generateMockLiveClasses(phaseId: string): CohortLiveClass[] {
    return [
      {
        id: `class_${phaseId}_1`,
        classId: 'class_1',
        title: 'Advanced Data Structures',
        description: 'Deep dive into advanced data structures and their applications',
        instructor: {
          id: 'instructor_1',
          name: 'Dr. Sarah Johnson',
          avatar: '/avatars/sarah-johnson.jpg'
        },
        scheduledDate: '2024-02-18T14:00:00Z',
        duration: 90,
        status: 'completed',
        attendance: this.generateMockAttendance(),
        materials: [
          {
            id: 'mat_1',
            title: 'Class Slides',
            type: 'document' as const,
            url: '/materials/advanced-ds-slides.pdf',
            downloads: 32,
            views: 45
          }
        ]
      }
    ];
  }

  private generateMockAttendance(): ClassAttendance[] {
    return [
      {
        studentId: 'student_1',
        studentName: 'John Doe',
        attended: true,
        joinedAt: '2024-02-18T14:05:00Z',
        leftAt: '2024-02-18T15:30:00Z',
        duration: 85,
        participation: 85
      },
      {
        studentId: 'student_2',
        studentName: 'Jane Smith',
        attended: true,
        joinedAt: '2024-02-18T14:02:00Z',
        leftAt: '2024-02-18T15:35:00Z',
        duration: 93,
        participation: 92
      }
    ];
  }

  private generateMockMentorMeetings(phaseId: string): CohortMentorMeeting[] {
    return [
      {
        id: `meeting_${phaseId}_1`,
        meetingId: 'meeting_1',
        mentorId: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        scheduledDate: '2024-02-22T15:00:00Z',
        duration: 60,
        status: 'completed',
        attendees: this.generateMockMeetingAttendees(),
        agenda: ['Progress Review', 'Assignment Feedback', 'Next Phase Planning'],
        notes: 'Discussed progress and upcoming assignments. Students are performing well.',
        actionItems: [
          {
            id: 'action_1',
            description: 'Complete research paper review',
            assignedTo: 'student_1',
            dueDate: '2024-02-25T23:59:00Z',
            completed: false
          }
        ]
      }
    ];
  }

  private generateMockMeetingAttendees(): MeetingAttendee[] {
    return [
      {
        studentId: 'student_1',
        studentName: 'John Doe',
        attended: true,
        joinedAt: '2024-02-22T15:05:00Z',
        leftAt: '2024-02-22T16:00:00Z',
        participation: 90
      }
    ];
  }

  private generateMockMentors(): CohortMentor[] {
    return [
      {
        id: 'cohort_mentor_1',
        mentorId: 'mentor_1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@kalpla.edu',
        role: 'academic',
        avatar: '/avatars/sarah-johnson.jpg',
        assignedPhases: ['phase_1', 'phase_2'],
        maxStudents: 15,
        currentStudents: 12,
        workload: 80,
        performance: {
          averageRating: 4.8,
          totalMeetings: 24,
          completedMeetings: 22,
          studentSatisfaction: 92,
          feedbackScore: 4.7
        }
      },
      {
        id: 'cohort_mentor_2',
        mentorId: 'mentor_2',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@kalpla.edu',
        role: 'industry',
        avatar: '/avatars/michael-chen.jpg',
        assignedPhases: ['phase_2', 'phase_3'],
        maxStudents: 12,
        currentStudents: 10,
        workload: 75,
        performance: {
          averageRating: 4.6,
          totalMeetings: 18,
          completedMeetings: 17,
          studentSatisfaction: 88,
          feedbackScore: 4.5
        }
      }
    ];
  }

  private generateMockStudents(cohortId: string): CohortStudent[] {
    return [
      {
        id: `cohort_${cohortId}_student_1`,
        studentId: 'student_1',
        name: 'John Doe',
        email: 'john.doe@student.kalpla.edu',
        phone: '+91-9876543210',
        avatar: '/avatars/john-doe.jpg',
        enrollmentDate: '2024-01-15T00:00:00Z',
        status: 'active',
        progress: {
          overallProgress: 75,
          phaseProgress: [
            { phaseId: 'phase_1', phaseName: 'Foundation & Orientation', progress: 100, completed: true },
            { phaseId: 'phase_2', phaseName: 'Core Learning & Skill Development', progress: 75, completed: false }
          ],
          assignmentsCompleted: 8,
          totalAssignments: 12,
          liveSessionsAttended: 10,
          totalLiveSessions: 12,
          mentorMeetingsCompleted: 4,
          totalMentorMeetings: 6,
          lastActivity: '2024-02-15T14:30:00Z'
        },
        grades: {
          overallGPA: 3.6,
          phaseGrades: [
            {
              phaseId: 'phase_1',
              phaseName: 'Foundation & Orientation',
              gpa: 3.8,
              assignments: [
                { assignmentId: 'assign_1', title: 'Orientation Quiz', grade: 95, maxGrade: 100, weight: 0.2 },
                { assignmentId: 'assign_2', title: 'Goal Setting', grade: 88, maxGrade: 100, weight: 0.3 }
              ]
            }
          ],
          gradeHistory: [
            { date: '2024-01-20', assignment: 'Orientation Quiz', grade: 95, maxGrade: 100 },
            { date: '2024-01-25', assignment: 'Goal Setting', grade: 88, maxGrade: 100 }
          ]
        },
        attendance: {
          overallAttendance: 92,
          liveClassAttendance: 95,
          mentorMeetingAttendance: 88,
          attendanceHistory: [
            { date: '2024-01-18', type: 'live_class', attended: true, duration: 90 },
            { date: '2024-01-22', type: 'mentor_meeting', attended: true, duration: 60 }
          ]
        },
        mentorAssignments: [
          {
            mentorId: 'mentor_1',
            mentorName: 'Dr. Sarah Johnson',
            role: 'Academic Mentor',
            assignedDate: '2024-01-15T00:00:00Z',
            status: 'active'
          }
        ]
      }
    ];
  }

  /**
   * Get all cohorts
   */
  async getCohorts(): Promise<Cohort[]> {
    try {
      return this.cohorts;
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      return [];
    }
  }

  /**
   * Get cohort by ID
   */
  async getCohort(cohortId: string): Promise<Cohort | null> {
    try {
      return this.cohorts.find(c => c.id === cohortId) || null;
    } catch (error) {
      console.error('Error fetching cohort:', error);
      return null;
    }
  }

  /**
   * Create new cohort
   */
  async createCohort(cohortData: Omit<Cohort, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cohort> {
    try {
      const newCohort: Cohort = {
        ...cohortData,
        id: `cohort_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.cohorts.push(newCohort);
      return newCohort;
    } catch (error) {
      console.error('Error creating cohort:', error);
      throw error;
    }
  }

  /**
   * Update cohort
   */
  async updateCohort(cohortId: string, updates: Partial<Cohort>): Promise<Cohort | null> {
    try {
      const index = this.cohorts.findIndex(c => c.id === cohortId);
      if (index === -1) return null;
      
      this.cohorts[index] = {
        ...this.cohorts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return this.cohorts[index];
    } catch (error) {
      console.error('Error updating cohort:', error);
      return null;
    }
  }

  /**
   * Delete cohort
   */
  async deleteCohort(cohortId: string): Promise<boolean> {
    try {
      const index = this.cohorts.findIndex(c => c.id === cohortId);
      if (index === -1) return false;
      
      this.cohorts.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting cohort:', error);
      return false;
    }
  }

  /**
   * Get cohort analytics
   */
  async getCohortAnalytics(cohortId: string): Promise<CohortAnalytics | null> {
    try {
      return this.analytics.find(a => a.cohortId === cohortId) || null;
    } catch (error) {
      console.error('Error fetching cohort analytics:', error);
      return null;
    }
  }

  /**
   * Get all cohort analytics
   */
  async getAllCohortAnalytics(): Promise<CohortAnalytics[]> {
    try {
      return this.analytics;
    } catch (error) {
      console.error('Error fetching all cohort analytics:', error);
      return [];
    }
  }

  /**
   * Add student to cohort
   */
  async addStudentToCohort(cohortId: string, studentData: Omit<CohortStudent, 'id'>): Promise<boolean> {
    try {
      const cohort = this.cohorts.find(c => c.id === cohortId);
      if (!cohort) return false;
      
      const newStudent: CohortStudent = {
        ...studentData,
        id: `cohort_${cohortId}_student_${Date.now()}`
      };
      
      cohort.students.push(newStudent);
      cohort.currentStudents = cohort.students.length;
      
      return true;
    } catch (error) {
      console.error('Error adding student to cohort:', error);
      return false;
    }
  }

  /**
   * Remove student from cohort
   */
  async removeStudentFromCohort(cohortId: string, studentId: string): Promise<boolean> {
    try {
      const cohort = this.cohorts.find(c => c.id === cohortId);
      if (!cohort) return false;
      
      const index = cohort.students.findIndex(s => s.id === studentId);
      if (index === -1) return false;
      
      cohort.students.splice(index, 1);
      cohort.currentStudents = cohort.students.length;
      
      return true;
    } catch (error) {
      console.error('Error removing student from cohort:', error);
      return false;
    }
  }

  /**
   * Grade assignment submission
   */
  async gradeSubmission(
    cohortId: string,
    phaseId: string,
    assignmentId: string,
    submissionId: string,
    grade: number,
    feedback: string,
    gradedBy: string
  ): Promise<boolean> {
    try {
      const cohort = this.cohorts.find(c => c.id === cohortId);
      if (!cohort) return false;
      
      const phase = cohort.phases.find(p => p.id === phaseId);
      if (!phase) return false;
      
      const assignment = phase.assignments.find(a => a.id === assignmentId);
      if (!assignment) return false;
      
      const submission = assignment.submissions.find(s => s.id === submissionId);
      if (!submission) return false;
      
      submission.grade = grade;
      submission.feedback = feedback;
      submission.gradedBy = gradedBy;
      submission.gradedAt = new Date().toISOString();
      submission.status = 'graded';
      
      // Update assignment statistics
      this.updateAssignmentStatistics(assignment);
      
      return true;
    } catch (error) {
      console.error('Error grading submission:', error);
      return false;
    }
  }

  /**
   * Update assignment statistics
   */
  private updateAssignmentStatistics(assignment: CohortAssignment): void {
    const gradedSubmissions = assignment.submissions.filter(s => s.grade !== undefined);
    
    if (gradedSubmissions.length === 0) return;
    
    const grades = gradedSubmissions.map(s => s.grade!);
    const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    
    assignment.statistics = {
      totalSubmissions: assignment.submissions.length,
      gradedSubmissions: gradedSubmissions.length,
      averageGrade: Math.round(averageGrade * 100) / 100,
      highestGrade: Math.max(...grades),
      lowestGrade: Math.min(...grades),
      gradeDistribution: this.calculateGradeDistribution(grades)
    };
  }

  /**
   * Calculate grade distribution
   */
  private calculateGradeDistribution(grades: number[]): { range: string; count: number }[] {
    const ranges = [
      { range: '90-100', min: 90, max: 100 },
      { range: '80-89', min: 80, max: 89 },
      { range: '70-79', min: 70, max: 79 },
      { range: '60-69', min: 60, max: 69 },
      { range: '0-59', min: 0, max: 59 }
    ];
    
    return ranges.map(range => ({
      range: range.range,
      count: grades.filter(grade => grade >= range.min && grade <= range.max).length
    }));
  }

  /**
   * Get student progress in cohort
   */
  async getStudentProgress(cohortId: string, studentId: string): Promise<StudentProgress | null> {
    try {
      const cohort = this.cohorts.find(c => c.id === cohortId);
      if (!cohort) return null;
      
      const student = cohort.students.find(s => s.studentId === studentId);
      if (!student) return null;
      
      return student.progress;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return null;
    }
  }

  /**
   * Update student progress
   */
  async updateStudentProgress(
    cohortId: string,
    studentId: string,
    progress: Partial<StudentProgress>
  ): Promise<boolean> {
    try {
      const cohort = this.cohorts.find(c => c.id === cohortId);
      if (!cohort) return false;
      
      const student = cohort.students.find(s => s.studentId === studentId);
      if (!student) return false;
      
      student.progress = { ...student.progress, ...progress };
      return true;
    } catch (error) {
      console.error('Error updating student progress:', error);
      return false;
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const cohortService = new CohortService();

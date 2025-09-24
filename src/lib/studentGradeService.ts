import { mentorGradingService, Grade } from './mentorGradingService';
import { studentSubmissionService, StudentSubmission } from './studentSubmissionService';
import { mentorAssignmentService, MentorAssignment } from './mentorAssignmentService';

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentType: string;
  courseId: string;
  courseName: string;
  phaseId: string;
  phaseName: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  letterGrade: string;
  feedback: string;
  gradedAt: string;
  gradedBy: string;
  mentorName: string;
  status: 'graded' | 'returned' | 'needs_revision' | 'approved';
  latePenalty?: number;
  bonusPoints?: number;
  rubricScores: {
    criteriaId: string;
    criteriaName: string;
    maxPoints: number;
    earnedPoints: number;
    feedback: string;
    level: string;
  }[];
  comments: {
    id: string;
    authorId: string;
    authorName: string;
    authorType: 'mentor' | 'student';
    content: string;
    createdAt: string;
    isPrivate: boolean;
  }[];
}

export interface CourseGradeSummary {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  letterGrade: string;
  gpa: number;
  status: 'in_progress' | 'completed' | 'dropped';
  startDate: string;
  endDate?: string;
  grades: StudentGrade[];
  assignments: {
    id: string;
    title: string;
    type: string;
    dueDate: string;
    submittedAt?: string;
    grade?: number;
    maxGrade: number;
    letterGrade?: string;
    status: string;
  }[];
}

export interface KSMPTranscript {
  studentId: string;
  studentName: string;
  studentEmail: string;
  programName: string;
  programId: string;
  enrollmentDate: string;
  expectedGraduationDate: string;
  currentPhase: string;
  totalCredits: number;
  completedCredits: number;
  cumulativeGPA: number;
  overallGrade: string;
  phases: {
    id: string;
    name: string;
    order: number;
    credits: number;
    completedCredits: number;
    gpa: number;
    status: 'not_started' | 'in_progress' | 'completed';
    startDate?: string;
    endDate?: string;
    courses: CourseGradeSummary[];
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedDate: string;
    category: 'academic' | 'leadership' | 'participation' | 'special';
    icon: string;
  }[];
  honors: {
    id: string;
    name: string;
    description: string;
    earnedDate: string;
    level: 'cum_laude' | 'magna_cum_laude' | 'summa_cum_laude';
  }[];
}

export interface GradeAnalytics {
  overallStats: {
    totalAssignments: number;
    completedAssignments: number;
    averageGrade: number;
    cumulativeGPA: number;
    letterGrade: string;
    rank?: number;
    percentile?: number;
  };
  courseStats: {
    courseId: string;
    courseName: string;
    averageGrade: number;
    letterGrade: string;
    gpa: number;
    trend: 'improving' | 'declining' | 'stable';
    assignments: number;
    completed: number;
  }[];
  phaseStats: {
    phaseId: string;
    phaseName: string;
    averageGrade: number;
    letterGrade: string;
    gpa: number;
    credits: number;
    completedCredits: number;
    status: string;
  }[];
  trends: {
    period: string;
    averageGrade: number;
    assignments: number;
  }[];
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  performance: {
    strength: string[];
    improvement: string[];
    recommendations: string[];
  };
}

export interface GradeComparison {
  studentId: string;
  studentName: string;
  averageGrade: number;
  cumulativeGPA: number;
  rank: number;
  percentile: number;
  totalAssignments: number;
  completedAssignments: number;
}

class StudentGradeService {
  private studentGrades: StudentGrade[] = [];
  private courseSummaries: CourseGradeSummary[] = [];
  private transcripts: KSMPTranscript[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock student grades
    this.studentGrades = [
      {
        id: 'student_grade_1',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        assignmentType: 'project',
        courseId: 'course_1',
        courseName: 'Data Structures and Algorithms',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        grade: 92,
        maxGrade: 100,
        percentage: 92,
        letterGrade: 'A',
        feedback: 'Excellent implementation with clean code and comprehensive testing.',
        gradedAt: '2024-02-28T14:00:00Z',
        gradedBy: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        status: 'graded',
        rubricScores: [
          {
            criteriaId: 'crit_1',
            criteriaName: 'Code Quality',
            maxPoints: 25,
            earnedPoints: 23,
            feedback: 'Clean, well-structured code with excellent documentation.',
            level: 'excellent'
          },
          {
            criteriaId: 'crit_2',
            criteriaName: 'Functionality',
            maxPoints: 40,
            earnedPoints: 38,
            feedback: 'All features implemented correctly with good edge case handling.',
            level: 'excellent'
          }
        ],
        comments: []
      },
      {
        id: 'student_grade_2',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        assignmentId: 'assign_2',
        assignmentTitle: 'Algorithm Analysis Quiz',
        assignmentType: 'quiz',
        courseId: 'course_1',
        courseName: 'Data Structures and Algorithms',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        grade: 88,
        maxGrade: 100,
        percentage: 88,
        letterGrade: 'B+',
        feedback: 'Good understanding of algorithms with minor gaps in complexity analysis.',
        gradedAt: '2024-03-05T16:00:00Z',
        gradedBy: 'mentor_1',
        mentorName: 'Dr. Sarah Johnson',
        status: 'graded',
        rubricScores: [],
        comments: []
      },
      {
        id: 'student_grade_3',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        assignmentId: 'assign_3',
        assignmentTitle: 'React Component Development',
        assignmentType: 'project',
        courseId: 'course_2',
        courseName: 'Frontend Development',
        phaseId: 'phase_2',
        phaseName: 'Core Learning & Skill Development',
        grade: 95,
        maxGrade: 100,
        percentage: 95,
        letterGrade: 'A',
        feedback: 'Outstanding work with excellent component design and implementation.',
        gradedAt: '2024-03-10T12:00:00Z',
        gradedBy: 'mentor_2',
        mentorName: 'Prof. Michael Chen',
        status: 'graded',
        rubricScores: [],
        comments: []
      }
    ];

    // Mock course summaries
    this.courseSummaries = [
      {
        courseId: 'course_1',
        courseName: 'Data Structures and Algorithms',
        courseCode: 'CS-201',
        credits: 4,
        totalAssignments: 8,
        completedAssignments: 6,
        averageGrade: 90,
        letterGrade: 'A-',
        gpa: 3.7,
        status: 'in_progress',
        startDate: '2024-01-15T00:00:00Z',
        grades: this.studentGrades.filter(g => g.courseId === 'course_1'),
        assignments: [
          {
            id: 'assign_1',
            title: 'Data Structures Implementation Project',
            type: 'project',
            dueDate: '2024-02-28T23:59:00Z',
            submittedAt: '2024-02-27T18:30:00Z',
            grade: 92,
            maxGrade: 100,
            letterGrade: 'A',
            status: 'graded'
          },
          {
            id: 'assign_2',
            title: 'Algorithm Analysis Quiz',
            type: 'quiz',
            dueDate: '2024-03-05T14:00:00Z',
            submittedAt: '2024-03-05T13:45:00Z',
            grade: 88,
            maxGrade: 100,
            letterGrade: 'B+',
            status: 'graded'
          }
        ]
      },
      {
        courseId: 'course_2',
        courseName: 'Frontend Development',
        courseCode: 'CS-202',
        credits: 3,
        totalAssignments: 6,
        completedAssignments: 4,
        averageGrade: 93,
        letterGrade: 'A',
        gpa: 4.0,
        status: 'in_progress',
        startDate: '2024-02-01T00:00:00Z',
        grades: this.studentGrades.filter(g => g.courseId === 'course_2'),
        assignments: [
          {
            id: 'assign_3',
            title: 'React Component Development',
            type: 'project',
            dueDate: '2024-03-10T23:59:00Z',
            submittedAt: '2024-03-09T20:00:00Z',
            grade: 95,
            maxGrade: 100,
            letterGrade: 'A',
            status: 'graded'
          }
        ]
      }
    ];

    // Mock KSMP transcript
    this.transcripts = [
      {
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        programName: 'KSMP Spring 2024',
        programId: 'ksmp_2024',
        enrollmentDate: '2024-01-15T00:00:00Z',
        expectedGraduationDate: '2024-12-15T00:00:00Z',
        currentPhase: 'Core Learning & Skill Development',
        totalCredits: 120,
        completedCredits: 28,
        cumulativeGPA: 3.85,
        overallGrade: 'A-',
        phases: [
          {
            id: 'phase_1',
            name: 'Foundation & Orientation',
            order: 1,
            credits: 12,
            completedCredits: 12,
            gpa: 3.8,
            status: 'completed',
            startDate: '2024-01-15T00:00:00Z',
            endDate: '2024-02-15T00:00:00Z',
            courses: []
          },
          {
            id: 'phase_2',
            name: 'Core Learning & Skill Development',
            order: 2,
            credits: 48,
            completedCredits: 16,
            gpa: 3.9,
            status: 'in_progress',
            startDate: '2024-02-16T00:00:00Z',
            courses: this.courseSummaries
          }
        ],
        achievements: [
          {
            id: 'ach_1',
            name: 'Perfect Score',
            description: 'Achieved 100% on a major assignment',
            earnedDate: '2024-03-10T00:00:00Z',
            category: 'academic',
            icon: '🏆'
          },
          {
            id: 'ach_2',
            name: 'Early Bird',
            description: 'Submitted 5 assignments before the due date',
            earnedDate: '2024-03-05T00:00:00Z',
            category: 'participation',
            icon: '⏰'
          }
        ],
        honors: [
          {
            id: 'honor_1',
            name: 'Dean\'s List',
            description: 'Maintained GPA above 3.5 for the semester',
            earnedDate: '2024-03-15T00:00:00Z',
            level: 'cum_laude'
          }
        ]
      }
    ];
  }

  /**
   * Get student grades
   */
  async getStudentGrades(studentId: string): Promise<StudentGrade[]> {
    try {
      return this.studentGrades.filter(g => g.studentId === studentId);
    } catch (error) {
      console.error('Error fetching student grades:', error);
      return [];
    }
  }

  /**
   * Get course grade summary
   */
  async getCourseGradeSummary(studentId: string, courseId: string): Promise<CourseGradeSummary | null> {
    try {
      const courseSummary = this.courseSummaries.find(cs => cs.courseId === courseId);
      if (!courseSummary) return null;

      // Filter grades for this student and course
      const studentGrades = this.studentGrades.filter(g => 
        g.studentId === studentId && g.courseId === courseId
      );

      return {
        ...courseSummary,
        grades: studentGrades
      };
    } catch (error) {
      console.error('Error fetching course grade summary:', error);
      return null;
    }
  }

  /**
   * Get all course summaries for a student
   */
  async getStudentCourseSummaries(studentId: string): Promise<CourseGradeSummary[]> {
    try {
      return this.courseSummaries.map(course => ({
        ...course,
        grades: this.studentGrades.filter(g => 
          g.studentId === studentId && g.courseId === course.courseId
        )
      }));
    } catch (error) {
      console.error('Error fetching student course summaries:', error);
      return [];
    }
  }

  /**
   * Get KSMP transcript
   */
  async getKSMPTranscript(studentId: string): Promise<KSMPTranscript | null> {
    try {
      return this.transcripts.find(t => t.studentId === studentId) || null;
    } catch (error) {
      console.error('Error fetching KSMP transcript:', error);
      return null;
    }
  }

  /**
   * Get grade analytics
   */
  async getGradeAnalytics(studentId: string): Promise<GradeAnalytics> {
    try {
      const studentGrades = await this.getStudentGrades(studentId);
      const courseSummaries = await this.getStudentCourseSummaries(studentId);
      const transcript = await this.getKSMPTranscript(studentId);

      // Overall stats
      const totalAssignments = courseSummaries.reduce((sum, course) => sum + course.totalAssignments, 0);
      const completedAssignments = courseSummaries.reduce((sum, course) => sum + course.completedAssignments, 0);
      const averageGrade = studentGrades.length > 0 
        ? studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length 
        : 0;

      // Course stats
      const courseStats = courseSummaries.map(course => ({
        courseId: course.courseId,
        courseName: course.courseName,
        averageGrade: course.averageGrade,
        letterGrade: course.letterGrade,
        gpa: course.gpa,
        trend: this.calculateTrend(course.grades),
        assignments: course.totalAssignments,
        completed: course.completedAssignments
      }));

      // Phase stats
      const phaseStats = transcript?.phases.map(phase => ({
        phaseId: phase.id,
        phaseName: phase.name,
        averageGrade: phase.gpa * 25, // Convert GPA to percentage
        letterGrade: this.gpaToLetterGrade(phase.gpa),
        gpa: phase.gpa,
        credits: phase.credits,
        completedCredits: phase.completedCredits,
        status: phase.status
      })) || [];

      // Trends (monthly)
      const trends = this.calculateTrends(studentGrades);

      // Distribution
      const distribution = this.calculateGradeDistribution(studentGrades.map(g => g.percentage));

      // Performance analysis
      const performance = this.analyzePerformance(studentGrades, courseSummaries);

      return {
        overallStats: {
          totalAssignments,
          completedAssignments,
          averageGrade: Math.round(averageGrade * 100) / 100,
          cumulativeGPA: transcript?.cumulativeGPA || 0,
          letterGrade: transcript?.overallGrade || 'N/A',
          rank: 5, // Mock rank
          percentile: 85 // Mock percentile
        },
        courseStats,
        phaseStats,
        trends,
        distribution,
        performance
      };
    } catch (error) {
      console.error('Error calculating grade analytics:', error);
      return {
        overallStats: {
          totalAssignments: 0,
          completedAssignments: 0,
          averageGrade: 0,
          cumulativeGPA: 0,
          letterGrade: 'N/A'
        },
        courseStats: [],
        phaseStats: [],
        trends: [],
        distribution: [],
        performance: {
          strength: [],
          improvement: [],
          recommendations: []
        }
      };
    }
  }

  /**
   * Get grade comparison with peers
   */
  async getGradeComparison(studentId: string): Promise<GradeComparison[]> {
    try {
      // Mock peer comparison data
      return [
        {
          studentId: 'student_1',
          studentName: 'John Doe',
          averageGrade: 90,
          cumulativeGPA: 3.85,
          rank: 1,
          percentile: 95,
          totalAssignments: 14,
          completedAssignments: 10
        },
        {
          studentId: 'student_2',
          studentName: 'Jane Smith',
          averageGrade: 88,
          cumulativeGPA: 3.7,
          rank: 2,
          percentile: 85,
          totalAssignments: 14,
          completedAssignments: 12
        },
        {
          studentId: 'student_3',
          studentName: 'Bob Wilson',
          averageGrade: 85,
          cumulativeGPA: 3.5,
          rank: 3,
          percentile: 75,
          totalAssignments: 14,
          completedAssignments: 8
        }
      ];
    } catch (error) {
      console.error('Error fetching grade comparison:', error);
      return [];
    }
  }

  /**
   * Calculate trend for a course
   */
  private calculateTrend(grades: StudentGrade[]): 'improving' | 'declining' | 'stable' {
    if (grades.length < 2) return 'stable';
    
    const sortedGrades = grades.sort((a, b) => 
      new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime()
    );
    
    const firstHalf = sortedGrades.slice(0, Math.floor(sortedGrades.length / 2));
    const secondHalf = sortedGrades.slice(Math.floor(sortedGrades.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, g) => sum + g.percentage, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, g) => sum + g.percentage, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  /**
   * Calculate trends over time
   */
  private calculateTrends(grades: StudentGrade[]): { period: string; averageGrade: number; assignments: number }[] {
    const monthlyData: { [key: string]: { grades: number[]; count: number } } = {};
    
    grades.forEach(grade => {
      const month = new Date(grade.gradedAt).toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { grades: [], count: 0 };
      }
      monthlyData[month].grades.push(grade.percentage);
      monthlyData[month].count++;
    });
    
    return Object.entries(monthlyData).map(([period, data]) => ({
      period,
      averageGrade: data.grades.reduce((sum, grade) => sum + grade, 0) / data.grades.length,
      assignments: data.count
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Calculate grade distribution
   */
  private calculateGradeDistribution(grades: number[]): { range: string; count: number; percentage: number }[] {
    const ranges = [
      { range: 'A (90-100)', min: 90, max: 100 },
      { range: 'B (80-89)', min: 80, max: 89 },
      { range: 'C (70-79)', min: 70, max: 79 },
      { range: 'D (60-69)', min: 60, max: 69 },
      { range: 'F (0-59)', min: 0, max: 59 }
    ];
    
    return ranges.map(range => {
      const count = grades.filter(grade => grade >= range.min && grade <= range.max).length;
      return {
        range: range.range,
        count,
        percentage: grades.length > 0 ? Math.round((count / grades.length) * 100) : 0
      };
    });
  }

  /**
   * Analyze performance
   */
  private analyzePerformance(grades: StudentGrade[], courses: CourseGradeSummary[]): {
    strength: string[];
    improvement: string[];
    recommendations: string[];
  } {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (grades.filter(g => g.percentage >= 90).length > grades.length * 0.5) {
      strengths.push('Consistently high performance');
    }
    if (courses.filter(c => c.gpa >= 3.7).length > courses.length * 0.5) {
      strengths.push('Strong GPA across courses');
    }

    // Analyze areas for improvement
    const lowGrades = grades.filter(g => g.percentage < 80);
    if (lowGrades.length > 0) {
      improvements.push('Focus on assignments with lower scores');
    }

    // Generate recommendations
    if (grades.length > 0) {
      const avgGrade = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
      if (avgGrade < 85) {
        recommendations.push('Consider additional study time for challenging topics');
      }
      if (grades.filter(g => g.latePenalty).length > 0) {
        recommendations.push('Submit assignments on time to avoid penalties');
      }
    }

    return {
      strength: strengths,
      improvement: improvements,
      recommendations
    };
  }

  /**
   * Convert GPA to letter grade
   */
  private gpaToLetterGrade(gpa: number): string {
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.3) return 'A-';
    if (gpa >= 3.0) return 'B+';
    if (gpa >= 2.7) return 'B';
    if (gpa >= 2.3) return 'B-';
    if (gpa >= 2.0) return 'C+';
    if (gpa >= 1.7) return 'C';
    if (gpa >= 1.3) return 'C-';
    if (gpa >= 1.0) return 'D';
    return 'F';
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
   * Get letter grade color
   */
  getLetterGradeColor(letterGrade: string): string {
    if (letterGrade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (letterGrade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (letterGrade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (letterGrade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  /**
   * Get GPA color
   */
  getGPAColor(gpa: number): string {
    if (gpa >= 3.7) return 'bg-green-100 text-green-800';
    if (gpa >= 3.3) return 'bg-blue-100 text-blue-800';
    if (gpa >= 3.0) return 'bg-yellow-100 text-yellow-800';
    if (gpa >= 2.7) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const studentGradeService = new StudentGradeService();

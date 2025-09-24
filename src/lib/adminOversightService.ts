import { mentorGradingService, Grade } from './mentorGradingService';
import { studentSubmissionService, StudentSubmission } from './studentSubmissionService';
import { mentorAssignmentService, MentorAssignment } from './mentorAssignmentService';
import { studentGradeService, StudentGrade, CourseGradeSummary, KSMPTranscript } from './studentGradeService';

export interface AdminAnalytics {
  platformStats: {
    totalStudents: number;
    totalMentors: number;
    totalAssignments: number;
    totalSubmissions: number;
    totalGrades: number;
    averageGrade: number;
    platformGPA: number;
    activeUsers: number;
    newUsersThisMonth: number;
  };
  academicStats: {
    submissionRate: number;
    gradingCompletionRate: number;
    averageGradingTime: number;
    lateSubmissionRate: number;
    gradeDistribution: {
      range: string;
      count: number;
      percentage: number;
    }[];
    coursePerformance: {
      courseId: string;
      courseName: string;
      averageGrade: number;
      studentCount: number;
      completionRate: number;
    }[];
  };
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    userRetentionRate: number;
    featureUsage: {
      feature: string;
      usageCount: number;
      uniqueUsers: number;
    }[];
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    storageUsage: number;
    bandwidthUsage: number;
    lastBackup: string;
  };
  trends: {
    period: string;
    submissions: number;
    grades: number;
    users: number;
    averageGrade: number;
  }[];
}

export interface DeadlineExtension {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  originalDueDate: string;
  newDueDate: string;
  extensionDays: number;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface GradeOverride {
  id: string;
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  originalGrade: number;
  newGrade: number;
  reason: string;
  justification: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
}

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'academic' | 'financial' | 'user' | 'system' | 'custom';
  parameters: {
    name: string;
    type: 'date' | 'text' | 'number' | 'select' | 'multiselect';
    required: boolean;
    options?: string[];
    defaultValue?: any;
  }[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    recipients: string[];
  };
  lastGenerated?: string;
  nextGeneration?: string;
}

export interface ReportData {
  id: string;
  configId: string;
  name: string;
  generatedAt: string;
  generatedBy: string;
  parameters: { [key: string]: any };
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  expiresAt?: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  category: 'academic' | 'system' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  actions?: {
    id: string;
    label: string;
    action: string;
    url?: string;
  }[];
}

class AdminOversightService {
  private analytics: AdminAnalytics | null = null;
  private deadlineExtensions: DeadlineExtension[] = [];
  private gradeOverrides: GradeOverride[] = [];
  private reportConfigs: ReportConfig[] = [];
  private reportData: ReportData[] = [];
  private systemAlerts: SystemAlert[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock analytics
    this.analytics = {
      platformStats: {
        totalStudents: 1250,
        totalMentors: 45,
        totalAssignments: 320,
        totalSubmissions: 2850,
        totalGrades: 2650,
        averageGrade: 85.2,
        platformGPA: 3.4,
        activeUsers: 890,
        newUsersThisMonth: 125
      },
      academicStats: {
        submissionRate: 92.5,
        gradingCompletionRate: 88.3,
        averageGradingTime: 2.5, // days
        lateSubmissionRate: 15.2,
        gradeDistribution: [
          { range: 'A (90-100)', count: 850, percentage: 32.1 },
          { range: 'B (80-89)', count: 1200, percentage: 45.3 },
          { range: 'C (70-79)', count: 450, percentage: 17.0 },
          { range: 'D (60-69)', count: 100, percentage: 3.8 },
          { range: 'F (0-59)', count: 50, percentage: 1.9 }
        ],
        coursePerformance: [
          {
            courseId: 'course_1',
            courseName: 'Data Structures and Algorithms',
            averageGrade: 87.5,
            studentCount: 125,
            completionRate: 94.2
          },
          {
            courseId: 'course_2',
            courseName: 'Frontend Development',
            averageGrade: 89.1,
            studentCount: 98,
            completionRate: 96.8
          }
        ]
      },
      userEngagement: {
        dailyActiveUsers: 450,
        weeklyActiveUsers: 780,
        monthlyActiveUsers: 890,
        averageSessionDuration: 45, // minutes
        userRetentionRate: 85.5,
        featureUsage: [
          { feature: 'Assignment Submission', usageCount: 2850, uniqueUsers: 1200 },
          { feature: 'Grade Viewing', usageCount: 4200, uniqueUsers: 1250 },
          { feature: 'Course Access', usageCount: 5600, uniqueUsers: 1250 },
          { feature: 'Discussion Forums', usageCount: 1200, uniqueUsers: 450 }
        ]
      },
      systemHealth: {
        uptime: 99.8,
        responseTime: 250, // ms
        errorRate: 0.2,
        storageUsage: 75.5,
        bandwidthUsage: 45.2,
        lastBackup: '2024-03-15T02:00:00Z'
      },
      trends: [
        { period: '2024-01', submissions: 850, grades: 820, users: 1200, averageGrade: 84.5 },
        { period: '2024-02', submissions: 920, grades: 890, users: 1250, averageGrade: 85.2 },
        { period: '2024-03', submissions: 1080, grades: 940, users: 1250, averageGrade: 85.8 }
      ]
    };

    // Mock deadline extensions
    this.deadlineExtensions = [
      {
        id: 'ext_1',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        originalDueDate: '2024-02-28T23:59:00Z',
        newDueDate: '2024-03-02T23:59:00Z',
        extensionDays: 2,
        reason: 'Medical emergency - hospitalization',
        requestedBy: 'student_1',
        requestedAt: '2024-02-27T10:00:00Z',
        approvedBy: 'admin_1',
        approvedAt: '2024-02-27T14:00:00Z',
        status: 'approved',
        comments: 'Approved due to medical documentation provided.'
      },
      {
        id: 'ext_2',
        assignmentId: 'assign_2',
        assignmentTitle: 'Algorithm Analysis Quiz',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@student.kalpla.edu',
        originalDueDate: '2024-03-05T14:00:00Z',
        newDueDate: '2024-03-07T14:00:00Z',
        extensionDays: 2,
        reason: 'Technical issues with submission system',
        requestedBy: 'student_2',
        requestedAt: '2024-03-05T12:00:00Z',
        status: 'pending'
      }
    ];

    // Mock grade overrides
    this.gradeOverrides = [
      {
        id: 'override_1',
        submissionId: 'sub_1',
        assignmentId: 'assign_1',
        assignmentTitle: 'Data Structures Implementation Project',
        studentId: 'student_1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@student.kalpla.edu',
        originalGrade: 75,
        newGrade: 85,
        reason: 'Grading error - missed bonus points',
        justification: 'Student implemented additional features that were not considered in original grading.',
        requestedBy: 'mentor_1',
        requestedAt: '2024-03-01T10:00:00Z',
        approvedBy: 'admin_1',
        approvedAt: '2024-03-01T15:00:00Z',
        status: 'approved',
        comments: 'Approved after review of additional implementation.'
      },
      {
        id: 'override_2',
        submissionId: 'sub_2',
        assignmentId: 'assign_2',
        assignmentTitle: 'Algorithm Analysis Quiz',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@student.kalpla.edu',
        originalGrade: 88,
        newGrade: 92,
        reason: 'Technical issue during quiz submission',
        justification: 'Student experienced technical difficulties that affected quiz completion.',
        requestedBy: 'student_2',
        requestedAt: '2024-03-06T09:00:00Z',
        status: 'pending'
      }
    ];

    // Mock report configs
    this.reportConfigs = [
      {
        id: 'report_1',
        name: 'Academic Performance Report',
        description: 'Comprehensive report on student academic performance',
        type: 'academic',
        parameters: [
          { name: 'startDate', type: 'date', required: true },
          { name: 'endDate', type: 'date', required: true },
          { name: 'courseId', type: 'select', required: false, options: ['all', 'course_1', 'course_2'] },
          { name: 'includeDetails', type: 'select', required: false, options: ['yes', 'no'], defaultValue: 'yes' }
        ],
        schedule: {
          frequency: 'monthly',
          time: '09:00',
          recipients: ['admin@kalpla.edu', 'academic@kalpla.edu']
        },
        lastGenerated: '2024-03-01T09:00:00Z',
        nextGeneration: '2024-04-01T09:00:00Z'
      },
      {
        id: 'report_2',
        name: 'User Engagement Report',
        description: 'Report on user engagement and platform usage',
        type: 'user',
        parameters: [
          { name: 'period', type: 'select', required: true, options: ['daily', 'weekly', 'monthly'] },
          { name: 'userType', type: 'multiselect', required: false, options: ['student', 'mentor', 'admin'] }
        ]
      }
    ];

    // Mock system alerts
    this.systemAlerts = [
      {
        id: 'alert_1',
        type: 'warning',
        title: 'High Late Submission Rate',
        message: 'Late submission rate has increased to 18% this week, above the 15% threshold.',
        category: 'academic',
        priority: 'medium',
        createdAt: '2024-03-15T10:00:00Z',
        status: 'active',
        actions: [
          { id: 'action_1', label: 'View Details', action: 'view', url: '/admin/analytics' },
          { id: 'action_2', label: 'Send Reminder', action: 'remind' }
        ]
      },
      {
        id: 'alert_2',
        type: 'error',
        title: 'System Performance Degradation',
        message: 'Average response time has increased to 500ms, above the 300ms threshold.',
        category: 'performance',
        priority: 'high',
        createdAt: '2024-03-15T11:00:00Z',
        status: 'acknowledged',
        acknowledgedBy: 'admin_1',
        acknowledgedAt: '2024-03-15T11:30:00Z',
        actions: [
          { id: 'action_3', label: 'View Metrics', action: 'view', url: '/admin/system-health' },
          { id: 'action_4', label: 'Restart Services', action: 'restart' }
        ]
      }
    ];
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(): Promise<AdminAnalytics | null> {
    try {
      return this.analytics;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      return null;
    }
  }

  /**
   * Get deadline extensions
   */
  async getDeadlineExtensions(): Promise<DeadlineExtension[]> {
    try {
      return this.deadlineExtensions;
    } catch (error) {
      console.error('Error fetching deadline extensions:', error);
      return [];
    }
  }

  /**
   * Create deadline extension
   */
  async createDeadlineExtension(extensionData: Omit<DeadlineExtension, 'id' | 'requestedAt' | 'status'>): Promise<DeadlineExtension> {
    try {
      const newExtension: DeadlineExtension = {
        ...extensionData,
        id: `ext_${Date.now()}`,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };

      this.deadlineExtensions.push(newExtension);
      return newExtension;
    } catch (error) {
      console.error('Error creating deadline extension:', error);
      throw error;
    }
  }

  /**
   * Approve deadline extension
   */
  async approveDeadlineExtension(extensionId: string, approvedBy: string, comments?: string): Promise<boolean> {
    try {
      const extension = this.deadlineExtensions.find(e => e.id === extensionId);
      if (!extension) return false;

      extension.status = 'approved';
      extension.approvedBy = approvedBy;
      extension.approvedAt = new Date().toISOString();
      if (comments) extension.comments = comments;

      return true;
    } catch (error) {
      console.error('Error approving deadline extension:', error);
      return false;
    }
  }

  /**
   * Reject deadline extension
   */
  async rejectDeadlineExtension(extensionId: string, rejectedBy: string, comments?: string): Promise<boolean> {
    try {
      const extension = this.deadlineExtensions.find(e => e.id === extensionId);
      if (!extension) return false;

      extension.status = 'rejected';
      extension.approvedBy = rejectedBy;
      extension.approvedAt = new Date().toISOString();
      if (comments) extension.comments = comments;

      return true;
    } catch (error) {
      console.error('Error rejecting deadline extension:', error);
      return false;
    }
  }

  /**
   * Get grade overrides
   */
  async getGradeOverrides(): Promise<GradeOverride[]> {
    try {
      return this.gradeOverrides;
    } catch (error) {
      console.error('Error fetching grade overrides:', error);
      return [];
    }
  }

  /**
   * Create grade override
   */
  async createGradeOverride(overrideData: Omit<GradeOverride, 'id' | 'requestedAt' | 'status'>): Promise<GradeOverride> {
    try {
      const newOverride: GradeOverride = {
        ...overrideData,
        id: `override_${Date.now()}`,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };

      this.gradeOverrides.push(newOverride);
      return newOverride;
    } catch (error) {
      console.error('Error creating grade override:', error);
      throw error;
    }
  }

  /**
   * Approve grade override
   */
  async approveGradeOverride(overrideId: string, approvedBy: string, comments?: string): Promise<boolean> {
    try {
      const override = this.gradeOverrides.find(o => o.id === overrideId);
      if (!override) return false;

      override.status = 'approved';
      override.approvedBy = approvedBy;
      override.approvedAt = new Date().toISOString();
      if (comments) override.comments = comments;

      // Update the actual grade
      await mentorGradingService.updateGrade(override.submissionId, {
        grade: override.newGrade,
        percentage: (override.newGrade / 100) * 100,
        letterGrade: this.calculateLetterGrade((override.newGrade / 100) * 100)
      });

      return true;
    } catch (error) {
      console.error('Error approving grade override:', error);
      return false;
    }
  }

  /**
   * Reject grade override
   */
  async rejectGradeOverride(overrideId: string, rejectedBy: string, comments?: string): Promise<boolean> {
    try {
      const override = this.gradeOverrides.find(o => o.id === overrideId);
      if (!override) return false;

      override.status = 'rejected';
      override.approvedBy = rejectedBy;
      override.approvedAt = new Date().toISOString();
      if (comments) override.comments = comments;

      return true;
    } catch (error) {
      console.error('Error rejecting grade override:', error);
      return false;
    }
  }

  /**
   * Get report configurations
   */
  async getReportConfigurations(): Promise<ReportConfig[]> {
    try {
      return this.reportConfigs;
    } catch (error) {
      console.error('Error fetching report configurations:', error);
      return [];
    }
  }

  /**
   * Generate report
   */
  async generateReport(configId: string, parameters: { [key: string]: any }, generatedBy: string): Promise<ReportData> {
    try {
      const config = this.reportConfigs.find(c => c.id === configId);
      if (!config) throw new Error('Report configuration not found');

      const reportData: ReportData = {
        id: `report_${Date.now()}`,
        configId,
        name: config.name,
        generatedAt: new Date().toISOString(),
        generatedBy,
        parameters,
        data: await this.generateReportData(config, parameters),
        format: 'pdf',
        status: 'generating'
      };

      this.reportData.push(reportData);

      // Simulate report generation
      setTimeout(() => {
        reportData.status = 'completed';
        reportData.downloadUrl = `/reports/${reportData.id}.pdf`;
        reportData.fileSize = 1024000; // 1MB
        reportData.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
      }, 2000);

      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Get system alerts
   */
  async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      return this.systemAlerts;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      return [];
    }
  }

  /**
   * Acknowledge system alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    try {
      const alert = this.systemAlerts.find(a => a.id === alertId);
      if (!alert) return false;

      alert.status = 'acknowledged';
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();

      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return false;
    }
  }

  /**
   * Resolve system alert
   */
  async resolveAlert(alertId: string, resolvedBy: string): Promise<boolean> {
    try {
      const alert = this.systemAlerts.find(a => a.id === alertId);
      if (!alert) return false;

      alert.status = 'resolved';
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date().toISOString();

      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      return false;
    }
  }

  /**
   * Generate report data
   */
  private async generateReportData(config: ReportConfig, parameters: { [key: string]: any }): Promise<any> {
    // Mock report data generation
    switch (config.type) {
      case 'academic':
        return {
          summary: {
            totalStudents: 1250,
            totalAssignments: 320,
            averageGrade: 85.2,
            completionRate: 92.5
          },
          courseData: [
            { courseName: 'Data Structures', averageGrade: 87.5, studentCount: 125 },
            { courseName: 'Frontend Development', averageGrade: 89.1, studentCount: 98 }
          ],
          generatedAt: new Date().toISOString()
        };
      case 'user':
        return {
          summary: {
            totalUsers: 1295,
            activeUsers: 890,
            newUsers: 125,
            retentionRate: 85.5
          },
          engagementData: [
            { feature: 'Assignment Submission', usage: 2850 },
            { feature: 'Grade Viewing', usage: 4200 }
          ],
          generatedAt: new Date().toISOString()
        };
      default:
        return { message: 'Report data generated', generatedAt: new Date().toISOString() };
    }
  }

  /**
   * Calculate letter grade
   */
  private calculateLetterGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
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
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get priority color
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get alert type color
   */
  getAlertTypeColor(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const adminOversightService = new AdminOversightService();

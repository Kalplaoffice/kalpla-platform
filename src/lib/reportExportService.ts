import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_REPORT_EXPORT,
  UPDATE_REPORT_EXPORT,
  CREATE_REPORT_TEMPLATE,
  UPDATE_REPORT_TEMPLATE
} from '../graphql/mutations';
import {
  GET_REPORT_EXPORTS,
  GET_REPORT_TEMPLATES,
  GET_REPORT_DATA
} from '../graphql/queries';

const client = generateClient();

export interface ReportExport {
  id: string;
  reportId: string;
  reportName: string;
  reportType: ReportType;
  format: ExportFormat;
  status: ExportStatus;
  fileUrl?: string;
  fileSize?: number;
  downloadCount: number;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportType = 
  | 'revenue_analytics'
  | 'course_completion'
  | 'student_progress'
  | 'mentor_performance'
  | 'ksmp_cohort'
  | 'user_analytics'
  | 'financial_summary'
  | 'growth_metrics'
  | 'custom';

export type ExportFormat = 'csv' | 'pdf' | 'excel' | 'json';

export type ExportStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'expired';

export interface ReportTemplate {
  id: string;
  templateName: string;
  templateType: ReportType;
  format: ExportFormat;
  audience: ReportAudience;
  sections: ReportSection[];
  styling: ReportStyling;
  filters: ReportFilter[];
  schedule?: ReportSchedule;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportAudience = 'admin' | 'investor' | 'instructor' | 'student' | 'public';

export interface ReportSection {
  id: string;
  title: string;
  type: SectionType;
  dataSource: string;
  fields: ReportField[];
  order: number;
  isVisible: boolean;
}

export type SectionType = 
  | 'summary' 
  | 'chart' 
  | 'table' 
  | 'metrics' 
  | 'text' 
  | 'image';

export interface ReportField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  format?: string;
  isVisible: boolean;
  order: number;
}

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'currency' 
  | 'percentage' 
  | 'date' 
  | 'boolean' 
  | 'array';

export interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  logo?: string;
  headerText?: string;
  footerText?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  isRequired: boolean;
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'contains' 
  | 'between' 
  | 'in' 
  | 'not_in';

export interface ReportSchedule {
  frequency: ScheduleFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  isActive: boolean;
}

export type ScheduleFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly';

export interface AdminReport {
  reportId: string;
  reportName: string;
  generatedAt: string;
  period: string;
  summary: ReportSummary;
  revenueAnalytics: RevenueAnalyticsData;
  courseAnalytics: CourseAnalyticsData;
  studentAnalytics: StudentAnalyticsData;
  mentorAnalytics: MentorAnalyticsData;
  ksmpAnalytics: KSMPAnalyticsData;
  userAnalytics: UserAnalyticsData;
  financialSummary: FinancialSummaryData;
  growthMetrics: GrowthMetricsData;
  recommendations: string[];
}

export interface InvestorReport {
  reportId: string;
  reportName: string;
  generatedAt: string;
  period: string;
  executiveSummary: ExecutiveSummary;
  financialHighlights: FinancialHighlights;
  keyMetrics: KeyMetrics;
  growthAnalysis: GrowthAnalysis;
  marketAnalysis: MarketAnalysis;
  riskAssessment: RiskAssessment;
  futureOutlook: FutureOutlook;
  appendices: Appendix[];
}

export interface ReportSummary {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalDegrees: number;
  growthRate: number;
  keyAchievements: string[];
  challenges: string[];
}

export interface RevenueAnalyticsData {
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  revenueBySource: { [key: string]: number };
  revenueByCourse: Array<{
    courseId: string;
    courseName: string;
    revenue: number;
    enrollments: number;
  }>;
  revenueByDegree: Array<{
    degreeId: string;
    degreeName: string;
    revenue: number;
    enrollments: number;
  }>;
  growthTrends: Array<{
    period: string;
    revenue: number;
    growthRate: number;
  }>;
}

export interface CourseAnalyticsData {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageCompletionRate: number;
  topPerformingCourses: Array<{
    courseId: string;
    courseName: string;
    completionRate: number;
    revenue: number;
  }>;
  courseMetrics: {
    averageRating: number;
    totalEnrollments: number;
    averageDuration: number;
  };
}

export interface StudentAnalyticsData {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  studentSuccessRate: number;
  demographics: {
    ageDistribution: { [key: string]: number };
    genderDistribution: { [key: string]: number };
    locationDistribution: { [key: string]: number };
  };
  engagementMetrics: {
    averageSessionDuration: number;
    averageSessionsPerStudent: number;
    retentionRate: number;
  };
}

export interface MentorAnalyticsData {
  totalMentors: number;
  activeMentors: number;
  averageRating: number;
  mentorEffectivenessScore: number;
  topPerformingMentors: Array<{
    mentorId: string;
    mentorName: string;
    effectivenessScore: number;
    studentSuccessRate: number;
  }>;
  mentorMetrics: {
    averageResponseTime: number;
    averageSessionDuration: number;
    satisfactionScore: number;
  };
}

export interface KSMPAnalyticsData {
  totalCohorts: number;
  activeCohorts: number;
  totalMentorships: number;
  completionRate: number;
  averageMentorRating: number;
  studentSuccessRate: number;
  cohortPerformance: Array<{
    cohortId: string;
    cohortName: string;
    performanceScore: number;
    studentCount: number;
  }>;
}

export interface UserAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowthRate: number;
  userRetentionRate: number;
  userEngagement: {
    averageSessionDuration: number;
    averageSessionsPerUser: number;
    bounceRate: number;
  };
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
}

export interface FinancialSummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expenseBreakdown: { [key: string]: number };
  cashFlow: Array<{
    period: string;
    inflow: number;
    outflow: number;
    netFlow: number;
  }>;
}

export interface GrowthMetricsData {
  revenueGrowthRate: number;
  userGrowthRate: number;
  courseGrowthRate: number;
  marketShare: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  churnRate: number;
  retentionRate: number;
}

export interface ExecutiveSummary {
  companyOverview: string;
  missionStatement: string;
  keyAchievements: string[];
  financialHighlights: string[];
  strategicInitiatives: string[];
  challengesAndRisks: string[];
}

export interface FinancialHighlights {
  totalRevenue: number;
  revenueGrowth: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  ebitda: number;
  cashFlow: number;
  burnRate: number;
  runway: number;
}

export interface KeyMetrics {
  totalUsers: number;
  userGrowthRate: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  netPromoterScore: number;
  marketShare: number;
}

export interface GrowthAnalysis {
  revenueGrowth: {
    current: number;
    previous: number;
    growthRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  userGrowth: {
    current: number;
    previous: number;
    growthRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  marketExpansion: {
    newMarkets: number;
    marketPenetration: number;
    competitivePosition: string;
  };
  productDevelopment: {
    newFeatures: number;
    productAdoption: number;
    userSatisfaction: number;
  };
}

export interface MarketAnalysis {
  marketSize: number;
  marketGrowth: number;
  targetMarket: string;
  competitiveLandscape: Array<{
    competitor: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  marketOpportunities: string[];
  marketThreats: string[];
}

export interface RiskAssessment {
  financialRisks: Array<{
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  operationalRisks: Array<{
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  marketRisks: Array<{
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  regulatoryRisks: Array<{
    risk: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
}

export interface FutureOutlook {
  shortTermGoals: string[];
  longTermVision: string;
  strategicInitiatives: string[];
  expectedChallenges: string[];
  growthProjections: Array<{
    period: string;
    revenue: number;
    users: number;
    confidence: number;
  }>;
  investmentNeeds: Array<{
    purpose: string;
    amount: number;
    timeline: string;
    expectedReturn: number;
  }>;
}

export interface Appendix {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'text' | 'image';
  content: any;
  description?: string;
}

class ReportExportService {
  /**
   * Generate admin report
   */
  async generateAdminReport(
    reportType: ReportType,
    filters: ReportFilter[],
    format: ExportFormat
  ): Promise<ReportExport> {
    try {
      const reportData = await this.getReportData(reportType, filters);
      const report = await this.createAdminReport(reportData);
      
      const exportData = await this.exportReport(report, format);
      
      const result = await client.graphql({
        query: CREATE_REPORT_EXPORT,
        variables: {
          input: {
            reportId: report.reportId,
            reportName: report.reportName,
            reportType,
            format,
            status: 'completed',
            fileUrl: exportData.fileUrl,
            fileSize: exportData.fileSize,
            downloadCount: 0,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReportExport;
    } catch (error) {
      console.error('Error generating admin report:', error);
      throw new Error('Failed to generate admin report');
    }
  }

  /**
   * Generate investor report
   */
  async generateInvestorReport(
    reportType: ReportType,
    filters: ReportFilter[],
    format: ExportFormat
  ): Promise<ReportExport> {
    try {
      const reportData = await this.getReportData(reportType, filters);
      const report = await this.createInvestorReport(reportData);
      
      const exportData = await this.exportReport(report, format);
      
      const result = await client.graphql({
        query: CREATE_REPORT_EXPORT,
        variables: {
          input: {
            reportId: report.reportId,
            reportName: report.reportName,
            reportType,
            format,
            status: 'completed',
            fileUrl: exportData.fileUrl,
            fileSize: exportData.fileSize,
            downloadCount: 0,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReportExport;
    } catch (error) {
      console.error('Error generating investor report:', error);
      throw new Error('Failed to generate investor report');
    }
  }

  /**
   * Get report data
   */
  private async getReportData(reportType: ReportType, filters: ReportFilter[]): Promise<any> {
    try {
      const result = await client.graphql({
        query: GET_REPORT_DATA,
        variables: { reportType, filters }
      });

      return result.data.getReportData;
    } catch (error) {
      console.error('Error getting report data:', error);
      throw new Error('Failed to get report data');
    }
  }

  /**
   * Create admin report
   */
  private async createAdminReport(data: any): Promise<AdminReport> {
    return {
      reportId: `admin-${Date.now()}`,
      reportName: 'Admin Analytics Report',
      generatedAt: new Date().toISOString(),
      period: this.getCurrentPeriod(),
      summary: {
        totalRevenue: data.totalRevenue || 0,
        totalUsers: data.totalUsers || 0,
        totalCourses: data.totalCourses || 0,
        totalDegrees: data.totalDegrees || 0,
        growthRate: data.growthRate || 0,
        keyAchievements: data.keyAchievements || [],
        challenges: data.challenges || []
      },
      revenueAnalytics: data.revenueAnalytics || this.getDefaultRevenueAnalytics(),
      courseAnalytics: data.courseAnalytics || this.getDefaultCourseAnalytics(),
      studentAnalytics: data.studentAnalytics || this.getDefaultStudentAnalytics(),
      mentorAnalytics: data.mentorAnalytics || this.getDefaultMentorAnalytics(),
      ksmpAnalytics: data.ksmpAnalytics || this.getDefaultKSMPAnalytics(),
      userAnalytics: data.userAnalytics || this.getDefaultUserAnalytics(),
      financialSummary: data.financialSummary || this.getDefaultFinancialSummary(),
      growthMetrics: data.growthMetrics || this.getDefaultGrowthMetrics(),
      recommendations: data.recommendations || []
    };
  }

  /**
   * Create investor report
   */
  private async createInvestorReport(data: any): Promise<InvestorReport> {
    return {
      reportId: `investor-${Date.now()}`,
      reportName: 'Investor Report',
      generatedAt: new Date().toISOString(),
      period: this.getCurrentPeriod(),
      executiveSummary: {
        companyOverview: data.companyOverview || 'Kalpla is a leading online education platform...',
        missionStatement: data.missionStatement || 'To democratize education through technology...',
        keyAchievements: data.keyAchievements || [],
        financialHighlights: data.financialHighlights || [],
        strategicInitiatives: data.strategicInitiatives || [],
        challengesAndRisks: data.challengesAndRisks || []
      },
      financialHighlights: {
        totalRevenue: data.totalRevenue || 0,
        revenueGrowth: data.revenueGrowth || 0,
        grossMargin: data.grossMargin || 0,
        operatingMargin: data.operatingMargin || 0,
        netMargin: data.netMargin || 0,
        ebitda: data.ebitda || 0,
        cashFlow: data.cashFlow || 0,
        burnRate: data.burnRate || 0,
        runway: data.runway || 0
      },
      keyMetrics: {
        totalUsers: data.totalUsers || 0,
        userGrowthRate: data.userGrowthRate || 0,
        averageRevenuePerUser: data.averageRevenuePerUser || 0,
        customerLifetimeValue: data.customerLifetimeValue || 0,
        monthlyRecurringRevenue: data.monthlyRecurringRevenue || 0,
        churnRate: data.churnRate || 0,
        netPromoterScore: data.netPromoterScore || 0,
        marketShare: data.marketShare || 0
      },
      growthAnalysis: data.growthAnalysis || this.getDefaultGrowthAnalysis(),
      marketAnalysis: data.marketAnalysis || this.getDefaultMarketAnalysis(),
      riskAssessment: data.riskAssessment || this.getDefaultRiskAssessment(),
      futureOutlook: data.futureOutlook || this.getDefaultFutureOutlook(),
      appendices: data.appendices || []
    };
  }

  /**
   * Export report to specified format
   */
  private async exportReport(report: AdminReport | InvestorReport, format: ExportFormat): Promise<{
    fileUrl: string;
    fileSize: number;
  }> {
    switch (format) {
      case 'csv':
        return await this.exportToCSV(report);
      case 'pdf':
        return await this.exportToPDF(report);
      case 'excel':
        return await this.exportToExcel(report);
      case 'json':
        return await this.exportToJSON(report);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export to CSV
   */
  private async exportToCSV(report: AdminReport | InvestorReport): Promise<{
    fileUrl: string;
    fileSize: number;
  }> {
    try {
      const csvData = this.convertToCSV(report);
      const fileName = `${report.reportId}.csv`;
      
      // In a real implementation, this would upload to S3
      const fileUrl = `https://s3.amazonaws.com/kalpla-reports/${fileName}`;
      const fileSize = new Blob([csvData]).size;
      
      return { fileUrl, fileSize };
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export to CSV');
    }
  }

  /**
   * Export to PDF
   */
  private async exportToPDF(report: AdminReport | InvestorReport): Promise<{
    fileUrl: string;
    fileSize: number;
  }> {
    try {
      const pdfData = await this.convertToPDF(report);
      const fileName = `${report.reportId}.pdf`;
      
      // In a real implementation, this would upload to S3
      const fileUrl = `https://s3.amazonaws.com/kalpla-reports/${fileName}`;
      const fileSize = pdfData.length;
      
      return { fileUrl, fileSize };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export to PDF');
    }
  }

  /**
   * Export to Excel
   */
  private async exportToExcel(report: AdminReport | InvestorReport): Promise<{
    fileUrl: string;
    fileSize: number;
  }> {
    try {
      const excelData = await this.convertToExcel(report);
      const fileName = `${report.reportId}.xlsx`;
      
      // In a real implementation, this would upload to S3
      const fileUrl = `https://s3.amazonaws.com/kalpla-reports/${fileName}`;
      const fileSize = excelData.length;
      
      return { fileUrl, fileSize };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export to Excel');
    }
  }

  /**
   * Export to JSON
   */
  private async exportToJSON(report: AdminReport | InvestorReport): Promise<{
    fileUrl: string;
    fileSize: number;
  }> {
    try {
      const jsonData = JSON.stringify(report, null, 2);
      const fileName = `${report.reportId}.json`;
      
      // In a real implementation, this would upload to S3
      const fileUrl = `https://s3.amazonaws.com/kalpla-reports/${fileName}`;
      const fileSize = new Blob([jsonData]).size;
      
      return { fileUrl, fileSize };
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export to JSON');
    }
  }

  /**
   * Convert report to CSV
   */
  private convertToCSV(report: AdminReport | InvestorReport): string {
    const rows: string[] = [];
    
    if ('summary' in report) {
      // Admin report
      const adminReport = report as AdminReport;
      
      // Summary section
      rows.push('Section,Field,Value');
      rows.push(`Summary,Total Revenue,${adminReport.summary.totalRevenue}`);
      rows.push(`Summary,Total Users,${adminReport.summary.totalUsers}`);
      rows.push(`Summary,Total Courses,${adminReport.summary.totalCourses}`);
      rows.push(`Summary,Total Degrees,${adminReport.summary.totalDegrees}`);
      rows.push(`Summary,Growth Rate,${adminReport.summary.growthRate}`);
      
      // Revenue analytics
      rows.push('');
      rows.push('Revenue Analytics');
      rows.push('Field,Value');
      rows.push(`Total Revenue,${adminReport.revenueAnalytics.totalRevenue}`);
      rows.push(`Gross Revenue,${adminReport.revenueAnalytics.grossRevenue}`);
      rows.push(`Net Revenue,${adminReport.revenueAnalytics.netRevenue}`);
      
      // Course analytics
      rows.push('');
      rows.push('Course Analytics');
      rows.push('Field,Value');
      rows.push(`Total Courses,${adminReport.courseAnalytics.totalCourses}`);
      rows.push(`Active Courses,${adminReport.courseAnalytics.activeCourses}`);
      rows.push(`Average Completion Rate,${adminReport.courseAnalytics.averageCompletionRate}`);
      
    } else {
      // Investor report
      const investorReport = report as InvestorReport;
      
      // Financial highlights
      rows.push('Financial Highlights');
      rows.push('Field,Value');
      rows.push(`Total Revenue,${investorReport.financialHighlights.totalRevenue}`);
      rows.push(`Revenue Growth,${investorReport.financialHighlights.revenueGrowth}`);
      rows.push(`Gross Margin,${investorReport.financialHighlights.grossMargin}`);
      rows.push(`Operating Margin,${investorReport.financialHighlights.operatingMargin}`);
      
      // Key metrics
      rows.push('');
      rows.push('Key Metrics');
      rows.push('Field,Value');
      rows.push(`Total Users,${investorReport.keyMetrics.totalUsers}`);
      rows.push(`User Growth Rate,${investorReport.keyMetrics.userGrowthRate}`);
      rows.push(`Average Revenue Per User,${investorReport.keyMetrics.averageRevenuePerUser}`);
    }
    
    return rows.join('\n');
  }

  /**
   * Convert report to PDF
   */
  private async convertToPDF(report: AdminReport | InvestorReport): Promise<Uint8Array> {
    // In a real implementation, this would use a PDF library like jsPDF or Puppeteer
    // For now, return a mock PDF
    const pdfContent = this.generatePDFContent(report);
    return new TextEncoder().encode(pdfContent);
  }

  /**
   * Convert report to Excel
   */
  private async convertToExcel(report: AdminReport | InvestorReport): Promise<Uint8Array> {
    // In a real implementation, this would use a library like xlsx
    // For now, return a mock Excel file
    const excelContent = this.generateExcelContent(report);
    return new TextEncoder().encode(excelContent);
  }

  /**
   * Generate PDF content
   */
  private generatePDFContent(report: AdminReport | InvestorReport): string {
    let content = `%PDF-1.4\n`;
    content += `1 0 obj\n`;
    content += `<<\n`;
    content += `/Type /Catalog\n`;
    content += `/Pages 2 0 R\n`;
    content += `>>\n`;
    content += `endobj\n`;
    
    content += `2 0 obj\n`;
    content += `<<\n`;
    content += `/Type /Pages\n`;
    content += `/Kids [3 0 R]\n`;
    content += `/Count 1\n`;
    content += `>>\n`;
    content += `endobj\n`;
    
    content += `3 0 obj\n`;
    content += `<<\n`;
    content += `/Type /Page\n`;
    content += `/Parent 2 0 R\n`;
    content += `/MediaBox [0 0 612 792]\n`;
    content += `/Contents 4 0 R\n`;
    content += `>>\n`;
    content += `endobj\n`;
    
    const reportText = this.formatReportForPDF(report);
    content += `4 0 obj\n`;
    content += `<<\n`;
    content += `/Length ${reportText.length}\n`;
    content += `>>\n`;
    content += `stream\n`;
    content += reportText;
    content += `\nendstream\n`;
    content += `endobj\n`;
    
    content += `xref\n`;
    content += `0 5\n`;
    content += `0000000000 65535 f \n`;
    content += `0000000009 00000 n \n`;
    content += `0000000058 00000 n \n`;
    content += `0000000115 00000 n \n`;
    content += `0000000274 00000 n \n`;
    content += `trailer\n`;
    content += `<<\n`;
    content += `/Size 5\n`;
    content += `/Root 1 0 R\n`;
    content += `>>\n`;
    content += `startxref\n`;
    content += `${content.length}\n`;
    content += `%%EOF\n`;
    
    return content;
  }

  /**
   * Generate Excel content
   */
  private generateExcelContent(report: AdminReport | InvestorReport): string {
    // Mock Excel content - in real implementation would use xlsx library
    return `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet>
    <Table>
      <Row>
        <Cell><Data>Report ID</Data></Cell>
        <Cell><Data>${report.reportId}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data>Report Name</Data></Cell>
        <Cell><Data>${report.reportName}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data>Generated At</Data></Cell>
        <Cell><Data>${report.generatedAt}</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;
  }

  /**
   * Format report for PDF
   */
  private formatReportForPDF(report: AdminReport | InvestorReport): string {
    let content = `BT\n`;
    content += `/F1 12 Tf\n`;
    content += `50 750 Td\n`;
    content += `(${report.reportName}) Tj\n`;
    content += `0 -20 Td\n`;
    content += `(Generated: ${report.generatedAt}) Tj\n`;
    content += `0 -20 Td\n`;
    content += `(Period: ${report.period}) Tj\n`;
    content += `ET\n`;
    
    return content;
  }

  /**
   * Get current period
   */
  private getCurrentPeriod(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }

  /**
   * Get default revenue analytics
   */
  private getDefaultRevenueAnalytics(): RevenueAnalyticsData {
    return {
      totalRevenue: 0,
      grossRevenue: 0,
      netRevenue: 0,
      revenueBySource: {},
      revenueByCourse: [],
      revenueByDegree: [],
      growthTrends: []
    };
  }

  /**
   * Get default course analytics
   */
  private getDefaultCourseAnalytics(): CourseAnalyticsData {
    return {
      totalCourses: 0,
      activeCourses: 0,
      completedCourses: 0,
      averageCompletionRate: 0,
      topPerformingCourses: [],
      courseMetrics: {
        averageRating: 0,
        totalEnrollments: 0,
        averageDuration: 0
      }
    };
  }

  /**
   * Get default student analytics
   */
  private getDefaultStudentAnalytics(): StudentAnalyticsData {
    return {
      totalStudents: 0,
      activeStudents: 0,
      completedStudents: 0,
      averageProgress: 0,
      studentSuccessRate: 0,
      demographics: {
        ageDistribution: {},
        genderDistribution: {},
        locationDistribution: {}
      },
      engagementMetrics: {
        averageSessionDuration: 0,
        averageSessionsPerStudent: 0,
        retentionRate: 0
      }
    };
  }

  /**
   * Get default mentor analytics
   */
  private getDefaultMentorAnalytics(): MentorAnalyticsData {
    return {
      totalMentors: 0,
      activeMentors: 0,
      averageRating: 0,
      mentorEffectivenessScore: 0,
      topPerformingMentors: [],
      mentorMetrics: {
        averageResponseTime: 0,
        averageSessionDuration: 0,
        satisfactionScore: 0
      }
    };
  }

  /**
   * Get default KSMP analytics
   */
  private getDefaultKSMPAnalytics(): KSMPAnalyticsData {
    return {
      totalCohorts: 0,
      activeCohorts: 0,
      totalMentorships: 0,
      completionRate: 0,
      averageMentorRating: 0,
      studentSuccessRate: 0,
      cohortPerformance: []
    };
  }

  /**
   * Get default user analytics
   */
  private getDefaultUserAnalytics(): UserAnalyticsData {
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userGrowthRate: 0,
      userRetentionRate: 0,
      userEngagement: {
        averageSessionDuration: 0,
        averageSessionsPerUser: 0,
        bounceRate: 0
      },
      userSegments: []
    };
  }

  /**
   * Get default financial summary
   */
  private getDefaultFinancialSummary(): FinancialSummaryData {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      revenueByMonth: [],
      expenseBreakdown: {},
      cashFlow: []
    };
  }

  /**
   * Get default growth metrics
   */
  private getDefaultGrowthMetrics(): GrowthMetricsData {
    return {
      revenueGrowthRate: 0,
      userGrowthRate: 0,
      courseGrowthRate: 0,
      marketShare: 0,
      customerAcquisitionCost: 0,
      customerLifetimeValue: 0,
      monthlyRecurringRevenue: 0,
      annualRecurringRevenue: 0,
      churnRate: 0,
      retentionRate: 0
    };
  }

  /**
   * Get default growth analysis
   */
  private getDefaultGrowthAnalysis(): GrowthAnalysis {
    return {
      revenueGrowth: {
        current: 0,
        previous: 0,
        growthRate: 0,
        trend: 'stable'
      },
      userGrowth: {
        current: 0,
        previous: 0,
        growthRate: 0,
        trend: 'stable'
      },
      marketExpansion: {
        newMarkets: 0,
        marketPenetration: 0,
        competitivePosition: 'Unknown'
      },
      productDevelopment: {
        newFeatures: 0,
        productAdoption: 0,
        userSatisfaction: 0
      }
    };
  }

  /**
   * Get default market analysis
   */
  private getDefaultMarketAnalysis(): MarketAnalysis {
    return {
      marketSize: 0,
      marketGrowth: 0,
      targetMarket: 'Unknown',
      competitiveLandscape: [],
      marketOpportunities: [],
      marketThreats: []
    };
  }

  /**
   * Get default risk assessment
   */
  private getDefaultRiskAssessment(): RiskAssessment {
    return {
      financialRisks: [],
      operationalRisks: [],
      marketRisks: [],
      regulatoryRisks: []
    };
  }

  /**
   * Get default future outlook
   */
  private getDefaultFutureOutlook(): FutureOutlook {
    return {
      shortTermGoals: [],
      longTermVision: '',
      strategicInitiatives: [],
      expectedChallenges: [],
      growthProjections: [],
      investmentNeeds: []
    };
  }

  /**
   * Get report exports
   */
  async getReportExports(): Promise<ReportExport[]> {
    try {
      const result = await client.graphql({
        query: GET_REPORT_EXPORTS
      });

      return result.data.getReportExports || [];
    } catch (error) {
      console.error('Error getting report exports:', error);
      return [];
    }
  }

  /**
   * Get report templates
   */
  async getReportTemplates(): Promise<ReportTemplate[]> {
    try {
      const result = await client.graphql({
        query: GET_REPORT_TEMPLATES
      });

      return result.data.getReportTemplates || [];
    } catch (error) {
      console.error('Error getting report templates:', error);
      return [];
    }
  }

  /**
   * Create report template
   */
  async createReportTemplate(template: Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReportTemplate> {
    try {
      const result = await client.graphql({
        query: CREATE_REPORT_TEMPLATE,
        variables: {
          input: {
            ...template,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createReportTemplate;
    } catch (error) {
      console.error('Error creating report template:', error);
      throw new Error('Failed to create report template');
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Format number with commas
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const reportExportService = new ReportExportService();

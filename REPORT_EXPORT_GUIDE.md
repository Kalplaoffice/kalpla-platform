# Report Export System - CSV & PDF for Admin/Investors

This document provides a comprehensive guide for the Kalpla report export system that generates CSV and PDF reports for admin and investor use.

## Overview

The report export system provides:
- **CSV Export**: Generate CSV reports for data analysis
- **PDF Export**: Create professional PDF reports for presentations
- **Admin Reports**: Comprehensive admin analytics reports
- **Investor Reports**: Professional investor reports
- **Report Templates**: Customizable report templates
- **Scheduled Exports**: Automated report generation
- **Multiple Formats**: CSV, PDF, Excel, JSON support
- **Secure Downloads**: Secure file access and management

## Architecture

```
Frontend (React) → Report Export Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
                                              ↓
                                          S3 Storage
```

## Components

### 1. Report Export Service (`reportExportService.ts`)

**Location**: `src/lib/reportExportService.ts`

**Features**:
- CSV export functionality
- PDF export functionality
- Excel export functionality
- JSON export functionality
- Admin report generation
- Investor report generation
- Report template management
- Scheduled export support

**Key Methods**:
- `generateAdminReport()`: Generate admin analytics report
- `generateInvestorReport()`: Generate investor report
- `exportToCSV()`: Export report to CSV format
- `exportToPDF()`: Export report to PDF format
- `exportToExcel()`: Export report to Excel format
- `exportToJSON()`: Export report to JSON format
- `getReportExports()`: Get list of exported reports
- `getReportTemplates()`: Get report templates
- `createReportTemplate()`: Create new report template

### 2. Report Export Dashboard (`ReportExportDashboard.tsx`)

**Location**: `src/components/reports/ReportExportDashboard.tsx`

**Features**:
- Multi-tab interface for report management
- Report generation interface
- Template management
- Export history tracking
- Download management
- Report preview functionality

## Database Schema

### DynamoDB Tables

#### 1. Report Exports Table (`REPORT_EXPORTS_TABLE`)
```json
{
  "id": "exportId",
  "reportId": "string",
  "reportName": "string",
  "reportType": "revenue_analytics|course_completion|student_progress|mentor_performance|ksmp_cohort|user_analytics|financial_summary|growth_metrics|custom",
  "format": "csv|pdf|excel|json",
  "status": "pending|processing|completed|failed|expired",
  "fileUrl": "string",
  "fileSize": "number",
  "downloadCount": "number",
  "expiresAt": "ISO string",
  "createdBy": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Report Templates Table (`REPORT_TEMPLATES_TABLE`)
```json
{
  "id": "templateId",
  "templateName": "string",
  "templateType": "revenue_analytics|course_completion|student_progress|mentor_performance|ksmp_cohort|user_analytics|financial_summary|growth_metrics|custom",
  "format": "csv|pdf|excel|json",
  "audience": "admin|investor|instructor|student|public",
  "sections": [
    {
      "id": "string",
      "title": "string",
      "type": "summary|chart|table|metrics|text|image",
      "dataSource": "string",
      "fields": [
        {
          "id": "string",
          "name": "string",
          "label": "string",
          "type": "text|number|currency|percentage|date|boolean|array",
          "format": "string",
          "isVisible": "boolean",
          "order": "number"
        }
      ],
      "order": "number",
      "isVisible": "boolean"
    }
  ],
  "styling": {
    "theme": "light|dark|corporate",
    "primaryColor": "string",
    "secondaryColor": "string",
    "fontFamily": "string",
    "fontSize": "number",
    "logo": "string",
    "headerText": "string",
    "footerText": "string"
  },
  "filters": [
    {
      "id": "string",
      "field": "string",
      "operator": "equals|not_equals|greater_than|less_than|contains|between|in|not_in",
      "value": "any",
      "isRequired": "boolean"
    }
  ],
  "schedule": {
    "frequency": "daily|weekly|monthly|quarterly|yearly",
    "dayOfWeek": "number",
    "dayOfMonth": "number",
    "time": "string",
    "timezone": "string",
    "isActive": "boolean"
  },
  "isActive": "boolean",
  "createdBy": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Report Generation

```typescript
import { reportExportService } from '@/lib/reportExportService';

// Generate admin report
const adminReport = await reportExportService.generateAdminReport(
  'revenue_analytics',
  [], // filters
  'pdf'
);

// Generate investor report
const investorReport = await reportExportService.generateInvestorReport(
  'financial_summary',
  [], // filters
  'pdf'
);
```

### 2. Export to Different Formats

```typescript
// Export to CSV
const csvExport = await reportExportService.exportToCSV(report);

// Export to PDF
const pdfExport = await reportExportService.exportToPDF(report);

// Export to Excel
const excelExport = await reportExportService.exportToExcel(report);

// Export to JSON
const jsonExport = await reportExportService.exportToJSON(report);
```

### 3. Template Management

```typescript
// Get report templates
const templates = await reportExportService.getReportTemplates();

// Create new template
const newTemplate = await reportExportService.createReportTemplate({
  templateName: 'Monthly Revenue Report',
  templateType: 'revenue_analytics',
  format: 'pdf',
  audience: 'admin',
  sections: [],
  styling: {
    theme: 'corporate',
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 12
  },
  filters: [],
  isActive: true,
  createdBy: 'admin'
});
```

## Report Types

### 1. Admin Reports

#### Revenue Analytics Report
```typescript
interface RevenueAnalyticsData {
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
```

#### Course Analytics Report
```typescript
interface CourseAnalyticsData {
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
```

#### Student Analytics Report
```typescript
interface StudentAnalyticsData {
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
```

### 2. Investor Reports

#### Executive Summary
```typescript
interface ExecutiveSummary {
  companyOverview: string;
  missionStatement: string;
  keyAchievements: string[];
  financialHighlights: string[];
  strategicInitiatives: string[];
  challengesAndRisks: string[];
}
```

#### Financial Highlights
```typescript
interface FinancialHighlights {
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
```

#### Key Metrics
```typescript
interface KeyMetrics {
  totalUsers: number;
  userGrowthRate: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  netPromoterScore: number;
  marketShare: number;
}
```

## Export Formats

### 1. CSV Export

#### CSV Structure
```csv
Section,Field,Value
Summary,Total Revenue,150000
Summary,Total Users,5000
Summary,Total Courses,50
Revenue Analytics,Total Revenue,150000
Revenue Analytics,Gross Revenue,160000
Revenue Analytics,Net Revenue,140000
```

#### CSV Generation
```typescript
const convertToCSV = (report: AdminReport | InvestorReport): string => {
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
  }
  
  return rows.join('\n');
};
```

### 2. PDF Export

#### PDF Generation
```typescript
const generatePDFContent = (report: AdminReport | InvestorReport): string => {
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
  
  const reportText = formatReportForPDF(report);
  content += `4 0 obj\n`;
  content += `<<\n`;
  content += `/Length ${reportText.length}\n`;
  content += `>>\n`;
  content += `stream\n`;
  content += reportText;
  content += `\nendstream\n`;
  content += `endobj\n`;
  
  return content;
};
```

### 3. Excel Export

#### Excel Generation
```typescript
const generateExcelContent = (report: AdminReport | InvestorReport): string => {
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
};
```

### 4. JSON Export

#### JSON Generation
```typescript
const exportToJSON = (report: AdminReport | InvestorReport): string => {
  return JSON.stringify(report, null, 2);
};
```

## Dashboard Features

### 1. Report Exports Tab
- **Export History**: View all generated reports
- **Download Management**: Download reports in various formats
- **Status Tracking**: Monitor export status
- **File Management**: Manage exported files

### 2. Templates Tab
- **Template Management**: Create and manage report templates
- **Template Preview**: Preview template structure
- **Template Editing**: Edit existing templates
- **Template Sharing**: Share templates across users

### 3. Generate Report Tab
- **Report Configuration**: Configure report parameters
- **Format Selection**: Choose export format
- **Audience Selection**: Select target audience
- **Report Preview**: Preview report before generation

## Report Templates

### 1. Admin Report Template
```typescript
const adminTemplate: ReportTemplate = {
  templateName: 'Monthly Admin Report',
  templateType: 'revenue_analytics',
  format: 'pdf',
  audience: 'admin',
  sections: [
    {
      id: 'summary',
      title: 'Executive Summary',
      type: 'summary',
      dataSource: 'summary',
      fields: [
        {
          id: 'totalRevenue',
          name: 'totalRevenue',
          label: 'Total Revenue',
          type: 'currency',
          format: 'USD',
          isVisible: true,
          order: 1
        },
        {
          id: 'totalUsers',
          name: 'totalUsers',
          label: 'Total Users',
          type: 'number',
          isVisible: true,
          order: 2
        }
      ],
      order: 1,
      isVisible: true
    }
  ],
  styling: {
    theme: 'corporate',
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 12
  },
  filters: [],
  isActive: true,
  createdBy: 'admin'
};
```

### 2. Investor Report Template
```typescript
const investorTemplate: ReportTemplate = {
  templateName: 'Quarterly Investor Report',
  templateType: 'financial_summary',
  format: 'pdf',
  audience: 'investor',
  sections: [
    {
      id: 'executiveSummary',
      title: 'Executive Summary',
      type: 'summary',
      dataSource: 'executiveSummary',
      fields: [
        {
          id: 'companyOverview',
          name: 'companyOverview',
          label: 'Company Overview',
          type: 'text',
          isVisible: true,
          order: 1
        },
        {
          id: 'keyAchievements',
          name: 'keyAchievements',
          label: 'Key Achievements',
          type: 'array',
          isVisible: true,
          order: 2
        }
      ],
      order: 1,
      isVisible: true
    }
  ],
  styling: {
    theme: 'corporate',
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 12
  },
  filters: [],
  isActive: true,
  createdBy: 'admin'
};
```

## Security Features

### 1. Access Control
- **Role-based Access**: Different access levels for different user roles
- **Audit Trail**: Track all report generation and downloads
- **Secure Downloads**: Secure file access with expiration
- **Data Privacy**: Protect sensitive data in reports

### 2. File Management
- **Secure Storage**: Files stored in secure S3 buckets
- **Access Tokens**: Secure download links with expiration
- **File Encryption**: Encrypt sensitive report data
- **Retention Policies**: Automatic file cleanup

## Best Practices

### 1. Report Design
- **Clear Structure**: Organize reports with clear sections
- **Consistent Formatting**: Use consistent formatting across reports
- **Data Validation**: Validate data before export
- **Error Handling**: Handle errors gracefully

### 2. Performance
- **Caching**: Cache frequently accessed data
- **Pagination**: Use pagination for large datasets
- **Async Processing**: Process large reports asynchronously
- **Resource Management**: Manage resources efficiently

### 3. Security
- **Data Privacy**: Protect sensitive data
- **Access Control**: Implement proper access controls
- **Audit Logging**: Log all report activities
- **Secure Storage**: Use secure storage solutions

## API Reference

### Report Export Service

#### Methods
- `generateAdminReport(reportType, filters, format)`: Generate admin report
- `generateInvestorReport(reportType, filters, format)`: Generate investor report
- `exportToCSV(report)`: Export report to CSV
- `exportToPDF(report)`: Export report to PDF
- `exportToExcel(report)`: Export report to Excel
- `exportToJSON(report)`: Export report to JSON
- `getReportExports()`: Get report exports
- `getReportTemplates()`: Get report templates
- `createReportTemplate(template)`: Create report template
- `formatCurrency(amount, currency)`: Format currency
- `formatPercentage(value)`: Format percentage
- `formatNumber(value)`: Format number
- `formatDate(date)`: Format date

## Future Enhancements

1. **Advanced Templates**: More sophisticated template system
2. **Real-time Reports**: Real-time report generation
3. **Custom Dashboards**: Customizable report dashboards
4. **API Integration**: Third-party API integration
5. **Machine Learning**: AI-powered report insights
6. **Mobile Reports**: Mobile-optimized reports
7. **Collaboration**: Collaborative report editing
8. **Automation**: Advanced automation features

## Support

For issues or questions:
1. Check report configuration
2. Verify data sources
3. Check export format
4. Review error logs
5. Contact technical support

The report export system provides comprehensive CSV and PDF export functionality for admin and investor reports with secure file management and customizable templates!

'use client';

import React, { useState, useEffect } from 'react';
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  reportExportService, 
  ReportExport, 
  ReportTemplate, 
  ReportType, 
  ExportFormat, 
  ReportAudience,
  AdminReport,
  InvestorReport
} from '@/lib/reportExportService';

interface ReportExportDashboardProps {
  userId: string;
  userRole: 'admin' | 'investor' | 'instructor' | 'student';
}

export function ReportExportDashboard({
  userId,
  userRole
}: ReportExportDashboardProps) {
  const [reportExports, setReportExports] = useState<ReportExport[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'exports' | 'templates' | 'generate'>('exports');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('revenue_analytics');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedAudience, setSelectedAudience] = useState<ReportAudience>('admin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [exports, templates] = await Promise.all([
        reportExportService.getReportExports(),
        reportExportService.getReportTemplates()
      ]);

      setReportExports(exports);
      setReportTemplates(templates);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      let report: ReportExport;
      
      if (selectedAudience === 'admin') {
        report = await reportExportService.generateAdminReport(
          selectedReportType,
          [], // filters would be added here
          selectedFormat
        );
      } else if (selectedAudience === 'investor') {
        report = await reportExportService.generateInvestorReport(
          selectedReportType,
          [], // filters would be added here
          selectedFormat
        );
      } else {
        throw new Error('Invalid audience selected');
      }

      setReportExports(prev => [report, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (report: ReportExport) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'processing':
        return <ClockIcon className="h-4 w-4" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'pdf':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'csv':
        return <TableCellsIcon className="h-5 w-5" />;
      case 'excel':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'json':
        return <DocumentIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'revenue_analytics':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'course_completion':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'student_progress':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'mentor_performance':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'ksmp_cohort':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'user_analytics':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'financial_summary':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'growth_metrics':
        return <ChartBarIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Export Center</h1>
            <p className="text-gray-600">Generate and manage reports for admin and investor use</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'exports', label: 'Report Exports', icon: DocumentArrowDownIcon },
              { id: 'templates', label: 'Templates', icon: CogIcon },
              { id: 'generate', label: 'Generate Report', icon: SparklesIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Report Exports Tab */}
          {activeTab === 'exports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Report Exports</h3>
                <button
                  onClick={loadData}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>

              {reportExports.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Report
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Format
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Downloads
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportExports.map((report) => (
                          <tr key={report.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getFormatIcon(report.format)}
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {report.reportName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {report.reportId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getReportTypeIcon(report.reportType)}
                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                  {report.reportType.replace('_', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {report.format.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                {getStatusIcon(report.status)}
                                <span className="ml-1 capitalize">{report.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.fileSize ? formatFileSize(report.fileSize) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(report.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.downloadCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {report.status === 'completed' && report.fileUrl ? (
                                <button
                                  onClick={() => handleDownloadReport(report)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                  <span>Download</span>
                                </button>
                              ) : (
                                <span className="text-gray-400">Not available</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentArrowDownIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No report exports yet</p>
                  <p className="text-sm text-gray-400">Generate your first report to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
                <button
                  onClick={handleCreateTemplate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Template</span>
                </button>
              </div>

              {reportTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getFormatIcon(template.format)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {template.templateName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="text-sm text-gray-900 capitalize">
                            {template.templateType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Audience:</span>
                          <span className="text-sm text-gray-900 capitalize">
                            {template.audience}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Format:</span>
                          <span className="text-sm text-gray-900 uppercase">
                            {template.format}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sections:</span>
                          <span className="text-sm text-gray-900">
                            {template.sections.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-sm font-semibold ${
                            template.isActive ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created: {formatDate(template.createdAt)}</span>
                          <span>Updated: {formatDate(template.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No templates created yet</p>
                  <p className="text-sm text-gray-400">Create your first template to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Generate Report Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Generate New Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Configuration */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Report Configuration</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <select
                        value={selectedReportType}
                        onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="revenue_analytics">Revenue Analytics</option>
                        <option value="course_completion">Course Completion</option>
                        <option value="student_progress">Student Progress</option>
                        <option value="mentor_performance">Mentor Performance</option>
                        <option value="ksmp_cohort">KSMP Cohort</option>
                        <option value="user_analytics">User Analytics</option>
                        <option value="financial_summary">Financial Summary</option>
                        <option value="growth_metrics">Growth Metrics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audience
                      </label>
                      <select
                        value={selectedAudience}
                        onChange={(e) => setSelectedAudience(e.target.value as ReportAudience)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="admin">Admin</option>
                        <option value="investor">Investor</option>
                        <option value="instructor">Instructor</option>
                        <option value="student">Student</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Export Format
                      </label>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Report Preview */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Report Preview</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {getReportTypeIcon(selectedReportType)}
                      <span className="text-sm text-gray-900 capitalize">
                        {selectedReportType.replace('_', ' ')} Report
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Audience: {selectedAudience}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getFormatIcon(selectedFormat)}
                      <span className="text-sm text-gray-600">
                        Format: {selectedFormat.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Period: Current Month
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4" />
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Features */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Report Features</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Real-time data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Multiple formats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Customizable templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Scheduled exports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Secure downloads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Audit trail</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

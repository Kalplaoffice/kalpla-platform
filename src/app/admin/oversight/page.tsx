'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  BellIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { adminOversightService, AdminAnalytics, DeadlineExtension, GradeOverride, ReportConfig, ReportData, SystemAlert } from '@/lib/adminOversightService';

export default function AdminOversightDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [deadlineExtensions, setDeadlineExtensions] = useState<DeadlineExtension[]>([]);
  const [gradeOverrides, setGradeOverrides] = useState<GradeOverride[]>([]);
  const [reportConfigs, setReportConfigs] = useState<ReportConfig[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'extensions' | 'overrides' | 'reports' | 'alerts'>('analytics');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'extension' | 'override' | 'report' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, extensionsData, overridesData, configsData, alertsData] = await Promise.all([
        adminOversightService.getPlatformAnalytics(),
        adminOversightService.getDeadlineExtensions(),
        adminOversightService.getGradeOverrides(),
        adminOversightService.getReportConfigurations(),
        adminOversightService.getSystemAlerts()
      ]);
      
      setAnalytics(analyticsData);
      setDeadlineExtensions(extensionsData);
      setGradeOverrides(overridesData);
      setReportConfigs(configsData);
      setSystemAlerts(alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load admin oversight data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveExtension = async (extensionId: string) => {
    try {
      const success = await adminOversightService.approveDeadlineExtension(extensionId, 'admin_1', 'Approved by admin');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error approving extension:', error);
    }
  };

  const handleRejectExtension = async (extensionId: string) => {
    try {
      const success = await adminOversightService.rejectDeadlineExtension(extensionId, 'admin_1', 'Rejected by admin');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error rejecting extension:', error);
    }
  };

  const handleApproveOverride = async (overrideId: string) => {
    try {
      const success = await adminOversightService.approveGradeOverride(overrideId, 'admin_1', 'Approved by admin');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error approving override:', error);
    }
  };

  const handleRejectOverride = async (overrideId: string) => {
    try {
      const success = await adminOversightService.rejectGradeOverride(overrideId, 'admin_1', 'Rejected by admin');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error rejecting override:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const success = await adminOversightService.acknowledgeAlert(alertId, 'admin_1');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const success = await adminOversightService.resolveAlert(alertId, 'admin_1');
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleGenerateReport = async (configId: string) => {
    try {
      const report = await adminOversightService.generateReport(configId, {}, 'admin_1');
      setReportData(prev => [...prev, report]);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin oversight data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Oversight</h1>
                <p className="text-gray-600">Platform analytics, deadline extensions, grade overrides, and reports</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">System Status</div>
                <div className="text-lg font-semibold text-green-600">Healthy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
                { id: 'extensions', name: 'Deadline Extensions', icon: ClockIcon },
                { id: 'overrides', name: 'Grade Overrides', icon: AcademicCapIcon },
                { id: 'reports', name: 'Reports', icon: DocumentArrowDownIcon },
                { id: 'alerts', name: 'System Alerts', icon: BellIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab analytics={analytics} />
        )}

        {activeTab === 'extensions' && (
          <ExtensionsTab 
            extensions={deadlineExtensions}
            onApprove={handleApproveExtension}
            onReject={handleRejectExtension}
          />
        )}

        {activeTab === 'overrides' && (
          <OverridesTab 
            overrides={gradeOverrides}
            onApprove={handleApproveOverride}
            onReject={handleRejectOverride}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            configs={reportConfigs}
            reports={reportData}
            onGenerate={handleGenerateReport}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsTab 
            alerts={systemAlerts}
            onAcknowledge={handleAcknowledgeAlert}
            onResolve={handleResolveAlert}
          />
        )}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ analytics }: { analytics: AdminAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.platformStats.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.platformStats.totalMentors}</p>
              <p className="text-sm text-gray-600">Total Mentors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.platformStats.totalAssignments}</p>
              <p className="text-sm text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{analytics.platformStats.averageGrade}%</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{analytics.academicStats.submissionRate}%</p>
            <p className="text-sm text-gray-600">Submission Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{analytics.academicStats.gradingCompletionRate}%</p>
            <p className="text-sm text-gray-600">Grading Completion</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{analytics.academicStats.lateSubmissionRate}%</p>
            <p className="text-sm text-gray-600">Late Submission Rate</p>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
        <div className="space-y-3">
          {analytics.academicStats.gradeDistribution.map((dist) => (
            <div key={dist.range} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{dist.range}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dist.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
                <span className="text-sm text-gray-500 w-12 text-right">{dist.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h2>
        <div className="space-y-3">
          {analytics.academicStats.coursePerformance.map((course) => (
            <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{course.courseName}</p>
                <p className="text-xs text-gray-500">{course.studentCount} students</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">{course.averageGrade}%</span>
                <span className="text-sm text-gray-600">{course.completionRate}% completion</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{analytics.systemHealth.uptime}%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{analytics.systemHealth.responseTime}ms</p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{analytics.systemHealth.errorRate}%</p>
            <p className="text-sm text-gray-600">Error Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extensions Tab Component
function ExtensionsTab({ 
  extensions, 
  onApprove, 
  onReject 
}: {
  extensions: DeadlineExtension[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredExtensions = extensions.filter(ext => 
    filterStatus === 'all' || ext.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Deadline Extensions</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Extensions List */}
      <div className="space-y-4">
        {filteredExtensions.map((extension) => (
          <div key={extension.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{extension.assignmentTitle}</h3>
                <p className="text-sm text-gray-600">{extension.studentName} ({extension.studentEmail})</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${adminOversightService.getStatusColor(extension.status)}`}>
                {extension.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Original Due Date</p>
                <p className="text-sm text-gray-900">{adminOversightService.formatDate(extension.originalDueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">New Due Date</p>
                <p className="text-sm text-gray-900">{adminOversightService.formatDate(extension.newDueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Extension Days</p>
                <p className="text-sm text-gray-900">{extension.extensionDays} days</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Reason</p>
              <p className="text-sm text-gray-900">{extension.reason}</p>
            </div>

            {extension.comments && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Comments</p>
                <p className="text-sm text-gray-900">{extension.comments}</p>
              </div>
            )}

            {extension.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => onApprove(extension.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(extension.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Overrides Tab Component
function OverridesTab({ 
  overrides, 
  onApprove, 
  onReject 
}: {
  overrides: GradeOverride[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOverrides = overrides.filter(override => 
    filterStatus === 'all' || override.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Grade Overrides</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Overrides List */}
      <div className="space-y-4">
        {filteredOverrides.map((override) => (
          <div key={override.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{override.assignmentTitle}</h3>
                <p className="text-sm text-gray-600">{override.studentName} ({override.studentEmail})</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${adminOversightService.getStatusColor(override.status)}`}>
                {override.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Original Grade</p>
                <p className="text-sm text-gray-900">{override.originalGrade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">New Grade</p>
                <p className="text-sm text-gray-900">{override.newGrade}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Reason</p>
              <p className="text-sm text-gray-900">{override.reason}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Justification</p>
              <p className="text-sm text-gray-900">{override.justification}</p>
            </div>

            {override.comments && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Comments</p>
                <p className="text-sm text-gray-900">{override.comments}</p>
              </div>
            )}

            {override.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => onApprove(override.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(override.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Reports Tab Component
function ReportsTab({ 
  configs, 
  reports, 
  onGenerate 
}: {
  configs: ReportConfig[];
  reports: ReportData[];
  onGenerate: (configId: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Report Configurations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configurations</h2>
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                <button
                  onClick={() => onGenerate(config.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{config.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Type: {config.type}</span>
                {config.lastGenerated && (
                  <span>Last Generated: {adminOversightService.formatDate(config.lastGenerated)}</span>
                )}
                {config.schedule && (
                  <span>Schedule: {config.schedule.frequency}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Reports</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{report.name}</p>
                <p className="text-xs text-gray-500">Generated: {adminOversightService.formatDate(report.generatedAt)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  report.status === 'completed' ? 'bg-green-100 text-green-800' :
                  report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {report.status}
                </span>
                {report.downloadUrl && (
                  <a
                    href={report.downloadUrl}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 inline mr-1" />
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Alerts Tab Component
function AlertsTab({ 
  alerts, 
  onAcknowledge, 
  onResolve 
}: {
  alerts: SystemAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${adminOversightService.getAlertTypeColor(alert.type)}`}>
                  {alert.type}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${adminOversightService.getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${adminOversightService.getStatusColor(alert.status)}`}>
                  {alert.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">{adminOversightService.formatDate(alert.createdAt)}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{alert.message}</p>

            {alert.actions && alert.actions.length > 0 && (
              <div className="flex space-x-3">
                {alert.actions.map((action) => (
                  <button
                    key={action.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {alert.status === 'active' && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => onResolve(alert.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

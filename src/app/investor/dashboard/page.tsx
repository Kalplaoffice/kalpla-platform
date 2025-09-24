'use client';

import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  GlobeAltIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { investorDashboardService, InvestorDashboardData, FeaturedStartup, DemoDay, StartupFilters } from '@/lib/investorDashboardService';

export default function InvestorDashboard() {
  const [dashboardData, setDashboardData] = useState<InvestorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'startups' | 'meetings' | 'demo-days'>('overview');
  const [selectedStartup, setSelectedStartup] = useState<FeaturedStartup | null>(null);
  const [showStartupModal, setShowStartupModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [filters, setFilters] = useState<StartupFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await investorDashboardService.getDashboardData('current_investor');
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async (startupId: string, startupName: string) => {
    try {
      const meetingData = {
        investorId: 'current_investor',
        investorName: 'Current Investor',
        startupId: startupId,
        startupName: startupName,
        meetingType: 'pitch_meeting' as const,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        duration: 60,
        status: 'scheduled' as const,
        agenda: 'Initial pitch meeting',
        attendees: [
          { name: 'Current Investor', email: 'investor@example.com', role: 'investor' },
          { name: 'Startup Founder', email: 'founder@startup.com', role: 'founder' }
        ]
      };

      await investorDashboardService.scheduleMeeting(meetingData);
      setShowMeetingModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const handleExpressInterest = async (startupId: string, startupName: string, interestLevel: string) => {
    try {
      const interestData = {
        investorId: 'current_investor',
        investorName: 'Current Investor',
        startupId: startupId,
        startupName: startupName,
        interestLevel: interestLevel as any,
        investmentAmount: 1000000, // Mock amount
        timeline: '3-6 months',
        status: 'expressed' as const,
        notes: 'Interested in learning more about this opportunity'
      };

      await investorDashboardService.expressInterest(interestData);
      setShowInterestModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error expressing interest:', error);
    }
  };

  const handleRegisterDemoDay = async (demoDayId: string) => {
    try {
      const success = await investorDashboardService.registerForDemoDay(demoDayId, 'current_investor');
      if (success) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error registering for demo day:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to load dashboard data.</p>
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
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
                <p className="text-gray-600">Discover and invest in innovative startups</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Investment
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'startups', name: 'Featured Startups', icon: BuildingOfficeIcon },
                { id: 'meetings', name: 'Meetings', icon: CalendarIcon },
                { id: 'demo-days', name: 'Demo Days', icon: VideoCameraIcon }
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
        {activeTab === 'overview' && (
          <OverviewTab dashboardData={dashboardData} />
        )}

        {activeTab === 'startups' && (
          <StartupsTab 
            startups={dashboardData.featuredStartups}
            onSelectStartup={setSelectedStartup}
            onShowStartupModal={() => setShowStartupModal(true)}
            onShowMeetingModal={() => setShowMeetingModal(true)}
            onShowInterestModal={() => setShowInterestModal(true)}
            filters={filters}
            onFiltersChange={setFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsTab meetings={dashboardData.scheduledMeetings} />
        )}

        {activeTab === 'demo-days' && (
          <DemoDaysTab 
            demoDays={dashboardData.upcomingDemoDays}
            onRegisterDemoDay={handleRegisterDemoDay}
          />
        )}

        {/* Startup Details Modal */}
        {showStartupModal && selectedStartup && (
          <StartupDetailsModal 
            startup={selectedStartup}
            onClose={() => setShowStartupModal(false)}
            onScheduleMeeting={() => setShowMeetingModal(true)}
            onExpressInterest={() => setShowInterestModal(true)}
          />
        )}

        {/* Meeting Modal */}
        {showMeetingModal && selectedStartup && (
          <MeetingModal 
            startup={selectedStartup}
            onClose={() => setShowMeetingModal(false)}
            onSchedule={handleScheduleMeeting}
          />
        )}

        {/* Interest Modal */}
        {showInterestModal && selectedStartup && (
          <InterestModal 
            startup={selectedStartup}
            onClose={() => setShowInterestModal(false)}
            onExpress={handleExpressInterest}
          />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ dashboardData }: { dashboardData: InvestorDashboardData }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.totalStartupsViewed}</p>
              <p className="text-sm text-gray-600">Startups Viewed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.totalMeetingsScheduled}</p>
              <p className="text-sm text-gray-600">Meetings Scheduled</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <StarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.totalInterestsExpressed}</p>
              <p className="text-sm text-gray-600">Interests Expressed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ₹{dashboardData.analytics.averageInvestmentAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600">Avg Investment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {dashboardData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'meeting' ? (
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <StarIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorDashboardService.getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {investorDashboardService.formatDate(activity.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Industries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Industries</h2>
        <div className="space-y-3">
          {dashboardData.analytics.topIndustries.map((industry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{industry.industry}</span>
              <span className="text-sm text-gray-600">{industry.count} startups</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Startups Tab Component
function StartupsTab({ 
  startups, 
  onSelectStartup,
  onShowStartupModal,
  onShowMeetingModal,
  onShowInterestModal,
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange
}: {
  startups: FeaturedStartup[];
  onSelectStartup: (startup: FeaturedStartup) => void;
  onShowStartupModal: () => void;
  onShowMeetingModal: () => void;
  onShowInterestModal: () => void;
  filters: StartupFilters;
  onFiltersChange: (filters: StartupFilters) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = searchTerm === '' || 
      startup.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !filters.industry || filters.industry.length === 0 || 
      filters.industry.includes(startup.industry);
    
    const matchesStage = !filters.stage || filters.stage.length === 0 || 
      filters.stage.includes(startup.stage);
    
    return matchesSearch && matchesIndustry && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search startups..."
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <div key={startup.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{startup.startupName}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorDashboardService.getStatusColor(startup.status)}`}>
                  {startup.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{startup.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  {startup.industry}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {startup.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {startup.teamSize} team members
                </div>
                {startup.fundingRaised && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    ₹{startup.fundingRaised.toLocaleString('en-IN')} raised
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectStartup(startup);
                    onShowStartupModal();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View Details
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onSelectStartup(startup);
                      onShowMeetingModal();
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => {
                      onSelectStartup(startup);
                      onShowInterestModal();
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Interest
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredStartups.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Startups Found</h3>
          <p className="text-gray-600">No startups match your current filters.</p>
        </div>
      )}
    </div>
  );
}

// Meetings Tab Component
function MeetingsTab({ meetings }: { meetings: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Meetings</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    meeting.status === 'scheduled' ? 'bg-blue-100' :
                    meeting.status === 'confirmed' ? 'bg-green-100' :
                    meeting.status === 'completed' ? 'bg-gray-100' :
                    'bg-red-100'
                  }`}>
                    <CalendarIcon className={`h-6 w-6 ${
                      meeting.status === 'scheduled' ? 'text-blue-600' :
                      meeting.status === 'confirmed' ? 'text-green-600' :
                      meeting.status === 'completed' ? 'text-gray-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.startupName}</h3>
                    <p className="text-sm text-gray-600">{meeting.meetingType.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">
                      {investorDashboardService.formatDate(meeting.scheduledDate)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorDashboardService.getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{meeting.duration} minutes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {meetings.length === 0 && (
          <div className="p-8 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Meetings Scheduled</h3>
            <p className="text-gray-600">You don't have any meetings scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Demo Days Tab Component
function DemoDaysTab({ demoDays, onRegisterDemoDay }: { demoDays: DemoDay[], onRegisterDemoDay: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoDays.map((demoDay) => (
          <div key={demoDay.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{demoDay.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${investorDashboardService.getStatusColor(demoDay.status)}`}>
                  {demoDay.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{demoDay.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {investorDashboardService.formatDate(demoDay.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {demoDay.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {demoDay.currentAttendees} / {demoDay.maxAttendees || '∞'} attendees
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  {demoDay.featuredStartups.length} startups
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onRegisterDemoDay(demoDay.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Register
                </button>
                
                {demoDay.virtualLink && (
                  <a
                    href={demoDay.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <VideoCameraIcon className="h-5 w-5 mr-2" />
                    Join Virtual
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {demoDays.length === 0 && (
        <div className="text-center py-12">
          <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Demo Days Scheduled</h3>
          <p className="text-gray-600">No upcoming demo days are currently scheduled.</p>
        </div>
      )}
    </div>
  );
}

// Startup Details Modal
function StartupDetailsModal({ 
  startup, 
  onClose, 
  onScheduleMeeting, 
  onExpressInterest 
}: {
  startup: FeaturedStartup;
  onClose: () => void;
  onScheduleMeeting: () => void;
  onExpressInterest: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{startup.startupName}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Industry</p>
                  <p className="text-sm text-gray-900">{startup.industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Stage</p>
                  <p className="text-sm text-gray-900">{startup.stage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">{startup.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Team Size</p>
                  <p className="text-sm text-gray-900">{startup.teamSize}</p>
                </div>
              </div>
            </div>

            {/* Funding Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {startup.fundingRaised && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Funding Raised</p>
                    <p className="text-sm text-gray-900">₹{startup.fundingRaised.toLocaleString('en-IN')}</p>
                  </div>
                )}
                {startup.fundingGoal && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Funding Goal</p>
                    <p className="text-sm text-gray-900">₹{startup.fundingGoal.toLocaleString('en-IN')}</p>
                  </div>
                )}
                {startup.valuation && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Valuation</p>
                    <p className="text-sm text-gray-900">₹{startup.valuation.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Model */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Model</h3>
              <p className="text-sm text-gray-900">{startup.businessModel}</p>
            </div>

            {/* Competitive Advantage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Competitive Advantage</h3>
              <p className="text-sm text-gray-900">{startup.competitiveAdvantage}</p>
            </div>

            {/* Investment Highlights */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Highlights</h3>
              <ul className="list-disc list-inside space-y-1">
                {startup.investmentHighlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-gray-900">{highlight}</li>
                ))}
              </ul>
            </div>

            {/* Use of Funds */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Use of Funds</h3>
              <p className="text-sm text-gray-900">{startup.useOfFunds}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onScheduleMeeting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Schedule Meeting
            </button>
            <button
              onClick={onExpressInterest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Express Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Meeting Modal
function MeetingModal({ 
  startup, 
  onClose, 
  onSchedule 
}: {
  startup: FeaturedStartup;
  onClose: () => void;
  onSchedule: (startupId: string, startupName: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Schedule Meeting</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Startup: {startup.startupName}</p>
            <p className="text-sm text-gray-600">Industry: {startup.industry}</p>
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSchedule(startup.id, startup.startupName)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interest Modal
function InterestModal({ 
  startup, 
  onClose, 
  onExpress 
}: {
  startup: FeaturedStartup;
  onClose: () => void;
  onExpress: (startupId: string, startupName: string, interestLevel: string) => void;
}) {
  const [interestLevel, setInterestLevel] = useState('medium');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Express Interest</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Startup: {startup.startupName}</p>
            <p className="text-sm text-gray-600">Industry: {startup.industry}</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest Level</label>
            <select
              value={interestLevel}
              onChange={(e) => setInterestLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onExpress(startup.id, startup.startupName, interestLevel)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Express Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
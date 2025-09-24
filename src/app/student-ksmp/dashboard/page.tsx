'use client';

import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  VideoCameraIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  StarIcon,
  ArrowRightIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { ksmpService, KSMPPhase, KSMPAssignment, LiveClass, MentorMeeting, KSMPProgress } from '@/lib/ksmpService';

export default function KSMPStudentDashboard() {
  const [phases, setPhases] = useState<KSMPPhase[]>([]);
  const [assignments, setAssignments] = useState<KSMPAssignment[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [mentorMeetings, setMentorMeetings] = useState<MentorMeeting[]>([]);
  const [progress, setProgress] = useState<KSMPProgress | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'assignments' | 'classes' | 'meetings'>('overview');

  useEffect(() => {
    loadKSMPData();
  }, []);

  const loadKSMPData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [phasesData, assignmentsData, liveClassesData, mentorMeetingsData, progressData, eventsData] = await Promise.all([
        ksmpService.getKSMPPhases(),
        ksmpService.getKSMPAssignments(),
        ksmpService.getLiveClasses(),
        ksmpService.getMentorMeetings(),
        ksmpService.getKSMPProgress(),
        ksmpService.getUpcomingEvents()
      ]);
      
      setPhases(phasesData);
      setAssignments(assignmentsData);
      setLiveClasses(liveClassesData);
      setMentorMeetings(mentorMeetingsData);
      setProgress(progressData);
      setUpcomingEvents(eventsData);
    } catch (error) {
      console.error('Error loading KSMP data:', error);
      setError('Failed to load KSMP dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return ksmpService.formatDate(dateString);
  };

  const formatTime = (dateString: string) => {
    return ksmpService.formatTime(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KSMP dashboard...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KSMP Student Dashboard</h1>
              <p className="text-gray-600">Kalpla Student Mentorship Program</p>
            </div>
          </div>
          
          {progress && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
                <span className="text-2xl font-bold text-blue-600">{progress.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress.overallProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{progress.completedPhases}/{progress.totalPhases}</p>
                  <p className="text-gray-600">Phases</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{progress.assignmentsCompleted}/{progress.totalAssignments}</p>
                  <p className="text-gray-600">Assignments</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{progress.liveSessionsAttended}/{progress.totalLiveSessions}</p>
                  <p className="text-gray-600">Live Sessions</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{progress.mentorMeetingsCompleted}/{progress.totalMentorMeetings}</p>
                  <p className="text-gray-600">Mentor Meetings</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'phases', name: 'Phases', icon: AcademicCapIcon },
                { id: 'assignments', name: 'Assignments', icon: BookOpenIcon },
                { id: 'classes', name: 'Live Classes', icon: VideoCameraIcon },
                { id: 'meetings', name: 'Mentor Meetings', icon: ChatBubbleLeftIcon }
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
          <OverviewTab 
            phases={phases}
            assignments={assignments}
            liveClasses={liveClasses}
            mentorMeetings={mentorMeetings}
            upcomingEvents={upcomingEvents}
            progress={progress}
          />
        )}

        {activeTab === 'phases' && (
          <PhasesTab phases={phases} />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab assignments={assignments} />
        )}

        {activeTab === 'classes' && (
          <ClassesTab liveClasses={liveClasses} />
        )}

        {activeTab === 'meetings' && (
          <MeetingsTab mentorMeetings={mentorMeetings} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  phases, 
  assignments, 
  liveClasses, 
  mentorMeetings, 
  upcomingEvents, 
  progress 
}: {
  phases: KSMPPhase[];
  assignments: KSMPAssignment[];
  liveClasses: LiveClass[];
  mentorMeetings: MentorMeeting[];
  upcomingEvents: any[];
  progress: KSMPProgress | null;
}) {
  const currentPhase = phases.find(p => p.status === 'current');
  const recentAssignments = assignments.slice(0, 3);
  const upcomingClasses = liveClasses.filter(c => c.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Current Phase */}
      {currentPhase && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Phase</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{currentPhase.name}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${ksmpService.getStatusColor(currentPhase.status)}`}>
                {currentPhase.status.charAt(0).toUpperCase() + currentPhase.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{currentPhase.description}</p>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentPhase.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentPhase.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <VideoCameraIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Classes</p>
              <p className="text-2xl font-bold text-gray-900">{liveClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mentor Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{mentorMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{progress?.achievements.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-600">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    event.type === 'class' ? 'bg-green-500' :
                    event.type === 'meeting' ? 'bg-blue-500' :
                    event.type === 'deadline' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  event.status === 'live' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
          {recentAssignments.length === 0 ? (
            <p className="text-gray-600">No recent assignments</p>
          ) : (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600">{assignment.phaseName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${ksmpService.getStatusColor(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
          {upcomingClasses.length === 0 ? (
            <p className="text-gray-600">No upcoming classes</p>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((liveClass) => (
                <div key={liveClass.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{liveClass.title}</p>
                    <p className="text-sm text-gray-600">{liveClass.instructor.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{ksmpService.formatDate(liveClass.scheduledDate)}</p>
                    <p className="text-sm text-gray-600">{ksmpService.formatTime(liveClass.scheduledDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Phases Tab Component
function PhasesTab({ phases }: { phases: KSMPPhase[] }) {
  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <div key={phase.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{phase.name}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${ksmpService.getStatusColor(phase.status)}`}>
                  {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{phase.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{phase.completed.assignments}/{phase.requirements.assignments}</p>
                  <p className="text-sm text-gray-600">Assignments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{phase.completed.liveSessions}/{phase.requirements.liveSessions}</p>
                  <p className="text-sm text-gray-600">Live Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{phase.completed.mentorMeetings}/{phase.requirements.mentorMeetings}</p>
                  <p className="text-sm text-gray-600">Mentor Meetings</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Phase Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentors */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Mentors</h4>
            <div className="flex flex-wrap gap-2">
              {phase.mentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                  <UserGroupIcon className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">{mentor.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({mentor.role})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
            <div className="space-y-2">
              {phase.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">{resource.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {resource.completed && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ assignments }: { assignments: KSMPAssignment[] }) {
  return (
    <div className="space-y-6">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${ksmpService.getStatusColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{assignment.description}</p>
              <p className="text-sm text-gray-500 mb-4">{assignment.phaseName}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Due: {ksmpService.formatDate(assignment.dueDate)}
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                </div>
                {assignment.grade && (
                  <div className="flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-1" />
                    Grade: {assignment.grade}/{assignment.maxGrade}
                  </div>
                )}
              </div>

              {assignment.feedback && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                  <p className="text-sm text-gray-700">{assignment.feedback}</p>
                </div>
              )}

              {assignment.submission && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Submission</h4>
                  <p className="text-sm text-gray-700 mb-2">{assignment.submission.content}</p>
                  <p className="text-xs text-gray-500">Submitted: {ksmpService.formatDate(assignment.submission.submittedAt)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
            {(assignment.status === 'not-started' || assignment.status === 'in-progress') && (
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <PencilIcon className="h-4 w-4 mr-2" />
                Submit Work
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Classes Tab Component
function ClassesTab({ liveClasses }: { liveClasses: LiveClass[] }) {
  return (
    <div className="space-y-6">
      {liveClasses.map((liveClass) => (
        <div key={liveClass.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{liveClass.title}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${ksmpService.getStatusColor(liveClass.status)}`}>
                  {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{liveClass.description}</p>
              <p className="text-sm text-gray-500 mb-4">{liveClass.phaseName}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {liveClass.instructor.name}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {ksmpService.formatDate(liveClass.scheduledDate)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {ksmpService.formatTime(liveClass.scheduledDate)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {liveClass.duration} minutes
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {liveClass.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                <div className="space-y-2">
                  {liveClass.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-700">{material.title}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {liveClass.status === 'upcoming' && liveClass.meetingUrl && (
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <PlayIcon className="h-4 w-4 mr-2" />
                Join Class
              </button>
            )}
            {liveClass.status === 'completed' && liveClass.recordingUrl && (
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Watch Recording
              </button>
            )}
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Meetings Tab Component
function MeetingsTab({ mentorMeetings }: { mentorMeetings: MentorMeeting[] }) {
  return (
    <div className="space-y-6">
      {mentorMeetings.map((meeting) => (
        <div key={meeting.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Meeting with {meeting.mentorName}</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${ksmpService.getStatusColor(meeting.status)}`}>
                  {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {ksmpService.formatDate(meeting.scheduledDate)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {ksmpService.formatTime(meeting.scheduledDate)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {meeting.duration} minutes
                </div>
              </div>

              {meeting.agenda.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {meeting.agenda.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {meeting.notes && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Meeting Notes</h4>
                  <p className="text-sm text-gray-700">{meeting.notes}</p>
                </div>
              )}

              {meeting.actionItems.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Action Items</h4>
                  <div className="space-y-2">
                    {meeting.actionItems.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          {action.completed ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          )}
                          <span className="text-sm text-gray-700">{action.description}</span>
                        </div>
                        <span className="text-xs text-gray-500">Due: {ksmpService.formatDate(action.dueDate)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meeting.feedback && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Mentor Feedback</h4>
                  <p className="text-sm text-gray-700">{meeting.feedback}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            {meeting.status === 'scheduled' && meeting.meetingUrl && (
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Join Meeting
              </button>
            )}
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
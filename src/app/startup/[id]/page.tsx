'use client';

import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  UserGroupIcon,
  PlayIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  StarIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  RocketLaunchIcon,
  TrophyIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { startupProfileService, StartupProfile, TeamMember, TractionUpdate, Milestone, Experience, Education } from '@/lib/startupProfileService';
import { OverviewTab, TeamTab, TractionTab, MilestonesTab, MediaTab } from './components';
import { TeamMemberModal, TractionUpdateModal, MilestoneModal } from './modals';

export default function StartupProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tractionUpdates, setTractionUpdates] = useState<TractionUpdate[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'traction' | 'milestones' | 'media'>('overview');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingUpdate, setEditingUpdate] = useState<TractionUpdate | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [params.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileData, teamData, updatesData, milestonesData] = await Promise.all([
        startupProfileService.getProfileById(params.id),
        startupProfileService.getTeamMembers(params.id),
        startupProfileService.getTractionUpdates(params.id),
        startupProfileService.getMilestones(params.id)
      ]);

      setProfile(profileData);
      setTeamMembers(teamData);
      setTractionUpdates(updatesData);
      setMilestones(milestonesData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load startup profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await startupProfileService.addTeamMember(memberData);
      await loadProfileData();
      setShowTeamModal(false);
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleAddTractionUpdate = async (updateData: Omit<TractionUpdate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await startupProfileService.addTractionUpdate(updateData);
      await loadProfileData();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error adding traction update:', error);
    }
  };

  const handleAddMilestone = async (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await startupProfileService.addMilestone(milestoneData);
      await loadProfileData();
      setShowMilestoneModal(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading startup profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The requested startup profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          {/* Cover Image */}
          <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            {profile.coverImage && (
              <img 
                src={profile.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            
            {/* Logo */}
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center">
                {profile.logo ? (
                  <img src={profile.logo} alt="Logo" className="w-20 h-20 object-contain" />
                ) : (
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.startupName}</h1>
                  {profile.verified && (
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                  )}
                  {profile.featured && (
                    <StarIcon className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                
                <p className="text-lg text-gray-600 mb-4">{profile.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Founded {startupProfileService.formatDate(profile.foundedDate)}
                  </div>
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {profile.industry}
                  </div>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    {profile.stage.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'team', name: 'Team', icon: UserGroupIcon },
                { id: 'traction', name: 'Traction', icon: ArrowTrendingUpIcon },
                { id: 'milestones', name: 'Milestones', icon: TrophyIcon },
                { id: 'media', name: 'Media', icon: VideoCameraIcon }
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
          <OverviewTab profile={profile} />
        )}

        {activeTab === 'team' && (
          <TeamTab 
            teamMembers={teamMembers}
            onAddMember={() => setShowTeamModal(true)}
            onEditMember={setEditingMember}
          />
        )}

        {activeTab === 'traction' && (
          <TractionTab 
            tractionUpdates={tractionUpdates}
            onAddUpdate={() => setShowUpdateModal(true)}
            onEditUpdate={setEditingUpdate}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesTab 
            milestones={milestones}
            onAddMilestone={() => setShowMilestoneModal(true)}
            onEditMilestone={setEditingMilestone}
          />
        )}

        {activeTab === 'media' && (
          <MediaTab profile={profile} />
        )}

        {/* Modals */}
        {showTeamModal && (
          <TeamMemberModal 
            onClose={() => setShowTeamModal(false)}
            onSave={handleAddTeamMember}
            startupId={profile.id}
            startupName={profile.startupName}
          />
        )}

        {showUpdateModal && (
          <TractionUpdateModal 
            onClose={() => setShowUpdateModal(false)}
            onSave={handleAddTractionUpdate}
            startupId={profile.id}
            startupName={profile.startupName}
          />
        )}

        {showMilestoneModal && (
          <MilestoneModal 
            onClose={() => setShowMilestoneModal(false)}
            onSave={handleAddMilestone}
            startupId={profile.id}
            startupName={profile.startupName}
          />
        )}
      </div>
    </div>
  );
}

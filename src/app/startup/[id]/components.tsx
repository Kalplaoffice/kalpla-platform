import React from 'react';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  GlobeAltIcon,
  TrophyIcon,
  PlayIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { startupProfileService, StartupProfile, TeamMember, TractionUpdate, Milestone } from '@/lib/startupProfileService';

// Overview Tab Component
function OverviewTab({ profile }: { profile: StartupProfile }) {
  const funding = JSON.parse(profile.funding as any);
  const traction = JSON.parse(profile.traction as any);
  const metrics = JSON.parse(profile.metrics as any);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{traction.users?.toLocaleString('en-IN') || '0'}</p>
              <p className="text-sm text-gray-600">Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ₹{traction.revenue?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{traction.growthRate || 0}%</p>
              <p className="text-sm text-gray-600">Growth Rate</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{profile.team.length}</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Funding Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{funding.totalRaised?.toLocaleString('en-IN') || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Current Round</p>
            <p className="text-lg font-semibold text-gray-900">
              {funding.currentRound || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Funding Goal</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{funding.fundingGoal?.toLocaleString('en-IN') || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h2>
        <div className="space-y-4">
          {profile.updates.slice(0, 3).map((update: any, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${startupProfileService.getCategoryColor(update.category)}`}>
                <ArrowTrendingUpIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{update.title}</h3>
                <p className="text-sm text-gray-600">{update.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {startupProfileService.formatDate(update.publishedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Team Tab Component
function TeamTab({ 
  teamMembers, 
  onAddMember, 
  onEditMember 
}: {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onEditMember: (member: TeamMember) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <button
          onClick={onAddMember}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <UserGroupIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
                {member.isFounder && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Founder
                  </span>
                )}
              </div>
            </div>
            
            {member.bio && (
              <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
            )}
            
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-700">Expertise</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.expertise.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {skill}
                    </span>
                  ))}
                  {member.expertise.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{member.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
              
              <button
                onClick={() => onEditMember(member)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
          <p className="text-gray-600">Add team members to showcase your team.</p>
        </div>
      )}
    </div>
  );
}

// Traction Tab Component
function TractionTab({ 
  tractionUpdates, 
  onAddUpdate, 
  onEditUpdate 
}: {
  tractionUpdates: TractionUpdate[];
  onAddUpdate: () => void;
  onEditUpdate: (update: TractionUpdate) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Traction Updates</h2>
        <button
          onClick={onAddUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Update
        </button>
      </div>

      <div className="space-y-4">
        {tractionUpdates.map((update) => (
          <div key={update.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${startupProfileService.getCategoryColor(update.category)}`}>
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                  <p className="text-sm text-gray-600">
                    {startupProfileService.formatDate(update.publishedAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${startupProfileService.getCategoryColor(update.category)}`}>
                  {update.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => onEditUpdate(update)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{update.description}</p>
            
            {update.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                {Object.entries(JSON.parse(update.metrics as any)).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-700">{key}</p>
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {tractionUpdates.length === 0 && (
        <div className="text-center py-12">
          <ArrowTrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Traction Updates</h3>
          <p className="text-gray-600">Add traction updates to showcase your progress.</p>
        </div>
      )}
    </div>
  );
}

// Milestones Tab Component
function MilestonesTab({ 
  milestones, 
  onAddMilestone, 
  onEditMilestone 
}: {
  milestones: Milestone[];
  onAddMilestone: () => void;
  onEditMilestone: (milestone: Milestone) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
        <button
          onClick={onAddMilestone}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${startupProfileService.getCategoryColor(milestone.category)}`}>
                  <TrophyIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">
                    {startupProfileService.formatDate(milestone.achievedDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${startupProfileService.getCategoryColor(milestone.category)}`}>
                  {milestone.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => onEditMilestone(milestone)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{milestone.description}</p>
            
            {milestone.impact && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Impact</p>
                <p className="text-sm text-green-700">{milestone.impact}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {milestones.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones</h3>
          <p className="text-gray-600">Add milestones to showcase your achievements.</p>
        </div>
      )}
    </div>
  );
}

// Media Tab Component
function MediaTab({ profile }: { profile: StartupProfile }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Media</h2>
      
      {/* Pitch Video */}
      {profile.pitchVideo && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pitch Video</h3>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Pitch Video Available</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Watch Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Video */}
      {profile.demoVideo && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Video</h3>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Demo Video Available</p>
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Deck */}
      {profile.pitchDeck && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pitch Deck</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pitch Deck</p>
                <p className="text-xs text-gray-600">PDF Document</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              View Deck
            </button>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center">
            <VideoCameraIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Upload Pitch Video</p>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors text-center">
            <PlayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Upload Demo Video</p>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors text-center">
            <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Upload Pitch Deck</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Export all components
export { OverviewTab, TeamTab, TractionTab, MilestonesTab, MediaTab };

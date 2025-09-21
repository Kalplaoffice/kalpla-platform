'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CloudIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon,
  PlayIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface DeploymentStatus {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  description: string;
  progress: number;
  lastUpdated: string;
  details?: string;
}

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  startTime?: string;
  endTime?: string;
  error?: string;
}

export default function VideoDeploymentPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus[]>([
    {
      id: '1',
      name: 'AWS Amplify Initialization',
      status: 'completed',
      description: 'Initialize Amplify project and configure basic settings',
      progress: 100,
      lastUpdated: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Cognito Authentication Setup',
      status: 'completed',
      description: 'Configure Cognito User Pool with multi-option login',
      progress: 100,
      lastUpdated: '2024-01-20T10:15:00Z'
    },
    {
      id: '3',
      name: 'GraphQL API Configuration',
      status: 'completed',
      description: 'Set up AppSync GraphQL API with schema',
      progress: 100,
      lastUpdated: '2024-01-20T10:30:00Z'
    },
    {
      id: '4',
      name: 'S3 Storage Setup',
      status: 'in-progress',
      description: 'Create S3 bucket for video storage with proper permissions',
      progress: 75,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '5',
      name: 'CloudFront Distribution',
      status: 'pending',
      description: 'Set up CloudFront CDN for video delivery',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '6',
      name: 'Lambda Functions Deployment',
      status: 'pending',
      description: 'Deploy video access manager and analytics functions',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '7',
      name: 'DynamoDB Tables Creation',
      status: 'pending',
      description: 'Create DynamoDB tables for video analytics and progress tracking',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '8',
      name: 'API Gateway Configuration',
      status: 'pending',
      description: 'Set up API Gateway for video access endpoints',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '9',
      name: 'Signed URL Configuration',
      status: 'pending',
      description: 'Configure CloudFront signed URLs for secure video access',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    },
    {
      id: '10',
      name: 'Video Analytics Dashboard',
      status: 'pending',
      description: 'Deploy video analytics dashboard and reporting',
      progress: 0,
      lastUpdated: '2024-01-20T10:45:00Z'
    }
  ]);

  const [currentStep, setCurrentStep] = useState<DeploymentStep | null>(null);
  const [overallProgress, setOverallProgress] = useState(30);
  const [isDeploying, setIsDeploying] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const startDeployment = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    for (let i = 3; i < deploymentStatus.length; i++) {
      const step = deploymentStatus[i];
      
      // Set current step
      setCurrentStep({
        id: step.id,
        name: step.name,
        status: 'in-progress',
        progress: 0,
        startTime: new Date().toISOString()
      });

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setCurrentStep(prev => prev ? { ...prev, progress } : null);
        
        // Update overall progress
        const completedSteps = deploymentStatus.filter(s => s.status === 'completed').length;
        const currentStepProgress = (progress / 100) * (1 / (deploymentStatus.length - completedSteps));
        setOverallProgress(Math.round((completedSteps + currentStepProgress) * 10));
      }

      // Mark step as completed
      setDeploymentStatus(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'completed', progress: 100, lastUpdated: new Date().toISOString() }
          : s
      ));

      setCurrentStep(null);
    }

    setIsDeploying(false);
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case '1':
        return <CogIcon className="h-5 w-5" />;
      case '2':
        return <CloudIcon className="h-5 w-5" />;
      case '3':
        return <ServerIcon className="h-5 w-5" />;
      case '4':
        return <CircleStackIcon className="h-5 w-5" />;
      case '5':
        return <GlobeAltIcon className="h-5 w-5" />;
      case '6':
        return <ServerIcon className="h-5 w-5" />;
      case '7':
        return <CircleStackIcon className="h-5 w-5" />;
      case '8':
        return <ServerIcon className="h-5 w-5" />;
      case '9':
        return <GlobeAltIcon className="h-5 w-5" />;
      case '10':
        return <ChartBarIcon className="h-5 w-5" />;
      default:
        return <PlayIcon className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Player Deployment</h1>
          <p className="text-gray-600">Monitor and manage the deployment of the video player infrastructure</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-sm text-gray-500">{overallProgress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{deploymentStatus.filter(s => s.status === 'completed').length} of {deploymentStatus.length} steps completed</span>
            <span>{deploymentStatus.filter(s => s.status === 'in-progress').length} in progress</span>
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Step</h2>
              <span className="text-sm text-gray-500">{currentStep.progress}% Complete</span>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              {getStepIcon(currentStep.id)}
              <div>
                <h3 className="font-medium text-gray-900">{currentStep.name}</h3>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentStep.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Deployment Steps */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Deployment Steps</h2>
              <button
                onClick={startDeployment}
                disabled={isDeploying}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDeploying ? 'Deploying...' : 'Start Deployment'}
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {deploymentStatus.map((step) => (
              <div key={step.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStepIcon(step.id)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{step.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(step.status)}`}>
                          {step.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Progress: {step.progress}%</span>
                        <span>Updated: {new Date(step.lastUpdated).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                </div>
                
                {step.progress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Commands */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Commands</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">1. Initialize Amplify</h3>
              <div className="bg-gray-100 rounded-lg p-3">
                <code className="text-sm text-gray-800">amplify init</code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">2. Deploy Infrastructure</h3>
              <div className="bg-gray-100 rounded-lg p-3">
                <code className="text-sm text-gray-800">./scripts/deploy-video-infrastructure.sh</code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">3. Push to AWS</h3>
              <div className="bg-gray-100 rounded-lg p-3">
                <code className="text-sm text-gray-800">amplify push</code>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Configure CloudFront key pair for signed URLs</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Upload sample videos to S3 bucket</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Test video player functionality</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Configure video analytics dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">Implement adaptive bitrate streaming</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

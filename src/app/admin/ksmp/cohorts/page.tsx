'use client';

import React, { useState, useEffect } from 'react';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cohortService, Cohort } from '@/lib/cohortService';

export default function CohortManagementPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const data = await cohortService.getCohorts();
      setCohorts(data);
    } catch (error) {
      console.error('Error loading cohorts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cohorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cohort Management</h1>
                <p className="text-gray-600">Manage KSMP cohorts and student progress</p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Cohort
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {cohorts.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts found</h3>
              <p className="text-gray-600">Create your first cohort to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cohorts.map((cohort) => (
                <div key={cohort.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
                      <p className="text-gray-600 mt-1">{cohort.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{cohort.currentStudents}/{cohort.maxStudents} students</span>
                        <span>{cohortService.formatDate(cohort.startDate)} - {cohortService.formatDate(cohort.endDate)}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${cohortService.getStatusColor(cohort.status)}`}>
                      {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                    </span>
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
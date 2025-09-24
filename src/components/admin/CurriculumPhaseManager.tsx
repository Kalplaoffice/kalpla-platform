'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { CurriculumPhase, PhaseCourse, PhaseRequirement } from '@/lib/degreeProgramService';

interface CurriculumPhaseManagerProps {
  phases: CurriculumPhase[];
  availableCourses: any[];
  onPhasesChange: (phases: CurriculumPhase[]) => void;
}

export default function CurriculumPhaseManager({ 
  phases, 
  availableCourses, 
  onPhasesChange 
}: CurriculumPhaseManagerProps) {
  const [newPhase, setNewPhase] = useState<Partial<CurriculumPhase>>({
    name: '',
    description: '',
    duration: 0,
    courses: [],
    requirements: [],
    isRequired: true,
    order: phases.length + 1
  });

  const [newRequirement, setNewRequirement] = useState<Partial<PhaseRequirement>>({
    type: 'minimum_credits',
    value: 0,
    description: '',
    isRequired: true
  });

  const addPhase = () => {
    if (!newPhase.name?.trim() || !newPhase.description?.trim()) {
      alert('Phase name and description are required');
      return;
    }

    const phase: CurriculumPhase = {
      id: 'phase_' + Date.now(),
      name: newPhase.name,
      description: newPhase.description,
      duration: newPhase.duration || 0,
      order: phases.length + 1,
      courses: newPhase.courses || [],
      requirements: newPhase.requirements || [],
      isRequired: newPhase.isRequired || true
    };

    onPhasesChange([...phases, phase]);
    setNewPhase({
      name: '',
      description: '',
      duration: 0,
      courses: [],
      requirements: [],
      isRequired: true,
      order: phases.length + 2
    });
  };

  const removePhase = (phaseId: string) => {
    onPhasesChange(phases.filter(p => p.id !== phaseId));
  };

  const movePhase = (phaseId: string, direction: 'up' | 'down') => {
    const index = phases.findIndex(p => p.id === phaseId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === phases.length - 1)
    ) {
      return;
    }

    const newPhases = [...phases];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap phases
    [newPhases[index], newPhases[targetIndex]] = [newPhases[targetIndex], newPhases[index]];
    
    // Update order
    newPhases.forEach((phase, i) => {
      phase.order = i + 1;
    });

    onPhasesChange(newPhases);
  };

  const addCourseToPhase = (phaseId: string, courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return;

    const phaseCourse: PhaseCourse = {
      id: 'phase_course_' + Date.now(),
      courseId: course.id,
      courseTitle: course.title,
      courseDescription: course.description,
      credits: course.credits,
      isRequired: true,
      isElective: false,
      order: 1
    };

    const updatedPhases = phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, courses: [...phase.courses, phaseCourse] }
        : phase
    );

    onPhasesChange(updatedPhases);
  };

  const removeCourseFromPhase = (phaseId: string, courseId: string) => {
    const updatedPhases = phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, courses: phase.courses.filter(c => c.id !== courseId) }
        : phase
    );

    onPhasesChange(updatedPhases);
  };

  const addRequirementToPhase = (phaseId: string) => {
    if (!newRequirement.description?.trim()) {
      alert('Requirement description is required');
      return;
    }

    const requirement: PhaseRequirement = {
      id: 'req_' + Date.now(),
      type: newRequirement.type || 'minimum_credits',
      value: newRequirement.value || 0,
      description: newRequirement.description,
      isRequired: newRequirement.isRequired || true
    };

    const updatedPhases = phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, requirements: [...phase.requirements, requirement] }
        : phase
    );

    onPhasesChange(updatedPhases);
    setNewRequirement({
      type: 'minimum_credits',
      value: 0,
      description: '',
      isRequired: true
    });
  };

  const removeRequirementFromPhase = (phaseId: string, requirementId: string) => {
    const updatedPhases = phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, requirements: phase.requirements.filter(r => r.id !== requirementId) }
        : phase
    );

    onPhasesChange(updatedPhases);
  };

  const updatePhase = (phaseId: string, updates: Partial<CurriculumPhase>) => {
    const updatedPhases = phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, ...updates }
        : phase
    );

    onPhasesChange(updatedPhases);
  };

  const getTotalCredits = (courses: PhaseCourse[]) => {
    return courses.reduce((total, course) => total + course.credits, 0);
  };

  const getTotalDuration = () => {
    return phases.reduce((total, phase) => total + phase.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Phase Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Curriculum Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <AcademicCapIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800">{phases.length} Phases</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800">{getTotalDuration()} Weeks</span>
          </div>
          <div className="flex items-center">
            <BookOpenIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800">{phases.reduce((total, phase) => total + phase.courses.length, 0)} Courses</span>
          </div>
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-blue-800">{phases.reduce((total, phase) => total + getTotalCredits(phase.courses), 0)} Credits</span>
          </div>
        </div>
      </div>

      {/* Add New Phase */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Phase</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phase Name *</label>
            <input
              type="text"
              value={newPhase.name || ''}
              onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
              placeholder="e.g., Foundation Phase"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks) *</label>
            <input
              type="number"
              value={newPhase.duration || ''}
              onChange={(e) => setNewPhase({ ...newPhase, duration: parseInt(e.target.value) })}
              placeholder="e.g., 12"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phase Description *</label>
          <textarea
            value={newPhase.description || ''}
            onChange={(e) => setNewPhase({ ...newPhase, description: e.target.value })}
            rows={2}
            placeholder="Describe what this phase covers..."
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newPhase.isRequired || false}
              onChange={(e) => setNewPhase({ ...newPhase, isRequired: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Required Phase</span>
          </label>
          
          <button
            type="button"
            onClick={addPhase}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Phase
          </button>
        </div>
      </div>

      {/* Existing Phases */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  Phase {phase.order}
                </span>
                <h3 className="text-lg font-medium text-gray-900">{phase.name}</h3>
                {phase.isRequired && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Required
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => movePhase(phase.id, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => movePhase(phase.id, 'down')}
                  disabled={index === phases.length - 1}
                  className={`p-1 rounded ${index === phases.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removePhase(phase.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{phase.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Courses Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Courses ({phase.courses.length})</h4>
                  <span className="text-sm text-gray-500">{getTotalCredits(phase.courses)} credits</span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addCourseToPhase(phase.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Add a course...</option>
                    {availableCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.credits} credits)
                      </option>
                    ))}
                  </select>
                </div>
                
                {phase.courses.length > 0 && (
                  <div className="space-y-2">
                    {phase.courses.map(course => (
                      <div key={course.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{course.courseTitle}</span>
                          <span className="ml-2 text-xs text-gray-500">({course.credits} credits)</span>
                        </div>
                        <button
                          onClick={() => removeCourseFromPhase(phase.id, course.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Requirements Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Requirements ({phase.requirements.length})</h4>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <select
                      value={newRequirement.type || 'minimum_credits'}
                      onChange={(e) => setNewRequirement({ ...newRequirement, type: e.target.value as any })}
                      className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="minimum_credits">Minimum Credits</option>
                      <option value="minimum_courses">Minimum Courses</option>
                      <option value="specific_course">Specific Course</option>
                      <option value="gpa_requirement">GPA Requirement</option>
                    </select>
                    
                    <input
                      type="number"
                      value={newRequirement.value || ''}
                      onChange={(e) => setNewRequirement({ ...newRequirement, value: parseInt(e.target.value) })}
                      placeholder="Value"
                      className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={newRequirement.description || ''}
                    onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                    placeholder="Requirement description..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <button
                    onClick={() => addRequirementToPhase(phase.id)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Requirement
                  </button>
                </div>
                
                {phase.requirements.length > 0 && (
                  <div className="space-y-2">
                    {phase.requirements.map(requirement => (
                      <div key={requirement.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {requirement.type.replace('_', ' ')}: {requirement.value}
                          </span>
                          <p className="text-xs text-gray-600">{requirement.description}</p>
                        </div>
                        <button
                          onClick={() => removeRequirementFromPhase(phase.id, requirement.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {phases.length === 0 && (
        <div className="text-center py-8">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No curriculum phases yet</p>
          <p className="text-sm text-gray-400">Add phases to structure your degree program</p>
        </div>
      )}
    </div>
  );
}

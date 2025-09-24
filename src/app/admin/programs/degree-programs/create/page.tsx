'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BookOpenIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import kalplaLogo from '@/assets/images/kalpla-logo.svg';
import { degreeProgramService, DegreeProgram, CurriculumPhase, PhaseCourse, AdmissionRequirement, LearningOutcome } from '@/lib/degreeProgramService';

export default function CreateDegreeProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<Partial<DegreeProgram>>({
    title: '',
    shortTitle: '',
    description: '',
    longDescription: '',
    degreeType: 'bachelor',
    field: '',
    duration: 0,
    totalCredits: 0,
    fee: 0,
    currency: 'INR',
    isActive: true,
    isPublic: false,
    curriculumPhases: [],
    admissionRequirements: [],
    learningOutcomes: [],
    careerProspects: [],
    createdBy: 'current-admin-id',
    updatedBy: 'current-admin-id'
  });

  const [newPhase, setNewPhase] = useState<Partial<CurriculumPhase>>({
    name: '',
    description: '',
    duration: 0,
    courses: [],
    requirements: [],
    isRequired: true,
    order: 1
  });

  const [newRequirement, setNewRequirement] = useState<Partial<AdmissionRequirement>>({
    type: 'education',
    title: '',
    description: '',
    isRequired: true
  });

  const [newOutcome, setNewOutcome] = useState<Partial<LearningOutcome>>({
    title: '',
    description: '',
    category: 'knowledge',
    level: 'beginner'
  });

  const [newCareerProspect, setNewCareerProspect] = useState('');

  useEffect(() => {
    loadAvailableCourses();
  }, []);

  const loadAvailableCourses = async () => {
    try {
      setLoading(true);
      const courses = await degreeProgramService.getAvailableCourses();
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPhase = () => {
    if (!newPhase.name?.trim() || !newPhase.description?.trim()) {
      setError('Phase name and description are required');
      return;
    }

    const phase: CurriculumPhase = {
      id: 'phase_' + Date.now(),
      name: newPhase.name,
      description: newPhase.description,
      duration: newPhase.duration || 0,
      order: (formData.curriculumPhases?.length || 0) + 1,
      courses: newPhase.courses || [],
      requirements: newPhase.requirements || [],
      isRequired: newPhase.isRequired || true
    };

    setFormData(prev => ({
      ...prev,
      curriculumPhases: [...(prev.curriculumPhases || []), phase]
    }));

    setNewPhase({
      name: '',
      description: '',
      duration: 0,
      courses: [],
      requirements: [],
      isRequired: true,
      order: (formData.curriculumPhases?.length || 0) + 2
    });
  };

  const removePhase = (phaseId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculumPhases: prev.curriculumPhases?.filter(p => p.id !== phaseId) || []
    }));
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

    setFormData(prev => ({
      ...prev,
      curriculumPhases: prev.curriculumPhases?.map(phase => 
        phase.id === phaseId 
          ? { ...phase, courses: [...phase.courses, phaseCourse] }
          : phase
      ) || []
    }));
  };

  const removeCourseFromPhase = (phaseId: string, courseId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculumPhases: prev.curriculumPhases?.map(phase => 
        phase.id === phaseId 
          ? { ...phase, courses: phase.courses.filter(c => c.id !== courseId) }
          : phase
      ) || []
    }));
  };

  const addAdmissionRequirement = () => {
    if (!newRequirement.title?.trim() || !newRequirement.description?.trim()) {
      setError('Requirement title and description are required');
      return;
    }

    const requirement: AdmissionRequirement = {
      id: 'req_' + Date.now(),
      type: newRequirement.type || 'education',
      title: newRequirement.title,
      description: newRequirement.description,
      isRequired: newRequirement.isRequired || true,
      minValue: newRequirement.minValue,
      maxValue: newRequirement.maxValue,
      unit: newRequirement.unit
    };

    setFormData(prev => ({
      ...prev,
      admissionRequirements: [...(prev.admissionRequirements || []), requirement]
    }));

    setNewRequirement({
      type: 'education',
      title: '',
      description: '',
      isRequired: true
    });
  };

  const removeAdmissionRequirement = (requirementId: string) => {
    setFormData(prev => ({
      ...prev,
      admissionRequirements: prev.admissionRequirements?.filter(r => r.id !== requirementId) || []
    }));
  };

  const addLearningOutcome = () => {
    if (!newOutcome.title?.trim() || !newOutcome.description?.trim()) {
      setError('Learning outcome title and description are required');
      return;
    }

    const outcome: LearningOutcome = {
      id: 'outcome_' + Date.now(),
      title: newOutcome.title,
      description: newOutcome.description,
      category: newOutcome.category || 'knowledge',
      level: newOutcome.level || 'beginner'
    };

    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...(prev.learningOutcomes || []), outcome]
    }));

    setNewOutcome({
      title: '',
      description: '',
      category: 'knowledge',
      level: 'beginner'
    });
  };

  const removeLearningOutcome = (outcomeId: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes?.filter(o => o.id !== outcomeId) || []
    }));
  };

  const addCareerProspect = () => {
    if (!newCareerProspect.trim()) {
      setError('Career prospect is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      careerProspects: [...(prev.careerProspects || []), newCareerProspect.trim()]
    }));

    setNewCareerProspect('');
  };

  const removeCareerProspect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerProspects: prev.careerProspects?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    const validation = degreeProgramService.validateDegreeProgram(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setSaving(true);
      const newProgram = await degreeProgramService.createDegreeProgram(formData as any);
      router.push(`/admin/programs/degree-programs/${newProgram.id}`);
    } catch (error) {
      console.error('Error creating degree program:', error);
      setError('Failed to create degree program');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/programs/degree-programs')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Programs
              </button>
              <Image
                src={kalplaLogo}
                alt="Kalpla"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-medium text-gray-900">Create Degree Program</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Title *</label>
                <input
                  type="text"
                  value={formData.shortTitle || ''}
                  onChange={(e) => handleInputChange('shortTitle', e.target.value)}
                  placeholder="e.g., BSc CS"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Type *</label>
                <select
                  value={formData.degreeType || 'bachelor'}
                  onChange={(e) => handleInputChange('degreeType', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="bachelor">Bachelor</option>
                  <option value="master">Master</option>
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
                <input
                  type="text"
                  value={formData.field || ''}
                  onChange={(e) => handleInputChange('field', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months) *</label>
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  placeholder="e.g., 48"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Credits *</label>
                <input
                  type="number"
                  value={formData.totalCredits || ''}
                  onChange={(e) => handleInputChange('totalCredits', parseInt(e.target.value))}
                  placeholder="e.g., 120"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Fee (₹) *</label>
                <input
                  type="number"
                  value={formData.fee || ''}
                  onChange={(e) => handleInputChange('fee', parseInt(e.target.value))}
                  placeholder="e.g., 240000"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency || 'INR'}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Brief description of the program..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                value={formData.longDescription || ''}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                rows={5}
                placeholder="Detailed description of the program..."
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mt-6 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Program</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic || false}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Public Program</span>
              </label>
            </div>
          </div>

          {/* Curriculum Phases */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Curriculum Phases</h2>
              <span className="text-sm text-gray-500">{formData.curriculumPhases?.length || 0} phases</span>
            </div>
            
            {/* Add New Phase */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Phase</h3>
              
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
              {formData.curriculumPhases?.map((phase, index) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{phase.name}</h3>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {phase.duration} weeks
                        </span>
                        <span className="flex items-center">
                          <BookOpenIcon className="h-3 w-3 mr-1" />
                          {phase.courses.length} courses
                        </span>
                        {phase.isRequired && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removePhase(phase.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Add Courses to Phase */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Course to Phase</label>
                    <div className="flex items-center space-x-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addCourseToPhase(phase.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a course...</option>
                        {availableCourses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.credits} credits)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Phase Courses */}
                    {phase.courses.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {phase.courses.map(course => (
                          <div key={course.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{course.courseTitle}</span>
                              <span className="ml-2 text-xs text-gray-500">({course.credits} credits)</span>
                            </div>
                            <button
                              type="button"
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
                </div>
              ))}
            </div>
          </div>

          {/* Admission Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Admission Requirements</h2>
              <span className="text-sm text-gray-500">{formData.admissionRequirements?.length || 0} requirements</span>
            </div>
            
            {/* Add New Requirement */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Requirement</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Type</label>
                  <select
                    value={newRequirement.type || 'education'}
                    onChange={(e) => setNewRequirement({ ...newRequirement, type: e.target.value as any })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="education">Education</option>
                    <option value="experience">Experience</option>
                    <option value="test_score">Test Score</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="interview">Interview</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Title *</label>
                  <input
                    type="text"
                    value={newRequirement.title || ''}
                    onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                    placeholder="e.g., High School Diploma"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newRequirement.description || ''}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  rows={2}
                  placeholder="Describe the requirement..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newRequirement.isRequired || false}
                    onChange={(e) => setNewRequirement({ ...newRequirement, isRequired: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Required</span>
                </label>
                
                <button
                  type="button"
                  onClick={addAdmissionRequirement}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Requirement
                </button>
              </div>
            </div>
            
            {/* Existing Requirements */}
            <div className="space-y-3">
              {formData.admissionRequirements?.map((requirement) => (
                <div key={requirement.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{requirement.title}</h4>
                    <p className="text-sm text-gray-600">{requirement.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {requirement.type.replace('_', ' ')}
                      </span>
                      {requirement.isRequired && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeAdmissionRequirement(requirement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Learning Outcomes</h2>
              <span className="text-sm text-gray-500">{formData.learningOutcomes?.length || 0} outcomes</span>
            </div>
            
            {/* Add New Outcome */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Learning Outcome</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outcome Title *</label>
                  <input
                    type="text"
                    value={newOutcome.title || ''}
                    onChange={(e) => setNewOutcome({ ...newOutcome, title: e.target.value })}
                    placeholder="e.g., Programming Proficiency"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newOutcome.category || 'knowledge'}
                    onChange={(e) => setNewOutcome({ ...newOutcome, category: e.target.value as any })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="knowledge">Knowledge</option>
                    <option value="skills">Skills</option>
                    <option value="competencies">Competencies</option>
                    <option value="attitudes">Attitudes</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newOutcome.description || ''}
                  onChange={(e) => setNewOutcome({ ...newOutcome, description: e.target.value })}
                  rows={2}
                  placeholder="Describe the learning outcome..."
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={newOutcome.level || 'beginner'}
                    onChange={(e) => setNewOutcome({ ...newOutcome, level: e.target.value as any })}
                    className="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={addLearningOutcome}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Outcome
                </button>
              </div>
            </div>
            
            {/* Existing Outcomes */}
            <div className="space-y-3">
              {formData.learningOutcomes?.map((outcome) => (
                <div key={outcome.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{outcome.title}</h4>
                    <p className="text-sm text-gray-600">{outcome.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {outcome.category}
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {outcome.level}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeLearningOutcome(outcome.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Career Prospects */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Career Prospects</h2>
              <span className="text-sm text-gray-500">{formData.careerProspects?.length || 0} prospects</span>
            </div>
            
            {/* Add New Career Prospect */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={newCareerProspect}
                onChange={(e) => setNewCareerProspect(e.target.value)}
                placeholder="e.g., Software Developer"
                className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addCareerProspect}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>
            
            {/* Existing Career Prospects */}
            <div className="space-y-2">
              {formData.careerProspects?.map((prospect, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{prospect}</span>
                  <button
                    type="button"
                    onClick={() => removeCareerProspect(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/programs/degree-programs')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Create Program
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Users, CheckCircle, Clock, TrendingUp, Plus, Search, Filter } from 'lucide-react';
import EssayPromptList from './components/EssayPromptList';
import EssaySubmissionList from './components/EssaySubmissionList';
import EssayPromptForm from './components/EssayPromptForm';
import EssaySubmissionDetail from './components/EssaySubmissionDetail';
import EssayAnalytics from './components/EssayAnalytics';
import * as Yup from 'yup';

// Import the actual server actions (remove mock implementations)
import {
  createEssayPrompt,
  updateEssayPrompt,
  deleteEssayPrompt,
  createEssaySubmission,
  updateEssaySubmission,
  getEssayPrompts,
  getEssaySubmissions,
  getUniversities,
  getPrograms,
  getAdmissions,
  getAllIntakes,
  getIntakesForAdmission,
  getEssayPromptsWithFilters,
  getEssaySubmissionsWithFilters,
} from './action/EssayAction'; // Update this path to match your actual essay actions file

// ================== INTERFACES ==================

// Extended interfaces for UI with related data
export interface EssayPrompt {
  id: string;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
  admissionId?: string | null;
  programId?: string | null;
  intakeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  admission?: {
    id: string;
    university: {
      universityName: string;
      city: string;
      country: string;
    };
    program: {
      programName: string;
      degreeType: string | null;
    };
  };
  program?: {
    id: string;
    programName: string;
    degreeType: string | null;
    university: {
      universityName: string;
    };
  };
  intake?: {
    id: string;
    intakeName: string;
    intakeType: string;
    intakeYear: number;
  };
  _count: {
    submissions: number;
  };
}

export interface EssaySubmission {
  id: string;
  title?: string;
  content: string;
  wordCount: number;
  status: string;
  reviewStatus: string;
  internalRating?: number;
  reviewerComments?: string;
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  essayPrompt: {
    promptTitle: string;
    wordLimit: number;
    admission?: {
      university: {
        universityName: string;
      };
      program: {
        programName: string;
      };
    };
  };
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
  application?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface EssayPromptInput {
  admissionId?: string | null;
  programId?: string | null;
  intakeId?: string | null;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
}

export interface EssayPromptUpdateInput extends EssayPromptInput {
  id: string;
}

export interface EssaySubmissionInput {
  title?: string;
  content: string;
  wordCount: number;
  status: string;
  reviewStatus: string;
  internalRating?: number;
  reviewerComments?: string;
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
}

export interface EssaySubmissionUpdateInput extends EssaySubmissionInput {
  id: string;
}

export interface University {
  id: string;
  universityName: string;
  city: string;
  country: string;
}

export interface Program {
  id: string;
  programName: string;
  degreeType: string | null;
  universityId: string;
  university?: {
    universityName: string;
  };
}

export interface AdmissionWithRelations {
  id: string;
  universityId: string;
  programId: string;
  university: { 
    universityName: string;
    city: string;
    country: string;
  };
  program: { 
    programName: string;
    degreeType: string | null;
  };
}

export interface IntakeWithRelations {
  id: string;
  admissionId: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

interface Filters {
  universityId: string;
  programId: string;
  admissionId: string;
  intakeId: string;
  status: string;
  reviewStatus: string;
  isMandatory: boolean | undefined;
  isActive: boolean | undefined;
}

interface Stats {
  totalPrompts: number;
  totalSubmissions: number;
  pendingReviews: number;
  averageRating: number;
}

// ================== MAIN COMPONENT ==================
const EssayManagement = () => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'submissions' | 'analytics'>('prompts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EssayPrompt | EssaySubmission | null>(null);
  const [filters, setFilters] = useState<Filters>({
    universityId: '',
    programId: '',
    admissionId: '',
    intakeId: '',
    status: '',
    reviewStatus: '',
    isMandatory: undefined,
    isActive: true
  });

  // Data states
  const [essayPrompts, setEssayPrompts] = useState<EssayPrompt[]>([]);
  const [essaySubmissions, setEssaySubmissions] = useState<EssaySubmission[]>([]);
  
  // Dropdown data states
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionWithRelations[]>([]);
  const [intakes, setIntakes] = useState<IntakeWithRelations[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ================== DATA FETCHING ==================
  const fetchDropdownData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const [universitiesData, programsData, admissionsData, intakesData] = await Promise.all([
        getUniversities(),
        getPrograms(),
        getAdmissions(),
        getAllIntakes(),
      ]);

      setUniversities(universitiesData);
      setPrograms(programsData);
      setAdmissions(admissionsData);
      setIntakes(intakesData);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to fetch dropdown data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEssayPrompts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Apply filters if any are set
      const filterObj = {
        ...(filters.universityId && { universityId: filters.universityId }),
        ...(filters.programId && { programId: filters.programId }),
        ...(filters.admissionId && { admissionId: filters.admissionId }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      };

      const prompts = Object.keys(filterObj).length > 0
        ? await getEssayPromptsWithFilters(filterObj)
        : await getEssayPrompts();
      
      setEssayPrompts(prompts as EssayPrompt[]);
    } catch (err) {
      console.error('Error fetching essay prompts:', err);
      setError('Failed to fetch essay prompts');
    } finally {
      setLoading(false);
    }
  };

  const fetchEssaySubmissions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Apply filters if any are set
      const filterObj = {
        ...(filters.status && { status: filters.status }),
        ...(filters.reviewStatus && { reviewStatus: filters.reviewStatus }),
        ...(filters.universityId && { universityId: filters.universityId }),
        ...(filters.programId && { programId: filters.programId }),
      };

      const submissions = Object.keys(filterObj).length > 0
        ? await getEssaySubmissionsWithFilters(filterObj)
        : await getEssaySubmissions();
      
      setEssaySubmissions(submissions as EssaySubmission[]);
    } catch (err) {
      console.error('Error fetching essay submissions:', err);
      setError('Failed to fetch essay submissions');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (universities.length > 0) {
      fetchEssayPrompts();
      fetchEssaySubmissions();
    }
  }, [filters, universities]);

  // ================== EVENT HANDLERS ==================
  const handleCreateNew = (): void => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: EssayPrompt): void => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = async (data: EssayPromptInput | EssayPromptUpdateInput): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Clean up empty strings to null for optional fields
      const cleanedData = {
        ...data,
        admissionId: data.admissionId || null,
        programId: data.programId || null,
        intakeId: data.intakeId || null,
      };
      
      if (selectedItem && 'id' in selectedItem) {
        // Update existing prompt
        await updateEssayPrompt(selectedItem.id, cleanedData as EssayPromptUpdateInput);
      } else {
        // Create new prompt
        await createEssayPrompt(cleanedData as EssayPromptInput);
      }
      
      // Refresh data
      await fetchEssayPrompts();
      setShowForm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save essay prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (item: EssaySubmission): void => {
    setSelectedItem(item);
  };

  const handleSubmissionUpdate = async (submissionId: string, data: EssaySubmissionUpdateInput): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await updateEssaySubmission(submissionId, data);
      await fetchEssaySubmissions();
    } catch (err) {
      console.error('Error updating submission:', err);
      setError('Failed to update submission');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteEssayPrompt(promptId);
      await fetchEssayPrompts();
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Failed to delete prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>): void => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = (): void => {
    setFilters({
      universityId: '',
      programId: '',
      admissionId: '',
      intakeId: '',
      status: '',
      reviewStatus: '',
      isMandatory: undefined,
      isActive: true
    });
  };

  // ================== FILTERING ==================
  const filteredData = (): EssayPrompt[] | EssaySubmission[] => {
    if (activeTab === 'prompts') {
      return essayPrompts.filter(prompt => 
        prompt.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.admission?.university.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.admission?.program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.program?.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.program?.university.universityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'submissions') {
      return essaySubmissions.filter(submission => 
        submission.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.essayPrompt?.promptTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.essayPrompt?.admission?.university.universityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.application?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.application?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  // ================== ANALYTICS CALCULATIONS ==================
  const stats: Stats = {
    totalPrompts: essayPrompts.length,
    totalSubmissions: essaySubmissions.length,
    pendingReviews: essaySubmissions.filter(s => s.reviewStatus === 'PENDING').length,
    averageRating: essaySubmissions.filter(s => s.internalRating)
      .reduce((sum, s) => sum + (s.internalRating || 0), 0) / 
      essaySubmissions.filter(s => s.internalRating).length || 0
  };

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Essay Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage essay prompts and submissions</p>
            </div>
            {activeTab === 'prompts' && (
              <button
                onClick={handleCreateNew}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Create New Prompt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Prompts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrompts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isNaN(stats.averageRating) ? '0.0' : stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('prompts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prompts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline-block w-4 h-4 mr-2" />
                Essay Prompts
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Submissions
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="inline-block w-4 h-4 mr-2" />
                Analytics
              </button>
            </nav>
          </div>

          {/* Search and Filter Section */}
          {activeTab !== 'analytics' && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                  {/* University Filter */}
                  <select
                    value={filters.universityId}
                    onChange={(e) => handleFilterChange({ universityId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Universities</option>
                    {universities.map(uni => (
                      <option key={uni.id} value={uni.id}>
                        {uni.universityName}
                      </option>
                    ))}
                  </select>

                  {/* Program Filter */}
                  <select
                    value={filters.programId}
                    onChange={(e) => handleFilterChange({ programId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Programs</option>
                    {programs
                      .filter(program => !filters.universityId || program.universityId === filters.universityId)
                      .map(program => (
                        <option key={program.id} value={program.id}>
                          {program.programName} {program.degreeType ? `(${program.degreeType})` : ''}
                        </option>
                      ))}
                  </select>

                  {/* Status Filter for Submissions */}
                  {activeTab === 'submissions' && (
                    <>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange({ status: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <select
                        value={filters.reviewStatus}
                        onChange={(e) => handleFilterChange({ reviewStatus: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">All Review Status</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="REVIEWED">Reviewed</option>
                      </select>
                    </>
                  )}

                  {/* Active Filter for Prompts */}
                  {activeTab === 'prompts' && (
                    <select
                      value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                      onChange={(e) => handleFilterChange({ 
                        isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  )}

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${activeTab === 'analytics' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            {activeTab === 'prompts' && (
              <EssayPromptList
                prompts={filteredData() as EssayPrompt[]}
                onEdit={handleEdit}
                onDelete={handleDeletePrompt}
                loading={loading}
              />
            )}
            {activeTab === 'submissions' && (
              <EssaySubmissionList
                submissions={filteredData() as EssaySubmission[]}
                onViewDetail={handleViewDetail}
                onUpdate={handleSubmissionUpdate}
                loading={loading}
              />
            )}
            {activeTab === 'analytics' && (
              <EssayAnalytics
                prompts={essayPrompts}
                submissions={essaySubmissions}
              />
            )}
          </div>
          
          {activeTab !== 'analytics' && (
            <div className="lg:col-span-1">
              {selectedItem && !showForm && activeTab === 'submissions' && (
                <EssaySubmissionDetail
                  submission={selectedItem as EssaySubmission}
                  onClose={() => setSelectedItem(null)}
                  onUpdate={handleSubmissionUpdate}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <EssayPromptForm
          prompt={selectedItem as EssayPrompt ?? undefined}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          loading={loading}
          universities={universities}
          programs={programs}
          admissions={admissions}
          intakes={intakes}
        />
      )}
    </div>
  );
};

export default EssayManagement;
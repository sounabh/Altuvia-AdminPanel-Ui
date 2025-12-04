// EssayManagement.tsx (Main Page - Complete Fixed Version)
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Users, Clock, TrendingUp, Plus, Search, X, RefreshCw } from 'lucide-react';
import EssayPromptList from './components/EssayPromptList';
import EssaySubmissionList from './components/EssaySubmissionList';
import EssayPromptForm from './components/EssayPromptForm';
import EssayPromptDetail from './components/EssayPromptDetail';
import EssaySubmissionDetail from './components/EssaySubmissionDetail';
import EssayAnalytics from './components/EssayAnalytics';

import {
  createEssayPrompt,
  updateEssayPrompt,
  deleteEssayPrompt,
  updateEssaySubmission,
  getEssayPrompts,
  getEssaySubmissions,
  getUniversities,
  getPrograms,
  getAdmissions,
  getAllIntakes,
  getEssayPromptsWithFilters,
  getEssaySubmissionsWithFilters,
} from './action/EssayAction';

// ================== INTERFACES ==================
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
  reviewerComment?: string;
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
  submissionDate?: Date;
  lastEditedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  essayPrompt: {
    id: string;
    promptTitle: string;
    promptText?: string;
    wordLimit: number;
    admission?: {
      university: {
        universityName: string;
      };
      program: {
        programName: string;
      };
    } | null;
  };
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  application?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  program?: {
    id: string;
    programName: string;
    degreeType: string | null;
    university: {
      universityName: string;
      city: string;
      country: string;
    };
  };
  _count?: {
    versions: number;
    aiResults: number;
    completionLogs: number;
  };
  completionPercentage?: number;
  priority?: string;
  isCompleted?: boolean;
  isUsingTemplate?: boolean;
  templateVersion?: string | null;
  reviewerId?: string | null;
  versions?: Array<{
    id: string;
    content: string;
    wordCount: number;
    label: string;
    timestamp: string | Date;
    isAutoSave: boolean;
    changesSinceLastVersion: string | null;
  }>;
  aiResults?: Array<{
    id: string;
    analysisType: string;
    overallScore: number | null;
    suggestions: string;
    strengths: string | null;
    improvements: string | null;
    warnings: string | null;
    aiProvider: string;
    modelUsed: string | null;
    readabilityScore: number | null;
    grammarIssues: number | null;
    structureScore: number | null;
    createdAt: string | Date;
  }>;
  completionLogs?: Array<{
    id: string;
    completedAt: string | Date;
    wordCountAtCompletion: number;
    wordLimit: number;
    completionMethod: string;
    previousStatus: string | null;
    essayPromptTitle: string | null;
  }>;
  latestAIAnalysis?: {
    id: string;
    analysisType: string;
    overallScore: number | null;
    suggestions: string;
    strengths: string | null;
    improvements: string | null;
    warnings: string | null;
    aiProvider: string;
    modelUsed: string | null;
    readabilityScore: number | null;
    grammarIssues: number | null;
    structureScore: number | null;
    createdAt: string | Date;
  } | null;
}

export interface EssayPromptInput {
  admissionId: string;
  programId?: string;
  intakeId?: string;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
}

export interface EssayPromptUpdateInput {
  promptTitle?: string;
  promptText?: string;
  wordLimit?: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
  programId?: string;
  intakeId?: string;
}

export interface EssaySubmissionInput {
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
  title?: string;
  content: string;
  isUsingTemplate?: boolean;
  templateVersion?: string;
}

export interface EssaySubmissionUpdateInput {
  title?: string;
  content?: string;
  status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  isUsingTemplate?: boolean;
  templateVersion?: string;
  reviewStatus?: "PENDING" | "REVIEWED";
  reviewerId?: string;
  reviewerComment?: string;
  internalRating?: number;
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
const EssayManagement: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'prompts' | 'submissions' | 'analytics'>('prompts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<EssayPrompt | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<EssaySubmission | null>(null);
  const [showPromptDetail, setShowPromptDetail] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    universityId: '',
    programId: '',
    admissionId: '',
    intakeId: '',
    status: '',
    reviewStatus: '',
    isMandatory: undefined,
    isActive: undefined
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ Filtered programs based on selected university
  const filteredPrograms = filters.universityId
    ? programs.filter(program => program.universityId === filters.universityId)
    : programs;

  // ================== DATA FETCHING ==================
  const fetchDropdownData = useCallback(async (): Promise<void> => {
    try {
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
    }
  }, []);

  const fetchEssayPrompts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const filterObj: Record<string, string | boolean> = {};

      if (filters.universityId) filterObj.universityId = filters.universityId;
      if (filters.admissionId) filterObj.admissionId = filters.admissionId;
      if (filters.programId) filterObj.programId = filters.programId;
      if (filters.intakeId) filterObj.intakeId = filters.intakeId;
      if (filters.isMandatory !== undefined) filterObj.isMandatory = filters.isMandatory;
      if (filters.isActive !== undefined) filterObj.isActive = filters.isActive;

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
  }, [filters.universityId, filters.admissionId, filters.programId, filters.intakeId, filters.isMandatory, filters.isActive]);

  const fetchEssaySubmissions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const filterObj: Record<string, string | boolean> = {};

      if (filters.status) filterObj.status = filters.status;
      if (filters.reviewStatus) filterObj.reviewStatus = filters.reviewStatus;
      if (filters.programId) filterObj.programId = filters.programId;
      if (filters.universityId) filterObj.universityId = filters.universityId;

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
  }, [filters.status, filters.reviewStatus, filters.programId, filters.universityId]);

  const refreshData = useCallback(async (): Promise<void> => {
    setLoading(true);
    await Promise.all([fetchEssayPrompts(), fetchEssaySubmissions()]);
    setLoading(false);
  }, [fetchEssayPrompts, fetchEssaySubmissions]);

  // Initial data fetch
  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    fetchEssayPrompts();
    fetchEssaySubmissions();
  }, [fetchEssayPrompts, fetchEssaySubmissions]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ================== EVENT HANDLERS ==================
  const handleCreateNew = (): void => {
    setSelectedPrompt(null);
    setShowForm(true);
  };

  const handleEditPrompt = (prompt: EssayPrompt): void => {
    setSelectedPrompt(prompt);
    setShowPromptDetail(false);
    setShowForm(true);
  };

  const handleViewPromptDetail = (prompt: EssayPrompt): void => {
    setSelectedPrompt(prompt);
    setShowPromptDetail(true);
    setShowForm(false);
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setSelectedPrompt(null);
  };

  const handlePromptDetailClose = (): void => {
    setShowPromptDetail(false);
    setSelectedPrompt(null);
  };

  const handleFormSubmit = async (data: EssayPromptInput | EssayPromptUpdateInput): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (selectedPrompt && 'id' in selectedPrompt) {
        const updateData: EssayPromptUpdateInput = {
          promptTitle: data.promptTitle,
          promptText: data.promptText,
          wordLimit: data.wordLimit,
          minWordCount: data.minWordCount,
          isMandatory: data.isMandatory,
          isActive: data.isActive,
          programId: data.programId,
          intakeId: data.intakeId,
        };
        await updateEssayPrompt(selectedPrompt.id, updateData);
        setSuccessMessage('Essay prompt updated successfully!');
      } else {
        const createData = data as EssayPromptInput;
        await createEssayPrompt(createData);
        setSuccessMessage('Essay prompt created successfully!');
      }

      await fetchEssayPrompts();
      setShowForm(false);
      setSelectedPrompt(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save essay prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteEssayPrompt(promptId);
      setSuccessMessage('Essay prompt deleted successfully!');
      setShowPromptDetail(false);
      setSelectedPrompt(null);
      await fetchEssayPrompts();
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Failed to delete prompt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmissionDetail = (submission: EssaySubmission): void => {
    setSelectedSubmission(submission);
  };

  const handleSubmissionDetailClose = (): void => {
    setSelectedSubmission(null);
  };

  const handleSubmissionUpdate = async (submissionId: string, data: EssaySubmissionUpdateInput): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await updateEssaySubmission(submissionId, data);
      setSuccessMessage('Submission updated successfully!');
      await fetchEssaySubmissions();
    } catch (err) {
      console.error('Error updating submission:', err);
      setError('Failed to update submission');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Handle filter change with program reset when university changes
  const handleFilterChange = (newFilters: Partial<Filters>): void => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // ✅ If university changed, check if current program belongs to new university
      if (newFilters.universityId !== undefined && newFilters.universityId !== prev.universityId) {
        // Clear program if it doesn't belong to the new university
        if (prev.programId) {
          const currentProgram = programs.find(p => p.id === prev.programId);
          if (currentProgram && currentProgram.universityId !== newFilters.universityId) {
            updated.programId = '';
          }
        }
        // If university is cleared, don't reset program (allow showing all)
        if (newFilters.universityId === '') {
          // Keep programId as is, user might want to filter by program only
        }
      }
      
      return updated;
    });
  };

  // ✅ FIXED: Handle university change specifically
  const handleUniversityChange = (universityId: string): void => {
    setFilters(prev => ({
      ...prev,
      universityId,
      programId: '' // ✅ Always clear program when university changes
    }));
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
      isActive: undefined
    });
    setSearchQuery('');
  };

  // ================== FILTERING ==================
  const searchFilteredPrompts = essayPrompts.filter(prompt =>
    prompt.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.admission?.university.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.admission?.program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.program?.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.program?.university?.universityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFilteredSubmissions = essaySubmissions.filter(submission =>
    submission.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.essayPrompt?.promptTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.essayPrompt?.admission?.university.universityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.application?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.application?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================== ANALYTICS CALCULATIONS ==================
  const stats: Stats = {
    totalPrompts: essayPrompts.length,
    totalSubmissions: essaySubmissions.length,
    pendingReviews: essaySubmissions.filter(s => s.reviewStatus === 'PENDING').length,
    averageRating: (() => {
      const rated = essaySubmissions.filter(s => s.internalRating);
      if (rated.length === 0) return 0;
      return rated.reduce((sum, s) => sum + (s.internalRating || 0), 0) / rated.length;
    })()
  };

  const hasActiveFilters = filters.universityId || filters.programId || filters.admissionId ||
    filters.intakeId || filters.status || filters.reviewStatus ||
    filters.isMandatory !== undefined || filters.isActive !== undefined || searchQuery;

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notifications */}
      {(error || successMessage) && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg flex items-center gap-3 animate-slide-in">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg flex items-center gap-3 animate-slide-in">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Essay Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage essay prompts and review student submissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              {activeTab === 'prompts' && (
                <button
                  onClick={handleCreateNew}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  <Plus size={18} />
                  New Prompt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Prompts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrompts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {[
                { id: 'prompts' as const, label: 'Essay Prompts', icon: FileText },
                { id: 'submissions' as const, label: 'Submissions', icon: Users },
                { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search and Filter Section */}
          {activeTab !== 'analytics' && (
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'prompts' ? 'prompts' : 'submissions'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* ✅ FIXED: University Filter - uses handleUniversityChange */}
                <select
                  value={filters.universityId}
                  onChange={(e) => handleUniversityChange(e.target.value)}
                  className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm min-w-[180px]"
                >
                  <option value="">All Universities</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.id}>
                      {uni.universityName}
                    </option>
                  ))}
                </select>

                {/* ✅ FIXED: Program Filter - uses filteredPrograms */}
                <select
                  value={filters.programId}
                  onChange={(e) => handleFilterChange({ programId: e.target.value })}
                  className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm min-w-[180px]"
                  disabled={filteredPrograms.length === 0 && filters.universityId !== ''}
                >
                  <option value="">
                    {filters.universityId 
                      ? (filteredPrograms.length === 0 ? 'No programs for this university' : 'All Programs')
                      : 'All Programs'
                    }
                  </option>
                  {filteredPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.programName} {program.degreeType ? `(${program.degreeType})` : ''}
                    </option>
                  ))}
                </select>

                {/* Conditional Filters based on Tab */}
                {activeTab === 'prompts' && (
                  <>
                    <select
                      value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                      onChange={(e) => handleFilterChange({
                        isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                      })}
                      className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>

                    <select
                      value={filters.isMandatory === undefined ? '' : filters.isMandatory.toString()}
                      onChange={(e) => handleFilterChange({
                        isMandatory: e.target.value === '' ? undefined : e.target.value === 'true'
                      })}
                      className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                    >
                      <option value="">All Types</option>
                      <option value="true">Mandatory</option>
                      <option value="false">Optional</option>
                    </select>
                  </>
                )}

                {activeTab === 'submissions' && (
                  <>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange({ status: e.target.value })}
                      className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="DRAFT">Draft</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                      value={filters.reviewStatus}
                      onChange={(e) => handleFilterChange({ reviewStatus: e.target.value })}
                      className="h-10 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                    >
                      <option value="">All Reviews</option>
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                    </select>
                  </>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="h-10 flex items-center gap-2 px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition-colors font-medium"
                  >
                    <X size={14} />
                    Clear All
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-500">
                Showing {activeTab === 'prompts' ? searchFilteredPrompts.length : searchFilteredSubmissions.length} results
                {hasActiveFilters && ' (filtered)'}
              </div>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
              <span className="text-gray-600 font-medium">Loading...</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className={`${
              (activeTab === 'analytics') ||
              (activeTab === 'prompts' && !showPromptDetail) ||
              (activeTab === 'submissions' && !selectedSubmission)
                ? 'lg:col-span-3'
                : 'lg:col-span-2'
            }`}>
              {activeTab === 'prompts' && (
                <EssayPromptList
                  prompts={searchFilteredPrompts}
                  onEdit={handleEditPrompt}
                  onViewDetail={handleViewPromptDetail}
                />
              )}
              {activeTab === 'submissions' && (
                <EssaySubmissionList
                  submissions={searchFilteredSubmissions}
                  onViewDetail={handleViewSubmissionDetail}
                />
              )}
              {activeTab === 'analytics' && (
                <EssayAnalytics
                  prompts={essayPrompts}
                  submissions={essaySubmissions}
                />
              )}
            </div>

            {/* Detail Panel for Prompts */}
            {activeTab === 'prompts' && showPromptDetail && selectedPrompt && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <EssayPromptDetail
                    prompt={selectedPrompt}
                    onClose={handlePromptDetailClose}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePrompt}
                  />
                </div>
              </div>
            )}

            {/* Detail Panel for Submissions */}
            {activeTab === 'submissions' && selectedSubmission && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <EssaySubmissionDetail
                    submission={selectedSubmission}
                    onClose={handleSubmissionDetailClose}
                    onUpdate={handleSubmissionUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EssayPromptForm
              prompt={selectedPrompt ?? undefined}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
              loading={loading}
              universities={universities}
              programs={programs}
              admissions={admissions}
              intakes={intakes}
            />
          </div>
        </div>
      )}

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EssayManagement;
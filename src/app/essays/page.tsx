/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Users, CheckCircle, Clock, TrendingUp, Plus, Search, Filter } from 'lucide-react';
import EssayPromptList from './components/EssayPromptList';
import EssaySubmissionList from './components/EssaySubmissionList';
import EssayPromptForm from './components/EssayPromptForm';
import EssaySubmissionDetail from './components/EssaySubmissionDetail';
import EssayAnalytics from './components/EssayAnalytics';
import SearchFilters from './components/SearchFilter';

// ================== SERVER ACTIONS ==================
import {
  createEssayPrompt,
  updateEssayPrompt,
  createEssaySubmission,
  updateEssaySubmission,
  getEssayPrompts,
  getEssaySubmissions,
  type EssayPrompt as ServerEssayPrompt,
  type EssaySubmission as ServerEssaySubmission,
  type EssayPromptInput,
  type EssayPromptUpdateInput,
  type EssaySubmissionInput,
  type EssaySubmissionUpdateInput
} from './action/EssayAction'

// ================== INTERFACES ==================
interface Admission {
  id: string;
  name: string;
}

interface Program {
  id: string;
  programName: string;
}

interface Intake {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
}

// Extended interfaces for UI with related data
export interface EssayPrompt extends ServerEssayPrompt {
  admission: Admission;
  program?: Program;
  intake?: Intake;
  _count: {
    submissions: number;
  };
}

export interface EssaySubmission extends ServerEssaySubmission {
  essayPrompt: {
    promptTitle: string;
    wordLimit: number;
  };
  user: User;
  application: Application;
}

interface Filters {
  admissionId: string;
  programId: string;
  intakeId: string;
  status: string;
  isMandatory: boolean | undefined;
  isActive: boolean | undefined;
}

interface Stats {
  totalPrompts: number;
  totalSubmissions: number;
  pendingReviews: number;
  averageRating: number;
}

// Re-export for component usage
export type {
  EssayPromptInput,
  EssayPromptUpdateInput,
  EssaySubmissionInput,
  EssaySubmissionUpdateInput
};

// ================== MAIN COMPONENT ==================
const EssayManagement = () => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'submissions' | 'analytics'>('prompts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EssayPrompt | EssaySubmission | null>(null);
  const [filters, setFilters] = useState<Filters>({
    admissionId: '',
    programId: '',
    intakeId: '',
    status: '',
    isMandatory: undefined,
    isActive: true
  });

  const [essayPrompts, setEssayPrompts] = useState<EssayPrompt[]>([]);
  const [essaySubmissions, setEssaySubmissions] = useState<EssaySubmission[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ================== DATA FETCHING ==================
  const fetchEssayPrompts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const prompts = await getEssayPrompts();
      
      // Transform server data to include related fields (you'll need to modify server action to include these)
      const transformedPrompts: EssayPrompt[] = prompts.map(prompt => ({
        ...prompt,
        admission: { id: prompt.admissionId, name: 'Loading...' }, // Placeholder - fetch from related tables
        program: prompt.programId ? { id: prompt.programId, programName: 'Loading...' } : undefined,
        intake: prompt.intakeId ? { id: prompt.intakeId, name: 'Loading...' } : undefined,
        _count: { submissions: 0 } // Will need to be calculated
      }));
      
      setEssayPrompts(transformedPrompts);
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
      const submissions = await getEssaySubmissions();
      
      // Transform server data to include related fields (you'll need to modify server action to include these)
      const transformedSubmissions: EssaySubmission[] = submissions.map(submission => ({
        ...submission,
        essayPrompt: { 
          promptTitle: 'Loading...', // Fetch from related prompt
          wordLimit: 0 
        },
        user: { 
          id: submission.userId || '', 
          name: 'Loading...', 
          email: 'Loading...' 
        },
        application: { id: submission.applicationId || '' }
      }));
      
      setEssaySubmissions(transformedSubmissions);
    } catch (err) {
      console.error('Error fetching essay submissions:', err);
      setError('Failed to fetch essay submissions');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchEssayPrompts();
    fetchEssaySubmissions();
  }, []);

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
      if (selectedItem) {
        // Update existing prompt
        await updateEssayPrompt(selectedItem.id, data as EssayPromptUpdateInput);
      } else {
        // Create new prompt
        await createEssayPrompt(data as EssayPromptInput);
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
    // You'll need to add a delete server action
    try {
      setLoading(true);
      setError(null);
      // await deleteEssayPrompt(promptId);
      console.log('Delete prompt:', promptId);
      await fetchEssayPrompts();
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Failed to delete prompt');
    } finally {
      setLoading(false);
    }
  };


  // Inside EssayManagement component


  // ================== FILTERING ==================
  const filteredData = (): EssayPrompt[] | EssaySubmission[] => {
    if (activeTab === 'prompts') {
      return essayPrompts.filter(prompt => 
        prompt.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!filters.admissionId || prompt.admissionId === filters.admissionId) &&
        (!filters.programId || prompt.programId === filters.programId) &&
        (filters.isActive === undefined || prompt.isActive === filters.isActive)
      );
    } else if (activeTab === 'submissions') {
      return essaySubmissions.filter(submission => 
        (submission.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         submission.essayPrompt?.promptTitle?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!filters.status || submission.status === filters.status)
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
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
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
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                <SearchFilters
                  filters={filters}
                  setFilters={setFilters}
                  activeTab={activeTab}
                />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EssayPromptForm
              prompt={selectedItem as EssayPrompt ?? undefined}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
              loading={loading}
              admissions={admissions}
              programs={programs}
              intakes={intakes}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayManagement;
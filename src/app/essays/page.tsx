/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Users, CheckCircle, Clock, TrendingUp, Plus, Search, Filter } from 'lucide-react';
import EssayPromptList from './components/EssayPromptList';
import EssaySubmissionList from './components/EssaySubmissionList';
import EssayPromptForm from './components/EssayPromptForm';
import EssaySubmissionDetail from './components/EssaySubmissionDetail';
import EssayAnalytics from './components/EssayAnalytics';
import SearchFilters from './components/SearchFilters';

const EssayManagement = () => {
  const [activeTab, setActiveTab] = useState('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    admissionId: '',
    programId: '',
    intakeId: '',
    status: '',
    isMandatory: undefined,
    isActive: true
  });

  const [essayPrompts, setEssayPrompts] = useState([]);
  const [essaySubmissions, setEssaySubmissions] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const mockEssayPrompts = [
    {
      id: '1',
      admissionId: '1',
      programId: '1',
      intakeId: '1',
      promptTitle: 'Personal Statement',
      promptText: 'Tell us about yourself and your academic goals...',
      wordLimit: 500,
      minWordCount: 250,
      isMandatory: true,
      isActive: true,
      createdAt: new Date(),
      admission: { name: 'Fall 2024 Admission' },
      program: { programName: 'Computer Science' },
      intake: { name: 'Fall 2024' },
      _count: { submissions: 45 }
    },
    {
      id: '2',
      admissionId: '1',
      programId: '2',
      promptTitle: 'Why This Program?',
      promptText: 'Explain why you chose this specific program...',
      wordLimit: 300,
      minWordCount: 150,
      isMandatory: false,
      isActive: true,
      createdAt: new Date(),
      admission: { name: 'Fall 2024 Admission' },
      program: { programName: 'Engineering' },
      _count: { submissions: 23 }
    }
  ];

  const mockEssaySubmissions = [
    {
      id: '1',
      essayPromptId: '1',
      userId: '1',
      applicationId: '1',
      title: 'My Journey to Computer Science',
      content: 'I have always been fascinated by technology...',
      wordCount: 487,
      status: 'SUBMITTED',
      submissionDate: new Date(),
      lastEditedAt: new Date(),
      reviewStatus: 'PENDING',
      internalRating: null,
      essayPrompt: { promptTitle: 'Personal Statement', wordLimit: 500 },
      user: { name: 'John Doe', email: 'john@example.com' },
      application: { id: '1' }
    },
    {
      id: '2',
      essayPromptId: '1',
      userId: '2',
      applicationId: '2',
      title: 'Personal Statement',
      content: 'My passion for computer science began...',
      wordCount: 456,
      status: 'UNDER_REVIEW',
      submissionDate: new Date(),
      reviewStatus: 'REVIEWED',
      reviewerId: 'admin1',
      reviewerComment: 'Good structure, needs more specific examples',
      internalRating: 4.2,
      essayPrompt: { promptTitle: 'Personal Statement', wordLimit: 500 },
      user: { name: 'Jane Smith', email: 'jane@example.com' },
      application: { id: '2' }
    }
  ];

  useEffect(() => {
    setEssayPrompts(mockEssayPrompts);
    setEssaySubmissions(mockEssaySubmissions);
  }, []);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('Form submitted:', data);
      setShowForm(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
  };

  const filteredData = () => {
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

  // Analytics calculations
  const stats = {
    totalPrompts: essayPrompts.length,
    totalSubmissions: essaySubmissions.length,
    pendingReviews: essaySubmissions.filter(s => s.reviewStatus === 'PENDING').length,
    averageRating: essaySubmissions.filter(s => s.internalRating)
      .reduce((sum, s) => sum + s.internalRating, 0) / 
      essaySubmissions.filter(s => s.internalRating).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
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
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
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

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${activeTab === 'analytics' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            {activeTab === 'prompts' && (
              <EssayPromptList
                prompts={filteredData()}
                onEdit={handleEdit}
                onViewDetail={handleViewDetail}
              />
            )}
            {activeTab === 'submissions' && (
              <EssaySubmissionList
                submissions={filteredData()}
                onViewDetail={handleViewDetail}
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
              {selectedItem && !showForm && (
                <EssaySubmissionDetail
                  submission={selectedItem}
                  onClose={() => setSelectedItem(null)}
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
              prompt={selectedItem}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayManagement;
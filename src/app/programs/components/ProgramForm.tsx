/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Upload, FileText, ExternalLink, Award } from 'lucide-react';

interface Program {
  id?: string;
  universityId: string;
  departmentId: string;
  programName: string;
  programSlug: string;
  degreeType?: string;
  programLength?: number;
  specializations?: string;
  programDescription?: string;
  curriculumOverview?: string;
  admissionRequirements?: string;
  averageEntranceScore?: number;
  programTuitionFees?: number;
  programAdditionalFees?: number;
  programMetaTitle?: string;
  programMetaDescription?: string;
  isActive: boolean;
  rankings?: Array<{
    id?: string;
    year: number;
    rank: number;
    source?: string;
  }>;
  externalLinks?: Array<{
    id?: string;
    title: string;
    url: string;
  }>;
}

interface ProgramFormProps {
  program?: Program | null;
  universities: Array<{ id: string; name: string; slug: string }>;
  departments: Array<{ id: string; name: string; universityId: string }>;
  onSubmit: (data: Program) => void;
  onClose: () => void;
  loading: boolean;
}

const ProgramForm: React.FC<ProgramFormProps> = ({
  program,
  universities,
  departments,
  onSubmit,
  onClose,
  loading
}) => {
  const [formData, setFormData] = useState<Program>({
    universityId: '',
    departmentId: '',
    programName: '',
    programSlug: '',
    degreeType: '',
    programLength: undefined,
    specializations: '',
    programDescription: '',
    curriculumOverview: '',
    admissionRequirements: '',
    averageEntranceScore: undefined,
    programTuitionFees: undefined,
    programAdditionalFees: undefined,
    programMetaTitle: '',
    programMetaDescription: '',
    isActive: true,
    rankings: [],
    externalLinks: []
  });

  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (program) {
      setFormData({
        ...program,
        rankings: program.rankings || [],
        externalLinks: program.externalLinks || []
      });
    }
  }, [program]);

  useEffect(() => {
    if (formData.programName && !program) {
      const slug = formData.programName
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, programSlug: slug }));
    }
  }, [formData.programName, program]);

  const handleInputChange = (field: keyof Program, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRanking = () => {
    setFormData(prev => ({
      ...prev,
      rankings: [...(prev.rankings || []), { year: new Date().getFullYear(), rank: 1, source: '' }]
    }));
  };

  const updateRanking = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rankings: prev.rankings?.map((ranking, i) => 
        i === index ? { ...ranking, [field]: value } : ranking
      )
    }));
  };

  const removeRanking = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rankings: prev.rankings?.filter((_, i) => i !== index)
    }));
  };

  const addExternalLink = () => {
    setFormData(prev => ({
      ...prev,
      externalLinks: [...(prev.externalLinks || []), { title: '', url: '' }]
    }));
  };

  const updateExternalLink = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks?.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const filteredDepartments = departments.filter(dept => 
    dept.universityId === formData.universityId
  );

  const degreeTypes = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {program ? 'Edit Program' : 'Create New Program'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'basic', label: 'Basic Info', icon: FileText },
                { key: 'details', label: 'Details', icon: FileText },
                { key: 'rankings', label: 'Rankings', icon: Award },
                { key: 'links', label: 'External Links', icon: ExternalLink }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University *
                    </label>
                    <select
                      value={formData.universityId}
                      onChange={(e) => handleInputChange('universityId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => handleInputChange('departmentId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.universityId}
                    >
                      <option value="">Select Department</option>
                      {filteredDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    value={formData.programName}
                    onChange={(e) => handleInputChange('programName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.programSlug}
                    onChange={(e) => handleInputChange('programSlug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree Type
                    </label>
                    <select
                      value={formData.degreeType}
                      onChange={(e) => handleInputChange('degreeType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Degree Type</option>
                      {degreeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Length (years)
                    </label>
                    <input
                      type="number"
                      value={formData.programLength || ''}
                      onChange={(e) => handleInputChange('programLength', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.specializations}
                    onChange={(e) => handleInputChange('specializations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AI, Machine Learning, Software Engineering"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Program
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Description
                  </label>
                  <textarea
                    value={formData.programDescription}
                    onChange={(e) => handleInputChange('programDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum Overview
                  </label>
                  <textarea
                    value={formData.curriculumOverview}
                    onChange={(e) => handleInputChange('curriculumOverview', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Requirements
                  </label>
                  <textarea
                    value={formData.admissionRequirements}
                    onChange={(e) => handleInputChange('admissionRequirements', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Entrance Score (%)
                    </label>
                    <input
                      type="number"
                      value={formData.averageEntranceScore || ''}
                      onChange={(e) => handleInputChange('averageEntranceScore', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tuition Fees ($)
                    </label>
                    <input
                      type="number"
                      value={formData.programTuitionFees || ''}
                      onChange={(e) => handleInputChange('programTuitionFees', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Fees ($)
                    </label>
                    <input
                      type="number"
                      value={formData.programAdditionalFees || ''}
                      onChange={(e) => handleInputChange('programAdditionalFees', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.programMetaTitle}
                    onChange={(e) => handleInputChange('programMetaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    value={formData.programMetaDescription}
                    onChange={(e) => handleInputChange('programMetaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'rankings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Program Rankings</h3>
                  <button
                    type="button"
                    onClick={addRanking}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Ranking
                  </button>
                </div>

                {formData.rankings?.map((ranking, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Ranking #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRanking(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year
                        </label>
                        <input
                          type="number"
                          value={ranking.year}
                          onChange={(e) => updateRanking(index, 'year', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="2000"
                          max="2030"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rank
                        </label>
                        <input
                          type="number"
                          value={ranking.rank}
                          onChange={(e) => updateRanking(index, 'rank', parseInt(e.target.value))}
                          // continuing from where you stopped...
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Source (Optional)
                        </label>
                        <input
                          type="text"
                          value={ranking.source || ''}
                          onChange={(e) => updateRanking(index, 'source', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">External Links</h3>
                  <button
                    type="button"
                    onClick={addExternalLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Link
                  </button>
                </div>

                {formData.externalLinks?.map((link, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Link #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeExternalLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateExternalLink(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramForm;

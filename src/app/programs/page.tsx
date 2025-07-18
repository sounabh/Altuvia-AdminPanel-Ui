/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Building, GraduationCap, FileText, Award, ExternalLink, Users, DollarSign } from 'lucide-react';
import DepartmentList from './components/DepartmentList';
import ProgramList from './components/ProgramList';
import ProgramDetail from './components/Programdetail';
import DepartmentForm from './components/DepartmentForm'; 
import ProgramForm from './components/ProgramForm';
import SearchFilters from './components/SearchFilters';

const UniversityManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    universityId: '',
    departmentId: '',
    degreeType: '',
    isActive: true
  });

  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const mockUniversities = [
    { id: '1', name: 'Harvard University', slug: 'harvard' },
    { id: '2', name: 'Stanford University', slug: 'stanford' },
    { id: '3', name: 'MIT', slug: 'mit' }
  ];

  const mockDepartments = [
    {
      id: '1',
      universityId: '1',
      name: 'Computer Science',
      slug: 'computer-science',
      programs: [
        { id: '1', programName: 'Bachelor of Computer Science', degreeType: 'Bachelor', isActive: true },
        { id: '2', programName: 'Master of Computer Science', degreeType: 'Master', isActive: true }
      ],
      _count: { programs: 2 }
    },
    {
      id: '2',
      universityId: '1',
      name: 'Engineering',
      slug: 'engineering',
      programs: [
        { id: '3', programName: 'Bachelor of Engineering', degreeType: 'Bachelor', isActive: true }
      ],
      _count: { programs: 1 }
    }
  ];

  const mockPrograms = [
    {
      id: '1',
      programName: 'Bachelor of Computer Science',
      programSlug: 'bachelor-computer-science',
      degreeType: 'Bachelor',
      programLength: 4,
      specializations: 'AI, Machine Learning, Software Engineering',
      programDescription: 'Comprehensive computer science program covering all aspects of computing.',
      curriculumOverview: 'Core CS subjects, programming languages, algorithms, data structures.',
      admissionRequirements: 'High school diploma, SAT scores, recommendation letters.',
      averageEntranceScore: 85.5,
      programTuitionFees: 50000,
      programAdditionalFees: 5000,
      isActive: true,
      department: { name: 'Computer Science' },
      university: { name: 'Harvard University' },
      rankings: [
        { year: 2024, rank: 1, source: 'QS World Rankings' }
      ],
      externalLinks: [
        { id: '1', title: 'Official Program Page', url: 'https://example.com' }
      ],
      _count: {
        admissions: 150,
        scholarships: 5,
        tuitionBreakdowns: 3
      }
    }
  ];

  useEffect(() => {
    setUniversities(mockUniversities);
    setDepartments(mockDepartments);
    setPrograms(mockPrograms);
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
    // Handle form submission based on active tab
    try {
      // API call would go here
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
    if (activeTab === 'departments') {
      return departments.filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!filters.universityId || dept.universityId === filters.universityId)
      );
    } else {
      return programs.filter(program => 
        program.programName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!filters.universityId || program.universityId === filters.universityId) &&
        (!filters.departmentId || program.departmentId === filters.departmentId) &&
        (!filters.degreeType || program.degreeType === filters.degreeType) &&
        (filters.isActive === undefined || program.isActive === filters.isActive)
      );
    }
  };

  const stats = {
    totalDepartments: departments.length,
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.isActive).length,
    totalStudents: programs.reduce((sum, p) => sum + (p._count?.admissions || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">University Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage departments, programs, and academic resources</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create New {activeTab === 'departments' ? 'Department' : 'Program'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePrograms}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'departments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="inline-block w-4 h-4 mr-2" />
                Departments
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'programs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="inline-block w-4 h-4 mr-2" />
                Programs
              </button>
            </nav>
          </div>

          {/* Search and Filter Section */}
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
                universities={universities}
                departments={departments}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'departments' ? (
              <DepartmentList
                departments={filteredData()}
                onEdit={handleEdit}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <ProgramList
                programs={filteredData()}
                onEdit={handleEdit}
                onViewDetail={handleViewDetail}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            {selectedItem && !showForm && (
              <ProgramDetail
                program={selectedItem}
                onEdit={handleEdit}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {activeTab === 'departments' ? (
              <DepartmentForm
                department={selectedItem}
                universities={universities}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
                loading={loading}
              />
            ) : (
              <ProgramForm
                program={selectedItem}
                universities={universities}
                departments={departments}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityManagement;
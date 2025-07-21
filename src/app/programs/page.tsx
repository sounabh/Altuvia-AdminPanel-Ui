/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/program-management/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Building, GraduationCap, FileText, Award, ExternalLink, Users } from 'lucide-react';
import { toast } from 'sonner'; // Changed from useToast to sonner
import DepartmentList from './components/DepartmentList';
import ProgramList from './components/ProgramList';
import ProgramDetail from './components/Programdetail';
import DepartmentForm from './components/DepartmentForm'; 
import ProgramForm from './components/ProgramForm';
import SearchFilters from './components/SearchFilters';
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByUniversity,
  createProgram,
  updateProgram,
  deleteProgram,
  searchPrograms,
  getProgramById,
  uploadSyllabus,
  deleteSyllabus,
  addProgramRanking,
  updateProgramRanking,
  deleteProgramRanking,
  addExternalLink,
  updateExternalLink,
  deleteExternalLink,
  getUniversities,
} from './actions/action';
import type {
  DepartmentWithPrograms,
  ProgramSearchResult,
  ProgramWithFullRelations,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateProgramInput,
  UpdateProgramInput,
  CreateSyllabusInput,
  CreateProgramRankingInput,
  UpdateProgramRankingInput,
  CreateExternalLinkInput,
  UpdateExternalLinkInput,
  SearchProgramsFilters
} from './types/programs';

const ProgramManagement = () => {
  const [activeTab, setActiveTab] = useState<'departments' | 'programs'>('departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DepartmentWithPrograms | ProgramWithFullRelations | null>(null);
  const [filters, setFilters] = useState<SearchProgramsFilters>({
    universityId: '',
    departmentId: '',
    degreeType: '',
    isActive: true
  });

  const [departments, setDepartments] = useState<DepartmentWithPrograms[]>([]);
  const [programs, setPrograms] = useState<ProgramSearchResult[]>([]);
  const [universities, setUniversities] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [univs, depts, progs] = await Promise.all([
          getUniversities(),
          getDepartmentsByUniversity(),
          searchPrograms('', {})
        ]);
        
        setUniversities(univs);
        setDepartments(depts);
        setPrograms(progs);
      } catch (error) {
        toast.error("Failed to fetch data", {
          description: "Please try again later"
        });
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: DepartmentWithPrograms | ProgramWithFullRelations) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = async (data: CreateDepartmentInput | CreateProgramInput) => {
    setLoading(true);
    try {
      if (activeTab === 'departments') {
        const input = data as CreateDepartmentInput;
        const result = selectedItem?.id
          ? await updateDepartment(selectedItem.id, input as UpdateDepartmentInput)
          : await createDepartment(input);
        
        if (result.success) {
          const updatedDepts = await getDepartmentsByUniversity();
          setDepartments(updatedDepts);
          toast.success(selectedItem?.id 
            ? "Department updated successfully" 
            : "Department created successfully"
          );
        } else {
          throw new Error((result as any).error || "Operation failed");
        }
      } else {
        const input = data as CreateProgramInput;
        const result = selectedItem?.id
          ? await updateProgram(selectedItem.id, input as UpdateProgramInput)
          : await createProgram(input);
        
        if (result.success) {
          const updatedProgs = await searchPrograms('', {});
          setPrograms(updatedProgs);
          toast.success(selectedItem?.id 
            ? "Program updated successfully" 
            : "Program created successfully"
          );
        } else {
          throw new Error(result.error);
        }
      }
      setShowForm(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast.error("Operation failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const result = activeTab === 'departments'
        ? await deleteDepartment(id)
        : await deleteProgram(id);
      
      if (result.success) {
        if (activeTab === 'departments') {
          const updatedDepts = await getDepartmentsByUniversity();
          setDepartments(updatedDepts);
        } else {
          const updatedProgs = await searchPrograms('', {});
          setPrograms(updatedProgs);
        }
        toast.success(`${activeTab === 'departments' ? 'Department' : 'Program'} deleted successfully`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error("Deletion failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (item: DepartmentWithPrograms | ProgramSearchResult) => {
    if ('programName' in item) {
      try {
        setLoading(true);
        const program = await getProgramById(item.id);
        if (program) {
          setSelectedItem(program);
        }
      } catch (error) {
        toast.error("Failed to fetch program details");
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedItem(item);
    }
  };

  const handleSyllabusUpload = async (data: CreateSyllabusInput) => {
    try {
      setLoading(true);
      const result = await uploadSyllabus(data);
      if (result.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success("Syllabus uploaded successfully");
      } else {
        throw new Error((result as any).error || "Syllabus upload failed");
      }
    } catch (error: any) {
      toast.error("Syllabus upload failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyllabusDelete = async (programId: string) => {
    try {
      setLoading(true);
      const result = await deleteSyllabus(programId);
      if (result.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success("Syllabus deleted successfully");
      } else {
       throw new Error((result as any).error || "Syllabus deletion failed");
      }
    } catch (error: any) {
      toast.error("Syllabus deletion failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRankingAction = async (
    action: 'create' | 'update' | 'delete',
    data: CreateProgramRankingInput | UpdateProgramRankingInput,
    id?: string
  ) => {
    try {
      setLoading(true);
      let result;
      
      if (action === 'create') {
        result = await addProgramRanking(data as CreateProgramRankingInput);
      } else if (action === 'update' && id) {
        result = await updateProgramRanking(id, data as UpdateProgramRankingInput);
      } else if (action === 'delete' && id) {
        result = await deleteProgramRanking(id);
      }
      
      if (result?.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success(`Ranking ${action}d successfully`);
      } else if (!result?.success) {
        throw new Error(result?.error);
      }
    } catch (error: any) {
      toast.error(`Ranking ${action} failed`, {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAction = async (
    action: 'create' | 'update' | 'delete',
    data: CreateExternalLinkInput | UpdateExternalLinkInput,
    id?: string
  ) => {
    try {
      setLoading(true);
      let result;
      
      if (action === 'create') {
        result = await addExternalLink(data as CreateExternalLinkInput);
      } else if (action === 'update' && id) {
        result = await updateExternalLink(id, data as UpdateExternalLinkInput);
      } else if (action === 'delete' && id) {
        result = await deleteExternalLink(id);
      }
      
      if (result?.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success(`External link ${action}d successfully`);
      } else if (!result?.success) {
        throw new Error(result?.error);
      }
    } catch (error: any) {
      toast.error(`External link ${action} failed`, {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = (): (DepartmentWithPrograms | ProgramSearchResult)[] => {
    if (isFetching) return [];
    
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
              <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage departments, programs, and academic resources</p>
            </div>
            <button
              onClick={handleCreateNew}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
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
            {isFetching ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p>Loading data...</p>
              </div>
            ) : activeTab === 'departments' ? (
              <DepartmentList
                departments={filteredData() as DepartmentWithPrograms[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <ProgramList
                programs={filteredData() as ProgramSearchResult[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetail={handleViewDetail}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            {selectedItem && !showForm && 'programName' in selectedItem && (
              <ProgramDetail
                program={selectedItem as ProgramWithFullRelations}
                onEdit={handleEdit}
                onClose={() => setSelectedItem(null)}
                onSyllabusUpload={handleSyllabusUpload}
                onSyllabusDelete={handleSyllabusDelete}
                onRankingAction={handleRankingAction}
                onLinkAction={handleLinkAction}
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
                department={selectedItem as DepartmentWithPrograms}
                universities={universities}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
                loading={loading}
              />
            ) : (
              <ProgramForm
                program={selectedItem as ProgramWithFullRelations}
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

export default ProgramManagement;
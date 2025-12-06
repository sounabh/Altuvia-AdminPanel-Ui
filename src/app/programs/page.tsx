/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Building, GraduationCap, Award, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
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
  debugGetAllPrograms,
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
  SearchProgramsFilters,
  University
} from './types/programs';

type ActiveTab = 'departments' | 'programs';
type SelectedItemType = DepartmentWithPrograms | ProgramWithFullRelations | null;

interface DebugInfo {
  totalPrograms: number;
  programDepartments: number;
  samplePrograms: any[];
}

const ProgramManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [filters, setFilters] = useState<SearchProgramsFilters>({
    universityId: undefined,
    departmentIds: [],
    degreeType: undefined,
    isActive: undefined // Changed to undefined to show all programs by default
  });

  const [departments, setDepartments] = useState<DepartmentWithPrograms[]>([]);
  const [programs, setPrograms] = useState<ProgramSearchResult[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        
        // Debug: Check raw program count first
        const debug = await debugGetAllPrograms();
        setDebugInfo({
          totalPrograms: debug.totalPrograms,
          programDepartments: debug.programDepartments,
          samplePrograms: debug.programs
        });
        console.log('Debug info:', debug);

        const [univs, depts, progs] = await Promise.all([
          getUniversities(),
          getDepartmentsByUniversity(),
          searchPrograms('', {}) // Empty filters to get all programs
        ]);

        console.log('Fetched universities:', univs.length);
        console.log('Fetched departments:', depts.length);
        console.log('Fetched programs:', progs.length);
        console.log('Programs data:', progs);

        setUniversities(univs);
        setDepartments(depts);
        setPrograms(progs);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error("Failed to fetch data", {
          description: "Please try again later"
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const refreshPrograms = async (): Promise<void> => {
    try {
      const progs = await searchPrograms('', {});
      setPrograms(progs);
    } catch (error) {
      console.error('Error refreshing programs:', error);
    }
  };

  const handleCreateNew = (): void => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: DepartmentWithPrograms | ProgramWithFullRelations | ProgramSearchResult): void => {
    setSelectedItem(item as SelectedItemType);
    setShowForm(true);
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = async (data: CreateDepartmentInput | CreateProgramInput): Promise<void> => {
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
          throw new Error(result.error || "Operation failed");
        }
      } else {
        const input = data as CreateProgramInput;
        const result = selectedItem?.id
          ? await updateProgram(selectedItem.id, input as UpdateProgramInput)
          : await createProgram(input);
        
        if (result.success) {
          await refreshPrograms();
          toast.success(selectedItem?.id 
            ? "Program updated successfully" 
            : "Program created successfully"
          );
        } else {
          throw new Error(result.error || "Operation failed");
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

  const handleDelete = async (id: string): Promise<void> => {
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
          await refreshPrograms();
        }
        toast.success(`${activeTab === 'departments' ? 'Department' : 'Program'} deleted successfully`);
      } else {
        throw new Error(result.error || "Deletion failed");
      }
    } catch (error: any) {
      toast.error("Deletion failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (item: DepartmentWithPrograms | ProgramSearchResult): Promise<void> => {
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

  const handleSyllabusUpload = async (data: CreateSyllabusInput): Promise<void> => {
    try {
      setLoading(true);
      const result = await uploadSyllabus(data);
      if (result.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success("Syllabus uploaded successfully");
      } else if (!result.success) {
        throw new Error(result.error || "Syllabus upload failed");
      }
    } catch (error: any) {
      toast.error("Syllabus upload failed", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyllabusDelete = async (programId: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await deleteSyllabus(programId);
      if (result.success && selectedItem && 'programName' in selectedItem) {
        const updatedProgram = await getProgramById(selectedItem.id);
        if (updatedProgram) setSelectedItem(updatedProgram);
        toast.success("Syllabus deleted successfully");
      } else if (!result.success) {
        throw new Error(result.error || "Syllabus deletion failed");
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
  ): Promise<void> => {
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
      } else if (result && !result.success) {
        throw new Error(result.error);
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
  ): Promise<void> => {
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
      } else if (result && !result.success) {
        throw new Error(result.error);
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
      return programs.filter(program => {
        const matchesSearch = program.programName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUniversity = !filters.universityId || program.universityId === filters.universityId;
        const matchesDepartments = !filters.departmentIds || filters.departmentIds.length === 0 || 
          program.departments?.some(pd => filters.departmentIds?.includes(pd.department.id));
        const matchesDegreeType = !filters.degreeType || program.degreeType === filters.degreeType;
        const matchesActive = filters.isActive === undefined || program.isActive === filters.isActive;

        return matchesSearch && matchesUniversity && matchesDepartments && matchesDegreeType && matchesActive;
      });
    }
  };

  const stats = {
    totalDepartments: departments.length,
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.isActive).length,
    totalStudents: programs.reduce((sum, p) => sum + (p._count?.admissions || 0), 0)
  };

  const isProgramSelected = selectedItem && 'programName' in selectedItem;

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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showDebug ? 'Hide Debug' : 'Show Debug'}
              </button>
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
      </div>

      {/* Debug Panel */}
   

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
                Departments ({departments.length})
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
                Programs ({programs.length})
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading data...</p>
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
            {isProgramSelected && !showForm && (
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
                department={selectedItem as DepartmentWithPrograms | null}
                universities={universities}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
                loading={loading}
              />
            ) : (
              <ProgramForm
                program={selectedItem as ProgramWithFullRelations | null}
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
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { SearchProgramsFilters, DepartmentWithPrograms, University } from '../types/programs';

interface SearchFiltersProps {
  filters: SearchProgramsFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchProgramsFilters>>;
  universities: University[];
  departments: DepartmentWithPrograms[];
  activeTab: 'departments' | 'programs';
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  universities,
  departments,
  activeTab
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter departments by selected university
  const filteredDepartments = filters.universityId
    ? departments.filter(dept => dept.universityId === filters.universityId)
    : departments;

  // Count active filters
  const activeFilterCount = [
    filters.universityId,
    filters.departmentIds && filters.departmentIds.length > 0,
    filters.degreeType,
    filters.isActive !== undefined && !filters.isActive
  ].filter(Boolean).length;

  const handleReset = (): void => {
    setFilters({ 
      universityId: '', 
      departmentIds: [], 
      degreeType: '', 
      isActive: true 
    });
  };

  const handleUniversityChange = (universityId: string): void => {
    setFilters({ 
      ...filters, 
      universityId: universityId || undefined, 
      departmentIds: [] // Reset departments when university changes
    });
  };

  const handleDepartmentToggle = (departmentId: string): void => {
    const currentIds = filters.departmentIds || [];
    const newIds = currentIds.includes(departmentId)
      ? currentIds.filter(id => id !== departmentId)
      : [...currentIds, departmentId];
    setFilters({ ...filters, departmentIds: newIds });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Filter className="h-4 w-4 mr-1" /> 
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowFilters(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* University Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <select
                    value={filters.universityId || ''}
                    onChange={(e) => handleUniversityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Universities</option>
                    {universities.map((university) => (
                      <option key={university.id} value={university.id}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Program-specific filters */}
                {activeTab === 'programs' && (
                  <>
                    {/* Departments Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departments
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                        {filteredDepartments.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-2">
                            {filters.universityId 
                              ? 'No departments for selected university' 
                              : 'No departments available'}
                          </p>
                        ) : (
                          filteredDepartments.map((department) => (
                            <label key={department.id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.departmentIds?.includes(department.id) || false}
                                onChange={() => handleDepartmentToggle(department.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-900 truncate" title={department.name}>
                                {department.name}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                      {filters.departmentIds && filters.departmentIds.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {filters.departmentIds.length} department(s) selected
                        </p>
                      )}
                    </div>
                    
                    {/* Degree Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree Type
                      </label>
                      <select
                        value={filters.degreeType || ''}
                        onChange={(e) => setFilters({ ...filters, degreeType: e.target.value || undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Degree Types</option>
                        <option value="Bachelor">Bachelor&apos;s</option>
                        <option value="Master">Master&apos;s</option>
                        <option value="Doctorate">Doctorate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                    </div>
                    
                    {/* Active Status Filter */}
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        type="checkbox"
                        checked={filters.isActive ?? true}
                        onChange={(e) => setFilters({ ...filters, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Programs Only
                      </label>
                    </div>
                  </>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-2 border-t">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFilters;
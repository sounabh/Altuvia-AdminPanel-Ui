// app/program-management/components/SearchFilters.tsx
import React from 'react';
import { Filter } from 'lucide-react';
import type { 
  SearchProgramsFilters, 
  DepartmentWithPrograms 
} from '../types/programs';

interface SearchFiltersProps {
  filters: SearchProgramsFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchProgramsFilters>>;
  universities: { id: string; name: string; slug: string }[];
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
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <Filter className="h-4 w-4 mr-1" /> Filters
      </button>
      
      {showFilters && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <select
                  value={filters.universityId || ''}
                  onChange={(e) => setFilters({ ...filters, universityId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Universities</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {activeTab === 'programs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={filters.departmentId || ''}
                      onChange={(e) => setFilters({ ...filters, departmentId: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={!filters.universityId}
                    >
                      <option value="">All Departments</option>
                      {departments
                        .filter(dept => !filters.universityId || dept.universityId === filters.universityId)
                        .map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Type
                    </label>
                    <select
                      value={filters.degreeType || ''}
                      onChange={(e) => setFilters({ ...filters, degreeType: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Degree Types</option>
                      <option value="Bachelor">Bachelors</option>
                      <option value="Master">Masters</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>
                  
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
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFilters({ isActive: true })}
                  className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
import React, { useState } from 'react';
import {
  Filter,
  X,
  Building,
  GraduationCap,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

// 🔷 Types
export interface FilterState {
  universityId: string;
  departmentId: string;
  degreeType: string;
  isActive: boolean | undefined;
}

export interface University {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  universityId: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  universities: University[];
  departments: Department[];
  activeTab: 'universities' | 'programs' | string;
}

// 🔷 Component
const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  universities,
  departments,
  activeTab
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const degreeTypes = [
    'Bachelor',
    'Master',
    'PhD',
    'Diploma',
    'Certificate',
    'Associate'
  ];

  const handleFilterChange = (key: keyof FilterState, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      universityId: '',
      departmentId: '',
      degreeType: '',
      isActive: undefined
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.universityId) count++;
    if (filters.departmentId) count++;
    if (filters.degreeType) count++;
    if (filters.isActive !== undefined) count++;
    return count;
  };

  const filteredDepartments = departments.filter(dept =>
    !filters.universityId || dept.universityId === filters.universityId
  );

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter size={16} />
        <span>Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Filter dropdown */}
      {showFilters && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline-block w-4 h-4 mr-1" />
                  University
                </label>
                <select
                  value={filters.universityId}
                  onChange={(e) => handleFilterChange('universityId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Universities</option>
                  {universities.map(university => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              {activeTab === 'programs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline-block w-4 h-4 mr-1" />
                    Department
                  </label>
                  <select
                    value={filters.departmentId}
                    onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {filteredDepartments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Degree Type */}
              {activeTab === 'programs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline-block w-4 h-4 mr-1" />
                    Degree Type
                  </label>
                  <select
                    value={filters.degreeType}
                    onChange={(e) => handleFilterChange('degreeType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Degree Types</option>
                    {degreeTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Toggle */}
              {activeTab === 'programs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFilterChange('isActive', true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        filters.isActive === true
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ToggleRight size={16} />
                      Active
                    </button>
                    <button
                      onClick={() => handleFilterChange('isActive', false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        filters.isActive === false
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ToggleLeft size={16} />
                      Inactive
                    </button>
                    <button
                      onClick={() => handleFilterChange('isActive', undefined)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        filters.isActive === undefined
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

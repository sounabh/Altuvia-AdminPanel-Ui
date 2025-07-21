/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface SearchFiltersProps {
  filters: {
    admissionId: string;
    programId: string;
    intakeId: string;
    status: string;
    isMandatory: boolean | undefined;
    isActive: boolean | undefined;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  activeTab: 'prompts' | 'submissions' | 'analytics';
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  setFilters, 
  activeTab 
}) => {
  // In a real app, these would come from API
  const admissions = [
    { id: '1', name: 'Fall 2024 Admission' },
    { id: '2', name: 'Spring 2025 Admission' },
  ];
  
  const programs = [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Engineering' },
    { id: '3', name: 'Business Administration' },
  ];
  
  const intakes = [
    { id: '1', name: 'Fall 2024' },
    { id: '2', name: 'Spring 2025' },
  ];
  
  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFilters((prev: any) => ({
      ...prev,
      [name]: val === '' ? undefined : val
    }));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {activeTab === 'prompts' && (
        <>
          <div>
            <select
              name="admissionId"
              value={filters.admissionId}
              onChange={handleChange}
              className="text-sm border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Admissions</option>
              {admissions.map(admission => (
                <option key={admission.id} value={admission.id}>
                  {admission.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="programId"
              value={filters.programId}
              onChange={handleChange}
              className="text-sm border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="intakeId"
              value={filters.intakeId}
              onChange={handleChange}
              className="text-sm border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Intakes</option>
              {intakes.map(intake => (
                <option key={intake.id} value={intake.id}>
                  {intake.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <input
              type="checkbox"
              id="isMandatory"
              name="isMandatory"
              checked={filters.isMandatory || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isMandatory" className="text-sm">
              Mandatory Only
            </label>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={filters.isActive || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm">
              Active Only
            </label>
          </div>
        </>
      )}
      
      {activeTab === 'submissions' && (
        <div>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="text-sm border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button
        onClick={() => setFilters({
          admissionId: '',
          programId: '',
          intakeId: '',
          status: '',
          isMandatory: undefined,
          isActive: true
        })}
        className="text-sm text-blue-600 hover:text-blue-800 px-3 py-2"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchFilters;
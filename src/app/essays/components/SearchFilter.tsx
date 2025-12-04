// SearchFilters.tsx - FIXED VERSION
import React from 'react';
import { X } from 'lucide-react';

interface Admission {
  id: string;
  university: {
    universityName: string;
  };
  program: {
    programName: string;
  };
}

interface Program {
  id: string;
  programName: string;
  degreeType: string | null;
  university?: {
    universityName: string;
  } | null;
}

interface Intake {
  id: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

interface SearchFiltersProps {
  filters: {
    admissionId: string;
    programId: string;
    intakeId: string;
    status: string;
    reviewStatus: string;
    isMandatory: boolean | undefined;
    isActive: boolean | undefined;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    admissionId: string;
    programId: string;
    intakeId: string;
    status: string;
    reviewStatus: string;
    isMandatory: boolean | undefined;
    isActive: boolean | undefined;
  }>>;
  activeTab: 'prompts' | 'submissions' | 'analytics';
  admissions?: Admission[];
  programs?: Program[];
  intakes?: Intake[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  setFilters, 
  activeTab,
  admissions = [],
  programs = [],
  intakes = []
}) => {
  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const reviewStatusOptions = [
    { value: 'PENDING', label: 'Pending Review' },
    { value: 'REVIEWED', label: 'Reviewed' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value === '' ? (name === 'isMandatory' || name === 'isActive' ? undefined : '') : value
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      admissionId: '',
      programId: '',
      intakeId: '',
      status: '',
      reviewStatus: '',
      isMandatory: undefined,
      isActive: undefined
    });
  };

  const selectClassName = "h-10 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm min-w-[160px]";
  const checkboxContainerClassName = "flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm h-10";

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex flex-wrap gap-3 items-center">
        {activeTab === 'prompts' && (
          <>
            <select
              name="admissionId"
              value={filters.admissionId}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Admissions</option>
              {admissions.map(admission => (
                <option key={admission.id} value={admission.id}>
                  {admission.university.universityName} - {admission.program.programName}
                </option>
              ))}
            </select>
            
            <select
              name="programId"
              value={filters.programId}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                  {program.degreeType ? ` (${program.degreeType})` : ''}
                </option>
              ))}
            </select>
            
            <select
              name="intakeId"
              value={filters.intakeId}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Intakes</option>
              {intakes.map(intake => (
                <option key={intake.id} value={intake.id}>
                  {intake.intakeName} - {intake.intakeType} {intake.intakeYear}
                </option>
              ))}
            </select>
            
            <div className={checkboxContainerClassName}>
              <input
                type="checkbox"
                id="isMandatory"
                name="isMandatory"
                checked={filters.isMandatory === true}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isMandatory" className="text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                Mandatory Only
              </label>
            </div>
            
            <div className={checkboxContainerClassName}>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={filters.isActive === true}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                Active Only
              </label>
            </div>
          </>
        )}
        
        {activeTab === 'submissions' && (
          <>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="reviewStatus"
              value={filters.reviewStatus}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Review Statuses</option>
              {reviewStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="programId"
              value={filters.programId}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                  {program.degreeType ? ` (${program.degreeType})` : ''}
                </option>
              ))}
            </select>
          </>
        )}
        
        <button
          onClick={handleClearFilters}
          className="h-10 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
        >
          <X size={14} />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
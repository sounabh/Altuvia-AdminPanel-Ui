// SearchFilters.tsx - FIXED VERSION WITH UNIVERSITY FILTER
import React, { useMemo } from 'react';
import { X } from 'lucide-react';

interface University {
  id: string;
  universityName: string;
  city: string;
  country: string;
}

interface Admission {
  id: string;
  universityId: string;
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
  universityId: string;
  university?: {
    universityName: string;
  } | null;
}

interface Intake {
  id: string;
  admissionId: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

interface SearchFiltersProps {
  filters: {
    universityId: string;      // ✅ Added universityId
    admissionId: string;
    programId: string;
    intakeId: string;
    status: string;
    reviewStatus: string;
    isMandatory: boolean | undefined;
    isActive: boolean | undefined;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    universityId: string;      // ✅ Added universityId
    admissionId: string;
    programId: string;
    intakeId: string;
    status: string;
    reviewStatus: string;
    isMandatory: boolean | undefined;
    isActive: boolean | undefined;
  }>>;
  activeTab: 'prompts' | 'submissions' | 'analytics';
  universities?: University[];  // ✅ Added universities prop
  admissions?: Admission[];
  programs?: Program[];
  intakes?: Intake[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  activeTab,
  universities = [],
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

  // ✅ Filter programs based on selected university
  const filteredPrograms = useMemo(() => {
    if (!filters.universityId) {
      return programs;
    }
    return programs.filter(program => program.universityId === filters.universityId);
  }, [programs, filters.universityId]);

  // ✅ Filter admissions based on selected university
  const filteredAdmissions = useMemo(() => {
    if (!filters.universityId) {
      return admissions;
    }
    return admissions.filter(admission => admission.universityId === filters.universityId);
  }, [admissions, filters.universityId]);

  // ✅ Filter intakes based on selected admission
  const filteredIntakes = useMemo(() => {
    if (!filters.admissionId) {
      return intakes;
    }
    return intakes.filter(intake => intake.admissionId === filters.admissionId);
  }, [intakes, filters.admissionId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev };
        
        // ✅ Reset dependent filters when parent filter changes
        if (name === 'universityId') {
          newFilters.universityId = value;
          newFilters.programId = '';      // Reset program when university changes
          newFilters.admissionId = '';    // Reset admission when university changes
          newFilters.intakeId = '';       // Reset intake when university changes
        } else if (name === 'admissionId') {
          newFilters.admissionId = value;
          newFilters.intakeId = '';       // Reset intake when admission changes
        } else if (name === 'isMandatory' || name === 'isActive') {
          (newFilters as any)[name] = value === '' ? undefined : value === 'true';
        } else {
          (newFilters as any)[name] = value;
        }
        
        return newFilters;
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      universityId: '',
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
        
        {/* ✅ University Filter - Common for both tabs */}
        <select
          name="universityId"
          value={filters.universityId}
          onChange={handleChange}
          className={selectClassName}
        >
          <option value="">All Universities</option>
          {universities.map(university => (
            <option key={university.id} value={university.id}>
              {university.universityName}
            </option>
          ))}
        </select>

        {activeTab === 'prompts' && (
          <>
            <select
              name="admissionId"
              value={filters.admissionId}
              onChange={handleChange}
              className={selectClassName}
              disabled={filteredAdmissions.length === 0}
            >
              <option value="">
                {filters.universityId && filteredAdmissions.length === 0 
                  ? 'No admissions for this university' 
                  : 'All Admissions'}
              </option>
              {filteredAdmissions.map(admission => (
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
              disabled={filteredPrograms.length === 0}
            >
              <option value="">
                {filters.universityId && filteredPrograms.length === 0 
                  ? 'No programs for this university' 
                  : 'All Programs'}
              </option>
              {filteredPrograms.map(program => (
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
              disabled={filteredIntakes.length === 0}
            >
              <option value="">
                {filters.admissionId && filteredIntakes.length === 0 
                  ? 'No intakes for this admission' 
                  : 'All Intakes'}
              </option>
              {filteredIntakes.map(intake => (
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
              name="programId"
              value={filters.programId}
              onChange={handleChange}
              className={selectClassName}
              disabled={filteredPrograms.length === 0}
            >
              <option value="">
                {filters.universityId && filteredPrograms.length === 0 
                  ? 'No programs for this university' 
                  : 'All Programs'}
              </option>
              {filteredPrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                  {program.degreeType ? ` (${program.degreeType})` : ''}
                </option>
              ))}
            </select>

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
      
      {/* ✅ Show active filters count */}
      {(filters.universityId || filters.programId || filters.admissionId || filters.status || filters.reviewStatus) && (
        <div className="mt-3 text-xs text-gray-500">
          Active filters: {[
            filters.universityId && 'University',
            filters.programId && 'Program',
            filters.admissionId && 'Admission',
            filters.intakeId && 'Intake',
            filters.status && 'Status',
            filters.reviewStatus && 'Review Status',
            filters.isMandatory && 'Mandatory',
            filters.isActive && 'Active'
          ].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
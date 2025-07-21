// app/program-management/components/ProgramForm.tsx
import React from 'react';
import { GraduationCap, X } from 'lucide-react';
import type { 
  ProgramWithFullRelations, 
  CreateProgramInput, 
  UpdateProgramInput, 
  DepartmentWithPrograms
} from '../types/programs';

interface ProgramFormProps {
  program?: ProgramWithFullRelations;
  universities: { id: string; name: string; slug: string }[];
  departments: DepartmentWithPrograms[];
  onSubmit: (data: CreateProgramInput | UpdateProgramInput) => void;
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
  const isEditing = !!program;
  
  // Filter departments based on selected university
  const [selectedUniversity, setSelectedUniversity] = React.useState(
    program?.universityId || ''
  );
  
  const filteredDepartments = departments.filter(
    dept => dept.universityId === selectedUniversity
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: CreateProgramInput = {
      universityId: formData.get('universityId') as string,
      departmentId: formData.get('departmentId') as string,
      programName: formData.get('programName') as string,
      programSlug: formData.get('programSlug') as string,
      degreeType: formData.get('degreeType') as string || undefined,
      programLength: parseInt(formData.get('programLength') as string) || undefined,
      specializations: formData.get('specializations') as string || undefined,
      programDescription: formData.get('programDescription') as string || undefined,
      curriculumOverview: formData.get('curriculumOverview') as string || undefined,
      admissionRequirements: formData.get('admissionRequirements') as string || undefined,
      averageEntranceScore: parseInt(formData.get('averageEntranceScore') as string) || undefined,
      programTuitionFees: parseInt(formData.get('programTuitionFees') as string) || undefined,
      programAdditionalFees: parseInt(formData.get('programAdditionalFees') as string) || undefined,
      programMetaTitle: formData.get('programMetaTitle') as string || undefined,
      programMetaDescription: formData.get('programMetaDescription') as string || undefined,
      isActive: formData.get('isActive') === 'on'
    };
    onSubmit(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
          {isEditing ? 'Edit Program' : 'Create New Program'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* University and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-1">
                University
              </label>
              <select
                id="universityId"
                name="universityId"
                defaultValue={program?.universityId || ''}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                defaultValue={program?.departmentId || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
               
              >
                <option value="">Select Department</option>
                {filteredDepartments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Program Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                Program Name
              </label>
              <input
                type="text"
                id="programName"
                name="programName"
                defaultValue={program?.programName || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Computer Science and Engineering"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="programSlug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  university.edu/
                </span>
                <input
                  type="text"
                  id="programSlug"
                  name="programSlug"
                  defaultValue={program?.programSlug || ''}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="computer-science-engineering"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          {/* Degree and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="degreeType" className="block text-sm font-medium text-gray-700 mb-1">
                Degree Type
              </label>
              <select
                id="degreeType"
                name="degreeType"
                defaultValue={program?.degreeType || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">Select Degree Type</option>
                <option value="Bachelor">Bachelors</option>
                <option value="Master">Masters</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="programLength" className="block text-sm font-medium text-gray-700 mb-1">
                Program Duration (years)
              </label>
              <input
                type="number"
                id="programLength"
                name="programLength"
                min="1"
                max="10"
                defaultValue={program?.programLength || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 4"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Specializations and Description */}
          <div>
            <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-1">
              Specializations
            </label>
            <input
              type="text"
              id="specializations"
              name="specializations"
              defaultValue={program?.specializations || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma separated list of specializations"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="programDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Program Description
            </label>
            <textarea
              id="programDescription"
              name="programDescription"
              defaultValue={program?.programDescription || ''}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the program..."
              disabled={loading}
            />
          </div>
          
          {/* Curriculum and Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="curriculumOverview" className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Overview
              </label>
              <textarea
                id="curriculumOverview"
                name="curriculumOverview"
                defaultValue={program?.curriculumOverview || ''}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Overview of curriculum structure..."
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="admissionRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                Admission Requirements
              </label>
              <textarea
                id="admissionRequirements"
                name="admissionRequirements"
                defaultValue={program?.admissionRequirements || ''}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="List of admission requirements..."
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Fees and Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="averageEntranceScore" className="block text-sm font-medium text-gray-700 mb-1">
                Average Entrance Score
              </label>
              <input
                type="number"
                id="averageEntranceScore"
                name="averageEntranceScore"
                min="0"
                max="100"
                step="0.1"
                defaultValue={program?.averageEntranceScore || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 85.5"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="programTuitionFees" className="block text-sm font-medium text-gray-700 mb-1">
                Tuition Fees ($)
              </label>
              <input
                type="number"
                id="programTuitionFees"
                name="programTuitionFees"
                min="0"
                defaultValue={program?.programTuitionFees || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10000"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="programAdditionalFees" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Fees ($)
              </label>
              <input
                type="number"
                id="programAdditionalFees"
                name="programAdditionalFees"
                min="0"
                defaultValue={program?.programAdditionalFees || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 500"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* SEO Metadata */}
          <div>
            <label htmlFor="programMetaTitle" className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              id="programMetaTitle"
              name="programMetaTitle"
              defaultValue={program?.programMetaTitle || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Meta title for SEO"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="programMetaDescription" className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              id="programMetaDescription"
              name="programMetaDescription"
              defaultValue={program?.programMetaDescription || ''}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Meta description for SEO"
              disabled={loading}
            />
          </div>
          
          {/* Status */}
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={program?.isActive ?? true}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active Program
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEditing ? 'Update Program' : 'Create Program'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;
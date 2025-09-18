/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GraduationCap, X, Check } from 'lucide-react';

// Types
interface Department {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  _count?: {
    programs: number;
  };
}

interface University {
  id: string;
  name: string;
  slug: string;
}

interface Syllabus {
  id: string;
  fileUrl: string;
  uploadedAt: string | Date;
}

interface ProgramWithRelations {
  id: string;
  universityId: string;
  programName: string;
  programSlug: string;
  degreeType: string | null;
  programLength: number | null;
  specializations: string | null;
  programDescription: string | null;
  curriculumOverview: string | null;
  admissionRequirements: string | null;
  averageEntranceScore: number | null;
  programTuitionFees: number | null;
  programAdditionalFees: number | null;
  programMetaTitle: string | null;
  programMetaDescription: string | null;
  isActive: boolean;
  departments?: Array<{
    department: Department;
  }>;
  syllabus?: Syllabus | null;
}

interface CreateProgramInput {
  universityId: string;
  departmentIds: string[];
  programName: string;
  programSlug: string;
  degreeType?: string;
  programLength?: number;
  specializations?: string;
  programDescription?: string;
  curriculumOverview?: string;
  admissionRequirements?: string;
  averageEntranceScore?: number;
  programTuitionFees?: number;
  programAdditionalFees?: number;
  programMetaTitle?: string;
  programMetaDescription?: string;
  isActive?: boolean;
}

interface UpdateProgramInput extends CreateProgramInput {
  id: string;
}

interface SyllabusUploadProps {
  programId: string;
  existingSyllabus?: { id: string; fileUrl: string; uploadedAt: string } | null;
  onUploadSuccess: (syllabus: any) => void;
  onDeleteSuccess: () => void;
}

const SyllabusUpload: React.FC<SyllabusUploadProps> = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programId, 
  existingSyllabus, 
  onUploadSuccess, 
  onDeleteSuccess 
}) => (
  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
    <p className="text-sm text-gray-600">Syllabus Upload Component</p>
    {existingSyllabus && (
      <p className="text-xs text-green-600 mt-2">
        Current syllabus: {existingSyllabus.fileUrl}
      </p>
    )}
  </div>
);

interface ProgramFormProps {
  program?: ProgramWithRelations | null;
  universities?: University[];
  departments?: Department[];
  onSubmit: (data: CreateProgramInput | UpdateProgramInput) => void;
  onClose: () => void;
  loading?: boolean;
}

const ProgramForm: React.FC<ProgramFormProps> = ({
  program,
  universities = [],
  departments = [],
  onSubmit,
  onClose,
  loading = false
}) => {
  const isEditing = !!program;
  
  // Filter departments based on selected university
  const [selectedUniversity, setSelectedUniversity] = React.useState<string>(
    program?.universityId || ''
  );

  // State for selected departments (array instead of single value)
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>(
    program?.departments?.map(d => d.department.id) || []
  );

  // State for syllabus to trigger re-render with proper initial state
  const [currentSyllabus, setCurrentSyllabus] = React.useState<{
    id: string;
    fileUrl: string;
    uploadedAt: string;
  } | null>(
    program?.syllabus ? {
      id: program.syllabus.id || '',
      fileUrl: program.syllabus.fileUrl || '',
      uploadedAt: program.syllabus.uploadedAt instanceof Date 
        ? program.syllabus.uploadedAt.toISOString()
        : program.syllabus.uploadedAt || new Date().toISOString()
    } : null
  );

  // Update syllabus state when program prop changes
  React.useEffect(() => {
    if (program?.syllabus) {
      setCurrentSyllabus({
        id: program.syllabus.id || '',
        fileUrl: program.syllabus.fileUrl || '',
        uploadedAt: program.syllabus.uploadedAt instanceof Date 
          ? program.syllabus.uploadedAt.toISOString()
          : program.syllabus.uploadedAt || new Date().toISOString()
      });
    } else {
      setCurrentSyllabus(null);
    }
  }, [program?.syllabus]);

  // Update selected departments when program prop changes
  React.useEffect(() => {
    if (program?.departments) {
      setSelectedDepartments(program.departments.map(d => d.department.id));
    } else {
      setSelectedDepartments([]);
    }
  }, [program?.departments]);
  
  const filteredDepartments = departments.filter(
    dept => dept.universityId === selectedUniversity
  );

  // Handle department selection/deselection
  const toggleDepartment = (departmentId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const baseData = {
      universityId: formData.get('universityId') as string,
      departmentIds: selectedDepartments,
      programName: formData.get('programName') as string,
      programSlug: formData.get('programSlug') as string,
      degreeType: (formData.get('degreeType') as string) || undefined,
      programLength: parseInt(formData.get('programLength') as string) || undefined,
      specializations: (formData.get('specializations') as string) || undefined,
      programDescription: (formData.get('programDescription') as string) || undefined,
      curriculumOverview: (formData.get('curriculumOverview') as string) || undefined,
      admissionRequirements: (formData.get('admissionRequirements') as string) || undefined,
      averageEntranceScore: parseInt(formData.get('averageEntranceScore') as string) || undefined,
      programTuitionFees: parseInt(formData.get('programTuitionFees') as string) || undefined,
      programAdditionalFees: parseInt(formData.get('programAdditionalFees') as string) || undefined,
      programMetaTitle: (formData.get('programMetaTitle') as string) || undefined,
      programMetaDescription: (formData.get('programMetaDescription') as string) || undefined,
      isActive: formData.get('isActive') === 'on'
    };

    if (isEditing && program?.id) {
      const updateData: UpdateProgramInput = {
        id: program.id,
        ...baseData
      };
      onSubmit(updateData);
    } else {
      onSubmit(baseData as CreateProgramInput);
    }
  };

  const handleSyllabusUploadSuccess = (syllabus: any) => {
    console.log('Syllabus upload success:', syllabus);
    setCurrentSyllabus({
      id: syllabus.id,
      fileUrl: syllabus.fileUrl,
      uploadedAt: syllabus.uploadedAt || new Date().toISOString()
    });
  };

  const handleSyllabusDeleteSuccess = () => {
    console.log('Syllabus deleted successfully');
    setCurrentSyllabus(null);
  };

  return (
    <div className="p-6 max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
          {isEditing ? 'Edit Program' : 'Create New Program'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-6">
          {/* University Selection */}
          <div>
            <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-1">
              University <span className="text-red-500">*</span>
            </label>
            <select
              id="universityId"
              name="universityId"
              defaultValue={program?.universityId || ''}
              onChange={(e) => {
                setSelectedUniversity(e.target.value);
                setSelectedDepartments([]);
              }}
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
          
          {/* Multiple Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departments <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-300 rounded-md bg-white">
              {!selectedUniversity ? (
                <div className="p-3 text-sm text-gray-500">
                  Please select a university first
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No departments available for selected university
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                        selectedDepartments.includes(department.id) 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                      onClick={() => !loading && toggleDepartment(department.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 mr-3 rounded border-2 flex items-center justify-center ${
                          selectedDepartments.includes(department.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedDepartments.includes(department.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          selectedDepartments.includes(department.id) 
                            ? 'font-medium text-blue-900' 
                            : 'text-gray-900'
                        }`}>
                          {department.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {department._count?.programs || 0} programs
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedDepartments.length === 0 && selectedUniversity && (
              <p className="mt-1 text-xs text-red-500">Please select at least one department</p>
            )}
            {selectedDepartments.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {selectedDepartments.length} department{selectedDepartments.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          
          {/* Program Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                Program Name <span className="text-red-500">*</span>
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
                URL Slug <span className="text-red-500">*</span>
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
          
          {/* Degree Type and Program Length */}
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

          {/* Program Description */}
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
          
          {/* Syllabus Upload Section - Only show if program exists (for editing) */}
          {isEditing && program?.id && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <SyllabusUpload
                key={`syllabus-${currentSyllabus?.fileUrl || 'none'}`}
                programId={program.id}
                existingSyllabus={currentSyllabus}
                onUploadSuccess={handleSyllabusUploadSuccess}
                onDeleteSuccess={handleSyllabusDeleteSuccess}
              />
            </div>
          )}

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
            <span className="ml-2 text-xs text-gray-500">
              (Inactive programs won&apos;t be displayed to students)
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white pt-4 border-t">
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
              disabled={loading || selectedDepartments.length === 0}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 min-w-[120px]"
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
        </div>
      </form>
      
      {/* Note for new programs */}
      {!isEditing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After creating the program, you&apos;ll be able to upload the syllabus and add additional details like rankings and external links.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramForm;
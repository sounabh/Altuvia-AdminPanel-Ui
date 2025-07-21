// app/program-management/components/DepartmentForm.tsx
import React from 'react';
import { Building, X } from 'lucide-react';
import type { 
  DepartmentWithPrograms, 
  CreateDepartmentInput, 
  UpdateDepartmentInput 
} from '../types/programs';

interface DepartmentFormProps {
  department?: DepartmentWithPrograms;
  universities: { id: string; name: string; slug: string }[];
  onSubmit: (data: CreateDepartmentInput | UpdateDepartmentInput) => void;
  onClose: () => void;
  loading: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  universities,
  onSubmit,
  onClose,
  loading
}) => {
  const isEditing = !!department;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      universityId: formData.get('universityId') as string,
      name: formData.get('name') as string,
      slug: formData.get('slug') as string
    };
    onSubmit(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Building className="h-5 w-5 text-blue-600 mr-2" />
          {isEditing ? 'Edit Department' : 'Create New Department'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <select
              id="universityId"
              name="universityId"
              defaultValue={department?.universityId || ''}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={department?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Computer Science"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                university.edu/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={department?.slug || ''}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="computer-science"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              This will be used in the department URL
            </p>
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
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEditing ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
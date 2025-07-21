// app/program-management/components/DepartmentList.tsx
import React from 'react';
import { Building, Edit, Trash2, Eye } from 'lucide-react';
import type { DepartmentWithPrograms } from '../types/programs';

interface DepartmentListProps {
  departments: DepartmentWithPrograms[];
  onEdit: (department: DepartmentWithPrograms) => void;
  onDelete: (id: string) => void;
  onViewDetail: (department: DepartmentWithPrograms) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ 
  departments, 
  onEdit, 
  onDelete, 
  onViewDetail 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-12 px-6 py-3 text-sm font-medium text-gray-500">
          <div className="col-span-5">Department</div>
          <div className="col-span-3">University</div>
          <div className="col-span-2 text-center">Programs</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {departments.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <Building className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-sm font-medium">No departments found</h3>
            <p className="mt-1 text-sm">Create a new department to get started</p>
          </div>
        ) : (
          departments.map((department) => (
            <div key={department.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50">
              <div className="col-span-5">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{department.name}</div>
                    <div className="text-sm text-gray-500">{department.slug}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 text-sm text-gray-900">
                {department?.university?.universityName || 'N/A'}
              </div>
              
              <div className="col-span-2 text-center text-sm font-medium">
                {department._count?.programs || 0}
              </div>
              
              <div className="col-span-2 flex justify-end space-x-2">
                <button
                  onClick={() => onViewDetail(department)}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(department)}
                  className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(department.id)}
                  className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
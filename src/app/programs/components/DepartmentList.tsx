import React from 'react';
import { Edit, Eye, Trash2, Building, GraduationCap, Calendar } from 'lucide-react';

interface Department {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  programs: Array<{
    id: string;
    programName: string;
    degreeType: string;
    isActive: boolean;
  }>;
  _count: {
    programs: number;
  };
}

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onViewDetail: (department: Department) => void;
  onDelete?: (id: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  onEdit,
  onViewDetail,
  onDelete
}) => {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated programs.`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Departments</h3>
        <p className="text-sm text-gray-500">Manage university departments and their programs</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {departments.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
          </div>
        ) : (
          departments.map((department) => (
            <div key={department.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <h4 className="text-lg font-medium text-gray-900">{department.name}</h4>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {department._count.programs} programs
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(department.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      /{department.slug}
                    </span>
                  </div>
                  
                  {department.programs.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Recent Programs:</p>
                      <div className="flex flex-wrap gap-2">
                        {department.programs.slice(0, 3).map((program) => (
                          <span
                            key={program.id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              program.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {program.programName}
                          </span>
                        ))}
                        {department.programs.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{department.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetail(department)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button
                    onClick={() => onEdit(department)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Department"
                  >
                    <Edit size={16} />
                  </button>
                  
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(department.id, department.name)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
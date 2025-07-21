// app/program-management/components/ProgramList.tsx
import React from 'react';
import { GraduationCap, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import type { ProgramSearchResult } from '../types/programs';

interface ProgramListProps {
  programs: ProgramSearchResult[];
  onEdit: (program: ProgramSearchResult) => void;
  onDelete: (id: string) => void;
  onViewDetail: (program: ProgramSearchResult) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ 
  programs, 
  onEdit, 
  onDelete, 
  onViewDetail 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-12 px-6 py-3 text-sm font-medium text-gray-500">
          <div className="col-span-6">Program</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {programs.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <GraduationCap className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-sm font-medium">No programs found</h3>
            <p className="mt-1 text-sm">Create a new program to get started</p>
          </div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50">
              <div className="col-span-6">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{program.programName}</div>
                    <div className="text-sm text-gray-500">
                      {program.degreeType} · {program.university.universityName}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 text-sm text-gray-900">
                {program.department?.name || 'N/A'}
              </div>
              
              <div className="col-span-2 flex justify-center">
                {program.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="h-3 w-3 mr-1" /> Inactive
                  </span>
                )}
              </div>
              
              <div className="col-span-1 flex justify-end space-x-2">
                <button
                  onClick={() => onViewDetail(program)}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(program)}
                  className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(program.id)}
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

export default ProgramList;
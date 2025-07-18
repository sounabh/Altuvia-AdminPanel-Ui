import React from 'react';
import { Edit, Eye, Trash2, GraduationCap, Building, Award, Clock, DollarSign, Users } from 'lucide-react';

interface Program {
  id: string;
  universityId: string;
  departmentId: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department: {
    name: string;
  };
  university: {
    name: string;
  };
  rankings?: Array<{
    year: number;
    rank: number;
    source?: string;
  }>;
  externalLinks?: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
  };
}

interface ProgramListProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onViewDetail: (program: Program) => void;
  onDelete?: (id: string) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  onEdit,
  onViewDetail,
  onDelete
}) => {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      onDelete?.(id);
    }
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : 'N/A';
  };

  const getLatestRanking = (rankings?: Array<{year: number; rank: number; source?: string}>) => {
    if (!rankings || rankings.length === 0) return null;
    return rankings.reduce((latest, current) => 
      current.year > latest.year ? current : latest
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Programs</h3>
        <p className="text-sm text-gray-500">Manage academic programs and their details</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {programs.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No programs</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new program.</p>
          </div>
        ) : (
          programs.map((program) => {
            const latestRanking = getLatestRanking(program.rankings);
            
            return (
              <div key={program.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-gray-500" />
                      <h4 className="text-lg font-medium text-gray-900">{program.programName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        program.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {program.department.name}
                      </span>
                      {program.degreeType && (
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {program.degreeType}
                        </span>
                      )}
                      {program.programLength && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {program.programLength} years
                        </span>
                      )}
                    </div>
                    
                    {program.programDescription && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {program.programDescription}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        /{program.programSlug}
                      </span>
                      
                      {latestRanking && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Ranked #{latestRanking.rank} ({latestRanking.year})
                        </span>
                      )}
                      
                      {program.specializations && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {program.specializations.split(',').length} specializations
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">Tuition: {formatCurrency(program.programTuitionFees)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">Students: {program._count.admissions}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-600">Scholarships: {program._count.scholarships}</span>
                      </div>
                      
                      {program.averageEntranceScore && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Avg Score: {program.averageEntranceScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail(program)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEdit(program)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Program"
                    >
                      <Edit size={16} />
                    </button>
                    
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(program.id, program.programName)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProgramList;
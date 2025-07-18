import React from 'react';
import {
  X,
  Edit,
  GraduationCap,
  Clock,
  DollarSign,
  FileText,
  Award,
  ExternalLink,
  Users,
  Building,
  TrendingUp
} from 'lucide-react';

// ✅ Interfaces
interface University {
  name: string;
}

interface Department {
  name: string;
}

interface Ranking {
  rank: number;
  year: number;
  source?: string;
}

interface ExternalLink {
  title: string;
  url: string;
}

interface Syllabus {
  fileUrl: string;
}

interface ProgramCount {
  admissions: number;
  scholarships: number;
  tuitionBreakdowns: number;
}

interface Program {
  programName: string;
  university?: University;
  department?: Department;
  isActive: boolean;
  degreeType?: string;
  programLength?: number;
  averageEntranceScore?: number;
  programTuitionFees?: number;
  programAdditionalFees?: number;
  specializations?: string;
  programDescription?: string;
  curriculumOverview?: string;
  admissionRequirements?: string;
  rankings?: Ranking[];
  externalLinks?: ExternalLink[];
  syllabus?: Syllabus;
  _count?: ProgramCount;
}

interface ProgramDetailProps {
  program?: Program | null;
  onEdit: (program: Program) => void;
  onClose: () => void;
}

// ✅ Component
const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onEdit, onClose }) => {
  if (!program) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Program Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(program)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">{program.programName}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building size={14} />
            <span>{program.university?.name}</span>
            <span>•</span>
            <span>{program.department?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                program.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {program.isActive ? 'Active' : 'Inactive'}
            </span>
            {program.degreeType && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {program.degreeType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            {program.programLength && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">{program.programLength} years</span>
              </div>
            )}
            {program.averageEntranceScore && (
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  Avg. Score: {program.averageEntranceScore}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Info */}
        {(program.programTuitionFees || program.programAdditionalFees) && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h4>
            <div className="space-y-2">
              {program.programTuitionFees && (
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Tuition: {formatCurrency(program.programTuitionFees)}
                  </span>
                </div>
              )}
              {program.programAdditionalFees && (
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Additional Fees: {formatCurrency(program.programAdditionalFees)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specializations */}
        {program.specializations && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {program.specializations.split(',').map((spec, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {spec.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {program.programDescription && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {program.programDescription}
            </p>
          </div>
        )}

        {/* Curriculum */}
        {program.curriculumOverview && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Curriculum Overview</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{program.curriculumOverview}</p>
          </div>
        )}

        {/* Admission */}
        {program.admissionRequirements && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Admission Requirements</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{program.admissionRequirements}</p>
          </div>
        )}

        {/* Rankings */}
        {program.rankings && program.rankings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rankings</h4>
            <div className="space-y-2">
              {program.rankings.slice(0, 3).map((ranking, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award size={14} className="text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    Rank #{ranking.rank} ({ranking.year})
                    {ranking.source && ` - ${ranking.source}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        {program.externalLinks && program.externalLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">External Links</h4>
            <div className="space-y-2">
              {program.externalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={14} />
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {program._count && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Statistics</h4>
            <div className="grid grid-cols-1 gap-3">
              {program._count.admissions > 0 && (
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatNumber(program._count.admissions)} admissions
                  </span>
                </div>
              )}
              {program._count.scholarships > 0 && (
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatNumber(program._count.scholarships)} scholarships
                  </span>
                </div>
              )}
              {program._count.tuitionBreakdowns > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatNumber(program._count.tuitionBreakdowns)} fee structures
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Syllabus */}
        {program.syllabus && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Syllabus</h4>
            <a
              href={program.syllabus.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <FileText size={14} />
              View Syllabus PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetail;

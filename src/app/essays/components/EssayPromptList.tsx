// EssayPromptList.tsx
import React from 'react';
import { Edit, Eye, Users, CheckCircle, XCircle, Calendar, FileText, AlertCircle } from 'lucide-react';

interface Admission {
  university?: {
    universityName: string;
  };
  program?: {
    programName: string;
  };
}

interface Program {
  programName: string;
  university?: {
    universityName: string;
  };
}

interface Intake {
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

interface Count {
  submissions?: number;
}

export interface EssayPrompt {
  id: string;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount: number;
  isMandatory: boolean;
  isActive: boolean;
  createdAt: string | Date;
  _count?: Count;
  admission?: Admission | null;
  program?: Program | null;
  intake?: Intake | null;
}

interface EssayPromptListProps {
  prompts: EssayPrompt[];
  onEdit: (prompt: EssayPrompt) => void;
  onViewDetail: (prompt: EssayPrompt) => void;
}

const EssayPromptList: React.FC<EssayPromptListProps> = ({ 
  prompts, 
  onEdit, 
  onViewDetail 
}) => {
  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No essay prompts found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Create your first essay prompt to get started with collecting student essays.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Essay Prompts</h3>
            <p className="text-sm text-gray-500 mt-1">
              {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {prompts.map((prompt) => (
          <div 
            key={prompt.id} 
            className="p-6 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex gap-4">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {prompt.promptTitle}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Mandatory Badge */}
                      {prompt.isMandatory ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle size={12} />
                          Mandatory
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Optional
                        </span>
                      )}
                      
                      {/* Active Status */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        prompt.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {prompt.isActive ? (
                          <>
                            <CheckCircle size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prompt Text Preview */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {prompt.promptText}
                </p>

                {/* Stats Row */}
                <div className="flex items-center flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users size={14} />
                    <span className="font-medium">{prompt._count?.submissions || 0}</span>
                    <span>submissions</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FileText size={14} />
                    <span>{prompt.minWordCount} - {prompt.wordLimit} words</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar size={14} />
                    <span>{formatDate(prompt.createdAt)}</span>
                  </div>
                </div>

                {/* Relations Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {prompt.admission?.university && prompt.admission?.program && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      📚 {prompt.admission.university.universityName} - {prompt.admission.program.programName}
                    </span>
                  )}
                  {prompt.program && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      🎓 {prompt.program.programName}
                      {prompt.program.university && ` - ${prompt.program.university.universityName}`}
                    </span>
                  )}
                  {prompt.intake && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      📅 {prompt.intake.intakeName} ({prompt.intake.intakeType} {prompt.intake.intakeYear})
                    </span>
                  )}
                  {!prompt.admission && !prompt.program && !prompt.intake && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      🌐 General Prompt
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onViewDetail(prompt)}
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                  title="View details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(prompt)}
                  className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                  title="Edit prompt"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssayPromptList;
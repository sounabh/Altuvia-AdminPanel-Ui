// EssayPromptDetail.tsx - WITH DELETE FUNCTIONALITY
import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building2,
  GraduationCap,
  CalendarDays,
  Trash2
} from 'lucide-react';

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
  updatedAt?: string | Date;
  _count?: Count;
  admission?: Admission | null;
  program?: Program | null;
  intake?: Intake | null;
}

interface EssayPromptDetailProps {
  prompt: EssayPrompt;
  onClose: () => void;
  onEdit: (prompt: EssayPrompt) => void;
  onDelete?: (promptId: string) => Promise<void>;
}

const EssayPromptDetail: React.FC<EssayPromptDetailProps> = ({ 
  prompt, 
  onClose,
  onEdit,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(prompt.id);
      onClose();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">
                {prompt.promptTitle}
              </h2>
              {prompt.isMandatory ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  <AlertCircle size={12} />
                  Mandatory
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Optional
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                prompt.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
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
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-blue-600" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Submissions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{prompt._count?.submissions || 0}</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-purple-600" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Min Words</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{prompt.minWordCount}</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-green-600" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Max Words</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{prompt.wordLimit}</p>
          </div>
        </div>

        {/* Prompt Text */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} />
            Prompt Text
          </h3>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{prompt.promptText}</p>
          </div>
        </div>

        {/* Relations */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Associations</h3>
          <div className="space-y-3">
            {prompt.admission?.university && prompt.admission?.program && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Admission</p>
                  <p className="font-medium text-gray-900">
                    {prompt.admission.university.universityName} - {prompt.admission.program.programName}
                  </p>
                </div>
              </div>
            )}
            
            {prompt.program && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Program</p>
                  <p className="font-medium text-gray-900">
                    {prompt.program.programName}
                    {prompt.program.university && ` - ${prompt.program.university.universityName}`}
                  </p>
                </div>
              </div>
            )}
            
            {prompt.intake && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarDays size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Intake</p>
                  <p className="font-medium text-gray-900">
                    {prompt.intake.intakeName} ({prompt.intake.intakeType} {prompt.intake.intakeYear})
                  </p>
                </div>
              </div>
            )}
            
            {!prompt.admission && !prompt.program && !prompt.intake && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                  <p className="font-medium text-gray-900">General Prompt (No specific association)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Created: {formatDate(prompt.createdAt)}</span>
          </div>
          {prompt.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Updated: {formatDate(prompt.updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => onEdit(prompt)}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Edit Prompt
          </button>
          
          {onDelete && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Prompt
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-red-900 mb-1">Are you sure?</p>
                      <p className="text-sm text-red-700">
                        This will permanently delete this prompt and all {prompt._count?.submissions || 0} associated submissions. 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Yes, Delete
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EssayPromptDetail;
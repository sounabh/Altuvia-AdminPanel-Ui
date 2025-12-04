// EssaySubmissionList.tsx
import React from 'react';
import { 
  Eye, 
  Star, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Building2,
  GraduationCap,
  Sparkles,
  GitBranch,
  AlertCircle
} from 'lucide-react';

export type SubmissionStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'ACCEPTED' 
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type ReviewStatus = 'PENDING' | 'REVIEWED';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface University {
  universityName: string;
}

export interface Program {
  programName: string;
}

export interface Admission {
  university: University;
  program: Program;
}

export interface EssayPrompt {
  promptTitle: string;
  wordLimit: number;
  admission: Admission | null;
}

export interface EssaySubmission {
  id: string;
  title?: string;
  essayPrompt: EssayPrompt;
  status: SubmissionStatus;
  user?: User;
  application?: Application;
  submissionDate?: string;
  lastEditedAt: string;
  content: string;
  wordCount: number;
  internalRating?: number;
  reviewStatus?: ReviewStatus;
  reviewerComment?: string;
  _count?: {
    versions: number;
    aiResults: number;
    completionLogs: number;
  };
  completionPercentage?: number;
  priority?: string;
  isCompleted?: boolean;
  completedAt?: string | null;
  lastModified?: string;
  program?: {
    id: string;
    programName: string;
    degreeType: string | null;
    university: {
      universityName: string;
      city: string;
      country: string;
    };
  };
}

interface EssaySubmissionListProps {
  submissions: EssaySubmission[];
  onViewDetail: (submission: EssaySubmission) => void;
}

const EssaySubmissionList = ({ 
  submissions, 
  onViewDetail 
}: EssaySubmissionListProps) => {
  
  const getStatusConfig = (status: SubmissionStatus) => {
    const configs = {
      DRAFT: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
      SUBMITTED: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
      UNDER_REVIEW: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
      ACCEPTED: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      REJECTED: { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
      IN_PROGRESS: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
      COMPLETED: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
    };
    return configs[status] || configs.DRAFT;
  };

  const getWordCountStatus = (wordCount: number, wordLimit: number = 500) => {
    const percentage = (wordCount / wordLimit) * 100;
    if (percentage < 50) return { color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage < 80) return { color: 'text-amber-600', bg: 'bg-amber-50' };
    if (percentage <= 100) return { color: 'text-green-600', bg: 'bg-green-50' };
    return { color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getPriorityConfig = (priority?: string) => {
    if (!priority) return null;
    const configs: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return configs[priority.toLowerCase()] || null;
  };

  const getStudentName = (submission: EssaySubmission): string => {
    if (submission.user) return submission.user.name;
    if (submission.application) {
      return `${submission.application.firstName} ${submission.application.lastName}`;
    }
    return 'Unknown Student';
  };

  const getStudentEmail = (submission: EssaySubmission): string => {
    if (submission.user) return submission.user.email;
    if (submission.application) return submission.application.email;
    return 'N/A';
  };

  const getUniversityName = (submission: EssaySubmission): string => {
    if (submission.program?.university?.universityName) {
      return submission.program.university.universityName;
    }
    return submission.essayPrompt.admission?.university.universityName || 'N/A';
  };

  const getProgramName = (submission: EssaySubmission): string => {
    if (submission.program?.programName) {
      return submission.program.programName;
    }
    return submission.essayPrompt.admission?.program.programName || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Essays will appear here once students start submitting their work.
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
            <h3 className="text-lg font-semibold text-gray-900">Essay Submissions</h3>
            <p className="text-sm text-gray-500 mt-1">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {submissions.map((submission) => {
          const statusConfig = getStatusConfig(submission.status);
          const StatusIcon = statusConfig.icon;
          const wordCountStatus = getWordCountStatus(submission.wordCount, submission.essayPrompt.wordLimit);
          const priorityConfig = getPriorityConfig(submission.priority);

          return (
            <div 
              key={submission.id} 
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex gap-4">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">
                        {submission.title || submission.essayPrompt.promptTitle}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Prompt: {submission.essayPrompt.promptTitle}
                      </p>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {submission.status.replace('_', ' ')}
                      </span>
                      {priorityConfig && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityConfig}`}>
                          {submission.priority?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{getStudentName(submission)}</p>
                        <p className="text-xs text-gray-500 truncate">{getStudentEmail(submission)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{getUniversityName(submission)}</p>
                        <p className="text-xs text-gray-500">University</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={14} className="text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{getProgramName(submission)}</p>
                        <p className="text-xs text-gray-500">Program</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {submission.content}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center flex-wrap gap-4 text-sm">
                    {/* Word Count */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${wordCountStatus.bg}`}>
                      <FileText size={14} className={wordCountStatus.color} />
                      <span className={`font-medium ${wordCountStatus.color}`}>
                        {submission.wordCount}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">{submission.essayPrompt.wordLimit}</span>
                    </div>

                    {/* Versions */}
                    {submission._count && submission._count.versions > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <GitBranch size={14} />
                        <span>{submission._count.versions} versions</span>
                      </div>
                    )}

                    {/* AI Analysis */}
                    {submission._count && submission._count.aiResults > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Sparkles size={14} />
                        <span>{submission._count.aiResults} AI analyses</span>
                      </div>
                    )}

                    {/* Rating */}
                    {submission.internalRating && (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-medium">{submission.internalRating.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar size={14} />
                      <span>
                        {submission.submissionDate 
                          ? formatDate(submission.submissionDate)
                          : `Edited ${formatDate(submission.lastEditedAt || submission.lastModified || '')}`
                        }
                      </span>
                    </div>

                    {/* Review Status */}
                    {submission.reviewStatus && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        submission.reviewStatus === 'REVIEWED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {submission.reviewStatus === 'REVIEWED' ? (
                          <CheckCircle size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        {submission.reviewStatus}
                      </span>
                    )}
                  </div>

                  {/* Reviewer Comment */}
                  {submission.reviewerComment && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">{submission.reviewerComment}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => onViewDetail(submission)}
                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EssaySubmissionList;
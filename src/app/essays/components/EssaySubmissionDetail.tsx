// EssaySubmissionDetail.tsx
import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Star, 
  User, 
  MessageSquare, 
  Calendar, 
  Building2, 
  GraduationCap,
  Sparkles,
  GitBranch,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Brain,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface University {
  universityName: string;
  city?: string;
  country?: string;
}

interface Program {
  programName: string;
  degreeType?: string | null;
  university?: University;
}

interface Admission {
  university: University;
  program: Program;
}

interface EssayPrompt {
  id: string;
  promptTitle: string;
  promptText?: string;
  wordLimit: number;
  admission?: Admission | null;
}

interface EssayVersion {
  id: string;
  content: string;
  wordCount: number;
  label: string;
  timestamp: string | Date;
  isAutoSave: boolean;
  changesSinceLastVersion: string | null;
}

interface AIResult {
  id: string;
  analysisType: string;
  overallScore: number | null;
  suggestions: string;
  strengths: string | null;
  improvements: string | null;
  warnings: string | null;
  aiProvider: string;
  modelUsed: string | null;
  readabilityScore: number | null;
  grammarIssues: number | null;
  structureScore: number | null;
  createdAt: string | Date;
}

interface CompletionLog {
  id: string;
  completedAt: string | Date;
  wordCountAtCompletion: number;
  wordLimit: number;
  completionMethod: string;
  previousStatus: string | null;
  essayPromptTitle: string | null;
}

interface EssaySubmission {
  id: string;
  essayPromptId: string;
  userId: string | null;
  applicationId: string | null;
  title: string | null;
  content: string;
  wordCount: number;
  isUsingTemplate: boolean;
  templateVersion: string | null;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  reviewStatus: "PENDING" | "REVIEWED";
  reviewerId: string | null;
  reviewerComment: string | null;
  internalRating: number | null;
  submissionDate: Date | string | null;
  lastEditedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  essayPrompt: EssayPrompt;
  user: User | null;
  application: Application | null;
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
  _count?: {
    versions: number;
    aiResults: number;
    completionLogs: number;
  };
  completionPercentage?: number;
  priority?: string;
  isCompleted?: boolean;
  completedAt?: string | Date | null;
  lastModified?: string | Date;
  versions?: EssayVersion[];
  aiResults?: AIResult[];
  completionLogs?: CompletionLog[];
  latestAIAnalysis?: AIResult | null;
}

interface EssaySubmissionDetailProps {
  submission: EssaySubmission;
  onClose: () => void;
}

const EssaySubmissionDetail: React.FC<EssaySubmissionDetailProps> = ({ submission, onClose }) => {
  const [showVersions, setShowVersions] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(true);
  const [showCompletionLogs, setShowCompletionLogs] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
    DRAFT: { icon: <Clock className="w-4 h-4" />, className: 'bg-gray-100 text-gray-700' },
    SUBMITTED: { icon: <FileText className="w-4 h-4" />, className: 'bg-blue-100 text-blue-700' },
    UNDER_REVIEW: { icon: <Clock className="w-4 h-4" />, className: 'bg-amber-100 text-amber-700' },
    ACCEPTED: { icon: <CheckCircle className="w-4 h-4" />, className: 'bg-green-100 text-green-700' },
    REJECTED: { icon: <XCircle className="w-4 h-4" />, className: 'bg-red-100 text-red-700' },
    IN_PROGRESS: { icon: <Clock className="w-4 h-4" />, className: 'bg-blue-100 text-blue-700' },
    COMPLETED: { icon: <CheckCircle className="w-4 h-4" />, className: 'bg-green-100 text-green-700' },
  };

  const studentName = submission.user 
    ? submission.user.name 
    : submission.application 
    ? `${submission.application.firstName} ${submission.application.lastName}`
    : 'N/A';

  const studentEmail = submission.user?.email || submission.application?.email || 'N/A';
  const universityName = submission.program?.university?.universityName || submission.essayPrompt.admission?.university.universityName || 'N/A';
  const programName = submission.program?.programName || submission.essayPrompt.admission?.program.programName || 'N/A';

  const parseJSON = (jsonString: string | null) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const getScoreColor = (score: number | null): string => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number | null): string => {
    if (!score) return 'bg-gray-50';
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const wordCountPercentage = (submission.wordCount / submission.essayPrompt.wordLimit) * 100;
  const wordCountColor = wordCountPercentage > 100 ? 'text-red-600' : wordCountPercentage >= 80 ? 'text-green-600' : 'text-amber-600';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {submission.title || submission.essayPrompt.promptTitle}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[submission.status]?.className || 'bg-gray-100'}`}>
                {statusConfig[submission.status]?.icon}
                {submission.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Prompt: {submission.essayPrompt.promptTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Student Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                <p className="text-sm font-medium text-gray-900">{studentName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
                <p className="text-sm text-gray-700">{studentEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              Program Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">University</span>
                  <p className="text-sm font-medium text-gray-900">{universityName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Program</span>
                  <p className="text-sm font-medium text-gray-900">{programName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {submission._count && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Words</span>
              </div>
              <p className={`text-2xl font-bold ${wordCountColor}`}>{submission.wordCount}</p>
              <p className="text-xs text-gray-500">of {submission.essayPrompt.wordLimit}</p>
            </div>

            {submission.completionPercentage !== undefined && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Progress</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{submission.completionPercentage.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={16} className="text-purple-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Versions</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{submission._count.versions}</p>
              <p className="text-xs text-gray-500">Saved</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-500" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">AI Analysis</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{submission._count.aiResults}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        )}

        {/* Essay Details & Review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Essay Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar size={14} />
                  Last edited
                </span>
                <span className="text-gray-900 font-medium">
                  {formatDate(submission.lastEditedAt || submission.lastModified || new Date())}
                </span>
              </div>
              {submission.submissionDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CheckCircle size={14} />
                    Submitted
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(submission.submissionDate)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Using Template</span>
                <span className={`font-medium ${submission.isUsingTemplate ? 'text-green-600' : 'text-gray-600'}`}>
                  {submission.isUsingTemplate ? 'Yes' : 'No'}
                </span>
              </div>
              {submission.priority && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Priority</span>
                  <span className="font-medium capitalize">{submission.priority}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Review Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Review Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  submission.reviewStatus === 'REVIEWED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {submission.reviewStatus || 'PENDING'}
                </span>
              </div>
              {submission.internalRating !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Star size={14} className="text-amber-400" />
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-gray-900">{submission.internalRating.toFixed(1)}</span>
                    <span className="text-gray-400">/5.0</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Completed</span>
                <span className={`font-medium ${submission.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                  {submission.isCompleted ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest AI Analysis */}
        {submission.latestAIAnalysis && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
              className="w-full bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 flex items-center justify-between hover:from-amber-100 hover:to-orange-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Latest AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    {submission.latestAIAnalysis.analysisType} • {submission.latestAIAnalysis.aiProvider}
                  </p>
                </div>
              </div>
              {showAIAnalysis ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showAIAnalysis && (
              <div className="p-5 bg-white space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {submission.latestAIAnalysis.overallScore !== null && (
                    <div className={`text-center p-4 rounded-xl ${getScoreBg(submission.latestAIAnalysis.overallScore)}`}>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Overall</p>
                      <p className={`text-2xl font-bold ${getScoreColor(submission.latestAIAnalysis.overallScore)}`}>
                        {submission.latestAIAnalysis.overallScore.toFixed(0)}
                      </p>
                    </div>
                  )}
                  {submission.latestAIAnalysis.readabilityScore !== null && (
                    <div className={`text-center p-4 rounded-xl ${getScoreBg(submission.latestAIAnalysis.readabilityScore)}`}>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Readability</p>
                      <p className={`text-2xl font-bold ${getScoreColor(submission.latestAIAnalysis.readabilityScore)}`}>
                        {submission.latestAIAnalysis.readabilityScore.toFixed(0)}
                      </p>
                    </div>
                  )}
                  {submission.latestAIAnalysis.structureScore !== null && (
                    <div className={`text-center p-4 rounded-xl ${getScoreBg(submission.latestAIAnalysis.structureScore)}`}>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Structure</p>
                      <p className={`text-2xl font-bold ${getScoreColor(submission.latestAIAnalysis.structureScore)}`}>
                        {submission.latestAIAnalysis.structureScore.toFixed(0)}
                      </p>
                    </div>
                  )}
                  {submission.latestAIAnalysis.grammarIssues !== null && (
                    <div className="text-center p-4 rounded-xl bg-red-50">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Grammar Issues</p>
                      <p className="text-2xl font-bold text-red-600">
                        {submission.latestAIAnalysis.grammarIssues}
                      </p>
                    </div>
                  )}
                </div>

                {parseJSON(submission.latestAIAnalysis.suggestions).length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-2">Suggestions</h4>
                    <ul className="space-y-1.5">
                      {parseJSON(submission.latestAIAnalysis.suggestions).slice(0, 5).map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Versions */}
        {submission.versions && submission.versions.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="w-full bg-purple-50 px-5 py-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Version History ({submission.versions.length})</h3>
              </div>
              {showVersions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showVersions && (
              <div className="p-4 bg-white space-y-2 max-h-80 overflow-y-auto">
                {submission.versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      selectedVersion === version.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{version.label}</span>
                        {version.isAutoSave && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Auto</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{version.wordCount} words</span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(version.timestamp)}</p>
                    {selectedVersion === version.id && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{version.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completion Logs */}
        {submission.completionLogs && submission.completionLogs.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowCompletionLogs(!showCompletionLogs)}
              className="w-full bg-green-50 px-5 py-4 flex items-center justify-between hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Completion History ({submission.completionLogs.length})</h3>
              </div>
              {showCompletionLogs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showCompletionLogs && (
              <div className="p-4 bg-white space-y-2 max-h-60 overflow-y-auto">
                {submission.completionLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{formatDate(log.completedAt)}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        log.completionMethod === 'AUTO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {log.completionMethod}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Words: {log.wordCountAtCompletion} / {log.wordLimit}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviewer Comments */}
        {submission.reviewerComment && (
          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 mb-1">Reviewer Comments</h4>
                <p className="text-amber-800">{submission.reviewerComment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Essay Content */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} />
            Essay Content
          </h3>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{submission.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssaySubmissionDetail;
import React from 'react';
import { Clock, FileText, CheckCircle, XCircle, Star, User, MessageSquare, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
}

interface EssayPrompt {
  id: string;
  promptTitle: string;
  wordLimit: number;
}

interface EssaySubmission {
  id: string;
  essayPromptId: string;
  userId: string | null;
  applicationId: string | null;
  title: string | null;
  content: string;
  wordCount: number;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  submissionDate: Date | null;
  lastEditedAt: Date;
  isUsingTemplate: boolean;
  templateVersion: string | null;
  reviewStatus: "PENDING" | "REVIEWED" | null;
  reviewerId: string | null;
  reviewerComment: string | null;
  internalRating: number | null;
  essayPrompt: EssayPrompt;
  user: User | null;
  application: Application | null;
}

interface EssaySubmissionDetailProps {
  submission: EssaySubmission;
  onClose: () => void;
}

const EssaySubmissionDetail: React.FC<EssaySubmissionDetailProps> = ({ submission, onClose }) => {
  const statusIcons = {
    DRAFT: <Clock className="text-gray-500" />,
    SUBMITTED: <FileText className="text-blue-500" />,
    UNDER_REVIEW: <Clock className="text-yellow-500" />,
    ACCEPTED: <CheckCircle className="text-green-500" />,
    REJECTED: <XCircle className="text-red-500" />,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {submission.title || "Untitled Essay"}
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {statusIcons[submission.status]}
              {submission.status.replace("_", " ")}
            </span>
          </h2>
          <p className="text-gray-600 mt-1">
            Prompt: {submission.essayPrompt.promptTitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Details</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <User className="text-gray-500 w-4 h-4" />
              <span>Applicant: {submission.user ? `${submission.user.name} (${submission.user.email})` : 'N/A'}</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="text-gray-500 w-4 h-4" />
              <span>Application ID: {submission.applicationId || 'N/A'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="text-gray-500 w-4 h-4" />
              <span>Last edited: {submission.lastEditedAt.toLocaleDateString()}</span>
            </li>
            {submission.submissionDate && (
              <li className="flex items-center gap-2">
                <Calendar className="text-gray-500 w-4 h-4" />
                <span>Submitted: {submission.submissionDate.toLocaleDateString()}</span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span className="font-medium">Word Count:</span>
              <span className={`${submission.wordCount > submission.essayPrompt.wordLimit ? 'text-red-600' : 'text-green-600'}`}>
                {submission.wordCount}/{submission.essayPrompt.wordLimit}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">Template:</span>
              <span>
                {submission.isUsingTemplate 
                  ? `Yes${submission.templateVersion ? ` (v${submission.templateVersion})` : ''}` 
                  : 'No'}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Review Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="font-medium">Review Status:</span>
              <span className={`${submission.reviewStatus === 'PENDING' ? 'text-yellow-600' : 'text-green-600'}`}>
                {submission.reviewStatus || 'N/A'}
              </span>
            </li>
            {submission.internalRating !== null && (
              <li className="flex items-center gap-2">
                <Star className="text-yellow-500 w-4 h-4" />
                <span>Rating: {submission.internalRating.toFixed(1)}/5.0</span>
              </li>
            )}
            {submission.reviewerComment && (
              <li className="mt-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="text-gray-500 w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Reviewer Comments:</span>
                    <p className="mt-1 text-gray-700 bg-white p-3 rounded border">
                      {submission.reviewerComment}
                    </p>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-2">Essay Content</h3>
        <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border">
          {submission.content}
        </div>
      </div>
    </div>
  );
};

export default EssaySubmissionDetail;
import React from 'react';
import { Eye, Star, Calendar, User, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const EssaySubmissionList = ({ submissions, onViewDetail }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-100';
      case 'UNDER_REVIEW':
        return 'text-yellow-600 bg-yellow-100';
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DRAFT':
        return <FileText size={12} className="mr-1" />;
      case 'SUBMITTED':
        return <CheckCircle size={12} className="mr-1" />;
      case 'UNDER_REVIEW':
        return <Clock size={12} className="mr-1" />;
      case 'ACCEPTED':
        return <CheckCircle size={12} className="mr-1" />;
      case 'REJECTED':
        return <XCircle size={12} className="mr-1" />;
      default:
        return <FileText size={12} className="mr-1" />;
    }
  };

  const getWordCountColor = (wordCount, wordLimit) => {
    const percentage = (wordCount / wordLimit) * 100;
    if (percentage < 50) return 'text-red-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const renderRating = (rating) => {
    if (!rating) return <span className="text-gray-400">Not rated</span>;
    
    return (
      <div className="flex items-center gap-1">
        <Star size={14} className="text-yellow-500 fill-current" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Essay Submissions</h3>
        <p className="text-sm text-gray-500">Review and manage student essay submissions</p>
      </div>

      <div className="divide-y divide-gray-200">
        {submissions.map((submission) => (
          <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">
                    {submission.title || submission.essayPrompt?.promptTitle}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {getStatusIcon(submission.status)}
                    {submission.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                  {submission.user && (
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{submission.user.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {submission.submissionDate 
                        ? new Date(submission.submissionDate).toLocaleDateString()
                        : `Last edited: ${new Date(submission.lastEditedAt).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{submission.content}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Word count:</span>
                    <span className={`font-medium ${getWordCountColor(submission.wordCount, submission.essayPrompt?.wordLimit || 500)}`}>
                      {submission.wordCount} / {submission.essayPrompt?.wordLimit || 500}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Rating:</span>
                    {renderRating(submission.internalRating)}
                  </div>

                  {submission.reviewStatus && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      submission.reviewStatus === 'REVIEWED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.reviewStatus}
                    </span>
                  )}
                </div>

                {submission.reviewerComment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Review:</span> {submission.reviewerComment}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onViewDetail(submission)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-500">Essays will appear here once students start submitting.</p>
        </div>
      )}
    </div>
  );
};

export default EssaySubmissionList;
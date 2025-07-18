import React from 'react';
import { Edit, Eye, Users, CheckCircle, XCircle, Calendar } from 'lucide-react';

const EssayPromptList = ({ prompts, onEdit, onViewDetail }) => {
  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getMandatoryBadge = (isMandatory) => {
    return isMandatory ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Mandatory
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Optional
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Essay Prompts</h3>
        <p className="text-sm text-gray-500">Manage essay prompts for applications</p>
      </div>

      <div className="divide-y divide-gray-200">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{prompt.promptTitle}</h4>
                  {getMandatoryBadge(prompt.isMandatory)}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prompt.isActive)}`}>
                    {prompt.isActive ? (
                      <>
                        <CheckCircle size={12} className="mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle size={12} className="mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{prompt.promptText}</p>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{prompt._count?.submissions || 0} submissions</span>
                  </div>
                  <div>
                    Word limit: {prompt.minWordCount} - {prompt.wordLimit}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  {prompt.admission && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {prompt.admission.name}
                    </span>
                  )}
                  {prompt.program && (
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {prompt.program.programName}
                    </span>
                  )}
                  {prompt.intake && (
                    <span className="bg-green-100 px-2 py-1 rounded">
                      {prompt.intake.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onViewDetail(prompt)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(prompt)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit prompt"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No essay prompts found</h3>
          <p className="text-gray-500">Create your first essay prompt to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EssayPromptList;
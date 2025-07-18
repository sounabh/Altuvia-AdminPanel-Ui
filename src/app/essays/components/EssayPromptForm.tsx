import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const EssayPromptForm = ({ prompt, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    admissionId: prompt?.admissionId || '',
    programId: prompt?.programId || '',
    intakeId: prompt?.intakeId || '',
    promptTitle: prompt?.promptTitle || '',
    promptText: prompt?.promptText || '',
    wordLimit: prompt?.wordLimit || 500,
    minWordCount: prompt?.minWordCount || 0,
    isMandatory: prompt?.isMandatory ?? true,
    isActive: prompt?.isActive ?? true,
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.admissionId.trim()) {
      newErrors.admissionId = 'Admission ID is required';
    }
    
    if (!formData.programId.trim()) {
      newErrors.programId = 'Program ID is required';
    }
    
    if (!formData.intakeId.trim()) {
      newErrors.intakeId = 'Intake ID is required';
    }
    
    if (!formData.promptTitle.trim()) {
      newErrors.promptTitle = 'Prompt title is required';
    }
    
    if (!formData.promptText.trim()) {
      newErrors.promptText = 'Prompt text is required';
    }
    
    if (formData.wordLimit < 1) {
      newErrors.wordLimit = 'Word limit must be greater than 0';
    }
    
    if (formData.minWordCount < 0) {
      newErrors.minWordCount = 'Minimum word count cannot be negative';
    }
    
    if (formData.minWordCount > formData.wordLimit) {
      newErrors.minWordCount = 'Minimum word count cannot exceed word limit';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const errorClasses = "border-red-500 focus:ring-red-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {prompt ? 'Edit Essay Prompt' : 'Create New Essay Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Admission ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission ID *
            </label>
            <input
              type="text"
              name="admissionId"
              value={formData.admissionId}
              onChange={handleChange}
              className={`${inputClasses} ${errors.admissionId ? errorClasses : ''}`}
              placeholder="Enter admission ID"
            />
            {errors.admissionId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.admissionId}
              </div>
            )}
          </div>

          {/* Program ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program ID *
            </label>
            <input
              type="text"
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              className={`${inputClasses} ${errors.programId ? errorClasses : ''}`}
              placeholder="Enter program ID"
            />
            {errors.programId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.programId}
              </div>
            )}
          </div>

          {/* Intake ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intake ID *
            </label>
            <input
              type="text"
              name="intakeId"
              value={formData.intakeId}
              onChange={handleChange}
              className={`${inputClasses} ${errors.intakeId ? errorClasses : ''}`}
              placeholder="Enter intake ID"
            />
            {errors.intakeId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.intakeId}
              </div>
            )}
          </div>

          {/* Prompt Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Title *
            </label>
            <input
              type="text"
              name="promptTitle"
              value={formData.promptTitle}
              onChange={handleChange}
              className={`${inputClasses} ${errors.promptTitle ? errorClasses : ''}`}
              placeholder="Enter prompt title"
            />
            {errors.promptTitle && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.promptTitle}
              </div>
            )}
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt Text *
            </label>
            <textarea
              name="promptText"
              value={formData.promptText}
              onChange={handleChange}
              rows={4}
              className={`${inputClasses} ${errors.promptText ? errorClasses : ''}`}
              placeholder="Enter the essay prompt text"
            />
            {errors.promptText && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.promptText}
              </div>
            )}
          </div>

          {/* Word Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Limit *
              </label>
              <input
                type="number"
                name="wordLimit"
                value={formData.wordLimit}
                onChange={handleChange}
                min="1"
                className={`${inputClasses} ${errors.wordLimit ? errorClasses : ''}`}
                placeholder="500"
              />
              {errors.wordLimit && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.wordLimit}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Word Count
              </label>
              <input
                type="number"
                name="minWordCount"
                value={formData.minWordCount}
                onChange={handleChange}
                min="0"
                className={`${inputClasses} ${errors.minWordCount ? errorClasses : ''}`}
                placeholder="0"
              />
              {errors.minWordCount && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.minWordCount}
                </div>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isMandatory"
                checked={formData.isMandatory}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                This is a mandatory prompt
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                This prompt is active
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayPromptForm;
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Save, AlertCircle } from 'lucide-react';

// ================== INTERFACES ==================
export interface EssayPromptInput {
  admissionId?: string;
  programId?: string;
  intakeId?: string;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
}

export interface EssayPromptFormProps {
  prompt?: EssayPromptInput;
  onSubmit: (values: EssayPromptInput) => void;
  onClose: () => void;
  loading: boolean;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  
  promptTitle: Yup.string().required('Prompt title is required'),
  promptText: Yup.string().required('Prompt text is required'),
  wordLimit: Yup.number()
    .min(1, 'Word limit must be greater than 0')
    .required('Word limit is required'),
  minWordCount: Yup.number()
    .min(0, 'Minimum word count cannot be negative')
    .test(
      'lessThanWordLimit',
      'Minimum word count cannot exceed word limit',
      (value: number | undefined, context: { parent: { wordLimit: number; }; }) => {
        return value === undefined || value <= context.parent.wordLimit;
      }
    )
    .optional(),
  isMandatory: Yup.boolean().optional(),
  isActive: Yup.boolean().optional(),
});

const EssayPromptForm: React.FC<EssayPromptFormProps> = ({
  prompt,
  onSubmit,
  onClose,
  loading,
}) => {
  const formik = useFormik<EssayPromptInput>({
    initialValues: {
      admissionId: prompt?.admissionId || '',
      programId: prompt?.programId || '',
      intakeId: prompt?.intakeId || '',
      promptTitle: prompt?.promptTitle || '',
      promptText: prompt?.promptText || '',
      wordLimit: prompt?.wordLimit || 500,
      minWordCount: prompt?.minWordCount || 0,
      isMandatory: prompt?.isMandatory ?? true,
      isActive: prompt?.isActive ?? true,
    },
    validationSchema,
    onSubmit: (values: EssayPromptInput) => {
      onSubmit(values);
    },
  });

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
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Admission ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission ID *
            </label>
            <input
              type="text"
              name="admissionId"
              value={formik.values.admissionId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputClasses} ${formik.touched.admissionId && formik.errors.admissionId ? errorClasses : ''}`}
              placeholder="Enter admission ID"
            />
            {formik.touched.admissionId && formik.errors.admissionId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.admissionId}
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
              value={formik.values.programId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputClasses} ${formik.touched.programId && formik.errors.programId ? errorClasses : ''}`}
              placeholder="Enter program ID"
            />
            {formik.touched.programId && formik.errors.programId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.programId}
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
              value={formik.values.intakeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputClasses} ${formik.touched.intakeId && formik.errors.intakeId ? errorClasses : ''}`}
              placeholder="Enter intake ID"
            />
            {formik.touched.intakeId && formik.errors.intakeId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.intakeId}
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
              value={formik.values.promptTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${inputClasses} ${formik.touched.promptTitle && formik.errors.promptTitle ? errorClasses : ''}`}
              placeholder="Enter prompt title"
            />
            {formik.touched.promptTitle && formik.errors.promptTitle && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.promptTitle}
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
              value={formik.values.promptText}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={`${inputClasses} ${formik.touched.promptText && formik.errors.promptText ? errorClasses : ''}`}
              placeholder="Enter the essay prompt text"
            />
            {formik.touched.promptText && formik.errors.promptText && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.promptText}
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
                value={formik.values.wordLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                className={`${inputClasses} ${formik.touched.wordLimit && formik.errors.wordLimit ? errorClasses : ''}`}
                placeholder="500"
              />
              {formik.touched.wordLimit && formik.errors.wordLimit && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {formik.errors.wordLimit}
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
                value={formik.values.minWordCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                className={`${inputClasses} ${formik.touched.minWordCount && formik.errors.minWordCount ? errorClasses : ''}`}
                placeholder="0"
              />
              {formik.touched.minWordCount && formik.errors.minWordCount && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {formik.errors.minWordCount}
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
                checked={formik.values.isMandatory}
                onChange={formik.handleChange}
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
                checked={formik.values.isActive}
                onChange={formik.handleChange}
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
              type="submit"
              
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
        </form>
      </div>
    </div>
  );
};

export default EssayPromptForm;

// Additional interfaces for completeness
export interface EssayPromptUpdateInput {
  promptTitle?: string;
  promptText?: string;
  wordLimit?: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
  programId?: string;
  intakeId?: string;
}

export interface EssaySubmissionInput {
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
  title?: string;
  content: string;
  isUsingTemplate?: boolean;
  templateVersion?: string;
}

export interface EssaySubmissionUpdateInput {
  title?: string;
  content?: string;
  status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  isUsingTemplate?: boolean;
  templateVersion?: string;
  reviewStatus?: "PENDING" | "REVIEWED";
  reviewerId?: string;
  reviewerComment?: string;
  internalRating?: number;
}
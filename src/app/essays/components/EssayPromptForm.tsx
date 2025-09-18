import React, { useState, useEffect } from 'react';
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

export interface University {
  id: string;
  universityName: string;
  city: string;
  country: string;
}

export interface Program {
  id: string;
  programName: string;
  degreeType?: string | null;
  universityId: string;
  university?: {
    universityName: string;
  };
}

export interface Admission {
  id: string;
  universityId: string;
  programId: string;
  university: {
    universityName: string;
    city: string;
    country: string;
  };
  program: {
    programName: string;
    degreeType: string | null;
  };
}

export interface Intake {
  id: string;
  admissionId: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

export interface EssayPromptFormProps {
  prompt?: EssayPromptInput & { id?: string };
  onSubmit: (values: EssayPromptInput) => void;
  onClose: () => void;
  loading: boolean;
  universities?: University[];
  programs?: Program[];
  admissions?: Admission[];
  intakes?: Intake[];
}

// Validation schema using Yup - Made admissionId optional
const validationSchema = Yup.object({
  admissionId: Yup.string().optional(), // Made optional
  programId: Yup.string().optional(),
  intakeId: Yup.string().optional(),
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
  universities = [],
  programs = [],
  admissions = [],
  intakes = [],
}) => {
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([]);
  const [filteredIntakes, setFilteredIntakes] = useState<Intake[]>([]);

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

  // Filter programs based on selected university
  useEffect(() => {
    if (selectedUniversityId) {
      const filtered = programs.filter(program => program.universityId === selectedUniversityId);
      setFilteredPrograms(filtered);
      
      // Also filter admissions for the selected university
      const filteredAdms = admissions.filter(admission => admission.universityId === selectedUniversityId);
      setFilteredAdmissions(filteredAdms);
      
      // Reset program selection if current program doesn't belong to selected university
      if (formik.values.programId) {
        const programBelongsToUni = filtered.some(p => p.id === formik.values.programId);
        if (!programBelongsToUni) {
          formik.setFieldValue('programId', '');
        }
      }
      
      // Reset admission selection if current admission doesn't belong to selected university
      if (formik.values.admissionId) {
        const admissionBelongsToUni = filteredAdms.some(a => a.id === formik.values.admissionId);
        if (!admissionBelongsToUni) {
          formik.setFieldValue('admissionId', '');
        }
      }
    } else {
      setFilteredPrograms(programs);
      setFilteredAdmissions(admissions);
    }
  }, [selectedUniversityId, programs, admissions, formik.values.programId, formik.values.admissionId]);

  // Filter intakes based on selected admission
  useEffect(() => {
    if (formik.values.admissionId) {
      const filtered = intakes.filter(intake => intake.admissionId === formik.values.admissionId);
      setFilteredIntakes(filtered);
    } else {
      setFilteredIntakes([]);
    }
  }, [formik.values.admissionId, intakes]);

  // Initialize selected university based on existing admission/program
  useEffect(() => {
    if (prompt?.admissionId) {
      const admission = admissions.find(a => a.id === prompt.admissionId);
      if (admission) {
        setSelectedUniversityId(admission.universityId);
      }
    } else if (prompt?.programId) {
      const program = programs.find(p => p.id === prompt.programId);
      if (program) {
        setSelectedUniversityId(program.universityId);
      }
    }
  }, [prompt, admissions, programs]);

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const selectClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";
  const errorClasses = "border-red-500 focus:ring-red-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
          {/* University Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by University
            </label>
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
              className={selectClasses}
            >
              <option value="">All Universities</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.universityName} - {university.city}, {university.country}
                </option>
              ))}
            </select>
          </div>

          {/* Admission Selection - Made Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission (Optional)
            </label>
            <select
              name="admissionId"
              value={formik.values.admissionId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${selectClasses} ${formik.touched.admissionId && formik.errors.admissionId ? errorClasses : ''}`}
            >
              <option value="">Select an admission (optional)</option>
              {filteredAdmissions.map((admission) => (
                <option key={admission.id} value={admission.id}>
                  {admission.university.universityName} - {admission.program.programName}
                </option>
              ))}
            </select>
            {formik.touched.admissionId && formik.errors.admissionId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.admissionId}
              </div>
            )}
          </div>

          {/* Program Selection (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program (Optional)
            </label>
            <select
              name="programId"
              value={formik.values.programId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${selectClasses} ${formik.touched.programId && formik.errors.programId ? errorClasses : ''}`}
            >
              <option value="">Select a program (optional)</option>
              {filteredPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName} {program.degreeType ? `(${program.degreeType})` : ''}
                </option>
              ))}
            </select>
            {formik.touched.programId && formik.errors.programId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.programId}
              </div>
            )}
          </div>

          {/* Intake Selection (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intake (Optional)
            </label>
            <select
              name="intakeId"
              value={formik.values.intakeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${selectClasses} ${formik.touched.intakeId && formik.errors.intakeId ? errorClasses : ''}`}
              disabled={!formik.values.admissionId}
            >
              <option value="">Select an intake (optional)</option>
              {filteredIntakes.map((intake) => (
                <option key={intake.id} value={intake.id}>
                  {intake.intakeName} - {intake.intakeType} {intake.intakeYear}
                </option>
              ))}
            </select>
            {formik.touched.intakeId && formik.errors.intakeId && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {formik.errors.intakeId}
              </div>
            )}
            {!formik.values.admissionId && (
              <p className="mt-1 text-sm text-gray-500">
                Please select an admission first to choose an intake
              </p>
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
        </form>
      </div>
    </div>
  );
};

export default EssayPromptForm;
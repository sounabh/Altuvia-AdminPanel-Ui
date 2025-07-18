import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { X, Building, Save, Loader2 } from 'lucide-react';

// Types
interface University {
  id: string;
  name: string;
}

interface Department {
  id?: string;
  universityId: string;
  name: string;
  slug: string;
}

interface FormData {
  universityId: string;
  name: string;
  slug: string;
}

interface Errors {
  universityId?: string;
  name?: string;
  slug?: string;
}

interface DepartmentFormProps {
  department?: Department | null;
  universities: University[];
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  loading: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  universities,
  onSubmit,
  onClose,
  loading
}) => {
  const [formData, setFormData] = useState<FormData>({
    universityId: '',
    name: '',
    slug: ''
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (department) {
      setFormData({
        universityId: department.universityId || '',
        name: department.name || '',
        slug: department.slug || ''
      });
    }
  }, [department]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-generate slug from name
      if (name === 'name') {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.universityId.trim()) {
      newErrors.universityId = 'University is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {department ? 'Edit Department' : 'Create New Department'}
          </h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* University Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
          <select
            name="universityId"
            value={formData.universityId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.universityId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select University</option>
            {universities.map(university => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.universityId && (
            <p className="text-red-500 text-sm mt-1">{errors.universityId}</p>
          )}
        </div>

        {/* Department Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="e.g., computer-science"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.slug ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          <p className="text-gray-500 text-sm mt-1">
            URL-friendly version of the name (auto-generated)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : department ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;

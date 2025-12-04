/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Mail, Calendar, Download, Search, Filter, 
  MoreHorizontal, Bell, ChevronDown, FileText, Clock,
  CheckCircle, AlertCircle, GraduationCap, Phone,
  MapPin, Globe, Award, DollarSign, Edit3, Eye,
  TrendingUp, AlertTriangle, User, Loader2, Trash2,
  Plus, X
} from 'lucide-react';

import { 
  getStudents, 
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleEmailVerification,
  getStudentStats,
  type StudentBasicInfo,
  type StudentDetailedInfo
} from './stuactions';

// ==================== TYPE DEFINITIONS ====================
interface Metrics {
  totalStudents: number;
  verifiedStudents: number;
  activeApplications: number;
  completedEssays: number;
  upcomingEvents: number;
  totalCVs: number;
}

interface Filters {
  search: string;
  emailVerified?: boolean;
  plan?: string;
  studyLevel?: string;
  country?: string;
}

interface CreateStudentFormData {
  email: string;
  password: string;
  name: string;
  countries: string[];
  courses: string[];
  studyLevel: string;
  gpa: string;
  testScores: string;
  workExperience: string;
}

// ==================== EXPORT UTILITIES ====================
const exportToCSV = (students: StudentBasicInfo[]) => {
  const headers = ['Name', 'Email', 'Verified', 'Study Level', 'GPA', 'Plan', 'Applications', 'Essays', 'CVs', 'Created'];
  
  const rows = students.map(student => [
    student.name || '',
    student.email,
    student.emailVerified ? 'Yes' : 'No',
    student.profile?.studyLevel || '',
    student.profile?.gpa || '',
    student.subscription?.plan || 'N/A',
    student._count.applications,
    student._count.essays,
    student._count.CV,
    new Date(student.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = (students: StudentBasicInfo[]) => {
  const headers = ['Name', 'Email', 'Verified', 'Study Level', 'GPA', 'Test Scores', 'Countries', 'Courses', 'Plan', 'Status', 'Applications', 'Essays', 'CVs', 'Saved Universities', 'Events', 'Created Date'];
  
  const rows = students.map(student => [
    student.name || '',
    student.email,
    student.emailVerified ? 'Yes' : 'No',
    student.profile?.studyLevel || '',
    student.profile?.gpa || '',
    student.profile?.testScores || '',
    student.profile?.countries?.join(', ') || '',
    student.profile?.courses?.join(', ') || '',
    student.subscription?.plan || 'N/A',
    student.subscription?.status || 'N/A',
    student._count.applications,
    student._count.essays,
    student._count.CV,
    student._count.savedUniversities,
    student._count.calendarEvents,
    new Date(student.createdAt).toLocaleDateString(),
  ]);

  const htmlTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
    <table border="1">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (students: StudentBasicInfo[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Students Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
        .meta { color: #6b7280; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .verified { color: #10b981; font-weight: 600; }
        .not-verified { color: #ef4444; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Student Management Report</h1>
      <div class="meta">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Students:</strong> ${students.length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Study Level</th>
            <th>GPA</th>
            <th>Plan</th>
            <th>Applications</th>
            <th>Essays</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(student => `
            <tr>
              <td>${student.name || 'N/A'}</td>
              <td>${student.email}</td>
              <td class="${student.emailVerified ? 'verified' : 'not-verified'}">
                ${student.emailVerified ? '✓ Verified' : '✗ Not Verified'}
              </td>
              <td>${student.profile?.studyLevel || 'N/A'}</td>
              <td>${student.profile?.gpa || 'N/A'}</td>
              <td>${student.subscription?.plan || 'N/A'}</td>
              <td>${student._count.applications}</td>
              <td>${student._count.essays}</td>
              <td>${new Date(student.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Student Management System - Confidential</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// ==================== MAIN COMPONENT ====================
const StudentManagementSystem = () => {
  const [students, setStudents] = useState<StudentBasicInfo[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetailedInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: State to track which student's menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    emailVerified: undefined,
    plan: undefined,
    studyLevel: undefined,
    country: undefined
  });

  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    verifiedStudents: 0,
    activeApplications: 0,
    completedEssays: 0,
    upcomingEvents: 0,
    totalCVs: 0
  });

  const [createFormData, setCreateFormData] = useState<CreateStudentFormData>({
    email: '',
    password: '',
    name: '',
    countries: [],
    courses: [],
    studyLevel: '',
    gpa: '',
    testScores: '',
    workExperience: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [countryInput, setCountryInput] = useState('');
  const [courseInput, setCourseInput] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  // NEW: Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.student-menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {
        search: filters.search || undefined,
        emailVerified: filters.emailVerified,
        plan: filters.plan || undefined,
        studyLevel: filters.studyLevel || undefined,
        country: filters.country || undefined,
      };

      const result = await getStudents(filterParams);
      
      if (result.success) {
        setStudents(result.students);
      } else {
        setError(result.error || 'Failed to fetch students');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const result = await getStudentStats();
      
      if (result.success && result.stats) {
        setMetrics(result.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    try {
      setModalLoading(true);
      setOpenMenuId(null); // Close menu when opening modal
      const result = await getStudentById(id);
      
      if (result.success && result.student) {
        setSelectedStudent(result.student);
        setShowModal(true);
      } else {
        alert(result.error || 'Failed to fetch student details');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      alert('An unexpected error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!createFormData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!createFormData.password) {
      errors.password = 'Password is required';
    } else if (createFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!createFormData.name) {
      errors.name = 'Name is required';
    } else if (createFormData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCreateForm()) {
      return;
    }

    try {
      setCreateLoading(true);
      setFormErrors({});

      const submissionData: Record<string, unknown> = {
        email: createFormData.email,
        password: createFormData.password,
        name: createFormData.name,
      };

      if (createFormData.countries.length > 0) {
        submissionData.countries = createFormData.countries;
      }

      if (createFormData.courses.length > 0) {
        submissionData.courses = createFormData.courses;
      }

      if (createFormData.studyLevel) {
        submissionData.studyLevel = createFormData.studyLevel;
      }

      if (createFormData.gpa) {
        submissionData.gpa = createFormData.gpa;
      }

      if (createFormData.testScores) {
        submissionData.testScores = createFormData.testScores;
      }

      if (createFormData.workExperience) {
        submissionData.workExperience = createFormData.workExperience;
      }

      const result = await createStudent(submissionData as never);
      
      if (result.success) {
        setCreateFormData({
          email: '',
          password: '',
          name: '',
          countries: [],
          courses: [],
          studyLevel: '',
          gpa: '',
          testScores: '',
          workExperience: '',
        });

        setShowCreateModal(false);
        fetchStudents();
        fetchStats();
        alert(result.message || 'Student created successfully!');
      } else {
        if (result.details) {
          const zodErrors: Record<string, string> = {};
          const errorDetails = result.details as { errors?: Array<{ path: string[]; message: string }> };
          errorDetails.errors?.forEach((err) => {
            if (err.path && err.path[0]) {
              zodErrors[err.path[0]] = err.message;
            }
          });
          setFormErrors(zodErrors);
        } else {
          alert(result.error || 'Failed to create student');
        }
      }
    } catch (err) {
      console.error('Error creating student:', err);
      alert('An unexpected error occurred');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    setOpenMenuId(null); // Close menu
    
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteStudent(id);
      
      if (result.success) {
        if (selectedStudent?.id === id) {
          setShowModal(false);
          setSelectedStudent(null);
        }
        
        fetchStudents();
        fetchStats();
        alert(result.message || 'Student deleted successfully');
      } else {
        alert(result.error || 'Failed to delete student');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('An unexpected error occurred');
    }
  };

  const handleToggleEmailVerification = async (id: string) => {
    setOpenMenuId(null); // Close menu
    
    try {
      const result = await toggleEmailVerification(id);
      
      if (result.success) {
        fetchStudents();
        
        if (selectedStudent?.id === id) {
          fetchStudentDetails(id);
        }
        
        alert(result.message || 'Email verification status updated');
      } else {
        alert(result.error || 'Failed to update email verification');
      }
    } catch (err) {
      console.error('Error toggling email verification:', err);
      alert('An unexpected error occurred');
    }
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const handleFilterChange = (key: keyof Filters, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addCountry = () => {
    if (countryInput.trim() && !createFormData.countries.includes(countryInput.trim())) {
      setCreateFormData(prev => ({
        ...prev,
        countries: [...prev.countries, countryInput.trim()]
      }));
      setCountryInput('');
    }
  };

  const removeCountry = (country: string) => {
    setCreateFormData(prev => ({
      ...prev,
      countries: prev.countries.filter(c => c !== country)
    }));
  };

  const addCourse = () => {
    if (courseInput.trim() && !createFormData.courses.includes(courseInput.trim())) {
      setCreateFormData(prev => ({
        ...prev,
        courses: [...prev.courses, courseInput.trim()]
      }));
      setCourseInput('');
    }
  };

  const removeCourse = (course: string) => {
    setCreateFormData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c !== course)
    }));
  };

  const sendEmail = (studentId: string) => {
    alert(`Email functionality would be implemented here for student ${studentId}`);
  };

  const createTask = (studentId: string) => {
    alert(`Task creation functionality would be implemented here for student ${studentId}`);
  };

  // NEW: Toggle menu function
  const toggleMenu = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === studentId ? null : studentId);
  };

  // ==================== COMPONENT BLOCKS ====================
  
  const CreateStudentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create New Student</h2>
          <button 
            onClick={() => {
              setShowCreateModal(false);
              setFormErrors({});
              setCreateFormData({
                email: '',
                password: '',
                name: '',
                countries: [],
                courses: [],
                studyLevel: '',
                gpa: '',
                testScores: '',
                workExperience: '',
              });
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={createLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleCreateStudent} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={createFormData.name}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="John Doe"
                disabled={createLoading}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com"
                disabled={createLoading}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Minimum 8 characters"
                disabled={createLoading}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Academic Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Level
                </label>
                <select
                  value={createFormData.studyLevel}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, studyLevel: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={createLoading}
                >
                  <option value="">Select study level</option>
                  <option value="bachelors">Bachelor&apos;s Degree</option>
                  <option value="masters">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                  <option value="diploma">Diploma</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA / Percentage
                </label>
                <input
                  type="text"
                  value={createFormData.gpa}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.8 or 85%"
                  disabled={createLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Scores
              </label>
              <textarea
                value={createFormData.testScores}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, testScores: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., IELTS: 7.5, GRE: 320, GMAT: 700"
                rows={3}
                disabled={createLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Experience
              </label>
              <textarea
                value={createFormData.workExperience}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, workExperience: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of work experience"
                rows={3}
                disabled={createLoading}
              />
            </div>
          </div>

          {/* Study Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Study Preferences</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Countries
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type country and press Enter"
                  disabled={createLoading}
                />
                <button
                  type="button"
                  onClick={addCountry}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={createLoading}
                >
                  Add
                </button>
              </div>
              {createFormData.countries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {createFormData.countries.map((country, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {country}
                      <button
                        type="button"
                        onClick={() => removeCountry(country)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={createLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Courses/Fields
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type course and press Enter"
                  disabled={createLoading}
                />
                <button
                  type="button"
                  onClick={addCourse}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={createLoading}
                >
                  Add
                </button>
              </div>
              {createFormData.courses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {createFormData.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {course}
                      <button
                        type="button"
                        onClick={() => removeCourse(course)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                        disabled={createLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t-2 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setFormErrors({});
                setCreateFormData({
                  email: '',
                  password: '',
                  name: '',
                  countries: [],
                  courses: [],
                  studyLevel: '',
                  gpa: '',
                  testScores: '',
                  workExperience: '',
                });
              }}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:bg-gray-100 font-medium"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center font-medium shadow-lg hover:shadow-xl transition"
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const MetricsBar = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statsLoading ? (
        <div className="col-span-full flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <MetricCard 
            title="Total Students" 
            value={metrics.totalStudents} 
            icon={<Users className="w-6 h-6" />} 
            color="blue" 
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <MetricCard 
            title="Verified" 
            value={metrics.verifiedStudents} 
            icon={<CheckCircle className="w-6 h-6" />} 
            color="green" 
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <MetricCard 
            title="Applications" 
            value={metrics.activeApplications} 
            icon={<FileText className="w-6 h-6" />} 
            color="purple" 
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <MetricCard 
            title="Essays" 
            value={metrics.completedEssays} 
            icon={<Edit3 className="w-6 h-6" />} 
            color="indigo" 
            bgColor="bg-indigo-50"
            textColor="text-indigo-600"
          />
          <MetricCard 
            title="Events" 
            value={metrics.upcomingEvents} 
            icon={<Calendar className="w-6 h-6" />} 
            color="orange" 
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
          <MetricCard 
            title="CVs" 
            value={metrics.totalCVs} 
            icon={<FileText className="w-6 h-6" />} 
            color="teal" 
            bgColor="bg-teal-50"
            textColor="text-teal-600"
          />
        </>
      )}
    </div>
  );

  const MetricCard = ({ title, value, icon, bgColor, textColor }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    textColor: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student }: { student: StudentBasicInfo }) => {
    const isMenuOpen = openMenuId === student.id;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition">
              {student.image ? (
                <img src={student.image} alt={student.name || ''} className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.name || 'No Name'}
              </h3>
              <p className="text-sm text-gray-600 truncate">{student.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {student.emailVerified ? (
                  <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* FIXED: Click-based menu instead of hover */}
          <div className="relative student-menu-container">
            <button 
              onClick={(e) => toggleMenu(student.id, e)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
            
            {/* Menu - shows when isMenuOpen is true */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => fetchStudentDetails(student.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center transition text-gray-700 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View Details
                </button>
                <button
                  onClick={() => handleToggleEmailVerification(student.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center transition text-gray-700 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4 mr-3" />
                  {student.emailVerified ? 'Unverify' : 'Verify'} Email
                </button>
                <button
                  onClick={() => handleDeleteStudent(student.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center transition border-t border-gray-100"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Student
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {student.profile && (
            <div className="grid grid-cols-2 gap-3">
              {student.profile.studyLevel && (
                <div className="flex items-center text-sm">
                  <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 truncate">{student.profile.studyLevel}</span>
                </div>
              )}
              {student.profile.gpa && (
                <div className="flex items-center text-sm">
                  <Award className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">GPA: {student.profile.gpa}</span>
                </div>
              )}
            </div>
          )}

          {student.subscription && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 font-medium">Subscription Plan:</span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                student.subscription.plan === 'premium' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                  : student.subscription.plan === 'basic'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {student.subscription.plan.toUpperCase()}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition">
                <p className="text-xs text-blue-600 font-medium mb-1">Applications</p>
                <p className="text-lg font-bold text-blue-700">{student._count.applications}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition">
                <p className="text-xs text-purple-600 font-medium mb-1">Essays</p>
                <p className="text-lg font-bold text-purple-700">{student._count.essays}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition">
                <p className="text-xs text-green-600 font-medium mb-1">CVs</p>
                <p className="text-lg font-bold text-green-700">{student._count.CV}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(student.createdAt).toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => sendEmail(student.id)}
                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button 
                onClick={() => createTask(student.id)}
                className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition"
                title="Create Task"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StudentModal = ({ student, onClose }: { student: StudentDetailedInfo; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b-2 border-gray-200 z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {student.name || 'Student Details'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{student.email}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <PersonalInfoSection student={student} onToggleVerification={handleToggleEmailVerification} />
          <ProfileInfoSection student={student} />
          <SubscriptionInfoSection student={student} />
        </div>

        {student.savedUniversities && student.savedUniversities.length > 0 && (
          <div className="mt-6">
            <SavedUniversitiesSection universities={student.savedUniversities} />
          </div>
        )}

        {student.essays && student.essays.length > 0 && (
          <div className="mt-6">
            <EssaysSection essays={student.essays} />
          </div>
        )}

        {student.CV && student.CV.length > 0 && (
          <div className="mt-6">
            <CVSection cvs={student.CV} />
          </div>
        )}

        {student.calendarEvents && student.calendarEvents.length > 0 && (
          <div className="mt-6">
            <CalendarEventsSection events={student.calendarEvents} />
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 border-t-2 border-gray-200">
          <button 
            onClick={() => sendEmail(student.id)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-lg hover:shadow-xl transition"
          >
            <Mail className="w-4 h-4 mr-2" /> Send Email
          </button>
          <button 
            onClick={() => createTask(student.id)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium shadow-lg hover:shadow-xl transition"
          >
            <Bell className="w-4 h-4 mr-2" /> Create Task
          </button>
          <button 
            onClick={() => handleDeleteStudent(student.id)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center font-medium shadow-lg hover:shadow-xl transition"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  const PersonalInfoSection = ({ student, onToggleVerification }: { 
    student: StudentDetailedInfo;
    onToggleVerification: (id: string) => void;
  }) => (
    <div className="space-y-4 bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Personal Information</h3>
      <InfoRow label="Name" value={student.name || 'Not provided'} />
      <InfoRow label="Email" value={student.email} />
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">Email Verified:</span>
        <button
          onClick={() => onToggleVerification(student.id)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
            student.emailVerified 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {student.emailVerified ? '✓ Verified' : '✗ Not Verified'}
        </button>
      </div>
      <InfoRow label="Created" value={new Date(student.createdAt).toLocaleDateString()} />
      <InfoRow label="Last Updated" value={new Date(student.updatedAt).toLocaleDateString()} />
    </div>
  );

  const ProfileInfoSection = ({ student }: { student: StudentDetailedInfo }) => (
    <div className="space-y-4 bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-purple-200 pb-2">Profile Information</h3>
      {student.profile ? (
        <>
          <InfoRow label="Study Level" value={student.profile.studyLevel || 'Not provided'} />
          <InfoRow label="GPA" value={student.profile.gpa || 'Not provided'} />
          <InfoRow label="Test Scores" value={student.profile.testScores || 'Not provided'} />
          <InfoRow label="Work Experience" value={student.profile.workExperience || 'Not provided'} />
          {student.profile.countries && student.profile.countries.length > 0 && (
            <div className="flex flex-col text-sm">
              <span className="text-gray-600 mb-2 font-medium">Countries:</span>
              <div className="flex flex-wrap gap-2">
                {student.profile.countries.map((country, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
          {student.profile.courses && student.profile.courses.length > 0 && (
            <div className="flex flex-col text-sm">
              <span className="text-gray-600 mb-2 font-medium">Courses:</span>
              <div className="flex flex-wrap gap-2">
                {student.profile.courses.map((course, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">No profile information available</p>
      )}
    </div>
  );

  const SubscriptionInfoSection = ({ student }: { student: StudentDetailedInfo }) => (
    <div className="space-y-4 bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
      <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-green-200 pb-2">Subscription</h3>
      {student.subscription ? (
        <>
          <InfoRow label="Plan" value={student.subscription.plan.toUpperCase()} />
          <InfoRow label="Status" value={student.subscription.status} />
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">No active subscription</p>
      )}
      
      <div className="pt-4 border-t-2 border-green-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Activity Summary</h4>
        <div className="space-y-2">
          <InfoRow label="Applications" value={student._count.applications.toString()} />
          <InfoRow label="Saved Universities" value={student._count.savedUniversities.toString()} />
          <InfoRow label="Calendar Events" value={student._count.calendarEvents.toString()} />
          <InfoRow label="Essays" value={student._count.essays.toString()} />
          <InfoRow label="CVs" value={student._count.CV.toString()} />
          <InfoRow label="Scholarships" value={student._count.scholarshipApplications.toString()} />
          <InfoRow label="Financial Aid" value={student._count.financialAidApplications.toString()} />
        </div>
      </div>
    </div>
  );

  const SavedUniversitiesSection = ({ universities }: { universities: StudentDetailedInfo['savedUniversities'] }) => (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-indigo-200 pb-2">
        Saved Universities ({universities.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map(uni => (
          <div key={uni.id} className="p-4 bg-white rounded-lg border border-indigo-200 hover:shadow-md transition">
            {uni.images && uni.images.length > 0 && (
              <img 
                src={uni.images[0].imageUrl} 
                alt={uni.universityName}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h4 className="font-semibold text-sm text-gray-800">{uni.universityName}</h4>
            <p className="text-xs text-gray-600 mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {uni.city}, {uni.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const EssaysSection = ({ essays }: { essays: StudentDetailedInfo['essays'] }) => (
    <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
        Essays ({essays.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {essays.map(essay => (
          <div key={essay.id} className="p-4 bg-white rounded-lg border border-yellow-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">{essay.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{essay.program.programName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                essay.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {essay.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
              <span>{essay.wordCount} / {essay.wordLimit} words</span>
              <span className="font-semibold">{essay.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${essay.completionPercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CVSection = ({ cvs }: { cvs: StudentDetailedInfo['CV'] }) => (
    <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-teal-200 pb-2">
        CVs ({cvs.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cvs.map(cv => (
          <div key={cv.id} className="p-4 bg-white rounded-lg border border-teal-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-sm text-gray-800">{cv.title}</h4>
              {cv.isActive && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Active
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Completion:</span>
                <span className="font-semibold text-gray-800">{cv.completionPercentage}%</span>
              </div>
              {cv.atsScore !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">ATS Score:</span>
                  <span className="font-semibold text-gray-800">{cv.atsScore}/100</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Updated:</span>
                <span>{new Date(cv.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CalendarEventsSection = ({ events }: { events: StudentDetailedInfo['calendarEvents'] }) => (
    <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
        Calendar Events ({events.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map(event => (
          <div key={event.id} className="p-4 bg-white rounded-lg border border-orange-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">{event.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{event.eventType}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.eventStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.eventStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.priority === 'high' ? 'bg-red-100 text-red-800' :
                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="font-semibold text-gray-800 text-right max-w-xs truncate">{value}</span>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <header className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track student profiles, applications, and progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create Student</span>
          </button>
        </div>
      </header>

      <MetricsBar />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              value={filters.emailVerified === undefined ? '' : filters.emailVerified.toString()}
              onChange={(e) => handleFilterChange('emailVerified', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Verification Status</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
            
            <select
              value={filters.plan || ''}
              onChange={(e) => handleFilterChange('plan', e.target.value || undefined)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center font-medium shadow-md hover:shadow-lg transition"
            >
              <Filter className="w-4 h-4 mr-2" /> Apply
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => exportToPDF(students)}
                className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center font-medium shadow-sm hover:shadow-md transition"
                title="Export to PDF"
              >
                <Download className="w-4 h-4 mr-2" /> PDF
              </button>
              <button
                onClick={() => exportToExcel(students)}
                className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center font-medium shadow-sm hover:shadow-md transition"
                title="Export to Excel"
              >
                <Download className="w-4 h-4 mr-2" /> Excel
              </button>
              <button
                onClick={() => exportToCSV(students)}
                className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center font-medium shadow-sm hover:shadow-md transition"
                title="Export to CSV"
              >
                <Download className="w-4 h-4 mr-2" /> CSV
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">No students found</h3>
            <p className="mt-2 text-gray-500">
              {filters.search ? 'Try adjusting your search or filter criteria' : 'Get started by creating a new student'}
            </p>
            {!filters.search && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 inline-flex items-center font-medium shadow-lg hover:shadow-xl transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Student
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">
                Showing <span className="text-blue-600 font-bold">{students.length}</span> student{students.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(student => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </>
        )}
      </div>

      {showCreateModal && <CreateStudentModal />}

      {showModal && selectedStudent && !modalLoading && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }} 
        />
      )}

      {modalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading student details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementSystem;
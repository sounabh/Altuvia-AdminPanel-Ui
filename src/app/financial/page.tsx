/* eslint-disable @typescript-eslint/no-unused-vars */
// app/tuition-management/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import TuitionBreakdownForm from './components/TutionBreakdown';
import { 
  TuitionBreakdown, 
  University, 
  Program, 
  TuitionBreakdownFilters,
  PaginatedResponse,
  ACADEMIC_YEARS,
  YEAR_NUMBERS 
} from './types/finanance';
import { 
  getTuitionBreakdowns, 
  deleteTuitionBreakdown,
  getTuitionAnalytics 
} from './action/action';

// Mock data for universities and programs
const mockUniversities: University[] = [
  { id: '1', universityName: 'Stanford University', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', universityName: 'MIT', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', universityName: 'Harvard University', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', universityName: 'UC Berkeley', createdAt: new Date(), updatedAt: new Date() },
];

const mockPrograms: Program[] = [
  { id: '1', programName: 'Computer Science', universityId: '1', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', programName: 'Business Administration', universityId: '1', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', programName: 'Engineering', universityId: '2', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', programName: 'Medicine', universityId: '3', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', programName: 'Law', universityId: '4', createdAt: new Date(), updatedAt: new Date() },
];

const TuitionManagementPage = () => {
  const [tuitionBreakdowns, setTuitionBreakdowns] = useState<TuitionBreakdown[]>([]);
  const [universities] = useState<University[]>(mockUniversities);
  const [programs] = useState<Program[]>(mockPrograms);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TuitionBreakdown | null>(null);
  const [filters, setFilters] = useState<TuitionBreakdownFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [analytics, setAnalytics] = useState({
    totalTuitionBreakdowns: 0,
    activeTuitionBreakdowns: 0,
    averageGrandTotal: 0,
    totalOutstandingAmount: 0,
  });

  // Fetch tuition breakdowns
  const fetchTuitionBreakdowns = async () => {
    setIsLoading(true);
    try {
      const result = await getTuitionBreakdowns(filters, pagination.page, pagination.limit);
      setTuitionBreakdowns(result.data);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to fetch tuition breakdowns');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const result = await getTuitionAnalytics();
      setAnalytics(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  useEffect(() => {
    fetchTuitionBreakdowns();
    fetchAnalytics();
  }, [filters, pagination.page]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (breakdown: TuitionBreakdown) => {
    setEditingItem(breakdown);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tuition breakdown?')) {
      try {
        const result = await deleteTuitionBreakdown(id);
        if (result.success) {
          toast.success('Tuition breakdown deleted successfully');
          fetchTuitionBreakdowns();
          fetchAnalytics();
        } else {
          toast.error(result.error || 'Failed to delete tuition breakdown');
        }
      } catch (error) {
        toast.error('Failed to delete tuition breakdown');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchTuitionBreakdowns();
    fetchAnalytics();
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (amount: number, symbol: string = '$') => {
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getUniversityName = (universityId: string) => {
    return universities.find(u => u.id === universityId)?.universityName || 'Unknown';
  };

  const getProgramName = (programId: string | null) => {
    if (!programId) return 'General';
    return programs.find(p => p.id === programId)?.programName || 'Unknown';
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Tuition Breakdown' : 'Create Tuition Breakdown'}
            </h1>
          </div>
          <TuitionBreakdownForm
            tuitionBreakdown={editingItem || undefined}
            universities={universities}
            programs={programs}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tuition Management</h1>
              <p className="text-gray-600 mt-2">Manage university tuition breakdowns and payment schedules</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Tuition Breakdown</span>
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Breakdowns</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalTuitionBreakdowns}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Breakdowns</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeTuitionBreakdowns}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageGrandTotal)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Download className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalOutstandingAmount)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Upload className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search breakdowns..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <select
                value={filters.universityId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, universityId: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Universities</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.universityName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <select
                value={filters.academicYear || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, academicYear: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {ACADEMIC_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.isActive === undefined ? '' : filters.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isActive: e.target.value === '' ? undefined : e.target.value === 'active' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University & Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Tuition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grand Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tuitionBreakdowns.map((breakdown) => (
                  <tr key={breakdown.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getUniversityName(breakdown.universityId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getProgramName(breakdown.programId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {breakdown.academicYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Year {breakdown.yearNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(breakdown.baseTuition, breakdown.currencySymbol)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(breakdown.grandTotal, breakdown.currencySymbol)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        breakdown.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {breakdown.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(breakdown)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(breakdown.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tuitionBreakdowns.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No tuition breakdowns found
                    </td>
                  </tr>
                )}
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionManagementPage;
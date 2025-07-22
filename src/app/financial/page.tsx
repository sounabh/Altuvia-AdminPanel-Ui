/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/tuition-management/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import TuitionBreakdownForm from './components/TutionBreakdown';
import { 
  getTuitionBreakdowns, 
  deleteTuitionBreakdown,
  getTuitionAnalytics,
  getUniversities,
  getProgramsByUniversity
} from './action/action';
import { 
  TuitionBreakdown, 
  University, 
  Program, 
  TuitionBreakdownFilters,
  TuitionAnalytics,
  ACADEMIC_YEARS,
  YEAR_NUMBERS,
} from './types/finanance';

const TuitionManagementPage = () => {
  const [tuitionBreakdowns, setTuitionBreakdowns] = useState<TuitionBreakdown[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
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
  const [analytics, setAnalytics] = useState<TuitionAnalytics>({
    totalTuitionBreakdowns: 0,
    totalPaymentSchedules: 0,
    averageBaseTuition: 0,
    averageGrandTotal: 0,
    totalOutstandingAmount: 0,
    activeTuitionBreakdowns: 0,
    upcomingPayments: 0,
    overduePayments: 0,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [unis, breakdowns, analyticsData] = await Promise.all([
          getUniversities(),
          getTuitionBreakdowns(filters, pagination.page, pagination.limit),
          getTuitionAnalytics()
        ]);
        
        setUniversities(unis);
        setTuitionBreakdowns(breakdowns.data);
        setPagination({
          ...pagination,
          total: breakdowns.pagination.total,
          totalPages: breakdowns.pagination.totalPages,
        });
        setAnalytics(analyticsData);
      } catch (error: any) {
        toast.error('Failed to fetch initial data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [filters, pagination.page, pagination.limit]);

  // Fetch programs when university filter changes
  useEffect(() => {
    if (filters.universityId) {
      const fetchPrograms = async () => {
        try {
          const programs = await getProgramsByUniversity(filters.universityId || '');
          setPrograms(programs);
        } catch (error: any) {
          toast.error('Failed to fetch programs: ' + error.message);
        }
      };
      fetchPrograms();
    } else {
      setPrograms([]);
      setFilters(prev => ({ ...prev, programId: undefined }));
    }
  }, [filters.universityId]);

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
          // Refresh data
          const [breakdowns, analyticsData] = await Promise.all([
            getTuitionBreakdowns(filters, pagination.page, pagination.limit),
            getTuitionAnalytics()
          ]);
          setTuitionBreakdowns(breakdowns.data);
          setPagination({
            ...pagination,
            total: breakdowns.pagination.total,
            totalPages: breakdowns.pagination.totalPages,
          });
          setAnalytics(analyticsData);
        } else {
          toast.error(result.error || 'Failed to delete tuition breakdown');
        }
      } catch (error: any) {
        toast.error('Failed to delete tuition breakdown: ' + error.message);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    // Refresh data
    getTuitionBreakdowns(filters, pagination.page, pagination.limit)
      .then(breakdowns => {
        setTuitionBreakdowns(breakdowns.data);
        setPagination({
          ...pagination,
          total: breakdowns.pagination.total,
          totalPages: breakdowns.pagination.totalPages,
        });
      });
    getTuitionAnalytics().then(setAnalytics);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount: number, symbol: string = '$') => {
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.averageGrandTotal)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Download className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tuition Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalOutstandingAmount)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                value={filters.programId || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  programId: e.target.value || undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filters.universityId}
              >
                <option value="">All Programs</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>{program.programName}</option>
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
                {Object.keys(ACADEMIC_YEARS).map((year) => (
  <option key={year} value={year}>{ACADEMIC_YEARS[year]}</option>
))}

              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Number</label>
              <select
                value={filters.yearNumber !== undefined ? filters.yearNumber : ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  yearNumber: e.target.value ? Number(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
               {Object.entries(YEAR_NUMBERS).map(([key, label]) => (
  <option key={key} value={key}>Year {label}</option>
))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.isActive !== undefined ? String(filters.isActive) : ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tuition Breakdowns Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Tuition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grand Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : tuitionBreakdowns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No tuition breakdowns found
                    </td>
                  </tr>
                ) : (
                  tuitionBreakdowns.map((breakdown) => (
                    <tr key={breakdown.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {breakdown.university?.universityName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {breakdown.program?.programName || 'General'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {breakdown.academicYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Year {breakdown.yearNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(breakdown.baseTuition, breakdown.currencySymbol)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(breakdown.totalAdditionalFees, breakdown.currencySymbol)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(breakdown.grandTotal, breakdown.currencySymbol)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          breakdown.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {breakdown.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuitionManagementPage;
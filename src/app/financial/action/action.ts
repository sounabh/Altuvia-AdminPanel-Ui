/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/actions/tuition-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  CreateTuitionBreakdownData, 
  UpdateTuitionBreakdownData,
  CreatePaymentScheduleData,
  UpdatePaymentScheduleData,
  TuitionBreakdownFilters,
  PaymentScheduleFilters,
  ApiResponse,
  PaginatedResponse,
  TuitionBreakdown,
  PaymentSchedule,
  TuitionAnalytics
} from './../types/finanance';

// In a real app, you would use a database like Prisma
// For now, we'll simulate with in-memory storage
let tuitionBreakdowns: TuitionBreakdown[] = [];
let paymentSchedules: PaymentSchedule[] = [];

// Utility functions
const calculateTuitionTotals = (data: CreateTuitionBreakdownData | UpdateTuitionBreakdownData) => {
  const additionalFees = [
    data.labFees || 0,
    data.libraryFees || 0,
    data.technologyFees || 0,
    data.activityFees || 0,
    data.healthInsurance || 0,
    data.dormitoryFees || 0,
    data.mealPlanFees || 0,
    data.applicationFee || 0,
    data.registrationFee || 0,
    data.examFees || 0,
    data.graduationFee || 0,
  ].reduce((sum, fee) => sum + fee, 0);

  const totalTuition = data.baseTuition || 0;
  const grandTotal = totalTuition + additionalFees;

  return {
    totalTuition,
    totalAdditionalFees: additionalFees,
    grandTotal,
  };
};

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Tuition Breakdown Actions
export async function createTuitionBreakdown(
  data: CreateTuitionBreakdownData
): Promise<ApiResponse<TuitionBreakdown>> {
  try {
    const totals = calculateTuitionTotals(data);
    
    const newTuitionBreakdown: TuitionBreakdown = {
      id: generateId(),
      universityId: data.universityId,
      programId: data.programId || null,
      academicYear: data.academicYear,
      yearNumber: data.yearNumber,
      baseTuition: data.baseTuition,
      labFees: data.labFees || 0,
      libraryFees: data.libraryFees || 0,
      technologyFees: data.technologyFees || 0,
      activityFees: data.activityFees || 0,
      healthInsurance: data.healthInsurance || 0,
      dormitoryFees: data.dormitoryFees || 0,
      mealPlanFees: data.mealPlanFees || 0,
      applicationFee: data.applicationFee || 0,
      registrationFee: data.registrationFee || 0,
      examFees: data.examFees || 0,
      graduationFee: data.graduationFee || 0,
      ...totals,
      currency: data.currency || 'USD',
      currencySymbol: data.currencySymbol || '$',
      paymentTerms: data.paymentTerms || null,
      installmentCount: data.installmentCount || 1,
      isActive: data.isActive ?? true,
      effectiveDate: data.effectiveDate,
      expiryDate: data.expiryDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tuitionBreakdowns.push(newTuitionBreakdown);
    revalidatePath('/tuition-breakdowns');
    
    return {
      success: true,
      data: newTuitionBreakdown,
      message: 'Tuition breakdown created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tuition breakdown',
    };
  }
}

export async function updateTuitionBreakdown(
  data: UpdateTuitionBreakdownData
): Promise<ApiResponse<TuitionBreakdown>> {
  try {
    const index = tuitionBreakdowns.findIndex(tb => tb.id === data.id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Tuition breakdown not found',
      };
    }

    const totals = calculateTuitionTotals(data);
    const existing = tuitionBreakdowns[index];
    
    const updatedTuitionBreakdown: TuitionBreakdown = {
      ...existing,
      ...data,
      ...totals,
      updatedAt: new Date(),
    };

    tuitionBreakdowns[index] = updatedTuitionBreakdown;
    revalidatePath('/tuition-breakdowns');
    
    return {
      success: true,
      data: updatedTuitionBreakdown,
      message: 'Tuition breakdown updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tuition breakdown',
    };
  }
}

export async function deleteTuitionBreakdown(id: string): Promise<ApiResponse<void>> {
  try {
    const index = tuitionBreakdowns.findIndex(tb => tb.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Tuition breakdown not found',
      };
    }

    // Also delete related payment schedules
    paymentSchedules = paymentSchedules.filter(ps => ps.tuitionBreakdownId !== id);
    tuitionBreakdowns.splice(index, 1);
    
    revalidatePath('/tuition-breakdowns');
    
    return {
      success: true,
      message: 'Tuition breakdown deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tuition breakdown',
    };
  }
}

export async function getTuitionBreakdowns(
  filters: TuitionBreakdownFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<TuitionBreakdown>> {
  let filteredData = tuitionBreakdowns;

  // Apply filters
  if (filters.universityId) {
    filteredData = filteredData.filter(tb => tb.universityId === filters.universityId);
  }
  
  if (filters.programId) {
    filteredData = filteredData.filter(tb => tb.programId === filters.programId);
  }
  
  if (filters.academicYear) {
    filteredData = filteredData.filter(tb => tb.academicYear === filters.academicYear);
  }
  
  if (filters.yearNumber) {
    filteredData = filteredData.filter(tb => tb.yearNumber === filters.yearNumber);
  }
  
  if (filters.isActive !== undefined) {
    filteredData = filteredData.filter(tb => tb.isActive === filters.isActive);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(tb => 
      tb.academicYear.toLowerCase().includes(searchTerm) ||
      tb.currency.toLowerCase().includes(searchTerm) ||
      tb.paymentTerms?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply pagination
  const total = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTuitionBreakdownById(id: string): Promise<TuitionBreakdown | null> {
  return tuitionBreakdowns.find(tb => tb.id === id) || null;
}

// Payment Schedule Actions
export async function createPaymentSchedule(
  data: CreatePaymentScheduleData
): Promise<ApiResponse<PaymentSchedule>> {
  try {
    const newPaymentSchedule: PaymentSchedule = {
      id: generateId(),
      tuitionBreakdownId: data.tuitionBreakdownId,
      installmentNumber: data.installmentNumber,
      dueDate: data.dueDate,
      amount: data.amount,
      description: data.description || null,
      lateFee: data.lateFee || 0,
      gracePeroidDays: data.gracePeroidDays || 0,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    paymentSchedules.push(newPaymentSchedule);
    revalidatePath('/payment-schedules');
    
    return {
      success: true,
      data: newPaymentSchedule,
      message: 'Payment schedule created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment schedule',
    };
  }
}

export async function updatePaymentSchedule(
  data: UpdatePaymentScheduleData
): Promise<ApiResponse<PaymentSchedule>> {
  try {
    const index = paymentSchedules.findIndex(ps => ps.id === data.id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Payment schedule not found',
      };
    }

    const existing = paymentSchedules[index];
    const updatedPaymentSchedule: PaymentSchedule = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    paymentSchedules[index] = updatedPaymentSchedule;
    revalidatePath('/payment-schedules');
    
    return {
      success: true,
      data: updatedPaymentSchedule,
      message: 'Payment schedule updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment schedule',
    };
  }
}

export async function deletePaymentSchedule(id: string): Promise<ApiResponse<void>> {
  try {
    const index = paymentSchedules.findIndex(ps => ps.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Payment schedule not found',
      };
    }

    paymentSchedules.splice(index, 1);
    revalidatePath('/payment-schedules');
    
    return {
      success: true,
      message: 'Payment schedule deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete payment schedule',
    };
  }
}

export async function getPaymentSchedules(
  filters: PaymentScheduleFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<PaymentSchedule>> {
  let filteredData = paymentSchedules;

  // Apply filters
  if (filters.tuitionBreakdownId) {
    filteredData = filteredData.filter(ps => ps.tuitionBreakdownId === filters.tuitionBreakdownId);
  }
  
  if (filters.installmentNumber) {
    filteredData = filteredData.filter(ps => ps.installmentNumber === filters.installmentNumber);
  }
  
  if (filters.isActive !== undefined) {
    filteredData = filteredData.filter(ps => ps.isActive === filters.isActive);
  }
  
  if (filters.dueDateFrom || filters.dueDateTo) {
    filteredData = filteredData.filter(ps => {
      const dueDate = new Date(ps.dueDate);
      if (filters.dueDateFrom && dueDate < filters.dueDateFrom) return false;
      if (filters.dueDateTo && dueDate > filters.dueDateTo) return false;
      return true;
    });
  }

  // Apply pagination
  const total = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPaymentScheduleById(id: string): Promise<PaymentSchedule | null> {
  return paymentSchedules.find(ps => ps.id === id) || null;
}

// Analytics Actions
export async function getTuitionAnalytics(): Promise<TuitionAnalytics> {
  const totalTuitionBreakdowns = tuitionBreakdowns.length;
  const totalPaymentSchedules = paymentSchedules.length;
  
  const activeTuitionBreakdowns = tuitionBreakdowns.filter(tb => tb.isActive).length;
  
  const averageBaseTuition = totalTuitionBreakdowns > 0 
    ? tuitionBreakdowns.reduce((sum, tb) => sum + tb.baseTuition, 0) / totalTuitionBreakdowns 
    : 0;
    
  const averageGrandTotal = totalTuitionBreakdowns > 0 
    ? tuitionBreakdowns.reduce((sum, tb) => sum + tb.grandTotal, 0) / totalTuitionBreakdowns 
    : 0;

  const totalOutstandingAmount = paymentSchedules
    .filter(ps => ps.isActive)
    .reduce((sum, ps) => sum + ps.amount, 0);

  const now = new Date();
  const upcomingPayments = paymentSchedules.filter(ps => 
    ps.isActive && new Date(ps.dueDate) > now
  ).length;

  const overduePayments = paymentSchedules.filter(ps => 
    ps.isActive && new Date(ps.dueDate) < now
  ).length;

  return {
    totalTuitionBreakdowns,
    totalPaymentSchedules,
    averageBaseTuition,
    averageGrandTotal,
    totalOutstandingAmount,
    activeTuitionBreakdowns,
    upcomingPayments,
    overduePayments,
  };
}

// Bulk Actions
export async function bulkUpdateTuitionBreakdowns(
  ids: string[],
  updates: Partial<TuitionBreakdown>
): Promise<ApiResponse<TuitionBreakdown[]>> {
  try {
    const updatedBreakdowns: TuitionBreakdown[] = [];
    
    for (const id of ids) {
      const index = tuitionBreakdowns.findIndex(tb => tb.id === id);
      if (index !== -1) {
        const updated = { ...tuitionBreakdowns[index], ...updates, updatedAt: new Date() };
        tuitionBreakdowns[index] = updated;
        updatedBreakdowns.push(updated);
      }
    }
    
    revalidatePath('/tuition-breakdowns');
    
    return {
      success: true,
      data: updatedBreakdowns,
      message: `Updated ${updatedBreakdowns.length} tuition breakdowns successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk update tuition breakdowns',
    };
  }
}

export async function bulkDeleteTuitionBreakdowns(ids: string[]): Promise<ApiResponse<void>> {
  try {
    // Remove tuition breakdowns and related payment schedules
    tuitionBreakdowns = tuitionBreakdowns.filter(tb => !ids.includes(tb.id));
    paymentSchedules = paymentSchedules.filter(ps => !ids.includes(ps.tuitionBreakdownId));
    
    revalidatePath('/tuition-breakdowns');
    
    return {
      success: true,
      message: `Deleted ${ids.length} tuition breakdowns successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk delete tuition breakdowns',
    };
  }
}
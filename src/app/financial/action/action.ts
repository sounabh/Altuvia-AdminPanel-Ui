/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tuition-management/action/action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { 
  TuitionBreakdown, 
  CreateTuitionBreakdownFormData, 
  UpdateTuitionBreakdownFormData,
  TuitionBreakdownFilters,
  PaginatedResponse,
  ApiResponse,
  TuitionAnalytics,
  University,
  Program
} from '../types/finanance';

// Helper function to convert null fee fields to 0
const convertNullFeesToZero = (data: any) => ({
  ...data,
  labFees: data.labFees ?? 0,
  libraryFees: data.libraryFees ?? 0,
  technologyFees: data.technologyFees ?? 0,
  activityFees: data.activityFees ?? 0,
  healthInsurance: data.healthInsurance ?? 0,
  dormitoryFees: data.dormitoryFees ?? 0,
  mealPlanFees: data.mealPlanFees ?? 0,
  applicationFee: data.applicationFee ?? 0,
  registrationFee: data.registrationFee ?? 0,
  examFees: data.examFees ?? 0,
  graduationFee: data.graduationFee ?? 0
});




interface TuitionTotalsInput {
  baseTuition: number;
  labFees?: number | null;
  libraryFees?: number | null;
  technologyFees?: number | null;
  activityFees?: number | null;
  healthInsurance?: number | null;
  dormitoryFees?: number | null;
  mealPlanFees?: number | null;
  applicationFee?: number | null;
  registrationFee?: number | null;
  examFees?: number | null;
  graduationFee?: number | null;
}


// Helper function to calculate totals
const calculateTuitionTotals = (data: TuitionTotalsInput) => {
  const safeData = convertNullFeesToZero(data);
  
  const additionalFees = 
    safeData.labFees +
    safeData.libraryFees +
    safeData.technologyFees +
    safeData.activityFees +
    safeData.healthInsurance +
    safeData.dormitoryFees +
    safeData.mealPlanFees +
    safeData.applicationFee +
    safeData.registrationFee +
    safeData.examFees +
    safeData.graduationFee;

  const totalTuition = safeData.baseTuition;
  const grandTotal = totalTuition + additionalFees;

  return {
    totalAdditionalFees: additionalFees,
    totalTuition,
    grandTotal
  };
};

// University Actions
export async function getUniversities(): Promise<University[]> {
  try {
    return await prisma.university.findMany({
      include: { programs: true }
    });
  } catch (error: any) {
    throw new Error('Failed to fetch universities: ' + error.message);
  }
}

// Program Actions
export async function getProgramsByUniversity(universityId: string): Promise<Program[]> {
  try {
    return await prisma.program.findMany({
      where: { universityId },
      include: { university: true }
    });
  } catch (error: any) {
    throw new Error('Failed to fetch programs: ' + error.message);
  }
}

// Tuition Breakdown Actions
export async function createTuitionBreakdown(
  data: CreateTuitionBreakdownFormData
): Promise<ApiResponse<TuitionBreakdown>> {
  try {
    // Validate university exists
    const university = await prisma.university.findUnique({
      where: { id: data.universityId || '' }
    });

    if (!university) {
      return { success: false, error: 'University not found' };
    }

    // Validate program exists if provided
    if (data.programId) {
      const program = await prisma.program.findUnique({
        where: { id: data.programId }
      });

      if (!program || program.universityId !== data.universityId) {
        return { success: false, error: 'Program not found or does not belong to the university' };
      }
    }

    const { totalAdditionalFees, totalTuition, grandTotal } = calculateTuitionTotals(data as TuitionTotalsInput);

    const tuitionBreakdown = await prisma.tuitionBreakdown.create({
      data: {
        universityId: data.universityId || '',
        programId: data.programId || null,
        academicYear: data.academicYear || '',
        yearNumber: data.yearNumber  || 1,
        baseTuition: data.baseTuition || 0,
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
        totalTuition,
        totalAdditionalFees,
        grandTotal,
        currency: data.currency || 'USD',
        currencySymbol: data.currencySymbol || '$',
        paymentTerms: data.paymentTerms || null,
        installmentCount: data.installmentCount || 1,
        isActive: data.isActive ?? true,
        effectiveDate: data.effectiveDate || new Date(),
        expiryDate: data.expiryDate || null,
      },
      include: {
        university: true,
        program: true,
      }
    });

    return {
      success: true,
      data: convertNullFeesToZero(tuitionBreakdown),
      message: 'Tuition breakdown created successfully'
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Failed to create tuition breakdown: ' + error.message 
    };
  }
}

export async function updateTuitionBreakdown(
  data: UpdateTuitionBreakdownFormData
): Promise<ApiResponse<TuitionBreakdown>> {
  try {
    const existing = await prisma.tuitionBreakdown.findUnique({
      where: { id: data.id }
    });

    if (!existing) {
      return { success: false, error: 'Tuition breakdown not found' };
    }

    // Validate university if provided
    if (data.universityId) {
      const university = await prisma.university.findUnique({
        where: { id: data.universityId }
      });
      if (!university) {
        return { success: false, error: 'University not found' };
      }
    }

    // Validate program if provided
    if (data.programId) {
      const program = await prisma.program.findUnique({
        where: { id: data.programId }
      });
      const universityId = data.universityId || existing.universityId;
      if (!program || program.universityId !== universityId) {
        return { success: false, error: 'Program not found or does not belong to the university' };
      }
    }

    // Create a new merged object with explicit type
    const mergedData = {
      baseTuition: data.baseTuition ?? existing.baseTuition,
      labFees: data.labFees ?? existing.labFees,
      libraryFees: data.libraryFees ?? existing.libraryFees,
      technologyFees: data.technologyFees ?? existing.technologyFees,
      activityFees: data.activityFees ?? existing.activityFees,
      healthInsurance: data.healthInsurance ?? existing.healthInsurance,
      dormitoryFees: data.dormitoryFees ?? existing.dormitoryFees,
      mealPlanFees: data.mealPlanFees ?? existing.mealPlanFees,
      applicationFee: data.applicationFee ?? existing.applicationFee,
      registrationFee: data.registrationFee ?? existing.registrationFee,
      examFees: data.examFees ?? existing.examFees,
      graduationFee: data.graduationFee ?? existing.graduationFee,
    };

    const { totalAdditionalFees, totalTuition, grandTotal } = calculateTuitionTotals(mergedData);

    const updated = await prisma.tuitionBreakdown.update({
      where: { id: data.id },
      data: {
        universityId: data.universityId ?? existing.universityId,
        programId: data.programId ?? existing.programId,
        academicYear: data.academicYear ?? existing.academicYear,
        yearNumber: data.yearNumber ?? existing.yearNumber,
        baseTuition: data.baseTuition ?? existing.baseTuition,
        labFees: data.labFees ?? existing.labFees,
        libraryFees: data.libraryFees ?? existing.libraryFees,
        technologyFees: data.technologyFees ?? existing.technologyFees,
        activityFees: data.activityFees ?? existing.activityFees,
        healthInsurance: data.healthInsurance ?? existing.healthInsurance,
        dormitoryFees: data.dormitoryFees ?? existing.dormitoryFees,
        mealPlanFees: data.mealPlanFees ?? existing.mealPlanFees,
        applicationFee: data.applicationFee ?? existing.applicationFee,
        registrationFee: data.registrationFee ?? existing.registrationFee,
        examFees: data.examFees ?? existing.examFees,
        graduationFee: data.graduationFee ?? existing.graduationFee,
        totalTuition,
        totalAdditionalFees,
        grandTotal,
        currency: data.currency ?? existing.currency,
        currencySymbol: data.currencySymbol ?? existing.currencySymbol,
        paymentTerms: data.paymentTerms ?? existing.paymentTerms,
        installmentCount: data.installmentCount ?? existing.installmentCount,
        isActive: data.isActive ?? existing.isActive,
        effectiveDate: data.effectiveDate ?? existing.effectiveDate,
        expiryDate: data.expiryDate ?? existing.expiryDate,
      },
      include: {
        university: true,
        program: true,
      }
    });

    return {
      success: true,
      data: convertNullFeesToZero(updated),
      message: 'Tuition breakdown updated successfully'
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Failed to update tuition breakdown: ' + error.message 
    };
  }
}

export async function getTuitionBreakdowns(
  filters: TuitionBreakdownFilters = {},
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<TuitionBreakdown>> {
  try {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.universityId) where.universityId = filters.universityId;
    if (filters.programId !== undefined) {
      where.programId = filters.programId === null ? null : filters.programId;
    }
    if (filters.academicYear) where.academicYear = filters.academicYear;
    if (filters.yearNumber !== undefined) where.yearNumber = filters.yearNumber;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    if (filters.search) {
      where.OR = [
        { university: { universityName: { contains: filters.search, mode: 'insensitive' } } },
        { program: { programName: { contains: filters.search, mode: 'insensitive' } } },
        { academicYear: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [total, data] = await Promise.all([
      prisma.tuitionBreakdown.count({ where }),
      prisma.tuitionBreakdown.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { academicYear: 'desc' }, { yearNumber: 'asc' }],
        include: {
          university: true,
          program: true,
        }
      })
    ]);

    // Convert null fee values to 0
    const sanitizedData = data.map(breakdown => convertNullFeesToZero(breakdown));

    return {
      data: sanitizedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    throw new Error('Failed to fetch tuition breakdowns: ' + error.message);
  }
}

export async function getTuitionBreakdownById(
  id: string
): Promise<ApiResponse<TuitionBreakdown>> {
  try {
    const breakdown = await prisma.tuitionBreakdown.findUnique({
      where: { id },
      include: {
        university: true,
        program: true,
      }
    });

    if (!breakdown) {
      return { success: false, error: 'Tuition breakdown not found' };
    }

    return { 
      success: true, 
      data: convertNullFeesToZero(breakdown) 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Failed to fetch tuition breakdown: ' + error.message 
    };
  }
}

export async function deleteTuitionBreakdown(
  id: string
): Promise<ApiResponse<null>> {
  try {
    await prisma.tuitionBreakdown.delete({ where: { id } });
    return { success: true, message: 'Tuition breakdown deleted successfully' };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Failed to delete tuition breakdown: ' + error.message 
    };
  }
}

export async function getTuitionAnalytics(): Promise<TuitionAnalytics> {
  try {
    const [
      totalTuitionBreakdowns,
      activeTuitionBreakdowns,
      totalPaymentSchedules,
      averageStats,
      upcomingPayments,
      overduePayments
    ] = await Promise.all([
      prisma.tuitionBreakdown.count(),
      prisma.tuitionBreakdown.count({ where: { isActive: true } }),
      prisma.paymentSchedule.count(),
      prisma.tuitionBreakdown.aggregate({
        _avg: { baseTuition: true, grandTotal: true },
        _sum: { grandTotal: true }
      }),
      prisma.paymentSchedule.count({
        where: {
          dueDate: { gte: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          isActive: true
        }
      }),
      prisma.paymentSchedule.count({
        where: { dueDate: { lt: new Date() }, isActive: true }
      })
    ]);

    return {
      totalTuitionBreakdowns,
      totalPaymentSchedules,
      averageBaseTuition: averageStats._avg.baseTuition || 0,
      averageGrandTotal: averageStats._avg.grandTotal || 0,
      totalOutstandingAmount: averageStats._sum.grandTotal || 0,
      activeTuitionBreakdowns,
      upcomingPayments,
      overduePayments
    };
  } catch (error: any) {
    throw new Error('Failed to fetch tuition analytics: ' + error.message);
  }
}
// lib/types/index.ts

export interface University {
  id: string;
  universityName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  programName: string;
  universityId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TuitionBreakdown {
  id: string;
  universityId: string;
  programId: string | null;
  academicYear: string;
  yearNumber: number;
  baseTuition: number;
  labFees: number;
  libraryFees: number;
  technologyFees: number;
  activityFees: number;
  healthInsurance: number;
  dormitoryFees: number;
  mealPlanFees: number;
  applicationFee: number;
  registrationFee: number;
  examFees: number;
  graduationFee: number;
  totalTuition: number;
  totalAdditionalFees: number;
  grandTotal: number;
  currency: string;
  currencySymbol: string;
  paymentTerms: string | null;
  installmentCount: number;
  isActive: boolean;
  effectiveDate: Date;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  university?: University;
  program?: Program;
  paymentSchedule?: PaymentSchedule[];
}

export interface PaymentSchedule {
  id: string;
  tuitionBreakdownId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  description: string | null;
  lateFee: number;
  gracePeroidDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  tuitionBreakdown?: TuitionBreakdown;
}

// Form Types
export interface CreateTuitionBreakdownData {
  universityId: string;
  programId?: string;
  academicYear: string;
  yearNumber: number;
  baseTuition: number;
  labFees?: number;
  libraryFees?: number;
  technologyFees?: number;
  activityFees?: number;
  healthInsurance?: number;
  dormitoryFees?: number;
  mealPlanFees?: number;
  applicationFee?: number;
  registrationFee?: number;
  examFees?: number;
  graduationFee?: number;
  currency?: string;
  currencySymbol?: string;
  paymentTerms?: string;
  installmentCount?: number;
  isActive?: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
}

export interface UpdateTuitionBreakdownData extends Partial<CreateTuitionBreakdownData> {
  id: string;
}

export interface CreatePaymentScheduleData {
  tuitionBreakdownId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  description?: string;
  lateFee?: number;
  gracePeroidDays?: number;
  isActive?: boolean;
}

export interface UpdatePaymentScheduleData extends Partial<CreatePaymentScheduleData> {
  id: string;
}

// Filter Types
export interface TuitionBreakdownFilters {
  universityId?: string;
  programId?: string;
  academicYear?: string;
  yearNumber?: number;
  isActive?: boolean;
  search?: string;
}

export interface PaymentScheduleFilters {
  tuitionBreakdownId?: string;
  installmentNumber?: number;
  isActive?: boolean;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

// Analytics Types
export interface TuitionAnalytics {
  totalTuitionBreakdowns: number;
  totalPaymentSchedules: number;
  averageBaseTuition: number;
  averageGrandTotal: number;
  totalOutstandingAmount: number;
  activeTuitionBreakdowns: number;
  upcomingPayments: number;
  overduePayments: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Constants
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
] as const;

export const ACADEMIC_YEARS = [
  '2024-25',
  '2025-26',
  '2026-27',
  '2027-28',
] as const;


// Constants
export const PAYMENT_TERMS = [
  'Full Payment',
  'Semester-wise',
  'Quarterly',
  'Monthly',
  'Custom',
] as const;


export const YEAR_NUMBERS = [1, 2, 3, 4, 5, 6] as const;
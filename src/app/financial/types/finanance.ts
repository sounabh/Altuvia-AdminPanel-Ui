// app/tuition-management/actions/tuition-actions.ts




// Types (move these to a separate types file later)
export interface University {
  id: string;
  universityName: string;
  createdAt: Date;
  updatedAt: Date;
  programs?: Program[];
}

export interface Program {
  id: string;
  programName: string;
  universityId: string;
  createdAt: Date;
  updatedAt: Date;
  university?: University;
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
  gracePeriodDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  tuitionBreakdown?: TuitionBreakdown;
}

// Form Types
export interface CreateTuitionBreakdownFormData {
  universityId: string | null;
  programId?: string | null;
  academicYear: string | null;
  yearNumber: number | null;
  baseTuition: number | null;
  labFees?: number | null;
  libraryFees?: number | null;
  technologyFees?: number | null;
  activityFees?: number | null;
  healthInsurance?: number | null;
  dormitoryFees?: number | null;
  mealPlanFees?: number | null;
  applicationFee?: number  | null;
  registrationFee?: number | null;
  examFees?: number | null;
  graduationFee?: number | null;
  currency?: string | null;
  currencySymbol?: string | null;
  paymentTerms?: string | null;
  installmentCount?: number | null;
  isActive?: boolean | null;
  effectiveDate: Date | null;
  expiryDate?: Date | null;
}

export interface UpdateTuitionBreakdownFormData extends Partial<CreateTuitionBreakdownFormData> {
  id: string;
}

export interface CreatePaymentScheduleFormData {
  tuitionBreakdownId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  description?: string;
  lateFee?: number;
  gracePeriodDays?: number;
  isActive?: boolean;
}

export interface UpdatePaymentScheduleFormData extends Partial<CreatePaymentScheduleFormData> {
  id: string;
}

// Filter Types
export interface TuitionBreakdownFilters {
  universityId?: string;
  programId?: string | null;
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

export const ACADEMIC_YEARS: Record<string, string> = {
  "2021-2022": "2021–2022",
  "2022-2023": "2022–2023",
  "2023-2024": "2023–2024",
  "2024-2025": "2024–2025",
};

export const PAYMENT_TERMS = [
  'Full Payment',
  'Semester-wise',
  'Quarterly',
  'Monthly',
  'Custom',
] as const;

export const YEAR_NUMBERS = [1, 2, 3, 4, 5, 6] as const;


// Ensure all types are properly defined
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface University {
  id: string;
  universityName: string;
}

export interface Program {
  id: string;
  programName: string;
  universityId: string;
}

    
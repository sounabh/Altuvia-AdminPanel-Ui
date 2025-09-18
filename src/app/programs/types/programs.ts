/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Department {
  id: string;
  universityId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  universityId: string;
  // Remove departmentId field for many-to-many relationship
  programName: string;
  programSlug: string;
  degreeType: string | null;
  programLength: number | null;
  specializations: string | null;
  programDescription: string | null;
  curriculumOverview: string | null;
  admissionRequirements: string | null;
  averageEntranceScore: number | null;
  programTuitionFees: number | null;
  programAdditionalFees: number | null;
  programMetaTitle: string | null;
  programMetaDescription: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Syllabus {
  id: string;
  programId: string;
  fileUrl: string;
  uploadedAt: string | Date;
}

export interface ProgramRanking {
  id: string;
  programId: string;
  year: number;
  rank: number;
  source: string | null;
  createdAt: Date;
}

export interface ExternalLink {
  id: string;
  programId: string;
  title: string;
  url: string;
  createdAt: Date;
}

// Junction table type
export interface ProgramDepartment {
  id: string;
  programId: string;
  departmentId: string;
  createdAt: Date;
  // Relations
  department?: Department;
  program?: Program;
}

// Extended types with relations
export interface DepartmentWithPrograms extends Department {
  programs: Array<{
    program: Pick<Program, 'id' | 'programName' | 'degreeType' | 'isActive'>;
  }>;
  _count: {
    programs: number;
  };
}

export interface ProgramWithRelations extends Program {
  departments: Array<{
    department: Department;
  }>;
  university: {
    id: string;
    universityName: string;
    slug: string;
  };
  syllabus?: Syllabus | null;
  rankings: ProgramRanking[];
  externalLinks: ExternalLink[];
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
  };
}

export interface ProgramWithFullRelations extends ProgramWithRelations {
  admissions: any[]; // Define proper type based on your admission model
  tuitionBreakdowns: any[]; // Define proper type based on your tuition model
  scholarships: any[]; // Define proper type based on your scholarship model
  feeStructures: any[]; // Define proper type based on your fee structure model
  financialAids: any[]; // Define proper type based on your financial aid model
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
    feeStructures: number;
    financialAids: number;
    externalLinks: number;
  };
}

export interface ProgramSearchResult extends ProgramWithRelations {
  rankings: ProgramRanking[];
}

export interface University {
  id: string;
  name: string;
  slug: string;
}

export interface UniversityForProgram {
  id: string;
  universityName: string;
  slug: string;
}

// Input types for create/update operations
export interface CreateDepartmentInput {
  universityId: string;
  name: string;
  slug: string;
}

export interface UpdateDepartmentInput {
  id: string;
  name?: string;
  slug?: string;
}

export interface CreateProgramInput {
  universityId: string;
  departmentIds: string[]; // Changed from departmentId to departmentIds array
  programName: string;
  programSlug: string;
  degreeType?: string;
  programLength?: number;
  specializations?: string;
  programDescription?: string;
  curriculumOverview?: string;
  admissionRequirements?: string;
  averageEntranceScore?: number;
  programTuitionFees?: number;
  programAdditionalFees?: number;
  programMetaTitle?: string;
  programMetaDescription?: string;
  isActive?: boolean;
}

export interface UpdateProgramInput {
  id: string;
  universityId?: string;
  departmentIds?: string[]; // Changed from departmentId to departmentIds array
  programName?: string;
  programSlug?: string;
  degreeType?: string;
  programLength?: number;
  specializations?: string;
  programDescription?: string;
  curriculumOverview?: string;
  admissionRequirements?: string;
  averageEntranceScore?: number;
  programTuitionFees?: number;
  programAdditionalFees?: number;
  programMetaTitle?: string;
  programMetaDescription?: string;
  isActive?: boolean;
}

export interface CreateSyllabusInput {
  programId: string;
  fileUrl: string;
}

export interface CreateProgramRankingInput {
  programId: string;
  year: number;
  rank: number;
  source?: string;
}

export interface UpdateProgramRankingInput {
  rank?: number;
  source?: string;
}

export interface CreateExternalLinkInput {
  programId: string;
  title: string;
  url: string;
}

export interface UpdateExternalLinkInput {
  title?: string;
  url?: string;
}

export interface SearchProgramsFilters {
  universityId?: string;
  departmentIds?: string[]; // Changed from departmentId to departmentIds array
  degreeType?: string;
  isActive?: boolean;
}

// Action result type for server actions
export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
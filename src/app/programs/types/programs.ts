/* eslint-disable @typescript-eslint/no-explicit-any */

// Base interfaces
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

export interface ProgramDepartment {
  id: string;
  programId: string;
  departmentId: string;
  createdAt: Date;
  department?: Department;
  program?: Program;
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

// Extended types with relations
export interface DepartmentWithPrograms extends Department {
  university: UniversityForProgram;
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
  university: UniversityForProgram;
  syllabus?: Syllabus | null;
  rankings: ProgramRanking[];
  externalLinks: ExternalLink[];
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
  };
}

export interface ProgramWithFullRelations extends Program {
  departments: Array<{
    department: Department;
  }>;
  university: UniversityForProgram;
  syllabus?: Syllabus | null;
  rankings: ProgramRanking[];
  externalLinks: ExternalLink[];
  admissions: any[];
  tuitionBreakdowns: any[];
  scholarships: any[];
  feeStructures: any[];
  financialAids: any[];
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
    feeStructures: number;
    financialAids: number;
    externalLinks: number;
  };
}

export interface ProgramSearchResult extends Program {
  departments: Array<{
    department: Department;
  }>;
  university: UniversityForProgram;
  rankings: ProgramRanking[];
  _count?: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
  };
}

// Input types
export interface CreateDepartmentInput {
  universityId: string;
  name: string;
  slug: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  slug?: string;
  universityId?: string;
}

export interface CreateProgramInput {
  universityId: string;
  departmentIds: string[];
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
  universityId?: string;
  departmentIds?: string[];
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
  year?: number;
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
  departmentIds?: string[];
  degreeType?: string;
  isActive?: boolean;
}

// Action result types
export interface ActionResultSuccess<T> {
  success: true;
  data: T;
}

export interface ActionResultError {
  success: false;
  error: string;
}

export type ActionResult<T> = ActionResultSuccess<T> | ActionResultError;

// Debug info interface
export interface DebugInfo {
  totalPrograms: number;
  totalValidPrograms: number;
  programDepartments: number;
  samplePrograms: any[];
  orphanedRelations: number;
  orphanedUniversities: number;
}
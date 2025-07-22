/* eslint-disable @typescript-eslint/no-explicit-any */
// types/programs.ts - Complete types file

// Base entity types
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
  departmentId: string;
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
  uploadedAt: Date;
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
  departmentId: string;
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

export type UpdateProgramInput = {
  id: string;
  universityId: string;
  departmentId: string;
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
  isActive: boolean;
};

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
  departmentId?: string;
  degreeType?: string;
  isActive?: boolean;
}

// Extended types for queries with relations
export interface DepartmentWithPrograms extends Department {
  [x: string]: any;
  programs: Array<{
    id: string;
    programName: string;
    degreeType: string | null;
    isActive: boolean;
  }>;
  _count: {
    programs: number;
  };
}

export interface UniversityForProgram {
  id: string;
  universityName: string;
  slug: string;
}

export interface ProgramWithRelations extends Program {
  department: Department;
  university: UniversityForProgram;
  syllabus: Syllabus | null;
  rankings: ProgramRanking[];
  externalLinks: ExternalLink[];
  _count: {
    admissions: number;
    scholarships: number;
    tuitionBreakdowns: number;
  };
}

export interface ProgramWithFullRelations extends Program {
  _count: any;
  department: Department;
  university: UniversityForProgram;
  syllabus: Syllabus | null;
  rankings: ProgramRanking[];
  externalLinks: ExternalLink[];
  admissions: Array<{ id: string; createdAt: Date }>;
  tuitionBreakdowns: Array<{ id: string }>;
  scholarships: Array<{ id: string; isActive: boolean }>;
  feeStructures: Array<{ id: string }>;
  financialAids: Array<{ id: string; isActive: boolean }>;
}

export interface ProgramSearchResult extends Program {
  _count: any;
  department: Department;
  university: UniversityForProgram;
  rankings: ProgramRanking[];
}

// University type for utility functions
export interface University {
  id: string;
  name: string;
  slug: string;
}

// Action result type
export type ActionResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };
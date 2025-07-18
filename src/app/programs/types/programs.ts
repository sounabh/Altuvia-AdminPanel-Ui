export interface DepartmentCreateInput {
  universityId: string
  name: string
  slug: string
}

export interface DepartmentUpdateInput {
  name?: string
  slug?: string
}

export interface ProgramCreateInput {
  universityId: string
  departmentId: string
  programName: string
  programSlug: string
  degreeType?: string
  programLength?: number
  specializations?: string
  programDescription?: string
  curriculumOverview?: string
  admissionRequirements?: string
  averageEntranceScore?: number
  programTuitionFees?: number
  programAdditionalFees?: number
  programMetaTitle?: string
  programMetaDescription?: string
  isActive?: boolean
}

export type ProgramUpdateInput = Partial<ProgramCreateInput>

export interface SyllabusInput {
  programId: string
  fileUrl: string
}

export interface RankingCreateInput {
  programId: string
  year: number
  rank: number
  source?: string
}

export interface RankingUpdateInput {
  rank?: number
  source?: string
}

export interface ExternalLinkInput {
  programId: string
  title: string
  url: string
}

export interface ExternalLinkUpdateInput {
  title?: string
  url?: string
}

export interface SearchFilterInput {
  universityId?: string
  departmentId?: string
  degreeType?: string
  isActive?: boolean
}

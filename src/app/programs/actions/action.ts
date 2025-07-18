/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Types based on Prisma schema
type Department = {
  id: string
  universityId: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

type Program = {
  id: string
  universityId: string
  departmentId: string
  programName: string
  programSlug: string
  degreeType: string | null
  programLength: number | null
  specializations: string | null
  programDescription: string | null
  curriculumOverview: string | null
  admissionRequirements: string | null
  averageEntranceScore: number | null
  programTuitionFees: number | null
  programAdditionalFees: number | null
  programMetaTitle: string | null
  programMetaDescription: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type Syllabus = {
  id: string
  programId: string
  fileUrl: string
  uploadedAt: Date
}

type ProgramRanking = {
  id: string
  programId: string
  year: number
  rank: number
  source: string | null
  createdAt: Date
}

type ExternalLink = {
  id: string
  programId: string
  title: string
  url: string
  createdAt: Date
}

// Action result types
type ActionResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

// Input types for create/update operations
type CreateDepartmentInput = {
  universityId: string
  name: string
  slug: string
}

type UpdateDepartmentInput = {
  name?: string
  slug?: string
}

type CreateProgramInput = {
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

type UpdateProgramInput = {
  programName?: string
  programSlug?: string
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

type CreateSyllabusInput = {
  programId: string
  fileUrl: string
}

type CreateProgramRankingInput = {
  programId: string
  year: number
  rank: number
  source?: string
}

type UpdateProgramRankingInput = {
  rank?: number
  source?: string
}

type CreateExternalLinkInput = {
  programId: string
  title: string
  url: string
}

type UpdateExternalLinkInput = {
  title?: string
  url?: string
}

type SearchProgramsFilters = {
  universityId?: string
  departmentId?: string
  degreeType?: string
  isActive?: boolean
}

// Extended types for queries with relations
type DepartmentWithPrograms = Department & {
  programs: Array<{
    id: string
    programName: string
    degreeType: string | null
    isActive: boolean
  }>
  _count: {
    programs: number
  }
}

type ProgramWithRelations = Program & {
  department: Department
  university: {
    id: string
    name: string
    // Add other University fields you need
  }
  syllabus: Syllabus | null
  rankings: ProgramRanking[]
  externalLinks: ExternalLink[]
  _count: {
    admissions: number
    scholarships: number
    tuitionBreakdowns: number
  }
}

type ProgramWithFullRelations = Program & {
  department: Department
  university: {
    id: string
    name: string
    // Add other University fields you need
  }
  syllabus: Syllabus | null
  rankings: ProgramRanking[]
  externalLinks: ExternalLink[]
  admissions: Array<{
    id: string
    createdAt: Date
    // Add other admission fields as needed
  }>
  tuitionBreakdowns: Array<{
    id: string
    // Add tuition breakdown fields as needed
  }>
  scholarships: Array<{
    id: string
    isActive: boolean
    // Add other scholarship fields as needed
  }>
  feeStructures: Array<{
    id: string
    // Add fee structure fields as needed
  }>
  financialAids: Array<{
    id: string
    isActive: boolean
    // Add other financial aid fields as needed
  }>
}

type ProgramSearchResult = Program & {
  department: Department
  university: {
    id: string
    name: string
    // Add other University fields you need
  }
  rankings: ProgramRanking[]
}

// Department Actions
export async function createDepartment(data: CreateDepartmentInput): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.create({
      data: {
        universityId: data.universityId,
        name: data.name,
        slug: data.slug,
      },
    })
    revalidatePath('/departments')
    return { success: true, data: department }
  } catch (error) {
    return { success: false, error: 'Failed to create department' }
  }
}

export async function updateDepartment(id: string, data: UpdateDepartmentInput): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.update({
      where: { id },
      data,
    })
    revalidatePath('/departments')
    return { success: true, data: department }
  } catch (error) {
    return { success: false, error: 'Failed to update department' }
  }
}

export async function deleteDepartment(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.department.delete({
      where: { id },
    })
    revalidatePath('/departments')
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: 'Failed to delete department' }
  }
}

export async function getDepartmentsByUniversity(universityId: string): Promise<DepartmentWithPrograms[]> {
  try {
    const departments = await prisma.department.findMany({
      where: { universityId },
      include: {
        programs: {
          select: {
            id: true,
            programName: true,
            degreeType: true,
            isActive: true,
          }
        },
        _count: {
          select: { programs: true }
        }
      },
      orderBy: { name: 'asc' }
    })
    return departments
  } catch (error) {
    return []
  }
}

// Program Actions
export async function createProgram(data: CreateProgramInput): Promise<ActionResult<Program>> {
  try {
    const program = await prisma.program.create({
      data: {
        universityId: data.universityId,
        departmentId: data.departmentId,
        programName: data.programName,
        programSlug: data.programSlug,
        degreeType: data.degreeType,
        programLength: data.programLength,
        specializations: data.specializations,
        programDescription: data.programDescription,
        curriculumOverview: data.curriculumOverview,
        admissionRequirements: data.admissionRequirements,
        averageEntranceScore: data.averageEntranceScore,
        programTuitionFees: data.programTuitionFees,
        programAdditionalFees: data.programAdditionalFees,
        programMetaTitle: data.programMetaTitle,
        programMetaDescription: data.programMetaDescription,
        isActive: data.isActive ?? true,
      },
    })
    revalidatePath('/programs')
    return { success: true, data: program }
  } catch (error) {
    return { success: false, error: 'Failed to create program' }
  }
}

export async function updateProgram(id: string, data: UpdateProgramInput): Promise<ActionResult<Program>> {
  try {
    const program = await prisma.program.update({
      where: { id },
      data,
    })
    revalidatePath('/programs')
    return { success: true, data: program }
  } catch (error) {
    return { success: false, error: 'Failed to update program' }
  }
}

export async function deleteProgram(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.program.delete({
      where: { id },
    })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: 'Failed to delete program' }
  }
}

export async function getProgramsByDepartment(departmentId: string): Promise<ProgramWithRelations[]> {
  try {
    const programs = await prisma.program.findMany({
      where: { departmentId },
      include: {
        department: true,
        university: true,
        syllabus: true,
        rankings: {
          orderBy: { year: 'desc' },
          take: 3
        },
        externalLinks: true,
        _count: {
          select: {
            admissions: true,
            scholarships: true,
            tuitionBreakdowns: true
          }
        }
      },
      orderBy: { programName: 'asc' }
    })
    return programs
  } catch (error) {
    return []
  }
}

export async function getProgramById(id: string): Promise<ProgramWithFullRelations | null> {
  try {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        department: true,
        university: true,
        syllabus: true,
        rankings: {
          orderBy: { year: 'desc' }
        },
        externalLinks: true,
        admissions: {
          orderBy: { createdAt: 'desc' }
        },
        tuitionBreakdowns: true,
        scholarships: {
          where: { isActive: true }
        },
        feeStructures: true,
        financialAids: {
          where: { isActive: true }
        }
      }
    })
    return program
  } catch (error) {
    return null
  }
}

// Syllabus Actions
export async function uploadSyllabus(data: CreateSyllabusInput): Promise<ActionResult<Syllabus>> {
  try {
    const syllabus = await prisma.syllabus.upsert({
      where: { programId: data.programId },
      update: { fileUrl: data.fileUrl },
      create: {
        programId: data.programId,
        fileUrl: data.fileUrl,
      },
    })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: syllabus }
  } catch (error) {
    return { success: false, error: 'Failed to upload syllabus' }
  }
}

export async function deleteSyllabus(programId: string): Promise<ActionResult<void>> {
  try {
    await prisma.syllabus.delete({
      where: { programId },
    })
    revalidatePath(`/programs/${programId}`)
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: 'Failed to delete syllabus' }
  }
}

// Program Ranking Actions
export async function addProgramRanking(data: CreateProgramRankingInput): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.create({
      data: {
        programId: data.programId,
        year: data.year,
        rank: data.rank,
        source: data.source,
      },
    })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: ranking }
  } catch (error) {
    return { success: false, error: 'Failed to add ranking' }
  }
}

export async function updateProgramRanking(id: string, data: UpdateProgramRankingInput): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.update({
      where: { id },
      data,
    })
    revalidatePath('/programs')
    return { success: true, data: ranking }
  } catch (error) {
    return { success: false, error: 'Failed to update ranking' }
  }
}

export async function deleteProgramRanking(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.programRanking.delete({
      where: { id },
    })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: 'Failed to delete ranking' }
  }
}

// External Link Actions
export async function addExternalLink(data: CreateExternalLinkInput): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.create({
      data: {
        programId: data.programId,
        title: data.title,
        url: data.url,
      },
    })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: link }
  } catch (error) {
    return { success: false, error: 'Failed to add external link' }
  }
}

export async function updateExternalLink(id: string, data: UpdateExternalLinkInput): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.update({
      where: { id },
      data,
    })
    revalidatePath('/programs')
    return { success: true, data: link }
  } catch (error) {
    return { success: false, error: 'Failed to update external link' }
  }
}

export async function deleteExternalLink(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.externalLink.delete({
      where: { id },
    })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: 'Failed to delete external link' }
  }
}

// Search and Filter Actions
export async function searchPrograms(query: string, filters?: SearchProgramsFilters): Promise<ProgramSearchResult[]> {
  try {
    const programs = await prisma.program.findMany({
      where: {
        AND: [
          filters?.universityId ? { universityId: filters.universityId } : {},
          filters?.departmentId ? { departmentId: filters.departmentId } : {},
          filters?.degreeType ? { degreeType: filters.degreeType } : {},
          filters?.isActive !== undefined ? { isActive: filters.isActive } : {},
          query ? {
            OR: [
              { programName: { contains: query, mode: 'insensitive' } },
              { programDescription: { contains: query, mode: 'insensitive' } },
              { specializations: { contains: query, mode: 'insensitive' } },
            ]
          } : {},
        ]
      },
      include: {
        department: true,
        university: true,
        rankings: {
          orderBy: { year: 'desc' },
          take: 1
        }
      },
      orderBy: { programName: 'asc' }
    })
    return programs
  } catch (error) {
    return []
  }
}
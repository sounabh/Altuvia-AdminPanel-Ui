/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'


import { revalidatePath } from 'next/cache'
import type {
  Department,
  Program,
  Syllabus,
  ProgramRanking,
  ExternalLink,
  ActionResult,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateProgramInput,
  UpdateProgramInput,
  CreateSyllabusInput,
  CreateProgramRankingInput,
  UpdateProgramRankingInput,
  CreateExternalLinkInput,
  UpdateExternalLinkInput,
  SearchProgramsFilters,
  DepartmentWithPrograms,
  UniversityForProgram,
  ProgramWithRelations,
  ProgramWithFullRelations,
  ProgramSearchResult,
  University
} from '../types/programs'

import { prisma } from "@/lib/prisma";

// Department Actions
export async function createDepartment(data: CreateDepartmentInput): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.create({ data })
    revalidatePath('/departments')
    return { success: true, data: department }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create department' }
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
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update department' }
  }
}

export async function deleteDepartment(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.department.delete({ where: { id } })
    revalidatePath('/departments')
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete department' }
  }
}

export async function getDepartmentsByUniversity(universityId?: string): Promise<DepartmentWithPrograms[]> {
  try {
    return await prisma.department.findMany({
      where: universityId ? { universityId } : {},
      include: {
        programs: {
          select: {
            id: true,
            programName: true,
            degreeType: true,
            isActive: true,
          }
        },
        _count: { select: { programs: true } }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    return []
  }
}

// Program Actions
export async function createProgram(data: CreateProgramInput): Promise<ActionResult<Program>> {
  try {
    const program = await prisma.program.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    })
    revalidatePath('/programs')
    return { success: true, data: program }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create program' }
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
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update program' }
  }
}

export async function deleteProgram(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.program.delete({ where: { id } })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete program' }
  }
}

export async function getProgramsByDepartment(departmentId: string): Promise<ProgramWithRelations[]> {
  try {
    return await prisma.program.findMany({
      where: { departmentId },
      include: {
        department: true,
        university: {
          select: {
            id: true,
            universityName: true,
            slug: true
          }
        },
        syllabus: true,
        rankings: { orderBy: { year: 'desc' }, take: 3 },
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
  } catch (error) {
    return []
  }
}

export async function getProgramById(id: string): Promise<ProgramWithFullRelations | null> {
  try {
    return await prisma.program.findUnique({
      where: { id },
      include: {
        department: true,
        university: {
          select: {
            id: true,
            universityName: true,
            slug: true
          }
        },
        syllabus: true,
        rankings: { orderBy: { year: 'desc' } },
        externalLinks: true,
        admissions: { orderBy: { createdAt: 'desc' } },
        tuitionBreakdowns: true,
        scholarships: { where: { isActive: true } },
        feeStructures: true,
        financialAids: { where: { isActive: true } },
        // ✅ Add this:
        _count: {
          select: {
            admissions: true,
            scholarships: true,
            tuitionBreakdowns: true,
            feeStructures: true,
            financialAids: true,
            externalLinks: true,
          }
        }
      }
    })
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
      create: data,
    })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: syllabus }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload syllabus' }
  }
}

export async function deleteSyllabus(programId: string): Promise<ActionResult<void>> {
  try {
    await prisma.syllabus.delete({ where: { programId } })
    revalidatePath(`/programs/${programId}`)
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete syllabus' }
  }
}

// Program Ranking Actions
export async function addProgramRanking(data: CreateProgramRankingInput): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.create({ data })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: ranking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add ranking' }
  }
}

export async function updateProgramRanking(
  id: string,
  data: UpdateProgramRankingInput
): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.update({
      where: { id },
      data,
    })
    revalidatePath('/programs')
    return { success: true, data: ranking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update ranking' }
  }
}

export async function deleteProgramRanking(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.programRanking.delete({ where: { id } })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete ranking' }
  }
}

// External Link Actions
export async function addExternalLink(data: CreateExternalLinkInput): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.create({ data })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: link }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add external link' }
  }
}

export async function updateExternalLink(
  id: string,
  data: UpdateExternalLinkInput
): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.update({
      where: { id },
      data,
    })
    revalidatePath('/programs')
    return { success: true, data: link }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update external link' }
  }
}

export async function deleteExternalLink(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.externalLink.delete({ where: { id } })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete external link' }
  }
}

// Search and Filter Actions
export async function searchPrograms(
  query: string,
  filters?: SearchProgramsFilters
): Promise<ProgramSearchResult[]> {
  try {
    return await prisma.program.findMany({
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
        university: {
          select: {
            id: true,
            universityName: true,
            slug: true
          }
        },
        rankings: { orderBy: { year: 'desc' }, take: 1 },
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
  } catch (error) {
    return []
  }
}

export async function getUniversities(): Promise<University[]> {
  try {
    const universities = await prisma.university.findMany({
      select: { id: true, universityName: true, slug: true },
      orderBy: { universityName: 'asc' }
    })
    
    return universities.map(u => ({
      id: u.id,
      name: u.universityName,
      slug: u.slug
    }))
  } catch (error) {
    return []
  }
}
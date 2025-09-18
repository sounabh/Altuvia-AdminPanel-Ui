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

// Program Actions with multiple departments support
export async function createProgram(data: CreateProgramInput): Promise<ActionResult<Program>> {
  try {
    const { departmentIds, ...programData } = data;
    
    const program = await prisma.program.create({
      data: {
        ...programData,
        isActive: data.isActive ?? true,
        // Create department relationships
        departments: {
          create: departmentIds.map(departmentId => ({
            departmentId
          }))
        }
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
    const { departmentIds, ...programData } = data;
    
    // If departmentIds are provided, update the relationships
    const updateData: any = { ...programData };
    
    if (departmentIds !== undefined) {
      // First, delete existing department relationships
      await prisma.programDepartment.deleteMany({
        where: { programId: id }
      });
      
      // Then create new relationships
      updateData.departments = {
        create: departmentIds.map(departmentId => ({
          departmentId
        }))
      };
    }

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
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

// Updated to get programs by multiple departments
export async function getProgramsByDepartments(departmentIds: string[]): Promise<ProgramWithRelations[]> {
  try {
    return await prisma.program.findMany({
      where: {
        departments: {
          some: {
            departmentId: {
              in: departmentIds
            }
          }
        }
      },
      include: {
        departments: {
          include: {
            department: true
          }
        },
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
        departments: {
          include: {
            department: true
          }
        },
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

// Updated function to get departments with program counts
export async function getDepartmentsByUniversity(universityId?: string): Promise<DepartmentWithPrograms[]> {
  try {
    return await prisma.department.findMany({
      where: universityId ? { universityId } : {},
      include: {
        programs: {
          include: {
            program: {
              select: {
                id: true,
                programName: true,
                degreeType: true,
                isActive: true,
              }
            }
          }
        },
        _count: { 
          select: { 
            programs: true 
          } 
        }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    return []
  }
}

// Syllabus Actions
export async function uploadSyllabus(data: CreateSyllabusInput): Promise<ActionResult<Syllabus>> {
  try {
    const syllabus = await prisma.syllabus.upsert({
      where: { programId: data.programId },
      update: { 
        fileUrl: data.fileUrl,
        uploadedAt: new Date()
      },
      create: {
        ...data,
        uploadedAt: new Date()
      },
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

// Updated search function to handle multiple departments
export async function searchPrograms(
  query: string,
  filters?: SearchProgramsFilters
): Promise<ProgramSearchResult[]> {
  try {
    const whereClause: any = {
      AND: [
        filters?.universityId ? { universityId: filters.universityId } : {},
        filters?.departmentIds && filters.departmentIds.length > 0 ? {
          departments: {
            some: {
              departmentId: {
                in: filters.departmentIds
              }
            }
          }
        } : {},
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
    };

    return await prisma.program.findMany({
      where: whereClause,
      include: {
        departments: {
          include: {
            department: true
          }
        },
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
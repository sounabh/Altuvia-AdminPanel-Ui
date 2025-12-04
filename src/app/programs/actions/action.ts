/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from "@/lib/prisma"
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
  ProgramWithFullRelations,
  ProgramSearchResult,
  University
} from '../types/programs'

// ==================== DEPARTMENT ACTIONS ====================

export async function createDepartment(data: CreateDepartmentInput): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.create({ data })
    revalidatePath('/program-management')
    revalidatePath('/departments')
    return { success: true, data: department }
  } catch (error: any) {
    console.error('createDepartment error:', error)
    return { success: false, error: error.message || 'Failed to create department' }
  }
}

export async function updateDepartment(id: string, data: UpdateDepartmentInput): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.update({
      where: { id },
      data,
    })
    revalidatePath('/program-management')
    revalidatePath('/departments')
    return { success: true, data: department }
  } catch (error: any) {
    console.error('updateDepartment error:', error)
    return { success: false, error: error.message || 'Failed to update department' }
  }
}

export async function deleteDepartment(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.department.delete({ where: { id } })
    revalidatePath('/program-management')
    revalidatePath('/departments')
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('deleteDepartment error:', error)
    return { success: false, error: error.message || 'Failed to delete department' }
  }
}

// ==================== FIXED: GET DEPARTMENTS ====================

export async function getDepartmentsByUniversity(universityId?: string): Promise<DepartmentWithPrograms[]> {
  try {
    // Step 1: Get all valid universities first
    const validUniversities = await prisma.university.findMany({
      select: { id: true, universityName: true, slug: true }
    })
    const universityMap = new Map(validUniversities.map(u => [u.id, u]))
    const validUniversityIds = Array.from(universityMap.keys())

    // Step 2: Get departments that belong to valid universities
    const departments = await prisma.department.findMany({
      where: {
        universityId: universityId 
          ? universityId 
          : { in: validUniversityIds }
      },
      orderBy: { name: 'asc' }
    })

    console.log('getDepartmentsByUniversity - found departments:', departments.length)

    if (departments.length === 0) {
      return []
    }

    // Step 3: Get program counts for each department
    const programCounts = await prisma.programDepartment.groupBy({
      by: ['departmentId'],
      where: {
        departmentId: { in: departments.map(d => d.id) }
      },
      _count: {
        programId: true
      }
    })

    const countMap = new Map(programCounts.map(pc => [pc.departmentId, pc._count.programId]))

    // Step 4: Get all program-department relations with program details
    const allProgramDepts = await prisma.programDepartment.findMany({
      where: {
        departmentId: { in: departments.map(d => d.id) }
      },
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
    })

    // Group programs by department
    const deptProgramsMap = new Map<string, Array<{ program: any }>>()
    for (const pd of allProgramDepts) {
      if (pd.program) {
        const existing = deptProgramsMap.get(pd.departmentId) || []
        existing.push({ program: pd.program })
        deptProgramsMap.set(pd.departmentId, existing)
      }
    }

    // Step 5: Build final result
    const result = departments.map(dept => {
      const university = universityMap.get(dept.universityId)
      return {
        ...dept,
        university: university || { id: dept.universityId, universityName: 'Unknown', slug: 'unknown' },
        programs: deptProgramsMap.get(dept.id) || [],
        _count: {
          programs: countMap.get(dept.id) || 0
        }
      }
    })

    console.log('getDepartmentsByUniversity - returning:', result.length, 'departments')
    return result as DepartmentWithPrograms[]
  } catch (error) {
    console.error('getDepartmentsByUniversity error:', error)
    return []
  }
}

// ==================== PROGRAM ACTIONS ====================

export async function createProgram(data: CreateProgramInput): Promise<ActionResult<Program>> {
  try {
    const { departmentIds, ...programData } = data

    const program = await prisma.program.create({
      data: {
        ...programData,
        isActive: data.isActive ?? true,
        departments: departmentIds && departmentIds.length > 0 ? {
          create: departmentIds.map(departmentId => ({
            departmentId
          }))
        } : undefined
      },
    })
    
    revalidatePath('/program-management')
    revalidatePath('/programs')
    return { success: true, data: program }
  } catch (error: any) {
    console.error('createProgram error:', error)
    return { success: false, error: error.message || 'Failed to create program' }
  }
}

export async function updateProgram(id: string, data: UpdateProgramInput): Promise<ActionResult<Program>> {
  try {
    const { departmentIds, ...programData } = data
    const updateData: any = { ...programData }

    if (departmentIds !== undefined) {
      await prisma.programDepartment.deleteMany({
        where: { programId: id }
      })
      
      if (departmentIds.length > 0) {
        updateData.departments = {
          create: departmentIds.map(departmentId => ({
            departmentId
          }))
        }
      }
    }

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
    })
    
    revalidatePath('/program-management')
    revalidatePath('/programs')
    return { success: true, data: program }
  } catch (error: any) {
    console.error('updateProgram error:', error)
    return { success: false, error: error.message || 'Failed to update program' }
  }
}

export async function deleteProgram(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.program.delete({ where: { id } })
    revalidatePath('/program-management')
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('deleteProgram error:', error)
    return { success: false, error: error.message || 'Failed to delete program' }
  }
}

export async function getProgramById(id: string): Promise<ProgramWithFullRelations | null> {
  try {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
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

    if (!program) return null

    // Get university separately
    const university = await prisma.university.findUnique({
      where: { id: program.universityId },
      select: { id: true, universityName: true, slug: true }
    })

    // Get departments separately
    const programDepts = await prisma.programDepartment.findMany({
      where: { programId: id },
      include: { department: true }
    })

    const departments = programDepts
      .filter(pd => pd.department !== null)
      .map(pd => ({ department: pd.department as Department }))

    return {
      ...program,
      university: university || { id: program.universityId, universityName: 'Unknown University', slug: 'unknown' },
      departments
    } as ProgramWithFullRelations
  } catch (error) {
    console.error('getProgramById error:', error)
    return null
  }
}

export async function getProgramsByDepartments(departmentIds: string[]): Promise<ProgramSearchResult[]> {
  try {
    const validUniversities = await prisma.university.findMany({
      select: { id: true, universityName: true, slug: true }
    })
    const universityMap = new Map(validUniversities.map(u => [u.id, u]))

    const programDepts = await prisma.programDepartment.findMany({
      where: { departmentId: { in: departmentIds } },
      select: { programId: true }
    })

    const programIds = [...new Set(programDepts.map(pd => pd.programId))]
    if (programIds.length === 0) return []

    const programs = await prisma.program.findMany({
      where: {
        id: { in: programIds },
        universityId: { in: Array.from(universityMap.keys()) }
      },
      include: {
        rankings: { orderBy: { year: 'desc' }, take: 3 },
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

    const allProgramDepts = await prisma.programDepartment.findMany({
      where: { programId: { in: programs.map(p => p.id) } },
      include: { department: true }
    })

    const programDeptsMap = new Map<string, Array<{ department: Department }>>()
    for (const pd of allProgramDepts) {
      if (pd.department) {
        const existing = programDeptsMap.get(pd.programId) || []
        existing.push({ department: pd.department })
        programDeptsMap.set(pd.programId, existing)
      }
    }

    const result = programs.map(program => ({
      ...program,
      university: universityMap.get(program.universityId) || { id: program.universityId, universityName: 'Unknown', slug: 'unknown' },
      departments: programDeptsMap.get(program.id) || []
    }))

    return result as ProgramSearchResult[]
  } catch (error) {
    console.error('getProgramsByDepartments error:', error)
    return []
  }
}

// ==================== SEARCH PROGRAMS - OPTIMIZED ====================

export async function searchPrograms(
  query: string,
  filters?: SearchProgramsFilters
): Promise<ProgramSearchResult[]> {
  try {
    // Step 1: Get all valid universities
    const validUniversities = await prisma.university.findMany({
      select: { id: true, universityName: true, slug: true }
    })
    
    if (validUniversities.length === 0) {
      console.log('searchPrograms - No valid universities found')
      return []
    }

    const universityMap = new Map(validUniversities.map(u => [u.id, u]))
    const validUniversityIds = Array.from(universityMap.keys())

    // Step 2: Build where clause
    const whereConditions: any = {
      universityId: { in: validUniversityIds }
    }
    
    if (filters?.universityId && filters.universityId.trim() !== '') {
      whereConditions.universityId = filters.universityId
    }
    
    if (filters?.degreeType && filters.degreeType.trim() !== '') {
      whereConditions.degreeType = filters.degreeType
    }
    
    if (filters?.isActive === true) {
      whereConditions.isActive = true
    } else if (filters?.isActive === false) {
      whereConditions.isActive = false
    }
    
    if (query && query.trim() !== '') {
      whereConditions.OR = [
        { programName: { contains: query, mode: 'insensitive' } },
        { programDescription: { contains: query, mode: 'insensitive' } },
        { specializations: { contains: query, mode: 'insensitive' } },
      ]
    }

    console.log('searchPrograms - whereConditions:', JSON.stringify(whereConditions, null, 2))

    // Step 3: Get programs
    const programs = await prisma.program.findMany({
      where: whereConditions,
      include: {
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

    console.log('searchPrograms - found programs:', programs.length)

    if (programs.length === 0) {
      return []
    }

    // Step 4: Get all valid departments
    const allValidDepartments = await prisma.department.findMany({
      select: { id: true, name: true, slug: true, universityId: true, createdAt: true, updatedAt: true }
    })
    const validDeptIds = new Set(allValidDepartments.map(d => d.id))
    const departmentMap = new Map(allValidDepartments.map(d => [d.id, d]))

    // Step 5: Get all program-department relations
    const allProgramDepts = await prisma.programDepartment.findMany({
      where: {
        programId: { in: programs.map(p => p.id) },
        departmentId: { in: Array.from(validDeptIds) }
      }
    })

    // Group departments by program ID
    const programDeptsMap = new Map<string, Array<{ department: Department }>>()
    for (const pd of allProgramDepts) {
      const dept = departmentMap.get(pd.departmentId)
      if (dept) {
        const existing = programDeptsMap.get(pd.programId) || []
        existing.push({ department: dept as Department })
        programDeptsMap.set(pd.programId, existing)
      }
    }

    // Step 6: Build final result
    const programsWithRelations = programs.map(program => ({
      ...program,
      university: universityMap.get(program.universityId) || { 
        id: program.universityId, 
        universityName: 'Unknown University', 
        slug: 'unknown' 
      },
      departments: programDeptsMap.get(program.id) || []
    }))

    // Step 7: Apply department filter if needed
    let filteredPrograms = programsWithRelations
    if (filters?.departmentIds && filters.departmentIds.length > 0) {
      filteredPrograms = programsWithRelations.filter(program =>
        program.departments.some(d => filters.departmentIds?.includes(d.department.id))
      )
    }

    console.log('searchPrograms - returning:', filteredPrograms.length, 'programs')
    
    return filteredPrograms as ProgramSearchResult[]
  } catch (error) {
    console.error('searchPrograms error:', error)
    return []
  }
}

// ==================== DEBUG FUNCTION (NO DELETE) ====================

export async function debugGetAllPrograms(): Promise<{
  totalPrograms: number;
  totalValidPrograms: number;
  programs: any[];
  programDepartments: number;
  orphanedRelations: number;
  orphanedUniversities: number;
}> {
  try {
    const [
      totalPrograms,
      programDepartments,
      validUniversities,
      validDepartments
    ] = await Promise.all([
      prisma.program.count(),
      prisma.programDepartment.count(),
      prisma.university.findMany({ select: { id: true } }),
      prisma.department.findMany({ select: { id: true } })
    ])

    const validUniversityIds = new Set(validUniversities.map(u => u.id))
    const validDeptIds = new Set(validDepartments.map(d => d.id))

    const totalValidPrograms = await prisma.program.count({
      where: { universityId: { in: Array.from(validUniversityIds) } }
    })

    const samplePrograms = await prisma.program.findMany({
      take: 10,
      where: { universityId: { in: Array.from(validUniversityIds) } },
      select: {
        id: true,
        programName: true,
        universityId: true,
        isActive: true,
      }
    })

    const sampleProgramDepts = await prisma.programDepartment.findMany({
      where: { 
        programId: { in: samplePrograms.map(p => p.id) },
        departmentId: { in: Array.from(validDeptIds) }
      }
    })

    const programDeptsCount = new Map<string, number>()
    for (const pd of sampleProgramDepts) {
      programDeptsCount.set(pd.programId, (programDeptsCount.get(pd.programId) || 0) + 1)
    }

    const programsWithDepts = samplePrograms.map(p => ({
      ...p,
      departments: Array(programDeptsCount.get(p.id) || 0).fill({})
    }))

    let orphanedCount = 0
    let orphanedUniversities = 0
    try {
      const orphanedResult = await prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM program_departments pd
        WHERE NOT EXISTS (SELECT 1 FROM departments d WHERE d.id = pd."departmentId")
        OR NOT EXISTS (SELECT 1 FROM programs p WHERE p.id = pd."programId")
      `
      orphanedCount = Number(orphanedResult[0]?.count || 0)

      const orphanedUniResult = await prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM programs p
        WHERE NOT EXISTS (SELECT 1 FROM universities u WHERE u.id = p."universityId")
      `
      orphanedUniversities = Number(orphanedUniResult[0]?.count || 0)
    } catch (e) {
      console.error('Error counting orphaned records:', e)
    }

    console.log('DEBUG - Total programs in DB:', totalPrograms)
    console.log('DEBUG - Total valid programs:', totalValidPrograms)
    console.log('DEBUG - Program departments:', programDepartments)
    console.log('DEBUG - Orphaned dept relations:', orphanedCount)
    console.log('DEBUG - Orphaned uni references:', orphanedUniversities)

    return {
      totalPrograms,
      totalValidPrograms,
      programs: programsWithDepts,
      programDepartments,
      orphanedRelations: orphanedCount,
      orphanedUniversities
    }
  } catch (error) {
    console.error('debugGetAllPrograms error:', error)
    return {
      totalPrograms: 0,
      totalValidPrograms: 0,
      programs: [],
      programDepartments: 0,
      orphanedRelations: 0,
      orphanedUniversities: 0
    }
  }
}

// ==================== SYLLABUS ACTIONS ====================

export async function uploadSyllabus(data: CreateSyllabusInput): Promise<ActionResult<Syllabus>> {
  try {
    const syllabus = await prisma.syllabus.upsert({
      where: { programId: data.programId },
      update: { fileUrl: data.fileUrl, uploadedAt: new Date() },
      create: { ...data, uploadedAt: new Date() },
    })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: syllabus }
  } catch (error: any) {
    console.error('uploadSyllabus error:', error)
    return { success: false, error: error.message || 'Failed to upload syllabus' }
  }
}

export async function deleteSyllabus(programId: string): Promise<ActionResult<void>> {
  try {
    await prisma.syllabus.delete({ where: { programId } })
    revalidatePath(`/programs/${programId}`)
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('deleteSyllabus error:', error)
    return { success: false, error: error.message || 'Failed to delete syllabus' }
  }
}

// ==================== PROGRAM RANKING ACTIONS ====================

export async function addProgramRanking(data: CreateProgramRankingInput): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.create({ data })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: ranking }
  } catch (error: any) {
    console.error('addProgramRanking error:', error)
    return { success: false, error: error.message || 'Failed to add ranking' }
  }
}

export async function updateProgramRanking(id: string, data: UpdateProgramRankingInput): Promise<ActionResult<ProgramRanking>> {
  try {
    const ranking = await prisma.programRanking.update({ where: { id }, data })
    revalidatePath('/programs')
    return { success: true, data: ranking }
  } catch (error: any) {
    console.error('updateProgramRanking error:', error)
    return { success: false, error: error.message || 'Failed to update ranking' }
  }
}

export async function deleteProgramRanking(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.programRanking.delete({ where: { id } })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('deleteProgramRanking error:', error)
    return { success: false, error: error.message || 'Failed to delete ranking' }
  }
}

// ==================== EXTERNAL LINK ACTIONS ====================

export async function addExternalLink(data: CreateExternalLinkInput): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.create({ data })
    revalidatePath(`/programs/${data.programId}`)
    return { success: true, data: link }
  } catch (error: any) {
    console.error('addExternalLink error:', error)
    return { success: false, error: error.message || 'Failed to add external link' }
  }
}

export async function updateExternalLink(id: string, data: UpdateExternalLinkInput): Promise<ActionResult<ExternalLink>> {
  try {
    const link = await prisma.externalLink.update({ where: { id }, data })
    revalidatePath('/programs')
    return { success: true, data: link }
  } catch (error: any) {
    console.error('updateExternalLink error:', error)
    return { success: false, error: error.message || 'Failed to update external link' }
  }
}

export async function deleteExternalLink(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.externalLink.delete({ where: { id } })
    revalidatePath('/programs')
    return { success: true, data: undefined }
  } catch (error: any) {
    console.error('deleteExternalLink error:', error)
    return { success: false, error: error.message || 'Failed to delete external link' }
  }
}

// ==================== UNIVERSITY ACTIONS ====================

export async function getUniversities(): Promise<University[]> {
  try {
    const universities = await prisma.university.findMany({
      select: { id: true, universityName: true, slug: true },
      orderBy: { universityName: 'asc' }
    })
    return universities.map(u => ({ id: u.id, name: u.universityName, slug: u.slug }))
  } catch (error) {
    console.error('getUniversities error:', error)
    return []
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// =============================================================================
// TYPE DEFINITIONS - Based on Prisma Schema
// =============================================================================

export interface StudentBasicInfo {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  profile: {
    id: string;
    countries: string[];
    courses: string[];
    studyLevel: string | null;
    gpa: string | null;
    testScores: string | null;
    workExperience: string | null;
  } | null;

  subscription: {
    id: string;
    plan: string;
    status: string;
  } | null;

  _count: {
    applications: number;
    savedUniversities: number;
    calendarEvents: number;
    essays: number;
    CV: number;
    scholarshipApplications: number;
    financialAidApplications: number;
  };
}

export interface StudentDetailedInfo extends StudentBasicInfo {
  savedUniversities: Array<{
    id: string;
    universityName: string;
    city: string;
    country: string;
    images: Array<{
      imageUrl: string;
      isPrimary: boolean;
    }>;
  }>;

  calendarEvents: Array<{
    id: string;
    title: string;
    eventType: string;
    startDate: Date;
    endDate: Date;
    priority: string;
    eventStatus: string;
  }>;

  essays: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    completionPercentage: number;
    wordCount: number;
    wordLimit: number;
    lastModified: Date;
    isCompleted: boolean;
    completedAt: Date | null;
    program: {
      programName: string;
    };
    versions: Array<{
      id: string;
      label: string;
      wordCount: number;
      timestamp: Date;
      isAutoSave: boolean;
    }>;
  }>;

  CV: Array<{
    id: string;
    title: string;
    isActive: boolean;
    completionPercentage: number;
    atsScore: number | null;
    updatedAt: Date;
  }>;
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createStudentSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  countries: z.array(z.string()).optional().default([]),
  courses: z.array(z.string()).optional().default([]),
  studyLevel: z.string().optional(),
  gpa: z.string().optional(),
  testScores: z.string().optional(),
  workExperience: z.string().optional(),
});

const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional().nullable(),
  emailVerified: z.boolean().optional(),
  countries: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
  studyLevel: z.string().optional(),
  gpa: z.string().optional(),
  testScores: z.string().optional(),
  workExperience: z.string().optional(),
});

const filterStudentsSchema = z.object({
  search: z.string().optional(),
  emailVerified: z.boolean().optional(),
  plan: z.string().optional(),
  studyLevel: z.string().optional(),
  country: z.string().optional(),
});

// =============================================================================
// GET ALL STUDENTS (with optional filters)
// =============================================================================

export async function getStudents(filters?: z.infer<typeof filterStudentsSchema>) {
  try {
    const whereClause: any = {};

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.emailVerified !== undefined) {
      whereClause.emailVerified = filters.emailVerified;
    }

    if (filters?.plan) {
      whereClause.subscription = {
        plan: filters.plan,
      };
    }

    if (filters?.studyLevel) {
      whereClause.profile = {
        studyLevel: filters.studyLevel,
      };
    }

    if (filters?.country) {
      whereClause.profile = {
        countries: {
          has: filters.country,
        },
      };
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: {
          select: {
            id: true,
            countries: true,
            courses: true,
            studyLevel: true,
            gpa: true,
            testScores: true,
            workExperience: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
            status: true,
          },
        },
        _count: {
          select: {
            applications: true,
            savedUniversities: true,
            calendarEvents: true,
            essays: true,
            CV: true,
            scholarshipApplications: true,
            financialAidApplications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      students: students as StudentBasicInfo[],
    };
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return {
      success: false,
      error: "Failed to fetch students",
      students: [],
    };
  }
}

// =============================================================================
// GET STUDENT BY ID (comprehensive details)
// =============================================================================

export async function getStudentById(id: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            countries: true,
            courses: true,
            studyLevel: true,
            gpa: true,
            testScores: true,
            workExperience: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            trialEndDate: true,
          },
        },
        applications: {
          include: {
            university: {
              select: {
                id: true,
                universityName: true,
                city: true,
                country: true,
              },
            },
            program: {
              select: {
                id: true,
                programName: true,
                degreeType: true,
              },
            },
            intake: {
              select: {
                intakeName: true,
                intakeYear: true,
              },
            },
          },
          orderBy: {
            lastActivityAt: 'desc',
          },
        },
        savedUniversities: {
          select: {
            id: true,
            universityName: true,
            city: true,
            country: true,
            images: {
              where: { isPrimary: true },
              select: {
                imageUrl: true,
                isPrimary: true,
              },
              take: 1,
            },
          },
        },
        calendarEvents: {
          select: {
            id: true,
            title: true,
            eventType: true,
            startDate: true,
            endDate: true,
            priority: true,
            eventStatus: true,
          },
          orderBy: {
            startDate: 'asc',
          },
          take: 20,
        },
        essays: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            completionPercentage: true,
            wordCount: true,
            wordLimit: true,
            lastModified: true,
            isCompleted: true,
            program: {
              select: {
                programName: true,
              },
            },
          },
          orderBy: {
            lastModified: 'desc',
          },
        },
        CV: {
          select: {
            id: true,
            title: true,
            isActive: true,
            completionPercentage: true,
            atsScore: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
        scholarshipApplications: {
          select: {
            id: true,
            applicationStatus: true,
            awardAmount: true,
            submissionDate: true,
            scholarship: {
              select: {
                scholarshipName: true,
                university: {
                  select: {
                    universityName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            submissionDate: 'desc',
          },
        },
        financialAidApplications: {
          select: {
            id: true,
            applicationStatus: true,
            approvedAmount: true,
            submissionDate: true,
            financialAid: {
              select: {
                aidName: true,
                aidType: true,
              },
            },
          },
          orderBy: {
            submissionDate: 'desc',
          },
        },
        _count: {
          select: {
            applications: true,
            savedUniversities: true,
            calendarEvents: true,
            essays: true,
            CV: true,
            scholarshipApplications: true,
            financialAidApplications: true,
          },
        },
      },
    });

    if (!student) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    return {
      success: true,
      student: student as unknown as StudentDetailedInfo,
    };
  } catch (error) {
    console.error('Error fetching student:', error);
    return {
      success: false,
      error: 'Failed to fetch student details',
    };
  }
}

// =============================================================================
// CREATE STUDENT
// =============================================================================

export async function createStudent(data: z.infer<typeof createStudentSchema>) {
  try {
    const validatedFields = createStudentSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

    const profileData = {
      countries: validatedFields.countries || [],
      courses: validatedFields.courses || [],
      studyLevel: validatedFields.studyLevel || null,
      gpa: validatedFields.gpa || null,
      testScores: validatedFields.testScores || null,
      workExperience: validatedFields.workExperience || null,
    };

    const student = await prisma.user.create({
      data: {
        email: validatedFields.email,
        password: hashedPassword,
        name: validatedFields.name,
        emailVerified: false,
        profile: {
          create: profileData,
        },
      },
      include: {
        profile: {
          select: {
            id: true,
            countries: true,
            courses: true,
            studyLevel: true,
            gpa: true,
            testScores: true,
            workExperience: true,
          },
        },
        _count: {
          select: {
            applications: true,
            savedUniversities: true,
            calendarEvents: true,
            essays: true,
            CV: true,
            scholarshipApplications: true,
            financialAidApplications: true,
          },
        },
      },
    });

    revalidatePath('/admin/students');

    return {
      success: true,
      student,
      message: "Student created successfully",
    };
  } catch (error: any) {
    console.error('Error creating student:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error,
      };
    }

    if (error.code === 'P2002') {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    return {
      success: false,
      error: "Failed to create student. Please try again.",
    };
  }
}

// =============================================================================
// UPDATE STUDENT
// =============================================================================

export async function updateStudent(
  id: string,
  data: z.infer<typeof updateStudentSchema>
) {
  try {
    const validatedFields = updateStudentSchema.parse(data);

    const existingStudent = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!existingStudent) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    const { 
      countries, 
      courses, 
      studyLevel, 
      gpa, 
      testScores, 
      workExperience, 
      ...userFields 
    } = validatedFields;

    const profileData = {
      countries,
      courses,
      studyLevel,
      gpa,
      testScores,
      workExperience,
    };

    const cleanProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([, v]) => v !== undefined)
    );

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        ...userFields,
        updatedAt: new Date(),
        profile: existingStudent.profile
          ? {
              update: {
                ...cleanProfileData,
                updatedAt: new Date(),
              },
            }
          : Object.keys(cleanProfileData).length > 0
          ? {
              create: {
                countries: countries || [],
                courses: courses || [],
                studyLevel,
                gpa,
                testScores,
                workExperience,
              },
            }
          : undefined,
      },
      include: {
        profile: true,
        _count: {
          select: {
            applications: true,
            savedUniversities: true,
            calendarEvents: true,
            essays: true,
            CV: true,
            scholarshipApplications: true,
            financialAidApplications: true,
          },
        },
      },
    });

    revalidatePath('/admin/students');
    revalidatePath(`/admin/students/${id}`);

    return {
      success: true,
      student: updatedStudent,
      message: "Student updated successfully",
    };
  } catch (error) {
    console.error('Error updating student:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error,
      };
    }

    return {
      success: false,
      error: "Failed to update student",
    };
  }
}

// =============================================================================
// DELETE STUDENT
// =============================================================================

export async function deleteStudent(id: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/admin/students');

    return {
      success: true,
      message: "Student deleted successfully",
    };
  } catch (error: any) {
    console.error('Error deleting student:', error);

    if (error.code === 'P2003') {
      return {
        success: false,
        error: "Cannot delete student with existing related records",
      };
    }

    return {
      success: false,
      error: "Failed to delete student",
    };
  }
}

// =============================================================================
// TOGGLE EMAIL VERIFICATION
// =============================================================================

export async function toggleEmailVerification(id: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id },
      select: { emailVerified: true },
    });

    if (!student) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: { emailVerified: !student.emailVerified },
    });

    revalidatePath('/admin/students');
    revalidatePath(`/admin/students/${id}`);

    return {
      success: true,
      student: updatedStudent,
      message: `Email verification status updated to ${!student.emailVerified ? 'verified' : 'unverified'}`,
    };
  } catch (error) {
    console.error('Error toggling email verification:', error);

    return {
      success: false,
      error: "Failed to update email verification status",
    };
  }
}

// =============================================================================
// STUDENT STATISTICS
// =============================================================================

export async function getStudentStats() {
  try {
    const [
      totalStudents,
      verifiedStudents,
      activeApplications,
      completedEssays,
      upcomingEvents,
      totalCVs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.application.count({
        where: {
          applicationStatus: {
            in: ['IN_PROGRESS', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED'],
          },
        },
      }),
      prisma.essay.count({ where: { isCompleted: true } }),
      prisma.calendarEvent.count({
        where: {
          startDate: { gte: new Date() },
          eventStatus: 'active',
        },
      }),
      prisma.cV.count(),
    ]);

    return {
      success: true,
      stats: {
        totalStudents,
        verifiedStudents,
        activeApplications,
        completedEssays,
        upcomingEvents,
        totalCVs,
      },
    };
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return {
      success: false,
      error: 'Failed to fetch student statistics',
    };
  }
}

// =============================================================================
// SEARCH STUDENTS
// =============================================================================

export async function searchStudents(query: string) {
  try {
    const students = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        profile: true,
        _count: {
          select: {
            applications: true,
            essays: true,
            CV: true,
          },
        },
      },
      take: 10,
    });

    return {
      success: true,
      students,
    };
  } catch (error) {
    console.error('Error searching students:', error);
    return {
      success: false,
      error: 'Failed to search students',
      students: [],
    };
  }
}
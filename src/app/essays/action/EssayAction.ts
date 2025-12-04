/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { prisma } from '@/lib/prisma';

// ================== TYPES ==================
export interface EssayPrompt {
  id: string;
  admissionId: string | null;
  programId: string | null;
  intakeId: string | null;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount: number;
  isMandatory: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EssayPromptInput {
  admissionId?: string | null;
  programId?: string | null;
  intakeId?: string | null;
  promptTitle: string;
  promptText: string;
  wordLimit: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
}

export interface EssayPromptUpdateInput {
  promptTitle?: string;
  promptText?: string;
  wordLimit?: number;
  minWordCount?: number;
  isMandatory?: boolean;
  isActive?: boolean;
  programId?: string | null;
  intakeId?: string | null;
}

export interface EssaySubmission {
  id: string;
  essayPromptId: string;
  userId: string | null;
  applicationId: string | null;
  title: string | null;
  content: string;
  wordCount: number;
  isUsingTemplate: boolean;
  templateVersion: string | null;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  reviewStatus: "PENDING" | "REVIEWED";
  reviewerId: string | null;
  reviewerComment: string | null;
  internalRating: number | null;
  submissionDate: Date | null;
  lastEditedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EssaySubmissionInput {
  essayPromptId: string;
  userId?: string | null;
  applicationId?: string | null;
  title?: string | null;
  content: string;
  isUsingTemplate?: boolean;
  templateVersion?: string | null;
}

export interface EssaySubmissionUpdateInput {
  title?: string | null;
  content?: string;
  status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  isUsingTemplate?: boolean;
  templateVersion?: string | null;
  reviewStatus?: "PENDING" | "REVIEWED";
  reviewerId?: string | null;
  reviewerComment?: string | null;
  internalRating?: number | null;
}

export interface University {
  id: string;
  universityName: string;
  city: string;
  country: string;
}

export interface Program {
  id: string;
  programName: string;
  degreeType: string | null;
  universityId: string;
  university?: {
    universityName: string;
  } | null;
}

export interface AdmissionWithRelations {
  id: string;
  universityId: string;
  programId: string;
  university: {
    universityName: string;
    city: string;
    country: string;
  };
  program: {
    programName: string;
    degreeType: string | null;
  };
}

export interface IntakeWithRelations {
  id: string;
  admissionId: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
}

// ================== SERVICE FUNCTIONS ==================

// Create a new essay prompt
export const createEssayPrompt = async (data: EssayPromptInput): Promise<EssayPrompt> => {
  return await prisma.essayPrompt.create({
    data: {
      admissionId: data.admissionId || null,
      programId: data.programId || null,
      intakeId: data.intakeId || null,
      promptTitle: data.promptTitle,
      promptText: data.promptText,
      wordLimit: data.wordLimit,
      minWordCount: data.minWordCount ?? 0,
      isMandatory: data.isMandatory ?? true,
      isActive: data.isActive ?? true,
    }
  });
};

// Update an existing essay prompt
export const updateEssayPrompt = async (id: string, data: EssayPromptUpdateInput): Promise<EssayPrompt> => {
  return await prisma.essayPrompt.update({
    where: { id },
    data: {
      programId: data.programId !== undefined ? data.programId : undefined,
      intakeId: data.intakeId !== undefined ? data.intakeId : undefined,
      promptTitle: data.promptTitle,
      promptText: data.promptText,
      wordLimit: data.wordLimit,
      minWordCount: data.minWordCount,
      isMandatory: data.isMandatory,
      isActive: data.isActive,
    }
  });
};

// Delete an essay prompt
export const deleteEssayPrompt = async (id: string): Promise<void> => {
  // Delete related essays first
  await prisma.essay.deleteMany({
    where: { essayPromptId: id }
  });

  // Also delete from EssaySubmission if exists
  await prisma.essaySubmission.deleteMany({
    where: { essayPromptId: id }
  });

  await prisma.essayPrompt.delete({
    where: { id }
  });
};

// Create a new essay submission
export const createEssaySubmission = async (data: EssaySubmissionInput): Promise<EssaySubmission> => {
  const wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;

  return await prisma.essaySubmission.create({
    data: {
      essayPromptId: data.essayPromptId,
      userId: data.userId || null,
      applicationId: data.applicationId || null,
      title: data.title || null,
      content: data.content,
      wordCount,
      isUsingTemplate: data.isUsingTemplate ?? false,
      templateVersion: data.templateVersion || null,
      status: "DRAFT",
      reviewStatus: "PENDING",
    }
  }) as EssaySubmission;
};

// Update an existing essay submission
export const updateEssaySubmission = async (id: string, data: EssaySubmissionUpdateInput): Promise<EssaySubmission> => {
  const updateData: any = {
    title: data.title !== undefined ? data.title : undefined,
    status: data.status,
    isUsingTemplate: data.isUsingTemplate,
    templateVersion: data.templateVersion !== undefined ? data.templateVersion : undefined,
    reviewStatus: data.reviewStatus,
    reviewerId: data.reviewerId !== undefined ? data.reviewerId : undefined,
    reviewerComment: data.reviewerComment,
    internalRating: data.internalRating,
    lastEditedAt: new Date(),
  };

  if (data.content !== undefined) {
    updateData.content = data.content;
    updateData.wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;
  }

  if (data.status === "SUBMITTED") {
    updateData.submissionDate = new Date();
  }

  return await prisma.essaySubmission.update({
    where: { id },
    data: updateData
  }) as EssaySubmission;
};

// ✅ FIXED: Fetch all essay prompts with essay count from Essay table
export const getEssayPrompts = async () => {
  try {
    const prompts = await prisma.essayPrompt.findMany({
      include: {
        admission: {
          include: {
            university: {
              select: {
                universityName: true,
                city: true,
                country: true
              }
            },
            program: {
              select: {
                programName: true,
                degreeType: true
              }
            }
          }
        },
        program: {
          include: {
            university: {
              select: {
                universityName: true
              }
            }
          }
        },
        intake: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter out any prompts with invalid relations
    const validPrompts = prompts.filter(prompt => {
      if (prompt.admission && !prompt.admission.university) return false;
      if (prompt.program && !prompt.program.university) return false;
      return true;
    });

    // ✅ Get essay counts from Essay table
    const promptIds = validPrompts.map(p => p.id);
    const essayCounts = await prisma.essay.groupBy({
      by: ['essayPromptId'],
      where: {
        essayPromptId: { in: promptIds }
      },
      _count: {
        id: true
      }
    });

    // Create a map for quick lookup
    const countsMap = new Map<string, number>();
    essayCounts.forEach(item => {
      if (item.essayPromptId) {
        countsMap.set(item.essayPromptId, item._count.id);
      }
    });

    // Merge counts with prompts
    return validPrompts.map(prompt => ({
      ...prompt,
      _count: {
        submissions: countsMap.get(prompt.id) || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching essay prompts:', error);
    return [];
  }
};

// ✅ FIXED: Fetch essay prompts with filters and essay count from Essay table
export const getEssayPromptsWithFilters = async (filters: {
  universityId?: string;
  programId?: string;
  admissionId?: string;
  intakeId?: string;
  isMandatory?: boolean;
  isActive?: boolean;
}) => {
  try {
    const where: any = {};

    if (filters.admissionId) {
      where.admissionId = filters.admissionId;
    }

    if (filters.programId) {
      where.programId = filters.programId;
    }

    if (filters.intakeId) {
      where.intakeId = filters.intakeId;
    }

    if (filters.isMandatory !== undefined) {
      where.isMandatory = filters.isMandatory;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // University filter checks BOTH admission AND program relations
    if (filters.universityId) {
      where.OR = [
        {
          admission: {
            universityId: filters.universityId
          }
        },
        {
          program: {
            universityId: filters.universityId
          }
        }
      ];
    }

    const prompts = await prisma.essayPrompt.findMany({
      where,
      include: {
        admission: {
          include: {
            university: {
              select: {
                universityName: true,
                city: true,
                country: true
              }
            },
            program: {
              select: {
                programName: true,
                degreeType: true
              }
            }
          }
        },
        program: {
          include: {
            university: {
              select: {
                universityName: true
              }
            }
          }
        },
        intake: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter out any prompts with invalid relations
    const validPrompts = prompts.filter(prompt => {
      if (prompt.admission && !prompt.admission.university) return false;
      if (prompt.program && !prompt.program.university) return false;
      return true;
    });

    // ✅ Get essay counts from Essay table
    const promptIds = validPrompts.map(p => p.id);
    const essayCounts = await prisma.essay.groupBy({
      by: ['essayPromptId'],
      where: {
        essayPromptId: { in: promptIds }
      },
      _count: {
        id: true
      }
    });

    // Create a map for quick lookup
    const countsMap = new Map<string, number>();
    essayCounts.forEach(item => {
      if (item.essayPromptId) {
        countsMap.set(item.essayPromptId, item._count.id);
      }
    });

    // Merge counts with prompts
    return validPrompts.map(prompt => ({
      ...prompt,
      _count: {
        submissions: countsMap.get(prompt.id) || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching essay prompts with filters:', error);
    return [];
  }
};

// Fetch all essays from Essay table
export const getEssaySubmissions = async () => {
  try {
    const essays = await prisma.essay.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            programName: true,
            degreeType: true,
            university: {
              select: {
                universityName: true,
                city: true,
                country: true
              }
            }
          }
        },
        essayPrompt: {
          select: {
            id: true,
            promptTitle: true,
            promptText: true,
            wordLimit: true
          }
        },
        _count: {
          select: {
            versions: true,
            aiResults: true,
            completionLogs: true
          }
        }
      },
      orderBy: { lastModified: 'desc' }
    });

    // Filter out essays with invalid relations (orphaned data)
    const validEssays = essays.filter(essay => essay.program?.university !== null);

    return validEssays.map(essay => ({
      id: essay.id,
      essayPromptId: essay.essayPromptId,
      userId: essay.userId,
      applicationId: essay.applicationId,
      title: essay.title,
      content: essay.content,
      wordCount: essay.wordCount,
      isUsingTemplate: false,
      templateVersion: null,
      status: essay.status as any,
      reviewStatus: essay.isCompleted ? "REVIEWED" : "PENDING",
      reviewerId: null,
      reviewerComment: null,
      internalRating: null,
      submissionDate: essay.completedAt,
      lastEditedAt: essay.lastModified,
      createdAt: essay.createdAt,
      updatedAt: essay.updatedAt,
      essayPrompt: essay.essayPrompt ? {
        id: essay.essayPrompt.id,
        promptTitle: essay.essayPrompt.promptTitle,
        promptText: essay.essayPrompt.promptText,
        wordLimit: essay.essayPrompt.wordLimit,
        admission: null
      } : {
        id: '',
        promptTitle: essay.title || 'Untitled',
        promptText: '',
        wordLimit: essay.wordCount,
        admission: {
          university: {
            universityName: essay.program?.university?.universityName || 'N/A'
          },
          program: {
            programName: essay.program?.programName || 'N/A'
          }
        }
      },
      user: essay.user,
      application: essay.application,
      _count: essay._count,
      completionPercentage: essay.completionPercentage,
      priority: essay.priority,
      isCompleted: essay.isCompleted,
      completedAt: essay.completedAt,
      lastModified: essay.lastModified,
      program: essay.program
    }));
  } catch (error) {
    console.error('Error fetching essays:', error);
    return [];
  }
};

// Fetch essay submissions with filters
export const getEssaySubmissionsWithFilters = async (filters: {
  status?: string;
  reviewStatus?: string;
  universityId?: string;
  programId?: string;
  priority?: string;
  isCompleted?: boolean;
  hasAIAnalysis?: boolean;
}) => {
  try {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.isCompleted !== undefined) {
      where.isCompleted = filters.isCompleted;
    }

    if (filters.programId) {
      where.programId = filters.programId;
    }

    // University filter
    if (filters.universityId) {
      where.program = {
        universityId: filters.universityId
      };
    }

    const essays = await prisma.essay.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            programName: true,
            degreeType: true,
            university: {
              select: {
                universityName: true,
                city: true,
                country: true
              }
            }
          }
        },
        essayPrompt: {
          select: {
            id: true,
            promptTitle: true,
            promptText: true,
            wordLimit: true
          }
        },
        _count: {
          select: {
            versions: true,
            aiResults: true,
            completionLogs: true
          }
        }
      },
      orderBy: { lastModified: 'desc' }
    });

    // Filter out essays with invalid relations (orphaned data)
    let filteredEssays = essays.filter(essay => essay.program?.university !== null);

    // Filter by AI analysis if needed
    if (filters.hasAIAnalysis !== undefined) {
      filteredEssays = filteredEssays.filter(essay =>
        filters.hasAIAnalysis
          ? essay._count.aiResults > 0
          : essay._count.aiResults === 0
      );
    }

    // Filter by review status (client-side since it's derived from isCompleted)
    if (filters.reviewStatus) {
      filteredEssays = filteredEssays.filter(essay => {
        if (filters.reviewStatus === "REVIEWED") return essay.isCompleted;
        if (filters.reviewStatus === "PENDING") return !essay.isCompleted;
        return true;
      });
    }

    return filteredEssays.map(essay => ({
      id: essay.id,
      essayPromptId: essay.essayPromptId,
      userId: essay.userId,
      applicationId: essay.applicationId,
      title: essay.title,
      content: essay.content,
      wordCount: essay.wordCount,
      isUsingTemplate: false,
      templateVersion: null,
      status: essay.status as any,
      reviewStatus: essay.isCompleted ? "REVIEWED" : "PENDING",
      reviewerId: null,
      reviewerComment: null,
      internalRating: null,
      submissionDate: essay.completedAt,
      lastEditedAt: essay.lastModified,
      createdAt: essay.createdAt,
      updatedAt: essay.updatedAt,
      essayPrompt: essay.essayPrompt ? {
        id: essay.essayPrompt.id,
        promptTitle: essay.essayPrompt.promptTitle,
        promptText: essay.essayPrompt.promptText,
        wordLimit: essay.essayPrompt.wordLimit,
        admission: null
      } : {
        id: '',
        promptTitle: essay.title || 'Untitled',
        promptText: '',
        wordLimit: essay.wordCount,
        admission: {
          university: {
            universityName: essay.program?.university?.universityName || 'N/A'
          },
          program: {
            programName: essay.program?.programName || 'N/A'
          }
        }
      },
      user: essay.user,
      application: essay.application,
      _count: essay._count,
      completionPercentage: essay.completionPercentage,
      priority: essay.priority,
      isCompleted: essay.isCompleted,
      completedAt: essay.completedAt,
      lastModified: essay.lastModified,
      program: essay.program
    }));
  } catch (error) {
    console.error('Error fetching essays with filters:', error);
    return [];
  }
};

// Fetch universities
export const getUniversities = async (): Promise<University[]> => {
  try {
    return await prisma.university.findMany({
      select: {
        id: true,
        universityName: true,
        city: true,
        country: true
      },
      orderBy: { universityName: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
};

// Fetch programs
export const getPrograms = async (): Promise<Program[]> => {
  try {
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        programName: true,
        degreeType: true,
        universityId: true,
        university: {
          select: {
            universityName: true
          }
        }
      },
      orderBy: { programName: 'asc' }
    });

    // Filter out programs with null universities (orphaned data)
    return programs.filter(program => program.university !== null) as Program[];
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
};

// Fetch admissions with relations
export const getAdmissions = async (): Promise<AdmissionWithRelations[]> => {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        university: {
          select: {
            universityName: true,
            city: true,
            country: true
          }
        },
        program: {
          select: {
            programName: true,
            degreeType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter out admissions with invalid relations
    return admissions.filter(admission =>
      admission.university !== null && admission.program !== null
    ) as AdmissionWithRelations[];
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return [];
  }
};

// Fetch all intakes
export const getAllIntakes = async (): Promise<IntakeWithRelations[]> => {
  try {
    return await prisma.intake.findMany({
      select: {
        id: true,
        admissionId: true,
        intakeName: true,
        intakeType: true,
        intakeYear: true
      },
      orderBy: { intakeYear: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching intakes:', error);
    return [];
  }
};

// Fetch intakes for specific admission
export const getIntakesForAdmission = async (admissionId: string): Promise<IntakeWithRelations[]> => {
  try {
    return await prisma.intake.findMany({
      where: { admissionId },
      select: {
        id: true,
        admissionId: true,
        intakeName: true,
        intakeType: true,
        intakeYear: true
      },
      orderBy: { intakeYear: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching intakes for admission:', error);
    return [];
  }
};

// Fetch detailed essay with all related data
export const getEssayDetail = async (essayId: string) => {
  try {
    const essay = await prisma.essay.findUnique({
      where: { id: essayId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            programName: true,
            degreeType: true,
            university: {
              select: {
                universityName: true,
                city: true,
                country: true
              }
            }
          }
        },
        essayPrompt: {
          select: {
            id: true,
            promptTitle: true,
            promptText: true,
            wordLimit: true
          }
        },
        versions: {
          orderBy: { timestamp: 'desc' }
        },
        aiResults: {
          orderBy: { createdAt: 'desc' }
        },
        completionLogs: {
          orderBy: { completedAt: 'desc' }
        },
        _count: {
          select: {
            versions: true,
            aiResults: true,
            completionLogs: true
          }
        }
      }
    });

    if (!essay) return null;

    const latestAIAnalysis = essay.aiResults[0] || null;

    return {
      ...essay,
      latestAIAnalysis
    };
  } catch (error) {
    console.error('Error fetching essay detail:', error);
    return null;
  }
};
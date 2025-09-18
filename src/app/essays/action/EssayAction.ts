/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
"use server";
import {prisma} from '@/lib/prisma';

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
  };
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
  await prisma.essaySubmission.deleteMany({
    where: { essayPromptId: id }
  });
  
  await prisma.essayPrompt.delete({
    where: { id }
  });
};

// Create a new essay submission
export const createEssaySubmission = async (data: EssaySubmissionInput): Promise<EssaySubmission> => {
  const wordCount = data.content.split(/\s+/).length;
  
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
  const updateData: Partial<EssaySubmission> = {
    title: data.title !== undefined ? data.title : undefined,
    status: data.status as "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | undefined,
    isUsingTemplate: data.isUsingTemplate,
    templateVersion: data.templateVersion !== undefined ? data.templateVersion : undefined,
    reviewStatus: data.reviewStatus as "PENDING" | "REVIEWED" | undefined,
    reviewerId: data.reviewerId !== undefined ? data.reviewerId : undefined,
    reviewerComment: data.reviewerComment,
    internalRating: data.internalRating,
    lastEditedAt: new Date(),
  };

  if (data.content !== undefined) {
    updateData.content = data.content;
    updateData.wordCount = data.content.split(/\s+/).length;
  }

  if (data.status === "SUBMITTED") {
    updateData.submissionDate = new Date();
  }

  return await prisma.essaySubmission.update({
    where: { id },
    data: updateData
  }) as EssaySubmission;
};

// Fetch all essay prompts with relations
export const getEssayPrompts = async () => {
  return await prisma.essayPrompt.findMany({
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
      intake: true,
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Fetch essay prompts with filters
export const getEssayPromptsWithFilters = async (filters: {
  universityId?: string;
  programId?: string;
  admissionId?: string;
  isActive?: boolean;
}) => {
  const where: any = {};
  
  if (filters.admissionId) {
    where.admissionId = filters.admissionId;
  }
  
  if (filters.programId) {
    where.programId = filters.programId;
  }
  
  if (filters.universityId) {
    where.admission = {
      universityId: filters.universityId
    };
  }
  
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return await prisma.essayPrompt.findMany({
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
      intake: true,
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Fetch all essay submissions with relations
export const getEssaySubmissions = async () => {
  return await prisma.essaySubmission.findMany({
    include: {
      essayPrompt: {
        select: {
          promptTitle: true,
          wordLimit: true,
          admission: {
            include: {
              university: {
                select: {
                  universityName: true
                }
              },
              program: {
                select: {
                  programName: true
                }
              }
            }
          }
        }
      },
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
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Fetch essay submissions with filters
export const getEssaySubmissionsWithFilters = async (filters: {
  status?: string;
  reviewStatus?: string;
  universityId?: string;
  programId?: string;
}) => {
  const where: any = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.reviewStatus) {
    where.reviewStatus = filters.reviewStatus;
  }
  
  if (filters.universityId || filters.programId) {
    where.essayPrompt = {};
    
    if (filters.universityId) {
      where.essayPrompt.admission = {
        universityId: filters.universityId
      };
    }
    
    if (filters.programId) {
      where.essayPrompt.programId = filters.programId;
    }
  }

  return await prisma.essaySubmission.findMany({
    where,
    include: {
      essayPrompt: {
        select: {
          promptTitle: true,
          wordLimit: true,
          admission: {
            include: {
              university: {
                select: {
                  universityName: true
                }
              },
              program: {
                select: {
                  programName: true
                }
              }
            }
          }
        }
      },
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
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Fetch universities
export const getUniversities = async (): Promise<University[]> => {
  return await prisma.university.findMany({
    select: {
      id: true,
      universityName: true,
      city: true,
      country: true
    },
    orderBy: { universityName: 'asc' }
  });
};

// Fetch programs
export const getPrograms = async (): Promise<Program[]> => {
  return await prisma.program.findMany({
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
};

// Fetch admissions with relations
export const getAdmissions = async (): Promise<AdmissionWithRelations[]> => {
  return await prisma.admission.findMany({
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
};

// Fetch all intakes
export const getAllIntakes = async (): Promise<IntakeWithRelations[]> => {
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
};

// Fetch intakes for specific admission
export const getIntakesForAdmission = async (admissionId: string): Promise<IntakeWithRelations[]> => {
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
};
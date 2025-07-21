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
  admissionId: string;
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

// Fetch all essay prompts
// Enhanced getEssayPrompts to include related data
export const getEssayPrompts = async () => {
  return await prisma.essayPrompt.findMany({
    include: {
      admission: true,
      program: true,
      intake: true,
      _count: {
        select: { submissions: true }
      }
    }
  });
};

// Enhanced getEssaySubmissions to include related data
export const getEssaySubmissions = async () => {
  return await prisma.essaySubmission.findMany({
    include: {
      essayPrompt: {
        select: {
          promptTitle: true,
          wordLimit: true
        }
      },
      user: true,
      application: true
    }
  });
};

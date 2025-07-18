// lib/essayActions.ts
import { prisma } from "@/lib/prisma";

// ================== INTERFACES ==================

export interface EssayPromptInput {
  admissionId: string;
  programId?: string;
  intakeId?: string;
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
  programId?: string;
  intakeId?: string;
}

export interface EssaySubmissionInput {
  essayPromptId: string;
  userId?: string;
  applicationId?: string;
  title?: string;
  content: string;
  isUsingTemplate?: boolean;
  templateVersion?: string;
}

export interface EssaySubmissionUpdateInput {
  title?: string;
  content?: string;
  status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  isUsingTemplate?: boolean;
  templateVersion?: string;
  reviewStatus?: "PENDING" | "REVIEWED";
  reviewerId?: string;
  reviewerComment?: string;
  internalRating?: number;
}
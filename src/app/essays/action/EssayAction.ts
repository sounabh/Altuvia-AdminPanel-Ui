// Create Essay Prompt
export const createEssayPrompt = async (data: EssayPromptInput) => {
  return await prisma.essayPrompt.create({
    data: {
      ...data,
      minWordCount: data.minWordCount ?? 0,
      isMandatory: data.isMandatory ?? true,
      isActive: data.isActive ?? true,
    },
  });
};

// Get All Essay Prompts
export const getAllEssayPrompts = async () => {
  return await prisma.essayPrompt.findMany({
    include: {
      program: true,
      intake: true,
      admission: true,
    },
  });
};

// Get Essay Prompt by ID
export const getEssayPromptById = async (id: string) => {
  return await prisma.essayPrompt.findUnique({
    where: { id },
    include: {
      program: true,
      intake: true,
      admission: true,
    },
  });
};

// Update Essay Prompt
export const updateEssayPrompt = async (id: string, data: EssayPromptUpdateInput) => {
  return await prisma.essayPrompt.update({
    where: { id },
    data,
  });
};

// Delete Essay Prompt
export const deleteEssayPrompt = async (id: string) => {
  return await prisma.essayPrompt.delete({
    where: { id },
  });
};

// ================== ESSAY SUBMISSION ACTIONS ==================

// Create Essay Submission
export const createEssaySubmission = async (data: EssaySubmissionInput) => {
  const wordCount = data.content?.split(/\s+/).length ?? 0;

  return await prisma.essaySubmission.create({
    data: {
      ...data,
      wordCount,
      status: "DRAFT",
    },
  });
};

// Get All Essay Submissions (optional filters)
export const getEssaySubmissions = async ({
  essayPromptId,
  userId,
  applicationId,
}: {
  essayPromptId?: string;
  userId?: string;
  applicationId?: string;
}) => {
  return await prisma.essaySubmission.findMany({
    where: {
      ...(essayPromptId ? { essayPromptId } : {}),
      ...(userId ? { userId } : {}),
      ...(applicationId ? { applicationId } : {}),
    },
    include: {
      essayPrompt: true,
      user: true,
      application: true,
    },
  });
};

// Get Submission by ID
export const getEssaySubmissionById = async (id: string) => {
  return await prisma.essaySubmission.findUnique({
    where: { id },
    include: {
      essayPrompt: true,
      user: true,
      application: true,
    },
  });
};

// Update Essay Submission
export const updateEssaySubmission = async (id: string, data: EssaySubmissionUpdateInput) => {
  const wordCount = data.content ? data.content.split(/\s+/).length : undefined;

  return await prisma.essaySubmission.update({
    where: { id },
    data: {
      ...data,
      ...(wordCount !== undefined ? { wordCount } : {}),
      lastEditedAt: new Date(),
    },
  });
};

// Delete Essay Submission
export const deleteEssaySubmission = async (id: string) => {
  return await prisma.essaySubmission.delete({
    where: { id },
  });
};
✅ How to Use (Example in a Route or Server Component)
ts
Copy
Edit
// app/api/essay-prompts/create/route.ts (or inside a server action)
import { createEssayPrompt } from "@/lib/essayActions";

const prompt = await createEssayPrompt({
  admissionId: "admis_123",
  promptTitle: "Why do you want to study here?",
  promptText: "Explain your goals and reasons.",
  wordLimit: 500,
});
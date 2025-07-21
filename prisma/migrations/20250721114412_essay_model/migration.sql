/*
  Warnings:

  - Added the required column `documentCategory` to the `application_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityId` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "application_documents" ADD COLUMN     "documentCategory" TEXT NOT NULL,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submissionDeadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "applicationFeesAmount" DOUBLE PRECISION,
ADD COLUMN     "applicationFeesPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedDeadlines" TEXT,
ADD COLUMN     "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "currentStage" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "missedDeadlines" TEXT,
ADD COLUMN     "nextDeadlineId" TEXT,
ADD COLUMN     "programId" TEXT NOT NULL,
ADD COLUMN     "stageUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "universityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "application_progress" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "stageStatus" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "completedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essay_prompts" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "programId" TEXT,
    "intakeId" TEXT,
    "promptTitle" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "wordLimit" INTEGER NOT NULL,
    "minWordCount" INTEGER NOT NULL DEFAULT 0,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essay_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essay_submissions" (
    "id" TEXT NOT NULL,
    "essayPromptId" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submissionDate" TIMESTAMP(3),
    "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUsingTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateVersion" TEXT,
    "reviewStatus" TEXT DEFAULT 'PENDING',
    "reviewerId" TEXT,
    "reviewerComment" TEXT,
    "internalRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essay_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_progress_applicationId_stageName_key" ON "application_progress"("applicationId", "stageName");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_progress" ADD CONSTRAINT "application_progress_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_prompts" ADD CONSTRAINT "essay_prompts_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "admissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_prompts" ADD CONSTRAINT "essay_prompts_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_prompts" ADD CONSTRAINT "essay_prompts_intakeId_fkey" FOREIGN KEY ("intakeId") REFERENCES "intakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_submissions" ADD CONSTRAINT "essay_submissions_essayPromptId_fkey" FOREIGN KEY ("essayPromptId") REFERENCES "essay_prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_submissions" ADD CONSTRAINT "essay_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essay_submissions" ADD CONSTRAINT "essay_submissions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "fee_structures" ADD COLUMN     "installmentCount" INTEGER DEFAULT 1,
ADD COLUMN     "paymentTerms" TEXT;

-- CreateTable
CREATE TABLE "essays" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "programId" TEXT NOT NULL,
    "essayPromptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "wordLimit" INTEGER NOT NULL DEFAULT 500,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAutoSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoSaveEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "essays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essay_versions" (
    "id" TEXT NOT NULL,
    "essayId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAutoSave" BOOLEAN NOT NULL DEFAULT false,
    "changesSinceLastVersion" TEXT,

    CONSTRAINT "essay_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_results" (
    "id" TEXT NOT NULL,
    "essayId" TEXT NOT NULL,
    "essayVersionId" TEXT,
    "analysisType" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "suggestions" TEXT NOT NULL,
    "strengths" TEXT,
    "improvements" TEXT,
    "warnings" TEXT,
    "aiProvider" TEXT NOT NULL DEFAULT 'gemini',
    "modelUsed" TEXT,
    "promptVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "processingTime" INTEGER,
    "errorMessage" TEXT,
    "readabilityScore" DOUBLE PRECISION,
    "sentenceCount" INTEGER,
    "paragraphCount" INTEGER,
    "avgSentenceLength" DOUBLE PRECISION,
    "complexWordCount" INTEGER,
    "passiveVoiceCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "essays_userId_programId_essayPromptId_key" ON "essays"("userId", "programId", "essayPromptId");

-- CreateIndex
CREATE INDEX "essay_versions_essayId_timestamp_idx" ON "essay_versions"("essayId", "timestamp");

-- CreateIndex
CREATE INDEX "ai_results_essayId_analysisType_idx" ON "ai_results"("essayId", "analysisType");

-- CreateIndex
CREATE INDEX "ai_results_essayVersionId_idx" ON "ai_results"("essayVersionId");

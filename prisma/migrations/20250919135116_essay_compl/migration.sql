-- AlterTable
ALTER TABLE "essays" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "essay_completion_logs" (
    "id" TEXT NOT NULL,
    "essayId" TEXT NOT NULL,
    "userId" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wordCountAtCompletion" INTEGER NOT NULL,
    "wordLimit" INTEGER NOT NULL,
    "completionMethod" TEXT NOT NULL,
    "previousStatus" TEXT,
    "programId" TEXT,
    "universityId" TEXT,
    "essayPromptTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "essay_completion_logs_pkey" PRIMARY KEY ("id")
);

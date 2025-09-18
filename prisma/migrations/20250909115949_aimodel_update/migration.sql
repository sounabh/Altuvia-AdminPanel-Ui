-- AlterTable
ALTER TABLE "ai_results" ADD COLUMN     "contentRelevance" DOUBLE PRECISION,
ADD COLUMN     "grammarIssues" INTEGER,
ADD COLUMN     "leadershipEmphasis" DOUBLE PRECISION,
ADD COLUMN     "narrativeFlow" DOUBLE PRECISION,
ADD COLUMN     "specificityScore" DOUBLE PRECISION,
ADD COLUMN     "structureScore" DOUBLE PRECISION;

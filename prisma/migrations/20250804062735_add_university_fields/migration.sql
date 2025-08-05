/*
  Warnings:

  - The `whyChooseHighlights` column on the `universities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "universities" ADD COLUMN     "additionalDocumentUrls" TEXT[],
ADD COLUMN     "averageDeadlines" TEXT,
ADD COLUMN     "averageProgramLengthMonths" INTEGER,
ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "intakes" TEXT,
ADD COLUMN     "studentsPerYear" INTEGER,
DROP COLUMN "whyChooseHighlights",
ADD COLUMN     "whyChooseHighlights" TEXT[];

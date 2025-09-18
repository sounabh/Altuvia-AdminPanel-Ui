/*
  Warnings:

  - You are about to drop the column `departmentId` on the `programs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "programs" DROP COLUMN "departmentId";

-- CreateTable
CREATE TABLE "program_departments" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "program_departments_programId_departmentId_key" ON "program_departments"("programId", "departmentId");

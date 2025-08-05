-- DropForeignKey
ALTER TABLE "admission_deadlines" DROP CONSTRAINT "admission_deadlines_admissionId_fkey";

-- DropForeignKey
ALTER TABLE "admission_deadlines" DROP CONSTRAINT "admission_deadlines_intakeId_fkey";

-- DropForeignKey
ALTER TABLE "admissions" DROP CONSTRAINT "admissions_programId_fkey";

-- DropForeignKey
ALTER TABLE "admissions" DROP CONSTRAINT "admissions_universityId_fkey";

-- DropForeignKey
ALTER TABLE "application_documents" DROP CONSTRAINT "application_documents_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "application_progress" DROP CONSTRAINT "application_progress_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_admissionId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_intakeId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_programId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_universityId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_userId_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_universityId_fkey";

-- DropForeignKey
ALTER TABLE "essay_prompts" DROP CONSTRAINT "essay_prompts_admissionId_fkey";

-- DropForeignKey
ALTER TABLE "essay_prompts" DROP CONSTRAINT "essay_prompts_intakeId_fkey";

-- DropForeignKey
ALTER TABLE "essay_prompts" DROP CONSTRAINT "essay_prompts_programId_fkey";

-- DropForeignKey
ALTER TABLE "essay_submissions" DROP CONSTRAINT "essay_submissions_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "essay_submissions" DROP CONSTRAINT "essay_submissions_essayPromptId_fkey";

-- DropForeignKey
ALTER TABLE "essay_submissions" DROP CONSTRAINT "essay_submissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "external_links" DROP CONSTRAINT "external_links_programId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_programId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_universityId_fkey";

-- DropForeignKey
ALTER TABLE "financial_aid_applications" DROP CONSTRAINT "financial_aid_applications_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "financial_aid_applications" DROP CONSTRAINT "financial_aid_applications_financialAidId_fkey";

-- DropForeignKey
ALTER TABLE "financial_aid_applications" DROP CONSTRAINT "financial_aid_applications_userId_fkey";

-- DropForeignKey
ALTER TABLE "financial_aids" DROP CONSTRAINT "financial_aids_programId_fkey";

-- DropForeignKey
ALTER TABLE "financial_aids" DROP CONSTRAINT "financial_aids_universityId_fkey";

-- DropForeignKey
ALTER TABLE "intakes" DROP CONSTRAINT "intakes_admissionId_fkey";

-- DropForeignKey
ALTER TABLE "interviews" DROP CONSTRAINT "interviews_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "payment_schedules" DROP CONSTRAINT "payment_schedules_tuitionBreakdownId_fkey";

-- DropForeignKey
ALTER TABLE "program_rankings" DROP CONSTRAINT "program_rankings_programId_fkey";

-- DropForeignKey
ALTER TABLE "programs" DROP CONSTRAINT "programs_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "programs" DROP CONSTRAINT "programs_universityId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "scholarship_applications" DROP CONSTRAINT "scholarship_applications_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "scholarship_applications" DROP CONSTRAINT "scholarship_applications_scholarshipId_fkey";

-- DropForeignKey
ALTER TABLE "scholarship_applications" DROP CONSTRAINT "scholarship_applications_userId_fkey";

-- DropForeignKey
ALTER TABLE "scholarship_documents" DROP CONSTRAINT "scholarship_documents_scholarshipId_fkey";

-- DropForeignKey
ALTER TABLE "scholarships" DROP CONSTRAINT "scholarships_programId_fkey";

-- DropForeignKey
ALTER TABLE "scholarships" DROP CONSTRAINT "scholarships_universityId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "syllabi" DROP CONSTRAINT "syllabi_programId_fkey";

-- DropForeignKey
ALTER TABLE "tuition_breakdowns" DROP CONSTRAINT "tuition_breakdowns_programId_fkey";

-- DropForeignKey
ALTER TABLE "tuition_breakdowns" DROP CONSTRAINT "tuition_breakdowns_universityId_fkey";

-- DropForeignKey
ALTER TABLE "university_images" DROP CONSTRAINT "university_images_universityId_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

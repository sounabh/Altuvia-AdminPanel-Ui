-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "provider" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "countries" TEXT[],
    "courses" TEXT[],
    "studyLevel" TEXT,
    "gpa" TEXT,
    "testScores" TEXT,
    "workExperience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "billingCycle" TEXT,
    "trialStartDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT,
    "plan" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripeEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "fullAddress" TEXT,
    "shortDescription" TEXT,
    "overview" TEXT,
    "history" TEXT,
    "missionStatement" TEXT,
    "visionStatement" TEXT,
    "accreditationDetails" TEXT,
    "whyChooseHighlights" TEXT[],
    "careerOutcomes" TEXT,
    "ftGlobalRanking" INTEGER,
    "ftRegionalRanking" INTEGER,
    "ftRankingYear" INTEGER,
    "usNewsRanking" INTEGER,
    "qsRanking" INTEGER,
    "timesRanking" INTEGER,
    "acceptanceRate" DOUBLE PRECISION,
    "gmatAverageScore" INTEGER,
    "gmatScoreMin" INTEGER,
    "gmatScoreMax" INTEGER,
    "minimumGpa" DOUBLE PRECISION,
    "languageTestRequirements" TEXT,
    "tuitionFees" DOUBLE PRECISION,
    "additionalFees" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "scholarshipInfo" TEXT,
    "financialAidDetails" TEXT,
    "admissionsOfficeContact" TEXT,
    "internationalOfficeContact" TEXT,
    "generalInquiriesContact" TEXT,
    "websiteUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageDeadlines" TEXT,
    "studentsPerYear" INTEGER,
    "brochureUrl" TEXT,
    "additionalDocumentUrls" TEXT[],
    "averageProgramLengthMonths" INTEGER,
    "intakes" TEXT,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities_backup" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "fullAddress" TEXT,
    "shortDescription" TEXT,
    "overview" TEXT,
    "history" TEXT,
    "missionStatement" TEXT,
    "visionStatement" TEXT,
    "accreditationDetails" TEXT,
    "whyChooseHighlights" TEXT[],
    "careerOutcomes" TEXT,
    "ftGlobalRanking" INTEGER,
    "ftRegionalRanking" INTEGER,
    "ftRankingYear" INTEGER,
    "usNewsRanking" INTEGER,
    "qsRanking" INTEGER,
    "timesRanking" INTEGER,
    "acceptanceRate" DOUBLE PRECISION,
    "gmatAverageScore" INTEGER,
    "gmatScoreMin" INTEGER,
    "gmatScoreMax" INTEGER,
    "minimumGpa" DOUBLE PRECISION,
    "languageTestRequirements" TEXT,
    "tuitionFees" DOUBLE PRECISION,
    "additionalFees" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "scholarshipInfo" TEXT,
    "financialAidDetails" TEXT,
    "admissionsOfficeContact" TEXT,
    "internationalOfficeContact" TEXT,
    "generalInquiriesContact" TEXT,
    "websiteUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "canonicalUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageDeadlines" TEXT,
    "studentsPerYear" INTEGER,
    "brochureUrl" TEXT,
    "additionalDocumentUrls" TEXT[],
    "averageProgramLengthMonths" INTEGER,
    "intakes" TEXT,

    CONSTRAINT "universities_backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_images" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" TEXT,
    "imageTitle" TEXT,
    "imageAltText" TEXT NOT NULL,
    "imageCaption" TEXT,
    "fileSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_departments" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "programSlug" TEXT NOT NULL,
    "degreeType" TEXT,
    "programLength" INTEGER,
    "specializations" TEXT,
    "programDescription" TEXT,
    "curriculumOverview" TEXT,
    "admissionRequirements" TEXT,
    "averageEntranceScore" DOUBLE PRECISION,
    "programTuitionFees" DOUBLE PRECISION,
    "programAdditionalFees" DOUBLE PRECISION,
    "programMetaTitle" TEXT,
    "programMetaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs_backup" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "programSlug" TEXT NOT NULL,
    "degreeType" TEXT,
    "programLength" INTEGER,
    "specializations" TEXT,
    "programDescription" TEXT,
    "curriculumOverview" TEXT,
    "admissionRequirements" TEXT,
    "averageEntranceScore" DOUBLE PRECISION,
    "programTuitionFees" DOUBLE PRECISION,
    "programAdditionalFees" DOUBLE PRECISION,
    "programMetaTitle" TEXT,
    "programMetaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "syllabi" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "syllabi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_rankings" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_links" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admissions" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "minimumGpa" DOUBLE PRECISION,
    "maximumGpa" DOUBLE PRECISION,
    "gmatMinScore" INTEGER,
    "gmatMaxScore" INTEGER,
    "gmatAverageScore" INTEGER,
    "greMinScore" INTEGER,
    "greMaxScore" INTEGER,
    "greAverageScore" INTEGER,
    "ieltsMinScore" DOUBLE PRECISION,
    "toeflMinScore" INTEGER,
    "pteMinScore" INTEGER,
    "duolingoMinScore" INTEGER,
    "languageExemptions" TEXT,
    "workExperienceRequired" BOOLEAN NOT NULL DEFAULT false,
    "minWorkExperience" INTEGER,
    "maxWorkExperience" INTEGER,
    "preferredIndustries" TEXT,
    "applicationFee" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "documentsRequired" TEXT,
    "additionalRequirements" TEXT,
    "acceptanceRate" DOUBLE PRECISION,
    "totalApplications" INTEGER,
    "totalAccepted" INTEGER,
    "statisticsYear" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "admissionStatus" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intakes" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "intakeName" TEXT NOT NULL,
    "intakeType" TEXT NOT NULL,
    "intakeYear" INTEGER NOT NULL,
    "intakeMonth" INTEGER NOT NULL,
    "totalSeats" INTEGER,
    "availableSeats" INTEGER,
    "internationalSeats" INTEGER,
    "domesticSeats" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "applicationOpenDate" TIMESTAMP(3),
    "applicationCloseDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "intakeStatus" TEXT NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_deadlines" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "intakeId" TEXT,
    "deadlineType" TEXT NOT NULL,
    "deadlineDate" TIMESTAMP(3) NOT NULL,
    "deadlineTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isExtended" BOOLEAN NOT NULL DEFAULT false,
    "originalDeadline" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "intakeId" TEXT,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "currentGpa" DOUBLE PRECISION,
    "gmatScore" INTEGER,
    "greScore" INTEGER,
    "ieltsScore" DOUBLE PRECISION,
    "toeflScore" INTEGER,
    "pteScore" INTEGER,
    "duolingoScore" INTEGER,
    "workExperienceMonths" INTEGER,
    "workExperienceDetails" TEXT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "currentStage" TEXT NOT NULL DEFAULT 'DRAFT',
    "stageUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "nextDeadlineId" TEXT,
    "completedDeadlines" TEXT,
    "missedDeadlines" TEXT,
    "submissionDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationFeesPaid" BOOLEAN NOT NULL DEFAULT false,
    "applicationFeesAmount" DOUBLE PRECISION,
    "documentsUploaded" TEXT,
    "documentsVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastContactDate" TIMESTAMP(3),
    "contactNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentCategory" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "submissionDeadline" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "documentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "interviewType" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "scheduledTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "duration" INTEGER,
    "interviewerName" TEXT,
    "interviewerEmail" TEXT,
    "meetingLink" TEXT,
    "meetingPassword" TEXT,
    "location" TEXT,
    "interviewStatus" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "interviewScore" DOUBLE PRECISION,
    "interviewFeedback" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "confirmationReceived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuition_breakdowns" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT,
    "academicYear" TEXT NOT NULL,
    "yearNumber" INTEGER NOT NULL,
    "baseTuition" DOUBLE PRECISION NOT NULL,
    "labFees" DOUBLE PRECISION DEFAULT 0,
    "libraryFees" DOUBLE PRECISION DEFAULT 0,
    "technologyFees" DOUBLE PRECISION DEFAULT 0,
    "activityFees" DOUBLE PRECISION DEFAULT 0,
    "healthInsurance" DOUBLE PRECISION DEFAULT 0,
    "dormitoryFees" DOUBLE PRECISION DEFAULT 0,
    "mealPlanFees" DOUBLE PRECISION DEFAULT 0,
    "applicationFee" DOUBLE PRECISION DEFAULT 0,
    "registrationFee" DOUBLE PRECISION DEFAULT 0,
    "examFees" DOUBLE PRECISION DEFAULT 0,
    "graduationFee" DOUBLE PRECISION DEFAULT 0,
    "totalTuition" DOUBLE PRECISION NOT NULL,
    "totalAdditionalFees" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currencySymbol" TEXT NOT NULL DEFAULT '$',
    "paymentTerms" TEXT,
    "installmentCount" INTEGER DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tuition_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_schedules" (
    "id" TEXT NOT NULL,
    "tuitionBreakdownId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "lateFee" DOUBLE PRECISION DEFAULT 0,
    "gracePeroidDays" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarships" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT,
    "scholarshipName" TEXT NOT NULL,
    "scholarshipSlug" TEXT NOT NULL,
    "scholarshipType" TEXT NOT NULL,
    "description" TEXT,
    "eligibilityCriteria" TEXT,
    "amount" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "maxAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "coverageTuition" BOOLEAN NOT NULL DEFAULT false,
    "coverageFees" BOOLEAN NOT NULL DEFAULT false,
    "coverageLiving" BOOLEAN NOT NULL DEFAULT false,
    "coverageBooks" BOOLEAN NOT NULL DEFAULT false,
    "applicationRequired" BOOLEAN NOT NULL DEFAULT true,
    "applicationDeadline" TIMESTAMP(3),
    "documentsRequired" TEXT,
    "totalAvailable" INTEGER,
    "currentlyAwarded" INTEGER DEFAULT 0,
    "minimumGpa" DOUBLE PRECISION,
    "minimumTestScore" INTEGER,
    "testType" TEXT,
    "citizenshipRequired" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applicationOpenDate" TIMESTAMP(3),
    "applicationCloseDate" TIMESTAMP(3),
    "awardDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_documents" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarship_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_applications" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "currentGpa" DOUBLE PRECISION,
    "testScore" INTEGER,
    "testType" TEXT,
    "familyIncome" DOUBLE PRECISION,
    "financialNeed" TEXT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "submissionDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "awardAmount" DOUBLE PRECISION,
    "documentsUploaded" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarship_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structures" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT,
    "structureName" TEXT NOT NULL,
    "structureType" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "tuitionFee" DOUBLE PRECISION NOT NULL,
    "admissionFee" DOUBLE PRECISION DEFAULT 0,
    "registrationFee" DOUBLE PRECISION DEFAULT 0,
    "examFee" DOUBLE PRECISION DEFAULT 0,
    "libraryFee" DOUBLE PRECISION DEFAULT 0,
    "labFee" DOUBLE PRECISION DEFAULT 0,
    "hostelFee" DOUBLE PRECISION DEFAULT 0,
    "messFee" DOUBLE PRECISION DEFAULT 0,
    "transportFee" DOUBLE PRECISION DEFAULT 0,
    "sportsFee" DOUBLE PRECISION DEFAULT 0,
    "medicalFee" DOUBLE PRECISION DEFAULT 0,
    "healthInsurance" DOUBLE PRECISION DEFAULT 0,
    "accidentInsurance" DOUBLE PRECISION DEFAULT 0,
    "studentActivityFee" DOUBLE PRECISION DEFAULT 0,
    "technologyFee" DOUBLE PRECISION DEFAULT 0,
    "securityDeposit" DOUBLE PRECISION DEFAULT 0,
    "cautionMoney" DOUBLE PRECISION DEFAULT 0,
    "isDepositRefundable" BOOLEAN NOT NULL DEFAULT true,
    "totalMandatoryFees" DOUBLE PRECISION NOT NULL,
    "totalOptionalFees" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currencySymbol" TEXT NOT NULL DEFAULT '$',
    "paymentTerms" TEXT,
    "installmentCount" INTEGER DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_aids" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "programId" TEXT,
    "aidName" TEXT NOT NULL,
    "aidType" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "maxAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "interestRate" DOUBLE PRECISION,
    "repaymentPeriod" INTEGER,
    "gracePeriod" INTEGER,
    "eligibilityCriteria" TEXT,
    "minimumGpa" DOUBLE PRECISION,
    "maximumFamilyIncome" DOUBLE PRECISION,
    "citizenshipRequired" TEXT,
    "applicationRequired" BOOLEAN NOT NULL DEFAULT true,
    "applicationDeadline" TIMESTAMP(3),
    "documentsRequired" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applicationOpenDate" TIMESTAMP(3),
    "applicationCloseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_aids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_aid_applications" (
    "id" TEXT NOT NULL,
    "financialAidId" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "familyIncome" DOUBLE PRECISION,
    "assets" DOUBLE PRECISION,
    "liabilities" DOUBLE PRECISION,
    "dependents" INTEGER DEFAULT 0,
    "applicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "submissionDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "approvedAmount" DOUBLE PRECISION,
    "documentsUploaded" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_aid_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "is2FAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "phone" TEXT,
    "profileImageUrl" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastLoginIP" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essay_prompts" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT,
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
CREATE TABLE "essay_prompts_backup" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT,
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

    CONSTRAINT "essay_prompts_backup_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "essays" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "programId" TEXT NOT NULL,
    "essayPromptId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "wordLimit" INTEGER NOT NULL DEFAULT 500,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
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
    "structureScore" DOUBLE PRECISION,
    "contentRelevance" DOUBLE PRECISION,
    "narrativeFlow" DOUBLE PRECISION,
    "leadershipEmphasis" DOUBLE PRECISION,
    "specificityScore" DOUBLE PRECISION,
    "grammarIssues" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_results_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "eventType" TEXT NOT NULL,
    "eventStatus" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "universityId" TEXT,
    "programId" TEXT,
    "applicationId" TEXT,
    "admissionId" TEXT,
    "intakeId" TEXT,
    "admissionDeadlineId" TEXT,
    "interviewId" TEXT,
    "scholarshipId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" TEXT,
    "parentEventId" TEXT,
    "hasReminders" BOOLEAN NOT NULL DEFAULT true,
    "isSystemGenerated" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "completionStatus" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "completionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastModifiedBy" TEXT,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_reminders" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reminderType" TEXT NOT NULL,
    "reminderTime" INTEGER NOT NULL,
    "reminderMessage" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cvs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "targetUniversityId" TEXT,
    "targetProgramId" TEXT,
    "targetCompany" TEXT,
    "targetPosition" TEXT,
    "templateId" TEXT NOT NULL DEFAULT 'modern',
    "colorScheme" TEXT NOT NULL DEFAULT 'blue',
    "fontSize" INTEGER NOT NULL DEFAULT 11,
    "customCSS" TEXT,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sectionsCompleted" TEXT[],
    "atsScore" DOUBLE PRECISION,
    "lastATSCheckAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_personal_info" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "summary" TEXT,
    "headline" TEXT,
    "profileImageUrl" TEXT,
    "showPhoto" BOOLEAN NOT NULL DEFAULT false,
    "showLocation" BOOLEAN NOT NULL DEFAULT true,
    "showPhone" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_educations" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "gpa" TEXT,
    "gpaScale" TEXT,
    "description" TEXT,
    "coursework" TEXT[],
    "honors" TEXT[],
    "showGpa" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_experiences" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "achievements" TEXT[],
    "skillsUsed" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_projects" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[],
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "demoUrl" TEXT,
    "achievements" TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_skills" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "skills" TEXT[],
    "proficiencyLevel" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_achievements" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "impact" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_volunteers" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "role" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "activities" TEXT[],
    "impact" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_versions" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "personalInfoSnapshot" TEXT,
    "educationSnapshot" TEXT,
    "experienceSnapshot" TEXT,
    "projectsSnapshot" TEXT,
    "skillsSnapshot" TEXT,
    "achievementsSnapshot" TEXT,
    "volunteerSnapshot" TEXT,
    "changeDescription" TEXT,
    "isAutoSave" BOOLEAN NOT NULL DEFAULT false,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT NOT NULL,
    "colorScheme" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_ai_analysis" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "sectionName" TEXT,
    "overallScore" DOUBLE PRECISION,
    "atsScore" DOUBLE PRECISION,
    "suggestions" TEXT NOT NULL,
    "strengths" TEXT,
    "improvements" TEXT,
    "warnings" TEXT,
    "wordCount" INTEGER,
    "readabilityScore" DOUBLE PRECISION,
    "keywordMatching" TEXT,
    "sentenceComplexity" DOUBLE PRECISION,
    "actionVerbCount" INTEGER,
    "quantificationCount" INTEGER,
    "atsKeywords" TEXT,
    "atsMissingKeywords" TEXT,
    "atsFormattingIssues" TEXT,
    "aiProvider" TEXT NOT NULL DEFAULT 'gemini',
    "modelUsed" TEXT,
    "promptVersion" TEXT,
    "processingTime" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_exports" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "exportFormat" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "templateUsed" TEXT NOT NULL,
    "colorScheme" TEXT NOT NULL,
    "includePhoto" BOOLEAN NOT NULL DEFAULT false,
    "pageCount" INTEGER,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastDownloadAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'completed',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "category" TEXT NOT NULL,
    "defaultStyles" TEXT NOT NULL,
    "layoutStructure" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedModules" TEXT[],
    "totalQuestionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "leadershipScore" DOUBLE PRECISION,
    "leadership_orientation" INTEGER,
    "decision_making_style" INTEGER,
    "proactiveness" INTEGER,
    "delegation_comfort" INTEGER,
    "natural_leadership" INTEGER,
    "teamworkScore" DOUBLE PRECISION,
    "collaborative_style" INTEGER,
    "mentoring_orientation" INTEGER,
    "extraversion" INTEGER,
    "independence_preference" INTEGER,
    "diversity_seeking" INTEGER,
    "communicationScore" DOUBLE PRECISION,
    "public_speaking_comfort" INTEGER,
    "communication_structure_pref" INTEGER,
    "debate_participation" INTEGER,
    "written_vs_verbal" INTEGER,
    "networking_energy" INTEGER,
    "analyticalScore" DOUBLE PRECISION,
    "data_orientation" INTEGER,
    "analytical_approach" INTEGER,
    "ambiguity_tolerance" INTEGER,
    "systematic_thinking" INTEGER,
    "logic_vs_emotion" INTEGER,
    "innovationScore" DOUBLE PRECISION,
    "risk_tolerance" INTEGER,
    "creativity" INTEGER,
    "open_problem_solving" INTEGER,
    "traditional_vs_experimental" INTEGER,
    "variety_seeking" INTEGER,
    "workStyleScore" DOUBLE PRECISION,
    "pressure_performance" INTEGER,
    "structure_preference" INTEGER,
    "multitasking_ability" INTEGER,
    "time_productivity" INTEGER,
    "work_intensity" INTEGER,
    "learning_preference" TEXT,
    "competitive_learning" INTEGER,
    "curriculum_flexibility" INTEGER,
    "class_size_preference" INTEGER,
    "peer_learning_value" INTEGER,
    "culture_preference" TEXT,
    "diversity_importance" INTEGER,
    "alumni_network_value" INTEGER,
    "social_impact_orientation" INTEGER,
    "entrepreneurial_culture" INTEGER,
    "career_target" TEXT,
    "career_priority" TEXT,
    "professional_motivation" TEXT,
    "longterm_vision" TEXT,
    "recruiter_importance" INTEGER,
    "international_opportunities" INTEGER,
    "class_size_pref" TEXT,
    "teaching_style_pref" TEXT,
    "networking_importance" INTEGER,
    "ranking_importance" INTEGER,
    "entrepreneurship_program_val" INTEGER,
    "scholarship_importance" INTEGER,
    "location_preference" TEXT,
    "region_preference" TEXT,
    "campus_vibe" TEXT,
    "cold_climate_tolerance" INTEGER,
    "business_hub_proximity" INTEGER,
    "campus_size_preference" INTEGER,
    "team_role" TEXT,
    "problem_approach" TEXT,
    "workload_response" TEXT,
    "networking_style" TEXT,
    "feedback_response" TEXT,
    "academic_rigor_priority" INTEGER,
    "alumni_network_priority" INTEGER,
    "career_opportunities_priority" INTEGER,
    "brand_prestige_priority" INTEGER,
    "cost_financial_priority" INTEGER,
    "budget_range" TEXT,
    "loan_willingness" INTEGER,
    "roi_focus" INTEGER,
    "application_strategy" TEXT,
    "competition_comfort" INTEGER,
    "competitive_performance" INTEGER,
    "rawAnswersJson" TEXT,
    "assessmentVersion" TEXT NOT NULL DEFAULT '1.0',
    "overallPersonalityScore" DOUBLE PRECISION,
    "schoolFitScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personality_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "answerValue" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "sessionId" TEXT,
    "moduleIndex" INTEGER NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpentSeconds" INTEGER,
    "wasChanged" BOOLEAN NOT NULL DEFAULT false,
    "previousValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personality_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_matches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "universityId" TEXT,
    "schoolName" TEXT NOT NULL,
    "programName" TEXT,
    "programType" TEXT,
    "overallMatchScore" DOUBLE PRECISION NOT NULL,
    "personalityMatchScore" DOUBLE PRECISION,
    "cultureMatchScore" DOUBLE PRECISION,
    "careerMatchScore" DOUBLE PRECISION,
    "academicMatchScore" DOUBLE PRECISION,
    "locationMatchScore" DOUBLE PRECISION,
    "financialMatchScore" DOUBLE PRECISION,
    "matchingFactors" TEXT,
    "strengthsAlignment" TEXT,
    "considerationFactors" TEXT,
    "keyFeatures" TEXT,
    "isRecommended" BOOLEAN NOT NULL DEFAULT true,
    "recommendationRank" INTEGER,
    "confidenceScore" DOUBLE PRECISION,
    "schoolCulture" TEXT,
    "classSize" TEXT,
    "locationCity" TEXT,
    "locationRegion" TEXT,
    "avgTuition" DOUBLE PRECISION,
    "placementRate" DOUBLE PRECISION,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "savedAt" TIMESTAMP(3),
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3),
    "userRating" INTEGER,
    "userFeedback" TEXT,
    "userNotes" TEXT,
    "matchGeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchAlgorithmVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserSavedUniversities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSavedUniversities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "universities_slug_key" ON "universities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "universities_backup_slug_key" ON "universities_backup"("slug");

-- CreateIndex
CREATE INDEX "program_departments_departmentId_idx" ON "program_departments"("departmentId");

-- CreateIndex
CREATE INDEX "program_departments_programId_idx" ON "program_departments"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "program_departments_programId_departmentId_key" ON "program_departments"("programId", "departmentId");

-- CreateIndex
CREATE INDEX "departments_universityId_idx" ON "departments"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_universityId_slug_key" ON "departments"("universityId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "programs_programSlug_key" ON "programs"("programSlug");

-- CreateIndex
CREATE INDEX "programs_universityId_idx" ON "programs"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "programs_backup_programSlug_key" ON "programs_backup"("programSlug");

-- CreateIndex
CREATE UNIQUE INDEX "syllabi_programId_key" ON "syllabi"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "program_rankings_programId_year_key" ON "program_rankings"("programId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "admissions_universityId_programId_key" ON "admissions"("universityId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "intakes_admissionId_intakeType_intakeYear_key" ON "intakes"("admissionId", "intakeType", "intakeYear");

-- CreateIndex
CREATE UNIQUE INDEX "application_progress_applicationId_stageName_key" ON "application_progress"("applicationId", "stageName");

-- CreateIndex
CREATE UNIQUE INDEX "tuition_breakdowns_universityId_programId_academicYear_year_key" ON "tuition_breakdowns"("universityId", "programId", "academicYear", "yearNumber");

-- CreateIndex
CREATE UNIQUE INDEX "scholarships_universityId_scholarshipSlug_key" ON "scholarships"("universityId", "scholarshipSlug");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structures_universityId_programId_structureType_academi_key" ON "fee_structures"("universityId", "programId", "structureType", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "essay_prompts_programId_idx" ON "essay_prompts"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "essays_userId_programId_essayPromptId_key" ON "essays"("userId", "programId", "essayPromptId");

-- CreateIndex
CREATE INDEX "essay_versions_essayId_timestamp_idx" ON "essay_versions"("essayId", "timestamp");

-- CreateIndex
CREATE INDEX "ai_results_essayId_analysisType_idx" ON "ai_results"("essayId", "analysisType");

-- CreateIndex
CREATE INDEX "ai_results_essayVersionId_idx" ON "ai_results"("essayVersionId");

-- CreateIndex
CREATE INDEX "calendar_events_parentEventId_idx" ON "calendar_events"("parentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_reminders_eventId_userId_reminderTime_reminderType_key" ON "event_reminders"("eventId", "userId", "reminderTime", "reminderType");

-- CreateIndex
CREATE UNIQUE INDEX "cvs_slug_key" ON "cvs"("slug");

-- CreateIndex
CREATE INDEX "cvs_userId_isActive_idx" ON "cvs"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "cvs_userId_slug_key" ON "cvs"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "cv_personal_info_cvId_key" ON "cv_personal_info"("cvId");

-- CreateIndex
CREATE INDEX "cv_educations_cvId_displayOrder_idx" ON "cv_educations"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_experiences_cvId_displayOrder_idx" ON "cv_experiences"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_projects_cvId_displayOrder_idx" ON "cv_projects"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_skills_cvId_displayOrder_idx" ON "cv_skills"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_achievements_cvId_displayOrder_idx" ON "cv_achievements"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_volunteers_cvId_displayOrder_idx" ON "cv_volunteers"("cvId", "displayOrder");

-- CreateIndex
CREATE INDEX "cv_versions_cvId_createdAt_idx" ON "cv_versions"("cvId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cv_versions_cvId_versionNumber_key" ON "cv_versions"("cvId", "versionNumber");

-- CreateIndex
CREATE INDEX "cv_ai_analysis_cvId_analysisType_idx" ON "cv_ai_analysis"("cvId", "analysisType");

-- CreateIndex
CREATE INDEX "cv_ai_analysis_cvId_createdAt_idx" ON "cv_ai_analysis"("cvId", "createdAt");

-- CreateIndex
CREATE INDEX "cv_exports_cvId_createdAt_idx" ON "cv_exports"("cvId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cv_templates_name_key" ON "cv_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cv_templates_slug_key" ON "cv_templates"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "personality_profiles_userId_key" ON "personality_profiles"("userId");

-- CreateIndex
CREATE INDEX "personality_profiles_userId_idx" ON "personality_profiles"("userId");

-- CreateIndex
CREATE INDEX "personality_profiles_isComplete_idx" ON "personality_profiles"("isComplete");

-- CreateIndex
CREATE INDEX "personality_answers_userId_moduleId_idx" ON "personality_answers"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "personality_answers_profileId_idx" ON "personality_answers"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "personality_answers_userId_questionId_profileId_key" ON "personality_answers"("userId", "questionId", "profileId");

-- CreateIndex
CREATE INDEX "school_matches_userId_overallMatchScore_idx" ON "school_matches"("userId", "overallMatchScore");

-- CreateIndex
CREATE INDEX "school_matches_profileId_idx" ON "school_matches"("profileId");

-- CreateIndex
CREATE INDEX "school_matches_universityId_idx" ON "school_matches"("universityId");

-- CreateIndex
CREATE INDEX "_UserSavedUniversities_B_index" ON "_UserSavedUniversities"("B");

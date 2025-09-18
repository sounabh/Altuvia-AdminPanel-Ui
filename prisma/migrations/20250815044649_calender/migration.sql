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

-- CreateIndex
CREATE INDEX "calendar_events_parentEventId_idx" ON "calendar_events"("parentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_reminders_eventId_userId_reminderTime_reminderType_key" ON "event_reminders"("eventId", "userId", "reminderTime", "reminderType");

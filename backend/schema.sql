-- ApplyTrack Idempotent Database Schema
-- Target: PostgreSQL (Neon)

-- 1. Enums (Wrapped in DO blocks to ensure idempotency)
DO $$ BEGIN
    CREATE TYPE "ApplicationType" AS ENUM ('Internship', 'WIL', 'GraduateJob', 'FullTimeJob');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ApplicationStatus" AS ENUM ('Saved', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "WorkArrangement" AS ENUM ('Remote', 'Hybrid', 'Onsite');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "InterviewType" AS ENUM ('Phone', 'Video', 'InPerson', 'Technical', 'Panel', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "InterviewStatus" AS ENUM ('Upcoming', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('InterviewReminder', 'FollowUpReminder', 'StatusUpdate', 'General');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Application Table
CREATE TABLE IF NOT EXISTS "Application" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "applicationType" "ApplicationType" NOT NULL,
    "dateApplied" TIMESTAMP WITH TIME ZONE NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "location" TEXT,
    "workArrangement" "WorkArrangement",
    "jobDescription" TEXT,
    "applicationUrl" TEXT,
    "salaryOrStipend" TEXT,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Interview Table
CREATE TABLE IF NOT EXISTS "Interview" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "applicationId" UUID NOT NULL REFERENCES "Application"("id") ON DELETE CASCADE,
    "interviewDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "interviewTime" TEXT NOT NULL,
    "interviewType" "InterviewType" NOT NULL,
    "locationOrLink" TEXT,
    "notes" TEXT,
    "status" "InterviewStatus" DEFAULT 'Upcoming',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Notification Table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "applicationId" UUID REFERENCES "Application"("id") ON DELETE SET NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP WITH TIME ZONE,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Indexes (Using IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS "Application_userId_idx" ON "Application"("userId");
CREATE INDEX IF NOT EXISTS "Interview_applicationId_idx" ON "Interview"("applicationId");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");

-- 7. Triggers for updatedAt
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers must be dropped before creation for idempotency
DROP TRIGGER IF EXISTS update_user_modtime ON "User";
CREATE TRIGGER update_user_modtime BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_application_modtime ON "Application";
CREATE TRIGGER update_application_modtime BEFORE UPDATE ON "Application" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_interview_modtime ON "Interview";
CREATE TRIGGER update_interview_modtime BEFORE UPDATE ON "Interview" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

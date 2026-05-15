-- CreateTable
CREATE TABLE "waitlist_signups" (
    "id" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_signups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_signups_program_email_key" ON "waitlist_signups"("program", "email");

-- CreateIndex
CREATE INDEX "waitlist_signups_program_createdAt_idx" ON "waitlist_signups"("program", "createdAt");

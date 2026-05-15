-- Partner intake pipeline: status, assignee, notes, source, updatedAt

ALTER TABLE "partner_turf_interests" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'NEW';

ALTER TABLE "partner_turf_interests" ADD COLUMN "assignedToUserId" TEXT;

ALTER TABLE "partner_turf_interests" ADD COLUMN "notes" TEXT;

ALTER TABLE "partner_turf_interests" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'WEB_FORM';

ALTER TABLE "partner_turf_interests" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "partner_turf_interests" SET "updatedAt" = "createdAt";

ALTER TABLE "partner_turf_interests" ADD CONSTRAINT "partner_turf_interests_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "partner_turf_interests_status_idx" ON "partner_turf_interests"("status");

CREATE INDEX "partner_turf_interests_assignedToUserId_idx" ON "partner_turf_interests"("assignedToUserId");

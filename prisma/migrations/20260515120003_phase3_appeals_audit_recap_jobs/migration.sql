-- Moderator audit trail for join-restriction appeals
ALTER TABLE "attendance_restriction_appeals" ADD COLUMN IF NOT EXISTS "moderatorNote" TEXT;
ALTER TABLE "attendance_restriction_appeals" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);
ALTER TABLE "attendance_restriction_appeals" ADD COLUMN IF NOT EXISTS "reviewedByUserId" TEXT;
ALTER TABLE "attendance_restriction_appeals" ADD COLUMN IF NOT EXISTS "reviewedByLabel" TEXT;

CREATE INDEX IF NOT EXISTS "attendance_restriction_appeals_status_createdAt_idx"
  ON "attendance_restriction_appeals"("status", "createdAt");

-- Game completion timestamp for attendance / no-show windows
ALTER TABLE "Game" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Safer default: require at least 2 players to confirm (create flow still sets explicit value)
ALTER TABLE "Game" ALTER COLUMN "minPlayersToConfirm" SET DEFAULT 2;
UPDATE "Game" SET "minPlayersToConfirm" = GREATEST(2, LEAST("minPlayersToConfirm", "spotsTotal"))
  WHERE "minPlayersToConfirm" < 2 OR "minPlayersToConfirm" > "spotsTotal";
UPDATE "Game" SET "minPlayersToConfirm" = "spotsTotal"
  WHERE "minPlayersToConfirm" = 0 OR "minPlayersToConfirm" IS NULL;

-- Turf football sub-format tags (JSON array of strings)
ALTER TABLE "turfs" ADD COLUMN IF NOT EXISTS "footballVenueSubFormats" JSONB;

-- Tournament gender format
ALTER TABLE "Tournament" ADD COLUMN IF NOT EXISTS "genderFormat" TEXT NOT NULL DEFAULT 'OPEN';

-- Restriction appeals
CREATE TABLE IF NOT EXISTS "attendance_restriction_appeals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_restriction_appeals_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "attendance_restriction_appeals_userId_createdAt_idx"
  ON "attendance_restriction_appeals"("userId", "createdAt");
ALTER TABLE "attendance_restriction_appeals" DROP CONSTRAINT IF EXISTS "attendance_restriction_appeals_userId_fkey";
ALTER TABLE "attendance_restriction_appeals"
  ADD CONSTRAINT "attendance_restriction_appeals_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

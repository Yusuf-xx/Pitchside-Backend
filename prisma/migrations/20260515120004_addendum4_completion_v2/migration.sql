-- Per-match stat lines (host-entered at game complete); optional phone on profile for squad lookup.
ALTER TABLE "GameParticipant" ADD COLUMN IF NOT EXISTS "statLineJson" JSONB;

ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "phoneE164" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Profile_phoneE164_key" ON "Profile" ("phoneE164") WHERE "phoneE164" IS NOT NULL;

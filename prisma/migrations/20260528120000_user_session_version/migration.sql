-- Invalidate all JWTs on demand via User.sessionVersion (embedded in access/refresh tokens).
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;

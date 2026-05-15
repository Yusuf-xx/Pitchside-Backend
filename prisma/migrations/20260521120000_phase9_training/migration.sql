-- Phase 9: training settings + session log (weekly totals, streaks, clock in/out)

CREATE TABLE "training_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weeklyGoalMinutes" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "training_settings_userId_key" ON "training_settings"("userId");

ALTER TABLE "training_settings" ADD CONSTRAINT "training_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "training_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "startLat" DOUBLE PRECISION,
    "startLng" DOUBLE PRECISION,
    "startAccuracyM" DOUBLE PRECISION,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "training_sessions_userId_startedAt_idx" ON "training_sessions"("userId", "startedAt");

CREATE INDEX "training_sessions_userId_endedAt_idx" ON "training_sessions"("userId", "endedAt");

ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

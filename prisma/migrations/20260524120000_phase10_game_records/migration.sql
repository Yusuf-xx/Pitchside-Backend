-- Phase 10: post-match teammate ratings per game (one row per rater–subject pair)

CREATE TABLE "game_teammate_ratings" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "raterUserId" TEXT NOT NULL,
    "subjectUserId" TEXT NOT NULL,
    "skill" INTEGER NOT NULL,
    "effort" INTEGER NOT NULL,
    "attitude" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "noShow" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_teammate_ratings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "game_teammate_ratings_gameId_raterUserId_subjectUserId_key" ON "game_teammate_ratings"("gameId", "raterUserId", "subjectUserId");

CREATE INDEX "game_teammate_ratings_gameId_idx" ON "game_teammate_ratings"("gameId");

CREATE INDEX "game_teammate_ratings_subjectUserId_idx" ON "game_teammate_ratings"("subjectUserId");

ALTER TABLE "game_teammate_ratings" ADD CONSTRAINT "game_teammate_ratings_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "game_teammate_ratings" ADD CONSTRAINT "game_teammate_ratings_raterUserId_fkey" FOREIGN KEY ("raterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "game_teammate_ratings" ADD CONSTRAINT "game_teammate_ratings_subjectUserId_fkey" FOREIGN KEY ("subjectUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

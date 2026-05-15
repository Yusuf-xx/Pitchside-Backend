-- Addendum 4: squads, game lifecycle, attendance fields, feedback tags, rivalries, recaps (schema only for recap rows)

ALTER TABLE "User" ADD COLUMN "hostedConfirmedGameCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "joinRestrictedUntil" TIMESTAMP(3);

ALTER TABLE "Profile" ADD COLUMN "gender" TEXT;
ALTER TABLE "Profile" ADD COLUMN "showWomenOnlyGames" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Profile" ADD COLUMN "gamesConfirmedCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN "gamesAttendedCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN "noShowCountLast30d" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Game" ADD COLUMN "lifecycleState" TEXT NOT NULL DEFAULT 'OPEN';
ALTER TABLE "Game" ADD COLUMN "minPlayersToConfirm" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Game" ADD COLUMN "confirmDeadlineAt" TIMESTAMP(3);
ALTER TABLE "Game" ADD COLUMN "footballVenueSubFormat" TEXT;
ALTER TABLE "Game" ADD COLUMN "genderFormat" TEXT NOT NULL DEFAULT 'OPEN';
ALTER TABLE "Game" ADD COLUMN "mixedMinWomenOnField" INTEGER;
ALTER TABLE "Game" ADD COLUMN "balancedTeamsJson" JSONB;
ALTER TABLE "Game" ADD COLUMN "teamsVisibleToPlayers" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Game" ADD COLUMN "attendanceQrToken" TEXT;
ALTER TABLE "Game" ADD COLUMN "attendanceOpenedAt" TIMESTAMP(3);
ALTER TABLE "Game" ADD COLUMN "winnerSide" TEXT;

UPDATE "Game" SET "minPlayersToConfirm" = "spotsTotal" WHERE "minPlayersToConfirm" = 0;

CREATE UNIQUE INDEX "Game_attendanceQrToken_key" ON "Game"("attendanceQrToken");

ALTER TABLE "GameParticipant" ADD COLUMN "teamSide" TEXT;
ALTER TABLE "GameParticipant" ADD COLUMN "attendanceStatus" TEXT NOT NULL DEFAULT 'PENDING';

CREATE TABLE "squads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "captainUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "squads_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squad_members" (
    "id" TEXT NOT NULL,
    "squadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invitedPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "squad_members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "game_squad_invites" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "squadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_squad_invites_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "teammate_feedback_tags" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "tagKey" TEXT NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teammate_feedback_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "player_rivalries" (
    "id" TEXT NOT NULL,
    "userLowId" TEXT NOT NULL,
    "userHighId" TEXT NOT NULL,
    "winsForLow" INTEGER NOT NULL DEFAULT 0,
    "winsForHigh" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3),

    CONSTRAINT "player_rivalries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "player_season_recaps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_season_recaps_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "squads_city_idx" ON "squads"("city");
CREATE UNIQUE INDEX "squad_members_squadId_userId_key" ON "squad_members"("squadId", "userId");
CREATE INDEX "squad_members_userId_idx" ON "squad_members"("userId");
CREATE UNIQUE INDEX "game_squad_invites_gameId_squadId_key" ON "game_squad_invites"("gameId", "squadId");
CREATE INDEX "game_squad_invites_squadId_idx" ON "game_squad_invites"("squadId");
CREATE INDEX "teammate_feedback_tags_gameId_idx" ON "teammate_feedback_tags"("gameId");
CREATE INDEX "teammate_feedback_tags_toUserId_isPositive_createdAt_idx" ON "teammate_feedback_tags"("toUserId", "isPositive", "createdAt");
CREATE UNIQUE INDEX "player_rivalries_userLowId_userHighId_key" ON "player_rivalries"("userLowId", "userHighId");
CREATE INDEX "player_rivalries_userLowId_idx" ON "player_rivalries"("userLowId");
CREATE INDEX "player_rivalries_userHighId_idx" ON "player_rivalries"("userHighId");
CREATE UNIQUE INDEX "player_season_recaps_userId_periodKey_key" ON "player_season_recaps"("userId", "periodKey");
CREATE INDEX "player_season_recaps_userId_createdAt_idx" ON "player_season_recaps"("userId", "createdAt");

ALTER TABLE "squads" ADD CONSTRAINT "squads_captainUserId_fkey" FOREIGN KEY ("captainUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "squad_members" ADD CONSTRAINT "squad_members_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_members" ADD CONSTRAINT "squad_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_squad_invites" ADD CONSTRAINT "game_squad_invites_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "game_squad_invites" ADD CONSTRAINT "game_squad_invites_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teammate_feedback_tags" ADD CONSTRAINT "teammate_feedback_tags_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teammate_feedback_tags" ADD CONSTRAINT "teammate_feedback_tags_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teammate_feedback_tags" ADD CONSTRAINT "teammate_feedback_tags_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "player_season_recaps" ADD CONSTRAINT "player_season_recaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

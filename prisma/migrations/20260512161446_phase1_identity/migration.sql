-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "city" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "ageGroup" TEXT NOT NULL,
    "primaryMode" TEXT NOT NULL,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "preferredFormatsJson" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMode" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,

    CONSTRAINT "ProfileMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeIdentity" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "preferredFoot" TEXT,
    "skillLevel" TEXT NOT NULL,

    CONSTRAINT "ModeIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCard" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "ovr" INTEGER NOT NULL,
    "reputationTier" TEXT NOT NULL DEFAULT 'REGULAR',
    "rarity" TEXT NOT NULL DEFAULT 'STANDARD',

    CONSTRAINT "PlayerCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCardStat" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PlayerCardStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCardBadge" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,

    CONSTRAINT "PlayerCardBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMode_profileId_mode_key" ON "ProfileMode"("profileId", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "ModeIdentity_profileId_mode_key" ON "ModeIdentity"("profileId", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_profileId_mode_key" ON "PlayerCard"("profileId", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCardStat_cardId_key_key" ON "PlayerCardStat"("cardId", "key");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMode" ADD CONSTRAINT "ProfileMode_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeIdentity" ADD CONSTRAINT "ModeIdentity_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCardStat" ADD CONSTRAINT "PlayerCardStat_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PlayerCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCardBadge" ADD CONSTRAINT "PlayerCardBadge_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PlayerCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

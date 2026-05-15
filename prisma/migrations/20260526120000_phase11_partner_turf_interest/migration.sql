-- Phase 11: turf owner partner interest submissions

CREATE TABLE "partner_turf_interests" (
    "id" TEXT NOT NULL,
    "turfName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_turf_interests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "partner_turf_interests_email_turfName_city_key" ON "partner_turf_interests"("email", "turfName", "city");

CREATE INDEX "partner_turf_interests_city_createdAt_idx" ON "partner_turf_interests"("city", "createdAt");

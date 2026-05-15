-- CreateTable
CREATE TABLE "turfs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "modes" JSONB NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "priceInrPerHour" INTEGER NOT NULL,
    "partner" BOOLEAN NOT NULL DEFAULT true,
    "availabilityNote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turfs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turf_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turfId" TEXT NOT NULL,
    "gameMode" TEXT NOT NULL,
    "bookingDate" TEXT NOT NULL,
    "slotStartsJson" JSONB NOT NULL,
    "expectedPlayers" INTEGER NOT NULL,
    "splitPayment" BOOLEAN NOT NULL DEFAULT false,
    "totalInr" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turf_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "turf_bookings_userId_idx" ON "turf_bookings"("userId");

-- AddForeignKey
ALTER TABLE "turf_bookings" ADD CONSTRAINT "turf_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turf_bookings" ADD CONSTRAINT "turf_bookings_turfId_fkey" FOREIGN KEY ("turfId") REFERENCES "turfs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

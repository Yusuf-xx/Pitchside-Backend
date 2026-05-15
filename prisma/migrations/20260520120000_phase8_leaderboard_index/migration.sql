-- Leaderboard queries: filter by mode and sort by OVR
CREATE INDEX "PlayerCard_mode_ovr_idx" ON "PlayerCard"("mode", "ovr" DESC);

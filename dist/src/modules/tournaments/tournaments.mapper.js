"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTournamentToSummary = mapTournamentToSummary;
function mapTournamentToSummary(row) {
    return {
        id: row.id,
        name: row.name,
        gameMode: row.gameMode,
        format: row.format,
        city: row.city,
        startsAt: row.startsAt.toISOString(),
        entryFeeInr: row.entryFeeInr,
        prizeInr: row.prizeInr,
        teamsRegistered: row.teamsRegistered,
        teamsCap: row.teamsCap,
        bannerImageUrl: row.bannerImageUrl ?? undefined,
        genderFormat: row.genderFormat,
    };
}
//# sourceMappingURL=tournaments.mapper.js.map
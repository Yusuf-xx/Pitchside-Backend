"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ovrForGameMode = ovrForGameMode;
exports.averageSquadOvr = averageSquadOvr;
exports.mapTeamToSummary = mapTeamToSummary;
exports.mapTeamToDetail = mapTeamToDetail;
exports.withCaptainFlag = withCaptainFlag;
function ovrForGameMode(holder, gameMode) {
    const cards = holder?.profile?.playerCards;
    if (!cards?.length)
        return undefined;
    const card = cards.find((c) => c.mode === gameMode);
    return card?.ovr;
}
function averageSquadOvr(gameMode, roster) {
    const values = roster
        .map((r) => ovrForGameMode(r.user, gameMode))
        .filter((v) => typeof v === 'number');
    if (values.length === 0)
        return 70;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
function mapTeamToSummary(team, memberCount, teamOvr) {
    return {
        id: team.id,
        name: team.name,
        city: team.city,
        gameMode: team.gameMode,
        kitColorHex: team.kitColorHex ?? undefined,
        memberCount,
        captainUserId: team.captainUserId,
        wins: team.wins,
        losses: team.losses,
        draws: team.draws,
        teamOvr,
    };
}
function mapTeamToDetail(team) {
    const memberCount = team.members.length;
    const teamOvr = averageSquadOvr(team.gameMode, team.members.map((m) => ({ user: m.user })));
    const base = mapTeamToSummary(team, memberCount, teamOvr);
    const members = team.members.map((m) => ({
        userId: m.userId,
        displayName: m.user.profile?.displayName ?? 'Player',
        role: m.role,
        ovr: ovrForGameMode(m.user, team.gameMode),
    }));
    return {
        ...base,
        members,
        isCaptain: false,
    };
}
function withCaptainFlag(detail, requestUserId) {
    if (!requestUserId)
        return { ...detail, isCaptain: false };
    return {
        ...detail,
        isCaptain: detail.captainUserId === requestUserId,
    };
}
//# sourceMappingURL=teams.mapper.js.map
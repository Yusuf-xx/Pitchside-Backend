"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGameToSummary = mapGameToSummary;
function parseBalancedTeams(json) {
    if (!json || typeof json !== 'object' || Array.isArray(json))
        return undefined;
    const o = json;
    const A = Array.isArray(o.A) ? o.A.filter((x) => typeof x === 'string') : [];
    const B = Array.isArray(o.B) ? o.B.filter((x) => typeof x === 'string') : [];
    if (!A.length && !B.length)
        return undefined;
    return { A, B };
}
function mapGameToSummary(g, viewer) {
    const spotsLeft = Math.max(0, g.spotsTotal - g.spotsFilled);
    const hostVerified = Boolean(g.host && g.host.hostedConfirmedGameCount >= 5);
    const showTeams = g.balancedTeamsJson &&
        g.lifecycleState !== 'OPEN' &&
        (viewer?.isHost || (viewer?.isParticipant && g.teamsVisibleToPlayers));
    const myAttendanceStatus = viewer?.viewerUserId && viewer.participants
        ? viewer.participants.find((p) => p.userId === viewer.viewerUserId)?.attendanceStatus
        : undefined;
    const beachRulesNote = g.footballVenueSubFormat === 'BEACH'
        ? 'Beach football: no studs, barefoot or beach shoes only, 5-a-side'
        : undefined;
    const mixedFormatRulesSummary = g.genderFormat === 'MIXED'
        ? `Minimum ${g.mixedMinWomenOnField ?? 2} women per team on the field at all times (enforced at squad confirmation).`
        : undefined;
    return {
        id: g.id,
        hostUserId: g.hostUserId,
        gameMode: g.gameMode,
        title: g.title,
        venueName: g.venueName,
        city: g.city,
        startsAt: g.startsAt.toISOString(),
        spotsLeft,
        spotsFilled: g.spotsFilled,
        spotsTotal: g.spotsTotal,
        skillLevel: g.skillLevel,
        priceInrPerPlayer: g.priceInrPerPlayer,
        lifecycleState: g.lifecycleState,
        minPlayersToConfirm: g.minPlayersToConfirm,
        confirmDeadlineAt: g.confirmDeadlineAt?.toISOString(),
        genderFormat: g.genderFormat,
        mixedMinWomenOnField: g.mixedMinWomenOnField ?? undefined,
        footballVenueSubFormat: g.footballVenueSubFormat ?? undefined,
        formatLabel: g.formatLabel ?? undefined,
        hostVerified,
        balancedTeams: showTeams ? parseBalancedTeams(g.balancedTeamsJson) : undefined,
        attendanceQrToken: viewer?.isHost ? (g.attendanceQrToken ?? undefined) : undefined,
        urgentNeedPlayers: g.urgentNeedPlayers,
        winnerSide: g.winnerSide ?? undefined,
        completedAt: g.completedAt?.toISOString(),
        beachRulesNote,
        mixedFormatRulesSummary,
        participants: viewer?.isHost || viewer?.isParticipant ? viewer.participants : undefined,
        myAttendanceStatus,
        ...(viewer
            ? {
                isHost: viewer.isHost,
                isParticipant: viewer.isParticipant,
            }
            : {}),
    };
}
//# sourceMappingURL=games.mapper.js.map
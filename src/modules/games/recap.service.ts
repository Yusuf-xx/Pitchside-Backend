import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LIFECYCLE_COMPLETED } from './game-domain.constants';

export const RECAP_SCHEMA_VERSION = 3;

export type YearRecapPayload = {
  schemaVersion: number;
  year: number;
  /** Present for half-year recaps */
  half?: 1 | 2;
  periodLabel: string;
  gamesPlayed: number;
  goalsTotal: number;
  assistsTotal: number;
  wicketsTotal: number;
  favouriteMode: string | null;
  favouriteVenue: string | null;
  winRatePct: number | null;
  personalityTag: string;
  ovrNow: number | null;
  ovrStartApprox: number | null;
  rarestBadge: string | null;
  bestMonthLabel: string | null;
  topTeammateUserId: string | null;
  topTeammateDisplayName: string | null;
  topTeammateGames: number;
  biggestRivalUserId: string | null;
  biggestRivalDisplayName: string | null;
  biggestRivalMyWins: number;
  biggestRivalMyLosses: number;
  biggestRivalDraws: number;
};

type Period = { periodKey: string; from: Date; to: Date; label: string; year: number; half?: 1 | 2 };

@Injectable()
export class RecapService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrBuildRecap(
    userId: string,
    year: number,
    half?: 1 | 2,
  ): Promise<{ periodKey: string; payload: YearRecapPayload }> {
    const period = this.resolvePeriod(year, half);
    const cached = await this.prisma.playerSeasonRecap.findUnique({
      where: { userId_periodKey: { userId, periodKey: period.periodKey } },
    });
    if (cached?.payloadJson && typeof cached.payloadJson === 'object' && !Array.isArray(cached.payloadJson)) {
      const p = cached.payloadJson as YearRecapPayload;
      if (p.schemaVersion === RECAP_SCHEMA_VERSION) {
        return { periodKey: period.periodKey, payload: p };
      }
    }

    const parts = await this.prisma.gameParticipant.findMany({
      where: {
        userId,
        game: {
          lifecycleState: LIFECYCLE_COMPLETED,
          OR: [
            { completedAt: { gte: period.from, lt: period.to } },
            { AND: [{ completedAt: null }, { startsAt: { gte: period.from, lt: period.to } }] },
          ],
        },
      },
      include: { game: true },
    });

    const gamesPlayed = parts.length;
    const modeCounts = new Map<string, number>();
    const venueCounts = new Map<string, number>();
    const monthCounts = new Map<number, number>();
    let wins = 0;
    let decidable = 0;
    let goalsTotal = 0;
    let assistsTotal = 0;
    let wicketsTotal = 0;

    const gameIds = parts.map((p) => p.game.id);

    for (const p of parts) {
      const g = p.game;
      modeCounts.set(g.gameMode, (modeCounts.get(g.gameMode) ?? 0) + 1);
      const v = `${g.venueName}`.trim();
      venueCounts.set(v, (venueCounts.get(v) ?? 0) + 1);
      const m = g.startsAt.getUTCMonth();
      monthCounts.set(m, (monthCounts.get(m) ?? 0) + 1);
      if (g.winnerSide && p.teamSide && g.winnerSide !== 'DRAW') {
        decidable += 1;
        if (g.winnerSide === p.teamSide) wins += 1;
      }
      const raw = p.statLineJson;
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        const o = raw as Record<string, unknown>;
        if (typeof o.goals === 'number' && Number.isFinite(o.goals)) goalsTotal += Math.max(0, o.goals);
        if (typeof o.assists === 'number' && Number.isFinite(o.assists)) assistsTotal += Math.max(0, o.assists);
        if (typeof o.wickets === 'number' && Number.isFinite(o.wickets)) wicketsTotal += Math.max(0, o.wickets);
      }
    }

    const favouriteMode = [...modeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const favouriteVenue = [...venueCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const bestMonthEntry = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    const bestMonthLabel =
      bestMonthEntry && bestMonthEntry[1] > 0
        ? new Date(Date.UTC(year, bestMonthEntry[0], 1)).toLocaleString('en', { month: 'long' })
        : null;

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        playerCards: { include: { badges: true } },
      },
    });
    const primary = profile?.playerCards.find((c) => c.mode === profile.primaryMode) ?? profile?.playerCards[0];
    const ovrNow = primary?.ovr ?? null;
    const rarestBadge =
      primary?.badges.sort((a, b) => a.badgeKey.localeCompare(b.badgeKey))[0]?.badgeKey ?? null;

    const prevYear = year - 1;
    const prevKey = half ? `HY-${prevYear}-H${half}` : `CY-${prevYear}`;
    const prevRecap = await this.prisma.playerSeasonRecap.findUnique({
      where: { userId_periodKey: { userId, periodKey: prevKey } },
    });
    let ovrStartApprox: number | null = null;
    if (prevRecap?.payloadJson && typeof prevRecap.payloadJson === 'object' && !Array.isArray(prevRecap.payloadJson)) {
      const prev = prevRecap.payloadJson as { ovrNow?: number };
      if (typeof prev.ovrNow === 'number') ovrStartApprox = prev.ovrNow;
    }

    const personalityTag = this.pickPersonality(profile?.gamesAttendedCount ?? 0, gamesPlayed, wins, decidable);

    const allPartsInPeriod =
      gameIds.length === 0
        ? []
        : await this.prisma.gameParticipant.findMany({
            where: { gameId: { in: gameIds } },
            select: { gameId: true, userId: true, teamSide: true },
          });
    const byGame = new Map<string, { userId: string; teamSide: string | null }[]>();
    for (const row of allPartsInPeriod) {
      const arr = byGame.get(row.gameId) ?? [];
      arr.push(row);
      byGame.set(row.gameId, arr);
    }

    const teammateCounts = new Map<string, number>();
    for (const p of parts) {
      const g = p.game;
      const mySide = p.teamSide;
      if (!mySide) continue;
      const peers = byGame.get(g.id) ?? [];
      for (const o of peers) {
        if (o.userId === userId) continue;
        if (o.teamSide && o.teamSide === mySide) {
          teammateCounts.set(o.userId, (teammateCounts.get(o.userId) ?? 0) + 1);
        }
      }
    }
    const topTeammateEntry = [...teammateCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    let topTeammateUserId: string | null = null;
    let topTeammateDisplayName: string | null = null;
    let topTeammateGames = 0;
    if (topTeammateEntry && topTeammateEntry[1] > 0) {
      topTeammateUserId = topTeammateEntry[0];
      topTeammateGames = topTeammateEntry[1];
      const tp = await this.prisma.profile.findUnique({
        where: { userId: topTeammateUserId },
        select: { displayName: true },
      });
      topTeammateDisplayName = tp?.displayName?.trim() ?? 'Player';
    }

    const rivalry = await this.prisma.playerRivalry.findFirst({
      where: {
        OR: [{ userLowId: userId }, { userHighId: userId }],
        gamesPlayed: { gte: 3 },
      },
      orderBy: { gamesPlayed: 'desc' },
    });
    let biggestRivalUserId: string | null = null;
    let biggestRivalDisplayName: string | null = null;
    let biggestRivalMyWins = 0;
    let biggestRivalMyLosses = 0;
    let biggestRivalDraws = 0;
    if (rivalry) {
      const oppId = rivalry.userLowId === userId ? rivalry.userHighId : rivalry.userLowId;
      biggestRivalUserId = oppId;
      biggestRivalMyWins = rivalry.userLowId === userId ? rivalry.winsForLow : rivalry.winsForHigh;
      biggestRivalMyLosses = rivalry.userLowId === userId ? rivalry.winsForHigh : rivalry.winsForLow;
      biggestRivalDraws = rivalry.draws;
      const rp = await this.prisma.profile.findUnique({
        where: { userId: oppId },
        select: { displayName: true },
      });
      biggestRivalDisplayName = rp?.displayName?.trim() ?? 'Player';
    }

    const payload: YearRecapPayload = {
      schemaVersion: RECAP_SCHEMA_VERSION,
      year,
      half: period.half,
      periodLabel: period.label,
      gamesPlayed,
      goalsTotal,
      assistsTotal,
      wicketsTotal,
      favouriteMode,
      favouriteVenue,
      winRatePct: decidable > 0 ? Math.round((wins / decidable) * 100) : null,
      personalityTag,
      ovrNow,
      ovrStartApprox,
      rarestBadge,
      bestMonthLabel,
      topTeammateUserId,
      topTeammateDisplayName,
      topTeammateGames,
      biggestRivalUserId,
      biggestRivalDisplayName,
      biggestRivalMyWins,
      biggestRivalMyLosses,
      biggestRivalDraws,
    };

    await this.prisma.playerSeasonRecap.upsert({
      where: { userId_periodKey: { userId, periodKey: period.periodKey } },
      create: { userId, periodKey: period.periodKey, payloadJson: payload as unknown as Prisma.InputJsonValue },
      update: { payloadJson: payload as unknown as Prisma.InputJsonValue },
    });

    return { periodKey: period.periodKey, payload };
  }

  /** @deprecated use getOrBuildRecap — kept for internal callers expecting calendar year only */
  async getOrBuildCalendarYearRecap(userId: string, year: number): Promise<{ periodKey: string; payload: YearRecapPayload }> {
    return this.getOrBuildRecap(userId, year, undefined);
  }

  private resolvePeriod(year: number, half?: 1 | 2): Period {
    if (half === 1) {
      return {
        periodKey: `HY-${year}-H1`,
        from: new Date(Date.UTC(year, 0, 1)),
        to: new Date(Date.UTC(year, 6, 1)),
        label: `${year} Jan–Jun`,
        year,
        half: 1,
      };
    }
    if (half === 2) {
      return {
        periodKey: `HY-${year}-H2`,
        from: new Date(Date.UTC(year, 6, 1)),
        to: new Date(Date.UTC(year + 1, 0, 1)),
        label: `${year} Jul–Dec`,
        year,
        half: 2,
      };
    }
    return {
      periodKey: `CY-${year}`,
      from: new Date(Date.UTC(year, 0, 1)),
      to: new Date(Date.UTC(year + 1, 0, 1)),
      label: `${year}`,
      year,
    };
  }

  private pickPersonality(attended: number, played: number, wins: number, decidable: number): string {
    const wr = decidable > 0 ? wins / decidable : 0;
    const rate = played > 0 ? attended / played : 1;
    if (rate >= 0.85 && played >= 10) return 'The Engine';
    if (wr >= 0.55 && played >= 5) return 'The Poacher';
    if (played >= 20) return 'The General';
    if (played <= 3) return 'The Prospect';
    return 'The Regular';
  }
}

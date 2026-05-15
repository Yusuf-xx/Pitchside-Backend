import { PrismaService } from '../../prisma/prisma.service';
export declare const RECAP_SCHEMA_VERSION = 3;
export type YearRecapPayload = {
    schemaVersion: number;
    year: number;
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
export declare class RecapService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOrBuildRecap(userId: string, year: number, half?: 1 | 2): Promise<{
        periodKey: string;
        payload: YearRecapPayload;
    }>;
    getOrBuildCalendarYearRecap(userId: string, year: number): Promise<{
        periodKey: string;
        payload: YearRecapPayload;
    }>;
    private resolvePeriod;
    private pickPersonality;
}

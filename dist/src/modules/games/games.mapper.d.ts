import type { Prisma } from '@prisma/client';
import { GameParticipantSummaryDto, GameSummaryDto } from './dto/game-summary.dto';
type GameRow = {
    id: string;
    gameMode: string;
    title: string;
    venueName: string;
    city: string;
    startsAt: Date;
    spotsTotal: number;
    spotsFilled: number;
    skillLevel: string;
    priceInrPerPlayer: number;
    urgentNeedPlayers: boolean;
    hostUserId: string | null;
    lifecycleState: string;
    minPlayersToConfirm: number;
    confirmDeadlineAt: Date | null;
    genderFormat: string;
    mixedMinWomenOnField: number | null;
    footballVenueSubFormat: string | null;
    formatLabel: string | null;
    balancedTeamsJson: Prisma.JsonValue | null;
    teamsVisibleToPlayers: boolean;
    attendanceQrToken: string | null;
    winnerSide: string | null;
    completedAt: Date | null;
    host?: {
        hostedConfirmedGameCount: number;
    } | null;
};
export type GameViewerContext = {
    isHost: boolean;
    isParticipant: boolean;
    viewerUserId?: string;
    participants?: GameParticipantSummaryDto[];
};
export declare function mapGameToSummary(g: GameRow, viewer?: GameViewerContext): GameSummaryDto;
export {};

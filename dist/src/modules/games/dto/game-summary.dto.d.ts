import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class GameParticipantSummaryDto {
    userId: string;
    displayName: string;
    attendanceStatus: string;
    teamSide?: string | null;
    position?: string;
    ovr?: number;
    photoUrl?: string;
}
export declare class GameSummaryDto {
    hostUserId?: string | null;
    id: string;
    gameMode: GameMode;
    title: string;
    venueName: string;
    city: string;
    startsAt: string;
    spotsLeft: number;
    spotsFilled: number;
    spotsTotal: number;
    skillLevel: string;
    priceInrPerPlayer: number;
    lifecycleState: string;
    minPlayersToConfirm: number;
    confirmDeadlineAt?: string;
    genderFormat: string;
    mixedMinWomenOnField?: number;
    footballVenueSubFormat?: string;
    formatLabel?: string;
    hostVerified?: boolean;
    balancedTeams?: {
        A: string[];
        B: string[];
    };
    attendanceQrToken?: string;
    urgentNeedPlayers?: boolean;
    winnerSide?: string;
    completedAt?: string;
    beachRulesNote?: string;
    mixedFormatRulesSummary?: string;
    participants?: GameParticipantSummaryDto[];
    myAttendanceStatus?: string;
    isHost?: boolean;
    isParticipant?: boolean;
}

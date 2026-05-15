import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class MatchHistoryStatLineDto {
    goals?: number;
    assists?: number;
    wickets?: number;
}
export declare class MatchHistoryQueryDto {
    gameMode?: GameMode;
    month?: string;
}
export declare class MatchHistoryRowDto {
    gameId: string;
    gameMode: GameMode;
    venueName: string;
    city: string;
    startsAt: string;
    formatLabel?: string;
    result: string;
    attendanceStatus: string;
    tagsReceived?: string[];
    statLine?: MatchHistoryStatLineDto;
}
export declare class MatchHistorySummaryDto {
    gamesPlayed: number;
    attendanceRatePct: number;
    wins: number;
    losses: number;
    draws: number;
}
export declare class MatchHistoryResponseDto {
    summary: MatchHistorySummaryDto;
    rows: MatchHistoryRowDto[];
}

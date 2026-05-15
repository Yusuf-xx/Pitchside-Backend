import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class TeamSummaryDto {
    id: string;
    name: string;
    city: string;
    gameMode: GameMode;
    kitColorHex?: string;
    memberCount: number;
    captainUserId: string;
    wins: number;
    losses: number;
    draws: number;
    teamOvr: number;
}

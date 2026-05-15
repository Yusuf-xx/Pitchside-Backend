import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class TournamentSummaryDto {
    id: string;
    name: string;
    gameMode: GameMode;
    format: string;
    city: string;
    startsAt: string;
    entryFeeInr: number;
    prizeInr: number;
    teamsRegistered: number;
    teamsCap: number;
    bannerImageUrl?: string;
    genderFormat: string;
}

import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class TournamentTeaserDto {
    id: string;
    name: string;
    gameMode: GameMode;
    city: string;
    startsAt: string;
    entryFeeInr: number;
    prizeInr: number;
    teamsRegistered: number;
    teamsCap: number;
    format: string;
}
export declare class FeedItemDto {
    id: string;
    type: string;
    title: string;
    body: string;
    gameMode?: string;
    createdAt: string;
}

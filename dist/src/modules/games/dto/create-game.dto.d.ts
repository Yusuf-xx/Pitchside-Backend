import { GameMode } from '../../../common/enums/game-mode.enum';
declare const GENDER_FORMATS: readonly ["OPEN", "WOMEN_ONLY", "MIXED"];
declare const FOOTBALL_VENUE_SUB: readonly ["CAGE", "ROOFTOP", "BEACH", "STREET_GULLY", "BOX"];
export declare class CreateGameDto {
    gameMode: GameMode;
    title: string;
    venueName: string;
    city: string;
    startsAt: string;
    maxPlayers: number;
    minPlayersToConfirm?: number;
    confirmDeadlineAt?: string;
    genderFormat?: (typeof GENDER_FORMATS)[number];
    mixedMinWomenOnField?: number;
    footballVenueSubFormat?: (typeof FOOTBALL_VENUE_SUB)[number];
    skillLevel: string;
    isPublic?: boolean;
    priceInrPerPlayer: number;
}
export {};

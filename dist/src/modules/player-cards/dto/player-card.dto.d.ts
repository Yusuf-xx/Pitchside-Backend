import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class PlayerCardStatDto {
    key: string;
    value: number;
}
export declare class PlayerCardDto {
    userId: string;
    displayName: string;
    mode: GameMode;
    ovr: number;
    position: string;
    skillLevel: string;
    preferredFoot?: string;
    city: string;
    stats: PlayerCardStatDto[];
    reputationTier: string;
    rarity: string;
    badges: string[];
    reliabilityPct?: number;
}

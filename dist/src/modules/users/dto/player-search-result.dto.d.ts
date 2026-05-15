import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class PlayerSearchResultDto {
    userId: string;
    displayName: string;
    city: string;
    primaryMode: GameMode;
    photoUrl?: string;
}

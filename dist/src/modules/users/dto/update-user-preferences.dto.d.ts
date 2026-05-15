import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class UpdateUserPreferencesDto {
    activeModes: GameMode[];
    city: string;
    primaryMode?: GameMode;
}

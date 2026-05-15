import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class CreateTeamDto {
    name: string;
    kitColorHex?: string;
    city: string;
    gameMode?: GameMode;
}

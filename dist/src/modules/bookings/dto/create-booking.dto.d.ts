import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class CreateBookingDto {
    turfId: string;
    date: string;
    slotStarts: string[];
    gameMode: GameMode;
    expectedPlayers: number;
    splitPayment?: boolean;
}

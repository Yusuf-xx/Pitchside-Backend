import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class BookingDto {
    id: string;
    turfId: string;
    turfName: string;
    gameMode: GameMode;
    date: string;
    slots: string[];
    totalInr: number;
    splitPayment: boolean;
    status: string;
    createdAt?: string;
}

import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class TurfSummaryDto {
    id: string;
    name: string;
    modes: GameMode[];
    footballVenueSubFormats?: string[];
    area: string;
    city: string;
    rating: number;
    reviewCount: number;
    priceInrPerHour: number;
    partner: boolean;
    availabilityNote: string;
}

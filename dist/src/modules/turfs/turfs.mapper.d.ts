import type { Prisma } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { TurfSummaryDto } from './dto/turf-summary.dto';
export declare function parseModesJson(modes: Prisma.JsonValue): GameMode[];
export declare function mapTurfRow(row: {
    id: string;
    name: string;
    area: string;
    city: string;
    modes: Prisma.JsonValue;
    footballVenueSubFormats?: Prisma.JsonValue | null;
    rating: number;
    reviewCount: number;
    priceInrPerHour: number;
    partner: boolean;
    availabilityNote: string;
}): TurfSummaryDto;

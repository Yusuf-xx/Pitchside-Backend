import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { TurfSummaryDto } from './dto/turf-summary.dto';
export declare class TurfsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: ModeCityQueryDto): Promise<TurfSummaryDto[]>;
    getById(id: string): Promise<TurfSummaryDto>;
    requireTurfRow(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        city: string;
        modes: import("@prisma/client/runtime/library").JsonValue;
        area: string;
        rating: number;
        reviewCount: number;
        priceInrPerHour: number;
        partner: boolean;
        availabilityNote: string;
    }>;
}

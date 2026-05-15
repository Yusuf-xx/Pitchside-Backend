import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { TurfSummaryDto } from './dto/turf-summary.dto';
import { TurfsService } from './turfs.service';
export declare class TurfsController {
    private readonly turfsService;
    constructor(turfsService: TurfsService);
    list(query: ModeCityQueryDto): Promise<TurfSummaryDto[]>;
    getById(id: string): Promise<TurfSummaryDto>;
}

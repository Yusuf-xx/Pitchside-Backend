import { type RequestWithAdmin } from '../../common/guards/admin-access.guard';
import { AdminAppealsService } from './admin-appeals.service';
import { AdminAppealItemDto } from './dto/admin-appeal-item.dto';
import { ListAppealsQueryDto } from './dto/list-appeals-query.dto';
import { ResolveAppealDto } from './dto/resolve-appeal.dto';
export declare class AdminAppealsController {
    private readonly appeals;
    constructor(appeals: AdminAppealsService);
    list(query: ListAppealsQueryDto): Promise<AdminAppealItemDto[]>;
    resolve(id: string, dto: ResolveAppealDto, req: RequestWithAdmin): Promise<AdminAppealItemDto>;
}

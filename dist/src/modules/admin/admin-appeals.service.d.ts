import { PrismaService } from '../../prisma/prisma.service';
import type { RequestWithAdmin } from '../../common/guards/admin-access.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAppealItemDto } from './dto/admin-appeal-item.dto';
import { ListAppealsQueryDto } from './dto/list-appeals-query.dto';
import { ResolveAppealDto } from './dto/resolve-appeal.dto';
export declare class AdminAppealsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    list(query: ListAppealsQueryDto): Promise<AdminAppealItemDto[]>;
    resolve(id: string, dto: ResolveAppealDto, req: RequestWithAdmin): Promise<AdminAppealItemDto>;
    private reviewerMeta;
}

import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class GamesRecapNudgeService {
    private readonly prisma;
    private readonly notifications;
    private readonly log;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    weeklyRecapNudge(): Promise<void>;
}

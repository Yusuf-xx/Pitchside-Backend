import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class GamesLifecycleService {
    private readonly prisma;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    hourly(): Promise<void>;
    private cancelUnfilledOpenGames;
    private openAttendanceForStartedGames;
}

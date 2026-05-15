import { PrismaService } from '../../prisma/prisma.service';
import { NotificationItemDto } from './dto/notification-item.dto';
export type CreateNotificationInput = {
    type?: string;
    title: string;
    body: string;
    actionPath?: string | null;
};
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMine(userId: string): Promise<NotificationItemDto[]>;
    markRead(userId: string, id: string): Promise<NotificationItemDto>;
    createForUser(userId: string, input: CreateNotificationInput): Promise<NotificationItemDto>;
}

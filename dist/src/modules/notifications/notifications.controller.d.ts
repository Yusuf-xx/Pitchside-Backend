import { NotificationItemDto } from './dto/notification-item.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(user: {
        userId: string;
    }): Promise<NotificationItemDto[]>;
    markRead(user: {
        userId: string;
    }, id: string): Promise<NotificationItemDto>;
}

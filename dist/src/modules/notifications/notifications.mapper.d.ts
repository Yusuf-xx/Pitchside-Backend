import type { Notification } from '@prisma/client';
import { NotificationItemDto } from './dto/notification-item.dto';
export declare function mapNotification(row: Notification): NotificationItemDto;

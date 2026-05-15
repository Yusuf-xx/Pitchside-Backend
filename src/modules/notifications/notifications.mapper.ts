import type { Notification } from '@prisma/client';
import { NotificationItemDto } from './dto/notification-item.dto';

export function mapNotification(row: Notification): NotificationItemDto {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    read: row.read,
    readAt: row.readAt?.toISOString(),
    actionPath: row.actionPath ?? undefined,
  };
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationItemDto } from './dto/notification-item.dto';
import { mapNotification } from './notifications.mapper';

export type CreateNotificationInput = {
  type?: string;
  title: string;
  body: string;
  actionPath?: string | null;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string): Promise<NotificationItemDto[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map(mapNotification);
  }

  async markRead(userId: string, id: string): Promise<NotificationItemDto> {
    const row = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!row) {
      throw new NotFoundException('Notification not found');
    }
    if (row.read) {
      return mapNotification(row);
    }
    const updated = await this.prisma.notification.update({
      where: { id: row.id },
      data: { read: true, readAt: new Date() },
    });
    return mapNotification(updated);
  }

  /** Emit an in-app notification (other modules can inject `NotificationsService`). */
  async createForUser(userId: string, input: CreateNotificationInput): Promise<NotificationItemDto> {
    const row = await this.prisma.notification.create({
      data: {
        userId,
        type: input.type?.trim() || 'GENERIC',
        title: input.title.trim(),
        body: input.body.trim(),
        actionPath: input.actionPath?.trim() || null,
      },
    });
    return mapNotification(row);
  }
}

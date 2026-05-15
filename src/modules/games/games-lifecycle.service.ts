import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ATTENDANCE_PENDING,
  LIFECYCLE_CANCELLED,
  LIFECYCLE_CONFIRMED,
  LIFECYCLE_OPEN,
} from './game-domain.constants';

@Injectable()
export class GamesLifecycleService {
  private readonly logger = new Logger(GamesLifecycleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 * * * *')
  async hourly(): Promise<void> {
    const now = new Date();
    try {
      await this.cancelUnfilledOpenGames(now);
      await this.openAttendanceForStartedGames(now);
    } catch (e: unknown) {
      const code =
        typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : '';
      if (code === 'P1001') {
        this.logger.warn('Game lifecycle cron skipped: database unreachable.');
        return;
      }
      throw e;
    }
  }

  private async cancelUnfilledOpenGames(now: Date): Promise<void> {
    const candidates = await this.prisma.game.findMany({
      where: {
        lifecycleState: LIFECYCLE_OPEN,
        confirmDeadlineAt: { not: null, lt: now },
      },
      select: {
        id: true,
        title: true,
        spotsFilled: true,
        minPlayersToConfirm: true,
        hostUserId: true,
      },
    });
    for (const g of candidates) {
      if (g.spotsFilled >= g.minPlayersToConfirm) continue;
      await this.prisma.game.update({
        where: { id: g.id },
        data: { lifecycleState: LIFECYCLE_CANCELLED },
      });
      const parts = await this.prisma.gameParticipant.findMany({
        where: { gameId: g.id },
        select: { userId: true },
      });
      for (const p of parts) {
        void this.notifications
          .createForUser(p.userId, {
            type: 'GAME_CANCELLED',
            title: 'Game cancelled — not enough players',
            body: `${g.title} did not reach the minimum by the deadline.`,
            actionPath: `/games/${g.id}`,
          })
          .catch(() => undefined);
      }
      if (g.hostUserId) {
        void this.notifications
          .createForUser(g.hostUserId, {
            type: 'GAME_CANCELLED',
            title: 'Your game was cancelled',
            body: `${g.title} — minimum players not met in time.`,
            actionPath: `/games/${g.id}`,
          })
          .catch(() => undefined);
      }
    }
    if (candidates.length) {
      this.logger.log(`Cancelled ${candidates.length} unfilled OPEN game(s) past deadline`);
    }
  }

  private async openAttendanceForStartedGames(now: Date): Promise<void> {
    const games = await this.prisma.game.findMany({
      where: {
        lifecycleState: LIFECYCLE_CONFIRMED,
        startsAt: { lte: now },
        attendanceOpenedAt: null,
      },
      select: { id: true, title: true, attendanceQrToken: true },
    });
    for (const g of games) {
      await this.prisma.game.update({
        where: { id: g.id },
        data: { attendanceOpenedAt: now },
      });
      const parts = await this.prisma.gameParticipant.findMany({
        where: { gameId: g.id, attendanceStatus: ATTENDANCE_PENDING },
        select: { userId: true },
      });
      for (const p of parts) {
        void this.notifications
          .createForUser(p.userId, {
            type: 'ATTENDANCE',
            title: 'Mark attendance',
            body: `${g.title} — let the host know you arrived (or use turf QR).`,
            actionPath: `/games/${g.id}`,
          })
          .catch(() => undefined);
      }
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LIFECYCLE_COMPLETED } from './game-domain.constants';

/**
 * Weekly nudge for players with completed games in the calendar year who have not yet generated
 * a cached recap row (recap builds on first GET /games/recap/me).
 */
@Injectable()
export class GamesRecapNudgeService {
  private readonly log = new Logger(GamesRecapNudgeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 9 * * 1')
  async weeklyRecapNudge(): Promise<void> {
    const year = new Date().getUTCFullYear();
    const periodKey = `CY-${year}`;
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year + 1, 0, 1));
    const dedupeSince = new Date(Date.now() - 14 * 86_400_000);

    const recapped = await this.prisma.playerSeasonRecap.findMany({
      where: { periodKey },
      select: { userId: true },
    });
    const recappedSet = new Set(recapped.map((r) => r.userId));

    const grouped = await this.prisma.gameParticipant.groupBy({
      by: ['userId'],
      where: {
        game: {
          lifecycleState: LIFECYCLE_COMPLETED,
          completedAt: { gte: from, lt: to },
        },
      },
      _count: { _all: true },
    });

    const candidates = grouped.map((g) => g.userId).filter((id) => !recappedSet.has(id));
    if (candidates.length === 0) {
      return;
    }

    const recent = await this.prisma.notification.findMany({
      where: { type: 'YEAR_RECAP_NUDGE', createdAt: { gte: dedupeSince } },
      select: { userId: true },
    });
    const recentSet = new Set(recent.map((n) => n.userId));

    let queued = 0;
    for (const userId of candidates) {
      if (recentSet.has(userId)) continue;
      void this.notifications
        .createForUser(userId, {
          type: 'YEAR_RECAP_NUDGE',
          title: `Your ${year} Pitchside recap`,
          body: 'Open Year in review to generate your stats for this season.',
          actionPath: '/recap',
        })
        .catch(() => undefined);
      recentSet.add(userId);
      queued += 1;
      if (queued >= 400) break;
    }
    if (queued > 0) {
      this.log.log(`Queued ${queued} year-recap nudge notification(s) (${candidates.length} candidate user(s))`);
    }
  }
}

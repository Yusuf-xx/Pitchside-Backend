import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LIFECYCLE_OPEN } from './game-domain.constants';

/**
 * Weekly digest: players in cities where hosts flagged urgent need for upcoming public games.
 */
@Injectable()
export class GamesEngagementDigestService {
  private readonly log = new Logger(GamesEngagementDigestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 11 * * 4')
  async weeklyNeedPlayersDigest(): Promise<void> {
    const now = new Date();
    const horizon = new Date(now.getTime() + 14 * 86_400_000);
    const dedupeSince = new Date(now.getTime() - 7 * 86_400_000);

    const games = await this.prisma.game.findMany({
      where: {
        lifecycleState: LIFECYCLE_OPEN,
        isPublic: true,
        urgentNeedPlayers: true,
        startsAt: { gte: now, lte: horizon },
      },
      select: { city: true, spotsFilled: true, spotsTotal: true },
      take: 80,
    });
    const cities = [
      ...new Set(
        games.filter((g) => g.spotsFilled < g.spotsTotal).map((g) => g.city),
      ),
    ].slice(0, 15);

    const recent = await this.prisma.notification.findMany({
      where: { type: 'NEARBY_NEED_PLAYERS_DIGEST', createdAt: { gte: dedupeSince } },
      select: { userId: true },
    });
    const skip = new Set(recent.map((n) => n.userId));

    let queued = 0;
    for (const city of cities) {
      const profiles = await this.prisma.profile.findMany({
        where: { city, onboardingCompleted: true },
        select: { userId: true },
        take: 80,
      });
      for (const p of profiles) {
        if (skip.has(p.userId)) continue;
        void this.notifications
          .createForUser(p.userId, {
            type: 'NEARBY_NEED_PLAYERS_DIGEST',
            title: `Games in ${city} need players`,
            body: `Hosts flagged urgent spots in the next two weeks. Help fill a pickup game.`,
            actionPath: `/games?city=${encodeURIComponent(city)}&filter=need`,
          })
          .catch(() => undefined);
        skip.add(p.userId);
        queued += 1;
        if (queued >= 500) break;
      }
      if (queued >= 500) break;
    }
    if (queued > 0) {
      this.log.log(`Queued ${queued} nearby need-players digest notification(s)`);
    }
  }
}

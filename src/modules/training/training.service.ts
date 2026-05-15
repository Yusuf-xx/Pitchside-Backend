import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrainingStatusDto } from './dto/training-status.dto';
import type { GpsDto } from './dto/gps.dto';
import {
  DAY_MS,
  addIstDaysFromMidnight,
  getIstYmdParts,
  istDateKey,
  istWallMidnight,
  startOfIstIsoWeek,
} from './ist-calendar';

const MAX_SESSION_MINUTES = 240;
/** Minutes logged on an IST calendar day to count toward streak */
const STREAK_DAY_MIN_MINUTES = 10;

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateSettings(userId: string) {
    return this.prisma.trainingSettings.upsert({
      where: { userId },
      create: { userId, weeklyGoalMinutes: 300 },
      update: {},
    });
  }

  async getStatus(userId: string): Promise<TrainingStatusDto> {
    const settings = await this.getOrCreateSettings(userId);
    const now = new Date();
    const weekStart = startOfIstIsoWeek(now);
    const weekEnd = addIstDaysFromMidnight(weekStart, 7);

    const weeklyAgg = await this.prisma.trainingSession.aggregate({
      where: {
        userId,
        endedAt: { gte: weekStart, lt: weekEnd },
        durationMinutes: { gt: 0 },
      },
      _sum: { durationMinutes: true },
    });
    const weeklyMinutes = weeklyAgg._sum.durationMinutes ?? 0;

    const open = await this.prisma.trainingSession.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });

    const streakDays = await this.computeStreakDays(userId, now);

    return {
      weeklyMinutes,
      weeklyGoalMinutes: settings.weeklyGoalMinutes,
      streakDays,
      clockedIn: Boolean(open),
    };
  }

  private async computeStreakDays(userId: string, now: Date): Promise<number> {
    const since = new Date(now.getTime() - 410 * DAY_MS);
    const sessions = await this.prisma.trainingSession.findMany({
      where: {
        userId,
        endedAt: { not: null, gte: since },
        durationMinutes: { gt: 0 },
      },
      select: { endedAt: true, durationMinutes: true },
    });
    const byDay = new Map<string, number>();
    for (const s of sessions) {
      if (!s.endedAt) continue;
      const key = istDateKey(s.endedAt);
      byDay.set(key, (byDay.get(key) ?? 0) + s.durationMinutes);
    }

    const { year, month, day } = getIstYmdParts(now);
    const todayStart = istWallMidnight(year, month, day);

    let streak = 0;
    for (let i = 0; i < 400; i++) {
      const dayInstant = new Date(todayStart.getTime() - i * DAY_MS);
      const minutes = byDay.get(istDateKey(dayInstant)) ?? 0;
      if (minutes >= STREAK_DAY_MIN_MINUTES) {
        streak++;
        continue;
      }
      if (i === 0) continue;
      break;
    }
    return streak;
  }

  async clockIn(userId: string, gps?: GpsDto): Promise<TrainingStatusDto> {
    const open = await this.prisma.trainingSession.findFirst({
      where: { userId, endedAt: null },
    });
    if (open) {
      throw new ConflictException('Already clocked in');
    }

    await this.prisma.trainingSession.create({
      data: {
        userId,
        startLat: gps?.lat,
        startLng: gps?.lng,
        startAccuracyM: gps?.accuracyM,
      },
    });
    return this.getStatus(userId);
  }

  async clockOut(userId: string): Promise<TrainingStatusDto> {
    const open = await this.prisma.trainingSession.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    if (!open) {
      throw new BadRequestException('Not clocked in');
    }

    const endedAt = new Date();
    const elapsedMs = endedAt.getTime() - open.startedAt.getTime();
    const floored = Math.floor(elapsedMs / 60_000);
    const durationMinutes = Math.min(MAX_SESSION_MINUTES, Math.max(1, floored === 0 ? 1 : floored));

    await this.prisma.trainingSession.update({
      where: { id: open.id },
      data: { endedAt, durationMinutes },
    });
    return this.getStatus(userId);
  }

  async updateWeeklyGoal(userId: string, weeklyGoalMinutes: number): Promise<TrainingStatusDto> {
    await this.getOrCreateSettings(userId);
    await this.prisma.trainingSettings.update({
      where: { userId },
      data: { weeklyGoalMinutes },
    });
    return this.getStatus(userId);
  }
}

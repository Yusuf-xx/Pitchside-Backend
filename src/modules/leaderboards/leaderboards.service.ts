import { BadRequestException, Injectable } from '@nestjs/common';
import { prismaCityEqualsInsensitive } from '../../common/city-normalize.util';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardRowDto } from './dto/leaderboard-row.dto';

const EXCLUDED_CITY = new Set(['', 'TBD']);

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async city(city: string, mode: GameMode): Promise<LeaderboardRowDto[]> {
    const normalized = city.trim();
    if (!normalized || EXCLUDED_CITY.has(normalized)) {
      throw new BadRequestException('Provide a valid city (not TBD).');
    }
    const cards = await this.prisma.playerCard.findMany({
      where: {
        mode,
        profile: {
          city: prismaCityEqualsInsensitive(normalized),
        },
      },
      orderBy: [{ ovr: 'desc' }],
      take: 100,
      include: { profile: true },
    });
    return cards.map((row, index) => ({
      rank: index + 1,
      userId: row.profile.userId,
      displayName: row.profile.displayName,
      city: row.profile.city,
      ovr: row.ovr,
    }));
  }

  async national(mode: GameMode): Promise<LeaderboardRowDto[]> {
    const cards = await this.prisma.playerCard.findMany({
      where: {
        mode,
        profile: {
          city: { notIn: ['TBD', ''] },
        },
      },
      orderBy: [{ ovr: 'desc' }],
      take: 100,
      include: { profile: true },
    });
    return cards.map((row, index) => ({
      rank: index + 1,
      userId: row.profile.userId,
      displayName: row.profile.displayName,
      city: row.profile.city,
      ovr: row.ovr,
    }));
  }
}

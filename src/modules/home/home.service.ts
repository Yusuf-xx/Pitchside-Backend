import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { prismaCityEqualsInsensitive } from '../../common/city-normalize.util';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { GamesService } from '../games/games.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TurfsService } from '../turfs/turfs.service';
import { HomeDashboardDto } from './dto/home-dashboard.dto';
import { FeedItemDto, TournamentTeaserDto } from './dto/home-feed.dto';
import { mapGameToSummary } from '../games/games.mapper';

type DashboardOpts = {
  userId?: string;
  city?: string;
  gameMode?: GameMode;
};

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamesService: GamesService,
    private readonly turfsService: TurfsService,
    private readonly tournamentsService: TournamentsService,
  ) {}

  async getDashboard(opts: DashboardOpts): Promise<HomeDashboardDto> {
    const { city, gameMode: modeOverride, userId } = opts;
    const profile = userId
      ? await this.prisma.profile.findUnique({
          where: { userId },
          include: { playerCards: true },
        })
      : null;
    if (userId && !profile) {
      throw new NotFoundException('Profile not found');
    }

    const resolvedCity =
      (profile?.city && profile.city !== 'TBD' ? profile.city : undefined) ?? city?.trim();
    if (!resolvedCity) {
      throw new BadRequestException('Pass ?city=YourCity as a guest, or set your city on your profile.');
    }

    const resolvedMode: GameMode =
      modeOverride ?? (profile?.primaryMode as GameMode | undefined) ?? GameMode.FOOTBALL;

    const query = { city: resolvedCity, gameMode: resolvedMode };

    const [nearbyGames, needPlayersAlerts, tournamentSummaries, feedRows, nextRow] = await Promise.all([
      this.gamesService.list(query),
      this.gamesService.needPlayers(query),
      this.tournamentsService.list(query),
      this.prisma.feedEvent.findMany({
        where: {
          AND: [
            {
              OR: [{ city: null }, { city: prismaCityEqualsInsensitive(resolvedCity) }],
            },
            { OR: [{ gameMode: null }, { gameMode: resolvedMode }] },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      userId
        ? this.prisma.game.findFirst({
            where: {
              startsAt: { gt: new Date() },
              participants: { some: { userId } },
            },
            orderBy: { startsAt: 'asc' },
            include: { host: { select: { hostedConfirmedGameCount: true } } },
          })
        : Promise.resolve(null),
    ]);

    const feedFiltered = feedRows;

    const tournamentTeasers: TournamentTeaserDto[] = tournamentSummaries.slice(0, 5).map((t) => ({
      id: t.id,
      name: t.name,
      gameMode: t.gameMode,
      city: t.city,
      startsAt: t.startsAt,
      entryFeeInr: t.entryFeeInr,
      prizeInr: t.prizeInr,
      teamsRegistered: t.teamsRegistered,
      teamsCap: t.teamsCap,
      format: t.format,
    }));

    const feed: FeedItemDto[] = feedFiltered.map((f) => ({
      id: f.id,
      type: f.type,
      title: f.title,
      body: f.body,
      gameMode: f.gameMode ?? undefined,
      createdAt: f.createdAt.toISOString(),
    }));

    const turfList = await this.turfsService.list(query);
    const nearbyTurfs = turfList.slice(0, 4);

    let greetingName = 'Player';
    let playerOvr: number | undefined;
    if (profile) {
      greetingName = profile.displayName.trim().split(/\s+/)[0] || profile.displayName;
      const card = profile.playerCards.find((c) => c.mode === resolvedMode);
      playerOvr = card?.ovr;
    }

    const nextMatch = nextRow ? mapGameToSummary(nextRow) : null;

    return {
      greetingName,
      city: resolvedCity,
      gameMode: resolvedMode,
      playerOvr,
      nearbyGames,
      needPlayersAlerts,
      nextMatch,
      tournamentTeasers,
      feed,
      nearbyTurfs,
    };
  }
}

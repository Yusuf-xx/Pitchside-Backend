import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { canonicalizeCityName, prismaCityEqualsInsensitive } from '../../common/city-normalize.util';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SquadsService } from '../squads/squads.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSummaryDto } from './dto/game-summary.dto';
import { MatchHistoryQueryDto, MatchHistoryResponseDto, MatchHistoryRowDto, MatchHistoryStatLineDto } from './dto/match-history.dto';
import { mapGameToSummary } from './games.mapper';
import { balanceSides } from './games-balancing.util';
import { isAllowedFeedbackTagKey } from './feedback-tag-keys';
import {
  ATTENDANCE_ATTENDED,
  ATTENDANCE_NO_SHOW,
  ATTENDANCE_PENDING,
  GENDER_MIXED,
  GENDER_WOMEN_ONLY,
  LIFECYCLE_CANCELLED,
  LIFECYCLE_COMPLETED,
  LIFECYCLE_CONFIRMED,
  LIFECYCLE_OPEN,
} from './game-domain.constants';
import { balanceSidesMixed } from './games-mixed-balance.util';

function parseMatchStatLine(raw: Prisma.JsonValue | null | undefined): MatchHistoryStatLineDto | undefined {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  const out: MatchHistoryStatLineDto = {};
  for (const [k, max] of [
    ['goals', 99],
    ['assists', 99],
    ['wickets', 99],
  ] as const) {
    const v = o[k];
    if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = Math.min(max, Math.max(0, Math.floor(v)));
    }
  }
  return out.goals !== undefined || out.assists !== undefined || out.wickets !== undefined ? out : undefined;
}

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly squads: SquadsService,
  ) {}

  private baseWhere(now: Date, query: ModeCityQueryDto) {
    return {
      isPublic: true,
      startsAt: { gt: now } as const,
      lifecycleState: { in: [LIFECYCLE_OPEN, LIFECYCLE_CONFIRMED] },
      ...(query.gameMode ? { gameMode: query.gameMode } : {}),
      ...(query.city?.trim() ? { city: prismaCityEqualsInsensitive(query.city) } : {}),
      ...(query.womenOnly ? { genderFormat: GENDER_WOMEN_ONLY } : {}),
      ...(query.footballVenueSubFormat ? { footballVenueSubFormat: query.footballVenueSubFormat } : {}),
    };
  }

  async list(query: ModeCityQueryDto): Promise<GameSummaryDto[]> {
    const now = new Date();
    const rows = await this.prisma.game.findMany({
      where: this.baseWhere(now, query),
      orderBy: { startsAt: 'asc' },
      take: 50,
      include: { host: { select: { hostedConfirmedGameCount: true } } },
    });
    const mapped = rows.map((r) => mapGameToSummary(r));
    mapped.sort((a, b) => {
      const va = a.hostVerified ? 1 : 0;
      const vb = b.hostVerified ? 1 : 0;
      if (vb !== va) return vb - va;
      return Date.parse(a.startsAt) - Date.parse(b.startsAt);
    });
    return mapped;
  }

  async needPlayers(query: ModeCityQueryDto): Promise<GameSummaryDto[]> {
    const now = new Date();
    const rows = await this.prisma.game.findMany({
      where: this.baseWhere(now, query),
      orderBy: { startsAt: 'asc' },
      take: 50,
      include: { host: { select: { hostedConfirmedGameCount: true } } },
    });
    const mapped = rows
      .map((r) => mapGameToSummary(r))
      .filter((g) => g.urgentNeedPlayers || g.spotsLeft <= 2);
    mapped.sort((a, b) => {
      const va = a.hostVerified ? 1 : 0;
      const vb = b.hostVerified ? 1 : 0;
      if (vb !== va) return vb - va;
      return Date.parse(a.startsAt) - Date.parse(b.startsAt);
    });
    return mapped;
  }

  async getById(id: string, viewerUserId?: string): Promise<GameSummaryDto> {
    const g = await this.prisma.game.findUnique({
      where: { id },
      include: {
        host: { select: { hostedConfirmedGameCount: true } },
        participants: {
          include: {
            user: {
              include: {
                profile: {
                  include: {
                    modeIdentities: true,
                    playerCards: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!g) throw new NotFoundException('Game not found');

    let viewerParticipant: { id: string } | null = null;
    if (viewerUserId) {
      viewerParticipant = await this.prisma.gameParticipant.findUnique({
        where: { gameId_userId: { gameId: id, userId: viewerUserId } },
        select: { id: true },
      });
    }

    if (!g.isPublic) {
      if (!viewerUserId) throw new NotFoundException('Game not found');
      const isHostViewer = g.hostUserId === viewerUserId;
      const joined = !!viewerParticipant;
      if (!isHostViewer && !joined) throw new NotFoundException('Game not found');
    }

    const isHost = Boolean(viewerUserId && g.hostUserId === viewerUserId);
    const isParticipant = Boolean(viewerUserId && (isHost || viewerParticipant));

    const participants =
      isHost || isParticipant
        ? g.participants.map((r) => {
            const prof = r.user.profile;
            const mode = g.gameMode;
            const ident = prof?.modeIdentities.find((m) => m.mode === mode);
            const card = prof?.playerCards.find((c) => c.mode === mode);
            return {
              userId: r.userId,
              displayName: prof?.displayName?.trim() ?? 'Player',
              attendanceStatus: r.attendanceStatus,
              teamSide: r.teamSide,
              position: ident?.position ?? undefined,
              ovr: card?.ovr,
              photoUrl: prof?.photoUrl ?? undefined,
            };
          })
        : undefined;

    return mapGameToSummary(g, {
      isHost,
      isParticipant,
      viewerUserId: viewerUserId ?? undefined,
      participants,
    });
  }

  async join(gameId: string, userId: string): Promise<GameSummaryDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile?.onboardingCompleted) {
      throw new BadRequestException('Finish onboarding before joining games');
    }

    const outcome = await this.prisma.$transaction(
      async (tx) => {
        const game = await tx.game.findUnique({ where: { id: gameId } });
        if (!game) throw new NotFoundException('Game not found');
        if (game.lifecycleState === LIFECYCLE_CANCELLED) {
          throw new BadRequestException('This game was cancelled');
        }
        if (game.lifecycleState === LIFECYCLE_COMPLETED) {
          throw new BadRequestException('This game is already completed');
        }
        if (!game.isPublic) throw new ForbiddenException('This game is not open for joining');
        if (game.startsAt <= new Date()) {
          throw new BadRequestException('This game has already started or finished');
        }
        if (game.spotsFilled >= game.spotsTotal) {
          throw new ConflictException('This game is full');
        }

        if (game.genderFormat === GENDER_WOMEN_ONLY) {
          if (profile.gender !== 'WOMAN') {
            throw new ForbiddenException(
              'This game is women-only. Set your gender on your profile to join, or pick an open game.',
            );
          }
        }

        const u = await tx.user.findUnique({
          where: { id: userId },
          select: { joinRestrictedUntil: true },
        });
        if (u?.joinRestrictedUntil && u.joinRestrictedUntil > new Date()) {
          throw new ForbiddenException('Restricted — improve attendance to unlock joining new games');
        }

        const existing = await tx.gameParticipant.findUnique({
          where: { gameId_userId: { gameId, userId } },
        });
        if (existing) throw new ConflictException('You are already in this game');

        await tx.gameParticipant.create({
          data: { gameId, userId },
        });

        const newFilled = game.spotsFilled + 1;
        const urgentNeedPlayers = game.spotsTotal - newFilled <= 2;

        await tx.game.update({
          where: { id: gameId },
          data: {
            spotsFilled: newFilled,
            urgentNeedPlayers,
          },
        });

        const confirmed = await this.maybeConfirmGame(tx, gameId);

        let host:
          | { hostUserId: string; title: string; venueName: string; joinerName: string }
          | null = null;
        if (game.hostUserId && game.hostUserId !== userId) {
          const joiner = await tx.profile.findUnique({
            where: { userId },
            select: { displayName: true },
          });
          host = {
            hostUserId: game.hostUserId,
            title: game.title,
            venueName: game.venueName,
            joinerName: joiner?.displayName?.trim() || 'A player',
          };
        }

        return { host, confirmed };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if (outcome.host) {
      void this.notifications
        .createForUser(outcome.host.hostUserId, {
          type: 'GAME_JOIN',
          title: `${outcome.host.joinerName} joined your game`,
          body: `${outcome.host.title} · ${outcome.host.venueName}`,
          actionPath: `/games/${gameId}`,
        })
        .catch(() => undefined);
    }

    if (outcome.confirmed) {
      const g = await this.prisma.game.findUnique({ where: { id: gameId } });
      const parts = await this.prisma.gameParticipant.findMany({
        where: { gameId },
        select: { userId: true },
      });
      for (const p of parts) {
        void this.notifications
          .createForUser(p.userId, {
            type: 'GAME_CONFIRMED',
            title: 'Game on!',
            body: `${g?.title ?? 'Your game'} is confirmed — see your squad split on the game page.`,
            actionPath: `/games/${gameId}`,
          })
          .catch(() => undefined);
      }
    }

    return this.getById(gameId, userId);
  }

  async leave(gameId: string, userId: string): Promise<GameSummaryDto> {
    await this.prisma.$transaction(
      async (tx) => {
        const game = await tx.game.findUnique({ where: { id: gameId } });
        if (!game) throw new NotFoundException('Game not found');
        if (game.hostUserId === userId) {
          throw new BadRequestException('Host cannot leave — cancel or transfer hosting elsewhere');
        }
        if (game.lifecycleState !== LIFECYCLE_OPEN) {
          throw new BadRequestException('Cannot leave a confirmed game — contact the host if you cannot play');
        }
        if (game.startsAt <= new Date()) {
          throw new BadRequestException('Cannot leave a game that has already started or finished');
        }

        const part = await tx.gameParticipant.findUnique({
          where: { gameId_userId: { gameId, userId } },
        });
        if (!part) throw new NotFoundException('You are not in this game');

        await tx.gameParticipant.delete({ where: { id: part.id } });

        const newFilled = Math.max(1, game.spotsFilled - 1);
        const urgentNeedPlayers = game.spotsTotal - newFilled <= 2;

        await tx.game.update({
          where: { id: gameId },
          data: {
            spotsFilled: newFilled,
            urgentNeedPlayers,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return this.getById(gameId, userId);
  }

  async create(dto: CreateGameDto, hostUserId: string): Promise<GameSummaryDto> {
    const profile = await this.prisma.profile.findUnique({ where: { userId: hostUserId } });
    if (!profile?.onboardingCompleted) {
      throw new BadRequestException('Finish onboarding before creating games');
    }
    const startsAt = new Date(dto.startsAt);
    if (!Number.isFinite(startsAt.getTime())) {
      throw new BadRequestException('Invalid startsAt');
    }
    if (startsAt <= new Date()) {
      throw new BadRequestException('startsAt must be in the future');
    }

    const maxPlayers = dto.maxPlayers;
    const minConfirm = dto.minPlayersToConfirm ?? maxPlayers;
    if (minConfirm < 2 || minConfirm > maxPlayers) {
      throw new BadRequestException('minPlayersToConfirm must be between 2 and maxPlayers');
    }

    const confirmDeadlineAt = dto.confirmDeadlineAt ? new Date(dto.confirmDeadlineAt) : null;
    if (confirmDeadlineAt && (!Number.isFinite(confirmDeadlineAt.getTime()) || confirmDeadlineAt >= startsAt)) {
      throw new BadRequestException('confirmDeadlineAt must be before kickoff');
    }

    const spotsFilled = 1;
    const { game, confirmed } = await this.prisma.$transaction(async (tx) => {
      const created = await tx.game.create({
        data: {
          gameMode: dto.gameMode,
          title: dto.title,
          venueName: dto.venueName,
          city: canonicalizeCityName(dto.city),
          startsAt,
          spotsTotal: maxPlayers,
          spotsFilled,
          skillLevel: dto.skillLevel,
          priceInrPerPlayer: dto.priceInrPerPlayer,
          hostUserId,
          isPublic: dto.isPublic ?? true,
          urgentNeedPlayers: maxPlayers - 1 <= 2,
          lifecycleState: LIFECYCLE_OPEN,
          minPlayersToConfirm: minConfirm,
          confirmDeadlineAt,
          footballVenueSubFormat: dto.footballVenueSubFormat?.trim() || null,
          genderFormat: dto.genderFormat ?? 'OPEN',
          mixedMinWomenOnField:
            dto.genderFormat === GENDER_MIXED ? (dto.mixedMinWomenOnField ?? 2) : dto.mixedMinWomenOnField ?? null,
        },
      });
      await tx.gameParticipant.create({
        data: { gameId: created.id, userId: hostUserId },
      });
      const confirmed = await this.maybeConfirmGame(tx, created.id);
      return { game: created, confirmed };
    });

    if (confirmed) {
      const g = await this.prisma.game.findUnique({ where: { id: game.id } });
      const parts = await this.prisma.gameParticipant.findMany({
        where: { gameId: game.id },
        select: { userId: true },
      });
      for (const p of parts) {
        void this.notifications
          .createForUser(p.userId, {
            type: 'GAME_CONFIRMED',
            title: 'Game on!',
            body: `${g?.title ?? 'Your game'} is confirmed — see your squad split on the game page.`,
            actionPath: `/games/${game.id}`,
          })
          .catch(() => undefined);
      }
    }

    return this.getById(game.id, hostUserId);
  }

  async inviteSquad(gameId: string, hostUserId: string, squadId: string): Promise<void> {
    await this.squads.inviteSquadToGame(gameId, hostUserId, squadId);
  }

  async shuffleTeams(gameId: string, hostUserId: string): Promise<GameSummaryDto> {
    const game = await this.requireHostConfirmed(gameId, hostUserId);
    await this.prisma.$transaction(async (tx) => {
      await this.rebalanceTeams(tx, game.id, game.gameMode);
    });
    return this.getById(gameId, hostUserId);
  }

  async updateBalancedTeams(
    gameId: string,
    hostUserId: string,
    body: { teamA: string[]; teamB: string[] },
  ): Promise<GameSummaryDto> {
    await this.requireHostConfirmed(gameId, hostUserId);
    const parts = await this.prisma.gameParticipant.findMany({ where: { gameId }, select: { userId: true } });
    const ids = new Set(parts.map((p) => p.userId));
    const A = [...new Set(body.teamA)];
    const B = [...new Set(body.teamB)];
    if (A.length + B.length !== ids.size) {
      throw new BadRequestException('Team lists must partition all joined players exactly once');
    }
    const all = new Set([...A, ...B]);
    if (all.size !== ids.size) {
      throw new BadRequestException('Duplicate player id across teams');
    }
    for (const uid of all) {
      if (!ids.has(uid)) throw new BadRequestException('Unknown player id in team list');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.game.update({
        where: { id: gameId },
        data: {
          balancedTeamsJson: { A, B } as unknown as Prisma.InputJsonValue,
        },
      });
      for (const uid of A) {
        await tx.gameParticipant.updateMany({ where: { gameId, userId: uid }, data: { teamSide: 'A' } });
      }
      for (const uid of B) {
        await tx.gameParticipant.updateMany({ where: { gameId, userId: uid }, data: { teamSide: 'B' } });
      }
    });
    return this.getById(gameId, hostUserId);
  }

  async completeGame(
    gameId: string,
    hostUserId: string,
    body: import('./dto/complete-game.dto').CompleteGameDto,
  ): Promise<GameSummaryDto> {
    const game = await this.requireHostConfirmed(gameId, hostUserId);
    if (game.startsAt > new Date()) {
      throw new BadRequestException('Game can only be completed after the scheduled start time');
    }
    const stats = body.participantStats ?? [];
    if (stats.length > 80) {
      throw new BadRequestException('Too many stat rows');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.game.update({
        where: { id: gameId },
        data: {
          lifecycleState: LIFECYCLE_COMPLETED,
          winnerSide: body.winnerSide,
          completedAt: new Date(),
        },
      });
      await this.applyRivalryDeltas(tx, gameId, body.winnerSide);

      if (stats.length > 0) {
        const ids = new Set((await tx.gameParticipant.findMany({ where: { gameId }, select: { userId: true } })).map((p) => p.userId));
        for (const row of stats) {
          if (!ids.has(row.userId)) {
            throw new BadRequestException(`Stat line for unknown player: ${row.userId}`);
          }
          const line: Record<string, number> = {};
          if (row.goals !== undefined) line.goals = row.goals;
          if (row.assists !== undefined) line.assists = row.assists;
          if (row.wickets !== undefined) line.wickets = row.wickets;
          await tx.gameParticipant.update({
            where: { gameId_userId: { gameId, userId: row.userId } },
            data: { statLineJson: Object.keys(line).length ? (line as Prisma.InputJsonValue) : Prisma.JsonNull },
          });
        }
      }
    });
    return this.getById(gameId, hostUserId);
  }

  async submitFeedbackTags(
    gameId: string,
    fromUserId: string,
    body: { toUserId: string; tagKey: string; isPositive: boolean },
  ): Promise<void> {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    if (game.lifecycleState !== LIFECYCLE_COMPLETED) {
      throw new BadRequestException('Tags can be submitted after the game is completed');
    }
    const tagKey = body.tagKey.trim().toUpperCase().slice(0, 64);
    if (!isAllowedFeedbackTagKey(tagKey, body.isPositive)) {
      throw new BadRequestException('Unknown feedback tag for this polarity');
    }
    const [a, b] = await Promise.all([
      this.prisma.gameParticipant.findUnique({ where: { gameId_userId: { gameId, userId: fromUserId } } }),
      this.prisma.gameParticipant.findUnique({ where: { gameId_userId: { gameId, userId: body.toUserId } } }),
    ]);
    if (!a || !b) throw new ForbiddenException('Both players must have participated in this game');
    if (fromUserId === body.toUserId) throw new BadRequestException('Cannot tag yourself');

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.teammateFeedbackTag.findFirst({
        where: { gameId, fromUserId, toUserId: body.toUserId, tagKey },
      });
      if (existing) return;

      await tx.teammateFeedbackTag.create({
        data: {
          gameId,
          fromUserId,
          toUserId: body.toUserId,
          tagKey,
          isPositive: body.isPositive,
        },
      });

      if (!body.isPositive) {
        await this.applyNegativeTagPenalty(tx, body.toUserId, game.gameMode);
      }
    });
  }

  async markAttendance(
    gameId: string,
    hostUserId: string,
    body: { entries: { userId: string; attended: boolean }[] },
  ): Promise<GameSummaryDto> {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    if (game.hostUserId !== hostUserId) throw new ForbiddenException('Only the host can mark attendance');
    if (game.lifecycleState !== LIFECYCLE_CONFIRMED && game.lifecycleState !== LIFECYCLE_COMPLETED) {
      throw new BadRequestException('Attendance can be marked for confirmed or completed games');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const e of body.entries) {
        const part = await tx.gameParticipant.findUnique({
          where: { gameId_userId: { gameId, userId: e.userId } },
        });
        if (!part) continue;
        const prev = part.attendanceStatus;
        const next = e.attended ? ATTENDANCE_ATTENDED : ATTENDANCE_NO_SHOW;
        if (prev === next) continue;

        await tx.gameParticipant.update({
          where: { id: part.id },
          data: { attendanceStatus: next },
        });

        if (next === ATTENDANCE_ATTENDED && prev !== ATTENDANCE_ATTENDED) {
          await tx.profile.update({
            where: { userId: e.userId },
            data: { gamesAttendedCount: { increment: 1 } },
          });
          await this.bumpPhy(tx, e.userId, game.gameMode);
        }

        if (next === ATTENDANCE_NO_SHOW && prev === ATTENDANCE_ATTENDED) {
          await tx.profile.update({
            where: { userId: e.userId },
            data: { gamesAttendedCount: { decrement: 1 } },
          });
        }

        if (next === ATTENDANCE_NO_SHOW) {
          const since = new Date(Date.now() - 30 * 86400000);
          const n = await tx.gameParticipant.count({
            where: {
              userId: e.userId,
              attendanceStatus: ATTENDANCE_NO_SHOW,
              game: { startsAt: { gte: since } },
            },
          });
          await tx.profile.update({
            where: { userId: e.userId },
            data: { noShowCountLast30d: n },
          });
          if (n === 1) {
            void this.notifications
              .createForUser(e.userId, {
                type: 'ATTENDANCE_WARNING',
                title: 'No-show recorded',
                body: 'You were marked absent for a confirmed game. One more no-show in 30 days may flag your profile.',
                actionPath: `/games/${gameId}`,
              })
              .catch(() => undefined);
          }
          if (n === 2) {
            void this.notifications
              .createForUser(e.userId, {
                type: 'ATTENDANCE_FLAG',
                title: 'Attendance warning',
                body: 'You have 2 no-shows in the last 30 days — your profile shows a caution badge.',
                actionPath: `/users/me`,
              })
              .catch(() => undefined);
          }
          if (n >= 3) {
            const until = new Date(Date.now() + 7 * 86400000);
            await tx.user.update({ where: { id: e.userId }, data: { joinRestrictedUntil: until } });
            void this.notifications
              .createForUser(e.userId, {
                type: 'JOIN_RESTRICTED',
                title: 'Joining restricted',
                body: 'Improve attendance to unlock joining new games. You can appeal from your profile.',
                actionPath: `/users/me`,
              })
              .catch(() => undefined);
          }
        }
      }
    });

    return this.getById(gameId, hostUserId);
  }

  async selfAttendanceQr(gameId: string, userId: string, token: string): Promise<GameSummaryDto> {
    const game = await this.prisma.game.findFirst({
      where: { id: gameId, attendanceQrToken: token },
    });
    if (!game) throw new NotFoundException('Invalid QR');
    if (game.lifecycleState !== LIFECYCLE_CONFIRMED && game.lifecycleState !== LIFECYCLE_COMPLETED) {
      throw new BadRequestException('Check-in is not open for this game');
    }
    const now = new Date();
    if (game.startsAt > now) {
      throw new BadRequestException('Check-in opens at kickoff');
    }

    const part = await this.prisma.gameParticipant.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });
    if (!part) throw new ForbiddenException('You are not in this game');
    if (part.attendanceStatus === ATTENDANCE_ATTENDED) {
      return this.getById(gameId, userId);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.gameParticipant.update({
        where: { id: part.id },
        data: { attendanceStatus: ATTENDANCE_ATTENDED },
      });
      await tx.profile.update({
        where: { userId },
        data: { gamesAttendedCount: { increment: 1 } },
      });
      await this.bumpPhy(tx, userId, game.gameMode);
    });

    return this.getById(gameId, userId);
  }

  private async applyNegativeTagPenalty(
    tx: Prisma.TransactionClient,
    subjectUserId: string,
    gameMode: string,
  ): Promise<void> {
    const profile = await tx.profile.findUnique({
      where: { userId: subjectUserId },
      include: { playerCards: { where: { mode: gameMode } } },
    });
    const card = profile?.playerCards[0];
    if (!card) return;
    const nextOvr = Math.max(40, card.ovr - 1);
    if (nextOvr !== card.ovr) {
      await tx.playerCard.update({
        where: { id: card.id },
        data: { ovr: nextOvr },
      });
    }
  }

  private async bumpPhy(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
    gameMode: string,
  ): Promise<void> {
    const profile = await tx.profile.findUnique({
      where: { userId },
      include: { playerCards: { where: { mode: gameMode }, include: { stats: true } } },
    });
    const card = profile?.playerCards[0];
    if (!card) return;
    const phy = card.stats.find((s) => s.key === 'PHY');
    if (phy) {
      await tx.playerCardStat.update({
        where: { id: phy.id },
        data: { value: phy.value + 1 },
      });
    } else {
      await tx.playerCardStat.create({
        data: { cardId: card.id, key: 'PHY', value: 1 },
      });
    }
  }

  private async requireHostConfirmed(gameId: string, hostUserId: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    if (game.hostUserId !== hostUserId) throw new ForbiddenException('Only the host can do this');
    if (game.lifecycleState !== LIFECYCLE_CONFIRMED) {
      throw new BadRequestException('Teams are only available after the game is confirmed');
    }
    return game;
  }

  private async maybeConfirmGame(tx: Prisma.TransactionClient, gameId: string): Promise<boolean> {
    const game = await tx.game.findUnique({ where: { id: gameId } });
    if (!game || game.lifecycleState !== LIFECYCLE_OPEN) return false;

    const effectiveMin =
      !game.minPlayersToConfirm || game.minPlayersToConfirm < 2
        ? game.spotsTotal
        : Math.min(game.minPlayersToConfirm, game.spotsTotal);
    if (game.spotsFilled < effectiveMin) return false;

    if (game.genderFormat === GENDER_MIXED) {
      const minPerTeam = game.mixedMinWomenOnField ?? 2;
      const parts = await tx.gameParticipant.findMany({
        where: { gameId },
        include: { user: { include: { profile: { select: { gender: true } } } } },
      });
      const women = parts.filter((p) => p.user.profile?.gender === 'WOMAN').map((p) => p.userId);
      if (women.length < minPerTeam * 2) {
        throw new BadRequestException(
          `Mixed format needs at least ${minPerTeam * 2} women registered before the game can confirm`,
        );
      }
    }

    const token = randomBytes(12).toString('hex');
    await this.rebalanceTeams(tx, gameId, game.gameMode);

    await tx.game.update({
      where: { id: gameId },
      data: {
        lifecycleState: LIFECYCLE_CONFIRMED,
        teamsVisibleToPlayers: true,
        attendanceQrToken: token,
      },
    });

    if (game.hostUserId) {
      await tx.user.update({
        where: { id: game.hostUserId },
        data: { hostedConfirmedGameCount: { increment: 1 } },
      });
    }

    const participants = await tx.gameParticipant.findMany({ where: { gameId }, select: { userId: true } });
    for (const p of participants) {
      await tx.profile.update({
        where: { userId: p.userId },
        data: { gamesConfirmedCount: { increment: 1 } },
      });
    }
    return true;
  }

  private async rebalanceTeams(tx: Prisma.TransactionClient, gameId: string, gameMode: string): Promise<void> {
    const game = await tx.game.findUnique({ where: { id: gameId } });
    if (!game) return;
    const parts = await tx.gameParticipant.findMany({
      where: { gameId },
      include: {
        user: {
          include: {
            profile: { include: { modeIdentities: true } },
          },
        },
      },
    });
    const userIds = parts.map((p) => p.userId);
    const pos = new Map<string, string>();
    for (const p of parts) {
      const ident = p.user.profile?.modeIdentities.find((m) => m.mode === gameMode);
      pos.set(p.userId, ident?.position ?? '');
    }

    let split: { A: string[]; B: string[] };
    if (game.genderFormat === GENDER_MIXED) {
      const minPerTeam = game.mixedMinWomenOnField ?? 2;
      const women = parts.filter((p) => p.user.profile?.gender === 'WOMAN').map((p) => p.userId);
      try {
        split = balanceSidesMixed(gameMode, userIds, pos, women, minPerTeam);
      } catch {
        split = balanceSides(gameMode, userIds, pos);
      }
    } else {
      split = balanceSides(gameMode, userIds, pos);
    }

    await tx.game.update({
      where: { id: gameId },
      data: {
        balancedTeamsJson: split as unknown as Prisma.InputJsonValue,
      },
    });
    for (const uid of split.A) {
      await tx.gameParticipant.updateMany({
        where: { gameId, userId: uid },
        data: { teamSide: 'A' },
      });
    }
    for (const uid of split.B) {
      await tx.gameParticipant.updateMany({
        where: { gameId, userId: uid },
        data: { teamSide: 'B' },
      });
    }
  }

  private orderedPair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  private async applyRivalryDeltas(
    tx: Prisma.TransactionClient,
    gameId: string,
    winner: 'A' | 'B' | 'DRAW',
  ): Promise<void> {
    const parts = await tx.gameParticipant.findMany({
      where: { gameId, teamSide: { not: null } },
      select: { userId: true, teamSide: true },
    });
    const teamA = parts.filter((p) => p.teamSide === 'A').map((p) => p.userId);
    const teamB = parts.filter((p) => p.teamSide === 'B').map((p) => p.userId);
    for (const ua of teamA) {
      for (const ub of teamB) {
        const [low, high] = this.orderedPair(ua, ub);
        let winsLow = 0;
        let winsHigh = 0;
        let draws = 0;
        if (winner === 'DRAW') draws = 1;
        else if (winner === 'A') {
          if (ua === low) winsLow += 1;
          else winsHigh += 1;
        } else if (winner === 'B') {
          if (ub === low) winsLow += 1;
          else winsHigh += 1;
        }
        await tx.playerRivalry.upsert({
          where: { userLowId_userHighId: { userLowId: low, userHighId: high } },
          create: {
            userLowId: low,
            userHighId: high,
            winsForLow: winsLow,
            winsForHigh: winsHigh,
            draws,
            gamesPlayed: 1,
            lastPlayedAt: new Date(),
          },
          update: {
            winsForLow: { increment: winsLow },
            winsForHigh: { increment: winsHigh },
            draws: { increment: draws },
            gamesPlayed: { increment: 1 },
            lastPlayedAt: new Date(),
          },
        });
      }
    }
  }

  async getMatchHistory(subjectUserId: string, query: MatchHistoryQueryDto): Promise<MatchHistoryResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: subjectUserId },
      select: { gamesAttendedCount: true, gamesConfirmedCount: true },
    });
    const monthRange =
      query.month &&
      (() => {
        const [y, m] = query.month.split('-').map((v) => Number.parseInt(v, 10));
        if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return undefined;
        return {
          gte: new Date(Date.UTC(y, m - 1, 1)),
          lt: new Date(Date.UTC(y, m, 1)),
        };
      })();

    const parts = await this.prisma.gameParticipant.findMany({
      where: {
        userId: subjectUserId,
        game: {
          lifecycleState: { in: [LIFECYCLE_COMPLETED, LIFECYCLE_CANCELLED] },
          ...(query.gameMode ? { gameMode: query.gameMode as string } : {}),
          ...(monthRange ? { startsAt: monthRange } : {}),
        },
      },
      include: { game: true },
      orderBy: { game: { startsAt: 'desc' } },
      take: 120,
    });

    const gameIds = parts.map((p) => p.game.id);
    const tagRows =
      gameIds.length === 0
        ? []
        : await this.prisma.teammateFeedbackTag.findMany({
            where: { gameId: { in: gameIds }, toUserId: subjectUserId, isPositive: true },
            select: { gameId: true, tagKey: true },
          });
    const tagsByGame = new Map<string, string[]>();
    for (const t of tagRows) {
      const arr = tagsByGame.get(t.gameId) ?? [];
      arr.push(t.tagKey);
      tagsByGame.set(t.gameId, arr);
    }

    const rows: MatchHistoryRowDto[] = parts.map((p) => {
      const g = p.game;
      let result = 'N_A';
      if (g.lifecycleState === LIFECYCLE_CANCELLED) {
        result = 'N_A';
      } else if (g.lifecycleState === LIFECYCLE_COMPLETED) {
        if (!g.winnerSide || !p.teamSide) result = 'N_A';
        else if (g.winnerSide === 'DRAW') result = 'DRAW';
        else if (g.winnerSide === p.teamSide) result = 'WIN';
        else result = 'LOSS';
      }
      return {
        gameId: g.id,
        gameMode: g.gameMode as GameMode,
        venueName: g.venueName,
        city: g.city,
        startsAt: g.startsAt.toISOString(),
        formatLabel: g.formatLabel ?? undefined,
        result,
        attendanceStatus: p.attendanceStatus,
        tagsReceived: tagsByGame.get(g.id),
        statLine: parseMatchStatLine(p.statLineJson),
      };
    });

    const completed = parts.filter((p) => p.game.lifecycleState === LIFECYCLE_COMPLETED);
    const wins = completed.filter((p) => {
      const g = p.game;
      return g.winnerSide && p.teamSide && g.winnerSide === p.teamSide && g.winnerSide !== 'DRAW';
    }).length;
    const losses = completed.filter((p) => {
      const g = p.game;
      return g.winnerSide && p.teamSide && g.winnerSide !== 'DRAW' && g.winnerSide !== p.teamSide;
    }).length;
    const draws = completed.filter((p) => p.game.winnerSide === 'DRAW').length;

    const gamesPlayed = completed.length;
    const confirmed = profile?.gamesConfirmedCount ?? 0;
    const attended = profile?.gamesAttendedCount ?? 0;
    const attendanceRatePct =
      confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;

    return {
      summary: {
        gamesPlayed,
        attendanceRatePct,
        wins,
        losses,
        draws,
      },
      rows,
    };
  }
}

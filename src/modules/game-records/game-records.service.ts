import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameMode } from '../../common/enums/game-mode.enum';
import { GameRecordPhase } from '../../common/enums/game-record-phase.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { RateTeammateDto } from './dto/rate-teammate.dto';
import { GameRecordResponseDto } from './dto/game-record-response.dto';

type RatingRow = {
  raterUserId: string;
  subjectUserId: string;
  skill: number;
  effort: number;
  attitude: number;
  communication: number;
  noShow: boolean;
};

function displayNameFor(user: { profile: { displayName: string } | null } | null): string {
  return user?.profile?.displayName?.trim() || 'Player';
}

function aggregateDims(
  rows: Pick<RatingRow, 'skill' | 'effort' | 'attitude' | 'communication'>[],
): {
  avgSkill: number | null;
  avgEffort: number | null;
  avgAttitude: number | null;
  avgCommunication: number | null;
  ratingCount: number;
} {
  if (rows.length === 0) {
    return {
      avgSkill: null,
      avgEffort: null,
      avgAttitude: null,
      avgCommunication: null,
      ratingCount: 0,
    };
  }
  const round1 = (v: number) => Math.round(v * 10) / 10;
  const mean = (key: keyof (typeof rows)[0]) =>
    round1(rows.reduce((a, r) => a + r[key], 0) / rows.length);
  return {
    avgSkill: mean('skill'),
    avgEffort: mean('effort'),
    avgAttitude: mean('attitude'),
    avgCommunication: mean('communication'),
    ratingCount: rows.length,
  };
}

@Injectable()
export class GameRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByGame(gameId: string, viewerUserId: string): Promise<GameRecordResponseDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          include: { user: { include: { profile: true } } },
        },
      },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const participantIds = new Set(game.participants.map((p) => p.userId));
    if (!participantIds.has(viewerUserId)) {
      throw new ForbiddenException('Only players in this game can view post-match records.');
    }

    const ratings = await this.prisma.gameTeammateRating.findMany({ where: { gameId } });
    return this.buildResponse(game, viewerUserId, ratings);
  }

  async submitRatings(
    gameId: string,
    viewerUserId: string,
    rows: RateTeammateDto[],
  ): Promise<GameRecordResponseDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          include: { user: { include: { profile: true } } },
        },
      },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const participantIds = new Set(game.participants.map((p) => p.userId));
    if (!participantIds.has(viewerUserId)) {
      throw new ForbiddenException('Only players in this game can submit ratings.');
    }

    const now = new Date();
    if (game.startsAt > now) {
      throw new BadRequestException('Ratings open after the scheduled kickoff time.');
    }

    const others = [...participantIds].filter((id) => id !== viewerUserId);
    if (others.length === 0) {
      throw new BadRequestException('No teammates to rate yet.');
    }
    if (rows.length === 0) {
      throw new BadRequestException('Provide at least one teammate rating.');
    }

    const subjectSet = new Set<string>();
    for (const row of rows) {
      if (row.subjectUserId === viewerUserId) {
        throw new BadRequestException('You cannot rate yourself.');
      }
      if (!participantIds.has(row.subjectUserId)) {
        throw new BadRequestException('Invalid teammate in rating payload.');
      }
      if (subjectSet.has(row.subjectUserId)) {
        throw new BadRequestException('Duplicate teammate in payload.');
      }
      subjectSet.add(row.subjectUserId);
    }

    await this.prisma.$transaction(
      rows.map((row) => {
        const noShow = Boolean(row.noShow);
        const skill = noShow ? 1 : row.skill;
        const effort = noShow ? 1 : row.effort;
        const attitude = noShow ? 1 : row.attitude;
        const communication = noShow ? 1 : row.communication;
        return this.prisma.gameTeammateRating.upsert({
          where: {
            gameId_raterUserId_subjectUserId: {
              gameId,
              raterUserId: viewerUserId,
              subjectUserId: row.subjectUserId,
            },
          },
          create: {
            gameId,
            raterUserId: viewerUserId,
            subjectUserId: row.subjectUserId,
            skill,
            effort,
            attitude,
            communication,
            noShow,
          },
          update: {
            skill,
            effort,
            attitude,
            communication,
            noShow,
          },
        });
      }),
    );

    const ratings = await this.prisma.gameTeammateRating.findMany({ where: { gameId } });
    return this.buildResponse(game, viewerUserId, ratings);
  }

  private buildResponse(
    game: {
      id: string;
      gameMode: string;
      title: string;
      venueName: string;
      city: string;
      startsAt: Date;
      participants: Array<{
        userId: string;
        user: { profile: { displayName: string } | null } | null;
      }>;
    },
    viewerUserId: string,
    ratings: RatingRow[],
  ): GameRecordResponseDto {
    const now = new Date();
    const phase = game.startsAt > now ? GameRecordPhase.UPCOMING : GameRecordPhase.RATING_OPEN;

    const participants = game.participants.map((p) => ({
      userId: p.userId,
      displayName: displayNameFor(p.user),
    }));

    const myRatings = ratings
      .filter((r) => r.raterUserId === viewerUserId)
      .map((r) => ({
        subjectUserId: r.subjectUserId,
        skill: r.skill,
        effort: r.effort,
        attitude: r.attitude,
        communication: r.communication,
        noShow: r.noShow,
      }));

    const myRatedSubjects = new Set(myRatings.map((r) => r.subjectUserId));

    const peerSummaries = game.participants
      .filter((p) => p.userId !== viewerUserId)
      .map((p) => {
        const received = ratings.filter((r) => r.subjectUserId === p.userId && !r.noShow);
        const agg = aggregateDims(received);
        return {
          userId: p.userId,
          displayName: displayNameFor(p.user),
          avgSkill: agg.avgSkill,
          avgEffort: agg.avgEffort,
          avgAttitude: agg.avgAttitude,
          avgCommunication: agg.avgCommunication,
          ratingCount: agg.ratingCount,
          ratedByMe: myRatedSubjects.has(p.userId),
        };
      });

    const aboutMe = ratings.filter((r) => r.subjectUserId === viewerUserId && !r.noShow);
    const receivedAgg = aggregateDims(aboutMe);
    const receivedSummary =
      receivedAgg.ratingCount > 0
        ? {
            avgSkill: receivedAgg.avgSkill,
            avgEffort: receivedAgg.avgEffort,
            avgAttitude: receivedAgg.avgAttitude,
            avgCommunication: receivedAgg.avgCommunication,
            ratingCount: receivedAgg.ratingCount,
          }
        : null;

    return {
      gameId: game.id,
      gameMode: game.gameMode as GameMode,
      title: game.title,
      venueName: game.venueName,
      city: game.city,
      startsAt: game.startsAt.toISOString(),
      phase,
      participants,
      myRatings,
      peerSummaries,
      receivedSummary,
    };
  }
}

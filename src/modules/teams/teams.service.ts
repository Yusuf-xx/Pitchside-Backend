import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';
import { TEAM_ROLE_CAPTAIN, TEAM_ROLE_MEMBER } from './teams.constants';
import {
  averageSquadOvr,
  mapTeamToDetail,
  mapTeamToSummary,
  withCaptainFlag,
} from './teams.mapper';

const rosterInclude = {
  members: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      user: {
        include: {
          profile: { include: { playerCards: true } },
        },
      },
    },
  },
} as const;

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string): Promise<TeamSummaryDto[]> {
    const rows = await this.prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            _count: { select: { members: true } },
            members: {
              include: {
                user: {
                  include: {
                    profile: { include: { playerCards: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return rows.map((row) => {
      const t = row.team;
      const teamOvr = averageSquadOvr(t.gameMode, t.members);
      return mapTeamToSummary(t, t._count.members, teamOvr);
    });
  }

  async getById(id: string, requestUserId?: string): Promise<TeamDetailDto> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: rosterInclude,
    });
    if (!team) throw new NotFoundException('Team not found');
    const detail = mapTeamToDetail(team);
    return withCaptainFlag(detail, requestUserId);
  }

  async create(userId: string, dto: CreateTeamDto): Promise<TeamDetailDto> {
    const mode = dto.gameMode ?? GameMode.FOOTBALL;
    const team = await this.prisma.$transaction(async (tx) => {
      const created = await tx.team.create({
        data: {
          name: dto.name.trim(),
          city: dto.city.trim(),
          gameMode: mode,
          kitColorHex: dto.kitColorHex?.trim() ?? null,
          captainUserId: userId,
        },
      });
      await tx.teamMember.create({
        data: {
          teamId: created.id,
          userId,
          role: TEAM_ROLE_CAPTAIN,
        },
      });
      return tx.team.findUniqueOrThrow({
        where: { id: created.id },
        include: rosterInclude,
      });
    });
    const detail = mapTeamToDetail(team);
    return withCaptainFlag(detail, userId);
  }

  async join(teamId: string, userId: string): Promise<TeamDetailDto> {
    await this.getById(teamId, userId);
    try {
      await this.prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role: TEAM_ROLE_MEMBER,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('You are already on this squad');
      }
      throw e;
    }
    return this.getById(teamId, userId);
  }
}

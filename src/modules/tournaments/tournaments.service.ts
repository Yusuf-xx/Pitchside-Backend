import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaCityEqualsInsensitive } from '../../common/city-normalize.util';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { CreateTournamentRegistrationDto } from './dto/create-tournament-registration.dto';
import { MyTournamentRegistrationDto } from './dto/my-tournament-registration.dto';
import { TournamentStandingsDto } from './dto/tournament-standings.dto';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';
import { mapTournamentToSummary } from './tournaments.mapper';

@Injectable()
export class TournamentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ModeCityQueryDto): Promise<TournamentSummaryDto[]> {
    const rows = await this.prisma.tournament.findMany({
      where: {
        ...(query.city?.trim() ? { city: prismaCityEqualsInsensitive(query.city) } : {}),
        ...(query.gameMode ? { gameMode: query.gameMode } : {}),
        ...(query.womenOnly ? { genderFormat: 'WOMEN_ONLY' } : {}),
      },
      orderBy: { startsAt: 'asc' },
      take: 100,
    });
    return rows.map(mapTournamentToSummary);
  }

  async getById(id: string): Promise<TournamentSummaryDto> {
    const row = await this.prisma.tournament.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Tournament not found');
    return mapTournamentToSummary(row);
  }

  async standings(id: string): Promise<TournamentStandingsDto> {
    await this.getById(id);
    return {
      groups: [],
      knockout: [],
      note: 'Standings will be generated after the group stage begins.',
    };
  }

  async listMyRegistrations(userId: string): Promise<MyTournamentRegistrationDto[]> {
    const rows = await this.prisma.tournamentRegistration.findMany({
      where: { userId },
      include: { tournament: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      tournamentId: r.tournamentId,
      teamName: r.teamName ?? undefined,
      createdAt: r.createdAt.toISOString(),
      tournament: mapTournamentToSummary(r.tournament),
    }));
  }

  async register(
    tournamentId: string,
    userId: string,
    dto: CreateTournamentRegistrationDto,
  ): Promise<TournamentSummaryDto> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const t = await tx.tournament.findUnique({ where: { id: tournamentId } });
        if (!t) {
          throw new NotFoundException('Tournament not found');
        }
        if (t.startsAt <= new Date()) {
          throw new BadRequestException('Registration closed for this tournament');
        }

        const reserved = await tx.tournament.updateMany({
          where: {
            id: tournamentId,
            teamsRegistered: { lt: t.teamsCap },
          },
          data: {
            teamsRegistered: { increment: 1 },
          },
        });
        if (reserved.count !== 1) {
          throw new BadRequestException('This tournament is full');
        }

        await tx.tournamentRegistration.create({
          data: {
            tournamentId,
            userId,
            teamName: dto.teamName?.trim() || null,
          },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('You are already registered for this tournament');
      }
      throw e;
    }
    return this.getById(tournamentId);
  }
}

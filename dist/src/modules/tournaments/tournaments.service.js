"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const tournaments_mapper_1 = require("./tournaments.mapper");
let TournamentsService = class TournamentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const rows = await this.prisma.tournament.findMany({
            where: {
                ...(query.city?.trim() ? { city: (0, city_normalize_util_1.prismaCityEqualsInsensitive)(query.city) } : {}),
                ...(query.gameMode ? { gameMode: query.gameMode } : {}),
                ...(query.womenOnly ? { genderFormat: 'WOMEN_ONLY' } : {}),
            },
            orderBy: { startsAt: 'asc' },
            take: 100,
        });
        return rows.map(tournaments_mapper_1.mapTournamentToSummary);
    }
    async getById(id) {
        const row = await this.prisma.tournament.findUnique({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException('Tournament not found');
        return (0, tournaments_mapper_1.mapTournamentToSummary)(row);
    }
    async standings(id) {
        await this.getById(id);
        return {
            groups: [],
            knockout: [],
            note: 'Standings will be generated after the group stage begins.',
        };
    }
    async listMyRegistrations(userId) {
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
            tournament: (0, tournaments_mapper_1.mapTournamentToSummary)(r.tournament),
        }));
    }
    async register(tournamentId, userId, dto) {
        try {
            await this.prisma.$transaction(async (tx) => {
                const t = await tx.tournament.findUnique({ where: { id: tournamentId } });
                if (!t) {
                    throw new common_1.NotFoundException('Tournament not found');
                }
                if (t.startsAt <= new Date()) {
                    throw new common_1.BadRequestException('Registration closed for this tournament');
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
                    throw new common_1.BadRequestException('This tournament is full');
                }
                await tx.tournamentRegistration.create({
                    data: {
                        tournamentId,
                        userId,
                        teamName: dto.teamName?.trim() || null,
                    },
                });
            }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('You are already registered for this tournament');
            }
            throw e;
        }
        return this.getById(tournamentId);
    }
};
exports.TournamentsService = TournamentsService;
exports.TournamentsService = TournamentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TournamentsService);
//# sourceMappingURL=tournaments.service.js.map
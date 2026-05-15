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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
const teams_constants_1 = require("./teams.constants");
const teams_mapper_1 = require("./teams.mapper");
const rosterInclude = {
    members: {
        orderBy: { createdAt: 'asc' },
        include: {
            user: {
                include: {
                    profile: { include: { playerCards: true } },
                },
            },
        },
    },
};
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listMine(userId) {
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
            const teamOvr = (0, teams_mapper_1.averageSquadOvr)(t.gameMode, t.members);
            return (0, teams_mapper_1.mapTeamToSummary)(t, t._count.members, teamOvr);
        });
    }
    async getById(id, requestUserId) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            include: rosterInclude,
        });
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        const detail = (0, teams_mapper_1.mapTeamToDetail)(team);
        return (0, teams_mapper_1.withCaptainFlag)(detail, requestUserId);
    }
    async create(userId, dto) {
        const mode = dto.gameMode ?? game_mode_enum_1.GameMode.FOOTBALL;
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
                    role: teams_constants_1.TEAM_ROLE_CAPTAIN,
                },
            });
            return tx.team.findUniqueOrThrow({
                where: { id: created.id },
                include: rosterInclude,
            });
        });
        const detail = (0, teams_mapper_1.mapTeamToDetail)(team);
        return (0, teams_mapper_1.withCaptainFlag)(detail, userId);
    }
    async join(teamId, userId) {
        await this.getById(teamId, userId);
        try {
            await this.prisma.teamMember.create({
                data: {
                    teamId,
                    userId,
                    role: teams_constants_1.TEAM_ROLE_MEMBER,
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('You are already on this squad');
            }
            throw e;
        }
        return this.getById(teamId, userId);
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map
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
exports.SquadsService = void 0;
const common_1 = require("@nestjs/common");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const prisma_service_1 = require("../../prisma/prisma.service");
const phone_e164_util_1 = require("../../common/lib/phone-e164.util");
const notifications_service_1 = require("../notifications/notifications.service");
const MIN_SQUAD = 5;
const MAX_SQUAD = 20;
let SquadsService = class SquadsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async create(userId, dto) {
        const squad = await this.prisma.squad.create({
            data: {
                name: dto.name.trim(),
                city: (0, city_normalize_util_1.canonicalizeCityName)(dto.city),
                captainUserId: userId,
                members: {
                    create: [{ userId }],
                },
            },
            include: { members: { include: { user: { include: { profile: true } } } } },
        });
        return this.mapSquad(squad);
    }
    async listMine(userId) {
        const rows = await this.prisma.squad.findMany({
            where: {
                OR: [{ captainUserId: userId }, { members: { some: { userId } } }],
            },
            include: { members: { include: { user: { include: { profile: true } } } } },
            orderBy: { updatedAt: 'desc' },
            take: 50,
        });
        return rows.map((r) => this.mapSquad(r));
    }
    async getById(squadId, userId) {
        const row = await this.requireSquadForMember(squadId, userId);
        const base = this.mapSquad(row);
        const memberIds = row.members.map((m) => m.userId);
        const [upcomingRows, pastRaw] = await Promise.all([
            this.prisma.game.findMany({
                where: {
                    squadInvites: { some: { squadId } },
                    lifecycleState: { in: ['OPEN', 'CONFIRMED'] },
                    startsAt: { gt: new Date() },
                },
                orderBy: { startsAt: 'asc' },
                take: 20,
            }),
            this.prisma.game.findMany({
                where: {
                    lifecycleState: 'COMPLETED',
                    participants: { some: { userId: { in: memberIds } } },
                },
                include: {
                    participants: {
                        select: { userId: true, teamSide: true },
                    },
                },
                orderBy: { startsAt: 'desc' },
                take: 40,
            }),
        ]);
        const pastFiltered = pastRaw.filter((g) => {
            const squadPresent = g.participants.filter((p) => memberIds.includes(p.userId));
            return squadPresent.length >= 2;
        });
        let squadWins = 0;
        let squadLosses = 0;
        let squadDraws = 0;
        for (const g of pastFiltered) {
            const squadParts = g.participants.filter((p) => memberIds.includes(p.userId) && p.teamSide);
            if (squadParts.length < 2)
                continue;
            const sides = new Set(squadParts.map((p) => p.teamSide));
            if (sides.size !== 1)
                continue;
            const side = squadParts[0].teamSide;
            if (!g.winnerSide)
                continue;
            if (g.winnerSide === 'DRAW')
                squadDraws += 1;
            else if (g.winnerSide === side)
                squadWins += 1;
            else
                squadLosses += 1;
        }
        const decidable = squadWins + squadLosses;
        const winRatePctApprox = decidable > 0 ? Math.round((squadWins / decidable) * 100) : undefined;
        const pastGamesTogether = pastFiltered.slice(0, 20).map((g) => ({
            id: g.id,
            title: g.title,
            city: g.city,
            venueName: g.venueName,
            startsAt: g.startsAt.toISOString(),
            lifecycleState: g.lifecycleState,
        }));
        const upcomingGames = upcomingRows.map((g) => ({
            id: g.id,
            title: g.title,
            city: g.city,
            venueName: g.venueName,
            startsAt: g.startsAt.toISOString(),
            lifecycleState: g.lifecycleState,
        }));
        const counts = new Map();
        for (const g of pastFiltered) {
            for (const p of g.participants) {
                if (!memberIds.includes(p.userId))
                    continue;
                counts.set(p.userId, (counts.get(p.userId) ?? 0) + 1);
            }
        }
        let topUser;
        let topN = 0;
        for (const [uid, n] of counts.entries()) {
            if (n > topN) {
                topN = n;
                topUser = uid;
            }
        }
        const topProf = topUser
            ? await this.prisma.profile.findUnique({
                where: { userId: topUser },
                select: { displayName: true, photoUrl: true },
            })
            : null;
        const stats = {
            gamesTogether: pastFiltered.length,
            winRatePctApprox,
            mostActiveMemberUserId: topUser,
            mostActiveMemberDisplayName: topProf?.displayName?.trim() || undefined,
            mostActiveMemberPhotoUrl: topProf?.photoUrl ?? undefined,
            mostActiveMemberGames: topN,
        };
        return { ...base, upcomingGames, pastGamesTogether, stats };
    }
    async addMember(squadId, actorUserId, dto) {
        let targetUserId = dto.userId?.trim();
        const phoneHint = dto.invitedPhone?.trim();
        if (!targetUserId && phoneHint) {
            const norm = (0, phone_e164_util_1.normalizePhoneE164Input)(phoneHint);
            if (!norm) {
                throw new common_1.BadRequestException('Use a full international phone including country code (e.g. +919876543210)');
            }
            const found = await this.prisma.profile.findUnique({
                where: { phoneE164: norm },
                select: { userId: true },
            });
            if (!found) {
                throw new common_1.NotFoundException('No player has saved that phone on their profile yet');
            }
            targetUserId = found.userId;
        }
        if (!targetUserId) {
            throw new common_1.BadRequestException('Search for a player or enter their registered phone number');
        }
        const squad = await this.requireCaptain(squadId, actorUserId);
        if (squad.members.length >= MAX_SQUAD) {
            throw new common_1.BadRequestException(`Squads are limited to ${MAX_SQUAD} members`);
        }
        if (targetUserId === actorUserId) {
            throw new common_1.BadRequestException('Captain is already a member');
        }
        const exists = squad.members.some((m) => m.userId === targetUserId);
        if (exists)
            throw new common_1.ConflictException('User is already in this squad');
        await this.prisma.squadMember.create({
            data: {
                squadId,
                userId: targetUserId,
                invitedPhone: (0, phone_e164_util_1.normalizePhoneE164Input)(phoneHint ?? '') ?? null,
            },
        });
        const updated = await this.prisma.squad.findUniqueOrThrow({
            where: { id: squadId },
            include: { members: { include: { user: { include: { profile: true } } } } },
        });
        return this.mapSquad(updated);
    }
    async inviteSquadToGame(gameId, hostUserId, squadId) {
        const game = await this.prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new common_1.NotFoundException('Game not found');
        if (game.hostUserId !== hostUserId) {
            throw new common_1.ForbiddenException('Only the host can invite a squad');
        }
        if (game.lifecycleState !== 'OPEN') {
            throw new common_1.BadRequestException('Squad invites are only available while the game is filling up');
        }
        const squad = await this.prisma.squad.findUnique({
            where: { id: squadId },
            include: { members: true },
        });
        if (!squad)
            throw new common_1.NotFoundException('Squad not found');
        if (squad.members.length < MIN_SQUAD) {
            throw new common_1.BadRequestException(`Squad needs at least ${MIN_SQUAD} members before inviting to a game`);
        }
        await this.prisma.gameSquadInvite.upsert({
            where: { gameId_squadId: { gameId, squadId } },
            create: { gameId, squadId },
            update: {},
        });
        for (const m of squad.members) {
            if (m.userId === hostUserId)
                continue;
            void this.notifications
                .createForUser(m.userId, {
                type: 'SQUAD_GAME_INVITE',
                title: `Squad game: ${game.title}`,
                body: `${squad.name} was invited to a game in ${game.city}.`,
                actionPath: `/games/${gameId}`,
            })
                .catch(() => undefined);
        }
    }
    async requireSquadForMember(squadId, userId) {
        const row = await this.prisma.squad.findUnique({
            where: { id: squadId },
            include: { members: { include: { user: { include: { profile: true } } } } },
        });
        if (!row)
            throw new common_1.NotFoundException('Squad not found');
        const ok = row.captainUserId === userId || row.members.some((m) => m.userId === userId);
        if (!ok)
            throw new common_1.ForbiddenException('Not a member of this squad');
        return row;
    }
    async requireCaptain(squadId, userId) {
        const row = await this.prisma.squad.findUnique({
            where: { id: squadId },
            include: { members: { include: { user: { include: { profile: true } } } } },
        });
        if (!row)
            throw new common_1.NotFoundException('Squad not found');
        if (row.captainUserId !== userId)
            throw new common_1.ForbiddenException('Only the captain can add members');
        return row;
    }
    mapSquad(row) {
        const members = row.members.map((m) => ({
            userId: m.userId,
            displayName: m.user.profile?.displayName?.trim() || 'Player',
            invitedPhone: m.invitedPhone ?? undefined,
        }));
        return {
            id: row.id,
            name: row.name,
            city: row.city,
            captainUserId: row.captainUserId,
            memberCount: members.length,
            members,
        };
    }
};
exports.SquadsService = SquadsService;
exports.SquadsService = SquadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], SquadsService);
//# sourceMappingURL=squads.service.js.map
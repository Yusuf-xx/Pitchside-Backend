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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const squads_service_1 = require("../squads/squads.service");
const games_mapper_1 = require("./games.mapper");
const games_balancing_util_1 = require("./games-balancing.util");
const feedback_tag_keys_1 = require("./feedback-tag-keys");
const game_domain_constants_1 = require("./game-domain.constants");
const games_mixed_balance_util_1 = require("./games-mixed-balance.util");
function parseMatchStatLine(raw) {
    if (raw === null || raw === undefined)
        return undefined;
    if (typeof raw !== 'object' || Array.isArray(raw))
        return undefined;
    const o = raw;
    const out = {};
    for (const [k, max] of [
        ['goals', 99],
        ['assists', 99],
        ['wickets', 99],
    ]) {
        const v = o[k];
        if (typeof v === 'number' && Number.isFinite(v)) {
            out[k] = Math.min(max, Math.max(0, Math.floor(v)));
        }
    }
    return out.goals !== undefined || out.assists !== undefined || out.wickets !== undefined ? out : undefined;
}
let GamesService = class GamesService {
    prisma;
    notifications;
    squads;
    constructor(prisma, notifications, squads) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.squads = squads;
    }
    baseWhere(now, query) {
        return {
            isPublic: true,
            startsAt: { gt: now },
            lifecycleState: { in: [game_domain_constants_1.LIFECYCLE_OPEN, game_domain_constants_1.LIFECYCLE_CONFIRMED] },
            ...(query.gameMode ? { gameMode: query.gameMode } : {}),
            ...(query.city?.trim() ? { city: (0, city_normalize_util_1.prismaCityEqualsInsensitive)(query.city) } : {}),
            ...(query.womenOnly ? { genderFormat: game_domain_constants_1.GENDER_WOMEN_ONLY } : {}),
            ...(query.footballVenueSubFormat ? { footballVenueSubFormat: query.footballVenueSubFormat } : {}),
        };
    }
    async list(query) {
        const now = new Date();
        const rows = await this.prisma.game.findMany({
            where: this.baseWhere(now, query),
            orderBy: { startsAt: 'asc' },
            take: 50,
            include: { host: { select: { hostedConfirmedGameCount: true } } },
        });
        const mapped = rows.map((r) => (0, games_mapper_1.mapGameToSummary)(r));
        mapped.sort((a, b) => {
            const va = a.hostVerified ? 1 : 0;
            const vb = b.hostVerified ? 1 : 0;
            if (vb !== va)
                return vb - va;
            return Date.parse(a.startsAt) - Date.parse(b.startsAt);
        });
        return mapped;
    }
    async needPlayers(query) {
        const now = new Date();
        const rows = await this.prisma.game.findMany({
            where: this.baseWhere(now, query),
            orderBy: { startsAt: 'asc' },
            take: 50,
            include: { host: { select: { hostedConfirmedGameCount: true } } },
        });
        const mapped = rows
            .map((r) => (0, games_mapper_1.mapGameToSummary)(r))
            .filter((g) => g.urgentNeedPlayers || g.spotsLeft <= 2);
        mapped.sort((a, b) => {
            const va = a.hostVerified ? 1 : 0;
            const vb = b.hostVerified ? 1 : 0;
            if (vb !== va)
                return vb - va;
            return Date.parse(a.startsAt) - Date.parse(b.startsAt);
        });
        return mapped;
    }
    async getById(id, viewerUserId) {
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
        if (!g)
            throw new common_1.NotFoundException('Game not found');
        let viewerParticipant = null;
        if (viewerUserId) {
            viewerParticipant = await this.prisma.gameParticipant.findUnique({
                where: { gameId_userId: { gameId: id, userId: viewerUserId } },
                select: { id: true },
            });
        }
        if (!g.isPublic) {
            if (!viewerUserId)
                throw new common_1.NotFoundException('Game not found');
            const isHostViewer = g.hostUserId === viewerUserId;
            const joined = !!viewerParticipant;
            if (!isHostViewer && !joined)
                throw new common_1.NotFoundException('Game not found');
        }
        const isHost = Boolean(viewerUserId && g.hostUserId === viewerUserId);
        const isParticipant = Boolean(viewerUserId && (isHost || viewerParticipant));
        const participants = isHost || isParticipant
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
        return (0, games_mapper_1.mapGameToSummary)(g, {
            isHost,
            isParticipant,
            viewerUserId: viewerUserId ?? undefined,
            participants,
        });
    }
    async join(gameId, userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile?.onboardingCompleted) {
            throw new common_1.BadRequestException('Finish onboarding before joining games');
        }
        const outcome = await this.prisma.$transaction(async (tx) => {
            const game = await tx.game.findUnique({ where: { id: gameId } });
            if (!game)
                throw new common_1.NotFoundException('Game not found');
            if (game.lifecycleState === game_domain_constants_1.LIFECYCLE_CANCELLED) {
                throw new common_1.BadRequestException('This game was cancelled');
            }
            if (game.lifecycleState === game_domain_constants_1.LIFECYCLE_COMPLETED) {
                throw new common_1.BadRequestException('This game is already completed');
            }
            if (!game.isPublic)
                throw new common_1.ForbiddenException('This game is not open for joining');
            if (game.startsAt <= new Date()) {
                throw new common_1.BadRequestException('This game has already started or finished');
            }
            if (game.spotsFilled >= game.spotsTotal) {
                throw new common_1.ConflictException('This game is full');
            }
            if (game.genderFormat === game_domain_constants_1.GENDER_WOMEN_ONLY) {
                if (profile.gender !== 'WOMAN') {
                    throw new common_1.ForbiddenException('This game is women-only. Set your gender on your profile to join, or pick an open game.');
                }
            }
            const u = await tx.user.findUnique({
                where: { id: userId },
                select: { joinRestrictedUntil: true },
            });
            if (u?.joinRestrictedUntil && u.joinRestrictedUntil > new Date()) {
                throw new common_1.ForbiddenException('Restricted — improve attendance to unlock joining new games');
            }
            const existing = await tx.gameParticipant.findUnique({
                where: { gameId_userId: { gameId, userId } },
            });
            if (existing)
                throw new common_1.ConflictException('You are already in this game');
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
            let host = null;
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
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
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
    async leave(gameId, userId) {
        await this.prisma.$transaction(async (tx) => {
            const game = await tx.game.findUnique({ where: { id: gameId } });
            if (!game)
                throw new common_1.NotFoundException('Game not found');
            if (game.hostUserId === userId) {
                throw new common_1.BadRequestException('Host cannot leave — cancel or transfer hosting elsewhere');
            }
            if (game.lifecycleState !== game_domain_constants_1.LIFECYCLE_OPEN) {
                throw new common_1.BadRequestException('Cannot leave a confirmed game — contact the host if you cannot play');
            }
            if (game.startsAt <= new Date()) {
                throw new common_1.BadRequestException('Cannot leave a game that has already started or finished');
            }
            const part = await tx.gameParticipant.findUnique({
                where: { gameId_userId: { gameId, userId } },
            });
            if (!part)
                throw new common_1.NotFoundException('You are not in this game');
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
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        return this.getById(gameId, userId);
    }
    async create(dto, hostUserId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId: hostUserId } });
        if (!profile?.onboardingCompleted) {
            throw new common_1.BadRequestException('Finish onboarding before creating games');
        }
        const startsAt = new Date(dto.startsAt);
        if (!Number.isFinite(startsAt.getTime())) {
            throw new common_1.BadRequestException('Invalid startsAt');
        }
        if (startsAt <= new Date()) {
            throw new common_1.BadRequestException('startsAt must be in the future');
        }
        const maxPlayers = dto.maxPlayers;
        const minConfirm = dto.minPlayersToConfirm ?? maxPlayers;
        if (minConfirm < 2 || minConfirm > maxPlayers) {
            throw new common_1.BadRequestException('minPlayersToConfirm must be between 2 and maxPlayers');
        }
        const confirmDeadlineAt = dto.confirmDeadlineAt ? new Date(dto.confirmDeadlineAt) : null;
        if (confirmDeadlineAt && (!Number.isFinite(confirmDeadlineAt.getTime()) || confirmDeadlineAt >= startsAt)) {
            throw new common_1.BadRequestException('confirmDeadlineAt must be before kickoff');
        }
        const spotsFilled = 1;
        const { game, confirmed } = await this.prisma.$transaction(async (tx) => {
            const created = await tx.game.create({
                data: {
                    gameMode: dto.gameMode,
                    title: dto.title,
                    venueName: dto.venueName,
                    city: (0, city_normalize_util_1.canonicalizeCityName)(dto.city),
                    startsAt,
                    spotsTotal: maxPlayers,
                    spotsFilled,
                    skillLevel: dto.skillLevel,
                    priceInrPerPlayer: dto.priceInrPerPlayer,
                    hostUserId,
                    isPublic: dto.isPublic ?? true,
                    urgentNeedPlayers: maxPlayers - 1 <= 2,
                    lifecycleState: game_domain_constants_1.LIFECYCLE_OPEN,
                    minPlayersToConfirm: minConfirm,
                    confirmDeadlineAt,
                    footballVenueSubFormat: dto.footballVenueSubFormat?.trim() || null,
                    genderFormat: dto.genderFormat ?? 'OPEN',
                    mixedMinWomenOnField: dto.genderFormat === game_domain_constants_1.GENDER_MIXED ? (dto.mixedMinWomenOnField ?? 2) : dto.mixedMinWomenOnField ?? null,
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
    async inviteSquad(gameId, hostUserId, squadId) {
        await this.squads.inviteSquadToGame(gameId, hostUserId, squadId);
    }
    async shuffleTeams(gameId, hostUserId) {
        const game = await this.requireHostConfirmed(gameId, hostUserId);
        await this.prisma.$transaction(async (tx) => {
            await this.rebalanceTeams(tx, game.id, game.gameMode);
        });
        return this.getById(gameId, hostUserId);
    }
    async updateBalancedTeams(gameId, hostUserId, body) {
        await this.requireHostConfirmed(gameId, hostUserId);
        const parts = await this.prisma.gameParticipant.findMany({ where: { gameId }, select: { userId: true } });
        const ids = new Set(parts.map((p) => p.userId));
        const A = [...new Set(body.teamA)];
        const B = [...new Set(body.teamB)];
        if (A.length + B.length !== ids.size) {
            throw new common_1.BadRequestException('Team lists must partition all joined players exactly once');
        }
        const all = new Set([...A, ...B]);
        if (all.size !== ids.size) {
            throw new common_1.BadRequestException('Duplicate player id across teams');
        }
        for (const uid of all) {
            if (!ids.has(uid))
                throw new common_1.BadRequestException('Unknown player id in team list');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.game.update({
                where: { id: gameId },
                data: {
                    balancedTeamsJson: { A, B },
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
    async completeGame(gameId, hostUserId, body) {
        const game = await this.requireHostConfirmed(gameId, hostUserId);
        if (game.startsAt > new Date()) {
            throw new common_1.BadRequestException('Game can only be completed after the scheduled start time');
        }
        const stats = body.participantStats ?? [];
        if (stats.length > 80) {
            throw new common_1.BadRequestException('Too many stat rows');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.game.update({
                where: { id: gameId },
                data: {
                    lifecycleState: game_domain_constants_1.LIFECYCLE_COMPLETED,
                    winnerSide: body.winnerSide,
                    completedAt: new Date(),
                },
            });
            await this.applyRivalryDeltas(tx, gameId, body.winnerSide);
            if (stats.length > 0) {
                const ids = new Set((await tx.gameParticipant.findMany({ where: { gameId }, select: { userId: true } })).map((p) => p.userId));
                for (const row of stats) {
                    if (!ids.has(row.userId)) {
                        throw new common_1.BadRequestException(`Stat line for unknown player: ${row.userId}`);
                    }
                    const line = {};
                    if (row.goals !== undefined)
                        line.goals = row.goals;
                    if (row.assists !== undefined)
                        line.assists = row.assists;
                    if (row.wickets !== undefined)
                        line.wickets = row.wickets;
                    await tx.gameParticipant.update({
                        where: { gameId_userId: { gameId, userId: row.userId } },
                        data: { statLineJson: Object.keys(line).length ? line : client_1.Prisma.JsonNull },
                    });
                }
            }
        });
        return this.getById(gameId, hostUserId);
    }
    async submitFeedbackTags(gameId, fromUserId, body) {
        const game = await this.prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new common_1.NotFoundException('Game not found');
        if (game.lifecycleState !== game_domain_constants_1.LIFECYCLE_COMPLETED) {
            throw new common_1.BadRequestException('Tags can be submitted after the game is completed');
        }
        const tagKey = body.tagKey.trim().toUpperCase().slice(0, 64);
        if (!(0, feedback_tag_keys_1.isAllowedFeedbackTagKey)(tagKey, body.isPositive)) {
            throw new common_1.BadRequestException('Unknown feedback tag for this polarity');
        }
        const [a, b] = await Promise.all([
            this.prisma.gameParticipant.findUnique({ where: { gameId_userId: { gameId, userId: fromUserId } } }),
            this.prisma.gameParticipant.findUnique({ where: { gameId_userId: { gameId, userId: body.toUserId } } }),
        ]);
        if (!a || !b)
            throw new common_1.ForbiddenException('Both players must have participated in this game');
        if (fromUserId === body.toUserId)
            throw new common_1.BadRequestException('Cannot tag yourself');
        await this.prisma.$transaction(async (tx) => {
            const existing = await tx.teammateFeedbackTag.findFirst({
                where: { gameId, fromUserId, toUserId: body.toUserId, tagKey },
            });
            if (existing)
                return;
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
    async markAttendance(gameId, hostUserId, body) {
        const game = await this.prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new common_1.NotFoundException('Game not found');
        if (game.hostUserId !== hostUserId)
            throw new common_1.ForbiddenException('Only the host can mark attendance');
        if (game.lifecycleState !== game_domain_constants_1.LIFECYCLE_CONFIRMED && game.lifecycleState !== game_domain_constants_1.LIFECYCLE_COMPLETED) {
            throw new common_1.BadRequestException('Attendance can be marked for confirmed or completed games');
        }
        await this.prisma.$transaction(async (tx) => {
            for (const e of body.entries) {
                const part = await tx.gameParticipant.findUnique({
                    where: { gameId_userId: { gameId, userId: e.userId } },
                });
                if (!part)
                    continue;
                const prev = part.attendanceStatus;
                const next = e.attended ? game_domain_constants_1.ATTENDANCE_ATTENDED : game_domain_constants_1.ATTENDANCE_NO_SHOW;
                if (prev === next)
                    continue;
                await tx.gameParticipant.update({
                    where: { id: part.id },
                    data: { attendanceStatus: next },
                });
                if (next === game_domain_constants_1.ATTENDANCE_ATTENDED && prev !== game_domain_constants_1.ATTENDANCE_ATTENDED) {
                    await tx.profile.update({
                        where: { userId: e.userId },
                        data: { gamesAttendedCount: { increment: 1 } },
                    });
                    await this.bumpPhy(tx, e.userId, game.gameMode);
                }
                if (next === game_domain_constants_1.ATTENDANCE_NO_SHOW && prev === game_domain_constants_1.ATTENDANCE_ATTENDED) {
                    await tx.profile.update({
                        where: { userId: e.userId },
                        data: { gamesAttendedCount: { decrement: 1 } },
                    });
                }
                if (next === game_domain_constants_1.ATTENDANCE_NO_SHOW) {
                    const since = new Date(Date.now() - 30 * 86400000);
                    const n = await tx.gameParticipant.count({
                        where: {
                            userId: e.userId,
                            attendanceStatus: game_domain_constants_1.ATTENDANCE_NO_SHOW,
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
    async selfAttendanceQr(gameId, userId, token) {
        const game = await this.prisma.game.findFirst({
            where: { id: gameId, attendanceQrToken: token },
        });
        if (!game)
            throw new common_1.NotFoundException('Invalid QR');
        if (game.lifecycleState !== game_domain_constants_1.LIFECYCLE_CONFIRMED && game.lifecycleState !== game_domain_constants_1.LIFECYCLE_COMPLETED) {
            throw new common_1.BadRequestException('Check-in is not open for this game');
        }
        const now = new Date();
        if (game.startsAt > now) {
            throw new common_1.BadRequestException('Check-in opens at kickoff');
        }
        const part = await this.prisma.gameParticipant.findUnique({
            where: { gameId_userId: { gameId, userId } },
        });
        if (!part)
            throw new common_1.ForbiddenException('You are not in this game');
        if (part.attendanceStatus === game_domain_constants_1.ATTENDANCE_ATTENDED) {
            return this.getById(gameId, userId);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.gameParticipant.update({
                where: { id: part.id },
                data: { attendanceStatus: game_domain_constants_1.ATTENDANCE_ATTENDED },
            });
            await tx.profile.update({
                where: { userId },
                data: { gamesAttendedCount: { increment: 1 } },
            });
            await this.bumpPhy(tx, userId, game.gameMode);
        });
        return this.getById(gameId, userId);
    }
    async applyNegativeTagPenalty(tx, subjectUserId, gameMode) {
        const profile = await tx.profile.findUnique({
            where: { userId: subjectUserId },
            include: { playerCards: { where: { mode: gameMode } } },
        });
        const card = profile?.playerCards[0];
        if (!card)
            return;
        const nextOvr = Math.max(40, card.ovr - 1);
        if (nextOvr !== card.ovr) {
            await tx.playerCard.update({
                where: { id: card.id },
                data: { ovr: nextOvr },
            });
        }
    }
    async bumpPhy(tx, userId, gameMode) {
        const profile = await tx.profile.findUnique({
            where: { userId },
            include: { playerCards: { where: { mode: gameMode }, include: { stats: true } } },
        });
        const card = profile?.playerCards[0];
        if (!card)
            return;
        const phy = card.stats.find((s) => s.key === 'PHY');
        if (phy) {
            await tx.playerCardStat.update({
                where: { id: phy.id },
                data: { value: phy.value + 1 },
            });
        }
        else {
            await tx.playerCardStat.create({
                data: { cardId: card.id, key: 'PHY', value: 1 },
            });
        }
    }
    async requireHostConfirmed(gameId, hostUserId) {
        const game = await this.prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new common_1.NotFoundException('Game not found');
        if (game.hostUserId !== hostUserId)
            throw new common_1.ForbiddenException('Only the host can do this');
        if (game.lifecycleState !== game_domain_constants_1.LIFECYCLE_CONFIRMED) {
            throw new common_1.BadRequestException('Teams are only available after the game is confirmed');
        }
        return game;
    }
    async maybeConfirmGame(tx, gameId) {
        const game = await tx.game.findUnique({ where: { id: gameId } });
        if (!game || game.lifecycleState !== game_domain_constants_1.LIFECYCLE_OPEN)
            return false;
        const effectiveMin = !game.minPlayersToConfirm || game.minPlayersToConfirm < 2
            ? game.spotsTotal
            : Math.min(game.minPlayersToConfirm, game.spotsTotal);
        if (game.spotsFilled < effectiveMin)
            return false;
        if (game.genderFormat === game_domain_constants_1.GENDER_MIXED) {
            const minPerTeam = game.mixedMinWomenOnField ?? 2;
            const parts = await tx.gameParticipant.findMany({
                where: { gameId },
                include: { user: { include: { profile: { select: { gender: true } } } } },
            });
            const women = parts.filter((p) => p.user.profile?.gender === 'WOMAN').map((p) => p.userId);
            if (women.length < minPerTeam * 2) {
                throw new common_1.BadRequestException(`Mixed format needs at least ${minPerTeam * 2} women registered before the game can confirm`);
            }
        }
        const token = (0, crypto_1.randomBytes)(12).toString('hex');
        await this.rebalanceTeams(tx, gameId, game.gameMode);
        await tx.game.update({
            where: { id: gameId },
            data: {
                lifecycleState: game_domain_constants_1.LIFECYCLE_CONFIRMED,
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
    async rebalanceTeams(tx, gameId, gameMode) {
        const game = await tx.game.findUnique({ where: { id: gameId } });
        if (!game)
            return;
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
        const pos = new Map();
        for (const p of parts) {
            const ident = p.user.profile?.modeIdentities.find((m) => m.mode === gameMode);
            pos.set(p.userId, ident?.position ?? '');
        }
        let split;
        if (game.genderFormat === game_domain_constants_1.GENDER_MIXED) {
            const minPerTeam = game.mixedMinWomenOnField ?? 2;
            const women = parts.filter((p) => p.user.profile?.gender === 'WOMAN').map((p) => p.userId);
            try {
                split = (0, games_mixed_balance_util_1.balanceSidesMixed)(gameMode, userIds, pos, women, minPerTeam);
            }
            catch {
                split = (0, games_balancing_util_1.balanceSides)(gameMode, userIds, pos);
            }
        }
        else {
            split = (0, games_balancing_util_1.balanceSides)(gameMode, userIds, pos);
        }
        await tx.game.update({
            where: { id: gameId },
            data: {
                balancedTeamsJson: split,
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
    orderedPair(a, b) {
        return a < b ? [a, b] : [b, a];
    }
    async applyRivalryDeltas(tx, gameId, winner) {
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
                if (winner === 'DRAW')
                    draws = 1;
                else if (winner === 'A') {
                    if (ua === low)
                        winsLow += 1;
                    else
                        winsHigh += 1;
                }
                else if (winner === 'B') {
                    if (ub === low)
                        winsLow += 1;
                    else
                        winsHigh += 1;
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
    async getMatchHistory(subjectUserId, query) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId: subjectUserId },
            select: { gamesAttendedCount: true, gamesConfirmedCount: true },
        });
        const monthRange = query.month &&
            (() => {
                const [y, m] = query.month.split('-').map((v) => Number.parseInt(v, 10));
                if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12)
                    return undefined;
                return {
                    gte: new Date(Date.UTC(y, m - 1, 1)),
                    lt: new Date(Date.UTC(y, m, 1)),
                };
            })();
        const parts = await this.prisma.gameParticipant.findMany({
            where: {
                userId: subjectUserId,
                game: {
                    lifecycleState: { in: [game_domain_constants_1.LIFECYCLE_COMPLETED, game_domain_constants_1.LIFECYCLE_CANCELLED] },
                    ...(query.gameMode ? { gameMode: query.gameMode } : {}),
                    ...(monthRange ? { startsAt: monthRange } : {}),
                },
            },
            include: { game: true },
            orderBy: { game: { startsAt: 'desc' } },
            take: 120,
        });
        const gameIds = parts.map((p) => p.game.id);
        const tagRows = gameIds.length === 0
            ? []
            : await this.prisma.teammateFeedbackTag.findMany({
                where: { gameId: { in: gameIds }, toUserId: subjectUserId, isPositive: true },
                select: { gameId: true, tagKey: true },
            });
        const tagsByGame = new Map();
        for (const t of tagRows) {
            const arr = tagsByGame.get(t.gameId) ?? [];
            arr.push(t.tagKey);
            tagsByGame.set(t.gameId, arr);
        }
        const rows = parts.map((p) => {
            const g = p.game;
            let result = 'N_A';
            if (g.lifecycleState === game_domain_constants_1.LIFECYCLE_CANCELLED) {
                result = 'N_A';
            }
            else if (g.lifecycleState === game_domain_constants_1.LIFECYCLE_COMPLETED) {
                if (!g.winnerSide || !p.teamSide)
                    result = 'N_A';
                else if (g.winnerSide === 'DRAW')
                    result = 'DRAW';
                else if (g.winnerSide === p.teamSide)
                    result = 'WIN';
                else
                    result = 'LOSS';
            }
            return {
                gameId: g.id,
                gameMode: g.gameMode,
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
        const completed = parts.filter((p) => p.game.lifecycleState === game_domain_constants_1.LIFECYCLE_COMPLETED);
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
        const attendanceRatePct = confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;
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
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        squads_service_1.SquadsService])
], GamesService);
//# sourceMappingURL=games.service.js.map
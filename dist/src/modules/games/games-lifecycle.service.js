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
var GamesLifecycleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesLifecycleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const game_domain_constants_1 = require("./game-domain.constants");
let GamesLifecycleService = GamesLifecycleService_1 = class GamesLifecycleService {
    prisma;
    notifications;
    logger = new common_1.Logger(GamesLifecycleService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async hourly() {
        const now = new Date();
        try {
            await this.cancelUnfilledOpenGames(now);
            await this.openAttendanceForStartedGames(now);
        }
        catch (e) {
            const code = typeof e === 'object' && e !== null && 'code' in e ? String(e.code) : '';
            if (code === 'P1001') {
                this.logger.warn('Game lifecycle cron skipped: database unreachable.');
                return;
            }
            throw e;
        }
    }
    async cancelUnfilledOpenGames(now) {
        const candidates = await this.prisma.game.findMany({
            where: {
                lifecycleState: game_domain_constants_1.LIFECYCLE_OPEN,
                confirmDeadlineAt: { not: null, lt: now },
            },
            select: {
                id: true,
                title: true,
                spotsFilled: true,
                minPlayersToConfirm: true,
                hostUserId: true,
            },
        });
        for (const g of candidates) {
            if (g.spotsFilled >= g.minPlayersToConfirm)
                continue;
            await this.prisma.game.update({
                where: { id: g.id },
                data: { lifecycleState: game_domain_constants_1.LIFECYCLE_CANCELLED },
            });
            const parts = await this.prisma.gameParticipant.findMany({
                where: { gameId: g.id },
                select: { userId: true },
            });
            for (const p of parts) {
                void this.notifications
                    .createForUser(p.userId, {
                    type: 'GAME_CANCELLED',
                    title: 'Game cancelled — not enough players',
                    body: `${g.title} did not reach the minimum by the deadline.`,
                    actionPath: `/games/${g.id}`,
                })
                    .catch(() => undefined);
            }
            if (g.hostUserId) {
                void this.notifications
                    .createForUser(g.hostUserId, {
                    type: 'GAME_CANCELLED',
                    title: 'Your game was cancelled',
                    body: `${g.title} — minimum players not met in time.`,
                    actionPath: `/games/${g.id}`,
                })
                    .catch(() => undefined);
            }
        }
        if (candidates.length) {
            this.logger.log(`Cancelled ${candidates.length} unfilled OPEN game(s) past deadline`);
        }
    }
    async openAttendanceForStartedGames(now) {
        const games = await this.prisma.game.findMany({
            where: {
                lifecycleState: game_domain_constants_1.LIFECYCLE_CONFIRMED,
                startsAt: { lte: now },
                attendanceOpenedAt: null,
            },
            select: { id: true, title: true, attendanceQrToken: true },
        });
        for (const g of games) {
            await this.prisma.game.update({
                where: { id: g.id },
                data: { attendanceOpenedAt: now },
            });
            const parts = await this.prisma.gameParticipant.findMany({
                where: { gameId: g.id, attendanceStatus: game_domain_constants_1.ATTENDANCE_PENDING },
                select: { userId: true },
            });
            for (const p of parts) {
                void this.notifications
                    .createForUser(p.userId, {
                    type: 'ATTENDANCE',
                    title: 'Mark attendance',
                    body: `${g.title} — let the host know you arrived (or use turf QR).`,
                    actionPath: `/games/${g.id}`,
                })
                    .catch(() => undefined);
            }
        }
    }
};
exports.GamesLifecycleService = GamesLifecycleService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesLifecycleService.prototype, "hourly", null);
exports.GamesLifecycleService = GamesLifecycleService = GamesLifecycleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], GamesLifecycleService);
//# sourceMappingURL=games-lifecycle.service.js.map
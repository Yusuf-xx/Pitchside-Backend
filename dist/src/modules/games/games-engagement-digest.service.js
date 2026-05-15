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
var GamesEngagementDigestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesEngagementDigestService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const game_domain_constants_1 = require("./game-domain.constants");
let GamesEngagementDigestService = GamesEngagementDigestService_1 = class GamesEngagementDigestService {
    prisma;
    notifications;
    log = new common_1.Logger(GamesEngagementDigestService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async weeklyNeedPlayersDigest() {
        const now = new Date();
        const horizon = new Date(now.getTime() + 14 * 86_400_000);
        const dedupeSince = new Date(now.getTime() - 7 * 86_400_000);
        const games = await this.prisma.game.findMany({
            where: {
                lifecycleState: game_domain_constants_1.LIFECYCLE_OPEN,
                isPublic: true,
                urgentNeedPlayers: true,
                startsAt: { gte: now, lte: horizon },
            },
            select: { city: true, spotsFilled: true, spotsTotal: true },
            take: 80,
        });
        const cities = [
            ...new Set(games.filter((g) => g.spotsFilled < g.spotsTotal).map((g) => g.city)),
        ].slice(0, 15);
        const recent = await this.prisma.notification.findMany({
            where: { type: 'NEARBY_NEED_PLAYERS_DIGEST', createdAt: { gte: dedupeSince } },
            select: { userId: true },
        });
        const skip = new Set(recent.map((n) => n.userId));
        let queued = 0;
        for (const city of cities) {
            const profiles = await this.prisma.profile.findMany({
                where: { city, onboardingCompleted: true },
                select: { userId: true },
                take: 80,
            });
            for (const p of profiles) {
                if (skip.has(p.userId))
                    continue;
                void this.notifications
                    .createForUser(p.userId, {
                    type: 'NEARBY_NEED_PLAYERS_DIGEST',
                    title: `Games in ${city} need players`,
                    body: `Hosts flagged urgent spots in the next two weeks. Help fill a pickup game.`,
                    actionPath: `/games?city=${encodeURIComponent(city)}&filter=need`,
                })
                    .catch(() => undefined);
                skip.add(p.userId);
                queued += 1;
                if (queued >= 500)
                    break;
            }
            if (queued >= 500)
                break;
        }
        if (queued > 0) {
            this.log.log(`Queued ${queued} nearby need-players digest notification(s)`);
        }
    }
};
exports.GamesEngagementDigestService = GamesEngagementDigestService;
__decorate([
    (0, schedule_1.Cron)('0 11 * * 4'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesEngagementDigestService.prototype, "weeklyNeedPlayersDigest", null);
exports.GamesEngagementDigestService = GamesEngagementDigestService = GamesEngagementDigestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], GamesEngagementDigestService);
//# sourceMappingURL=games-engagement-digest.service.js.map
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
var GamesRecapNudgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesRecapNudgeService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const game_domain_constants_1 = require("./game-domain.constants");
let GamesRecapNudgeService = GamesRecapNudgeService_1 = class GamesRecapNudgeService {
    prisma;
    notifications;
    log = new common_1.Logger(GamesRecapNudgeService_1.name);
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async weeklyRecapNudge() {
        const year = new Date().getUTCFullYear();
        const periodKey = `CY-${year}`;
        const from = new Date(Date.UTC(year, 0, 1));
        const to = new Date(Date.UTC(year + 1, 0, 1));
        const dedupeSince = new Date(Date.now() - 14 * 86_400_000);
        const recapped = await this.prisma.playerSeasonRecap.findMany({
            where: { periodKey },
            select: { userId: true },
        });
        const recappedSet = new Set(recapped.map((r) => r.userId));
        const grouped = await this.prisma.gameParticipant.groupBy({
            by: ['userId'],
            where: {
                game: {
                    lifecycleState: game_domain_constants_1.LIFECYCLE_COMPLETED,
                    completedAt: { gte: from, lt: to },
                },
            },
            _count: { _all: true },
        });
        const candidates = grouped.map((g) => g.userId).filter((id) => !recappedSet.has(id));
        if (candidates.length === 0) {
            return;
        }
        const recent = await this.prisma.notification.findMany({
            where: { type: 'YEAR_RECAP_NUDGE', createdAt: { gte: dedupeSince } },
            select: { userId: true },
        });
        const recentSet = new Set(recent.map((n) => n.userId));
        let queued = 0;
        for (const userId of candidates) {
            if (recentSet.has(userId))
                continue;
            void this.notifications
                .createForUser(userId, {
                type: 'YEAR_RECAP_NUDGE',
                title: `Your ${year} Pitchside recap`,
                body: 'Open Year in review to generate your stats for this season.',
                actionPath: '/recap',
            })
                .catch(() => undefined);
            recentSet.add(userId);
            queued += 1;
            if (queued >= 400)
                break;
        }
        if (queued > 0) {
            this.log.log(`Queued ${queued} year-recap nudge notification(s) (${candidates.length} candidate user(s))`);
        }
    }
};
exports.GamesRecapNudgeService = GamesRecapNudgeService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesRecapNudgeService.prototype, "weeklyRecapNudge", null);
exports.GamesRecapNudgeService = GamesRecapNudgeService = GamesRecapNudgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], GamesRecapNudgeService);
//# sourceMappingURL=games-recap-nudge.service.js.map
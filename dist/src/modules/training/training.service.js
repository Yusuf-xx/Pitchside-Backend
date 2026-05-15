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
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ist_calendar_1 = require("./ist-calendar");
const MAX_SESSION_MINUTES = 240;
const STREAK_DAY_MIN_MINUTES = 10;
let TrainingService = class TrainingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateSettings(userId) {
        return this.prisma.trainingSettings.upsert({
            where: { userId },
            create: { userId, weeklyGoalMinutes: 300 },
            update: {},
        });
    }
    async getStatus(userId) {
        const settings = await this.getOrCreateSettings(userId);
        const now = new Date();
        const weekStart = (0, ist_calendar_1.startOfIstIsoWeek)(now);
        const weekEnd = (0, ist_calendar_1.addIstDaysFromMidnight)(weekStart, 7);
        const weeklyAgg = await this.prisma.trainingSession.aggregate({
            where: {
                userId,
                endedAt: { gte: weekStart, lt: weekEnd },
                durationMinutes: { gt: 0 },
            },
            _sum: { durationMinutes: true },
        });
        const weeklyMinutes = weeklyAgg._sum.durationMinutes ?? 0;
        const open = await this.prisma.trainingSession.findFirst({
            where: { userId, endedAt: null },
            orderBy: { startedAt: 'desc' },
        });
        const streakDays = await this.computeStreakDays(userId, now);
        return {
            weeklyMinutes,
            weeklyGoalMinutes: settings.weeklyGoalMinutes,
            streakDays,
            clockedIn: Boolean(open),
        };
    }
    async computeStreakDays(userId, now) {
        const since = new Date(now.getTime() - 410 * ist_calendar_1.DAY_MS);
        const sessions = await this.prisma.trainingSession.findMany({
            where: {
                userId,
                endedAt: { not: null, gte: since },
                durationMinutes: { gt: 0 },
            },
            select: { endedAt: true, durationMinutes: true },
        });
        const byDay = new Map();
        for (const s of sessions) {
            if (!s.endedAt)
                continue;
            const key = (0, ist_calendar_1.istDateKey)(s.endedAt);
            byDay.set(key, (byDay.get(key) ?? 0) + s.durationMinutes);
        }
        const { year, month, day } = (0, ist_calendar_1.getIstYmdParts)(now);
        const todayStart = (0, ist_calendar_1.istWallMidnight)(year, month, day);
        let streak = 0;
        for (let i = 0; i < 400; i++) {
            const dayInstant = new Date(todayStart.getTime() - i * ist_calendar_1.DAY_MS);
            const minutes = byDay.get((0, ist_calendar_1.istDateKey)(dayInstant)) ?? 0;
            if (minutes >= STREAK_DAY_MIN_MINUTES) {
                streak++;
                continue;
            }
            if (i === 0)
                continue;
            break;
        }
        return streak;
    }
    async clockIn(userId, gps) {
        const open = await this.prisma.trainingSession.findFirst({
            where: { userId, endedAt: null },
        });
        if (open) {
            throw new common_1.ConflictException('Already clocked in');
        }
        await this.prisma.trainingSession.create({
            data: {
                userId,
                startLat: gps?.lat,
                startLng: gps?.lng,
                startAccuracyM: gps?.accuracyM,
            },
        });
        return this.getStatus(userId);
    }
    async clockOut(userId) {
        const open = await this.prisma.trainingSession.findFirst({
            where: { userId, endedAt: null },
            orderBy: { startedAt: 'desc' },
        });
        if (!open) {
            throw new common_1.BadRequestException('Not clocked in');
        }
        const endedAt = new Date();
        const elapsedMs = endedAt.getTime() - open.startedAt.getTime();
        const floored = Math.floor(elapsedMs / 60_000);
        const durationMinutes = Math.min(MAX_SESSION_MINUTES, Math.max(1, floored === 0 ? 1 : floored));
        await this.prisma.trainingSession.update({
            where: { id: open.id },
            data: { endedAt, durationMinutes },
        });
        return this.getStatus(userId);
    }
    async updateWeeklyGoal(userId, weeklyGoalMinutes) {
        await this.getOrCreateSettings(userId);
        await this.prisma.trainingSettings.update({
            where: { userId },
            data: { weeklyGoalMinutes },
        });
        return this.getStatus(userId);
    }
};
exports.TrainingService = TrainingService;
exports.TrainingService = TrainingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrainingService);
//# sourceMappingURL=training.service.js.map
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
exports.AdminAppealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AdminAppealsService = class AdminAppealsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async list(query) {
        const status = query.status ?? 'OPEN';
        const rows = await this.prisma.attendanceRestrictionAppeal.findMany({
            where: status === 'ALL' ? {} : { status },
            orderBy: { createdAt: 'desc' },
            take: 200,
            include: {
                user: {
                    include: {
                        profile: { select: { displayName: true } },
                    },
                },
            },
        });
        return rows.map((r) => ({
            id: r.id,
            userId: r.userId,
            displayName: r.user.profile?.displayName?.trim() || 'Player',
            message: r.message,
            status: r.status,
            moderatorNote: r.moderatorNote ?? undefined,
            reviewedAt: r.reviewedAt?.toISOString(),
            reviewedByUserId: r.reviewedByUserId ?? undefined,
            reviewedByLabel: r.reviewedByLabel ?? undefined,
            createdAt: r.createdAt.toISOString(),
        }));
    }
    async resolve(id, dto, req) {
        const appeal = await this.prisma.attendanceRestrictionAppeal.findUnique({
            where: { id },
            include: {
                user: {
                    include: { profile: { select: { displayName: true } } },
                },
            },
        });
        if (!appeal)
            throw new common_1.NotFoundException('Appeal not found');
        if (appeal.status !== 'OPEN') {
            throw new common_1.BadRequestException('Appeal is already resolved');
        }
        const meta = this.reviewerMeta(req);
        const now = new Date();
        const note = dto.moderatorNote?.trim() || undefined;
        if (dto.decision === 'APPROVE') {
            await this.prisma.$transaction(async (tx) => {
                await tx.user.update({
                    where: { id: appeal.userId },
                    data: { joinRestrictedUntil: null },
                });
                await tx.attendanceRestrictionAppeal.updateMany({
                    where: { userId: appeal.userId, status: 'OPEN', NOT: { id: appeal.id } },
                    data: {
                        status: 'REJECTED',
                        reviewedAt: now,
                        reviewedByUserId: meta.userId ?? null,
                        reviewedByLabel: meta.label,
                        moderatorNote: 'Closed automatically when another appeal for this player was approved.',
                    },
                });
                await tx.attendanceRestrictionAppeal.update({
                    where: { id: appeal.id },
                    data: {
                        status: 'APPROVED',
                        moderatorNote: note,
                        reviewedAt: now,
                        reviewedByUserId: meta.userId ?? null,
                        reviewedByLabel: meta.label,
                    },
                });
            });
            void this.notifications
                .createForUser(appeal.userId, {
                type: 'APPEAL_APPROVED',
                title: 'Join restriction lifted',
                body: 'Your appeal was approved. You can join pickup games again. Keep attendance strong so hosts can rely on you.',
                actionPath: '/games',
            })
                .catch(() => undefined);
        }
        else {
            await this.prisma.attendanceRestrictionAppeal.update({
                where: { id: appeal.id },
                data: {
                    status: 'REJECTED',
                    moderatorNote: note,
                    reviewedAt: now,
                    reviewedByUserId: meta.userId ?? null,
                    reviewedByLabel: meta.label,
                },
            });
            void this.notifications
                .createForUser(appeal.userId, {
                type: 'APPEAL_REJECTED',
                title: 'Appeal decision',
                body: note != null && note.length > 0
                    ? `Your join-restriction appeal was not approved. Note: ${note}`
                    : 'Your join-restriction appeal was not approved. Improve attendance at confirmed games and try again later.',
                actionPath: '/card',
            })
                .catch(() => undefined);
        }
        const updated = await this.prisma.attendanceRestrictionAppeal.findUnique({
            where: { id },
            include: { user: { include: { profile: { select: { displayName: true } } } } },
        });
        if (!updated)
            throw new common_1.NotFoundException('Appeal not found');
        return {
            id: updated.id,
            userId: updated.userId,
            displayName: updated.user.profile?.displayName?.trim() || 'Player',
            message: updated.message,
            status: updated.status,
            moderatorNote: updated.moderatorNote ?? undefined,
            reviewedAt: updated.reviewedAt?.toISOString(),
            reviewedByUserId: updated.reviewedByUserId ?? undefined,
            reviewedByLabel: updated.reviewedByLabel ?? undefined,
            createdAt: updated.createdAt.toISOString(),
        };
    }
    reviewerMeta(req) {
        const a = req.adminAccess;
        if (!a) {
            return { label: 'unknown' };
        }
        if (a.type === 'api_key') {
            return { label: 'admin-api-key' };
        }
        return { userId: a.userId, label: a.email };
    }
};
exports.AdminAppealsService = AdminAppealsService;
exports.AdminAppealsService = AdminAppealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AdminAppealsService);
//# sourceMappingURL=admin-appeals.service.js.map
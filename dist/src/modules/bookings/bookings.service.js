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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const turfs_service_1 = require("../turfs/turfs.service");
const notifications_service_1 = require("../notifications/notifications.service");
const turfs_mapper_1 = require("../turfs/turfs.mapper");
const bookings_mapper_1 = require("./bookings.mapper");
function requiredPositiveIntEnv(name) {
    const raw = process.env[name]?.trim();
    if (!raw) {
        throw new Error(`${name} is required`);
    }
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
}
let BookingsService = class BookingsService {
    prisma;
    turfsService;
    notifications;
    constructor(prisma, turfsService, notifications) {
        this.prisma = prisma;
        this.turfsService = turfsService;
        this.notifications = notifications;
    }
    normalizeSlots(slotStarts) {
        const normalized = slotStarts.map((s) => s.trim()).filter(Boolean);
        return [...new Set(normalized)].sort();
    }
    parseRowSlots(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw.filter((v) => typeof v === 'string');
    }
    todayDateString() {
        return new Date().toISOString().slice(0, 10);
    }
    pendingCutoffDate() {
        const ttlMinutes = requiredPositiveIntEnv('BOOKING_PENDING_PAYMENT_TTL_MINUTES');
        return new Date(Date.now() - ttlMinutes * 60_000);
    }
    async expirePendingForUser(userId) {
        await this.prisma.turfBooking.updateMany({
            where: {
                userId,
                status: 'PENDING_PAYMENT',
                createdAt: { lt: this.pendingCutoffDate() },
            },
            data: { status: 'EXPIRED_PAYMENT' },
        });
    }
    async listMine(userId) {
        await this.expirePendingForUser(userId);
        const rows = await this.prisma.turfBooking.findMany({
            where: { userId },
            include: { turf: true },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return rows.map(bookings_mapper_1.mapBooking);
    }
    async getById(userId, id) {
        await this.expirePendingForUser(userId);
        const row = await this.prisma.turfBooking.findUnique({
            where: { id },
            include: { turf: true },
        });
        if (!row || row.userId !== userId) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return (0, bookings_mapper_1.mapBooking)(row);
    }
    async create(userId, dto) {
        const turf = await this.turfsService.requireTurfRow(dto.turfId);
        const modes = (0, turfs_mapper_1.parseModesJson)(turf.modes);
        if (!modes.includes(dto.gameMode)) {
            throw new common_1.BadRequestException('Selected mode is not available at this turf');
        }
        const normalizedSlots = this.normalizeSlots(dto.slotStarts);
        const hours = normalizedSlots.length;
        if (hours < 1) {
            throw new common_1.BadRequestException('Select at least one time slot');
        }
        if (dto.date < this.todayDateString()) {
            throw new common_1.BadRequestException('Cannot create booking in the past');
        }
        const totalInr = hours * turf.priceInrPerHour;
        const splitPayment = dto.splitPayment ?? false;
        const status = splitPayment ? 'PENDING_PAYMENT' : 'CONFIRMED';
        const row = await this.prisma.$transaction(async (tx) => {
            await tx.turfBooking.updateMany({
                where: {
                    turfId: turf.id,
                    bookingDate: dto.date,
                    status: 'PENDING_PAYMENT',
                    createdAt: { lt: this.pendingCutoffDate() },
                },
                data: { status: 'EXPIRED_PAYMENT' },
            });
            const existing = await tx.turfBooking.findMany({
                where: {
                    turfId: turf.id,
                    bookingDate: dto.date,
                    status: {
                        in: ['CONFIRMED', 'PENDING_PAYMENT'],
                    },
                },
                select: { id: true, slotStartsJson: true },
            });
            const requested = new Set(normalizedSlots);
            const conflicts = existing.find((b) => {
                const slots = this.parseRowSlots(b.slotStartsJson);
                return slots.some((slot) => requested.has(slot));
            });
            if (conflicts) {
                throw new common_1.ConflictException('One or more selected slots are already booked');
            }
            return tx.turfBooking.create({
                data: {
                    userId,
                    turfId: turf.id,
                    gameMode: dto.gameMode,
                    bookingDate: dto.date,
                    slotStartsJson: normalizedSlots,
                    expectedPlayers: dto.expectedPlayers,
                    splitPayment,
                    totalInr,
                    status,
                },
                include: { turf: true },
            });
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        void this.notifications
            .createForUser(userId, {
            type: 'BOOKING',
            title: splitPayment ? 'Turf booking pending payment' : 'Turf booking confirmed',
            body: `${turf.name} · ${dto.date} · ₹${totalInr} total${splitPayment ? ' — collect splits from your squad.' : '.'}`,
            actionPath: `/book/mine/${row.id}`,
        })
            .catch(() => undefined);
        return (0, bookings_mapper_1.mapBooking)(row);
    }
    async cancel(userId, id) {
        await this.expirePendingForUser(userId);
        const row = await this.prisma.turfBooking.findUnique({
            where: { id },
            include: { turf: true },
        });
        if (!row || row.userId !== userId) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (row.bookingDate < this.todayDateString()) {
            throw new common_1.BadRequestException('Past bookings cannot be cancelled');
        }
        if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(row.status)) {
            throw new common_1.BadRequestException(`Booking cannot be cancelled from status ${row.status}`);
        }
        const updated = await this.prisma.turfBooking.update({
            where: { id: row.id },
            data: { status: 'CANCELLED' },
            include: { turf: true },
        });
        return (0, bookings_mapper_1.mapBooking)(updated);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        turfs_service_1.TurfsService,
        notifications_service_1.NotificationsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map
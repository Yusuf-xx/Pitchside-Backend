import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TurfsService } from '../turfs/turfs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { parseModesJson } from '../turfs/turfs.mapper';
import { mapBooking } from './bookings.mapper';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

function requiredPositiveIntEnv(name: string): number {
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

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly turfsService: TurfsService,
    private readonly notifications: NotificationsService,
  ) {}

  private normalizeSlots(slotStarts: string[]): string[] {
    const normalized = slotStarts.map((s) => s.trim()).filter(Boolean);
    return [...new Set(normalized)].sort();
  }

  private parseRowSlots(raw: Prisma.JsonValue): string[] {
    if (!Array.isArray(raw)) return [];
    return raw.filter((v): v is string => typeof v === 'string');
  }

  private todayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private pendingCutoffDate(): Date {
    const ttlMinutes = requiredPositiveIntEnv('BOOKING_PENDING_PAYMENT_TTL_MINUTES');
    return new Date(Date.now() - ttlMinutes * 60_000);
  }

  private async expirePendingForUser(userId: string): Promise<void> {
    await this.prisma.turfBooking.updateMany({
      where: {
        userId,
        status: 'PENDING_PAYMENT',
        createdAt: { lt: this.pendingCutoffDate() },
      },
      data: { status: 'EXPIRED_PAYMENT' },
    });
  }

  async listMine(userId: string): Promise<BookingDto[]> {
    await this.expirePendingForUser(userId);
    const rows = await this.prisma.turfBooking.findMany({
      where: { userId },
      include: { turf: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map(mapBooking);
  }

  async getById(userId: string, id: string): Promise<BookingDto> {
    await this.expirePendingForUser(userId);
    const row = await this.prisma.turfBooking.findUnique({
      where: { id },
      include: { turf: true },
    });
    if (!row || row.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }
    return mapBooking(row);
  }

  async create(userId: string, dto: CreateBookingDto): Promise<BookingDto> {
    const turf = await this.turfsService.requireTurfRow(dto.turfId);
    const modes = parseModesJson(turf.modes);
    if (!modes.includes(dto.gameMode)) {
      throw new BadRequestException('Selected mode is not available at this turf');
    }
    const normalizedSlots = this.normalizeSlots(dto.slotStarts);
    const hours = normalizedSlots.length;
    if (hours < 1) {
      throw new BadRequestException('Select at least one time slot');
    }
    if (dto.date < this.todayDateString()) {
      throw new BadRequestException('Cannot create booking in the past');
    }
    const totalInr = hours * turf.priceInrPerHour;
    const splitPayment = dto.splitPayment ?? false;
    const status = splitPayment ? 'PENDING_PAYMENT' : 'CONFIRMED';
    const row = await this.prisma.$transaction(
      async (tx) => {
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
          throw new ConflictException('One or more selected slots are already booked');
        }

        return tx.turfBooking.create({
          data: {
            userId,
            turfId: turf.id,
            gameMode: dto.gameMode,
            bookingDate: dto.date,
            slotStartsJson: normalizedSlots as Prisma.InputJsonValue,
            expectedPlayers: dto.expectedPlayers,
            splitPayment,
            totalInr,
            status,
          },
          include: { turf: true },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    void this.notifications
      .createForUser(userId, {
        type: 'BOOKING',
        title: splitPayment ? 'Turf booking pending payment' : 'Turf booking confirmed',
        body: `${turf.name} · ${dto.date} · ₹${totalInr} total${splitPayment ? ' — collect splits from your squad.' : '.'}`,
        actionPath: `/book/mine/${row.id}`,
      })
      .catch(() => undefined);
    return mapBooking(row);
  }

  async cancel(userId: string, id: string): Promise<BookingDto> {
    await this.expirePendingForUser(userId);
    const row = await this.prisma.turfBooking.findUnique({
      where: { id },
      include: { turf: true },
    });
    if (!row || row.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }
    if (row.bookingDate < this.todayDateString()) {
      throw new BadRequestException('Past bookings cannot be cancelled');
    }
    if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(row.status)) {
      throw new BadRequestException(`Booking cannot be cancelled from status ${row.status}`);
    }
    const updated = await this.prisma.turfBooking.update({
      where: { id: row.id },
      data: { status: 'CANCELLED' },
      include: { turf: true },
    });
    return mapBooking(updated);
  }
}

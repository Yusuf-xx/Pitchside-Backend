import type { Turf, TurfBooking } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { BookingDto } from './dto/booking.dto';

export type TurfBookingWithTurf = TurfBooking & { turf: Turf };

export function mapBooking(row: TurfBookingWithTurf): BookingDto {
  const raw = row.slotStartsJson;
  const slots = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
  return {
    id: row.id,
    turfId: row.turfId,
    turfName: row.turf.name,
    gameMode: row.gameMode as GameMode,
    date: row.bookingDate,
    slots,
    totalInr: row.totalInr,
    splitPayment: row.splitPayment,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

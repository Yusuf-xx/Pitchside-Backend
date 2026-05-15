import type { Turf, TurfBooking } from '@prisma/client';
import { BookingDto } from './dto/booking.dto';
export type TurfBookingWithTurf = TurfBooking & {
    turf: Turf;
};
export declare function mapBooking(row: TurfBookingWithTurf): BookingDto;

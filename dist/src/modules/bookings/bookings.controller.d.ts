import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    list(user: {
        userId: string;
    }): Promise<BookingDto[]>;
    getById(user: {
        userId: string;
    }, id: string): Promise<BookingDto>;
    create(user: {
        userId: string;
    }, dto: CreateBookingDto): Promise<BookingDto>;
    cancel(user: {
        userId: string;
    }, id: string): Promise<BookingDto>;
}

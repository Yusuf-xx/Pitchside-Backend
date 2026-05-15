import { PrismaService } from '../../prisma/prisma.service';
import { TurfsService } from '../turfs/turfs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    private readonly turfsService;
    private readonly notifications;
    constructor(prisma: PrismaService, turfsService: TurfsService, notifications: NotificationsService);
    private normalizeSlots;
    private parseRowSlots;
    private todayDateString;
    private pendingCutoffDate;
    private expirePendingForUser;
    listMine(userId: string): Promise<BookingDto[]>;
    getById(userId: string, id: string): Promise<BookingDto>;
    create(userId: string, dto: CreateBookingDto): Promise<BookingDto>;
    cancel(userId: string, id: string): Promise<BookingDto>;
}

import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TurfsService } from '../turfs/turfs.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('BookingsService', () => {
  let service: BookingsService;
  const turfBooking = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    process.env.BOOKING_PENDING_PAYMENT_TTL_MINUTES = '30';

    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: {
            turfBooking,
          },
        },
        {
          provide: TurfsService,
          useValue: {},
        },
        {
          provide: NotificationsService,
          useValue: { createForUser: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = moduleRef.get(BookingsService);
    turfBooking.findMany.mockResolvedValue([]);
    turfBooking.updateMany.mockResolvedValue({ count: 0 });
  });

  it('getById returns 404 when booking belongs to another user', async () => {
    turfBooking.findUnique.mockResolvedValue({
      id: 'b1',
      userId: 'other',
      turf: { name: 'T' },
      slotStartsJson: [],
    });
    await expect(service.getById('me', 'b1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

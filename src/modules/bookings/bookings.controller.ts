import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'My turf bookings' })
  @ApiOkResponse({ type: BookingDto, isArray: true })
  list(@CurrentUser() user: { userId: string }): Promise<BookingDto[]> {
    return this.bookingsService.listMine(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Booking detail (owner only)' })
  @ApiOkResponse({ type: BookingDto })
  getById(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BookingDto> {
    return this.bookingsService.getById(user.userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a turf booking' })
  @ApiCreatedResponse({ type: BookingDto })
  @ApiBadRequestResponse({ description: 'Invalid slots or unsupported mode for turf' })
  @ApiConflictResponse({ description: 'Selected slot overlaps with an existing booking' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateBookingDto,
  ): Promise<BookingDto> {
    return this.bookingsService.create(user.userId, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an upcoming booking' })
  @ApiOkResponse({ type: BookingDto })
  @ApiBadRequestResponse({ description: 'Booking is not cancellable' })
  cancel(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BookingDto> {
    return this.bookingsService.cancel(user.userId, id);
  }
}

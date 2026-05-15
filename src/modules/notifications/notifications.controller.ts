import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationItemDto } from './dto/notification-item.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'In-app notifications for the current user' })
  @ApiOkResponse({ type: NotificationItemDto, isArray: true })
  list(@CurrentUser() user: { userId: string }): Promise<NotificationItemDto[]> {
    return this.notificationsService.listMine(user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiOkResponse({ type: NotificationItemDto })
  markRead(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<NotificationItemDto> {
    return this.notificationsService.markRead(user.userId, id);
  }
}

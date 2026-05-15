import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AdminAccessGuard } from '../../common/guards/admin-access.guard';
import { FeedAdminService } from './feed-admin.service';
import { CreateFeedEventDto } from './dto/create-feed-event.dto';
import { FeedEventCreatedDto } from './dto/feed-event-created.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@ApiHeader({
  name: 'X-Admin-Key',
  required: false,
  description: 'Alternative to JWT when ADMIN_API_KEY is set',
})
@Controller('admin')
export class AdminFeedController {
  constructor(private readonly feedAdmin: FeedAdminService) {}

  @Post('feed-events')
  @UseGuards(AdminAccessGuard)
  @ApiOperation({
    summary: 'Create home feed item',
    description:
      'Requires admin auth: header X-Admin-Key matching ADMIN_API_KEY, or Bearer JWT for an email in ADMIN_EMAILS.',
  })
  @ApiCreatedResponse({ type: FeedEventCreatedDto })
  @ApiForbiddenResponse({ description: 'Admin authentication failed or account is not allowlisted' })
  @ApiServiceUnavailableResponse({ description: 'Admin access not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)' })
  @ApiTooManyRequestsResponse({ description: 'Too many admin requests. Try again later.' })
  createFeedEvent(@Body() dto: CreateFeedEventDto): Promise<FeedEventCreatedDto> {
    return this.feedAdmin.create(dto);
  }
}

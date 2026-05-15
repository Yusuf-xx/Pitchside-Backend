import { Controller, Get, Patch, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessGuard, type RequestWithAdmin } from '../../common/guards/admin-access.guard';
import { AdminAppealsService } from './admin-appeals.service';
import { AdminAppealItemDto } from './dto/admin-appeal-item.dto';
import { ListAppealsQueryDto } from './dto/list-appeals-query.dto';
import { ResolveAppealDto } from './dto/resolve-appeal.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@ApiHeader({
  name: 'X-Admin-Key',
  required: false,
  description: 'Alternative to JWT when ADMIN_API_KEY is set',
})
@Controller('admin')
export class AdminAppealsController {
  constructor(private readonly appeals: AdminAppealsService) {}

  @Get('appeals')
  @UseGuards(AdminAccessGuard)
  @ApiOperation({
    summary: 'List join-restriction appeals',
    description: 'Requires admin auth (same as feed-events): X-Admin-Key or JWT for ADMIN_EMAILS.',
  })
  @ApiOkResponse({ type: AdminAppealItemDto, isArray: true })
  @ApiForbiddenResponse()
  @ApiServiceUnavailableResponse()
  list(@Query() query: ListAppealsQueryDto): Promise<AdminAppealItemDto[]> {
    return this.appeals.list(query);
  }

  @Patch('appeals/:id')
  @UseGuards(AdminAccessGuard)
  @ApiOperation({
    summary: 'Approve or reject an appeal',
    description:
      'APPROVE clears the player join restriction and rejects other OPEN appeals for the same user. REJECT leaves the restriction in place.',
  })
  @ApiOkResponse({ type: AdminAppealItemDto })
  resolve(
    @Param('id') id: string,
    @Body() dto: ResolveAppealDto,
    @Req() req: RequestWithAdmin,
  ): Promise<AdminAppealItemDto> {
    return this.appeals.resolve(id, dto, req);
  }
}

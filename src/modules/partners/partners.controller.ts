import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AdminAccessGuard } from '../../common/guards/admin-access.guard';
import { PartnerInterestDto } from './dto/partner-interest.dto';
import { PartnerInterestResponseDto } from './dto/partner-interest-response.dto';
import { PartnerTurfInterestDetailDto } from './dto/partner-turf-interest-detail.dto';
import { UpdatePartnerTurfInterestDto } from './dto/update-partner-turf-interest.dto';
import { PartnersService } from './partners.service';

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post('turf-interest')
  @ApiOperation({
    summary: 'Turf owner partner interest',
    description:
      'Public intake for venues that want to appear on Pitchside booking. Duplicate email+turf+city returns 409.',
  })
  @ApiCreatedResponse({ type: PartnerInterestResponseDto })
  @ApiConflictResponse({ description: 'Duplicate submission for same email, turf name, and city' })
  @ApiTooManyRequestsResponse({ description: 'Too many submissions. Try again later.' })
  submitTurfInterest(@Body() dto: PartnerInterestDto): Promise<PartnerInterestResponseDto> {
    return this.partnersService.submitTurfInterest(dto);
  }

  @Patch('turf-interest/:id')
  @UseGuards(AdminAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiHeader({
    name: 'X-Admin-Key',
    required: false,
    description: 'Alternative to JWT when ADMIN_API_KEY is set',
  })
  @ApiOperation({
    summary: 'Update partner turf interest (CRM)',
    description:
      'Admin only: X-Admin-Key matching ADMIN_API_KEY, or JWT for an email listed in ADMIN_EMAILS.',
  })
  @ApiOkResponse({ type: PartnerTurfInterestDetailDto })
  @ApiBadRequestResponse({ description: 'Invalid update payload or assignee user does not exist' })
  @ApiNotFoundResponse({ description: 'Partner interest not found' })
  @ApiForbiddenResponse({ description: 'Admin authentication failed or account is not allowlisted' })
  @ApiServiceUnavailableResponse({ description: 'Admin access not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)' })
  @ApiTooManyRequestsResponse({ description: 'Too many admin requests. Try again later.' })
  updateTurfInterest(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerTurfInterestDto,
  ): Promise<PartnerTurfInterestDetailDto> {
    return this.partnersService.updateTurfInterest(id, dto);
  }
}

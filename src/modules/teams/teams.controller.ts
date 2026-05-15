import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Squads you belong to' })
  @ApiOkResponse({ type: TeamSummaryDto, isArray: true })
  listMine(@CurrentUser() user: { userId: string }): Promise<TeamSummaryDto[]> {
    return this.teamsService.listMine(user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a squad (you become captain)' })
  @ApiCreatedResponse({ type: TeamDetailDto })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTeamDto,
  ): Promise<TeamDetailDto> {
    return this.teamsService.create(user.userId, dto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Join an open squad roster' })
  @ApiOkResponse({ type: TeamDetailDto })
  join(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<TeamDetailDto> {
    return this.teamsService.join(id, user.userId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Squad detail + roster (Bearer optional for captain flag)' })
  @ApiOkResponse({ type: TeamDetailDto })
  getById(
    @Param('id') id: string,
    @Req() req: RequestWithOptionalUser,
  ): Promise<TeamDetailDto> {
    return this.teamsService.getById(id, req.user?.userId);
  }
}

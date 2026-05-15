import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { CompleteGameDto } from './dto/complete-game.dto';
import { FeedbackTagDto } from './dto/feedback-tag.dto';
import { InviteSquadDto } from './dto/invite-squad.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { QrSelfAttendanceDto } from './dto/qr-self.dto';
import { GameSummaryDto } from './dto/game-summary.dto';
import { MatchHistoryQueryDto, MatchHistoryResponseDto } from './dto/match-history.dto';
import { UpdateBalancedTeamsDto } from './dto/update-balanced-teams.dto';
import { GamesService } from './games.service';
import { RecapService } from './recap.service';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly recapService: RecapService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming public games (mode + city filters)' })
  @ApiOkResponse({ type: GameSummaryDto, isArray: true })
  list(@Query() query: ModeCityQueryDto): Promise<GameSummaryDto[]> {
    return this.gamesService.list(query);
  }

  @Get('alerts/need-players')
  @ApiOperation({ summary: 'Urgent last-spot requests' })
  @ApiOkResponse({ type: GameSummaryDto, isArray: true })
  needPlayers(@Query() query: ModeCityQueryDto): Promise<GameSummaryDto[]> {
    return this.gamesService.needPlayers(query);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Join a public upcoming game' })
  @ApiOkResponse({ type: GameSummaryDto })
  join(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<GameSummaryDto> {
    return this.gamesService.join(id, user.userId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Leave a game you joined (host cannot leave)' })
  @ApiOkResponse({ type: GameSummaryDto })
  leave(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<GameSummaryDto> {
    return this.gamesService.leave(id, user.userId);
  }

  @Post(':id/invite-squad')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Host invites a squad — all members notified' })
  inviteSquad(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: InviteSquadDto,
  ): Promise<void> {
    return this.gamesService.inviteSquad(id, user.userId, dto.squadId);
  }

  @Post(':id/shuffle-teams')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Host re-runs auto-balanced A/B split' })
  @ApiOkResponse({ type: GameSummaryDto })
  shuffleTeams(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<GameSummaryDto> {
    return this.gamesService.shuffleTeams(id, user.userId);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Host marks game complete and records winner for rivalries' })
  @ApiOkResponse({ type: GameSummaryDto })
  complete(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: CompleteGameDto,
  ): Promise<GameSummaryDto> {
    return this.gamesService.completeGame(id, user.userId, dto);
  }

  @Post(':id/feedback-tags')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Post-match teammate tag (after game completed)' })
  feedbackTag(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: FeedbackTagDto,
  ): Promise<void> {
    return this.gamesService.submitFeedbackTags(id, user.userId, dto);
  }

  @Patch(':id/attendance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Host marks attendance for players' })
  @ApiOkResponse({ type: GameSummaryDto })
  markAttendance(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: MarkAttendanceDto,
  ): Promise<GameSummaryDto> {
    return this.gamesService.markAttendance(id, user.userId, dto);
  }

  @Post(':id/attendance/self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Player self check-in with QR token from host screen' })
  @ApiOkResponse({ type: GameSummaryDto })
  selfAttendance(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: QrSelfAttendanceDto,
  ): Promise<GameSummaryDto> {
    return this.gamesService.selfAttendanceQr(id, user.userId, dto.token);
  }

  @Patch(':id/teams/balanced')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Host manually assigns balanced teams (drag-drop in UI)' })
  @ApiOkResponse({ type: GameSummaryDto })
  updateBalancedTeams(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateBalancedTeamsDto,
  ): Promise<GameSummaryDto> {
    return this.gamesService.updateBalancedTeams(id, user.userId, dto);
  }

  @Get('recap/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Annual football-style recap (cached per calendar year)' })
  @ApiOkResponse({ description: 'periodKey + payload stats' })
  myRecap(
    @CurrentUser() user: { userId: string },
    @Query('year') year?: string,
    @Query('half') half?: string,
  ): Promise<{ periodKey: string; payload: Record<string, unknown> }> {
    const y = year ? Number.parseInt(year, 10) : new Date().getUTCFullYear();
    if (!Number.isFinite(y)) {
      throw new BadRequestException('Invalid year');
    }
    let h: 1 | 2 | undefined;
    if (half === '1') h = 1;
    else if (half === '2') h = 2;
    else if (half !== undefined && half !== '') {
      throw new BadRequestException('half must be 1 or 2');
    }
    return this.recapService.getOrBuildRecap(user.userId, y, h);
  }

  @Get('match-history/:userId')
  @ApiOperation({ summary: 'Public match history for a player profile' })
  @ApiOkResponse({ type: MatchHistoryResponseDto })
  matchHistory(@Param('userId') userId: string, @Query() query: MatchHistoryQueryDto): Promise<MatchHistoryResponseDto> {
    return this.gamesService.getMatchHistory(userId, query);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Game detail',
    description: 'Bearer optional — when logged in, includes isHost / isParticipant. Private games only visible to host or participants.',
  })
  @ApiOkResponse({ type: GameSummaryDto })
  getById(
    @Param('id') id: string,
    @Req() req: RequestWithOptionalUser,
  ): Promise<GameSummaryDto> {
    return this.gamesService.getById(id, req.user?.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a public game (host auto-joins)' })
  @ApiCreatedResponse({ type: GameSummaryDto })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateGameDto,
  ): Promise<GameSummaryDto> {
    return this.gamesService.create(dto, user.userId);
  }
}

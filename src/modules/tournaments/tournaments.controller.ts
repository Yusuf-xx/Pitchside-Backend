import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
import { CreateTournamentRegistrationDto } from './dto/create-tournament-registration.dto';
import { MyTournamentRegistrationDto } from './dto/my-tournament-registration.dto';
import { TournamentStandingsDto } from './dto/tournament-standings.dto';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';
import { TournamentsService } from './tournaments.service';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  @ApiOperation({ summary: 'Discover tournaments (city + mode filters)' })
  @ApiOkResponse({ type: TournamentSummaryDto, isArray: true })
  list(@Query() query: ModeCityQueryDto): Promise<TournamentSummaryDto[]> {
    return this.tournamentsService.list(query);
  }

  @Get('registrations/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tournaments you have registered for' })
  @ApiOkResponse({ type: MyTournamentRegistrationDto, isArray: true })
  myRegistrations(@CurrentUser() user: { userId: string }): Promise<MyTournamentRegistrationDto[]> {
    return this.tournamentsService.listMyRegistrations(user.userId);
  }

  @Get(':id/standings')
  @ApiOperation({ summary: 'Standings (placeholder until bracket engine ships)' })
  @ApiOkResponse({ type: TournamentStandingsDto })
  standings(@Param('id') id: string): Promise<TournamentStandingsDto> {
    return this.tournamentsService.standings(id);
  }

  @Post(':id/registrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register your squad for a tournament (one entry per user per event)' })
  @ApiCreatedResponse({ type: TournamentSummaryDto })
  register(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTournamentRegistrationDto,
  ): Promise<TournamentSummaryDto> {
    return this.tournamentsService.register(id, user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tournament detail' })
  @ApiOkResponse({ type: TournamentSummaryDto })
  getById(@Param('id') id: string): Promise<TournamentSummaryDto> {
    return this.tournamentsService.getById(id);
  }
}

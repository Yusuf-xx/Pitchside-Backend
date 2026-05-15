import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityLeaderboardQueryDto, NationalLeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardRowDto } from './dto/leaderboard-row.dto';
import { LeaderboardsService } from './leaderboards.service';

@ApiTags('Leaderboards')
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('city')
  @ApiOperation({
    summary: 'Top players in a city for a mode (from player cards)',
    description: 'Ranks by OVR for the given mode. Empty when no cards exist in that city yet.',
  })
  @ApiOkResponse({ type: LeaderboardRowDto, isArray: true })
  city(@Query() query: CityLeaderboardQueryDto): Promise<LeaderboardRowDto[]> {
    return this.leaderboardsService.city(query.city, query.mode);
  }

  @Get('national')
  @ApiOperation({
    summary: 'National top players for a mode',
    description: 'Excludes placeholder cities (TBD). Tie-break is stable by Prisma ordering only — add explicit tie rules later.',
  })
  @ApiOkResponse({ type: LeaderboardRowDto, isArray: true })
  national(@Query() query: NationalLeaderboardQueryDto): Promise<LeaderboardRowDto[]> {
    return this.leaderboardsService.national(query.mode);
  }
}

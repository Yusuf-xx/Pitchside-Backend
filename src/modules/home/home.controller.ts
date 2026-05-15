import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { HomeDashboardQueryDto } from './dto/home-dashboard-query.dto';
import { HomeDashboardDto } from './dto/home-dashboard.dto';
import { HomeService } from './home.service';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('dashboard')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Home dashboard — games, need-players alerts, next match, tournaments, feed, turf teasers',
    description:
      'Guests must pass ?city=. Signed-in users use profile city (cannot be TBD). Optional ?gameMode= overrides filter for this response only.',
  })
  @ApiOkResponse({ type: HomeDashboardDto })
  dashboard(
    @Query() query: HomeDashboardQueryDto,
    @Req() req: RequestWithOptionalUser,
  ): Promise<HomeDashboardDto> {
    return this.homeService.getDashboard({
      userId: req.user?.userId,
      city: query.city,
      gameMode: query.gameMode,
    });
  }
}

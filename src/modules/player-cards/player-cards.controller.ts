import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GameMode } from '../../common/enums/game-mode.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlayerCardDto } from './dto/player-card.dto';
import { PlayerCardsService } from './player-cards.service';

@ApiTags('Player Cards')
@Controller('player-cards')
export class PlayerCardsController {
  constructor(private readonly playerCardsService: PlayerCardsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Current user card; ?mode= switches football / futsal / cricket view' })
  @ApiQuery({ name: 'mode', required: false, enum: GameMode })
  @ApiOkResponse({ type: PlayerCardDto })
  getMine(
    @CurrentUser() user: { userId: string },
    @Query('mode') mode?: GameMode,
  ): Promise<PlayerCardDto> {
    return this.playerCardsService.getMine(user.userId, mode);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Public player card' })
  @ApiQuery({ name: 'mode', required: false, enum: GameMode })
  @ApiOkResponse({ type: PlayerCardDto })
  getByUser(@Param('userId') userId: string, @Query('mode') mode?: GameMode): Promise<PlayerCardDto> {
    return this.playerCardsService.getPublic(userId, mode);
  }
}

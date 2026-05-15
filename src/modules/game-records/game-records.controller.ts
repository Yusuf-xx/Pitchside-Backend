import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameRecordResponseDto } from './dto/game-record-response.dto';
import { SubmitRatingsDto } from './dto/submit-ratings.dto';
import { GameRecordsService } from './game-records.service';

@ApiTags('Game Records')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('game-records')
export class GameRecordsController {
  constructor(private readonly gameRecordsService: GameRecordsService) {}

  @Get(':gameId')
  @ApiOperation({
    summary: 'Post-match record for a game',
    description:
      'Participants only. Includes roster, your submitted rows, anonymised averages per teammate, and how others rated you (aggregated). Ratings are accepted after the scheduled kickoff time.',
  })
  @ApiOkResponse({ type: GameRecordResponseDto })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiForbiddenResponse({ description: 'Not a participant' })
  getByGame(
    @Param('gameId') gameId: string,
    @CurrentUser() user: { userId: string },
  ): Promise<GameRecordResponseDto> {
    return this.gameRecordsService.getByGame(gameId, user.userId);
  }

  @Post(':gameId/ratings')
  @ApiOperation({
    summary: 'Submit or update teammate ratings',
    description:
      'Upserts one row per teammate. Only participants; cannot rate yourself. Opens after game kickoff (startsAt).',
  })
  @ApiCreatedResponse({ type: GameRecordResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  submitRatings(
    @Param('gameId') gameId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: SubmitRatingsDto,
  ): Promise<GameRecordResponseDto> {
    return this.gameRecordsService.submitRatings(gameId, user.userId, dto.ratings);
  }
}

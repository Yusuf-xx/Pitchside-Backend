import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';
import { GameRecordPhase } from '../../../common/enums/game-record-phase.enum';
import { GameRecordMyRatingDto } from './game-record-my-rating.dto';
import { GameRecordParticipantDto } from './game-record-participant.dto';
import { GameRecordPeerSummaryDto } from './game-record-peer-summary.dto';
import { GameRecordReceivedSummaryDto } from './game-record-received-summary.dto';

export class GameRecordResponseDto {
  @ApiProperty()
  gameId!: string;

  @ApiProperty({ enum: GameMode })
  gameMode!: GameMode;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  venueName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  startsAt!: string;

  @ApiProperty({ enum: GameRecordPhase })
  phase!: GameRecordPhase;

  @ApiProperty({ type: [GameRecordParticipantDto] })
  participants!: GameRecordParticipantDto[];

  @ApiProperty({ type: [GameRecordMyRatingDto] })
  myRatings!: GameRecordMyRatingDto[];

  @ApiProperty({ type: [GameRecordPeerSummaryDto] })
  peerSummaries!: GameRecordPeerSummaryDto[];

  @ApiPropertyOptional({
    type: GameRecordReceivedSummaryDto,
    nullable: true,
    description: 'How teammates rated you (aggregated)',
  })
  receivedSummary!: GameRecordReceivedSummaryDto | null;
}

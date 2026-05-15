import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class GameParticipantSummaryDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ description: 'PENDING | ATTENDED | NO_SHOW | CANCELLED' })
  attendanceStatus!: string;

  @ApiPropertyOptional({ description: 'A | B when teams assigned' })
  teamSide?: string | null;

  @ApiPropertyOptional({ description: 'Position for this game mode (identity)' })
  position?: string;

  @ApiPropertyOptional({ description: 'OVR for this game mode' })
  ovr?: number;

  @ApiPropertyOptional()
  photoUrl?: string;
}

export class GameSummaryDto {
  @ApiPropertyOptional({ description: 'Host user id (for attendance checklist filtering)' })
  hostUserId?: string | null;

  @ApiProperty()
  id!: string;

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

  @ApiProperty()
  spotsLeft!: number;

  @ApiProperty({ description: 'Joined players including host' })
  spotsFilled!: number;

  @ApiProperty()
  spotsTotal!: number;

  @ApiProperty()
  skillLevel!: string;

  @ApiProperty()
  priceInrPerPlayer!: number;

  @ApiProperty({ description: 'OPEN | CONFIRMED | CANCELLED | COMPLETED' })
  lifecycleState!: string;

  @ApiProperty({ description: 'Players needed to auto-confirm' })
  minPlayersToConfirm!: number;

  @ApiPropertyOptional({ description: 'Auto-cancel unfilled OPEN games after this instant (ISO)' })
  confirmDeadlineAt?: string;

  @ApiProperty({ description: 'OPEN | WOMEN_ONLY | MIXED' })
  genderFormat!: string;

  @ApiPropertyOptional({ description: 'For MIXED games — women per side rule' })
  mixedMinWomenOnField?: number;

  @ApiPropertyOptional({ description: 'Football venue sub-format tag' })
  footballVenueSubFormat?: string;

  @ApiPropertyOptional()
  formatLabel?: string;

  @ApiPropertyOptional({ description: 'True when host has hosted 5+ confirmed games' })
  hostVerified?: boolean;

  @ApiPropertyOptional({ description: 'Balanced A/B when visible to viewer' })
  balancedTeams?: { A: string[]; B: string[] };

  @ApiPropertyOptional({ description: 'Host-only: QR token for self check-in' })
  attendanceQrToken?: string;

  @ApiPropertyOptional({ description: 'True when host marked urgent / last spots' })
  urgentNeedPlayers?: boolean;

  @ApiPropertyOptional({ description: 'A | B | DRAW after completion' })
  winnerSide?: string;

  @ApiPropertyOptional({ description: 'When the host marked the game completed' })
  completedAt?: string;

  @ApiPropertyOptional({ description: 'Beach football safety note' })
  beachRulesNote?: string;

  @ApiPropertyOptional({ description: 'Mixed format rules (expandable in UI)' })
  mixedFormatRulesSummary?: string;

  @ApiPropertyOptional({ type: [GameParticipantSummaryDto], description: 'Host + joined players' })
  participants?: GameParticipantSummaryDto[];

  @ApiPropertyOptional({ description: 'Viewer attendance row when participant' })
  myAttendanceStatus?: string;

  @ApiPropertyOptional({ description: 'Present on detail when the requester is the host' })
  isHost?: boolean;

  @ApiPropertyOptional({ description: 'Present on detail when the requester is a participant' })
  isParticipant?: boolean;
}

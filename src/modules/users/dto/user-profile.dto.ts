import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class RivalBriefDto {
  @ApiProperty()
  opponentUserId!: string;

  @ApiProperty()
  opponentDisplayName!: string;

  @ApiProperty({ description: 'Wins for you' })
  myWins!: number;

  @ApiProperty()
  myLosses!: number;

  @ApiProperty()
  draws!: number;

  @ApiPropertyOptional()
  lastPlayedAt?: string;
}

export class FeedbackTagCountDto {
  @ApiProperty()
  tagKey!: string;

  @ApiProperty()
  count!: number;
}

export class UserProfileDto {
  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ enum: GameMode, isArray: true })
  activeModes!: GameMode[];

  @ApiProperty({ enum: GameMode })
  primaryMode!: GameMode;

  @ApiProperty()
  onboardingStep!: number;

  @ApiProperty()
  onboardingCompleted!: boolean;

  @ApiPropertyOptional()
  photoUrl?: string;

  @ApiPropertyOptional()
  dateOfBirth?: string;

  @ApiProperty()
  ageGroup!: string;

  @ApiPropertyOptional({ description: 'Only on /users/me when set' })
  gender?: string;

  @ApiPropertyOptional({ description: 'Only on /users/me' })
  showWomenOnlyGames?: boolean;

  @ApiPropertyOptional({ description: '0–100, games attended ÷ games confirmed' })
  reliabilityPct?: number;

  @ApiPropertyOptional({ description: 'Yellow caution when 2+ no-shows in 30d' })
  profileAttendanceWarning?: boolean;

  @ApiPropertyOptional({ description: 'Host 5+ confirmed games' })
  verifiedHost?: boolean;

  @ApiPropertyOptional({ type: [FeedbackTagCountDto] })
  topPositiveTags?: FeedbackTagCountDto[];

  @ApiPropertyOptional({ type: [RivalBriefDto], description: 'Up to 3 auto rivalries' })
  topRivals?: RivalBriefDto[];

  @ApiPropertyOptional({ type: [FeedbackTagCountDto], description: 'Only on /users/me — private negative tag counts' })
  privateNegativeTags?: FeedbackTagCountDto[];

  @ApiPropertyOptional({ description: 'Only on /users/me — ISO instant when join restriction lifts' })
  joinRestrictedUntil?: string;

  @ApiPropertyOptional({ description: 'Only on /users/me — true when a phone is saved for friend lookup' })
  phoneOnFile?: boolean;
}

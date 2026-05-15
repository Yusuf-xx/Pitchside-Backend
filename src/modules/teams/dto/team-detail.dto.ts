import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamSummaryDto } from './team-summary.dto';

export class TeamRosterMemberDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ description: 'CAPTAIN | MEMBER' })
  role!: string;

  @ApiPropertyOptional({ description: 'Player card OVR for the team game mode, if available' })
  ovr?: number;
}

export class TeamDetailDto extends TeamSummaryDto {
  @ApiProperty({ type: [TeamRosterMemberDto] })
  members!: TeamRosterMemberDto[];

  @ApiProperty({ description: 'True when the bearer is the squad captain' })
  isCaptain!: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SquadGameTeaserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  venueName!: string;

  @ApiProperty()
  startsAt!: string;

  @ApiProperty()
  lifecycleState!: string;
}

export class SquadStatsDto {
  @ApiProperty({ description: 'Completed games with 2+ squad members together' })
  gamesTogether!: number;

  @ApiPropertyOptional({ description: 'Approximate squad win rate when enough data' })
  winRatePctApprox?: number;

  @ApiPropertyOptional()
  mostActiveMemberUserId?: string;

  @ApiPropertyOptional()
  mostActiveMemberDisplayName?: string;

  @ApiPropertyOptional({ description: 'Avatar of most active member when available' })
  mostActiveMemberPhotoUrl?: string;

  @ApiProperty()
  mostActiveMemberGames!: number;
}

export class SquadMemberDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiPropertyOptional()
  invitedPhone?: string;
}

export class SquadSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  captainUserId!: string;

  @ApiProperty()
  memberCount!: number;

  @ApiProperty({ type: [SquadMemberDto] })
  members!: SquadMemberDto[];

  @ApiPropertyOptional({ type: [SquadGameTeaserDto] })
  upcomingGames?: SquadGameTeaserDto[];

  @ApiPropertyOptional({ type: [SquadGameTeaserDto] })
  pastGamesTogether?: SquadGameTeaserDto[];

  @ApiPropertyOptional({ type: SquadStatsDto })
  stats?: SquadStatsDto;
}

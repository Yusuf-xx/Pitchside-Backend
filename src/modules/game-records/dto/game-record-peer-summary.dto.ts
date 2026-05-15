import { ApiProperty } from '@nestjs/swagger';

export class GameRecordPeerSummaryDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  avgSkill!: number | null;

  @ApiProperty({ nullable: true })
  avgEffort!: number | null;

  @ApiProperty({ nullable: true })
  avgAttitude!: number | null;

  @ApiProperty({ nullable: true })
  avgCommunication!: number | null;

  @ApiProperty({ description: 'Ratings received in this game (no-shows excluded from averages)' })
  ratingCount!: number;

  @ApiProperty({ description: 'Whether the current viewer already submitted a row for this teammate' })
  ratedByMe!: boolean;
}

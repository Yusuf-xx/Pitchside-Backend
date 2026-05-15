import { ApiProperty } from '@nestjs/swagger';

export class GameRecordReceivedSummaryDto {
  @ApiProperty({ nullable: true, description: 'Average skill (1–5), excluding no-shows' })
  avgSkill!: number | null;

  @ApiProperty({ nullable: true })
  avgEffort!: number | null;

  @ApiProperty({ nullable: true })
  avgAttitude!: number | null;

  @ApiProperty({ nullable: true })
  avgCommunication!: number | null;

  @ApiProperty({ description: 'Number of teammate ratings received (no-show excluded from averages)' })
  ratingCount!: number;
}

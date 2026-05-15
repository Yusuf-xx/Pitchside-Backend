import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TournamentSummaryDto } from './tournament-summary.dto';

export class MyTournamentRegistrationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tournamentId!: string;

  @ApiPropertyOptional()
  teamName?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ type: TournamentSummaryDto })
  tournament!: TournamentSummaryDto;
}

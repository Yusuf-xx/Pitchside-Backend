import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTournamentRegistrationDto {
  @ApiPropertyOptional({ description: 'Optional squad / team display name' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  teamName?: string;
}

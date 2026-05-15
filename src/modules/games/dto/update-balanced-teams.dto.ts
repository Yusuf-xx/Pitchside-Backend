import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class UpdateBalancedTeamsDto {
  @ApiProperty({ type: [String], description: 'User ids on team A' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  teamA!: string[];

  @ApiProperty({ type: [String], description: 'User ids on team B' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  teamB!: string[];
}

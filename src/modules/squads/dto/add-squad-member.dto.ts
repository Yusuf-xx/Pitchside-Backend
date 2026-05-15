import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AddSquadMemberDto {
  @ApiPropertyOptional({ description: 'Player id from search (profile link)' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  userId?: string;

  @ApiPropertyOptional({
    description:
      'Registered E.164 phone on file for that player, if you do not have their user id. Same format as profile contact phone.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^\+[1-9]\d{6,14}$/)
  invitedPhone?: string;
}

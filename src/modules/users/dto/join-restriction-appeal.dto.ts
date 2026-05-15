import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinRestrictionAppealDto {
  @ApiProperty({ description: 'Why your attendance should be reviewed' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;
}

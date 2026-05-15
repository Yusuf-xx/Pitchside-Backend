import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class FeedbackTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  toUserId!: string;

  @ApiProperty({ example: 'TEAM_PLAYER' })
  @IsString()
  @MaxLength(64)
  tagKey!: string;

  @ApiProperty()
  @IsBoolean()
  isPositive!: boolean;
}

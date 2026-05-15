import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedEventDto {
  @ApiProperty({ example: 'ANNOUNCEMENT', description: 'Free-form type label for clients / analytics' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  type!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;

  @ApiPropertyOptional({ description: 'Optional filter — omit or empty for all cities on home feed' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ description: 'Optional filter — FOOTBALL | FUTSAL | CRICKET or omit for all modes' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  gameMode?: string;
}

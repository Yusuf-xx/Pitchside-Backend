import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const DECISIONS = ['APPROVE', 'REJECT'] as const;

export class ResolveAppealDto {
  @ApiProperty({ enum: DECISIONS })
  @IsString()
  @IsIn([...DECISIONS])
  decision!: (typeof DECISIONS)[number];

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  moderatorNote?: string;
}

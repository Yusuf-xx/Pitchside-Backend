import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

const STATUSES = ['OPEN', 'APPROVED', 'REJECTED', 'ALL'] as const;

export class ListAppealsQueryDto {
  @ApiPropertyOptional({ enum: STATUSES, description: 'Default OPEN' })
  @IsOptional()
  @IsString()
  @IsIn([...STATUSES])
  status?: (typeof STATUSES)[number];
}

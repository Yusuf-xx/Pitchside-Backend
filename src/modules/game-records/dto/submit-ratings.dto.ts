import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { RateTeammateDto } from './rate-teammate.dto';

export class SubmitRatingsDto {
  @ApiProperty({ type: [RateTeammateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateTeammateDto)
  ratings!: RateTeammateDto[];
}

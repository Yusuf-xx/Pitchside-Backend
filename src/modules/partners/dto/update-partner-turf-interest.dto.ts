import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PARTNER_INTEREST_STATUSES } from '../../../common/constants/partner-interest.constants';

const STATUS_VALUES = [...PARTNER_INTEREST_STATUSES];

export class UpdatePartnerTurfInterestDto {
  @ApiPropertyOptional({ enum: STATUS_VALUES })
  @IsOptional()
  @IsString()
  @IsIn(STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({
    description: 'Pitchside user id to assign (must exist). Null clears assignment.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  assignedToUserId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string | null;
}

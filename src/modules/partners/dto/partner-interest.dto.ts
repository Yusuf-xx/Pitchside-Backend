import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PARTNER_INTEREST_SOURCE_LIST } from '../../../common/constants/partner-interest.constants';

export class PartnerInterestDto {
  @ApiProperty()
  @IsString()
  turfName!: string;

  @ApiProperty({ example: 'Hyderabad' })
  @IsString()
  city!: string;

  @ApiProperty({ example: '+919800000000' })
  @IsString()
  @Matches(/^[+0-9][0-9\s-]{8,18}$/)
  contactNumber!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Optional message from the venue owner', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({
    enum: ['WEB_FORM', 'BOOK_PAGE', 'TURF_DETAIL', 'REFERRAL', 'OTHER'],
    description: 'Attribution for analytics; omit for WEB_FORM',
  })
  @IsOptional()
  @IsIn(PARTNER_INTEREST_SOURCE_LIST)
  source?: string;
}

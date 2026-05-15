import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

const GENDERS = ['MAN', 'WOMAN', 'NON_BINARY', 'UNSPECIFIED'] as const;

export class UpdateProfilePrivacyDto {
  @ApiPropertyOptional({ enum: GENDERS, description: 'Used for women-only / mixed game rules' })
  @IsOptional()
  @IsIn([...GENDERS])
  gender?: (typeof GENDERS)[number];

  @ApiPropertyOptional({ description: 'When true, home/find games prefer women-only listings' })
  @IsOptional()
  @IsBoolean()
  showWomenOnlyGames?: boolean;
}

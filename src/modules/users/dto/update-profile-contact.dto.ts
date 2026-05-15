import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';

export class UpdateProfileContactDto {
  @ApiPropertyOptional({
    description: 'E.164 phone (e.g. +919876543210) for squad/friend lookup. Empty string clears.',
    example: '+919876543210',
  })
  @IsOptional()
  @ValidateIf((o) => o.phoneE164 != null && String(o.phoneE164).trim() !== '')
  @IsString()
  @MaxLength(20)
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'phoneE164 must be in E.164 format starting with +' })
  phoneE164?: string | null;
}

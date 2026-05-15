import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode } from '../../../common/enums/game-mode.enum';

export class OnboardingSavedIdentityDto {
  @ApiProperty({ enum: GameMode })
  mode!: GameMode;

  @ApiProperty()
  position!: string;

  @ApiPropertyOptional()
  preferredFoot?: string;

  @ApiProperty()
  skillLevel!: string;
}

export class OnboardingStatusDto {
  @ApiProperty()
  onboardingStep!: number;

  @ApiProperty()
  onboardingCompleted!: boolean;

  @ApiPropertyOptional({ enum: GameMode, isArray: true })
  activeModes?: GameMode[];

  @ApiPropertyOptional({ enum: GameMode })
  primaryMode?: GameMode;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional({
    type: [OnboardingSavedIdentityDto],
    description: 'Saved game identities when step ≥ 2 — used to restore the form when going back.',
  })
  savedGameIdentities?: OnboardingSavedIdentityDto[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Saved format picks when step ≥ 3 — used to restore step 2 when going back.',
  })
  savedFormats?: string[];
}

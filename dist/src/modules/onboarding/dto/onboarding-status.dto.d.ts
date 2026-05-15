import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class OnboardingSavedIdentityDto {
    mode: GameMode;
    position: string;
    preferredFoot?: string;
    skillLevel: string;
}
export declare class OnboardingStatusDto {
    onboardingStep: number;
    onboardingCompleted: boolean;
    activeModes?: GameMode[];
    primaryMode?: GameMode;
    displayName?: string;
    city?: string;
    savedGameIdentities?: OnboardingSavedIdentityDto[];
    savedFormats?: string[];
}

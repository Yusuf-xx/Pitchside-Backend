import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class OnboardingPersonalDto {
    displayName: string;
    photoUrl?: string;
    city: string;
    dateOfBirth: string;
    ageGroup: string;
    activeModes: GameMode[];
    primaryMode: GameMode;
    gender?: 'MAN' | 'WOMAN' | 'NON_BINARY' | 'UNSPECIFIED';
}

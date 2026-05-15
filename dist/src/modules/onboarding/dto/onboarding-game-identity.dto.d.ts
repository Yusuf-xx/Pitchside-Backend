import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class ModeIdentityItemDto {
    mode: GameMode;
    position: string;
    preferredFoot?: string;
    skillLevel: string;
}
export declare class OnboardingGameIdentityDto {
    identities: ModeIdentityItemDto[];
}

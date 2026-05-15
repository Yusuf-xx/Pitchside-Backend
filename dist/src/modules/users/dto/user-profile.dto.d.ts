import { GameMode } from '../../../common/enums/game-mode.enum';
export declare class RivalBriefDto {
    opponentUserId: string;
    opponentDisplayName: string;
    myWins: number;
    myLosses: number;
    draws: number;
    lastPlayedAt?: string;
}
export declare class FeedbackTagCountDto {
    tagKey: string;
    count: number;
}
export declare class UserProfileDto {
    userId: string;
    email?: string;
    displayName: string;
    city: string;
    activeModes: GameMode[];
    primaryMode: GameMode;
    onboardingStep: number;
    onboardingCompleted: boolean;
    photoUrl?: string;
    dateOfBirth?: string;
    ageGroup: string;
    gender?: string;
    showWomenOnlyGames?: boolean;
    reliabilityPct?: number;
    profileAttendanceWarning?: boolean;
    verifiedHost?: boolean;
    topPositiveTags?: FeedbackTagCountDto[];
    topRivals?: RivalBriefDto[];
    privateNegativeTags?: FeedbackTagCountDto[];
    joinRestrictedUntil?: string;
    phoneOnFile?: boolean;
}

export declare class SquadGameTeaserDto {
    id: string;
    title: string;
    city: string;
    venueName: string;
    startsAt: string;
    lifecycleState: string;
}
export declare class SquadStatsDto {
    gamesTogether: number;
    winRatePctApprox?: number;
    mostActiveMemberUserId?: string;
    mostActiveMemberDisplayName?: string;
    mostActiveMemberPhotoUrl?: string;
    mostActiveMemberGames: number;
}
export declare class SquadMemberDto {
    userId: string;
    displayName: string;
    invitedPhone?: string;
}
export declare class SquadSummaryDto {
    id: string;
    name: string;
    city: string;
    captainUserId: string;
    memberCount: number;
    members: SquadMemberDto[];
    upcomingGames?: SquadGameTeaserDto[];
    pastGamesTogether?: SquadGameTeaserDto[];
    stats?: SquadStatsDto;
}

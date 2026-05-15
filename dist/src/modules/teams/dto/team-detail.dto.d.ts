import { TeamSummaryDto } from './team-summary.dto';
export declare class TeamRosterMemberDto {
    userId: string;
    displayName: string;
    role: string;
    ovr?: number;
}
export declare class TeamDetailDto extends TeamSummaryDto {
    members: TeamRosterMemberDto[];
    isCaptain: boolean;
}

import type { PlayerCard, Profile } from '@prisma/client';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';
type CardHolder = {
    profile: (Profile & {
        playerCards: PlayerCard[];
    }) | null;
};
export declare function ovrForGameMode(holder: CardHolder | null | undefined, gameMode: string): number | undefined;
export declare function averageSquadOvr(gameMode: string, roster: {
    user: CardHolder;
}[]): number;
export declare function mapTeamToSummary(team: {
    id: string;
    name: string;
    city: string;
    gameMode: string;
    kitColorHex: string | null;
    wins: number;
    losses: number;
    draws: number;
    captainUserId: string;
}, memberCount: number, teamOvr: number): TeamSummaryDto;
export declare function mapTeamToDetail(team: {
    id: string;
    name: string;
    city: string;
    gameMode: string;
    kitColorHex: string | null;
    wins: number;
    losses: number;
    draws: number;
    captainUserId: string;
    members: {
        userId: string;
        role: string;
        user: CardHolder & {
            id: string;
        };
    }[];
}): TeamDetailDto;
export declare function withCaptainFlag(detail: TeamDetailDto, requestUserId: string | undefined): TeamDetailDto;
export {};

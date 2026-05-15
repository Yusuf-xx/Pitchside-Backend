import { TournamentSummaryDto } from './tournament-summary.dto';
export declare class MyTournamentRegistrationDto {
    id: string;
    tournamentId: string;
    teamName?: string;
    createdAt: string;
    tournament: TournamentSummaryDto;
}

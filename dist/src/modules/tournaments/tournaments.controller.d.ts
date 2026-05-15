import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { CreateTournamentRegistrationDto } from './dto/create-tournament-registration.dto';
import { MyTournamentRegistrationDto } from './dto/my-tournament-registration.dto';
import { TournamentStandingsDto } from './dto/tournament-standings.dto';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';
import { TournamentsService } from './tournaments.service';
export declare class TournamentsController {
    private readonly tournamentsService;
    constructor(tournamentsService: TournamentsService);
    list(query: ModeCityQueryDto): Promise<TournamentSummaryDto[]>;
    myRegistrations(user: {
        userId: string;
    }): Promise<MyTournamentRegistrationDto[]>;
    standings(id: string): Promise<TournamentStandingsDto>;
    register(id: string, user: {
        userId: string;
    }, dto: CreateTournamentRegistrationDto): Promise<TournamentSummaryDto>;
    getById(id: string): Promise<TournamentSummaryDto>;
}
